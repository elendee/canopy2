import * as lib from '../lib.js?v=7'
import Entity from './Entity.js?v=7'




const boxgeo = new THREE.BoxBufferGeometry(1,1,1)
const boxmats = []
for( let i = 0; i < 100; i++ ){
	boxmats.push( new THREE.MeshPhongMaterial({
		color: '#' + lib.random_hex(6),
	}))
}
const errormat = new THREE.MeshPhongMaterial({
	color: 'lightgreen',
})


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
			do not call directly
		*/

					console.error('this method must be defined in inherited Plants', this )

					const model = new THREE.Mesh( boxgeo, errormat )
					model.scale.multiplyScalar( this.radius )
					return model

	}

}


export default Plant