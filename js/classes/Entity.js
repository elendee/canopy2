import * as lib from '../lib.js?v=5'
// import ENTITIES from '../registers/ENTITIES.js?v=5'
import RAYCASTER from '../three/RAYCASTER.js?v=5'
import SCENE from '../three/SCENE.js?v=5'





const ANIM_STEP = 50
const FALL_TEST = 200
const FALL_GRACE = .1
const FALL_HOVER = FALL_GRACE / 2

const GRAVITY = 1
const DOWN = new THREE.Vector3(0, -1, 0)
const NEARBY_DIST = 5
// const FALL_TEST_RANGE = 10 // Entity within range will test - but their children may be way different

const COLLIDE_DIST = 1

const nearbyMat = new THREE.MeshPhongMaterial({
	color: 'blue',
})

const WORLD_POS_HOLDER = new THREE.Vector3()



// ----------------------------------------------------------------
// main class
// ----------------------------------------------------------------

class Entity {

	constructor( init ){

		init = init || {}
		// loaded
		this.uuid = init.uuid || lib.random_hex(12)
		this.type = init.type
		this.speed = init.speed || 1
		this.height = init.height || 1
		this.collide_radius = init.collide_radius || 1
		// instantiated
		this.state = {
			turning: false,
			running: false,
			strafing: false,
			walking: false,
		}
		this.bbox = new THREE.Box3()
		this.closest = { // closest intersection test obj
			distance: 999999,
			point: new THREE.Vector3(),
			object: false,
		}
		this.landing_int = false // vec 3
		this.ghost = {
			next: new THREE.Object3D(),
			last: new THREE.Object3D(),
		}
		this.NEARBY = []

	}







	// ----------------------------------------------------------------
	// init
	// ----------------------------------------------------------------

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
		this.update_bbox( true )
		this._model_dims = {
			x: this.bbox.max.x - this.bbox.min.x,
			y: this.bbox.max.y - this.bbox.min.y,
			z: this.bbox.max.z - this.bbox.min.z,
		}

	}

	update_bbox( update_collide_radii ){

		// update bbox
		this.bbox = lib.get_bbox( this.model )

		// set collide radius for all its children
		if( update_collide_radii ){
			if( !this.box.traverse ) return console.log('um', this )
			this.box.traverse( child => {
				if( child.isMesh ){
					const bbox = lib.get_bbox( child )
					const dims = {}
					for( const dim in bbox.min ){
						dims[dim] = bbox.max[dim] - bbox.min[dim]
					}
					if( !child.userData ) child.userData = {}
					child.userData.collide_radius = ( dims.x + dims.y + dims.z ) / 3
				}
			})
		}

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









	// ----------------------------------------------------------------
	// movement & animation
	// ----------------------------------------------------------------

	set_physics( state ){
		/* 
			start ghost obj
			start nearby objs refresh pulse
		*/

		if( !this.gravity ){
			this.gravity = setInterval(() => {
				this.update_landing()
			}, FALL_TEST )			
		}

		this.ghost.next.position.copy( this.box.position )
		// this.ghost.last.position.copy( this.box.position )

		// start nearby pulse
		if( state ){
			this.NEARBY.length = 0
			// let child_radius
			const worldpos = new THREE.Vector3()
			if( this.nearby_cache ) return console.log('repetitive calls to nearby cache')
			this.nearby_cache = setInterval(() => {
				this.NEARBY.length = 0
				for( const obj of ENTITIES ){
					if( obj === this ) continue
					// if( !obj.traverse ) return console.log('um', obj )
					obj.box.traverse( child => {
						if( child.isMesh && child.userData?.collide_radius ){
							// if( !child.originalColor ) child.originalColor = {
							// 	r: child.material.color.r,
							// 	g: child.material.color.g,
							// 	b: child.material.color.b,
							// }
							if( !child.originalMaterial ) child.originalMaterial = child.material

							// debugger
							child.getWorldPosition( worldpos )
							// child_radius = child.userData.collide_radius || 0
							// if( !child_radius ) console.log('invalid collidables...')
							if( worldpos.distanceTo( this.box.position ) < NEARBY_DIST ){
								this.NEARBY.push( child )
								child.material = nearbyMat
								// for( const c in child.originalColor ){
								// 	child.material.color[c] = nearbyMat.color[c]
								// }
							}else{
								child.material = child.originalMaterial
								// for( const c in child.originalColor ){
								// 	child.material.color[c] = child.originalColor[c]
								// }
								console.log( 'tried to restore', child.originalColor  )
							}
						}
					})
				}
			}, 1000 )			

		}else{

			clearInterval( this.nearby_cache )
			delete this.nearby_cache
			delete this.NEARBY

		}

	}

	update( delta_seconds ){

		// animations
		if( this.anim_mixer ){
			this.anim_mixer.update( delta_seconds )
		}

		if( this.isMoving ){
			// movement
			// running
			if( this.state.running > 0 ){
				this.ghost.next.translateZ( this.speed * delta_seconds )
			}else if( this.state.running < 0 ){
				this.ghost.next.translateZ( -this.speed * delta_seconds )
			} 
			// walking
			else if( this.state.walking > 0 ){
				this.ghost.next.translateZ( this.speed * delta_seconds * .5 )
			}else if( this.state.walking < 0 ){
				this.ghost.next.translateZ( -this.speed * delta_seconds * .5 )
			}
			// strafing
			if( this.state.strafing > 0 ){
				this.ghost.next.translateX( -this.speed * delta_seconds )
			}else if( this.state.strafing < 0 ){
				this.ghost.next.translateX( this.speed * delta_seconds )
			}
			// turning
			if( this.state.turning > 0 ){
				this.ghost.next.rotateY( 1.5 * delta_seconds )
			}else if( this.state.turning < 0 ){
				this.ghost.next.rotateY( -1.5 * delta_seconds )
			}
		}

		// falling takes only gravity as input
		if( this.isFalling ){

			this.momentum.y -= ( GRAVITY * delta_seconds )
			this.momentum.clampLength( -GRAVITY, GRAVITY )
			this.ghost.next.position.add( this.momentum )
			// .y -= Math.max( this.momentum.y, GRAVITY )
			if( this.landing_int && this.ghost.next.position.y <= this.landing_int.point.y + FALL_GRACE ){
				this.ghost.next.position.y = this.landing_int.point.y
				this.ghost.next.quaternion.copy( this.box.quaternion )
				console.log('landed')
				return this.stand_on( this.landing_int )
			}
			// if( this.box.position.y <= 0 ) {
			// 	delete this.isFalling
			// 	return this.box.position.y = 0
			// }
			// this.intersect = this.test_landing() // return int.object
			// if( this.intersect ){
			// 	this.stand_on( this.intersect )
			// }

		}



		for( const mesh of this.NEARBY ){
			mesh.getWorldPosition( WORLD_POS_HOLDER )
			this.collided = lib.collide_test( WORLD_POS_HOLDER, mesh.userData?.collide_radius, this.ghost.next.position, this.radius )
			if( this.collided ){ 
				// reset coords
				// this.box.position.copy( this.ghost.last.position )
				// this.box.quaternion.copy( this.ghost.last.quaternion )
				this.ghost.next.position.copy( this.box.position )
				this.ghost.next.quaternion.copy( this.box.quaternion )

				// console.log( this.collided )
				break;
			}
		}
		this.box.position.copy( this.ghost.next.position )

		// this.ghost.last.position.copy( this.box.position )
		// this.ghost.last.quaternion.copy( this.box.quaternion )

		// this.ghost.next.position.copy( this.box.position )
		this.ghost.next.quaternion.copy( this.box.quaternion )

	}







	// ----------------------------------------------------------------
	// collisions
	// ----------------------------------------------------------------






	// ----------------------------------------------------------------
	// gravity
	// ----------------------------------------------------------------

	fall(){
		if( !this.momentum?.isVector3 ) this.momentum = new THREE.Vector3()
		this.isFalling = true
	}

	stand_on( landing_int ){
		// clearInterval( this.isFalling )
		delete this.isFalling
		delete this.momentum
		this.landing_int = landing_int
		this.box.position.y = landing_int.point.y + FALL_HOVER//object.position.y
	}

	update_landing(){
		/*
			runs on slow-ish interval not on frame
		*/
		if( this.jumping ) return

		this.closest.updated = false
		// delete this.landing_int

		RAYCASTER.set( this.box.position, DOWN ) // box / ghost, not sure..
		const intersects = RAYCASTER.intersectObjects( SCENE.children, true )
		this.closest.distance = 99999
		this.closest.updated = false
		// console.log('testing down: ', intersects.length )
		for( const int of intersects ){
			if( int.object.userData?.standable ){
				if( int.distance < this.closest.distance ){
					this.closest = int
					this.closest.updated = true
				}
			}
		}

		// detect new lateral movements 
		if( this.closest.updated && this.closest.object !== this.landing_int?.object ){
			this.landing_int = this.closest
			// this.fall()
			// console.log('updated landing')
		}

	}

	jump(){

		switch( this.type ){

			case 'player':
				if( this.jumping ) return
				this.animate('jump', true, 0 )
				setTimeout(() => {
					this.animate('jump', false, 200 )
				}, 800 )
				// setTimeout(() => {
				this.momentum = new THREE.Vector3(0,.15,0)
				// let elapsed = 0
				const step = 10
				this.jumping = setInterval(() => {
					this.momentum.y -= .004
					if( this.momentum.y <= 0 ){
						clearInterval( this.jumping )
						delete this.jumping
						console.log("returning fall")
						return this.fall()
					}
					this.box.position.add( this.momentum )

				}, step )
				// }, 50)
				break;
			default: return console.log('no jump for : ' + this.type )
		}

	}










	// ----------------------------------------------------------------
	// 
	// ----------------------------------------------------------------

	raincheck_idle( time ){
		if( this.raincheck ) clearTimeout( this.raincheck )
		this.raincheck = setTimeout(() => {
			let state = false
			for( const type in this.animation.actions ){
				if( this.animation.actions[type].isRunning() ){
					state = true
				}
			}
			// no actions, so animate idle
			if( !state ) this.rest()
			// clear for next check
			this.raincheck = false
		}, time)
	}

	rest(){
		/*
			called whenever no anims are detected
		*/
		if( !this.animation ) return

		// this.animation.mixer.stopAllAction()
		this.animate('idle', true, 500 ) // fade_time || 0
		// setTimeout(() => {
		// 	for( const type in this.animation_map[ this.modeltype ] ){
		// 		if( type === 'idle' ) continue
		// 		// this.set_move_state( type, 0 )
		// 	}			
		// }, 800)

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
				// problem is this is still true 500ms after action is 'over'
				// so a "restarting" action never starts
				// hrm.
				if( name == 'idle'){
					this.raincheck_idle( 600 ) // keep longer than anim start / stop
				}
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