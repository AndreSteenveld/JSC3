
describe( "Sanity test for the Reflect API", ( ) => {

	it( "Reflect should exist", ( ) => {

		assert.notEqual( typeof Reflect, "undefined", "Reflect was undefined" );

	});

	it( "should be able to construct objects", ( ) => {

		const ARGUMENT = { };

		let asserted_constructor_a = false,
			asserted_constructor_b = false;

		class A {

			constructor( a ){
				assert.equal( a, ARGUMENT, "Argument is not the same in A#constructor" );
				asserted_constructor_a = true;
			}

		}

		class B extends A {

			constructor( a ){

				assert.equal( a, ARGUMENT, "Argument is not the same in B#constructor" );

				super( a );
				asserted_constructor_b = true;

			}

		}

		let instance = Reflect.construct( B, [ ARGUMENT ] )

		assert( asserted_constructor_a, "constructor of A was not called" );
		assert( asserted_constructor_b, "constructor of B was not called" );

		assert( instance instanceof B, "instance is not instance of B" );
		assert( instance instanceof A, "instance is not instance of A" );

	});

});

describe( "Sanity test for the Proxy", ( ) => {

	it( "Proxy should exist", ( ) => {

		assert.notEqual( typeof Proxy, "undefined", "Proxy was undefined" );

	});

});
