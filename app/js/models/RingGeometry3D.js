/**
 * Created by tom on 10/16/14.
 */

/**
 * Creates a new 3D ring geometry.
 * @param {number} [outerRadius=100] Outer radius; r_outer > 0
 * @param {number} [innerRadius=75] Inner radius r_outer > r_inner > 0;
 * @param {number} [height=10] Ring Height; h > 0
 * @param {number} [thetaSegments=8] Theta segments; n_θ > 2; must be an integer
 * @param {number} [phiSegments=3] Phi segments; n_φ > 0; must be an integer
 * @param {number} [heightSegments=3] Height segments; n_h > 0; must be an integer
 * @param {number} [thetaStart=0] Angle of start of first theta segment; 0 ≤ θ < 2π
 * @param {number} [thetaLength=2*Math.PI] Arc length of the ring; 0 < l_θ < 2π
 * @constructor
 * @augments THREE.Geometry
 * @classdesc Geometry object for a 3D ring.
 */
THREE.RingGeometry3D = function (outerRadius, innerRadius, height, thetaSegments, phiSegments, heightSegments, thetaStart, thetaLength) {

  THREE.Geometry.call(this);

  this.parameters = {
    outerRadius: outerRadius || 100,
    innerRadius: innerRadius ? Math.min(innerRadius, outerRadius - 0.001) : 75,
    height: height ? Math.max(height, 0.001) : 10,
    thetaSegments: thetaSegments ? Math.max(thetaSegments, 3) : 8,
    phiSegments: phiSegments ? Math.max(phiSegments, 1) : 3,
    heightSegments: heightSegments ? Math.max(heightSegments, 1) : 3,
    thetaStart: thetaStart === undefined ? 0 : thetaStart % (2 * Math.PI),
    thetaLength: thetaLength ? thetaLength % (2*Math.PI) : 0
  };
  this.parameters.thetaLength = this.parameters.thetaLength || 2*Math.PI;

  // p is shorter than this.parameters...
  var p = this.parameters;

  /**
   * Creates a new vector from provided parameters.
   * Just a short wrapper for {THREE.Vector3}
   * @param x
   * @param y
   * @param z
   * @returns {THREE.Vector3}
   */
  var Vec = function (x, y, z) {
    return new THREE.Vector3(x, y, z);
  };



  var closed = this.isClosed();
  var open = !closed;
  var f = {};
  var heightIndex, phiIndex, thetaIndex;
  var v1, v2, v3, v4, n1, n2, n3, n4;

  // make vertices
  var heightStep = p.height / p.heightSegments;
  var phiStep = (p.outerRadius - p.innerRadius) / p.phiSegments;
  var thetaStep = p.thetaLength / p.thetaSegments;
  var vIndex = -1;
  for (heightIndex = 0; heightIndex <= p.heightSegments; heightIndex++) {
    for (phiIndex = 0; phiIndex <= p.phiSegments; phiIndex++) {
      for (thetaIndex = 0; thetaIndex < p.thetaSegments + (open ? 1 : 0); thetaIndex++) {
        if (           heightIndex === 0 || heightIndex === p.heightSegments   // end faces
          ||           phiIndex    === 0 || phiIndex    === p.phiSegments      // wall faces
          || (open && (thetaIndex  === 0 || thetaIndex  === p.thetaSegments))) // segment faces
        {
          vIndex++;
          v1 = new THREE.Vector3();
          var segment = p.thetaStart + thetaIndex * thetaStep;
          v1.x = (p.innerRadius + (phiIndex * phiStep)) * Math.cos(segment);
          v1.y = (p.innerRadius + (phiIndex * phiStep)) * Math.sin(segment);
          v1.z = heightIndex * heightStep - p.height / 2;
          this.vertices.push(v1);
          // wall faces
          if (phiIndex === 0){
            f.inner ? f.inner.push(vIndex) : f.inner = [vIndex];
          }
          if (phiIndex === p.phiSegments){
            f.outer ? f.outer.push(vIndex) : f.outer = [vIndex];
          }
          // segment faces
          if (open){
            if (thetaIndex === 0){
              f.start ? f.start.push(vIndex) : f.start = [vIndex];
            }
            if (thetaIndex === p.thetaSegments){
              f.end ? f.end.push(vIndex) : f.end = [vIndex];
            }
            f.segment ? f.segment.push(vIndex) : f.segment = [vIndex];
          }
          // end faces
          if (heightIndex === 0){
            f.bottom ? f.bottom.push(vIndex) : f.bottom = [vIndex];
          }
          if (heightIndex === p.heightSegments){
            f.top ? f.top.push(vIndex) : f.top = [vIndex];
          }
        }
      }
    }
  }

  // end faces
  for (phiIndex = 0; phiIndex < p.phiSegments; phiIndex++) {
    for (thetaIndex = 0; thetaIndex < p.thetaSegments; thetaIndex++) {
      v1 = phiIndex * (p.thetaSegments + (open ? 1 : 0)) + thetaIndex;
      v2 = v1 + (p.thetaSegments + (open ? 1 : 0));
      v3 = phiIndex * (p.thetaSegments + (open ? 1 : 0)) + (closed ? (thetaIndex + 1) % p.thetaSegments : (thetaIndex + 1));
      v4 = v3 + (p.thetaSegments + (open ? 1 : 0));
      // bottom end
      this.faces.push(new THREE.Face3(f.bottom[v1], f.bottom[v3], f.bottom[v4], [Vec(0,0,-1), Vec(0,0,-1), Vec(0,0,-1)]));
      this.faces.push(new THREE.Face3(f.bottom[v4], f.bottom[v2], f.bottom[v1], [Vec(0,0,-1), Vec(0,0,-1), Vec(0,0,-1)]));
      // top end
      this.faces.push(new THREE.Face3(f.top[v1], f.top[v2], f.top[v4], [Vec(0,0,1), Vec(0,0,1), Vec(0,0,1)]));
      this.faces.push(new THREE.Face3(f.top[v4], f.top[v3], f.top[v1], [Vec(0,0,1), Vec(0,0,1), Vec(0,0,1)]));
    }
  }

  // wall faces
  for (heightIndex = 0; heightIndex < p.heightSegments; heightIndex++){
    for (thetaIndex = 0; thetaIndex < p.thetaSegments; thetaIndex++){
      v1 = heightIndex * (p.thetaSegments + (open ? 1 : 0)) + thetaIndex;
      v2 = v1 + (p.thetaSegments + (open ? 1 : 0));
      v3 = heightIndex * (p.thetaSegments + (open ? 1 : 0)) + (closed ? (thetaIndex + 1) % p.thetaSegments : (thetaIndex + 1));
      v4 = v3 + (p.thetaSegments + (open ? 1 : 0));
      n1 = Vec(-this.vertices[f.inner[v1]].x, -this.vertices[f.inner[v1]].y, 0).normalize();
      n2 = Vec(-this.vertices[f.inner[v3]].x, -this.vertices[f.inner[v3]].y, 0).normalize();
      n3 = Vec(this.vertices[f.outer[v1]].x, this.vertices[f.outer[v1]].y, 0).normalize();
      n4 = Vec(this.vertices[f.outer[v3]].x, this.vertices[f.outer[v3]].y, 0).normalize();
      // inner wall
      this.faces.push(new THREE.Face3(f.inner[v1], f.inner[v2], f.inner[v4], [n1.clone(), n1.clone(), n2.clone()]));
      this.faces.push(new THREE.Face3(f.inner[v4], f.inner[v3], f.inner[v1], [n2.clone(), n2.clone(), n1.clone()]));
      // outer wall
      this.faces.push(new THREE.Face3(f.outer[v1], f.outer[v3], f.outer[v4], [n3.clone(), n4.clone(), n4.clone()]));
      this.faces.push(new THREE.Face3(f.outer[v4], f.outer[v2], f.outer[v1], [n4.clone(), n3.clone(), n3.clone()]));
    }
  }

  // segment faces
  if (open){
    for (heightIndex = 0; heightIndex < p.heightSegments; heightIndex++){
      for (phiIndex = 0; phiIndex < p.phiSegments; phiIndex++){
        v1 = heightIndex * (p.phiSegments + 1) + phiIndex;
        v2 = v1 + p.phiSegments + 1;
        v3 = v1 + 1;
        v4 = v3 + p.phiSegments + 1;
        n1 = Vec(this.vertices[f.start[v1]].x, this.vertices[f.start[v1]].y, 0).normalize().applyAxisAngle(Vec(0,0,1), -Math.PI/2);
        n2 = Vec(this.vertices[f.end[v1]].x, this.vertices[f.end[v1]].y, 0).normalize().applyAxisAngle(Vec(0,0,1), Math.PI/2);
        // start wall
        this.faces.push(new THREE.Face3(f.start[v4], f.start[v2], f.start[v1], [n1.clone(), n1.clone(), n1.clone()]));
        this.faces.push(new THREE.Face3(f.start[v1], f.start[v3], f.start[v4], [n1.clone(), n1.clone(), n1.clone()]));
        // end wall
        this.faces.push(new THREE.Face3(f.end[v1], f.end[v2], f.end[v4], [n2.clone(), n2.clone(), n2.clone()]));
        this.faces.push(new THREE.Face3(f.end[v4], f.end[v3], f.end[v1], [n2.clone(), n2.clone(), n2.clone()]));
      }
    }
  }

  this.computeFaceNormals();
};

THREE.RingGeometry3D.prototype = Object.create(THREE.Geometry.prototype);
THREE.RingGeometry3D.prototype.constructor = THREE.RingGeometry3D;

// Class Methods //

THREE.RingGeometry3D.prototype.isClosed = function(){
  return this.parameters.thetaLength === 2*Math.PI;
};
