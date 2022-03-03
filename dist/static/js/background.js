(function () {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    var sendMessage = function (messageType, payload, callback) {
        if (!payload)
            payload = {};
        chrome.windows.getCurrent(function (w) {
            chrome.tabs &&
                chrome.tabs.query({ active: true, windowId: w.id }, function (tabs) {
                    if (tabs.length === 0) {
                        return;
                    }
                    chrome.tabs.sendMessage(tabs[0].id, __assign({ type: messageType }, payload), callback);
                });
        });
    };

    var MessageTypes;
    (function (MessageTypes) {
        MessageTypes[MessageTypes["execute"] = 0] = "execute";
        MessageTypes[MessageTypes["shortcutExecute"] = 1] = "shortcutExecute";
    })(MessageTypes || (MessageTypes = {}));

    try {
        chrome.commands.onCommand.addListener(function (command) {
            if (command === "execute") {
                sendMessage(MessageTypes.shortcutExecute);
            }
        });
        // this is to check if there are any conflicts in your
        // keyboard shorcut. If there are conflicts they won't be set
        //A simple solution in this case will be to select another shortcut
        var checkCommandShortcuts_1 = function () {
            chrome.commands.getAll(function (commands) {
                var missingShortcuts = [];
                for (var _i = 0, commands_1 = commands; _i < commands_1.length; _i++) {
                    var _a = commands_1[_i], name_1 = _a.name, shortcut = _a.shortcut;
                    if (shortcut === "") {
                        missingShortcuts.push(name_1);
                    }
                }
                if (missingShortcuts.length > 0) {
                    console.log("Shortcuts not set", missingShortcuts);
                }
            });
        };
        chrome.runtime.onInstalled.addListener(function (reason) {
            console.log(reason, chrome.runtime.OnInstalledReason.INSTALL);
            if (reason.reason === chrome.runtime.OnInstalledReason.UPDATE) {
                checkCommandShortcuts_1();
            }
        });
    }
    catch (e) {
        console.error(e);
    }

})();
