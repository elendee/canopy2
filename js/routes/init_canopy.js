import env from '../env.js?v=4'
import BROKER from '../EventBroker.js?v=4'
import Canopy from "../classes/Canopy.js?v=4";
import CANOPY from "../instances/CANOPY.js?v=4";
import Plant from "../classes/Plant.js?v=4";
// import Player from '../classes/Player.js?v=4'
import PLAYER from '../instances/PLAYER.js?v=4'
import animate from '../animate.js?v=4';
import KEYS from '../gui/KEYS.js?v=4';
import CAMERA from '../gui/CAMERA.js?v=4';
import RENDERER from '../gui/RENDERER.js?v=4';
import MOUSE from '../gui/MOUSE.js?v=4';
import PLAYERS from '../registers/PLAYERS.js?v=4';
import TARGET from '../gui/TARGET.js?v=4';



;(async() => {

	document.body.appendChild( RENDERER.domElement );

	// scene
	const SCENE = window.SCENE = new THREE.Scene();

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

	SCENE.add( LIGHT )

	// canopy / dome / ground
	await CANOPY.init_model()
	SCENE.add( CANOPY.box )

	// player1
	const spoofed_player_init = {
		model_url: env.PUBLIC_URL + '/resource/models/quaternius_low/Worker_Male.gltf',
		player1: true,
		height: 1,
		speed: 3,
	}

	PLAYER.hydrate( spoofed_player_init )
	await PLAYER.init_model()
	PLAYER.scaleTo( PLAYER.height )
	PLAYER.box.position.set(0, 0, 3)
	PLAYER.box.add( CAMERA.fixture )
	PLAYERS[ PLAYER.uuid ] = PLAYER
	SCENE.add( PLAYER.box )

	const START_CAM_DIST = 12
	// camera / controls
	CAMERA.position.set( 0, START_CAM_DIST, -START_CAM_DIST ) 
	CAMERA.lookAt( CAMERA.fixture.position )

	animate()

	// plants
	for( let i = 0; i< 8; i++ ){
		BROKER.publish('CANOPY_ADD_PLANT', {
			data: {
				type: 'tree',
				radius: 1 + Math.random(),
				scraggliness: 3, 
				taper: .08, // default .1
				branchiness: .4, 
			}
		})
	}

})();
