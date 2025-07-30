// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

// Funciones auxiliares para construir el AST
var buildProgram = (name, declarations, statements) => ({
    type: 'PROGRAM',
    name: name,
    declarations: declarations || [],
    statements: statements || []
});

var buildDeclaration = (type, vars, dataType) => ({
    type: type,
    variables: vars,
    dataType: dataType
});

var buildStatement = (type, ...args) => ({
    type: type,
    ...args.reduce((acc, arg, i) => ({ ...acc, [`arg${i}`]: arg }), {})
});


//const moo = require("moo");

var lexer = moo.compile({
    ws: { match: /[ \t\n\r]+/, lineBreaks: true },
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
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "programa$ebnf$1", "symbols": ["declaraciones"], "postprocess": id},
    {"name": "programa$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "programa$ebnf$2", "symbols": ["sentencias"], "postprocess": id},
    {"name": "programa$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "programa", "symbols": [{"literal":"PROGRAMA"}, "_", "identificador", "_", "programa$ebnf$1", "_", {"literal":"INICIO"}, "_", "programa$ebnf$2", "_", {"literal":"FINPROGRAMA"}], "postprocess": 
        ([,, nombre,, declaraciones,,,, sentencias]) => 
            buildProgram(nombre, declaraciones, sentencias)
        },
    {"name": "declaraciones$ebnf$1", "symbols": ["declaraciones"], "postprocess": id},
    {"name": "declaraciones$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "declaraciones", "symbols": ["declaracion", "_", "declaraciones$ebnf$1"], "postprocess": 
        ([decl,, resto]) => resto ? [decl, ...resto] : [decl]
        },
    {"name": "declaracion", "symbols": ["declaracion_variable"]},
    {"name": "declaracion", "symbols": ["declaracion_constante"]},
    {"name": "declaracion", "symbols": ["declaracion_tipo"]},
    {"name": "declaracion", "symbols": ["declaracion_subprograma"]},
    {"name": "declaracion_variable", "symbols": [{"literal":"VAR"}, "_", "variable_con_dimensiones", "_", {"literal":":"}, "_", "tipo_dato"], "postprocess": 
        ([,, variable,,,, tipo]) => buildDeclaration('VAR', [variable], tipo)
        },
    {"name": "declaracion_variable", "symbols": [{"literal":"VAR"}, "_", "lista_variables", "_", {"literal":":"}, "_", "tipo_dato"], "postprocess": 
        ([,, variables,,,, tipo]) => buildDeclaration('VAR', variables, tipo)
        },
    {"name": "declaracion_constante", "symbols": [{"literal":"CONST"}, "_", "identificador", "_", {"literal":"="}, "_", "expresion"], "postprocess": 
        ([,, nombre,,,, valor]) => buildDeclaration('CONST', [nombre], valor)
        },
    {"name": "variable_con_dimensiones", "symbols": ["identificador", "_", {"literal":"["}, "_", "lista_dimensiones", "_", {"literal":"]"}], "postprocess": 
        ([nombre,,,, dimensiones]) => ({ type: 'VAR_ARRAY', name: nombre, dimensions: dimensiones })
        },
    {"name": "lista_dimensiones", "symbols": ["expresion", "_", {"literal":","}, "_", "lista_dimensiones"], "postprocess": 
        ([dim,,,, resto]) => [dim, ...resto]
        },
    {"name": "lista_dimensiones", "symbols": ["expresion"], "postprocess": ([dim]) => [dim]},
    {"name": "lista_variables", "symbols": ["identificador", "_", {"literal":","}, "_", "lista_variables"], "postprocess": 
        ([id,,,, resto]) => [id, ...resto]
        },
    {"name": "lista_variables", "symbols": ["identificador"], "postprocess": ([id]) => [id]},
    {"name": "tipo_dato", "symbols": ["tipo_basico"]},
    {"name": "tipo_dato", "symbols": ["tipo_registro"]},
    {"name": "tipo_dato", "symbols": ["tipo_enumerado"]},
    {"name": "tipo_dato", "symbols": ["tipo_subrango"]},
    {"name": "tipo_dato", "symbols": ["identificador"]},
    {"name": "tipo_basico", "symbols": [{"literal":"ENTERO"}], "postprocess": () => 'ENTERO'},
    {"name": "tipo_basico", "symbols": [{"literal":"REAL"}], "postprocess": () => 'REAL'},
    {"name": "tipo_basico", "symbols": [{"literal":"CARACTER"}], "postprocess": () => 'CARACTER'},
    {"name": "tipo_basico", "symbols": [{"literal":"CADENA"}], "postprocess": () => 'CADENA'},
    {"name": "tipo_basico", "symbols": [{"literal":"LOGICO"}], "postprocess": () => 'LOGICO'},
    {"name": "tipo_enumerado", "symbols": [{"literal":"("}, "_", "lista_identificadores", "_", {"literal":")"}], "postprocess": 
        ([,, valores]) => ({ type: 'ENUMERADO', values: valores })
        },
    {"name": "tipo_subrango", "symbols": ["expresion", "_", {"literal":".."}, "_", "expresion"], "postprocess": 
        ([min,,,, max]) => ({ type: 'SUBRANGO', min: min, max: max })
        },
    {"name": "declaracion_tipo", "symbols": [{"literal":"TIPO"}, "_", "identificador", "_", {"literal":"="}, "_", "definicion_tipo"], "postprocess": 
        ([,, nombre,,,, definicion]) => 
            buildDeclaration('TIPO', [nombre], definicion)
        },
    {"name": "definicion_tipo", "symbols": ["tipo_dato"]},
    {"name": "definicion_tipo", "symbols": ["tipo_registro"]},
    {"name": "tipo_registro$ebnf$1", "symbols": ["campos_registro"], "postprocess": id},
    {"name": "tipo_registro$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "tipo_registro", "symbols": [{"literal":"REGISTRO"}, "_", "tipo_registro$ebnf$1", "_", {"literal":"FINREGISTRO"}], "postprocess": 
        ([,, campos]) => ({ type: 'REGISTRO', fields: campos || [] })
        },
    {"name": "campos_registro$ebnf$1", "symbols": ["campos_registro"], "postprocess": id},
    {"name": "campos_registro$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "campos_registro", "symbols": ["campo_registro", "_", "campos_registro$ebnf$1"], "postprocess": 
        ([campo,, resto]) => resto ? [campo, ...resto] : [campo]
        },
    {"name": "campo_registro", "symbols": ["identificador", "_", {"literal":":"}, "_", "tipo_dato"], "postprocess": 
        ([nombre,,,, tipo]) => ({ name: nombre, type: tipo })
        },
    {"name": "lista_identificadores", "symbols": ["identificador", "_", {"literal":","}, "_", "lista_identificadores"], "postprocess": 
        ([id,,,, resto]) => [id, ...resto]
        },
    {"name": "lista_identificadores", "symbols": ["identificador"], "postprocess": ([id]) => [id]},
    {"name": "sentencias$ebnf$1", "symbols": ["sentencias"], "postprocess": id},
    {"name": "sentencias$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "sentencias", "symbols": ["sentencia", "_", "sentencias$ebnf$1"], "postprocess": 
        ([stmt,, resto]) => resto ? [stmt, ...resto] : [stmt]
        },
    {"name": "sentencia", "symbols": ["sentencia_asignacion"]},
    {"name": "sentencia", "symbols": ["sentencia_entrada"]},
    {"name": "sentencia", "symbols": ["sentencia_salida"]},
    {"name": "sentencia", "symbols": ["sentencia_si"]},
    {"name": "sentencia", "symbols": ["sentencia_segun"]},
    {"name": "sentencia", "symbols": ["sentencia_mientras"]},
    {"name": "sentencia", "symbols": ["sentencia_repetir"]},
    {"name": "sentencia", "symbols": ["sentencia_variar"]},
    {"name": "sentencia", "symbols": ["llamada_procedimiento"]},
    {"name": "sentencia_asignacion", "symbols": ["variable", "_", {"literal":"="}, "_", "expresion"], "postprocess": 
        ([variable,,,, expr]) => buildStatement('ASIGNACION', variable, expr)
        },
    {"name": "sentencia_entrada", "symbols": [{"literal":"Leer"}, "_", {"literal":"("}, "_", "lista_variables", "_", {"literal":")"}], "postprocess": 
        ([,,,, variables]) => buildStatement('LEER', variables)
        },
    {"name": "sentencia_salida", "symbols": [{"literal":"Escribir"}, "_", {"literal":"("}, "_", "lista_expresiones", "_", {"literal":")"}], "postprocess": 
        ([,,,, expresiones]) => buildStatement('ESCRIBIR', expresiones)
        },
    {"name": "sentencia_si$ebnf$1", "symbols": ["bloque_sino"], "postprocess": id},
    {"name": "sentencia_si$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "sentencia_si", "symbols": [{"literal":"SI"}, "_", "expresion", "_", {"literal":"ENTONCES"}, "_", "sentencias", "_", "sentencia_si$ebnf$1", "_", {"literal":"FINSI"}], "postprocess": 
        ([,, condicion,,,, entonces,, sino]) => 
            buildStatement('SI', condicion, entonces, sino)
        },
    {"name": "bloque_sino", "symbols": [{"literal":"SINO"}, "_", "sentencias"], "postprocess": ([,, sentencias]) => sentencias},
    {"name": "sentencia_segun$ebnf$1", "symbols": ["defecto"], "postprocess": id},
    {"name": "sentencia_segun$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "sentencia_segun", "symbols": [{"literal":"SEGÚN"}, "_", {"literal":"CASO"}, "_", "expresion", "_", {"literal":"HACER"}, "_", "casos", "_", "sentencia_segun$ebnf$1", "_", {"literal":"FINSEGUN"}], "postprocess": 
        ([,,,, expr,,,, casos,, defecto]) => 
            buildStatement('SEGUN', expr, casos, defecto)
        },
    {"name": "casos$ebnf$1", "symbols": ["casos"], "postprocess": id},
    {"name": "casos$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "casos", "symbols": ["caso", "_", "casos$ebnf$1"], "postprocess": 
        ([caso,, resto]) => resto ? [caso, ...resto] : [caso]
        },
    {"name": "caso", "symbols": ["lista_constantes", "_", {"literal":":"}, "_", "sentencias"], "postprocess": 
        ([constantes,,,, sentencias]) => ({ values: constantes, statements: sentencias })
        },
    {"name": "defecto", "symbols": [{"literal":"DE"}, "_", {"literal":"OTRO"}, "_", {"literal":"MODO"}, "_", "sentencias"], "postprocess": ([,,,,,, sentencias]) => sentencias},
    {"name": "sentencia_mientras", "symbols": [{"literal":"MIENTRAS"}, "_", "expresion", "_", {"literal":"HACER"}, "_", "sentencias", "_", {"literal":"FINMIENTRAS"}], "postprocess": 
        ([,, condicion,,,, sentencias]) => buildStatement('MIENTRAS', condicion, sentencias)
        },
    {"name": "sentencia_repetir", "symbols": [{"literal":"REPETIR"}, "_", "sentencias", "_", {"literal":"HASTA"}, "_", "expresion"], "postprocess": 
        ([,, sentencias,,,, condicion]) => buildStatement('REPETIR', sentencias, condicion)
        },
    {"name": "sentencia_variar$ebnf$1", "symbols": ["salto"], "postprocess": id},
    {"name": "sentencia_variar$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "sentencia_variar", "symbols": [{"literal":"VARIAR"}, "_", "identificador", "_", {"literal":"DE"}, "_", "expresion", "_", {"literal":"HASTA"}, "_", "expresion", "_", "sentencia_variar$ebnf$1", "_", "sentencias", "_", {"literal":"FINVARIAR"}], "postprocess": 
        ([,, contador,,,, inicio,,,, fin,, incremento,, sentencias]) => 
            buildStatement('VARIAR', contador, inicio, fin, incremento || 1, sentencias)
        },
    {"name": "salto", "symbols": [{"literal":"SALTO"}, "_", "expresion"], "postprocess": ([,, expr]) => expr},
    {"name": "llamada_procedimiento$ebnf$1", "symbols": ["lista_expresiones"], "postprocess": id},
    {"name": "llamada_procedimiento$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "llamada_procedimiento", "symbols": ["identificador", "_", {"literal":"("}, "_", "llamada_procedimiento$ebnf$1", "_", {"literal":")"}], "postprocess": 
        ([nombre,,,, parametros]) => 
            buildStatement('LLAMADA_PROC', nombre, parametros || [])
        },
    {"name": "declaracion_subprograma", "symbols": ["declaracion_procedimiento"]},
    {"name": "declaracion_subprograma", "symbols": ["declaracion_funcion"]},
    {"name": "declaracion_procedimiento$ebnf$1", "symbols": ["lista_parametros"], "postprocess": id},
    {"name": "declaracion_procedimiento$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "declaracion_procedimiento$ebnf$2", "symbols": ["sentencias"], "postprocess": id},
    {"name": "declaracion_procedimiento$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "declaracion_procedimiento", "symbols": [{"literal":"PROCEDIMIENTO"}, "_", "identificador", "_", {"literal":"("}, "_", "declaracion_procedimiento$ebnf$1", "_", {"literal":")"}, "_", {"literal":"INICIO"}, "_", "declaracion_procedimiento$ebnf$2", "_", {"literal":"FINPROCEDIMIENTO"}], "postprocess": 
        ([,, nombre,,,, parametros,,,,,,,, sentencias]) => 
            buildStatement('PROCEDIMIENTO', nombre, parametros || [], sentencias || [])
        },
    {"name": "declaracion_funcion$ebnf$1", "symbols": ["lista_parametros"], "postprocess": id},
    {"name": "declaracion_funcion$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "declaracion_funcion$ebnf$2", "symbols": ["sentencias"], "postprocess": id},
    {"name": "declaracion_funcion$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "declaracion_funcion", "symbols": [{"literal":"FUNCION"}, "_", "identificador", "_", {"literal":"("}, "_", "declaracion_funcion$ebnf$1", "_", {"literal":")"}, "_", {"literal":":"}, "_", "tipo_dato", "_", {"literal":"INICIO"}, "_", "declaracion_funcion$ebnf$2", "_", {"literal":"RETORNO"}, "_", {"literal":"FINFUNCION"}], "postprocess": 
        ([,, nombre,,,, parametros,,,,,, tipo,,,,,, sentencias]) => 
            buildStatement('FUNCION', nombre, parametros || [], tipo, sentencias || [])
        },
    {"name": "lista_parametros", "symbols": ["parametro", "_", {"literal":","}, "_", "lista_parametros"], "postprocess": 
        ([param,,,, resto]) => [param, ...resto]
        },
    {"name": "lista_parametros", "symbols": ["parametro"], "postprocess": ([param]) => [param]},
    {"name": "parametro", "symbols": ["modificador_referencia", "_", "identificador", "_", {"literal":":"}, "_", "tipo_dato"], "postprocess": 
        ([mod,, nombre,,,, tipo]) => ({ name: nombre, type: tipo, byRef: mod })
        },
    {"name": "parametro", "symbols": ["identificador", "_", {"literal":":"}, "_", "tipo_dato"], "postprocess": 
        ([nombre,,,, tipo]) => ({ name: nombre, type: tipo, byRef: false })
        },
    {"name": "modificador_referencia", "symbols": [{"literal":"porRef"}], "postprocess": () => true},
    {"name": "modificador_referencia", "symbols": [{"literal":"porRef."}], "postprocess": () => true},
    {"name": "variable$ebnf$1", "symbols": ["accesos"], "postprocess": id},
    {"name": "variable$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "variable", "symbols": ["identificador", "variable$ebnf$1"], "postprocess": 
        ([id, accesos]) => accesos ? { type: 'VAR_ACCESO', name: id, accesses: accesos } : id
        },
    {"name": "accesos$ebnf$1", "symbols": ["accesos"], "postprocess": id},
    {"name": "accesos$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "accesos", "symbols": ["acceso", "accesos$ebnf$1"], "postprocess": 
        ([acceso, resto]) => resto ? [acceso, ...resto] : [acceso]
        },
    {"name": "acceso", "symbols": [{"literal":"["}, "_", "lista_expresiones", "_", {"literal":"]"}], "postprocess": ([,, indices]) => ({ type: 'INDEX', indices: indices })},
    {"name": "acceso", "symbols": [{"literal":"."}, "_", "identificador"], "postprocess": ([,, id]) => ({ type: 'FIELD', name: id })},
    {"name": "expresion", "symbols": ["expresion_or"]},
    {"name": "expresion_or", "symbols": ["expresion_or", "_", {"literal":"O"}, "_", "expresion_and"], "postprocess": 
        ([izq,,,, der]) => buildStatement('OP_BINARIA', 'O', izq, der)
        },
    {"name": "expresion_or", "symbols": ["expresion_and"]},
    {"name": "expresion_and", "symbols": ["expresion_and", "_", {"literal":"Y"}, "_", "expresion_not"], "postprocess": 
        ([izq,,,, der]) => buildStatement('OP_BINARIA', 'Y', izq, der)
        },
    {"name": "expresion_and", "symbols": ["expresion_not"]},
    {"name": "expresion_not", "symbols": [{"literal":"NO"}, "_", "expresion_relacional"], "postprocess": 
        ([,, expr]) => buildStatement('OP_UNARIA', 'NO', expr)
        },
    {"name": "expresion_not", "symbols": ["expresion_relacional"]},
    {"name": "expresion_relacional", "symbols": ["expresion_aditiva", "_", "operador_relacional", "_", "expresion_aditiva"], "postprocess": 
        ([izq,, op,, der]) => buildStatement('OP_BINARIA', op, izq, der)
        },
    {"name": "expresion_relacional", "symbols": ["expresion_aditiva"]},
    {"name": "operador_relacional", "symbols": [{"literal":"="}]},
    {"name": "operador_relacional", "symbols": [{"literal":">"}]},
    {"name": "operador_relacional", "symbols": [{"literal":">="}]},
    {"name": "operador_relacional", "symbols": [{"literal":"<"}]},
    {"name": "operador_relacional", "symbols": [{"literal":"<="}]},
    {"name": "operador_relacional", "symbols": [{"literal":"<>"}]},
    {"name": "expresion_aditiva", "symbols": ["expresion_aditiva", "_", "operador_aditivo", "_", "expresion_multiplicativa"], "postprocess": 
        ([izq,, op,, der]) => buildStatement('OP_BINARIA', op, izq, der)
        },
    {"name": "expresion_aditiva", "symbols": ["expresion_multiplicativa"]},
    {"name": "operador_aditivo", "symbols": [{"literal":"+"}]},
    {"name": "operador_aditivo", "symbols": [{"literal":"-"}]},
    {"name": "expresion_multiplicativa", "symbols": ["expresion_multiplicativa", "_", "operador_multiplicativo", "_", "expresion_exponencial"], "postprocess": 
        ([izq,, op,, der]) => buildStatement('OP_BINARIA', op, izq, der)
        },
    {"name": "expresion_multiplicativa", "symbols": ["expresion_exponencial"]},
    {"name": "operador_multiplicativo", "symbols": [{"literal":"*"}]},
    {"name": "operador_multiplicativo", "symbols": [{"literal":"/"}]},
    {"name": "expresion_exponencial", "symbols": ["expresion_primaria", "_", {"literal":"^"}, "_", "expresion_exponencial"], "postprocess": 
        ([base,,,, exp]) => buildStatement('OP_BINARIA', '^', base, exp)
        },
    {"name": "expresion_exponencial", "symbols": ["expresion_primaria"]},
    {"name": "expresion_primaria", "symbols": [{"literal":"("}, "_", "expresion", "_", {"literal":")"}], "postprocess": ([,, expr]) => expr},
    {"name": "expresion_primaria", "symbols": ["literal"]},
    {"name": "expresion_primaria", "symbols": ["variable"]},
    {"name": "expresion_primaria", "symbols": ["llamada_funcion"]},
    {"name": "llamada_funcion$ebnf$1", "symbols": ["lista_expresiones"], "postprocess": id},
    {"name": "llamada_funcion$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "llamada_funcion", "symbols": ["identificador", "_", {"literal":"("}, "_", "llamada_funcion$ebnf$1", "_", {"literal":")"}], "postprocess": 
        ([nombre,,,, parametros]) => 
            buildStatement('LLAMADA_FUNC', nombre, parametros || [])
        },
    {"name": "lista_expresiones", "symbols": ["expresion", "_", {"literal":","}, "_", "lista_expresiones"], "postprocess": 
        ([expr,,,, resto]) => [expr, ...resto]
        },
    {"name": "lista_expresiones", "symbols": ["expresion"], "postprocess": ([expr]) => [expr]},
    {"name": "lista_constantes", "symbols": ["literal", "_", {"literal":","}, "_", "lista_constantes"], "postprocess": function(d) { return [d[0]].concat(d[4]); } },
    {"name": "lista_constantes", "symbols": ["literal"], "postprocess": function(d) { return [d[0]]; }},
    {"name": "literal", "symbols": ["numero"]},
    {"name": "literal", "symbols": ["cadena"]},
    {"name": "literal", "symbols": ["caracter"]},
    {"name": "literal", "symbols": ["booleano"]},
    {"name": "numero", "symbols": [(lexer.has("numero") ? {type: "numero"} : numero)], "postprocess": ([token]) => ({ type: 'NUMERO', value: parseFloat(token.value) })},
    {"name": "cadena", "symbols": [(lexer.has("cadena") ? {type: "cadena"} : cadena)], "postprocess": ([token]) => ({ type: 'CADENA', value: token.value.slice(1, -1) })},
    {"name": "caracter", "symbols": [(lexer.has("caracter") ? {type: "caracter"} : caracter)], "postprocess": ([token]) => ({ type: 'CARACTER', value: token.value.slice(1, -1) })},
    {"name": "booleano", "symbols": [{"literal":"[V]"}], "postprocess": () => ({ type: 'BOOLEANO', value: true })},
    {"name": "booleano", "symbols": [{"literal":"[F]"}], "postprocess": () => ({ type: 'BOOLEANO', value: false })},
    {"name": "identificador", "symbols": [(lexer.has("identificador") ? {type: "identificador"} : identificador)], "postprocess": ([token]) => token.value},
    {"name": "_$ebnf$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": id},
    {"name": "_$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": () => null}
]
  , ParserStart: "programa"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
