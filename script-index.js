var uid;

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

function createUuid(){
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(a) {
      let r = (new Date().getTime() + Math.random() * 16)%16 | 0, v = a == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
   });
}

firebase.auth().onAuthStateChanged(function(user) {
  if(user) {
    uid = user.uid;
    $("#loggingout").css("display", "none");
    $("#loggingin").css("display", "block");
    // var docRef = db.collection("users").doc(uid);

    // docRef.get().then((doc)=>{
    //   if (doc.exists) {
    //     let result = doc.data();
    //     console.log(result);
    //   }
    // });
    var data = {}
    for (var i = 0; i < localStorage.length; i++) {
      var filename = localStorage.key(i);
      console.log(filename);
      var result = JSON.parse(localStorage.getItem(filename));
      data[filename] = result
    }
    console.log(data)
    db.collection('users').doc(uid).update({
      'projects': data,
    })

  }
});


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
    if (window.location.hostname == "127.0.0.1" || window.location.hostname == "localhost") {
      location.href = 'https://127.0.0.1:5500/editor.html?projectName=' + $(this).find("h3").text();
    } else {
      location.href = 'https://katatsumuri-programming.github.io/visual_programming/editor.html?projectName=' + $(this).find("h3").text();
    }
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
        if (window.location.hostname == "127.0.0.1" || window.location.hostname == "localhost") {
          location.href = 'https://127.0.0.1:5500/editor.html?projectName=' + project_name;
        } else {
          location.href = 'https://katatsumuri-programming.github.io/visual_programming/editor.html?projectName=' + project_name;
        }
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
      if (window.location.hostname == "127.0.0.1" || window.location.hostname == "localhost") {
        location.href = 'https://127.0.0.1:5500/editor.html?projectName=' + project_name;
      } else {
        location.href = 'https://katatsumuri-programming.github.io/visual_programming/editor.html?projectName=' + project_name;
      }
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

$("#account_icon").click(function() {
  $("#account_dropdown").toggle();
})
$(document).on('click touchend', function(event) {
  // 表示したポップアップ以外の部分をクリックしたとき
  if (!$(event.target).closest('#account_icon').length) {
      $('#account_dropdown').css('display', 'none');
  }
});

$("#new_account").click(function () {
  window.location = "register.html?source=index";
})
$("#login").click(function () {
  window.location = "login.html?source=index";
})
$("#logout").click(function () {
  var logout = window.confirm("本当にログアウトしますか？");
  if (logout) {
    firebase.auth().signOut();
    window.location.reload();
  }
})