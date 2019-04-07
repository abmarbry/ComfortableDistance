
Locator.prototype.fetchData = function(fileExtension){
	var fileName = this.BASE_FILE + fileExtension + ".json";

	return $.ajax({
	dataType: "text",
	url: fileName,
	})
    .done(function(data) {
		return data;	
    })
    .fail(function(e) {
		//TO DO LATER: fix this
		console.log(e);
		return e;
		});
}

Locator.prototype.formatPathData = function(data){
	return "Story/" + data.nextAct + "/" + data.nextScene + "/" + data.nextSnippet;
}

function Locator(){
	this.BASE_FILE = "../Game_Content/"
}


export default Locator;