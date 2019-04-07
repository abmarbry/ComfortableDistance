function State(){
	this.tuples = [];
	
	this.addIfNotPresent = function(tuple){
		var pos = this.tuples.findIndex(function(t){
			return t.getKey() === tuple.getKey();
		});
		if(pos === -1){
			this.tuples.push(tuple);
		}
		else{
			this.tuples[pos] = tuple.getValue();
		}
	}
	
};

State.prototype.add = function(values){
	var valuesWithKey = Object.entries(values);
	
	var pos;
	for(pos = 0; pos < valuesWithKey.length; pos++){
		var key = valuesWithKey[pos][0];
		var value = valuesWithKey[pos][1];
		
		var tuple = new Tuple(key,value);
		
		this.addIfNotPresent(tuple);
	}
}

State.prototype.getValue = function(key){
	
	//TO DO LATER: What to return if it's not found
	var found = this.tuples.find(function(tuple){
		return tuple.getKey() === key;
	});
	return found.getValue();
}

State.prototype.getLength = function(){
	return this.tuples.length;
}

//TUPLE
function Tuple(key, value){
	this.key = key;
	this.value = value;
}

Tuple.prototype.getKey = function(){
	return this.key;
}

Tuple.prototype.getValue = function(){
	return this.value;
}

Tuple.prototype.setValue = function(newValue){
	this.value = newValue;
}

export default State;