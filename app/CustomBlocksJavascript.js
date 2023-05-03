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

Blockly.JavaScript['lists_sort_custom'] = function(block) {
  var value_list = Blockly.JavaScript.valueToCode(block, 'LIST', Blockly.JavaScript.ORDER_ATOMIC);
  if (value_list.length < 1) {
    value_list = "[]"
  }
  // TODO: Assemble JavaScript into code variable.
  var code = value_list + '.sort()';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['lists_repeat_custom'] = function(block) {
  var value_item = Blockly.JavaScript.valueToCode(block, 'ITEM', Blockly.JavaScript.ORDER_ATOMIC);
  var value_num = Blockly.JavaScript.valueToCode(block, 'NUM', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = 'listsRepeat(' + value_item + ', ' + value_num + ')';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['text_count_custom'] = function(block) {
  var value_text = Blockly.JavaScript.valueToCode(block, 'TEXT', Blockly.JavaScript.ORDER_ATOMIC);
  var value_sub = Blockly.JavaScript.valueToCode(block, 'SUB', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = 'textCount(' + value_text + ', ' + value_sub + ')';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['text_replace_custom'] = function(block) {
  var value_text = Blockly.JavaScript.valueToCode(block, 'TEXT', Blockly.JavaScript.ORDER_ATOMIC);
  var value_from = Blockly.JavaScript.valueToCode(block, 'FROM', Blockly.JavaScript.ORDER_ATOMIC);
  var value_to = Blockly.JavaScript.valueToCode(block, 'TO', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = 'textReplace(' + value_text + ', ' + value_from + ', ' + value_to + ')';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['lists_reverse_custom'] = function(block) {
  var value_list = Blockly.JavaScript.valueToCode(block, 'LIST', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  if (value_list.length < 1) {
    value_list = "[]"
  }
  var code = value_list + '.reverse()';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};
