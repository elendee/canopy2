import env from './env.js?v=8'



const warned = {}

class MessageBroker {

	constructor(){

		this.subscribers = {}

		if( env.EXPOSE ) window.EVENTS = {}

	}

	publish( event, data ){

		if( !this.subscribers[ event ] ){
			if( !warned[ event ] ){
				warned[ event ] = true
				console.warn('event with no sub', event )
			}
			return 
		}

		// if( 1 && env.LOCAL && !env.LOG_BROKER_EXCLUDES.includes( event ) ){
		// 	if( event !== 'SOCKET_SEND' || !env.LOG_WS_SEND_EXCLUDES.includes( data.type ) ){
		// 		console.log( event, data )
		// 	}
		// }

	    this.subscribers[ event ].forEach( subscriberCallback => subscriberCallback( data ) )

	}

	subscribe( event, callback ){

		if( !this.subscribers[event] ){
			this.subscribers[event] = []
			if( env.EXPOSE ) window.EVENTS[ event ] = true
			// if( env.LOG_BROKER.SUBSCRIBE ) console.log('subscribe: ', event )
		}
	    
	    this.subscribers[event].push( callback )

	}

}

const broker = new MessageBroker()

if( env.EXPOSE ) window.BROKER = broker

export default broker

