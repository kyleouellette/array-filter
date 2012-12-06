

	/**
	 * @chainable
	 * Creates a new Filter
	 * 
	 * @class  Filter
	 * @constructor
	 * @param {array} json Should be an array containing objects
	 */
	function Filter(json){
		if(this === window){
			return new Filter(json);
		}

		this.json = [];
		this.json.push(json);
		this.currentJSON = 0;

		return this;
	}

	/**
	 * @chainable
	 * Private method for updating the current array of objects. This method is what allows for a history and backtracking
	 * @method  updateJSON
	 * @param  {array} json Feed to keep in history
	 * @private
	 * @return {object}      returns instance of Filter
	 */
	Filter.prototype.updateJSON = function(json) {
		this.json.push(json);
		this.currentJSON++;
		return this;
	};

	/**
	 * @chainable
	 * What object properties to keep in the feed of objects
	 * @method  select
	 * @param  {object} what is a string or an array to filter through each object and remove undesired attributes or properties
	 * @return {object}      returns instance of Filter
	 */
	Filter.prototype.select = function(what) {
		var ret = [],
			tmp = {},
			json = this.json[this.currentJSON];

		for(var i = 0; i < json.length; i++){

			if(typeof what === 'string'){
				tmp[what] = json[i][what];
			}else if(typeof what === 'object'){
				for(var j = 0; j < what.length; j++){
					tmp[what[j]] = json[i][what[j]];
				}
			}
			ret.push(tmp);
			tmp = {};
		}
		this.updateJSON(ret);
		return this;
	};

	/**
	 * @chainable
	 * object containing constraints to check against
	 * @method  expect
	 * @param  {object} obj object containing properties that will form the test. Properties on this object should be type, val, and field. values for type can be one of the following: <, >, =, match
	 * @return {object}     returns instance of Filter
	 */
	Filter.prototype.expect = function(obj) {
		var json = this.json[this.currentJSON],
			type,
			tmp = {},
			ret = [];

		switch(obj.type){
			case '>':
				type = 'greaterThan';
				break;
			case '<':
				type = 'lessThan';
				break;
			case '=':
				type = 'equal';
				break;
			case 'match':
				type = 'match';
				break;

		}

		for(var i = 0; i < json.length; i++){
			if(this[type](obj.val, json[i][obj.field])){
				ret.push(json[i]);
			}
		}
		this.updateJSON(ret);
		return this;
	};

	/**
	 * @chainable
	 * Changes array order based on objects properties
	 * @method  order
	 * @param  {string} by order the array of objects based on the property passed as "by"
	 * @return {object}    returns instance of Filter
	 */
	Filter.prototype.order = function(by) {
		var json = this.json[this.currentJSON];
		
		json.sort(function(a,b){
			return a[by] > b[by];
		});

		this.updateJSON(json);
		return this;
	};

	/**
	 * @chainable
	 * reset the current feed to a state earlier in the filtering process
	 * @method  resetTo
	 * @param  {int} index number to backtrack to
	 * @return {object}       return instance of Filter
	 */
	Filter.prototype.resetTo = function(index) {
		this.updateJSON(this.json[index]);
		return this;
	};

	/**
	 * @chainable
	 * alias for order
	 * @method orderBy
	 * @param {string} key to order objects by
	 * @return {object} returns instance of Filter
	 */
	Filter.prototype.orderBy = Filter.order;

	/**
	 * limit the number of responses
	 * @method  limit
	 * @param  {int} num number of results to return from the dataset
	 * @return {object}     returns instance of Filter
	 * @chainable
	 */
	Filter.prototype.limit = function(num) {
		var json = this.json[this.currentJSON];
		json = json.slice(0, num);
		this.updateJSON(json);
		return this;
	};

	Filter.prototype.lessThan = function(fixedVal, realVal) {
		if(realVal < fixedVal){
			return true;
		}
		return false;
	};

	Filter.prototype.greaterThan = function(fixedVal, realVal) {
		if(realVal > fixedVal){
			return true;
		}
		return false;
	};

	Filter.prototype.equal = function(fixedVal, realVal) {
		if(fixedVal === realVal){
			return true;
		}
		return false;
	};

	Filter.prototype.match = function(reg, val) {
		return reg.test(val);
	};

	/**
	 * @chainable
 	 * done indicates that the filtering is complete 
	 * @method  done
	 * @return {array} returns filtered dataset
	 */
	Filter.prototype.done = function() {
		return this.json[this.currentJSON];
	};
