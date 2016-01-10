import Type from "../../src/Type";


describe( "Type { ... } - ", ( ) => {

	it( "Creating a meta type", ( ) => {

		let type = new Type( );

		assert( typeof type === "function", "An instance of type is not a type" );
		assert( Object.prototype.hasOwnProperty.call( type, "prototype" ), "An instance of type doesn not have a prototype" );

	});

	it( "Should be possible to create an instance of a type", ( ) => {

		let type     = new Type( ),
			instance = new type( );

		assert( typeof instance === "object", "The instance of a type is not an object" );
		assert( instance instanceof type, "instance is not an instance of type" );

	});

	it( "Creating properties and methods to a created type", ( ) => {

		let type = new Type( );

		Object.defineProperty( type.prototype, "property", {
			get: function( ){ return this; },
			set: function( value ){ this.value = value; }
		});

		Object.defineProperty( type.prototype, "method", {
			value: function( ){ return this; }
		});

		let instance = new type( ),
			value    = { };

		assert( typeof instance.method === "function", "instance.method  is not a function" );
		assert( instance.method( ) === instance, "method is not retuning its arguments");
		assert( instance.property === instance, "Getter doesn't return the instance" );

		instance.property = value;

		assert( instance.value === value, "Setter hasn't set the private field" );

		let second_instance = new type( );
		assert( !Object.prototype.hasOwnProperty.call( second_instance, "value" ), "The prototype has a value" );

	});

	it( "We can use our types to create sub types the ES6 way", ( ) => {

		let type    = new Type( ),
			derived = class extends type { };

		assert( typeof derived === "function", "Our derived type is not a function" );

		let instance = new derived( );

		assert( instance instanceof derived, "The instance is not an instance of the derived class" );
		assert( instance instanceof type, "The instance is not an instance of the type class" );

	});

	it( "We can supply a parent class our created class will inherit from", ( ) => {

		let parent  = class { },
			type    = new Type({ extend : parent }),
			derived = class extends type { };

		let type_instance = new type( );

		assert( type_instance instanceof type, "The instance is not an isntance of its own class" );
		// I am not completly sure but anything above the type doesn't pass the instance of test
		assert( type_instance instanceof parent, "The instance is not an instance of its parent" );

		let derived_instance = new derived( );

		assert( derived_instance instanceof derived, "derived is not an instance of derived" );
		assert( derived_instance instanceof type, "derived is not an instance of type" );

		assert( derived_instance instanceof parent, "derived is not an instance of parent" );

	});

	it( "With a parent class we will also inhert the methods", ( ) => {

		let result  = "",
			parent  = class { method( ){ result += "A"; } },
			type    = new Type({ extend : parent }),
			derived = class extends type { method( ){ super.method( ); result += "B"; } };

		let type_instance = new type( );

		type_instance.method( );
		assert.equal( result, "A" );

		result = "";

		let derived_instance = new derived( );

		derived_instance.method( );

		assert.equal( result, "AB" );

	});

	it( "As with methods we can call the constructors", ( ) => {

		//
		// Big note here about how Type will create a dummy constructor and prevent any calls to parents!
		// Also this behaviour seems to be different between iojs and babel

		let result  = "",
			parent  = class { constructor( ){ result += "A"; } },
			type    = new Type({ extend : parent }),
			derived = class extends type { constructor( ){ super( ); result += "B" } },

			instance = null;

		instance = new type( );
		assert.equal( result, "" );

		result = "";

		instance = new derived( );
		assert.equal( result, "B" );

	});

	it( "We can supply our own constructor/initalizer to our type", ( ) => {

		var result = "",

			type = new Type({ constructor: function( ){ result = "initializer"; } }),

			instance = new type( );

		assert.equal( result, "initializer", "The supplied initializer was never called" );

	});

	it( "should give me the instance back when inheriting ES6 style", ( ) => {

		let result = "";
		let type = class extends Type {

			method( ){ result = "method"; }

			constructor( ){

				let type = { };
				let thing = super({ type });

				assert( type.instance );
				assert( type.instance.method );

				let self = type.instance;

				self.method( );

				assert.equal( result, "method" )

				return thing;

			}

		}

		let instance = new type( );

		assert( instance );

	});

});
