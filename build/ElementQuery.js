/**
 * Element selector. Uses jQuery as base and adds some more features
 * @param parentElement
 * @param selector
 */
ElementQuery = function(CSSSelector, parentElement) {

	CSSSelector = CSSSelector || "";
  console.log(CSSSelector)
	var selectedElements = [];

	var addElement = function(element) {
		if(selectedElements.indexOf(element) === -1) {
			selectedElements.push(element);
		}
	};

  console.log(selectedElements)

	var selectorParts = ElementQuery.getSelectorParts(CSSSelector);
  console.log(selectorParts)
	selectorParts.forEach(function(selector) {

		// handle special case when parent is selected
		if(selector === "_parent_") {
			$(parentElement).each(function(i, element){
				addElement(element);
			});
		}
		else {
			var elements = $(selector, parentElement);
			elements.each(function(i, element) {
				addElement(element);
			});
		}
	});
  console.log(selectedElements)
	return selectedElements;
};

ElementQuery.getSelectorParts = function(CSSSelector) {
  console.log(CSSSelector)
	var selectors = CSSSelector.split(/(,|".*?"|'.*?'|\(.*?\))/);
  console.log(selectors)

	var resultSelectors = [];
	var currentSelector = "";
	selectors.forEach(function(selector) {
		if(selector === ',') {
			if(currentSelector.trim().length) {
				resultSelectors.push(currentSelector.trim());
			}
			currentSelector = "";
		}
		else {
			currentSelector += selector;
		}
	});
	if(currentSelector.trim().length) {
		resultSelectors.push(currentSelector.trim());
	}
  console.log(resultSelectors)	
	return resultSelectors;
};
