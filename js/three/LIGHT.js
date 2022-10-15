import SCENE from './SCENE.js?v=8'

// light
// const LIGHT = new THREE.HemisphereLight(0xffffff, 0x080820, 1)
const LIGHT = new THREE.DirectionalLight(0xffffff, 1) // , 0x080820, 1
LIGHT.position.set( 40, 70, 0)
LIGHT.castShadow = true
LIGHT.shadow.mapSize.width = 256; // default
LIGHT.shadow.mapSize.height = 256; // default
LIGHT.shadow.camera.near = 0.1; // default
LIGHT.shadow.camera.far = 500; // default

LIGHT.shadow.camera.left = -CANOPY.radius * 1.5;
LIGHT.shadow.camera.right = CANOPY.radius * 1.5;
LIGHT.shadow.camera.top = CANOPY.radius * 1.5;
LIGHT.shadow.camera.bottom = -CANOPY.radius * 1.5;

const helper = new THREE.DirectionalLightHelper( LIGHT, 5 )
SCENE.add( helper )

const AMBIENT = new THREE.AmbientLight( 0xffffff, .3 )
SCENE.add( AMBIENT )


// const LIGHT = new THREE.SpotLight(0xffffff) // , 0x080820, 1
// LIGHT.castShadow = true
// LIGHT.position.set( 5, 10, 5)
// LIGHT.lookAt( new THREE.Vector3() )

// // SPOTLIGHT stuff:
// // LIGHT.map = new THREE.TextureLoader().load( url )
// LIGHT.shadow.mapSize.width = 1024;
// LIGHT.shadow.mapSize.height = 1024;
// LIGHT.shadow.camera.near = 1;
// LIGHT.shadow.camera.far = 4000;
// LIGHT.shadow.camera.fov = 30;

const light = window.LIGHT = {
	ambient: AMBIENT,
	directional: LIGHT,	
}


export default light