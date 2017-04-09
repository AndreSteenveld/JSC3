
export function parents( clazz ){

	if( clazz.bases )
		return clazz.bases;

	const parent = Object.getPrototypeOf( clazz );

	if( parent == null || typeof parent !== "function" )
		return [ ];

	return [ parent ].concat( parents( parent ) );

}

export function merge( ...supers ){

	let sequences = [ Array.from( supers ) ];

	const result = [ ];

	sequences.push( ...supers.map( parents ) );

	for( ;; ){

		sequences = sequences.filter( s => !!s.length );

		if( !sequences.length )
			return result;

		let candidate = null,
			sequence  = null;

		for( sequence of sequences ){

			candidate = sequence[ 0 ];

			// In the python implementation there is a really neat array expression which looks really nice, I haven't been able to reproduce that yet
			const head = sequences.every( ( s ) => !s.includes( candidate, 1 ) ); // eslint-disable-line no-loop-func

			if( !head )
				candidate = null;
			else
				break;

		}

		if( candidate === null )
			throw new Error( "Inconsistent hierachy" );

		result.push( candidate );

		sequences.forEach( ( s ) => s[ 0 ] === candidate && s.shift( ) );

	}
}

export default merge;
