// app.js

import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

class App{
	constructor(){
		const container = document.createElement( 'section' );
		document.body.appendChild( container );

        window.addEventListener('resize', this.resize.bind(this) );
	}	
    
    resize(){
        
    }
    
	render( ) {   
        
    }
}

export { App };
