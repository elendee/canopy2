// import PLAYERS from './registers/PLAYERS.js?v=7'
import ENTITIES from './registers/ENTITIES.js?v=7'
import SCENE from './three/SCENE.js?v=7'
import { leavesMaterial } from './three/GRASS.js?v=7'




const clock = new THREE.Clock()


let now, delta, delta_seconds
let then = Date.now()

let animating = true

const animate = () => {
	// stats.begin()
	now = performance.now()
	delta = now - then
	delta_seconds = delta / 1000
	then = now 
	// stats.end()

	// animate gravity
	// for( const sat of SATELLITES ){
	// 	if( TRANSFORMER.object === sat ) continue
	// 	fall( sat, SATELLITES, delta_seconds )
	// }

	// mark collisions
	// console.log( now - last_colliders )
	// if( Date.now() - last_colliders > mark_colliders_int ){
	// 	mark_colliders( SATELLITES, SATELLITES )
	// 	mark_containers()
	// }
	// for( const uuid in PLAYERS ){
	// 	PLAYERS[uuid].update( delta_seconds )
	// }

	for( const entity of ENTITIES ){
		entity.update( delta_seconds )
	}

	leavesMaterial.uniforms.time.value = clock.getElapsedTime();
	leavesMaterial.uniformsNeedUpdate = true;

	if( animating ) requestAnimationFrame( animate )

	// BROKER.publish('CONTROLS_UPDATE')
	// CONTROLS.update( SCENE, CAMERA )

	RENDERER.render( SCENE, CAMERA )

	// console.log('anim')
	// composeAnimate()
}

const start_animating = event => {
	if( animating ) return;
	animating = true
	animate()
}
const stop_animating = event => {
	animating = false
	// animate()	
}
const animate_once = event => {
	if( animating ) return;
	animate()
}




export default animate