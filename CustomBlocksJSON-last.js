Blockly.Blocks['if_else'] = {
  init: function() {
    this.appendValueInput("conditions")
        .setCheck("Boolean")
        .appendField("もし");
    this.appendDummyInput()
        .appendField("なら");
    this.appendStatementInput("contents")
        .setCheck(null);
    this.appendDummyInput()
        .appendField("でなければ");
    this.appendStatementInput("else")
        .setCheck(null);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(60);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['if'] = {
  init: function() {
    this.appendValueInput("conditions")
        .setCheck("Boolean")
        .appendField("もし");
    this.appendDummyInput()
        .appendField("なら");
    this.appendStatementInput("contents")
        .setCheck(null);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(60);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['output'] = {
  init: function() {
    this.appendValueInput("output")
        .setCheck(null)
        .appendField("出力");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(165);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
Blockly.Blocks['for'] = {
  init: function() {
    this.appendValueInput("number")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField("回繰り返す");
    this.appendStatementInput("contents")
        .setCheck(null);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(60);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['forever'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("ずっと");
    this.appendStatementInput("contents")
        .setCheck(null);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(60);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['while'] = {
  init: function() {
    this.appendValueInput("num")
        .setCheck("Boolean");
    this.appendDummyInput()
        .appendField("の間繰り返す");
    this.appendStatementInput("contents")
        .setCheck(null);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(60);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['plus'] = {
  init: function() {
    this.appendValueInput("num1")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField("+");
    this.appendValueInput("num2")
        .setCheck("Number");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(105);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['minus'] = {
  init: function() {
    this.appendValueInput("num1")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField("-");
    this.appendValueInput("num2")
        .setCheck("Number");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(105);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['multiplication'] = {
  init: function() {
    this.appendValueInput("num1")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField("*");
    this.appendValueInput("num2")
        .setCheck("Number");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(105);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['division'] = {
  init: function() {
    this.appendValueInput("num1")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField("/");
    this.appendValueInput("num2")
        .setCheck("Number");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(105);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['less_than'] = {
  init: function() {
    this.appendValueInput("num1")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField("<");
    this.appendValueInput("num2")
        .setCheck("Number");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(120);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['exceed'] = {
  init: function() {
    this.appendValueInput("num1")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField(">");
    this.appendValueInput("num2")
        .setCheck("Number");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(120);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['equal'] = {
  init: function() {
    this.appendValueInput("num1")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField("=");
    this.appendValueInput("num2")
        .setCheck("Number");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(135);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['and'] = {
  init: function() {
    this.appendValueInput("bool1")
        .setCheck("Boolean");
    this.appendDummyInput()
        .appendField("かつ");
    this.appendValueInput("bool2")
        .setCheck("Boolean");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(135);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['or'] = {
  init: function() {
    this.appendValueInput("bool1")
        .setCheck("Boolean");
    this.appendDummyInput()
        .appendField("または");
    this.appendValueInput("bool2")
        .setCheck("Boolean");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(135);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['not'] = {
  init: function() {
    this.appendValueInput("bool")
        .setCheck("Boolean");
    this.appendDummyInput()
        .appendField("ではない");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(135);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['string_connect'] = {
  init: function() {
    this.appendValueInput("str1")
        .setCheck("String");
    this.appendDummyInput()
        .appendField("と");
    this.appendValueInput("str2")
        .setCheck("String");
    this.setInputsInline(true);
    this.setOutput(true, "String");
    this.setColour(150);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['string_num'] = {
  init: function() {
    this.appendValueInput("str")
        .setCheck("String");
    this.appendDummyInput()
        .appendField("の");
    this.appendValueInput("num")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField("番目の文字");
    this.setInputsInline(true);
    this.setOutput(true, "String");
    this.setColour(150);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['string_length'] = {
  init: function() {
    this.appendValueInput("str")
        .setCheck("String");
    this.appendDummyInput()
        .appendField("の長さ");
    this.setInputsInline(true);
    this.setOutput(true, "String");
    this.setColour(150);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['division_remainder'] = {
  init: function() {
    this.appendValueInput("num1")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField("を");
    this.appendValueInput("num2")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField("で割ったあまり");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(150);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['round'] = {
  init: function() {
    this.appendValueInput("num")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField("を")
        .appendField(new Blockly.FieldDropdown([["四捨五入","round_off"], ["切り上げ","round_up"], ["切り捨て","round_down"]]), "NAME");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(150);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['calculation'] = {
  init: function() {
    this.appendValueInput("num")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField("の")
        .appendField(new Blockly.FieldDropdown([["絶対値","absoult_val"], ["平方根","root"], ["sin","sin"], ["cos","cos"], ["tan","tan"], ["asin","asin"], ["acos","acos"], ["atan","atan"], ["log","log"], ["e^","e^"], ["10^","10^"]]), "NAME");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(150);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['string_include'] = {
  init: function() {
    this.appendValueInput("str1")
        .setCheck("String");
    this.appendDummyInput()
        .appendField("に");
    this.appendValueInput("str2")
        .setCheck("String");
    this.appendDummyInput()
        .appendField("が含まれる");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(150);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};


Blockly.Blocks['time'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("現在の")
        .appendField(new Blockly.FieldDropdown([["年","year"], ["月","month"], ["日","day"], ["曜日","dayOfWeek"], ["時","hours"], ["分","minutes"], ["秒","seconds"]]), "NAME");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(195);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['unix_time'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("1970年からの秒数(ミリ秒)");
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(195);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['variable'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldVariable("item"), "NAME");
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(345);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['set_variable'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldVariable("item"), "NAME")
        .appendField("を");
    this.appendValueInput("NAME")
        .setCheck(null);
    this.appendDummyInput()
        .appendField("にする");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(345);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['update_variable'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldVariable("item"), "NAME")
        .appendField("を");
    this.appendValueInput("NAME")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField("ずつ変える");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(345);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};