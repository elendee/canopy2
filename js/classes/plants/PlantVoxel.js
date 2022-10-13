import * as lib from '../../lib.js?v=6'
import Plant from '../Plant.js?v=6'

const boxgeo = new THREE.BoxBufferGeometry(1,1,1)
const boxmats = []
for( let i = 0; i < 100; i++ ){
	boxmats.push( new THREE.MeshPhongMaterial({
		color: '#' + lib.random_hex(6),
	}))
}
const errormat = new THREE.MeshPhongMaterial({
	color: 'red',
})

const leafgeo = new THREE.BoxBufferGeometry(1,1,1)

const leafmats = []
for( let i = 0; i< 5; i++ ){
	const leafmat = new THREE.MeshPhongMaterial({
		color: lib.random_rgb([0,50], [50, 255], [30, 120]),
		transparent: true,
		opacity: .8,
	})	
	leafmats.push( leafmat )
}



const STEP_SPEED = 100




class Branch {
	constructor(init){
		this.uuid = init.uuid || lib.random_hex(12)
		this.entity_uuid = init.entity_uuid // should always be passed
		if( !init.entity_uuid ) console.error('branch is missing parent uuid')

		this.mat = init.mat
		this.segments = []

		this.group = new THREE.Group()

		this.start_size = init.start_size || 1
		this.current_size = false

		this.taper = init.taper || .1
		this.min_size = init.min_size || .3 // used to stop growing

		this.branchiness = init.branchiness || .3
		this.growth_length = init.growth_length || 1 // 1 will match current size - no gaps.  +1 will leave gaps etc

		this.position = init.position // vec 3
		this.direction = init.direction || new THREE.Vector3(0, 1, 0)

		this.scraggliness = init.scraggliness || 1 // 1 == branches do entire 180's

		this.group.userData = {
			clickable: true,
			type: 'branch',
		}
	}

	add_segment( first_marked, last_growth, delay, step ){

		const segment = new THREE.Mesh( boxgeo, first_marked ? this.mat : errormat )
		segment.castShadow = true
		segment.receiveShadow = true
		segment.scale.multiplyScalar( this.current_size )
		segment.userData = {
			standable: true,
			parent_branch: this.uuid,
		}
		this.segments.push( segment )

		if( !last_growth ){ // first growth from init
			// console.log('new branch pos: ', this.position )
			segment.position.copy( this.position )

		}else{ // following segments recurse

			segment.position.copy( last_growth.position )
			// growth.lookAt( growth.position.clone().add( this.direction ) )
			const addition = new THREE.Vector3().copy( this.direction )
			addition.multiplyScalar( this.current_size ) 
			segment.position.add( addition )
			// if( addition.length() > 1 ) debugger

			if( Math.random() < this.branchiness ){

				// make new branch
				const new_data = {
					direction: this.direction.clone().add( 
						lib.random_vector_range(-1, 1).multiplyScalar( this.scraggliness ) 
						).normalize(),

					start_size: this.current_size,// - this.taper,

					taper: this.taper,
					min_size: Math.max( .1, this.min_size - .1 ),

					branchiness: this.branchiness,
					scraggliness: this.scraggliness,
					growth_length: this.growth_length,
					mat: this.mat,
					entity_uuid: this.entity_uuid,
				}

				const new_pos = new THREE.Vector3().copy( segment.position )
				// const gap = ( this.start_size * this.growth_length )
				// console.log('why gap so big', gap )
				// console.log('dir normal?', new_data.direction )
				// new_pos.add( gap )

				// new_pos.add( new_data.direction.clone().multiplyScalar( gap ) )

				new_data.position = new_pos 
				// console.log( 'nd: ', new_data )

				const newbranch = new Branch( new_data )
				setTimeout(() => {
					this.group.add( newbranch.grow( step, delay, true ) )
				}, delay )

				// redirect old branch a bit too
				this.direction.add( lib.random_vector_range(-1, 1).multiplyScalar( this.scraggliness / 2 ) ).normalize()

			}

			// if( is_branched ) console.log('growing branches....')

		}

		return segment 

	}


	grow( step, delay, is_branched ){

		let c = 0
		this.current_size = this.start_size

		let first_marked = false

		let last_growth
		while( this.current_size > this.min_size && c < 100 ){

			const segment = this.add_segment( first_marked, last_growth, delay, step )

			// adjust for next segment
			first_marked = true
			delay += step
			last_growth = segment
			this.current_size -= this.taper

			this.group.add( segment )

		} // while loop

		if( this.segments.length ){
			const leaves = new THREE.Mesh( leafgeo, lib.random_entry( leafmats ) )
			leaves.receiveShadow = true
			leaves.castShadow = true
			leaves.scale.multiplyScalar( this.start_size * 2 )
			leaves.position.copy( last_growth.position )
			this.group.add( leaves )
		}

		// if( this.segments.length ){
		// 	// console.log( 'branch: ', this.segments.length )
		// }else{ // 
		// 	const flag = new THREE.Mesh( boxgeo, errormat )
		// 	// flag.multiplyScalar
		// 	flag.scale.multiplyScalar( 2 )
		// 	this.group.add( flag )
		// }
		return this.group

	}// grow

} // Branch






class PlantVoxel extends Plant {
	constructor(init){
		super( init )
		init = init || {}
		this.voxel_count = init.voxel_count || 25
		this.seed = init.seed // not used currently...
		this.taper = init.taper || .1
		this.verticality = init.verticality || 1
		this.branchiness = init.branchiness || .5
		this.scraggliness = init.scraggliness || .5
		this.trunk = false
		this.NODES = {
			// uuid: [vox, vox],
			// uuid: [vox, vox],
		}
	}


	async _load_model(){
		/*
			called by Enity.js
		*/
		this.mat = lib.random_entry( boxmats )
		this.grow( STEP_SPEED )
		return this.model
	}

	grow( step ){

		this.model = new THREE.Group()

		this.trunk = this.active_node = new Branch({
			position: new THREE.Vector3(),
			mat: this.mat,
			taper: this.taper,
			verticality: this.verticality,
			branchiness: this.branchiness,
			scraggliness: this.scraggliness,
			growth_length: 2,
			entity_uuid: this.uuid,
		})

		this.model.add( this.trunk.grow( step, 0 ) )

		return this.model

	}
	
	
}

export default PlantVoxel