"use strict";

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	var result = parseFloat($("#ctl00_Content_lblResultSummary > div.UMWAMText > b").text());
	if($.isNumeric(result))
		sendResponse(result);
	else
		sendResponse(null);

	return true;
});