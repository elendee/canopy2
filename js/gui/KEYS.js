
import env from '../env.js?v=7'

import BINDS from './BINDS.js?v=7'

import BROKER from '../EventBroker.js?v=7'




const handle_keydown = ( e ) => {

	switch( e.keyCode ){

		case BINDS.global.chat:
			BROKER.publish('CHAT_FOCUS')
			break;

		case BINDS.sky.roll.ccw:
			BROKER.publish('MOVE_KEY', {
				type: 'roll_ccw',
				state: true,
			})
			break;

		case BINDS.sky.roll.cw:
			BROKER.publish('MOVE_KEY', {
				type: 'roll_cw',
				state: true,
			})
			break;

		case BINDS.sky.thrust.forward: 
			BROKER.publish('MOVE_KEY', {
				type: 'thrust_forward',
				state: true,
			})
			break;

		case BINDS.sky.thrust.back:
			BROKER.publish('MOVE_KEY', {
				type: 'thrust_back',
				state: true,
			})
			break;

		case BINDS.sky.yaw.port: 
			BROKER.publish('MOVE_KEY', {
				type: 'yaw_port',
				state: true,
			})
			break;

		case BINDS.sky.yaw.starboard: 
			BROKER.publish('MOVE_KEY', {
				type: 'yaw_starboard',
				state: true,
			})
			break;

		case BINDS.sky.pitch.up: 
			BROKER.publish('MOVE_KEY', {
				type: 'pitch_up',
				state: true,
			})
			break;

		case BINDS.sky.pitch.down: 
			BROKER.publish('MOVE_KEY', {
				type: 'pitch_down',
				state: true,
			})
			break;
			
		case BINDS.sky.jump:
			BROKER.publish('MOVE_KEY', {
				type: 'jump',
			})
			break;

		default: 

			break

		}//switch

}









const handle_keyup = ( e ) => {

	switch( e.keyCode ){

		case BINDS.global.chat_alt:
			BROKER.publish('CHAT_FOCUS_ALT')
			break;

		case BINDS.sky.thrust.forward:
			BROKER.publish('MOVE_KEY', { // all the cosmetics
				type: 'thrust_forward',
				state: false,
			})
			break

		case BINDS.sky.thrust.back:
			BROKER.publish('MOVE_KEY', {
				type: 'thrust_back',
				state: false,
			})
			break

		case BINDS.sky.yaw.port:
			BROKER.publish('MOVE_KEY', {
				type: 'yaw_port',
				state: false,
			})
			break

		case BINDS.sky.yaw.starboard:
			BROKER.publish('MOVE_KEY', {
				type: 'yaw_starboard',
				state: false,
			})
			break

		case BINDS.sky.pitch.up:
			BROKER.publish('MOVE_KEY', {
				type: 'pitch_up',
				state: false,
			})
			break

		case BINDS.sky.pitch.down:
			BROKER.publish('MOVE_KEY', {
				type: 'pitch_down',
				state: false,
			})
			break
		
		case BINDS.sky.roll.ccw:
			BROKER.publish('MOVE_KEY', {
				type: 'roll_ccw',
				state: false,
			})
			break

		case BINDS.sky.roll.cw:
			BROKER.publish('MOVE_KEY', {
				type: 'roll_cw',
				state: false,
			})
			break

		case BINDS.sky.reset_camera:
			BROKER.publish('MOUSE_UNPAN')
			break;

		default: 
			break
	}

}






document.addEventListener('keyup', handle_keyup )
document.addEventListener('keydown', handle_keydown )		

// if( env.EXPOSE ) window.KEYS = keys




export default {}
