// import Plant from '../classes/Plant.js?v=8'
import * as lib from '../lib.js?v=8'
import BROKER from '../EventBroker.js?v=8'
import Canopy from '../classes/Canopy.js?v=8'
// import PlantModel from '../classes/plants/PlantModel.js?v=8'
import ENTITIES from '../registers/ENTITIES.js?v=8'
import PLANT_FACTORY from '../PLANT_FACTORY.js?v=8'








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
	const CLASS = PLANT_FACTORY[ data.type ]
	if( !CLASS ) return console.error('invalid plant type: ' + data )
	const plant = new CLASS( data )
	plant.init_model()
	.then( res => {
		canopy.plant( plant )
		// plant.set_physics( true ) // careful.. do this to as few entities as possible
		if( !ENTITIES.includes( plant ) ) ENTITIES.push( plant )
	})		
}


BROKER.subscribe('CANOPY_ADD_PLANT', add_plant )

export default canopy