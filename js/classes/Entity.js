import * as lib from '../lib.js?v=4'


const ANIM_STEP = 50


class Entity {

	constructor( init ){

		init = init || {}
		// loaded
		this.uuid = init.uuid || lib.random_hex(12)
		this.type = init.type
		this.speed = init.speed || 1
		this.height = init.height || 1
		// instantiated
		this.state = {
			turning: false,
			running: false,
			strafing: false,
			walking: false,
		}
		this.bbox = new THREE.Box3()
	}

	async init_model(){

		if( this.box ) return console.log('dupe init called', this )
		this.box = new THREE.Group()

		// switch( this.type ){

		// 	case 'plant':
		// 		this.model = await this._load_model()
		// 		break;

		// 	case 'canopy':
		// 		this.model = await this._build_model()
		// 		break;

		// 	case 'player':
		// 		this.model = await this._load_model( this.model_url )
		// 		break;

		// 	default:
		// 		return console.log('unable to load type', this.type )

		// }
		this.model = await this._load_model()

		if( this.animation ) this.anim_mixer = this.animation.mixer // ( for anim loop access )

		this.box.add( this.model )

		this.box.userData = {
			clickable: true,
			type: this.type,
		}

		// dimensions / scaling
		this.update_bbox( false )
		this._model_dims = {
			x: this.bbox.max.x - this.bbox.min.x,
			y: this.bbox.max.y - this.bbox.min.y,
			z: this.bbox.max.z - this.bbox.min.z,
		}

	}

	update_bbox(){
		this.bbox = lib.get_bbox( this.model )
	}

	scaleTo( world_height_units ){
		// const width = this.bbox.max.x - this.bbox.min.x
		// const height = this.bbox.max.y - this.bbox.min.y
		// const depth = this.bbox.max.z - this.bbox.min.z
		this.model.scale.set(1,1,1)

		const scalar = world_height_units / this._model_dims.y
		// const new_scale = asdf
		this.model.scale.multiplyScalar( scalar )
	}

	clearFade( name ){
		clearInterval( this.animation.fades[ name ] )
		// clearTimeout( this.animation.fades[ name ].timeout ) // deprecated
		delete this.animation.fades[ name ]
	}

	update( delta_seconds ){

		// animations
		if( this.anim_mixer ){
			this.anim_mixer.update( delta_seconds )
			// console.log('anim')
		}

		// movement
		// running
		if( this.state.running > 0 ){
			this.box.translateZ( this.speed * delta_seconds )
		}else if( this.state.running < 0 ){
			this.box.translateZ( -this.speed * delta_seconds )
		} 
		// walking
		else if( this.state.walking > 0 ){
			this.box.translateZ( this.speed * delta_seconds * .5 )
		}else if( this.state.walking < 0 ){
			this.box.translateZ( -this.speed * delta_seconds * .5 )
		}
		// strafing
		else if( this.state.strafing > 0 ){
			this.box.translateX( -this.speed * delta_seconds )
		}else if( this.state.strafing < 0 ){
			this.box.translateX( this.speed * delta_seconds )
		}
		
		// turning
		if( this.state.turning > 0 ){
			this.box.rotateY( 1.5 * delta_seconds )
			// rotation.y -= 1.5 * delta_seconds
		}else if( this.state.turning < 0 ){
			this.box.rotateY( -1.5 * delta_seconds )
			// this.box.rotation.y += 1.5 * delta_seconds
		}

	}

	animate( name, state, fadeN ){
		if( typeof fadeN !== 'number' ){
			return console.log('invalid fade', fadeN, name )
		}
		if( !this.animation || !name ){
			return console.log('invalid anim: ', name )
		}
		const action = this.animation.actions[ name ]
		if( !action ){
			return console.log('action not found: ', name )
		}

		let fades, step
		if( typeof fadeN === 'number' ){
			fades = this.animation.fades
		}

		if( state ){ // animate 'on'

			if( action.isRunning() ){
				// console.log('action still running; skip: ' + name + ', weight: ' + action.weight )
				return
			}

			action.weight = 0
			action.enabled = true
			step = ANIM_STEP / fadeN

			if( fades[ name ] ) this.clearFade( name )
			fades[ name ] = setInterval(() => {
				action.weight = Math.min( 1, action.weight + step )
				if( action.weight >= 1 ) this.clearFade( name )
			}, ANIM_STEP )

			action.play() 

		}else{ // animate 'off'

			step = ANIM_STEP / fadeN
			if( fades[ name ] ) this.clearFade( name )
			fades[ name ] = setInterval(() => {
				action.weight = Math.max( 0, action.weight - step )
				if( action.weight <= 0 ){
					this.clearFade( name )
					action.stop()
				}
			}, ANIM_STEP )

		}

	}

}

export default Entity