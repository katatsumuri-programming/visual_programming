Blockly.JavaScript['output'] = function(block) {
  var value_output = Blockly.JavaScript.valueToCode(block, 'output', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  if (value_output[0] == "(") {
    var code = 'output' + value_output + ';\n';
  } else {
    var code = 'output(' + value_output + ');\n';
  }
  return code;
};

Blockly.JavaScript['javascript'] = function(block) {
  var text_code = block.getFieldValue('code');
  var statements_contents = Blockly.JavaScript.statementToCode(block, 'contents');
  // TODO: Assemble JavaScript into code variable.
  var code = text_code + "{\n" + statements_contents + "}\n";
  return code;
};

Blockly.JavaScript['javascript_order'] = function(block) {
  var text_code = block.getFieldValue('code');
  // TODO: Assemble JavaScript into code variable.
  var code = text_code + '\n';
  return code;
};

Blockly.JavaScript['question_block'] = function(block) {
  var value_question = Blockly.JavaScript.valueToCode(block, 'TEXT', Blockly.JavaScript.ORDER_ATOMIC);
  var variable_answer = Blockly.JavaScript.nameDB_.getName(
    block.getFieldValue('VAR'), Blockly.Names.NameType.VARIABLE);
  console.log(block.getFieldValue('VAR'))
  // TODO: Assemble JavaScript into code variable.
  var code = variable_answer + ' = window.prompt(' + value_question +');\n';
  return code;
};

Blockly.JavaScript['simple_for'] = function(block) {
  var variable_var = Blockly.JavaScript.nameDB_.getName(block.getFieldValue('VAR'), Blockly.Names.NameType.VARIABLE);
  var value_num = Blockly.JavaScript.valueToCode(block, 'NUM', Blockly.JavaScript.ORDER_ATOMIC);
  var statements_do = Blockly.JavaScript.statementToCode(block, 'DO');
  // TODO: Assemble JavaScript into code variable.
  var code = 'for (' + variable_var + ' = 1; ' + variable_var + ' <= ' + value_num + '; ' + variable_var + '++) {\n' + statements_do + '}\n';
  return code;
};

Blockly.JavaScript['start_block'] = function(block) {
  var statements_do_raw = Blockly.JavaScript.statementToCode(block, 'DO');
  var statements_do =""
  for (var i = 0; i < statements_do_raw.split('\n').length; i++) {
    statements_do += statements_do_raw.split('\n')[i].replace("  ", "") + "\n"
  }
  // TODO: Assemble JavaScript into code variable.
  var code = statements_do;
  return code;
};