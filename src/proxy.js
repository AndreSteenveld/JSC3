import { parents } from "./merge";

function _proxy_( base, scope = this ){

	let proxy =  function( b, s ){ return _proxy_( b || base, s || scope ); };

	Object.setPrototypeOf( proxy, Object.create( base.prototype ) );

	return proxy;

}

export default _proxy_;
