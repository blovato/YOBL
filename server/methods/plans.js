Meteor.methods({
	bibleAPI: function (url) {
		var result = Meteor.http.get(url, {timeout:30000});
		if(result.statusCode==200) {
			console.log("response received.");
			return result;
		} else {
			console.log("Response issue: ", result.statusCode);
			var errorJson = JSON.parse(result.content);
			throw new Meteor.Error(result.statusCode, errorJson.error);
		}
  }
});
