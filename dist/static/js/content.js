(function () {
    'use strict';

    var MessageTypes;
    (function (MessageTypes) {
        MessageTypes[MessageTypes["execute"] = 0] = "execute";
        MessageTypes[MessageTypes["shortcutExecute"] = 1] = "shortcutExecute";
    })(MessageTypes || (MessageTypes = {}));

    var messagesFromReactAppListener = function (message, sender, sendResponse) {
        switch (message.type) {
            case MessageTypes.execute:
                console.log("Executed");
                break;
        }
    };
    var main = function () {
        console.log("[content.ts] Running");
        chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
    };
    main();

})();
