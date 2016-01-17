import merge from "./merge";
import Type from "./Type";
import proxy from "./proxy";

export class Node extends Type {

	constructor( parent, base ){

		let type = { };
		let node = class extends super({ type, extend : parent }) {

			get super( ){ return proxy( parent ); }

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
