
var lights = [];
var i;

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var DPR = window.devicePixelRatio || 1;

var render = function() {
  var delta = clock.getDelta();
  //renderer.clear();
  renderer.autoClear = false;
  //renderer.render(scene, camera);
  composer.render(delta);
};

var animate = function(){
  requestAnimationFrame(animate);
  player.animate();
  render();
};

var renderer = new THREE.WebGLRenderer({
  precision: 'highp',
  preserveDrawingBuffer: true
});
renderer.gammaInput = true;
renderer.gammaOutput = true;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera (90, window.innerWidth / window.innerHeight, 5, 1300);

var renderModel = new THREE.RenderPass(scene, camera);
var effectBloom = new THREE.BloomPass(1);
var effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
var composer = new THREE.EffectComposer(renderer);
effectFXAA.uniforms['resolution'].value = new THREE.Vector2(1/(SCREEN_WIDTH * DPR), 1/(SCREEN_HEIGHT * DPR));
effectBloom.renderTargetX.format = THREE.RGBAFormat;
effectBloom.renderTargetY.format = THREE.RGBAFormat;
effectCopy.renderToScreen = true;
composer.setSize(SCREEN_WIDTH * DPR, SCREEN_HEIGHT * DPR);
composer.addPass(renderModel);
composer.addPass(effectBloom);
composer.addPass(effectFXAA);
composer.addPass(effectCopy);

var clock = new THREE.Clock();

var controls = new THREE.OrbitControls(camera);
var floorGeometry = new THREE.PlaneGeometry(500,500,10,10);
var floorMaterial = new THREE.MeshPhongMaterial({color: 0xffffff});
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
var player = new PlayerCharacter();

renderer.shadowMapEnabled = true;
floor.receiveShadow = true;
floor.position.set(0,0,-10);

lights.push(new THREE.SpotLight(0xffffff,1,300,45,1));
lights.push(new THREE.SpotLight(0xffffff,1,300,45,1));
lights.push(new THREE.SpotLight(0xffffff,1,300,45,1));
for (i = 0; i < lights.length; i++){
  lights[i].castShadow = true;
  lights[i].shadowDarkness = 0.5;
}
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.set(0,0,100);
camera.lookAt(scene.position);
lights[0].position.set(-100,100,100);
lights[1].position.set(100,100,100);
lights[2].position.set(100,-100,100);
controls.addEventListener('change', render);
document.body.addEventListener('click', function(e){
  e.preventDefault();
  player.levelUp();
});
document.body.addEventListener('contextmenu', function(e){
  e.preventDefault();
  player.levelDown();
});
scene.add(player);

for (i = 0; i < lights.length; i++){
  scene.add(lights[i]);
}

render();
animate();

