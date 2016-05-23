import { assert } from "chai";
import { empty, descriptors, to_object } from "../src/utilities";

describe( "Utilities -", ( ) => {

	it( "to_object will convert a KV pair to an object", ( ) => {

		const kv_pairs = [
			[ "method", function( ){ return "method"; } ],
			[ "value", "value" ]
		];

		const output = kv_pairs.reduce( to_object, empty( ) );

		assert.isObject( output, "output was not an object" );
		assert.isFunction( output.method, "output.method was not a function" );
		assert.isString( output.value, "output.value was not a string" );

	});

});
