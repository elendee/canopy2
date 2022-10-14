
import env from './env.js?v=7'
// import GLOBAL from './GLOBAL.js?v=7'
import BROKER from './EventBroker.js?v=7'

// const alert_contain = document.getElementById('alert-contain')


function hal( type, msg, time ){

	console.log('hal unhandled: ', type, msg, time )

}
// 	let icon = ''

// 	const alert_wrapper = document.createElement('div')
// 	const alert_msg = document.createElement('div')
// 	const close = document.createElement('div')

// 	if( !type ) type = 'standard'

// 	close.innerHTML = '&times;'
// 	close.classList.add('alert-close')

// 	// if( type == 'hal' && GLOBAL.BASE.HAL_ICON ){
// 	// 	icon = '<div><img src="/resource/media/familiar-profiles/' + GLOBAL.BASE.HAL_ICON + '.jpg"/></div>'
// 	// }else{
// 	// 	icon = GLOBAL.BASE.ICONS[type]
// 	// } 
// 	icon = '<div></div>'

// 	if( type === 'hal'){
// 		// const msgs = document.getElementsByClassName('hal')
// 		// for( let m of msgs )  m.remove()
// 		say( msg, GLOBAL.BASE.SPEAKER )

// 	}else if( type === 'warning'){
// 		BROKER.publish( 'SOUND_PLAY', { 
// 			type: 'fx', 
// 			subtype: 'alert_standard',
// 			player1: true,
// 			volume: .5,
// 		})
// 	}else if( type === 'success' ){
// 		BROKER.publish( 'SOUND_PLAY', { 
// 			type: 'ui', 
// 			subtype: 'beep_bright',
// 			player1: true,
// 			volume: .5,
// 		})
// 	}else if( type === 'error' ){
		
// 		BROKER.publish('UI_HIDE_SPINNER', {}) // for async socket events

// 		BROKER.publish( 'SOUND_PLAY', { 
// 			type: 'ui', 
// 			subtype: 'beep_error',
// 			player1: true,
// 			volume: .3,
// 		})
// 	}else{ // actually sound is annoying
// 		// BROKER.publish( 'SOUND_PLAY', { 
// 		// 	type: 'ui', 
// 		// 	subtype: 'blip',
// 		// 	self: true,
// 		// })
// 	}

// 	alert_msg.innerHTML = `<div class='alert-icon type-${ type }'>${ icon }</div>${ type === 'hal' ? 'SYSTEM: ' + msg : msg }`
// 	alert_wrapper.classList.add('ui-fader')
// 	alert_msg.classList.add('alert-msg', type)
// 	alert_msg.appendChild( close )
// 	alert_wrapper.appendChild( alert_msg )

// 	alert_contain.appendChild( alert_wrapper )


// 	close.onclick = function(){
// 		alert_wrapper.style.opacity = 0
// 		setTimeout(function(){
// 			alert_wrapper.remove()
// 		}, 500)
// 	}

// 	if( time ){
// 		setTimeout(function(){
// 			alert_wrapper.style.opacity = 0
// 			setTimeout(function(){
// 				alert_wrapper.remove()
// 			}, 500)
// 		}, time)
// 	}
	
// }

// if( env.EXPOSE ){
// 	window.hal = hal
// }

export default hal





// BROKER.subscribe('HAL', event => {
// 	const { type, msg, time } = event
// 	hal( type, msg, time )
// })



// const speaker = window.speechSynthesis
// // speaker.addEventListener( 'voiceschanged', function(){
// // 	speaker.speak( 'hi there' )
// // })

// function say( msg, voice ){
// 	let settings
// 	const ls_settings = localStorage.getItem('ecc-settings2')
// 	if( ls_settings ){
// 		try{
// 			settings = JSON.parse( ls_settings )
// 			if( settings.TEXT_TO_SPEECH ){
// 				const speech = new SpeechSynthesisUtterance( msg )
// 				const spkr = voice || 1
// 				const voices = speaker.getVoices()
// 				setTimeout(function(){
// 					speech.voice = voices[ spkr ]
// 					speaker.speak( speech )
// 				}, 100)
// 			}
// 		}catch( e ){
// 			console.log( e )
// 		}
// 	}
// }

