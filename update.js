"use strict";

var alarm_callback = {
    "CheckWAM": CheckWAM
};

var targetTab;
var lastResult;

chrome.alarms.onAlarm.addListener(onAlarm);
chrome.notifications.onButtonClicked.addListener(function onNotificationButtonClicked(notificationId, buttonIndex) {
    switch (notificationId) {
        case "WAM Changed":
            if (buttonIndex === 0) {
                activateTab(targetTab);
            }
            break;
    }
});

function activateTab(tab) {
    chrome.tabs.update(tab.id, { "active": true });
}

function onAlarm(alarm) {

    alarm_callback[alarm.name]();

}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        chrome.tabs.query({ "url": ["https://prod.ss.unimelb.edu.au/student/SM/ResultsDtls*"] }, function findTarget(tabs) {

            if (tabs.length === 0) {
                sendResponse(false);
                return;
            }

            tabs.some(function(tab, idx) {
                chrome.tabs.sendMessage(tab.id, "Find Result", undefined, function(response) {
                    if (targetTab === undefined) {
                        if (response !== null) {
                            setTargetTab(tab);
                            sendResponse(true);
                            return true;
                        } else if (idx === tabs.length - 1)
                            sendResponse(false);
                        return true;
                    }
                });
            });

        });

        return true;
    }
);

function setTargetTab(tab) {
    targetTab = tab;
    lastResult = undefined;

    if (tab !== undefined) {
        chrome.alarms.create('CheckWAM', { periodInMinutes: 1 });
        CheckWAM();
    } else
        stopMonitoring();
}

function CheckWAM() {
    if (targetTab === undefined || targetTab.status !== "complete")
        return;

    chrome.tabs.sendMessage(targetTab.id, "Find Result", undefined, function(response) {
        if (response === null) {
            setTargetTab(undefined);
            return;
        }

        if (lastResult === undefined) {
            setCurrentMark(response);
        } else if (lastResult !== response) {
            notifyUser();
            setCurrentMark(response);
        }

    });

    chrome.tabs.reload(targetTab.id);
}

function setCurrentMark(mark) {
    lastResult = mark;
}


function stopMonitoring() {
    chrome.alarms.clear('CheckWAM');
    chrome.notifications.create("Stop Monitoring", {
        "type": "basic",
        "iconUrl": "images/icon16.png",
        "title": "The WAM monitoring had been stopped",
        "message": "The tab is closed or doesn't show your WAM",
        "priority": 2,
        "eventTime": Date.now(),
        "isClickable": false,
        "requireInteraction": true
    });
}

function notifyUser() {
    chrome.notifications.create("WAM Changed", {
        "type": "basic",
        "iconUrl": "images/icon16.png",
        "title": "You WAM had been changed!",
        "message": "You WAM had been changed!",
        "priority": 2,
        "eventTime": Date.now(),
        "buttons": [{ "title": "Check it now!" }],
        "isClickable": true,
        "requireInteraction": true
    });

}
