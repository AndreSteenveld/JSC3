import { assert } from "chai";
import C3 from "../";

describe( "The cooprative constructor -", ( ) => {

	it( "for a single class", ( ) => {

		class A extends C3( ) { new( ){ result += "A"; } }

		let result   = "";
		let instance = new A( );

		assert.equal( result, "A" );

	});

	it( "in a chain", ( ) => {

		class A extends C3( )   { new( ){ result += "A"; } }
		class B extends C3( A ) { new( ){ super.new( ); result += "B"; } }
		class C extends C3( B ) { new( ){ super.new( ); result += "C"; } }

		let result   = "",
			instance = new C( );

		assert.equal( result, "ABC" );

	});

	it( "should call the constructors on the cooprative non-c3 classes", ( ) => {

		class A           { new( ){ result += "A"; } }
		class B extends A { new( ){ super.new( ); result += "B"; } }
		class C extends C3( B ) { new( ){ super.new( ); result += "C"; } }

		let result   = "",
			instance = new C( );

		assert.equal( result, "ABC" );

	});

	it( "should call the constructors on the cooprative non-c3 up the chain", ( ) => {

		class A           { new( ){ result += "A"; } }
		class B extends A { new( ){ super.new( ); result += "B"; } }
		class C extends C3( B ) { new( ){ super.new( ); result += "C"; } }
		class D extends C3( C ) { new( ){ super.new( ); result += "D"; } }

		let result   = "",
			instance = new D( );

		assert.equal( result, "ABCD" );

	});

	it( "should recieve the same arguments", ( ) => {

		class A extends C3( )   { new( a ){ a.push( "A" ); } }
		class B extends C3( A ) { new( b ){ super.new( b ); b.push( "B" ); } }
		class C extends C3( B ) { new( c ){ super.new( c ); c.push( "C" ); } }

		let argument = [ ],
			instance = new C( argument );

		assert.equal( argument.join( "" ), "ABC" );

	});

	it( "using regular super should walk up the prototype chain", ( ) => {

		class A { new( ){ result += "A"; } }
		class B extends A { new( ){ super.new( ); result += "B"; } }
		class C extends A { new( ){ super.new( ); result += "C"; } }
		class D extends C3( B, C ) { new( ){ super.new( ); result += "D"; } }

		let result   = "",
			instance = new D( );

		assert.equal( result, "ABD" );

	});

	it( "mixing up the inheritance with classic and C3", ( ) => {

		class A { new( ){ result += "A"; } }
		class B extends A { new( ){ super.new( ); result += "B"; } }
		class C extends A { new( ){ super.new( ); result += "C"; } }

		class D extends C3( B, C ){ new( ){ super.new( ); result += "D"; } }

		class E extends D { new( ){ super.new( ); result += "E"; } }

		let result   = "",
			instance = new E( );

		assert.equal( result, "ABDE" );


	});


});

describe( "The default constructor -", ( ) => {

	it( "Should call the default constructors", ( ) => {

		class A {
			constructor( ){ this.property = "A"; }
		}

		class B extends C3( A ){
			constructor( ){
				super( );
				this.property += "B";
			}
		}

		const instance = new B( );

		assert.equal( instance.property, "AB", "Constructors were not called" );

	});

});
