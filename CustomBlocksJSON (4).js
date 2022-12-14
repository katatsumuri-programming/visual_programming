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