import merge from "./merge";
import Type from "./Type";
import proxy from "./proxy";

function descriptors( target ){

	let keys = [ ]
		.concat( Object.getOwnPropertyNames( target ) )
		.concat( Object.getOwnPropertySymbols( target ) );

	return keys.map( ( key ) => [ key, Object.getOwnPropertyDescriptor( target, key ) ] );

}

export class Node extends Type {

	constructor( parent, base ){

		let type = { };
		let node = class extends super({ type, extend : parent }) {

			get super( ){ return proxy( parent ); }

		};

		let self = type.instance;

		// In the case of the Object prototype there is none
		if( base.prototype !== undefined )
			self.mixin( node.prototype, base.prototype, parent );

		return node;

	}

	mixin( target, base, parent ){

		//
		// Mixing in the methods from the base type we want to clone. To make sure that our
		// C3 chain will keep working we will have to fill in the "empty" methods from the
		// parent as well.
		//

		let mixers       = Object.create( null ),
			base_pairs   = descriptors( base ),
			parent_pairs = descriptors( parent ? parent.prototype : Object.create( null ) ),

			base_keys = base_pairs.map( ([ key ]) => key );

		//
		// Mixin in the methods from the base
		//
		for( let [ key, descriptor ] of base_pairs ){

			if( key === "constructor" ) continue;

			mixers[ key ] = descriptor;

		}

		//
		// If the base defines a method we don't need to override it otherwise stub the
		// method with a proper call to the class.
		//
		for( let [ key, descriptor ] of parent_pairs ){

			if( key === "constructor" || key === "super" || base_keys.includes( key ) ) continue;

			if( typeof descriptor.value === "function" ) {

				descriptor.value = function( ...args ){ return proxy( parent )[ key ]( ...args ); };
				mixers[ key ] = descriptor;

			} else if( typeof descriptor.get === "function" || typeof descriptor.set === "function" ){

				descriptor.get && ( descriptor.get = function( ){ return proxy( parent )[ key ]; } );
				descriptor.set && ( descriptor.set = function( value ){ return ( proxy( parent )[ key ] = value ); } );

				mixers[ key ] = descriptor;

			}

		}

		Object.defineProperties( target, mixers );
	}

}

export class Base extends Node {

	constructor( ){

		return super( Base, new Function( ) );

	}

}

export class Tail extends Node {

	constructor( ...supers ){

		let bases = merge( ...Array.from( supers ) );

		let mixin = bases.reduceRight(
			( node, mixin ) => new Node( node, mixin ),
			                   new Base( )
		);

		return class C3 extends super( supers[ 0 ], mixin ) {

			static get supers( ){ return Array.from( supers ); }
			static get bases( ){ return Array.from( bases ); }

			get super( ){ return proxy( mixin ); }

			constructor( ){

				super( ...Array.from( arguments ) );

				typeof this.new === "function" && this.new( ...Array.from( arguments ) );

			}

		}

	}

}
