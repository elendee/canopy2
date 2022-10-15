import * as lib from './lib.js?v=8'
import PLANT_FACTORY from './PLANT_FACTORY.js?v=8'
import BROKER from './EventBroker.js?v=8'


const dev = lib.b('div')
dev.id = 'dev-panel'

const add_plant = lib.button('add plant')
add_plant.addEventListener('click', () => {
	BROKER.publish('CANOPY_ADD_PLANT', {
		data:{
			// type: 'model',
			height: Math.random() * 10 + 1,
			type: lib.random_entry( Object.keys( PLANT_FACTORY ) ),
			scraggliness: 1 + Math.floor( Math.random() * 5 ), 
			taper: Math.random() / 2, // default .1
			branchiness: ( Math.random() / 2 ) + .1, 
		},
	})
})

dev.append( add_plant )
document.body.append( dev )


export default {}