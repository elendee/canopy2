import env from '../env.js?v=7'
import BROKER from '../EventBroker.js?v=7'
import Canopy from "../classes/Canopy.js?v=7";
import CANOPY from "../instances/CANOPY.js?v=7";
import Plant from "../classes/Plant.js?v=7";
// import Player from '../classes/Player.js?v=7'
import PLAYER from '../instances/PLAYER.js?v=7'
import animate from '../animate.js?v=7';
import KEYS from '../gui/KEYS.js?v=7';
import CAMERA from '../three/CAMERA.js?v=7';
import RENDERER from '../three/RENDERER.js?v=7';
import MOUSE from '../gui/MOUSE.js?v=7';
import ENTITIES from '../registers/ENTITIES.js?v=7'
// import PLAYERS from '../registers/PLAYERS.js?v=7';
import TARGET from '../gui/TARGET.js?v=7';
import LIGHT from '../three/LIGHT.js?v=7'
import SCENE from '../three/SCENE.js?v=7'


;(async() => {

	document.body.appendChild( RENDERER.domElement );

	SCENE.add( LIGHT.ambient )
	SCENE.add( LIGHT.directional )

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

	// automatic stuff:
	PLAYER.hydrate( spoofed_player_init )
	await PLAYER.init_model()
	PLAYER.scaleTo( PLAYER.height )
	PLAYER.update_bbox( true )
	PLAYER.box.userData = {
		clickable: true,
		obj_type: 'player',
		mesh_type: 'figure',
	}

	// relative stuff:
	PLAYER.box.position.set(0, 0, 3)
	SCENE.add( PLAYER.box )

	setTimeout(() => {
		PLAYER.set_physics( true )
	}, 500)

	// init cam on player
	PLAYER.box.add( CAMERA.fixture )
	CAMERA.fixture.position.y = 1
	if( !ENTITIES.includes( PLAYER ) ) ENTITIES.push( PLAYER )

	if( location.href.match(/localhost/) ) {
		const DEV_INTERVAL = setInterval(() => {
			// console.log( PLAYER.state )
		}, 1000)
	}

	const START_CAM_DIST = 2
	// camera / controls
	CAMERA.position.set( 0, START_CAM_DIST, -START_CAM_DIST ) 
	CAMERA.lookAt( CAMERA.fixture.position )

	animate()

	// plants
	for( let i = 0; i < 5; i++ ){
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
