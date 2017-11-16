// Enable chromereload by uncommenting this line:
// import 'chromereload/devonly'

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  const result = parseFloat($("#ctl00_Content_lblResultSummary > div.UMWAMText > b").text());
  if ($.isNumeric(result)) sendResponse(result);
  else sendResponse(null);

  return true;
});
