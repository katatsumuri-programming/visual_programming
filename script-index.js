var scene = $('#scene').get(0);
var parallaxInstance = new Parallax(scene, {

});



// Attach window listeners.
window.onresize = function() {
    $('.wrapper').get(0).style.width = window.innerWidth + 'px';
    $('.wrapper').get(0).style.height = window.innerHeight + 'px';
    scene.style.width = window.innerWidth + 'px';
    scene.style.height = window.innerHeight + 'px';
}