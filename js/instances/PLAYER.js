import Player from '../classes/Player.js?v=4'
import BROKER from '../EventBroker.js?v=4'


// --------------------
// init player
// --------------------
const player = new Player()


const allowed_keys = [
	'speed',
	'model_url', 
	'player1',
	'height',
]

player.hydrate = data => {
	for( const key in data ){
		if( !allowed_keys.includes( key )){
			console.log('skipping player hydrate for key: ' + key)
			continue
		}
		player[ key ] = data[ key ]
	}
}

window.PLAYER = player




// --------------------
// subscribers
// --------------------
const move = event => {

	const { type, state } = event

	switch( type ){
		case 'roll_ccw':
			player.state.strafing = 1 * (Number(state))
			break;
		case 'roll_cw':
			player.state.strafing = -1 * (Number(state))
			break;
		case 'thrust_forward':
			player.state.walking = 1 * (Number(state))
			break;
		case 'thrust_back':
			player.state.walking = -1 * (Number(state))
			break;
		default: return 'asdf'
	}

	player.animate( 'walking', state, 500 )

}



BROKER.subscribe('MOVE_KEY', move )



export default player