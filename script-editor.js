//--------------------------------------------------------------initialize----------------------------------------------------------------------
var save = true;
var welcome = false;
var project_name = "";
var project_id = "";
var myInterpreter;
var play = false;
var last_workspace_xml;
var share_id = null;
var edit = true;
var uid = null;
var share_uid = null;
var share_user_list = {}

$("#auto_save").prop('checked', false)
// var code_block_generate = false;
$("#open_dialog_background").css("display", "none");
$("#error_dialog_background").css("display", "none");
$("#share_dialog_background").css("display", "none");
$("#uid_dialog_background").css("display", "none");
Blockly.HSV_SATURATION = 0.9;
Blockly.HSV_VALUE = 0.7;
Blockly.Flyout.prototype.autoClose=false;

// firebase initialize
const config = {
    apiKey: "AIzaSyC2YSVVGd3YbIenCscwh1jW6z43lsRNUBM",
    authDomain: "visualprogramming-2e51d.firebaseapp.com",
    projectId: "visualprogramming-2e51d",
    storageBucket: "visualprogramming-2e51d.appspot.com",
    messagingSenderId: "405243814608",
    appId: "1:405243814608:web:399562455ed5148b83f4d5",
    measurementId: "G-72TZ0MNMCF"
};
firebase.initializeApp(config);
var db = firebase.firestore();

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
function createUuid(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(a) {
        let r = (new Date().getTime() + Math.random() * 16)%16 | 0, v = a == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
     });
}
function new_file() {
    var same = false;
    var filename = window.prompt('ファイル名を入力してください');
    if (!(filename == "" || filename == "undefined" || filename == null)) {

        share_id = null;
        edit = true;
        var doc = editor.getDoc();
        doc.setValue("");
        var doc = output_eval.getDoc();
        doc.setValue("");
        workspace.clear();
        project_name = filename;
        var xml = Blockly.Xml.workspaceToDom(workspace);
        var myBlockXml = Blockly.Xml.domToText(xml);
        var data = {
            "project_name": filename,
            "block_xml": myBlockXml,
            "code": "",
            "console_output": "",
            "share_id": share_id,
            "timestamp": new Date(),
            "settings": {
                "auto_save": $("#auto_save").prop('checked'),
                "auto_generate_code": $("#auto_code_create").prop('checked'),
                "turbo_mode": $("#turbo_mode").prop('checked'),
            }
        };
        project_id = createUuid();
        localStorage.removeItem(project_id);
        var setjson = JSON.stringify(data);
        localStorage.setItem(project_id, setjson);
        $("#filename").val(project_name);
        save = true;
        welcome = false;
        $("#open_dialog_background").css("display", "none");
        $("#file_lists").empty();
        $("#blocklyArea").css("pointer-events", "auto")
        $(".cm-s-darcula:nth-of-type(3)").css("pointer-events", "auto")
        var urlSearchParams = new URLSearchParams(location.search)
        if (share_id) {
            urlSearchParams.set("shareId", share_id)
        } else {
            urlSearchParams.delete("shareId")
            urlSearchParams.set("projectId", project_id)
        }

        history.replaceState("", "", `?${urlSearchParams.toString()}`)

    }
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
    if ($("#auto_save").prop('checked') && !($("#filename").val() == "Untitled") && (!welcome) && (!share_id || Object.keys(localStorage).includes(project_id))) {
        var xml = Blockly.Xml.workspaceToDom(workspace);
        var myBlockXml = Blockly.Xml.domToText(xml);
        console.log(myBlockXml);
        var code = editor.getValue();
        var console_output = output_eval.getValue();
        var data = {
            "project_name": $("#filename").val(),
            "block_xml": myBlockXml,
            "code": code,
            "console_output": console_output,
            "share_id": share_id,
            "timestamp": new Date(),
            "settings": {
                "auto_save": $("#auto_save").prop('checked'),
                "auto_generate_code": $("#auto_code_create").prop('checked'),
                "turbo_mode": $("#turbo_mode").prop('checked'),
            }
        };
        var setjson = JSON.stringify(data);
        localStorage.setItem(project_id, setjson);
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

//--------------------------------------------------------------conversion process--------------------------------------------------------------

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
        if (!(error == "TypeError: Next block does not have previous statement." || error == "TypeError: Next statement does not exist.")) {
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

//--------------------------------------------------------------execution process---------------------------------------------------------------

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
        if ($("#auto_save").prop('checked') && !($("#filename").val() == "Untitled") && (!share_id || Object.keys(localStorage).includes(project_id)) ) {
            var xml = Blockly.Xml.workspaceToDom(workspace);
            var myBlockXml = Blockly.Xml.domToText(xml);
            // console.log(myBlockXml);
            var code = editor.getValue();
            var console_output = output_eval.getValue();
            var data = {
                "project_name": $("#filename").val(),
                "block_xml": myBlockXml,
                "code": code,
                "console_output": console_output,
                "share_id": share_id,
                "timestamp": new Date(),
                "settings": {
                    "auto_save": $("#auto_save").prop('checked'),
                    "auto_generate_code": $("#auto_code_create").prop('checked'),
                    "turbo_mode": $("#turbo_mode").prop('checked'),
                }
            };
            var setjson = JSON.stringify(data);
            localStorage.setItem(project_id, setjson);
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
    if (!$(event.target).closest('#account_icon').length) {
        $('#account_dropdown').css('display', 'none');
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
        "project_name": $("#filename").val(),
        "block_xml": myBlockXml,
        "code": code,
        "console_output": console_output,
        "share_id": share_id,
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
    if (!share_id || Object.keys(localStorage).includes(project_id)) {
        var data = {
            "project_name": $("#filename").val(),
            "block_xml": myBlockXml,
            "code": code,
            "console_output": console_output,
            "share_id": share_id,
            "timestamp": new Date(),
            "settings": {
                "auto_save": $("#auto_save").prop('checked'),
                "auto_generate_code": $("#auto_code_create").prop('checked'),
                "turbo_mode": $("#turbo_mode").prop('checked'),
            }
        };
        var setjson = JSON.stringify(data);
        localStorage.setItem(project_id, setjson);
    }
    var file_name = window.prompt('ファイル名を入力してください');
    var data = {
        "project_name": file_name,
        "block_xml": myBlockXml,
        "code": code,
        "console_output": console_output,
        "share_id": "",
        "timestamp": new Date(),
        "settings": {
            "auto_save": $("#auto_save").prop('checked'),
            "auto_generate_code": $("#auto_code_create").prop('checked'),
            "turbo_mode": $("#turbo_mode").prop('checked'),
        }
    };

    if (!(file_name == "" || file_name == "undefined" || file_name == null)) {
        share_id = null;
        edit = true;
        project_id = createUuid()
        var setjson = JSON.stringify(data);
        localStorage.setItem(project_id, setjson);
        project_name = file_name
        $("#filename").val(project_name);
        $("#blocklyArea").css("pointer-events", "auto")
        $(".cm-s-darcula:nth-of-type(3)").css("pointer-events", "auto")
        var urlSearchParams = new URLSearchParams(location.search)
        if (share_id) {
            urlSearchParams.set("shareId", share_id)
        } else {
            urlSearchParams.delete("shareId")
            urlSearchParams.set("projectId", project_id)
        }

        history.replaceState("", "", `?${urlSearchParams.toString()}`)
        save = true;
    } else {
        window.alert("保存できませんでした。")
    }
})
$("#overwrite_browser").click(function(){
    var xml = Blockly.Xml.workspaceToDom(workspace);
    var myBlockXml = Blockly.Xml.domToText(xml);
    // console.log(myBlockXml);
    var code = editor.getValue();
    var console_output = output_eval.getValue();

    if (!share_id || Object.keys(localStorage).includes(project_id)) {
        var data = {
            "project_name": $("#filename").val(),
            "block_xml": myBlockXml,
            "code": code,
            "console_output": console_output,
            "share_id": share_id,
            "timestamp": new Date(),
            "settings": {
                "auto_save": $("#auto_save").prop('checked'),
                "auto_generate_code": $("#auto_code_create").prop('checked'),
                "turbo_mode": $("#turbo_mode").prop('checked'),
            }
        };
        var setjson = JSON.stringify(data);
        localStorage.setItem(project_id, setjson);
    }
    if (share_id && edit) {
        db.collection("users").doc(share_uid).update({
            ["projects."+project_id]: {
                block_xml: myBlockXml,
                code: code,
                console_output: console_output,
                project_name: project_name,
            }
        })
          .then(()=>{
            console.log("更新に成功しました");
          })
          .catch((error)=>{
            console.log(`更新に失敗しました (${error})`);
          });
    }
    if (uid && !share_id) {
        db.collection("users").doc(uid).update({
            ["projects."+project_id]: {
                block_xml: myBlockXml,
                code: code,
                console_output: console_output,
                project_name: project_name,
            }
        })
          .then(()=>{
            console.log("更新に成功しました");
          })
          .catch((error)=>{
            console.log(`更新に失敗しました (${error})`);
          });
    }
    save = true;
})
$("#load_computer").click(function () {
    var value = true;
    if (editor.getValue() != "") {
        value = window.confirm("編集中のプロジェクトが削除されます。\nよろしいですか?");
    }
    if (value) {
        share_id = null;
        edit = true;
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
                $("#filename").val(result["project_name"]);
                project_name = $("#filename").val();
                share_id = result["share_id"]
                var doc = output_eval.getDoc();
                doc.setValue(result["console_output"]);
                doc.setValue(result["code"]);
                $("#auto_save").prop('checked', result["settings"]["auto_save"])
                $("#auto_code_create").prop('checked', result["settings"]["auto_generate_code"])
                $("#turbo_mode").prop('checked', result["settings"]["turbo_mode"])
                $("#blocklyArea").css("pointer-events", "auto")
                $(".cm-s-darcula:nth-of-type(3)").css("pointer-events", "auto")
                var urlSearchParams = new URLSearchParams(location.search)
                if (share_id) {
                    urlSearchParams.set("shareId", share_id)
                } else {
                    urlSearchParams.delete("shareId")
                    urlSearchParams.set("projectId", project_id)
                }

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
            var fileid = localStorage.key(i);
            var p_tag = $("<p class='filename'></p>");
            var input_tag = $("<input type='radio' name='filename'>");
            var label_tag = $("<label for='file1'></label>");
            var delete_button = $("<span id='delete' class='material-symbols-outlined'>close</span>");
            input_tag.attr("id", fileid);
            label_tag.attr("for", fileid);
            label_tag.text(JSON.parse(localStorage.getItem(fileid))["project_name"]);
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
        localStorage.removeItem(project_id);
        $("#open_dialog_background").css("display", "block");
        // welcome = true;
        for (var i = 0; i < localStorage.length; i++) {
            var fileid = localStorage.key(i);
            var p_tag = $("<p class='filename'></p>");
            var input_tag = $("<input type='radio' name='filename'>");
            var label_tag = $("<label for='file1'></label>");
            var delete_button = $("<span id='delete' class='material-symbols-outlined'>close</span>");
            input_tag.attr("id", fileid);
            label_tag.attr("for", fileid);
            label_tag.text(JSON.parse(localStorage.getItem(fileid))["project_name"]);
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

    if (!share_id || Object.keys(localStorage).includes(project_id)) {
        var data = {
            "project_name": $("#filename").val(),
            "block_xml": myBlockXml,
            "code": code,
            "console_output": console_output,
            "share_id": share_id,
            "timestamp": new Date(),
            "settings": {
                "auto_save": $("#auto_save").prop('checked'),
                "auto_generate_code": $("#auto_code_create").prop('checked'),
                "turbo_mode": $("#turbo_mode").prop('checked'),
            }
        };
        var setjson = JSON.stringify(data);
        localStorage.setItem(project_id, setjson);
        project_name = $("#filename").val();
    }

    if (share_id && edit) {
        db.collection("users").doc(share_uid).update({
            ["projects."+project_id]: {
                block_xml: myBlockXml,
                code: code,
                console_output: console_output,
                project_name: project_name,
            }
        })
        .then(()=>{
            console.log("更新に成功しました");
            })
        .catch((error)=>{
            console.log(`更新に失敗しました (${error})`);
        });

    }
    save = true;
    window.alert("名前を変更しました。")
})
$("#auto_save, #auto_code_create, #turbo_mode").change(function(){
    if (!share_id || Object.keys(localStorage).includes(project_id)) {
        let result = JSON.parse(localStorage.getItem(project_id));
        var data = {
            "project_name": $("#filename").val(),
            "block_xml": result["block_xml"],
            "code": result["code"],
            "console_output": result["console_output"],
            "share_id": result["share_id"],
            "timestamp": result["timestamp"],
            "settings": {
                "auto_save": $("#auto_save").prop('checked'),
                "auto_generate_code": $("#auto_code_create").prop('checked'),
                "turbo_mode": $("#turbo_mode").prop('checked'),
            }
        };
        var setjson = JSON.stringify(data);
        localStorage.setItem(project_id, setjson);
    }
})
$("#account_icon").click(function() {
    $("#account_dropdown").toggle();
})

$("#new_account").click(function () {
    var url = "register.html?source=editor";
    if (project_id) {
        url += "&projectId=" + project_id;
    }
    if (share_id) {
        url += "&shareId=" + share_id;
    }
    window.location = url;
})
$("#login").click(function () {
    var url = "login.html?source=editor";
    if (project_id) {
        url += "&projectId=" + project_id;
    }
    if (share_id) {
        url += "&shareId=" + share_id;
    }
    window.location = url;
})
$("#logout").click(function () {
    var logout = window.confirm("本当にログアウトしますか？");
    if (logout) {
        firebase.auth().signOut();
        window.location.reload();
    }
})
//--------------------------------------------------------------dialog process------------------------------------------------------------------

//--------------open dialog--------------
$("#open").click(function() {
    if ($('input:radio[name="filename"]:checked').length > 0) {
        share_id = null;
        edit = true;
        $("#open_dialog_background").css("display", "none");
        welcome = false;
        const fileid = $('input:radio[name="filename"]:checked').attr("id");
        project_id = fileid;
        $("#file_lists").empty();
        // console.log(filename);
        let result = JSON.parse(localStorage.getItem(fileid));
        // console.log(result["settings"]["auto_save"]);
        // console.log(result["block_xml"]);
        var xml = Blockly.Xml.textToDom(result["block_xml"]);
        workspace.clear();
        Blockly.Xml.domToWorkspace(xml, workspace);
        $("#filename").val(result["project_name"]);
        project_name = $("#filename").val();
        share_id = result["share_id"]
        var doc = output_eval.getDoc();
        doc.setValue(result["console_output"]);
        var doc = editor.getDoc();
        doc.setValue(result["code"]);
        $("#auto_save").prop('checked', result["settings"]["auto_save"])
        $("#auto_code_create").prop('checked', result["settings"]["auto_generate_code"])
        $("#turbo_mode").prop('checked', result["settings"]["turbo_mode"])
        $("#blocklyArea").css("pointer-events", "auto")
        $(".cm-s-darcula:nth-of-type(3)").css("pointer-events", "auto")
        var urlSearchParams = new URLSearchParams(location.search)
        if (share_id) {
            urlSearchParams.set("shareId", share_id)
        } else {
            urlSearchParams.delete("shareId")
            urlSearchParams.set("projectId", project_id)
        }

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
    var fileid = $(this).parent().attr('for');
    console.log(fileid);
    var delete_project = window.confirm("本当にプロジェクトを削除しますか？");
    if (delete_project) {
        $("#file_lists").empty();
        welcome = true;
        localStorage.removeItem(fileid);
        // welcome = true;
        for (var i = 0; i < localStorage.length; i++) {
            var fileid = localStorage.key(i);
            var p_tag = $("<p class='filename'></p>");
            var input_tag = $("<input type='radio' name='filename'>");
            var label_tag = $("<label for='file1'></label>");
            var delete_button = $("<span id='delete' class='material-symbols-outlined'>close</span>");
            input_tag.attr("id", fileid);
            label_tag.attr("for", fileid);
            label_tag.text(JSON.parse(localStorage.getItem(fileid))["project_name"]);
            label_tag.append(delete_button);
            p_tag.append(input_tag);
            p_tag.append(label_tag);
            $("#file_lists").append(p_tag);
        }
    }
});

//--------------share dialog--------------
$("#share").click(function() {
    $("#share_dialog_background").css("display", "block");
    if (share_id) {
        share_user_list = {"unregistered": {"edit":false}}
        var docRef = db.collection("share_project").doc(share_id);

        docRef.get().then((doc)=>{
            if (doc.exists) {
                var result = doc.data();
                $("#link_create").css("display", "none");
                $(".share_info").css("display", "block");
                $(".link_field").text("https://katatsumuri-programming.github.io/visual_programming/?shareId=" + share_id)
                if (Object.keys(result["user_id"]).includes("unregistered")) {
                    $(".shareRange_selectorItem[data-select='everyone']").click();
                    if (result["user_id"]["unregistered"]["edit"]) {
                        $(".authority_output").text("編集者");
                    } else {
                        $(".authority_output").text("閲覧者");
                    }
                    $('.share_range_output').removeClass('open');
                } else {
                    $(".shareRange_selectorItem[data-select='limit']").click();
                    $('.share_range_output').removeClass('open');
                    $(".share_user_list").empty()
                    for (var i = 0; i < Object.keys(result["user_id"]).length; i++) {
                        var add_user_id = Object.keys(result["user_id"])[i]
                        if (result["user_id"][add_user_id]["edit"]) {
                            var authority = "編集者"
                        } else {
                            var authority = "閲覧者"
                        }
                        var user_item_tag = $("<div class='share_user_item'></div>")
                        var close_tag = $("<span class='material-symbols-outlined share_user_delete'>close</span>")
                        var user_id_tag = $("<p class='share_user_id'></p>")
                        var select_tag = $(
                            "<div class='selectBox user_authority'>" +
                                "<div class='selectBox__output material-symbols-outlined authority_output'>" + authority + "</div>" +
                                "<div class='selectBox__selector authority'>" +
                                    "<div class='selectBox__selectorItem userAuthority_selectorItem' data-select='editor'>編集者</div>" +
                                    "<div class='selectBox__selectorItem userAuthority_selectorItem' data-select='reader'>閲覧者</div>" +
                                "</div>" +
                            "</div>"
                        );
                        user_id_tag.text(add_user_id)
                        user_item_tag.append(close_tag);
                        user_item_tag.append(user_id_tag);
                        user_item_tag.append(select_tag);
                        user_item_tag.attr("id", add_user_id);
                        $(".share_user_list").append(user_item_tag);
                    }
                }
                if (Object.keys(localStorage).includes(result["project_id"]) || (result["host_user_id"] == uid && !result["host_user_id"] == "unregistered")) {
                    $(".selectBox").css("pointer-events", "auto");
                } else {
                    $(".selectBox").css("pointer-events", "none");
                }
            } else {
                $("#link_create").css("display", "block");
                $(".share_info").css("display", "none");
            }
        })
    } else {
        $("#link_create").css("display", "block");
        $(".share_info").css("display", "none");
    }
})
$("#create_link_btn").click(function() {
    var xml = Blockly.Xml.workspaceToDom(workspace);
    var myBlockXml = Blockly.Xml.domToText(xml);
    // console.log(myBlockXml);
    var code = editor.getValue();
    var console_output = output_eval.getValue();
    db.collection("users").doc(uid).update({
        ["projects."+project_id]: {
            block_xml: myBlockXml,
            code: code,
            console_output: console_output,
            project_name: project_name,
        }
    }).then((doc) => {

        db.collection("share_project").add({
            project_id: project_id,
            user_id: {[uid]:{"edit":edit}}
        })
        .then((doc) => {
            share_id = doc.id
            $("#link_create").css("display", "none");
            $(".share_info").css("display", "block");
            $(".link_field").text("https://katatsumuri-programming.github.io/visual_programming/?shareId=" + share_id)

            var xml = Blockly.Xml.workspaceToDom(workspace);
            var myBlockXml = Blockly.Xml.domToText(xml);
            var code = editor.getValue();
            var console_output = output_eval.getValue();
            var data = {
                "project_name": $("#filename").val(),
                "block_xml": myBlockXml,
                "code": code,
                "console_output": console_output,
                "share_id": share_id,
                "timestamp": new Date(),
                "settings": {
                    "auto_save": $("#auto_save").prop('checked'),
                    "auto_generate_code": $("#auto_code_create").prop('checked'),
                    "turbo_mode": $("#turbo_mode").prop('checked'),
                }
            };
            var setjson = JSON.stringify(data);
            localStorage.setItem(project_id, setjson);
        })
        .catch((error) => {
            alert(`共有設定をできませんでした (${error})`);
        });
    });
})
$("#link_copy").click(function() {
    text = $(".link_field").text()
    if (navigator.clipboard == undefined) {
        window.clipboardData.setData("Text", text);
    } else {
        navigator.clipboard.writeText(text);
    }
})
$("#ok").click(function() {
    $("#share_dialog_background").css("display", "none");
    // var xml = Blockly.Xml.workspaceToDom(workspace);
    // var myBlockXml = Blockly.Xml.domToText(xml);
    // // console.log(myBlockXml);
    // var code = editor.getValue();
    // var console_output = output_eval.getValue();

    var authority;
    var data = {}
    if ($(".share_range_output").text() == "リンクを知っている全員") {
        if ($(".authority_output").text() == "編集者") {
            authority = true
        } else {
            authority = false
        }
        data = {
            "unregistered":{
                "edit": authority
            }

        }
    } else {
        var user_list = $(".share_user_list").children();
        for (var i = 0; i < user_list.length; i++) {
            console.log($(user_list[i]).attr("id"));
            console.log($(user_list[i]).find(".authority_output").text())
            if ($(user_list[i]).find(".authority_output").text() == "編集者") {
                data[$(user_list[i]).attr("id")] = true;
            } else {
                data[$(user_list[i]).attr("id")] = false;
            }
        }
    }
    console.log(data)
    /*
    if($(".authority_output").text() == "編集者") {
        authority = true;
    } else {
        authority = false;
    }
    if ($(".share_range_output").text() == "リンクを知っている全員") {
        data = {
            "user_id": {
                "unregistered":{
                    "edit": authority
                }
            }
        }
    } else {
        data = {
            "user_id": {
                "unregistered":{
                    "edit": authority
                }
            }
        }
    }
    */

    db.collection("share_project").doc(share_id).update(
        {
            "user_id":data
        }
    )
    .then(()=>{
        console.log("更新に成功しました");
    })
    .catch((error)=>{
        console.log(`更新に失敗しました (${error})`);
    });

})

$("#show_uid").click(function(){
    $(".uid_field").text(uid)
    $("#uid_dialog_background").css("display", "block")
})
$("#uid_ok").click(function() {
    $("#uid_dialog_background").css("display", "none")
})
$("#uid_copy").click(function() {
    text = $(".uid_field").text()
    if (navigator.clipboard == undefined) {
        window.clipboardData.setData("Text", text);
    } else {
        navigator.clipboard.writeText(text);
    }
})
//--------------------------------------------------------------load process--------------------------------------------------------------------

window.onload = function() {
    welcome = true;
    // $("#name_prompt_background").css("display", "block");
    $("#open_dialog_background").css("display", "block");
    // welcome = true;
    for (var i = 0; i < localStorage.length; i++) {
        var fileid = localStorage.key(i);
        var p_tag = $("<p class='filename'></p>");
        var input_tag = $("<input type='radio' name='filename'>");
        var label_tag = $("<label for='file1'></label>");
        var delete_button = $("<span id='delete' class='material-symbols-outlined'>close</span>");
        input_tag.attr("id", fileid);
        label_tag.attr("for", fileid);
        label_tag.text(JSON.parse(localStorage.getItem(fileid))["project_name"]);
        label_tag.append(delete_button);
        p_tag.append(input_tag);
        p_tag.append(label_tag);
        $("#file_lists").append(p_tag);
    }
    share_id = getParam("shareId");
    projectId = getParam("projectId");
    if (projectId) {
        project_id = projectId;
        let result = JSON.parse(localStorage.getItem(projectId));
        // console.log(result["settings"]["auto_save"]);
        // console.log(result["block_xml"]);
        var xml = Blockly.Xml.textToDom(result["block_xml"]);
        workspace.clear();
        Blockly.Xml.domToWorkspace(xml, workspace);
        $("#filename").val(result["project_name"]);
        project_name = result["project_name"];
        share_id = result["share_id"]
        var doc = output_eval.getDoc();
        doc.setValue(result["console_output"]);
        var doc = editor.getDoc();
        doc.setValue(result["code"]);
        $("#auto_save").prop('checked', result["settings"]["auto_save"])
        $("#auto_code_create").prop('checked', result["settings"]["auto_generate_code"])
        $("#turbo_mode").prop('checked', result["settings"]["turbo_mode"])
        console.log(project_id)
        var urlSearchParams = new URLSearchParams(location.search)
        if (share_id) {
            urlSearchParams.set("shareId", share_id)
        } else {
            urlSearchParams.delete("shareId")
            urlSearchParams.set("projectId", project_id)
        }

        history.replaceState("", "", `?${urlSearchParams.toString()}`);
        $("#file_lists").empty();
        $("#open_dialog_background").css("display", "none");
        setTimeout(() => {welcome = false;}, 500);
    } else if (share_id) {

        db.collection("share_project").doc(share_id).get()
        .then((doc)=>{
            if (doc.exists) {
                var share_info = doc.data()
                project_id = share_info["project_id"]
                share_uid = share_info["host_user_id"]
                console.log(share_uid)
                if (Object.keys(share_info["user_id"]).includes(uid) || Object.keys(share_info["user_id"]).includes("unregistered") || share_uid == uid) {
                    db.collection("users").doc(share_uid).get().then((doc)=>{
                        if (doc.exists) {
                            // console.log( doc.data() );
                            let result = doc.data()["projects"][project_id];
                            console.log(result)
                            const filename = result["project_name"];
                            // console.log(filename);

                            // console.log(result);
                            // console.log(result["block_xml"]);

                            var block_xml = result["block_xml"].replace(/\\/g, '');
                            var xml = Blockly.Xml.textToDom(block_xml);
                            workspace.clear();
                            // console.log(xml)
                            Blockly.Xml.domToWorkspace(xml, workspace);
                            $("#filename").val(filename);
                            project_name = $("#filename").val();
                            var doc = output_eval.getDoc();
                            doc.setValue(result["console_output"]);
                            var doc = editor.getDoc();
                            doc.setValue(result["code"]);

                            $("#file_lists").empty();
                            $("#open_dialog_background").css("display", "none");

                            let result_local = JSON.parse(localStorage.getItem(filename));
                            if (result_local) {
                                $("#auto_save").prop('checked', result_local["settings"]["auto_save"])
                                $("#auto_code_create").prop('checked', result_local["settings"]["auto_generate_code"])
                                $("#turbo_mode").prop('checked', result_local["settings"]["turbo_mode"])
                            } else {
                                $("#auto_save").prop('checked', true)
                                $("#auto_code_create").prop('checked', true)
                                $("#turbo_mode").prop('checked', false)
                            }
                            if (Object.keys(share_info["user_id"]).includes(uid)) {
                                if (!share_info["user_id"][uid]["edit"] && !Object.keys(localStorage).includes(project_id)) {
                                    edit = false;
                                    $("#blocklyArea").css("pointer-events", "none")
                                    $(".cm-s-darcula:nth-of-type(3)").css("pointer-events", "none")
                                    $(".selectBox").css("display", "none")
                                }
                            } else {
                                if (!share_info["user_id"]["unregistered"]["edit"] && !Object.keys(localStorage).includes(project_id)) {
                                    edit = false;
                                    $("#blocklyArea").css("pointer-events", "none")
                                    $(".cm-s-darcula:nth-of-type(3)").css("pointer-events", "none")
                                    $(".selectBox").css("display", "none")
                                }
                            }
                            setTimeout(() => {welcome = false;}, 500);
                        } else {
                            console.log("404");
                        }
                    });
                }

            } else {
                console.log("404");
            }
        })
        .catch( (error) => {
            alert(`データを取得できませんでした (${error})`);
        });
    }
}


firebase.auth().onAuthStateChanged(function(user) {
    console.log(user)
    if(user) {
        uid = user.uid;

        $("#loggingout").css("display", "none");
        $("#loggingin").css("display", "block");
    } else {
        uid = "unregistered";
        $("#loggingout").css("display", "block");
        $("#loggingin").css("display", "none");
    }
});
// window.onbeforeunload = function(e) {
//     var xml = Blockly.Xml.workspaceToDom(workspace);
//     var myBlockXml = Blockly.Xml.domToText(xml);
//     // console.log(myBlockXml);
//     var code = editor.getValue();
//     var console_output = output_eval.getValue();
//     db.collection("users").doc('unregistered').update({
//         ["projects."+project_id]: {
//             block_xml: myBlockXml,
//             code: code,
//             console_output: console_output,
//             project_name: project_name,
//         }
//     })
//     .then(()=>{
//         console.log("更新に成功しました");
//     })
//     .catch((error)=>{
//         console.log(`更新に失敗しました (${error})`);
//     });

// }
$(document).on('click touchend', function(event) {
    if (!$(event.target).closest(".selectBox__selectorItem").length) {
        $('.selectBox__selector').slideUp();

        if ($(".authority_output").hasClass('open')) {
            $('.authority_output').toggleClass('open');
        }
        if ($(".share_range_output").hasClass('open')) {
            $('.share_range_output').toggleClass('open');
        }
    }
});
$('.selectBox__output').each(function () {
    const defaultText = $(this).next('.selectBox__selector').children('.selectBox__selectorItem:first-child').text()
    $(this).text(defaultText);
})

//出力の枠をクリックした時の動作
$(document).on('click', '.selectBox__output', function(e){
    e.stopPropagation();
    if ($(this).hasClass('open')) {
        $(this).next('.selectBox__selector').slideUp();
    } else {
        $(this).next('.selectBox__selector').slideDown();
    }
    $(this).toggleClass('open');
});

//選択肢をクリックした時の動作
$(document).on('click', '.shareRange_selectorItem', function(){
    $(this).parents('.selectBox').find(".selectBox__output").toggleClass('open');
    const selectVal = $(this).data('select');
    const selectText = $(this).text();
    $(this).parent('.selectBox__selector').prev('.selectBox__output').text(selectText);
    $(this).parent('.selectBox__selector').slideUp();
    $(this).parents('.selectBox__output').slideDown();
    $(this).parent('.selectBox__selector').next('select').val(selectVal);
    if ($(this).attr("data-select") == "limit") {
        $(".share_user").css("display", "block");
        $(".authority").css("display", "none");
    } else {
        $(".share_user").css("display", "none");
        $(".authority").css("display", "block");
    }
});
$(document).on('click', '.userAuthority_selectorItem', function(){
    $(this).parents('.selectBox').find(".selectBox__output").toggleClass('open');
    const selectVal = $(this).data('select');
    const selectText = $(this).text();
    $(this).parent('.selectBox__selector').prev('.selectBox__output').text(selectText);
    $(this).parent('.selectBox__selector').slideUp();
    $(this).parents('.selectBox__output').slideDown();
    $(this).parent('.selectBox__selector').next('select').val(selectVal);
});
$('.Authority_selectorItem').click(function(){
    $(this).parents('.selectBox').find(".selectBox__output").toggleClass('open');
    const selectVal = $(this).data('select');
    const selectText = $(this).text();
    $(this).parent('.selectBox__selector').prev('.selectBox__output').text(selectText);
    $(this).parent('.selectBox__selector').slideUp();
    $(this).parents('.selectBox__output').slideDown();
    $(this).parent('.selectBox__selector').next('select').val(selectVal);
});
$(document).on('click', '.share_user_delete', function() {
    $(this).parent().remove();
})
$("#add_user_btn").click(function () {
    var add_user_id = $("#add_user_id").val();
    if (add_user_id) {
        console.log(add_user_id)
        var user_item_tag = $("<div class='share_user_item'></div>")
        var close_tag = $("<span class='material-symbols-outlined share_user_delete'>close</span>")
        var user_id_tag = $("<p class='share_user_id'></p>")
        var select_tag = $(
            "<div class='selectBox user_authority'>" +
                "<div class='selectBox__output material-symbols-outlined open authority_output'>編集者</div>" +
                "<div class='selectBox__selector authority'>" +
                    "<div class='selectBox__selectorItem userAuthority_selectorItem' data-select='editor'>編集者</div>" +
                    "<div class='selectBox__selectorItem userAuthority_selectorItem' data-select='reader'>閲覧者</div>" +
                "</div>" +
            "</div>"
        );
        user_id_tag.text(add_user_id)
        user_item_tag.append(close_tag);
        user_item_tag.append(user_id_tag);
        user_item_tag.append(select_tag);
        user_item_tag.attr("id", add_user_id);
        $(".share_user_list").append(user_item_tag);
        $("#add_user_id").val("")
    }
})