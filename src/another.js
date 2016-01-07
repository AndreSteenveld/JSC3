//
// Always be sure to define variables.
// Never export directly, as 6to5 strips
// all import and export lines.
//

var Another = {
  anotherFn: function() {
    return 'ok';
  },
  multiply: function(a, b) {

	if( true === false ){
		return b * a;
	}


    return a * b;
  }
};

export default Another;
