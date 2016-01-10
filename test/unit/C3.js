import C3 from "../../src/C3";

describe( "When inheriting using C3 -", ( ) => {

	it( "all classes should have a bases and supers array", ( ) => {

		const
			O = class { },

			A = class extends O { },
			B = class extends O { },
			C = class extends O { },
			D = class extends O { },
			E = class extends O { };

		const
			K1 = class extends C3( A, B, C ){ },
			K2 = class extends C3( D, B, E ){ },
			K3 = class extends C3( D, A ){ },

			Z  = class extends C3( K1, K2, K3 ){ };


		for( let c of [ K1, K2, K3, Z ] ){

			assert( c, "class is undefined" );

			assert( c.supers, `[ ${c.name} ] doesn't have a supers array` );
			assert( c.bases, `[ ${c.name} ] doesn't have a bases array` );

			assert( c.supers.length, `[ ${c.name} ] supers is empty` );
			assert( c.bases.length, `[ ${c.name} ] bases is empty` );

			/*
			console.log( ""
				+ `[ ${c.name} ]`
				+ "\n\t supers :: " + c.supers.map( c => c.name || "<null>" ).join( ", " )
				+ "\n\t bases  :: " + c.bases.map( c => c.name || "<null>" ).join( ", " )
			);
			*/

		}

		let k1_bases = [ A, B, C, O, Object.__proto__ ].map( c => c.name ).join( "," ),
			k2_bases = [ D, B, E, O, Object.__proto__  ].map( c => c.name ).join( "," ),
			k3_bases = [ D, A, O, Object.__proto__  ].map( c => c.name ).join( "," ),
			z_bases  = [ K1, K2, K3, D, A, B, C, E, O, Object.__proto__ ].map( c => c.name ).join( "," );

		assert( K1.bases.map( c => c.name ).join( "," ) === k1_bases, "Bases order of K1 is invalid" );
		assert( K2.bases.map( c => c.name ).join( "," ) === k2_bases, "Bases order of K2 is invalid" );
		assert( K3.bases.map( c => c.name ).join( "," ) === k3_bases, "Bases order of K3 is invalid" );

		assert( Z.bases.map( c => c.name ).join( "," ) === z_bases, "Bases order of Z is invalid" );

	});

	it( "base class methods should be callable", ( ) => {

		const
			A = class { method( ){ return "method"; } },
			B = class extends C3( A ){ };

		let b = new B( );

		assert( b.method( ) === "method", "A#method() was never called or returned an invalid value" );

	})

	it( "methods should be chained the same way as without C3", ( ) => {

		const
			A = class           { method( ){ return [ "A" ]; } },
			B = class extends A { method( ){ return super.method( ).concat( [ "B" ] ); } },
			C = class extends B { method( ){ return super.method( ).concat( [ "C" ] ); } };

		const
			D = class                 { method( ){ return [ "D" ]; } },
			E = class extends C3( D ) { method( ){ return super.method( ).concat( [ "E" ] ); } },
			F = class extends C3( E ) { method( ){ return super.method( ).concat( [ "F" ] ); } };

		assert.equal( ( new C( ) ).method( ).join( "" ), "ABC", "Something is wrong with the ES6 classes" );
		assert.equal( ( new F( ) ).method( ).join( "" ), "DEF", "C3 didn't call the methods in the proper order" );


	});

	it( "you can inherit from nothing", ( ) => {

		const A = class extends C3( ){ constructor( ){ super( ); this.value = "success"; } };

		assert( ( new A( ) ).value === "success", "The value property wasn't set or the constructor has malfunctioned somehow" );

	});

});
