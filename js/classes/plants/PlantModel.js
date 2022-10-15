import Plant from '../Plant.js?v=7'





const pine_mat = new THREE.MeshStandardMaterial({
	color: 'green',
})

const loader = new THREE.GLTFLoader()

const callbacks = []

const remap_mats = ( model, slug ) => {

	switch( slug ){
		case 'pine.glb':
			model.traverse( child => {
				if( child.material ){
					child.material = pine_mat
				}
			})
			// model.material.color.set(  )
			// return new THREE.MeshStandardMaterial({
			// 	color: 'green',
			// })
			break;
		default:break;
	}

}

class PlantModel extends Plant {

	constructor(init){
		super( init )
		init = init || {}
				this.position = init.position // vec 3
		this.direction = init.direction || new THREE.Vector3(0, 1, 0)

		this.model_url = init.model_url || './resource/models/trees/pine.glb'

		// this.box.userData = {
		// 	clickable: true,
		// 	obj_type: 'plant',
		// 	mesh_type: 'model',
		// }
	}

	async _load_model(){
		/*
			called by Enity.js
		*/
		const r = await this._load_model_with_anims()

		const splits = this.model_url.split('/')
		const slug = splits[ splits.length - 1 ]
		remap_mats( r, slug )

		return r
	}

	
	
}

export default PlantModel