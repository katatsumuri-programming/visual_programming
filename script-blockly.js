var save = true;
var welcome = false;
var project_name = "";
var myInterpreter;
var play = false;
var last_workspace_xml;
// var code_block_generate = false;
$("#open_dialog_background").css("display", "none");
$("#error_dialog_background").css("display", "none");
Blockly.HSV_SATURATION = 0.9;
Blockly.HSV_VALUE = 0.7;
Blockly.Flyout.prototype.autoClose=false;

// window.LoopTrap = 1000000000;
// Blockly.JavaScript.INFINITE_LOOP_TRAP = 'if(--window.LoopTrap == 0) throw "Infinite loop.";\n';

var workspace = Blockly.inject('blocklyArea',
    {
        toolbox: $("#toolbox").get(0),
        renderer: 'zelos',
        // theme: dark
        autoClose: false,
        collapse: false,
        zoom: {
            controls: true,
            wheel: true,
            startScale: 0.7,
            maxScale: 3,
            minScale: 0.3
        },

    }
);


workspace.addChangeListener(function() {
    save = false;
    if ($("#auto_code_create").prop('checked')) {
        // if  (code_block_generate == false) {
            // code_block_generate = true;
            const code = Blockly.JavaScript.workspaceToCode(workspace);

            var doc = editor.getDoc();
            doc.setValue(code);
            editor.save();
            // code_block_generate = false;
        // }
    }
    if ($("#auto_save").prop('checked') && !($("#filename").val() == "Untitled")) {
        var xml = Blockly.Xml.workspaceToDom(workspace);
        var myBlockXml = Blockly.Xml.domToText(xml);
        // console.log(myBlockXml);
        var code = editor.getValue();
        var console_output = output_eval.getValue();
        var data = {
            "block_xml": myBlockXml,
            "code": code,
            "console_output": console_output
        };
        var setjson = JSON.stringify(data);
        localStorage.setItem($("#filename").val(), setjson);
        save = true;
    } else {
        save = false;
    }

});

$("#create_code").click(function () {

    const code = Blockly.JavaScript.workspaceToCode(workspace);

    var doc = editor.getDoc();
    doc.setValue(code);
    editor.save();
});
$("#create_block").click(function () {
    try {
        var code = editor.getValue();
        var xml = parseCode(code);
        last_workspace_xml = Blockly.Xml.workspaceToDom(workspace);
        workspace.clear()
        Blockly.Xml.appendDomToWorkspace(xml, workspace)
    } catch (error) {
        console.log(error)
        if (!(error == "TypeError: Next block does not have previous statement.")) {
            $("#error_text").val(error)
            $("#error_dialog_background").css("display", "block");
        } else {
            $("#error_text").val("無効な命令があります")
            $("#error_dialog_background").css("display", "block");
            workspace.clear()
            Blockly.Xml.appendDomToWorkspace(last_workspace_xml, workspace)
        }
    }
});



function initApi(interpreter, globalObject) {
    // Add an API function for the alert() block.
    var wrapper = function(text) {
      return alert(arguments.length ? text : '');
    };
    interpreter.setProperty(globalObject, 'alert',
        interpreter.createNativeFunction(wrapper));

    // Add an API function for the alert() block.
    var wrapper = function(text) {
        return output(arguments.length ? text : '');
      };
    interpreter.setProperty(globalObject, 'output',
        interpreter.createNativeFunction(wrapper));


    // Add an API function for the prompt() block.
    wrapper = function(text) {
      return prompt(text);
    };
    interpreter.setProperty(globalObject, 'prompt',
        interpreter.createNativeFunction(wrapper));

}
function nextStep() {
    try {
        if (myInterpreter.step() && play) {
            setTimeout(nextStep, 0.1);
        } else {
            $("#execution .material-symbols-outlined").text("play_arrow");
            play = false;
        }
    } catch (error) {
        console.log(error)
    }
}



$("#execution").click(function() {
    console.log(Blockly.Xml.workspaceToDom(workspace))
    if (play) {
        $("#execution .material-symbols-outlined").text("play_arrow");
        play = false;
    } else {
        var doc = output_eval.getDoc();
        doc.setValue("");
        var code = editor.getValue();
        myInterpreter = new Interpreter(code, initApi);
        // generateBlock(code);
        try {
            // eval(code);

            // myInterpreter.run();
            $("#execution .material-symbols-outlined").text("pause");
            play = true;
            nextStep();

        } catch (error) {
            var doc = output_eval.getDoc();
            doc.setValue(error.toString());
        }
        if ($("#auto_save").prop('checked') && !($("#filename").val() == "Untitled")) {
            var xml = Blockly.Xml.workspaceToDom(workspace);
            var myBlockXml = Blockly.Xml.domToText(xml);
            // console.log(myBlockXml);
            var code = editor.getValue();
            var console_output = output_eval.getValue();
            var data = {
                "block_xml": myBlockXml,
                "code": code,
                "console_output": console_output
            };
            var setjson = JSON.stringify(data);
            localStorage.setItem($("#filename").val(), setjson);
            save = true;
        } else {
            save = false;
        }
    }
})


output = function(msg){
    var doc = output_eval.getDoc();
    doc.setValue(output_eval.getValue() + msg + "\n");
    $(".CodeMirror-scroll").scrollTop(
        $(".CodeMirror-scroll").eq(1)[0].scrollHeight - $(".CodeMirror-scroll").eq(1).height()
    );
}

$("#consoleclear").click(function(){
    save = false;
    var doc = output_eval.getDoc();
    doc.setValue("");
})


$("#undo").click(function () {
    workspace.undo(false);
});
$("#redo").click(function () {
    workspace.undo(true);
});


var editor = CodeMirror.fromTextArea(document.getElementById("codebox"),
{
    mode: "javascript",
    lineNumbers: true,
    theme: "darcula",

});
editor.setSize("50%", "50%");
editor.save();

var output_eval = CodeMirror.fromTextArea(document.getElementById("codeoutput"),
{
    mode: "javascript",
    lineNumbers: true,
    theme: "darcula",

});
output_eval.setSize("50%", "calc(50% - 50px)");
output_eval.save();

// editor.on("change", function (e) {
//     console.log(e)
//     if (code_block_generate == false) {

//         code_block_generate = true;
//         var code = editor.getValue();
//         try {
//             var xml = parseCode(code);
//             workspace.clear()
//             Blockly.Xml.appendDomToWorkspace(xml, workspace)
//         } catch (error) {}



//         code_block_generate = false;
//     }
// })

$("#file_menu").click(function() {
    $('#edit_dropdown').css('display', 'none');
    $("#file_dropdown").toggle();
})
$("#edit_menu").click(function() {
    $('#file_dropdown').css('display', 'none');
    $("#edit_dropdown").toggle();
})
$(document).on('click touchend', function(event) {
    // 表示したポップアップ以外の部分をクリックしたとき
    if (!$(event.target).closest('#file_menu').length) {
        $('#file_dropdown').css('display', 'none');
    }
    if (!$(event.target).closest('#edit_menu').length) {
        $("#edit_dropdown").css('display', 'none');
    }
});


$("#save_computer").click(function () {
    var xml = Blockly.Xml.workspaceToDom(workspace);
    var myBlockXml = Blockly.Xml.domToText(xml);
    // console.log(myBlockXml);
    var code = editor.getValue();
    var console_output = output_eval.getValue();
    var data = {
        "block_xml": myBlockXml,
        "code": code,
        "console_output": console_output
    };
    const json = JSON.stringify(data, null, '  ');
    const blob = new Blob([json], { type: 'application/json' });
    let dummy_a_el = document.createElement('a');
    document.body.appendChild(dummy_a_el);
    dummy_a_el.href = window.URL.createObjectURL(blob);
    dummy_a_el.download = $("#filename").val();
    dummy_a_el.click();
    document.body.removeChild(dummy_a_el);
})
$("#load_computer").click(function () {
    var value = true;
    if (editor.getValue() != "") {
        value = window.confirm("編集中のプロジェクトが削除されます。\nよろしいですか?");
    }
    if (value) {
        input_el = document.createElement('input');
        document.body.appendChild(input_el);
        input_el.type = "file";
        input_el.accept = ".json";
        input_el.click();

        input_el.addEventListener("change", function(evt){
            var file = evt.target.files[0];
            document.body.removeChild(input_el);
            // console.log(file);
            let reader = new FileReader();
            reader.readAsText(file, 'UTF-8');
            reader.onload = ()=> {
                let result = JSON.parse(reader.result);
                // console.log(result);
                // console.log(result["block_xml"]);
                var xml = Blockly.Xml.textToDom(result["block_xml"]);
                workspace.clear();
                Blockly.Xml.domToWorkspace(xml, workspace);
                $("#filename").val(file["name"].match(/([^/]*)\./)[1]);
                project_name = $("#filename").val();
                var doc = output_eval.getDoc();
                doc.setValue(result["console_output"]);
                var doc = editor.getDoc();
                doc.setValue(result["code"]);
            };
        },false);
    }
})

$("#overwrite_browser").click(function(){
    var xml = Blockly.Xml.workspaceToDom(workspace);
    var myBlockXml = Blockly.Xml.domToText(xml);
    // console.log(myBlockXml);
    var code = editor.getValue();
    var console_output = output_eval.getValue();
    var data = {
        "block_xml": myBlockXml,
        "code": code,
        "console_output": console_output
    };
    var setjson = JSON.stringify(data);
    localStorage.setItem($("#filename").val(), setjson);
    save = true;
})

function save_browser() {
    var same = false;
    var filename = window.prompt('ファイル名を入力してください');
    for (var i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i) == filename) {
            same = true;
        }
    }
    if (same) {
        var override = window.confirm("同じ名前のファイルがあります。上書きしますか？");
        if (override) {
            return filename;
        } else {
            save_browser();
        }
    } else {
        return filename;
    }
}

$("#save_browser").click(function(){
    var xml = Blockly.Xml.workspaceToDom(workspace);
    var myBlockXml = Blockly.Xml.domToText(xml);
    // console.log(myBlockXml);
    var code = editor.getValue();
    var console_output = output_eval.getValue();
    var data = {
        "block_xml": myBlockXml,
        "code": code,
        "console_output": console_output
    };
    file_name = save_browser();
    if (!(file_name == "" || file_name == "undefined" || file_name == null)) {
        var setjson = JSON.stringify(data);
        localStorage.setItem(file_name, setjson);
        save = true;
    } else {
        window.alert("保存できませんでした。")
    }
})

$("#load_browser").click(function() {
    var value = true;
    if (!save) {
        value = window.confirm("編集中のプロジェクトが削除されます。\nよろしいですか?");
    }
    if (value) {
        for (var i = 0; i < localStorage.length; i++) {
            var filename = localStorage.key(i);
            var p_tag = $("<p class='filename'></p>");
            var input_tag = $("<input type='radio' name='filename'>");
            var label_tag = $("<label for='file1'></label>");
            var delete_button = $("<span id='delete'></span>");
            input_tag.attr("id", filename);
            label_tag.attr("for", filename);
            label_tag.text(filename);
            label_tag.append(delete_button);
            p_tag.append(input_tag);
            p_tag.append(label_tag);

            $("#file_lists").append(p_tag);
        }
        $("#open_dialog_background").css("display", "block");

    }
})
$("#close").click(function() {
    $("#error_dialog_background").css("display", "none");
})

$("#cancel").click(function() {

    if (welcome) {
        $("#open_dialog_background").css("display", "block");
        welcome = true;
    } else {
        $("#open_dialog_background").css("display", "none");
        $("#file_lists").empty();
        welcome = false;
    }
})
$("#open").click(function() {
    $("#open_dialog_background").css("display", "none");
    welcome = false;
    const filename = $('input:radio[name="filename"]:checked').attr("id");
    $("#file_lists").empty();
    // console.log(filename);
    let result = JSON.parse(localStorage.getItem(filename));
    // console.log(result);
    // console.log(result["block_xml"]);
    var xml = Blockly.Xml.textToDom(result["block_xml"]);
    workspace.clear();
    Blockly.Xml.domToWorkspace(xml, workspace);
    $("#filename").val(filename);
    project_name = $("#filename").val();
    var doc = output_eval.getDoc();
    doc.setValue(result["console_output"]);
    var doc = editor.getDoc();
    doc.setValue(result["code"]);
})
window.onload = function() {
    welcome = true;
    // $("#name_prompt_background").css("display", "block");
    $("#open_dialog_background").css("display", "block");
    // welcome = true;
    for (var i = 0; i < localStorage.length; i++) {
        var filename = localStorage.key(i);
        var p_tag = $("<p class='filename'></p>");
        var input_tag = $("<input type='radio' name='filename'>");
        var label_tag = $("<label for='file1'></label>");
        var delete_button = $("<span id='delete'></span>");
        input_tag.attr("id", filename);
        label_tag.attr("for", filename);
        label_tag.text(filename);
        label_tag.append(delete_button);
        p_tag.append(input_tag);
        p_tag.append(label_tag);
        $("#file_lists").append(p_tag);
    }
}
function new_file() {

    var same = false;
    var filename = window.prompt('ファイル名を入力してください');
    if (!(filename == "" || filename == "undefined" || filename == null)) {
        for (var i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i) == filename) {
                same = true;
            }
        }
        if (same) {
            var override = window.confirm("同じ名前のファイルがあります。上書きしますか？");
            if (override) {
                var doc = editor.getDoc();
                doc.setValue("");
                var doc = output_eval.getDoc();
                doc.setValue("");
                workspace.clear();
                project_name = filename;
                var xml = Blockly.Xml.workspaceToDom(workspace);
                var myBlockXml = Blockly.Xml.domToText(xml);
                var data = {
                    "block_xml": myBlockXml,
                    "code": "",
                    "console_output": ""
                };
                localStorage.removeItem(project_name);
                var setjson = JSON.stringify(data);
                localStorage.setItem(project_name, setjson);
                save = true;
                welcome = false;
                $("#filename").val(project_name);
                $("#open_dialog_background").css("display", "none");
                $("#file_lists").empty();
            }
        } else {
            var doc = editor.getDoc();
            doc.setValue("");
            var doc = output_eval.getDoc();
            doc.setValue("");
            workspace.clear();
            project_name = filename;
            var xml = Blockly.Xml.workspaceToDom(workspace);
            var myBlockXml = Blockly.Xml.domToText(xml);
            var data = {
                "block_xml": myBlockXml,
                "code": "",
                "console_output": ""
            };
            localStorage.removeItem(project_name);
            var setjson = JSON.stringify(data);
            localStorage.setItem(project_name, setjson);
            $("#filename").val(project_name);
            save = true;
            welcome = false;
            $("#open_dialog_background").css("display", "none");
            $("#file_lists").empty();
        }
    }
}
$("#open_dialog_newfile").click(function() {
    new_file();
})

$("#new_file").click(function() {
    new_file();
})

$("#delete_project").click(function() {
    var delete_project = window.confirm("本当にプロジェクトを削除しますか？");
    if (delete_project) {

        welcome = true;
        localStorage.removeItem(project_name);
        $("#open_dialog_background").css("display", "block");
        // welcome = true;
        for (var i = 0; i < localStorage.length; i++) {
            var filename = localStorage.key(i);
            var p_tag = $("<p class='filename'></p>");
            var input_tag = $("<input type='radio' name='filename'>");
            var label_tag = $("<label for='file1'></label>");
            var delete_button = $("<span id='delete'></span>");
            input_tag.attr("id", filename);
            label_tag.attr("for", filename);
            label_tag.text(filename);
            label_tag.append(delete_button);
            p_tag.append(input_tag);
            p_tag.append(label_tag);
            $("#file_lists").append(p_tag);
        }
    }
})


$(document).on('click', '#delete', function(){
  var filename = $(this).parent().text();
  var delete_project = window.confirm("本当にプロジェクトを削除しますか？");
    if (delete_project) {
        $("#file_lists").empty();
        welcome = true;
        localStorage.removeItem(filename);
        // welcome = true;
        for (var i = 0; i < localStorage.length; i++) {
            var filename = localStorage.key(i);
            var p_tag = $("<p class='filename'></p>");
            var input_tag = $("<input type='radio' name='filename'>");
            var label_tag = $("<label for='file1'></label>");
            var delete_button = $("<span id='delete'></span>");
            input_tag.attr("id", filename);
            label_tag.attr("for", filename);
            label_tag.text(filename);
            label_tag.append(delete_button);
            p_tag.append(input_tag);
            p_tag.append(label_tag);
            $("#file_lists").append(p_tag);
        }
    }
});

$("#filename").change(function() {


    var xml = Blockly.Xml.workspaceToDom(workspace);
    var myBlockXml = Blockly.Xml.domToText(xml);
    // console.log(myBlockXml);
    var code = editor.getValue();
    var console_output = output_eval.getValue();
    var data = {
        "block_xml": myBlockXml,
        "code": code,
        "console_output": console_output
    };

    var same = false;
    for (var i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i) == $("#filename").val()) {
            same = true;
        }
    }
    if (same) {
        $("#filename").val(project_name);
        window.alert("名前を変更できませんでした。")
    } else {
        localStorage.removeItem(project_name);
        var setjson = JSON.stringify(data);
        localStorage.setItem($("#filename").val(), setjson);
        project_name = $("#filename").val();
        save = true;
        window.alert("名前を変更しました。")
    }

})