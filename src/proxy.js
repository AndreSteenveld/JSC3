import { parents } from "./merge";

function _proxy_( base, scope = this ){

	let proxy =  _proxy_.bind( scope );

	Object.setPrototypeOf( proxy, Object.create( base.prototype ) );

	return proxy;

}

export default _proxy_;
