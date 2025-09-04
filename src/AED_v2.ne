# Gramática para Pseudocódigo en Español - Algoritmos y Estructuras de Datos
# Basada en la documentación de la UTN-FRM

@{%
// Funciones auxiliares para construir el AST
const buildProgram = (name, declarations, statements) => ({
    type: 'PROGRAM',
    name: name,
    declarations: declarations || [],
    statements: statements || []
});

const buildDeclaration = (type, vars, dataType) => ({
    type: type,
    variables: vars,
    dataType: dataType
});

const buildStatement = (type, ...args) => ({
    type: type,
    ...args.reduce((acc, arg, i) => ({ ...acc, [`arg${i}`]: arg }), {})
});
%}

# Lexer básico
@lexer lexer

# Inicio de la gramática - Un programa completo
programa -> "PROGRAMA" _ identificador _ 
           declaraciones:? _
           "INICIO" _ 
           sentencias:? _
           "FINPROGRAMA" {%
    ([,, nombre,, declaraciones,,,, sentencias]) => 
        buildProgram(nombre, declaraciones, sentencias)
%}

# Declaraciones (variables, constantes, tipos)
declaraciones -> declaracion _ declaraciones:? {%
    ([decl,, resto]) => resto ? [decl, ...resto] : [decl]
%}

# Tipos de declaraciones
declaracion -> declaracion_variable
             | declaracion_constante  
             | declaracion_tipo
             | declaracion_subprograma

# Declaración de variables: VAR variable[dimensiones]: TIPO o VAR lista_variables: TIPO
declaracion_variable -> "VAR" _ variable_con_dimensiones _ ":" _ tipo_dato {%
    ([,, variable,,,, tipo]) => buildDeclaration('VAR', [variable], tipo)
%}
| "VAR" _ lista_variables _ ":" _ tipo_dato {%
    ([,, variables,,,, tipo]) => buildDeclaration('VAR', variables, tipo)
%}

# Declaración de constantes: CONST nombre = valor
declaracion_constante -> "CONST" _ identificador _ "=" _ expresion {%
    ([,, nombre,,,, valor]) => buildDeclaration('CONST', [nombre], valor)
%}

# Variable con dimensiones para arreglos: nombre[dim1] o nombre[dim1,dim2] o nombre[dim1,dim2,dim3]
variable_con_dimensiones -> identificador _ "[" _ lista_dimensiones _ "]" {%
    ([nombre,,,, dimensiones]) => ({ type: 'VAR_ARRAY', name: nombre, dimensions: dimensiones })
%}

# Lista de dimensiones separadas por comas
lista_dimensiones -> expresion _ "," _ lista_dimensiones {%
    ([dim,,,, resto]) => [dim, ...resto]
%} | expresion {% ([dim]) => [dim] %}

# Lista de variables separadas por comas (solo para variables simples)
lista_variables -> identificador _ "," _ lista_variables {%
    ([id,,,, resto]) => [id, ...resto]
%} | identificador {% ([id]) => [id] %}

# Tipos de datos básicos y estructurados
tipo_dato -> tipo_basico
           | tipo_registro
           | tipo_enumerado
           | tipo_subrango
           | identificador  # Tipo definido por usuario

# Tipos básicos: ENTERO, REAL, CARACTER, CADENA, LOGICO
tipo_basico -> "ENTERO" {% () => 'ENTERO' %}
             | "REAL" {% () => 'REAL' %}
             | "CARACTER" {% () => 'CARACTER' %}
             | "CADENA" {% () => 'CADENA' %}
             | "LOGICO" {% () => 'LOGICO' %}

# Tipo enumerado: (valor1, valor2, ...)
tipo_enumerado -> "(" _ lista_identificadores _ ")" {%
    ([,, valores]) => ({ type: 'ENUMERADO', values: valores })
%}

# Tipo subrango: min..max
tipo_subrango -> expresion _ ".." _ expresion {%
    ([min,,,, max]) => ({ type: 'SUBRANGO', min: min, max: max })
%}

# Declaración de tipos: TIPO nombre = definición
declaracion_tipo -> "TIPO" _ identificador _ "=" _ definicion_tipo {%
    ([,, nombre,,,, definicion]) => 
        buildDeclaration('TIPO', [nombre], definicion)
%}

definicion_tipo -> tipo_dato | tipo_registro

# Tipo registro: REGISTRO campos FINREGISTRO
tipo_registro -> "REGISTRO" _ campos_registro:? _ "FINREGISTRO" {%
    ([,, campos]) => ({ type: 'REGISTRO', fields: campos || [] })
%}

campos_registro -> campo_registro _ campos_registro:? {%
    ([campo,, resto]) => resto ? [campo, ...resto] : [campo]
%}

campo_registro -> identificador _ ":" _ tipo_dato {%
    ([nombre,,,, tipo]) => ({ name: nombre, type: tipo })
%}

# Lista de identificadores separados por comas
lista_identificadores -> identificador _ "," _ lista_identificadores {%
    ([id,,,, resto]) => [id, ...resto]
%} | identificador {% ([id]) => [id] %}

# Sentencias del programa
sentencias -> sentencia _ sentencias:? {%
    ([stmt,, resto]) => resto ? [stmt, ...resto] : [stmt]
%}

# Tipos de sentencias
sentencia -> sentencia_asignacion
           | sentencia_entrada
           | sentencia_salida
           | sentencia_si
           | sentencia_segun
           | sentencia_mientras
           | sentencia_repetir
           | sentencia_variar
           | llamada_procedimiento

# Sentencia de asignación: variable = expresión
sentencia_asignacion -> variable _ "=" _ expresion {%
    ([variable,,,, expr]) => buildStatement('ASIGNACION', variable, expr)
%}

# Sentencia de entrada: Leer(variables)
sentencia_entrada -> "Leer" _ "(" _ lista_variables _ ")" {%
    ([,,,, variables]) => buildStatement('LEER', variables)
%}

# Sentencia de salida: Escribir(expresiones)
sentencia_salida -> "Escribir" _ "(" _ lista_expresiones _ ")" {%
    ([,,,, expresiones]) => buildStatement('ESCRIBIR', expresiones)
%}

# Sentencia condicional: SI condición ENTONCES sentencias [SINO sentencias] FINSI
sentencia_si -> "SI" _ expresion _ "ENTONCES" _ sentencias _ bloque_sino:? _ "FINSI" {%
    ([,, condicion,,,, entonces,, sino]) => 
        buildStatement('SI', condicion, entonces, sino)
%}

bloque_sino -> "SINO" _ sentencias {% ([,, sentencias]) => sentencias %}

# Sentencia según caso: SEGÚN CASO expresión HACER casos [DE OTRO MODO sentencias] FINSEGUN
sentencia_segun -> "SEGÚN" _ "CASO" _ expresion _ "HACER" _ casos _ defecto:? _ "FINSEGUN" {%
    ([,,,, expr,,,, casos,, defecto]) => 
        buildStatement('SEGUN', expr, casos, defecto)
%}

casos -> caso _ casos:? {%
    ([caso,, resto]) => resto ? [caso, ...resto] : [caso]
%}

caso -> lista_constantes _ ":" _ sentencias {%
    ([constantes,,,, sentencias]) => ({ values: constantes, statements: sentencias })
%}

defecto -> "DE" _ "OTRO" _ "MODO" _ sentencias {% ([,,,,,, sentencias]) => sentencias %}

# Bucle mientras: MIENTRAS condición HACER sentencias FINMIENTRAS
sentencia_mientras -> "MIENTRAS" _ expresion _ "HACER" _ sentencias _ "FINMIENTRAS" {%
    ([,, condicion,,,, sentencias]) => buildStatement('MIENTRAS', condicion, sentencias)
%}

# Bucle repetir: REPETIR sentencias HASTA condición
sentencia_repetir -> "REPETIR" _ sentencias _ "HASTA" _ expresion {%
    ([,, sentencias,,,, condicion]) => buildStatement('REPETIR', sentencias, condicion)
%}

# Bucle variar: VARIAR contador DE inicio HASTA fin [SALTO incremento] sentencias FINVARIAR
sentencia_variar -> "VARIAR" _ identificador _ "DE" _ expresion _ "HASTA" _ expresion _ salto:? _ sentencias _ "FINVARIAR" {%
    ([,, contador,,,, inicio,,,, fin,, incremento,, sentencias]) => 
        buildStatement('VARIAR', contador, inicio, fin, incremento || 1, sentencias)
%}

salto -> "SALTO" _ expresion {% ([,, expr]) => expr %}

# Llamada a procedimiento: nombre(parámetros)
llamada_procedimiento -> identificador _ "(" _ lista_expresiones:? _ ")" {%
    ([nombre,,,, parametros]) => 
        buildStatement('LLAMADA_PROC', nombre, parametros || [])
%}

# Declaración de subprogramas
declaracion_subprograma -> declaracion_procedimiento | declaracion_funcion

# Procedimiento: PROCEDIMIENTO nombre(parámetros); INICIO sentencias FINPROCEDIMIENTO
declaracion_procedimiento -> "PROCEDIMIENTO" _ identificador _ "(" _ lista_parametros:? _ ")" _ ";" _ 
                           "INICIO" _ sentencias:? _ "FINPROCEDIMIENTO" {%
    ([,, nombre,,,, parametros,,,,,,,, sentencias]) => 
        buildStatement('PROCEDIMIENTO', nombre, parametros || [], sentencias || [])
%}

# Función: FUNCION nombre(parámetros): tipo; INICIO sentencias RETORNO FINPROCEDIMIENTO
declaracion_funcion -> "FUNCION" _ identificador _ "(" _ lista_parametros:? _ ")" _ ":" _ tipo_dato _ ";" _
                     "INICIO" _ sentencias:? _ "RETORNO" _ "FINPROCEDIMIENTO" {%
    ([,, nombre,,,, parametros,,,,,, tipo,,,,,, sentencias]) => 
        buildStatement('FUNCION', nombre, parametros || [], tipo, sentencias || [])
%}

# Lista de parámetros
lista_parametros -> parametro _ "," _ lista_parametros {%
    ([param,,,, resto]) => [param, ...resto]
%} | parametro {% ([param]) => [param] %}

# Parámetro: [porRef] nombre : tipo
parametro -> modificador_referencia _ identificador _ ":" _ tipo_dato {%
    ([mod,, nombre,,,, tipo]) => ({ name: nombre, type: tipo, byRef: mod })
%}
| identificador _ ":" _ tipo_dato {%
    ([nombre,,,, tipo]) => ({ name: nombre, type: tipo, byRef: false })
%}

# Modificador de referencia: porRef o porRef.
modificador_referencia -> "porRef" {% () => true %}
                       | "porRef." {% () => true %}

# Variables (pueden ser indexadas o campos de registro)
variable -> identificador accesos:? {%
    ([id, accesos]) => accesos ? { type: 'VAR_ACCESO', name: id, accesses: accesos } : id
%}

accesos -> acceso accesos:? {%
    ([acceso, resto]) => resto ? [acceso, ...resto] : [acceso]
%}

# Acceso a arreglos multidimensionales: [expr] o [expr,expr] o [expr,expr,expr]
acceso -> "[" _ lista_expresiones _ "]" {% ([,, indices]) => { type: 'INDEX', indices: indices } %}
        | "." _ identificador {% ([,, id]) => { type: 'FIELD', name: id } %}

# Expresiones
expresion -> expresion_or

expresion_or -> expresion_or _ "O" _ expresion_and {%
    ([izq,,,, der]) => buildStatement('OP_BINARIA', 'O', izq, der)
%} | expresion_and

expresion_and -> expresion_and _ "Y" _ expresion_not {%
    ([izq,,,, der]) => buildStatement('OP_BINARIA', 'Y', izq, der)
%} | expresion_not

expresion_not -> "NO" _ expresion_relacional {%
    ([,, expr]) => buildStatement('OP_UNARIA', 'NO', expr)
%} | expresion_relacional

expresion_relacional -> expresion_aditiva _ operador_relacional _ expresion_aditiva {%
    ([izq,, op,, der]) => buildStatement('OP_BINARIA', op, izq, der)
%} | expresion_aditiva

operador_relacional -> "=" | ">" | ">=" | "<" | "<=" | "<>"

expresion_aditiva -> expresion_aditiva _ operador_aditivo _ expresion_multiplicativa {%
    ([izq,, op,, der]) => buildStatement('OP_BINARIA', op, izq, der)
%} | expresion_multiplicativa

operador_aditivo -> "+" | "-"

expresion_multiplicativa -> expresion_multiplicativa _ operador_multiplicativo _ expresion_exponencial {%
    ([izq,, op,, der]) => buildStatement('OP_BINARIA', op, izq, der)
%} | expresion_exponencial

operador_multiplicativo -> "*" | "/"

expresion_exponencial -> expresion_primaria _ "^" _ expresion_exponencial {%
    ([base,,,, exp]) => buildStatement('OP_BINARIA', '^', base, exp)
%} | expresion_primaria

# Expresiones primarias
expresion_primaria -> "(" _ expresion _ ")" {% ([,, expr]) => expr %}
                   | literal
                   | variable
                   | llamada_funcion

# Llamada a función: nombre(parámetros)
llamada_funcion -> identificador _ "(" _ lista_expresiones:? _ ")" {%
    ([nombre,,,, parametros]) => 
        buildStatement('LLAMADA_FUNC', nombre, parametros || [])
%}

# Lista de expresiones separadas por comas
lista_expresiones -> expresion _ "," _ lista_expresiones {%
    ([expr,,,, resto]) => [expr, ...resto]
%} | expresion {% ([expr]) => [expr] %}

# Lista de constantes para el SEGÚN CASO
lista_constantes -> literal _ "," _ lista_constantes {%
    ([const,,,, resto]) => [const, ...resto]
%} | literal {% ([const]) => [const] %}

# Literales
literal -> numero | cadena | caracter | booleano

numero -> %numero {% ([token]) => ({ type: 'NUMERO', value: parseFloat(token.value) }) %}
cadena -> %cadena {% ([token]) => ({ type: 'CADENA', value: token.value.slice(1, -1) }) %}
caracter -> %caracter {% ([token]) => ({ type: 'CARACTER', value: token.value.slice(1, -1) }) %}
booleano -> "[V]" {% () => ({ type: 'BOOLEANO', value: true }) %}
          | "[F]" {% () => ({ type: 'BOOLEANO', value: false }) %}

# Identificadores
identificador -> %identificador {% ([token]) => token.value %}

# Espacios en blanco y comentarios
_ -> %ws:? {% () => null %}

# Definición del lexer
@lexer lexer
@{%
const moo = require("moo");

const lexer = moo.compile({
    ws: /[ \t\n\r]+/,
    comentario: /\/\/.*$/,
    
    // Palabras reservadas
    PROGRAMA: 'PROGRAMA',
    INICIO: 'INICIO',
    FINPROGRAMA: 'FINPROGRAMA',
    VAR: 'VAR',
    CONST: 'CONST',
    TIPO: 'TIPO',
    ENTERO: 'ENTERO',
    REAL: 'REAL',
    CARACTER: 'CARACTER',
    CADENA: 'CADENA',
    LOGICO: 'LOGICO',
    DE: 'DE',
    REGISTRO: 'REGISTRO',
    FINREGISTRO: 'FINREGISTRO',
    PROCEDIMIENTO: 'PROCEDIMIENTO',
    FINPROCEDIMIENTO: 'FINPROCEDIMIENTO',
    FUNCION: 'FUNCION',
    RETORNO: 'RETORNO',
    SI: 'SI',
    ENTONCES: 'ENTONCES',
    SINO: 'SINO',
    FINSI: 'FINSI',
    SEGUN: 'SEGÚN',
    CASO: 'CASO',
    HACER: 'HACER',
    OTRO: 'OTRO',
    MODO: 'MODO',
    FINSEGUN: 'FINSEGUN',
    MIENTRAS: 'MIENTRAS',
    FINMIENTRAS: 'FINMIENTRAS',
    REPETIR: 'REPETIR',
    HASTA: 'HASTA',
    VARIAR: 'VARIAR',
    SALTO: 'SALTO',
    FINVARIAR: 'FINVARIAR',
    Leer: 'Leer',
    Escribir: 'Escribir',
    porRef: 'porRef',
    porRefPunto: 'porRef.',
    Y: 'Y',
    O: 'O',
    NO: 'NO',
    
    // Operadores
    asignacion: '=',
    igual: '=',
    mayor_igual: '>=',
    menor_igual: '<=',
    distinto: '<>',
    mayor: '>',
    menor: '<',
    exponenciacion: '^',
    suma: '+',
    resta: '-',
    multiplicacion: '*',
    division: '/',
    
    // Delimitadores
    puntoycoma: ';',
    dospuntos: ':',
    coma: ',',
    punto: '.',
    puntopunto: '..',
    parentesis_abre: '(',
    parentesis_cierra: ')',
    corchete_abre: '[',
    corchete_cierra: ']',
    
    // Literales
    cadena: /"(?:[^"\\]|\\.)*"/,
    caracter: /'(?:[^'\\]|\\.)?'/,
    booleano_v: '[V]',
    booleano_f: '[F]',
    numero: /\d+(?:\.\d+)?/,
    
    // Identificadores (deben ir al final)
    identificador: /[a-zA-Z_][a-zA-Z0-9_]*/
});
%}
