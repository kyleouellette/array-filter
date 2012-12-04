$.getJSON('http://search.twitter.com/search.json?q=' + encodeURIComponent('#kitten') + '&callback=?', function(res){
	var results,
		f, 
		filteredResults;


	results = res.results;

	// create a new filter
	f = new Filter(results);
	// do your filtering
	filteredResults = f.select(['text', 'from_user'])
				.expect({
					type: 'match', 
					val: /cute/,
					field: 'text'})
				.order('from_user')
				.done();
	f.resetTo(0);
	console.log(f.json);

	// append results to the body
	for(var i = 0; i < filteredResults.length; i++){
		$('<div />')
			.html(filteredResults[i].from_user + ':<br />' + filteredResults[i].text + '<br /><br />')
			.appendTo('body');
	}
});