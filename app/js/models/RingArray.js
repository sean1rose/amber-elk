/**
 * Created by tom on 10/21/14.
 */

/**
 * Creates a new RingArray with the specified radius.
 *
 * This is an array that can hold {THREE.Object3D} or {THREE.Mesh} objects.
 * It will automaticallydistribute those objects evenly around a circle of
 * the provided radius. It allows manipulation of the objects as a single unit.
 * The child objects are positioned based on the origin of their respective local
 * coordinate systems, such that (0,0,0) in the child object's coordinate system
 * lies on the circle. Therefore, if the child object is centered around (0,0,0)
 * in its local coordinate system, half of the object will will fall within
 * the circle and the other half outside the circle.
 *
 * @param {number} radius The radius of the circle around which to distribute the objects
 * @constructor
 * @augments THREE.Object3D
 * @classdesc A self-balancing ring-shaped array of THREE.Object3D or THREE.Mesh objects.
 */
THREE.RingArray = function(radius){
  THREE.Object3D.call(this);
  this.radius = radius;
};

THREE.RingArray.prototype = Object.create(THREE.Object3D.prototype);
THREE.RingArray.prototype.constructor = THREE.RingArray;

/**
 * Rebalance the array; used internally, no need to call directly
 */
THREE.RingArray.prototype.rebalance = function(){
  for (var i = 0; i < this.children.length; i++){
    var x = this.radius * Math.cos(i * 2 * Math.PI / this.children.length);
    var y = this.radius * Math.sin(i * 2 * Math.PI / this.children.length);
    var z = 0;
    this.children[i].position.set(x, y, z);
    this.children[i].rotation.z = i * 2*Math.PI/this.children.length;
  }
};

/**
 * Add an object or objects to the ring array
 * @param {(...THREE.Object3D | ...THREE.Mesh | THREE.Object3D[] | THREE.Mesh[])} obj The object to add
 */
THREE.RingArray.prototype.add = function(obj){
  if (arguments.length > 1) {
    THREE.Object3D.prototype.add.apply(this, arguments);
  } else if (Array.isArray(obj)){
    THREE.Object3D.prototype.add.apply(this, obj);
  } else {
    THREE.Object3D.prototype.add.call(this, obj);
  }
  this.rebalance();
};

/**
 * Remove an object from the ring array.
 * @param {(...THREE.Object3D | ...THREE.Mesh | THREE.Object3D[] | THREE.Mesh[])} obj The object to remove
 */
THREE.RingArray.prototype.remove = function(obj){
  if (arguments.length > 1) {
    THREE.Object3D.prototype.remove.apply(this, arguments);
  } else if (Array.isArray(obj)){
    THREE.Object3D.prototype.remove.apply(this, obj);
  } else {
    THREE.Object3D.prototype.remove.call(this, obj);
  }
  this.rebalance();
};
