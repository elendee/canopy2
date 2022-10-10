import env from '../env.js?v=3'
import BROKER from '../EventBroker.js?v=3'
import Canopy from "../classes/Canopy.js?v=3";
import Plant from "../classes/Plant.js?v=3";
// import Player from '../classes/Player.js?v=3'
import PLAYER from '../instances/PLAYER.js?v=3'
import animate from '../animate.js?v=3';
import KEYS from '../gui/KEYS.js?v=3';
import CAMERA from '../gui/CAMERA.js?v=3';
import RENDERER from '../gui/RENDERER.js?v=3';
import MOUSE from '../gui/MOUSE.js?v=3';
import PLAYERS from '../registers/PLAYERS.js?v=3';





;(async() => {

document.body.appendChild( RENDERER.domElement );

// scene
const SCENE = window.SCENE = new THREE.Scene();

// light
const LIGHT = new THREE.HemisphereLight(0xffffff, 0x080820, 1)
SCENE.add( LIGHT )

// canopy / dome / ground
const canopy = window.CANOPY = new Canopy()
await canopy.init_model()
canopy.box.add( canopy.dish )
SCENE.add( canopy.box )

// player1
const spoofed_player_init = {
	model_url: env.PUBLIC_URL + '/resource/models/quaternius_low/Worker_Male.gltf',
	player1: true,
	height: 1,
}
PLAYER.hydrate( spoofed_player_init )
await PLAYER.init_model()
PLAYER.scaleTo( PLAYER.height )
PLAYER.box.position.set(0, 0, 3)
PLAYER.box.add( CAMERA.fixture )
PLAYERS[ PLAYER.uuid ] = PLAYER
SCENE.add( PLAYER.box )

// camera / controls
CAMERA.position.set( 0, 2, -5 ) 
CAMERA.lookAt( CAMERA.fixture.position )

animate()

// plants
for( let i = 0; i< 10; i++ ){

	const plant = new Plant({
		type: 'tree',
		radius: 1 + Math.random(),
	})

	plant.init_model()
	.then( res => {
		canopy.plant( plant )
	})		

}




})();
