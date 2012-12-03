#Filter

Used to filter an array of objects. This tool is useful when looking to refine a data set. The methods on the filter object are similar to that of SQL. Still to come is the or (||) option when filtering.

```
var f = new Filter(res.response);
var filteredResults = f.select(['text', 'from_user'])
						.expect({
							type: 'match', 
							val: /cute/,
							field: 'text'})
						.order('from_user')
						.done();
```

##featured expect types:
- =
- &lt; 
- &gt;
- match