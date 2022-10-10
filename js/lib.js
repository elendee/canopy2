import env from './env.js?v=3'
import hal from './hal.js?v=3'
// import fetch_wrap from './fetch_wrap.js?v=3'

import BROKER from './EventBroker.js?v=3'

// import { 
// 	Object3D, 
// 	Vector3,
// 	Quaternion,
// 	Euler,
// 	WireframeGeometry,
// 	LineSegments,
// 	Group,
// 	Color,
// } from '/three-patch/build/three.module.js'





THREE.Object3D.prototype.lookAwayFrom = function( target ){
	const v = new Vector3()
    v.subVectors( this.position, target.position ).add( this.position )
    source.lookAt( v )
}


const tables = {
	name_length: 25
}

const colors = {
	cred: 'rgb(255, 210, 100)',
	missions: {
		ferry: 'lightblue',
		delivery: 'yellow',
		bounty: 'rgb(180, 50, 50)',

	}
}






function ensureColorBrightness( color, bottom, top ){
	color = new Color( color )
	let invalid 
	if( typeof bottom === 'number' && bottom > 1 || bottom < 0 ) invalid = 'invalid bottom range'
	if( typeof top === 'number' && top > 1 || top < 0 ) invalid = 'invalid top range'
	// if( ( bottom && typeof bottom !== 'number' ) || ( top && typeof top !== 'number' ) ) invalid = 'invalid number ranges'
	if( invalid ){
		console.log(invalid, color, bottom, top )
		return color
	}

	color.r = scry( color.r, 0, 1, bottom || 0, top || 1 )
	color.g = scry( color.g, 0, 1, bottom || 0, top || 1 )
	color.b = scry( color.b, 0, 1, bottom || 0, top || 1 )
	// console.log( color )
	return color
	// if( !color || typeof color !== 'string' ){
	// 	console.log('cannot ensure brightness: ', color )
	// 	return '#ffffff'
	// }
	// const split = color.split('')
	// let new_color = ''
	// for( const entry of split ){
	// 	if( typeof entry === 'string' && entry.match(/[a-f]/)){
	// 		new_color += entry
	// 	}else{
	// 		new_color += '3'
	// 	}
	// }
	// return new_color
}


function ensureHex(recvd_color){

	if(recvd_color == undefined || recvd_color == null || recvd_color == '' || recvd_color=='white'){ 
		return '#ffffff' 
	}
	if(recvd_color.match(/#/)){
		return recvd_color
	}
	if(recvd_color.length == 6 || recvd_color.length == 8){
		return '#' + recvd_color
	}
	if(recvd_color.match(/rgb/)){ // should always be hex
		var the_numbers = recvd_color.split('(')[1].split(')')[0]
		the_numbers = the_numbers.split(',')
		var b = the_numbers.map(function(x){						 
			x = parseInt(x).toString(16)	
			return (x.length==1) ? '0'+x : x 
		})
		b = b.join('')
		return b
	}else{
		return '#ffffff'
	}
	
}


function capitalize( word ){

	if( typeof( word ) !== 'string' ) return false

	let v = word.substr( 1 )

	word = word[0].toUpperCase() + v

	return word

}


function random_hex( len ){

	//	let r = '#' + Math.floor( Math.random() * 16777215 ).toString(16)
	let s = ''
	
	for( let i = 0; i < len; i++){
		s += Math.floor( Math.random() * 16 ).toString( 16 )
	}
	
	return s

}


const random_vector_range = ( min, range, vec3 ) => {

	const rand = new THREE.Vector3(
		Math.random(),
		Math.random(),
		Math.random(),
	)
	.normalize()
	.multiplyScalar( min + ( random_range( 0, range ) ) )
	if( Math.random() > .5 ) rand.x *= -1
	if( Math.random() > .5 ) rand.y *= -1
	if( Math.random() > .5 ) rand.z *= -1

	if( vec3 && ( !vec3.isVector3 || vec3.length() === 0 ) ){
		console.log('invalid vec3 given random_vector_range')
		return rand
	}

	if( vec3 ) rand.add( vec3 )

	return rand

}

function iso_to_ms( iso ){

	let isoTest = new RegExp( /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/ )

    if( isoTest.test( str ) ){
    	return new Date( iso ).getTime()
    }
    return false 

}

function ms_to_iso( ms ){

	if( typeof( ms ) !=  'number' )  return false

	return new Date( ms ).toISOString()

}


function is_valid_uuid( data ){

	if( typeof( data === 'string' ) && data.length > 10 ) return true
	return false

}


function is_valid_vec3( obj ){
	if( typeof obj.x !== 'number' || typeof obj.y !== 'number' || typeof obj.z !== 'number' ){
		return false
	}
	return true
}


function getBaseLog(x, y) {

	return Math.log(y) / Math.log(x)

}

const scry = ( x, old_min, old_max, new_min, new_max ) => {

	const first_ratio = ( x - old_min ) / ( old_max - old_min )
	const result = ( first_ratio * ( new_max - new_min ) ) + new_min
	return result
}



const ORIGIN = window.ORIGIN =  new THREE.Vector3(0, 0, 0)







const user_html = ( msg, params ) => {

	msg = String( msg )

	// msg = msg || ''

	// if( typeof msg !== 'string' )  return msg

	params = params || {}

	let res = msg

	if( params.line_breaks ) res = res.replace(/\<br\/?\>/g, '\n')

	if( params.strip_html ) res = res.replace(/(<([^>]+)>)/gi, '')

	if( params.encode ) res = encodeURIComponent( res ) // or encodeURI for less strict encoding

	return res

}



function validate_number( ...vals ){

	for( const num of vals ){
		if( typeof num === 'number' || ( num && typeof Number( num ) === 'number' ) ) return Number( num )
	}
	return vals[ vals.length - 1 ]

}



const random_range = ( low, high, int ) => {

	if( low >= high ) return low

	return int ? Math.floor( low + ( Math.random() * ( high - low ) ) ) : low + ( Math.random() * ( high - low ) )

}

const random_entry = source => {

	if( Array.isArray( source )){
		return source[ random_range( 0, source.length - 1, true ) ]
	}else if( source && typeof source === 'object'){
		return source[ random_entry( Object.keys( source ) ) ]
	}
	return ''
}



const identify = ( entity, display ) => {
	if( !entity ) return 'unknown'
	let response = ''
	if( display ){
		return entity.name || entity.title || entity.handle || entity.mineral || entity.subtype || entity.type || '(unknown entity)'
	}else{
		if( entity.handle ) response += entity.handle + '_'
		if( entity.type ) response += entity.type + '_'
		if( entity.name ) response += entity.name + '_'
		if( entity.subtype ) response += entity.subtype + '_'
		if( entity._id ) response += '_' + entity._id

		if( !response && entity.uuid )  response += '_' + entity.uuid.substr(0, 4)
	}

	return response
}
if( env.EXPOSE ) window.identify = identify



const banish = mesh => {

	if( !mesh || !mesh.userData || mesh.userData.banished ){
		if( mesh && mesh && mesh.userData.banished ) return // happens a lot
		console.log('invalid banish', mesh ? mesh.userData : 'no mesh' )
		return false
	}

	mesh.userData.pre_banish = new THREE.Vector3().copy( mesh.position )
	mesh.userData.banished = true
	mesh.position.set( 99999999, 99999999, 99999999 )

}

const resurrect = ( mesh, start_pos ) => {

	if( !mesh.userData ){
		console.log('invalid resurrect')
		return false
	}

	if( !mesh.userData.pre_banish ) return false
	delete mesh.userData.banished
	if( start_pos && start_pos.isVector3 ){
		mesh.position.copy( start_pos )
	}else{
		mesh.position.copy( mesh.userData.pre_banish )
	}

}





const extract_wiremesh = ( model, color, width ) => {

	const extraction = new THREE.Group()
	let valid
	model.traverse( obj => {
		if( obj.geometry ){
			const wireframe = new THREE.WireframeGeometry( obj.geometry )
			const line = new THREE.LineSegments( wireframe )
			// line.material.depthTest = false
			line.material.opacity = .5
			line.material.transparent = true			
			line.material.color = new THREE.Color( color || 'rgb(255, 240, 20)' )
			line.linewidth = width || 3
			extraction.add( line )
			valid = true
		}
	})
	return valid ? extraction : false

}


const to_alphanum = ( value, loose ) => {
	if( typeof value !== 'string' ) return false
	if( loose ){
		return value.replace(/([^a-zA-Z0-9 _-|.|\n|!])/g, '')
	}else{
		return value.replace(/([^a-zA-Z0-9 _-])/g, '')
	}
}




const sleep = async( seconds ) => {
	await new Promise(( resolve, reject ) => {
		setTimeout(() => {
			resolve()
		}, typeof seconds === 'number' ? seconds * 1000 : 1000 )
	})
}





const quaternion = input => {
	input = input || {}
	const output = {
		x: input.x || input._x || 0,
		y: input.y || input._y || 0,
		z: input.z || input._z || 0,
		w: input.w || input._w || 0,
	}
	return new Quaternion( output.x, output.y, output.z, output.w )
}

const vector3 = input => {
	input = input || {}
	const output = {
		x: input.x || input._x || 0,
		y: input.y || input._y || 0,
		z: input.z || input._z || 0,
	}
	return new THREE.Vector3( output.x, output.y, output.z )
}






const gen_input = ( type, args ) => { // placeholder, required

	let wrapper
	if( type === 'option' ){
		wrapper = args.select
	}else{
		wrapper = document.createElement('div')
		wrapper.classList.add('input-wrapper')
	}

	if( args.attribute ){
		wrapper.setAttribute('data-' + args.attribute[0], args.attribute[1])
	}

	let input
	if( type === 'textarea'){
		input = document.createElement('textarea')
	}else if( type === 'select' ){
		input  = document.createElement('select')
	}else if( type === 'option' ){
		input  = document.createElement('option')
	}else{
		input = document.createElement('input')
		if( type === 'image' ){
			input.type = 'file'
		}else{
			input.type = type
		}
	}

	if( args.name ) input.name = args.name

	const prefill_types = ['text', 'textarea', 'select', 'number', 'checkbox', 'range', 'color']

	if( prefill_types.includes( type ) ){

		if( args.value || args.checked || typeof args.value === 'number' ){
			setTimeout(() => { // options are not appended to selects until another ms or two
				if( type === 'checkbox'){
					input.checked = args.checked
				}else{
					input.value = args.value
				}
			}, 300) // input is not in the DOM yet
		}

		const no_holders = ['number', 'checkbox', 'color']

		if( !no_holders.includes( type ) ){
			input.placeholder = args.placeholder || args.name || args.label_content || '(enter value here)'
			input.classList.add('input')
		}
	}

	if( type === 'number' || type === 'range'){
		input.min = args.min
		input.max = args.max
	}

	if( type === 'select' ){
		const blank = document.createElement('option')
		blank.innerText = args.blank || ( args.name || '' ).replace(/_/g, ' ') || '(select an option)'
		blank.value = ''
		input.append( blank )
		if( args.options){
			for( const opt of args.options ){
				const o = document.createElement('option')
				o.innerText = opt.text
				o.value = opt.value
				input.append( o )
			}
		}
	}

	if( type === 'submit' ){
		input.classList.add('button')
	}

	if( args && ( args.label_content || args.placeholder ) ){
		const label = document.createElement('label')
		label.innerHTML = args.label_content || args.placeholder
		if( args.required ){
			label.innerHTML += '<span class="required">*</span>'
		}
		wrapper.appendChild( label )
	}

	if( args.reader ){
		if( type !== 'text' || !args.table ){
			hal('error', 'invalid reader type', 10000)
			console.log('invalid reader', args )
		}else{

			input.placeholder = args.placeholder || 'type to query values'

			const hash = random_hex(4) // for drop click callbacks
			input.setAttribute('data-id', hash )

			const indicator = document.createElement('div')
			indicator.classList.add('reader-indicator')
			document.body.append( indicator )

			let buffering = false
			input.addEventListener('keyup', () => {
				if( buffering ){
					clearTimeout(buffering)
				}else{
					indicator.style.display = 'none'
					indicator.innerHTML = ''
				}
				buffering = setTimeout(() => {
					// const url = `/get/db/${ args.table }/${ input.value }`
					// const url = `/get/db/${ args.table }/${ input.value }`
					// console.log( url )
					fetch_wrap('/get/indicator/' + args.table + '/' + args.match_column + '/' + input.value.trim() )
					.then( res => {
						indicator.style.display = 'inline-block'
						let drop
						for( const r of res.results ){
							drop = document.createElement('div')
							drop.classList.add('indicator-res')
							drop.innerText = r[ args.public_column ]
							drop.setAttribute('data-private-value', r[ args.private_column ]) // this col will be used as input value
							drop.setAttribute('data-public-value', r[ args.public_column ])
							drop.setAttribute('data-id', hash )
							// drop.addEventListener('click', set_indicator )
							indicator.append( drop )

						}
						const bounds = input.getBoundingClientRect()
						indicator.style.left = bounds.left + 'px'
						indicator.style.top = ( bounds.top + 40 ) + 'px'
						indicator.style.height = ( window.innerHeight - ( bounds.top + bounds.height ) )
						if( !res?.results?.length ){
							indicator.innerText = 'no results'
						}
						document.body.addEventListener('click', listen_indicator )
						console.log( res )
					})
					buffering = false
				}, 1000)
			})

		}
	}

	wrapper.appendChild( input )
	return wrapper

}


const listen_indicator = e => {
	if( e.target.classList.contains('indicator-res')){
		set_indicator( e )
	}
	document.querySelector('.reader-indicator').style.display = 'none'
	document.body.removeEventListener('click', listen_indicator )
}

const set_indicator = e => {
	const drop = e.target
	const hash = drop.getAttribute('data-id')
	const input = document.querySelector('input[data-id="' + hash + '"]')
	input.value = drop.getAttribute('data-private-value')
}

const make_debounce = ( fn, time, immediate ) => {
    let buffer
    return (...args) => {
        if( !buffer && immediate ) fn(...args)
        clearTimeout( buffer )
        buffer = setTimeout(() => {
            fn(...args)
            buffer = false
        }, time )
    }
}


// let bbox
const get_bbox = mesh => {
	if( !mesh.isMesh && !mesh.isObject3D ){
		console.log('invalid mesh dimensions for bbox', mesh )
		return new THREE.Vector3(1,1,1)
	}
	
	return new THREE.Box3().setFromObject( mesh )
}

export {

	// paths,
	// textures,
	// offsets,

	// constants
	ORIGIN,

	// formatting stuff
	// button,
	ensureHex,
	ensureColorBrightness,
	capitalize,
	random_hex,
	iso_to_ms,
	ms_to_iso,
	is_valid_uuid,
	is_valid_vec3,
	user_html,
	validate_number,
	to_alphanum,

	// gamey stuff
	identify,

	colors,
	// flash,
	// collide_dist,
	extract_wiremesh,

	// mathy stuff
	scry,
	random_entry,
	random_range,
	random_vector_range,
	quaternion,
	vector3,

	// js stuff

	// DOM stuff
	sleep,

	gen_input,
	make_debounce,
	get_bbox,
}
