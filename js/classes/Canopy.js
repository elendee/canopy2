import * as lib from '../lib.js?v=8'
import Entity from './Entity.js?v=8'

const dishgeo = new THREE.CylinderGeometry(1,1,1, 32) // rt, rb, h, segs
const dishmat = new THREE.MeshStandardMaterial({
	color: 'rgb(10, 40, 10)',
	side: THREE.DoubleSide,
})

const ring_mat = new THREE.MeshPhongMaterial({
	color: 'brown',
})


const loader = new THREE.BufferGeometryLoader();


class Canopy extends Entity {

	constructor( init ){
		super(init)
		init = init || {}
		this.type = 'canopy'
		// data
		this.radius = init.radius || 5

		this.dish = new THREE.Mesh( dishgeo, dishmat )
		this.dish.receiveShadow = true
		this.dish.userData = {
			clickable: true,
			standable: true,
			obj_type: 'canopy',
			mesh_type: 'dish',
		}
		this.dish.scale.y = .1
		this.dish.scale.x = this.radius
		this.dish.scale.z = this.radius

		// registry of all plant instances, each with it's own threejs box and model
		this.PLANTS = {}
	}

	// async _build_model(){
	// 	/*
	// 		called by Entity.js
	// 	*/

	// 	this.dome = await this._load_geometry()
	// 	// this.dome.scale.multiplyScalar(-10)
	// 	const model = new THREE.Group()
	// 	model.add( this.dome )
	// 	return model
	// }

	_load_model(){

		return new Promise((resolve, reject) => {

			// build dome
			const domegeo = new THREE.SphereGeometry(1, 32, 16)
			const mat = new THREE.MeshPhongMaterial({
				opacity: .5,
				transparent: true,
				color: 'white'
			})
			const dome = new THREE.Mesh( domegeo, mat )
			const wireframe = lib.extract_wiremesh( dome, 'white', 32 )
			wireframe.scale.multiplyScalar( this.radius )
			dome.scale.multiplyScalar( this.radius )

			// add dish
			this.box.add( this.dish )

			// add rings
			const tube = 3
			const resolution = 16
			const arc = Math.PI * 2
			const radial_segments = 6
			const rings = 5
			for( let i = 0; i < rings; i++ ){
				const shrink = 1 - ( ( i / rings ) / 3 )
				const ring_geo = new THREE.TorusGeometry( 
					( this.radius + ( tube ) ) * shrink, 
					tube, 
					radial_segments, 
					resolution, 
					arc 
				)
				const ring = new THREE.Mesh( ring_geo, ring_mat )
				ring.userData = {
					clickable: true,
					standable: true,
					obj_type: 'canopy',
					mesh_type: 'ring',
				}
				ring.receiveShadow = true
				ring.rotation.x = Math.PI / 2
				ring.position.set( 0, -i * 5, 0 )
				this.box.add( ring )
			}

			// resolve( dome )
			resolve( wireframe )

			// loader.load(
			//   './resource/dome.json',
			//   function ( geometry ) {
			//     var material = new THREE.MeshBasicMaterial( {  
			//       wireframe:true,
			//        color: 0x333333,
			//        transparent:true, 
			//        opacity:0.5
			//       } );
			//     var object = new THREE.Mesh( geometry, material );
			//     object.userData = object.userData || {}
			//     object.userData.name = object.name = 'dome'
			//     object.geometry.center();
			//     object.scale.set(427,600,427);
			//     object.position.set(0,105,0);             
			//     // object.scale.set(1,1.2,1);             
			//     resolve( object )
			//   },
			// function ( xhr ) {},
			// function ( xhr ) { reject('An error happened') }
			// );
		})

	}

	plant( new_plant ){

		let spot_available
		let c = 0
		while( !spot_available && c < 100 ){
			spot_available = lib.random_vector_range( 0, this.radius * .75, null, true ) // -this.radius * .75
			// console.log("test: ", spot_available, this.radius  )
			spot_available.y = 0
			let combined_radii
			let testplant, dist

			// console.log('test plant radius', new_plant.radius )

			for( let uuid in this.PLANTS ){
				testplant = this.PLANTS[uuid]
				combined_radii = testplant.radius + new_plant.radius
				dist = testplant.box.position.distanceTo( spot_available )
				if( dist < combined_radii ){
					spot_available = false
					break;
				}
			}
			c++
		}
		if( !spot_available ) return console.log('no space for plant')

		// and add to scene.. maybe should move out of this function
		this.PLANTS[ new_plant.box.uuid ] = new_plant

		new_plant.ghost.next.position.set(
		// new_plant.box.position.set(
			spot_available.x,
			spot_available.y,
			spot_available.z,
		)
		this.box.add( new_plant.box )

		this.update_bbox( true )

	}

}

export default Canopy