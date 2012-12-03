(function(win, $, undefined){

	"use strict";

	function Filter(json){
		if(this === window){
			return new Filter(json);
		}

		this.json = [];
		this.json.push(json);
		this.currentJSON = 0;

		return this;
	}

	Filter.prototype.updateJSON = function(json) {
		this.json.push(json);
		this.currentJSON++;
		return this;
	};

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

	Filter.prototype.order = function(by) {
		var json = this.json[this.currentJSON];
		
		json.sort(function(a,b){
			return a[by] > b[by];
		});

		this.updateJSON(json);
		return this;
	};

	Filter.prototype.orderBy = Filter.order;

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

	Filter.prototype.done = function() {
		return this.json[this.currentJSON];
	};

	win.Filter = Filter;

})(window, jQuery);