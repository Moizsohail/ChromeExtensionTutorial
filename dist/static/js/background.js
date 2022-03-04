(function () {
    'use strict';

    const sendMessage = (messageType, payload, callback) => {
        if (!payload)
            payload = {};
        chrome.windows.getCurrent((w) => {
            chrome.tabs &&
                chrome.tabs.query({ active: true, windowId: w.id }, (tabs) => {
                    if (tabs.length === 0) {
                        return;
                    }
                    chrome.tabs.sendMessage(tabs[0].id, Object.assign({ type: messageType }, payload), callback);
                });
        });
    };

    var MessageTypes;
    (function (MessageTypes) {
        MessageTypes[MessageTypes["execute"] = 0] = "execute";
        MessageTypes[MessageTypes["shortcutExecute"] = 1] = "shortcutExecute";
    })(MessageTypes || (MessageTypes = {}));

    try {
        chrome.commands.onCommand.addListener((command) => {
            if (command === "execute") {
                sendMessage(MessageTypes.shortcutExecute);
            }
        });
        // this is to check if there are any conflicts in your
        // keyboard shorcut. If there are conflicts they won't be set
        //A simple solution in this case will be to select another shortcut
        const checkCommandShortcuts = () => {
            chrome.commands.getAll((commands) => {
                let missingShortcuts = [];
                for (let { name, shortcut } of commands) {
                    if (shortcut === "") {
                        missingShortcuts.push(name);
                    }
                }
                if (missingShortcuts.length > 0) {
                    console.log("Shortcuts not set", missingShortcuts);
                }
            });
        };
        chrome.runtime.onInstalled.addListener((reason) => {
            console.log(reason, chrome.runtime.OnInstalledReason.INSTALL);
            if (reason.reason === chrome.runtime.OnInstalledReason.UPDATE) {
                checkCommandShortcuts();
            }
        });
    }
    catch (e) {
        console.error(e);
    }

})();
