
var lights = [];
var i;

var render = function() {
  var delta = clock.getDelta();
  composer.render(delta);
  //renderer.render(scene, camera);
};

var animate = function(){
  requestAnimationFrame(animate);
  player.animate();
  render();
};

var renderer = new THREE.WebGLRenderer({antialias: true});
var composer = new THREE.EffectComposer(renderer);
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera (90, window.innerWidth / window.innerHeight, 5, 1300);
var renderPass = new THREE.RenderPass(scene, camera);
var renderMask = new THREE.MaskPass(scene, camera);
var clearMask = new THREE.ClearMaskPass();
var bloomPass = new THREE.BloomPass(2);
var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
var clock = new THREE.Clock();

renderer.gammaInput

effectCopy.renderToScreen = true;
composer.addPass(renderPass);
//composer.addPass(renderMask);
composer.addPass(bloomPass);
composer.addPass(effectCopy);
//composer.addPass(clearMask);

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

