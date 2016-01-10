global.chai = require('chai');
global.sinon = require('sinon');
global.chai.use(require('sinon-chai'));

require( "babel-polyfill" );
require('babel-core/register');
require('./setup')();
