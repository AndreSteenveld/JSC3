
export function empty( descriptors = Object.create( null ) ){

	return Object.create( null, descriptors );

}

export function to_object( target = empty( ), [ key, value ] ){

	return Object.assign( target, { [ key ] : value } );

}

export function descriptors( target = Object.create( null ) ){

	return Reflect
		.ownKeys( target )
		.map( ( key ) => [ key, Object.getOwnPropertyDescriptor( target, key ) ] );

}
