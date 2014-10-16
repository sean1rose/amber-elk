document.onkeydown = function(e) {
	switch (e.keyCode) {
    case 37: // left
      camera.position.x -= 10;
      break;
    case 38: // up
      camera.position.y += 10;
      break;
    case 39: // right
      camera.position.x += 10;
      break;
    case 40: // down
    camera.position.y -= 10;
      break;
	}
  camera.lookAt(new THREE.Vector3(0,0,0))
};