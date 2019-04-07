function Choice(data){
	this.consequences = data.consequences;
	this.body = data.name;
	this.isOutside = data.toOutsideSnippet;
	
	this.nextSnippet = data.nextSnippet;
	this.nextAct = data.nextAct;
	this.nextScene = data.nextScene;
}

Choice.prototype.getNextSnippetData = function(){
	return {
		nextAct : this.nextAct,
		nextScene : this.nextScene,
		nextSnippet : this.nextSnippet
	}
}

Choice.prototype.getConsequences = function(){
	return this.consequences;
}

Choice.prototype.getBody = function(){
	return this.body;
}

Choice.prototype.getIsOutside = function(){
	return this.isOutside;
}

export default Choice;