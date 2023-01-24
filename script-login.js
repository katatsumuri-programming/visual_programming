function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }
var url = "";
if (getParam("source") == "index" || !getParam("source")) {
    url = "index.html";
} else if (getParam("source") == "editor"){
    url = "editor.html";
    if (getParam("projectId") && getParam("shareId")) {
        url += "?projectId=" + getParam("projectId") + "&shareId=" + getParam("shareId")
    } else if (getParam("projectId") && !getParam("shareId")) {
        url += "?projectId=" + getParam("projectId")
    } else if (!getParam("projectId") && getParam("shareId")) {
        url += "?shareId=" + getParam("shareId")
    }
}
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

firebase.auth().onAuthStateChanged(function(user) {
    if(user) {
      window.location = url;
    }else{
      //ログアウト状態
    }
});

const GoogleAuth = new firebase.auth.GoogleAuthProvider();

$("#login").click(function () {
    firebase.auth().signInWithEmailAndPassword($("#email").val(), $("#password").val())
    .then(function () {

        window.location = url;

    })
    .catch(function(error) {
        $("#warning").text(error.message);
    });
})
$("#login-google").click(function () {
    window.history.pushState({}, '', url);
    firebase.auth().signInWithRedirect(GoogleAuth);
})

