// Enable chromereload by uncommenting this line:
// import 'chromereload/devonly'

import 'debug';
import $ from "jquery";

// noinspection ES6UnusedImports
import '../lib/semantic/dist/semantic.css';
import '../lib/semantic/dist/components/dimmer.css';
import '../lib/semantic/dist/components/button.css';
import '../lib/semantic/dist/components/transition.css';

import 'imports-loader?jQuery=jquery!../lib/semantic/dist/semantic';
import 'imports-loader?jQuery=jquery!../lib/semantic/dist/components/dimmer.js';
import 'imports-loader?jQuery=jquery!../lib/semantic/dist/components/transition';



$(document).ready(function onLoaded() {

  chrome.alarms.get('CheckWAM', function(alarm) {
    if (alarm !== undefined) $("#Monitoring").dimmer("show");
  });

  $("#StartChecking").click(function startChecking_click() {
    chrome.runtime.sendMessage("", {}, function(response) {
      if (response === true) {
        $("#dimmer_successful").dimmer("show");
        $('body').height(400);
        $('body').width(300);
      } else if (response === false) {
        $("#dimmer_fail").dimmer("show");
        $('body').height(400);
        $('body').width(300);
      } else if (chrome.runtime.lastError !== undefined) console.log(chrome.runtime.lastError.message);

    });
  });
});
