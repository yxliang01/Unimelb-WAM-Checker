// Enable chromereload by uncommenting this line:
// import 'chromereload/devonly'

import $ from 'jquery';

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  const result = parseFloat($("#ctl00_Content_lblResultSummary").find("> div.UMWAMText > b").text());
  if ($.isNumeric(result)) sendResponse(result);
  else sendResponse(null);
  return true;
});
