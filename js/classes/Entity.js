import * as lib from '../lib.js?v=7'
// import ENTITIES from '../registers/ENTITIES.js?v=7'
import RAYCASTER from '../three/RAYCASTER.js?v=7'
import SCENE from '../three/SCENE.js?v=7'




const loader = new THREE.GLTFLoader()


const ANIM_STEP = 20
const FALL_TEST_SLOW = 500
const FALL_TEST_FAST = 10
const FALL_ACCELERATION = .004
const FALL_WIDTH = .3
const JUMP_SPRING = .2
const STEP_HEIGHT = .25
const HOVER = STEP_HEIGHT / 2

const GRAVITY = .1
const DOWN = new THREE.Vector3(0, -1, 0)
const NEARBY_DIST = 3
// const COLLIDE_DIST = 1

const nearbyMat = new THREE.MeshPhongMaterial({
	color: 'blue',
})

const WORLD_POS_HOLDER = new THREE.Vector3()
const PROJECTION_HOLDER = new THREE.Vector3()
let directionality = {
	one: false,
	two: false,
}




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
		this.momentum = new THREE.Vector3()
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
		/*
			set:
			- this.model
			- this.anim_mixer
			- this.box.userData
			- this._current_dims
		*/

		if( this.box ) return console.log('dupe init called', this )
		this.box = new THREE.Group()

		this.model = await this._load_model()

		// this.model.position.y -= HOVER // ( because box is held up at step height )

		if( this.animation ) this.anim_mixer = this.animation.mixer // ( for anim loop access )

		this.box.add( this.model )

		// this.box.userData = {
		// 	// clickable: define individually
		// 	obj_type: this.type,
		// 	mesh_type: this.mesh_type,
		// }

		// this.box.traverse( child => {
		// 	if( !child.children ) child.children = []
		// })
		// dimensions / scaling
		this.update_bbox( true )
		this._current_dims = {
			x: this.bbox.max.x - this.bbox.min.x,
			y: this.bbox.max.y - this.bbox.min.y,
			z: this.bbox.max.z - this.bbox.min.z,
		}

		if( this.model_url && typeof this.height === 'number' ){
			this.scaleTo( this.height )
		}
	}

	update_bbox( update_collide_radii ){

		// update bbox
		this.bbox = lib.get_bbox( this.model )

		// set collide radius for all its children
		if( update_collide_radii ){
			if( this.player1 ){
				this.collide_radius = lib.average_bbox( this.bbox )
			}else{
				this.box.traverse( child => {
					if( child.isMesh ){
						if( !child.userData ) child.userData = {}
						const bbox = lib.get_bbox( child )
						child.userData.collide_radius = lib.average_bbox( bbox ) * .75
					}
				})	
			}
		}

	}


	_load_model_with_anims(){
		return new Promise((resolve, reject) => {
			loader.load( this.model_url, obj => {
				// console.log( obj )
				if( obj.animations?.length && this.animation_map ){
					const map = this.animation_map[ this.modeltype ]
					// console.log('adding anim map: ', filepath )
					this.add_animation( obj, map )
				}else{
					console.log('unhandled animations for upload', this )
				}
				const model = obj.scene
				let c = 0
				model.traverse( child => {
					if( c < 5 && child.isMesh ){ // 
						child.castShadow = true
						child.receiveShadow = true						
						// console.log('traversing...', child.type )
						c++
					}
				})
				resolve( model )
			})
		})
	}



	scaleTo( world_height_units ){
		// const width = this.bbox.max.x - this.bbox.min.x
		// const height = this.bbox.max.y - this.bbox.min.y
		// const depth = this.bbox.max.z - this.bbox.min.z
		this.model.scale.set(1,1,1)

		const scalar = world_height_units / this._current_dims.y
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

	set_gravity_resolution( ms ){
		if( this.gravity ) clearInterval( this.gravity )
		this.gravity = setInterval(() => {
			this.update_landing()
			// console.log( this.landing_int )
		}, ms )
	}

	set_physics( state ){
		/* 
			start ghost obj
			start nearby objs refresh pulse
		*/

		this.set_gravity_resolution( FALL_TEST_SLOW )

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
						if( child.isMesh && child.userData?.standable ){
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
								// console.log( 'restored NEARBY color', child.originalColor  )
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
			if( this.landing_int && this.ghost.next.position.y <= this.landing_int.point.y + STEP_HEIGHT ){
				this.ghost.next.position.y = this.landing_int.point.y
				this.ghost.next.quaternion.copy( this.box.quaternion )
				// console.log('landed')
				// this.isFalling = false
				return this.stand_on( this.landing_int )
			}

		}

		// handle collisions
		for( const mesh of this.NEARBY ){
			mesh.getWorldPosition( WORLD_POS_HOLDER )

			const bumpers = mesh.userData.collide_radius + this.collide_radius
			const dist = WORLD_POS_HOLDER.distanceTo( this.ghost.next.position )
			const projected_dist = this.box.position.distanceTo( this.ghost.next.position )

			if( bumpers < dist ){ 
				RAYCASTER.set( 
					this.box.position, 
					PROJECTION_HOLDER.subVectors( this.ghost.next.position, this.box.position ),
					0, 
					projected_dist 
				)
				const intersects = RAYCASTER.intersectObjects( this.NEARBY, true )
				if( intersects.length ){
					this.ghost.next.position.copy( this.box.position )
					break;
					// for( const int of intersects ){
					// 	// console.log('comparing: ', int.point.y , )
					// 	if( int.point.y > this.ghost.next.position.y + STEP_HEIGHT ){ // allow 'step ups'
					// 		// collide; set back
					// 		this.ghost.next.position.copy( this.box.position )
					// 		break;							
					// 	}
					// 	debugger
					// }
				}

			}else{
				// player is 'inside' the object already
			}

			// this.collided = lib.sphere_test( WORLD_POS_HOLDER, mesh.userData?.collide_radius, this.ghost.next.position, this.radius )

			// if( this.collided ){ 
			// 	// test if player is moving -towards- collision or away
			// 	mesh.getWorldPosition( WORLD_POS_HOLDER )
			// 	directionality.current = this.box.position.distanceTo( WORLD_POS_HOLDER )
			// 	mesh.getWorldPosition( WORLD_POS_HOLDER )
			// 	directionality.next = this.ghost.next.position.distanceTo( WORLD_POS_HOLDER )
			// 	if( directionality.next < directionality.current ){
			// 		// reset coords
			// 		// this.box.position.copy( this.ghost.last.position )
			// 		// this.box.quaternion.copy( this.ghost.last.quaternion )
			// 		this.ghost.next.position.copy( this.box.position )
			// 		this.ghost.next.quaternion.copy( this.box.quaternion )
			// 		// console.log( this.collided )
			// 		break;					
			// 	}

			// }
		}
		this.box.position.copy( this.ghost.next.position )

		// this.ghost.last.position.copy( this.box.position )
		// this.ghost.last.quaternion.copy( this.box.quaternion )

		// this.ghost.next.position.copy( this.box.position )
		this.ghost.next.quaternion.copy( this.box.quaternion )

	}












	// ----------------------------------------------------------------
	// gravity
	// ----------------------------------------------------------------

	stand_on( landing_int ){
		// clearInterval( this.is-Falling )
		delete this.isFalling
		this.momentum.set(0,0,0)
		this.landing_int = landing_int
		this.box.position.y = landing_int.point.y //+ HOVER//object.position.y
		this.animate('victory', false, 50)
		// this.animate('')
	}

	update_landing(){
		/*
			runs on slow-ish interval not on frame
		*/
		// if( this.jumping ) return

		// delete this.landing_int

		this.closest.distance = 99999
		this.closest.updated = false

		for( let x = 0; x < 2; x++ ){
			for( let z = 0; z < 2; z++ ){

				const dummy = this.box.position.clone()
				dummy.x += ( FALL_WIDTH - (x * FALL_WIDTH ))
				dummy.z += ( FALL_WIDTH - (z * FALL_WIDTH ))
				dummy.y += STEP_HEIGHT

				RAYCASTER.set( dummy, DOWN ) // box / ghost, not sure..
				const intersects = RAYCASTER.intersectObjects( SCENE.children, true )

				// console.log('testing down: ', intersects.length )
				for( const int of intersects ){
					if( int.object.userData?.standable ){
						// console.log('standable')
						if( int.distance < this.closest.distance ){
						// console.log('standable is close')
							this.closest = int
							this.closest.updated = true
							break;
						}
					}
				}
			}
		}

		// detect new lateral movements 
		// this.closest.object !== this.landing_int?.object  // << - this introduces an off-by-one possibility where player never falls...
		if( this.closest.updated ){ 
			if( this.closest.distance < .3 ){ // point is close and above the player.. step up
				// actually - it's LATERAL collision that blocks this mainly, but doesnt hurt...
				if( this.closest.point.y > this.box.position.y ){ 
					this.ghost.next.position.y = this.closest.point.y
				}else{

				}
			}else{ // far enough to / step down //  if( this.closest.distance > .2 )
				if( this.closest.point.y < this.box.position.y ){ // point is close and above the player.. step up
					this.landing_int = this.closest
					this.isFalling = true	
				}else{
					// shouldnt happen, but intersection is far above player
				}			
			}
		}

	}

	fall(){
		this.momentum.y = Math.max( 0, this.momentum.y )
		this.isFalling = true
		this.animate('victory', true, 50)
	}

	jump(){

		switch( this.type ){

			case 'player':

				if( this.jumping ) return

				this.animate('jump', true, 30 )

				this.set_gravity_resolution( FALL_TEST_FAST )

				setTimeout(() => {
					this.animate('jump', false, 200 )
				}, 800 )

				this.momentum = new THREE.Vector3( 0, JUMP_SPRING, 0 )

				const step = 10
				this.jumping = setInterval(() => {
					this.momentum.y -= FALL_ACCELERATION
					if( this.momentum.y <= 0 ){
						clearInterval( this.jumping )
						this.set_gravity_resolution( FALL_TEST_SLOW )
						delete this.jumping
						return this.fall()
					}
					this.ghost.next.position.add( this.momentum )

				}, step )

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
		if( typeof fadeN !== 'number' || fadeN < ANIM_STEP ){
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

			// console.log('anim play:', name, state  )
		}

	}

}

export default Entity