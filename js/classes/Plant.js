import * as lib from '../lib.js?v=3'
import Entity from './Entity.js?v=3'




const boxgeo = new THREE.BoxBufferGeometry(1,1,1)
const boxmats = []
for( let i = 0; i < 100; i++ ){
	boxmats.push( new THREE.MeshPhongMaterial({
		color: '#' + lib.random_hex(6),
	}))
}



class Plant extends Entity {
	constructor( init ){
		super(init)

		init = init
		this.type = 'plant'
		this.subtype = init.subtype
		
		this.radius = init.radius || 1
		
	}

	async _load_model(){
		/*
			called by Enity.js
		*/

		const model = new THREE.Mesh( boxgeo, lib.random_entry( boxmats ) )
		model.scale.multiplyScalar( this.radius )
		return model
	}

}


export default Plant