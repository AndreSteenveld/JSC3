import { empty, descriptors, to_object } from "./utilities";

const overrides = ".overrides";

function create_proxy_for_method([ key, descriptor ]){

	return [ key, Object.assign( empty( ), descriptor, { value : descriptor.value.bind( this ) } ) ];

}

function create_proxy_for_property([ key, descriptor ]){

	let properties_descriptor = Object.assign( empty( ), descriptor ),
		{ get, set } = properties_descriptor;

	get && ( properties_descriptor.get = get.bind( this ) );
	set && ( properties_descriptor.set = set.bind( this ) );

	return [ key, properties_descriptor ];

}

function create_proxy([ key, descriptor ]){

	if( typeof descriptor.value === "function" ){

		return create_proxy_for_method.call( this, [ key, descriptor ] );

	} else if(
		   typeof descriptor.get === "function"
		|| typeof descriptor.set === "function"
	){

		return create_proxy_for_property.call( this, [ key, descriptor ] );

	} else {

		return [ key, descriptor ];

	}

}

function proxy_object( bases, scope, target ){

	if( !bases.includes( target ) )
		throw new Error( "List of base classes doesn't contain target" );

	bases = bases.slice( bases.indexOf( target ) );

	if( typeof scope === "object" )
		bases = bases.map( ( base ) => base.prototype );

	return bases.reduceRight(
		( result, base ) => Object.create( result,

				descriptors( base )
					.map( create_proxy.bind( scope ) )
					.reduce( to_object, empty( ) )

			),

			empty( )

		);
}

export function proxy( bases, scope ){

	const wrapper = function( target ){

		return proxy_object( bases, scope, target );

	}

	Object.setPrototypeOf( wrapper, empty( ) );

	return wrapper;

}
