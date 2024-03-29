//--------------------------------------------------------------initialize----------------------------------------------------------------------
var save = true;
var welcome = false;
var project_name = "";
var myInterpreter;
var play = false;
var last_workspace_xml;
var project_id = null;
var edit = true;
$("#auto_save").prop('checked', false)
// var code_block_generate = false;
$("#open_dialog_background").css("display", "none");
$("#error_dialog_background").css("display", "none");
Blockly.HSV_SATURATION = 0.9;
Blockly.HSV_VALUE = 0.7;
Blockly.Flyout.prototype.autoClose=false;

// // firebase initialize
// const config = {
//     apiKey: "AIzaSyC2YSVVGd3YbIenCscwh1jW6z43lsRNUBM",
//     authDomain: "visualprogramming-2e51d.firebaseapp.com",
//     projectId: "visualprogramming-2e51d",
//     storageBucket: "visualprogramming-2e51d.appspot.com",
//     messagingSenderId: "405243814608",
//     appId: "1:405243814608:web:399562455ed5148b83f4d5",
//     measurementId: "G-72TZ0MNMCF"
// };
// firebase.initializeApp(config);
// var db = firebase.firestore();

// function initialize
function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
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
                project_id = null;
                edit = true;
                var doc = editor.getDoc();
                doc.setValue("");
                var doc = output_eval.getDoc();
                doc.setValue("");
                workspace.clear();
                project_name = filename;
                var dom = (new DOMParser()).parseFromString("<xml><block type='start_block'></block></xml>", "application/xml").documentElement;
                Blockly.Xml.appendDomToWorkspace(dom, workspace)
                var xml = Blockly.Xml.workspaceToDom(workspace);
                var myBlockXml = Blockly.Xml.domToText(xml);
                var data = {
                    "block_xml": myBlockXml,
                    "code": "",
                    "console_output": "",
                    "project_id": null,
                    "timestamp": new Date(),
                    "settings": {
                        "auto_save": $("#auto_save").prop('checked'),
                        "auto_generate_code": $("#auto_code_create").prop('checked'),
                        "turbo_mode": $("#turbo_mode").prop('checked'),
                    }
                };
                localStorage.removeItem(project_name);
                var setjson = JSON.stringify(data);
                localStorage.setItem(project_name, setjson);
                save = true;
                welcome = false;
                $("#filename").val(project_name);
                $("#open_dialog_background").css("display", "none");
                $("#file_lists").empty();
                var urlSearchParams = new URLSearchParams(location.search)
                urlSearchParams.delete("projectId")
                urlSearchParams.set("projectName", project_name)
                history.replaceState("", "", `?${urlSearchParams.toString()}`)
            }
        } else {
            project_id = null;
            edit = true;
            var doc = editor.getDoc();
            doc.setValue("");
            var doc = output_eval.getDoc();
            doc.setValue("");
            workspace.clear();
            project_name = filename;
            var dom = (new DOMParser()).parseFromString("<xml><block type='start_block'></block></xml>", "application/xml").documentElement;
            Blockly.Xml.appendDomToWorkspace(dom, workspace)
            var xml = Blockly.Xml.workspaceToDom(workspace);
            var myBlockXml = Blockly.Xml.domToText(xml);
            var data = {
                "block_xml": myBlockXml,
                "code": "",
                "console_output": "",
                "project_id": project_id,
                "timestamp": new Date(),
                "settings": {
                    "auto_save": $("#auto_save").prop('checked'),
                    "auto_generate_code": $("#auto_code_create").prop('checked'),
                    "turbo_mode": $("#turbo_mode").prop('checked'),
                }
            };
            localStorage.removeItem(project_name);
            var setjson = JSON.stringify(data);
            localStorage.setItem(project_name, setjson);
            $("#filename").val(project_name);
            save = true;
            welcome = false;
            $("#open_dialog_background").css("display", "none");
            $("#file_lists").empty();
            var urlSearchParams = new URLSearchParams(location.search)
            urlSearchParams.delete("projectId")
            urlSearchParams.set("projectName", project_name)
            history.replaceState("", "", `?${urlSearchParams.toString()}`)
        }
    }
}

function overwrite() {
    var xml = Blockly.Xml.workspaceToDom(workspace);
    var myBlockXml = Blockly.Xml.domToText(xml);
    // console.log(myBlockXml);
    var code = editor.getValue();
    var console_output = output_eval.getValue();
    var data = {
        "block_xml": myBlockXml,
        "code": code,
        "console_output": console_output,
        "project_id": project_id,
        "timestamp": new Date(),
        "settings": {
            "auto_save": $("#auto_save").prop('checked'),
            "auto_generate_code": $("#auto_code_create").prop('checked'),
            "turbo_mode": $("#turbo_mode").prop('checked'),
        }
    };
    var setjson = JSON.stringify(data);
    localStorage.setItem($("#filename").val(), setjson);

    save = true;
}


//--------------------------------------------------------------workspace-----------------------------------------------------------------------

var workspace = Blockly.inject('blocklyArea',
    {
        toolbox: $("#toolbox").get(0),
        renderer: 'zelos',
        // theme: dark
        autoClose: false,
        collapse: false,
        readOnly: false,
        zoom: {
            controls: true,
            wheel: true,
            startScale: 0.7,
            maxScale: 3,
            minScale: 0.3
        },
    }
);
//workspace.addChangeListener(Blockly.Events.disableOrphans);
workspace.addChangeListener(function() {
    save = false;
    if ($("#auto_code_create").prop('checked') && (!welcome)) {
        // if  (code_block_generate == false) {
            // code_block_generate = true;
            const code = Blockly.JavaScript.workspaceToCode(workspace);
            var doc = editor.getDoc();
            doc.setValue(code);
            editor.save();
            // code_block_generate = false;
        // }
    }
    if ($("#auto_save").prop('checked') && !($("#filename").val() == "Untitled") && (!welcome)) {
        var xml = Blockly.Xml.workspaceToDom(workspace);
        var myBlockXml = Blockly.Xml.domToText(xml);
        // console.log(myBlockXml);
        var code = editor.getValue();
        var console_output = output_eval.getValue();
        var data = {
            "block_xml": myBlockXml,
            "code": code,
            "console_output": console_output,
            "project_id": project_id,
            "timestamp": new Date(),
            "settings": {
                "auto_save": $("#auto_save").prop('checked'),
                "auto_generate_code": $("#auto_code_create").prop('checked'),
                "turbo_mode": $("#turbo_mode").prop('checked'),
            }
        };
        var setjson = JSON.stringify(data);
        localStorage.setItem($("#filename").val(), setjson);
        save = true;
    } else {
        save = false;
    }

});
$("#undo").click(function () {
    workspace.undo(false);
});
$("#redo").click(function () {
    workspace.undo(true);
});

$(".undo_btn_icon").click(function () {
    workspace.undo(false);
});
$(".redo_btn_icon").click(function () {
    workspace.undo(true);
});
$(".save_btn_icon").click(function () {
    overwrite()
});
//--------------------------------------------------------------conversion process--------------------------------------------------------------

$("#create_code").click(function () {
    const code = Blockly.JavaScript.workspaceToCode(workspace);

    var doc = editor.getDoc();
    doc.setValue(code);
    editor.save();
});
$("#create_block").click(function () {
    try {
        last_workspace_xml = Blockly.Xml.workspaceToDom(workspace);
        var json_block_raw = JSON.parse(xml2json((new XMLSerializer()).serializeToString(Blockly.Xml.workspaceToDom(workspace)), { compact: true }))
        if (Array.isArray(json_block_raw["xml"]["block"])){
            json_block_raw["xml"]["block"].forEach(function(element){
                if (
                    element["_attributes"]["type"] == "start_block" ||
                    element["_attributes"]["type"] == "procedures_defnoreturn" ||
                    element["_attributes"]["type"] == "procedures_defreturn"
                ) {
                    console.log(element["_attributes"]["id"])
                    workspace.getBlockById(element["_attributes"]["id"]).dispose();
                }
            });
        } else {
            if (
                json_block_raw["xml"]["block"]["_attributes"]["type"] == "start_block" ||
                json_block_raw["xml"]["block"]["_attributes"]["type"] == "procedures_defnoreturn" ||
                json_block_raw["xml"]["block"]["_attributes"]["type"] == "procedures_defreturn"
            ) {
                console.log(json_block_raw["xml"]["block"]["_attributes"]["id"])
                workspace.getBlockById(json_block_raw["xml"]["block"]["_attributes"]["id"]).dispose()
            }
        }
        console.log(json_block_raw["xml"]["block"])
        var code = editor.getValue();
        var xml = generateBlock(code);
        // var xml = parseCode(code);

        // workspace.clear()
        xml.forEach(element => {
            Blockly.Xml.domToBlock(element, workspace)
        })

        workspace.cleanUp()
    } catch (error) {
        console.log(error)
        if (!(error == "TypeError: Next block does not have previous statement." || error == "TypeError: Next statement does not exist.")) {
            $("#error_text").val(error)
            $("#error_dialog_background").css("display", "block");
        } else {
            $("#error_text").val("無効な命令があります")
            $("#error_dialog_background").css("display", "block");

        }
        workspace.clear()
        Blockly.Xml.appendDomToWorkspace(last_workspace_xml, workspace)
    }
});

//--------------------------------------------------------------execution process---------------------------------------------------------------

function initApi(interpreter, globalObject) {
    var wrapper = function(text) {
      return alert(text);
    };
    interpreter.setProperty(globalObject, 'alert', interpreter.createNativeFunction(wrapper));

    var wrapper = function(text) {
        return output(text);
    };
    interpreter.setProperty(globalObject, 'output', interpreter.createNativeFunction(wrapper));

    wrapper = function(text) {
      return prompt(text);
    };
    interpreter.setProperty(globalObject, 'prompt', interpreter.createNativeFunction(wrapper));

    var wrapper = function(haystack, needle) {
        return textCount(haystack, needle);
    };
    interpreter.setProperty(globalObject, 'textCount', interpreter.createNativeFunction(wrapper));

    var wrapper = function(haystack, needle, replacement) {
        return textReplace(haystack, needle, replacement);
    };
    interpreter.setProperty(globalObject, 'textReplace', interpreter.createNativeFunction(wrapper));

    var wrapper = function(value, n) {
        return listsRepeat(value, n);
    };
    interpreter.setProperty(globalObject, 'listsRepeat', interpreter.createNativeFunction(wrapper));

}
function nextStep() {
    try {
        if (myInterpreter.step() && play) {
            setTimeout(nextStep, 0);
        } else {
            $("#execution .material-symbols-outlined").text("play_arrow");
            play = false;
        }
    } catch (error) {
        var doc = output_eval.getDoc();
        doc.setValue(error.toString());
        $("#execution .material-symbols-outlined").text("play_arrow");
        play = false;
    }
}
$("#execution").click(function() {
    // console.log(Blockly.Xml.workspaceToDom(workspace))
    if (play) {
        $("#execution .material-symbols-outlined").text("play_arrow");
        play = false;
    } else {
        var doc = output_eval.getDoc();
        doc.setValue("");
        var code = editor.getValue();
        // generateBlock(code);
        try {
            // eval(code);
            // myInterpreter.run();
            myInterpreter = new Interpreter(code, initApi);
            $("#execution .material-symbols-outlined").text("pause");
            play = true;
            if (!$("#turbo_mode").prop('checked')) {
                nextStep();
            } else {
                eval(code);
                // Function(code)();
                $("#execution .material-symbols-outlined").text("play_arrow");
                play = false;
            }
        } catch (error) {
            var doc = output_eval.getDoc();
            doc.setValue(error.toString());
            $("#execution .material-symbols-outlined").text("play_arrow");
            play = false;
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
                "console_output": console_output,
                "project_id": project_id,
                "timestamp": new Date(),
                "settings": {
                    "auto_save": $("#auto_save").prop('checked'),
                    "auto_generate_code": $("#auto_code_create").prop('checked'),
                    "turbo_mode": $("#turbo_mode").prop('checked'),
                }
            };
            var setjson = JSON.stringify(data);
            localStorage.setItem($("#filename").val(), setjson);
            save = true;
        } else {
            save = false;
        }
    }
})
const output = function(msg){
    var doc = output_eval.getDoc();
    doc.setValue(output_eval.getValue() + msg + "\n");
    $(".CodeMirror-scroll").scrollTop(
        $(".CodeMirror-scroll").eq(1)[0].scrollHeight - $(".CodeMirror-scroll").eq(1).height()
    );
}
const textCount = function (haystack, needle) {
    if (needle.length === 0) {
        return haystack.length + 1;
    } else {
        return haystack.split(needle).length - 1;
    }
}

const textReplace =function (haystack, needle, replacement) {
    needle = needle.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1')
                    .replace(/\x08/g, '\\x08');
    return haystack.replace(new RegExp(needle, 'g'), replacement);
}

const listsRepeat = function (value, n) {
    var array = [];
    for (var i = 0; i < n; i++) {
        array[i] = value;
    }
    return array;
}

//--------------------------------------------------------------editor process------------------------------------------------------------------

var editor = CodeMirror.fromTextArea(document.getElementById("codebox"),
{
    mode: "javascript",
    lineNumbers: true,
    theme: "darcula",

});
editor.setSize("calc(50% - 10px)", "calc(50% - 30px)");
editor.save();

var output_eval = CodeMirror.fromTextArea(document.getElementById("codeoutput"),
{
    mode: "javascript",
    lineNumbers: true,
    theme: "darcula",

});
output_eval.setSize("calc(50% - 10px)", "calc(50% - 30px)");
output_eval.save();

$("#consoleclear").click(function(){
    save = false;
    var doc = output_eval.getDoc();
    doc.setValue("");
})

let is_drag_editor = false;
let is_drag_workspace = false;

$(".editor-resizer").on('mousedown', function() {
    is_drag_editor = true;
})
$(".blocklyworkspace-resizer").on('mousedown', function() {
    is_drag_workspace = true;
})
$("body").on('mouseup', function() {
    is_drag_editor = false;
    is_drag_workspace = false;
})
$("body").on('mousemove', function(e) {
    if (is_drag_editor === true && e.pageY > 50 && ($(window).height() - 10) > e.pageY) {
        // e.pageY > 150 && ($(window).height() - 110) > e.pageY
        $(".editor-resizer").css("top", (e.pageY + "px"))
        editor.setSize(null, ((e.pageY - 50) + "px"));
        output_eval.setSize(null, ("calc(100% - " + (e.pageY + 10) + "px"));
        $(".cm-s-darcula:nth-of-type(5)").css("top", ((e.pageY + 10) + "px"));
        $("#execution").css("top", ((e.pageY - 90) + "px"))
        $("#consoleclear").css("top", ((e.pageY + 50) + "px"))

    } else if (is_drag_workspace === true && ($(window).width() - 10) > e.pageX) {
        $(".blocklyworkspace-resizer").css("left", (e.pageX + "px"))
        $(".editor-resizer").css("left", (e.pageX + 10) + "px")
        $(".editor-resizer").css("width", ("calc(100% - " + (e.pageX + 10) + "px"))
        $("#blocklyArea").width(e.pageX + "px")
        Blockly.svgResize(workspace);
        editor.setSize(("calc(100% - " + (e.pageX + 10) + "px"), null);
        output_eval.setSize(("calc(100% - " + (e.pageX + 10) + "px"), null);
        $(".cm-s-darcula:nth-of-type(3)").css("left", ((e.pageX + 10) + "px"));
        $(".cm-s-darcula:nth-of-type(5)").css("left", ((e.pageX + 10) + "px"));
    }
    if (is_drag_editor === true || is_drag_workspace === true) {
        if (!(e.pageY > 150 && ($(window).width() - 120) > e.pageX)) {
            $("#execution").css("display", "none")
        } else {
            $("#execution").css("display", "block")
        }
        if (!(($(window).height() - 110) > e.pageY && ($(window).width() - 120) > e.pageX)) {
            $("#consoleclear").css("display", "none")
        } else {
            $("#consoleclear").css("display", "block")
        }
    }
});

//--------------------------------------------------------------menu process--------------------------------------------------------------------

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

$("#new_file").click(function() {
    new_file();
})
$("#save_computer").click(function () {
    var xml = Blockly.Xml.workspaceToDom(workspace);
    var myBlockXml = Blockly.Xml.domToText(xml);
    // console.log(myBlockXml);
    var code = editor.getValue();
    var console_output = output_eval.getValue();
    var data = {
        "block_xml": myBlockXml,
        "code": code,
        "console_output": console_output,
        "project_id": project_id,
        "timestamp": new Date(),
        "settings": {
            "auto_save": $("#auto_save").prop('checked'),
            "auto_generate_code": $("#auto_code_create").prop('checked'),
            "turbo_mode": $("#turbo_mode").prop('checked'),
        }
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
        "console_output": console_output,
        "project_id": project_id,
        "timestamp": new Date(),
        "settings": {
            "auto_save": $("#auto_save").prop('checked'),
            "auto_generate_code": $("#auto_code_create").prop('checked'),
            "turbo_mode": $("#turbo_mode").prop('checked'),
        }
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

$("#overwrite_browser").click(function(){
    overwrite()
})
$("#load_computer").click(function () {
    var value = true;
    if (editor.getValue() != "") {
        value = window.confirm("編集中のプロジェクトが削除されます。\nよろしいですか?");
    }
    if (value) {
        project_id = null;
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
                console.log(result);
                // console.log(result["block_xml"]);
                var xml = Blockly.Xml.textToDom(result["block_xml"]);
                workspace.clear();
                Blockly.Xml.domToWorkspace(xml, workspace);
                $("#filename").val(file["name"].match(/([^/]*)\./)[1]);
                project_name = $("#filename").val();
                project_id = result["project_id"]
                var doc = output_eval.getDoc();
                doc.setValue(result["console_output"]);
                var doc = editor.getDoc();
                doc.setValue(result["code"]);
                $("#auto_save").prop('checked', result["settings"]["auto_save"])
                $("#auto_code_create").prop('checked', result["settings"]["auto_generate_code"])
                $("#turbo_mode").prop('checked', result["settings"]["turbo_mode"])
                var urlSearchParams = new URLSearchParams(location.search)
                urlSearchParams.delete("projectId")
                urlSearchParams.set("projectName", project_name)
                history.replaceState("", "", `?${urlSearchParams.toString()}`)
            };
        },false);
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
            var delete_button = $("<span id='delete' class='material-symbols-outlined'>close</span>");
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
            var delete_button = $("<span id='delete' class='material-symbols-outlined'>close</span>");
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

$("#filename").change(function() {
    var xml = Blockly.Xml.workspaceToDom(workspace);
    var myBlockXml = Blockly.Xml.domToText(xml);
    // console.log(myBlockXml);
    var code = editor.getValue();
    var console_output = output_eval.getValue();
    var data = {
        "block_xml": myBlockXml,
        "code": code,
        "console_output": console_output,
        "project_id": project_id,
        "timestamp": new Date(),
        "settings": {
            "auto_save": $("#auto_save").prop('checked'),
            "auto_generate_code": $("#auto_code_create").prop('checked'),
            "turbo_mode": $("#turbo_mode").prop('checked'),
        }
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
$("#auto_save, #auto_code_create, #turbo_mode").change(function(){
    let result = JSON.parse(localStorage.getItem($("#filename").val()));
    var data = {
        "block_xml": result["block_xml"],
        "code": result["code"],
        "console_output": result["console_output"],
        "project_id": result["project_id"],
        "timestamp": result["timestamp"],
        "settings": {
            "auto_save": $("#auto_save").prop('checked'),
            "auto_generate_code": $("#auto_code_create").prop('checked'),
            "turbo_mode": $("#turbo_mode").prop('checked'),
        }
    };
    var setjson = JSON.stringify(data);
    localStorage.setItem($("#filename").val(), setjson);
})

//--------------------------------------------------------------dialog process------------------------------------------------------------------

//--------------open dialog--------------
$("#open").click(function() {
    if ($('input:radio[name="filename"]:checked').length > 0) {
        project_id = null;
        edit = true;
        $("#open_dialog_background").css("display", "none");
        welcome = false;
        const filename = $('input:radio[name="filename"]:checked').attr("id");
        $("#file_lists").empty();
        // console.log(filename);
        let result = JSON.parse(localStorage.getItem(filename));
        // console.log(result["settings"]["auto_save"]);
        // console.log(result["block_xml"]);
        var xml = Blockly.Xml.textToDom(result["block_xml"]);
        workspace.clear();
        Blockly.Xml.domToWorkspace(xml, workspace);
        $("#filename").val(filename);
        project_name = $("#filename").val();
        project_id = result["project_id"]
        var doc = output_eval.getDoc();
        doc.setValue(result["console_output"]);
        var doc = editor.getDoc();
        doc.setValue(result["code"]);
        $("#auto_save").prop('checked', result["settings"]["auto_save"])
        $("#auto_code_create").prop('checked', result["settings"]["auto_generate_code"])
        $("#turbo_mode").prop('checked', result["settings"]["turbo_mode"])
        var urlSearchParams = new URLSearchParams(location.search)
        urlSearchParams.delete("projectId")
        urlSearchParams.set("projectName", project_name)
        history.replaceState("", "", `?${urlSearchParams.toString()}`)
    }
})
$("#open_dialog_newfile").click(function() {
    new_file();
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
$(document).on('click', '#delete', function(){
    var filename = $(this).parent().text().slice(0, -5);
    // console.log(filename);
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
            var delete_button = $("<span id='delete' class='material-symbols-outlined'>close</span>");
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



//--------------------------------------------------------------load process--------------------------------------------------------------------

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
        var delete_button = $("<span id='delete' class='material-symbols-outlined'>close</span>");
        input_tag.attr("id", filename);
        label_tag.attr("for", filename);
        label_tag.text(filename);
        label_tag.append(delete_button);
        p_tag.append(input_tag);
        p_tag.append(label_tag);
        $("#file_lists").append(p_tag);
    }
    projectname = getParam("projectName");

    if (projectname) {
        let result = JSON.parse(localStorage.getItem(projectname));
        // console.log(result["settings"]["auto_save"]);
        // console.log(result["block_xml"]);
        var xml = Blockly.Xml.textToDom(result["block_xml"]);
        workspace.clear();
        Blockly.Xml.domToWorkspace(xml, workspace);
        $("#filename").val(projectname);
        project_name = projectname;
        project_id = result["project_id"]
        var doc = output_eval.getDoc();
        doc.setValue(result["console_output"]);
        var doc = editor.getDoc();
        doc.setValue(result["code"]);
        $("#auto_save").prop('checked', result["settings"]["auto_save"])
        $("#auto_code_create").prop('checked', result["settings"]["auto_generate_code"])
        $("#turbo_mode").prop('checked', result["settings"]["turbo_mode"])
        var urlSearchParams = new URLSearchParams(location.search)
        urlSearchParams.delete("projectId")
        urlSearchParams.set("projectName", project_name)
        history.replaceState("", "", `?${urlSearchParams.toString()}`);
        $("#file_lists").empty();
        $("#open_dialog_background").css("display", "none");
        setTimeout(() => {welcome = false;}, 500);
    }
}


// $('.selectBox__output').each(function () {
//     const defaultText = $(this).next('.selectBox__selector').children('.selectBox__selectorItem:first-child').text()
//     $(this).text(defaultText);
// })

// //出力の枠をクリックした時の動作
// $('.selectBox__output').on('click', function (e) {
//     e.stopPropagation();
//     if ($(this).hasClass('open')) {
//         $(this).next('.selectBox__selector').slideUp();
//     } else {
//         $(this).next('.selectBox__selector').slideDown();
//     }
//     $(this).toggleClass('open');
// });

// //選択肢をクリックした時の動作
// $('.selectBox__selectorItem').on('click', function () {
//     $('.selectBox__output').toggleClass('open');
//     const selectVal = $(this).data('select');
//     const selectText = $(this).text();
//     $(this).parent('.selectBox__selector').prev('.selectBox__output').text(selectText);
//     $(this).parent('.selectBox__selector').slideUp();
//     $(this).parents('.selectBox__output').slideDown();
//     $(this).parent('.selectBox__selector').next('select').val(selectVal);
//     console.log($(this).attr("data-select"))
//     if ($(this).attr("data-select") == "editor") {
//         edit = true;
//     } else {
//         edit = false;
//     }
// });



