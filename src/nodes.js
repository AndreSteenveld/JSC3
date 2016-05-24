import merge from "./merge";
import Type from "./Type";

import { proxy } from "./proxy";
import { descriptors } from "./utilities";

export class Base { }

export function Node( extend = Base, base, bases ){

	const
		static_overrides = ( scope ) => proxy( bases, scope ),
		instance_overrides = ( scope ) => proxy( bases, scope );

	const type = class extends Type({ extend }) {

		static get super( ){ return static_overrides( this ); }
		get super( ){ return instance_overrides( this ); }

	};

	for( const [ key, descriptor ] of descriptors( base.prototype ) )
		Object.defineProperty( type.prototype, key, descriptor );

	return type;

}

export class Tail extends Node {

	constructor( ...supers ){

		const
			bases = merge( ...Array.from( supers ) ),
			mixin = bases.reduceRight(
				( node, mixin, index, array ) => new Node( node, mixin, Array.from( array.slice( index ) ) ), Base
			);

		return class C3 extends super( supers[ 0 ], mixin, bases ) {

			static get supers( ){ return Array.from( supers ); }
			static get bases( ){ return Array.from( bases ); }

			constructor( ...args ){

				super( ...Array.from( args ) );

				typeof this.new === "function" && this.new( ...Array.from( args ) );

			}

		};

	}

}
