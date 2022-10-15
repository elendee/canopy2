import * as lib from '../lib.js?v=8'
import Entity from './Entity.js?v=8'


const loader = new THREE.GLTFLoader();


const movers = ['running', 'walking', 'strafing', 'victory'] // probably all anims but...


class Player extends Entity {

	constructor( init ){
		super(init)
		init = init || {}
		// loaded
		this.player1 = init.player1
		this.model_url = init.model_url
		// instantiated
		this.type = 'player'
		this.modeltype = 'quaternius_low'
		this.animation_map = { 
			/*
				game actions -> the embedded animation names for that modeltype
			*/
			quaternius_low: {
				'walking': {
					localized: 'Walk',
					fade: 500,
				},
				'running': {
					localized: 'Run',
					fade: 500,
				},
				'strafing': {
					localized: 'Run',
					fade: 500,
				},
				'turning': {
					localized: 'Walk',
					fade: 500,
				},
				'idle': {
					localized: 'Idle',
					fade: 500,
				},
				'receive_hit': {
					localized: 'RecieveHit', // (mispelled)
					fade: 500,
				},
				'jump': {
					localized: 'Jump', // (mispelled)
					fade: 150,
				},
				'punch': {
					localized: 'Punch', // (mispelled)
					fade: 200,
				},
				'victory': {
					localized: 'Victory', // (mispelled)
					fade: 50,
				},
				'roll': {
					localized: 'Roll', // (mispelled)
					fade: 50,
				},
			},

		}
	}

	async _load_model(){
		const r = await this._load_model_with_anims()
		return r
	}

	add_animation( model, animation_map ){
		if( !model || !animation_map ){
			console.log( 'invalid animation init' )
			console.log( 'animation_map', animation_map )
			console.log( 'model', model )
			return
		}

		this.animation = {
			mixer: new THREE.AnimationMixer( model.scene ),
			clips: model.animations,
			actions: {},
			fades: {},
		}
	
		let given_name, clip
		for( const type of Object.keys( animation_map ) ){
			given_name = animation_map[ type ]?.localized
			// console.log('looking to init: ', given_name )
			clip = THREE.AnimationClip.findByName( this.animation.clips, given_name )
			if( !clip ){
				if( type === 'running' ){ // ( a weird edge case - no 'Run' available )
					clip = THREE.AnimationClip.findByName( this.animation.clips, 'Run_Carry' )
				}
				if( !clip ){
					console.log('animation map failed to find: ', type )
					continue					
				}
			}
			this.animation.actions[ type ] = this.animation.mixer.clipAction( clip )
		}
	}


	// animate( delta_seconds ){

	// }

}


export default Player