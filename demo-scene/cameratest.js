var moveCamera = function(axis, distance) {
	camera.position[axis] += distance;
}
var movePlayer = function(axis, distance) {
	player.position[axis] += distance;
}


document.onkeydown = function(e) {
	switch (e.keyCode) {
    case 37: // left
      moveCamera('x', -7);
      movePlayer('x', -5)
      break;
    case 38: // up
      moveCamera('y', 7);
      movePlayer('y', 5)
      break;
    case 39: // right
      moveCamera('x', 7);
      movePlayer('x', 5)
      break;
    case 40: // down
      moveCamera('y', -7);
      movePlayer('y', -5)
      break;
	}
	console.log(camera.position, player.position)
  camera.lookAt(new THREE.Vector3(0,0,0))
};