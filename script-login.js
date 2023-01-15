
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
      window.location = "index.html";
    }else{
      //ログアウト状態
    }
});

const GoogleAuth = new firebase.auth.GoogleAuthProvider();

$("#login").click(function () {
    firebase.auth().signInWithEmailAndPassword($("#email").val(), $("#password").val())
    .then(function () {

        window.location = "index.html";

    })
    .catch(function(error) {
        $("#warning").text(error.message);
    });
})
$("#login-google").click(function () {
    window.history.pushState({}, '', "index.html");
    firebase.auth().signInWithRedirect(GoogleAuth);
})