import { assert } from "chai";
import { parents, merge } from "../src/merge";

describe( "parents( ... ) - ", ( ) => {

	it( "the parents for Object", ( ) => {

		let parents_list      = parents( Object ),
			meets_expectation = [ Object.__proto__ ].every( ( clazz, index, array ) => array[ index ] === parents_list[ index ] );

		assert.equal( parents_list.length, 1, "Object has more than one parent" );
		assert( meets_expectation, "Object doesn't have the expected parents" );

	});

	it( "should get everything in the inheritance chain neatly", ( ) => {

		class A { }
		class B extends A { }
		class C extends B { }

		let parents_list      = parents( C ),
			meets_expectation = [ B, A, Object.__proto__ ].every( ( clazz, index, array ) => array[ index ] === parents_list[ index ] );

		assert( meets_expectation, "The expectation [ B, A, Object.__proto__ ] does not match the parents list " );

	});

});

describe( "merge( ... ) - ", ( ) => {

	it( "should merge the diamond should result into a clean linerization", ( ) => {

		class A { }
		class B extends A { }
		class C extends A { }

		let merged            = merge( B, C ),
			meets_expectation = [ B, C, A, Object.__proto__ ].every( ( clazz, index, array ) => array[ index ] === merged[ index ] );

		assert( meets_expectation, "The expectation [ B, A, Object.__proto__ ] does not match the parents list " );

	});

});
