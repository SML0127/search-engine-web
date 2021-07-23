chrome.devtools.panels.create("PSE", null, "pse-extension.html");


//chrome.runtime.onMessage.addListener(
//	function (request, sender, sendResponse) {
//
//		console.log("content");
//		console.log("chrome.runtime.onMessage", request);
//		
//		// Universal ContentScript communication handler
//    console.log(request)
//    console.log(request.request)
//		if(request.request.contentScriptCall) {
//      console.log("contentSCriptCALLLLLLLLLLL")
//			var contentScript = getContentScript("ContentScript");
//
//      console.log(contentScript)
//			console.log("received ContentScript request", request);
//			//var deferredResponse = contentScript['backgroundScript'][request.fn](request.request);
//      //console.log(deferredResponse)
//			//deferredResponse.done(function(response) {
//      //  console.log(response);//response = css selector
//			//	sendResponse(response);
//			//});
//
//			return true;
//		}
//	}
//);
//
//var BackgroundScript = {
//
//	dummy: function() {
//
//		return $.Deferred().resolve("dummy").promise();
//	},
//
//	/**
//	 * Returns the id of the tab that is visible to user
//	 * @returns $.Deferred() integer
//	 */
//	getActiveTabId: function() {
//
//		var deferredResponse = $.Deferred();
//
//		chrome.tabs.query({
//			active: true,
//			currentWindow: true
//		}, function (tabs) {
//
//			if (tabs.length < 1) {
//				// @TODO must be running within popup. maybe find another active window?
//				deferredResponse.reject("couldn't find the active tab");
//			}
//			else {
//				var tabId = tabs[0].id;
//				deferredResponse.resolve(tabId);
//			}
//		});
//		return deferredResponse.promise();
//	},
//
//	/**
//	 * Execute a function within the active tab within content script
//	 * @param request.fn	function to call
//	 * @param request.request	request that will be passed to the function
//	 */
//	executeContentScript: function(request) {
//
//		var reqToContentScript = {
//			contentScriptCall: true,
//			fn: request.fn,
//			request: request.request
//		};
//		var deferredResponse = $.Deferred();
//		var deferredActiveTabId = this.getActiveTabId();
//		deferredActiveTabId.done(function(tabId) {
//			chrome.tabs.sendMessage(tabId, reqToContentScript, function(response) {
//				deferredResponse.resolve(response);
//			});
//		});
//
//		return deferredResponse;
//	}
//};
//
///**
// * @param location	configure from where the content script is being accessed (ContentScript, BackgroundPage, DevTools)
// * @returns BackgroundScript
// */
//var getBackgroundScript = function(location) {
//
//	// Handle calls from different places
//	if(location === "BackgroundScript") {
//		return BackgroundScript;
//	}
//	else if(location === "DevTools" || location === "ContentScript") {
//
//		// if called within background script proxy calls to content script
//		var backgroundScript = {};
//
//		Object.keys(BackgroundScript).forEach(function(attr) {
//			if(typeof BackgroundScript[attr] === 'function') {
//				backgroundScript[attr] = function(request) {
//
//					var reqToBackgroundScript = {
//						backgroundScriptCall: true,
//						fn: attr,
//						request: request
//					};
//
//					var deferredResponse = $.Deferred();
//
//					chrome.runtime.sendMessage(reqToBackgroundScript, function(response) {
//						deferredResponse.resolve(response);
//					});
//
//					return deferredResponse;
//				};
//			}
//			else {
//				backgroundScript[attr] = BackgroundScript[attr];
//			}
//		});
//
//		return backgroundScript;
//	}
//	else {
//		throw "Invalid BackgroundScript initialization - " + location;
//	}
//};
//
//
//var getBackgroundScript = function(location) {
//  console.log("getBackgroundScript in devtools")
//	// Handle calls from different places
//	if(location === "BackgroundScript") {
//		return BackgroundScript;
//	}
//	else if(location === "DevTools" || location === "ContentScript") {
//
//		// if called within background script proxy calls to content script
//		var backgroundScript = {};
//
//		Object.keys(BackgroundScript).forEach(function(attr) {
//			if(typeof BackgroundScript[attr] === 'function') {
//				backgroundScript[attr] = function(request) {
//
//					var reqToBackgroundScript = {
//						backgroundScriptCall: true,
//						fn: attr,
//						request: request
//					};
//
//					var deferredResponse = $.Deferred();
//
//					chrome.runtime.sendMessage(reqToBackgroundScript, function(response) {
//						deferredResponse.resolve(response);
//					});
//
//					return deferredResponse;
//				};
//			}
//			else {
//				backgroundScript[attr] = BackgroundScript[attr];
//			}
//		});
//
//		return backgroundScript;
//	}
//	else {
//		throw "Invalid BackgroundScript initialization - " + location;
//	}
//};
//var getContentScript = function(location) {
//
//  console.log("getContentScript in devtool")
//	var contentScript;
//  console.log(location)
//	// Handle calls from different places
//	if(location === "ContentScript") {
//		contentScript = ContentScript;
//		contentScript.backgroundScript = getBackgroundScript("ContentScript");
//		return contentScript;
//	}
//	else if(location === "BackgroundScript" || location === "DevTools") {
//
//		var backgroundScript = getBackgroundScript(location);
//
//		// if called within background script proxy calls to content script
//		contentScript = {};
//		Object.keys(ContentScript).forEach(function(attr) {
//		  if(typeof ContentScript[attr] === 'function') {
//			  contentScript[attr] = function(request) {
//				  var reqToContentScript = {
//				  	contentScriptCall: true,
//				  	fn: attr,
//				  	request: request
//				  };
//				  return backgroundScript.executeContentScript(reqToContentScript);
//			  };
//		  }
//		  else {
//			  contentScript[attr] = ContentScript[attr];
//		  }
//		});
//		contentScript.backgroundScript = backgroundScript;
//		return contentScript;
//	}
//	else {
//		throw "Invalid ContentScript initialization - " + location;
//	}
//}
//
////
////
////chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
////  console.log("extension")
////  console.log(request)
////  console.log(request.message)
////    if (request.message === "generate-selector") {
////        generateSelectors()
////    }
////});
////
////chrome.devtools.panels.elements.onSelectionChanged.addListener(handleSelectedElement)
//////function() {
//////  console.log("devtools")
//////  //      generateSelectors()
//////});
//
//function handleSelectedElement() {
//  console.log("devtools")
//  generateSelectors()
//}
//
//
//function generateSelectors() {
//  console.log("generateSelectors")
//  var relXpathContainer = document.querySelector(".selectorsBlock li:nth-child(1)");
//  console.log(relXpathContainer)
//  relXpathContainer.style.display = "";
//  generateColoredRelXpath()
//}
//
//var attributeChoices = [];
//
//function generateRelXpath(element, attributeChoices) {
//  console.log("generateRelXpath")
//  console.log(element)
//  console.log(attributeChoices)
//  attributeChoicesForXpath = attributeChoices.split(",");
//  _document = element.ownerDocument;
//  console.log(_document)
//  let relXpath = formRelXpath(_document, element);
//  console.log(relXpath)
//  let doubleForwardSlash = /\/\/+/g;
//  let numOfDoubleForwardSlash = 0;
//  try {
//      numOfDoubleForwardSlash = relXpath.match(doubleForwardSlash).length
//  } catch (err) {}
//  if (numOfDoubleForwardSlash > 1 && relXpath.includes('[') && !relXpath.includes('@href') && !relXpath.includes('@src')) {
//      relXpath = optimizeXpath(_document, relXpath)
//  }
//  if (relXpath === undefined) {
//      relXpath = "It might be child of svg/pseudo/comment/iframe from different src. XPath doesn't support for them."
//  }
//  this.tempXpath = "";
//  return relXpath
//}
//
//function attributeChoicesOption() {
//    var userAttr = "";//userAttrName.value.trim();
//    var idChecked = true;//idCheckbox.checked ? "withid" : "withoutid";
//    var classChecked = true;//classAttr.checked ? "withclass" : "withoutclass";
//    var nameChecked = false;//nameAttr.checked ? "withname" : "withoutname";
//    var placeholderChecked = false;//placeholderAttr.checked ? "withplaceholder" : "withoutplaceholder";
//    attributeChoices = [userAttr, idChecked, classChecked, nameChecked, placeholderChecked]
//}
//
//var createElement = function(elementName, classList) {
//  var element = document.createElement(elementName);
//  if (classList) {
//    element.setAttribute("class", classList)
//  }
//  return element
//}
//
//function generateColoredRelXpath() {
//  attributeChoicesOption();
//  var relXPath = chrome.devtools.inspectedWindow.eval('generateRelXpath($0, "' + attributeChoices + '")', {
//      useContentScriptContext: true
//  }, function(result) {
//    console.log(result)
//    var inputBox = document.querySelector(".jsSelector.rel");
//    if (result === undefined) {
//      result = "It might be a child of svg/pseudo/comment/iframe from different src. XPath doesn't support for them."
//    }
//    inputBox.setAttribute("selectors", result);
//    inputBox.setAttribute("relXpath", result);
//    //var preCommandValue = preCommandInput.value.trim();
//    var p1 = "";
//    var p2 = "";
//    //if (!addPrefix.className.includes('inactive') && result !== undefined && preCommandValue) {
//    //  if (preCommandValue.includes('xpathvalue')) {
//    //    p1 = preCommandValue.split("xpathvalue")[0];
//    //    p2 = preCommandValue.split("xpathvalue")[1]
//    //  } else {
//    //    p1 = preCommandValue.split(`"`)[0] + '"';
//    //    p2 = '"' + preCommandValue.split(`"`)[1].split(`"`)[1]
//    //  }
//    //}
//    inputBox.innerHTML = "";
//    var v0 = "//";
//    var p1Tag = createElement("span", "p1-label");
//    p1Tag.innerText = p1;
//    inputBox.appendChild(p1Tag);
//    var v0Tag = createElement("span", "v0-label");
//    v0Tag.innerText = v0;
//    inputBox.appendChild(v0Tag);
//    var slash = "";
//    var splitXpath = "";
//    if (result.slice(2).includes('//')) {
//      splitXpath = result.split('//')
//      slash = "//"
//    } else if (result.slice(2).includes('/')) {
//      splitXpath = result.slice(1).split('/');
//      slash = "/"
//    } else {
//      splitXpath = result.split('//')
//    }
//    if (!result.includes("[")) {
//      inputBox.removeChild(v0Tag);
//      var absTag = createElement("span", "abs-label");
//      absTag.innerText = result;
//      inputBox.appendChild(absTag)
//    } else {
//      for (var i = 1; i < splitXpath.length; i++) {
//        var v1 = "";
//        if (!splitXpath[i].includes("[")) {
//          if (i === 1) {
//            v1 = splitXpath[i]
//          } else {
//            v1 = slash + splitXpath[i]
//          }
//          var v1Tag = createElement("span", "v1-label");
//          v1Tag.innerText = v1;
//          inputBox.appendChild(v1Tag)
//        } else {
//          if (i === 1) {
//            v1 = splitXpath[i].split("[")[0] + "["
//          } else {
//            v1 = slash + splitXpath[i].split("[")[0] + "["
//          }
//          var v1Tag = createElement("span", "v1-label");
//          v1Tag.innerText = v1;
//          inputBox.appendChild(v1Tag);
//          if (!splitXpath[i].split("[")[1].includes("'")) {
//            var v8Tag = createElement("span", "v4-label");
//            var v8 = splitXpath[i].split("[")[1];
//            v8Tag.innerText = v8;
//            inputBox.appendChild(v8Tag)
//          } else {
//            var v2 = splitXpath[i].split("[")[1].split("'")[0] + "'";
//            var v3 = splitXpath[i].split("[")[1].split("'")[1];
//            var v4 = "'" + splitXpath[i].split("[")[1].split("'")[2];
//            var v2Tag = createElement("span", "v2-label");
//            v2Tag.innerText = v2.includes(undefined) ? "" : v2;
//            inputBox.appendChild(v2Tag);
//            var v3Tag = createElement("span", "v3-label");
//            v3Tag.innerText = v3.includes(undefined) ? "" : v3;
//            inputBox.appendChild(v3Tag);
//            var v4Tag = createElement("span", "v4-label");
//            v4Tag.innerText = v4.includes(undefined) ? "" : v4;
//            inputBox.appendChild(v4Tag);
//            if (splitXpath[i].split("[").length > 2) {
//              var v5 = "[" + splitXpath[i].split("[")[2].split("'")[0] + "'";
//              var v6 = splitXpath[i].split("[")[2].split("'")[1];
//              var v7 = "'" + splitXpath[i].split("[")[2].split("'")[2];
//              var v5Tag = createElement("span", "v2-label");
//              v5Tag.innerText = v5.includes(undefined) ? "" : v5;
//              inputBox.appendChild(v5Tag);
//              var v6Tag = createElement("span", "v3-label");
//              v6Tag.innerText = v6.includes(undefined) ? "" : v6;
//              inputBox.appendChild(v6Tag);
//              var v7Tag = createElement("span", "v4-label");
//              v7Tag.innerText = v7.includes(undefined) ? "" : v7;
//              inputBox.appendChild(v7Tag)
//            }
//          }
//        }
//      }
//    }
//    var p2Tag = createElement("span", "p2-label");
//    p2Tag.innerText = p2;
//    inputBox.appendChild(p2Tag)
//    //console.log(p2Tag)
//    //console.log(inputBox)
//  })
//}
//
//
