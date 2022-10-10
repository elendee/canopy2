const CAMERA = new THREE.PerspectiveCamera( 
	75, 
	window.innerWidth / window.innerHeight, 
	1, 
	12000 
);
CAMERA.fixture = new THREE.Group()
CAMERA.fixture.add( CAMERA )

window.CAMERA = CAMERA

export default CAMERA