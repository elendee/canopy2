import * as lib from '../lib.js?v=3'
import Entity from './Entity.js?v=3'

const dishgeo = new THREE.CylinderGeometry(1,1,1, 32) // rt, rb, h, segs
const dishmat = new THREE.MeshPhongMaterial({
	color: 'rgb(50, 40, 50)',
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
		this.dish.scale.y = .1
		this.dish.scale.x = this.radius
		this.dish.scale.z = this.radius

		// registry of all plant instances, each with it's own threejs box and model
		this.PLANTS = {}
	}

	async _build_model(){
		/*
			called by Entity.js
		*/

		this.dome = await this._load_geometry()
		// this.dome.scale.multiplyScalar(-10)
		const model = new THREE.Group()
		model.add( this.dome )
		return model
	}

	_load_geometry(){

		return new Promise((resolve, reject) => {

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

		let available_spot
		let c = 0
		while( !available_spot && c < 100 ){
			available_spot = lib.random_vector_range(-this.radius * .75, this.radius * .75 )
			available_spot.y = 0
			let combined_radii
			let testplant, dist
			for( let uuid in this.PLANTS ){
				testplant = this.PLANTS[uuid]
				combined_radii = testplant.radius + new_plant.radius
				dist = testplant.box.position.distanceTo( available_spot )
				if( dist < combined_radii ){
					available_spot = false
					break;
				}
			}
			c++
		}
		if( !available_spot ) return console.log('no space for plant')

		// and add to scene.. maybe should move out of this function
		this.PLANTS[ new_plant.box.uuid ] = new_plant

		new_plant.box.position.set(
			available_spot.x,
			available_spot.y,
			available_spot.z,
		)
		this.box.add( new_plant.box )

	}

}

export default Canopy