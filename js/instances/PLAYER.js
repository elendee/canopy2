import Player from '../classes/Player.js?v=6'
import BROKER from '../EventBroker.js?v=6'


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

	// console.log( type, state )

	switch( type ){
		case 'roll_ccw':
			player.state.strafing = 1 * (Number(state))
			player.model.rotation.y = ( Math.PI / 8 ) * state
			break;
		case 'roll_cw':
			player.state.strafing = -1 * (Number(state))
			player.model.rotation.y = ( Math.PI / 8 ) * -state
			break;
		case 'thrust_forward':
			player.state.walking = 1 * (Number(state))
			break;
		case 'thrust_back':
			player.state.walking = -1 * (Number(state))
			break;
		case 'jump':
			player.jump()
			break;
		default: return 'asdf'
	}

	// walking
	if( state && !player.animation.actions.walking.isRunning() ){
		player.animate( 'walking', state, 500 )
	}else if( !state ){
		player.animate( 'walking', false, 500 )
	}
	// idling
	player.animate( 'idle', !state, 500 )

	// moving for physics checks
	player.isMoving = false
	for( const key in player.state ){
		if( player.state[key] ){
			player.isMoving = true
			break;
		}
	}

}



BROKER.subscribe('MOVE_KEY', move )



export default player