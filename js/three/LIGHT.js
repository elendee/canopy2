import SCENE from './SCENE.js?v=7'

// light
// const LIGHT = new THREE.HemisphereLight(0xffffff, 0x080820, 1)
const LIGHT = window.LIGHT = new THREE.DirectionalLight(0xffffff, 1) // , 0x080820, 1
LIGHT.position.set( 20, 100, 0)
LIGHT.castShadow = true
LIGHT.shadow.mapSize.width = 512; // default
LIGHT.shadow.mapSize.height = 512; // default
LIGHT.shadow.camera.near = 0.1; // default
LIGHT.shadow.camera.far = 500; // default

LIGHT.shadow.camera.left = -CANOPY.radius;
LIGHT.shadow.camera.right = CANOPY.radius;
LIGHT.shadow.camera.top = CANOPY.radius;
LIGHT.shadow.camera.bottom = -CANOPY.radius;

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


export default {
	ambient: AMBIENT,
	directional: LIGHT,
}