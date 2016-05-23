
export default function Type({ extend = Object, constructor = Object, type = { } } = { } ){

	type.instance = this;

	let instance = function( ){ constructor.apply( this, Array.from( arguments ) ); };

	Object.setPrototypeOf( instance, Object.getPrototypeOf( extend ) );
	instance.prototype = Object.create( extend.prototype );

	return instance;

};
