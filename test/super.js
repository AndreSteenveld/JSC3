import { assert } from "chai";
import C3 from "../src";

describe.skip( "Cooparative proxy as default wrapped -", ( ) => {

	it( "should resolve a short line", ( ) => {

		class A { method( ){ return "A"; } }
		class B extends C3( A ) {
			method( ){ return "B" + this.super.method( ); }
		}

		let instance = new B( );

		let result = instance.method( );

		assert.equal( result, "BA" );

	});

	it( "should resolve a full line", ( ) => {

		class A extends C3( )   {
			method( ){ return "A"; }
		}

		class B extends C3( A ) {
			method( ){ return "B" + this.super.method( ); }
		}

		class C extends C3( B ) {
			method( ){ return "C" + this.super.method( ); }
		}

		class D extends C3( C ) {
			method( ){ return "D" + this.super.method( ); }
		}

		let instance = new D( );
		let result = instance.method( );

		assert.equal( result, "DCBA" );

	});

	it( "should resolve a line with hole", ( ) => {

		class A extends C3( ) {
			method( ){ return "A"; }
		}

		class B extends C3( A ) {
			method( ){ return "B" + this.super.method( ); }
		}

		class C extends C3( B ) {  }

		class D extends C3( C ) {
			method( ){ return "D" + this.super.method( ); }
		}

		let instance = new D( );
		let result = instance.method( );

		assert.equal( result, "DBA" );

		//assert.equal( ( new D( ) ).method( ), "DBA" );

	});

	it( "should resolve a full diamond", ( ) => {

		class A extends C3( )      { method( ){ return "A"; } }
		class B extends C3( A )    { method( ){ return "B" + this.super.method( ); } }
		class C extends C3( A )    { method( ){ return "C" + this.super.method( ); } }
		class D extends C3( B, C ) { method( ){ return "D" + this.super.method( ); } }

		assert.equal( ( new D( ) ).method( ), "DBCA" );

	});

	it( "should work in head non-C3 super classes", ( ) => {

		class A extends C3( )      { method( ){ return "A"; } }
		class B extends C3( A )    { method( ){ return "B" + this.super.method( ); } }
		class C extends C3( A )    { method( ){ return "C" + this.super.method( ); } }
		class D extends C3( B, C ) { method( ){ return "D" + this.super.method( ); } }
		class E extends D          { method( ){ return "E" + super.method( ); } }

		assert.equal( ( new E( ) ).method( ), "EDBCA" );

	});

	it( "should call tail non-C3 super classes", ( ) => {

		class A                    { method( ){ return "A"; } }
		class B extends C3( A )    { method( ){ return "B" + this.super.method( ); } }
		class C extends C3( A )    { method( ){ return "C" + this.super.method( ); } }
		class D extends C3( B, C ) { method( ){ return "D" + this.super.method( ); } }

		assert.equal( ( new D( ) ).method( ), "DBCA" );

	});

});

describe( "Cooparative proxy as function -", ( ) => {

	it( "should resolve a full line with methods without specifying", ( ) => {

		class A extends C3( )   { method( ){ return "A"; } }
		class B extends C3( A ) { method( ){ return "B" + this.super( B ).method( ); } }
		class C extends C3( B ) { method( ){ return "C" + this.super( C ).method( ); } }
		class D extends C3( C ) { method( ){ return "D" + this.super( D ).method( ); } }

		assert.equal( ( new D( ) ).method( ), "DCBA" );

	});

	it( "should resolve a short line with methods with specifying", ( ) => {

		class A extends C3( ){
			method( ){
				return "A";
			}
		}

		class B extends C3( A ){
			method( ){
				return "B" + this.super( B ).method( );
			}
		}

		const instance = new B( );

		const result = instance.method( );

		assert.equal( result, "BA" );

	});

	it( "should resolve a full line with methods with specifying", ( ) => {

		class A extends C3( )   {
			method( ){
				return "A";
			}
		}

		class B extends C3( A ) {
			method( ){
				return "B" + this.super( B, A ).method( );
			}
		}

		class C extends C3( B ) {
			method( ){
				return "C" + this.super( C, B ).method( );
			}
		}

		class D extends C3( C ) {
			method( ){
				return "D" + this.super( D, C ).method( );
			}
		}

		const instance = new D( );

		const result = instance.method( );

		assert.equal( result, "DCBA" );

	});

	it( "should resolve a line with hole without specifying", ( ) => {

		class A extends C3( )   { method( ){ return "A"; } }
		class B extends C3( A ) { method( ){ return "B" + this.super( B ).method( ); } }
		class C extends C3( B ) {  }
		class D extends C3( C ) { method( ){ return "D" + this.super( D ).method( ); } }

		assert.equal( ( new D( ) ).method( ), "DBA" );

	});

	it( "should resolve a line with a hole even if the hole is provided", ( ) => {

		//
		// This test is a little silly but in theory it would be nice if it would pass,
		// say we provide a class with no implementation of the method we want to call
		// it should still walk up the chain to get something for us. Or take one of the
		// stubbed functions from mixing in.
		//
		class A extends C3( )   { method( ){ return "A"; } }
		class B extends C3( A ) { method( ){ return "B" + this.super( B ).method( ); } }
		class C extends C3( B ) {  }
		class D extends C3( C ) { method( ){ return "D" + this.super( D, C ).method( ); } }

		assert.equal( ( new D( ) ).method( ), "DBA" );

	});

	it( "should resolve non-C3 classes", ( ) => {

		class O                 { method( ){ return "O"; } }
		class A extends O       { method( ){ return super.method( ) + "A"; } }
		class B extends C3( A ) { method( ){ throw new Error( "B#method was invoked" ); } }
		class C extends C3( B ) { method( ){ return this.super( C, A ).method( ) + "C"; } }
		class D extends C3( C ) { method( ){ return this.super( D, O ).method( ) + "D"; } }

		assert.equal( ( new A( ) ).method( ), "OA" );
		assert.equal( ( new C( ) ).method( ), "OAC" );
		assert.equal( ( new D( ) ).method( ), "OD" );

	});

	it( "should resolve getters the same way as methods", ( ) => {

		class O                 { get getter( ){ return "O"; } }
		class A extends O       { get getter( ){ return super.getter + "A"; } }
		class B extends C3( A ) { get getter( ){ throw new Error( "B#getter was invoked" ); } }
		class C extends C3( B ) { get getter( ){ return this.super( C, A ).getter + "C"; } }
		class D extends C3( C ) { get getter( ){ return this.super( D, O ).getter + "D"; } }

		assert.equal( ( new A( ) ).getter, "OA" );
		assert.equal( ( new C( ) ).getter, "OAC" );
		assert.equal( ( new D( ) ).getter, "OD" );

	});

	it( "should resolve setters the same way as methods", ( ) => {

		class O                 { set setter( v ){ this.value = "O" + v; } }
		class A extends O       { set setter( v ){ super.setter = "A" + v; } }
		class B extends C3( A ) { set setter( v ){ throw new Error( "B#method was invoked" ); } }
		class C extends C3( B ) { set setter( v ){ this.super( C, A ).setter = "C" + v; } }
		class D extends C3( C ) { set setter( v ){ this.super( D, O ).setter = "D" + v; } }

		const
			a = new A( ),
			c = new C( ),
			d = new D( );

		a.setter = "_";
		c.setter = "_";
		d.setter = "_";

		assert.equal( a.value, "OA_" );
		assert.equal( c.value, "OAC_" );
		assert.equal( d.value, "OD_" );

	});


});

describe( "Cooparative proxy sanity cases -", ( ) => {

	it( "should have the properties set properly", ( ) => {

		class A {

			method( ){ return this.property; }

		}

		class B extends C3( A ){

			constructor( ){
				super( );
				this.property = "value";
			}

			method( ){
				assert.equal( this.property, "value", "The property was not set at all" );
				assert.equal( super.method( ), "value", "Calling method on super has failed resolving the property" );
				assert.equal( this.super( B ).method( ), "value", "Calling the cooparative proxy method has faild in resolving the property" );
			}

		}

		let instance = new B( );

		instance.method( );

		assert.equal( instance.property, "value", "The instance doesn't carry the property" );

	});

	it( "setting properties on the instance with methods", ( ) => {

		class A {

			method( ){

				assert.equal( this.property, "value" );

				this.property = "other value";

				assert.equal( this.property, "other value" );
			}

		}

		class B extends C3( A ){

			method( ){
				this.property = "value";
				this.super( B ).method( );

				assert.equal( this.property, "other value" );
			}

		}

		let instance = new B( );

		instance.method( );

		assert.equal( instance.property, "other value" );

	});

	it( "should always work on the same instance", ( ) => {

		class A {

			method( ){ return this; }

		}

		class B extends C3( A ){

			method( ){
				assert( this === super.method( ), "Classic super this is not the same" );
				assert( this === this.super( B ).method( ), "Explicit proxy is not the same" );
				//assert( this === this.super.method( ), "Proxy super is not the same" );
			}

		}

		let instance = new B( );

		instance.method( );

	});

});
