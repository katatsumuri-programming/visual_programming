Blockly.JavaScript['if_else'] = function(block) {
  var value_conditions = Blockly.JavaScript.valueToCode(block, 'conditions', Blockly.JavaScript.ORDER_ATOMIC);
  var statements_contents = Blockly.JavaScript.statementToCode(block, 'contents');
  var statements_else = Blockly.JavaScript.statementToCode(block, 'else');
  // TODO: Assemble JavaScript into code variable.
  if (value_conditions == "") {
    value_conditions = "(false)"
  } else if (value_conditions.match(/true/) || value_conditions.match(/false/)) {
    value_conditions = '(' + value_conditions + ')';
  }
  code = "if " + value_conditions + " {\n" + statements_contents + "} else {\n" + statements_else + "}\n";
  return code;
};

Blockly.JavaScript['if'] = function(block) {
  var value_conditions = Blockly.JavaScript.valueToCode(block, 'conditions', Blockly.JavaScript.ORDER_ATOMIC);
  var statements_contents = Blockly.JavaScript.statementToCode(block, 'contents');
  // TODO: Assemble JavaScript into code variable.
  if (value_conditions == "") {
    value_conditions = "(false)"
  } else if (value_conditions.match(/true/) || value_conditions.match(/false/)) {
    value_conditions = '(' + value_conditions + ')';
  }
  code = "if " + value_conditions + " {\n" + statements_contents + "}\n";
  return code;
};

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
Blockly.JavaScript['for'] = function(block) {
  var value_number = Blockly.JavaScript.valueToCode(block, 'number', Blockly.JavaScript.ORDER_ATOMIC);
  var statements_contents = Blockly.JavaScript.statementToCode(block, 'contents');
  // TODO: Assemble JavaScript into code variable.
  if (value_number == "") {
    value_number = 0;
  }
  var code = 'for (var i = 0; i < ' + value_number + '; i++) {\n' + statements_contents + '}\n';
  return code;
};

Blockly.JavaScript['forever'] = function(block) {
  var statements_contents = Blockly.JavaScript.statementToCode(block, 'contents');
  // TODO: Assemble JavaScript into code variable.
  var code = 'while (true) {\n' + statements_contents + '}\n';
  return code;
};

Blockly.JavaScript['while'] = function(block) {
  var value_num = Blockly.JavaScript.valueToCode(block, 'num', Blockly.JavaScript.ORDER_ATOMIC);
  var statements_contents = Blockly.JavaScript.statementToCode(block, 'contents');
  // TODO: Assemble JavaScript into code variable.
  if (value_num == "") {
    value_num = false;
  }
  var code = 'while (' + value_num + ') {\n' + statements_contents + '}\n';
  return code;
};

Blockly.JavaScript['plus'] = function(block) {
  var value_num1 = Blockly.JavaScript.valueToCode(block, 'num1', Blockly.JavaScript.ORDER_ATOMIC);
  var value_num2 = Blockly.JavaScript.valueToCode(block, 'num2', Blockly.JavaScript.ORDER_ATOMIC);
  if (value_num1 == "") {
    value_num1 = 0;
  }
   if (value_num2 == "") {
    value_num2 = 0;
  }
  // TODO: Assemble JavaScript into code variable.
  var code = value_num1 + ' + ' + value_num2;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['minus'] = function(block) {
  var value_num1 = Blockly.JavaScript.valueToCode(block, 'num1', Blockly.JavaScript.ORDER_ATOMIC);
  var value_num2 = Blockly.JavaScript.valueToCode(block, 'num2', Blockly.JavaScript.ORDER_ATOMIC);
  if (value_num1 == "") {
    value_num1 = 0;
  }
   if (value_num2 == "") {
    value_num2 = 0;
  }
  // TODO: Assemble JavaScript into code variable.
  var code = value_num1 + ' - ' + value_num2;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['multiplication'] = function(block) {
  var value_num1 = Blockly.JavaScript.valueToCode(block, 'num1', Blockly.JavaScript.ORDER_ATOMIC);
  var value_num2 = Blockly.JavaScript.valueToCode(block, 'num2', Blockly.JavaScript.ORDER_ATOMIC);
  if (value_num1 == "") {
    value_num1 = 0;
  }
   if (value_num2 == "") {
    value_num2 = 0;
  }
  // TODO: Assemble JavaScript into code variable.
  var code = value_num1 + ' * ' + value_num2;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['division'] = function(block) {
  var value_num1 = Blockly.JavaScript.valueToCode(block, 'num1', Blockly.JavaScript.ORDER_ATOMIC);
  var value_num2 = Blockly.JavaScript.valueToCode(block, 'num2', Blockly.JavaScript.ORDER_ATOMIC);
  if (value_num1 == "") {
    value_num1 = 0;
  }
   if (value_num2 == "") {
    value_num2 = 0;
  }
  // TODO: Assemble JavaScript into code variable.
  var code = value_num1 + ' / ' + value_num2;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['less_than'] = function(block) {
  var value_num1 = Blockly.JavaScript.valueToCode(block, 'num1', Blockly.JavaScript.ORDER_ATOMIC);
  var value_num2 = Blockly.JavaScript.valueToCode(block, 'num2', Blockly.JavaScript.ORDER_ATOMIC);
  if (value_num1 == "") {
    value_num1 = 0;
  }
   if (value_num2 == "") {
    value_num2 = 0;
  }
  // TODO: Assemble JavaScript into code variable.
  var code = value_num1 + ' < ' + value_num2;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['exceed'] = function(block) {
  var value_num1 = Blockly.JavaScript.valueToCode(block, 'num1', Blockly.JavaScript.ORDER_ATOMIC);
  var value_num2 = Blockly.JavaScript.valueToCode(block, 'num2', Blockly.JavaScript.ORDER_ATOMIC);
  if (value_num1 == "") {
    value_num1 = 0;
  }
   if (value_num2 == "") {
    value_num2 = 0;
  }
  // TODO: Assemble JavaScript into code variable.
  var code = value_num1 + ' > ' + value_num2;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['equal'] = function(block) {
  var value_num1 = Blockly.JavaScript.valueToCode(block, 'num1', Blockly.JavaScript.ORDER_ATOMIC);
  var value_num2 = Blockly.JavaScript.valueToCode(block, 'num2', Blockly.JavaScript.ORDER_ATOMIC);
  if (value_num1 == "") {
    value_num1 = 0;
  }
   if (value_num2 == "") {
    value_num2 = 0;
  }
  // TODO: Assemble JavaScript into code variable.
  var code = value_num1 + ' == ' + value_num2;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['and'] = function(block) {
  var value_bool1 = Blockly.JavaScript.valueToCode(block, 'bool1', Blockly.JavaScript.ORDER_ATOMIC);
  var value_bool2 = Blockly.JavaScript.valueToCode(block, 'bool2', Blockly.JavaScript.ORDER_ATOMIC);
  if (value_bool1 == "") {
    value_bool1 = "false";
  }
   if (value_bool2 == "") {
    value_bool2 = "false";
  }
  // TODO: Assemble JavaScript into code variable.
  var code = value_bool1 + ' && ' + value_bool2;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['or'] = function(block) {
  var value_bool1 = Blockly.JavaScript.valueToCode(block, 'bool1', Blockly.JavaScript.ORDER_ATOMIC);
  var value_bool2 = Blockly.JavaScript.valueToCode(block, 'bool2', Blockly.JavaScript.ORDER_ATOMIC);
  if (value_bool1 == "") {
    value_bool1 = "false";
  }
   if (value_bool2 == "") {
    value_bool2 = "false";
  }
  // TODO: Assemble JavaScript into code variable.
  var code = value_bool1 + ' || ' + value_bool2;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['not'] = function(block) {
  var value_bool = Blockly.JavaScript.valueToCode(block, 'bool', Blockly.JavaScript.ORDER_ATOMIC);
  if (value_bool == "") {
    value_bool = '(false)';
  }
  // TODO: Assemble JavaScript into code variable.
  var code = '!' + value_bool;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['string_connect'] = function(block) {
  var value_str1 = Blockly.JavaScript.valueToCode(block, 'str1', Blockly.JavaScript.ORDER_ATOMIC);
  var value_str2 = Blockly.JavaScript.valueToCode(block, 'str2', Blockly.JavaScript.ORDER_ATOMIC);
  if (value_str1 == "") {
    value_str1 = "''";
  }
   if (value_str2 == "") {
    value_str2 = "''";
  }
  // TODO: Assemble JavaScript into code variable.
  var code = value_str1 + ' + ' + value_str2;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['string_num'] = function(block) {
  var value_str = Blockly.JavaScript.valueToCode(block, 'str', Blockly.JavaScript.ORDER_ATOMIC);
  var value_num = Blockly.JavaScript.valueToCode(block, 'num', Blockly.JavaScript.ORDER_ATOMIC);
  if (value_str == "") {
    value_str = "''";
  }
   if (value_num == "") {
    value_num = 0;
  }
  // TODO: Assemble JavaScript into code variable.
  var code = value_str + '[' + value_num + ']';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['string_length'] = function(block) {
  var value_str = Blockly.JavaScript.valueToCode(block, 'str', Blockly.JavaScript.ORDER_ATOMIC);
  if (value_str == "") {
    value_str = "''";
  }
  // TODO: Assemble JavaScript into code variable.
  var code = value_str + '.length';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['division_remainder'] = function(block) {
  var value_num1 = Blockly.JavaScript.valueToCode(block, 'num1', Blockly.JavaScript.ORDER_ATOMIC);
  var value_num2 = Blockly.JavaScript.valueToCode(block, 'num2', Blockly.JavaScript.ORDER_ATOMIC);
  if (value_num1 == "") {
    value_num1 = 0;
  }
   if (value_num2 == "") {
    value_num2 = 0;
  }
  // TODO: Assemble JavaScript into code variable.
  var code = value_num1 + ' % ' + value_num2;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['round'] = function(block) {
  var value_num = Blockly.JavaScript.valueToCode(block, 'num', Blockly.JavaScript.ORDER_ATOMIC);
  var dropdown_name = block.getFieldValue('NAME');
  // TODO: Assemble JavaScript into code variable.
  if (value_num == "") {
    value_num = 0;
  }
  switch (dropdown_name) {
    case 'round_off':
      var code = 'Math.round(' + value_num + ')';
      break;
    case 'round_up':
      var code = 'Math.ceil(' + value_num + ')';
      break;
    case 'round_down':
      var code = 'Math.floor(' + value_num + ')';
      break;
  }

  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['calculation'] = function(block) {
  var value_num = Blockly.JavaScript.valueToCode(block, 'num', Blockly.JavaScript.ORDER_ATOMIC);
  var dropdown_name = block.getFieldValue('NAME');
  // TODO: Assemble JavaScript into code variable.
  if (value_num == "") {
    value_num = 0;
  }
  switch (dropdown_name) {
    case 'absoult_val':
      var code = 'Math.abs(' + value_num + ')';
      break;
    case 'root':
      var code = 'Math.sqrt(' + value_num + ')';
      break;
    case 'sin':
      var code = 'Math.sin(' + value_num + ')';
      break;
    case 'cos':
      var code = 'Math.cos(' + value_num + ')';
      break;
    case 'tan':
      var code = 'Math.tan(' + value_num + ')';
      break;
    case 'asin':
      var code = 'Math.asin(' + value_num + ')';
      break;
    case 'acos':
      var code = 'Math.acos(' + value_num + ')';
      break;
    case 'atan':
      var code = 'Math.atan(' + value_num + ')';
      break;
    case 'log':
      var code = 'Math.log(' + value_num + ')';
      break;
    case 'e^':
      var code = 'Math.E ** ' + value_num;
      break;
    case '10^':
      var code = '10 ** ' + value_num;
      break;
  }
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['string_include'] = function(block) {
  var value_str1 = Blockly.JavaScript.valueToCode(block, 'str1', Blockly.JavaScript.ORDER_ATOMIC);
  var value_str2 = Blockly.JavaScript.valueToCode(block, 'str2', Blockly.JavaScript.ORDER_ATOMIC);
  if (value_str1 == "") {
    value_str1 = "''";
  }
   if (value_str2 == "") {
    value_str2 = "''";
  }
  code = value_str1 + '.indexOf(' + value_str2 + ') != -1';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};


Blockly.JavaScript['time'] = function(block) {
  var dropdown_name = block.getFieldValue('NAME');
  // TODO: Assemble JavaScript into code variable.
  switch (dropdown_name) {
    case 'year':
      var code = 'new Date().getFullYear()';
      break;
    case 'month':
      var code = 'new Date().getMonth()';
      break;
    case 'day':
      var code = 'new Date().getDate()';
      break;
    case 'dayOfWeek':
      var code = 'new Date().getDay()';
      break;
    case 'hours':
      var code = 'new Date().getHours()';
      break;
    case 'minutes':
      var code = 'new Date().getMinutes()';
      break;
    case 'seconds':
      var code = 'new Date().getSeconds()';
      break;

  }

  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['unix_time'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = 'Date.now()';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['variable'] = function(block) {
  var variable_name = Blockly.JavaScript.nameDB_.getName(block.getFieldValue('NAME'), Blockly.Variables.NAME_TYPE);
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['set_variable'] = function(block) {
  var variable_name = Blockly.JavaScript.nameDB_.getName(block.getFieldValue('NAME'), Blockly.Variables.NAME_TYPE);
  var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['update_variable'] = function(block) {
  var variable_name = Blockly.JavaScript.nameDB_.getName(block.getFieldValue('NAME'), Blockly.Variables.NAME_TYPE);
  var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};