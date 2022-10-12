// import Plant from '../classes/Plant.js?v=5'
import BROKER from '../EventBroker.js?v=5'
import Canopy from '../classes/Canopy.js?v=5'
import PlantVoxel from '../classes/plants/PlantVoxel.js?v=5'
import PlantModel from '../classes/plants/PlantModel.js?v=5'







// ------------------------------
// init 
// ------------------------------
const canopy = window.CANOPY = new Canopy({
	radius: 10,
})




// ------------------------------
// subscribers
// ------------------------------

const add_plant = event => {
	const { data } = event
	const plant = new PlantVoxel( data )
	plant.init_model()
	.then( res => {
		canopy.plant( plant )
	})		
}


BROKER.subscribe('CANOPY_ADD_PLANT', add_plant )


export default canopy