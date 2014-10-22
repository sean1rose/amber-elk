
// var moveCamera = function(axis, distance) {
// 	camera.position[axis] += distance;
// }
var movePlayer = function(axis, distance) {
	player.position[axis] += distance;
	camera.position[axis] += (distance * 1.3);
}


document.onkeydown = function(e) {
	switch (e.keyCode) {
    case 37: // left
      movePlayer('x', -10)
      break;
    case 38: // up
      movePlayer('y', 10)
      break;
    case 39: // right
      movePlayer('x', 10)
      break;
    case 40: // down
      movePlayer('y', -10)
      break;
	}
	// console.log(camera.position, player.position)
  camera.lookAt(new THREE.Vector3(0,0,0))
};

document.onmousemove = function (e) {mousePos(e);};
var mouseX = 0;
var mouseY = 0;
function mousePos (e) {
        mouseX = e.pageX; 
        mouseY = e.pageY;
    player.position.set((mouseX-window.innerWidth/2)*.25, .25*(-(mouseY-window.innerHeight/2)), player.position.z)
    // console.log(player.position.x, player.position.y)

    return true;
}


// controls = new THREE.OrbitControls( camera );
// controls.target.set( 0, 0, 0 )