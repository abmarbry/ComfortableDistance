import Processor from "./processor.js";
import Snippet from "./snippet.js";
import Locator from "./locator.js";

//singletons that I too wish it weren't global
var snippet;
var processor;
var locator;

$( document ).ready(function() {
	
	//TO DO: Determine first JSON document to be fetched, add as parameter
	//TO DO: Remove constant when logic for finding files is implemented
	processor = new Processor();
	locator = new Locator();
	
	fetch("TITLE", true);
	
});

//TO DO LATER: refactor fetch so that it as a callback function instead of loadSnippet() so the fn doesn't have to be so bulky
var fetch = function(pathData, isOutside){
	locator.fetchData(pathData).then(function(data){
		var json = $.parseJSON(data);
		loadSnippet(json, isOutside);
	});
}

var loadSnippet = function(json, isOutside){
	
	snippet = processor.translate(json);

	if(!isOutside){
		insertIntoSnippet(snippet.getHtml());
	}
	else{
		insertIntoOutsideSnippet(json.title, json.subtitle, snippet.getHtml());
	}
	
	processor.clear();
	//TO DO LATER: hopefully modularize the listeners more or something
	setChoiceListeners();
};

var handleChoice = function(index){
	//TO DO LATER: store choice parameters somewhere else so snippet doesn't have to be global
	var choiceParameters = snippet.getChoiceParameters(index);
	processor.handleChoice(choiceParameters.consequences);
	
	var pathWithoutExtension;
	
	if(!choiceParameters.isOutside){
		pathWithoutExtension = locator.formatPathData(choiceParameters.next);
	}
	else{
		//TO DO LATER: do something different if there's a save state implemented
		//processor.clearState();
		pathWithoutExtension = choiceParameters.next.nextSnippet
	}
	
	fetch(pathWithoutExtension, choiceParameters.isOutside);
}


var setChoiceListeners = function(){
	$('.choice').click(function(e){
		handleChoice(e.target.id);
	})
}

var insertIntoSnippet = function(data) {
	$("#snippet").html(data);
}; 

var insertIntoOutsideSnippet = function(title, subtitle, body){
	var outsideHTML = processor.outsideDataToHtml(title, subtitle);
	
	insertIntoSnippet(outsideHTML + body);
}