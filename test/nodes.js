import { assert } from "chai";
import { Base, Node, Tail } from "../src/nodes";

describe( "Base { ... } - ", ( ) => {

	it.skip( "should have a super getter", ( ) => {

		const instance = new Base( );

		assert.isDefined( instance.super );

	});

});

describe( "Node { ... } - ", ( ) => {

	it( "should wrap an existing class", ( ) => {

		class A {

			get property( ){ return ( result = "getter" ); }
			set property( v ){ result = "setter"; }

			method( ){ result = "method"; }

		}

		let result = "";

		let a = new Node( Base, A );

		let instance = new a( );

		instance.method( );
		assert.equal( result, "method" );

		instance.property = "dummy";
		assert.equal( result, "setter" );

		let dummy = instance.property;
		assert.equal( result, "getter" );

	});

});

describe( "Tail { ... } - ", ( ) => {

	it( "A neat chain should be created when creating a tail", ( ) => {

		class A { method_on_a( ){ } }
		class B extends A { method_on_b( ){ } }

		let tail = new Tail( B );

		assert.isDefined( tail.supers );
		assert.isDefined( tail.bases );

		let instance = new tail( );

		assert.isDefined( instance.method_on_a );
		assert.isDefined( instance.method_on_b );

	});

	it( "should contain a list of bases", ( ) => {

		class A { }
		class B extends A { }

		let node = new Tail( B );

		let same_bases = [ B, A, Object.__proto__ ].every( ( clazz, index, array ) => node.bases[ index ] === array[ index ] );

		assert( node.bases, "There is no bases array on the node" );
		assert( same_bases, "The bases are not equal" );

	});

});
