(function () {
    'use strict';

    var MessageTypes;
    (function (MessageTypes) {
        MessageTypes[MessageTypes["execute"] = 0] = "execute";
        MessageTypes[MessageTypes["shortcutExecute"] = 1] = "shortcutExecute";
    })(MessageTypes || (MessageTypes = {}));

    var ansiRegex = () => {
    	const pattern = [
    		'[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[a-zA-Z\\d]*)*)?\\u0007)',
    		'(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))'
    	].join('|');

    	return new RegExp(pattern, 'g');
    };

    var stripAnsi = input => typeof input === 'string' ? input.replace(ansiRegex(), '') : input;

    /* eslint-disable yoda */
    var isFullwidthCodePoint = x => {
    	if (Number.isNaN(x)) {
    		return false;
    	}

    	// code points are derived from:
    	// http://www.unix.org/Public/UNIDATA/EastAsianWidth.txt
    	if (
    		x >= 0x1100 && (
    			x <= 0x115f ||  // Hangul Jamo
    			x === 0x2329 || // LEFT-POINTING ANGLE BRACKET
    			x === 0x232a || // RIGHT-POINTING ANGLE BRACKET
    			// CJK Radicals Supplement .. Enclosed CJK Letters and Months
    			(0x2e80 <= x && x <= 0x3247 && x !== 0x303f) ||
    			// Enclosed CJK Letters and Months .. CJK Unified Ideographs Extension A
    			(0x3250 <= x && x <= 0x4dbf) ||
    			// CJK Unified Ideographs .. Yi Radicals
    			(0x4e00 <= x && x <= 0xa4c6) ||
    			// Hangul Jamo Extended-A
    			(0xa960 <= x && x <= 0xa97c) ||
    			// Hangul Syllables
    			(0xac00 <= x && x <= 0xd7a3) ||
    			// CJK Compatibility Ideographs
    			(0xf900 <= x && x <= 0xfaff) ||
    			// Vertical Forms
    			(0xfe10 <= x && x <= 0xfe19) ||
    			// CJK Compatibility Forms .. Small Form Variants
    			(0xfe30 <= x && x <= 0xfe6b) ||
    			// Halfwidth and Fullwidth Forms
    			(0xff01 <= x && x <= 0xff60) ||
    			(0xffe0 <= x && x <= 0xffe6) ||
    			// Kana Supplement
    			(0x1b000 <= x && x <= 0x1b001) ||
    			// Enclosed Ideographic Supplement
    			(0x1f200 <= x && x <= 0x1f251) ||
    			// CJK Unified Ideographs Extension B .. Tertiary Ideographic Plane
    			(0x20000 <= x && x <= 0x3fffd)
    		)
    	) {
    		return true;
    	}

    	return false;
    };

    var stringWidth = str => {
    	if (typeof str !== 'string' || str.length === 0) {
    		return 0;
    	}

    	str = stripAnsi(str);

    	let width = 0;

    	for (let i = 0; i < str.length; i++) {
    		const code = str.codePointAt(i);

    		// Ignore control characters
    		if (code <= 0x1F || (code >= 0x7F && code <= 0x9F)) {
    			continue;
    		}

    		// Ignore combining characters
    		if (code >= 0x300 && code <= 0x36F) {
    			continue;
    		}

    		// Surrogates
    		if (code > 0xFFFF) {
    			i++;
    		}

    		width += isFullwidthCodePoint(code) ? 2 : 1;
    	}

    	return width;
    };

    var say = function (text, wrap) {
    	var delimiters = {
    		first : ["/", "\\"],
    		middle : ["|", "|"],
    		last : ["\\", "/"],
    		only : ["<", ">"]
    	};

    	return format(text, wrap, delimiters);
    };

    var think = function (text, wrap) {
    	var delimiters = {
    		first : ["(", ")"],
    		middle : ["(", ")"],
    		last : ["(", ")"],
    		only : ["(", ")"]
    	};

    	return format(text, wrap, delimiters);
    };

    function format (text, wrap, delimiters) {
    	var lines = split(text, wrap);
    	var maxLength = max(lines);

    	var balloon;
    	if (lines.length === 1) {
    		balloon = [
    			" " + top(maxLength),
    			delimiters.only[0] + " " + lines[0] + " " + delimiters.only[1],
    			" " + bottom(maxLength)
    		];
    	} else {
    		balloon = [" " + top(maxLength)];

    		for (var i = 0, len = lines.length; i < len; i += 1) {
    			var delimiter;

    			if (i === 0) {
    				delimiter = delimiters.first;
    			} else if (i === len - 1) {
    				delimiter = delimiters.last;
    			} else {
    				delimiter = delimiters.middle;
    			}

    			balloon.push(delimiter[0] + " " + pad(lines[i], maxLength) + " " + delimiter[1]);
    		}

    		balloon.push(" " + bottom(maxLength));
    	}

    	return balloon.join("\n");
    }

    function split (text, wrap) {
    	text = text.replace(/\r\n?|[\n\u2028\u2029]/g, "\n").replace(/^\uFEFF/, '').replace(/\t/g, '        ');

    	var lines = [];
    	if (!wrap) {
    		lines = text.split("\n");
    	} else {
    		var start = 0;
    		while (start < text.length) {
    			var nextNewLine = text.indexOf("\n", start);

    			var wrapAt = Math.min(start + wrap, nextNewLine === -1 ? text.length : nextNewLine);

    			lines.push(text.substring(start, wrapAt));
    			start = wrapAt;

    			// Ignore next new line
    			if (text.charAt(start) === "\n") {
    				start += 1;
    			}
    		}
    	}

    	return lines;
    }

    function max (lines) {
    	var max = 0;
    	for (var i = 0, len = lines.length; i < len; i += 1) {
    		if (stringWidth(lines[i]) > max) {
    			max = stringWidth(lines[i]);
    		}
    	}

    	return max;
    }

    function pad (text, length) {
    	return text + (new Array(length - stringWidth(text) + 1)).join(" ");
    }

    function top (length) {
    	return new Array(length + 3).join("_");
    }

    function bottom (length) {
    	return new Array(length + 3).join("-");
    }

    var balloon = {
    	say: say,
    	think: think
    };

    var replacer = function (cow, variables) {
    	var eyes = escapeRe(variables.eyes);
    	var eyeL = eyes.charAt(0);
    	var eyeR = eyes.charAt(1);
    	var tongue = escapeRe(variables.tongue);

    	if (cow.indexOf("$the_cow") !== -1) {
    		cow = extractTheCow(cow);
    	}

    	return cow
    		.replace(/\$thoughts/g, variables.thoughts)
    		.replace(/\$eyes/g, eyes)
    		.replace(/\$tongue/g, tongue)
    		.replace(/\$\{eyes\}/g, eyes)
    		.replace(/\$eye/, eyeL)
    		.replace(/\$eye/, eyeR)
    		.replace(/\$\{tongue\}/g, tongue)
    	;
    };

    /*
     * "$" dollar signs must be doubled before being used in a regex replace
     * This can occur in eyes or tongue.
     * For example:
     *
     * cowsay -g Moo!
     *
     * cowsay -e "\$\$" Moo!
     */
    function escapeRe (s) {
    	if (s && s.replace) {
    		return s.replace(/\$/g, "$$$$");
    	}
    	return s;
    }

    function extractTheCow (cow) {
    	cow = cow.replace(/\r\n?|[\n\u2028\u2029]/g, "\n").replace(/^\uFEFF/, '');
    	var match = /\$the_cow\s*=\s*<<"*EOC"*;*\n([\s\S]+)\nEOC\n/.exec(cow);

    	if (!match) {
    		console.error("Cannot parse cow file\n", cow);
    		return cow;
    	} else {
    		return match[1].replace(/\\{2}/g, "\\").replace(/\\@/g, "@").replace(/\\\$/g, "$");
    	}
    }

    var modes = {
    	"b" : {
    		eyes : "==",
    		tongue : "  "
    	},
    	"d" : {
    		eyes : "xx",
    		tongue : "U "
    	},
    	"g" : {
    		eyes : "$$",
    		tongue : "  "
    	},
    	"p" : {
    		eyes : "@@",
    		tongue : "  "
    	},
    	"s" : {
    		eyes : "**",
    		tongue : "U "
    	},
    	"t" : {
    		eyes : "--",
    		tongue : "  "
    	},
    	"w" : {
    		eyes : "OO",
    		tongue : "  "
    	},
    	"y" : {
    		eyes : "..",
    		tongue : "  "
    	}
    };

    var faces = function (options) {
    	for (var mode in modes) {
    		if (options[mode] === true) {
    			return modes[mode];
    		}
    	}

    	return {
    		eyes : options.e || "oo",
    		tongue : options.T || "  "
    	};
    };

    var DEFAULT_COW = "$the_cow = <<\"EOC\";\n        $thoughts   ^__^\n         $thoughts  ($eyes)\\\\_______\n            (__)\\\\       )\\\\/\\\\\n             $tongue ||----w |\n                ||     ||\nEOC\n";

    function convertToCliOptions(browserOptions) {
      const cliOptions = {
        e: browserOptions.eyes || 'oo',
        T: browserOptions.tongue || '  ',
        n: browserOptions.wrap,
        W: browserOptions.wrapLength || 40,
        text: browserOptions.text || '',
        _: browserOptions.text || [],
        f: browserOptions.cow,
      };
      if (browserOptions.mode) {
        // converts mode: 'b' to b: true
        cliOptions[browserOptions.mode] = true;
      }
      return cliOptions;
    }

    function doIt (options, sayAloud) {
      const cow = options.f || DEFAULT_COW;
    	const face = faces(options);
    	face.thoughts = sayAloud ? "\\" : "o";

    	const action = sayAloud ? "say" : "think";
    	return balloon[action](options.text || options._.join(" "), options.n ? null : options.W) + "\n" + replacer(cow, face);
    }

    function say$1(browserOptions) {
      return doIt(convertToCliOptions(browserOptions), true);
    }

    const messagesFromReactAppListener = (message, sender, sendResponse) => {
        switch (message.type) {
            case MessageTypes.execute:
                const { text } = message;
                const newText = say$1({
                    text: text,
                    e: "oO",
                    T: "U ",
                });
                const images = document.querySelectorAll("img");
                [...images].forEach((node) => {
                    const p = document.createElement("p");
                    p.innerHTML = newText;
                    p.style.whiteSpace = "pre";
                    node.replaceWith(p);
                });
                chrome.storage.sync.set({ mooText: text });
                break;
            case MessageTypes.shortcutExecute:
                chrome.storage.sync.get("mooText").then((obj) => {
                    const text = Object.values(obj)[0];
                    const newText = say$1({
                        text: text,
                        e: "oO",
                        T: "U ",
                    });
                    const images = document.querySelectorAll("img");
                    [...images].forEach((node) => {
                        const p = document.createElement("p");
                        p.innerHTML = newText;
                        p.style.whiteSpace = "pre";
                        node.replaceWith(p);
                    });
                });
                break;
        }
    };
    const main = () => {
        console.log("[content.ts] Running");
        chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
    };
    main();

})();
