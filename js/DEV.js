import * as lib from './lib.js?v=7'


const dev = lib.b('div')
dev.id = 'dev-panel'

const add_plant = lib.button('add plant')
add_plant.addEventListener('click', () => {
	BROKER.publish('CANOPY_ADD_PLANT', {
		data: {
			type: 'model',
		}
	})
})

dev.append( add_plant )
document.body.append( dev )


export default {}