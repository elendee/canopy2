import ui from './ui.js?v=7'

export default ( url, method, body, no_spinner ) => {

	const show_spinner = !no_spinner

	return new Promise( ( resolve, reject ) => {

		if( show_spinner ) ui.spinner.show()

		if( !method ){
			// console.log('assuming GET for url: ' + url )
			method = 'get'
		}

		if( method.match(/post/i) ){

			fetch( url, {
				method: 'post',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify( body )
			})
			.then( res => {
				if( !res ){
					reject('no res')
					return
				}
				res.json()
				.then( r => {
					if( show_spinner )  ui.spinner.hide()
					resolve( r )
				}).catch( err => {
					if( show_spinner )  ui.spinner.hide()
					reject( err )
				})
			}).catch( err => {
				if( show_spinner )  ui.spinner.hide()
				reject( err )
			})
			.catch( err => {
				if( show_spinner )  ui.spinner.hide()
				reject( err )
			})

		}else if( method.match(/get/i) ){

			fetch( url )
			.then( res => {
				if( !res ){
					reject('no res')
					return
				}
				res.json()
				.then( r => {
					if( show_spinner )  ui.spinner.hide()
					resolve( r )
				}).catch( err => {
					if( show_spinner )  ui.spinner.hide()
					reject( err )
				})
			}).catch( err => {
				if( show_spinner )  ui.spinner.hide()
				reject( err )
			})
			.catch( err => {
				if( show_spinner )  ui.spinner.hide()
				reject( err )
			})

		}else{

			if( show_spinner )  ui.spinner.hide()
			reject('invalid fetch ' + url )
			
		}

	})


}

