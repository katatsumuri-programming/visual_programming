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

Blockly.Blocks['javascript'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput("if (true)"), "code")
        .appendField("{");
    this.appendStatementInput("contents")
        .setCheck(null);
    this.appendDummyInput()
        .appendField("}");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(60);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['javascript_order'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput(""), "code");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(60);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['question_block'] = {
  /**
   * Block for appending to a variable in place.
   * @this Blockly.Block
   */
  init: function() {
    this.appendValueInput("TEXT")
        .setCheck(null);
    this.appendDummyInput()
        .appendField("と聞いて")
        .appendField(new Blockly.FieldVariable("answer"), 'VAR')
        .appendField("に入れる");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(165);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['simple_for'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldVariable(null), "VAR")
        .appendField("で");
    this.appendValueInput("NUM")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField("回繰り返す");
    this.appendStatementInput("DO")
        .setCheck(null);
    this.setInputsInline(true);
    this.setColour(120);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("");
    this.setHelpUrl("");
  }
}