import nearley from 'nearley';
import parserGrammar from './AED_v2.ne'; // es {ParserRules, ParserStart, Lexer}

window.parse = function() {
  const entrada = document.getElementById('entrada').value;

  // Crear nueva instancia del parser usando Nearley.Parser
  const parser = new nearley.Parser(
    nearley.Grammar.fromCompiled(parserGrammar)
  );

  try {
    parser.feed(entrada);
    document.getElementById('salida').textContent = JSON.stringify(parser.results, null, 2);
  } catch (e) {
    document.getElementById('salida').textContent = 'Error: ' + e.message;
  }
};
