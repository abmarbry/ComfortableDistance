import Snippet from "./snippet.js";
import State from "./state.js";
import Choice from "./choice.js";

Processor.prototype.translate = function(json){
	var body = json.body;
	var bodyPos = 0;

	while(bodyPos < body.length){
		Processor.snippet.startParagraph();
		Processor.processString(json, body[bodyPos]);
		Processor.snippet.endParagraph();		
		bodyPos++;
	}
	
	return Processor.snippet;
};

Processor.prototype.handleChoice = function(consequences){
	if( Object.keys(consequences).length > 0){
		Processor.state.add(consequences);
	}
}

Processor.prototype.outsideDataToHtml = function(title, subtitle){
	
	var body = "";
	
	if(title.length > 0){
		body += "<div class='title'>" + title + "</div>";
	}
	if(subtitle.length > 0){
		body += "<div class='subtitle'>" + subtitle + "</div>";
	}
	
	return body;
}

Processor.prototype.clear = function(){
	Processor.snippet = new Snippet();
}

Processor.prototype.clearState = function(){
	if(Processor.state.getLength() > 0){
		Processor.state = new State();
	}
}





function Processor (){
	Processor.snippet = new Snippet();
	Processor.state = new State();
	
	
	//HELPER FUNCTIONS
	Processor.processString = function(json, string){
		var fetcher = new WordFetcher(string);
			while(!fetcher.isEmpty()){
				var word = fetcher.next();
				//TO DO LATER: minimize json data sent
				Processor.handleAndInsert(json, word);
			}
	}
	

	Processor.handleAndInsert = function(json, word){
		
		//TO DO LATER: Handle if there's a choice / variable in the body, but none in the actual JSON
		if(Processor.isChoiceOrVariable(word)){
			var id = Processor.findInnerID(word);
			if(Processor.isChoice(word)){
				
				var choiceData = Processor.findJSONContent(json.choices.content, id);
				
				var choice = new Choice(choiceData);
				
				Processor.snippet.addHtmlChoice(choice.getNextSnippetData(), choice.getConsequences(), choice.getIsOutside(), choice.getBody());
			}
			else if (Processor.isVariable(word)){
				
				var value = Processor.state.getValue(id);
				var variableData = Processor.findJSONContent(json.variables.content, id);
				var body = Processor.processVariable(variableData, value);
				
				Processor.processString(json, body);
			}
		}
		else{
			Processor.snippet.add(word);
		}
	}
	
	Processor.processVariable = function(variable, value){
		//TO DO LATER: Make less terrible and ugly
		if(variable.returnValue){
			return value;
		}
		else {
			var options = variable.options
			var valueString = value.toString();
			
			var optionsWithKey = Object.entries(options);
			
			var rightOption = optionsWithKey.find(function(o){
				return o[0] === valueString;
			});
			
			return rightOption[1];

		}

	}
	 
	 
	Processor.isChoiceOrVariable = function(word){
		//TO DO: Determine if there's punctuation at the end and handle that separately
		//TO DO SOON PLEASE: possible fix somewhere for splitting a word if there's a \t or something at the end
		var variable;
		
		return (word.charAt(0) === '<' && (word.charAt(word.length-1) === '>'||word.charAt(word.length-2) === '>') );
	}
	

	Processor.isChoice = function(word){
		var bigWord = word.toUpperCase();
		return (bigWord.indexOf("CHOICE") !== -1); 
	}
	

	Processor.isVariable = function(word){
		var bigWord = word.toUpperCase();
		return (bigWord.indexOf("VARIABLE") !== -1); 
	}
	
	
	Processor.findInnerID = function(word){
		var start = word.indexOf("(")+1;
		var end = word.lastIndexOf(")");
		
		return word.substring(start, end);
	}
	
	
	Processor.findJSONContent = function(data, id){
		//TO DO LATER: inefficient, iterates through all choices & doesn't account for name not existing

		var correct;
		var found = false;
		var pos = 0;
		while(!found && pos < data.length){
			if(data[pos].id === id){
				correct = data[pos];
				found = true;
			}
			else{
				pos++;	
			}
		}
		return correct;
		/*
		$.each(data, function(key, value){
			if(value.id === id){
				correct = value;
			}
		});
		return correct;*/
	}
	
};





//WORD FETCHER
function WordFetcher(string){
	this.string = string;
	this.pos = 0;
}

WordFetcher.prototype.next = function(){
	var wordFound = false;
	var pos = this.pos;
	var string = this.string;
	
	while(!wordFound && pos < string.length) {
		//TO DO: Infinite loop bug if string ends in space?
		var c = string.charAt(pos);
		if(c === ' '){
			pos++;
			c = string.charAt(pos);
		}
		else {
			wordFound = true;
		}
	}
	
	if(!wordFound){
		return "";
	}
	else{
		var end = pos;
		c = string.charAt(end);
		while(c !== ' ' && end < string.length){
			end++;
			c = string.charAt(end);
		}
		
		var word = string.substring(pos, end);
		this.pos = end;
		
		return word;
	}
}

WordFetcher.prototype.isEmpty = function(){
	return !(this.pos < this.string.length);
}
//WORD FETCHER END
 

export default Processor;