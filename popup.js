"use strict";

$(document).ready(function onLoaded() {

	chrome.alarms.get('CheckWAM', function (alarm) {
		if(alarm !== undefined)
			$("#Monitoring").dimmer("show");
	});

    $("#StartChecking").click(function startChecking_click() {
        chrome.runtime.sendMessage("", {}, function(response) {
            if (response === true) {
                $("#dimmer_successful").dimmer("show");
            } else if(response === false) {
                $("#dimmer_fail").dimmer("show");
            } else if(chrome.runtime.lastError !== undefined)
            	console.log(chrome.runtime.lastError.message);

        });
    });
});
