/**
 * @param options.parentCSSSelector	Elements can be only selected within this element
 * @param options.allowedElements	Elements that can only be selected
 * @constructor
 */
ContentSelector = function(options) {

	// deferred response
	this.deferredCSSSelectorResponse = $.Deferred();

	this.allowedElements = options.allowedElements;
	//this.parentCSSSelector = options.parentCSSSelector.trim();
	//this.alert = options.alert || function(txt) {alert(txt);};

	//if(this.parentCSSSelector) {
	//	this.parent = $(this.parentCSSSelector)[0];

	//	//  handle situation when parent selector not found
	//	if(this.parent === undefined) {
	//		this.deferredCSSSelectorResponse.reject("parent selector not found");
	//		this.alert("Parent element not found!");
	//		return;
	//	}
	//}
	//else {
		this.parent = $("body")[0];
	//}
};

ContentSelector.prototype = {
  tempXpath: "",
  containsFlag: !1,
  indexes: [],
  matchIndex: [],
	/**
	 * get css selector selected by the user
	 */
	getCSSSelector: function(request) {

		if(this.deferredCSSSelectorResponse.state() !== "rejected") {

			// elements that are selected by the user
			this.selectedElements;
      this.resultXpath;
			// element selected from top
			this.top = 0;

			// initialize css selector
			//this.initCssSelector(false);

			this.initGUI();
		}

		return this.deferredCSSSelectorResponse.promise();
	},

	getCurrentCSSSelector: function() {

		if(this.selectedElements && this.selectedElements.length > 0) {

			var cssSelector;

			// handle special case when parent is selected
			if(this.isParentSelected()) {
				if(this.selectedElements.length === 1) {
					cssSelector = '_parent_';
				}
				else if($("#-selector-toolbar [name=diferentElementSelection]").prop("checked")) {
					var selectedElements = this.selectedElements.clone();
					selectedElements.splice(selectedElements.indexOf(this.parent),1);
					cssSelector = '_parent_, '+this.cssSelector.getCssSelector(selectedElements, this.top);
				}
				else {
					// will trigger error where multiple selections are not allowed
					cssSelector = this.cssSelector.getCssSelector(this.selectedElements, this.top);
				}
			}
			else {
				cssSelector = this.cssSelector.getCssSelector(this.selectedElements, this.top);
			}

			return cssSelector;
		}
		return "";
	},

	isParentSelected: function() {
		return this.selectedElements.indexOf(this.parent) !== -1;
	},

	/**
	 * initialize or reconfigure css selector class
	 * @param allowMultipleSelectors
	 */
	initCssSelector: function(allowMultipleSelectors) {
		this.cssSelector = new CssSelector({
			enableSmartTableSelector: true,
			parent: this.parent,
			allowMultipleSelectors:allowMultipleSelectors,
			ignoredClasses: [
				"-sitemap-select-item-selected",
				"-sitemap-select-item-hover",
				"-sitemap-parent",
				"-web-scraper-img-on-top",
				"-web-scraper-selection-active"
			],
			query: jQuery
		});
	},

	previewSelector: function (elementCSSSelector) {

		if(this.deferredCSSSelectorResponse.state() !== "rejected") {

			this.highlightParent();
			$(ElementQuery(elementCSSSelector, this.parent)).addClass('-sitemap-select-item-selected');
			this.deferredCSSSelectorResponse.resolve();
		}

		return this.deferredCSSSelectorResponse.promise();
	},

	initGUI: function () {

		//this.highlightParent();

		// all elements except toolbar
		this.$allElements = $(this.allowedElements+":not(#-selector-toolbar):not(#-selector-toolbar *)", this.parent);
		// allow selecting parent also
		if(this.parent !== document.body) {
			this.$allElements.push(this.parent);
		}

		this.bindElementHighlight();
		this.bindElementSelection();
		//this.bindKeyboardSelectionManipulations();
		this.attachToolbar();
		//this.bindMultipleGroupCheckbox();
		//this.bindMultipleGroupPopupHide();
		//this.bindMoveImagesToTop();
	},

	bindElementSelection: function () {

		this.$allElements.bind("click.elementSelector", function (e) {
			var element = e.currentTarget;
			$(element).removeClass("-sitemap-select-item-hover");
      var optRelXpath = this.generateRelXpath(element);
      console.log("optRelXPath = ")
      console.log(optRelXpath)
      var absXpath = this.generateAbsXpath(element);
      console.log("absXPath = ")
      console.log(absXpath)
      var listXpath = this.generateListXpath(absXpath)
      console.log("listXPath = ")
      console.log(listXpath)
      let optListXpath
      //console.log(element.id)
      //console.log(element.className)
      if(element.id != ''){
        optListXpath = listXpath.slice(0,-2) + "@id='" + element.id + "']"
        console.log(optListXpath)
      }
      else if(element.className != ''){
        optListXpath = listXpath.slice(0,-2) + "@class='" + element.className + "']"
        console.log(optListXpath)
      }
      else{
        optListXpath = listXpath;
        console.log(optListXpath)
      }
      this.resultXpath = optRelXpath;
      //for highlight list
      //let elementsOfXPath = document.evaluate(optListXpath,document);
      //let selectedListElements = [];
      //let node
      //while(node = elementsOfXPath .iterateNext()) {
      //  selectedListElements.push(node)
      //}
      ////console.log(selectedListElements)
      //for (let i = 0; i < selectedListElements.length; i++) {
      //  $(selectedListElements[i]).addClass('-sitemap-select-item-selected');
      //}

			this.selectedElements = element;
			this.highlightSelectedElements(optRelXpath);

			// Cancel all other events
			return false;
		}.bind(this));
	},

  generateListXpath: function(xpath){
    //console.log(xpath)
    let xpathDiv = xpath.split("/");
    //console.log(xpathDiv)
    let leng = xpathDiv.length;
    //console.log(leng)
    let topADEdgeIndex = 1;
    let prevTopADEdgeIndex = 0;
    let xpathPrefix = "//";
    let i = 0;
    let lastCandidate = ""
    while(topADEdgeIndex <= leng -1){
      let candidate = ""
      //console.log(topADEdgeIndex)
      for (i = leng -1 ; i > topADEdgeIndex; i--){
        //console.log(i)
        //console.log(xpathDiv[i])
        //console.log(xpathPrefix);// e.g.  //h1[1]
        let res;
        if(xpathPrefix != '//'){
          candidate = xpathDiv[i] + candidate;
          //console.log(xpathPrefix +'//'+ candidate)
          res = document.evaluate(xpathPrefix +'//'+ candidate, document);//Can't find elements in iframe 
        }
        else{
          candidate = xpathDiv[i] +candidate;
          //console.log(xpathPrefix + candidate)
          res = document.evaluate(xpathPrefix + candidate, document);//Can't find elements in iframe 
        }
        let cnt = 0;
        let elem;
        while(elem = res.iterateNext()) {
          cnt++;
        }
        if(cnt == 1){
          //console.log(candidate);
          //console.log(xpathPrefix);
          topADEdgeIndex = i;
          //i = leng - 1;
          if(xpathPrefix == '//'){
            xpathPrefix = xpathPrefix + xpathDiv[i]; 
          }
          else{
            xpathPrefix = xpathPrefix +'//'+ xpathDiv[i]; 
          }
          //console.log(xpathPrefix);
          break;
        }
        else{
          candidate = '/' + candidate
          //console.log(candidate)
        }
      }
      lastCandidate = candidate
      //console.log(topADEdgeIndex)
      //console.log(i)
      if(topADEdgeIndex == i){
        if(prevTopADEdgeIndex == topADEdgeIndex){
        //for
          xpathPrefix = '/' + candidate
          //console.log(xpathPrefix)
          prevTopADEdgeIndex = topADEdgeIndex
          //console.log(prevTopADEdgeIndex)
          //console.log(topADEdgeIndex)
          return xpathPrefix;
          break;
        }
        else{
          //for first case
          //xpathPrefix = '//' + candidate
          //console.log(xpathPrefix)
          prevTopADEdgeIndex = topADEdgeIndex
          //console.log(prevTopADEdgeIndex)
          //console.log(topADEdgeIndex)
        }
      }
      if(i == leng -1 ){
        break;
      }
    }
    //console.log('end')
    //console.log(xpathPrefix);
    //console.log(xpathPrefix + '//' + lastCandidate) 
    return xpathPrefix; 
  },


  optimizeXpath: function(_document, xpath) {
    let xpathDiv = xpath.split("//");
    let leng = xpathDiv.length;
    var regBarces = /[^[\]]+(?=])/g;
    let bracesContentArr = xpath.match(regBarces);
    let startOptimizingFromHere = 1;
    for (let j = bracesContentArr.length - 1; j > 0; j--) {
        startOptimizingFromHere++;
        if (bracesContentArr[j].length > 3) {
            startOptimizingFromHere = startOptimizingFromHere;
            break
        }
    }
    let tempXpath = xpath.split("//" + xpathDiv[leng - startOptimizingFromHere])[1];
    let totalMatch = 0;
    try {
        totalMatch = _document.evaluate(tempXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength
    } catch (err) {
        return xpath
    }
    if (totalMatch === 1) {
        return tempXpath
    }
    for (let i = leng - startOptimizingFromHere; i > 0; i--) {
        let temp = xpath.replace("//" + xpathDiv[i], "");
        try {
            totalMatch = _document.evaluate(temp, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
            if (totalMatch === 1) {
                xpath = temp
            }
        } catch (err) {
            return xpath
        }
    }
    return xpath
  },

  generateAbsXpath: function(element) {
    if (element.tagName.toLowerCase().includes("style") || element.tagName.toLowerCase().includes("script")) {
        return "This is " + element.tagName.toLowerCase() + " tag. For " + element.tagName.toLowerCase() + " tag, no need to write selector. :P"
    }
    if (element.tagName.toLowerCase() === 'html')
        return '/html[1]';
    if (element.tagName.toLowerCase() === 'body')
        return '/html[1]/body[1]';
    var ix = 0;
    var siblings = element.parentNode.childNodes;
    for (var i = 0; i < siblings.length; i++) {
        var sibling = siblings[i];
        if (sibling === element) {
            if (element.tagName.toLowerCase().includes('svg')) {
                var absXpath = this.generateAbsXpath(element.parentNode) + '/' + '*';
                return absXpath
            } else {
                var absXpath = this.generateAbsXpath(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
                if (absXpath.includes("/*/")) {
                    absXpath = "It might be child of iframe & it is not supported currently."
                }
                return absXpath
            }
        }
        if (sibling.nodeType === 1 && sibling.tagName.toLowerCase() === element.tagName.toLowerCase()) {
            ix++
        }
    }
  },


  generateRelXpath: function(element) {
    _document = element.ownerDocument;
    relXpath = this.formRelXpath(_document, element);
    //console.log(relXpath)
    let doubleForwardSlash = /\/\/+/g;
    let numOfDoubleForwardSlash = 0;
    try {
        numOfDoubleForwardSlash = relXpath.match(doubleForwardSlash).length
    } catch (err) {}
    if (numOfDoubleForwardSlash > 1 && relXpath.includes('[') && !relXpath.includes('@href') && !relXpath.includes('@src')) {
        relXpath = this.optimizeXpath(_document, relXpath)
    }
    if (relXpath === undefined) {
        relXpath = "It might be child of svg/pseudo/comment/iframe from different src. XPath doesn't support for them."
    }
    this.tempXpath = "";
    //console.log("Optimized Relative XPath")
    //console.log(relXpath)
    return relXpath
  },
  
  removeLineBreak: function(value) {
    if (value) {
        value = value.split('\n')[0].length > 0 ? value.split('\n')[0] : value.split('\n')[1]
    }
    return value
  },

  formRelXpath: function(_document, element) {
    var userAttr = "";//userAttrName.value.trim();
    var idChecked = "withid";//idCheckbox.checked ? "withid" : "withoutid";
    var classChecked = "withclass";//classAttr.checked ? "withclass" : "withoutclass";
    var nameChecked = "withname";//nameAttr.checked ? "withname" : "withoutname";
    var placeholderChecked = "withplaceholder";//placeholderAttr.checked ? "withplaceholder" : "withoutplaceholder";
    var attributeChoicesForXpath = [userAttr, idChecked, classChecked, nameChecked, placeholderChecked]
    //attributeChoicesForXpath = attributeChoices.split(",");
    var userAttr = attributeChoicesForXpath[0];
    //var userAttr = attributeChoices[0];
    var innerText = [].reduce.call(element.childNodes, function(a, b) {
        return a + (b.nodeType === 3 ? b.textContent : '')
    }, '').trim().slice(0, 50);
    innerText = this.removeLineBreak(innerText);
    var tagName = element.tagName.toLowerCase();
    if (tagName.includes("style") || tagName.includes("script")) {
        return "This is " + tagName + " tag. For " + tagName + " tag, no need to write selector. :P"
    }
    if (tagName.includes('svg')) {
        tagName = "*"
    }
    var innerText = false
    //if (innerText.includes("'")) {
    //    innerText = innerText.split('  ')[innerText.split('  ').length - 1];
    //    containsText = '[contains(text(),"' + innerText + '")]';
    //   equalsText = '[text()="' + innerText + '"]'
    //} else {
    //    innerText = innerText.split('  ')[innerText.split('  ').length - 1];
    //    containsText = "[contains(text(),'" + innerText + "')]";
    //    equalsText = "[text()='" + innerText + "']"
    //}
    if (tagName.includes('html')) {
        return '//html' + this.tempXpath
    }
    var attr = "";
    var attrValue = "";
    var listOfAttr = {};
    if ((!element.getAttribute(userAttr) || userAttr.toLowerCase() === "id") && element.id !== '' && attributeChoicesForXpath.includes("withid")) {
        var id = element.id;
        id = this.removeLineBreak(id);
        this.tempXpath = '//' + tagName + "[@id='" + id + "']" + this.tempXpath;
        var totalMatch = _document.evaluate(this.tempXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
        if (totalMatch === 1) {
            return this.tempXpath
        } else {
            if (innerText && element.getElementsByTagName('*').length === 0) {
                var containsXpath = '//' + tagName + containsText;
                var totalMatch = _document.evaluate(containsXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
                if (totalMatch === 0) {
                    var equalsXpath = '//' + tagName + equalsText;
                    var totalMatch = _document.evaluate(equalsXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
                    if (totalMatch === 1) {
                        return equalsXpath
                    } else {
                        this.tempXpath = this.tempXpath
                    }
                } else if (totalMatch === 1) {
                    return containsXpath
                } else {
                    this.tempXpath = this.tempXpath
                }
            } else {
              this.tempXpath = this.tempXpath
            }
        }
    } else if (element.attributes.length != 0) {
        if (!attrValue) {
            for (var i = 0; i < element.attributes.length; i++) {
                attr = element.attributes[i].name;
                attrValue = element.attributes[i].nodeValue;
                if (attrValue != null && attrValue != "" && (attr !== "style" || userAttr === "style") && attr !== "id" && attr !== "xpath" && (attributeChoicesForXpath.includes("with" + attr) || userAttr == attr)) {
                    listOfAttr[attr] = attrValue
                }
            }
        }
        if (userAttr in listOfAttr) {
            attr = userAttr;
            attrValue = listOfAttr[attr]
        } else if ("placeholder" in listOfAttr) {
            attr = "placeholder";
            attrValue = listOfAttr[attr]
        } else if ("title" in listOfAttr) {
            attr = "title";
            attrValue = listOfAttr[attr]
        } else if ("value" in listOfAttr) {
            attr = "value";
            attrValue = listOfAttr[attr]
        } else if ("name" in listOfAttr) {
            attr = "name";
            attrValue = listOfAttr[attr]
        } else if ("type" in listOfAttr) {
            attr = "type";
            attrValue = listOfAttr[attr]
        } else if ("class" in listOfAttr) {
            attr = "class";
            attrValue = listOfAttr[attr]
        } else {
            attr = Object.keys(listOfAttr)[0];
            attrValue = listOfAttr[attr]
        }
        attrValue = this.removeLineBreak(attrValue);
        if (attrValue != null && attrValue != "" && attr !== "xpath") {
            var xpathWithoutAttribute = '//' + tagName + this.tempXpath;
            var xpathWithAttribute = "";
            if (attrValue.includes('  ')) {
                attrValue = attrValue.split('  ')[attrValue.split('  ').length - 1];
                this.containsFlag = !0
            }
            if (attrValue.includes("'")) {
                if (attrValue.charAt(0) === " " || attrValue.charAt(attrValue.length - 1) === " " || this.containsFlag) {
                    xpathWithAttribute = '//' + tagName + '[contains(@' + attr + ',"' + attrValue.trim() + '")]' + this.tempXpath
                } else {
                  xpathWithAttribute = '//' + tagName + '[@' + attr + '="' + attrValue + '"]' + this.tempXpath
                }
            } else {
                if (attrValue.charAt(0) === " " || attrValue.charAt(attrValue.length - 1) === " " || this.containsFlag) {
                    xpathWithAttribute = '//' + tagName + "[contains(@" + attr + ",'" + attrValue.trim() + "')]" + this.tempXpath
                } else {
                  xpathWithAttribute = '//' + tagName + "[@" + attr + "='" + attrValue + "']" + this.tempXpath
                }
            }
            var totalMatch = _document.evaluate(xpathWithAttribute, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
            if (totalMatch === 1) {
                if ((xpathWithAttribute.includes('@href') && !userAttr.includes("href")) || (xpathWithAttribute.includes('@src') && !userAttr.includes("src")) && innerText) {
                    var containsXpath = '//' + tagName + containsText;
                    var totalMatch = _document.evaluate(containsXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
                    if (totalMatch === 0) {
                        var equalsXpath = '//' + tagName + equalsText;
                        var totalMatch = _document.evaluate(equalsXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
                        if (totalMatch === 1) {
                            return equalsXpath
                        }
                    } else if (totalMatch === 1) {
                        return containsXpath
                    }
                }
                return xpathWithAttribute
            } 
            else if (innerText) {
                var containsXpath = '//' + tagName + containsText;
                var totalMatch = _document.evaluate(containsXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
                if (totalMatch === 0) {
                    var equalsXpath = '//' + tagName + equalsText;
                    var totalMatch = _document.evaluate(equalsXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
                    if (totalMatch === 1) {
                        return equalsXpath
                    } else {
                        this.tempXpath = equalsXpath
                    }
                } else if (totalMatch === 1) {
                    return containsXpath
                } else {
                    containsXpath = xpathWithAttribute + containsText;
                    totalMatch = _document.evaluate(containsXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
                    if (totalMatch === 0) {
                        var equalsXpath = xpathWithAttribute + equalsText;
                        var totalMatch = _document.evaluate(equalsXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
                        if (totalMatch === 1) {
                            return equalsXpath
                        }
                    } else if (totalMatch === 1) {
                        return containsXpath
                    } else if (attrValue.includes('/') || innerText.includes('/')) {
                        if (attrValue.includes('/')) {
                            containsXpath = xpathWithoutAttribute + containsText
                        }
                        if (innerText.includes('/')) {
                            containsXpath = containsXpath.replace(containsText, "")
                        }
                        this.tempXpath = containsXpath
                    } else {
                        this.tempXpath = containsXpath
                    }
                }
            } else {
                this.tempXpath = xpathWithAttribute;
                if (attrValue.includes('/')) {
                    this.tempXpath = "//" + tagName + xpathWithoutAttribute
                }
            }
        } 
        else if (innerText) {
            var containsXpath = '//' + tagName + containsText;
            var totalMatch = _document.evaluate(containsXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
            if (totalMatch === 0) {
                var equalsXpath = '//' + tagName + equalsText;
                var totalMatch = _document.evaluate(equalsXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
                if (totalMatch === 1) {
                    return equalsXpath
                }
            } else if (totalMatch === 1) {
                return containsXpath
            }
            this.tempXpath = containsXpath
        } 
        else if ((attrValue == null || attrValue == "" || attr.includes("xpath"))) {
            this.tempXpath = "//" + tagName + this.tempXpath
        }
    } 
    else if (attrValue == "" && innerText && !tagName.includes("script")) {
        var containsXpath = '//' + tagName + containsText + this.tempXpath;
        var totalMatch = _document.evaluate(containsXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
        if (totalMatch === 0) {
            this.tempXpath = '//' + tagName + equalsText + this.tempXpath;
            var totalMatch = _document.evaluate(this.tempXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
            if (totalMatch === 1) {
                return this.tempXpath
            }
        } else if (totalMatch === 1) {
            return containsXpath
        } else {
            this.tempXpath = containsXpath
        }
    } 
    else {
        this.tempXpath = "//" + tagName + this.tempXpath
    }
    var ix = 0;
    var siblings = element.parentNode.childNodes;
    for (var i = 0; i < siblings.length; i++) {
        var sibling = siblings[i];
        if (sibling === element) {
            this.indexes.push(ix + 1);
            if(this.tempXpath == undefined){
              this.tempXpath = ""
            }
            this.tempXpath = this.formRelXpath(_document, element.parentNode);
            if (!this.tempXpath.includes("/")) {
                return this.tempXpath
            } else {
                var totalMatch = _document.evaluate(this.tempXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
                if (totalMatch === 1) {
                    return this.tempXpath
                } else {
                    this.tempXpath = "/" + this.tempXpath.replace(/\/\/+/g, '/');
                    var regSlas = /\/+/g;
                    var regBarces = /[^[\]]+(?=])/g;
                    while ((match = regSlas.exec(this.tempXpath)) != null) {
                        this.matchIndex.push(match.index)
                    }
                    for (var j = 0; j < this.indexes.length; j++) {
                        if (j === 0) {
                            var lastTag = this.tempXpath.slice(this.matchIndex[this.matchIndex.length - 1]);
                            if ((match = regBarces.exec(lastTag)) != null) {
                                lastTag = lastTag.replace(regBarces, this.indexes[j]).split("]")[0] + "]";
                                console.log(this.tempXpath)
                                this.tempXpath = this.tempXpath.slice(0, this.matchIndex[this.matchIndex.length - 1]) + lastTag
                                console.log(this.tempXpath)
                            } else {
                                console.log(this.tempXpath)
                                this.tempXpath = this.tempXpath + "[" + this.indexes[j] + "]"
                                console.log(this.tempXpath)
                            }
                        } else {
                            var lastTag = this.tempXpath.slice(this.matchIndex[this.matchIndex.length - (j + 1)], this.matchIndex[this.matchIndex.length - (j)]);
                            if ((match = regBarces.exec(lastTag)) != null) {
                                lastTag = lastTag.replace(regBarces, this.indexes[j]);
                                console.log(this.tempXpath)
                                this.tempXpath = this.tempXpath.slice(0, this.matchIndex[this.matchIndex.length - (j + 1)]) + lastTag + this.tempXpath.slice(this.matchIndex[this.matchIndex.length - j])
                                console.log(this.tempXpath)
                            } else {
                                console.log(this.tempXpath)
                                console.log(this.matchIndex[this.matchIndex.length - j])
                               
                                this.tempXpath = this.tempXpath.slice(0, this.matchIndex[this.matchIndex.length - j]) + "[" + this.indexes[j] + "]" + this.tempXpath.slice(this.matchIndex[this.matchIndex.length - j])
                              
                                console.log(this.tempXpath)
                            }
                        }
                        console.log(this.tempXpath)
                        var totalMatch = _document.evaluate(this.tempXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
                        if (totalMatch === 1) {
                            var regSlashContent = /([a-zA-Z])([^/]*)/g;
                            var length = this.tempXpath.match(regSlashContent).length;
                            for (var k = j + 1; k < length - 1; k++) {
                                var lastTag = this.tempXpath.match(/\/([^\/]+)\/?$/)[1];
                                var arr = this.tempXpath.match(regSlashContent);
                                arr.splice(length - k, 1, '/');
                                var relXpath = "";
                                for (var i = 0; i < arr.length - 1; i++) {
                                    if (arr[i]) {
                                        relXpath = relXpath + "/" + arr[i]
                                    } else {
                                        relXpath = relXpath + "//" + arr[i]
                                    }
                                }
                                relXpath = (relXpath + "/" + lastTag).replace(/\/\/+/g, '//');
                                relXpath = relXpath.replace(/\/\/+/g, '/');
                                relXpath = relXpath.replace(/\/+/g, "//");
                                var totalMatch = _document.evaluate(relXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
                                if (totalMatch === 1) {
                                    this.tempXpath = relXpath
                                }
                            }
                            return this.tempXpath.replace('//html', '')
                        }
                    }
                }
            }
        }
        if (sibling.nodeType === 1 && sibling.tagName.toLowerCase() === element.tagName.toLowerCase()) {
            ix++
        }
    }
  },

	/**
	 * Add to select elements the element that is under the mouse
	 */
	selectMouseOverElement: function() {

		var element = this.mouseOverElement;
		if(element) {
			this.selectedElements.push(element);
			//this.highlightSelectedElements();
		}
	},

	bindElementHighlight: function () {
		$(this.$allElements).bind("mouseover.elementSelector", function(e) {
			// allow event bubbling for other event listeners but not for web scraper.
			if(e.target !== e.currentTarget) {
				return;
			}

			var element = e.currentTarget;
			this.mouseOverElement = element;
			$(element).addClass("-sitemap-select-item-hover");
		}.bind(this)).bind("mouseout.elementSelector", function(e) {
			// allow event bubbling for other event listeners but not for web scraper.
			if(e.target !== e.currentTarget) {
				return;
			}

			var element = e.currentTarget;
			this.mouseOverElement = null;
			$(element).removeClass("-sitemap-select-item-hover");
		}.bind(this));
	},

	bindMoveImagesToTop: function() {

		$("body").addClass("-web-scraper-selection-active");

		// do this only when selecting images
		if(this.allowedElements === 'img') {
			$("img").filter(function(i, element) {
				return $(element).css("position") === 'static';
			}).addClass("-web-scraper-img-on-top");
		}
	},

	unbindMoveImagesToTop: function() {

		$("body.-web-scraper-selection-active").removeClass("-web-scraper-selection-active");
		$("img.-web-scraper-img-on-top").removeClass("-web-scraper-img-on-top");
	},

	selectChild: function () {
		this.top--;
		if (this.top < 0) {
			this.top = 0;
		}
	},
	selectParent: function () {
		this.top++;
	},

	// User with keyboard arrows can select child or paret elements of selected elements.
	bindKeyboardSelectionManipulations: function () {

		// check for focus
		var lastFocusStatus;
		this.keyPressFocusInterval = setInterval(function() {
			var focus = document.hasFocus();
			if(focus === lastFocusStatus) return;
			lastFocusStatus = focus;

			$("#-selector-toolbar .key-button").toggleClass("hide", !focus);
			$("#-selector-toolbar .key-events").toggleClass("hide", focus);
		}.bind(this), 200);


		// Using up/down arrows user can select elements from top of the
		// selected element
		$(document).bind("keydown.selectionManipulation", function (event) {

			// select child C
			if (event.keyCode === 67) {
				this.animateClickedKey($("#-selector-toolbar .key-button-child"));
				this.selectChild();
			}
			// select parent P
			else if (event.keyCode === 80) {
				this.animateClickedKey($("#-selector-toolbar .key-button-parent"));
				this.selectParent();
			}
			// select element
			else if (event.keyCode === 83) {
				this.animateClickedKey($("#-selector-toolbar .key-button-select"));
				this.selectMouseOverElement();
			}

			//this.highlightSelectedElements();
		}.bind(this));
	},

	animateClickedKey: function(element) {
		$(element).removeClass("clicked").removeClass("clicked-animation");
		setTimeout(function() {
			$(element).addClass("clicked");
			setTimeout(function(){
				$(element).addClass("clicked-animation");
			},100);
		},1);

	},

	highlightSelectedElements: function (optRelXpath) {
		try {
			//var resultCssSelector = this.getCurrentCSSSelector();
      //console.log(" highlightSelectedElements");
      console.log(optRelXpath)
      var res = document.evaluate(optRelXpath, document);
      var elem = "temp";
      if(res){
        elem = res.iterateNext();
      }
      //console.log(elem)
      //console.log('-----------------------')
			$(".-sitemap-select-item-selected").removeClass('-sitemap-select-item-selected');
      $(elem).addClass('-sitemap-select-item-selected');
      //https://www.amazon.com/s?bbn=16225007011&rh=n%3A16225007011%2Cn%3A172456&dc&fst=as%3Aoff&qid=1578897380&rnid=16225007011&ref=lp_16225007011_nr_n_0
      //var elementsOfXPath = document.evaluate('//div[1]/span[1]/div[1]/div[1]/div[2]/div[2]/div[1]/div[1]/div[1]/div[1]/div[1]/h2[1]/a[1]/span[1]',document);

      //https://en.zalando.de/womens-clothing-dresses/
      //var elementsOfXPath = document.evaluate('//article[1]/div[1]/div[2]/header[1]/a[1]/div[1]/div[2]',document);

      //https://www.walmart.com/browse/food/coffee/976759_1086446_1229652?povid=1086446+%7C++%7C+Coffee%20Whole%20Bean%20Coffee%20Featured%20Categories%20Collapsible
      //var elementsOfXPath = document.evaluate('//div[1]/div[2]/div[5]/div[1]/a[1]/span[1]',document);
     
      //https://www.newegg.com/p/pl?N=100023490&cm_sp=Cat_Digital-Cameras_1-_-VisNav-_-Cameras_1
      //var elementsOfXPath = document.evaluate('//div/div[1]/a[@class=\'item-title\']',document);
      
      //https://global.rakuten.com/en/category/206878/?l-id=rgm-top-en-nav-shoes-mensneakers 
      //var elementsOfXPath = document.evaluate('//li/div[1]/div[2]/div[1]/a[1]',document);


      //var selectedElements = [];
      //while(node = elementsOfXPath .iterateNext()) {
      //  selectedElements.push(node)
      //}

      //for (var i = 0; i < selectedElements.length; i++) {
      //  //console.log(selectedElements[i]);
      //  $(selectedElements[i]).addClass('-sitemap-select-item-selected');
      //}

      console.log('--------------------------')
			$("body #-selector-toolbar .selector").text(optRelXpath);
      console.log('--------------------------')
			//// highlight selected elements
      //console.log(this.selectedElements)
      //console.log(this.parent)
			//$(ElementQuery(this.selectedElements, this.parent)).addClass('-sitemap-select-item-selected');
		}
		catch(err) {
			if(err === "found multiple element groups, but allowMultipleSelectors disabled") {
				console.log("multiple different element selection disabled");

				this.showMultipleGroupPopup();
				// remove last added element
				this.selectedElements.pop();
				this.highlightSelectedElements();
			}
		}
	},

	showMultipleGroupPopup: function() {
		$("#-selector-toolbar .popover").attr("style", "display:block !important;");
	},

	hideMultipleGroupPopup: function() {
		$("#-selector-toolbar .popover").attr("style", "");
	},

	bindMultipleGroupPopupHide: function() {
		$("#-selector-toolbar .popover .close").click(this.hideMultipleGroupPopup.bind(this));
	},

	unbindMultipleGroupPopupHide: function() {
		$("#-selector-toolbar .popover .close").unbind("click");
	},

	bindMultipleGroupCheckbox: function() {
		$("#-selector-toolbar [name=diferentElementSelection]").change(function(e) {
			if($(e.currentTarget).is(":checked")) {
				this.initCssSelector(true);
			}
			else {
				this.initCssSelector(false);
			}
		}.bind(this));
	},
	unbindMultipleGroupCheckbox: function(){
		$("#-selector-toolbar .diferentElementSelection").unbind("change");
	},

	attachToolbar: function () {
		var $toolbar = '<div id="-selector-toolbar">' +
			'<div class="list-item"><div class="selector-container"><div class="selector"></div></div></div>' +
			//'<div class="input-group-addon list-item">' +
			//	//'<input type="checkbox" title="Enable different type element selection" name="diferentElementSelection">' +
			//	'<div class="popover top">' +
			//	'<div class="close">×</div>' +
			//	'<div class="arrow"></div>' +
			//	'<div class="popover-content">' +
			//	'<div class="txt">' +
			//	'Different type element selection is disabled. If the element ' +
			//	'you clicked should also be included then enable this and ' +
			//	'click on the element again. Usually this is not needed.' +
			//	'</div>' +
			//	'</div>' +
			//	'</div>' +
			//'</div>' +
			//'<div class="list-item key-events"><div title="Click here to enable key press events for selection">Enable key events</div></div>' +
			'<div class="list-item key-button key-button-select hide" title="Use S key to select element">S</div>' +
			'<div class="list-item key-button key-button-parent hide" title="Use P key to select parent">P</div>' +
			'<div class="list-item key-button key-button-child hide" title="Use C key to select child">C</div>' +
			'<div class="list-item done-selecting-button">Close</div>' +
			'</div>';
		$("body").append($toolbar);

		$("body #-selector-toolbar .done-selecting-button").click(function () {
      console.log('click done');
			this.selectionFinished();
		}.bind(this));
	},


	highlightParent: function () {
		// do not highlight parent if its the body
		if(!$(this.parent).is("body") && !$(this.parent).is("#webpage")) {
			$(this.parent).addClass("-sitemap-parent");
		}
	},

	unbindElementSelection: function () {
		$(this.$allElements).unbind("click.elementSelector");
		// remove highlighted element classes
		this.unbindElementSelectionHighlight();
	},
	unbindElementSelectionHighlight: function () {
		$(".-sitemap-select-item-selected").removeClass('-sitemap-select-item-selected');
		$(".-sitemap-parent").removeClass('-sitemap-parent');
	},
	unbindElementHighlight: function () {
		$(this.$allElements).unbind("mouseover.elementSelector")
			.unbind("mouseout.elementSelector");
	},
	unbindKeyboardSelectionMaipulatios: function () {
		$(document).unbind("keydown.selectionManipulation");
		clearInterval(this.keyPressFocusInterval);
	},
	removeToolbar: function () {
		$("body #-selector-toolbar a").unbind("click");
		$("#-selector-toolbar").remove();
	},

	/**
	 * Remove toolbar and unbind events
	 */
	removeGUI: function() {

		this.unbindElementSelection();
		this.unbindElementHighlight();
		this.unbindKeyboardSelectionMaipulatios();
		this.unbindMultipleGroupPopupHide();
		this.unbindMultipleGroupCheckbox();
		this.unbindMoveImagesToTop();
		this.removeToolbar();
	},

	selectionFinished: function () {
    console.log('selectionFinished');
    console.log(this.resultXpath)
		//var resultCssSelector = this.resultXpath;//this.getCurrentCSSSelector();

		this.deferredCSSSelectorResponse.resolve({
			CSSSelector: this.resultXpath
		});
	}
};
