$("#register-section").css("display","block");
$("#success-section").css("display","none");

function getParam(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// if (getParam("complete")) {
//     $("#register-section").css("display","none");
//     $("#success-section").css("display","block");
// }
// if (getParam("error")) {
//     $("#warning").text(getParam("error"));
// }

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

firebase.auth().getRedirectResult()
.then((result) => {
if (result.credential) {
    $("#register-section").css("display","none");
    $("#success-section").css("display","block");
}
}).catch((error) => {
    $("#warning").text(error.message);
});



const GoogleAuth = new firebase.auth.GoogleAuthProvider();

$("#register").click(function() {
    if ($("#password").val() == "" || $("#email").val() == "") { //$("#username").val() == "" ||
        $("#warning").text("すべてのフィールドを埋めてください");
    } else if (!$("#email").val().match(/.+@.+\..+/)) {
        $("#warning").text("メールアドレスを入力してください");
    } else {
        $("#warning").text("");
        var mailAddress = $("#email").val();
        var password = $("#password").val();
        firebase.auth().createUserWithEmailAndPassword(mailAddress, password)
        .then(function(data) {
            $("#register-section").css("display","none");
            $("#success-section").css("display","block");
        })
        .catch(function(error) {
            $("#warning").text(error.message);
        });
    }
})

$("#register-google").click(function() {
    // window.history.pushState({}, '', "register.html?complete=true");
    firebase.auth().signInWithRedirect(GoogleAuth);
})

$("#success").click(function() {
    if (getParam("source") == "index" || !getParam("source")) {
        window.location = "index.html";
    } else if (getParam("source") == "editor"){
        var url = "editor.html";
        if (getParam("projectId") && getParam("shareId")) {
            url += "?projectId=" + getParam("projectId") + "&shareId=" + getParam("shareId")
        } else if (getParam("projectId") && !getParam("shareId")) {
            url += "?projectId=" + getParam("projectId")
        } else if (!getParam("projectId") && getParam("shareId")) {
            url += "?shareId=" + getParam("shareId")
        }
        window.location = url;
    }

})
// firebase.auth().onAuthStateChanged((user) => {
//     if (user) {
//       // User is signed in, see docs for a list of available properties
//       // https://firebase.google.com/docs/reference/js/firebase.User
//       var uid = user.uid;
//       console.log(uid);
//       window.location =
//       // ...
//     } else {
//       // User is signed out
//       // ...
//     }
//   });