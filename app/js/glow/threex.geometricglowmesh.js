var THREEx	= THREEx || {};

THREEx.GeometricGlowMesh	= function(mesh){
	var object3d	= new THREE.Object3D;
  var geometry, material, insideMesh, outsideMesh;
	geometry	= mesh.geometry.clone();
	THREEx.dilateGeometry(geometry, 0.01);
	material	= THREEx.createAtmosphereMaterial();
	material.uniforms.glowColor.value	= new THREE.Color('cyan');
	material.uniforms.coefficient.value	= 1.1;
	material.uniforms.power.value		= 1.4;
	insideMesh	= new THREE.Mesh(geometry, material);
	object3d.add( insideMesh );


	geometry	= mesh.geometry.clone();
	THREEx.dilateGeometry(geometry, 0.1);
	material	= THREEx.createAtmosphereMaterial();
	material.uniforms.glowColor.value	= new THREE.Color('cyan');
	material.uniforms.coefficient.value	= 0.1;
	material.uniforms.power.value		= 1.2;
	material.side	= THREE.BackSide;
	outsideMesh	= new THREE.Mesh( geometry, material );
	object3d.add( outsideMesh );

	// expose a few variable
	this.object3d	= object3d;
	this.insideMesh	= insideMesh;
	this.outsideMesh= outsideMesh;
};
