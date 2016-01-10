import { Tail } from "./nodes";

export default function c3( ...supers ){ return new Tail( ...supers ); }
export { Tail as C3 };
