
export default function Type({ extend = Object, constructor = Object, type = { } } = { extend : Object, constructor : Object }){

	type.instance = this;
	
	const instance = function instance( ...args ){ 
		
		constructor.apply( this, Array.from( args ) ); 
	
	};
	
	Object.setPrototypeOf( instance, Object.getPrototypeOf( extend ) );
	instance.prototype = Object.create( extend.prototype );
	
	return instance;

}
