import merge from "./merge";
import Type from "./Type";

import { proxy } from "./proxy";
import { empty, descriptors, to_object } from "./utilities";

export function Node( extend = Base, base, bases ){

	const
		static_overrides = ( scope ) => proxy( bases, scope ),
		instance_overrides = ( scope ) => proxy( bases, scope );

	const type = class extends Type({ extend }){

		static get super( ){ return static_overrides( this ); }
		get super( ) { return instance_overrides( this ); }

	};

	for( let [ key, descriptor ] of descriptors( base.prototype ) )
		Object.defineProperty( type.prototype, key, descriptor );

	return type;

}

export class Base { }

export class Tail extends Node {

	constructor( ...supers ){

		let bases = merge( ...Array.from( supers ) );
		let mixin = bases.reduceRight(
				( node, mixin, index, array ) => new Node( node, mixin, Array.from( array.slice( index ) ) ), Base
		);

		return class C3 extends super( supers[ 0 ], mixin, bases ){

			static get supers( ){ return Array.from( supers ); }
			static get bases( ){ return Array.from( bases ); }

			constructor( ){

				super( ...Array.from( arguments ) );

				typeof this.new === "function" && this.new( ...Array.from( arguments ) );

			}

		};

	}

}
