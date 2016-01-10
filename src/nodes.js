import merge from "./merge";
import Type from "./Type";

export class Node extends Type {

	constructor( parent, base, bases ){

		let type = { };
		let node = class extends super({ type, extend : parent }) {

			static get bases( ){ return Array.from( bases ); }

		};

		let self = type.instance;

		// In the case of the Object prototype there is none
		if( base.prototype !== undefined )
			self.mixin( node.prototype, base.prototype );

		return node;

	}

	mixin( target, source ){

		let descriptors = Object.create( null ),
			keys = [ ]
				.concat( Object.getOwnPropertyNames( source ) )
				.concat( Object.getOwnPropertySymbols( source ) );

		for( let key of keys )
			if( key !== "constructor" )
				descriptors[ key ] = Object.getOwnPropertyDescriptor( source, key );

		Object.defineProperties( target, descriptors );
	}

}

export class Base extends Node {

	constructor( ){
		return super( Base, new Function( ), [ ] );
	}

}

export class Tail extends Node {

	constructor( ...supers ){

		let bases = merge( ...Array.from( supers ) );

		let mix = bases.reduceRight(
			( node, mixin, index, array ) => new Node( node, mixin, array.slice( index ) ),
			                                 new Base( )
		);

		return class C3 extends super( supers[ 0 ], mix, bases ) {

			static get supers( ){ return Array.from( supers ); }

			constructor( ){

				super( ...Array.from( arguments ) );

				typeof this.new === "function" && this.new( ...Array.from( arguments ) );

			}

		}

	}

}
