chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		// Universal ContentScript communication handler
		if(request.contentScriptCall) {
			var contentScript = getContentScript("ContentScript");

			var deferredResponse = contentScript[request.fn](request.request);
			deferredResponse.done(function(response) {
        //console.log(response);//response = css selector
				sendResponse(response);
			});

			return true;
		}
	}
);

