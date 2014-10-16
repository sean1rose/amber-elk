
// var moveCamera = function(axis, distance) {
// 	camera.position[axis] += distance;
// }
var movePlayer = function(axis, distance) {
	player.position[axis] += distance;
	camera.position[axis] += (distance * 1.4);
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
	console.log(camera.position, player.position)
  camera.lookAt(new THREE.Vector3(0,0,0))
};