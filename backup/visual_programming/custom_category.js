class CustomCategory extends Blockly.ToolboxCategory {
    /**
     * Constructor for a custom category.
     * @override
     */
    addColourBorder_(colour){
        this.rowDiv_.style.backgroundColor = "white";
        this.rowDiv_.style.padding = "5px";
        this.iconDom_.style.backgroundColor = this.colour_;
      }
    setSelected(isSelected){
        // We do not store the label span on the category, so use getElementsByClassName.
        var labelDom = this.rowDiv_.getElementsByClassName('blocklyTreeLabel')[0];
        if (isSelected) {
          // Change the background color of the div to white.
          this.rowDiv_.style.backgroundColor = '#eee';
          // Set the colour of the text to the colour of the category.
          labelDom.style.color = this.colour_;
          this.iconDom_.style.backgroundColor = this.colour_;
        } else {
          // Set the background back to the original colour.
          this.rowDiv_.style.backgroundColor = "white";
          // Set the text back to white.
          labelDom.style.color = 'black';
          this.iconDom_.style.backgroundColor = this.colour_;
        }
        // This is used for accessibility purposes.
        Blockly.utils.aria.setState(/** @type {!Element} */ (this.htmlDiv_),
            Blockly.utils.aria.State.SELECTED, isSelected);
     }
}

Blockly.registry.register(
    Blockly.registry.Type.TOOLBOX_ITEM,
    Blockly.ToolboxCategory.registrationName,
    CustomCategory,
    true
);