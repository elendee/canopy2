import env from '../env.js?v=8'
// import BROKER from '../EventBroker.js?v=8'





let BINDS
const default_binds = BINDS = {

	global: {

		close: 27,

		chat: 13,

		chat_alt: 191, // '/'

	},

	chat: {

		send: 13,

		hail: 72, // h

		party: 89, // y
		
	},

	sky: {

		thrust: {
			forward: 87, // w
			back: 83, // s
		},
		yaw: {
			starboard: 39, // arr left
			port: 37 // arr right
		},
		pitch: {
			up: 40, // arr up
			down: 38 // arr down
		},
		roll: {
			cw: 65, // d
			ccw: 68 // a
		},

		actions: {
			one: 49,
			two: 50,
			three: 51,
			four: 52
		},

		interact: 76, // l

		targeting: {

			find: 70, // f

			ships: 84, // t

		},

		hotkeys: {
			pilot: 80, // p
			navigation: 78, // n
			inventory: 73, // i
			ship: 79, // o = outfit
		},

		hyperjump: 74,

		reset_camera: 82, // r

		jump: 32, // space

		// pico_warp: 32,// space

	},

	// station: {
	// 	chat: 13
	// },

	// dialogue: {
		
	// },

	// _generate_guide: generate_guide,

}





const keycodes = {
	8:"Backspace",
	9:"Tab",
	13:"Enter",
	16:"Shift",
	17:"Ctrl",
	18:"Alt",
	19:"Pause/Break",
	20:"Caps Lock",
	27:"Esc",
	32: "Space",
	33:"Page Up",
	34:"Page Down",
	35:"End",
	36:"Home",
	37:"←",
	38:"↑",
	39:"→",
	40:"↓",
	45:"Insert",
	46:"Delete",
	48:"0",
	49:"1",
	50:"2",
	51:"3",
	52:"4",
	53:"5",
	54:"6",
	55:"7",
	56:"8",
	57:"9",
	65:"A",
	66:"B",
	67:"C",
	68:"D",
	69:"E",
	70:"F",
	71:"G",
	72:"H",
	73:"I",
	74:"J",
	75:"K",
	76:"L",
	77:"M",
	78:"N",
	79:"O",
	80:"P",
	81:"Q",
	82:"R",
	83:"S",
	84:"T",
	85:"U",
	86:"V",
	87:"W",
	88:"X",
	89:"Y",
	90:"Z",
	91:"Left WinKey",
	92:"Right WinKey",
	93:"Select",
	96:"NumPad 0",
	97:"NumPad 1",
	98:"NumPad 2",
	99:"NumPad 3",
	100:"NumPad 4",
	101:"NumPad 5",
	102:"NumPad 6",
	103:"NumPad 7",
	104:"NumPad 8",
	105:"NumPad 9",
	106:"NumPad *",
	107:"NumPad +",
	109:"NumPad -",
	110:"NumPad .",
	111:"NumPad /",
	112:"F1",
	113:"F2",
	114:"F3",
	115:"F4",
	116:"F5",
	117:"F6",
	118:"F7",
	119:"F8",
	120:"F9",
	121:"F10",
	122:"F11",
	123:"F12",
	144:"Num Lock",
	145:"Scroll Lock",
	186:";",
	187:"=",
	188:",",
	189:"-",
	190:".",
	191:"/",
	192:"`",
	219:"[",
	220:"\\",
	221:"]",
	222:"'",
}






// let BINDS = {}

if( env.EXPOSE ) window.BINDS = BINDS

export default BINDS

