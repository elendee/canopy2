const RESOLUTION = .5

const RENDERER = window.RENDERER = new THREE.WebGLRenderer({
	antialias:true, 
	transparent:true, 
	alpha:true
});
RENDERER.setSize( window.innerWidth * RESOLUTION, window.innerHeight * RESOLUTION );
RENDERER.shadowMap.enabled = true;


export default RENDERER