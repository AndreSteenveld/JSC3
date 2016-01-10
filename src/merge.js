
export function parents( clazz ){

	if( clazz.bases )
		return clazz.bases;

	let parent = Object.getPrototypeOf( clazz );

	if( parent == null || typeof parent !== "function" )
		return [ ];


	return [ parent ].concat( parents( parent ) );

}

export function merge( ...supers ){

	let sequences = [ Array.from( supers ) ],
		result    = [ ];

	sequences.push( ...supers.map( parents ) );

	while( true ){

		sequences = sequences.filter( s => !!s.length );

		if( !sequences.length )
			return result;

		let candidate = null,
			sequence  = null;

		for( sequence of sequences ){

			candidate = sequence[ 0 ];

			let head = sequences.every( s => !s.includes( candidate, 1 )  );

			if( !head )
				candidate = null;
			else
				break;

		}

		if( null === candidate )
			throw new Error( "Inconsistent hierachy" );

		result.push( candidate );

		sequences.forEach( s => s[ 0 ] === candidate && s.shift( ) );

	}
}

export default merge;
