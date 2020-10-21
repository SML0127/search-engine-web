/**
 * ContentScript that can be called from anywhere within the extension
 */
var ContentScript = {

	/**
	 * Fetch
	 * @param request.CSSSelector	css selector as string
	 * @returns $.Deferred()
	 */
	getHTML: function(request) {

		var deferredHTML = $.Deferred();
		var html = $(request.CSSSelector).clone().wrap('<p>').parent().html();
		deferredHTML.resolve(html);
		return deferredHTML.promise();
	},

	/**
	 * Removes current content selector if is in use within the page
	 * @returns $.Deferred()
	 */
	removeCurrentContentSelector: function() {

		var deferredResponse = $.Deferred();
		var contentSelector = window.cs;
		if(contentSelector === undefined) {
			deferredResponse.resolve();
		}
		else {
			contentSelector.removeGUI();
			window.cs = undefined;
			deferredResponse.resolve();
		}

		return deferredResponse.promise();
	},

	/**
	 * Select elements within the page
	 * @param request.parentCSSSelector
	 * @param request.allowedElements
	 */
  // smlee, 3. called by clicking web page element
	selectSelector: function(request) {
		var deferredResponse = $.Deferred();

    // smlee, 4. remove current content selector (we didn't need)
		//this.removeCurrentContentSelector().done(function() {

      // smlee, 5. create new conetent selector
			var contentSelector = new ContentSelector({
				//parentCSSSelector: request.parentCSSSelector,
				allowedElements: "*"//request.allowedElements
			});
			window.cs = contentSelector;

			var deferredCSSSelector = contentSelector.getCSSSelector();
			deferredCSSSelector.done(function(response) {
				this.removeCurrentContentSelector().done(function(){
					deferredResponse.resolve(response);
          //{CSSSelector: "//div[@class='cat_infoCnt-3P_7F cat_text-26vYN cat_infoSliderMini-2Qf83']//header//span"}
          console.log(response)
					window.cs = undefined;
				}.bind(this));
			}.bind(this)).fail(function(message) {
				deferredResponse.reject(message);
				window.cs = undefined;
			}.bind(this));

		//}.bind(this));

		return deferredResponse.promise();
	},

	/**
	 * Preview elements
	 * @param request.parentCSSSelector
	 * @param request.elementCSSSelector
	 */
	previewSelector: function(request) {

		var deferredResponse = $.Deferred();
		this.removeCurrentContentSelector().done(function () {

			var contentSelector = new ContentSelector({
				parentCSSSelector: request.parentCSSSelector
			});
			window.cs = contentSelector;

			var deferredSelectorPreview = contentSelector.previewSelector(request.elementCSSSelector);
			deferredSelectorPreview.done(function() {
				deferredResponse.resolve();
			}).fail(function(message) {
				deferredResponse.reject(message);
				window.cs = undefined;
			});
		});
		return deferredResponse;
	}
};

/**
 *
 * @param location	configure from where the content script is being accessed (ContentScript, BackgroundPage, DevTools)
 * @param backgroundScript	BackgroundScript client
 * @returns ContentScript
 */
var getContentScript = function(location) {

	var contentScript;
  console.log(location)

	// Handle calls from different places
	if(location === "ContentScript") {
		contentScript = ContentScript;
		contentScript.backgroundScript = getBackgroundScript("ContentScript");
		return contentScript;
	}
	else if(location === "BackgroundScript" || location === "DevTools") {
		var backgroundScript = getBackgroundScript(location);

		// if called within background script proxy calls to content script
		contentScript = {};
			Object.keys(ContentScript).forEach(function(attr) {
			if(typeof ContentScript[attr] === 'function') {
				contentScript[attr] = function(request) {

					var reqToContentScript = {
						contentScriptCall: true,
						fn: attr,
						request: request
					};

					return backgroundScript.executeContentScript(reqToContentScript);
				};
			}
			else {
				contentScript[attr] = ContentScript[attr];
			}
		});
		contentScript.backgroundScript = backgroundScript;
		return contentScript;
	}
	else {
		throw "Invalid ContentScript initialization - " + location;
	}
};
