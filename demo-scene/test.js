/**
 * Created by tom on 10/15/14.
 */


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera (90, window.innerWidth / window.innerHeight, 5, 1300);
var renderer = new THREE.WebGLRenderer({antialias: true});
scene.fog = new THREE.Fog(0xfcfcfc, 0, 250);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xfcfcfc);
var light = new THREE.HemisphereLight(0xfcfcfc, 0xfcfcfc, 0.99);
scene.add(light);
document.body.appendChild(renderer.domElement);

var cam_roll = 0;
$(window).keydown(function(event){
  switch (event.which){
    case 37: /*left*/
    case 65: /*A*/
    case 81: /*Q*/
      cam_roll = 1;
      break;
    case 39: /*right*/
    case 68: /*D*/
      cam_roll = 2;
      break;
    default :
      cam_roll = 0;
      break;
  }
});

var tlooptime = 30;
var tParent;
var scale = 12;
var tube = [];
var segments = 100;
var radiusSegments = 12;
tParent = new THREE.Object3D();
scene.add(tParent);
tParent.add(camera);

var normal = new THREE.Vector3();
var vectorZ = 0;
var nb = 0;
var bn = 0;
var obj = [];

//var ring = new THREE.RingGeometry(1, 1.05, 32);
//var ringMaterial = new THREE.MeshPhongMaterial({
//  color: 0xf5048d,
//  transtparent: true,
//  opacity: 0.8,
//  wireframe: false,
//  side: THREE.DoubleSide,
//  shininess: 0.3,
//  reflectivity: 0.99
//});
//var ringMesh = new THREE.Mesh(ring, ringMaterial);
//scene.add(ringMesh);
//ringMesh.position = new THREE.Vector3(0,0,100);

var addTube = function(){
  var Spline = new THREE.SplineCurve3([
      new THREE.Vector3(Math.random() * 100, Math.random() * 100, vectorZ-=0.001),
      new THREE.Vector3(Math.random() * 100, Math.random() * 100, vectorZ += 50),
      new THREE.Vector3(Math.random() * 100, Math.random() * 100, vectorZ += 50),
      new THREE.Vector3(Math.random() * 100, Math.random() * 100, vectorZ += 50),
      new THREE.Vector3(Math.random() * 100, Math.random() * 100, vectorZ += 50),
      new THREE.Vector3(Math.random() * 100, Math.random() * 100, vectorZ += 50)
  ]);
  tube[nb] = new THREE.TubeGeometry(Spline, segments, 2, radiusSegments, false);

  var material = [
      new THREE.MeshPhongMaterial({
        color: 0x7ec5f1,
        transtparent: true,
        opacity: 1,
        wireframe: true,
        side: THREE.BackSide,
        shininess: 0,
        reflectivity: 0.99
      }),
      new THREE.MeshPhongMaterial({
        color: 0x73c5f1,
        transtparent: true,
        opacity: 1,
        wireframe: true,
        side: THREE.BackSide,
        shininess: 0,
        reflectivity: 0.99
      })
  ];
  obj[nb] = THREE.SceneUtils.createMultiMaterialObject(tube[nb], material);
  var oldObj = nb-2;
  tParent.remove(obj[oldObj]);
  tParent.add(obj[nb]);
  obj[nb].scale.set(scale,scale,scale);
  nb++;
};

addTube();

$(window).on('resize', function(){
  var WH = window.innerWidth * 56.25/100;
  var WW = window.innerWidth;
  camera.aspect = WW/WH;
  camera.updateProjectionMatrix();
  renderer.setSize(WW, WH);
});

$(window).trigger('resize');

var time = 250;
var pos, rot_cam = 0;
var actu_buff = 0;
function render(){
  requestAnimationFrame(render);
  time += 0.01 + (actu_buff /10000);
  if (time >= tlooptime / 2 && nb - 1 <= bn){
    addTube();
  } else if (time >= tlooptime){
    time = 0;
    bn++;
  }
  var t = (time % tlooptime) / tlooptime;
  pos = tube[bn].parameters.path.getPointAt(t);
  pos.multiplyScalar(scale);
  var dir = tube[bn].parameters.path.getTangentAt(t);
  camera.position.copy(pos);
  var lookAt = tube[bn].parameters.path.getPointAt((t+30/tube[bn].parameters.path.getLength()) % 1).multiplyScalar(scale);
  lookAt.copy(pos).add(dir);
  camera.matrix.lookAt(camera.position, lookAt, normal);
  camera.rotation.setFromRotationMatrix(camera.matrix, camera.rotation.order);
  rot_cam += 0.001;
  camera.rotation.z = rot_cam;
  renderer.render(scene, camera);
}
render();