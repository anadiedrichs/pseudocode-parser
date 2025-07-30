# Gramática de Pseudocódigo para la cátedra de Algoritmos y Estructura de Datos
# Autor: Gemini
# Fecha: 29/07/2024
# Descripción: Esta gramática define la sintaxis del pseudocódigo utilizado en la cátedra,
# permitiendo el análisis de programas, subprogramas, declaraciones, expresiones y estructuras de control.

@{%
    // El post-procesador `d` se utiliza para descartar tokens innecesarios (puntuación, etc.)
    // y devolver solo los datos relevantes del árbol sintáctico.
    const d = (data, n) => data[n];

    // Se utiliza el lexer 'moo' para un análisis de tokens más robusto y explícito.
    // Es necesario tener 'moo' instalado en el proyecto (npm install moo).
    const moo = require("moo");

    const tokens = {
        ws: { match: /[ \t\n\r]+/, lineBreaks: true },
        comentario: /\/\/[^\n]*/,
        cadena: /"[^"]*"/,
        numero_real: /[0-9]+\.[0-9]+/,
        numero_entero: /[0-9]+/,
        op_logico_y: '[Y]',
        op_logico_o: '[O]',
        op_logico_no: '[NO]',
        booleano: /\[[VF]\]/,
        op_relacional: ["==", "<>", "<=", ">="],
        op_asignacion: '=',
        lparen: '(',
        rparen: ')',
        dos_puntos: ':',
        coma: ',',
        op_potencia: '^',
        op_multiplicacion: '*',
        op_division: '/',
        op_suma: '+',
        op_resta: '-',
        // Las palabras clave se definen con prioridad sobre los identificadores
        // y se convierten a minúsculas para ser insensibles al caso.
        palabra_clave: {
            match: /[a-zA-Z_][a-zA-Z0-9_]*/,
            type: moo.keywords({
                kw_programa: "programa",
                kw_finprograma: "finprograma",
                kw_var: "var",
                kw_const: "const",
                kw_inicio: "inicio",
                kw_procedimiento: "procedimiento",
                kw_finprocedimiento: "finprocedimiento",
                kw_funcion: "funcion",
                kw_retorno: "retorno",
                kw_finfuncion: "finfuncion",
                kw_por_ref: "por ref",
                kw_leer: "leer",
                kw_escribir: "escribir",
                kw_si: "si",
                kw_entonces: "entonces",
                kw_sino: "sino",
                kw_finsi: "finsi",
                kw_segun: "segun",
                kw_caso: "caso",
                kw_hacer: "hacer",
                kw_de_otro_modo: "de otro modo",
                kw_finsegun: "finsegun",
                kw_mientras: "mientras",
                kw_finmientras: "finmientras",
                kw_repetir: "repetir",
                kw_hasta_que: "hasta que",
                kw_variar: "variar",
                kw_de: "de",
                kw_hasta: "hasta",
                kw_salto: "salto",
                kw_finvariar: "finvariar",
                kw_iterar: "iterar",
                kw_finiterar: "finiterar",
                kw_salirsi: "salirsi",
                kw_tipo_entero: "entero",
                kw_tipo_real: "real",
                kw_tipo_cadena: "cadena",
                kw_tipo_caracter: ["caracter", "car"],
                kw_tipo_logico: "logico",
                op_mod: "mod"
            }),
            value: s => s.toLowerCase()
        },
        identificador: /[a-zA-Z][a-zA-Z0-9_]*/,
        // Los operadores < y > deben ir después de <= y >= para una correcta tokenización.
        op_menor: '<',
        op_mayor: '>',
    };

    const lexer = moo.compile(tokens);
%}

@lexer lexer

# --- Reglas de la Gramática ---

# Regla inicial: un programa completo.
programa -> %kw_programa __ identificador __ declaraciones __ subprogramas __ bloque_principal __ %kw_finprograma

# Declaraciones de constantes y variables.
declaraciones -> (declaracion_constantes (__ declaracion_variables):? | declaracion_variables):?

declaracion_constantes -> %kw_const __ lista_declaracion_constantes
lista_declaracion_constantes -> declaracion_constante
    | lista_declaracion_constantes __ declaracion_constante
declaracion_constante -> %identificador __ %op_asignacion __ literal

declaracion_variables -> %kw_var __ lista_declaracion_variables
lista_declaracion_variables -> declaracion_variable
    | lista_declaracion_variables __ declaracion_variable
declaracion_variable -> lista_identificadores __ %dos_puntos __ tipo_dato

lista_identificadores -> %identificador
    | lista_identificadores __ %coma __ %identificador

# Subprogramas.
subprogramas -> (subprograma __):*
subprograma -> procedimiento | funcion

procedimiento -> %kw_procedimiento __ %identificador __ %lparen __ parametros __ %rparen __ declaraciones __ bloque_principal __ %kw_finprocedimiento
funcion -> %kw_funcion __ %identificador __ %lparen __ parametros __ %rparen __ %dos_puntos __ tipo_dato __ declaraciones __ bloque_principal __ %kw_retorno __ %kw_finfuncion

parametros -> lista_parametros | null
lista_parametros -> parametro
    | lista_parametros __ %coma __ parametro
parametro -> (%kw_por_ref __):? %identificador __ %dos_puntos __ tipo_dato

# Cuerpo principal y sentencias.
bloque_principal -> %kw_inicio __ sentencias
sentencias -> (sentencia __):*
sentencia -> asignacion
    | llamada_procedimiento
    | entrada_salida
    | estructura_control

asignacion -> %identificador __ %op_asignacion __ expresion
llamada_procedimiento -> %identificador __ %lparen __ argumentos __ %rparen
argumentos -> lista_expresiones | null
lista_expresiones -> expresion
    | lista_expresiones __ %coma __ expresion

entrada_salida -> %kw_leer __ %lparen __ lista_identificadores __ %rparen
    | %kw_escribir __ %lparen __ lista_expresiones __ %rparen

# Estructuras de control.
estructura_control -> condicional_si
    | condicional_segun
    | bucle_mientras
    | bucle_repetir
    | bucle_variar
    | bucle_iterar

condicional_si -> %kw_si __ expresion __ %kw_entonces __ sentencias __ (%kw_sino __ sentencias):? __ %kw_finsi

condicional_segun -> %kw_segun __ %kw_caso __ expresion __ %kw_hacer __ casos __ %kw_finsegun
casos -> (caso __):* (%kw_de_otro_modo __ sentencias):?
caso -> lista_literales __ %dos_puntos __ sentencias
lista_literales -> literal
    | lista_literales __ %coma __ literal

bucle_mientras -> %kw_mientras __ expresion __ %kw_hacer __ sentencias __ %kw_finmientras
bucle_repetir -> %kw_repetir __ sentencias __ %kw_hasta_que __ expresion
bucle_variar -> %kw_variar __ %identificador __ %kw_de __ expresion __ %kw_hasta __ expresion (__ %kw_salto __ expresion):? __ sentencias __ %kw_finvariar
bucle_iterar -> %kw_iterar __ sentencias_con_salirsi __ %kw_finiterar
sentencias_con_salirsi -> (sentencia_con_salirsi __):*
sentencia_con_salirsi -> %kw_salirsi __ expresion | sentencia

# Tipos de datos.
tipo_dato -> %kw_tipo_entero | %kw_tipo_real | %kw_tipo_cadena | %kw_tipo_caracter | %kw_tipo_logico

# --- Expresiones con Precedencia ---
op_relacional_full -> %op_relacional | %op_menor | %op_mayor
expresion -> expresion_logica_o

expresion_logica_o -> expresion_logica_o __ %op_logico_o __ expresion_logica_y | expresion_logica_y
expresion_logica_y -> expresion_logica_y __ %op_logico_y __ expresion_relacional | expresion_relacional
expresion_relacional -> expresion_aditiva __ op_relacional_full __ expresion_aditiva | expresion_aditiva
expresion_aditiva -> expresion_aditiva __ %op_suma __ expresion_multiplicativa | expresion_aditiva __ %op_resta __ expresion_multiplicativa | expresion_multiplicativa
expresion_multiplicativa -> expresion_multiplicativa __ %op_multiplicacion __ expresion_potencia | expresion_multiplicativa __ %op_division __ expresion_potencia | expresion_multiplicativa __ %op_mod __ expresion_potencia | expresion_potencia
expresion_potencia -> primario __ %op_potencia __ expresion_potencia | primario
primario -> (%op_resta | %op_logico_no) __ primario
    | literal
    | %identificador
    | llamada_funcion
    | %lparen __ expresion __ %rparen {% d(d, 2) %}

llamada_funcion -> %identificador __ %lparen __ argumentos __ %rparen

literal -> %numero_entero | %numero_real | %cadena | %booleano

# --- Reglas Auxiliares ---
# `__` (doble guion bajo) significa uno o más espacios/comentarios.
# `_` (guion bajo simple) significa cero o más espacios/comentarios.
__ -> (%ws | %comentario):+
_  -> (%ws | %comentario):*

