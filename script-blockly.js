Blockly.HSV_SATURATION = 0.9;
Blockly.HSV_VALUE = 0.7;
var workspace = Blockly.inject('blocklyArea',
    {
        toolbox: $("#toolbox").get(0),
        renderer: 'thrasos',

        theme: Blockly.Theme.defineTheme('dark', {

                "colourPrimary": "#4a148c",
                "colourSecondary":"#AD7BE9",
                "colourTertiary":"#CDB6E9",
              'workspaceBackgroundColour': '#1e1e1e',

        })
    }
);

workspace.addChangeListener(function() {
    const codebox = $("#codebox");
    const code = Blockly.JavaScript.workspaceToCode(workspace);

    $("#codebox").html(code);
});
$("#execution").click(function() {
    const codebox = document.getElementById("codebox");
    const code = Blockly.JavaScript.workspaceToCode(workspace);

    $("#codebox").html(code);
    try {
        eval(code);
    } catch (error) {
        $("#codeoutput").html($("#codeoutput").html() + "<span id='error'>" + error + "</span>\n");
    }
})


console.log = function(msg){
	$("#codeoutput").html($("#codeoutput").html() + msg + "\n");
}
$("#consoleclear").click(function(){
    $("#codeoutput").html("");
})