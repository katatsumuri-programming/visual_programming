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