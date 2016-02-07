import merge from "./merge";
import Type from "./Type";
import proxy from "./proxy";

export class Node extends Type {

	// keys = [ ],

	constructor( parent, base ){

		let type = { },
			node = class extends super({ type, extend : parent }) {

			get super( ){

				let proxy = super.super,
					base_keys = [ ]
						.concat( Object.getOwnPropertyNames( base.prototype ) )
						.concat( Object.getOwnPropertySymbols( base.prototype ) );

				for( let key of base_keys ){

					if( key === "constructor" || key === "super" ) continue;

					let descriptor = Object.getOwnPropertyDescriptor( base, key );

					if( typeof descriptor.value === "function" ) {

						descriptor.value = super[ key ].bind( this );

					} else if( typeof descriptor.get === "function" || typeof descriptor.set === "function" ){

						descriptor.get && ( descriptor.get = descriptor.get.bind( this ) );
						descriptor.set && ( descriptor.set = descriptor.set.bind( this ) );

					}

					Object.defineProperty( proxy, key, descriptor )
				}

				return proxy;

			}

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

		let descriptors = Object.create( null ),

			base_keys = [ ]
				.concat( Object.getOwnPropertyNames( base ) )
				.concat( Object.getOwnPropertySymbols( base ) ),

			parent_keys = [ ]
				.concat( Object.getOwnPropertyNames( parent ? parent.prototype : Object.create( null ) ) )
				.concat( Object.getOwnPropertySymbols( parent ? parent.prototype : Object.create( null ) ) );

		//
		// Mixin in the methods from the base
		//
		for( let key of base_keys )
			if( key !== "constructor" )
				descriptors[ key ] = Object.getOwnPropertyDescriptor( base, key );

		//
		// If the base defines a method we don't need to override it otherwise stub the
		// method with a proper call to the class.
		//
		// for( let key of parent_keys.filter( key => !base_keys.includes( key ) ) ) {
		//
		// 	if( key === "constructor" || key === "super" ) continue;
		//
		// 	let descriptor = Object.getOwnPropertyDescriptor( parent.prototype, key );
		//
		// 	if( typeof descriptor.value === "function" ) {
		//
		// 		descriptor.value = function( ...args ){ return proxy( parent )[ key ]( ...args ); };
		// 		descriptors[ key ] = descriptor;
		//
		// 	} else if( typeof descriptor.get === "function" || typeof descriptor.set === "function" ){
		//
		// 		descriptor.get && ( descriptor.get = function( ){ return proxy( parent )[ key ]; } );
		// 		descriptor.set && ( descriptor.set = function( value ){ return ( proxy( parent )[ key ] = value ); } );
		//
		// 		descriptors[ key ] = descriptor;
		//
		// 	}
		//
		// }

		Object.defineProperties( target, descriptors );
	}

}

export class Base extends Node {

	constructor( ){

		return class extends super( Base, new Function( ) ){

			get super( ){

				let proxy = function( ){ };

				Object.setPrototypeOf( proxy, Object.create( null ) );

				return proxy;

			}

		};

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

			get super( ){ return mixin.super; }

			constructor( ){

				super( ...Array.from( arguments ) );

				typeof this.new === "function" && this.new( ...Array.from( arguments ) );

			}

		}

	}

}
