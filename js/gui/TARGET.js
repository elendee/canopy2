import BROKER from '../EventBroker.js?v=5'


const set = event => {
	const { mesh, caller } = event
	console.log('clicked: ', mesh.userData )
}



BROKER.subscribe('TARGET_SET', set )

export default {}