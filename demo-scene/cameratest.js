


document.onmousemove = function (e) {mousePos(e);};
var mouseX = 0;
var mouseY = 0;
function mousePos (e) {
	mouseX = e.pageX; 
	mouseY = e.pageY;
	player.position.set((mouseX-window.innerWidth/2)*.25, .25*(-(mouseY-window.innerHeight/2)), player.position.z)
	return true;
}