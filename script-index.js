// TODO:削除機能
var project_name;
function elapsedTime(datetime) {
  var from = new Date(datetime);

  // 現在時刻との差分＝経過時間
  var diff = new Date().getTime() - from.getTime();
  // 経過時間をDateに変換
  var elapsed = new Date(diff);

  // 大きい単位から順に表示
  if (elapsed.getUTCFullYear() - 1970) {
    return elapsed.getUTCFullYear() - 1970 + '年前';
  } else if (elapsed.getUTCMonth()) {
    return elapsed.getUTCMonth() + 'ヶ月前';
  } else if (elapsed.getUTCDate() - 1) {
    return elapsed.getUTCDate() - 1 + '日前';
  } else if (elapsed.getUTCHours()) {
    return elapsed.getUTCHours() + '時間前';
  } else if (elapsed.getUTCMinutes()) {
    return elapsed.getUTCMinutes() + '分前';
  } else {
    return 'たった今';
  }
}

function new_file() {

}


$("#search_word").keyup(function () {
  if (!$("#search_word").val() == "") {
    var search = $("#search_word").val();
    console.log()
    $("#projects").empty();
    for (var i = 0; i < localStorage.length; i++) {
      var filename = localStorage.key(i);
      if (filename.indexOf(search) != -1) {
        var tile_tag = $("<div class='tile'></div>");
        var border_tag = $("<div class='border'></div>");
        var info_tag = $("<div class='info'></div>");
        var title_tag = $("<h3></h3>");
        var timestamp_tag = $("<p class='timestamp'></p>");
        tile_tag.attr("id", filename);
        title_tag.text(filename);
        timestamp_tag.text(elapsedTime(JSON.parse(localStorage.getItem(filename))["timestamp"]));
        info_tag.append(title_tag);
        info_tag.append(timestamp_tag);
        tile_tag.append(border_tag);
        tile_tag.append(info_tag);
        $("#projects").append(tile_tag);
      }
    }
  } else {
    $("#projects").empty();
    $("#projects").append($(
      "<div class='new_file'>" +
        "<div class='icon'>" +
          "<span class='material-symbols-outlined'>add_circle</span>" +
        "</div>" +
        "<p>新しいファイルを作成</p>" +
      "</div>"
    ));
    for (var i = 0; i < localStorage.length; i++) {
      var filename = localStorage.key(i);
      var tile_tag = $("<div class='tile'></div>");
      var border_tag = $("<div class='border'></div>");
      var info_tag = $("<div class='info'></div>");
      var title_tag = $("<h3></h3>");
      var timestamp_tag = $("<p class='timestamp'></p>");
      tile_tag.attr("id", filename);
      title_tag.text(filename);
      timestamp_tag.text(elapsedTime(JSON.parse(localStorage.getItem(filename))["timestamp"]));
      info_tag.append(title_tag);
      info_tag.append(timestamp_tag);
      tile_tag.append(border_tag);
      tile_tag.append(info_tag);
      $("#projects").append(tile_tag);
    }
  }
})
$(".search_input_delete").click(function () {
  $("#search_word").val("")
  $("#projects").empty();
  $("#projects").append($(
    "<div class='new_file'>" +
      "<div class='icon'>" +
        "<span class='material-symbols-outlined'>add_circle</span>" +
      "</div>" +
      "<p>新しいファイルを作成</p>" +
    "</div>"
  ));
  for (var i = 0; i < localStorage.length; i++) {
    var filename = localStorage.key(i);
    var tile_tag = $("<div class='tile'></div>");
    var border_tag = $("<div class='border'></div>");
    var info_tag = $("<div class='info'></div>");
    var title_tag = $("<h3></h3>");
    var timestamp_tag = $("<p class='timestamp'></p>");
    tile_tag.attr("id", filename);
    title_tag.text(filename);
    timestamp_tag.text(elapsedTime(JSON.parse(localStorage.getItem(filename))["timestamp"]));
    info_tag.append(title_tag);
    info_tag.append(timestamp_tag);
    tile_tag.append(border_tag);
    tile_tag.append(info_tag);
    $("#projects").append(tile_tag);
  }
})
$(document).on("click",".tile", function(e) {
  if ($(e.target).attr("class").indexOf("delete_btn") != -1) {
    var filename = $(this).find("h3").text()
    // console.log(filename);

    var delete_project = window.confirm("本当にプロジェクトを削除しますか？");
    if (delete_project) {
      $("#projects").empty();
      localStorage.removeItem(filename);
      $("#projects").append($(
        "<div class='new_file'>" +
          "<div class='icon'>" +
            "<span class='material-symbols-outlined'>add_circle</span>" +
          "</div>" +
          "<p>新しいファイルを作成</p>" +
        "</div>"
      ));
      for (var i = 0; i < localStorage.length; i++) {
        var filename = localStorage.key(i);
        var tile_tag = $("<div class='tile'></div>");
        var delete_tag = $("<span class='material-symbols-outlined delete_btn'>delete</span>")
        var border_tag = $("<div class='border'></div>");
        var info_tag = $("<div class='info'></div>");
        var title_tag = $("<h3></h3>");
        var timestamp_tag = $("<p class='timestamp'></p>");
        tile_tag.attr("id", filename);
        title_tag.text(filename);
        timestamp_tag.text(elapsedTime(JSON.parse(localStorage.getItem(filename))["timestamp"]));
        info_tag.append(title_tag);
        info_tag.append(timestamp_tag);
        tile_tag.append(delete_tag);
        tile_tag.append(border_tag);
        tile_tag.append(info_tag);
        $("#projects").append(tile_tag);
      }
    }
  } else {
    console.log($(this).find("h3").text())
    location.href = 'editor.html?projectName=' + $(this).find("h3").text();
  }

})

$(document).on("click",".new_file", function() {
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
        project_name = filename;
        var data = {
          "block_xml": "<xml></xml>",
          "code": "",
          "console_output": "",
          "project_id": null,
          "timestamp": new Date(),
          "settings": {
            "auto_save": true,
            "auto_generate_code": true,
            "turbo_mode": false,
          }
        };
        localStorage.removeItem(project_name);
        var setjson = JSON.stringify(data);
        localStorage.setItem(project_name, setjson);
        location.href = 'editor.html?projectName=' + project_name;
      }
    } else {
      project_name = filename;
      var data = {
        "block_xml": "<xml></xml>",
        "code": "",
        "console_output": "",
        "project_id": null,
        "timestamp": new Date(),
        "settings": {
          "auto_save": true,
          "auto_generate_code": true,
          "turbo_mode": false,
        }
      };
      localStorage.removeItem(project_name);
      var setjson = JSON.stringify(data);
      localStorage.setItem(project_name, setjson);
      location.href = 'editor.html?projectName=' + project_name;
    }
  }

})

window.onload = function() {
  $("#projects").empty();
  $("#projects").append($(
    "<div class='new_file'>" +
      "<div class='icon'>" +
        "<span class='material-symbols-outlined'>add_circle</span>" +
      "</div>" +
      "<p>新しいファイルを作成</p>" +
    "</div>"
  ));
  for (var i = 0; i < localStorage.length; i++) {
    var filename = localStorage.key(i);
    var tile_tag = $("<div class='tile'></div>");
    var delete_tag = $("<span class='material-symbols-outlined delete_btn'>delete</span>")
    var border_tag = $("<div class='border'></div>");
    var info_tag = $("<div class='info'></div>");
    var title_tag = $("<h3></h3>");
    var timestamp_tag = $("<p class='timestamp'></p>");
    tile_tag.attr("id", filename);
    title_tag.text(filename);
    timestamp_tag.text(elapsedTime(JSON.parse(localStorage.getItem(filename))["timestamp"]));
    info_tag.append(title_tag);
    info_tag.append(timestamp_tag);
    tile_tag.append(delete_tag);
    tile_tag.append(border_tag);
    tile_tag.append(info_tag);
    $("#projects").append(tile_tag);
  }
}