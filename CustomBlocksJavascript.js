Blockly.JavaScript['if_else'] = function(block) {
  var value_conditions = Blockly.JavaScript.valueToCode(block, 'conditions', Blockly.JavaScript.ORDER_ATOMIC);
  var statements_contents = Blockly.JavaScript.statementToCode(block, 'contents');
  var statements_else = Blockly.JavaScript.statementToCode(block, 'else');
  // TODO: Assemble JavaScript into code variable.
  if (value_conditions[0] == "(") {
    code = "if " + value_conditions + " {\n" + statements_contents + "} else {\n" + statements_else + "};";
  } else {
    code = "if (" + value_conditions + ") {\n" + statements_contents + "} else {\n" + statements_else + "};";
  }
  return code;
};

Blockly.JavaScript['if'] = function(block) {
  var value_conditions = Blockly.JavaScript.valueToCode(block, 'conditions', Blockly.JavaScript.ORDER_ATOMIC);
  var statements_contents = Blockly.JavaScript.statementToCode(block, 'contents');
  // TODO: Assemble JavaScript into code variable.
  if (value_conditions[0] == "(") {
    code = "if " + value_conditions + " {\n" + statements_contents + "};";
  } else {
    code = "if (" + value_conditions + ") {\n" + statements_contents + "};";
  }
  return code;
};

Blockly.JavaScript['output'] = function(block) {
  var value_output = Blockly.JavaScript.valueToCode(block, 'output', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  if (value_output[0] == "(") {
    var code = 'console.log' + value_output + ';\n';
  } else {
    var code = 'console.log(' + value_output + ');n';
  }
  return code;
};