(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["higlass-pileup"] = factory();
	else
		root["higlass-pileup"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 227:
/***/ ((module, exports, __webpack_require__) => {

/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */

exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
exports.destroy = (() => {
	let warned = false;

	return () => {
		if (!warned) {
			warned = true;
			console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
		}
	};
})();

/**
 * Colors.
 */

exports.colors = [
	'#0000CC',
	'#0000FF',
	'#0033CC',
	'#0033FF',
	'#0066CC',
	'#0066FF',
	'#0099CC',
	'#0099FF',
	'#00CC00',
	'#00CC33',
	'#00CC66',
	'#00CC99',
	'#00CCCC',
	'#00CCFF',
	'#3300CC',
	'#3300FF',
	'#3333CC',
	'#3333FF',
	'#3366CC',
	'#3366FF',
	'#3399CC',
	'#3399FF',
	'#33CC00',
	'#33CC33',
	'#33CC66',
	'#33CC99',
	'#33CCCC',
	'#33CCFF',
	'#6600CC',
	'#6600FF',
	'#6633CC',
	'#6633FF',
	'#66CC00',
	'#66CC33',
	'#9900CC',
	'#9900FF',
	'#9933CC',
	'#9933FF',
	'#99CC00',
	'#99CC33',
	'#CC0000',
	'#CC0033',
	'#CC0066',
	'#CC0099',
	'#CC00CC',
	'#CC00FF',
	'#CC3300',
	'#CC3333',
	'#CC3366',
	'#CC3399',
	'#CC33CC',
	'#CC33FF',
	'#CC6600',
	'#CC6633',
	'#CC9900',
	'#CC9933',
	'#CCCC00',
	'#CCCC33',
	'#FF0000',
	'#FF0033',
	'#FF0066',
	'#FF0099',
	'#FF00CC',
	'#FF00FF',
	'#FF3300',
	'#FF3333',
	'#FF3366',
	'#FF3399',
	'#FF33CC',
	'#FF33FF',
	'#FF6600',
	'#FF6633',
	'#FF9900',
	'#FF9933',
	'#FFCC00',
	'#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

// eslint-disable-next-line complexity
function useColors() {
	// NB: In an Electron preload script, document will be defined but not fully
	// initialized. Since we know we're in Chrome, we'll just detect this case
	// explicitly
	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
		return true;
	}

	// Internet Explorer and Edge do not support colors.
	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
		return false;
	}

	// Is webkit? http://stackoverflow.com/a/16459606/376773
	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
		// Is firebug? http://stackoverflow.com/a/398120/376773
		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
		// Is firefox >= v31?
		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
		// Double check webkit in userAgent just in case we are in a worker
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	args[0] = (this.useColors ? '%c' : '') +
		this.namespace +
		(this.useColors ? ' %c' : ' ') +
		args[0] +
		(this.useColors ? '%c ' : ' ') +
		'+' + module.exports.humanize(this.diff);

	if (!this.useColors) {
		return;
	}

	const c = 'color: ' + this.color;
	args.splice(1, 0, c, 'color: inherit');

	// The final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	let index = 0;
	let lastC = 0;
	args[0].replace(/%[a-zA-Z%]/g, match => {
		if (match === '%%') {
			return;
		}
		index++;
		if (match === '%c') {
			// We only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
}

/**
 * Invokes `console.debug()` when available.
 * No-op when `console.debug` is not a "function".
 * If `console.debug` is not available, falls back
 * to `console.log`.
 *
 * @api public
 */
exports.log = console.debug || console.log || (() => {});

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	try {
		if (namespaces) {
			exports.storage.setItem('debug', namespaces);
		} else {
			exports.storage.removeItem('debug');
		}
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
	let r;
	try {
		r = exports.storage.getItem('debug');
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}

	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	if (!r && typeof process !== 'undefined' && 'env' in process) {
		r = process.env.DEBUG;
	}

	return r;
}

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
	try {
		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
		// The Browser also has localStorage in the global context.
		return localStorage;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

module.exports = __webpack_require__(447)(exports);

const {formatters} = module.exports;

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
	try {
		return JSON.stringify(v);
	} catch (error) {
		return '[UnexpectedJSONParseError]: ' + error.message;
	}
};


/***/ }),

/***/ 447:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = __webpack_require__(824);
	createDebug.destroy = destroy;

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;
		let enableOverride = null;
		let namespacesCache;
		let enabledCache;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return '%';
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.useColors = createDebug.useColors();
		debug.color = createDebug.selectColor(namespace);
		debug.extend = extend;
		debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

		Object.defineProperty(debug, 'enabled', {
			enumerable: true,
			configurable: false,
			get: () => {
				if (enableOverride !== null) {
					return enableOverride;
				}
				if (namespacesCache !== createDebug.namespaces) {
					namespacesCache = createDebug.namespaces;
					enabledCache = createDebug.enabled(namespace);
				}

				return enabledCache;
			},
			set: v => {
				enableOverride = v;
			}
		});

		// Env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		return debug;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);
		createDebug.namespaces = namespaces;

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.slice(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	/**
	* XXX DO NOT USE. This is a temporary stub function.
	* XXX It WILL be removed in the next major release.
	*/
	function destroy() {
		console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

module.exports = setup;


/***/ }),

/***/ 898:
/***/ ((module) => {

"use strict";


module.exports = value => {
	if (!value) {
		return false;
	}

	// eslint-disable-next-line no-use-extend-native/no-use-extend-native
	if (typeof Symbol.observable === 'symbol' && typeof value[Symbol.observable] === 'function') {
		// eslint-disable-next-line no-use-extend-native/no-use-extend-native
		return value === value[Symbol.observable]();
	}

	if (typeof value['@@observable'] === 'function') {
		return value === value['@@observable']();
	}

	return false;
};


/***/ }),

/***/ 824:
/***/ ((module) => {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}


/***/ }),

/***/ 49:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Observable: () => (/* reexport */ dist_esm_observable),
  Subject: () => (/* reexport */ dist_esm_subject),
  filter: () => (/* reexport */ dist_esm_filter),
  flatMap: () => (/* reexport */ dist_esm_flatMap),
  interval: () => (/* reexport */ interval),
  map: () => (/* reexport */ dist_esm_map),
  merge: () => (/* reexport */ dist_esm_merge),
  multicast: () => (/* reexport */ dist_esm_multicast),
  scan: () => (/* reexport */ dist_esm_scan),
  unsubscribe: () => (/* reexport */ dist_esm_unsubscribe)
});

;// CONCATENATED MODULE: ./node_modules/observable-fns/dist.esm/_scheduler.js
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class AsyncSerialScheduler {
    constructor(observer) {
        this._baseObserver = observer;
        this._pendingPromises = new Set();
    }
    complete() {
        Promise.all(this._pendingPromises)
            .then(() => this._baseObserver.complete())
            .catch(error => this._baseObserver.error(error));
    }
    error(error) {
        this._baseObserver.error(error);
    }
    schedule(task) {
        const prevPromisesCompletion = Promise.all(this._pendingPromises);
        const values = [];
        const next = (value) => values.push(value);
        const promise = Promise.resolve()
            .then(() => __awaiter(this, void 0, void 0, function* () {
            yield prevPromisesCompletion;
            yield task(next);
            this._pendingPromises.delete(promise);
            for (const value of values) {
                this._baseObserver.next(value);
            }
        }))
            .catch(error => {
            this._pendingPromises.delete(promise);
            this._baseObserver.error(error);
        });
        this._pendingPromises.add(promise);
    }
}

;// CONCATENATED MODULE: ./node_modules/observable-fns/dist.esm/_symbols.js
const hasSymbols = () => typeof Symbol === "function";
const hasSymbol = (name) => hasSymbols() && Boolean(Symbol[name]);
const getSymbol = (name) => hasSymbol(name) ? Symbol[name] : "@@" + name;
function registerObservableSymbol() {
    if (hasSymbols() && !hasSymbol("observable")) {
        Symbol.observable = Symbol("observable");
    }
}
if (!hasSymbol("asyncIterator")) {
    Symbol.asyncIterator = Symbol.asyncIterator || Symbol.for("Symbol.asyncIterator");
}

;// CONCATENATED MODULE: ./node_modules/observable-fns/dist.esm/observable.js
/**
 * Based on <https://raw.githubusercontent.com/zenparsing/zen-observable/master/src/Observable.js>
 * At commit: f63849a8c60af5d514efc8e9d6138d8273c49ad6
 */


const SymbolIterator = getSymbol("iterator");
const SymbolObservable = getSymbol("observable");
const SymbolSpecies = getSymbol("species");
// === Abstract Operations ===
function getMethod(obj, key) {
    const value = obj[key];
    if (value == null) {
        return undefined;
    }
    if (typeof value !== "function") {
        throw new TypeError(value + " is not a function");
    }
    return value;
}
function getSpecies(obj) {
    let ctor = obj.constructor;
    if (ctor !== undefined) {
        ctor = ctor[SymbolSpecies];
        if (ctor === null) {
            ctor = undefined;
        }
    }
    return ctor !== undefined ? ctor : Observable;
}
function isObservable(x) {
    return x instanceof Observable; // SPEC: Brand check
}
function hostReportError(error) {
    if (hostReportError.log) {
        hostReportError.log(error);
    }
    else {
        setTimeout(() => { throw error; }, 0);
    }
}
function enqueue(fn) {
    Promise.resolve().then(() => {
        try {
            fn();
        }
        catch (e) {
            hostReportError(e);
        }
    });
}
function cleanupSubscription(subscription) {
    const cleanup = subscription._cleanup;
    if (cleanup === undefined) {
        return;
    }
    subscription._cleanup = undefined;
    if (!cleanup) {
        return;
    }
    try {
        if (typeof cleanup === "function") {
            cleanup();
        }
        else {
            const unsubscribe = getMethod(cleanup, "unsubscribe");
            if (unsubscribe) {
                unsubscribe.call(cleanup);
            }
        }
    }
    catch (e) {
        hostReportError(e);
    }
}
function closeSubscription(subscription) {
    subscription._observer = undefined;
    subscription._queue = undefined;
    subscription._state = "closed";
}
function flushSubscription(subscription) {
    const queue = subscription._queue;
    if (!queue) {
        return;
    }
    subscription._queue = undefined;
    subscription._state = "ready";
    for (const item of queue) {
        notifySubscription(subscription, item.type, item.value);
        if (subscription._state === "closed") {
            break;
        }
    }
}
function notifySubscription(subscription, type, value) {
    subscription._state = "running";
    const observer = subscription._observer;
    try {
        const m = observer ? getMethod(observer, type) : undefined;
        switch (type) {
            case "next":
                if (m)
                    m.call(observer, value);
                break;
            case "error":
                closeSubscription(subscription);
                if (m)
                    m.call(observer, value);
                else
                    throw value;
                break;
            case "complete":
                closeSubscription(subscription);
                if (m)
                    m.call(observer);
                break;
        }
    }
    catch (e) {
        hostReportError(e);
    }
    if (subscription._state === "closed") {
        cleanupSubscription(subscription);
    }
    else if (subscription._state === "running") {
        subscription._state = "ready";
    }
}
function onNotify(subscription, type, value) {
    if (subscription._state === "closed") {
        return;
    }
    if (subscription._state === "buffering") {
        subscription._queue = subscription._queue || [];
        subscription._queue.push({ type, value });
        return;
    }
    if (subscription._state !== "ready") {
        subscription._state = "buffering";
        subscription._queue = [{ type, value }];
        enqueue(() => flushSubscription(subscription));
        return;
    }
    notifySubscription(subscription, type, value);
}
class Subscription {
    constructor(observer, subscriber) {
        // ASSERT: observer is an object
        // ASSERT: subscriber is callable
        this._cleanup = undefined;
        this._observer = observer;
        this._queue = undefined;
        this._state = "initializing";
        const subscriptionObserver = new SubscriptionObserver(this);
        try {
            this._cleanup = subscriber.call(undefined, subscriptionObserver);
        }
        catch (e) {
            subscriptionObserver.error(e);
        }
        if (this._state === "initializing") {
            this._state = "ready";
        }
    }
    get closed() {
        return this._state === "closed";
    }
    unsubscribe() {
        if (this._state !== "closed") {
            closeSubscription(this);
            cleanupSubscription(this);
        }
    }
}
class SubscriptionObserver {
    constructor(subscription) { this._subscription = subscription; }
    get closed() { return this._subscription._state === "closed"; }
    next(value) { onNotify(this._subscription, "next", value); }
    error(value) { onNotify(this._subscription, "error", value); }
    complete() { onNotify(this._subscription, "complete"); }
}
/**
 * The basic Observable class. This primitive is used to wrap asynchronous
 * data streams in a common standardized data type that is interoperable
 * between libraries and can be composed to represent more complex processes.
 */
class Observable {
    constructor(subscriber) {
        if (!(this instanceof Observable)) {
            throw new TypeError("Observable cannot be called as a function");
        }
        if (typeof subscriber !== "function") {
            throw new TypeError("Observable initializer must be a function");
        }
        this._subscriber = subscriber;
    }
    subscribe(nextOrObserver, onError, onComplete) {
        if (typeof nextOrObserver !== "object" || nextOrObserver === null) {
            nextOrObserver = {
                next: nextOrObserver,
                error: onError,
                complete: onComplete
            };
        }
        return new Subscription(nextOrObserver, this._subscriber);
    }
    pipe(first, ...mappers) {
        // tslint:disable-next-line no-this-assignment
        let intermediate = this;
        for (const mapper of [first, ...mappers]) {
            intermediate = mapper(intermediate);
        }
        return intermediate;
    }
    tap(nextOrObserver, onError, onComplete) {
        const tapObserver = typeof nextOrObserver !== "object" || nextOrObserver === null
            ? {
                next: nextOrObserver,
                error: onError,
                complete: onComplete
            }
            : nextOrObserver;
        return new Observable(observer => {
            return this.subscribe({
                next(value) {
                    tapObserver.next && tapObserver.next(value);
                    observer.next(value);
                },
                error(error) {
                    tapObserver.error && tapObserver.error(error);
                    observer.error(error);
                },
                complete() {
                    tapObserver.complete && tapObserver.complete();
                    observer.complete();
                },
                start(subscription) {
                    tapObserver.start && tapObserver.start(subscription);
                }
            });
        });
    }
    forEach(fn) {
        return new Promise((resolve, reject) => {
            if (typeof fn !== "function") {
                reject(new TypeError(fn + " is not a function"));
                return;
            }
            function done() {
                subscription.unsubscribe();
                resolve(undefined);
            }
            const subscription = this.subscribe({
                next(value) {
                    try {
                        fn(value, done);
                    }
                    catch (e) {
                        reject(e);
                        subscription.unsubscribe();
                    }
                },
                error(error) {
                    reject(error);
                },
                complete() {
                    resolve(undefined);
                }
            });
        });
    }
    map(fn) {
        if (typeof fn !== "function") {
            throw new TypeError(fn + " is not a function");
        }
        const C = getSpecies(this);
        return new C(observer => this.subscribe({
            next(value) {
                let propagatedValue = value;
                try {
                    propagatedValue = fn(value);
                }
                catch (e) {
                    return observer.error(e);
                }
                observer.next(propagatedValue);
            },
            error(e) { observer.error(e); },
            complete() { observer.complete(); },
        }));
    }
    filter(fn) {
        if (typeof fn !== "function") {
            throw new TypeError(fn + " is not a function");
        }
        const C = getSpecies(this);
        return new C(observer => this.subscribe({
            next(value) {
                try {
                    if (!fn(value))
                        return;
                }
                catch (e) {
                    return observer.error(e);
                }
                observer.next(value);
            },
            error(e) { observer.error(e); },
            complete() { observer.complete(); },
        }));
    }
    reduce(fn, seed) {
        if (typeof fn !== "function") {
            throw new TypeError(fn + " is not a function");
        }
        const C = getSpecies(this);
        const hasSeed = arguments.length > 1;
        let hasValue = false;
        let acc = seed;
        return new C(observer => this.subscribe({
            next(value) {
                const first = !hasValue;
                hasValue = true;
                if (!first || hasSeed) {
                    try {
                        acc = fn(acc, value);
                    }
                    catch (e) {
                        return observer.error(e);
                    }
                }
                else {
                    acc = value;
                }
            },
            error(e) { observer.error(e); },
            complete() {
                if (!hasValue && !hasSeed) {
                    return observer.error(new TypeError("Cannot reduce an empty sequence"));
                }
                observer.next(acc);
                observer.complete();
            },
        }));
    }
    concat(...sources) {
        const C = getSpecies(this);
        return new C(observer => {
            let subscription;
            let index = 0;
            function startNext(next) {
                subscription = next.subscribe({
                    next(v) { observer.next(v); },
                    error(e) { observer.error(e); },
                    complete() {
                        if (index === sources.length) {
                            subscription = undefined;
                            observer.complete();
                        }
                        else {
                            startNext(C.from(sources[index++]));
                        }
                    },
                });
            }
            startNext(this);
            return () => {
                if (subscription) {
                    subscription.unsubscribe();
                    subscription = undefined;
                }
            };
        });
    }
    flatMap(fn) {
        if (typeof fn !== "function") {
            throw new TypeError(fn + " is not a function");
        }
        const C = getSpecies(this);
        return new C(observer => {
            const subscriptions = [];
            const outer = this.subscribe({
                next(value) {
                    let normalizedValue;
                    if (fn) {
                        try {
                            normalizedValue = fn(value);
                        }
                        catch (e) {
                            return observer.error(e);
                        }
                    }
                    else {
                        normalizedValue = value;
                    }
                    const inner = C.from(normalizedValue).subscribe({
                        next(innerValue) { observer.next(innerValue); },
                        error(e) { observer.error(e); },
                        complete() {
                            const i = subscriptions.indexOf(inner);
                            if (i >= 0)
                                subscriptions.splice(i, 1);
                            completeIfDone();
                        },
                    });
                    subscriptions.push(inner);
                },
                error(e) { observer.error(e); },
                complete() { completeIfDone(); },
            });
            function completeIfDone() {
                if (outer.closed && subscriptions.length === 0) {
                    observer.complete();
                }
            }
            return () => {
                subscriptions.forEach(s => s.unsubscribe());
                outer.unsubscribe();
            };
        });
    }
    [(Symbol.observable, SymbolObservable)]() { return this; }
    static from(x) {
        const C = (typeof this === "function" ? this : Observable);
        if (x == null) {
            throw new TypeError(x + " is not an object");
        }
        const observableMethod = getMethod(x, SymbolObservable);
        if (observableMethod) {
            const observable = observableMethod.call(x);
            if (Object(observable) !== observable) {
                throw new TypeError(observable + " is not an object");
            }
            if (isObservable(observable) && observable.constructor === C) {
                return observable;
            }
            return new C(observer => observable.subscribe(observer));
        }
        if (hasSymbol("iterator")) {
            const iteratorMethod = getMethod(x, SymbolIterator);
            if (iteratorMethod) {
                return new C(observer => {
                    enqueue(() => {
                        if (observer.closed)
                            return;
                        for (const item of iteratorMethod.call(x)) {
                            observer.next(item);
                            if (observer.closed)
                                return;
                        }
                        observer.complete();
                    });
                });
            }
        }
        if (Array.isArray(x)) {
            return new C(observer => {
                enqueue(() => {
                    if (observer.closed)
                        return;
                    for (const item of x) {
                        observer.next(item);
                        if (observer.closed)
                            return;
                    }
                    observer.complete();
                });
            });
        }
        throw new TypeError(x + " is not observable");
    }
    static of(...items) {
        const C = (typeof this === "function" ? this : Observable);
        return new C(observer => {
            enqueue(() => {
                if (observer.closed)
                    return;
                for (const item of items) {
                    observer.next(item);
                    if (observer.closed)
                        return;
                }
                observer.complete();
            });
        });
    }
    static get [SymbolSpecies]() { return this; }
}
if (hasSymbols()) {
    Object.defineProperty(Observable, Symbol("extensions"), {
        value: {
            symbol: SymbolObservable,
            hostReportError,
        },
        configurable: true,
    });
}
/* harmony default export */ const dist_esm_observable = (Observable);

;// CONCATENATED MODULE: ./node_modules/observable-fns/dist.esm/unsubscribe.js
/**
 * Unsubscribe from a subscription returned by something that looks like an observable,
 * but is not necessarily our observable implementation.
 */
function unsubscribe(subscription) {
    if (typeof subscription === "function") {
        subscription();
    }
    else if (subscription && typeof subscription.unsubscribe === "function") {
        subscription.unsubscribe();
    }
}
/* harmony default export */ const dist_esm_unsubscribe = (unsubscribe);

;// CONCATENATED MODULE: ./node_modules/observable-fns/dist.esm/filter.js
var filter_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



/**
 * Filters the values emitted by another observable.
 * To be applied to an input observable using `pipe()`.
 */
function filter(test) {
    return (observable) => {
        return new dist_esm_observable(observer => {
            const scheduler = new AsyncSerialScheduler(observer);
            const subscription = observable.subscribe({
                complete() {
                    scheduler.complete();
                },
                error(error) {
                    scheduler.error(error);
                },
                next(input) {
                    scheduler.schedule((next) => filter_awaiter(this, void 0, void 0, function* () {
                        if (yield test(input)) {
                            next(input);
                        }
                    }));
                }
            });
            return () => dist_esm_unsubscribe(subscription);
        });
    };
}
/* harmony default export */ const dist_esm_filter = (filter);

;// CONCATENATED MODULE: ./node_modules/observable-fns/dist.esm/_util.js
/// <reference lib="es2018" />

function isAsyncIterator(thing) {
    return thing && hasSymbol("asyncIterator") && thing[Symbol.asyncIterator];
}
function isIterator(thing) {
    return thing && hasSymbol("iterator") && thing[Symbol.iterator];
}

;// CONCATENATED MODULE: ./node_modules/observable-fns/dist.esm/flatMap.js
var flatMap_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (undefined && undefined.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};




/**
 * Maps the values emitted by another observable. In contrast to `map()`
 * the `mapper` function returns an array of values that will be emitted
 * separately.
 * Use `flatMap()` to map input values to zero, one or multiple output
 * values. To be applied to an input observable using `pipe()`.
 */
function flatMap(mapper) {
    return (observable) => {
        return new dist_esm_observable(observer => {
            const scheduler = new AsyncSerialScheduler(observer);
            const subscription = observable.subscribe({
                complete() {
                    scheduler.complete();
                },
                error(error) {
                    scheduler.error(error);
                },
                next(input) {
                    scheduler.schedule((next) => flatMap_awaiter(this, void 0, void 0, function* () {
                        var e_1, _a;
                        const mapped = yield mapper(input);
                        if (isIterator(mapped) || isAsyncIterator(mapped)) {
                            try {
                                for (var mapped_1 = __asyncValues(mapped), mapped_1_1; mapped_1_1 = yield mapped_1.next(), !mapped_1_1.done;) {
                                    const element = mapped_1_1.value;
                                    next(element);
                                }
                            }
                            catch (e_1_1) { e_1 = { error: e_1_1 }; }
                            finally {
                                try {
                                    if (mapped_1_1 && !mapped_1_1.done && (_a = mapped_1.return)) yield _a.call(mapped_1);
                                }
                                finally { if (e_1) throw e_1.error; }
                            }
                        }
                        else {
                            mapped.map(output => next(output));
                        }
                    }));
                }
            });
            return () => dist_esm_unsubscribe(subscription);
        });
    };
}
/* harmony default export */ const dist_esm_flatMap = (flatMap);

;// CONCATENATED MODULE: ./node_modules/observable-fns/dist.esm/interval.js

/**
 * Creates an observable that yields a new value every `period` milliseconds.
 * The first value emitted is 0, then 1, 2, etc. The first value is not emitted
 * immediately, but after the first interval.
 */
function interval(period) {
    return new Observable(observer => {
        let counter = 0;
        const handle = setInterval(() => {
            observer.next(counter++);
        }, period);
        return () => clearInterval(handle);
    });
}

;// CONCATENATED MODULE: ./node_modules/observable-fns/dist.esm/map.js
var map_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



/**
 * Maps the values emitted by another observable to different values.
 * To be applied to an input observable using `pipe()`.
 */
function map(mapper) {
    return (observable) => {
        return new dist_esm_observable(observer => {
            const scheduler = new AsyncSerialScheduler(observer);
            const subscription = observable.subscribe({
                complete() {
                    scheduler.complete();
                },
                error(error) {
                    scheduler.error(error);
                },
                next(input) {
                    scheduler.schedule((next) => map_awaiter(this, void 0, void 0, function* () {
                        const mapped = yield mapper(input);
                        next(mapped);
                    }));
                }
            });
            return () => dist_esm_unsubscribe(subscription);
        });
    };
}
/* harmony default export */ const dist_esm_map = (map);

;// CONCATENATED MODULE: ./node_modules/observable-fns/dist.esm/merge.js


function merge(...observables) {
    if (observables.length === 0) {
        return Observable.from([]);
    }
    return new Observable(observer => {
        let completed = 0;
        const subscriptions = observables.map(input => {
            return input.subscribe({
                error(error) {
                    observer.error(error);
                    unsubscribeAll();
                },
                next(value) {
                    observer.next(value);
                },
                complete() {
                    if (++completed === observables.length) {
                        observer.complete();
                        unsubscribeAll();
                    }
                }
            });
        });
        const unsubscribeAll = () => {
            subscriptions.forEach(subscription => dist_esm_unsubscribe(subscription));
        };
        return unsubscribeAll;
    });
}
/* harmony default export */ const dist_esm_merge = (merge);

;// CONCATENATED MODULE: ./node_modules/observable-fns/dist.esm/subject.js

// TODO: This observer iteration approach looks inelegant and expensive
// Idea: Come up with super class for Subscription that contains the
//       notify*, ... methods and use it here
/**
 * A subject is a "hot" observable (see `multicast`) that has its observer
 * methods (`.next(value)`, `.error(error)`, `.complete()`) exposed.
 *
 * Be careful, though! With great power comes great responsibility. Only use
 * the `Subject` when you really need to trigger updates "from the outside" and
 * try to keep the code that can access it to a minimum. Return
 * `Observable.from(mySubject)` to not allow other code to mutate.
 */
class MulticastSubject extends dist_esm_observable {
    constructor() {
        super(observer => {
            this._observers.add(observer);
            return () => this._observers.delete(observer);
        });
        this._observers = new Set();
    }
    next(value) {
        for (const observer of this._observers) {
            observer.next(value);
        }
    }
    error(error) {
        for (const observer of this._observers) {
            observer.error(error);
        }
    }
    complete() {
        for (const observer of this._observers) {
            observer.complete();
        }
    }
}
/* harmony default export */ const dist_esm_subject = (MulticastSubject);

;// CONCATENATED MODULE: ./node_modules/observable-fns/dist.esm/multicast.js



// TODO: Subject already creates additional observables "under the hood",
//       now we introduce even more. A true native MulticastObservable
//       would be preferable.
/**
 * Takes a "cold" observable and returns a wrapping "hot" observable that
 * proxies the input observable's values and errors.
 *
 * An observable is called "cold" when its initialization function is run
 * for each new subscriber. This is how observable-fns's `Observable`
 * implementation works.
 *
 * A hot observable is an observable where new subscribers subscribe to
 * the upcoming values of an already-initialiazed observable.
 *
 * The multicast observable will lazily subscribe to the source observable
 * once it has its first own subscriber and will unsubscribe from the
 * source observable when its last own subscriber unsubscribed.
 */
function multicast(coldObservable) {
    const subject = new dist_esm_subject();
    let sourceSubscription;
    let subscriberCount = 0;
    return new dist_esm_observable(observer => {
        // Init source subscription lazily
        if (!sourceSubscription) {
            sourceSubscription = coldObservable.subscribe(subject);
        }
        // Pipe all events from `subject` into this observable
        const subscription = subject.subscribe(observer);
        subscriberCount++;
        return () => {
            subscriberCount--;
            subscription.unsubscribe();
            // Close source subscription once last subscriber has unsubscribed
            if (subscriberCount === 0) {
                dist_esm_unsubscribe(sourceSubscription);
                sourceSubscription = undefined;
            }
        };
    });
}
/* harmony default export */ const dist_esm_multicast = (multicast);

;// CONCATENATED MODULE: ./node_modules/observable-fns/dist.esm/scan.js
var scan_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



function scan(accumulator, seed) {
    return (observable) => {
        return new dist_esm_observable(observer => {
            let accumulated;
            let index = 0;
            const scheduler = new AsyncSerialScheduler(observer);
            const subscription = observable.subscribe({
                complete() {
                    scheduler.complete();
                },
                error(error) {
                    scheduler.error(error);
                },
                next(value) {
                    scheduler.schedule((next) => scan_awaiter(this, void 0, void 0, function* () {
                        const prevAcc = index === 0
                            ? (typeof seed === "undefined" ? value : seed)
                            : accumulated;
                        accumulated = yield accumulator(prevAcc, value, index++);
                        next(accumulated);
                    }));
                }
            });
            return () => dist_esm_unsubscribe(subscription);
        });
    };
}
/* harmony default export */ const dist_esm_scan = (scan);

;// CONCATENATED MODULE: ./node_modules/observable-fns/dist.esm/index.js












/***/ }),

/***/ 467:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.serialize = exports.deserialize = exports.registerSerializer = void 0;
const serializers_1 = __webpack_require__(381);
let registeredSerializer = serializers_1.DefaultSerializer;
function registerSerializer(serializer) {
    registeredSerializer = serializers_1.extendSerializer(registeredSerializer, serializer);
}
exports.registerSerializer = registerSerializer;
function deserialize(message) {
    return registeredSerializer.deserialize(message);
}
exports.deserialize = deserialize;
function serialize(input) {
    return registeredSerializer.serialize(input);
}
exports.serialize = serialize;


/***/ }),

/***/ 734:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Transfer = exports.DefaultSerializer = exports.expose = exports.registerSerializer = void 0;
var common_1 = __webpack_require__(467);
Object.defineProperty(exports, "registerSerializer", ({ enumerable: true, get: function () { return common_1.registerSerializer; } }));
__exportStar(__webpack_require__(63), exports);
var index_1 = __webpack_require__(934);
Object.defineProperty(exports, "expose", ({ enumerable: true, get: function () { return index_1.expose; } }));
var serializers_1 = __webpack_require__(381);
Object.defineProperty(exports, "DefaultSerializer", ({ enumerable: true, get: function () { return serializers_1.DefaultSerializer; } }));
var transferable_1 = __webpack_require__(180);
Object.defineProperty(exports, "Transfer", ({ enumerable: true, get: function () { return transferable_1.Transfer; } }));


/***/ }),

/***/ 211:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// Source: <https://github.com/parcel-bundler/parcel/blob/master/packages/core/parcel-bundler/src/builtins/bundle-url.js>
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getBundleURL = exports.getBaseURL = void 0;
let bundleURL;
function getBundleURLCached() {
    if (!bundleURL) {
        bundleURL = getBundleURL();
    }
    return bundleURL;
}
exports.getBundleURL = getBundleURLCached;
function getBundleURL() {
    // Attempt to find the URL of the current script and use that as the base URL
    try {
        throw new Error;
    }
    catch (err) {
        const matches = ("" + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);
        if (matches) {
            return getBaseURL(matches[0]);
        }
    }
    return "/";
}
function getBaseURL(url) {
    return ("" + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)?\/[^/]+(?:\?.*)?$/, '$1') + '/';
}
exports.getBaseURL = getBaseURL;


/***/ }),

/***/ 390:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

// tslint:disable max-classes-per-file
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isWorkerRuntime = exports.getWorkerImplementation = exports.defaultPoolSize = void 0;
const get_bundle_url_browser_1 = __webpack_require__(211);
exports.defaultPoolSize = typeof navigator !== "undefined" && navigator.hardwareConcurrency
    ? navigator.hardwareConcurrency
    : 4;
const isAbsoluteURL = (value) => /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(value);
function createSourceBlobURL(code) {
    const blob = new Blob([code], { type: "application/javascript" });
    return URL.createObjectURL(blob);
}
function selectWorkerImplementation() {
    if (typeof Worker === "undefined") {
        // Might happen on Safari, for instance
        // The idea is to only fail if the constructor is actually used
        return class NoWebWorker {
            constructor() {
                throw Error("No web worker implementation available. You might have tried to spawn a worker within a worker in a browser that doesn't support workers in workers.");
            }
        };
    }
    class WebWorker extends Worker {
        constructor(url, options) {
            var _a, _b;
            if (typeof url === "string" && options && options._baseURL) {
                url = new URL(url, options._baseURL);
            }
            else if (typeof url === "string" && !isAbsoluteURL(url) && get_bundle_url_browser_1.getBundleURL().match(/^file:\/\//i)) {
                url = new URL(url, get_bundle_url_browser_1.getBundleURL().replace(/\/[^\/]+$/, "/"));
                if ((_a = options === null || options === void 0 ? void 0 : options.CORSWorkaround) !== null && _a !== void 0 ? _a : true) {
                    url = createSourceBlobURL(`importScripts(${JSON.stringify(url)});`);
                }
            }
            if (typeof url === "string" && isAbsoluteURL(url)) {
                // Create source code blob loading JS file via `importScripts()`
                // to circumvent worker CORS restrictions
                if ((_b = options === null || options === void 0 ? void 0 : options.CORSWorkaround) !== null && _b !== void 0 ? _b : true) {
                    url = createSourceBlobURL(`importScripts(${JSON.stringify(url)});`);
                }
            }
            super(url, options);
        }
    }
    class BlobWorker extends WebWorker {
        constructor(blob, options) {
            const url = window.URL.createObjectURL(blob);
            super(url, options);
        }
        static fromText(source, options) {
            const blob = new window.Blob([source], { type: "text/javascript" });
            return new BlobWorker(blob, options);
        }
    }
    return {
        blob: BlobWorker,
        default: WebWorker
    };
}
let implementation;
function getWorkerImplementation() {
    if (!implementation) {
        implementation = selectWorkerImplementation();
    }
    return implementation;
}
exports.getWorkerImplementation = getWorkerImplementation;
function isWorkerRuntime() {
    const isWindowContext = typeof self !== "undefined" && typeof Window !== "undefined" && self instanceof Window;
    return typeof self !== "undefined" && self.postMessage && !isWindowContext ? true : false;
}
exports.isWorkerRuntime = isWorkerRuntime;


/***/ }),

/***/ 63:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Worker = exports.BlobWorker = exports.isWorkerRuntime = exports.Thread = exports.spawn = exports.Pool = void 0;
const implementation_1 = __webpack_require__(390);
Object.defineProperty(exports, "isWorkerRuntime", ({ enumerable: true, get: function () { return implementation_1.isWorkerRuntime; } }));
var pool_1 = __webpack_require__(337);
Object.defineProperty(exports, "Pool", ({ enumerable: true, get: function () { return pool_1.Pool; } }));
var spawn_1 = __webpack_require__(264);
Object.defineProperty(exports, "spawn", ({ enumerable: true, get: function () { return spawn_1.spawn; } }));
var thread_1 = __webpack_require__(235);
Object.defineProperty(exports, "Thread", ({ enumerable: true, get: function () { return thread_1.Thread; } }));
/** Separate class to spawn workers from source code blobs or strings. */
exports.BlobWorker = implementation_1.getWorkerImplementation().blob;
/** Worker implementation. Either web worker or a node.js Worker class. */
exports.Worker = implementation_1.getWorkerImplementation().default;


/***/ }),

/***/ 891:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/*
 * This source file contains the code for proxying calls in the master thread to calls in the workers
 * by `.postMessage()`-ing.
 *
 * Keep in mind that this code can make or break the program's performance! Need to optimize more…
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createProxyModule = exports.createProxyFunction = void 0;
const debug_1 = __importDefault(__webpack_require__(227));
const observable_fns_1 = __webpack_require__(49);
const common_1 = __webpack_require__(467);
const observable_promise_1 = __webpack_require__(15);
const transferable_1 = __webpack_require__(180);
const messages_1 = __webpack_require__(229);
const debugMessages = debug_1.default("threads:master:messages");
let nextJobUID = 1;
const dedupe = (array) => Array.from(new Set(array));
const isJobErrorMessage = (data) => data && data.type === messages_1.WorkerMessageType.error;
const isJobResultMessage = (data) => data && data.type === messages_1.WorkerMessageType.result;
const isJobStartMessage = (data) => data && data.type === messages_1.WorkerMessageType.running;
function createObservableForJob(worker, jobUID) {
    return new observable_fns_1.Observable(observer => {
        let asyncType;
        const messageHandler = ((event) => {
            debugMessages("Message from worker:", event.data);
            if (!event.data || event.data.uid !== jobUID)
                return;
            if (isJobStartMessage(event.data)) {
                asyncType = event.data.resultType;
            }
            else if (isJobResultMessage(event.data)) {
                if (asyncType === "promise") {
                    if (typeof event.data.payload !== "undefined") {
                        observer.next(common_1.deserialize(event.data.payload));
                    }
                    observer.complete();
                    worker.removeEventListener("message", messageHandler);
                }
                else {
                    if (event.data.payload) {
                        observer.next(common_1.deserialize(event.data.payload));
                    }
                    if (event.data.complete) {
                        observer.complete();
                        worker.removeEventListener("message", messageHandler);
                    }
                }
            }
            else if (isJobErrorMessage(event.data)) {
                const error = common_1.deserialize(event.data.error);
                if (asyncType === "promise" || !asyncType) {
                    observer.error(error);
                }
                else {
                    observer.error(error);
                }
                worker.removeEventListener("message", messageHandler);
            }
        });
        worker.addEventListener("message", messageHandler);
        return () => {
            if (asyncType === "observable" || !asyncType) {
                const cancelMessage = {
                    type: messages_1.MasterMessageType.cancel,
                    uid: jobUID
                };
                worker.postMessage(cancelMessage);
            }
            worker.removeEventListener("message", messageHandler);
        };
    });
}
function prepareArguments(rawArgs) {
    if (rawArgs.length === 0) {
        // Exit early if possible
        return {
            args: [],
            transferables: []
        };
    }
    const args = [];
    const transferables = [];
    for (const arg of rawArgs) {
        if (transferable_1.isTransferDescriptor(arg)) {
            args.push(common_1.serialize(arg.send));
            transferables.push(...arg.transferables);
        }
        else {
            args.push(common_1.serialize(arg));
        }
    }
    return {
        args,
        transferables: transferables.length === 0 ? transferables : dedupe(transferables)
    };
}
function createProxyFunction(worker, method) {
    return ((...rawArgs) => {
        const uid = nextJobUID++;
        const { args, transferables } = prepareArguments(rawArgs);
        const runMessage = {
            type: messages_1.MasterMessageType.run,
            uid,
            method,
            args
        };
        debugMessages("Sending command to run function to worker:", runMessage);
        try {
            worker.postMessage(runMessage, transferables);
        }
        catch (error) {
            return observable_promise_1.ObservablePromise.from(Promise.reject(error));
        }
        return observable_promise_1.ObservablePromise.from(observable_fns_1.multicast(createObservableForJob(worker, uid)));
    });
}
exports.createProxyFunction = createProxyFunction;
function createProxyModule(worker, methodNames) {
    const proxy = {};
    for (const methodName of methodNames) {
        proxy[methodName] = createProxyFunction(worker, methodName);
    }
    return proxy;
}
exports.createProxyModule = createProxyModule;


/***/ }),

/***/ 774:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PoolEventType = void 0;
/** Pool event type. Specifies the type of each `PoolEvent`. */
var PoolEventType;
(function (PoolEventType) {
    PoolEventType["initialized"] = "initialized";
    PoolEventType["taskCanceled"] = "taskCanceled";
    PoolEventType["taskCompleted"] = "taskCompleted";
    PoolEventType["taskFailed"] = "taskFailed";
    PoolEventType["taskQueued"] = "taskQueued";
    PoolEventType["taskQueueDrained"] = "taskQueueDrained";
    PoolEventType["taskStart"] = "taskStart";
    PoolEventType["terminated"] = "terminated";
})(PoolEventType = exports.PoolEventType || (exports.PoolEventType = {}));


/***/ }),

/***/ 337:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Pool = exports.Thread = exports.PoolEventType = void 0;
const debug_1 = __importDefault(__webpack_require__(227));
const observable_fns_1 = __webpack_require__(49);
const ponyfills_1 = __webpack_require__(531);
const implementation_1 = __webpack_require__(390);
const pool_types_1 = __webpack_require__(774);
Object.defineProperty(exports, "PoolEventType", ({ enumerable: true, get: function () { return pool_types_1.PoolEventType; } }));
const thread_1 = __webpack_require__(235);
Object.defineProperty(exports, "Thread", ({ enumerable: true, get: function () { return thread_1.Thread; } }));
let nextPoolID = 1;
function createArray(size) {
    const array = [];
    for (let index = 0; index < size; index++) {
        array.push(index);
    }
    return array;
}
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function flatMap(array, mapper) {
    return array.reduce((flattened, element) => [...flattened, ...mapper(element)], []);
}
function slugify(text) {
    return text.replace(/\W/g, " ").trim().replace(/\s+/g, "-");
}
function spawnWorkers(spawnWorker, count) {
    return createArray(count).map(() => ({
        init: spawnWorker(),
        runningTasks: []
    }));
}
class WorkerPool {
    constructor(spawnWorker, optionsOrSize) {
        this.eventSubject = new observable_fns_1.Subject();
        this.initErrors = [];
        this.isClosing = false;
        this.nextTaskID = 1;
        this.taskQueue = [];
        const options = typeof optionsOrSize === "number"
            ? { size: optionsOrSize }
            : optionsOrSize || {};
        const { size = implementation_1.defaultPoolSize } = options;
        this.debug = debug_1.default(`threads:pool:${slugify(options.name || String(nextPoolID++))}`);
        this.options = options;
        this.workers = spawnWorkers(spawnWorker, size);
        this.eventObservable = observable_fns_1.multicast(observable_fns_1.Observable.from(this.eventSubject));
        Promise.all(this.workers.map(worker => worker.init)).then(() => this.eventSubject.next({
            type: pool_types_1.PoolEventType.initialized,
            size: this.workers.length
        }), error => {
            this.debug("Error while initializing pool worker:", error);
            this.eventSubject.error(error);
            this.initErrors.push(error);
        });
    }
    findIdlingWorker() {
        const { concurrency = 1 } = this.options;
        return this.workers.find(worker => worker.runningTasks.length < concurrency);
    }
    runPoolTask(worker, task) {
        return __awaiter(this, void 0, void 0, function* () {
            const workerID = this.workers.indexOf(worker) + 1;
            this.debug(`Running task #${task.id} on worker #${workerID}...`);
            this.eventSubject.next({
                type: pool_types_1.PoolEventType.taskStart,
                taskID: task.id,
                workerID
            });
            try {
                const returnValue = yield task.run(yield worker.init);
                this.debug(`Task #${task.id} completed successfully`);
                this.eventSubject.next({
                    type: pool_types_1.PoolEventType.taskCompleted,
                    returnValue,
                    taskID: task.id,
                    workerID
                });
            }
            catch (error) {
                this.debug(`Task #${task.id} failed`);
                this.eventSubject.next({
                    type: pool_types_1.PoolEventType.taskFailed,
                    taskID: task.id,
                    error,
                    workerID
                });
            }
        });
    }
    run(worker, task) {
        return __awaiter(this, void 0, void 0, function* () {
            const runPromise = (() => __awaiter(this, void 0, void 0, function* () {
                const removeTaskFromWorkersRunningTasks = () => {
                    worker.runningTasks = worker.runningTasks.filter(someRunPromise => someRunPromise !== runPromise);
                };
                // Defer task execution by one tick to give handlers time to subscribe
                yield delay(0);
                try {
                    yield this.runPoolTask(worker, task);
                }
                finally {
                    removeTaskFromWorkersRunningTasks();
                    if (!this.isClosing) {
                        this.scheduleWork();
                    }
                }
            }))();
            worker.runningTasks.push(runPromise);
        });
    }
    scheduleWork() {
        this.debug(`Attempt de-queueing a task in order to run it...`);
        const availableWorker = this.findIdlingWorker();
        if (!availableWorker)
            return;
        const nextTask = this.taskQueue.shift();
        if (!nextTask) {
            this.debug(`Task queue is empty`);
            this.eventSubject.next({ type: pool_types_1.PoolEventType.taskQueueDrained });
            return;
        }
        this.run(availableWorker, nextTask);
    }
    taskCompletion(taskID) {
        return new Promise((resolve, reject) => {
            const eventSubscription = this.events().subscribe(event => {
                if (event.type === pool_types_1.PoolEventType.taskCompleted && event.taskID === taskID) {
                    eventSubscription.unsubscribe();
                    resolve(event.returnValue);
                }
                else if (event.type === pool_types_1.PoolEventType.taskFailed && event.taskID === taskID) {
                    eventSubscription.unsubscribe();
                    reject(event.error);
                }
                else if (event.type === pool_types_1.PoolEventType.terminated) {
                    eventSubscription.unsubscribe();
                    reject(Error("Pool has been terminated before task was run."));
                }
            });
        });
    }
    settled(allowResolvingImmediately = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const getCurrentlyRunningTasks = () => flatMap(this.workers, worker => worker.runningTasks);
            const taskFailures = [];
            const failureSubscription = this.eventObservable.subscribe(event => {
                if (event.type === pool_types_1.PoolEventType.taskFailed) {
                    taskFailures.push(event.error);
                }
            });
            if (this.initErrors.length > 0) {
                return Promise.reject(this.initErrors[0]);
            }
            if (allowResolvingImmediately && this.taskQueue.length === 0) {
                yield ponyfills_1.allSettled(getCurrentlyRunningTasks());
                return taskFailures;
            }
            yield new Promise((resolve, reject) => {
                const subscription = this.eventObservable.subscribe({
                    next(event) {
                        if (event.type === pool_types_1.PoolEventType.taskQueueDrained) {
                            subscription.unsubscribe();
                            resolve(void 0);
                        }
                    },
                    error: reject // make a pool-wide error reject the completed() result promise
                });
            });
            yield ponyfills_1.allSettled(getCurrentlyRunningTasks());
            failureSubscription.unsubscribe();
            return taskFailures;
        });
    }
    completed(allowResolvingImmediately = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const settlementPromise = this.settled(allowResolvingImmediately);
            const earlyExitPromise = new Promise((resolve, reject) => {
                const subscription = this.eventObservable.subscribe({
                    next(event) {
                        if (event.type === pool_types_1.PoolEventType.taskQueueDrained) {
                            subscription.unsubscribe();
                            resolve(settlementPromise);
                        }
                        else if (event.type === pool_types_1.PoolEventType.taskFailed) {
                            subscription.unsubscribe();
                            reject(event.error);
                        }
                    },
                    error: reject // make a pool-wide error reject the completed() result promise
                });
            });
            const errors = yield Promise.race([
                settlementPromise,
                earlyExitPromise
            ]);
            if (errors.length > 0) {
                throw errors[0];
            }
        });
    }
    events() {
        return this.eventObservable;
    }
    queue(taskFunction) {
        const { maxQueuedJobs = Infinity } = this.options;
        if (this.isClosing) {
            throw Error(`Cannot schedule pool tasks after terminate() has been called.`);
        }
        if (this.initErrors.length > 0) {
            throw this.initErrors[0];
        }
        const taskID = this.nextTaskID++;
        const taskCompletion = this.taskCompletion(taskID);
        taskCompletion.catch((error) => {
            // Prevent unhandled rejections here as we assume the user will use
            // `pool.completed()`, `pool.settled()` or `task.catch()` to handle errors
            this.debug(`Task #${taskID} errored:`, error);
        });
        const task = {
            id: taskID,
            run: taskFunction,
            cancel: () => {
                if (this.taskQueue.indexOf(task) === -1)
                    return;
                this.taskQueue = this.taskQueue.filter(someTask => someTask !== task);
                this.eventSubject.next({
                    type: pool_types_1.PoolEventType.taskCanceled,
                    taskID: task.id
                });
            },
            then: taskCompletion.then.bind(taskCompletion)
        };
        if (this.taskQueue.length >= maxQueuedJobs) {
            throw Error("Maximum number of pool tasks queued. Refusing to queue another one.\n" +
                "This usually happens for one of two reasons: We are either at peak " +
                "workload right now or some tasks just won't finish, thus blocking the pool.");
        }
        this.debug(`Queueing task #${task.id}...`);
        this.taskQueue.push(task);
        this.eventSubject.next({
            type: pool_types_1.PoolEventType.taskQueued,
            taskID: task.id
        });
        this.scheduleWork();
        return task;
    }
    terminate(force) {
        return __awaiter(this, void 0, void 0, function* () {
            this.isClosing = true;
            if (!force) {
                yield this.completed(true);
            }
            this.eventSubject.next({
                type: pool_types_1.PoolEventType.terminated,
                remainingQueue: [...this.taskQueue]
            });
            this.eventSubject.complete();
            yield Promise.all(this.workers.map((worker) => __awaiter(this, void 0, void 0, function* () { return thread_1.Thread.terminate(yield worker.init); })));
        });
    }
}
WorkerPool.EventType = pool_types_1.PoolEventType;
/**
 * Thread pool constructor. Creates a new pool and spawns its worker threads.
 */
function PoolConstructor(spawnWorker, optionsOrSize) {
    // The function exists only so we don't need to use `new` to create a pool (we still can, though).
    // If the Pool is a class or not is an implementation detail that should not concern the user.
    return new WorkerPool(spawnWorker, optionsOrSize);
}
PoolConstructor.EventType = pool_types_1.PoolEventType;
/**
 * Thread pool constructor. Creates a new pool and spawns its worker threads.
 */
exports.Pool = PoolConstructor;


/***/ }),

/***/ 264:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.spawn = void 0;
const debug_1 = __importDefault(__webpack_require__(227));
const observable_fns_1 = __webpack_require__(49);
const common_1 = __webpack_require__(467);
const promise_1 = __webpack_require__(104);
const symbols_1 = __webpack_require__(258);
const master_1 = __webpack_require__(356);
const invocation_proxy_1 = __webpack_require__(891);
const debugMessages = debug_1.default("threads:master:messages");
const debugSpawn = debug_1.default("threads:master:spawn");
const debugThreadUtils = debug_1.default("threads:master:thread-utils");
const isInitMessage = (data) => data && data.type === "init";
const isUncaughtErrorMessage = (data) => data && data.type === "uncaughtError";
const initMessageTimeout = typeof process !== "undefined" && process.env.THREADS_WORKER_INIT_TIMEOUT
    ? Number.parseInt(process.env.THREADS_WORKER_INIT_TIMEOUT, 10)
    : 10000;
function withTimeout(promise, timeoutInMs, errorMessage) {
    return __awaiter(this, void 0, void 0, function* () {
        let timeoutHandle;
        const timeout = new Promise((resolve, reject) => {
            timeoutHandle = setTimeout(() => reject(Error(errorMessage)), timeoutInMs);
        });
        const result = yield Promise.race([
            promise,
            timeout
        ]);
        clearTimeout(timeoutHandle);
        return result;
    });
}
function receiveInitMessage(worker) {
    return new Promise((resolve, reject) => {
        const messageHandler = ((event) => {
            debugMessages("Message from worker before finishing initialization:", event.data);
            if (isInitMessage(event.data)) {
                worker.removeEventListener("message", messageHandler);
                resolve(event.data);
            }
            else if (isUncaughtErrorMessage(event.data)) {
                worker.removeEventListener("message", messageHandler);
                reject(common_1.deserialize(event.data.error));
            }
        });
        worker.addEventListener("message", messageHandler);
    });
}
function createEventObservable(worker, workerTermination) {
    return new observable_fns_1.Observable(observer => {
        const messageHandler = ((messageEvent) => {
            const workerEvent = {
                type: master_1.WorkerEventType.message,
                data: messageEvent.data
            };
            observer.next(workerEvent);
        });
        const rejectionHandler = ((errorEvent) => {
            debugThreadUtils("Unhandled promise rejection event in thread:", errorEvent);
            const workerEvent = {
                type: master_1.WorkerEventType.internalError,
                error: Error(errorEvent.reason)
            };
            observer.next(workerEvent);
        });
        worker.addEventListener("message", messageHandler);
        worker.addEventListener("unhandledrejection", rejectionHandler);
        workerTermination.then(() => {
            const terminationEvent = {
                type: master_1.WorkerEventType.termination
            };
            worker.removeEventListener("message", messageHandler);
            worker.removeEventListener("unhandledrejection", rejectionHandler);
            observer.next(terminationEvent);
            observer.complete();
        });
    });
}
function createTerminator(worker) {
    const [termination, resolver] = promise_1.createPromiseWithResolver();
    const terminate = () => __awaiter(this, void 0, void 0, function* () {
        debugThreadUtils("Terminating worker");
        // Newer versions of worker_threads workers return a promise
        yield worker.terminate();
        resolver();
    });
    return { terminate, termination };
}
function setPrivateThreadProps(raw, worker, workerEvents, terminate) {
    const workerErrors = workerEvents
        .filter(event => event.type === master_1.WorkerEventType.internalError)
        .map(errorEvent => errorEvent.error);
    // tslint:disable-next-line prefer-object-spread
    return Object.assign(raw, {
        [symbols_1.$errors]: workerErrors,
        [symbols_1.$events]: workerEvents,
        [symbols_1.$terminate]: terminate,
        [symbols_1.$worker]: worker
    });
}
/**
 * Spawn a new thread. Takes a fresh worker instance, wraps it in a thin
 * abstraction layer to provide the transparent API and verifies that
 * the worker has initialized successfully.
 *
 * @param worker Instance of `Worker`. Either a web worker, `worker_threads` worker or `tiny-worker` worker.
 * @param [options]
 * @param [options.timeout] Init message timeout. Default: 10000 or set by environment variable.
 */
function spawn(worker, options) {
    return __awaiter(this, void 0, void 0, function* () {
        debugSpawn("Initializing new thread");
        const timeout = options && options.timeout ? options.timeout : initMessageTimeout;
        const initMessage = yield withTimeout(receiveInitMessage(worker), timeout, `Timeout: Did not receive an init message from worker after ${timeout}ms. Make sure the worker calls expose().`);
        const exposed = initMessage.exposed;
        const { termination, terminate } = createTerminator(worker);
        const events = createEventObservable(worker, termination);
        if (exposed.type === "function") {
            const proxy = invocation_proxy_1.createProxyFunction(worker);
            return setPrivateThreadProps(proxy, worker, events, terminate);
        }
        else if (exposed.type === "module") {
            const proxy = invocation_proxy_1.createProxyModule(worker, exposed.methods);
            return setPrivateThreadProps(proxy, worker, events, terminate);
        }
        else {
            const type = exposed.type;
            throw Error(`Worker init message states unexpected type of expose(): ${type}`);
        }
    });
}
exports.spawn = spawn;


/***/ }),

/***/ 235:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Thread = void 0;
const symbols_1 = __webpack_require__(258);
function fail(message) {
    throw Error(message);
}
/** Thread utility functions. Use them to manage or inspect a `spawn()`-ed thread. */
exports.Thread = {
    /** Return an observable that can be used to subscribe to all errors happening in the thread. */
    errors(thread) {
        return thread[symbols_1.$errors] || fail("Error observable not found. Make sure to pass a thread instance as returned by the spawn() promise.");
    },
    /** Return an observable that can be used to subscribe to internal events happening in the thread. Useful for debugging. */
    events(thread) {
        return thread[symbols_1.$events] || fail("Events observable not found. Make sure to pass a thread instance as returned by the spawn() promise.");
    },
    /** Terminate a thread. Remember to terminate every thread when you are done using it. */
    terminate(thread) {
        return thread[symbols_1.$terminate]();
    }
};


/***/ }),

/***/ 15:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ObservablePromise = void 0;
const observable_fns_1 = __webpack_require__(49);
const doNothing = () => undefined;
const returnInput = (input) => input;
const runDeferred = (fn) => Promise.resolve().then(fn);
function fail(error) {
    throw error;
}
function isThenable(thing) {
    return thing && typeof thing.then === "function";
}
/**
 * Creates a hybrid, combining the APIs of an Observable and a Promise.
 *
 * It is used to proxy async process states when we are initially not sure
 * if that async process will yield values once (-> Promise) or multiple
 * times (-> Observable).
 *
 * Note that the observable promise inherits some of the observable's characteristics:
 * The `init` function will be called *once for every time anyone subscribes to it*.
 *
 * If this is undesired, derive a hot observable from it using `makeHot()` and
 * subscribe to that.
 */
class ObservablePromise extends observable_fns_1.Observable {
    constructor(init) {
        super((originalObserver) => {
            // tslint:disable-next-line no-this-assignment
            const self = this;
            const observer = Object.assign(Object.assign({}, originalObserver), { complete() {
                    originalObserver.complete();
                    self.onCompletion();
                }, error(error) {
                    originalObserver.error(error);
                    self.onError(error);
                },
                next(value) {
                    originalObserver.next(value);
                    self.onNext(value);
                } });
            try {
                this.initHasRun = true;
                return init(observer);
            }
            catch (error) {
                observer.error(error);
            }
        });
        this.initHasRun = false;
        this.fulfillmentCallbacks = [];
        this.rejectionCallbacks = [];
        this.firstValueSet = false;
        this.state = "pending";
    }
    onNext(value) {
        if (!this.firstValueSet) {
            this.firstValue = value;
            this.firstValueSet = true;
        }
    }
    onError(error) {
        this.state = "rejected";
        this.rejection = error;
        for (const onRejected of this.rejectionCallbacks) {
            // Promisifying the call to turn errors into unhandled promise rejections
            // instead of them failing sync and cancelling the iteration
            runDeferred(() => onRejected(error));
        }
    }
    onCompletion() {
        this.state = "fulfilled";
        for (const onFulfilled of this.fulfillmentCallbacks) {
            // Promisifying the call to turn errors into unhandled promise rejections
            // instead of them failing sync and cancelling the iteration
            runDeferred(() => onFulfilled(this.firstValue));
        }
    }
    then(onFulfilledRaw, onRejectedRaw) {
        const onFulfilled = onFulfilledRaw || returnInput;
        const onRejected = onRejectedRaw || fail;
        let onRejectedCalled = false;
        return new Promise((resolve, reject) => {
            const rejectionCallback = (error) => {
                if (onRejectedCalled)
                    return;
                onRejectedCalled = true;
                try {
                    resolve(onRejected(error));
                }
                catch (anotherError) {
                    reject(anotherError);
                }
            };
            const fulfillmentCallback = (value) => {
                try {
                    resolve(onFulfilled(value));
                }
                catch (error) {
                    rejectionCallback(error);
                }
            };
            if (!this.initHasRun) {
                this.subscribe({ error: rejectionCallback });
            }
            if (this.state === "fulfilled") {
                return resolve(onFulfilled(this.firstValue));
            }
            if (this.state === "rejected") {
                onRejectedCalled = true;
                return resolve(onRejected(this.rejection));
            }
            this.fulfillmentCallbacks.push(fulfillmentCallback);
            this.rejectionCallbacks.push(rejectionCallback);
        });
    }
    catch(onRejected) {
        return this.then(undefined, onRejected);
    }
    finally(onCompleted) {
        const handler = onCompleted || doNothing;
        return this.then((value) => {
            handler();
            return value;
        }, () => handler());
    }
    static from(thing) {
        if (isThenable(thing)) {
            return new ObservablePromise(observer => {
                const onFulfilled = (value) => {
                    observer.next(value);
                    observer.complete();
                };
                const onRejected = (error) => {
                    observer.error(error);
                };
                thing.then(onFulfilled, onRejected);
            });
        }
        else {
            return super.from(thing);
        }
    }
}
exports.ObservablePromise = ObservablePromise;


/***/ }),

/***/ 531:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.allSettled = void 0;
// Based on <https://github.com/es-shims/Promise.allSettled/blob/master/implementation.js>
function allSettled(values) {
    return Promise.all(values.map(item => {
        const onFulfill = (value) => {
            return { status: 'fulfilled', value };
        };
        const onReject = (reason) => {
            return { status: 'rejected', reason };
        };
        const itemPromise = Promise.resolve(item);
        try {
            return itemPromise.then(onFulfill, onReject);
        }
        catch (error) {
            return Promise.reject(error);
        }
    }));
}
exports.allSettled = allSettled;


/***/ }),

/***/ 104:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createPromiseWithResolver = void 0;
const doNothing = () => undefined;
/**
 * Creates a new promise and exposes its resolver function.
 * Use with care!
 */
function createPromiseWithResolver() {
    let alreadyResolved = false;
    let resolvedTo;
    let resolver = doNothing;
    const promise = new Promise(resolve => {
        if (alreadyResolved) {
            resolve(resolvedTo);
        }
        else {
            resolver = resolve;
        }
    });
    const exposedResolver = (value) => {
        alreadyResolved = true;
        resolvedTo = value;
        resolver(resolvedTo);
    };
    return [promise, exposedResolver];
}
exports.createPromiseWithResolver = createPromiseWithResolver;


/***/ }),

/***/ 381:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DefaultSerializer = exports.extendSerializer = void 0;
function extendSerializer(extend, implementation) {
    const fallbackDeserializer = extend.deserialize.bind(extend);
    const fallbackSerializer = extend.serialize.bind(extend);
    return {
        deserialize(message) {
            return implementation.deserialize(message, fallbackDeserializer);
        },
        serialize(input) {
            return implementation.serialize(input, fallbackSerializer);
        }
    };
}
exports.extendSerializer = extendSerializer;
const DefaultErrorSerializer = {
    deserialize(message) {
        return Object.assign(Error(message.message), {
            name: message.name,
            stack: message.stack
        });
    },
    serialize(error) {
        return {
            __error_marker: "$$error",
            message: error.message,
            name: error.name,
            stack: error.stack
        };
    }
};
const isSerializedError = (thing) => thing && typeof thing === "object" && "__error_marker" in thing && thing.__error_marker === "$$error";
exports.DefaultSerializer = {
    deserialize(message) {
        if (isSerializedError(message)) {
            return DefaultErrorSerializer.deserialize(message);
        }
        else {
            return message;
        }
    },
    serialize(input) {
        if (input instanceof Error) {
            return DefaultErrorSerializer.serialize(input);
        }
        else {
            return input;
        }
    }
};


/***/ }),

/***/ 258:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.$worker = exports.$transferable = exports.$terminate = exports.$events = exports.$errors = void 0;
exports.$errors = Symbol("thread.errors");
exports.$events = Symbol("thread.events");
exports.$terminate = Symbol("thread.terminate");
exports.$transferable = Symbol("thread.transferable");
exports.$worker = Symbol("thread.worker");


/***/ }),

/***/ 180:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Transfer = exports.isTransferDescriptor = void 0;
const symbols_1 = __webpack_require__(258);
function isTransferable(thing) {
    if (!thing || typeof thing !== "object")
        return false;
    // Don't check too thoroughly, since the list of transferable things in JS might grow over time
    return true;
}
function isTransferDescriptor(thing) {
    return thing && typeof thing === "object" && thing[symbols_1.$transferable];
}
exports.isTransferDescriptor = isTransferDescriptor;
function Transfer(payload, transferables) {
    if (!transferables) {
        if (!isTransferable(payload))
            throw Error();
        transferables = [payload];
    }
    return {
        [symbols_1.$transferable]: true,
        send: payload,
        transferables
    };
}
exports.Transfer = Transfer;


/***/ }),

/***/ 356:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/// <reference lib="dom" />
// tslint:disable max-classes-per-file
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WorkerEventType = void 0;
const symbols_1 = __webpack_require__(258);
/** Event as emitted by worker thread. Subscribe to using `Thread.events(thread)`. */
var WorkerEventType;
(function (WorkerEventType) {
    WorkerEventType["internalError"] = "internalError";
    WorkerEventType["message"] = "message";
    WorkerEventType["termination"] = "termination";
})(WorkerEventType = exports.WorkerEventType || (exports.WorkerEventType = {}));


/***/ }),

/***/ 229:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WorkerMessageType = exports.MasterMessageType = void 0;
/////////////////////////////
// Messages sent by master:
var MasterMessageType;
(function (MasterMessageType) {
    MasterMessageType["cancel"] = "cancel";
    MasterMessageType["run"] = "run";
})(MasterMessageType = exports.MasterMessageType || (exports.MasterMessageType = {}));
////////////////////////////
// Messages sent by worker:
var WorkerMessageType;
(function (WorkerMessageType) {
    WorkerMessageType["error"] = "error";
    WorkerMessageType["init"] = "init";
    WorkerMessageType["result"] = "result";
    WorkerMessageType["running"] = "running";
    WorkerMessageType["uncaughtError"] = "uncaughtError";
})(WorkerMessageType = exports.WorkerMessageType || (exports.WorkerMessageType = {}));


/***/ }),

/***/ 398:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/// <reference lib="dom" />
// tslint:disable no-shadowed-variable
Object.defineProperty(exports, "__esModule", ({ value: true }));
const isWorkerRuntime = function isWorkerRuntime() {
    const isWindowContext = typeof self !== "undefined" && typeof Window !== "undefined" && self instanceof Window;
    return typeof self !== "undefined" && self.postMessage && !isWindowContext ? true : false;
};
const postMessageToMaster = function postMessageToMaster(data, transferList) {
    self.postMessage(data, transferList);
};
const subscribeToMasterMessages = function subscribeToMasterMessages(onMessage) {
    const messageHandler = (messageEvent) => {
        onMessage(messageEvent.data);
    };
    const unsubscribe = () => {
        self.removeEventListener("message", messageHandler);
    };
    self.addEventListener("message", messageHandler);
    return unsubscribe;
};
exports["default"] = {
    isWorkerRuntime,
    postMessageToMaster,
    subscribeToMasterMessages
};


/***/ }),

/***/ 934:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.expose = exports.isWorkerRuntime = exports.Transfer = exports.registerSerializer = void 0;
const is_observable_1 = __importDefault(__webpack_require__(898));
const common_1 = __webpack_require__(467);
const transferable_1 = __webpack_require__(180);
const messages_1 = __webpack_require__(229);
const implementation_1 = __importDefault(__webpack_require__(398));
var common_2 = __webpack_require__(467);
Object.defineProperty(exports, "registerSerializer", ({ enumerable: true, get: function () { return common_2.registerSerializer; } }));
var transferable_2 = __webpack_require__(180);
Object.defineProperty(exports, "Transfer", ({ enumerable: true, get: function () { return transferable_2.Transfer; } }));
/** Returns `true` if this code is currently running in a worker. */
exports.isWorkerRuntime = implementation_1.default.isWorkerRuntime;
let exposeCalled = false;
const activeSubscriptions = new Map();
const isMasterJobCancelMessage = (thing) => thing && thing.type === messages_1.MasterMessageType.cancel;
const isMasterJobRunMessage = (thing) => thing && thing.type === messages_1.MasterMessageType.run;
/**
 * There are issues with `is-observable` not recognizing zen-observable's instances.
 * We are using `observable-fns`, but it's based on zen-observable, too.
 */
const isObservable = (thing) => is_observable_1.default(thing) || isZenObservable(thing);
function isZenObservable(thing) {
    return thing && typeof thing === "object" && typeof thing.subscribe === "function";
}
function deconstructTransfer(thing) {
    return transferable_1.isTransferDescriptor(thing)
        ? { payload: thing.send, transferables: thing.transferables }
        : { payload: thing, transferables: undefined };
}
function postFunctionInitMessage() {
    const initMessage = {
        type: messages_1.WorkerMessageType.init,
        exposed: {
            type: "function"
        }
    };
    implementation_1.default.postMessageToMaster(initMessage);
}
function postModuleInitMessage(methodNames) {
    const initMessage = {
        type: messages_1.WorkerMessageType.init,
        exposed: {
            type: "module",
            methods: methodNames
        }
    };
    implementation_1.default.postMessageToMaster(initMessage);
}
function postJobErrorMessage(uid, rawError) {
    const { payload: error, transferables } = deconstructTransfer(rawError);
    const errorMessage = {
        type: messages_1.WorkerMessageType.error,
        uid,
        error: common_1.serialize(error)
    };
    implementation_1.default.postMessageToMaster(errorMessage, transferables);
}
function postJobResultMessage(uid, completed, resultValue) {
    const { payload, transferables } = deconstructTransfer(resultValue);
    const resultMessage = {
        type: messages_1.WorkerMessageType.result,
        uid,
        complete: completed ? true : undefined,
        payload
    };
    implementation_1.default.postMessageToMaster(resultMessage, transferables);
}
function postJobStartMessage(uid, resultType) {
    const startMessage = {
        type: messages_1.WorkerMessageType.running,
        uid,
        resultType
    };
    implementation_1.default.postMessageToMaster(startMessage);
}
function postUncaughtErrorMessage(error) {
    try {
        const errorMessage = {
            type: messages_1.WorkerMessageType.uncaughtError,
            error: common_1.serialize(error)
        };
        implementation_1.default.postMessageToMaster(errorMessage);
    }
    catch (subError) {
        // tslint:disable-next-line no-console
        console.error("Not reporting uncaught error back to master thread as it " +
            "occured while reporting an uncaught error already." +
            "\nLatest error:", subError, "\nOriginal error:", error);
    }
}
function runFunction(jobUID, fn, args) {
    return __awaiter(this, void 0, void 0, function* () {
        let syncResult;
        try {
            syncResult = fn(...args);
        }
        catch (error) {
            return postJobErrorMessage(jobUID, error);
        }
        const resultType = isObservable(syncResult) ? "observable" : "promise";
        postJobStartMessage(jobUID, resultType);
        if (isObservable(syncResult)) {
            const subscription = syncResult.subscribe(value => postJobResultMessage(jobUID, false, common_1.serialize(value)), error => {
                postJobErrorMessage(jobUID, common_1.serialize(error));
                activeSubscriptions.delete(jobUID);
            }, () => {
                postJobResultMessage(jobUID, true);
                activeSubscriptions.delete(jobUID);
            });
            activeSubscriptions.set(jobUID, subscription);
        }
        else {
            try {
                const result = yield syncResult;
                postJobResultMessage(jobUID, true, common_1.serialize(result));
            }
            catch (error) {
                postJobErrorMessage(jobUID, common_1.serialize(error));
            }
        }
    });
}
/**
 * Expose a function or a module (an object whose values are functions)
 * to the main thread. Must be called exactly once in every worker thread
 * to signal its API to the main thread.
 *
 * @param exposed Function or object whose values are functions
 */
function expose(exposed) {
    if (!implementation_1.default.isWorkerRuntime()) {
        throw Error("expose() called in the master thread.");
    }
    if (exposeCalled) {
        throw Error("expose() called more than once. This is not possible. Pass an object to expose() if you want to expose multiple functions.");
    }
    exposeCalled = true;
    if (typeof exposed === "function") {
        implementation_1.default.subscribeToMasterMessages(messageData => {
            if (isMasterJobRunMessage(messageData) && !messageData.method) {
                runFunction(messageData.uid, exposed, messageData.args.map(common_1.deserialize));
            }
        });
        postFunctionInitMessage();
    }
    else if (typeof exposed === "object" && exposed) {
        implementation_1.default.subscribeToMasterMessages(messageData => {
            if (isMasterJobRunMessage(messageData) && messageData.method) {
                runFunction(messageData.uid, exposed[messageData.method], messageData.args.map(common_1.deserialize));
            }
        });
        const methodNames = Object.keys(exposed).filter(key => typeof exposed[key] === "function");
        postModuleInitMessage(methodNames);
    }
    else {
        throw Error(`Invalid argument passed to expose(). Expected a function or an object, got: ${exposed}`);
    }
    implementation_1.default.subscribeToMasterMessages(messageData => {
        if (isMasterJobCancelMessage(messageData)) {
            const jobUID = messageData.uid;
            const subscription = activeSubscriptions.get(jobUID);
            if (subscription) {
                subscription.unsubscribe();
                activeSubscriptions.delete(jobUID);
            }
        }
    });
}
exports.expose = expose;
if (typeof self !== "undefined" && typeof self.addEventListener === "function" && implementation_1.default.isWorkerRuntime()) {
    self.addEventListener("error", event => {
        // Post with some delay, so the master had some time to subscribe to messages
        setTimeout(() => postUncaughtErrorMessage(event.error || event), 250);
    });
    self.addEventListener("unhandledrejection", event => {
        const error = event.reason;
        if (error && typeof error.message === "string") {
            // Post with some delay, so the master had some time to subscribe to messages
            setTimeout(() => postUncaughtErrorMessage(error), 250);
        }
    });
}
if (typeof process !== "undefined" && typeof process.on === "function" && implementation_1.default.isWorkerRuntime()) {
    process.on("uncaughtException", (error) => {
        // Post with some delay, so the master had some time to subscribe to messages
        setTimeout(() => postUncaughtErrorMessage(error), 250);
    });
    process.on("unhandledRejection", (error) => {
        if (error && typeof error.message === "string") {
            // Post with some delay, so the master had some time to subscribe to messages
            setTimeout(() => postUncaughtErrorMessage(error), 250);
        }
    });
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ src_0)
});

;// CONCATENATED MODULE: ./node_modules/higlass-register/src/index.js
window.higlassTracks = window.higlassTracks || {};
window.higlassTracksByType = window.higlassTracksByType || {};

const getRandomName = () => Math.random().toString(36).substring(2, 8);

const register = (trackDef, { force = false } = {}) => {
  // The following is only needed for backward compatibility
  let name = getRandomName();
  while (window.higlassTracks[name]) {
    name = getRandomName();
  }

  trackDef.name = name;
  window.higlassTracks[trackDef.name] = trackDef;
  // backward compatibility: end

  if (window.higlassTracksByType[trackDef.config.type] && !force) {
    // eslint-disable-next-line
    console.warn(
      `A track with the same type (${trackDef.config.type}) was already ` +
      'registered. To override it, set force to true.',
    );
  } else {
    window.higlassTracksByType[trackDef.config.type] = trackDef;
  }
};

/* harmony default export */ const src = (register);

;// CONCATENATED MODULE: ./src/bam-fetcher.js
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var DEBOUNCE_TIME = 200;
var BAMDataFetcher = /*#__PURE__*/function () {
  function BAMDataFetcher(dataConfig, trackOptions, worker, HGC) {
    var _this = this;
    _classCallCheck(this, BAMDataFetcher);
    this.dataConfig = dataConfig;
    this.uid = HGC.libraries.slugid.nice();
    this.worker = worker;
    this.isServerFetcher = !(dataConfig.type && dataConfig.type === 'bam');
    this.prevRequestTime = 0;
    this.toFetch = new Set();
    this.fetchTimeout = null;
    this.initPromise = this.worker.then(function (tileFunctions) {
      if (_this.isServerFetcher) {
        return tileFunctions.serverInit(_this.uid, dataConfig.server, dataConfig.tilesetUid, HGC.services.authHeader).then(function () {
          return _this.worker;
        });
      }
      if (dataConfig.url && !dataConfig.bamUrl) {
        dataConfig["bamUrl"] = dataConfig.url;
      }
      if (!dataConfig.baiUrl) {
        dataConfig["baiUrl"] = dataConfig["bamUrl"] + ".bai";
      }
      return tileFunctions.init(_this.uid, dataConfig.bamUrl, dataConfig.baiUrl, dataConfig.fastaUrl, dataConfig.faiUrl, dataConfig.chromSizesUrl, dataConfig.options, trackOptions).then(function () {
        return _this.worker;
      });
    });
  }
  _createClass(BAMDataFetcher, [{
    key: "tilesetInfo",
    value: function tilesetInfo(callback) {
      var _this2 = this;
      this.worker.then(function (tileFunctions) {
        if (_this2.isServerFetcher) {
          tileFunctions.serverTilesetInfo(_this2.uid).then(callback);
        } else {
          tileFunctions.tilesetInfo(_this2.uid).then(callback);
        }
      });
    }
  }, {
    key: "fetchTilesDebounced",
    value: function fetchTilesDebounced(receivedTiles, tileIds) {
      var _this3 = this;
      var toFetch = this.toFetch;
      var thisZoomLevel = tileIds[0].split('.')[0];
      var toFetchZoomLevel = toFetch.size ? _toConsumableArray(toFetch)[0].split('.')[0] : null;
      if (thisZoomLevel !== toFetchZoomLevel) {
        var _iterator = _createForOfIteratorHelper(this.toFetch),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var tileId = _step.value;
            this.track.fetching["delete"](tileId);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        this.toFetch.clear();
      }
      tileIds.forEach(function (x) {
        return _this3.toFetch.add(x);
      });
      if (this.fetchTimeout) {
        clearTimeout(this.fetchTimeout);
      }
      this.fetchTimeout = setTimeout(function () {
        _this3.sendFetch(receivedTiles, _toConsumableArray(_this3.toFetch));
        _this3.toFetch.clear();
      }, DEBOUNCE_TIME);
    }
  }, {
    key: "sendFetch",
    value: function sendFetch(receivedTiles, tileIds) {
      var _this4 = this;
      this.track.updateLoadingText();
      this.worker.then(function (tileFunctions) {
        if (_this4.isServerFetcher) {
          tileFunctions.serverFetchTilesDebounced(_this4.uid, tileIds).then(receivedTiles);
        } else {
          tileFunctions.fetchTilesDebounced(_this4.uid, tileIds).then(receivedTiles);
        }
      });
    }
  }]);
  return BAMDataFetcher;
}();
/* harmony default export */ const bam_fetcher = (BAMDataFetcher);
// EXTERNAL MODULE: ./node_modules/threads/dist/index.js
var dist = __webpack_require__(734);
;// CONCATENATED MODULE: ./node_modules/threads/index.mjs


const registerSerializer = dist.registerSerializer
const spawn = dist.spawn
const BlobWorker = dist.BlobWorker
const DefaultSerializer = dist.DefaultSerializer
const Pool = dist.Pool
const Thread = dist.Thread
const Transfer = dist.Transfer
const Worker = dist.Worker

;// CONCATENATED MODULE: ./src/bam-utils.js
function bam_utils_typeof(o) { "@babel/helpers - typeof"; return bam_utils_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, bam_utils_typeof(o); }
function bam_utils_createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = bam_utils_unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = bam_utils_toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function bam_utils_toPropertyKey(arg) { var key = bam_utils_toPrimitive(arg, "string"); return bam_utils_typeof(key) === "symbol" ? key : String(key); }
function bam_utils_toPrimitive(input, hint) { if (bam_utils_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (bam_utils_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function bam_utils_toConsumableArray(arr) { return bam_utils_arrayWithoutHoles(arr) || bam_utils_iterableToArray(arr) || bam_utils_unsupportedIterableToArray(arr) || bam_utils_nonIterableSpread(); }
function bam_utils_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function bam_utils_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return bam_utils_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return bam_utils_arrayLikeToArray(o, minLen); }
function bam_utils_iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function bam_utils_arrayWithoutHoles(arr) { if (Array.isArray(arr)) return bam_utils_arrayLikeToArray(arr); }
function bam_utils_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var PILEUP_COLORS = {
  BG: [0.89, 0.89, 0.89, 1],
  // gray for the read background
  BG2: [0.85, 0.85, 0.85, 1],
  // used as alternating color in the read counter band
  BG_MUTED: [0.92, 0.92, 0.92, 1],
  // coverage background, when it is not exact
  A: [0, 0, 1, 1],
  // blue for A
  C: [1, 0, 0, 1],
  // red for c
  G: [0, 1, 0, 1],
  // green for g
  T: [1, 1, 0, 1],
  // yellow for T
  S: [0, 0, 0, 0.4],
  // lighter grey for soft clipping
  H: [0, 0, 0, 0.5],
  // darker grey for hard clipping
  X: [0, 0, 0, 0.7],
  // black for unknown
  I: [1, 0, 1, 0.5],
  // purple for insertions
  D: [1, 0.5, 0.5, 0.5],
  // pink-ish for deletions
  N: [1, 1, 1, 1],
  LARGE_INSERT_SIZE: [1, 0, 0, 1],
  // Red for read pairs with large insert size
  SMALL_INSERT_SIZE: [0, 0.24, 0.48, 1],
  // Dark blue for read pairs with small insert size
  LL: [0.15, 0.75, 0.75, 1],
  // cyan for Left-Left reads (see https://software.broadinstitute.org/software/igv/interpreting_pair_orientations)
  RR: [0.18, 0.24, 0.8, 1],
  // darker blue for Right-Right reads
  RL: [0, 0.5, 0.02, 1],
  // darker green for Right-Left reads
  WHITE: [1, 1, 1, 1],
  BLACK: [0, 0, 0, 1],
  BLACK_05: [0, 0, 0, 0.5],
  PLUS_STRAND: [0.75, 0.75, 1, 1],
  MINUS_STRAND: [1, 0.75, 0.75, 1],
  MM_M6A_FOR: [0.4, 0.2, 0.6, 1],
  // purple for m6A methylation events
  MM_M6A_REV: [0.4, 0.2, 0.6, 1],
  // purple for m6A methylation events
  MM_M5C_FOR: [1, 0, 0, 1],
  // red for CpG events
  MM_M5C_REV: [1, 0, 0, 1],
  // red for CpG events
  HIGHLIGHTS_CG: [0.95, 0.84, 0.84, 1],
  // CG highlights
  HIGHLIGHTS_A: [0.95, 0.89, 0.71, 1],
  // A highlights
  HIGHLIGHTS_T: [0.95, 0.89, 0.71, 1],
  // T highlights
  HIGHLIGHTS_G: [0.95, 0.84, 0.84, 1],
  // G highlights
  HIGHLIGHTS_C: [0.95, 0.84, 0.84, 1],
  // C highlights
  HIGHLIGHTS_MZEROA: [0.89, 0.84, 0.96, 1],
  // m0A highlights
  INDEX_DHS_BG: [0, 0, 0, 0]
};
var PILEUP_COLOR_IXS = {};
Object.keys(PILEUP_COLORS).map(function (x, i) {
  PILEUP_COLOR_IXS[x] = i;
  return null;
});
function replaceColorIdxs(newColorIdxs) {
  PILEUP_COLOR_IXS = newColorIdxs;
}
var hexToRGBRawTriplet = function hexToRGBRawTriplet(hex) {
  hex = hex.toUpperCase();
  var r = parseInt(hex.slice(1, 3), 16);
  var g = parseInt(hex.slice(3, 5), 16);
  var b = parseInt(hex.slice(5, 7), 16);
  return "".concat(r, ",").concat(g, ",").concat(b);
};
var indexDHSColors = function indexDHSColors(options) {
  if (!options.indexDHS) return {};
  // console.log(`options ${JSON.stringify(options)}`);
  // console.log(`options.indexDHS.itemRGBMap ${JSON.stringify(options.indexDHS.itemRGBMap)}`);]
  var colorTable = {};
  colorTable['INDEX_DHS_BG'] = [0, 0, 0, 0],
  // Index DHS background default
  Object.entries(options.indexDHS.itemRGBMap).map(function (o) {
    var k = o[0];
    // const v = o[1];
    var v = k.split(',').map(function (d) {
      return parseFloat((parseFloat(d) / 255).toFixed(2));
    });
    colorTable["INDEX_DHS_".concat(k)] = [].concat(bam_utils_toConsumableArray(v), [1.0]);
  });
  // console.log(`colorTable ${JSON.stringify(colorTable)}`);
  return _objectSpread(_objectSpread({}, PILEUP_COLORS), colorTable);
};
var cigarTypeToText = function cigarTypeToText(type) {
  if (type === 'D') {
    return 'Deletion';
  } else if (type === 'S') {
    return 'Soft clipping';
  } else if (type === 'H') {
    return 'Hard clipping';
  } else if (type === 'I') {
    return 'Insertion';
  } else if (type === 'N') {
    return 'Skipped region';
  }
  return type;
};
var parseMD = function parseMD(mdString, useCounts) {
  var currPos = 0;
  var currNum = 0;
  var deletionEncountered = false;
  var bamSeqShift = 0;
  var substitutions = [];
  for (var i = 0; i < mdString.length; i++) {
    if (mdString[i].match(/[0-9]/g)) {
      // a number, keep on going
      currNum = currNum * 10 + +mdString[i];
      deletionEncountered = false;
    } else if (mdString[i] === '^') {
      deletionEncountered = true;
    } else {
      currPos += currNum;
      if (useCounts) {
        substitutions.push({
          length: currNum,
          type: mdString[i]
        });
      } else if (deletionEncountered) {
        // Do nothing if there is a deletion and keep on going.
        // Note that there can be multiple deletions "^ATC"
        // Deletions are visualized using the CIGAR string
        // However, keep track of where in the bam seq we need to pull the variant.
        bamSeqShift -= 1;
      } else {
        substitutions.push({
          pos: currPos,
          base: mdString[i],
          length: 1,
          bamSeqShift: bamSeqShift
        });
      }
      currNum = 0;
      currPos += 1;
    }
  }
  return substitutions;
};

/**
 * Builds an array of all methylations in the segment, represented
 * as offsets from the 5' end of the sequence, using data available
 * in the read's MM and ML tags
 * 
 * ref. https://samtools.github.io/hts-specs/SAMtags.pdf
 * 
 * @param  {String} segment  Current segment
 * @param  {String} seq   Read sequence from bam file.
 * @param  {Boolean} alignCpGEvents  Align stranded CpG events at the methylation offset level.
 * @return {Array}  Methylation offsets.
 */
var getMethylationOffsets = function getMethylationOffsets(segment, seq, alignCpGEvents) {
  var methylationOffsets = [];
  var moSkeleton = {
    "unmodifiedBase": "",
    "code": "",
    "strand": "",
    "offsets": [],
    "probabilities": []
  };
  var getAllIndexes = function getAllIndexes(arr, val) {
    var indices = [],
      i;
    for (var _i = 0; _i < arr.length; ++_i) {
      if (arr[_i] === val) {
        indices.push(_i);
      }
    }
    return indices;
  };

  // include IUPAC degeneracies, to follow SAM specification
  var complementOf = {
    'A': 'T',
    'C': 'G',
    'G': 'C',
    'T': 'A',
    'U': 'A',
    'Y': 'R',
    'R': 'Y',
    'S': 'S',
    'W': 'W',
    'K': 'M',
    'M': 'K',
    'B': 'V',
    'V': 'B',
    'D': 'H',
    'H': 'D',
    'N': 'N'
  };
  // const reverseComplementString = (str) => str.split('').reduce((reversed, character) => complementOf[character] + reversed, '');
  // const reverseString = (str) => str.split('').reduce((reversed, character) => character + reversed, '');

  if (segment.mm && segment.ml) {
    var currentOffsetCount = 0;
    var baseModifications = segment.mm.split(';');
    var baseProbabilities = segment.ml.split(',');
    baseModifications.forEach(function (bm) {
      if (bm.length === 0) return;
      var mo = Object.assign({}, moSkeleton);
      var elems = bm.split(',');
      mo.unmodifiedBase = elems[0].charAt(0);
      mo.strand = elems[0].charAt(1);
      mo.code = elems[0].charAt(2);
      var nOffsets = elems.length - 1;
      var offsets = new Array(nOffsets);
      var probabilities = new Array(nOffsets);
      var baseIndices = segment.strand === '+' ? getAllIndexes(seq, mo.unmodifiedBase) : getAllIndexes(seq, complementOf[mo.unmodifiedBase]);

      //
      // build initial list of raw offsets
      //
      var offset = 0;
      if (segment.strand === '+') {
        for (var i = 1; i < elems.length; ++i) {
          var d = parseInt(elems[i]);
          offset += d;
          var strandedOffset = offset;
          var baseOffset = baseIndices[strandedOffset];
          var baseProbability = baseProbabilities[i - 1 + currentOffsetCount];
          offsets[i - 1] = baseOffset;
          probabilities[i - 1] = baseProbability;
          offset += 1;
        }
      } else {
        for (var _i2 = 1; _i2 < elems.length; ++_i2) {
          var _d = parseInt(elems[_i2]);
          offset += _d;
          var _strandedOffset = baseIndices.length - offset - 1;
          var _baseOffset = baseIndices[_strandedOffset];
          var _baseProbability = baseProbabilities[_i2 - 1 + currentOffsetCount];
          offsets[nOffsets - _i2] = _baseOffset; // reverse
          probabilities[nOffsets - _i2] = _baseProbability;
          offset += 1;
        }
      }

      //
      // shift reverse-stranded CpG events upstream by one bases
      //
      if (mo.unmodifiedBase === 'C' && segment.strand === '-' && alignCpGEvents) {
        for (var _i3 = 0; _i3 < nOffsets; ++_i3) {
          offsets[_i3] -= 1;
        }
      }

      //
      // modify raw offsets with CIGAR/substitution data
      //
      var offsetIdx = 0;
      var offsetModifier = 0;
      var clipLength = 0;
      var modifiedOffsets = new Array();
      var modifiedProbabilities = new Array();
      var _iterator = bam_utils_createForOfIteratorHelper(segment.substitutions),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var sub = _step.value;
          //
          // if the read starts or ends with soft or hard clipping
          //
          if (sub.type === 'S' || sub.type === 'H') {
            offsetModifier -= sub.length;
            clipLength = sub.length;
          }
          //
          // walk through offsets and include those less than the current substitution position
          //
          else if (sub.type === 'M' || sub.type === '=') {
            while (offsets[offsetIdx] + offsetModifier < sub.pos + sub.length) {
              if (offsets[offsetIdx] + offsetModifier >= sub.pos) {
                modifiedOffsets.push(offsets[offsetIdx] + offsetModifier - clipLength);
                modifiedProbabilities.push(probabilities[offsetIdx]);
              }
              offsetIdx++;
            }
          }
          //
          // filter out mismatches, else modify the offset padding
          //
          else if (sub.type === 'X') {
            if (offsets[offsetIdx] + offsetModifier === sub.pos) {
              offsetIdx++;
            }
          }
          //
          // handle substitution operations
          //
          else if (sub.type === 'D') {
            offsetModifier += sub.length;
          } else if (sub.type === 'I') {
            offsetModifier -= sub.length;
          } else if (sub.type === 'N') {
            offsetModifier += sub.length;
          }
          //
          // if the read ends with soft or hard clipping
          //
          if (sub.type === 'S' || sub.type === 'H') {
            offsetModifier += sub.length;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      ;
      mo.offsets = modifiedOffsets;
      mo.probabilities = modifiedProbabilities;

      // if (mo.unmodifiedBase === 'A') {
      //   console.log(`segment.substitutions ${JSON.stringify(segment.substitutions, null, 2)}`); 
      //   console.log(`${JSON.stringify(actions)}`);
      // }

      methylationOffsets.push(mo);
      currentOffsetCount += nOffsets;
    });
  }
  return methylationOffsets;
};

/**
 * Gets an array of all substitutions in the segment
 * @param  {String} segment  Current segment
 * @param  {String} seq   Read sequence from bam file.
 * @return {Boolean} includeClippingOps  Include soft or hard clipping operations in substitutions output.
 */
var getSubstitutions = function getSubstitutions(segment, seq, includeClippingOps) {
  var substitutions = [];
  var softClippingAtReadStart = null;
  if (segment.cigar) {
    var cigarSubs = parseMD(segment.cigar, true);
    var currPos = 0;
    var _iterator2 = bam_utils_createForOfIteratorHelper(cigarSubs),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var sub = _step2.value;
        if (includeClippingOps && (sub.type === 'S' || sub.type === 'H')) {
          substitutions.push({
            pos: currPos,
            length: sub.length,
            range: [currPos + segment.start, currPos + segment.start + sub.length],
            type: sub.type
          });
          currPos += sub.length;
        } else if (sub.type === 'X') {
          // sequence mismatch, no need to do anything
          substitutions.push({
            pos: currPos,
            length: sub.length,
            range: [currPos + segment.start, currPos + segment.start + sub.length],
            type: 'X'
          });
          currPos += sub.length;
        } else if (sub.type === 'I') {
          substitutions.push({
            pos: currPos,
            length: sub.length,
            range: [currPos + segment.start, currPos + segment.start + sub.length],
            type: 'I'
          });
          // currPos -= sub.length;
        } else if (sub.type === 'D') {
          substitutions.push({
            pos: currPos,
            length: sub.length,
            range: [currPos + segment.start, currPos + segment.start + sub.length],
            type: 'D'
          });
          currPos += sub.length;
        } else if (sub.type === 'N') {
          substitutions.push({
            pos: currPos,
            length: sub.length,
            range: [currPos + segment.start, currPos + segment.start + sub.length],
            type: 'N'
          });
          currPos += sub.length;
        } else if (sub.type === '=') {
          substitutions.push({
            pos: currPos,
            length: sub.length,
            range: [currPos + segment.start, currPos + segment.start + sub.length],
            type: '='
          });
          currPos += sub.length;
        } else if (sub.type === 'M') {
          substitutions.push({
            pos: currPos,
            length: sub.length,
            range: [currPos + segment.start, currPos + segment.start + sub.length],
            type: 'M'
          });
          currPos += sub.length;
        } else {
          // console.log('skipping:', sub.type);
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    var firstSub = cigarSubs[0];
    var lastSub = cigarSubs[cigarSubs.length - 1];

    // Soft clipping can happen at the beginning, at the end or both
    // positions are from the beginning of the read
    if (firstSub.type === 'S') {
      softClippingAtReadStart = firstSub;
      // soft clipping at the beginning
      substitutions.push({
        pos: -firstSub.length,
        type: 'S',
        length: firstSub.length
      });
    }
    // soft clipping at the end
    if (lastSub.type === 'S') {
      substitutions.push({
        pos: segment.to - segment.from,
        length: lastSub.length,
        type: 'S'
      });
    }

    // Hard clipping can happen at the beginning, at the end or both
    // positions are from the beginning of the read
    if (firstSub.type === 'H') {
      substitutions.push({
        pos: -firstSub.length,
        type: 'H',
        length: firstSub.length
      });
    }
    if (lastSub.type === 'H') {
      substitutions.push({
        pos: segment.to - segment.from,
        length: lastSub.length,
        type: 'H'
      });
    }
  }
  if (segment.md) {
    var mdSubstitutions = parseMD(segment.md, false);
    mdSubstitutions.forEach(function (substitution) {
      var posStart = substitution['pos'] + substitution['bamSeqShift'];
      var posEnd = posStart + substitution['length'];
      // When there is soft clipping at the beginning,
      // we need to shift the position where we read the variant from the sequence
      // not necessary when there is hard clipping
      if (softClippingAtReadStart !== null) {
        posStart += softClippingAtReadStart.length;
        posEnd += softClippingAtReadStart.length;
      }
      substitution['variant'] = seq.substring(posStart, posEnd);
      delete substitution['bamSeqShift'];
    });
    substitutions = mdSubstitutions.concat(substitutions);
  }
  return substitutions;
};

/**
 * Checks the track options and determines if mates need to be loaded
 */
var areMatesRequired = function areMatesRequired(trackOptions) {
  return trackOptions.highlightReadsBy.length > 0 || trackOptions.outlineMateOnHover;
};

/**
 * Calculates insert size between read segements
 */
var calculateInsertSize = function calculateInsertSize(segment1, segment2) {
  return segment1.from < segment2.from ? Math.max(0, segment2.from - segment1.to) : Math.max(0, segment1.from - segment2.to);
};
;// CONCATENATED MODULE: ./node_modules/raw-loader/dist/cjs.js!./dist/worker.js
/* harmony default export */ const cjs_js_dist_worker = ("function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }\nfunction _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }\nfunction _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\nfunction _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest(); }\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, \"prototype\", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\nfunction _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } else if (call !== void 0) { throw new TypeError(\"Derived constructors may only return object or undefined\"); } return _assertThisInitialized(self); }\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\nfunction _isNativeReflectConstruct() { if (typeof Reflect === \"undefined\" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === \"function\") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"next\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"throw\", err); } _next(undefined); }); }; }\nfunction _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }\nfunction _nonIterableSpread() { throw new TypeError(\"Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); }\nfunction _iterableToArray(iter) { if (typeof Symbol !== \"undefined\" && iter[Symbol.iterator] != null || iter[\"@@iterator\"] != null) return Array.from(iter); }\nfunction _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }\nfunction _regeneratorRuntime() { \"use strict\"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = \"function\" == typeof Symbol ? Symbol : {}, a = i.iterator || \"@@iterator\", c = i.asyncIterator || \"@@asyncIterator\", u = i.toStringTag || \"@@toStringTag\"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, \"\"); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, \"_invoke\", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: \"normal\", arg: t.call(e, r) }; } catch (t) { return { type: \"throw\", arg: t }; } } e.wrap = wrap; var h = \"suspendedStart\", l = \"suspendedYield\", f = \"executing\", s = \"completed\", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { [\"next\", \"throw\", \"return\"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if (\"throw\" !== c.type) { var u = c.arg, h = u.value; return h && \"object\" == _typeof(h) && n.call(h, \"__await\") ? e.resolve(h.__await).then(function (t) { invoke(\"next\", t, i, a); }, function (t) { invoke(\"throw\", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke(\"throw\", t, i, a); }); } a(c.arg); } var r; o(this, \"_invoke\", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error(\"Generator is already running\"); if (o === s) { if (\"throw\" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if (\"next\" === n.method) n.sent = n._sent = n.arg;else if (\"throw\" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else \"return\" === n.method && n.abrupt(\"return\", n.arg); o = f; var p = tryCatch(e, r, n); if (\"normal\" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } \"throw\" === p.type && (o = s, n.method = \"throw\", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, \"throw\" === n && e.iterator[\"return\"] && (r.method = \"return\", r.arg = t, maybeInvokeDelegate(e, r), \"throw\" === r.method) || \"return\" !== n && (r.method = \"throw\", r.arg = new TypeError(\"The iterator does not provide a '\" + n + \"' method\")), y; var i = tryCatch(o, e.iterator, r.arg); if (\"throw\" === i.type) return r.method = \"throw\", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, \"return\" !== r.method && (r.method = \"next\", r.arg = t), r.delegate = null, y) : a : (r.method = \"throw\", r.arg = new TypeError(\"iterator result is not an object\"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = \"normal\", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: \"root\" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || \"\" === e) { var r = e[a]; if (r) return r.call(e); if (\"function\" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + \" is not iterable\"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, \"constructor\", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, \"constructor\", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, \"GeneratorFunction\"), e.isGeneratorFunction = function (t) { var e = \"function\" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || \"GeneratorFunction\" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, \"GeneratorFunction\")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, \"Generator\"), define(g, a, function () { return this; }), define(g, \"toString\", function () { return \"[object Generator]\"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = \"next\", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) \"t\" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if (\"throw\" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = \"throw\", a.arg = e, r.next = n, o && (r.method = \"next\", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if (\"root\" === i.tryLoc) return handle(\"end\"); if (i.tryLoc <= this.prev) { var c = n.call(i, \"catchLoc\"), u = n.call(i, \"finallyLoc\"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error(\"try statement without catch or finally\"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, \"finallyLoc\") && this.prev < o.finallyLoc) { var i = o; break; } } i && (\"break\" === t || \"continue\" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = \"next\", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if (\"throw\" === t.type) throw t.arg; return \"break\" === t.type || \"continue\" === t.type ? this.next = t.arg : \"return\" === t.type ? (this.rval = this.arg = t.arg, this.method = \"return\", this.next = \"end\") : \"normal\" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, \"catch\": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if (\"throw\" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error(\"illegal catch attempt\"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, \"next\" === this.method && (this.arg = t), y; } }, e; }\nfunction _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }\nfunction _nonIterableRest() { throw new TypeError(\"Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); }\nfunction _iterableToArrayLimit(r, l) { var t = null == r ? null : \"undefined\" != typeof Symbol && r[Symbol.iterator] || r[\"@@iterator\"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t[\"return\"] && (u = t[\"return\"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }\nfunction _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }\nfunction _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== \"undefined\" && o[Symbol.iterator] || o[\"@@iterator\"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === \"number\") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e88) { throw _e88; }, f: F }; } throw new TypeError(\"Invalid attempt to iterate non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e89) { didErr = true; err = _e89; }, f: function f() { try { if (!normalCompletion && it[\"return\"] != null) it[\"return\"](); } finally { if (didErr) throw err; } } }; }\nfunction _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === \"string\") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === \"Object\" && o.constructor) n = o.constructor.name; if (n === \"Map\" || n === \"Set\") return Array.from(o); if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }\nfunction _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }\nfunction _typeof(o) { \"@babel/helpers - typeof\"; return _typeof = \"function\" == typeof Symbol && \"symbol\" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && \"function\" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? \"symbol\" : typeof o; }, _typeof(o); }\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, \"prototype\", { writable: false }); return Constructor; }\nfunction _toPropertyKey(arg) { var key = _toPrimitive(arg, \"string\"); return _typeof(key) === \"symbol\" ? key : String(key); }\nfunction _toPrimitive(input, hint) { if (_typeof(input) !== \"object\" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || \"default\"); if (_typeof(res) !== \"object\") return res; throw new TypeError(\"@@toPrimitive must return a primitive value.\"); } return (hint === \"string\" ? String : Number)(input); }\nfunction _wrapAsyncGenerator(fn) { return function () { return new _AsyncGenerator(fn.apply(this, arguments)); }; }\nfunction _AsyncGenerator(e) { var r, t; function resume(r, t) { try { var n = e[r](t), o = n.value, u = o instanceof _OverloadYield; Promise.resolve(u ? o.v : o).then(function (t) { if (u) { var i = \"return\" === r ? \"return\" : \"next\"; if (!o.k || t.done) return resume(i, t); t = e[i](t).value; } settle(n.done ? \"return\" : \"normal\", t); }, function (e) { resume(\"throw\", e); }); } catch (e) { settle(\"throw\", e); } } function settle(e, n) { switch (e) { case \"return\": r.resolve({ value: n, done: !0 }); break; case \"throw\": r.reject(n); break; default: r.resolve({ value: n, done: !1 }); } (r = r.next) ? resume(r.key, r.arg) : t = null; } this._invoke = function (e, n) { return new Promise(function (o, u) { var i = { key: e, arg: n, resolve: o, reject: u, next: null }; t ? t = t.next = i : (r = t = i, resume(e, n)); }); }, \"function\" != typeof e[\"return\"] && (this[\"return\"] = void 0); }\n_AsyncGenerator.prototype[\"function\" == typeof Symbol && Symbol.asyncIterator || \"@@asyncIterator\"] = function () { return this; }, _AsyncGenerator.prototype.next = function (e) { return this._invoke(\"next\", e); }, _AsyncGenerator.prototype[\"throw\"] = function (e) { return this._invoke(\"throw\", e); }, _AsyncGenerator.prototype[\"return\"] = function (e) { return this._invoke(\"return\", e); };\nfunction _awaitAsyncGenerator(e) { return new _OverloadYield(e, 0); }\nfunction _asyncGeneratorDelegate(t) { var e = {}, n = !1; function pump(e, r) { return n = !0, r = new Promise(function (n) { n(t[e](r)); }), { done: !1, value: new _OverloadYield(r, 1) }; } return e[\"undefined\" != typeof Symbol && Symbol.iterator || \"@@iterator\"] = function () { return this; }, e.next = function (t) { return n ? (n = !1, t) : pump(\"next\", t); }, \"function\" == typeof t[\"throw\"] && (e[\"throw\"] = function (t) { if (n) throw n = !1, t; return pump(\"throw\", t); }), \"function\" == typeof t[\"return\"] && (e[\"return\"] = function (t) { return n ? (n = !1, t) : pump(\"return\", t); }), e; }\nfunction _OverloadYield(t, e) { this.v = t, this.k = e; }\nfunction _asyncIterator(r) { var n, t, o, e = 2; for (\"undefined\" != typeof Symbol && (t = Symbol.asyncIterator, o = Symbol.iterator); e--;) { if (t && null != (n = r[t])) return n.call(r); if (o && null != (n = r[o])) return new AsyncFromSyncIterator(n.call(r)); t = \"@@asyncIterator\", o = \"@@iterator\"; } throw new TypeError(\"Object is not async iterable\"); }\nfunction AsyncFromSyncIterator(r) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + \" is not an object.\")); var n = r.done; return Promise.resolve(r.value).then(function (r) { return { value: r, done: n }; }); } return AsyncFromSyncIterator = function AsyncFromSyncIterator(r) { this.s = r, this.n = r.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function next() { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, \"return\": function _return(r) { var n = this.s[\"return\"]; return void 0 === n ? Promise.resolve({ value: r, done: !0 }) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments)); }, \"throw\": function _throw(r) { var n = this.s[\"return\"]; return void 0 === n ? Promise.reject(r) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(r); }\n/*! For license information please see worker.js.LICENSE.txt */\n(function () {\n  var t = {\n      7036: function _(t, e, n) {\n        \"use strict\";\n\n        var r = this && this.__importDefault || function (t) {\n          return t && t.__esModule ? t : {\n            \"default\": t\n          };\n        };\n        Object.defineProperty(e, \"__esModule\", {\n          value: !0\n        });\n        var i = n(4950),\n          s = r(n(5389)),\n          o = r(n(4697));\n        var a = /*#__PURE__*/function () {\n          function a(_ref) {\n            var t = _ref.fill,\n              e = _ref.cache;\n            _classCallCheck(this, a);\n            if (\"function\" != typeof t) throw new TypeError(\"must pass a fill function\");\n            if (\"object\" != _typeof(e)) throw new TypeError(\"must pass a cache object\");\n            if (\"function\" != typeof e.get || \"function\" != typeof e.set || \"function\" != typeof e[\"delete\"]) throw new TypeError(\"cache must implement get(key), set(key, val), and and delete(key)\");\n            this.cache = e, this.fillCallback = t;\n          }\n          _createClass(a, [{\n            key: \"evict\",\n            value: function evict(t, e) {\n              this.cache.get(t) === e && this.cache[\"delete\"](t);\n            }\n          }, {\n            key: \"fill\",\n            value: function fill(t, e, n, r) {\n              var _this3 = this;\n              var i = new s[\"default\"](),\n                _a = new o[\"default\"]();\n              _a.addCallback(r);\n              var l = {\n                aborter: i,\n                promise: this.fillCallback(e, i.signal, function (t) {\n                  _a.callback(t);\n                }),\n                settled: !1,\n                statusReporter: _a,\n                get aborted() {\n                  return this.aborter.signal.aborted;\n                }\n              };\n              l.aborter.addSignal(n), l.aborter.signal.addEventListener(\"abort\", function () {\n                l.settled || _this3.evict(t, l);\n              }), l.promise.then(function () {\n                l.settled = !0;\n              }, function () {\n                l.settled = !0, _this3.evict(t, l);\n              })[\"catch\"](function (t) {\n                throw console.error(t), t;\n              }), this.cache.set(t, l);\n            }\n          }, {\n            key: \"has\",\n            value: function has(t) {\n              return this.cache.has(t);\n            }\n          }, {\n            key: \"get\",\n            value: function get(t, e, n, r) {\n              if (!n && e instanceof i.AbortSignal) throw new TypeError(\"second get argument appears to be an AbortSignal, perhaps you meant to pass `null` for the fill data?\");\n              var s = this.cache.get(t);\n              return s ? s.aborted && !s.settled ? (this.evict(t, s), this.get(t, e, n, r)) : s.settled ? s.promise : (s.aborter.addSignal(n), s.statusReporter.addCallback(r), a.checkSinglePromise(s.promise, n)) : (this.fill(t, e, n, r), a.checkSinglePromise(this.cache.get(t).promise, n));\n            }\n          }, {\n            key: \"delete\",\n            value: function _delete(t) {\n              var e = this.cache.get(t);\n              e && (e.settled || e.aborter.abort(), this.cache[\"delete\"](t));\n            }\n          }, {\n            key: \"clear\",\n            value: function clear() {\n              var t = this.cache.keys();\n              var e = 0;\n              for (var _n2 = t.next(); !_n2.done; _n2 = t.next()) this[\"delete\"](_n2.value), e += 1;\n              return e;\n            }\n          }], [{\n            key: \"isAbortException\",\n            value: function isAbortException(t) {\n              return \"AbortError\" === t.name || \"ERR_ABORTED\" === t.code || \"AbortError: aborted\" === t.message || \"Error: aborted\" === t.message;\n            }\n          }, {\n            key: \"checkSinglePromise\",\n            value: function checkSinglePromise(t, e) {\n              function n() {\n                if (e && e.aborted) throw Object.assign(new Error(\"aborted\"), {\n                  code: \"ERR_ABORTED\"\n                });\n              }\n              return t.then(function (t) {\n                return n(), t;\n              }, function (t) {\n                throw n(), t;\n              });\n            }\n          }]);\n          return a;\n        }();\n        e[\"default\"] = a;\n      },\n      5389: function _(t, e, n) {\n        \"use strict\";\n\n        Object.defineProperty(e, \"__esModule\", {\n          value: !0\n        });\n        var r = n(4950);\n        var i = /*#__PURE__*/_createClass(function i() {\n          _classCallCheck(this, i);\n        });\n        e[\"default\"] = /*#__PURE__*/function () {\n          function _class() {\n            _classCallCheck(this, _class);\n            this.signals = new Set(), this.abortController = new r.AbortController();\n          }\n          _createClass(_class, [{\n            key: \"addSignal\",\n            value: function addSignal() {\n              var _this4 = this;\n              var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new i();\n              if (this.signal.aborted) throw new Error(\"cannot add a signal, already aborted!\");\n              this.signals.add(t), t.aborted ? this.handleAborted(t) : \"function\" == typeof t.addEventListener && t.addEventListener(\"abort\", function () {\n                _this4.handleAborted(t);\n              });\n            }\n          }, {\n            key: \"handleAborted\",\n            value: function handleAborted(t) {\n              this.signals[\"delete\"](t), 0 === this.signals.size && this.abortController.abort();\n            }\n          }, {\n            key: \"signal\",\n            get: function get() {\n              return this.abortController.signal;\n            }\n          }, {\n            key: \"abort\",\n            value: function abort() {\n              this.abortController.abort();\n            }\n          }]);\n          return _class;\n        }();\n      },\n      4697: function _(t, e) {\n        \"use strict\";\n\n        Object.defineProperty(e, \"__esModule\", {\n          value: !0\n        }), e[\"default\"] = /*#__PURE__*/function () {\n          function _class2() {\n            _classCallCheck(this, _class2);\n            this.callbacks = new Set();\n          }\n          _createClass(_class2, [{\n            key: \"addCallback\",\n            value: function addCallback() {\n              var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};\n              this.callbacks.add(t), t(this.currentMessage);\n            }\n          }, {\n            key: \"callback\",\n            value: function callback(t) {\n              this.currentMessage = t, this.callbacks.forEach(function (e) {\n                e(t);\n              });\n            }\n          }]);\n          return _class2;\n        }();\n      },\n      4950: function _(t, e, n) {\n        \"use strict\";\n\n        Object.defineProperty(e, \"__esModule\", {\n          value: !0\n        }), e.AbortSignal = e.AbortController = void 0;\n        var r = n(1730);\n        var i = function i() {\n          if (\"undefined\" != typeof self) return self;\n          if (\"undefined\" != typeof window) return window;\n          if (void 0 !== n.g) return n.g;\n          throw new Error(\"unable to locate global object\");\n        };\n        var s = void 0 === i().AbortController ? r.AbortController : i().AbortController;\n        e.AbortController = s;\n        var o = void 0 === i().AbortController ? r.AbortSignal : i().AbortSignal;\n        e.AbortSignal = o;\n      },\n      5237: function _(t, e, n) {\n        \"use strict\";\n\n        var r = this && this.__importDefault || function (t) {\n          return t && t.__esModule ? t : {\n            \"default\": t\n          };\n        };\n        Object.defineProperty(e, \"__esModule\", {\n          value: !0\n        });\n        var i = r(n(7036));\n        e[\"default\"] = i[\"default\"];\n      },\n      1730: function _(t, e) {\n        \"use strict\";\n\n        function n(t, e) {\n          if (!(t instanceof e)) throw new TypeError(\"Cannot call a class as a function\");\n        }\n        function r(t, e) {\n          for (var n = 0; n < e.length; n++) {\n            var r = e[n];\n            r.enumerable = r.enumerable || !1, r.configurable = !0, \"value\" in r && (r.writable = !0), Object.defineProperty(t, r.key, r);\n          }\n        }\n        function i(t, e, n) {\n          return e && r(t.prototype, e), n && r(t, n), Object.defineProperty(t, \"prototype\", {\n            writable: !1\n          }), t;\n        }\n        function s(t) {\n          return s = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) {\n            return t.__proto__ || Object.getPrototypeOf(t);\n          }, s(t);\n        }\n        function o(t, e) {\n          return o = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {\n            return t.__proto__ = e, t;\n          }, o(t, e);\n        }\n        function a(t) {\n          if (void 0 === t) throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");\n          return t;\n        }\n        function l() {\n          return l = \"undefined\" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function (t, e, n) {\n            var r = function (t, e) {\n              for (; !Object.prototype.hasOwnProperty.call(t, e) && null !== (t = s(t)););\n              return t;\n            }(t, e);\n            if (r) {\n              var i = Object.getOwnPropertyDescriptor(r, e);\n              return i.get ? i.get.call(arguments.length < 3 ? t : n) : i.value;\n            }\n          }, l.apply(this, arguments);\n        }\n        Object.defineProperty(e, \"__esModule\", {\n          value: !0\n        });\n        var h = function () {\n            function t() {\n              n(this, t), Object.defineProperty(this, \"listeners\", {\n                value: {},\n                writable: !0,\n                configurable: !0\n              });\n            }\n            return i(t, [{\n              key: \"addEventListener\",\n              value: function value(t, e, n) {\n                t in this.listeners || (this.listeners[t] = []), this.listeners[t].push({\n                  callback: e,\n                  options: n\n                });\n              }\n            }, {\n              key: \"removeEventListener\",\n              value: function value(t, e) {\n                if (t in this.listeners) for (var n = this.listeners[t], r = 0, i = n.length; r < i; r++) if (n[r].callback === e) return void n.splice(r, 1);\n              }\n            }, {\n              key: \"dispatchEvent\",\n              value: function value(t) {\n                var _this5 = this;\n                if (t.type in this.listeners) {\n                  var _loop = function _loop() {\n                      i = e[n];\n                      try {\n                        i.callback.call(_this5, t);\n                      } catch (t) {\n                        Promise.resolve().then(function () {\n                          throw t;\n                        });\n                      }\n                      i.options && i.options.once && _this5.removeEventListener(t.type, i.callback);\n                    },\n                    i;\n                  for (var e = this.listeners[t.type].slice(), n = 0, r = e.length; n < r; n++) {\n                    _loop();\n                  }\n                  return !t.defaultPrevented;\n                }\n              }\n            }]), t;\n          }(),\n          u = function (t) {\n            !function (t, e) {\n              if (\"function\" != typeof e && null !== e) throw new TypeError(\"Super expression must either be null or a function\");\n              t.prototype = Object.create(e && e.prototype, {\n                constructor: {\n                  value: t,\n                  writable: !0,\n                  configurable: !0\n                }\n              }), Object.defineProperty(t, \"prototype\", {\n                writable: !1\n              }), e && o(t, e);\n            }(f, t);\n            var e,\n              r,\n              u = (e = f, r = function () {\n                if (\"undefined\" == typeof Reflect || !Reflect.construct) return !1;\n                if (Reflect.construct.sham) return !1;\n                if (\"function\" == typeof Proxy) return !0;\n                try {\n                  return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})), !0;\n                } catch (t) {\n                  return !1;\n                }\n              }(), function () {\n                var t,\n                  n = s(e);\n                if (r) {\n                  var i = s(this).constructor;\n                  t = Reflect.construct(n, arguments, i);\n                } else t = n.apply(this, arguments);\n                return function (t, e) {\n                  if (e && (\"object\" == _typeof(e) || \"function\" == typeof e)) return e;\n                  if (void 0 !== e) throw new TypeError(\"Derived constructors may only return object or undefined\");\n                  return a(t);\n                }(this, t);\n              });\n            function f() {\n              var t;\n              return n(this, f), (t = u.call(this)).listeners || h.call(a(t)), Object.defineProperty(a(t), \"aborted\", {\n                value: !1,\n                writable: !0,\n                configurable: !0\n              }), Object.defineProperty(a(t), \"onabort\", {\n                value: null,\n                writable: !0,\n                configurable: !0\n              }), Object.defineProperty(a(t), \"reason\", {\n                value: void 0,\n                writable: !0,\n                configurable: !0\n              }), t;\n            }\n            return i(f, [{\n              key: \"toString\",\n              value: function value() {\n                return \"[object AbortSignal]\";\n              }\n            }, {\n              key: \"dispatchEvent\",\n              value: function value(t) {\n                \"abort\" === t.type && (this.aborted = !0, \"function\" == typeof this.onabort && this.onabort.call(this, t)), l(s(f.prototype), \"dispatchEvent\", this).call(this, t);\n              }\n            }]), f;\n          }(h),\n          f = function () {\n            function t() {\n              n(this, t), Object.defineProperty(this, \"signal\", {\n                value: new u(),\n                writable: !0,\n                configurable: !0\n              });\n            }\n            return i(t, [{\n              key: \"abort\",\n              value: function value(t) {\n                var e;\n                try {\n                  e = new Event(\"abort\");\n                } catch (t) {\n                  \"undefined\" != typeof document ? document.createEvent ? (e = document.createEvent(\"Event\")).initEvent(\"abort\", !1, !1) : (e = document.createEventObject()).type = \"abort\" : e = {\n                    type: \"abort\",\n                    bubbles: !1,\n                    cancelable: !1\n                  };\n                }\n                var n = t;\n                if (void 0 === n) if (\"undefined\" == typeof document) (n = new Error(\"This operation was aborted\")).name = \"AbortError\";else try {\n                  n = new DOMException(\"signal is aborted without reason\");\n                } catch (t) {\n                  (n = new Error(\"This operation was aborted\")).name = \"AbortError\";\n                }\n                this.signal.reason = n, this.signal.dispatchEvent(e);\n              }\n            }, {\n              key: \"toString\",\n              value: function value() {\n                return \"[object AbortController]\";\n              }\n            }]), t;\n          }();\n        \"undefined\" != typeof Symbol && Symbol.toStringTag && (f.prototype[Symbol.toStringTag] = \"AbortController\", u.prototype[Symbol.toStringTag] = \"AbortSignal\"), e.AbortController = f, e.AbortSignal = u, e.abortableFetch = function (t) {\n          \"function\" == typeof t && (t = {\n            fetch: t\n          });\n          var e = t,\n            n = e.fetch,\n            r = e.Request,\n            i = void 0 === r ? n.Request : r,\n            s = e.AbortController,\n            o = e.__FORCE_INSTALL_ABORTCONTROLLER_POLYFILL,\n            a = void 0 !== o && o;\n          if (!function (t) {\n            return t.__FORCE_INSTALL_ABORTCONTROLLER_POLYFILL ? (console.log(\"__FORCE_INSTALL_ABORTCONTROLLER_POLYFILL=true is set, will force install polyfill\"), !0) : \"function\" == typeof t.Request && !t.Request.prototype.hasOwnProperty(\"signal\") || !t.AbortController;\n          }({\n            fetch: n,\n            Request: i,\n            AbortController: s,\n            __FORCE_INSTALL_ABORTCONTROLLER_POLYFILL: a\n          })) return {\n            fetch: n,\n            Request: l\n          };\n          var l = i;\n          (l && !l.prototype.hasOwnProperty(\"signal\") || a) && ((l = function l(t, e) {\n            var n;\n            e && e.signal && (n = e.signal, delete e.signal);\n            var r = new i(t, e);\n            return n && Object.defineProperty(r, \"signal\", {\n              writable: !1,\n              enumerable: !1,\n              configurable: !0,\n              value: n\n            }), r;\n          }).prototype = i.prototype);\n          var h = n;\n          return {\n            fetch: function fetch(t, e) {\n              var n = l && l.prototype.isPrototypeOf(t) ? t.signal : e ? e.signal : void 0;\n              if (n) {\n                var r;\n                try {\n                  r = new DOMException(\"Aborted\", \"AbortError\");\n                } catch (t) {\n                  (r = new Error(\"Aborted\")).name = \"AbortError\";\n                }\n                if (n.aborted) return Promise.reject(r);\n                var i = new Promise(function (t, e) {\n                  n.addEventListener(\"abort\", function () {\n                    return e(r);\n                  }, {\n                    once: !0\n                  });\n                });\n                return e && e.signal && delete e.signal, Promise.race([i, h(t, e)]);\n              }\n              return h(t, e);\n            },\n            Request: l\n          };\n        };\n      },\n      8806: function _(t) {\n        t.exports = n;\n        var e = null;\n        try {\n          e = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 13, 2, 96, 0, 1, 127, 96, 4, 127, 127, 127, 127, 1, 127, 3, 7, 6, 0, 1, 1, 1, 1, 1, 6, 6, 1, 127, 1, 65, 0, 11, 7, 50, 6, 3, 109, 117, 108, 0, 1, 5, 100, 105, 118, 95, 115, 0, 2, 5, 100, 105, 118, 95, 117, 0, 3, 5, 114, 101, 109, 95, 115, 0, 4, 5, 114, 101, 109, 95, 117, 0, 5, 8, 103, 101, 116, 95, 104, 105, 103, 104, 0, 0, 10, 191, 1, 6, 4, 0, 35, 0, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 126, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 127, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 128, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 129, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 130, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11])), {}).exports;\n        } catch (t) {}\n        function n(t, e, n) {\n          this.low = 0 | t, this.high = 0 | e, this.unsigned = !!n;\n        }\n        function r(t) {\n          return !0 === (t && t.__isLong__);\n        }\n        n.prototype.__isLong__, Object.defineProperty(n.prototype, \"__isLong__\", {\n          value: !0\n        }), n.isLong = r;\n        var i = {},\n          s = {};\n        function o(t, e) {\n          var n, r, o;\n          return e ? (o = 0 <= (t >>>= 0) && t < 256) && (r = s[t]) ? r : (n = l(t, (0 | t) < 0 ? -1 : 0, !0), o && (s[t] = n), n) : (o = -128 <= (t |= 0) && t < 128) && (r = i[t]) ? r : (n = l(t, t < 0 ? -1 : 0, !1), o && (i[t] = n), n);\n        }\n        function a(t, e) {\n          if (isNaN(t)) return e ? _ : m;\n          if (e) {\n            if (t < 0) return _;\n            if (t >= d) return k;\n          } else {\n            if (t <= -g) return x;\n            if (t + 1 >= g) return v;\n          }\n          return t < 0 ? a(-t, e).neg() : l(t % c | 0, t / c | 0, e);\n        }\n        function l(t, e, r) {\n          return new n(t, e, r);\n        }\n        n.fromInt = o, n.fromNumber = a, n.fromBits = l;\n        var h = Math.pow;\n        function u(t, e, n) {\n          if (0 === t.length) throw Error(\"empty string\");\n          if (\"NaN\" === t || \"Infinity\" === t || \"+Infinity\" === t || \"-Infinity\" === t) return m;\n          if (\"number\" == typeof e ? (n = e, e = !1) : e = !!e, (n = n || 10) < 2 || 36 < n) throw RangeError(\"radix\");\n          var r;\n          if ((r = t.indexOf(\"-\")) > 0) throw Error(\"interior hyphen\");\n          if (0 === r) return u(t.substring(1), e, n).neg();\n          for (var i = a(h(n, 8)), s = m, o = 0; o < t.length; o += 8) {\n            var l = Math.min(8, t.length - o),\n              f = parseInt(t.substring(o, o + l), n);\n            if (l < 8) {\n              var c = a(h(n, l));\n              s = s.mul(c).add(a(f));\n            } else s = (s = s.mul(i)).add(a(f));\n          }\n          return s.unsigned = e, s;\n        }\n        function f(t, e) {\n          return \"number\" == typeof t ? a(t, e) : \"string\" == typeof t ? u(t, e) : l(t.low, t.high, \"boolean\" == typeof e ? e : t.unsigned);\n        }\n        n.fromString = u, n.fromValue = f;\n        var c = 4294967296,\n          d = c * c,\n          g = d / 2,\n          p = o(1 << 24),\n          m = o(0);\n        n.ZERO = m;\n        var _ = o(0, !0);\n        n.UZERO = _;\n        var b = o(1);\n        n.ONE = b;\n        var w = o(1, !0);\n        n.UONE = w;\n        var y = o(-1);\n        n.NEG_ONE = y;\n        var v = l(-1, 2147483647, !1);\n        n.MAX_VALUE = v;\n        var k = l(-1, -1, !0);\n        n.MAX_UNSIGNED_VALUE = k;\n        var x = l(0, -2147483648, !1);\n        n.MIN_VALUE = x;\n        var E = n.prototype;\n        E.toInt = function () {\n          return this.unsigned ? this.low >>> 0 : this.low;\n        }, E.toNumber = function () {\n          return this.unsigned ? (this.high >>> 0) * c + (this.low >>> 0) : this.high * c + (this.low >>> 0);\n        }, E.toString = function (t) {\n          if ((t = t || 10) < 2 || 36 < t) throw RangeError(\"radix\");\n          if (this.isZero()) return \"0\";\n          if (this.isNegative()) {\n            if (this.eq(x)) {\n              var e = a(t),\n                n = this.div(e),\n                r = n.mul(e).sub(this);\n              return n.toString(t) + r.toInt().toString(t);\n            }\n            return \"-\" + this.neg().toString(t);\n          }\n          for (var i = a(h(t, 6), this.unsigned), s = this, o = \"\";;) {\n            var l = s.div(i),\n              u = (s.sub(l.mul(i)).toInt() >>> 0).toString(t);\n            if ((s = l).isZero()) return u + o;\n            for (; u.length < 6;) u = \"0\" + u;\n            o = \"\" + u + o;\n          }\n        }, E.getHighBits = function () {\n          return this.high;\n        }, E.getHighBitsUnsigned = function () {\n          return this.high >>> 0;\n        }, E.getLowBits = function () {\n          return this.low;\n        }, E.getLowBitsUnsigned = function () {\n          return this.low >>> 0;\n        }, E.getNumBitsAbs = function () {\n          if (this.isNegative()) return this.eq(x) ? 64 : this.neg().getNumBitsAbs();\n          for (var t = 0 != this.high ? this.high : this.low, e = 31; e > 0 && 0 == (t & 1 << e); e--);\n          return 0 != this.high ? e + 33 : e + 1;\n        }, E.isZero = function () {\n          return 0 === this.high && 0 === this.low;\n        }, E.eqz = E.isZero, E.isNegative = function () {\n          return !this.unsigned && this.high < 0;\n        }, E.isPositive = function () {\n          return this.unsigned || this.high >= 0;\n        }, E.isOdd = function () {\n          return 1 == (1 & this.low);\n        }, E.isEven = function () {\n          return 0 == (1 & this.low);\n        }, E.equals = function (t) {\n          return r(t) || (t = f(t)), (this.unsigned === t.unsigned || this.high >>> 31 != 1 || t.high >>> 31 != 1) && this.high === t.high && this.low === t.low;\n        }, E.eq = E.equals, E.notEquals = function (t) {\n          return !this.eq(t);\n        }, E.neq = E.notEquals, E.ne = E.notEquals, E.lessThan = function (t) {\n          return this.comp(t) < 0;\n        }, E.lt = E.lessThan, E.lessThanOrEqual = function (t) {\n          return this.comp(t) <= 0;\n        }, E.lte = E.lessThanOrEqual, E.le = E.lessThanOrEqual, E.greaterThan = function (t) {\n          return this.comp(t) > 0;\n        }, E.gt = E.greaterThan, E.greaterThanOrEqual = function (t) {\n          return this.comp(t) >= 0;\n        }, E.gte = E.greaterThanOrEqual, E.ge = E.greaterThanOrEqual, E.compare = function (t) {\n          if (r(t) || (t = f(t)), this.eq(t)) return 0;\n          var e = this.isNegative(),\n            n = t.isNegative();\n          return e && !n ? -1 : !e && n ? 1 : this.unsigned ? t.high >>> 0 > this.high >>> 0 || t.high === this.high && t.low >>> 0 > this.low >>> 0 ? -1 : 1 : this.sub(t).isNegative() ? -1 : 1;\n        }, E.comp = E.compare, E.negate = function () {\n          return !this.unsigned && this.eq(x) ? x : this.not().add(b);\n        }, E.neg = E.negate, E.add = function (t) {\n          r(t) || (t = f(t));\n          var e = this.high >>> 16,\n            n = 65535 & this.high,\n            i = this.low >>> 16,\n            s = 65535 & this.low,\n            o = t.high >>> 16,\n            a = 65535 & t.high,\n            h = t.low >>> 16,\n            u = 0,\n            c = 0,\n            d = 0,\n            g = 0;\n          return d += (g += s + (65535 & t.low)) >>> 16, c += (d += i + h) >>> 16, u += (c += n + a) >>> 16, u += e + o, l((d &= 65535) << 16 | (g &= 65535), (u &= 65535) << 16 | (c &= 65535), this.unsigned);\n        }, E.subtract = function (t) {\n          return r(t) || (t = f(t)), this.add(t.neg());\n        }, E.sub = E.subtract, E.multiply = function (t) {\n          if (this.isZero()) return m;\n          if (r(t) || (t = f(t)), e) return l(e.mul(this.low, this.high, t.low, t.high), e.get_high(), this.unsigned);\n          if (t.isZero()) return m;\n          if (this.eq(x)) return t.isOdd() ? x : m;\n          if (t.eq(x)) return this.isOdd() ? x : m;\n          if (this.isNegative()) return t.isNegative() ? this.neg().mul(t.neg()) : this.neg().mul(t).neg();\n          if (t.isNegative()) return this.mul(t.neg()).neg();\n          if (this.lt(p) && t.lt(p)) return a(this.toNumber() * t.toNumber(), this.unsigned);\n          var n = this.high >>> 16,\n            i = 65535 & this.high,\n            s = this.low >>> 16,\n            o = 65535 & this.low,\n            h = t.high >>> 16,\n            u = 65535 & t.high,\n            c = t.low >>> 16,\n            d = 65535 & t.low,\n            g = 0,\n            _ = 0,\n            b = 0,\n            w = 0;\n          return b += (w += o * d) >>> 16, _ += (b += s * d) >>> 16, b &= 65535, _ += (b += o * c) >>> 16, g += (_ += i * d) >>> 16, _ &= 65535, g += (_ += s * c) >>> 16, _ &= 65535, g += (_ += o * u) >>> 16, g += n * d + i * c + s * u + o * h, l((b &= 65535) << 16 | (w &= 65535), (g &= 65535) << 16 | (_ &= 65535), this.unsigned);\n        }, E.mul = E.multiply, E.divide = function (t) {\n          if (r(t) || (t = f(t)), t.isZero()) throw Error(\"division by zero\");\n          var n, i, s;\n          if (e) return this.unsigned || -2147483648 !== this.high || -1 !== t.low || -1 !== t.high ? l((this.unsigned ? e.div_u : e.div_s)(this.low, this.high, t.low, t.high), e.get_high(), this.unsigned) : this;\n          if (this.isZero()) return this.unsigned ? _ : m;\n          if (this.unsigned) {\n            if (t.unsigned || (t = t.toUnsigned()), t.gt(this)) return _;\n            if (t.gt(this.shru(1))) return w;\n            s = _;\n          } else {\n            if (this.eq(x)) return t.eq(b) || t.eq(y) ? x : t.eq(x) ? b : (n = this.shr(1).div(t).shl(1)).eq(m) ? t.isNegative() ? b : y : (i = this.sub(t.mul(n)), s = n.add(i.div(t)));\n            if (t.eq(x)) return this.unsigned ? _ : m;\n            if (this.isNegative()) return t.isNegative() ? this.neg().div(t.neg()) : this.neg().div(t).neg();\n            if (t.isNegative()) return this.div(t.neg()).neg();\n            s = m;\n          }\n          for (i = this; i.gte(t);) {\n            n = Math.max(1, Math.floor(i.toNumber() / t.toNumber()));\n            for (var o = Math.ceil(Math.log(n) / Math.LN2), u = o <= 48 ? 1 : h(2, o - 48), c = a(n), d = c.mul(t); d.isNegative() || d.gt(i);) d = (c = a(n -= u, this.unsigned)).mul(t);\n            c.isZero() && (c = b), s = s.add(c), i = i.sub(d);\n          }\n          return s;\n        }, E.div = E.divide, E.modulo = function (t) {\n          return r(t) || (t = f(t)), e ? l((this.unsigned ? e.rem_u : e.rem_s)(this.low, this.high, t.low, t.high), e.get_high(), this.unsigned) : this.sub(this.div(t).mul(t));\n        }, E.mod = E.modulo, E.rem = E.modulo, E.not = function () {\n          return l(~this.low, ~this.high, this.unsigned);\n        }, E.and = function (t) {\n          return r(t) || (t = f(t)), l(this.low & t.low, this.high & t.high, this.unsigned);\n        }, E.or = function (t) {\n          return r(t) || (t = f(t)), l(this.low | t.low, this.high | t.high, this.unsigned);\n        }, E.xor = function (t) {\n          return r(t) || (t = f(t)), l(this.low ^ t.low, this.high ^ t.high, this.unsigned);\n        }, E.shiftLeft = function (t) {\n          return r(t) && (t = t.toInt()), 0 == (t &= 63) ? this : t < 32 ? l(this.low << t, this.high << t | this.low >>> 32 - t, this.unsigned) : l(0, this.low << t - 32, this.unsigned);\n        }, E.shl = E.shiftLeft, E.shiftRight = function (t) {\n          return r(t) && (t = t.toInt()), 0 == (t &= 63) ? this : t < 32 ? l(this.low >>> t | this.high << 32 - t, this.high >> t, this.unsigned) : l(this.high >> t - 32, this.high >= 0 ? 0 : -1, this.unsigned);\n        }, E.shr = E.shiftRight, E.shiftRightUnsigned = function (t) {\n          if (r(t) && (t = t.toInt()), 0 == (t &= 63)) return this;\n          var e = this.high;\n          return t < 32 ? l(this.low >>> t | e << 32 - t, e >>> t, this.unsigned) : l(32 === t ? e : e >>> t - 32, 0, this.unsigned);\n        }, E.shru = E.shiftRightUnsigned, E.shr_u = E.shiftRightUnsigned, E.toSigned = function () {\n          return this.unsigned ? l(this.low, this.high, !1) : this;\n        }, E.toUnsigned = function () {\n          return this.unsigned ? this : l(this.low, this.high, !0);\n        }, E.toBytes = function (t) {\n          return t ? this.toBytesLE() : this.toBytesBE();\n        }, E.toBytesLE = function () {\n          var t = this.high,\n            e = this.low;\n          return [255 & e, e >>> 8 & 255, e >>> 16 & 255, e >>> 24, 255 & t, t >>> 8 & 255, t >>> 16 & 255, t >>> 24];\n        }, E.toBytesBE = function () {\n          var t = this.high,\n            e = this.low;\n          return [t >>> 24, t >>> 16 & 255, t >>> 8 & 255, 255 & t, e >>> 24, e >>> 16 & 255, e >>> 8 & 255, 255 & e];\n        }, n.fromBytes = function (t, e, r) {\n          return r ? n.fromBytesLE(t, e) : n.fromBytesBE(t, e);\n        }, n.fromBytesLE = function (t, e) {\n          return new n(t[0] | t[1] << 8 | t[2] << 16 | t[3] << 24, t[4] | t[5] << 8 | t[6] << 16 | t[7] << 24, e);\n        }, n.fromBytesBE = function (t, e) {\n          return new n(t[4] << 24 | t[5] << 16 | t[6] << 8 | t[7], t[0] << 24 | t[1] << 16 | t[2] << 8 | t[3], e);\n        };\n      },\n      9777: function _(t, e, n) {\n        \"use strict\";\n\n        var r = {};\n        (0, n(9639).assign)(r, n(2365), n(6187), n(2890)), t.exports = r;\n      },\n      2365: function _(t, e, n) {\n        \"use strict\";\n\n        var r = n(9573),\n          i = n(9639),\n          s = n(2653),\n          o = n(5837),\n          a = n(6916),\n          l = Object.prototype.toString,\n          h = 0,\n          u = -1,\n          f = 0,\n          c = 8;\n        function d(t) {\n          if (!(this instanceof d)) return new d(t);\n          this.options = i.assign({\n            level: u,\n            method: c,\n            chunkSize: 16384,\n            windowBits: 15,\n            memLevel: 8,\n            strategy: f,\n            to: \"\"\n          }, t || {});\n          var e = this.options;\n          e.raw && e.windowBits > 0 ? e.windowBits = -e.windowBits : e.gzip && e.windowBits > 0 && e.windowBits < 16 && (e.windowBits += 16), this.err = 0, this.msg = \"\", this.ended = !1, this.chunks = [], this.strm = new a(), this.strm.avail_out = 0;\n          var n = r.deflateInit2(this.strm, e.level, e.method, e.windowBits, e.memLevel, e.strategy);\n          if (n !== h) throw new Error(o[n]);\n          if (e.header && r.deflateSetHeader(this.strm, e.header), e.dictionary) {\n            var g;\n            if (g = \"string\" == typeof e.dictionary ? s.string2buf(e.dictionary) : \"[object ArrayBuffer]\" === l.call(e.dictionary) ? new Uint8Array(e.dictionary) : e.dictionary, (n = r.deflateSetDictionary(this.strm, g)) !== h) throw new Error(o[n]);\n            this._dict_set = !0;\n          }\n        }\n        function g(t, e) {\n          var n = new d(e);\n          if (n.push(t, !0), n.err) throw n.msg || o[n.err];\n          return n.result;\n        }\n        d.prototype.push = function (t, e) {\n          var n,\n            o,\n            a = this.strm,\n            u = this.options.chunkSize;\n          if (this.ended) return !1;\n          o = e === ~~e ? e : !0 === e ? 4 : 0, \"string\" == typeof t ? a.input = s.string2buf(t) : \"[object ArrayBuffer]\" === l.call(t) ? a.input = new Uint8Array(t) : a.input = t, a.next_in = 0, a.avail_in = a.input.length;\n          do {\n            if (0 === a.avail_out && (a.output = new i.Buf8(u), a.next_out = 0, a.avail_out = u), 1 !== (n = r.deflate(a, o)) && n !== h) return this.onEnd(n), this.ended = !0, !1;\n            0 !== a.avail_out && (0 !== a.avail_in || 4 !== o && 2 !== o) || (\"string\" === this.options.to ? this.onData(s.buf2binstring(i.shrinkBuf(a.output, a.next_out))) : this.onData(i.shrinkBuf(a.output, a.next_out)));\n          } while ((a.avail_in > 0 || 0 === a.avail_out) && 1 !== n);\n          return 4 === o ? (n = r.deflateEnd(this.strm), this.onEnd(n), this.ended = !0, n === h) : 2 !== o || (this.onEnd(h), a.avail_out = 0, !0);\n        }, d.prototype.onData = function (t) {\n          this.chunks.push(t);\n        }, d.prototype.onEnd = function (t) {\n          t === h && (\"string\" === this.options.to ? this.result = this.chunks.join(\"\") : this.result = i.flattenChunks(this.chunks)), this.chunks = [], this.err = t, this.msg = this.strm.msg;\n        }, e.Deflate = d, e.deflate = g, e.deflateRaw = function (t, e) {\n          return (e = e || {}).raw = !0, g(t, e);\n        }, e.gzip = function (t, e) {\n          return (e = e || {}).gzip = !0, g(t, e);\n        };\n      },\n      6187: function _(t, e, n) {\n        \"use strict\";\n\n        var r = n(3519),\n          i = n(9639),\n          s = n(2653),\n          o = n(2890),\n          a = n(5837),\n          l = n(6916),\n          h = n(3677),\n          u = Object.prototype.toString;\n        function f(t) {\n          if (!(this instanceof f)) return new f(t);\n          this.options = i.assign({\n            chunkSize: 16384,\n            windowBits: 0,\n            to: \"\"\n          }, t || {});\n          var e = this.options;\n          e.raw && e.windowBits >= 0 && e.windowBits < 16 && (e.windowBits = -e.windowBits, 0 === e.windowBits && (e.windowBits = -15)), !(e.windowBits >= 0 && e.windowBits < 16) || t && t.windowBits || (e.windowBits += 32), e.windowBits > 15 && e.windowBits < 48 && 0 == (15 & e.windowBits) && (e.windowBits |= 15), this.err = 0, this.msg = \"\", this.ended = !1, this.chunks = [], this.strm = new l(), this.strm.avail_out = 0;\n          var n = r.inflateInit2(this.strm, e.windowBits);\n          if (n !== o.Z_OK) throw new Error(a[n]);\n          if (this.header = new h(), r.inflateGetHeader(this.strm, this.header), e.dictionary && (\"string\" == typeof e.dictionary ? e.dictionary = s.string2buf(e.dictionary) : \"[object ArrayBuffer]\" === u.call(e.dictionary) && (e.dictionary = new Uint8Array(e.dictionary)), e.raw && (n = r.inflateSetDictionary(this.strm, e.dictionary)) !== o.Z_OK)) throw new Error(a[n]);\n        }\n        function c(t, e) {\n          var n = new f(e);\n          if (n.push(t, !0), n.err) throw n.msg || a[n.err];\n          return n.result;\n        }\n        f.prototype.push = function (t, e) {\n          var n,\n            a,\n            l,\n            h,\n            f,\n            c = this.strm,\n            d = this.options.chunkSize,\n            g = this.options.dictionary,\n            p = !1;\n          if (this.ended) return !1;\n          a = e === ~~e ? e : !0 === e ? o.Z_FINISH : o.Z_NO_FLUSH, \"string\" == typeof t ? c.input = s.binstring2buf(t) : \"[object ArrayBuffer]\" === u.call(t) ? c.input = new Uint8Array(t) : c.input = t, c.next_in = 0, c.avail_in = c.input.length;\n          do {\n            if (0 === c.avail_out && (c.output = new i.Buf8(d), c.next_out = 0, c.avail_out = d), (n = r.inflate(c, o.Z_NO_FLUSH)) === o.Z_NEED_DICT && g && (n = r.inflateSetDictionary(this.strm, g)), n === o.Z_BUF_ERROR && !0 === p && (n = o.Z_OK, p = !1), n !== o.Z_STREAM_END && n !== o.Z_OK) return this.onEnd(n), this.ended = !0, !1;\n            c.next_out && (0 !== c.avail_out && n !== o.Z_STREAM_END && (0 !== c.avail_in || a !== o.Z_FINISH && a !== o.Z_SYNC_FLUSH) || (\"string\" === this.options.to ? (l = s.utf8border(c.output, c.next_out), h = c.next_out - l, f = s.buf2string(c.output, l), c.next_out = h, c.avail_out = d - h, h && i.arraySet(c.output, c.output, l, h, 0), this.onData(f)) : this.onData(i.shrinkBuf(c.output, c.next_out)))), 0 === c.avail_in && 0 === c.avail_out && (p = !0);\n          } while ((c.avail_in > 0 || 0 === c.avail_out) && n !== o.Z_STREAM_END);\n          return n === o.Z_STREAM_END && (a = o.Z_FINISH), a === o.Z_FINISH ? (n = r.inflateEnd(this.strm), this.onEnd(n), this.ended = !0, n === o.Z_OK) : a !== o.Z_SYNC_FLUSH || (this.onEnd(o.Z_OK), c.avail_out = 0, !0);\n        }, f.prototype.onData = function (t) {\n          this.chunks.push(t);\n        }, f.prototype.onEnd = function (t) {\n          t === o.Z_OK && (\"string\" === this.options.to ? this.result = this.chunks.join(\"\") : this.result = i.flattenChunks(this.chunks)), this.chunks = [], this.err = t, this.msg = this.strm.msg;\n        }, e.Inflate = f, e.inflate = c, e.inflateRaw = function (t, e) {\n          return (e = e || {}).raw = !0, c(t, e);\n        }, e.ungzip = c;\n      },\n      9639: function _(t, e) {\n        \"use strict\";\n\n        var n = \"undefined\" != typeof Uint8Array && \"undefined\" != typeof Uint16Array && \"undefined\" != typeof Int32Array;\n        function r(t, e) {\n          return Object.prototype.hasOwnProperty.call(t, e);\n        }\n        e.assign = function (t) {\n          for (var e = Array.prototype.slice.call(arguments, 1); e.length;) {\n            var n = e.shift();\n            if (n) {\n              if (\"object\" != _typeof(n)) throw new TypeError(n + \"must be non-object\");\n              for (var i in n) r(n, i) && (t[i] = n[i]);\n            }\n          }\n          return t;\n        }, e.shrinkBuf = function (t, e) {\n          return t.length === e ? t : t.subarray ? t.subarray(0, e) : (t.length = e, t);\n        };\n        var i = {\n            arraySet: function arraySet(t, e, n, r, i) {\n              if (e.subarray && t.subarray) t.set(e.subarray(n, n + r), i);else for (var s = 0; s < r; s++) t[i + s] = e[n + s];\n            },\n            flattenChunks: function flattenChunks(t) {\n              var e, n, r, i, s, o;\n              for (r = 0, e = 0, n = t.length; e < n; e++) r += t[e].length;\n              for (o = new Uint8Array(r), i = 0, e = 0, n = t.length; e < n; e++) s = t[e], o.set(s, i), i += s.length;\n              return o;\n            }\n          },\n          s = {\n            arraySet: function arraySet(t, e, n, r, i) {\n              for (var s = 0; s < r; s++) t[i + s] = e[n + s];\n            },\n            flattenChunks: function flattenChunks(t) {\n              return [].concat.apply([], t);\n            }\n          };\n        e.setTyped = function (t) {\n          t ? (e.Buf8 = Uint8Array, e.Buf16 = Uint16Array, e.Buf32 = Int32Array, e.assign(e, i)) : (e.Buf8 = Array, e.Buf16 = Array, e.Buf32 = Array, e.assign(e, s));\n        }, e.setTyped(n);\n      },\n      2653: function _(t, e, n) {\n        \"use strict\";\n\n        var r = n(9639),\n          i = !0,\n          s = !0;\n        try {\n          String.fromCharCode.apply(null, [0]);\n        } catch (t) {\n          i = !1;\n        }\n        try {\n          String.fromCharCode.apply(null, new Uint8Array(1));\n        } catch (t) {\n          s = !1;\n        }\n        for (var o = new r.Buf8(256), a = 0; a < 256; a++) o[a] = a >= 252 ? 6 : a >= 248 ? 5 : a >= 240 ? 4 : a >= 224 ? 3 : a >= 192 ? 2 : 1;\n        function l(t, e) {\n          if (e < 65534 && (t.subarray && s || !t.subarray && i)) return String.fromCharCode.apply(null, r.shrinkBuf(t, e));\n          for (var n = \"\", o = 0; o < e; o++) n += String.fromCharCode(t[o]);\n          return n;\n        }\n        o[254] = o[254] = 1, e.string2buf = function (t) {\n          var e,\n            n,\n            i,\n            s,\n            o,\n            a = t.length,\n            l = 0;\n          for (s = 0; s < a; s++) 55296 == (64512 & (n = t.charCodeAt(s))) && s + 1 < a && 56320 == (64512 & (i = t.charCodeAt(s + 1))) && (n = 65536 + (n - 55296 << 10) + (i - 56320), s++), l += n < 128 ? 1 : n < 2048 ? 2 : n < 65536 ? 3 : 4;\n          for (e = new r.Buf8(l), o = 0, s = 0; o < l; s++) 55296 == (64512 & (n = t.charCodeAt(s))) && s + 1 < a && 56320 == (64512 & (i = t.charCodeAt(s + 1))) && (n = 65536 + (n - 55296 << 10) + (i - 56320), s++), n < 128 ? e[o++] = n : n < 2048 ? (e[o++] = 192 | n >>> 6, e[o++] = 128 | 63 & n) : n < 65536 ? (e[o++] = 224 | n >>> 12, e[o++] = 128 | n >>> 6 & 63, e[o++] = 128 | 63 & n) : (e[o++] = 240 | n >>> 18, e[o++] = 128 | n >>> 12 & 63, e[o++] = 128 | n >>> 6 & 63, e[o++] = 128 | 63 & n);\n          return e;\n        }, e.buf2binstring = function (t) {\n          return l(t, t.length);\n        }, e.binstring2buf = function (t) {\n          for (var e = new r.Buf8(t.length), n = 0, i = e.length; n < i; n++) e[n] = t.charCodeAt(n);\n          return e;\n        }, e.buf2string = function (t, e) {\n          var n,\n            r,\n            i,\n            s,\n            a = e || t.length,\n            h = new Array(2 * a);\n          for (r = 0, n = 0; n < a;) if ((i = t[n++]) < 128) h[r++] = i;else if ((s = o[i]) > 4) h[r++] = 65533, n += s - 1;else {\n            for (i &= 2 === s ? 31 : 3 === s ? 15 : 7; s > 1 && n < a;) i = i << 6 | 63 & t[n++], s--;\n            s > 1 ? h[r++] = 65533 : i < 65536 ? h[r++] = i : (i -= 65536, h[r++] = 55296 | i >> 10 & 1023, h[r++] = 56320 | 1023 & i);\n          }\n          return l(h, r);\n        }, e.utf8border = function (t, e) {\n          var n;\n          for ((e = e || t.length) > t.length && (e = t.length), n = e - 1; n >= 0 && 128 == (192 & t[n]);) n--;\n          return n < 0 || 0 === n ? e : n + o[t[n]] > e ? n : e;\n        };\n      },\n      2084: function _(t) {\n        \"use strict\";\n\n        t.exports = function (t, e, n, r) {\n          for (var i = 65535 & t | 0, s = t >>> 16 & 65535 | 0, o = 0; 0 !== n;) {\n            n -= o = n > 2e3 ? 2e3 : n;\n            do {\n              s = s + (i = i + e[r++] | 0) | 0;\n            } while (--o);\n            i %= 65521, s %= 65521;\n          }\n          return i | s << 16 | 0;\n        };\n      },\n      2890: function _(t) {\n        \"use strict\";\n\n        t.exports = {\n          Z_NO_FLUSH: 0,\n          Z_PARTIAL_FLUSH: 1,\n          Z_SYNC_FLUSH: 2,\n          Z_FULL_FLUSH: 3,\n          Z_FINISH: 4,\n          Z_BLOCK: 5,\n          Z_TREES: 6,\n          Z_OK: 0,\n          Z_STREAM_END: 1,\n          Z_NEED_DICT: 2,\n          Z_ERRNO: -1,\n          Z_STREAM_ERROR: -2,\n          Z_DATA_ERROR: -3,\n          Z_BUF_ERROR: -5,\n          Z_NO_COMPRESSION: 0,\n          Z_BEST_SPEED: 1,\n          Z_BEST_COMPRESSION: 9,\n          Z_DEFAULT_COMPRESSION: -1,\n          Z_FILTERED: 1,\n          Z_HUFFMAN_ONLY: 2,\n          Z_RLE: 3,\n          Z_FIXED: 4,\n          Z_DEFAULT_STRATEGY: 0,\n          Z_BINARY: 0,\n          Z_TEXT: 1,\n          Z_UNKNOWN: 2,\n          Z_DEFLATED: 8\n        };\n      },\n      1647: function _(t) {\n        \"use strict\";\n\n        var e = function () {\n          for (var t, e = [], n = 0; n < 256; n++) {\n            t = n;\n            for (var r = 0; r < 8; r++) t = 1 & t ? 3988292384 ^ t >>> 1 : t >>> 1;\n            e[n] = t;\n          }\n          return e;\n        }();\n        t.exports = function (t, n, r, i) {\n          var s = e,\n            o = i + r;\n          t ^= -1;\n          for (var a = i; a < o; a++) t = t >>> 8 ^ s[255 & (t ^ n[a])];\n          return -1 ^ t;\n        };\n      },\n      9573: function _(t, e, n) {\n        \"use strict\";\n\n        var r,\n          i = n(9639),\n          s = n(2169),\n          o = n(2084),\n          a = n(1647),\n          l = n(5837),\n          h = 0,\n          u = 0,\n          f = -2,\n          c = 2,\n          d = 8,\n          g = 286,\n          p = 30,\n          m = 19,\n          _ = 2 * g + 1,\n          b = 15,\n          w = 3,\n          y = 258,\n          v = y + w + 1,\n          k = 42,\n          x = 103,\n          E = 113,\n          A = 666;\n        function B(t, e) {\n          return t.msg = l[e], e;\n        }\n        function S(t) {\n          return (t << 1) - (t > 4 ? 9 : 0);\n        }\n        function I(t) {\n          for (var e = t.length; --e >= 0;) t[e] = 0;\n        }\n        function M(t) {\n          var e = t.state,\n            n = e.pending;\n          n > t.avail_out && (n = t.avail_out), 0 !== n && (i.arraySet(t.output, e.pending_buf, e.pending_out, n, t.next_out), t.next_out += n, e.pending_out += n, t.total_out += n, t.avail_out -= n, e.pending -= n, 0 === e.pending && (e.pending_out = 0));\n        }\n        function T(t, e) {\n          s._tr_flush_block(t, t.block_start >= 0 ? t.block_start : -1, t.strstart - t.block_start, e), t.block_start = t.strstart, M(t.strm);\n        }\n        function z(t, e) {\n          t.pending_buf[t.pending++] = e;\n        }\n        function O(t, e) {\n          t.pending_buf[t.pending++] = e >>> 8 & 255, t.pending_buf[t.pending++] = 255 & e;\n        }\n        function C(t, e) {\n          var n,\n            r,\n            i = t.max_chain_length,\n            s = t.strstart,\n            o = t.prev_length,\n            a = t.nice_match,\n            l = t.strstart > t.w_size - v ? t.strstart - (t.w_size - v) : 0,\n            h = t.window,\n            u = t.w_mask,\n            f = t.prev,\n            c = t.strstart + y,\n            d = h[s + o - 1],\n            g = h[s + o];\n          t.prev_length >= t.good_match && (i >>= 2), a > t.lookahead && (a = t.lookahead);\n          do {\n            if (h[(n = e) + o] === g && h[n + o - 1] === d && h[n] === h[s] && h[++n] === h[s + 1]) {\n              s += 2, n++;\n              do {} while (h[++s] === h[++n] && h[++s] === h[++n] && h[++s] === h[++n] && h[++s] === h[++n] && h[++s] === h[++n] && h[++s] === h[++n] && h[++s] === h[++n] && h[++s] === h[++n] && s < c);\n              if (r = y - (c - s), s = c - y, r > o) {\n                if (t.match_start = e, o = r, r >= a) break;\n                d = h[s + o - 1], g = h[s + o];\n              }\n            }\n          } while ((e = f[e & u]) > l && 0 != --i);\n          return o <= t.lookahead ? o : t.lookahead;\n        }\n        function R(t) {\n          var e,\n            n,\n            r,\n            s,\n            l,\n            h,\n            u,\n            f,\n            c,\n            d,\n            g = t.w_size;\n          do {\n            if (s = t.window_size - t.lookahead - t.strstart, t.strstart >= g + (g - v)) {\n              i.arraySet(t.window, t.window, g, g, 0), t.match_start -= g, t.strstart -= g, t.block_start -= g, e = n = t.hash_size;\n              do {\n                r = t.head[--e], t.head[e] = r >= g ? r - g : 0;\n              } while (--n);\n              e = n = g;\n              do {\n                r = t.prev[--e], t.prev[e] = r >= g ? r - g : 0;\n              } while (--n);\n              s += g;\n            }\n            if (0 === t.strm.avail_in) break;\n            if (h = t.strm, u = t.window, f = t.strstart + t.lookahead, c = s, d = void 0, (d = h.avail_in) > c && (d = c), n = 0 === d ? 0 : (h.avail_in -= d, i.arraySet(u, h.input, h.next_in, d, f), 1 === h.state.wrap ? h.adler = o(h.adler, u, d, f) : 2 === h.state.wrap && (h.adler = a(h.adler, u, d, f)), h.next_in += d, h.total_in += d, d), t.lookahead += n, t.lookahead + t.insert >= w) for (l = t.strstart - t.insert, t.ins_h = t.window[l], t.ins_h = (t.ins_h << t.hash_shift ^ t.window[l + 1]) & t.hash_mask; t.insert && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[l + w - 1]) & t.hash_mask, t.prev[l & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = l, l++, t.insert--, !(t.lookahead + t.insert < w)););\n          } while (t.lookahead < v && 0 !== t.strm.avail_in);\n        }\n        function N(t, e) {\n          for (var n, r;;) {\n            if (t.lookahead < v) {\n              if (R(t), t.lookahead < v && e === h) return 1;\n              if (0 === t.lookahead) break;\n            }\n            if (n = 0, t.lookahead >= w && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + w - 1]) & t.hash_mask, n = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart), 0 !== n && t.strstart - n <= t.w_size - v && (t.match_length = C(t, n)), t.match_length >= w) {\n              if (r = s._tr_tally(t, t.strstart - t.match_start, t.match_length - w), t.lookahead -= t.match_length, t.match_length <= t.max_lazy_match && t.lookahead >= w) {\n                t.match_length--;\n                do {\n                  t.strstart++, t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + w - 1]) & t.hash_mask, n = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart;\n                } while (0 != --t.match_length);\n                t.strstart++;\n              } else t.strstart += t.match_length, t.match_length = 0, t.ins_h = t.window[t.strstart], t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + 1]) & t.hash_mask;\n            } else r = s._tr_tally(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++;\n            if (r && (T(t, !1), 0 === t.strm.avail_out)) return 1;\n          }\n          return t.insert = t.strstart < w - 1 ? t.strstart : w - 1, 4 === e ? (T(t, !0), 0 === t.strm.avail_out ? 3 : 4) : t.last_lit && (T(t, !1), 0 === t.strm.avail_out) ? 1 : 2;\n        }\n        function L(t, e) {\n          for (var n, r, i;;) {\n            if (t.lookahead < v) {\n              if (R(t), t.lookahead < v && e === h) return 1;\n              if (0 === t.lookahead) break;\n            }\n            if (n = 0, t.lookahead >= w && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + w - 1]) & t.hash_mask, n = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart), t.prev_length = t.match_length, t.prev_match = t.match_start, t.match_length = w - 1, 0 !== n && t.prev_length < t.max_lazy_match && t.strstart - n <= t.w_size - v && (t.match_length = C(t, n), t.match_length <= 5 && (1 === t.strategy || t.match_length === w && t.strstart - t.match_start > 4096) && (t.match_length = w - 1)), t.prev_length >= w && t.match_length <= t.prev_length) {\n              i = t.strstart + t.lookahead - w, r = s._tr_tally(t, t.strstart - 1 - t.prev_match, t.prev_length - w), t.lookahead -= t.prev_length - 1, t.prev_length -= 2;\n              do {\n                ++t.strstart <= i && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + w - 1]) & t.hash_mask, n = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart);\n              } while (0 != --t.prev_length);\n              if (t.match_available = 0, t.match_length = w - 1, t.strstart++, r && (T(t, !1), 0 === t.strm.avail_out)) return 1;\n            } else if (t.match_available) {\n              if ((r = s._tr_tally(t, 0, t.window[t.strstart - 1])) && T(t, !1), t.strstart++, t.lookahead--, 0 === t.strm.avail_out) return 1;\n            } else t.match_available = 1, t.strstart++, t.lookahead--;\n          }\n          return t.match_available && (r = s._tr_tally(t, 0, t.window[t.strstart - 1]), t.match_available = 0), t.insert = t.strstart < w - 1 ? t.strstart : w - 1, 4 === e ? (T(t, !0), 0 === t.strm.avail_out ? 3 : 4) : t.last_lit && (T(t, !1), 0 === t.strm.avail_out) ? 1 : 2;\n        }\n        function U(t, e, n, r, i) {\n          this.good_length = t, this.max_lazy = e, this.nice_length = n, this.max_chain = r, this.func = i;\n        }\n        function P() {\n          this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = d, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new i.Buf16(2 * _), this.dyn_dtree = new i.Buf16(2 * (2 * p + 1)), this.bl_tree = new i.Buf16(2 * (2 * m + 1)), I(this.dyn_ltree), I(this.dyn_dtree), I(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new i.Buf16(b + 1), this.heap = new i.Buf16(2 * g + 1), I(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new i.Buf16(2 * g + 1), I(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;\n        }\n        function $(t) {\n          var e;\n          return t && t.state ? (t.total_in = t.total_out = 0, t.data_type = c, (e = t.state).pending = 0, e.pending_out = 0, e.wrap < 0 && (e.wrap = -e.wrap), e.status = e.wrap ? k : E, t.adler = 2 === e.wrap ? 0 : 1, e.last_flush = h, s._tr_init(e), u) : B(t, f);\n        }\n        function j(t) {\n          var e,\n            n = $(t);\n          return n === u && ((e = t.state).window_size = 2 * e.w_size, I(e.head), e.max_lazy_match = r[e.level].max_lazy, e.good_match = r[e.level].good_length, e.nice_match = r[e.level].nice_length, e.max_chain_length = r[e.level].max_chain, e.strstart = 0, e.block_start = 0, e.lookahead = 0, e.insert = 0, e.match_length = e.prev_length = w - 1, e.match_available = 0, e.ins_h = 0), n;\n        }\n        function F(t, e, n, r, s, o) {\n          if (!t) return f;\n          var a = 1;\n          if (-1 === e && (e = 6), r < 0 ? (a = 0, r = -r) : r > 15 && (a = 2, r -= 16), s < 1 || s > 9 || n !== d || r < 8 || r > 15 || e < 0 || e > 9 || o < 0 || o > 4) return B(t, f);\n          8 === r && (r = 9);\n          var l = new P();\n          return t.state = l, l.strm = t, l.wrap = a, l.gzhead = null, l.w_bits = r, l.w_size = 1 << l.w_bits, l.w_mask = l.w_size - 1, l.hash_bits = s + 7, l.hash_size = 1 << l.hash_bits, l.hash_mask = l.hash_size - 1, l.hash_shift = ~~((l.hash_bits + w - 1) / w), l.window = new i.Buf8(2 * l.w_size), l.head = new i.Buf16(l.hash_size), l.prev = new i.Buf16(l.w_size), l.lit_bufsize = 1 << s + 6, l.pending_buf_size = 4 * l.lit_bufsize, l.pending_buf = new i.Buf8(l.pending_buf_size), l.d_buf = 1 * l.lit_bufsize, l.l_buf = 3 * l.lit_bufsize, l.level = e, l.strategy = o, l.method = n, j(t);\n        }\n        r = [new U(0, 0, 0, 0, function (t, e) {\n          var n = 65535;\n          for (n > t.pending_buf_size - 5 && (n = t.pending_buf_size - 5);;) {\n            if (t.lookahead <= 1) {\n              if (R(t), 0 === t.lookahead && e === h) return 1;\n              if (0 === t.lookahead) break;\n            }\n            t.strstart += t.lookahead, t.lookahead = 0;\n            var r = t.block_start + n;\n            if ((0 === t.strstart || t.strstart >= r) && (t.lookahead = t.strstart - r, t.strstart = r, T(t, !1), 0 === t.strm.avail_out)) return 1;\n            if (t.strstart - t.block_start >= t.w_size - v && (T(t, !1), 0 === t.strm.avail_out)) return 1;\n          }\n          return t.insert = 0, 4 === e ? (T(t, !0), 0 === t.strm.avail_out ? 3 : 4) : (t.strstart > t.block_start && (T(t, !1), t.strm.avail_out), 1);\n        }), new U(4, 4, 8, 4, N), new U(4, 5, 16, 8, N), new U(4, 6, 32, 32, N), new U(4, 4, 16, 16, L), new U(8, 16, 32, 32, L), new U(8, 16, 128, 128, L), new U(8, 32, 128, 256, L), new U(32, 128, 258, 1024, L), new U(32, 258, 258, 4096, L)], e.deflateInit = function (t, e) {\n          return F(t, e, d, 15, 8, 0);\n        }, e.deflateInit2 = F, e.deflateReset = j, e.deflateResetKeep = $, e.deflateSetHeader = function (t, e) {\n          return t && t.state ? 2 !== t.state.wrap ? f : (t.state.gzhead = e, u) : f;\n        }, e.deflate = function (t, e) {\n          var n, i, o, l;\n          if (!t || !t.state || e > 5 || e < 0) return t ? B(t, f) : f;\n          if (i = t.state, !t.output || !t.input && 0 !== t.avail_in || i.status === A && 4 !== e) return B(t, 0 === t.avail_out ? -5 : f);\n          if (i.strm = t, n = i.last_flush, i.last_flush = e, i.status === k) if (2 === i.wrap) t.adler = 0, z(i, 31), z(i, 139), z(i, 8), i.gzhead ? (z(i, (i.gzhead.text ? 1 : 0) + (i.gzhead.hcrc ? 2 : 0) + (i.gzhead.extra ? 4 : 0) + (i.gzhead.name ? 8 : 0) + (i.gzhead.comment ? 16 : 0)), z(i, 255 & i.gzhead.time), z(i, i.gzhead.time >> 8 & 255), z(i, i.gzhead.time >> 16 & 255), z(i, i.gzhead.time >> 24 & 255), z(i, 9 === i.level ? 2 : i.strategy >= 2 || i.level < 2 ? 4 : 0), z(i, 255 & i.gzhead.os), i.gzhead.extra && i.gzhead.extra.length && (z(i, 255 & i.gzhead.extra.length), z(i, i.gzhead.extra.length >> 8 & 255)), i.gzhead.hcrc && (t.adler = a(t.adler, i.pending_buf, i.pending, 0)), i.gzindex = 0, i.status = 69) : (z(i, 0), z(i, 0), z(i, 0), z(i, 0), z(i, 0), z(i, 9 === i.level ? 2 : i.strategy >= 2 || i.level < 2 ? 4 : 0), z(i, 3), i.status = E);else {\n            var c = d + (i.w_bits - 8 << 4) << 8;\n            c |= (i.strategy >= 2 || i.level < 2 ? 0 : i.level < 6 ? 1 : 6 === i.level ? 2 : 3) << 6, 0 !== i.strstart && (c |= 32), c += 31 - c % 31, i.status = E, O(i, c), 0 !== i.strstart && (O(i, t.adler >>> 16), O(i, 65535 & t.adler)), t.adler = 1;\n          }\n          if (69 === i.status) if (i.gzhead.extra) {\n            for (o = i.pending; i.gzindex < (65535 & i.gzhead.extra.length) && (i.pending !== i.pending_buf_size || (i.gzhead.hcrc && i.pending > o && (t.adler = a(t.adler, i.pending_buf, i.pending - o, o)), M(t), o = i.pending, i.pending !== i.pending_buf_size));) z(i, 255 & i.gzhead.extra[i.gzindex]), i.gzindex++;\n            i.gzhead.hcrc && i.pending > o && (t.adler = a(t.adler, i.pending_buf, i.pending - o, o)), i.gzindex === i.gzhead.extra.length && (i.gzindex = 0, i.status = 73);\n          } else i.status = 73;\n          if (73 === i.status) if (i.gzhead.name) {\n            o = i.pending;\n            do {\n              if (i.pending === i.pending_buf_size && (i.gzhead.hcrc && i.pending > o && (t.adler = a(t.adler, i.pending_buf, i.pending - o, o)), M(t), o = i.pending, i.pending === i.pending_buf_size)) {\n                l = 1;\n                break;\n              }\n              l = i.gzindex < i.gzhead.name.length ? 255 & i.gzhead.name.charCodeAt(i.gzindex++) : 0, z(i, l);\n            } while (0 !== l);\n            i.gzhead.hcrc && i.pending > o && (t.adler = a(t.adler, i.pending_buf, i.pending - o, o)), 0 === l && (i.gzindex = 0, i.status = 91);\n          } else i.status = 91;\n          if (91 === i.status) if (i.gzhead.comment) {\n            o = i.pending;\n            do {\n              if (i.pending === i.pending_buf_size && (i.gzhead.hcrc && i.pending > o && (t.adler = a(t.adler, i.pending_buf, i.pending - o, o)), M(t), o = i.pending, i.pending === i.pending_buf_size)) {\n                l = 1;\n                break;\n              }\n              l = i.gzindex < i.gzhead.comment.length ? 255 & i.gzhead.comment.charCodeAt(i.gzindex++) : 0, z(i, l);\n            } while (0 !== l);\n            i.gzhead.hcrc && i.pending > o && (t.adler = a(t.adler, i.pending_buf, i.pending - o, o)), 0 === l && (i.status = x);\n          } else i.status = x;\n          if (i.status === x && (i.gzhead.hcrc ? (i.pending + 2 > i.pending_buf_size && M(t), i.pending + 2 <= i.pending_buf_size && (z(i, 255 & t.adler), z(i, t.adler >> 8 & 255), t.adler = 0, i.status = E)) : i.status = E), 0 !== i.pending) {\n            if (M(t), 0 === t.avail_out) return i.last_flush = -1, u;\n          } else if (0 === t.avail_in && S(e) <= S(n) && 4 !== e) return B(t, -5);\n          if (i.status === A && 0 !== t.avail_in) return B(t, -5);\n          if (0 !== t.avail_in || 0 !== i.lookahead || e !== h && i.status !== A) {\n            var g = 2 === i.strategy ? function (t, e) {\n              for (var n;;) {\n                if (0 === t.lookahead && (R(t), 0 === t.lookahead)) {\n                  if (e === h) return 1;\n                  break;\n                }\n                if (t.match_length = 0, n = s._tr_tally(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++, n && (T(t, !1), 0 === t.strm.avail_out)) return 1;\n              }\n              return t.insert = 0, 4 === e ? (T(t, !0), 0 === t.strm.avail_out ? 3 : 4) : t.last_lit && (T(t, !1), 0 === t.strm.avail_out) ? 1 : 2;\n            }(i, e) : 3 === i.strategy ? function (t, e) {\n              for (var n, r, i, o, a = t.window;;) {\n                if (t.lookahead <= y) {\n                  if (R(t), t.lookahead <= y && e === h) return 1;\n                  if (0 === t.lookahead) break;\n                }\n                if (t.match_length = 0, t.lookahead >= w && t.strstart > 0 && (r = a[i = t.strstart - 1]) === a[++i] && r === a[++i] && r === a[++i]) {\n                  o = t.strstart + y;\n                  do {} while (r === a[++i] && r === a[++i] && r === a[++i] && r === a[++i] && r === a[++i] && r === a[++i] && r === a[++i] && r === a[++i] && i < o);\n                  t.match_length = y - (o - i), t.match_length > t.lookahead && (t.match_length = t.lookahead);\n                }\n                if (t.match_length >= w ? (n = s._tr_tally(t, 1, t.match_length - w), t.lookahead -= t.match_length, t.strstart += t.match_length, t.match_length = 0) : (n = s._tr_tally(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++), n && (T(t, !1), 0 === t.strm.avail_out)) return 1;\n              }\n              return t.insert = 0, 4 === e ? (T(t, !0), 0 === t.strm.avail_out ? 3 : 4) : t.last_lit && (T(t, !1), 0 === t.strm.avail_out) ? 1 : 2;\n            }(i, e) : r[i.level].func(i, e);\n            if (3 !== g && 4 !== g || (i.status = A), 1 === g || 3 === g) return 0 === t.avail_out && (i.last_flush = -1), u;\n            if (2 === g && (1 === e ? s._tr_align(i) : 5 !== e && (s._tr_stored_block(i, 0, 0, !1), 3 === e && (I(i.head), 0 === i.lookahead && (i.strstart = 0, i.block_start = 0, i.insert = 0))), M(t), 0 === t.avail_out)) return i.last_flush = -1, u;\n          }\n          return 4 !== e ? u : i.wrap <= 0 ? 1 : (2 === i.wrap ? (z(i, 255 & t.adler), z(i, t.adler >> 8 & 255), z(i, t.adler >> 16 & 255), z(i, t.adler >> 24 & 255), z(i, 255 & t.total_in), z(i, t.total_in >> 8 & 255), z(i, t.total_in >> 16 & 255), z(i, t.total_in >> 24 & 255)) : (O(i, t.adler >>> 16), O(i, 65535 & t.adler)), M(t), i.wrap > 0 && (i.wrap = -i.wrap), 0 !== i.pending ? u : 1);\n        }, e.deflateEnd = function (t) {\n          var e;\n          return t && t.state ? (e = t.state.status) !== k && 69 !== e && 73 !== e && 91 !== e && e !== x && e !== E && e !== A ? B(t, f) : (t.state = null, e === E ? B(t, -3) : u) : f;\n        }, e.deflateSetDictionary = function (t, e) {\n          var n,\n            r,\n            s,\n            a,\n            l,\n            h,\n            c,\n            d,\n            g = e.length;\n          if (!t || !t.state) return f;\n          if (2 === (a = (n = t.state).wrap) || 1 === a && n.status !== k || n.lookahead) return f;\n          for (1 === a && (t.adler = o(t.adler, e, g, 0)), n.wrap = 0, g >= n.w_size && (0 === a && (I(n.head), n.strstart = 0, n.block_start = 0, n.insert = 0), d = new i.Buf8(n.w_size), i.arraySet(d, e, g - n.w_size, n.w_size, 0), e = d, g = n.w_size), l = t.avail_in, h = t.next_in, c = t.input, t.avail_in = g, t.next_in = 0, t.input = e, R(n); n.lookahead >= w;) {\n            r = n.strstart, s = n.lookahead - (w - 1);\n            do {\n              n.ins_h = (n.ins_h << n.hash_shift ^ n.window[r + w - 1]) & n.hash_mask, n.prev[r & n.w_mask] = n.head[n.ins_h], n.head[n.ins_h] = r, r++;\n            } while (--s);\n            n.strstart = r, n.lookahead = w - 1, R(n);\n          }\n          return n.strstart += n.lookahead, n.block_start = n.strstart, n.insert = n.lookahead, n.lookahead = 0, n.match_length = n.prev_length = w - 1, n.match_available = 0, t.next_in = h, t.input = c, t.avail_in = l, n.wrap = a, u;\n        }, e.deflateInfo = \"pako deflate (from Nodeca project)\";\n      },\n      3677: function _(t) {\n        \"use strict\";\n\n        t.exports = function () {\n          this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = \"\", this.comment = \"\", this.hcrc = 0, this.done = !1;\n        };\n      },\n      7424: function _(t) {\n        \"use strict\";\n\n        t.exports = function (t, e) {\n          var n, r, i, s, o, a, l, h, u, f, c, d, g, p, m, _, b, w, y, v, k, x, E, A, B;\n          n = t.state, r = t.next_in, A = t.input, i = r + (t.avail_in - 5), s = t.next_out, B = t.output, o = s - (e - t.avail_out), a = s + (t.avail_out - 257), l = n.dmax, h = n.wsize, u = n.whave, f = n.wnext, c = n.window, d = n.hold, g = n.bits, p = n.lencode, m = n.distcode, _ = (1 << n.lenbits) - 1, b = (1 << n.distbits) - 1;\n          t: do {\n            g < 15 && (d += A[r++] << g, g += 8, d += A[r++] << g, g += 8), w = p[d & _];\n            e: for (;;) {\n              if (d >>>= y = w >>> 24, g -= y, 0 == (y = w >>> 16 & 255)) B[s++] = 65535 & w;else {\n                if (!(16 & y)) {\n                  if (0 == (64 & y)) {\n                    w = p[(65535 & w) + (d & (1 << y) - 1)];\n                    continue e;\n                  }\n                  if (32 & y) {\n                    n.mode = 12;\n                    break t;\n                  }\n                  t.msg = \"invalid literal/length code\", n.mode = 30;\n                  break t;\n                }\n                v = 65535 & w, (y &= 15) && (g < y && (d += A[r++] << g, g += 8), v += d & (1 << y) - 1, d >>>= y, g -= y), g < 15 && (d += A[r++] << g, g += 8, d += A[r++] << g, g += 8), w = m[d & b];\n                n: for (;;) {\n                  if (d >>>= y = w >>> 24, g -= y, !(16 & (y = w >>> 16 & 255))) {\n                    if (0 == (64 & y)) {\n                      w = m[(65535 & w) + (d & (1 << y) - 1)];\n                      continue n;\n                    }\n                    t.msg = \"invalid distance code\", n.mode = 30;\n                    break t;\n                  }\n                  if (k = 65535 & w, g < (y &= 15) && (d += A[r++] << g, (g += 8) < y && (d += A[r++] << g, g += 8)), (k += d & (1 << y) - 1) > l) {\n                    t.msg = \"invalid distance too far back\", n.mode = 30;\n                    break t;\n                  }\n                  if (d >>>= y, g -= y, k > (y = s - o)) {\n                    if ((y = k - y) > u && n.sane) {\n                      t.msg = \"invalid distance too far back\", n.mode = 30;\n                      break t;\n                    }\n                    if (x = 0, E = c, 0 === f) {\n                      if (x += h - y, y < v) {\n                        v -= y;\n                        do {\n                          B[s++] = c[x++];\n                        } while (--y);\n                        x = s - k, E = B;\n                      }\n                    } else if (f < y) {\n                      if (x += h + f - y, (y -= f) < v) {\n                        v -= y;\n                        do {\n                          B[s++] = c[x++];\n                        } while (--y);\n                        if (x = 0, f < v) {\n                          v -= y = f;\n                          do {\n                            B[s++] = c[x++];\n                          } while (--y);\n                          x = s - k, E = B;\n                        }\n                      }\n                    } else if (x += f - y, y < v) {\n                      v -= y;\n                      do {\n                        B[s++] = c[x++];\n                      } while (--y);\n                      x = s - k, E = B;\n                    }\n                    for (; v > 2;) B[s++] = E[x++], B[s++] = E[x++], B[s++] = E[x++], v -= 3;\n                    v && (B[s++] = E[x++], v > 1 && (B[s++] = E[x++]));\n                  } else {\n                    x = s - k;\n                    do {\n                      B[s++] = B[x++], B[s++] = B[x++], B[s++] = B[x++], v -= 3;\n                    } while (v > 2);\n                    v && (B[s++] = B[x++], v > 1 && (B[s++] = B[x++]));\n                  }\n                  break;\n                }\n              }\n              break;\n            }\n          } while (r < i && s < a);\n          r -= v = g >> 3, d &= (1 << (g -= v << 3)) - 1, t.next_in = r, t.next_out = s, t.avail_in = r < i ? i - r + 5 : 5 - (r - i), t.avail_out = s < a ? a - s + 257 : 257 - (s - a), n.hold = d, n.bits = g;\n        };\n      },\n      3519: function _(t, e, n) {\n        \"use strict\";\n\n        var r = n(9639),\n          i = n(2084),\n          s = n(1647),\n          o = n(7424),\n          a = n(8035),\n          l = 0,\n          h = -2,\n          u = 1,\n          f = 12,\n          c = 30,\n          d = 852,\n          g = 592;\n        function p(t) {\n          return (t >>> 24 & 255) + (t >>> 8 & 65280) + ((65280 & t) << 8) + ((255 & t) << 24);\n        }\n        function m() {\n          this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new r.Buf16(320), this.work = new r.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;\n        }\n        function _(t) {\n          var e;\n          return t && t.state ? (e = t.state, t.total_in = t.total_out = e.total = 0, t.msg = \"\", e.wrap && (t.adler = 1 & e.wrap), e.mode = u, e.last = 0, e.havedict = 0, e.dmax = 32768, e.head = null, e.hold = 0, e.bits = 0, e.lencode = e.lendyn = new r.Buf32(d), e.distcode = e.distdyn = new r.Buf32(g), e.sane = 1, e.back = -1, l) : h;\n        }\n        function b(t) {\n          var e;\n          return t && t.state ? ((e = t.state).wsize = 0, e.whave = 0, e.wnext = 0, _(t)) : h;\n        }\n        function w(t, e) {\n          var n, r;\n          return t && t.state ? (r = t.state, e < 0 ? (n = 0, e = -e) : (n = 1 + (e >> 4), e < 48 && (e &= 15)), e && (e < 8 || e > 15) ? h : (null !== r.window && r.wbits !== e && (r.window = null), r.wrap = n, r.wbits = e, b(t))) : h;\n        }\n        function y(t, e) {\n          var n, r;\n          return t ? (r = new m(), t.state = r, r.window = null, (n = w(t, e)) !== l && (t.state = null), n) : h;\n        }\n        var v,\n          k,\n          x = !0;\n        function E(t) {\n          if (x) {\n            var e;\n            for (v = new r.Buf32(512), k = new r.Buf32(32), e = 0; e < 144;) t.lens[e++] = 8;\n            for (; e < 256;) t.lens[e++] = 9;\n            for (; e < 280;) t.lens[e++] = 7;\n            for (; e < 288;) t.lens[e++] = 8;\n            for (a(1, t.lens, 0, 288, v, 0, t.work, {\n              bits: 9\n            }), e = 0; e < 32;) t.lens[e++] = 5;\n            a(2, t.lens, 0, 32, k, 0, t.work, {\n              bits: 5\n            }), x = !1;\n          }\n          t.lencode = v, t.lenbits = 9, t.distcode = k, t.distbits = 5;\n        }\n        function A(t, e, n, i) {\n          var s,\n            o = t.state;\n          return null === o.window && (o.wsize = 1 << o.wbits, o.wnext = 0, o.whave = 0, o.window = new r.Buf8(o.wsize)), i >= o.wsize ? (r.arraySet(o.window, e, n - o.wsize, o.wsize, 0), o.wnext = 0, o.whave = o.wsize) : ((s = o.wsize - o.wnext) > i && (s = i), r.arraySet(o.window, e, n - i, s, o.wnext), (i -= s) ? (r.arraySet(o.window, e, n - i, i, 0), o.wnext = i, o.whave = o.wsize) : (o.wnext += s, o.wnext === o.wsize && (o.wnext = 0), o.whave < o.wsize && (o.whave += s))), 0;\n        }\n        e.inflateReset = b, e.inflateReset2 = w, e.inflateResetKeep = _, e.inflateInit = function (t) {\n          return y(t, 15);\n        }, e.inflateInit2 = y, e.inflate = function (t, e) {\n          var n,\n            d,\n            g,\n            m,\n            _,\n            b,\n            w,\n            y,\n            v,\n            k,\n            x,\n            B,\n            S,\n            I,\n            M,\n            T,\n            z,\n            O,\n            C,\n            R,\n            N,\n            L,\n            U,\n            P,\n            $ = 0,\n            j = new r.Buf8(4),\n            F = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];\n          if (!t || !t.state || !t.output || !t.input && 0 !== t.avail_in) return h;\n          (n = t.state).mode === f && (n.mode = 13), _ = t.next_out, g = t.output, w = t.avail_out, m = t.next_in, d = t.input, b = t.avail_in, y = n.hold, v = n.bits, k = b, x = w, L = l;\n          t: for (;;) switch (n.mode) {\n            case u:\n              if (0 === n.wrap) {\n                n.mode = 13;\n                break;\n              }\n              for (; v < 16;) {\n                if (0 === b) break t;\n                b--, y += d[m++] << v, v += 8;\n              }\n              if (2 & n.wrap && 35615 === y) {\n                n.check = 0, j[0] = 255 & y, j[1] = y >>> 8 & 255, n.check = s(n.check, j, 2, 0), y = 0, v = 0, n.mode = 2;\n                break;\n              }\n              if (n.flags = 0, n.head && (n.head.done = !1), !(1 & n.wrap) || (((255 & y) << 8) + (y >> 8)) % 31) {\n                t.msg = \"incorrect header check\", n.mode = c;\n                break;\n              }\n              if (8 != (15 & y)) {\n                t.msg = \"unknown compression method\", n.mode = c;\n                break;\n              }\n              if (v -= 4, N = 8 + (15 & (y >>>= 4)), 0 === n.wbits) n.wbits = N;else if (N > n.wbits) {\n                t.msg = \"invalid window size\", n.mode = c;\n                break;\n              }\n              n.dmax = 1 << N, t.adler = n.check = 1, n.mode = 512 & y ? 10 : f, y = 0, v = 0;\n              break;\n            case 2:\n              for (; v < 16;) {\n                if (0 === b) break t;\n                b--, y += d[m++] << v, v += 8;\n              }\n              if (n.flags = y, 8 != (255 & n.flags)) {\n                t.msg = \"unknown compression method\", n.mode = c;\n                break;\n              }\n              if (57344 & n.flags) {\n                t.msg = \"unknown header flags set\", n.mode = c;\n                break;\n              }\n              n.head && (n.head.text = y >> 8 & 1), 512 & n.flags && (j[0] = 255 & y, j[1] = y >>> 8 & 255, n.check = s(n.check, j, 2, 0)), y = 0, v = 0, n.mode = 3;\n            case 3:\n              for (; v < 32;) {\n                if (0 === b) break t;\n                b--, y += d[m++] << v, v += 8;\n              }\n              n.head && (n.head.time = y), 512 & n.flags && (j[0] = 255 & y, j[1] = y >>> 8 & 255, j[2] = y >>> 16 & 255, j[3] = y >>> 24 & 255, n.check = s(n.check, j, 4, 0)), y = 0, v = 0, n.mode = 4;\n            case 4:\n              for (; v < 16;) {\n                if (0 === b) break t;\n                b--, y += d[m++] << v, v += 8;\n              }\n              n.head && (n.head.xflags = 255 & y, n.head.os = y >> 8), 512 & n.flags && (j[0] = 255 & y, j[1] = y >>> 8 & 255, n.check = s(n.check, j, 2, 0)), y = 0, v = 0, n.mode = 5;\n            case 5:\n              if (1024 & n.flags) {\n                for (; v < 16;) {\n                  if (0 === b) break t;\n                  b--, y += d[m++] << v, v += 8;\n                }\n                n.length = y, n.head && (n.head.extra_len = y), 512 & n.flags && (j[0] = 255 & y, j[1] = y >>> 8 & 255, n.check = s(n.check, j, 2, 0)), y = 0, v = 0;\n              } else n.head && (n.head.extra = null);\n              n.mode = 6;\n            case 6:\n              if (1024 & n.flags && ((B = n.length) > b && (B = b), B && (n.head && (N = n.head.extra_len - n.length, n.head.extra || (n.head.extra = new Array(n.head.extra_len)), r.arraySet(n.head.extra, d, m, B, N)), 512 & n.flags && (n.check = s(n.check, d, B, m)), b -= B, m += B, n.length -= B), n.length)) break t;\n              n.length = 0, n.mode = 7;\n            case 7:\n              if (2048 & n.flags) {\n                if (0 === b) break t;\n                B = 0;\n                do {\n                  N = d[m + B++], n.head && N && n.length < 65536 && (n.head.name += String.fromCharCode(N));\n                } while (N && B < b);\n                if (512 & n.flags && (n.check = s(n.check, d, B, m)), b -= B, m += B, N) break t;\n              } else n.head && (n.head.name = null);\n              n.length = 0, n.mode = 8;\n            case 8:\n              if (4096 & n.flags) {\n                if (0 === b) break t;\n                B = 0;\n                do {\n                  N = d[m + B++], n.head && N && n.length < 65536 && (n.head.comment += String.fromCharCode(N));\n                } while (N && B < b);\n                if (512 & n.flags && (n.check = s(n.check, d, B, m)), b -= B, m += B, N) break t;\n              } else n.head && (n.head.comment = null);\n              n.mode = 9;\n            case 9:\n              if (512 & n.flags) {\n                for (; v < 16;) {\n                  if (0 === b) break t;\n                  b--, y += d[m++] << v, v += 8;\n                }\n                if (y !== (65535 & n.check)) {\n                  t.msg = \"header crc mismatch\", n.mode = c;\n                  break;\n                }\n                y = 0, v = 0;\n              }\n              n.head && (n.head.hcrc = n.flags >> 9 & 1, n.head.done = !0), t.adler = n.check = 0, n.mode = f;\n              break;\n            case 10:\n              for (; v < 32;) {\n                if (0 === b) break t;\n                b--, y += d[m++] << v, v += 8;\n              }\n              t.adler = n.check = p(y), y = 0, v = 0, n.mode = 11;\n            case 11:\n              if (0 === n.havedict) return t.next_out = _, t.avail_out = w, t.next_in = m, t.avail_in = b, n.hold = y, n.bits = v, 2;\n              t.adler = n.check = 1, n.mode = f;\n            case f:\n              if (5 === e || 6 === e) break t;\n            case 13:\n              if (n.last) {\n                y >>>= 7 & v, v -= 7 & v, n.mode = 27;\n                break;\n              }\n              for (; v < 3;) {\n                if (0 === b) break t;\n                b--, y += d[m++] << v, v += 8;\n              }\n              switch (n.last = 1 & y, v -= 1, 3 & (y >>>= 1)) {\n                case 0:\n                  n.mode = 14;\n                  break;\n                case 1:\n                  if (E(n), n.mode = 20, 6 === e) {\n                    y >>>= 2, v -= 2;\n                    break t;\n                  }\n                  break;\n                case 2:\n                  n.mode = 17;\n                  break;\n                case 3:\n                  t.msg = \"invalid block type\", n.mode = c;\n              }\n              y >>>= 2, v -= 2;\n              break;\n            case 14:\n              for (y >>>= 7 & v, v -= 7 & v; v < 32;) {\n                if (0 === b) break t;\n                b--, y += d[m++] << v, v += 8;\n              }\n              if ((65535 & y) != (y >>> 16 ^ 65535)) {\n                t.msg = \"invalid stored block lengths\", n.mode = c;\n                break;\n              }\n              if (n.length = 65535 & y, y = 0, v = 0, n.mode = 15, 6 === e) break t;\n            case 15:\n              n.mode = 16;\n            case 16:\n              if (B = n.length) {\n                if (B > b && (B = b), B > w && (B = w), 0 === B) break t;\n                r.arraySet(g, d, m, B, _), b -= B, m += B, w -= B, _ += B, n.length -= B;\n                break;\n              }\n              n.mode = f;\n              break;\n            case 17:\n              for (; v < 14;) {\n                if (0 === b) break t;\n                b--, y += d[m++] << v, v += 8;\n              }\n              if (n.nlen = 257 + (31 & y), y >>>= 5, v -= 5, n.ndist = 1 + (31 & y), y >>>= 5, v -= 5, n.ncode = 4 + (15 & y), y >>>= 4, v -= 4, n.nlen > 286 || n.ndist > 30) {\n                t.msg = \"too many length or distance symbols\", n.mode = c;\n                break;\n              }\n              n.have = 0, n.mode = 18;\n            case 18:\n              for (; n.have < n.ncode;) {\n                for (; v < 3;) {\n                  if (0 === b) break t;\n                  b--, y += d[m++] << v, v += 8;\n                }\n                n.lens[F[n.have++]] = 7 & y, y >>>= 3, v -= 3;\n              }\n              for (; n.have < 19;) n.lens[F[n.have++]] = 0;\n              if (n.lencode = n.lendyn, n.lenbits = 7, U = {\n                bits: n.lenbits\n              }, L = a(0, n.lens, 0, 19, n.lencode, 0, n.work, U), n.lenbits = U.bits, L) {\n                t.msg = \"invalid code lengths set\", n.mode = c;\n                break;\n              }\n              n.have = 0, n.mode = 19;\n            case 19:\n              for (; n.have < n.nlen + n.ndist;) {\n                for (; T = ($ = n.lencode[y & (1 << n.lenbits) - 1]) >>> 16 & 255, z = 65535 & $, !((M = $ >>> 24) <= v);) {\n                  if (0 === b) break t;\n                  b--, y += d[m++] << v, v += 8;\n                }\n                if (z < 16) y >>>= M, v -= M, n.lens[n.have++] = z;else {\n                  if (16 === z) {\n                    for (P = M + 2; v < P;) {\n                      if (0 === b) break t;\n                      b--, y += d[m++] << v, v += 8;\n                    }\n                    if (y >>>= M, v -= M, 0 === n.have) {\n                      t.msg = \"invalid bit length repeat\", n.mode = c;\n                      break;\n                    }\n                    N = n.lens[n.have - 1], B = 3 + (3 & y), y >>>= 2, v -= 2;\n                  } else if (17 === z) {\n                    for (P = M + 3; v < P;) {\n                      if (0 === b) break t;\n                      b--, y += d[m++] << v, v += 8;\n                    }\n                    v -= M, N = 0, B = 3 + (7 & (y >>>= M)), y >>>= 3, v -= 3;\n                  } else {\n                    for (P = M + 7; v < P;) {\n                      if (0 === b) break t;\n                      b--, y += d[m++] << v, v += 8;\n                    }\n                    v -= M, N = 0, B = 11 + (127 & (y >>>= M)), y >>>= 7, v -= 7;\n                  }\n                  if (n.have + B > n.nlen + n.ndist) {\n                    t.msg = \"invalid bit length repeat\", n.mode = c;\n                    break;\n                  }\n                  for (; B--;) n.lens[n.have++] = N;\n                }\n              }\n              if (n.mode === c) break;\n              if (0 === n.lens[256]) {\n                t.msg = \"invalid code -- missing end-of-block\", n.mode = c;\n                break;\n              }\n              if (n.lenbits = 9, U = {\n                bits: n.lenbits\n              }, L = a(1, n.lens, 0, n.nlen, n.lencode, 0, n.work, U), n.lenbits = U.bits, L) {\n                t.msg = \"invalid literal/lengths set\", n.mode = c;\n                break;\n              }\n              if (n.distbits = 6, n.distcode = n.distdyn, U = {\n                bits: n.distbits\n              }, L = a(2, n.lens, n.nlen, n.ndist, n.distcode, 0, n.work, U), n.distbits = U.bits, L) {\n                t.msg = \"invalid distances set\", n.mode = c;\n                break;\n              }\n              if (n.mode = 20, 6 === e) break t;\n            case 20:\n              n.mode = 21;\n            case 21:\n              if (b >= 6 && w >= 258) {\n                t.next_out = _, t.avail_out = w, t.next_in = m, t.avail_in = b, n.hold = y, n.bits = v, o(t, x), _ = t.next_out, g = t.output, w = t.avail_out, m = t.next_in, d = t.input, b = t.avail_in, y = n.hold, v = n.bits, n.mode === f && (n.back = -1);\n                break;\n              }\n              for (n.back = 0; T = ($ = n.lencode[y & (1 << n.lenbits) - 1]) >>> 16 & 255, z = 65535 & $, !((M = $ >>> 24) <= v);) {\n                if (0 === b) break t;\n                b--, y += d[m++] << v, v += 8;\n              }\n              if (T && 0 == (240 & T)) {\n                for (O = M, C = T, R = z; T = ($ = n.lencode[R + ((y & (1 << O + C) - 1) >> O)]) >>> 16 & 255, z = 65535 & $, !(O + (M = $ >>> 24) <= v);) {\n                  if (0 === b) break t;\n                  b--, y += d[m++] << v, v += 8;\n                }\n                y >>>= O, v -= O, n.back += O;\n              }\n              if (y >>>= M, v -= M, n.back += M, n.length = z, 0 === T) {\n                n.mode = 26;\n                break;\n              }\n              if (32 & T) {\n                n.back = -1, n.mode = f;\n                break;\n              }\n              if (64 & T) {\n                t.msg = \"invalid literal/length code\", n.mode = c;\n                break;\n              }\n              n.extra = 15 & T, n.mode = 22;\n            case 22:\n              if (n.extra) {\n                for (P = n.extra; v < P;) {\n                  if (0 === b) break t;\n                  b--, y += d[m++] << v, v += 8;\n                }\n                n.length += y & (1 << n.extra) - 1, y >>>= n.extra, v -= n.extra, n.back += n.extra;\n              }\n              n.was = n.length, n.mode = 23;\n            case 23:\n              for (; T = ($ = n.distcode[y & (1 << n.distbits) - 1]) >>> 16 & 255, z = 65535 & $, !((M = $ >>> 24) <= v);) {\n                if (0 === b) break t;\n                b--, y += d[m++] << v, v += 8;\n              }\n              if (0 == (240 & T)) {\n                for (O = M, C = T, R = z; T = ($ = n.distcode[R + ((y & (1 << O + C) - 1) >> O)]) >>> 16 & 255, z = 65535 & $, !(O + (M = $ >>> 24) <= v);) {\n                  if (0 === b) break t;\n                  b--, y += d[m++] << v, v += 8;\n                }\n                y >>>= O, v -= O, n.back += O;\n              }\n              if (y >>>= M, v -= M, n.back += M, 64 & T) {\n                t.msg = \"invalid distance code\", n.mode = c;\n                break;\n              }\n              n.offset = z, n.extra = 15 & T, n.mode = 24;\n            case 24:\n              if (n.extra) {\n                for (P = n.extra; v < P;) {\n                  if (0 === b) break t;\n                  b--, y += d[m++] << v, v += 8;\n                }\n                n.offset += y & (1 << n.extra) - 1, y >>>= n.extra, v -= n.extra, n.back += n.extra;\n              }\n              if (n.offset > n.dmax) {\n                t.msg = \"invalid distance too far back\", n.mode = c;\n                break;\n              }\n              n.mode = 25;\n            case 25:\n              if (0 === w) break t;\n              if (B = x - w, n.offset > B) {\n                if ((B = n.offset - B) > n.whave && n.sane) {\n                  t.msg = \"invalid distance too far back\", n.mode = c;\n                  break;\n                }\n                B > n.wnext ? (B -= n.wnext, S = n.wsize - B) : S = n.wnext - B, B > n.length && (B = n.length), I = n.window;\n              } else I = g, S = _ - n.offset, B = n.length;\n              B > w && (B = w), w -= B, n.length -= B;\n              do {\n                g[_++] = I[S++];\n              } while (--B);\n              0 === n.length && (n.mode = 21);\n              break;\n            case 26:\n              if (0 === w) break t;\n              g[_++] = n.length, w--, n.mode = 21;\n              break;\n            case 27:\n              if (n.wrap) {\n                for (; v < 32;) {\n                  if (0 === b) break t;\n                  b--, y |= d[m++] << v, v += 8;\n                }\n                if (x -= w, t.total_out += x, n.total += x, x && (t.adler = n.check = n.flags ? s(n.check, g, x, _ - x) : i(n.check, g, x, _ - x)), x = w, (n.flags ? y : p(y)) !== n.check) {\n                  t.msg = \"incorrect data check\", n.mode = c;\n                  break;\n                }\n                y = 0, v = 0;\n              }\n              n.mode = 28;\n            case 28:\n              if (n.wrap && n.flags) {\n                for (; v < 32;) {\n                  if (0 === b) break t;\n                  b--, y += d[m++] << v, v += 8;\n                }\n                if (y !== (4294967295 & n.total)) {\n                  t.msg = \"incorrect length check\", n.mode = c;\n                  break;\n                }\n                y = 0, v = 0;\n              }\n              n.mode = 29;\n            case 29:\n              L = 1;\n              break t;\n            case c:\n              L = -3;\n              break t;\n            case 31:\n              return -4;\n            default:\n              return h;\n          }\n          return t.next_out = _, t.avail_out = w, t.next_in = m, t.avail_in = b, n.hold = y, n.bits = v, (n.wsize || x !== t.avail_out && n.mode < c && (n.mode < 27 || 4 !== e)) && A(t, t.output, t.next_out, x - t.avail_out) ? (n.mode = 31, -4) : (k -= t.avail_in, x -= t.avail_out, t.total_in += k, t.total_out += x, n.total += x, n.wrap && x && (t.adler = n.check = n.flags ? s(n.check, g, x, t.next_out - x) : i(n.check, g, x, t.next_out - x)), t.data_type = n.bits + (n.last ? 64 : 0) + (n.mode === f ? 128 : 0) + (20 === n.mode || 15 === n.mode ? 256 : 0), (0 === k && 0 === x || 4 === e) && L === l && (L = -5), L);\n        }, e.inflateEnd = function (t) {\n          if (!t || !t.state) return h;\n          var e = t.state;\n          return e.window && (e.window = null), t.state = null, l;\n        }, e.inflateGetHeader = function (t, e) {\n          var n;\n          return t && t.state ? 0 == (2 & (n = t.state).wrap) ? h : (n.head = e, e.done = !1, l) : h;\n        }, e.inflateSetDictionary = function (t, e) {\n          var n,\n            r = e.length;\n          return t && t.state ? 0 !== (n = t.state).wrap && 11 !== n.mode ? h : 11 === n.mode && i(1, e, r, 0) !== n.check ? -3 : A(t, e, r, r) ? (n.mode = 31, -4) : (n.havedict = 1, l) : h;\n        }, e.inflateInfo = \"pako inflate (from Nodeca project)\";\n      },\n      8035: function _(t, e, n) {\n        \"use strict\";\n\n        var r = n(9639),\n          i = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0],\n          s = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78],\n          o = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0],\n          a = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];\n        t.exports = function (t, e, n, l, h, u, f, c) {\n          var d,\n            g,\n            p,\n            m,\n            _,\n            b,\n            w,\n            y,\n            v,\n            k = c.bits,\n            x = 0,\n            E = 0,\n            A = 0,\n            B = 0,\n            S = 0,\n            I = 0,\n            M = 0,\n            T = 0,\n            z = 0,\n            O = 0,\n            C = null,\n            R = 0,\n            N = new r.Buf16(16),\n            L = new r.Buf16(16),\n            U = null,\n            P = 0;\n          for (x = 0; x <= 15; x++) N[x] = 0;\n          for (E = 0; E < l; E++) N[e[n + E]]++;\n          for (S = k, B = 15; B >= 1 && 0 === N[B]; B--);\n          if (S > B && (S = B), 0 === B) return h[u++] = 20971520, h[u++] = 20971520, c.bits = 1, 0;\n          for (A = 1; A < B && 0 === N[A]; A++);\n          for (S < A && (S = A), T = 1, x = 1; x <= 15; x++) if (T <<= 1, (T -= N[x]) < 0) return -1;\n          if (T > 0 && (0 === t || 1 !== B)) return -1;\n          for (L[1] = 0, x = 1; x < 15; x++) L[x + 1] = L[x] + N[x];\n          for (E = 0; E < l; E++) 0 !== e[n + E] && (f[L[e[n + E]]++] = E);\n          if (0 === t ? (C = U = f, b = 19) : 1 === t ? (C = i, R -= 257, U = s, P -= 257, b = 256) : (C = o, U = a, b = -1), O = 0, E = 0, x = A, _ = u, I = S, M = 0, p = -1, m = (z = 1 << S) - 1, 1 === t && z > 852 || 2 === t && z > 592) return 1;\n          for (;;) {\n            w = x - M, f[E] < b ? (y = 0, v = f[E]) : f[E] > b ? (y = U[P + f[E]], v = C[R + f[E]]) : (y = 96, v = 0), d = 1 << x - M, A = g = 1 << I;\n            do {\n              h[_ + (O >> M) + (g -= d)] = w << 24 | y << 16 | v | 0;\n            } while (0 !== g);\n            for (d = 1 << x - 1; O & d;) d >>= 1;\n            if (0 !== d ? (O &= d - 1, O += d) : O = 0, E++, 0 == --N[x]) {\n              if (x === B) break;\n              x = e[n + f[E]];\n            }\n            if (x > S && (O & m) !== p) {\n              for (0 === M && (M = S), _ += A, T = 1 << (I = x - M); I + M < B && !((T -= N[I + M]) <= 0);) I++, T <<= 1;\n              if (z += 1 << I, 1 === t && z > 852 || 2 === t && z > 592) return 1;\n              h[p = O & m] = S << 24 | I << 16 | _ - u | 0;\n            }\n          }\n          return 0 !== O && (h[_ + O] = x - M << 24 | 64 << 16 | 0), c.bits = S, 0;\n        };\n      },\n      5837: function _(t) {\n        \"use strict\";\n\n        t.exports = {\n          2: \"need dictionary\",\n          1: \"stream end\",\n          0: \"\",\n          \"-1\": \"file error\",\n          \"-2\": \"stream error\",\n          \"-3\": \"data error\",\n          \"-4\": \"insufficient memory\",\n          \"-5\": \"buffer error\",\n          \"-6\": \"incompatible version\"\n        };\n      },\n      2169: function _(t, e, n) {\n        \"use strict\";\n\n        var r = n(9639);\n        function i(t) {\n          for (var e = t.length; --e >= 0;) t[e] = 0;\n        }\n        var s = 256,\n          o = 286,\n          a = 30,\n          l = 15,\n          h = 16,\n          u = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0],\n          f = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13],\n          c = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7],\n          d = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15],\n          g = new Array(576);\n        i(g);\n        var p = new Array(60);\n        i(p);\n        var m = new Array(512);\n        i(m);\n        var _ = new Array(256);\n        i(_);\n        var b = new Array(29);\n        i(b);\n        var w,\n          y,\n          v,\n          k = new Array(a);\n        function x(t, e, n, r, i) {\n          this.static_tree = t, this.extra_bits = e, this.extra_base = n, this.elems = r, this.max_length = i, this.has_stree = t && t.length;\n        }\n        function E(t, e) {\n          this.dyn_tree = t, this.max_code = 0, this.stat_desc = e;\n        }\n        function A(t) {\n          return t < 256 ? m[t] : m[256 + (t >>> 7)];\n        }\n        function B(t, e) {\n          t.pending_buf[t.pending++] = 255 & e, t.pending_buf[t.pending++] = e >>> 8 & 255;\n        }\n        function S(t, e, n) {\n          t.bi_valid > h - n ? (t.bi_buf |= e << t.bi_valid & 65535, B(t, t.bi_buf), t.bi_buf = e >> h - t.bi_valid, t.bi_valid += n - h) : (t.bi_buf |= e << t.bi_valid & 65535, t.bi_valid += n);\n        }\n        function I(t, e, n) {\n          S(t, n[2 * e], n[2 * e + 1]);\n        }\n        function M(t, e) {\n          var n = 0;\n          do {\n            n |= 1 & t, t >>>= 1, n <<= 1;\n          } while (--e > 0);\n          return n >>> 1;\n        }\n        function T(t, e, n) {\n          var r,\n            i,\n            s = new Array(l + 1),\n            o = 0;\n          for (r = 1; r <= l; r++) s[r] = o = o + n[r - 1] << 1;\n          for (i = 0; i <= e; i++) {\n            var a = t[2 * i + 1];\n            0 !== a && (t[2 * i] = M(s[a]++, a));\n          }\n        }\n        function z(t) {\n          var e;\n          for (e = 0; e < o; e++) t.dyn_ltree[2 * e] = 0;\n          for (e = 0; e < a; e++) t.dyn_dtree[2 * e] = 0;\n          for (e = 0; e < 19; e++) t.bl_tree[2 * e] = 0;\n          t.dyn_ltree[512] = 1, t.opt_len = t.static_len = 0, t.last_lit = t.matches = 0;\n        }\n        function O(t) {\n          t.bi_valid > 8 ? B(t, t.bi_buf) : t.bi_valid > 0 && (t.pending_buf[t.pending++] = t.bi_buf), t.bi_buf = 0, t.bi_valid = 0;\n        }\n        function C(t, e, n, r) {\n          var i = 2 * e,\n            s = 2 * n;\n          return t[i] < t[s] || t[i] === t[s] && r[e] <= r[n];\n        }\n        function R(t, e, n) {\n          for (var r = t.heap[n], i = n << 1; i <= t.heap_len && (i < t.heap_len && C(e, t.heap[i + 1], t.heap[i], t.depth) && i++, !C(e, r, t.heap[i], t.depth));) t.heap[n] = t.heap[i], n = i, i <<= 1;\n          t.heap[n] = r;\n        }\n        function N(t, e, n) {\n          var r,\n            i,\n            o,\n            a,\n            l = 0;\n          if (0 !== t.last_lit) do {\n            r = t.pending_buf[t.d_buf + 2 * l] << 8 | t.pending_buf[t.d_buf + 2 * l + 1], i = t.pending_buf[t.l_buf + l], l++, 0 === r ? I(t, i, e) : (I(t, (o = _[i]) + s + 1, e), 0 !== (a = u[o]) && S(t, i -= b[o], a), I(t, o = A(--r), n), 0 !== (a = f[o]) && S(t, r -= k[o], a));\n          } while (l < t.last_lit);\n          I(t, 256, e);\n        }\n        function L(t, e) {\n          var n,\n            r,\n            i,\n            s = e.dyn_tree,\n            o = e.stat_desc.static_tree,\n            a = e.stat_desc.has_stree,\n            h = e.stat_desc.elems,\n            u = -1;\n          for (t.heap_len = 0, t.heap_max = 573, n = 0; n < h; n++) 0 !== s[2 * n] ? (t.heap[++t.heap_len] = u = n, t.depth[n] = 0) : s[2 * n + 1] = 0;\n          for (; t.heap_len < 2;) s[2 * (i = t.heap[++t.heap_len] = u < 2 ? ++u : 0)] = 1, t.depth[i] = 0, t.opt_len--, a && (t.static_len -= o[2 * i + 1]);\n          for (e.max_code = u, n = t.heap_len >> 1; n >= 1; n--) R(t, s, n);\n          i = h;\n          do {\n            n = t.heap[1], t.heap[1] = t.heap[t.heap_len--], R(t, s, 1), r = t.heap[1], t.heap[--t.heap_max] = n, t.heap[--t.heap_max] = r, s[2 * i] = s[2 * n] + s[2 * r], t.depth[i] = (t.depth[n] >= t.depth[r] ? t.depth[n] : t.depth[r]) + 1, s[2 * n + 1] = s[2 * r + 1] = i, t.heap[1] = i++, R(t, s, 1);\n          } while (t.heap_len >= 2);\n          t.heap[--t.heap_max] = t.heap[1], function (t, e) {\n            var n,\n              r,\n              i,\n              s,\n              o,\n              a,\n              h = e.dyn_tree,\n              u = e.max_code,\n              f = e.stat_desc.static_tree,\n              c = e.stat_desc.has_stree,\n              d = e.stat_desc.extra_bits,\n              g = e.stat_desc.extra_base,\n              p = e.stat_desc.max_length,\n              m = 0;\n            for (s = 0; s <= l; s++) t.bl_count[s] = 0;\n            for (h[2 * t.heap[t.heap_max] + 1] = 0, n = t.heap_max + 1; n < 573; n++) (s = h[2 * h[2 * (r = t.heap[n]) + 1] + 1] + 1) > p && (s = p, m++), h[2 * r + 1] = s, r > u || (t.bl_count[s]++, o = 0, r >= g && (o = d[r - g]), a = h[2 * r], t.opt_len += a * (s + o), c && (t.static_len += a * (f[2 * r + 1] + o)));\n            if (0 !== m) {\n              do {\n                for (s = p - 1; 0 === t.bl_count[s];) s--;\n                t.bl_count[s]--, t.bl_count[s + 1] += 2, t.bl_count[p]--, m -= 2;\n              } while (m > 0);\n              for (s = p; 0 !== s; s--) for (r = t.bl_count[s]; 0 !== r;) (i = t.heap[--n]) > u || (h[2 * i + 1] !== s && (t.opt_len += (s - h[2 * i + 1]) * h[2 * i], h[2 * i + 1] = s), r--);\n            }\n          }(t, e), T(s, u, t.bl_count);\n        }\n        function U(t, e, n) {\n          var r,\n            i,\n            s = -1,\n            o = e[1],\n            a = 0,\n            l = 7,\n            h = 4;\n          for (0 === o && (l = 138, h = 3), e[2 * (n + 1) + 1] = 65535, r = 0; r <= n; r++) i = o, o = e[2 * (r + 1) + 1], ++a < l && i === o || (a < h ? t.bl_tree[2 * i] += a : 0 !== i ? (i !== s && t.bl_tree[2 * i]++, t.bl_tree[32]++) : a <= 10 ? t.bl_tree[34]++ : t.bl_tree[36]++, a = 0, s = i, 0 === o ? (l = 138, h = 3) : i === o ? (l = 6, h = 3) : (l = 7, h = 4));\n        }\n        function P(t, e, n) {\n          var r,\n            i,\n            s = -1,\n            o = e[1],\n            a = 0,\n            l = 7,\n            h = 4;\n          for (0 === o && (l = 138, h = 3), r = 0; r <= n; r++) if (i = o, o = e[2 * (r + 1) + 1], !(++a < l && i === o)) {\n            if (a < h) do {\n              I(t, i, t.bl_tree);\n            } while (0 != --a);else 0 !== i ? (i !== s && (I(t, i, t.bl_tree), a--), I(t, 16, t.bl_tree), S(t, a - 3, 2)) : a <= 10 ? (I(t, 17, t.bl_tree), S(t, a - 3, 3)) : (I(t, 18, t.bl_tree), S(t, a - 11, 7));\n            a = 0, s = i, 0 === o ? (l = 138, h = 3) : i === o ? (l = 6, h = 3) : (l = 7, h = 4);\n          }\n        }\n        i(k);\n        var $ = !1;\n        function j(t, e, n, i) {\n          S(t, 0 + (i ? 1 : 0), 3), function (t, e, n, i) {\n            O(t), B(t, n), B(t, ~n), r.arraySet(t.pending_buf, t.window, e, n, t.pending), t.pending += n;\n          }(t, e, n);\n        }\n        e._tr_init = function (t) {\n          $ || (function () {\n            var t,\n              e,\n              n,\n              r,\n              i,\n              s = new Array(l + 1);\n            for (n = 0, r = 0; r < 28; r++) for (b[r] = n, t = 0; t < 1 << u[r]; t++) _[n++] = r;\n            for (_[n - 1] = r, i = 0, r = 0; r < 16; r++) for (k[r] = i, t = 0; t < 1 << f[r]; t++) m[i++] = r;\n            for (i >>= 7; r < a; r++) for (k[r] = i << 7, t = 0; t < 1 << f[r] - 7; t++) m[256 + i++] = r;\n            for (e = 0; e <= l; e++) s[e] = 0;\n            for (t = 0; t <= 143;) g[2 * t + 1] = 8, t++, s[8]++;\n            for (; t <= 255;) g[2 * t + 1] = 9, t++, s[9]++;\n            for (; t <= 279;) g[2 * t + 1] = 7, t++, s[7]++;\n            for (; t <= 287;) g[2 * t + 1] = 8, t++, s[8]++;\n            for (T(g, 287, s), t = 0; t < a; t++) p[2 * t + 1] = 5, p[2 * t] = M(t, 5);\n            w = new x(g, u, 257, o, l), y = new x(p, f, 0, a, l), v = new x(new Array(0), c, 0, 19, 7);\n          }(), $ = !0), t.l_desc = new E(t.dyn_ltree, w), t.d_desc = new E(t.dyn_dtree, y), t.bl_desc = new E(t.bl_tree, v), t.bi_buf = 0, t.bi_valid = 0, z(t);\n        }, e._tr_stored_block = j, e._tr_flush_block = function (t, e, n, r) {\n          var i,\n            o,\n            a = 0;\n          t.level > 0 ? (2 === t.strm.data_type && (t.strm.data_type = function (t) {\n            var e,\n              n = 4093624447;\n            for (e = 0; e <= 31; e++, n >>>= 1) if (1 & n && 0 !== t.dyn_ltree[2 * e]) return 0;\n            if (0 !== t.dyn_ltree[18] || 0 !== t.dyn_ltree[20] || 0 !== t.dyn_ltree[26]) return 1;\n            for (e = 32; e < s; e++) if (0 !== t.dyn_ltree[2 * e]) return 1;\n            return 0;\n          }(t)), L(t, t.l_desc), L(t, t.d_desc), a = function (t) {\n            var e;\n            for (U(t, t.dyn_ltree, t.l_desc.max_code), U(t, t.dyn_dtree, t.d_desc.max_code), L(t, t.bl_desc), e = 18; e >= 3 && 0 === t.bl_tree[2 * d[e] + 1]; e--);\n            return t.opt_len += 3 * (e + 1) + 5 + 5 + 4, e;\n          }(t), i = t.opt_len + 3 + 7 >>> 3, (o = t.static_len + 3 + 7 >>> 3) <= i && (i = o)) : i = o = n + 5, n + 4 <= i && -1 !== e ? j(t, e, n, r) : 4 === t.strategy || o === i ? (S(t, 2 + (r ? 1 : 0), 3), N(t, g, p)) : (S(t, 4 + (r ? 1 : 0), 3), function (t, e, n, r) {\n            var i;\n            for (S(t, e - 257, 5), S(t, n - 1, 5), S(t, r - 4, 4), i = 0; i < r; i++) S(t, t.bl_tree[2 * d[i] + 1], 3);\n            P(t, t.dyn_ltree, e - 1), P(t, t.dyn_dtree, n - 1);\n          }(t, t.l_desc.max_code + 1, t.d_desc.max_code + 1, a + 1), N(t, t.dyn_ltree, t.dyn_dtree)), z(t), r && O(t);\n        }, e._tr_tally = function (t, e, n) {\n          return t.pending_buf[t.d_buf + 2 * t.last_lit] = e >>> 8 & 255, t.pending_buf[t.d_buf + 2 * t.last_lit + 1] = 255 & e, t.pending_buf[t.l_buf + t.last_lit] = 255 & n, t.last_lit++, 0 === e ? t.dyn_ltree[2 * n]++ : (t.matches++, e--, t.dyn_ltree[2 * (_[n] + s + 1)]++, t.dyn_dtree[2 * A(e)]++), t.last_lit === t.lit_bufsize - 1;\n        }, e._tr_align = function (t) {\n          S(t, 2, 3), I(t, 256, g), function (t) {\n            16 === t.bi_valid ? (B(t, t.bi_buf), t.bi_buf = 0, t.bi_valid = 0) : t.bi_valid >= 8 && (t.pending_buf[t.pending++] = 255 & t.bi_buf, t.bi_buf >>= 8, t.bi_valid -= 8);\n          }(t);\n        };\n      },\n      6916: function _(t) {\n        \"use strict\";\n\n        t.exports = function () {\n          this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = \"\", this.state = null, this.data_type = 2, this.adler = 0;\n        };\n      },\n      7298: function _(t) {\n        \"use strict\";\n\n        var e = /*#__PURE__*/function (_Symbol$iterator) {\n          function e() {\n            var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};\n            _classCallCheck(this, e);\n            if (!(t.maxSize && t.maxSize > 0)) throw new TypeError(\"`maxSize` must be a number greater than 0\");\n            this.maxSize = t.maxSize, this.cache = new Map(), this.oldCache = new Map(), this._size = 0;\n          }\n          _createClass(e, [{\n            key: \"_set\",\n            value: function _set(t, _e2) {\n              this.cache.set(t, _e2), this._size++, this._size >= this.maxSize && (this._size = 0, this.oldCache = this.cache, this.cache = new Map());\n            }\n          }, {\n            key: \"get\",\n            value: function get(t) {\n              if (this.cache.has(t)) return this.cache.get(t);\n              if (this.oldCache.has(t)) {\n                var _e3 = this.oldCache.get(t);\n                return this.oldCache[\"delete\"](t), this._set(t, _e3), _e3;\n              }\n            }\n          }, {\n            key: \"set\",\n            value: function set(t, _e4) {\n              return this.cache.has(t) ? this.cache.set(t, _e4) : this._set(t, _e4), this;\n            }\n          }, {\n            key: \"has\",\n            value: function has(t) {\n              return this.cache.has(t) || this.oldCache.has(t);\n            }\n          }, {\n            key: \"peek\",\n            value: function peek(t) {\n              return this.cache.has(t) ? this.cache.get(t) : this.oldCache.has(t) ? this.oldCache.get(t) : void 0;\n            }\n          }, {\n            key: \"delete\",\n            value: function _delete(t) {\n              var _e5 = this.cache[\"delete\"](t);\n              return _e5 && this._size--, this.oldCache[\"delete\"](t) || _e5;\n            }\n          }, {\n            key: \"clear\",\n            value: function clear() {\n              this.cache.clear(), this.oldCache.clear(), this._size = 0;\n            }\n          }, {\n            key: \"keys\",\n            value: /*#__PURE__*/_regeneratorRuntime().mark(function keys() {\n              var _iterator2, _step2, _step2$value, _t2;\n              return _regeneratorRuntime().wrap(function keys$(_context) {\n                while (1) switch (_context.prev = _context.next) {\n                  case 0:\n                    _iterator2 = _createForOfIteratorHelper(this);\n                    _context.prev = 1;\n                    _iterator2.s();\n                  case 3:\n                    if ((_step2 = _iterator2.n()).done) {\n                      _context.next = 9;\n                      break;\n                    }\n                    _step2$value = _slicedToArray(_step2.value, 1), _t2 = _step2$value[0];\n                    _context.next = 7;\n                    return _t2;\n                  case 7:\n                    _context.next = 3;\n                    break;\n                  case 9:\n                    _context.next = 14;\n                    break;\n                  case 11:\n                    _context.prev = 11;\n                    _context.t0 = _context[\"catch\"](1);\n                    _iterator2.e(_context.t0);\n                  case 14:\n                    _context.prev = 14;\n                    _iterator2.f();\n                    return _context.finish(14);\n                  case 17:\n                  case \"end\":\n                    return _context.stop();\n                }\n              }, keys, this, [[1, 11, 14, 17]]);\n            })\n          }, {\n            key: \"values\",\n            value: /*#__PURE__*/_regeneratorRuntime().mark(function values() {\n              var _iterator3, _step3, _step3$value, _t3;\n              return _regeneratorRuntime().wrap(function values$(_context2) {\n                while (1) switch (_context2.prev = _context2.next) {\n                  case 0:\n                    _iterator3 = _createForOfIteratorHelper(this);\n                    _context2.prev = 1;\n                    _iterator3.s();\n                  case 3:\n                    if ((_step3 = _iterator3.n()).done) {\n                      _context2.next = 9;\n                      break;\n                    }\n                    _step3$value = _slicedToArray(_step3.value, 2), _t3 = _step3$value[1];\n                    _context2.next = 7;\n                    return _t3;\n                  case 7:\n                    _context2.next = 3;\n                    break;\n                  case 9:\n                    _context2.next = 14;\n                    break;\n                  case 11:\n                    _context2.prev = 11;\n                    _context2.t0 = _context2[\"catch\"](1);\n                    _iterator3.e(_context2.t0);\n                  case 14:\n                    _context2.prev = 14;\n                    _iterator3.f();\n                    return _context2.finish(14);\n                  case 17:\n                  case \"end\":\n                    return _context2.stop();\n                }\n              }, values, this, [[1, 11, 14, 17]]);\n            })\n          }, {\n            key: _Symbol$iterator,\n            value: /*#__PURE__*/_regeneratorRuntime().mark(function value() {\n              var _iterator4, _step4, _t4, _iterator5, _step5, _t5, _t6, _e6;\n              return _regeneratorRuntime().wrap(function value$(_context3) {\n                while (1) switch (_context3.prev = _context3.next) {\n                  case 0:\n                    _iterator4 = _createForOfIteratorHelper(this.cache);\n                    _context3.prev = 1;\n                    _iterator4.s();\n                  case 3:\n                    if ((_step4 = _iterator4.n()).done) {\n                      _context3.next = 9;\n                      break;\n                    }\n                    _t4 = _step4.value;\n                    _context3.next = 7;\n                    return _t4;\n                  case 7:\n                    _context3.next = 3;\n                    break;\n                  case 9:\n                    _context3.next = 14;\n                    break;\n                  case 11:\n                    _context3.prev = 11;\n                    _context3.t0 = _context3[\"catch\"](1);\n                    _iterator4.e(_context3.t0);\n                  case 14:\n                    _context3.prev = 14;\n                    _iterator4.f();\n                    return _context3.finish(14);\n                  case 17:\n                    _iterator5 = _createForOfIteratorHelper(this.oldCache);\n                    _context3.prev = 18;\n                    _iterator5.s();\n                  case 20:\n                    if ((_step5 = _iterator5.n()).done) {\n                      _context3.next = 29;\n                      break;\n                    }\n                    _t5 = _step5.value;\n                    _t6 = _slicedToArray(_t5, 1), _e6 = _t6[0];\n                    _context3.t1 = this.cache.has(_e6);\n                    if (_context3.t1) {\n                      _context3.next = 27;\n                      break;\n                    }\n                    _context3.next = 27;\n                    return _t5;\n                  case 27:\n                    _context3.next = 20;\n                    break;\n                  case 29:\n                    _context3.next = 34;\n                    break;\n                  case 31:\n                    _context3.prev = 31;\n                    _context3.t2 = _context3[\"catch\"](18);\n                    _iterator5.e(_context3.t2);\n                  case 34:\n                    _context3.prev = 34;\n                    _iterator5.f();\n                    return _context3.finish(34);\n                  case 37:\n                  case \"end\":\n                    return _context3.stop();\n                }\n              }, value, this, [[1, 11, 14, 17], [18, 31, 34, 37]]);\n            })\n          }, {\n            key: \"size\",\n            get: function get() {\n              var t = 0;\n              var _iterator6 = _createForOfIteratorHelper(this.oldCache.keys()),\n                _step6;\n              try {\n                for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {\n                  var _e7 = _step6.value;\n                  this.cache.has(_e7) || t++;\n                }\n              } catch (err) {\n                _iterator6.e(err);\n              } finally {\n                _iterator6.f();\n              }\n              return this._size + t;\n            }\n          }]);\n          return e;\n        }(Symbol.iterator);\n        t.exports = e;\n      },\n      6248: function _(t) {\n        t.exports = function (_ref2) {\n          var t = _ref2.dataset,\n            e = _ref2.epsilon,\n            n = _ref2.epsilonCompare,\n            r = _ref2.minimumPoints,\n            i = _ref2.distanceFunction;\n          e = e || 1, n = n || function (t, e) {\n            return t < e;\n          }, r = r || 2, i = i || function (t, e) {\n            return Math.abs(t - e);\n          };\n          var s = {},\n            o = function o(t) {\n              return s[t];\n            },\n            a = function a(t) {\n              s[t] = !0;\n            },\n            l = {},\n            h = function h(t) {\n              return l[t];\n            },\n            u = function u(t, e) {\n              for (var n = 0; n < e.length; n += 1) {\n                var r = e[n];\n                t.indexOf(r) < 0 && t.push(r);\n              }\n            },\n            f = function f(r) {\n              for (var s = [], o = 0; o < t.length; o += 1) {\n                var a = i(t[r], t[o]);\n                n(a, e) && s.push(o);\n              }\n              return s;\n            },\n            c = [],\n            d = [],\n            g = function g(t, e) {\n              d[t].push(e), function (t) {\n                l[t] = !0;\n              }(e);\n            };\n          return t.forEach(function (t, e) {\n            if (!o(e)) {\n              a(e);\n              var n = f(e);\n              if (n.length < r) c.push(e);else {\n                var i = d.push([]) - 1;\n                g(i, e), function (t, e) {\n                  for (var n = 0; n < e.length; n += 1) {\n                    var i = e[n];\n                    if (!o(i)) {\n                      a(i);\n                      var s = f(i);\n                      s.length >= r && u(e, s);\n                    }\n                    h(i) || g(t, i);\n                  }\n                }(i, n);\n              }\n            }\n          }), {\n            clusters: d,\n            noise: c\n          };\n        };\n      },\n      4803: function _(t, e) {\n        \"use strict\";\n\n        e.eN = e.WI = e.eM = e.bP = void 0;\n        var n = function n(t, e) {\n          var n = 0;\n          var r = Math.min(t.length, e.length);\n          var i = 0;\n          for (; n < r;) i += (t[n] - e[n]) * (t[n] - e[n]), ++n;\n          return Math.sqrt(i);\n        };\n        e.WI = n, e.eN = function (t, e) {\n          var n = 0;\n          var r = Math.min(t.length, e.length);\n          var i = 0,\n            s = 0;\n          for (; n < r;) t[n] !== e[n] ? ++i : 0 !== t[n] && ++s, ++n;\n          return 0 !== i ? 1 - s / (s + 2 * i) : 0;\n        };\n        var r = function r(t, e, n) {\n          var r = 0;\n          var _iterator7 = _createForOfIteratorHelper(t),\n            _step7;\n          try {\n            for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {\n              var _i2 = _step7.value;\n              var _iterator8 = _createForOfIteratorHelper(e),\n                _step8;\n              try {\n                for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {\n                  var _t7 = _step8.value;\n                  r += n[_i2][_t7];\n                }\n              } catch (err) {\n                _iterator8.e(err);\n              } finally {\n                _iterator8.f();\n              }\n            }\n          } catch (err) {\n            _iterator7.e(err);\n          } finally {\n            _iterator7.f();\n          }\n          return r / t.length / e.length;\n        };\n        e.bP = r;\n        var i = function i(t, e, n) {\n          var r = t / 2 + e / 2;\n          \"function\" == typeof n && n(r), \"undefined\" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope && postMessage(r);\n        };\n        e.eM = function (_ref3) {\n          var _ref3$data = _ref3.data,\n            t = _ref3$data === void 0 ? [] : _ref3$data,\n            _ref3$key = _ref3.key,\n            e = _ref3$key === void 0 ? \"\" : _ref3$key,\n            _ref3$distance = _ref3.distance,\n            s = _ref3$distance === void 0 ? n : _ref3$distance,\n            _ref3$linkage = _ref3.linkage,\n            o = _ref3$linkage === void 0 ? r : _ref3$linkage,\n            _ref3$onProgress = _ref3.onProgress,\n            a = _ref3$onProgress === void 0 ? null : _ref3$onProgress;\n          e && (t = t.map(function (t) {\n            return t[e];\n          }));\n          var l = t.map(function (e, n) {\n              return i(0, n / (t.length - 1), a), t.map(function (t) {\n                return s(e, t);\n              });\n            }),\n            h = t.map(function (t, e) {\n              return {\n                height: 0,\n                indexes: [Number(e)]\n              };\n            });\n          var u = [];\n          for (var _e8 = 0; _e8 < t.length && (i(1, (_e8 + 1) / t.length, a), u.push(h.map(function (t) {\n            return t.indexes;\n          })), !(_e8 >= t.length - 1)); _e8++) {\n            var _t8 = 1 / 0,\n              _e9 = 0,\n              _n3 = 0;\n            for (var _r2 = 0; _r2 < h.length; _r2++) for (var _i3 = _r2 + 1; _i3 < h.length; _i3++) {\n              var _s = o(h[_r2].indexes, h[_i3].indexes, l);\n              _s < _t8 && (_t8 = _s, _e9 = _r2, _n3 = _i3);\n            }\n            var _r3 = {\n              indexes: [].concat(_toConsumableArray(h[_e9].indexes), _toConsumableArray(h[_n3].indexes)),\n              height: _t8,\n              children: [h[_e9], h[_n3]]\n            };\n            h.splice(Math.max(_e9, _n3), 1), h.splice(Math.min(_e9, _n3), 1), h.push(_r3);\n          }\n          return u = [[]].concat(_toConsumableArray(u.reverse())), {\n            clusters: h[0],\n            distances: l,\n            order: h[0].indexes,\n            clustersGivenK: u\n          };\n        };\n      },\n      496: function _(t, e, n) {\n        \"use strict\";\n\n        n.r(e), n.d(e, {\n          BgzipIndexedFasta: function BgzipIndexedFasta() {\n            return d;\n          },\n          FetchableSmallFasta: function FetchableSmallFasta() {\n            return p;\n          },\n          IndexedFasta: function IndexedFasta() {\n            return c;\n          },\n          parseSmallFasta: function parseSmallFasta() {\n            return g;\n          }\n        });\n        var r = n(2949),\n          i = n(8764),\n          s = n(9591),\n          o = n(3720),\n          a = n.n(o);\n        var l = /*#__PURE__*/function () {\n          function l(_ref4) {\n            var t = _ref4.filehandle,\n              e = _ref4.path;\n            _classCallCheck(this, l);\n            if (t) this.filehandle = t;else {\n              if (!e) throw new TypeError(\"either filehandle or path must be defined\");\n              this.filehandle = new r.S9(e);\n            }\n          }\n          _createClass(l, [{\n            key: \"_readLongWithOverflow\",\n            value: function _readLongWithOverflow(t) {\n              var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;\n              var n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : !0;\n              var r = a().fromBytesLE(t.slice(e, e + 8), n);\n              if (r.greaterThan(Number.MAX_SAFE_INTEGER) || r.lessThan(Number.MIN_SAFE_INTEGER)) throw new TypeError(\"integer overflow\");\n              return r.toNumber();\n            }\n          }, {\n            key: \"_getIndex\",\n            value: function _getIndex() {\n              return this.index || (this.index = this._readIndex()), this.index;\n            }\n          }, {\n            key: \"_readIndex\",\n            value: function () {\n              var _readIndex2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {\n                var t, e, n, r, _r4, _e10, _i4;\n                return _regeneratorRuntime().wrap(function _callee$(_context4) {\n                  while (1) switch (_context4.prev = _context4.next) {\n                    case 0:\n                      t = i.lW.allocUnsafe(8);\n                      _context4.next = 3;\n                      return this.filehandle.read(t, 0, 8, 0);\n                    case 3:\n                      e = this._readLongWithOverflow(t, 0, !0);\n                      if (e) {\n                        _context4.next = 6;\n                        break;\n                      }\n                      return _context4.abrupt(\"return\", [[0, 0]]);\n                    case 6:\n                      n = new Array(e + 1);\n                      n[0] = [0, 0];\n                      r = 16 * e;\n                      if (!(r > Number.MAX_SAFE_INTEGER)) {\n                        _context4.next = 11;\n                        break;\n                      }\n                      throw new TypeError(\"integer overflow\");\n                    case 11:\n                      t = i.lW.allocUnsafe(r);\n                      _context4.next = 14;\n                      return this.filehandle.read(t, 0, r, 8);\n                    case 14:\n                      for (_r4 = 0; _r4 < e; _r4 += 1) {\n                        _e10 = this._readLongWithOverflow(t, 16 * _r4), _i4 = this._readLongWithOverflow(t, 16 * _r4 + 8);\n                        n[_r4 + 1] = [_e10, _i4];\n                      }\n                      return _context4.abrupt(\"return\", n);\n                    case 16:\n                    case \"end\":\n                      return _context4.stop();\n                  }\n                }, _callee, this);\n              }));\n              function _readIndex() {\n                return _readIndex2.apply(this, arguments);\n              }\n              return _readIndex;\n            }()\n          }, {\n            key: \"getLastBlock\",\n            value: function () {\n              var _getLastBlock = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {\n                var t;\n                return _regeneratorRuntime().wrap(function _callee2$(_context5) {\n                  while (1) switch (_context5.prev = _context5.next) {\n                    case 0:\n                      _context5.next = 2;\n                      return this._getIndex();\n                    case 2:\n                      t = _context5.sent;\n                      if (!t.length) {\n                        _context5.next = 5;\n                        break;\n                      }\n                      return _context5.abrupt(\"return\", t[t.length - 1]);\n                    case 5:\n                    case \"end\":\n                      return _context5.stop();\n                  }\n                }, _callee2, this);\n              }));\n              function getLastBlock() {\n                return _getLastBlock.apply(this, arguments);\n              }\n              return getLastBlock;\n            }()\n          }, {\n            key: \"getRelevantBlocksForRead\",\n            value: function () {\n              var _getRelevantBlocksForRead = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(t, e) {\n                var n, r, i, s, o, a, _l, h, u;\n                return _regeneratorRuntime().wrap(function _callee3$(_context6) {\n                  while (1) switch (_context6.prev = _context6.next) {\n                    case 0:\n                      n = e + t;\n                      if (!(0 === t)) {\n                        _context6.next = 3;\n                        break;\n                      }\n                      return _context6.abrupt(\"return\", []);\n                    case 3:\n                      _context6.next = 5;\n                      return this._getIndex();\n                    case 5:\n                      r = _context6.sent;\n                      i = [];\n                      s = function s(t, n) {\n                        var r = t[1],\n                          i = n ? n[1] : 1 / 0;\n                        return r <= e && i > e ? 0 : r < e ? -1 : 1;\n                      };\n                      o = 0, a = r.length - 1, _l = Math.floor(r.length / 2), h = s(r[_l], r[_l + 1]);\n                      for (; 0 !== h;) h > 0 ? a = _l - 1 : h < 0 && (o = _l + 1), _l = Math.ceil((a - o) / 2) + o, h = s(r[_l], r[_l + 1]);\n                      i.push(r[_l]);\n                      u = _l + 1;\n                      for (; u < r.length && (i.push(r[u]), !(r[u][1] >= n)); u += 1);\n                      return _context6.abrupt(\"return\", (i[i.length - 1][1] < n && i.push([]), i));\n                    case 14:\n                    case \"end\":\n                      return _context6.stop();\n                  }\n                }, _callee3, this);\n              }));\n              function getRelevantBlocksForRead(_x, _x2) {\n                return _getRelevantBlocksForRead.apply(this, arguments);\n              }\n              return getRelevantBlocksForRead;\n            }()\n          }]);\n          return l;\n        }();\n        var h = /*#__PURE__*/function () {\n          function h(_ref5) {\n            var t = _ref5.filehandle,\n              e = _ref5.path,\n              n = _ref5.gziFilehandle,\n              i = _ref5.gziPath;\n            _classCallCheck(this, h);\n            if (t) this.filehandle = t;else {\n              if (!e) throw new TypeError(\"either filehandle or path must be defined\");\n              this.filehandle = new r.S9(e);\n            }\n            if (!n && !i && !e) throw new TypeError(\"either gziFilehandle or gziPath must be defined\");\n            this.gzi = new l({\n              filehandle: n,\n              path: n || i || !e ? \"\".concat(e, \".gzi\") : i\n            });\n          }\n          _createClass(h, [{\n            key: \"stat\",\n            value: function () {\n              var _stat = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {\n                var t;\n                return _regeneratorRuntime().wrap(function _callee4$(_context7) {\n                  while (1) switch (_context7.prev = _context7.next) {\n                    case 0:\n                      _context7.next = 2;\n                      return this.filehandle.stat();\n                    case 2:\n                      t = _context7.sent;\n                      _context7.t0 = Object;\n                      _context7.t1 = t;\n                      _context7.next = 7;\n                      return this.getUncompressedFileSize();\n                    case 7:\n                      _context7.t2 = _context7.sent;\n                      _context7.t3 = void 0;\n                      _context7.t4 = void 0;\n                      _context7.t5 = {\n                        size: _context7.t2,\n                        blocks: _context7.t3,\n                        blksize: _context7.t4\n                      };\n                      return _context7.abrupt(\"return\", _context7.t0.assign.call(_context7.t0, _context7.t1, _context7.t5));\n                    case 12:\n                    case \"end\":\n                      return _context7.stop();\n                  }\n                }, _callee4, this);\n              }));\n              function stat() {\n                return _stat.apply(this, arguments);\n              }\n              return stat;\n            }()\n          }, {\n            key: \"getUncompressedFileSize\",\n            value: function () {\n              var _getUncompressedFileSize = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {\n                var _yield$this$gzi$getLa, _yield$this$gzi$getLa2, t, _yield$this$filehandl, e, n, _yield$this$filehandl2, r;\n                return _regeneratorRuntime().wrap(function _callee5$(_context8) {\n                  while (1) switch (_context8.prev = _context8.next) {\n                    case 0:\n                      _context8.next = 2;\n                      return this.gzi.getLastBlock();\n                    case 2:\n                      _yield$this$gzi$getLa = _context8.sent;\n                      _yield$this$gzi$getLa2 = _slicedToArray(_yield$this$gzi$getLa, 2);\n                      t = _yield$this$gzi$getLa2[1];\n                      _context8.next = 7;\n                      return this.filehandle.stat();\n                    case 7:\n                      _yield$this$filehandl = _context8.sent;\n                      e = _yield$this$filehandl.size;\n                      n = i.lW.allocUnsafe(4);\n                      _context8.next = 12;\n                      return this.filehandle.read(n, 0, 4, e - 28 - 4);\n                    case 12:\n                      _yield$this$filehandl2 = _context8.sent;\n                      r = _yield$this$filehandl2.bytesRead;\n                      if (!(4 !== r)) {\n                        _context8.next = 16;\n                        break;\n                      }\n                      throw new Error(\"read error\");\n                    case 16:\n                      return _context8.abrupt(\"return\", t + n.readUInt32LE(0));\n                    case 17:\n                    case \"end\":\n                      return _context8.stop();\n                  }\n                }, _callee5, this);\n              }));\n              function getUncompressedFileSize() {\n                return _getUncompressedFileSize.apply(this, arguments);\n              }\n              return getUncompressedFileSize;\n            }()\n          }, {\n            key: \"_readAndUncompressBlock\",\n            value: function () {\n              var _readAndUncompressBlock2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(t, _ref6, _ref7) {\n                var _ref8, e, _ref9, n, r, o;\n                return _regeneratorRuntime().wrap(function _callee7$(_context10) {\n                  while (1) switch (_context10.prev = _context10.next) {\n                    case 0:\n                      _ref8 = _slicedToArray(_ref6, 1), e = _ref8[0];\n                      _ref9 = _slicedToArray(_ref7, 1), n = _ref9[0];\n                      r = n;\n                      _context10.t0 = r;\n                      if (_context10.t0) {\n                        _context10.next = 8;\n                        break;\n                      }\n                      _context10.next = 7;\n                      return this.filehandle.stat();\n                    case 7:\n                      r = _context10.sent.size;\n                    case 8:\n                      o = r - e;\n                      _context10.next = 11;\n                      return this.filehandle.read(t, 0, o, e);\n                    case 11:\n                      _context10.next = 13;\n                      return function () {\n                        var _ref10 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(t) {\n                          var _e11, _n4, _r5, _o, _a2, _l2, _a3, _i5, _h2, _t9, _e12;\n                          return _regeneratorRuntime().wrap(function _callee6$(_context9) {\n                            while (1) switch (_context9.prev = _context9.next) {\n                              case 0:\n                                _context9.prev = 0;\n                                _n4 = 0, _r5 = 0;\n                                _o = [];\n                                _l2 = 0;\n                              case 4:\n                                _i5 = t.subarray(_n4);\n                                if (!(_a2 = new s.Inflate(), (_a3 = _a2, _e11 = _a3.strm), _a2.push(_i5, s.Z_SYNC_FLUSH), _a2.err)) {\n                                  _context9.next = 7;\n                                  break;\n                                }\n                                throw new Error(_a2.msg);\n                              case 7:\n                                _n4 += _e11.next_in, _o[_r5] = _a2.result, _l2 += _o[_r5].length, _r5 += 1;\n                              case 8:\n                                if (_e11.avail_in) {\n                                  _context9.next = 4;\n                                  break;\n                                }\n                              case 9:\n                                _h2 = new Uint8Array(_l2);\n                                for (_t9 = 0, _e12 = 0; _t9 < _o.length; _t9++) _h2.set(_o[_t9], _e12), _e12 += _o[_t9].length;\n                                return _context9.abrupt(\"return\", i.lW.from(_h2));\n                              case 14:\n                                _context9.prev = 14;\n                                _context9.t0 = _context9[\"catch\"](0);\n                                if (!\"\".concat(_context9.t0).match(/incorrect header check/)) {\n                                  _context9.next = 18;\n                                  break;\n                                }\n                                throw new Error(\"problem decompressing block: incorrect gzip header check\");\n                              case 18:\n                                throw _context9.t0;\n                              case 19:\n                              case \"end\":\n                                return _context9.stop();\n                            }\n                          }, _callee6, null, [[0, 14]]);\n                        }));\n                        return function (_x6) {\n                          return _ref10.apply(this, arguments);\n                        };\n                      }()(t.slice(0, o));\n                    case 13:\n                      return _context10.abrupt(\"return\", _context10.sent);\n                    case 14:\n                    case \"end\":\n                      return _context10.stop();\n                  }\n                }, _callee7, this);\n              }));\n              function _readAndUncompressBlock(_x3, _x4, _x5) {\n                return _readAndUncompressBlock2.apply(this, arguments);\n              }\n              return _readAndUncompressBlock;\n            }()\n          }, {\n            key: \"read\",\n            value: function () {\n              var _read = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(t, e, n, r) {\n                var s, o, a, l, _e13, _i6, _s$_e, _h, _u, _f;\n                return _regeneratorRuntime().wrap(function _callee8$(_context11) {\n                  while (1) switch (_context11.prev = _context11.next) {\n                    case 0:\n                      _context11.next = 2;\n                      return this.gzi.getRelevantBlocksForRead(n, r);\n                    case 2:\n                      s = _context11.sent;\n                      o = i.lW.allocUnsafe(65536);\n                      a = e, l = 0;\n                      _e13 = 0;\n                    case 6:\n                      if (!(_e13 < s.length - 1)) {\n                        _context11.next = 18;\n                        break;\n                      }\n                      _context11.next = 9;\n                      return this._readAndUncompressBlock(o, s[_e13], s[_e13 + 1]);\n                    case 9:\n                      _i6 = _context11.sent;\n                      _s$_e = _slicedToArray(s[_e13], 2);\n                      _h = _s$_e[1];\n                      _u = _h >= r ? 0 : r - _h;\n                      _f = Math.min(r + n, _h + _i6.length) - _h;\n                      _u >= 0 && _u < _i6.length && (_i6.copy(t, a, _u, _f), a += _f - _u, l += _f - _u);\n                    case 15:\n                      _e13 += 1;\n                      _context11.next = 6;\n                      break;\n                    case 18:\n                      return _context11.abrupt(\"return\", {\n                        bytesRead: l,\n                        buffer: t\n                      });\n                    case 19:\n                    case \"end\":\n                      return _context11.stop();\n                  }\n                }, _callee8, this);\n              }));\n              function read(_x7, _x8, _x9, _x10) {\n                return _read.apply(this, arguments);\n              }\n              return read;\n            }()\n          }]);\n          return h;\n        }();\n        var u = n(8764).lW;\n        function f(t, e) {\n          return t.offset + t.lineBytes * Math.floor(e / t.lineLength) + e % t.lineLength;\n        }\n        var c = /*#__PURE__*/function () {\n          function c(_ref11) {\n            var t = _ref11.fasta,\n              e = _ref11.fai,\n              n = _ref11.path,\n              i = _ref11.faiPath;\n            _classCallCheck(this, c);\n            if (t) this.fasta = t;else {\n              if (!n) throw new Error(\"Need to pass filehandle for fasta or path to localfile\");\n              this.fasta = new r.S9(n);\n            }\n            if (e) this.fai = e;else if (i) this.fai = new r.S9(i);else {\n              if (!n) throw new Error(\"Need to pass filehandle for  or path to localfile\");\n              this.fai = new r.S9(\"\".concat(n, \".fai\"));\n            }\n          }\n          _createClass(c, [{\n            key: \"_getIndexes\",\n            value: function () {\n              var _getIndexes2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10(t) {\n                return _regeneratorRuntime().wrap(function _callee10$(_context13) {\n                  while (1) switch (_context13.prev = _context13.next) {\n                    case 0:\n                      return _context13.abrupt(\"return\", (this.indexes || (this.indexes = function () {\n                        var _ref12 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(t, e) {\n                          var n, r, i, s;\n                          return _regeneratorRuntime().wrap(function _callee9$(_context12) {\n                            while (1) switch (_context12.prev = _context12.next) {\n                              case 0:\n                                _context12.next = 2;\n                                return t.readFile(e);\n                              case 2:\n                                n = _context12.sent;\n                                if (!(!n || !n.length)) {\n                                  _context12.next = 5;\n                                  break;\n                                }\n                                throw new Error(\"No data read from FASTA index (FAI) file\");\n                              case 5:\n                                i = 0;\n                                s = n.toString(\"utf8\").split(/\\r?\\n/).filter(function (t) {\n                                  return /\\S/.test(t);\n                                }).map(function (t) {\n                                  return t.split(\"\\t\");\n                                }).filter(function (t) {\n                                  return \"\" !== t[0];\n                                }).map(function (t) {\n                                  return r && r.name === t[0] || (r = {\n                                    name: t[0],\n                                    id: i\n                                  }, i += 1), {\n                                    id: r.id,\n                                    name: t[0],\n                                    length: +t[1],\n                                    start: 0,\n                                    end: +t[1],\n                                    offset: +t[2],\n                                    lineLength: +t[3],\n                                    lineBytes: +t[4]\n                                  };\n                                });\n                                return _context12.abrupt(\"return\", {\n                                  name: Object.fromEntries(s.map(function (t) {\n                                    return [t.name, t];\n                                  })),\n                                  id: Object.fromEntries(s.map(function (t) {\n                                    return [t.id, t];\n                                  }))\n                                });\n                              case 8:\n                              case \"end\":\n                                return _context12.stop();\n                            }\n                          }, _callee9);\n                        }));\n                        return function (_x12, _x13) {\n                          return _ref12.apply(this, arguments);\n                        };\n                      }()(this.fai, t)), this.indexes));\n                    case 1:\n                    case \"end\":\n                      return _context13.stop();\n                  }\n                }, _callee10, this);\n              }));\n              function _getIndexes(_x11) {\n                return _getIndexes2.apply(this, arguments);\n              }\n              return _getIndexes;\n            }()\n          }, {\n            key: \"getSequenceNames\",\n            value: function () {\n              var _getSequenceNames = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11(t) {\n                return _regeneratorRuntime().wrap(function _callee11$(_context14) {\n                  while (1) switch (_context14.prev = _context14.next) {\n                    case 0:\n                      _context14.t0 = Object;\n                      _context14.next = 3;\n                      return this._getIndexes(t);\n                    case 3:\n                      _context14.t1 = _context14.sent.name;\n                      return _context14.abrupt(\"return\", _context14.t0.keys.call(_context14.t0, _context14.t1));\n                    case 5:\n                    case \"end\":\n                      return _context14.stop();\n                  }\n                }, _callee11, this);\n              }));\n              function getSequenceNames(_x14) {\n                return _getSequenceNames.apply(this, arguments);\n              }\n              return getSequenceNames;\n            }()\n          }, {\n            key: \"getSequenceSizes\",\n            value: function () {\n              var _getSequenceSizes = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee12(t) {\n                var e, n, r, _t10;\n                return _regeneratorRuntime().wrap(function _callee12$(_context15) {\n                  while (1) switch (_context15.prev = _context15.next) {\n                    case 0:\n                      e = {};\n                      _context15.next = 3;\n                      return this._getIndexes(t);\n                    case 3:\n                      n = _context15.sent;\n                      r = Object.values(n.id);\n                      for (_t10 = 0; _t10 < r.length; _t10 += 1) e[r[_t10].name] = r[_t10].length;\n                      return _context15.abrupt(\"return\", e);\n                    case 7:\n                    case \"end\":\n                      return _context15.stop();\n                  }\n                }, _callee12, this);\n              }));\n              function getSequenceSizes(_x15) {\n                return _getSequenceSizes.apply(this, arguments);\n              }\n              return getSequenceSizes;\n            }()\n          }, {\n            key: \"getSequenceSize\",\n            value: function () {\n              var _getSequenceSize = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee13(t, e) {\n                var n;\n                return _regeneratorRuntime().wrap(function _callee13$(_context16) {\n                  while (1) switch (_context16.prev = _context16.next) {\n                    case 0:\n                      _context16.next = 2;\n                      return this._getIndexes(e);\n                    case 2:\n                      _context16.t1 = t;\n                      _context16.t2 = n = _context16.sent.name[_context16.t1];\n                      _context16.t0 = null === _context16.t2;\n                      if (_context16.t0) {\n                        _context16.next = 7;\n                        break;\n                      }\n                      _context16.t0 = void 0 === n;\n                    case 7:\n                      if (!_context16.t0) {\n                        _context16.next = 11;\n                        break;\n                      }\n                      _context16.t3 = void 0;\n                      _context16.next = 12;\n                      break;\n                    case 11:\n                      _context16.t3 = n.length;\n                    case 12:\n                      return _context16.abrupt(\"return\", _context16.t3);\n                    case 13:\n                    case \"end\":\n                      return _context16.stop();\n                  }\n                }, _callee13, this);\n              }));\n              function getSequenceSize(_x16, _x17) {\n                return _getSequenceSize.apply(this, arguments);\n              }\n              return getSequenceSize;\n            }()\n          }, {\n            key: \"hasReferenceSequence\",\n            value: function () {\n              var _hasReferenceSequence = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee14(t, e) {\n                return _regeneratorRuntime().wrap(function _callee14$(_context17) {\n                  while (1) switch (_context17.prev = _context17.next) {\n                    case 0:\n                      _context17.next = 2;\n                      return this._getIndexes(e);\n                    case 2:\n                      _context17.t0 = t;\n                      return _context17.abrupt(\"return\", !!_context17.sent.name[_context17.t0]);\n                    case 4:\n                    case \"end\":\n                      return _context17.stop();\n                  }\n                }, _callee14, this);\n              }));\n              function hasReferenceSequence(_x18, _x19) {\n                return _hasReferenceSequence.apply(this, arguments);\n              }\n              return hasReferenceSequence;\n            }()\n          }, {\n            key: \"getResiduesById\",\n            value: function () {\n              var _getResiduesById = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee15(t, e, n, r) {\n                var i;\n                return _regeneratorRuntime().wrap(function _callee15$(_context18) {\n                  while (1) switch (_context18.prev = _context18.next) {\n                    case 0:\n                      _context18.next = 2;\n                      return this._getIndexes(r);\n                    case 2:\n                      _context18.t0 = t;\n                      i = _context18.sent.id[_context18.t0];\n                      if (!i) {\n                        _context18.next = 6;\n                        break;\n                      }\n                      return _context18.abrupt(\"return\", this._fetchFromIndexEntry(i, e, n, r));\n                    case 6:\n                    case \"end\":\n                      return _context18.stop();\n                  }\n                }, _callee15, this);\n              }));\n              function getResiduesById(_x20, _x21, _x22, _x23) {\n                return _getResiduesById.apply(this, arguments);\n              }\n              return getResiduesById;\n            }()\n          }, {\n            key: \"getResiduesByName\",\n            value: function () {\n              var _getResiduesByName = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee16(t, e, n, r) {\n                var i;\n                return _regeneratorRuntime().wrap(function _callee16$(_context19) {\n                  while (1) switch (_context19.prev = _context19.next) {\n                    case 0:\n                      _context19.next = 2;\n                      return this._getIndexes(r);\n                    case 2:\n                      _context19.t0 = t;\n                      i = _context19.sent.name[_context19.t0];\n                      if (!i) {\n                        _context19.next = 6;\n                        break;\n                      }\n                      return _context19.abrupt(\"return\", this._fetchFromIndexEntry(i, e, n, r));\n                    case 6:\n                    case \"end\":\n                      return _context19.stop();\n                  }\n                }, _callee16, this);\n              }));\n              function getResiduesByName(_x24, _x25, _x26, _x27) {\n                return _getResiduesByName.apply(this, arguments);\n              }\n              return getResiduesByName;\n            }()\n          }, {\n            key: \"getSequence\",\n            value: function () {\n              var _getSequence = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee17(t, e, n, r) {\n                return _regeneratorRuntime().wrap(function _callee17$(_context20) {\n                  while (1) switch (_context20.prev = _context20.next) {\n                    case 0:\n                      return _context20.abrupt(\"return\", this.getResiduesByName(t, e, n, r));\n                    case 1:\n                    case \"end\":\n                      return _context20.stop();\n                  }\n                }, _callee17, this);\n              }));\n              function getSequence(_x28, _x29, _x30, _x31) {\n                return _getSequence.apply(this, arguments);\n              }\n              return getSequence;\n            }()\n          }, {\n            key: \"_fetchFromIndexEntry\",\n            value: function () {\n              var _fetchFromIndexEntry2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee18(t) {\n                var e,\n                  n,\n                  r,\n                  i,\n                  s,\n                  o,\n                  a,\n                  _args21 = arguments;\n                return _regeneratorRuntime().wrap(function _callee18$(_context21) {\n                  while (1) switch (_context21.prev = _context21.next) {\n                    case 0:\n                      e = _args21.length > 1 && _args21[1] !== undefined ? _args21[1] : 0;\n                      n = _args21.length > 2 ? _args21[2] : undefined;\n                      r = _args21.length > 3 ? _args21[3] : undefined;\n                      i = n;\n                      if (!(e < 0)) {\n                        _context21.next = 6;\n                        break;\n                      }\n                      throw new TypeError(\"regionStart cannot be less than 0\");\n                    case 6:\n                      if (!((void 0 === i || i > t.length) && (i = t.length), e >= i)) {\n                        _context21.next = 8;\n                        break;\n                      }\n                      return _context21.abrupt(\"return\", \"\");\n                    case 8:\n                      s = f(t, e), o = f(t, i) - s, a = u.allocUnsafe(o);\n                      _context21.next = 11;\n                      return this.fasta.read(a, 0, o, s, r);\n                    case 11:\n                      return _context21.abrupt(\"return\", a.toString(\"utf8\").replace(/\\s+/g, \"\"));\n                    case 12:\n                    case \"end\":\n                      return _context21.stop();\n                  }\n                }, _callee18, this);\n              }));\n              function _fetchFromIndexEntry(_x32) {\n                return _fetchFromIndexEntry2.apply(this, arguments);\n              }\n              return _fetchFromIndexEntry;\n            }()\n          }]);\n          return c;\n        }();\n        var d = /*#__PURE__*/function (_c) {\n          _inherits(d, _c);\n          var _super = _createSuper(d);\n          function d(_ref13) {\n            var _this6;\n            var t = _ref13.fasta,\n              e = _ref13.path,\n              n = _ref13.fai,\n              r = _ref13.faiPath,\n              i = _ref13.gzi,\n              s = _ref13.gziPath;\n            _classCallCheck(this, d);\n            _this6 = _super.call(this, {\n              fasta: t,\n              path: e,\n              fai: n,\n              faiPath: r\n            }), t && i ? _this6.fasta = new h({\n              filehandle: t,\n              gziFilehandle: i\n            }) : e && s && (_this6.fasta = new h({\n              path: e,\n              gziPath: s\n            }));\n            return _this6;\n          }\n          return _createClass(d);\n        }(c);\n        function g(t) {\n          return t.split(\">\").filter(function (t) {\n            return /\\S/.test(t);\n          }).map(function (t) {\n            var _t$split = t.split(\"\\n\"),\n              _t$split2 = _toArray(_t$split),\n              e = _t$split2[0],\n              n = _t$split2.slice(1),\n              _e$split = e.split(\" \"),\n              _e$split2 = _toArray(_e$split),\n              r = _e$split2[0],\n              i = _e$split2.slice(1),\n              s = n.join(\"\").replace(/\\s/g, \"\");\n            return {\n              id: r,\n              description: i.join(\" \"),\n              sequence: s\n            };\n          });\n        }\n        var p = /*#__PURE__*/function () {\n          function p(_ref14) {\n            var t = _ref14.fasta,\n              e = _ref14.path;\n            _classCallCheck(this, p);\n            if (t) this.fasta = t;else {\n              if (!e) throw new Error(\"Need to pass fasta or path\");\n              this.fasta = new r.S9(e);\n            }\n            this.data = this.fasta.readFile().then(function (t) {\n              return g(t.toString(\"utf8\"));\n            });\n          }\n          _createClass(p, [{\n            key: \"fetch\",\n            value: function () {\n              var _fetch = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee19(t, e, n) {\n                var r, i;\n                return _regeneratorRuntime().wrap(function _callee19$(_context22) {\n                  while (1) switch (_context22.prev = _context22.next) {\n                    case 0:\n                      _context22.next = 2;\n                      return this.data;\n                    case 2:\n                      r = _context22.sent.find(function (e) {\n                        return e.id === t;\n                      });\n                      i = n - e;\n                      if (r) {\n                        _context22.next = 6;\n                        break;\n                      }\n                      throw new Error(\"no sequence with id \".concat(t, \" exists\"));\n                    case 6:\n                      return _context22.abrupt(\"return\", r.sequence.substr(e, i));\n                    case 7:\n                    case \"end\":\n                      return _context22.stop();\n                  }\n                }, _callee19, this);\n              }));\n              function fetch(_x33, _x34, _x35) {\n                return _fetch.apply(this, arguments);\n              }\n              return fetch;\n            }()\n          }, {\n            key: \"getSequenceNames\",\n            value: function () {\n              var _getSequenceNames2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee20() {\n                return _regeneratorRuntime().wrap(function _callee20$(_context23) {\n                  while (1) switch (_context23.prev = _context23.next) {\n                    case 0:\n                      _context23.next = 2;\n                      return this.data;\n                    case 2:\n                      return _context23.abrupt(\"return\", _context23.sent.map(function (t) {\n                        return t.id;\n                      }));\n                    case 3:\n                    case \"end\":\n                      return _context23.stop();\n                  }\n                }, _callee20, this);\n              }));\n              function getSequenceNames() {\n                return _getSequenceNames2.apply(this, arguments);\n              }\n              return getSequenceNames;\n            }()\n          }]);\n          return p;\n        }();\n      },\n      9742: function _(t, e) {\n        \"use strict\";\n\n        e.byteLength = function (t) {\n          var e = a(t),\n            n = e[0],\n            r = e[1];\n          return 3 * (n + r) / 4 - r;\n        }, e.toByteArray = function (t) {\n          var e,\n            n,\n            s = a(t),\n            o = s[0],\n            l = s[1],\n            h = new i(function (t, e, n) {\n              return 3 * (e + n) / 4 - n;\n            }(0, o, l)),\n            u = 0,\n            f = l > 0 ? o - 4 : o;\n          for (n = 0; n < f; n += 4) e = r[t.charCodeAt(n)] << 18 | r[t.charCodeAt(n + 1)] << 12 | r[t.charCodeAt(n + 2)] << 6 | r[t.charCodeAt(n + 3)], h[u++] = e >> 16 & 255, h[u++] = e >> 8 & 255, h[u++] = 255 & e;\n          return 2 === l && (e = r[t.charCodeAt(n)] << 2 | r[t.charCodeAt(n + 1)] >> 4, h[u++] = 255 & e), 1 === l && (e = r[t.charCodeAt(n)] << 10 | r[t.charCodeAt(n + 1)] << 4 | r[t.charCodeAt(n + 2)] >> 2, h[u++] = e >> 8 & 255, h[u++] = 255 & e), h;\n        }, e.fromByteArray = function (t) {\n          for (var e, r = t.length, i = r % 3, s = [], o = 16383, a = 0, h = r - i; a < h; a += o) s.push(l(t, a, a + o > h ? h : a + o));\n          return 1 === i ? (e = t[r - 1], s.push(n[e >> 2] + n[e << 4 & 63] + \"==\")) : 2 === i && (e = (t[r - 2] << 8) + t[r - 1], s.push(n[e >> 10] + n[e >> 4 & 63] + n[e << 2 & 63] + \"=\")), s.join(\"\");\n        };\n        for (var n = [], r = [], i = \"undefined\" != typeof Uint8Array ? Uint8Array : Array, s = \"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\", o = 0; o < 64; ++o) n[o] = s[o], r[s.charCodeAt(o)] = o;\n        function a(t) {\n          var e = t.length;\n          if (e % 4 > 0) throw new Error(\"Invalid string. Length must be a multiple of 4\");\n          var n = t.indexOf(\"=\");\n          return -1 === n && (n = e), [n, n === e ? 0 : 4 - n % 4];\n        }\n        function l(t, e, r) {\n          for (var i, s, o = [], a = e; a < r; a += 3) i = (t[a] << 16 & 16711680) + (t[a + 1] << 8 & 65280) + (255 & t[a + 2]), o.push(n[(s = i) >> 18 & 63] + n[s >> 12 & 63] + n[s >> 6 & 63] + n[63 & s]);\n          return o.join(\"\");\n        }\n        r[\"-\".charCodeAt(0)] = 62, r[\"_\".charCodeAt(0)] = 63;\n      },\n      8764: function _(t, e, n) {\n        \"use strict\";\n\n        var r = n(9742),\n          i = n(645),\n          s = \"function\" == typeof Symbol && \"function\" == typeof Symbol[\"for\"] ? Symbol[\"for\"](\"nodejs.util.inspect.custom\") : null;\n        e.lW = l, e.h2 = 50;\n        var o = 2147483647;\n        function a(t) {\n          if (t > o) throw new RangeError('The value \"' + t + '\" is invalid for option \"size\"');\n          var e = new Uint8Array(t);\n          return Object.setPrototypeOf(e, l.prototype), e;\n        }\n        function l(t, e, n) {\n          if (\"number\" == typeof t) {\n            if (\"string\" == typeof e) throw new TypeError('The \"string\" argument must be of type string. Received type number');\n            return f(t);\n          }\n          return h(t, e, n);\n        }\n        function h(t, e, n) {\n          if (\"string\" == typeof t) return function (t, e) {\n            if (\"string\" == typeof e && \"\" !== e || (e = \"utf8\"), !l.isEncoding(e)) throw new TypeError(\"Unknown encoding: \" + e);\n            var n = 0 | p(t, e);\n            var r = a(n);\n            var i = r.write(t, e);\n            return i !== n && (r = r.slice(0, i)), r;\n          }(t, e);\n          if (ArrayBuffer.isView(t)) return function (t) {\n            if (V(t, Uint8Array)) {\n              var _e14 = new Uint8Array(t);\n              return d(_e14.buffer, _e14.byteOffset, _e14.byteLength);\n            }\n            return c(t);\n          }(t);\n          if (null == t) throw new TypeError(\"The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type \" + _typeof(t));\n          if (V(t, ArrayBuffer) || t && V(t.buffer, ArrayBuffer)) return d(t, e, n);\n          if (\"undefined\" != typeof SharedArrayBuffer && (V(t, SharedArrayBuffer) || t && V(t.buffer, SharedArrayBuffer))) return d(t, e, n);\n          if (\"number\" == typeof t) throw new TypeError('The \"value\" argument must not be of type number. Received type number');\n          var r = t.valueOf && t.valueOf();\n          if (null != r && r !== t) return l.from(r, e, n);\n          var i = function (t) {\n            if (l.isBuffer(t)) {\n              var _e15 = 0 | g(t.length),\n                _n5 = a(_e15);\n              return 0 === _n5.length || t.copy(_n5, 0, 0, _e15), _n5;\n            }\n            return void 0 !== t.length ? \"number\" != typeof t.length || K(t.length) ? a(0) : c(t) : \"Buffer\" === t.type && Array.isArray(t.data) ? c(t.data) : void 0;\n          }(t);\n          if (i) return i;\n          if (\"undefined\" != typeof Symbol && null != Symbol.toPrimitive && \"function\" == typeof t[Symbol.toPrimitive]) return l.from(t[Symbol.toPrimitive](\"string\"), e, n);\n          throw new TypeError(\"The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type \" + _typeof(t));\n        }\n        function u(t) {\n          if (\"number\" != typeof t) throw new TypeError('\"size\" argument must be of type number');\n          if (t < 0) throw new RangeError('The value \"' + t + '\" is invalid for option \"size\"');\n        }\n        function f(t) {\n          return u(t), a(t < 0 ? 0 : 0 | g(t));\n        }\n        function c(t) {\n          var e = t.length < 0 ? 0 : 0 | g(t.length),\n            n = a(e);\n          for (var _r6 = 0; _r6 < e; _r6 += 1) n[_r6] = 255 & t[_r6];\n          return n;\n        }\n        function d(t, e, n) {\n          if (e < 0 || t.byteLength < e) throw new RangeError('\"offset\" is outside of buffer bounds');\n          if (t.byteLength < e + (n || 0)) throw new RangeError('\"length\" is outside of buffer bounds');\n          var r;\n          return r = void 0 === e && void 0 === n ? new Uint8Array(t) : void 0 === n ? new Uint8Array(t, e) : new Uint8Array(t, e, n), Object.setPrototypeOf(r, l.prototype), r;\n        }\n        function g(t) {\n          if (t >= o) throw new RangeError(\"Attempt to allocate Buffer larger than maximum size: 0x\" + o.toString(16) + \" bytes\");\n          return 0 | t;\n        }\n        function p(t, e) {\n          if (l.isBuffer(t)) return t.length;\n          if (ArrayBuffer.isView(t) || V(t, ArrayBuffer)) return t.byteLength;\n          if (\"string\" != typeof t) throw new TypeError('The \"string\" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + _typeof(t));\n          var n = t.length,\n            r = arguments.length > 2 && !0 === arguments[2];\n          if (!r && 0 === n) return 0;\n          var i = !1;\n          for (;;) switch (e) {\n            case \"ascii\":\n            case \"latin1\":\n            case \"binary\":\n              return n;\n            case \"utf8\":\n            case \"utf-8\":\n              return G(t).length;\n            case \"ucs2\":\n            case \"ucs-2\":\n            case \"utf16le\":\n            case \"utf-16le\":\n              return 2 * n;\n            case \"hex\":\n              return n >>> 1;\n            case \"base64\":\n              return W(t).length;\n            default:\n              if (i) return r ? -1 : G(t).length;\n              e = (\"\" + e).toLowerCase(), i = !0;\n          }\n        }\n        function m(t, e, n) {\n          var r = !1;\n          if ((void 0 === e || e < 0) && (e = 0), e > this.length) return \"\";\n          if ((void 0 === n || n > this.length) && (n = this.length), n <= 0) return \"\";\n          if ((n >>>= 0) <= (e >>>= 0)) return \"\";\n          for (t || (t = \"utf8\");;) switch (t) {\n            case \"hex\":\n              return T(this, e, n);\n            case \"utf8\":\n            case \"utf-8\":\n              return B(this, e, n);\n            case \"ascii\":\n              return I(this, e, n);\n            case \"latin1\":\n            case \"binary\":\n              return M(this, e, n);\n            case \"base64\":\n              return A(this, e, n);\n            case \"ucs2\":\n            case \"ucs-2\":\n            case \"utf16le\":\n            case \"utf-16le\":\n              return z(this, e, n);\n            default:\n              if (r) throw new TypeError(\"Unknown encoding: \" + t);\n              t = (t + \"\").toLowerCase(), r = !0;\n          }\n        }\n        function _(t, e, n) {\n          var r = t[e];\n          t[e] = t[n], t[n] = r;\n        }\n        function b(t, e, n, r, i) {\n          if (0 === t.length) return -1;\n          if (\"string\" == typeof n ? (r = n, n = 0) : n > 2147483647 ? n = 2147483647 : n < -2147483648 && (n = -2147483648), K(n = +n) && (n = i ? 0 : t.length - 1), n < 0 && (n = t.length + n), n >= t.length) {\n            if (i) return -1;\n            n = t.length - 1;\n          } else if (n < 0) {\n            if (!i) return -1;\n            n = 0;\n          }\n          if (\"string\" == typeof e && (e = l.from(e, r)), l.isBuffer(e)) return 0 === e.length ? -1 : w(t, e, n, r, i);\n          if (\"number\" == typeof e) return e &= 255, \"function\" == typeof Uint8Array.prototype.indexOf ? i ? Uint8Array.prototype.indexOf.call(t, e, n) : Uint8Array.prototype.lastIndexOf.call(t, e, n) : w(t, [e], n, r, i);\n          throw new TypeError(\"val must be string, number or Buffer\");\n        }\n        function w(t, e, n, r, i) {\n          var s,\n            o = 1,\n            a = t.length,\n            l = e.length;\n          if (void 0 !== r && (\"ucs2\" === (r = String(r).toLowerCase()) || \"ucs-2\" === r || \"utf16le\" === r || \"utf-16le\" === r)) {\n            if (t.length < 2 || e.length < 2) return -1;\n            o = 2, a /= 2, l /= 2, n /= 2;\n          }\n          function h(t, e) {\n            return 1 === o ? t[e] : t.readUInt16BE(e * o);\n          }\n          if (i) {\n            var _r7 = -1;\n            for (s = n; s < a; s++) if (h(t, s) === h(e, -1 === _r7 ? 0 : s - _r7)) {\n              if (-1 === _r7 && (_r7 = s), s - _r7 + 1 === l) return _r7 * o;\n            } else -1 !== _r7 && (s -= s - _r7), _r7 = -1;\n          } else for (n + l > a && (n = a - l), s = n; s >= 0; s--) {\n            var _n6 = !0;\n            for (var _r8 = 0; _r8 < l; _r8++) if (h(t, s + _r8) !== h(e, _r8)) {\n              _n6 = !1;\n              break;\n            }\n            if (_n6) return s;\n          }\n          return -1;\n        }\n        function y(t, e, n, r) {\n          n = Number(n) || 0;\n          var i = t.length - n;\n          r ? (r = Number(r)) > i && (r = i) : r = i;\n          var s = e.length;\n          var o;\n          for (r > s / 2 && (r = s / 2), o = 0; o < r; ++o) {\n            var _r9 = parseInt(e.substr(2 * o, 2), 16);\n            if (K(_r9)) return o;\n            t[n + o] = _r9;\n          }\n          return o;\n        }\n        function v(t, e, n, r) {\n          return X(G(e, t.length - n), t, n, r);\n        }\n        function k(t, e, n, r) {\n          return X(function (t) {\n            var e = [];\n            for (var _n7 = 0; _n7 < t.length; ++_n7) e.push(255 & t.charCodeAt(_n7));\n            return e;\n          }(e), t, n, r);\n        }\n        function x(t, e, n, r) {\n          return X(W(e), t, n, r);\n        }\n        function E(t, e, n, r) {\n          return X(function (t, e) {\n            var n, r, i;\n            var s = [];\n            for (var _o2 = 0; _o2 < t.length && !((e -= 2) < 0); ++_o2) n = t.charCodeAt(_o2), r = n >> 8, i = n % 256, s.push(i), s.push(r);\n            return s;\n          }(e, t.length - n), t, n, r);\n        }\n        function A(t, e, n) {\n          return 0 === e && n === t.length ? r.fromByteArray(t) : r.fromByteArray(t.slice(e, n));\n        }\n        function B(t, e, n) {\n          n = Math.min(t.length, n);\n          var r = [];\n          var i = e;\n          for (; i < n;) {\n            var _e16 = t[i];\n            var _s2 = null,\n              _o3 = _e16 > 239 ? 4 : _e16 > 223 ? 3 : _e16 > 191 ? 2 : 1;\n            if (i + _o3 <= n) {\n              var _n8 = void 0,\n                _r10 = void 0,\n                _a4 = void 0,\n                _l3 = void 0;\n              switch (_o3) {\n                case 1:\n                  _e16 < 128 && (_s2 = _e16);\n                  break;\n                case 2:\n                  _n8 = t[i + 1], 128 == (192 & _n8) && (_l3 = (31 & _e16) << 6 | 63 & _n8, _l3 > 127 && (_s2 = _l3));\n                  break;\n                case 3:\n                  _n8 = t[i + 1], _r10 = t[i + 2], 128 == (192 & _n8) && 128 == (192 & _r10) && (_l3 = (15 & _e16) << 12 | (63 & _n8) << 6 | 63 & _r10, _l3 > 2047 && (_l3 < 55296 || _l3 > 57343) && (_s2 = _l3));\n                  break;\n                case 4:\n                  _n8 = t[i + 1], _r10 = t[i + 2], _a4 = t[i + 3], 128 == (192 & _n8) && 128 == (192 & _r10) && 128 == (192 & _a4) && (_l3 = (15 & _e16) << 18 | (63 & _n8) << 12 | (63 & _r10) << 6 | 63 & _a4, _l3 > 65535 && _l3 < 1114112 && (_s2 = _l3));\n              }\n            }\n            null === _s2 ? (_s2 = 65533, _o3 = 1) : _s2 > 65535 && (_s2 -= 65536, r.push(_s2 >>> 10 & 1023 | 55296), _s2 = 56320 | 1023 & _s2), r.push(_s2), i += _o3;\n          }\n          return function (t) {\n            var e = t.length;\n            if (e <= S) return String.fromCharCode.apply(String, t);\n            var n = \"\",\n              r = 0;\n            for (; r < e;) n += String.fromCharCode.apply(String, t.slice(r, r += S));\n            return n;\n          }(r);\n        }\n        l.TYPED_ARRAY_SUPPORT = function () {\n          try {\n            var _t11 = new Uint8Array(1),\n              _e17 = {\n                foo: function foo() {\n                  return 42;\n                }\n              };\n            return Object.setPrototypeOf(_e17, Uint8Array.prototype), Object.setPrototypeOf(_t11, _e17), 42 === _t11.foo();\n          } catch (t) {\n            return !1;\n          }\n        }(), l.TYPED_ARRAY_SUPPORT || \"undefined\" == typeof console || \"function\" != typeof console.error || console.error(\"This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.\"), Object.defineProperty(l.prototype, \"parent\", {\n          enumerable: !0,\n          get: function get() {\n            if (l.isBuffer(this)) return this.buffer;\n          }\n        }), Object.defineProperty(l.prototype, \"offset\", {\n          enumerable: !0,\n          get: function get() {\n            if (l.isBuffer(this)) return this.byteOffset;\n          }\n        }), l.poolSize = 8192, l.from = function (t, e, n) {\n          return h(t, e, n);\n        }, Object.setPrototypeOf(l.prototype, Uint8Array.prototype), Object.setPrototypeOf(l, Uint8Array), l.alloc = function (t, e, n) {\n          return function (t, e, n) {\n            return u(t), t <= 0 ? a(t) : void 0 !== e ? \"string\" == typeof n ? a(t).fill(e, n) : a(t).fill(e) : a(t);\n          }(t, e, n);\n        }, l.allocUnsafe = function (t) {\n          return f(t);\n        }, l.allocUnsafeSlow = function (t) {\n          return f(t);\n        }, l.isBuffer = function (t) {\n          return null != t && !0 === t._isBuffer && t !== l.prototype;\n        }, l.compare = function (t, e) {\n          if (V(t, Uint8Array) && (t = l.from(t, t.offset, t.byteLength)), V(e, Uint8Array) && (e = l.from(e, e.offset, e.byteLength)), !l.isBuffer(t) || !l.isBuffer(e)) throw new TypeError('The \"buf1\", \"buf2\" arguments must be one of type Buffer or Uint8Array');\n          if (t === e) return 0;\n          var n = t.length,\n            r = e.length;\n          for (var _i7 = 0, _s3 = Math.min(n, r); _i7 < _s3; ++_i7) if (t[_i7] !== e[_i7]) {\n            n = t[_i7], r = e[_i7];\n            break;\n          }\n          return n < r ? -1 : r < n ? 1 : 0;\n        }, l.isEncoding = function (t) {\n          switch (String(t).toLowerCase()) {\n            case \"hex\":\n            case \"utf8\":\n            case \"utf-8\":\n            case \"ascii\":\n            case \"latin1\":\n            case \"binary\":\n            case \"base64\":\n            case \"ucs2\":\n            case \"ucs-2\":\n            case \"utf16le\":\n            case \"utf-16le\":\n              return !0;\n            default:\n              return !1;\n          }\n        }, l.concat = function (t, e) {\n          if (!Array.isArray(t)) throw new TypeError('\"list\" argument must be an Array of Buffers');\n          if (0 === t.length) return l.alloc(0);\n          var n;\n          if (void 0 === e) for (e = 0, n = 0; n < t.length; ++n) e += t[n].length;\n          var r = l.allocUnsafe(e);\n          var i = 0;\n          for (n = 0; n < t.length; ++n) {\n            var _e18 = t[n];\n            if (V(_e18, Uint8Array)) i + _e18.length > r.length ? (l.isBuffer(_e18) || (_e18 = l.from(_e18)), _e18.copy(r, i)) : Uint8Array.prototype.set.call(r, _e18, i);else {\n              if (!l.isBuffer(_e18)) throw new TypeError('\"list\" argument must be an Array of Buffers');\n              _e18.copy(r, i);\n            }\n            i += _e18.length;\n          }\n          return r;\n        }, l.byteLength = p, l.prototype._isBuffer = !0, l.prototype.swap16 = function () {\n          var t = this.length;\n          if (t % 2 != 0) throw new RangeError(\"Buffer size must be a multiple of 16-bits\");\n          for (var _e19 = 0; _e19 < t; _e19 += 2) _(this, _e19, _e19 + 1);\n          return this;\n        }, l.prototype.swap32 = function () {\n          var t = this.length;\n          if (t % 4 != 0) throw new RangeError(\"Buffer size must be a multiple of 32-bits\");\n          for (var _e20 = 0; _e20 < t; _e20 += 4) _(this, _e20, _e20 + 3), _(this, _e20 + 1, _e20 + 2);\n          return this;\n        }, l.prototype.swap64 = function () {\n          var t = this.length;\n          if (t % 8 != 0) throw new RangeError(\"Buffer size must be a multiple of 64-bits\");\n          for (var _e21 = 0; _e21 < t; _e21 += 8) _(this, _e21, _e21 + 7), _(this, _e21 + 1, _e21 + 6), _(this, _e21 + 2, _e21 + 5), _(this, _e21 + 3, _e21 + 4);\n          return this;\n        }, l.prototype.toString = function () {\n          var t = this.length;\n          return 0 === t ? \"\" : 0 === arguments.length ? B(this, 0, t) : m.apply(this, arguments);\n        }, l.prototype.toLocaleString = l.prototype.toString, l.prototype.equals = function (t) {\n          if (!l.isBuffer(t)) throw new TypeError(\"Argument must be a Buffer\");\n          return this === t || 0 === l.compare(this, t);\n        }, l.prototype.inspect = function () {\n          var t = \"\";\n          var n = e.h2;\n          return t = this.toString(\"hex\", 0, n).replace(/(.{2})/g, \"$1 \").trim(), this.length > n && (t += \" ... \"), \"<Buffer \" + t + \">\";\n        }, s && (l.prototype[s] = l.prototype.inspect), l.prototype.compare = function (t, e, n, r, i) {\n          if (V(t, Uint8Array) && (t = l.from(t, t.offset, t.byteLength)), !l.isBuffer(t)) throw new TypeError('The \"target\" argument must be one of type Buffer or Uint8Array. Received type ' + _typeof(t));\n          if (void 0 === e && (e = 0), void 0 === n && (n = t ? t.length : 0), void 0 === r && (r = 0), void 0 === i && (i = this.length), e < 0 || n > t.length || r < 0 || i > this.length) throw new RangeError(\"out of range index\");\n          if (r >= i && e >= n) return 0;\n          if (r >= i) return -1;\n          if (e >= n) return 1;\n          if (this === t) return 0;\n          var s = (i >>>= 0) - (r >>>= 0),\n            o = (n >>>= 0) - (e >>>= 0);\n          var a = Math.min(s, o),\n            h = this.slice(r, i),\n            u = t.slice(e, n);\n          for (var _t12 = 0; _t12 < a; ++_t12) if (h[_t12] !== u[_t12]) {\n            s = h[_t12], o = u[_t12];\n            break;\n          }\n          return s < o ? -1 : o < s ? 1 : 0;\n        }, l.prototype.includes = function (t, e, n) {\n          return -1 !== this.indexOf(t, e, n);\n        }, l.prototype.indexOf = function (t, e, n) {\n          return b(this, t, e, n, !0);\n        }, l.prototype.lastIndexOf = function (t, e, n) {\n          return b(this, t, e, n, !1);\n        }, l.prototype.write = function (t, e, n, r) {\n          if (void 0 === e) r = \"utf8\", n = this.length, e = 0;else if (void 0 === n && \"string\" == typeof e) r = e, n = this.length, e = 0;else {\n            if (!isFinite(e)) throw new Error(\"Buffer.write(string, encoding, offset[, length]) is no longer supported\");\n            e >>>= 0, isFinite(n) ? (n >>>= 0, void 0 === r && (r = \"utf8\")) : (r = n, n = void 0);\n          }\n          var i = this.length - e;\n          if ((void 0 === n || n > i) && (n = i), t.length > 0 && (n < 0 || e < 0) || e > this.length) throw new RangeError(\"Attempt to write outside buffer bounds\");\n          r || (r = \"utf8\");\n          var s = !1;\n          for (;;) switch (r) {\n            case \"hex\":\n              return y(this, t, e, n);\n            case \"utf8\":\n            case \"utf-8\":\n              return v(this, t, e, n);\n            case \"ascii\":\n            case \"latin1\":\n            case \"binary\":\n              return k(this, t, e, n);\n            case \"base64\":\n              return x(this, t, e, n);\n            case \"ucs2\":\n            case \"ucs-2\":\n            case \"utf16le\":\n            case \"utf-16le\":\n              return E(this, t, e, n);\n            default:\n              if (s) throw new TypeError(\"Unknown encoding: \" + r);\n              r = (\"\" + r).toLowerCase(), s = !0;\n          }\n        }, l.prototype.toJSON = function () {\n          return {\n            type: \"Buffer\",\n            data: Array.prototype.slice.call(this._arr || this, 0)\n          };\n        };\n        var S = 4096;\n        function I(t, e, n) {\n          var r = \"\";\n          n = Math.min(t.length, n);\n          for (var _i8 = e; _i8 < n; ++_i8) r += String.fromCharCode(127 & t[_i8]);\n          return r;\n        }\n        function M(t, e, n) {\n          var r = \"\";\n          n = Math.min(t.length, n);\n          for (var _i9 = e; _i9 < n; ++_i9) r += String.fromCharCode(t[_i9]);\n          return r;\n        }\n        function T(t, e, n) {\n          var r = t.length;\n          (!e || e < 0) && (e = 0), (!n || n < 0 || n > r) && (n = r);\n          var i = \"\";\n          for (var _r11 = e; _r11 < n; ++_r11) i += Y[t[_r11]];\n          return i;\n        }\n        function z(t, e, n) {\n          var r = t.slice(e, n);\n          var i = \"\";\n          for (var _t13 = 0; _t13 < r.length - 1; _t13 += 2) i += String.fromCharCode(r[_t13] + 256 * r[_t13 + 1]);\n          return i;\n        }\n        function O(t, e, n) {\n          if (t % 1 != 0 || t < 0) throw new RangeError(\"offset is not uint\");\n          if (t + e > n) throw new RangeError(\"Trying to access beyond buffer length\");\n        }\n        function C(t, e, n, r, i, s) {\n          if (!l.isBuffer(t)) throw new TypeError('\"buffer\" argument must be a Buffer instance');\n          if (e > i || e < s) throw new RangeError('\"value\" argument is out of bounds');\n          if (n + r > t.length) throw new RangeError(\"Index out of range\");\n        }\n        function R(t, e, n, r, i) {\n          D(e, r, i, t, n, 7);\n          var s = Number(e & BigInt(4294967295));\n          t[n++] = s, s >>= 8, t[n++] = s, s >>= 8, t[n++] = s, s >>= 8, t[n++] = s;\n          var o = Number(e >> BigInt(32) & BigInt(4294967295));\n          return t[n++] = o, o >>= 8, t[n++] = o, o >>= 8, t[n++] = o, o >>= 8, t[n++] = o, n;\n        }\n        function N(t, e, n, r, i) {\n          D(e, r, i, t, n, 7);\n          var s = Number(e & BigInt(4294967295));\n          t[n + 7] = s, s >>= 8, t[n + 6] = s, s >>= 8, t[n + 5] = s, s >>= 8, t[n + 4] = s;\n          var o = Number(e >> BigInt(32) & BigInt(4294967295));\n          return t[n + 3] = o, o >>= 8, t[n + 2] = o, o >>= 8, t[n + 1] = o, o >>= 8, t[n] = o, n + 8;\n        }\n        function L(t, e, n, r, i, s) {\n          if (n + r > t.length) throw new RangeError(\"Index out of range\");\n          if (n < 0) throw new RangeError(\"Index out of range\");\n        }\n        function U(t, e, n, r, s) {\n          return e = +e, n >>>= 0, s || L(t, 0, n, 4), i.write(t, e, n, r, 23, 4), n + 4;\n        }\n        function P(t, e, n, r, s) {\n          return e = +e, n >>>= 0, s || L(t, 0, n, 8), i.write(t, e, n, r, 52, 8), n + 8;\n        }\n        l.prototype.slice = function (t, e) {\n          var n = this.length;\n          (t = ~~t) < 0 ? (t += n) < 0 && (t = 0) : t > n && (t = n), (e = void 0 === e ? n : ~~e) < 0 ? (e += n) < 0 && (e = 0) : e > n && (e = n), e < t && (e = t);\n          var r = this.subarray(t, e);\n          return Object.setPrototypeOf(r, l.prototype), r;\n        }, l.prototype.readUintLE = l.prototype.readUIntLE = function (t, e, n) {\n          t >>>= 0, e >>>= 0, n || O(t, e, this.length);\n          var r = this[t],\n            i = 1,\n            s = 0;\n          for (; ++s < e && (i *= 256);) r += this[t + s] * i;\n          return r;\n        }, l.prototype.readUintBE = l.prototype.readUIntBE = function (t, e, n) {\n          t >>>= 0, e >>>= 0, n || O(t, e, this.length);\n          var r = this[t + --e],\n            i = 1;\n          for (; e > 0 && (i *= 256);) r += this[t + --e] * i;\n          return r;\n        }, l.prototype.readUint8 = l.prototype.readUInt8 = function (t, e) {\n          return t >>>= 0, e || O(t, 1, this.length), this[t];\n        }, l.prototype.readUint16LE = l.prototype.readUInt16LE = function (t, e) {\n          return t >>>= 0, e || O(t, 2, this.length), this[t] | this[t + 1] << 8;\n        }, l.prototype.readUint16BE = l.prototype.readUInt16BE = function (t, e) {\n          return t >>>= 0, e || O(t, 2, this.length), this[t] << 8 | this[t + 1];\n        }, l.prototype.readUint32LE = l.prototype.readUInt32LE = function (t, e) {\n          return t >>>= 0, e || O(t, 4, this.length), (this[t] | this[t + 1] << 8 | this[t + 2] << 16) + 16777216 * this[t + 3];\n        }, l.prototype.readUint32BE = l.prototype.readUInt32BE = function (t, e) {\n          return t >>>= 0, e || O(t, 4, this.length), 16777216 * this[t] + (this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3]);\n        }, l.prototype.readBigUInt64LE = J(function (t) {\n          q(t >>>= 0, \"offset\");\n          var e = this[t],\n            n = this[t + 7];\n          void 0 !== e && void 0 !== n || H(t, this.length - 8);\n          var r = e + 256 * this[++t] + 65536 * this[++t] + this[++t] * Math.pow(2, 24),\n            i = this[++t] + 256 * this[++t] + 65536 * this[++t] + n * Math.pow(2, 24);\n          return BigInt(r) + (BigInt(i) << BigInt(32));\n        }), l.prototype.readBigUInt64BE = J(function (t) {\n          q(t >>>= 0, \"offset\");\n          var e = this[t],\n            n = this[t + 7];\n          void 0 !== e && void 0 !== n || H(t, this.length - 8);\n          var r = e * Math.pow(2, 24) + 65536 * this[++t] + 256 * this[++t] + this[++t],\n            i = this[++t] * Math.pow(2, 24) + 65536 * this[++t] + 256 * this[++t] + n;\n          return (BigInt(r) << BigInt(32)) + BigInt(i);\n        }), l.prototype.readIntLE = function (t, e, n) {\n          t >>>= 0, e >>>= 0, n || O(t, e, this.length);\n          var r = this[t],\n            i = 1,\n            s = 0;\n          for (; ++s < e && (i *= 256);) r += this[t + s] * i;\n          return i *= 128, r >= i && (r -= Math.pow(2, 8 * e)), r;\n        }, l.prototype.readIntBE = function (t, e, n) {\n          t >>>= 0, e >>>= 0, n || O(t, e, this.length);\n          var r = e,\n            i = 1,\n            s = this[t + --r];\n          for (; r > 0 && (i *= 256);) s += this[t + --r] * i;\n          return i *= 128, s >= i && (s -= Math.pow(2, 8 * e)), s;\n        }, l.prototype.readInt8 = function (t, e) {\n          return t >>>= 0, e || O(t, 1, this.length), 128 & this[t] ? -1 * (255 - this[t] + 1) : this[t];\n        }, l.prototype.readInt16LE = function (t, e) {\n          t >>>= 0, e || O(t, 2, this.length);\n          var n = this[t] | this[t + 1] << 8;\n          return 32768 & n ? 4294901760 | n : n;\n        }, l.prototype.readInt16BE = function (t, e) {\n          t >>>= 0, e || O(t, 2, this.length);\n          var n = this[t + 1] | this[t] << 8;\n          return 32768 & n ? 4294901760 | n : n;\n        }, l.prototype.readInt32LE = function (t, e) {\n          return t >>>= 0, e || O(t, 4, this.length), this[t] | this[t + 1] << 8 | this[t + 2] << 16 | this[t + 3] << 24;\n        }, l.prototype.readInt32BE = function (t, e) {\n          return t >>>= 0, e || O(t, 4, this.length), this[t] << 24 | this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3];\n        }, l.prototype.readBigInt64LE = J(function (t) {\n          q(t >>>= 0, \"offset\");\n          var e = this[t],\n            n = this[t + 7];\n          void 0 !== e && void 0 !== n || H(t, this.length - 8);\n          var r = this[t + 4] + 256 * this[t + 5] + 65536 * this[t + 6] + (n << 24);\n          return (BigInt(r) << BigInt(32)) + BigInt(e + 256 * this[++t] + 65536 * this[++t] + this[++t] * Math.pow(2, 24));\n        }), l.prototype.readBigInt64BE = J(function (t) {\n          q(t >>>= 0, \"offset\");\n          var e = this[t],\n            n = this[t + 7];\n          void 0 !== e && void 0 !== n || H(t, this.length - 8);\n          var r = (e << 24) + 65536 * this[++t] + 256 * this[++t] + this[++t];\n          return (BigInt(r) << BigInt(32)) + BigInt(this[++t] * Math.pow(2, 24) + 65536 * this[++t] + 256 * this[++t] + n);\n        }), l.prototype.readFloatLE = function (t, e) {\n          return t >>>= 0, e || O(t, 4, this.length), i.read(this, t, !0, 23, 4);\n        }, l.prototype.readFloatBE = function (t, e) {\n          return t >>>= 0, e || O(t, 4, this.length), i.read(this, t, !1, 23, 4);\n        }, l.prototype.readDoubleLE = function (t, e) {\n          return t >>>= 0, e || O(t, 8, this.length), i.read(this, t, !0, 52, 8);\n        }, l.prototype.readDoubleBE = function (t, e) {\n          return t >>>= 0, e || O(t, 8, this.length), i.read(this, t, !1, 52, 8);\n        }, l.prototype.writeUintLE = l.prototype.writeUIntLE = function (t, e, n, r) {\n          t = +t, e >>>= 0, n >>>= 0, r || C(this, t, e, n, Math.pow(2, 8 * n) - 1, 0);\n          var i = 1,\n            s = 0;\n          for (this[e] = 255 & t; ++s < n && (i *= 256);) this[e + s] = t / i & 255;\n          return e + n;\n        }, l.prototype.writeUintBE = l.prototype.writeUIntBE = function (t, e, n, r) {\n          t = +t, e >>>= 0, n >>>= 0, r || C(this, t, e, n, Math.pow(2, 8 * n) - 1, 0);\n          var i = n - 1,\n            s = 1;\n          for (this[e + i] = 255 & t; --i >= 0 && (s *= 256);) this[e + i] = t / s & 255;\n          return e + n;\n        }, l.prototype.writeUint8 = l.prototype.writeUInt8 = function (t, e, n) {\n          return t = +t, e >>>= 0, n || C(this, t, e, 1, 255, 0), this[e] = 255 & t, e + 1;\n        }, l.prototype.writeUint16LE = l.prototype.writeUInt16LE = function (t, e, n) {\n          return t = +t, e >>>= 0, n || C(this, t, e, 2, 65535, 0), this[e] = 255 & t, this[e + 1] = t >>> 8, e + 2;\n        }, l.prototype.writeUint16BE = l.prototype.writeUInt16BE = function (t, e, n) {\n          return t = +t, e >>>= 0, n || C(this, t, e, 2, 65535, 0), this[e] = t >>> 8, this[e + 1] = 255 & t, e + 2;\n        }, l.prototype.writeUint32LE = l.prototype.writeUInt32LE = function (t, e, n) {\n          return t = +t, e >>>= 0, n || C(this, t, e, 4, 4294967295, 0), this[e + 3] = t >>> 24, this[e + 2] = t >>> 16, this[e + 1] = t >>> 8, this[e] = 255 & t, e + 4;\n        }, l.prototype.writeUint32BE = l.prototype.writeUInt32BE = function (t, e, n) {\n          return t = +t, e >>>= 0, n || C(this, t, e, 4, 4294967295, 0), this[e] = t >>> 24, this[e + 1] = t >>> 16, this[e + 2] = t >>> 8, this[e + 3] = 255 & t, e + 4;\n        }, l.prototype.writeBigUInt64LE = J(function (t) {\n          var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;\n          return R(this, t, e, BigInt(0), BigInt(\"0xffffffffffffffff\"));\n        }), l.prototype.writeBigUInt64BE = J(function (t) {\n          var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;\n          return N(this, t, e, BigInt(0), BigInt(\"0xffffffffffffffff\"));\n        }), l.prototype.writeIntLE = function (t, e, n, r) {\n          if (t = +t, e >>>= 0, !r) {\n            var _r12 = Math.pow(2, 8 * n - 1);\n            C(this, t, e, n, _r12 - 1, -_r12);\n          }\n          var i = 0,\n            s = 1,\n            o = 0;\n          for (this[e] = 255 & t; ++i < n && (s *= 256);) t < 0 && 0 === o && 0 !== this[e + i - 1] && (o = 1), this[e + i] = (t / s >> 0) - o & 255;\n          return e + n;\n        }, l.prototype.writeIntBE = function (t, e, n, r) {\n          if (t = +t, e >>>= 0, !r) {\n            var _r13 = Math.pow(2, 8 * n - 1);\n            C(this, t, e, n, _r13 - 1, -_r13);\n          }\n          var i = n - 1,\n            s = 1,\n            o = 0;\n          for (this[e + i] = 255 & t; --i >= 0 && (s *= 256);) t < 0 && 0 === o && 0 !== this[e + i + 1] && (o = 1), this[e + i] = (t / s >> 0) - o & 255;\n          return e + n;\n        }, l.prototype.writeInt8 = function (t, e, n) {\n          return t = +t, e >>>= 0, n || C(this, t, e, 1, 127, -128), t < 0 && (t = 255 + t + 1), this[e] = 255 & t, e + 1;\n        }, l.prototype.writeInt16LE = function (t, e, n) {\n          return t = +t, e >>>= 0, n || C(this, t, e, 2, 32767, -32768), this[e] = 255 & t, this[e + 1] = t >>> 8, e + 2;\n        }, l.prototype.writeInt16BE = function (t, e, n) {\n          return t = +t, e >>>= 0, n || C(this, t, e, 2, 32767, -32768), this[e] = t >>> 8, this[e + 1] = 255 & t, e + 2;\n        }, l.prototype.writeInt32LE = function (t, e, n) {\n          return t = +t, e >>>= 0, n || C(this, t, e, 4, 2147483647, -2147483648), this[e] = 255 & t, this[e + 1] = t >>> 8, this[e + 2] = t >>> 16, this[e + 3] = t >>> 24, e + 4;\n        }, l.prototype.writeInt32BE = function (t, e, n) {\n          return t = +t, e >>>= 0, n || C(this, t, e, 4, 2147483647, -2147483648), t < 0 && (t = 4294967295 + t + 1), this[e] = t >>> 24, this[e + 1] = t >>> 16, this[e + 2] = t >>> 8, this[e + 3] = 255 & t, e + 4;\n        }, l.prototype.writeBigInt64LE = J(function (t) {\n          var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;\n          return R(this, t, e, -BigInt(\"0x8000000000000000\"), BigInt(\"0x7fffffffffffffff\"));\n        }), l.prototype.writeBigInt64BE = J(function (t) {\n          var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;\n          return N(this, t, e, -BigInt(\"0x8000000000000000\"), BigInt(\"0x7fffffffffffffff\"));\n        }), l.prototype.writeFloatLE = function (t, e, n) {\n          return U(this, t, e, !0, n);\n        }, l.prototype.writeFloatBE = function (t, e, n) {\n          return U(this, t, e, !1, n);\n        }, l.prototype.writeDoubleLE = function (t, e, n) {\n          return P(this, t, e, !0, n);\n        }, l.prototype.writeDoubleBE = function (t, e, n) {\n          return P(this, t, e, !1, n);\n        }, l.prototype.copy = function (t, e, n, r) {\n          if (!l.isBuffer(t)) throw new TypeError(\"argument should be a Buffer\");\n          if (n || (n = 0), r || 0 === r || (r = this.length), e >= t.length && (e = t.length), e || (e = 0), r > 0 && r < n && (r = n), r === n) return 0;\n          if (0 === t.length || 0 === this.length) return 0;\n          if (e < 0) throw new RangeError(\"targetStart out of bounds\");\n          if (n < 0 || n >= this.length) throw new RangeError(\"Index out of range\");\n          if (r < 0) throw new RangeError(\"sourceEnd out of bounds\");\n          r > this.length && (r = this.length), t.length - e < r - n && (r = t.length - e + n);\n          var i = r - n;\n          return this === t && \"function\" == typeof Uint8Array.prototype.copyWithin ? this.copyWithin(e, n, r) : Uint8Array.prototype.set.call(t, this.subarray(n, r), e), i;\n        }, l.prototype.fill = function (t, e, n, r) {\n          if (\"string\" == typeof t) {\n            if (\"string\" == typeof e ? (r = e, e = 0, n = this.length) : \"string\" == typeof n && (r = n, n = this.length), void 0 !== r && \"string\" != typeof r) throw new TypeError(\"encoding must be a string\");\n            if (\"string\" == typeof r && !l.isEncoding(r)) throw new TypeError(\"Unknown encoding: \" + r);\n            if (1 === t.length) {\n              var _e22 = t.charCodeAt(0);\n              (\"utf8\" === r && _e22 < 128 || \"latin1\" === r) && (t = _e22);\n            }\n          } else \"number\" == typeof t ? t &= 255 : \"boolean\" == typeof t && (t = Number(t));\n          if (e < 0 || this.length < e || this.length < n) throw new RangeError(\"Out of range index\");\n          if (n <= e) return this;\n          var i;\n          if (e >>>= 0, n = void 0 === n ? this.length : n >>> 0, t || (t = 0), \"number\" == typeof t) for (i = e; i < n; ++i) this[i] = t;else {\n            var _s4 = l.isBuffer(t) ? t : l.from(t, r),\n              _o4 = _s4.length;\n            if (0 === _o4) throw new TypeError('The value \"' + t + '\" is invalid for argument \"value\"');\n            for (i = 0; i < n - e; ++i) this[i + e] = _s4[i % _o4];\n          }\n          return this;\n        };\n        var $ = {};\n        function j(t, e, n) {\n          $[t] = /*#__PURE__*/function (_n9) {\n            _inherits(_class3, _n9);\n            var _super2 = _createSuper(_class3);\n            function _class3() {\n              var _this7;\n              _classCallCheck(this, _class3);\n              _this7 = _super2.call(this), Object.defineProperty(_assertThisInitialized(_this7), \"message\", {\n                value: e.apply(_assertThisInitialized(_this7), arguments),\n                writable: !0,\n                configurable: !0\n              }), _this7.name = \"\".concat(_this7.name, \" [\").concat(t, \"]\"), _this7.stack, delete _this7.name;\n              return _this7;\n            }\n            _createClass(_class3, [{\n              key: \"code\",\n              get: function get() {\n                return t;\n              },\n              set: function set(t) {\n                Object.defineProperty(this, \"code\", {\n                  configurable: !0,\n                  enumerable: !0,\n                  value: t,\n                  writable: !0\n                });\n              }\n            }, {\n              key: \"toString\",\n              value: function toString() {\n                return \"\".concat(this.name, \" [\").concat(t, \"]: \").concat(this.message);\n              }\n            }]);\n            return _class3;\n          }(n);\n        }\n        function F(t) {\n          var e = \"\",\n            n = t.length;\n          var r = \"-\" === t[0] ? 1 : 0;\n          for (; n >= r + 4; n -= 3) e = \"_\".concat(t.slice(n - 3, n)).concat(e);\n          return \"\".concat(t.slice(0, n)).concat(e);\n        }\n        function D(t, e, n, r, i, s) {\n          if (t > n || t < e) {\n            var _r14 = \"bigint\" == typeof e ? \"n\" : \"\";\n            var _i10;\n            throw _i10 = s > 3 ? 0 === e || e === BigInt(0) ? \">= 0\".concat(_r14, \" and < 2\").concat(_r14, \" ** \").concat(8 * (s + 1)).concat(_r14) : \">= -(2\".concat(_r14, \" ** \").concat(8 * (s + 1) - 1).concat(_r14, \") and < 2 ** \").concat(8 * (s + 1) - 1).concat(_r14) : \">= \".concat(e).concat(_r14, \" and <= \").concat(n).concat(_r14), new $.ERR_OUT_OF_RANGE(\"value\", _i10, t);\n          }\n          !function (t, e, n) {\n            q(e, \"offset\"), void 0 !== t[e] && void 0 !== t[e + n] || H(e, t.length - (n + 1));\n          }(r, i, s);\n        }\n        function q(t, e) {\n          if (\"number\" != typeof t) throw new $.ERR_INVALID_ARG_TYPE(e, \"number\", t);\n        }\n        function H(t, e, n) {\n          if (Math.floor(t) !== t) throw q(t, n), new $.ERR_OUT_OF_RANGE(n || \"offset\", \"an integer\", t);\n          if (e < 0) throw new $.ERR_BUFFER_OUT_OF_BOUNDS();\n          throw new $.ERR_OUT_OF_RANGE(n || \"offset\", \">= \".concat(n ? 1 : 0, \" and <= \").concat(e), t);\n        }\n        j(\"ERR_BUFFER_OUT_OF_BOUNDS\", function (t) {\n          return t ? \"\".concat(t, \" is outside of buffer bounds\") : \"Attempt to access memory outside buffer bounds\";\n        }, RangeError), j(\"ERR_INVALID_ARG_TYPE\", function (t, e) {\n          return \"The \\\"\".concat(t, \"\\\" argument must be of type number. Received type \").concat(_typeof(e));\n        }, TypeError), j(\"ERR_OUT_OF_RANGE\", function (t, e, n) {\n          var r = \"The value of \\\"\".concat(t, \"\\\" is out of range.\"),\n            i = n;\n          return Number.isInteger(n) && Math.abs(n) > Math.pow(2, 32) ? i = F(String(n)) : \"bigint\" == typeof n && (i = String(n), (n > Math.pow(BigInt(2), BigInt(32)) || n < -Math.pow(BigInt(2), BigInt(32))) && (i = F(i)), i += \"n\"), r += \" It must be \".concat(e, \". Received \").concat(i), r;\n        }, RangeError);\n        var Z = /[^+/0-9A-Za-z-_]/g;\n        function G(t, e) {\n          var n;\n          e = e || 1 / 0;\n          var r = t.length;\n          var i = null;\n          var s = [];\n          for (var _o5 = 0; _o5 < r; ++_o5) {\n            if (n = t.charCodeAt(_o5), n > 55295 && n < 57344) {\n              if (!i) {\n                if (n > 56319) {\n                  (e -= 3) > -1 && s.push(239, 191, 189);\n                  continue;\n                }\n                if (_o5 + 1 === r) {\n                  (e -= 3) > -1 && s.push(239, 191, 189);\n                  continue;\n                }\n                i = n;\n                continue;\n              }\n              if (n < 56320) {\n                (e -= 3) > -1 && s.push(239, 191, 189), i = n;\n                continue;\n              }\n              n = 65536 + (i - 55296 << 10 | n - 56320);\n            } else i && (e -= 3) > -1 && s.push(239, 191, 189);\n            if (i = null, n < 128) {\n              if ((e -= 1) < 0) break;\n              s.push(n);\n            } else if (n < 2048) {\n              if ((e -= 2) < 0) break;\n              s.push(n >> 6 | 192, 63 & n | 128);\n            } else if (n < 65536) {\n              if ((e -= 3) < 0) break;\n              s.push(n >> 12 | 224, n >> 6 & 63 | 128, 63 & n | 128);\n            } else {\n              if (!(n < 1114112)) throw new Error(\"Invalid code point\");\n              if ((e -= 4) < 0) break;\n              s.push(n >> 18 | 240, n >> 12 & 63 | 128, n >> 6 & 63 | 128, 63 & n | 128);\n            }\n          }\n          return s;\n        }\n        function W(t) {\n          return r.toByteArray(function (t) {\n            if ((t = (t = t.split(\"=\")[0]).trim().replace(Z, \"\")).length < 2) return \"\";\n            for (; t.length % 4 != 0;) t += \"=\";\n            return t;\n          }(t));\n        }\n        function X(t, e, n, r) {\n          var i;\n          for (i = 0; i < r && !(i + n >= e.length || i >= t.length); ++i) e[i + n] = t[i];\n          return i;\n        }\n        function V(t, e) {\n          return t instanceof e || null != t && null != t.constructor && null != t.constructor.name && t.constructor.name === e.name;\n        }\n        function K(t) {\n          return t != t;\n        }\n        var Y = function () {\n          var t = \"0123456789abcdef\",\n            e = new Array(256);\n          for (var _n10 = 0; _n10 < 16; ++_n10) {\n            var _r15 = 16 * _n10;\n            for (var _i11 = 0; _i11 < 16; ++_i11) e[_r15 + _i11] = t[_n10] + t[_i11];\n          }\n          return e;\n        }();\n        function J(t) {\n          return \"undefined\" == typeof BigInt ? Q : t;\n        }\n        function Q() {\n          throw new Error(\"BigInt not supported\");\n        }\n      },\n      2949: function _(t, e, n) {\n        \"use strict\";\n\n        n.d(e, {\n          S9: function S9() {\n            return i();\n          },\n          kC: function kC() {\n            return o;\n          }\n        });\n        var r = n(7067),\n          i = n.n(r),\n          s = n(8764);\n        var o = /*#__PURE__*/function () {\n          function o(t) {\n            var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n            _classCallCheck(this, o);\n            this.baseOverrides = {}, this.url = t;\n            var n = e.fetch || globalThis.fetch.bind(globalThis);\n            if (!n) throw new TypeError(\"no fetch function supplied, and none found in global environment\");\n            e.overrides && (this.baseOverrides = e.overrides), this.fetchImplementation = n;\n          }\n          _createClass(o, [{\n            key: \"getBufferFromResponse\",\n            value: function () {\n              var _getBufferFromResponse = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee21(t) {\n                var e;\n                return _regeneratorRuntime().wrap(function _callee21$(_context24) {\n                  while (1) switch (_context24.prev = _context24.next) {\n                    case 0:\n                      _context24.next = 2;\n                      return t.arrayBuffer();\n                    case 2:\n                      e = _context24.sent;\n                      return _context24.abrupt(\"return\", s.lW.from(e));\n                    case 4:\n                    case \"end\":\n                      return _context24.stop();\n                  }\n                }, _callee21);\n              }));\n              function getBufferFromResponse(_x36) {\n                return _getBufferFromResponse.apply(this, arguments);\n              }\n              return getBufferFromResponse;\n            }()\n          }, {\n            key: \"fetch\",\n            value: function () {\n              var _fetch2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee22(t, e) {\n                var n;\n                return _regeneratorRuntime().wrap(function _callee22$(_context25) {\n                  while (1) switch (_context25.prev = _context25.next) {\n                    case 0:\n                      _context25.prev = 0;\n                      _context25.next = 3;\n                      return this.fetchImplementation(t, e);\n                    case 3:\n                      n = _context25.sent;\n                      _context25.next = 14;\n                      break;\n                    case 6:\n                      _context25.prev = 6;\n                      _context25.t0 = _context25[\"catch\"](0);\n                      if (\"\".concat(_context25.t0).includes(\"Failed to fetch\")) {\n                        _context25.next = 10;\n                        break;\n                      }\n                      throw _context25.t0;\n                    case 10:\n                      console.warn(\"generic-filehandle: refetching \".concat(t, \" to attempt to work around chrome CORS header caching bug\"));\n                      _context25.next = 13;\n                      return this.fetchImplementation(t, _objectSpread(_objectSpread({}, e), {}, {\n                        cache: \"reload\"\n                      }));\n                    case 13:\n                      n = _context25.sent;\n                    case 14:\n                      return _context25.abrupt(\"return\", n);\n                    case 15:\n                    case \"end\":\n                      return _context25.stop();\n                  }\n                }, _callee22, this, [[0, 6]]);\n              }));\n              function fetch(_x37, _x38) {\n                return _fetch2.apply(this, arguments);\n              }\n              return fetch;\n            }()\n          }, {\n            key: \"read\",\n            value: function () {\n              var _read2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee23(t) {\n                var e,\n                  n,\n                  r,\n                  i,\n                  _i$headers,\n                  s,\n                  _o6,\n                  _i$overrides,\n                  a,\n                  l,\n                  h,\n                  _r16,\n                  _i12,\n                  _s5,\n                  _o7,\n                  _args26 = arguments;\n                return _regeneratorRuntime().wrap(function _callee23$(_context26) {\n                  while (1) switch (_context26.prev = _context26.next) {\n                    case 0:\n                      e = _args26.length > 1 && _args26[1] !== undefined ? _args26[1] : 0;\n                      n = _args26.length > 2 ? _args26[2] : undefined;\n                      r = _args26.length > 3 && _args26[3] !== undefined ? _args26[3] : 0;\n                      i = _args26.length > 4 && _args26[4] !== undefined ? _args26[4] : {};\n                      _i$headers = i.headers, s = _i$headers === void 0 ? {} : _i$headers, _o6 = i.signal, _i$overrides = i.overrides, a = _i$overrides === void 0 ? {} : _i$overrides;\n                      n < 1 / 0 ? s.range = \"bytes=\".concat(r, \"-\").concat(r + n) : n === 1 / 0 && 0 !== r && (s.range = \"bytes=\".concat(r, \"-\"));\n                      l = _objectSpread(_objectSpread(_objectSpread({}, this.baseOverrides), a), {}, {\n                        headers: _objectSpread(_objectSpread(_objectSpread({}, s), a.headers), this.baseOverrides.headers),\n                        method: \"GET\",\n                        redirect: \"follow\",\n                        mode: \"cors\",\n                        signal: _o6\n                      });\n                      _context26.next = 9;\n                      return this.fetch(this.url, l);\n                    case 9:\n                      h = _context26.sent;\n                      if (h.ok) {\n                        _context26.next = 12;\n                        break;\n                      }\n                      throw new Error(\"HTTP \".concat(h.status, \" \").concat(h.statusText, \" \").concat(this.url));\n                    case 12:\n                      if (!(200 === h.status && 0 === r || 206 === h.status)) {\n                        _context26.next = 20;\n                        break;\n                      }\n                      _context26.next = 15;\n                      return this.getBufferFromResponse(h);\n                    case 15:\n                      _r16 = _context26.sent;\n                      _i12 = _r16.copy(t, e, 0, Math.min(n, _r16.length));\n                      _s5 = h.headers.get(\"content-range\");\n                      _o7 = /\\/(\\d+)$/.exec(_s5 || \"\");\n                      return _context26.abrupt(\"return\", ((null == _o7 ? void 0 : _o7[1]) && (this._stat = {\n                        size: parseInt(_o7[1], 10)\n                      }), {\n                        bytesRead: _i12,\n                        buffer: t\n                      }));\n                    case 20:\n                      if (!(200 === h.status)) {\n                        _context26.next = 22;\n                        break;\n                      }\n                      throw new Error(\"${this.url} fetch returned status 200, expected 206\");\n                    case 22:\n                      throw new Error(\"HTTP \".concat(h.status, \" fetching \").concat(this.url));\n                    case 23:\n                    case \"end\":\n                      return _context26.stop();\n                  }\n                }, _callee23, this);\n              }));\n              function read(_x39) {\n                return _read2.apply(this, arguments);\n              }\n              return read;\n            }()\n          }, {\n            key: \"readFile\",\n            value: function () {\n              var _readFile = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee24() {\n                var t,\n                  e,\n                  n,\n                  _n11,\n                  _n11$headers,\n                  r,\n                  i,\n                  _n11$overrides,\n                  s,\n                  _o8,\n                  a,\n                  _args27 = arguments;\n                return _regeneratorRuntime().wrap(function _callee24$(_context27) {\n                  while (1) switch (_context27.prev = _context27.next) {\n                    case 0:\n                      t = _args27.length > 0 && _args27[0] !== undefined ? _args27[0] : {};\n                      \"string\" == typeof t ? (e = t, n = {}) : (e = t.encoding, n = t, delete n.encoding);\n                      _n11 = n;\n                      _n11$headers = _n11.headers;\n                      r = _n11$headers === void 0 ? {} : _n11$headers;\n                      i = _n11.signal;\n                      _n11$overrides = _n11.overrides;\n                      s = _n11$overrides === void 0 ? {} : _n11$overrides;\n                      _o8 = _objectSpread(_objectSpread({\n                        headers: r,\n                        method: \"GET\",\n                        redirect: \"follow\",\n                        mode: \"cors\",\n                        signal: i\n                      }, this.baseOverrides), s);\n                      _context27.next = 11;\n                      return this.fetch(this.url, _o8);\n                    case 11:\n                      a = _context27.sent;\n                      if (a) {\n                        _context27.next = 14;\n                        break;\n                      }\n                      throw new Error(\"generic-filehandle failed to fetch\");\n                    case 14:\n                      if (!(200 !== a.status)) {\n                        _context27.next = 16;\n                        break;\n                      }\n                      throw Object.assign(new Error(\"HTTP \".concat(a.status, \" fetching \").concat(this.url)), {\n                        status: a.status\n                      });\n                    case 16:\n                      if (!(\"utf8\" === e)) {\n                        _context27.next = 18;\n                        break;\n                      }\n                      return _context27.abrupt(\"return\", a.text());\n                    case 18:\n                      if (!e) {\n                        _context27.next = 20;\n                        break;\n                      }\n                      throw new Error(\"unsupported encoding: \".concat(e));\n                    case 20:\n                      return _context27.abrupt(\"return\", this.getBufferFromResponse(a));\n                    case 21:\n                    case \"end\":\n                      return _context27.stop();\n                  }\n                }, _callee24, this);\n              }));\n              function readFile() {\n                return _readFile.apply(this, arguments);\n              }\n              return readFile;\n            }()\n          }, {\n            key: \"stat\",\n            value: function () {\n              var _stat2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee25() {\n                var _t14;\n                return _regeneratorRuntime().wrap(function _callee25$(_context28) {\n                  while (1) switch (_context28.prev = _context28.next) {\n                    case 0:\n                      if (this._stat) {\n                        _context28.next = 6;\n                        break;\n                      }\n                      _t14 = s.lW.allocUnsafe(10);\n                      _context28.next = 4;\n                      return this.read(_t14, 0, 10, 0);\n                    case 4:\n                      if (this._stat) {\n                        _context28.next = 6;\n                        break;\n                      }\n                      throw new Error(\"unable to determine size of file at \".concat(this.url));\n                    case 6:\n                      return _context28.abrupt(\"return\", this._stat);\n                    case 7:\n                    case \"end\":\n                      return _context28.stop();\n                  }\n                }, _callee25, this);\n              }));\n              function stat() {\n                return _stat2.apply(this, arguments);\n              }\n              return stat;\n            }()\n          }, {\n            key: \"close\",\n            value: function () {\n              var _close = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee26() {\n                return _regeneratorRuntime().wrap(function _callee26$(_context29) {\n                  while (1) switch (_context29.prev = _context29.next) {\n                    case 0:\n                    case \"end\":\n                      return _context29.stop();\n                  }\n                }, _callee26);\n              }));\n              function close() {\n                return _close.apply(this, arguments);\n              }\n              return close;\n            }()\n          }]);\n          return o;\n        }();\n      },\n      645: function _(t, e) {\n        e.read = function (t, e, n, r, i) {\n          var s,\n            o,\n            a = 8 * i - r - 1,\n            l = (1 << a) - 1,\n            h = l >> 1,\n            u = -7,\n            f = n ? i - 1 : 0,\n            c = n ? -1 : 1,\n            d = t[e + f];\n          for (f += c, s = d & (1 << -u) - 1, d >>= -u, u += a; u > 0; s = 256 * s + t[e + f], f += c, u -= 8);\n          for (o = s & (1 << -u) - 1, s >>= -u, u += r; u > 0; o = 256 * o + t[e + f], f += c, u -= 8);\n          if (0 === s) s = 1 - h;else {\n            if (s === l) return o ? NaN : 1 / 0 * (d ? -1 : 1);\n            o += Math.pow(2, r), s -= h;\n          }\n          return (d ? -1 : 1) * o * Math.pow(2, s - r);\n        }, e.write = function (t, e, n, r, i, s) {\n          var o,\n            a,\n            l,\n            h = 8 * s - i - 1,\n            u = (1 << h) - 1,\n            f = u >> 1,\n            c = 23 === i ? Math.pow(2, -24) - Math.pow(2, -77) : 0,\n            d = r ? 0 : s - 1,\n            g = r ? 1 : -1,\n            p = e < 0 || 0 === e && 1 / e < 0 ? 1 : 0;\n          for (e = Math.abs(e), isNaN(e) || e === 1 / 0 ? (a = isNaN(e) ? 1 : 0, o = u) : (o = Math.floor(Math.log(e) / Math.LN2), e * (l = Math.pow(2, -o)) < 1 && (o--, l *= 2), (e += o + f >= 1 ? c / l : c * Math.pow(2, 1 - f)) * l >= 2 && (o++, l /= 2), o + f >= u ? (a = 0, o = u) : o + f >= 1 ? (a = (e * l - 1) * Math.pow(2, i), o += f) : (a = e * Math.pow(2, f - 1) * Math.pow(2, i), o = 0)); i >= 8; t[n + d] = 255 & a, d += g, a /= 256, i -= 8);\n          for (o = o << i | a, h += i; h > 0; t[n + d] = 255 & o, d += g, o /= 256, h -= 8);\n          t[n + d - g] |= 128 * p;\n        };\n      },\n      6898: function _(t) {\n        \"use strict\";\n\n        t.exports = function (t) {\n          return !!t && (\"symbol\" == _typeof(Symbol.observable) && \"function\" == typeof t[Symbol.observable] ? t === t[Symbol.observable]() : \"function\" == typeof t[\"@@observable\"] && t === t[\"@@observable\"]());\n        };\n      },\n      3720: function _(t) {\n        t.exports = n;\n        var e = null;\n        try {\n          e = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 13, 2, 96, 0, 1, 127, 96, 4, 127, 127, 127, 127, 1, 127, 3, 7, 6, 0, 1, 1, 1, 1, 1, 6, 6, 1, 127, 1, 65, 0, 11, 7, 50, 6, 3, 109, 117, 108, 0, 1, 5, 100, 105, 118, 95, 115, 0, 2, 5, 100, 105, 118, 95, 117, 0, 3, 5, 114, 101, 109, 95, 115, 0, 4, 5, 114, 101, 109, 95, 117, 0, 5, 8, 103, 101, 116, 95, 104, 105, 103, 104, 0, 0, 10, 191, 1, 6, 4, 0, 35, 0, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 126, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 127, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 128, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 129, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 130, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11])), {}).exports;\n        } catch (t) {}\n        function n(t, e, n) {\n          this.low = 0 | t, this.high = 0 | e, this.unsigned = !!n;\n        }\n        function r(t) {\n          return !0 === (t && t.__isLong__);\n        }\n        n.prototype.__isLong__, Object.defineProperty(n.prototype, \"__isLong__\", {\n          value: !0\n        }), n.isLong = r;\n        var i = {},\n          s = {};\n        function o(t, e) {\n          var n, r, o;\n          return e ? (o = 0 <= (t >>>= 0) && t < 256) && (r = s[t]) ? r : (n = l(t, (0 | t) < 0 ? -1 : 0, !0), o && (s[t] = n), n) : (o = -128 <= (t |= 0) && t < 128) && (r = i[t]) ? r : (n = l(t, t < 0 ? -1 : 0, !1), o && (i[t] = n), n);\n        }\n        function a(t, e) {\n          if (isNaN(t)) return e ? _ : m;\n          if (e) {\n            if (t < 0) return _;\n            if (t >= d) return k;\n          } else {\n            if (t <= -g) return x;\n            if (t + 1 >= g) return v;\n          }\n          return t < 0 ? a(-t, e).neg() : l(t % c | 0, t / c | 0, e);\n        }\n        function l(t, e, r) {\n          return new n(t, e, r);\n        }\n        n.fromInt = o, n.fromNumber = a, n.fromBits = l;\n        var h = Math.pow;\n        function u(t, e, n) {\n          if (0 === t.length) throw Error(\"empty string\");\n          if (\"NaN\" === t || \"Infinity\" === t || \"+Infinity\" === t || \"-Infinity\" === t) return m;\n          if (\"number\" == typeof e ? (n = e, e = !1) : e = !!e, (n = n || 10) < 2 || 36 < n) throw RangeError(\"radix\");\n          var r;\n          if ((r = t.indexOf(\"-\")) > 0) throw Error(\"interior hyphen\");\n          if (0 === r) return u(t.substring(1), e, n).neg();\n          for (var i = a(h(n, 8)), s = m, o = 0; o < t.length; o += 8) {\n            var l = Math.min(8, t.length - o),\n              f = parseInt(t.substring(o, o + l), n);\n            if (l < 8) {\n              var c = a(h(n, l));\n              s = s.mul(c).add(a(f));\n            } else s = (s = s.mul(i)).add(a(f));\n          }\n          return s.unsigned = e, s;\n        }\n        function f(t, e) {\n          return \"number\" == typeof t ? a(t, e) : \"string\" == typeof t ? u(t, e) : l(t.low, t.high, \"boolean\" == typeof e ? e : t.unsigned);\n        }\n        n.fromString = u, n.fromValue = f;\n        var c = 4294967296,\n          d = c * c,\n          g = d / 2,\n          p = o(1 << 24),\n          m = o(0);\n        n.ZERO = m;\n        var _ = o(0, !0);\n        n.UZERO = _;\n        var b = o(1);\n        n.ONE = b;\n        var w = o(1, !0);\n        n.UONE = w;\n        var y = o(-1);\n        n.NEG_ONE = y;\n        var v = l(-1, 2147483647, !1);\n        n.MAX_VALUE = v;\n        var k = l(-1, -1, !0);\n        n.MAX_UNSIGNED_VALUE = k;\n        var x = l(0, -2147483648, !1);\n        n.MIN_VALUE = x;\n        var E = n.prototype;\n        E.toInt = function () {\n          return this.unsigned ? this.low >>> 0 : this.low;\n        }, E.toNumber = function () {\n          return this.unsigned ? (this.high >>> 0) * c + (this.low >>> 0) : this.high * c + (this.low >>> 0);\n        }, E.toString = function (t) {\n          if ((t = t || 10) < 2 || 36 < t) throw RangeError(\"radix\");\n          if (this.isZero()) return \"0\";\n          if (this.isNegative()) {\n            if (this.eq(x)) {\n              var e = a(t),\n                n = this.div(e),\n                r = n.mul(e).sub(this);\n              return n.toString(t) + r.toInt().toString(t);\n            }\n            return \"-\" + this.neg().toString(t);\n          }\n          for (var i = a(h(t, 6), this.unsigned), s = this, o = \"\";;) {\n            var l = s.div(i),\n              u = (s.sub(l.mul(i)).toInt() >>> 0).toString(t);\n            if ((s = l).isZero()) return u + o;\n            for (; u.length < 6;) u = \"0\" + u;\n            o = \"\" + u + o;\n          }\n        }, E.getHighBits = function () {\n          return this.high;\n        }, E.getHighBitsUnsigned = function () {\n          return this.high >>> 0;\n        }, E.getLowBits = function () {\n          return this.low;\n        }, E.getLowBitsUnsigned = function () {\n          return this.low >>> 0;\n        }, E.getNumBitsAbs = function () {\n          if (this.isNegative()) return this.eq(x) ? 64 : this.neg().getNumBitsAbs();\n          for (var t = 0 != this.high ? this.high : this.low, e = 31; e > 0 && 0 == (t & 1 << e); e--);\n          return 0 != this.high ? e + 33 : e + 1;\n        }, E.isZero = function () {\n          return 0 === this.high && 0 === this.low;\n        }, E.eqz = E.isZero, E.isNegative = function () {\n          return !this.unsigned && this.high < 0;\n        }, E.isPositive = function () {\n          return this.unsigned || this.high >= 0;\n        }, E.isOdd = function () {\n          return 1 == (1 & this.low);\n        }, E.isEven = function () {\n          return 0 == (1 & this.low);\n        }, E.equals = function (t) {\n          return r(t) || (t = f(t)), (this.unsigned === t.unsigned || this.high >>> 31 != 1 || t.high >>> 31 != 1) && this.high === t.high && this.low === t.low;\n        }, E.eq = E.equals, E.notEquals = function (t) {\n          return !this.eq(t);\n        }, E.neq = E.notEquals, E.ne = E.notEquals, E.lessThan = function (t) {\n          return this.comp(t) < 0;\n        }, E.lt = E.lessThan, E.lessThanOrEqual = function (t) {\n          return this.comp(t) <= 0;\n        }, E.lte = E.lessThanOrEqual, E.le = E.lessThanOrEqual, E.greaterThan = function (t) {\n          return this.comp(t) > 0;\n        }, E.gt = E.greaterThan, E.greaterThanOrEqual = function (t) {\n          return this.comp(t) >= 0;\n        }, E.gte = E.greaterThanOrEqual, E.ge = E.greaterThanOrEqual, E.compare = function (t) {\n          if (r(t) || (t = f(t)), this.eq(t)) return 0;\n          var e = this.isNegative(),\n            n = t.isNegative();\n          return e && !n ? -1 : !e && n ? 1 : this.unsigned ? t.high >>> 0 > this.high >>> 0 || t.high === this.high && t.low >>> 0 > this.low >>> 0 ? -1 : 1 : this.sub(t).isNegative() ? -1 : 1;\n        }, E.comp = E.compare, E.negate = function () {\n          return !this.unsigned && this.eq(x) ? x : this.not().add(b);\n        }, E.neg = E.negate, E.add = function (t) {\n          r(t) || (t = f(t));\n          var e = this.high >>> 16,\n            n = 65535 & this.high,\n            i = this.low >>> 16,\n            s = 65535 & this.low,\n            o = t.high >>> 16,\n            a = 65535 & t.high,\n            h = t.low >>> 16,\n            u = 0,\n            c = 0,\n            d = 0,\n            g = 0;\n          return d += (g += s + (65535 & t.low)) >>> 16, c += (d += i + h) >>> 16, u += (c += n + a) >>> 16, u += e + o, l((d &= 65535) << 16 | (g &= 65535), (u &= 65535) << 16 | (c &= 65535), this.unsigned);\n        }, E.subtract = function (t) {\n          return r(t) || (t = f(t)), this.add(t.neg());\n        }, E.sub = E.subtract, E.multiply = function (t) {\n          if (this.isZero()) return m;\n          if (r(t) || (t = f(t)), e) return l(e.mul(this.low, this.high, t.low, t.high), e.get_high(), this.unsigned);\n          if (t.isZero()) return m;\n          if (this.eq(x)) return t.isOdd() ? x : m;\n          if (t.eq(x)) return this.isOdd() ? x : m;\n          if (this.isNegative()) return t.isNegative() ? this.neg().mul(t.neg()) : this.neg().mul(t).neg();\n          if (t.isNegative()) return this.mul(t.neg()).neg();\n          if (this.lt(p) && t.lt(p)) return a(this.toNumber() * t.toNumber(), this.unsigned);\n          var n = this.high >>> 16,\n            i = 65535 & this.high,\n            s = this.low >>> 16,\n            o = 65535 & this.low,\n            h = t.high >>> 16,\n            u = 65535 & t.high,\n            c = t.low >>> 16,\n            d = 65535 & t.low,\n            g = 0,\n            _ = 0,\n            b = 0,\n            w = 0;\n          return b += (w += o * d) >>> 16, _ += (b += s * d) >>> 16, b &= 65535, _ += (b += o * c) >>> 16, g += (_ += i * d) >>> 16, _ &= 65535, g += (_ += s * c) >>> 16, _ &= 65535, g += (_ += o * u) >>> 16, g += n * d + i * c + s * u + o * h, l((b &= 65535) << 16 | (w &= 65535), (g &= 65535) << 16 | (_ &= 65535), this.unsigned);\n        }, E.mul = E.multiply, E.divide = function (t) {\n          if (r(t) || (t = f(t)), t.isZero()) throw Error(\"division by zero\");\n          var n, i, s;\n          if (e) return this.unsigned || -2147483648 !== this.high || -1 !== t.low || -1 !== t.high ? l((this.unsigned ? e.div_u : e.div_s)(this.low, this.high, t.low, t.high), e.get_high(), this.unsigned) : this;\n          if (this.isZero()) return this.unsigned ? _ : m;\n          if (this.unsigned) {\n            if (t.unsigned || (t = t.toUnsigned()), t.gt(this)) return _;\n            if (t.gt(this.shru(1))) return w;\n            s = _;\n          } else {\n            if (this.eq(x)) return t.eq(b) || t.eq(y) ? x : t.eq(x) ? b : (n = this.shr(1).div(t).shl(1)).eq(m) ? t.isNegative() ? b : y : (i = this.sub(t.mul(n)), s = n.add(i.div(t)));\n            if (t.eq(x)) return this.unsigned ? _ : m;\n            if (this.isNegative()) return t.isNegative() ? this.neg().div(t.neg()) : this.neg().div(t).neg();\n            if (t.isNegative()) return this.div(t.neg()).neg();\n            s = m;\n          }\n          for (i = this; i.gte(t);) {\n            n = Math.max(1, Math.floor(i.toNumber() / t.toNumber()));\n            for (var o = Math.ceil(Math.log(n) / Math.LN2), u = o <= 48 ? 1 : h(2, o - 48), c = a(n), d = c.mul(t); d.isNegative() || d.gt(i);) d = (c = a(n -= u, this.unsigned)).mul(t);\n            c.isZero() && (c = b), s = s.add(c), i = i.sub(d);\n          }\n          return s;\n        }, E.div = E.divide, E.modulo = function (t) {\n          return r(t) || (t = f(t)), e ? l((this.unsigned ? e.rem_u : e.rem_s)(this.low, this.high, t.low, t.high), e.get_high(), this.unsigned) : this.sub(this.div(t).mul(t));\n        }, E.mod = E.modulo, E.rem = E.modulo, E.not = function () {\n          return l(~this.low, ~this.high, this.unsigned);\n        }, E.and = function (t) {\n          return r(t) || (t = f(t)), l(this.low & t.low, this.high & t.high, this.unsigned);\n        }, E.or = function (t) {\n          return r(t) || (t = f(t)), l(this.low | t.low, this.high | t.high, this.unsigned);\n        }, E.xor = function (t) {\n          return r(t) || (t = f(t)), l(this.low ^ t.low, this.high ^ t.high, this.unsigned);\n        }, E.shiftLeft = function (t) {\n          return r(t) && (t = t.toInt()), 0 == (t &= 63) ? this : t < 32 ? l(this.low << t, this.high << t | this.low >>> 32 - t, this.unsigned) : l(0, this.low << t - 32, this.unsigned);\n        }, E.shl = E.shiftLeft, E.shiftRight = function (t) {\n          return r(t) && (t = t.toInt()), 0 == (t &= 63) ? this : t < 32 ? l(this.low >>> t | this.high << 32 - t, this.high >> t, this.unsigned) : l(this.high >> t - 32, this.high >= 0 ? 0 : -1, this.unsigned);\n        }, E.shr = E.shiftRight, E.shiftRightUnsigned = function (t) {\n          if (r(t) && (t = t.toInt()), 0 == (t &= 63)) return this;\n          var e = this.high;\n          return t < 32 ? l(this.low >>> t | e << 32 - t, e >>> t, this.unsigned) : l(32 === t ? e : e >>> t - 32, 0, this.unsigned);\n        }, E.shru = E.shiftRightUnsigned, E.shr_u = E.shiftRightUnsigned, E.toSigned = function () {\n          return this.unsigned ? l(this.low, this.high, !1) : this;\n        }, E.toUnsigned = function () {\n          return this.unsigned ? this : l(this.low, this.high, !0);\n        }, E.toBytes = function (t) {\n          return t ? this.toBytesLE() : this.toBytesBE();\n        }, E.toBytesLE = function () {\n          var t = this.high,\n            e = this.low;\n          return [255 & e, e >>> 8 & 255, e >>> 16 & 255, e >>> 24, 255 & t, t >>> 8 & 255, t >>> 16 & 255, t >>> 24];\n        }, E.toBytesBE = function () {\n          var t = this.high,\n            e = this.low;\n          return [t >>> 24, t >>> 16 & 255, t >>> 8 & 255, 255 & t, e >>> 24, e >>> 16 & 255, e >>> 8 & 255, 255 & e];\n        }, n.fromBytes = function (t, e, r) {\n          return r ? n.fromBytesLE(t, e) : n.fromBytesBE(t, e);\n        }, n.fromBytesLE = function (t, e) {\n          return new n(t[0] | t[1] << 8 | t[2] << 16 | t[3] << 24, t[4] | t[5] << 8 | t[6] << 16 | t[7] << 24, e);\n        }, n.fromBytesBE = function (t, e) {\n          return new n(t[4] << 24 | t[5] << 16 | t[6] << 8 | t[7], t[0] << 24 | t[1] << 16 | t[2] << 8 | t[3], e);\n        };\n      },\n      9593: function _(t, e, n) {\n        \"use strict\";\n\n        var r = n(4411),\n          i = Symbol(\"max\"),\n          s = Symbol(\"length\"),\n          o = Symbol(\"lengthCalculator\"),\n          a = Symbol(\"allowStale\"),\n          l = Symbol(\"maxAge\"),\n          h = Symbol(\"dispose\"),\n          u = Symbol(\"noDisposeOnSet\"),\n          f = Symbol(\"lruList\"),\n          c = Symbol(\"cache\"),\n          d = Symbol(\"updateAgeOnGet\"),\n          g = function g() {\n            return 1;\n          },\n          p = function p(t, e, n) {\n            var r = t[c].get(e);\n            if (r) {\n              var _e23 = r.value;\n              if (m(t, _e23)) {\n                if (b(t, r), !t[a]) return;\n              } else n && (t[d] && (r.value.now = Date.now()), t[f].unshiftNode(r));\n              return _e23.value;\n            }\n          },\n          m = function m(t, e) {\n            if (!e || !e.maxAge && !t[l]) return !1;\n            var n = Date.now() - e.now;\n            return e.maxAge ? n > e.maxAge : t[l] && n > t[l];\n          },\n          _ = function _(t) {\n            if (t[s] > t[i]) for (var _e24 = t[f].tail; t[s] > t[i] && null !== _e24;) {\n              var _n12 = _e24.prev;\n              b(t, _e24), _e24 = _n12;\n            }\n          },\n          b = function b(t, e) {\n            if (e) {\n              var _n13 = e.value;\n              t[h] && t[h](_n13.key, _n13.value), t[s] -= _n13.length, t[c][\"delete\"](_n13.key), t[f].removeNode(e);\n            }\n          };\n        var w = /*#__PURE__*/_createClass(function w(t, e, n, r, i) {\n          _classCallCheck(this, w);\n          this.key = t, this.value = e, this.length = n, this.now = r, this.maxAge = i || 0;\n        });\n        var y = function y(t, e, n, r) {\n          var i = n.value;\n          m(t, i) && (b(t, n), t[a] || (i = void 0)), i && e.call(r, i.value, i.key, t);\n        };\n        t.exports = /*#__PURE__*/function () {\n          function _class4(t) {\n            _classCallCheck(this, _class4);\n            if (\"number\" == typeof t && (t = {\n              max: t\n            }), t || (t = {}), t.max && (\"number\" != typeof t.max || t.max < 0)) throw new TypeError(\"max must be a non-negative number\");\n            this[i] = t.max || 1 / 0;\n            var e = t.length || g;\n            if (this[o] = \"function\" != typeof e ? g : e, this[a] = t.stale || !1, t.maxAge && \"number\" != typeof t.maxAge) throw new TypeError(\"maxAge must be a number\");\n            this[l] = t.maxAge || 0, this[h] = t.dispose, this[u] = t.noDisposeOnSet || !1, this[d] = t.updateAgeOnGet || !1, this.reset();\n          }\n          _createClass(_class4, [{\n            key: \"max\",\n            get: function get() {\n              return this[i];\n            },\n            set: function set(t) {\n              if (\"number\" != typeof t || t < 0) throw new TypeError(\"max must be a non-negative number\");\n              this[i] = t || 1 / 0, _(this);\n            }\n          }, {\n            key: \"allowStale\",\n            get: function get() {\n              return this[a];\n            },\n            set: function set(t) {\n              this[a] = !!t;\n            }\n          }, {\n            key: \"maxAge\",\n            get: function get() {\n              return this[l];\n            },\n            set: function set(t) {\n              if (\"number\" != typeof t) throw new TypeError(\"maxAge must be a non-negative number\");\n              this[l] = t, _(this);\n            }\n          }, {\n            key: \"lengthCalculator\",\n            get: function get() {\n              return this[o];\n            },\n            set: function set(t) {\n              var _this8 = this;\n              \"function\" != typeof t && (t = g), t !== this[o] && (this[o] = t, this[s] = 0, this[f].forEach(function (t) {\n                t.length = _this8[o](t.value, t.key), _this8[s] += t.length;\n              })), _(this);\n            }\n          }, {\n            key: \"length\",\n            get: function get() {\n              return this[s];\n            }\n          }, {\n            key: \"itemCount\",\n            get: function get() {\n              return this[f].length;\n            }\n          }, {\n            key: \"rforEach\",\n            value: function rforEach(t, e) {\n              e = e || this;\n              for (var _n14 = this[f].tail; null !== _n14;) {\n                var _r17 = _n14.prev;\n                y(this, t, _n14, e), _n14 = _r17;\n              }\n            }\n          }, {\n            key: \"forEach\",\n            value: function forEach(t, e) {\n              e = e || this;\n              for (var _n15 = this[f].head; null !== _n15;) {\n                var _r18 = _n15.next;\n                y(this, t, _n15, e), _n15 = _r18;\n              }\n            }\n          }, {\n            key: \"keys\",\n            value: function keys() {\n              return this[f].toArray().map(function (t) {\n                return t.key;\n              });\n            }\n          }, {\n            key: \"values\",\n            value: function values() {\n              return this[f].toArray().map(function (t) {\n                return t.value;\n              });\n            }\n          }, {\n            key: \"reset\",\n            value: function reset() {\n              var _this9 = this;\n              this[h] && this[f] && this[f].length && this[f].forEach(function (t) {\n                return _this9[h](t.key, t.value);\n              }), this[c] = new Map(), this[f] = new r(), this[s] = 0;\n            }\n          }, {\n            key: \"dump\",\n            value: function dump() {\n              var _this10 = this;\n              return this[f].map(function (t) {\n                return !m(_this10, t) && {\n                  k: t.key,\n                  v: t.value,\n                  e: t.now + (t.maxAge || 0)\n                };\n              }).toArray().filter(function (t) {\n                return t;\n              });\n            }\n          }, {\n            key: \"dumpLru\",\n            value: function dumpLru() {\n              return this[f];\n            }\n          }, {\n            key: \"set\",\n            value: function set(t, e, n) {\n              if ((n = n || this[l]) && \"number\" != typeof n) throw new TypeError(\"maxAge must be a number\");\n              var r = n ? Date.now() : 0,\n                a = this[o](e, t);\n              if (this[c].has(t)) {\n                if (a > this[i]) return b(this, this[c].get(t)), !1;\n                var _o9 = this[c].get(t).value;\n                return this[h] && (this[u] || this[h](t, _o9.value)), _o9.now = r, _o9.maxAge = n, _o9.value = e, this[s] += a - _o9.length, _o9.length = a, this.get(t), _(this), !0;\n              }\n              var d = new w(t, e, a, r, n);\n              return d.length > this[i] ? (this[h] && this[h](t, e), !1) : (this[s] += d.length, this[f].unshift(d), this[c].set(t, this[f].head), _(this), !0);\n            }\n          }, {\n            key: \"has\",\n            value: function has(t) {\n              if (!this[c].has(t)) return !1;\n              var e = this[c].get(t).value;\n              return !m(this, e);\n            }\n          }, {\n            key: \"get\",\n            value: function get(t) {\n              return p(this, t, !0);\n            }\n          }, {\n            key: \"peek\",\n            value: function peek(t) {\n              return p(this, t, !1);\n            }\n          }, {\n            key: \"pop\",\n            value: function pop() {\n              var t = this[f].tail;\n              return t ? (b(this, t), t.value) : null;\n            }\n          }, {\n            key: \"del\",\n            value: function del(t) {\n              b(this, this[c].get(t));\n            }\n          }, {\n            key: \"load\",\n            value: function load(t) {\n              this.reset();\n              var e = Date.now();\n              for (var _n16 = t.length - 1; _n16 >= 0; _n16--) {\n                var _r19 = t[_n16],\n                  _i13 = _r19.e || 0;\n                if (0 === _i13) this.set(_r19.k, _r19.v);else {\n                  var _t15 = _i13 - e;\n                  _t15 > 0 && this.set(_r19.k, _r19.v, _t15);\n                }\n              }\n            }\n          }, {\n            key: \"prune\",\n            value: function prune() {\n              var _this11 = this;\n              this[c].forEach(function (t, e) {\n                return p(_this11, e, !1);\n              });\n            }\n          }]);\n          return _class4;\n        }();\n      },\n      9591: function _(t, e, n) {\n        \"use strict\";\n\n        var r = {};\n        (0, n(4236).assign)(r, n(4555), n(8843), n(1619)), t.exports = r;\n      },\n      4555: function _(t, e, n) {\n        \"use strict\";\n\n        var r = n(405),\n          i = n(4236),\n          s = n(9373),\n          o = n(8898),\n          a = n(2292),\n          l = Object.prototype.toString,\n          h = 0,\n          u = -1,\n          f = 0,\n          c = 8;\n        function d(t) {\n          if (!(this instanceof d)) return new d(t);\n          this.options = i.assign({\n            level: u,\n            method: c,\n            chunkSize: 16384,\n            windowBits: 15,\n            memLevel: 8,\n            strategy: f,\n            to: \"\"\n          }, t || {});\n          var e = this.options;\n          e.raw && e.windowBits > 0 ? e.windowBits = -e.windowBits : e.gzip && e.windowBits > 0 && e.windowBits < 16 && (e.windowBits += 16), this.err = 0, this.msg = \"\", this.ended = !1, this.chunks = [], this.strm = new a(), this.strm.avail_out = 0;\n          var n = r.deflateInit2(this.strm, e.level, e.method, e.windowBits, e.memLevel, e.strategy);\n          if (n !== h) throw new Error(o[n]);\n          if (e.header && r.deflateSetHeader(this.strm, e.header), e.dictionary) {\n            var g;\n            if (g = \"string\" == typeof e.dictionary ? s.string2buf(e.dictionary) : \"[object ArrayBuffer]\" === l.call(e.dictionary) ? new Uint8Array(e.dictionary) : e.dictionary, (n = r.deflateSetDictionary(this.strm, g)) !== h) throw new Error(o[n]);\n            this._dict_set = !0;\n          }\n        }\n        function g(t, e) {\n          var n = new d(e);\n          if (n.push(t, !0), n.err) throw n.msg || o[n.err];\n          return n.result;\n        }\n        d.prototype.push = function (t, e) {\n          var n,\n            o,\n            a = this.strm,\n            u = this.options.chunkSize;\n          if (this.ended) return !1;\n          o = e === ~~e ? e : !0 === e ? 4 : 0, \"string\" == typeof t ? a.input = s.string2buf(t) : \"[object ArrayBuffer]\" === l.call(t) ? a.input = new Uint8Array(t) : a.input = t, a.next_in = 0, a.avail_in = a.input.length;\n          do {\n            if (0 === a.avail_out && (a.output = new i.Buf8(u), a.next_out = 0, a.avail_out = u), 1 !== (n = r.deflate(a, o)) && n !== h) return this.onEnd(n), this.ended = !0, !1;\n            0 !== a.avail_out && (0 !== a.avail_in || 4 !== o && 2 !== o) || (\"string\" === this.options.to ? this.onData(s.buf2binstring(i.shrinkBuf(a.output, a.next_out))) : this.onData(i.shrinkBuf(a.output, a.next_out)));\n          } while ((a.avail_in > 0 || 0 === a.avail_out) && 1 !== n);\n          return 4 === o ? (n = r.deflateEnd(this.strm), this.onEnd(n), this.ended = !0, n === h) : 2 !== o || (this.onEnd(h), a.avail_out = 0, !0);\n        }, d.prototype.onData = function (t) {\n          this.chunks.push(t);\n        }, d.prototype.onEnd = function (t) {\n          t === h && (\"string\" === this.options.to ? this.result = this.chunks.join(\"\") : this.result = i.flattenChunks(this.chunks)), this.chunks = [], this.err = t, this.msg = this.strm.msg;\n        }, e.Deflate = d, e.deflate = g, e.deflateRaw = function (t, e) {\n          return (e = e || {}).raw = !0, g(t, e);\n        }, e.gzip = function (t, e) {\n          return (e = e || {}).gzip = !0, g(t, e);\n        };\n      },\n      8843: function _(t, e, n) {\n        \"use strict\";\n\n        var r = n(7948),\n          i = n(4236),\n          s = n(9373),\n          o = n(1619),\n          a = n(8898),\n          l = n(2292),\n          h = n(2401),\n          u = Object.prototype.toString;\n        function f(t) {\n          if (!(this instanceof f)) return new f(t);\n          this.options = i.assign({\n            chunkSize: 16384,\n            windowBits: 0,\n            to: \"\"\n          }, t || {});\n          var e = this.options;\n          e.raw && e.windowBits >= 0 && e.windowBits < 16 && (e.windowBits = -e.windowBits, 0 === e.windowBits && (e.windowBits = -15)), !(e.windowBits >= 0 && e.windowBits < 16) || t && t.windowBits || (e.windowBits += 32), e.windowBits > 15 && e.windowBits < 48 && 0 == (15 & e.windowBits) && (e.windowBits |= 15), this.err = 0, this.msg = \"\", this.ended = !1, this.chunks = [], this.strm = new l(), this.strm.avail_out = 0;\n          var n = r.inflateInit2(this.strm, e.windowBits);\n          if (n !== o.Z_OK) throw new Error(a[n]);\n          if (this.header = new h(), r.inflateGetHeader(this.strm, this.header), e.dictionary && (\"string\" == typeof e.dictionary ? e.dictionary = s.string2buf(e.dictionary) : \"[object ArrayBuffer]\" === u.call(e.dictionary) && (e.dictionary = new Uint8Array(e.dictionary)), e.raw && (n = r.inflateSetDictionary(this.strm, e.dictionary)) !== o.Z_OK)) throw new Error(a[n]);\n        }\n        function c(t, e) {\n          var n = new f(e);\n          if (n.push(t, !0), n.err) throw n.msg || a[n.err];\n          return n.result;\n        }\n        f.prototype.push = function (t, e) {\n          var n,\n            a,\n            l,\n            h,\n            f,\n            c = this.strm,\n            d = this.options.chunkSize,\n            g = this.options.dictionary,\n            p = !1;\n          if (this.ended) return !1;\n          a = e === ~~e ? e : !0 === e ? o.Z_FINISH : o.Z_NO_FLUSH, \"string\" == typeof t ? c.input = s.binstring2buf(t) : \"[object ArrayBuffer]\" === u.call(t) ? c.input = new Uint8Array(t) : c.input = t, c.next_in = 0, c.avail_in = c.input.length;\n          do {\n            if (0 === c.avail_out && (c.output = new i.Buf8(d), c.next_out = 0, c.avail_out = d), (n = r.inflate(c, o.Z_NO_FLUSH)) === o.Z_NEED_DICT && g && (n = r.inflateSetDictionary(this.strm, g)), n === o.Z_BUF_ERROR && !0 === p && (n = o.Z_OK, p = !1), n !== o.Z_STREAM_END && n !== o.Z_OK) return this.onEnd(n), this.ended = !0, !1;\n            c.next_out && (0 !== c.avail_out && n !== o.Z_STREAM_END && (0 !== c.avail_in || a !== o.Z_FINISH && a !== o.Z_SYNC_FLUSH) || (\"string\" === this.options.to ? (l = s.utf8border(c.output, c.next_out), h = c.next_out - l, f = s.buf2string(c.output, l), c.next_out = h, c.avail_out = d - h, h && i.arraySet(c.output, c.output, l, h, 0), this.onData(f)) : this.onData(i.shrinkBuf(c.output, c.next_out)))), 0 === c.avail_in && 0 === c.avail_out && (p = !0);\n          } while ((c.avail_in > 0 || 0 === c.avail_out) && n !== o.Z_STREAM_END);\n          return n === o.Z_STREAM_END && (a = o.Z_FINISH), a === o.Z_FINISH ? (n = r.inflateEnd(this.strm), this.onEnd(n), this.ended = !0, n === o.Z_OK) : a !== o.Z_SYNC_FLUSH || (this.onEnd(o.Z_OK), c.avail_out = 0, !0);\n        }, f.prototype.onData = function (t) {\n          this.chunks.push(t);\n        }, f.prototype.onEnd = function (t) {\n          t === o.Z_OK && (\"string\" === this.options.to ? this.result = this.chunks.join(\"\") : this.result = i.flattenChunks(this.chunks)), this.chunks = [], this.err = t, this.msg = this.strm.msg;\n        }, e.Inflate = f, e.inflate = c, e.inflateRaw = function (t, e) {\n          return (e = e || {}).raw = !0, c(t, e);\n        }, e.ungzip = c;\n      },\n      4236: function _(t, e) {\n        \"use strict\";\n\n        var n = \"undefined\" != typeof Uint8Array && \"undefined\" != typeof Uint16Array && \"undefined\" != typeof Int32Array;\n        function r(t, e) {\n          return Object.prototype.hasOwnProperty.call(t, e);\n        }\n        e.assign = function (t) {\n          for (var e = Array.prototype.slice.call(arguments, 1); e.length;) {\n            var n = e.shift();\n            if (n) {\n              if (\"object\" != _typeof(n)) throw new TypeError(n + \"must be non-object\");\n              for (var i in n) r(n, i) && (t[i] = n[i]);\n            }\n          }\n          return t;\n        }, e.shrinkBuf = function (t, e) {\n          return t.length === e ? t : t.subarray ? t.subarray(0, e) : (t.length = e, t);\n        };\n        var i = {\n            arraySet: function arraySet(t, e, n, r, i) {\n              if (e.subarray && t.subarray) t.set(e.subarray(n, n + r), i);else for (var s = 0; s < r; s++) t[i + s] = e[n + s];\n            },\n            flattenChunks: function flattenChunks(t) {\n              var e, n, r, i, s, o;\n              for (r = 0, e = 0, n = t.length; e < n; e++) r += t[e].length;\n              for (o = new Uint8Array(r), i = 0, e = 0, n = t.length; e < n; e++) s = t[e], o.set(s, i), i += s.length;\n              return o;\n            }\n          },\n          s = {\n            arraySet: function arraySet(t, e, n, r, i) {\n              for (var s = 0; s < r; s++) t[i + s] = e[n + s];\n            },\n            flattenChunks: function flattenChunks(t) {\n              return [].concat.apply([], t);\n            }\n          };\n        e.setTyped = function (t) {\n          t ? (e.Buf8 = Uint8Array, e.Buf16 = Uint16Array, e.Buf32 = Int32Array, e.assign(e, i)) : (e.Buf8 = Array, e.Buf16 = Array, e.Buf32 = Array, e.assign(e, s));\n        }, e.setTyped(n);\n      },\n      9373: function _(t, e, n) {\n        \"use strict\";\n\n        var r = n(4236),\n          i = !0,\n          s = !0;\n        try {\n          String.fromCharCode.apply(null, [0]);\n        } catch (t) {\n          i = !1;\n        }\n        try {\n          String.fromCharCode.apply(null, new Uint8Array(1));\n        } catch (t) {\n          s = !1;\n        }\n        for (var o = new r.Buf8(256), a = 0; a < 256; a++) o[a] = a >= 252 ? 6 : a >= 248 ? 5 : a >= 240 ? 4 : a >= 224 ? 3 : a >= 192 ? 2 : 1;\n        function l(t, e) {\n          if (e < 65534 && (t.subarray && s || !t.subarray && i)) return String.fromCharCode.apply(null, r.shrinkBuf(t, e));\n          for (var n = \"\", o = 0; o < e; o++) n += String.fromCharCode(t[o]);\n          return n;\n        }\n        o[254] = o[254] = 1, e.string2buf = function (t) {\n          var e,\n            n,\n            i,\n            s,\n            o,\n            a = t.length,\n            l = 0;\n          for (s = 0; s < a; s++) 55296 == (64512 & (n = t.charCodeAt(s))) && s + 1 < a && 56320 == (64512 & (i = t.charCodeAt(s + 1))) && (n = 65536 + (n - 55296 << 10) + (i - 56320), s++), l += n < 128 ? 1 : n < 2048 ? 2 : n < 65536 ? 3 : 4;\n          for (e = new r.Buf8(l), o = 0, s = 0; o < l; s++) 55296 == (64512 & (n = t.charCodeAt(s))) && s + 1 < a && 56320 == (64512 & (i = t.charCodeAt(s + 1))) && (n = 65536 + (n - 55296 << 10) + (i - 56320), s++), n < 128 ? e[o++] = n : n < 2048 ? (e[o++] = 192 | n >>> 6, e[o++] = 128 | 63 & n) : n < 65536 ? (e[o++] = 224 | n >>> 12, e[o++] = 128 | n >>> 6 & 63, e[o++] = 128 | 63 & n) : (e[o++] = 240 | n >>> 18, e[o++] = 128 | n >>> 12 & 63, e[o++] = 128 | n >>> 6 & 63, e[o++] = 128 | 63 & n);\n          return e;\n        }, e.buf2binstring = function (t) {\n          return l(t, t.length);\n        }, e.binstring2buf = function (t) {\n          for (var e = new r.Buf8(t.length), n = 0, i = e.length; n < i; n++) e[n] = t.charCodeAt(n);\n          return e;\n        }, e.buf2string = function (t, e) {\n          var n,\n            r,\n            i,\n            s,\n            a = e || t.length,\n            h = new Array(2 * a);\n          for (r = 0, n = 0; n < a;) if ((i = t[n++]) < 128) h[r++] = i;else if ((s = o[i]) > 4) h[r++] = 65533, n += s - 1;else {\n            for (i &= 2 === s ? 31 : 3 === s ? 15 : 7; s > 1 && n < a;) i = i << 6 | 63 & t[n++], s--;\n            s > 1 ? h[r++] = 65533 : i < 65536 ? h[r++] = i : (i -= 65536, h[r++] = 55296 | i >> 10 & 1023, h[r++] = 56320 | 1023 & i);\n          }\n          return l(h, r);\n        }, e.utf8border = function (t, e) {\n          var n;\n          for ((e = e || t.length) > t.length && (e = t.length), n = e - 1; n >= 0 && 128 == (192 & t[n]);) n--;\n          return n < 0 || 0 === n ? e : n + o[t[n]] > e ? n : e;\n        };\n      },\n      6069: function _(t) {\n        \"use strict\";\n\n        t.exports = function (t, e, n, r) {\n          for (var i = 65535 & t | 0, s = t >>> 16 & 65535 | 0, o = 0; 0 !== n;) {\n            n -= o = n > 2e3 ? 2e3 : n;\n            do {\n              s = s + (i = i + e[r++] | 0) | 0;\n            } while (--o);\n            i %= 65521, s %= 65521;\n          }\n          return i | s << 16 | 0;\n        };\n      },\n      1619: function _(t) {\n        \"use strict\";\n\n        t.exports = {\n          Z_NO_FLUSH: 0,\n          Z_PARTIAL_FLUSH: 1,\n          Z_SYNC_FLUSH: 2,\n          Z_FULL_FLUSH: 3,\n          Z_FINISH: 4,\n          Z_BLOCK: 5,\n          Z_TREES: 6,\n          Z_OK: 0,\n          Z_STREAM_END: 1,\n          Z_NEED_DICT: 2,\n          Z_ERRNO: -1,\n          Z_STREAM_ERROR: -2,\n          Z_DATA_ERROR: -3,\n          Z_BUF_ERROR: -5,\n          Z_NO_COMPRESSION: 0,\n          Z_BEST_SPEED: 1,\n          Z_BEST_COMPRESSION: 9,\n          Z_DEFAULT_COMPRESSION: -1,\n          Z_FILTERED: 1,\n          Z_HUFFMAN_ONLY: 2,\n          Z_RLE: 3,\n          Z_FIXED: 4,\n          Z_DEFAULT_STRATEGY: 0,\n          Z_BINARY: 0,\n          Z_TEXT: 1,\n          Z_UNKNOWN: 2,\n          Z_DEFLATED: 8\n        };\n      },\n      2869: function _(t) {\n        \"use strict\";\n\n        var e = function () {\n          for (var t, e = [], n = 0; n < 256; n++) {\n            t = n;\n            for (var r = 0; r < 8; r++) t = 1 & t ? 3988292384 ^ t >>> 1 : t >>> 1;\n            e[n] = t;\n          }\n          return e;\n        }();\n        t.exports = function (t, n, r, i) {\n          var s = e,\n            o = i + r;\n          t ^= -1;\n          for (var a = i; a < o; a++) t = t >>> 8 ^ s[255 & (t ^ n[a])];\n          return -1 ^ t;\n        };\n      },\n      405: function _(t, e, n) {\n        \"use strict\";\n\n        var r,\n          i = n(4236),\n          s = n(342),\n          o = n(6069),\n          a = n(2869),\n          l = n(8898),\n          h = 0,\n          u = 0,\n          f = -2,\n          c = 2,\n          d = 8,\n          g = 286,\n          p = 30,\n          m = 19,\n          _ = 2 * g + 1,\n          b = 15,\n          w = 3,\n          y = 258,\n          v = y + w + 1,\n          k = 42,\n          x = 103,\n          E = 113,\n          A = 666;\n        function B(t, e) {\n          return t.msg = l[e], e;\n        }\n        function S(t) {\n          return (t << 1) - (t > 4 ? 9 : 0);\n        }\n        function I(t) {\n          for (var e = t.length; --e >= 0;) t[e] = 0;\n        }\n        function M(t) {\n          var e = t.state,\n            n = e.pending;\n          n > t.avail_out && (n = t.avail_out), 0 !== n && (i.arraySet(t.output, e.pending_buf, e.pending_out, n, t.next_out), t.next_out += n, e.pending_out += n, t.total_out += n, t.avail_out -= n, e.pending -= n, 0 === e.pending && (e.pending_out = 0));\n        }\n        function T(t, e) {\n          s._tr_flush_block(t, t.block_start >= 0 ? t.block_start : -1, t.strstart - t.block_start, e), t.block_start = t.strstart, M(t.strm);\n        }\n        function z(t, e) {\n          t.pending_buf[t.pending++] = e;\n        }\n        function O(t, e) {\n          t.pending_buf[t.pending++] = e >>> 8 & 255, t.pending_buf[t.pending++] = 255 & e;\n        }\n        function C(t, e) {\n          var n,\n            r,\n            i = t.max_chain_length,\n            s = t.strstart,\n            o = t.prev_length,\n            a = t.nice_match,\n            l = t.strstart > t.w_size - v ? t.strstart - (t.w_size - v) : 0,\n            h = t.window,\n            u = t.w_mask,\n            f = t.prev,\n            c = t.strstart + y,\n            d = h[s + o - 1],\n            g = h[s + o];\n          t.prev_length >= t.good_match && (i >>= 2), a > t.lookahead && (a = t.lookahead);\n          do {\n            if (h[(n = e) + o] === g && h[n + o - 1] === d && h[n] === h[s] && h[++n] === h[s + 1]) {\n              s += 2, n++;\n              do {} while (h[++s] === h[++n] && h[++s] === h[++n] && h[++s] === h[++n] && h[++s] === h[++n] && h[++s] === h[++n] && h[++s] === h[++n] && h[++s] === h[++n] && h[++s] === h[++n] && s < c);\n              if (r = y - (c - s), s = c - y, r > o) {\n                if (t.match_start = e, o = r, r >= a) break;\n                d = h[s + o - 1], g = h[s + o];\n              }\n            }\n          } while ((e = f[e & u]) > l && 0 != --i);\n          return o <= t.lookahead ? o : t.lookahead;\n        }\n        function R(t) {\n          var e,\n            n,\n            r,\n            s,\n            l,\n            h,\n            u,\n            f,\n            c,\n            d,\n            g = t.w_size;\n          do {\n            if (s = t.window_size - t.lookahead - t.strstart, t.strstart >= g + (g - v)) {\n              i.arraySet(t.window, t.window, g, g, 0), t.match_start -= g, t.strstart -= g, t.block_start -= g, e = n = t.hash_size;\n              do {\n                r = t.head[--e], t.head[e] = r >= g ? r - g : 0;\n              } while (--n);\n              e = n = g;\n              do {\n                r = t.prev[--e], t.prev[e] = r >= g ? r - g : 0;\n              } while (--n);\n              s += g;\n            }\n            if (0 === t.strm.avail_in) break;\n            if (h = t.strm, u = t.window, f = t.strstart + t.lookahead, c = s, d = void 0, (d = h.avail_in) > c && (d = c), n = 0 === d ? 0 : (h.avail_in -= d, i.arraySet(u, h.input, h.next_in, d, f), 1 === h.state.wrap ? h.adler = o(h.adler, u, d, f) : 2 === h.state.wrap && (h.adler = a(h.adler, u, d, f)), h.next_in += d, h.total_in += d, d), t.lookahead += n, t.lookahead + t.insert >= w) for (l = t.strstart - t.insert, t.ins_h = t.window[l], t.ins_h = (t.ins_h << t.hash_shift ^ t.window[l + 1]) & t.hash_mask; t.insert && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[l + w - 1]) & t.hash_mask, t.prev[l & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = l, l++, t.insert--, !(t.lookahead + t.insert < w)););\n          } while (t.lookahead < v && 0 !== t.strm.avail_in);\n        }\n        function N(t, e) {\n          for (var n, r;;) {\n            if (t.lookahead < v) {\n              if (R(t), t.lookahead < v && e === h) return 1;\n              if (0 === t.lookahead) break;\n            }\n            if (n = 0, t.lookahead >= w && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + w - 1]) & t.hash_mask, n = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart), 0 !== n && t.strstart - n <= t.w_size - v && (t.match_length = C(t, n)), t.match_length >= w) {\n              if (r = s._tr_tally(t, t.strstart - t.match_start, t.match_length - w), t.lookahead -= t.match_length, t.match_length <= t.max_lazy_match && t.lookahead >= w) {\n                t.match_length--;\n                do {\n                  t.strstart++, t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + w - 1]) & t.hash_mask, n = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart;\n                } while (0 != --t.match_length);\n                t.strstart++;\n              } else t.strstart += t.match_length, t.match_length = 0, t.ins_h = t.window[t.strstart], t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + 1]) & t.hash_mask;\n            } else r = s._tr_tally(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++;\n            if (r && (T(t, !1), 0 === t.strm.avail_out)) return 1;\n          }\n          return t.insert = t.strstart < w - 1 ? t.strstart : w - 1, 4 === e ? (T(t, !0), 0 === t.strm.avail_out ? 3 : 4) : t.last_lit && (T(t, !1), 0 === t.strm.avail_out) ? 1 : 2;\n        }\n        function L(t, e) {\n          for (var n, r, i;;) {\n            if (t.lookahead < v) {\n              if (R(t), t.lookahead < v && e === h) return 1;\n              if (0 === t.lookahead) break;\n            }\n            if (n = 0, t.lookahead >= w && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + w - 1]) & t.hash_mask, n = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart), t.prev_length = t.match_length, t.prev_match = t.match_start, t.match_length = w - 1, 0 !== n && t.prev_length < t.max_lazy_match && t.strstart - n <= t.w_size - v && (t.match_length = C(t, n), t.match_length <= 5 && (1 === t.strategy || t.match_length === w && t.strstart - t.match_start > 4096) && (t.match_length = w - 1)), t.prev_length >= w && t.match_length <= t.prev_length) {\n              i = t.strstart + t.lookahead - w, r = s._tr_tally(t, t.strstart - 1 - t.prev_match, t.prev_length - w), t.lookahead -= t.prev_length - 1, t.prev_length -= 2;\n              do {\n                ++t.strstart <= i && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + w - 1]) & t.hash_mask, n = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart);\n              } while (0 != --t.prev_length);\n              if (t.match_available = 0, t.match_length = w - 1, t.strstart++, r && (T(t, !1), 0 === t.strm.avail_out)) return 1;\n            } else if (t.match_available) {\n              if ((r = s._tr_tally(t, 0, t.window[t.strstart - 1])) && T(t, !1), t.strstart++, t.lookahead--, 0 === t.strm.avail_out) return 1;\n            } else t.match_available = 1, t.strstart++, t.lookahead--;\n          }\n          return t.match_available && (r = s._tr_tally(t, 0, t.window[t.strstart - 1]), t.match_available = 0), t.insert = t.strstart < w - 1 ? t.strstart : w - 1, 4 === e ? (T(t, !0), 0 === t.strm.avail_out ? 3 : 4) : t.last_lit && (T(t, !1), 0 === t.strm.avail_out) ? 1 : 2;\n        }\n        function U(t, e, n, r, i) {\n          this.good_length = t, this.max_lazy = e, this.nice_length = n, this.max_chain = r, this.func = i;\n        }\n        function P() {\n          this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = d, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new i.Buf16(2 * _), this.dyn_dtree = new i.Buf16(2 * (2 * p + 1)), this.bl_tree = new i.Buf16(2 * (2 * m + 1)), I(this.dyn_ltree), I(this.dyn_dtree), I(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new i.Buf16(b + 1), this.heap = new i.Buf16(2 * g + 1), I(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new i.Buf16(2 * g + 1), I(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;\n        }\n        function $(t) {\n          var e;\n          return t && t.state ? (t.total_in = t.total_out = 0, t.data_type = c, (e = t.state).pending = 0, e.pending_out = 0, e.wrap < 0 && (e.wrap = -e.wrap), e.status = e.wrap ? k : E, t.adler = 2 === e.wrap ? 0 : 1, e.last_flush = h, s._tr_init(e), u) : B(t, f);\n        }\n        function j(t) {\n          var e,\n            n = $(t);\n          return n === u && ((e = t.state).window_size = 2 * e.w_size, I(e.head), e.max_lazy_match = r[e.level].max_lazy, e.good_match = r[e.level].good_length, e.nice_match = r[e.level].nice_length, e.max_chain_length = r[e.level].max_chain, e.strstart = 0, e.block_start = 0, e.lookahead = 0, e.insert = 0, e.match_length = e.prev_length = w - 1, e.match_available = 0, e.ins_h = 0), n;\n        }\n        function F(t, e, n, r, s, o) {\n          if (!t) return f;\n          var a = 1;\n          if (-1 === e && (e = 6), r < 0 ? (a = 0, r = -r) : r > 15 && (a = 2, r -= 16), s < 1 || s > 9 || n !== d || r < 8 || r > 15 || e < 0 || e > 9 || o < 0 || o > 4) return B(t, f);\n          8 === r && (r = 9);\n          var l = new P();\n          return t.state = l, l.strm = t, l.wrap = a, l.gzhead = null, l.w_bits = r, l.w_size = 1 << l.w_bits, l.w_mask = l.w_size - 1, l.hash_bits = s + 7, l.hash_size = 1 << l.hash_bits, l.hash_mask = l.hash_size - 1, l.hash_shift = ~~((l.hash_bits + w - 1) / w), l.window = new i.Buf8(2 * l.w_size), l.head = new i.Buf16(l.hash_size), l.prev = new i.Buf16(l.w_size), l.lit_bufsize = 1 << s + 6, l.pending_buf_size = 4 * l.lit_bufsize, l.pending_buf = new i.Buf8(l.pending_buf_size), l.d_buf = 1 * l.lit_bufsize, l.l_buf = 3 * l.lit_bufsize, l.level = e, l.strategy = o, l.method = n, j(t);\n        }\n        r = [new U(0, 0, 0, 0, function (t, e) {\n          var n = 65535;\n          for (n > t.pending_buf_size - 5 && (n = t.pending_buf_size - 5);;) {\n            if (t.lookahead <= 1) {\n              if (R(t), 0 === t.lookahead && e === h) return 1;\n              if (0 === t.lookahead) break;\n            }\n            t.strstart += t.lookahead, t.lookahead = 0;\n            var r = t.block_start + n;\n            if ((0 === t.strstart || t.strstart >= r) && (t.lookahead = t.strstart - r, t.strstart = r, T(t, !1), 0 === t.strm.avail_out)) return 1;\n            if (t.strstart - t.block_start >= t.w_size - v && (T(t, !1), 0 === t.strm.avail_out)) return 1;\n          }\n          return t.insert = 0, 4 === e ? (T(t, !0), 0 === t.strm.avail_out ? 3 : 4) : (t.strstart > t.block_start && (T(t, !1), t.strm.avail_out), 1);\n        }), new U(4, 4, 8, 4, N), new U(4, 5, 16, 8, N), new U(4, 6, 32, 32, N), new U(4, 4, 16, 16, L), new U(8, 16, 32, 32, L), new U(8, 16, 128, 128, L), new U(8, 32, 128, 256, L), new U(32, 128, 258, 1024, L), new U(32, 258, 258, 4096, L)], e.deflateInit = function (t, e) {\n          return F(t, e, d, 15, 8, 0);\n        }, e.deflateInit2 = F, e.deflateReset = j, e.deflateResetKeep = $, e.deflateSetHeader = function (t, e) {\n          return t && t.state ? 2 !== t.state.wrap ? f : (t.state.gzhead = e, u) : f;\n        }, e.deflate = function (t, e) {\n          var n, i, o, l;\n          if (!t || !t.state || e > 5 || e < 0) return t ? B(t, f) : f;\n          if (i = t.state, !t.output || !t.input && 0 !== t.avail_in || i.status === A && 4 !== e) return B(t, 0 === t.avail_out ? -5 : f);\n          if (i.strm = t, n = i.last_flush, i.last_flush = e, i.status === k) if (2 === i.wrap) t.adler = 0, z(i, 31), z(i, 139), z(i, 8), i.gzhead ? (z(i, (i.gzhead.text ? 1 : 0) + (i.gzhead.hcrc ? 2 : 0) + (i.gzhead.extra ? 4 : 0) + (i.gzhead.name ? 8 : 0) + (i.gzhead.comment ? 16 : 0)), z(i, 255 & i.gzhead.time), z(i, i.gzhead.time >> 8 & 255), z(i, i.gzhead.time >> 16 & 255), z(i, i.gzhead.time >> 24 & 255), z(i, 9 === i.level ? 2 : i.strategy >= 2 || i.level < 2 ? 4 : 0), z(i, 255 & i.gzhead.os), i.gzhead.extra && i.gzhead.extra.length && (z(i, 255 & i.gzhead.extra.length), z(i, i.gzhead.extra.length >> 8 & 255)), i.gzhead.hcrc && (t.adler = a(t.adler, i.pending_buf, i.pending, 0)), i.gzindex = 0, i.status = 69) : (z(i, 0), z(i, 0), z(i, 0), z(i, 0), z(i, 0), z(i, 9 === i.level ? 2 : i.strategy >= 2 || i.level < 2 ? 4 : 0), z(i, 3), i.status = E);else {\n            var c = d + (i.w_bits - 8 << 4) << 8;\n            c |= (i.strategy >= 2 || i.level < 2 ? 0 : i.level < 6 ? 1 : 6 === i.level ? 2 : 3) << 6, 0 !== i.strstart && (c |= 32), c += 31 - c % 31, i.status = E, O(i, c), 0 !== i.strstart && (O(i, t.adler >>> 16), O(i, 65535 & t.adler)), t.adler = 1;\n          }\n          if (69 === i.status) if (i.gzhead.extra) {\n            for (o = i.pending; i.gzindex < (65535 & i.gzhead.extra.length) && (i.pending !== i.pending_buf_size || (i.gzhead.hcrc && i.pending > o && (t.adler = a(t.adler, i.pending_buf, i.pending - o, o)), M(t), o = i.pending, i.pending !== i.pending_buf_size));) z(i, 255 & i.gzhead.extra[i.gzindex]), i.gzindex++;\n            i.gzhead.hcrc && i.pending > o && (t.adler = a(t.adler, i.pending_buf, i.pending - o, o)), i.gzindex === i.gzhead.extra.length && (i.gzindex = 0, i.status = 73);\n          } else i.status = 73;\n          if (73 === i.status) if (i.gzhead.name) {\n            o = i.pending;\n            do {\n              if (i.pending === i.pending_buf_size && (i.gzhead.hcrc && i.pending > o && (t.adler = a(t.adler, i.pending_buf, i.pending - o, o)), M(t), o = i.pending, i.pending === i.pending_buf_size)) {\n                l = 1;\n                break;\n              }\n              l = i.gzindex < i.gzhead.name.length ? 255 & i.gzhead.name.charCodeAt(i.gzindex++) : 0, z(i, l);\n            } while (0 !== l);\n            i.gzhead.hcrc && i.pending > o && (t.adler = a(t.adler, i.pending_buf, i.pending - o, o)), 0 === l && (i.gzindex = 0, i.status = 91);\n          } else i.status = 91;\n          if (91 === i.status) if (i.gzhead.comment) {\n            o = i.pending;\n            do {\n              if (i.pending === i.pending_buf_size && (i.gzhead.hcrc && i.pending > o && (t.adler = a(t.adler, i.pending_buf, i.pending - o, o)), M(t), o = i.pending, i.pending === i.pending_buf_size)) {\n                l = 1;\n                break;\n              }\n              l = i.gzindex < i.gzhead.comment.length ? 255 & i.gzhead.comment.charCodeAt(i.gzindex++) : 0, z(i, l);\n            } while (0 !== l);\n            i.gzhead.hcrc && i.pending > o && (t.adler = a(t.adler, i.pending_buf, i.pending - o, o)), 0 === l && (i.status = x);\n          } else i.status = x;\n          if (i.status === x && (i.gzhead.hcrc ? (i.pending + 2 > i.pending_buf_size && M(t), i.pending + 2 <= i.pending_buf_size && (z(i, 255 & t.adler), z(i, t.adler >> 8 & 255), t.adler = 0, i.status = E)) : i.status = E), 0 !== i.pending) {\n            if (M(t), 0 === t.avail_out) return i.last_flush = -1, u;\n          } else if (0 === t.avail_in && S(e) <= S(n) && 4 !== e) return B(t, -5);\n          if (i.status === A && 0 !== t.avail_in) return B(t, -5);\n          if (0 !== t.avail_in || 0 !== i.lookahead || e !== h && i.status !== A) {\n            var g = 2 === i.strategy ? function (t, e) {\n              for (var n;;) {\n                if (0 === t.lookahead && (R(t), 0 === t.lookahead)) {\n                  if (e === h) return 1;\n                  break;\n                }\n                if (t.match_length = 0, n = s._tr_tally(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++, n && (T(t, !1), 0 === t.strm.avail_out)) return 1;\n              }\n              return t.insert = 0, 4 === e ? (T(t, !0), 0 === t.strm.avail_out ? 3 : 4) : t.last_lit && (T(t, !1), 0 === t.strm.avail_out) ? 1 : 2;\n            }(i, e) : 3 === i.strategy ? function (t, e) {\n              for (var n, r, i, o, a = t.window;;) {\n                if (t.lookahead <= y) {\n                  if (R(t), t.lookahead <= y && e === h) return 1;\n                  if (0 === t.lookahead) break;\n                }\n                if (t.match_length = 0, t.lookahead >= w && t.strstart > 0 && (r = a[i = t.strstart - 1]) === a[++i] && r === a[++i] && r === a[++i]) {\n                  o = t.strstart + y;\n                  do {} while (r === a[++i] && r === a[++i] && r === a[++i] && r === a[++i] && r === a[++i] && r === a[++i] && r === a[++i] && r === a[++i] && i < o);\n                  t.match_length = y - (o - i), t.match_length > t.lookahead && (t.match_length = t.lookahead);\n                }\n                if (t.match_length >= w ? (n = s._tr_tally(t, 1, t.match_length - w), t.lookahead -= t.match_length, t.strstart += t.match_length, t.match_length = 0) : (n = s._tr_tally(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++), n && (T(t, !1), 0 === t.strm.avail_out)) return 1;\n              }\n              return t.insert = 0, 4 === e ? (T(t, !0), 0 === t.strm.avail_out ? 3 : 4) : t.last_lit && (T(t, !1), 0 === t.strm.avail_out) ? 1 : 2;\n            }(i, e) : r[i.level].func(i, e);\n            if (3 !== g && 4 !== g || (i.status = A), 1 === g || 3 === g) return 0 === t.avail_out && (i.last_flush = -1), u;\n            if (2 === g && (1 === e ? s._tr_align(i) : 5 !== e && (s._tr_stored_block(i, 0, 0, !1), 3 === e && (I(i.head), 0 === i.lookahead && (i.strstart = 0, i.block_start = 0, i.insert = 0))), M(t), 0 === t.avail_out)) return i.last_flush = -1, u;\n          }\n          return 4 !== e ? u : i.wrap <= 0 ? 1 : (2 === i.wrap ? (z(i, 255 & t.adler), z(i, t.adler >> 8 & 255), z(i, t.adler >> 16 & 255), z(i, t.adler >> 24 & 255), z(i, 255 & t.total_in), z(i, t.total_in >> 8 & 255), z(i, t.total_in >> 16 & 255), z(i, t.total_in >> 24 & 255)) : (O(i, t.adler >>> 16), O(i, 65535 & t.adler)), M(t), i.wrap > 0 && (i.wrap = -i.wrap), 0 !== i.pending ? u : 1);\n        }, e.deflateEnd = function (t) {\n          var e;\n          return t && t.state ? (e = t.state.status) !== k && 69 !== e && 73 !== e && 91 !== e && e !== x && e !== E && e !== A ? B(t, f) : (t.state = null, e === E ? B(t, -3) : u) : f;\n        }, e.deflateSetDictionary = function (t, e) {\n          var n,\n            r,\n            s,\n            a,\n            l,\n            h,\n            c,\n            d,\n            g = e.length;\n          if (!t || !t.state) return f;\n          if (2 === (a = (n = t.state).wrap) || 1 === a && n.status !== k || n.lookahead) return f;\n          for (1 === a && (t.adler = o(t.adler, e, g, 0)), n.wrap = 0, g >= n.w_size && (0 === a && (I(n.head), n.strstart = 0, n.block_start = 0, n.insert = 0), d = new i.Buf8(n.w_size), i.arraySet(d, e, g - n.w_size, n.w_size, 0), e = d, g = n.w_size), l = t.avail_in, h = t.next_in, c = t.input, t.avail_in = g, t.next_in = 0, t.input = e, R(n); n.lookahead >= w;) {\n            r = n.strstart, s = n.lookahead - (w - 1);\n            do {\n              n.ins_h = (n.ins_h << n.hash_shift ^ n.window[r + w - 1]) & n.hash_mask, n.prev[r & n.w_mask] = n.head[n.ins_h], n.head[n.ins_h] = r, r++;\n            } while (--s);\n            n.strstart = r, n.lookahead = w - 1, R(n);\n          }\n          return n.strstart += n.lookahead, n.block_start = n.strstart, n.insert = n.lookahead, n.lookahead = 0, n.match_length = n.prev_length = w - 1, n.match_available = 0, t.next_in = h, t.input = c, t.avail_in = l, n.wrap = a, u;\n        }, e.deflateInfo = \"pako deflate (from Nodeca project)\";\n      },\n      2401: function _(t) {\n        \"use strict\";\n\n        t.exports = function () {\n          this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = \"\", this.comment = \"\", this.hcrc = 0, this.done = !1;\n        };\n      },\n      4264: function _(t) {\n        \"use strict\";\n\n        t.exports = function (t, e) {\n          var n, r, i, s, o, a, l, h, u, f, c, d, g, p, m, _, b, w, y, v, k, x, E, A, B;\n          n = t.state, r = t.next_in, A = t.input, i = r + (t.avail_in - 5), s = t.next_out, B = t.output, o = s - (e - t.avail_out), a = s + (t.avail_out - 257), l = n.dmax, h = n.wsize, u = n.whave, f = n.wnext, c = n.window, d = n.hold, g = n.bits, p = n.lencode, m = n.distcode, _ = (1 << n.lenbits) - 1, b = (1 << n.distbits) - 1;\n          t: do {\n            g < 15 && (d += A[r++] << g, g += 8, d += A[r++] << g, g += 8), w = p[d & _];\n            e: for (;;) {\n              if (d >>>= y = w >>> 24, g -= y, 0 == (y = w >>> 16 & 255)) B[s++] = 65535 & w;else {\n                if (!(16 & y)) {\n                  if (0 == (64 & y)) {\n                    w = p[(65535 & w) + (d & (1 << y) - 1)];\n                    continue e;\n                  }\n                  if (32 & y) {\n                    n.mode = 12;\n                    break t;\n                  }\n                  t.msg = \"invalid literal/length code\", n.mode = 30;\n                  break t;\n                }\n                v = 65535 & w, (y &= 15) && (g < y && (d += A[r++] << g, g += 8), v += d & (1 << y) - 1, d >>>= y, g -= y), g < 15 && (d += A[r++] << g, g += 8, d += A[r++] << g, g += 8), w = m[d & b];\n                n: for (;;) {\n                  if (d >>>= y = w >>> 24, g -= y, !(16 & (y = w >>> 16 & 255))) {\n                    if (0 == (64 & y)) {\n                      w = m[(65535 & w) + (d & (1 << y) - 1)];\n                      continue n;\n                    }\n                    t.msg = \"invalid distance code\", n.mode = 30;\n                    break t;\n                  }\n                  if (k = 65535 & w, g < (y &= 15) && (d += A[r++] << g, (g += 8) < y && (d += A[r++] << g, g += 8)), (k += d & (1 << y) - 1) > l) {\n                    t.msg = \"invalid distance too far back\", n.mode = 30;\n                    break t;\n                  }\n                  if (d >>>= y, g -= y, k > (y = s - o)) {\n                    if ((y = k - y) > u && n.sane) {\n                      t.msg = \"invalid distance too far back\", n.mode = 30;\n                      break t;\n                    }\n                    if (x = 0, E = c, 0 === f) {\n                      if (x += h - y, y < v) {\n                        v -= y;\n                        do {\n                          B[s++] = c[x++];\n                        } while (--y);\n                        x = s - k, E = B;\n                      }\n                    } else if (f < y) {\n                      if (x += h + f - y, (y -= f) < v) {\n                        v -= y;\n                        do {\n                          B[s++] = c[x++];\n                        } while (--y);\n                        if (x = 0, f < v) {\n                          v -= y = f;\n                          do {\n                            B[s++] = c[x++];\n                          } while (--y);\n                          x = s - k, E = B;\n                        }\n                      }\n                    } else if (x += f - y, y < v) {\n                      v -= y;\n                      do {\n                        B[s++] = c[x++];\n                      } while (--y);\n                      x = s - k, E = B;\n                    }\n                    for (; v > 2;) B[s++] = E[x++], B[s++] = E[x++], B[s++] = E[x++], v -= 3;\n                    v && (B[s++] = E[x++], v > 1 && (B[s++] = E[x++]));\n                  } else {\n                    x = s - k;\n                    do {\n                      B[s++] = B[x++], B[s++] = B[x++], B[s++] = B[x++], v -= 3;\n                    } while (v > 2);\n                    v && (B[s++] = B[x++], v > 1 && (B[s++] = B[x++]));\n                  }\n                  break;\n                }\n              }\n              break;\n            }\n          } while (r < i && s < a);\n          r -= v = g >> 3, d &= (1 << (g -= v << 3)) - 1, t.next_in = r, t.next_out = s, t.avail_in = r < i ? i - r + 5 : 5 - (r - i), t.avail_out = s < a ? a - s + 257 : 257 - (s - a), n.hold = d, n.bits = g;\n        };\n      },\n      7948: function _(t, e, n) {\n        \"use strict\";\n\n        var r = n(4236),\n          i = n(6069),\n          s = n(2869),\n          o = n(4264),\n          a = n(9241),\n          l = 0,\n          h = -2,\n          u = 1,\n          f = 12,\n          c = 30,\n          d = 852,\n          g = 592;\n        function p(t) {\n          return (t >>> 24 & 255) + (t >>> 8 & 65280) + ((65280 & t) << 8) + ((255 & t) << 24);\n        }\n        function m() {\n          this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new r.Buf16(320), this.work = new r.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;\n        }\n        function _(t) {\n          var e;\n          return t && t.state ? (e = t.state, t.total_in = t.total_out = e.total = 0, t.msg = \"\", e.wrap && (t.adler = 1 & e.wrap), e.mode = u, e.last = 0, e.havedict = 0, e.dmax = 32768, e.head = null, e.hold = 0, e.bits = 0, e.lencode = e.lendyn = new r.Buf32(d), e.distcode = e.distdyn = new r.Buf32(g), e.sane = 1, e.back = -1, l) : h;\n        }\n        function b(t) {\n          var e;\n          return t && t.state ? ((e = t.state).wsize = 0, e.whave = 0, e.wnext = 0, _(t)) : h;\n        }\n        function w(t, e) {\n          var n, r;\n          return t && t.state ? (r = t.state, e < 0 ? (n = 0, e = -e) : (n = 1 + (e >> 4), e < 48 && (e &= 15)), e && (e < 8 || e > 15) ? h : (null !== r.window && r.wbits !== e && (r.window = null), r.wrap = n, r.wbits = e, b(t))) : h;\n        }\n        function y(t, e) {\n          var n, r;\n          return t ? (r = new m(), t.state = r, r.window = null, (n = w(t, e)) !== l && (t.state = null), n) : h;\n        }\n        var v,\n          k,\n          x = !0;\n        function E(t) {\n          if (x) {\n            var e;\n            for (v = new r.Buf32(512), k = new r.Buf32(32), e = 0; e < 144;) t.lens[e++] = 8;\n            for (; e < 256;) t.lens[e++] = 9;\n            for (; e < 280;) t.lens[e++] = 7;\n            for (; e < 288;) t.lens[e++] = 8;\n            for (a(1, t.lens, 0, 288, v, 0, t.work, {\n              bits: 9\n            }), e = 0; e < 32;) t.lens[e++] = 5;\n            a(2, t.lens, 0, 32, k, 0, t.work, {\n              bits: 5\n            }), x = !1;\n          }\n          t.lencode = v, t.lenbits = 9, t.distcode = k, t.distbits = 5;\n        }\n        function A(t, e, n, i) {\n          var s,\n            o = t.state;\n          return null === o.window && (o.wsize = 1 << o.wbits, o.wnext = 0, o.whave = 0, o.window = new r.Buf8(o.wsize)), i >= o.wsize ? (r.arraySet(o.window, e, n - o.wsize, o.wsize, 0), o.wnext = 0, o.whave = o.wsize) : ((s = o.wsize - o.wnext) > i && (s = i), r.arraySet(o.window, e, n - i, s, o.wnext), (i -= s) ? (r.arraySet(o.window, e, n - i, i, 0), o.wnext = i, o.whave = o.wsize) : (o.wnext += s, o.wnext === o.wsize && (o.wnext = 0), o.whave < o.wsize && (o.whave += s))), 0;\n        }\n        e.inflateReset = b, e.inflateReset2 = w, e.inflateResetKeep = _, e.inflateInit = function (t) {\n          return y(t, 15);\n        }, e.inflateInit2 = y, e.inflate = function (t, e) {\n          var n,\n            d,\n            g,\n            m,\n            _,\n            b,\n            w,\n            y,\n            v,\n            k,\n            x,\n            B,\n            S,\n            I,\n            M,\n            T,\n            z,\n            O,\n            C,\n            R,\n            N,\n            L,\n            U,\n            P,\n            $ = 0,\n            j = new r.Buf8(4),\n            F = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];\n          if (!t || !t.state || !t.output || !t.input && 0 !== t.avail_in) return h;\n          (n = t.state).mode === f && (n.mode = 13), _ = t.next_out, g = t.output, w = t.avail_out, m = t.next_in, d = t.input, b = t.avail_in, y = n.hold, v = n.bits, k = b, x = w, L = l;\n          t: for (;;) switch (n.mode) {\n            case u:\n              if (0 === n.wrap) {\n                n.mode = 13;\n                break;\n              }\n              for (; v < 16;) {\n                if (0 === b) break t;\n                b--, y += d[m++] << v, v += 8;\n              }\n              if (2 & n.wrap && 35615 === y) {\n                n.check = 0, j[0] = 255 & y, j[1] = y >>> 8 & 255, n.check = s(n.check, j, 2, 0), y = 0, v = 0, n.mode = 2;\n                break;\n              }\n              if (n.flags = 0, n.head && (n.head.done = !1), !(1 & n.wrap) || (((255 & y) << 8) + (y >> 8)) % 31) {\n                t.msg = \"incorrect header check\", n.mode = c;\n                break;\n              }\n              if (8 != (15 & y)) {\n                t.msg = \"unknown compression method\", n.mode = c;\n                break;\n              }\n              if (v -= 4, N = 8 + (15 & (y >>>= 4)), 0 === n.wbits) n.wbits = N;else if (N > n.wbits) {\n                t.msg = \"invalid window size\", n.mode = c;\n                break;\n              }\n              n.dmax = 1 << N, t.adler = n.check = 1, n.mode = 512 & y ? 10 : f, y = 0, v = 0;\n              break;\n            case 2:\n              for (; v < 16;) {\n                if (0 === b) break t;\n                b--, y += d[m++] << v, v += 8;\n              }\n              if (n.flags = y, 8 != (255 & n.flags)) {\n                t.msg = \"unknown compression method\", n.mode = c;\n                break;\n              }\n              if (57344 & n.flags) {\n                t.msg = \"unknown header flags set\", n.mode = c;\n                break;\n              }\n              n.head && (n.head.text = y >> 8 & 1), 512 & n.flags && (j[0] = 255 & y, j[1] = y >>> 8 & 255, n.check = s(n.check, j, 2, 0)), y = 0, v = 0, n.mode = 3;\n            case 3:\n              for (; v < 32;) {\n                if (0 === b) break t;\n                b--, y += d[m++] << v, v += 8;\n              }\n              n.head && (n.head.time = y), 512 & n.flags && (j[0] = 255 & y, j[1] = y >>> 8 & 255, j[2] = y >>> 16 & 255, j[3] = y >>> 24 & 255, n.check = s(n.check, j, 4, 0)), y = 0, v = 0, n.mode = 4;\n            case 4:\n              for (; v < 16;) {\n                if (0 === b) break t;\n                b--, y += d[m++] << v, v += 8;\n              }\n              n.head && (n.head.xflags = 255 & y, n.head.os = y >> 8), 512 & n.flags && (j[0] = 255 & y, j[1] = y >>> 8 & 255, n.check = s(n.check, j, 2, 0)), y = 0, v = 0, n.mode = 5;\n            case 5:\n              if (1024 & n.flags) {\n                for (; v < 16;) {\n                  if (0 === b) break t;\n                  b--, y += d[m++] << v, v += 8;\n                }\n                n.length = y, n.head && (n.head.extra_len = y), 512 & n.flags && (j[0] = 255 & y, j[1] = y >>> 8 & 255, n.check = s(n.check, j, 2, 0)), y = 0, v = 0;\n              } else n.head && (n.head.extra = null);\n              n.mode = 6;\n            case 6:\n              if (1024 & n.flags && ((B = n.length) > b && (B = b), B && (n.head && (N = n.head.extra_len - n.length, n.head.extra || (n.head.extra = new Array(n.head.extra_len)), r.arraySet(n.head.extra, d, m, B, N)), 512 & n.flags && (n.check = s(n.check, d, B, m)), b -= B, m += B, n.length -= B), n.length)) break t;\n              n.length = 0, n.mode = 7;\n            case 7:\n              if (2048 & n.flags) {\n                if (0 === b) break t;\n                B = 0;\n                do {\n                  N = d[m + B++], n.head && N && n.length < 65536 && (n.head.name += String.fromCharCode(N));\n                } while (N && B < b);\n                if (512 & n.flags && (n.check = s(n.check, d, B, m)), b -= B, m += B, N) break t;\n              } else n.head && (n.head.name = null);\n              n.length = 0, n.mode = 8;\n            case 8:\n              if (4096 & n.flags) {\n                if (0 === b) break t;\n                B = 0;\n                do {\n                  N = d[m + B++], n.head && N && n.length < 65536 && (n.head.comment += String.fromCharCode(N));\n                } while (N && B < b);\n                if (512 & n.flags && (n.check = s(n.check, d, B, m)), b -= B, m += B, N) break t;\n              } else n.head && (n.head.comment = null);\n              n.mode = 9;\n            case 9:\n              if (512 & n.flags) {\n                for (; v < 16;) {\n                  if (0 === b) break t;\n                  b--, y += d[m++] << v, v += 8;\n                }\n                if (y !== (65535 & n.check)) {\n                  t.msg = \"header crc mismatch\", n.mode = c;\n                  break;\n                }\n                y = 0, v = 0;\n              }\n              n.head && (n.head.hcrc = n.flags >> 9 & 1, n.head.done = !0), t.adler = n.check = 0, n.mode = f;\n              break;\n            case 10:\n              for (; v < 32;) {\n                if (0 === b) break t;\n                b--, y += d[m++] << v, v += 8;\n              }\n              t.adler = n.check = p(y), y = 0, v = 0, n.mode = 11;\n            case 11:\n              if (0 === n.havedict) return t.next_out = _, t.avail_out = w, t.next_in = m, t.avail_in = b, n.hold = y, n.bits = v, 2;\n              t.adler = n.check = 1, n.mode = f;\n            case f:\n              if (5 === e || 6 === e) break t;\n            case 13:\n              if (n.last) {\n                y >>>= 7 & v, v -= 7 & v, n.mode = 27;\n                break;\n              }\n              for (; v < 3;) {\n                if (0 === b) break t;\n                b--, y += d[m++] << v, v += 8;\n              }\n              switch (n.last = 1 & y, v -= 1, 3 & (y >>>= 1)) {\n                case 0:\n                  n.mode = 14;\n                  break;\n                case 1:\n                  if (E(n), n.mode = 20, 6 === e) {\n                    y >>>= 2, v -= 2;\n                    break t;\n                  }\n                  break;\n                case 2:\n                  n.mode = 17;\n                  break;\n                case 3:\n                  t.msg = \"invalid block type\", n.mode = c;\n              }\n              y >>>= 2, v -= 2;\n              break;\n            case 14:\n              for (y >>>= 7 & v, v -= 7 & v; v < 32;) {\n                if (0 === b) break t;\n                b--, y += d[m++] << v, v += 8;\n              }\n              if ((65535 & y) != (y >>> 16 ^ 65535)) {\n                t.msg = \"invalid stored block lengths\", n.mode = c;\n                break;\n              }\n              if (n.length = 65535 & y, y = 0, v = 0, n.mode = 15, 6 === e) break t;\n            case 15:\n              n.mode = 16;\n            case 16:\n              if (B = n.length) {\n                if (B > b && (B = b), B > w && (B = w), 0 === B) break t;\n                r.arraySet(g, d, m, B, _), b -= B, m += B, w -= B, _ += B, n.length -= B;\n                break;\n              }\n              n.mode = f;\n              break;\n            case 17:\n              for (; v < 14;) {\n                if (0 === b) break t;\n                b--, y += d[m++] << v, v += 8;\n              }\n              if (n.nlen = 257 + (31 & y), y >>>= 5, v -= 5, n.ndist = 1 + (31 & y), y >>>= 5, v -= 5, n.ncode = 4 + (15 & y), y >>>= 4, v -= 4, n.nlen > 286 || n.ndist > 30) {\n                t.msg = \"too many length or distance symbols\", n.mode = c;\n                break;\n              }\n              n.have = 0, n.mode = 18;\n            case 18:\n              for (; n.have < n.ncode;) {\n                for (; v < 3;) {\n                  if (0 === b) break t;\n                  b--, y += d[m++] << v, v += 8;\n                }\n                n.lens[F[n.have++]] = 7 & y, y >>>= 3, v -= 3;\n              }\n              for (; n.have < 19;) n.lens[F[n.have++]] = 0;\n              if (n.lencode = n.lendyn, n.lenbits = 7, U = {\n                bits: n.lenbits\n              }, L = a(0, n.lens, 0, 19, n.lencode, 0, n.work, U), n.lenbits = U.bits, L) {\n                t.msg = \"invalid code lengths set\", n.mode = c;\n                break;\n              }\n              n.have = 0, n.mode = 19;\n            case 19:\n              for (; n.have < n.nlen + n.ndist;) {\n                for (; T = ($ = n.lencode[y & (1 << n.lenbits) - 1]) >>> 16 & 255, z = 65535 & $, !((M = $ >>> 24) <= v);) {\n                  if (0 === b) break t;\n                  b--, y += d[m++] << v, v += 8;\n                }\n                if (z < 16) y >>>= M, v -= M, n.lens[n.have++] = z;else {\n                  if (16 === z) {\n                    for (P = M + 2; v < P;) {\n                      if (0 === b) break t;\n                      b--, y += d[m++] << v, v += 8;\n                    }\n                    if (y >>>= M, v -= M, 0 === n.have) {\n                      t.msg = \"invalid bit length repeat\", n.mode = c;\n                      break;\n                    }\n                    N = n.lens[n.have - 1], B = 3 + (3 & y), y >>>= 2, v -= 2;\n                  } else if (17 === z) {\n                    for (P = M + 3; v < P;) {\n                      if (0 === b) break t;\n                      b--, y += d[m++] << v, v += 8;\n                    }\n                    v -= M, N = 0, B = 3 + (7 & (y >>>= M)), y >>>= 3, v -= 3;\n                  } else {\n                    for (P = M + 7; v < P;) {\n                      if (0 === b) break t;\n                      b--, y += d[m++] << v, v += 8;\n                    }\n                    v -= M, N = 0, B = 11 + (127 & (y >>>= M)), y >>>= 7, v -= 7;\n                  }\n                  if (n.have + B > n.nlen + n.ndist) {\n                    t.msg = \"invalid bit length repeat\", n.mode = c;\n                    break;\n                  }\n                  for (; B--;) n.lens[n.have++] = N;\n                }\n              }\n              if (n.mode === c) break;\n              if (0 === n.lens[256]) {\n                t.msg = \"invalid code -- missing end-of-block\", n.mode = c;\n                break;\n              }\n              if (n.lenbits = 9, U = {\n                bits: n.lenbits\n              }, L = a(1, n.lens, 0, n.nlen, n.lencode, 0, n.work, U), n.lenbits = U.bits, L) {\n                t.msg = \"invalid literal/lengths set\", n.mode = c;\n                break;\n              }\n              if (n.distbits = 6, n.distcode = n.distdyn, U = {\n                bits: n.distbits\n              }, L = a(2, n.lens, n.nlen, n.ndist, n.distcode, 0, n.work, U), n.distbits = U.bits, L) {\n                t.msg = \"invalid distances set\", n.mode = c;\n                break;\n              }\n              if (n.mode = 20, 6 === e) break t;\n            case 20:\n              n.mode = 21;\n            case 21:\n              if (b >= 6 && w >= 258) {\n                t.next_out = _, t.avail_out = w, t.next_in = m, t.avail_in = b, n.hold = y, n.bits = v, o(t, x), _ = t.next_out, g = t.output, w = t.avail_out, m = t.next_in, d = t.input, b = t.avail_in, y = n.hold, v = n.bits, n.mode === f && (n.back = -1);\n                break;\n              }\n              for (n.back = 0; T = ($ = n.lencode[y & (1 << n.lenbits) - 1]) >>> 16 & 255, z = 65535 & $, !((M = $ >>> 24) <= v);) {\n                if (0 === b) break t;\n                b--, y += d[m++] << v, v += 8;\n              }\n              if (T && 0 == (240 & T)) {\n                for (O = M, C = T, R = z; T = ($ = n.lencode[R + ((y & (1 << O + C) - 1) >> O)]) >>> 16 & 255, z = 65535 & $, !(O + (M = $ >>> 24) <= v);) {\n                  if (0 === b) break t;\n                  b--, y += d[m++] << v, v += 8;\n                }\n                y >>>= O, v -= O, n.back += O;\n              }\n              if (y >>>= M, v -= M, n.back += M, n.length = z, 0 === T) {\n                n.mode = 26;\n                break;\n              }\n              if (32 & T) {\n                n.back = -1, n.mode = f;\n                break;\n              }\n              if (64 & T) {\n                t.msg = \"invalid literal/length code\", n.mode = c;\n                break;\n              }\n              n.extra = 15 & T, n.mode = 22;\n            case 22:\n              if (n.extra) {\n                for (P = n.extra; v < P;) {\n                  if (0 === b) break t;\n                  b--, y += d[m++] << v, v += 8;\n                }\n                n.length += y & (1 << n.extra) - 1, y >>>= n.extra, v -= n.extra, n.back += n.extra;\n              }\n              n.was = n.length, n.mode = 23;\n            case 23:\n              for (; T = ($ = n.distcode[y & (1 << n.distbits) - 1]) >>> 16 & 255, z = 65535 & $, !((M = $ >>> 24) <= v);) {\n                if (0 === b) break t;\n                b--, y += d[m++] << v, v += 8;\n              }\n              if (0 == (240 & T)) {\n                for (O = M, C = T, R = z; T = ($ = n.distcode[R + ((y & (1 << O + C) - 1) >> O)]) >>> 16 & 255, z = 65535 & $, !(O + (M = $ >>> 24) <= v);) {\n                  if (0 === b) break t;\n                  b--, y += d[m++] << v, v += 8;\n                }\n                y >>>= O, v -= O, n.back += O;\n              }\n              if (y >>>= M, v -= M, n.back += M, 64 & T) {\n                t.msg = \"invalid distance code\", n.mode = c;\n                break;\n              }\n              n.offset = z, n.extra = 15 & T, n.mode = 24;\n            case 24:\n              if (n.extra) {\n                for (P = n.extra; v < P;) {\n                  if (0 === b) break t;\n                  b--, y += d[m++] << v, v += 8;\n                }\n                n.offset += y & (1 << n.extra) - 1, y >>>= n.extra, v -= n.extra, n.back += n.extra;\n              }\n              if (n.offset > n.dmax) {\n                t.msg = \"invalid distance too far back\", n.mode = c;\n                break;\n              }\n              n.mode = 25;\n            case 25:\n              if (0 === w) break t;\n              if (B = x - w, n.offset > B) {\n                if ((B = n.offset - B) > n.whave && n.sane) {\n                  t.msg = \"invalid distance too far back\", n.mode = c;\n                  break;\n                }\n                B > n.wnext ? (B -= n.wnext, S = n.wsize - B) : S = n.wnext - B, B > n.length && (B = n.length), I = n.window;\n              } else I = g, S = _ - n.offset, B = n.length;\n              B > w && (B = w), w -= B, n.length -= B;\n              do {\n                g[_++] = I[S++];\n              } while (--B);\n              0 === n.length && (n.mode = 21);\n              break;\n            case 26:\n              if (0 === w) break t;\n              g[_++] = n.length, w--, n.mode = 21;\n              break;\n            case 27:\n              if (n.wrap) {\n                for (; v < 32;) {\n                  if (0 === b) break t;\n                  b--, y |= d[m++] << v, v += 8;\n                }\n                if (x -= w, t.total_out += x, n.total += x, x && (t.adler = n.check = n.flags ? s(n.check, g, x, _ - x) : i(n.check, g, x, _ - x)), x = w, (n.flags ? y : p(y)) !== n.check) {\n                  t.msg = \"incorrect data check\", n.mode = c;\n                  break;\n                }\n                y = 0, v = 0;\n              }\n              n.mode = 28;\n            case 28:\n              if (n.wrap && n.flags) {\n                for (; v < 32;) {\n                  if (0 === b) break t;\n                  b--, y += d[m++] << v, v += 8;\n                }\n                if (y !== (4294967295 & n.total)) {\n                  t.msg = \"incorrect length check\", n.mode = c;\n                  break;\n                }\n                y = 0, v = 0;\n              }\n              n.mode = 29;\n            case 29:\n              L = 1;\n              break t;\n            case c:\n              L = -3;\n              break t;\n            case 31:\n              return -4;\n            default:\n              return h;\n          }\n          return t.next_out = _, t.avail_out = w, t.next_in = m, t.avail_in = b, n.hold = y, n.bits = v, (n.wsize || x !== t.avail_out && n.mode < c && (n.mode < 27 || 4 !== e)) && A(t, t.output, t.next_out, x - t.avail_out) ? (n.mode = 31, -4) : (k -= t.avail_in, x -= t.avail_out, t.total_in += k, t.total_out += x, n.total += x, n.wrap && x && (t.adler = n.check = n.flags ? s(n.check, g, x, t.next_out - x) : i(n.check, g, x, t.next_out - x)), t.data_type = n.bits + (n.last ? 64 : 0) + (n.mode === f ? 128 : 0) + (20 === n.mode || 15 === n.mode ? 256 : 0), (0 === k && 0 === x || 4 === e) && L === l && (L = -5), L);\n        }, e.inflateEnd = function (t) {\n          if (!t || !t.state) return h;\n          var e = t.state;\n          return e.window && (e.window = null), t.state = null, l;\n        }, e.inflateGetHeader = function (t, e) {\n          var n;\n          return t && t.state ? 0 == (2 & (n = t.state).wrap) ? h : (n.head = e, e.done = !1, l) : h;\n        }, e.inflateSetDictionary = function (t, e) {\n          var n,\n            r = e.length;\n          return t && t.state ? 0 !== (n = t.state).wrap && 11 !== n.mode ? h : 11 === n.mode && i(1, e, r, 0) !== n.check ? -3 : A(t, e, r, r) ? (n.mode = 31, -4) : (n.havedict = 1, l) : h;\n        }, e.inflateInfo = \"pako inflate (from Nodeca project)\";\n      },\n      9241: function _(t, e, n) {\n        \"use strict\";\n\n        var r = n(4236),\n          i = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0],\n          s = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78],\n          o = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0],\n          a = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];\n        t.exports = function (t, e, n, l, h, u, f, c) {\n          var d,\n            g,\n            p,\n            m,\n            _,\n            b,\n            w,\n            y,\n            v,\n            k = c.bits,\n            x = 0,\n            E = 0,\n            A = 0,\n            B = 0,\n            S = 0,\n            I = 0,\n            M = 0,\n            T = 0,\n            z = 0,\n            O = 0,\n            C = null,\n            R = 0,\n            N = new r.Buf16(16),\n            L = new r.Buf16(16),\n            U = null,\n            P = 0;\n          for (x = 0; x <= 15; x++) N[x] = 0;\n          for (E = 0; E < l; E++) N[e[n + E]]++;\n          for (S = k, B = 15; B >= 1 && 0 === N[B]; B--);\n          if (S > B && (S = B), 0 === B) return h[u++] = 20971520, h[u++] = 20971520, c.bits = 1, 0;\n          for (A = 1; A < B && 0 === N[A]; A++);\n          for (S < A && (S = A), T = 1, x = 1; x <= 15; x++) if (T <<= 1, (T -= N[x]) < 0) return -1;\n          if (T > 0 && (0 === t || 1 !== B)) return -1;\n          for (L[1] = 0, x = 1; x < 15; x++) L[x + 1] = L[x] + N[x];\n          for (E = 0; E < l; E++) 0 !== e[n + E] && (f[L[e[n + E]]++] = E);\n          if (0 === t ? (C = U = f, b = 19) : 1 === t ? (C = i, R -= 257, U = s, P -= 257, b = 256) : (C = o, U = a, b = -1), O = 0, E = 0, x = A, _ = u, I = S, M = 0, p = -1, m = (z = 1 << S) - 1, 1 === t && z > 852 || 2 === t && z > 592) return 1;\n          for (;;) {\n            w = x - M, f[E] < b ? (y = 0, v = f[E]) : f[E] > b ? (y = U[P + f[E]], v = C[R + f[E]]) : (y = 96, v = 0), d = 1 << x - M, A = g = 1 << I;\n            do {\n              h[_ + (O >> M) + (g -= d)] = w << 24 | y << 16 | v | 0;\n            } while (0 !== g);\n            for (d = 1 << x - 1; O & d;) d >>= 1;\n            if (0 !== d ? (O &= d - 1, O += d) : O = 0, E++, 0 == --N[x]) {\n              if (x === B) break;\n              x = e[n + f[E]];\n            }\n            if (x > S && (O & m) !== p) {\n              for (0 === M && (M = S), _ += A, T = 1 << (I = x - M); I + M < B && !((T -= N[I + M]) <= 0);) I++, T <<= 1;\n              if (z += 1 << I, 1 === t && z > 852 || 2 === t && z > 592) return 1;\n              h[p = O & m] = S << 24 | I << 16 | _ - u | 0;\n            }\n          }\n          return 0 !== O && (h[_ + O] = x - M << 24 | 64 << 16 | 0), c.bits = S, 0;\n        };\n      },\n      8898: function _(t) {\n        \"use strict\";\n\n        t.exports = {\n          2: \"need dictionary\",\n          1: \"stream end\",\n          0: \"\",\n          \"-1\": \"file error\",\n          \"-2\": \"stream error\",\n          \"-3\": \"data error\",\n          \"-4\": \"insufficient memory\",\n          \"-5\": \"buffer error\",\n          \"-6\": \"incompatible version\"\n        };\n      },\n      342: function _(t, e, n) {\n        \"use strict\";\n\n        var r = n(4236);\n        function i(t) {\n          for (var e = t.length; --e >= 0;) t[e] = 0;\n        }\n        var s = 256,\n          o = 286,\n          a = 30,\n          l = 15,\n          h = 16,\n          u = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0],\n          f = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13],\n          c = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7],\n          d = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15],\n          g = new Array(576);\n        i(g);\n        var p = new Array(60);\n        i(p);\n        var m = new Array(512);\n        i(m);\n        var _ = new Array(256);\n        i(_);\n        var b = new Array(29);\n        i(b);\n        var w,\n          y,\n          v,\n          k = new Array(a);\n        function x(t, e, n, r, i) {\n          this.static_tree = t, this.extra_bits = e, this.extra_base = n, this.elems = r, this.max_length = i, this.has_stree = t && t.length;\n        }\n        function E(t, e) {\n          this.dyn_tree = t, this.max_code = 0, this.stat_desc = e;\n        }\n        function A(t) {\n          return t < 256 ? m[t] : m[256 + (t >>> 7)];\n        }\n        function B(t, e) {\n          t.pending_buf[t.pending++] = 255 & e, t.pending_buf[t.pending++] = e >>> 8 & 255;\n        }\n        function S(t, e, n) {\n          t.bi_valid > h - n ? (t.bi_buf |= e << t.bi_valid & 65535, B(t, t.bi_buf), t.bi_buf = e >> h - t.bi_valid, t.bi_valid += n - h) : (t.bi_buf |= e << t.bi_valid & 65535, t.bi_valid += n);\n        }\n        function I(t, e, n) {\n          S(t, n[2 * e], n[2 * e + 1]);\n        }\n        function M(t, e) {\n          var n = 0;\n          do {\n            n |= 1 & t, t >>>= 1, n <<= 1;\n          } while (--e > 0);\n          return n >>> 1;\n        }\n        function T(t, e, n) {\n          var r,\n            i,\n            s = new Array(l + 1),\n            o = 0;\n          for (r = 1; r <= l; r++) s[r] = o = o + n[r - 1] << 1;\n          for (i = 0; i <= e; i++) {\n            var a = t[2 * i + 1];\n            0 !== a && (t[2 * i] = M(s[a]++, a));\n          }\n        }\n        function z(t) {\n          var e;\n          for (e = 0; e < o; e++) t.dyn_ltree[2 * e] = 0;\n          for (e = 0; e < a; e++) t.dyn_dtree[2 * e] = 0;\n          for (e = 0; e < 19; e++) t.bl_tree[2 * e] = 0;\n          t.dyn_ltree[512] = 1, t.opt_len = t.static_len = 0, t.last_lit = t.matches = 0;\n        }\n        function O(t) {\n          t.bi_valid > 8 ? B(t, t.bi_buf) : t.bi_valid > 0 && (t.pending_buf[t.pending++] = t.bi_buf), t.bi_buf = 0, t.bi_valid = 0;\n        }\n        function C(t, e, n, r) {\n          var i = 2 * e,\n            s = 2 * n;\n          return t[i] < t[s] || t[i] === t[s] && r[e] <= r[n];\n        }\n        function R(t, e, n) {\n          for (var r = t.heap[n], i = n << 1; i <= t.heap_len && (i < t.heap_len && C(e, t.heap[i + 1], t.heap[i], t.depth) && i++, !C(e, r, t.heap[i], t.depth));) t.heap[n] = t.heap[i], n = i, i <<= 1;\n          t.heap[n] = r;\n        }\n        function N(t, e, n) {\n          var r,\n            i,\n            o,\n            a,\n            l = 0;\n          if (0 !== t.last_lit) do {\n            r = t.pending_buf[t.d_buf + 2 * l] << 8 | t.pending_buf[t.d_buf + 2 * l + 1], i = t.pending_buf[t.l_buf + l], l++, 0 === r ? I(t, i, e) : (I(t, (o = _[i]) + s + 1, e), 0 !== (a = u[o]) && S(t, i -= b[o], a), I(t, o = A(--r), n), 0 !== (a = f[o]) && S(t, r -= k[o], a));\n          } while (l < t.last_lit);\n          I(t, 256, e);\n        }\n        function L(t, e) {\n          var n,\n            r,\n            i,\n            s = e.dyn_tree,\n            o = e.stat_desc.static_tree,\n            a = e.stat_desc.has_stree,\n            h = e.stat_desc.elems,\n            u = -1;\n          for (t.heap_len = 0, t.heap_max = 573, n = 0; n < h; n++) 0 !== s[2 * n] ? (t.heap[++t.heap_len] = u = n, t.depth[n] = 0) : s[2 * n + 1] = 0;\n          for (; t.heap_len < 2;) s[2 * (i = t.heap[++t.heap_len] = u < 2 ? ++u : 0)] = 1, t.depth[i] = 0, t.opt_len--, a && (t.static_len -= o[2 * i + 1]);\n          for (e.max_code = u, n = t.heap_len >> 1; n >= 1; n--) R(t, s, n);\n          i = h;\n          do {\n            n = t.heap[1], t.heap[1] = t.heap[t.heap_len--], R(t, s, 1), r = t.heap[1], t.heap[--t.heap_max] = n, t.heap[--t.heap_max] = r, s[2 * i] = s[2 * n] + s[2 * r], t.depth[i] = (t.depth[n] >= t.depth[r] ? t.depth[n] : t.depth[r]) + 1, s[2 * n + 1] = s[2 * r + 1] = i, t.heap[1] = i++, R(t, s, 1);\n          } while (t.heap_len >= 2);\n          t.heap[--t.heap_max] = t.heap[1], function (t, e) {\n            var n,\n              r,\n              i,\n              s,\n              o,\n              a,\n              h = e.dyn_tree,\n              u = e.max_code,\n              f = e.stat_desc.static_tree,\n              c = e.stat_desc.has_stree,\n              d = e.stat_desc.extra_bits,\n              g = e.stat_desc.extra_base,\n              p = e.stat_desc.max_length,\n              m = 0;\n            for (s = 0; s <= l; s++) t.bl_count[s] = 0;\n            for (h[2 * t.heap[t.heap_max] + 1] = 0, n = t.heap_max + 1; n < 573; n++) (s = h[2 * h[2 * (r = t.heap[n]) + 1] + 1] + 1) > p && (s = p, m++), h[2 * r + 1] = s, r > u || (t.bl_count[s]++, o = 0, r >= g && (o = d[r - g]), a = h[2 * r], t.opt_len += a * (s + o), c && (t.static_len += a * (f[2 * r + 1] + o)));\n            if (0 !== m) {\n              do {\n                for (s = p - 1; 0 === t.bl_count[s];) s--;\n                t.bl_count[s]--, t.bl_count[s + 1] += 2, t.bl_count[p]--, m -= 2;\n              } while (m > 0);\n              for (s = p; 0 !== s; s--) for (r = t.bl_count[s]; 0 !== r;) (i = t.heap[--n]) > u || (h[2 * i + 1] !== s && (t.opt_len += (s - h[2 * i + 1]) * h[2 * i], h[2 * i + 1] = s), r--);\n            }\n          }(t, e), T(s, u, t.bl_count);\n        }\n        function U(t, e, n) {\n          var r,\n            i,\n            s = -1,\n            o = e[1],\n            a = 0,\n            l = 7,\n            h = 4;\n          for (0 === o && (l = 138, h = 3), e[2 * (n + 1) + 1] = 65535, r = 0; r <= n; r++) i = o, o = e[2 * (r + 1) + 1], ++a < l && i === o || (a < h ? t.bl_tree[2 * i] += a : 0 !== i ? (i !== s && t.bl_tree[2 * i]++, t.bl_tree[32]++) : a <= 10 ? t.bl_tree[34]++ : t.bl_tree[36]++, a = 0, s = i, 0 === o ? (l = 138, h = 3) : i === o ? (l = 6, h = 3) : (l = 7, h = 4));\n        }\n        function P(t, e, n) {\n          var r,\n            i,\n            s = -1,\n            o = e[1],\n            a = 0,\n            l = 7,\n            h = 4;\n          for (0 === o && (l = 138, h = 3), r = 0; r <= n; r++) if (i = o, o = e[2 * (r + 1) + 1], !(++a < l && i === o)) {\n            if (a < h) do {\n              I(t, i, t.bl_tree);\n            } while (0 != --a);else 0 !== i ? (i !== s && (I(t, i, t.bl_tree), a--), I(t, 16, t.bl_tree), S(t, a - 3, 2)) : a <= 10 ? (I(t, 17, t.bl_tree), S(t, a - 3, 3)) : (I(t, 18, t.bl_tree), S(t, a - 11, 7));\n            a = 0, s = i, 0 === o ? (l = 138, h = 3) : i === o ? (l = 6, h = 3) : (l = 7, h = 4);\n          }\n        }\n        i(k);\n        var $ = !1;\n        function j(t, e, n, i) {\n          S(t, 0 + (i ? 1 : 0), 3), function (t, e, n, i) {\n            O(t), B(t, n), B(t, ~n), r.arraySet(t.pending_buf, t.window, e, n, t.pending), t.pending += n;\n          }(t, e, n);\n        }\n        e._tr_init = function (t) {\n          $ || (function () {\n            var t,\n              e,\n              n,\n              r,\n              i,\n              s = new Array(l + 1);\n            for (n = 0, r = 0; r < 28; r++) for (b[r] = n, t = 0; t < 1 << u[r]; t++) _[n++] = r;\n            for (_[n - 1] = r, i = 0, r = 0; r < 16; r++) for (k[r] = i, t = 0; t < 1 << f[r]; t++) m[i++] = r;\n            for (i >>= 7; r < a; r++) for (k[r] = i << 7, t = 0; t < 1 << f[r] - 7; t++) m[256 + i++] = r;\n            for (e = 0; e <= l; e++) s[e] = 0;\n            for (t = 0; t <= 143;) g[2 * t + 1] = 8, t++, s[8]++;\n            for (; t <= 255;) g[2 * t + 1] = 9, t++, s[9]++;\n            for (; t <= 279;) g[2 * t + 1] = 7, t++, s[7]++;\n            for (; t <= 287;) g[2 * t + 1] = 8, t++, s[8]++;\n            for (T(g, 287, s), t = 0; t < a; t++) p[2 * t + 1] = 5, p[2 * t] = M(t, 5);\n            w = new x(g, u, 257, o, l), y = new x(p, f, 0, a, l), v = new x(new Array(0), c, 0, 19, 7);\n          }(), $ = !0), t.l_desc = new E(t.dyn_ltree, w), t.d_desc = new E(t.dyn_dtree, y), t.bl_desc = new E(t.bl_tree, v), t.bi_buf = 0, t.bi_valid = 0, z(t);\n        }, e._tr_stored_block = j, e._tr_flush_block = function (t, e, n, r) {\n          var i,\n            o,\n            a = 0;\n          t.level > 0 ? (2 === t.strm.data_type && (t.strm.data_type = function (t) {\n            var e,\n              n = 4093624447;\n            for (e = 0; e <= 31; e++, n >>>= 1) if (1 & n && 0 !== t.dyn_ltree[2 * e]) return 0;\n            if (0 !== t.dyn_ltree[18] || 0 !== t.dyn_ltree[20] || 0 !== t.dyn_ltree[26]) return 1;\n            for (e = 32; e < s; e++) if (0 !== t.dyn_ltree[2 * e]) return 1;\n            return 0;\n          }(t)), L(t, t.l_desc), L(t, t.d_desc), a = function (t) {\n            var e;\n            for (U(t, t.dyn_ltree, t.l_desc.max_code), U(t, t.dyn_dtree, t.d_desc.max_code), L(t, t.bl_desc), e = 18; e >= 3 && 0 === t.bl_tree[2 * d[e] + 1]; e--);\n            return t.opt_len += 3 * (e + 1) + 5 + 5 + 4, e;\n          }(t), i = t.opt_len + 3 + 7 >>> 3, (o = t.static_len + 3 + 7 >>> 3) <= i && (i = o)) : i = o = n + 5, n + 4 <= i && -1 !== e ? j(t, e, n, r) : 4 === t.strategy || o === i ? (S(t, 2 + (r ? 1 : 0), 3), N(t, g, p)) : (S(t, 4 + (r ? 1 : 0), 3), function (t, e, n, r) {\n            var i;\n            for (S(t, e - 257, 5), S(t, n - 1, 5), S(t, r - 4, 4), i = 0; i < r; i++) S(t, t.bl_tree[2 * d[i] + 1], 3);\n            P(t, t.dyn_ltree, e - 1), P(t, t.dyn_dtree, n - 1);\n          }(t, t.l_desc.max_code + 1, t.d_desc.max_code + 1, a + 1), N(t, t.dyn_ltree, t.dyn_dtree)), z(t), r && O(t);\n        }, e._tr_tally = function (t, e, n) {\n          return t.pending_buf[t.d_buf + 2 * t.last_lit] = e >>> 8 & 255, t.pending_buf[t.d_buf + 2 * t.last_lit + 1] = 255 & e, t.pending_buf[t.l_buf + t.last_lit] = 255 & n, t.last_lit++, 0 === e ? t.dyn_ltree[2 * n]++ : (t.matches++, e--, t.dyn_ltree[2 * (_[n] + s + 1)]++, t.dyn_dtree[2 * A(e)]++), t.last_lit === t.lit_bufsize - 1;\n        }, e._tr_align = function (t) {\n          S(t, 2, 3), I(t, 256, g), function (t) {\n            16 === t.bi_valid ? (B(t, t.bi_buf), t.bi_buf = 0, t.bi_valid = 0) : t.bi_valid >= 8 && (t.pending_buf[t.pending++] = 255 & t.bi_buf, t.bi_buf >>= 8, t.bi_valid -= 8);\n          }(t);\n        };\n      },\n      2292: function _(t) {\n        \"use strict\";\n\n        t.exports = function () {\n          this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = \"\", this.state = null, this.data_type = 2, this.adler = 0;\n        };\n      },\n      2467: function _(t, e, n) {\n        \"use strict\";\n\n        Object.defineProperty(e, \"__esModule\", {\n          value: !0\n        }), e.serialize = e.deserialize = e.registerSerializer = void 0;\n        var r = n(7381);\n        var i = r.DefaultSerializer;\n        e.registerSerializer = function (t) {\n          i = r.extendSerializer(i, t);\n        }, e.deserialize = function (t) {\n          return i.deserialize(t);\n        }, e.serialize = function (t) {\n          return i.serialize(t);\n        };\n      },\n      7381: function _(t, e) {\n        \"use strict\";\n\n        Object.defineProperty(e, \"__esModule\", {\n          value: !0\n        }), e.DefaultSerializer = e.extendSerializer = void 0, e.extendSerializer = function (t, e) {\n          var n = t.deserialize.bind(t),\n            r = t.serialize.bind(t);\n          return {\n            deserialize: function deserialize(t) {\n              return e.deserialize(t, n);\n            },\n            serialize: function serialize(t) {\n              return e.serialize(t, r);\n            }\n          };\n        };\n        var n = function n(t) {\n            return Object.assign(Error(t.message), {\n              name: t.name,\n              stack: t.stack\n            });\n          },\n          r = function r(t) {\n            return {\n              __error_marker: \"$$error\",\n              message: t.message,\n              name: t.name,\n              stack: t.stack\n            };\n          };\n        e.DefaultSerializer = {\n          deserialize: function deserialize(t) {\n            return (e = t) && \"object\" == _typeof(e) && \"__error_marker\" in e && \"$$error\" === e.__error_marker ? n(t) : t;\n            var e;\n          },\n          serialize: function serialize(t) {\n            return t instanceof Error ? r(t) : t;\n          }\n        };\n      },\n      8258: function _(t, e) {\n        \"use strict\";\n\n        Object.defineProperty(e, \"__esModule\", {\n          value: !0\n        }), e.$worker = e.$transferable = e.$terminate = e.$events = e.$errors = void 0, e.$errors = Symbol(\"thread.errors\"), e.$events = Symbol(\"thread.events\"), e.$terminate = Symbol(\"thread.terminate\"), e.$transferable = Symbol(\"thread.transferable\"), e.$worker = Symbol(\"thread.worker\");\n      },\n      8180: function _(t, e, n) {\n        \"use strict\";\n\n        Object.defineProperty(e, \"__esModule\", {\n          value: !0\n        }), e.Transfer = e.isTransferDescriptor = void 0;\n        var r = n(8258);\n        e.isTransferDescriptor = function (t) {\n          return t && \"object\" == _typeof(t) && t[r.$transferable];\n        }, e.Transfer = function (t, e) {\n          if (!e) {\n            if (!(n = t) || \"object\" != _typeof(n)) throw Error();\n            e = [t];\n          }\n          var n;\n          return _defineProperty(_defineProperty(_defineProperty({}, r.$transferable, !0), \"send\", t), \"transferables\", e);\n        };\n      },\n      3229: function _(t, e) {\n        \"use strict\";\n\n        var n, r;\n        Object.defineProperty(e, \"__esModule\", {\n          value: !0\n        }), e.WorkerMessageType = e.MasterMessageType = void 0, (r = e.MasterMessageType || (e.MasterMessageType = {})).cancel = \"cancel\", r.run = \"run\", (n = e.WorkerMessageType || (e.WorkerMessageType = {})).error = \"error\", n.init = \"init\", n.result = \"result\", n.running = \"running\", n.uncaughtError = \"uncaughtError\";\n      },\n      3447: function _(t, e) {\n        \"use strict\";\n\n        Object.defineProperty(e, \"__esModule\", {\n          value: !0\n        }), e[\"default\"] = {\n          isWorkerRuntime: function isWorkerRuntime() {\n            var t = \"undefined\" != typeof self && \"undefined\" != typeof Window && self instanceof Window;\n            return !(\"undefined\" == typeof self || !self.postMessage || t);\n          },\n          postMessageToMaster: function postMessageToMaster(t, e) {\n            self.postMessage(t, e);\n          },\n          subscribeToMasterMessages: function subscribeToMasterMessages(t) {\n            var e = function e(_e25) {\n              t(_e25.data);\n            };\n            return self.addEventListener(\"message\", e), function () {\n              self.removeEventListener(\"message\", e);\n            };\n          }\n        };\n      },\n      1934: function _(t, e, n) {\n        \"use strict\";\n\n        var r = this && this.__awaiter || function (t, e, n, r) {\n            return new (n || (n = Promise))(function (i, s) {\n              function o(t) {\n                try {\n                  l(r.next(t));\n                } catch (t) {\n                  s(t);\n                }\n              }\n              function a(t) {\n                try {\n                  l(r[\"throw\"](t));\n                } catch (t) {\n                  s(t);\n                }\n              }\n              function l(t) {\n                var e;\n                t.done ? i(t.value) : (e = t.value, e instanceof n ? e : new n(function (t) {\n                  t(e);\n                })).then(o, a);\n              }\n              l((r = r.apply(t, e || [])).next());\n            });\n          },\n          i = this && this.__importDefault || function (t) {\n            return t && t.__esModule ? t : {\n              \"default\": t\n            };\n          };\n        Object.defineProperty(e, \"__esModule\", {\n          value: !0\n        }), e.expose = e.isWorkerRuntime = e.Transfer = e.registerSerializer = void 0;\n        var s = i(n(6898)),\n          o = n(2467),\n          a = n(8180),\n          l = n(3229),\n          h = i(n(3447));\n        var u = n(2467);\n        Object.defineProperty(e, \"registerSerializer\", {\n          enumerable: !0,\n          get: function get() {\n            return u.registerSerializer;\n          }\n        });\n        var f = n(8180);\n        Object.defineProperty(e, \"Transfer\", {\n          enumerable: !0,\n          get: function get() {\n            return f.Transfer;\n          }\n        }), e.isWorkerRuntime = h[\"default\"].isWorkerRuntime;\n        var c = !1;\n        var d = new Map(),\n          g = function g(t) {\n            return t && t.type === l.MasterMessageType.run;\n          },\n          p = function p(t) {\n            return s[\"default\"](t) || function (t) {\n              return t && \"object\" == _typeof(t) && \"function\" == typeof t.subscribe;\n            }(t);\n          };\n        function m(t) {\n          return a.isTransferDescriptor(t) ? {\n            payload: t.send,\n            transferables: t.transferables\n          } : {\n            payload: t,\n            transferables: void 0\n          };\n        }\n        function _(t, e) {\n          var _m = m(e),\n            n = _m.payload,\n            r = _m.transferables,\n            i = {\n              type: l.WorkerMessageType.error,\n              uid: t,\n              error: o.serialize(n)\n            };\n          h[\"default\"].postMessageToMaster(i, r);\n        }\n        function b(t, e, n) {\n          var _m2 = m(n),\n            r = _m2.payload,\n            i = _m2.transferables,\n            s = {\n              type: l.WorkerMessageType.result,\n              uid: t,\n              complete: !!e || void 0,\n              payload: r\n            };\n          h[\"default\"].postMessageToMaster(s, i);\n        }\n        function w(t) {\n          try {\n            var _e26 = {\n              type: l.WorkerMessageType.uncaughtError,\n              error: o.serialize(t)\n            };\n            h[\"default\"].postMessageToMaster(_e26);\n          } catch (e) {\n            console.error(\"Not reporting uncaught error back to master thread as it occured while reporting an uncaught error already.\\nLatest error:\", e, \"\\nOriginal error:\", t);\n          }\n        }\n        function y(t, e, n) {\n          return r(this, void 0, void 0, /*#__PURE__*/_regeneratorRuntime().mark(function _callee27() {\n            var r, i, _e27, _e28;\n            return _regeneratorRuntime().wrap(function _callee27$(_context30) {\n              while (1) switch (_context30.prev = _context30.next) {\n                case 0:\n                  _context30.prev = 0;\n                  r = e.apply(void 0, _toConsumableArray(n));\n                  _context30.next = 7;\n                  break;\n                case 4:\n                  _context30.prev = 4;\n                  _context30.t0 = _context30[\"catch\"](0);\n                  return _context30.abrupt(\"return\", _(t, _context30.t0));\n                case 7:\n                  i = p(r) ? \"observable\" : \"promise\";\n                  if (!(function (t, e) {\n                    var n = {\n                      type: l.WorkerMessageType.running,\n                      uid: t,\n                      resultType: e\n                    };\n                    h[\"default\"].postMessageToMaster(n);\n                  }(t, i), p(r))) {\n                    _context30.next = 13;\n                    break;\n                  }\n                  _e27 = r.subscribe(function (e) {\n                    return b(t, !1, o.serialize(e));\n                  }, function (e) {\n                    _(t, o.serialize(e)), d[\"delete\"](t);\n                  }, function () {\n                    b(t, !0), d[\"delete\"](t);\n                  });\n                  d.set(t, _e27);\n                  _context30.next = 23;\n                  break;\n                case 13:\n                  _context30.prev = 13;\n                  _context30.next = 16;\n                  return r;\n                case 16:\n                  _e28 = _context30.sent;\n                  b(t, !0, o.serialize(_e28));\n                  _context30.next = 23;\n                  break;\n                case 20:\n                  _context30.prev = 20;\n                  _context30.t1 = _context30[\"catch\"](13);\n                  _(t, o.serialize(_context30.t1));\n                case 23:\n                case \"end\":\n                  return _context30.stop();\n              }\n            }, _callee27, null, [[0, 4], [13, 20]]);\n          }));\n        }\n        e.expose = function (t) {\n          if (!h[\"default\"].isWorkerRuntime()) throw Error(\"expose() called in the master thread.\");\n          if (c) throw Error(\"expose() called more than once. This is not possible. Pass an object to expose() if you want to expose multiple functions.\");\n          if (c = !0, \"function\" == typeof t) h[\"default\"].subscribeToMasterMessages(function (e) {\n            g(e) && !e.method && y(e.uid, t, e.args.map(o.deserialize));\n          }), function () {\n            var t = {\n              type: l.WorkerMessageType.init,\n              exposed: {\n                type: \"function\"\n              }\n            };\n            h[\"default\"].postMessageToMaster(t);\n          }();else {\n            if (\"object\" != _typeof(t) || !t) throw Error(\"Invalid argument passed to expose(). Expected a function or an object, got: \".concat(t));\n            h[\"default\"].subscribeToMasterMessages(function (e) {\n              g(e) && e.method && y(e.uid, t[e.method], e.args.map(o.deserialize));\n            }), function (t) {\n              var e = {\n                type: l.WorkerMessageType.init,\n                exposed: {\n                  type: \"module\",\n                  methods: t\n                }\n              };\n              h[\"default\"].postMessageToMaster(e);\n            }(Object.keys(t).filter(function (e) {\n              return \"function\" == typeof t[e];\n            }));\n          }\n          h[\"default\"].subscribeToMasterMessages(function (t) {\n            if ((e = t) && e.type === l.MasterMessageType.cancel) {\n              var _e29 = t.uid,\n                _n17 = d.get(_e29);\n              _n17 && (_n17.unsubscribe(), d[\"delete\"](_e29));\n            }\n            var e;\n          });\n        }, \"undefined\" != typeof self && \"function\" == typeof self.addEventListener && h[\"default\"].isWorkerRuntime() && (self.addEventListener(\"error\", function (t) {\n          setTimeout(function () {\n            return w(t.error || t);\n          }, 250);\n        }), self.addEventListener(\"unhandledrejection\", function (t) {\n          var e = t.reason;\n          e && \"string\" == typeof e.message && setTimeout(function () {\n            return w(e);\n          }, 250);\n        })), \"undefined\" != typeof process && \"function\" == typeof process.on && h[\"default\"].isWorkerRuntime() && (process.on(\"uncaughtException\", function (t) {\n          setTimeout(function () {\n            return w(t);\n          }, 250);\n        }), process.on(\"unhandledRejection\", function (t) {\n          t && \"string\" == typeof t.message && setTimeout(function () {\n            return w(t);\n          }, 250);\n        }));\n      },\n      9602: function _(t) {\n        \"use strict\";\n\n        t.exports = function (t) {\n          t.prototype[Symbol.iterator] = /*#__PURE__*/_regeneratorRuntime().mark(function _callee28() {\n            var _t16;\n            return _regeneratorRuntime().wrap(function _callee28$(_context31) {\n              while (1) switch (_context31.prev = _context31.next) {\n                case 0:\n                  _t16 = this.head;\n                case 1:\n                  if (!_t16) {\n                    _context31.next = 7;\n                    break;\n                  }\n                  _context31.next = 4;\n                  return _t16.value;\n                case 4:\n                  _t16 = _t16.next;\n                  _context31.next = 1;\n                  break;\n                case 7:\n                case \"end\":\n                  return _context31.stop();\n              }\n            }, _callee28, this);\n          });\n        };\n      },\n      4411: function _(t, e, n) {\n        \"use strict\";\n\n        function r(t) {\n          var e = this;\n          if (e instanceof r || (e = new r()), e.tail = null, e.head = null, e.length = 0, t && \"function\" == typeof t.forEach) t.forEach(function (t) {\n            e.push(t);\n          });else if (arguments.length > 0) for (var n = 0, i = arguments.length; n < i; n++) e.push(arguments[n]);\n          return e;\n        }\n        function i(t, e, n) {\n          var r = e === t.head ? new a(n, null, e, t) : new a(n, e, e.next, t);\n          return null === r.next && (t.tail = r), null === r.prev && (t.head = r), t.length++, r;\n        }\n        function s(t, e) {\n          t.tail = new a(e, t.tail, null, t), t.head || (t.head = t.tail), t.length++;\n        }\n        function o(t, e) {\n          t.head = new a(e, null, t.head, t), t.tail || (t.tail = t.head), t.length++;\n        }\n        function a(t, e, n, r) {\n          if (!(this instanceof a)) return new a(t, e, n, r);\n          this.list = r, this.value = t, e ? (e.next = this, this.prev = e) : this.prev = null, n ? (n.prev = this, this.next = n) : this.next = null;\n        }\n        t.exports = r, r.Node = a, r.create = r, r.prototype.removeNode = function (t) {\n          if (t.list !== this) throw new Error(\"removing node which does not belong to this list\");\n          var e = t.next,\n            n = t.prev;\n          return e && (e.prev = n), n && (n.next = e), t === this.head && (this.head = e), t === this.tail && (this.tail = n), t.list.length--, t.next = null, t.prev = null, t.list = null, e;\n        }, r.prototype.unshiftNode = function (t) {\n          if (t !== this.head) {\n            t.list && t.list.removeNode(t);\n            var e = this.head;\n            t.list = this, t.next = e, e && (e.prev = t), this.head = t, this.tail || (this.tail = t), this.length++;\n          }\n        }, r.prototype.pushNode = function (t) {\n          if (t !== this.tail) {\n            t.list && t.list.removeNode(t);\n            var e = this.tail;\n            t.list = this, t.prev = e, e && (e.next = t), this.tail = t, this.head || (this.head = t), this.length++;\n          }\n        }, r.prototype.push = function () {\n          for (var t = 0, e = arguments.length; t < e; t++) s(this, arguments[t]);\n          return this.length;\n        }, r.prototype.unshift = function () {\n          for (var t = 0, e = arguments.length; t < e; t++) o(this, arguments[t]);\n          return this.length;\n        }, r.prototype.pop = function () {\n          if (this.tail) {\n            var t = this.tail.value;\n            return this.tail = this.tail.prev, this.tail ? this.tail.next = null : this.head = null, this.length--, t;\n          }\n        }, r.prototype.shift = function () {\n          if (this.head) {\n            var t = this.head.value;\n            return this.head = this.head.next, this.head ? this.head.prev = null : this.tail = null, this.length--, t;\n          }\n        }, r.prototype.forEach = function (t, e) {\n          e = e || this;\n          for (var n = this.head, r = 0; null !== n; r++) t.call(e, n.value, r, this), n = n.next;\n        }, r.prototype.forEachReverse = function (t, e) {\n          e = e || this;\n          for (var n = this.tail, r = this.length - 1; null !== n; r--) t.call(e, n.value, r, this), n = n.prev;\n        }, r.prototype.get = function (t) {\n          for (var e = 0, n = this.head; null !== n && e < t; e++) n = n.next;\n          if (e === t && null !== n) return n.value;\n        }, r.prototype.getReverse = function (t) {\n          for (var e = 0, n = this.tail; null !== n && e < t; e++) n = n.prev;\n          if (e === t && null !== n) return n.value;\n        }, r.prototype.map = function (t, e) {\n          e = e || this;\n          for (var n = new r(), i = this.head; null !== i;) n.push(t.call(e, i.value, this)), i = i.next;\n          return n;\n        }, r.prototype.mapReverse = function (t, e) {\n          e = e || this;\n          for (var n = new r(), i = this.tail; null !== i;) n.push(t.call(e, i.value, this)), i = i.prev;\n          return n;\n        }, r.prototype.reduce = function (t, e) {\n          var n,\n            r = this.head;\n          if (arguments.length > 1) n = e;else {\n            if (!this.head) throw new TypeError(\"Reduce of empty list with no initial value\");\n            r = this.head.next, n = this.head.value;\n          }\n          for (var i = 0; null !== r; i++) n = t(n, r.value, i), r = r.next;\n          return n;\n        }, r.prototype.reduceReverse = function (t, e) {\n          var n,\n            r = this.tail;\n          if (arguments.length > 1) n = e;else {\n            if (!this.tail) throw new TypeError(\"Reduce of empty list with no initial value\");\n            r = this.tail.prev, n = this.tail.value;\n          }\n          for (var i = this.length - 1; null !== r; i--) n = t(n, r.value, i), r = r.prev;\n          return n;\n        }, r.prototype.toArray = function () {\n          for (var t = new Array(this.length), e = 0, n = this.head; null !== n; e++) t[e] = n.value, n = n.next;\n          return t;\n        }, r.prototype.toArrayReverse = function () {\n          for (var t = new Array(this.length), e = 0, n = this.tail; null !== n; e++) t[e] = n.value, n = n.prev;\n          return t;\n        }, r.prototype.slice = function (t, e) {\n          (e = e || this.length) < 0 && (e += this.length), (t = t || 0) < 0 && (t += this.length);\n          var n = new r();\n          if (e < t || e < 0) return n;\n          t < 0 && (t = 0), e > this.length && (e = this.length);\n          for (var i = 0, s = this.head; null !== s && i < t; i++) s = s.next;\n          for (; null !== s && i < e; i++, s = s.next) n.push(s.value);\n          return n;\n        }, r.prototype.sliceReverse = function (t, e) {\n          (e = e || this.length) < 0 && (e += this.length), (t = t || 0) < 0 && (t += this.length);\n          var n = new r();\n          if (e < t || e < 0) return n;\n          t < 0 && (t = 0), e > this.length && (e = this.length);\n          for (var i = this.length, s = this.tail; null !== s && i > e; i--) s = s.prev;\n          for (; null !== s && i > t; i--, s = s.prev) n.push(s.value);\n          return n;\n        }, r.prototype.splice = function (t, e) {\n          t > this.length && (t = this.length - 1), t < 0 && (t = this.length + t);\n          for (var r = 0, s = this.head; null !== s && r < t; r++) s = s.next;\n          var o = [];\n          for (r = 0; s && r < e; r++) o.push(s.value), s = this.removeNode(s);\n          for (null === s && (s = this.tail), s !== this.head && s !== this.tail && (s = s.prev), r = 0; r < (arguments.length <= 2 ? 0 : arguments.length - 2); r++) s = i(this, s, r + 2 < 2 || arguments.length <= r + 2 ? undefined : arguments[r + 2]);\n          return o;\n        }, r.prototype.reverse = function () {\n          for (var t = this.head, e = this.tail, n = t; null !== n; n = n.prev) {\n            var r = n.prev;\n            n.prev = n.next, n.next = r;\n          }\n          return this.head = e, this.tail = t, this;\n        };\n        try {\n          n(9602)(r);\n        } catch (t) {}\n      },\n      1334: function _() {},\n      7067: function _() {}\n    },\n    e = {};\n  function n(r) {\n    var i = e[r];\n    if (void 0 !== i) return i.exports;\n    var s = e[r] = {\n      exports: {}\n    };\n    return t[r].call(s.exports, s, s.exports, n), s.exports;\n  }\n  n.n = function (t) {\n    var e = t && t.__esModule ? function () {\n      return t[\"default\"];\n    } : function () {\n      return t;\n    };\n    return n.d(e, {\n      a: e\n    }), e;\n  }, n.d = function (t, e) {\n    for (var r in e) n.o(e, r) && !n.o(t, r) && Object.defineProperty(t, r, {\n      enumerable: !0,\n      get: e[r]\n    });\n  }, n.g = function () {\n    if (\"object\" == (typeof globalThis === \"undefined\" ? \"undefined\" : _typeof(globalThis))) return globalThis;\n    try {\n      return this || new Function(\"return this\")();\n    } catch (t) {\n      if (\"object\" == (typeof window === \"undefined\" ? \"undefined\" : _typeof(window))) return window;\n    }\n  }(), n.o = function (t, e) {\n    return Object.prototype.hasOwnProperty.call(t, e);\n  }, n.r = function (t) {\n    \"undefined\" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {\n      value: \"Module\"\n    }), Object.defineProperty(t, \"__esModule\", {\n      value: !0\n    });\n  }, function () {\n    \"use strict\";\n\n    function t(t, e, n) {\n      t = +t, e = +e, n = (i = arguments.length) < 2 ? (e = t, t = 0, 1) : i < 3 ? 1 : +n;\n      for (var r = -1, i = 0 | Math.max(0, Math.ceil((e - t) / n)), s = new Array(i); ++r < i;) s[r] = t + r * n;\n      return s;\n    }\n    function e(t, e) {\n      switch (arguments.length) {\n        case 0:\n          break;\n        case 1:\n          this.range(t);\n          break;\n        default:\n          this.range(e).domain(t);\n      }\n      return this;\n    }\n    var r = Symbol(\"implicit\");\n    function i() {\n      var t = new Map(),\n        n = [],\n        s = [],\n        o = r;\n      function a(e) {\n        var i = e + \"\",\n          a = t.get(i);\n        if (!a) {\n          if (o !== r) return o;\n          t.set(i, a = n.push(e));\n        }\n        return s[(a - 1) % s.length];\n      }\n      return a.domain = function (e) {\n        if (!arguments.length) return n.slice();\n        n = [], t = new Map();\n        var _iterator9 = _createForOfIteratorHelper(e),\n          _step9;\n        try {\n          for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {\n            var _r20 = _step9.value;\n            var _e30 = _r20 + \"\";\n            t.has(_e30) || t.set(_e30, n.push(_r20));\n          }\n        } catch (err) {\n          _iterator9.e(err);\n        } finally {\n          _iterator9.f();\n        }\n        return a;\n      }, a.range = function (t) {\n        return arguments.length ? (s = Array.from(t), a) : s.slice();\n      }, a.unknown = function (t) {\n        return arguments.length ? (o = t, a) : o;\n      }, a.copy = function () {\n        return i(n, s).unknown(o);\n      }, e.apply(a, arguments), a;\n    }\n    function s() {\n      var n,\n        r,\n        o = i().unknown(void 0),\n        a = o.domain,\n        l = o.range,\n        h = 0,\n        u = 1,\n        f = !1,\n        c = 0,\n        d = 0,\n        g = .5;\n      function p() {\n        var e = a().length,\n          i = u < h,\n          s = i ? u : h,\n          o = i ? h : u;\n        n = (o - s) / Math.max(1, e - c + 2 * d), f && (n = Math.floor(n)), s += (o - s - n * (e - c)) * g, r = n * (1 - c), f && (s = Math.round(s), r = Math.round(r));\n        var p = t(e).map(function (t) {\n          return s + n * t;\n        });\n        return l(i ? p.reverse() : p);\n      }\n      return delete o.unknown, o.domain = function (t) {\n        return arguments.length ? (a(t), p()) : a();\n      }, o.range = function (t) {\n        var _t17;\n        return arguments.length ? ((_t17 = _slicedToArray(t, 2), h = _t17[0], u = _t17[1]), h = +h, u = +u, p()) : [h, u];\n      }, o.rangeRound = function (t) {\n        var _t18;\n        return (_t18 = _slicedToArray(t, 2), h = _t18[0], u = _t18[1]), h = +h, u = +u, f = !0, p();\n      }, o.bandwidth = function () {\n        return r;\n      }, o.step = function () {\n        return n;\n      }, o.round = function (t) {\n        return arguments.length ? (f = !!t, p()) : f;\n      }, o.padding = function (t) {\n        return arguments.length ? (c = Math.min(1, d = +t), p()) : c;\n      }, o.paddingInner = function (t) {\n        return arguments.length ? (c = Math.min(1, t), p()) : c;\n      }, o.paddingOuter = function (t) {\n        return arguments.length ? (d = +t, p()) : d;\n      }, o.align = function (t) {\n        return arguments.length ? (g = Math.max(0, Math.min(1, t)), p()) : g;\n      }, o.copy = function () {\n        return s(a(), [h, u]).round(f).paddingInner(c).paddingOuter(d).align(g);\n      }, e.apply(p(), arguments);\n    }\n    var o = Math.sqrt(50),\n      a = Math.sqrt(10),\n      l = Math.sqrt(2);\n    function h(t, e, n) {\n      var r = (e - t) / Math.max(0, n),\n        i = Math.floor(Math.log(r) / Math.LN10),\n        s = r / Math.pow(10, i);\n      return i >= 0 ? (s >= o ? 10 : s >= a ? 5 : s >= l ? 2 : 1) * Math.pow(10, i) : -Math.pow(10, -i) / (s >= o ? 10 : s >= a ? 5 : s >= l ? 2 : 1);\n    }\n    function u(t, e) {\n      return t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;\n    }\n    function f(t) {\n      var e = t,\n        n = t;\n      function r(t, e, r, i) {\n        for (null == r && (r = 0), null == i && (i = t.length); r < i;) {\n          var _s6 = r + i >>> 1;\n          n(t[_s6], e) < 0 ? r = _s6 + 1 : i = _s6;\n        }\n        return r;\n      }\n      return 1 === t.length && (e = function e(_e31, n) {\n        return t(_e31) - n;\n      }, n = function (t) {\n        return function (e, n) {\n          return u(t(e), n);\n        };\n      }(t)), {\n        left: r,\n        center: function center(t, n, i, s) {\n          null == i && (i = 0), null == s && (s = t.length);\n          var o = r(t, n, i, s - 1);\n          return o > i && e(t[o - 1], n) > -e(t[o], n) ? o - 1 : o;\n        },\n        right: function right(t, e, r, i) {\n          for (null == r && (r = 0), null == i && (i = t.length); r < i;) {\n            var _s7 = r + i >>> 1;\n            n(t[_s7], e) > 0 ? i = _s7 : r = _s7 + 1;\n          }\n          return r;\n        }\n      };\n    }\n    var c = f(u),\n      d = c.right,\n      g = (c.left, f(function (t) {\n        return null === t ? NaN : +t;\n      }).center, d);\n    function p(t, e, n) {\n      t.prototype = e.prototype = n, n.constructor = t;\n    }\n    function m(t, e) {\n      var n = Object.create(t.prototype);\n      for (var r in e) n[r] = e[r];\n      return n;\n    }\n    function _() {}\n    var b = .7,\n      w = 1 / b,\n      y = \"\\\\s*([+-]?\\\\d+)\\\\s*\",\n      v = \"\\\\s*([+-]?\\\\d*\\\\.?\\\\d+(?:[eE][+-]?\\\\d+)?)\\\\s*\",\n      k = \"\\\\s*([+-]?\\\\d*\\\\.?\\\\d+(?:[eE][+-]?\\\\d+)?)%\\\\s*\",\n      x = /^#([0-9a-f]{3,8})$/,\n      E = new RegExp(\"^rgb\\\\(\" + [y, y, y] + \"\\\\)$\"),\n      A = new RegExp(\"^rgb\\\\(\" + [k, k, k] + \"\\\\)$\"),\n      B = new RegExp(\"^rgba\\\\(\" + [y, y, y, v] + \"\\\\)$\"),\n      S = new RegExp(\"^rgba\\\\(\" + [k, k, k, v] + \"\\\\)$\"),\n      I = new RegExp(\"^hsl\\\\(\" + [v, k, k] + \"\\\\)$\"),\n      M = new RegExp(\"^hsla\\\\(\" + [v, k, k, v] + \"\\\\)$\"),\n      T = {\n        aliceblue: 15792383,\n        antiquewhite: 16444375,\n        aqua: 65535,\n        aquamarine: 8388564,\n        azure: 15794175,\n        beige: 16119260,\n        bisque: 16770244,\n        black: 0,\n        blanchedalmond: 16772045,\n        blue: 255,\n        blueviolet: 9055202,\n        brown: 10824234,\n        burlywood: 14596231,\n        cadetblue: 6266528,\n        chartreuse: 8388352,\n        chocolate: 13789470,\n        coral: 16744272,\n        cornflowerblue: 6591981,\n        cornsilk: 16775388,\n        crimson: 14423100,\n        cyan: 65535,\n        darkblue: 139,\n        darkcyan: 35723,\n        darkgoldenrod: 12092939,\n        darkgray: 11119017,\n        darkgreen: 25600,\n        darkgrey: 11119017,\n        darkkhaki: 12433259,\n        darkmagenta: 9109643,\n        darkolivegreen: 5597999,\n        darkorange: 16747520,\n        darkorchid: 10040012,\n        darkred: 9109504,\n        darksalmon: 15308410,\n        darkseagreen: 9419919,\n        darkslateblue: 4734347,\n        darkslategray: 3100495,\n        darkslategrey: 3100495,\n        darkturquoise: 52945,\n        darkviolet: 9699539,\n        deeppink: 16716947,\n        deepskyblue: 49151,\n        dimgray: 6908265,\n        dimgrey: 6908265,\n        dodgerblue: 2003199,\n        firebrick: 11674146,\n        floralwhite: 16775920,\n        forestgreen: 2263842,\n        fuchsia: 16711935,\n        gainsboro: 14474460,\n        ghostwhite: 16316671,\n        gold: 16766720,\n        goldenrod: 14329120,\n        gray: 8421504,\n        green: 32768,\n        greenyellow: 11403055,\n        grey: 8421504,\n        honeydew: 15794160,\n        hotpink: 16738740,\n        indianred: 13458524,\n        indigo: 4915330,\n        ivory: 16777200,\n        khaki: 15787660,\n        lavender: 15132410,\n        lavenderblush: 16773365,\n        lawngreen: 8190976,\n        lemonchiffon: 16775885,\n        lightblue: 11393254,\n        lightcoral: 15761536,\n        lightcyan: 14745599,\n        lightgoldenrodyellow: 16448210,\n        lightgray: 13882323,\n        lightgreen: 9498256,\n        lightgrey: 13882323,\n        lightpink: 16758465,\n        lightsalmon: 16752762,\n        lightseagreen: 2142890,\n        lightskyblue: 8900346,\n        lightslategray: 7833753,\n        lightslategrey: 7833753,\n        lightsteelblue: 11584734,\n        lightyellow: 16777184,\n        lime: 65280,\n        limegreen: 3329330,\n        linen: 16445670,\n        magenta: 16711935,\n        maroon: 8388608,\n        mediumaquamarine: 6737322,\n        mediumblue: 205,\n        mediumorchid: 12211667,\n        mediumpurple: 9662683,\n        mediumseagreen: 3978097,\n        mediumslateblue: 8087790,\n        mediumspringgreen: 64154,\n        mediumturquoise: 4772300,\n        mediumvioletred: 13047173,\n        midnightblue: 1644912,\n        mintcream: 16121850,\n        mistyrose: 16770273,\n        moccasin: 16770229,\n        navajowhite: 16768685,\n        navy: 128,\n        oldlace: 16643558,\n        olive: 8421376,\n        olivedrab: 7048739,\n        orange: 16753920,\n        orangered: 16729344,\n        orchid: 14315734,\n        palegoldenrod: 15657130,\n        palegreen: 10025880,\n        paleturquoise: 11529966,\n        palevioletred: 14381203,\n        papayawhip: 16773077,\n        peachpuff: 16767673,\n        peru: 13468991,\n        pink: 16761035,\n        plum: 14524637,\n        powderblue: 11591910,\n        purple: 8388736,\n        rebeccapurple: 6697881,\n        red: 16711680,\n        rosybrown: 12357519,\n        royalblue: 4286945,\n        saddlebrown: 9127187,\n        salmon: 16416882,\n        sandybrown: 16032864,\n        seagreen: 3050327,\n        seashell: 16774638,\n        sienna: 10506797,\n        silver: 12632256,\n        skyblue: 8900331,\n        slateblue: 6970061,\n        slategray: 7372944,\n        slategrey: 7372944,\n        snow: 16775930,\n        springgreen: 65407,\n        steelblue: 4620980,\n        tan: 13808780,\n        teal: 32896,\n        thistle: 14204888,\n        tomato: 16737095,\n        turquoise: 4251856,\n        violet: 15631086,\n        wheat: 16113331,\n        white: 16777215,\n        whitesmoke: 16119285,\n        yellow: 16776960,\n        yellowgreen: 10145074\n      };\n    function z() {\n      return this.rgb().formatHex();\n    }\n    function O() {\n      return this.rgb().formatRgb();\n    }\n    function C(t) {\n      var e, n;\n      return t = (t + \"\").trim().toLowerCase(), (e = x.exec(t)) ? (n = e[1].length, e = parseInt(e[1], 16), 6 === n ? R(e) : 3 === n ? new U(e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | 240 & e, (15 & e) << 4 | 15 & e, 1) : 8 === n ? N(e >> 24 & 255, e >> 16 & 255, e >> 8 & 255, (255 & e) / 255) : 4 === n ? N(e >> 12 & 15 | e >> 8 & 240, e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | 240 & e, ((15 & e) << 4 | 15 & e) / 255) : null) : (e = E.exec(t)) ? new U(e[1], e[2], e[3], 1) : (e = A.exec(t)) ? new U(255 * e[1] / 100, 255 * e[2] / 100, 255 * e[3] / 100, 1) : (e = B.exec(t)) ? N(e[1], e[2], e[3], e[4]) : (e = S.exec(t)) ? N(255 * e[1] / 100, 255 * e[2] / 100, 255 * e[3] / 100, e[4]) : (e = I.exec(t)) ? F(e[1], e[2] / 100, e[3] / 100, 1) : (e = M.exec(t)) ? F(e[1], e[2] / 100, e[3] / 100, e[4]) : T.hasOwnProperty(t) ? R(T[t]) : \"transparent\" === t ? new U(NaN, NaN, NaN, 0) : null;\n    }\n    function R(t) {\n      return new U(t >> 16 & 255, t >> 8 & 255, 255 & t, 1);\n    }\n    function N(t, e, n, r) {\n      return r <= 0 && (t = e = n = NaN), new U(t, e, n, r);\n    }\n    function L(t, e, n, r) {\n      return 1 === arguments.length ? ((i = t) instanceof _ || (i = C(i)), i ? new U((i = i.rgb()).r, i.g, i.b, i.opacity) : new U()) : new U(t, e, n, null == r ? 1 : r);\n      var i;\n    }\n    function U(t, e, n, r) {\n      this.r = +t, this.g = +e, this.b = +n, this.opacity = +r;\n    }\n    function P() {\n      return \"#\" + j(this.r) + j(this.g) + j(this.b);\n    }\n    function $() {\n      var t = this.opacity;\n      return (1 === (t = isNaN(t) ? 1 : Math.max(0, Math.min(1, t))) ? \"rgb(\" : \"rgba(\") + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + \", \" + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + \", \" + Math.max(0, Math.min(255, Math.round(this.b) || 0)) + (1 === t ? \")\" : \", \" + t + \")\");\n    }\n    function j(t) {\n      return ((t = Math.max(0, Math.min(255, Math.round(t) || 0))) < 16 ? \"0\" : \"\") + t.toString(16);\n    }\n    function F(t, e, n, r) {\n      return r <= 0 ? t = e = n = NaN : n <= 0 || n >= 1 ? t = e = NaN : e <= 0 && (t = NaN), new q(t, e, n, r);\n    }\n    function D(t) {\n      if (t instanceof q) return new q(t.h, t.s, t.l, t.opacity);\n      if (t instanceof _ || (t = C(t)), !t) return new q();\n      if (t instanceof q) return t;\n      var e = (t = t.rgb()).r / 255,\n        n = t.g / 255,\n        r = t.b / 255,\n        i = Math.min(e, n, r),\n        s = Math.max(e, n, r),\n        o = NaN,\n        a = s - i,\n        l = (s + i) / 2;\n      return a ? (o = e === s ? (n - r) / a + 6 * (n < r) : n === s ? (r - e) / a + 2 : (e - n) / a + 4, a /= l < .5 ? s + i : 2 - s - i, o *= 60) : a = l > 0 && l < 1 ? 0 : o, new q(o, a, l, t.opacity);\n    }\n    function q(t, e, n, r) {\n      this.h = +t, this.s = +e, this.l = +n, this.opacity = +r;\n    }\n    function H(t, e, n) {\n      return 255 * (t < 60 ? e + (n - e) * t / 60 : t < 180 ? n : t < 240 ? e + (n - e) * (240 - t) / 60 : e);\n    }\n    function Z(t, e, n, r, i) {\n      var s = t * t,\n        o = s * t;\n      return ((1 - 3 * t + 3 * s - o) * e + (4 - 6 * s + 3 * o) * n + (1 + 3 * t + 3 * s - 3 * o) * r + o * i) / 6;\n    }\n    p(_, C, {\n      copy: function copy(t) {\n        return Object.assign(new this.constructor(), this, t);\n      },\n      displayable: function displayable() {\n        return this.rgb().displayable();\n      },\n      hex: z,\n      formatHex: z,\n      formatHsl: function formatHsl() {\n        return D(this).formatHsl();\n      },\n      formatRgb: O,\n      toString: O\n    }), p(U, L, m(_, {\n      brighter: function brighter(t) {\n        return t = null == t ? w : Math.pow(w, t), new U(this.r * t, this.g * t, this.b * t, this.opacity);\n      },\n      darker: function darker(t) {\n        return t = null == t ? b : Math.pow(b, t), new U(this.r * t, this.g * t, this.b * t, this.opacity);\n      },\n      rgb: function rgb() {\n        return this;\n      },\n      displayable: function displayable() {\n        return -.5 <= this.r && this.r < 255.5 && -.5 <= this.g && this.g < 255.5 && -.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;\n      },\n      hex: P,\n      formatHex: P,\n      formatRgb: $,\n      toString: $\n    })), p(q, function (t, e, n, r) {\n      return 1 === arguments.length ? D(t) : new q(t, e, n, null == r ? 1 : r);\n    }, m(_, {\n      brighter: function brighter(t) {\n        return t = null == t ? w : Math.pow(w, t), new q(this.h, this.s, this.l * t, this.opacity);\n      },\n      darker: function darker(t) {\n        return t = null == t ? b : Math.pow(b, t), new q(this.h, this.s, this.l * t, this.opacity);\n      },\n      rgb: function rgb() {\n        var t = this.h % 360 + 360 * (this.h < 0),\n          e = isNaN(t) || isNaN(this.s) ? 0 : this.s,\n          n = this.l,\n          r = n + (n < .5 ? n : 1 - n) * e,\n          i = 2 * n - r;\n        return new U(H(t >= 240 ? t - 240 : t + 120, i, r), H(t, i, r), H(t < 120 ? t + 240 : t - 120, i, r), this.opacity);\n      },\n      displayable: function displayable() {\n        return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;\n      },\n      formatHsl: function formatHsl() {\n        var t = this.opacity;\n        return (1 === (t = isNaN(t) ? 1 : Math.max(0, Math.min(1, t))) ? \"hsl(\" : \"hsla(\") + (this.h || 0) + \", \" + 100 * (this.s || 0) + \"%, \" + 100 * (this.l || 0) + \"%\" + (1 === t ? \")\" : \", \" + t + \")\");\n      }\n    }));\n    var G = function G(t) {\n      return function () {\n        return t;\n      };\n    };\n    function W(t, e) {\n      var n = e - t;\n      return n ? function (t, e) {\n        return function (n) {\n          return t + n * e;\n        };\n      }(t, n) : G(isNaN(t) ? e : t);\n    }\n    var X = function t(e) {\n      var n = function (t) {\n        return 1 == (t = +t) ? W : function (e, n) {\n          return n - e ? function (t, e, n) {\n            return t = Math.pow(t, n), e = Math.pow(e, n) - t, n = 1 / n, function (r) {\n              return Math.pow(t + r * e, n);\n            };\n          }(e, n, t) : G(isNaN(e) ? n : e);\n        };\n      }(e);\n      function r(t, e) {\n        var r = n((t = L(t)).r, (e = L(e)).r),\n          i = n(t.g, e.g),\n          s = n(t.b, e.b),\n          o = W(t.opacity, e.opacity);\n        return function (e) {\n          return t.r = r(e), t.g = i(e), t.b = s(e), t.opacity = o(e), t + \"\";\n        };\n      }\n      return r.gamma = t, r;\n    }(1);\n    function V(t) {\n      return function (e) {\n        var n,\n          r,\n          i = e.length,\n          s = new Array(i),\n          o = new Array(i),\n          a = new Array(i);\n        for (n = 0; n < i; ++n) r = L(e[n]), s[n] = r.r || 0, o[n] = r.g || 0, a[n] = r.b || 0;\n        return s = t(s), o = t(o), a = t(a), r.opacity = 1, function (t) {\n          return r.r = s(t), r.g = o(t), r.b = a(t), r + \"\";\n        };\n      };\n    }\n    function K(t, e) {\n      var n,\n        r = e ? e.length : 0,\n        i = t ? Math.min(r, t.length) : 0,\n        s = new Array(i),\n        o = new Array(r);\n      for (n = 0; n < i; ++n) s[n] = it(t[n], e[n]);\n      for (; n < r; ++n) o[n] = e[n];\n      return function (t) {\n        for (n = 0; n < i; ++n) o[n] = s[n](t);\n        return o;\n      };\n    }\n    function Y(t, e) {\n      var n = new Date();\n      return t = +t, e = +e, function (r) {\n        return n.setTime(t * (1 - r) + e * r), n;\n      };\n    }\n    function J(t, e) {\n      return t = +t, e = +e, function (n) {\n        return t * (1 - n) + e * n;\n      };\n    }\n    function Q(t, e) {\n      var n,\n        r = {},\n        i = {};\n      for (n in null !== t && \"object\" == _typeof(t) || (t = {}), null !== e && \"object\" == _typeof(e) || (e = {}), e) n in t ? r[n] = it(t[n], e[n]) : i[n] = e[n];\n      return function (t) {\n        for (n in r) i[n] = r[n](t);\n        return i;\n      };\n    }\n    V(function (t) {\n      var e = t.length - 1;\n      return function (n) {\n        var r = n <= 0 ? n = 0 : n >= 1 ? (n = 1, e - 1) : Math.floor(n * e),\n          i = t[r],\n          s = t[r + 1],\n          o = r > 0 ? t[r - 1] : 2 * i - s,\n          a = r < e - 1 ? t[r + 2] : 2 * s - i;\n        return Z((n - r / e) * e, o, i, s, a);\n      };\n    }), V(function (t) {\n      var e = t.length;\n      return function (n) {\n        var r = Math.floor(((n %= 1) < 0 ? ++n : n) * e),\n          i = t[(r + e - 1) % e],\n          s = t[r % e],\n          o = t[(r + 1) % e],\n          a = t[(r + 2) % e];\n        return Z((n - r / e) * e, i, s, o, a);\n      };\n    });\n    var tt = /[-+]?(?:\\d+\\.?\\d*|\\.?\\d+)(?:[eE][-+]?\\d+)?/g,\n      et = new RegExp(tt.source, \"g\");\n    function nt(t, e) {\n      var n,\n        r,\n        i,\n        s = tt.lastIndex = et.lastIndex = 0,\n        o = -1,\n        a = [],\n        l = [];\n      for (t += \"\", e += \"\"; (n = tt.exec(t)) && (r = et.exec(e));) (i = r.index) > s && (i = e.slice(s, i), a[o] ? a[o] += i : a[++o] = i), (n = n[0]) === (r = r[0]) ? a[o] ? a[o] += r : a[++o] = r : (a[++o] = null, l.push({\n        i: o,\n        x: J(n, r)\n      })), s = et.lastIndex;\n      return s < e.length && (i = e.slice(s), a[o] ? a[o] += i : a[++o] = i), a.length < 2 ? l[0] ? function (t) {\n        return function (e) {\n          return t(e) + \"\";\n        };\n      }(l[0].x) : function (t) {\n        return function () {\n          return t;\n        };\n      }(e) : (e = l.length, function (t) {\n        for (var n, r = 0; r < e; ++r) a[(n = l[r]).i] = n.x(t);\n        return a.join(\"\");\n      });\n    }\n    function rt(t, e) {\n      e || (e = []);\n      var n,\n        r = t ? Math.min(e.length, t.length) : 0,\n        i = e.slice();\n      return function (s) {\n        for (n = 0; n < r; ++n) i[n] = t[n] * (1 - s) + e[n] * s;\n        return i;\n      };\n    }\n    function it(t, e) {\n      var n,\n        r,\n        i = _typeof(e);\n      return null == e || \"boolean\" === i ? G(e) : (\"number\" === i ? J : \"string\" === i ? (n = C(e)) ? (e = n, X) : nt : e instanceof C ? X : e instanceof Date ? Y : (r = e, !ArrayBuffer.isView(r) || r instanceof DataView ? Array.isArray(e) ? K : \"function\" != typeof e.valueOf && \"function\" != typeof e.toString || isNaN(e) ? Q : J : rt))(t, e);\n    }\n    function st(t, e) {\n      return t = +t, e = +e, function (n) {\n        return Math.round(t * (1 - n) + e * n);\n      };\n    }\n    function ot(t) {\n      return +t;\n    }\n    var at = [0, 1];\n    function lt(t) {\n      return t;\n    }\n    function ht(t, e) {\n      return (e -= t = +t) ? function (n) {\n        return (n - t) / e;\n      } : (n = isNaN(e) ? NaN : .5, function () {\n        return n;\n      });\n      var n;\n    }\n    function ut(t, e, n) {\n      var r = t[0],\n        i = t[1],\n        s = e[0],\n        o = e[1];\n      return i < r ? (r = ht(i, r), s = n(o, s)) : (r = ht(r, i), s = n(s, o)), function (t) {\n        return s(r(t));\n      };\n    }\n    function ft(t, e, n) {\n      var r = Math.min(t.length, e.length) - 1,\n        i = new Array(r),\n        s = new Array(r),\n        o = -1;\n      for (t[r] < t[0] && (t = t.slice().reverse(), e = e.slice().reverse()); ++o < r;) i[o] = ht(t[o], t[o + 1]), s[o] = n(e[o], e[o + 1]);\n      return function (e) {\n        var n = g(t, e, 1, r) - 1;\n        return s[n](i[n](e));\n      };\n    }\n    var ct,\n      dt = /^(?:(.)?([<>=^]))?([+\\-( ])?([$#])?(0)?(\\d+)?(,)?(\\.\\d+)?(~)?([a-z%])?$/i;\n    function gt(t) {\n      if (!(e = dt.exec(t))) throw new Error(\"invalid format: \" + t);\n      var e;\n      return new pt({\n        fill: e[1],\n        align: e[2],\n        sign: e[3],\n        symbol: e[4],\n        zero: e[5],\n        width: e[6],\n        comma: e[7],\n        precision: e[8] && e[8].slice(1),\n        trim: e[9],\n        type: e[10]\n      });\n    }\n    function pt(t) {\n      this.fill = void 0 === t.fill ? \" \" : t.fill + \"\", this.align = void 0 === t.align ? \">\" : t.align + \"\", this.sign = void 0 === t.sign ? \"-\" : t.sign + \"\", this.symbol = void 0 === t.symbol ? \"\" : t.symbol + \"\", this.zero = !!t.zero, this.width = void 0 === t.width ? void 0 : +t.width, this.comma = !!t.comma, this.precision = void 0 === t.precision ? void 0 : +t.precision, this.trim = !!t.trim, this.type = void 0 === t.type ? \"\" : t.type + \"\";\n    }\n    function mt(t, e) {\n      if ((n = (t = e ? t.toExponential(e - 1) : t.toExponential()).indexOf(\"e\")) < 0) return null;\n      var n,\n        r = t.slice(0, n);\n      return [r.length > 1 ? r[0] + r.slice(2) : r, +t.slice(n + 1)];\n    }\n    function _t(t) {\n      return (t = mt(Math.abs(t))) ? t[1] : NaN;\n    }\n    function bt(t, e) {\n      var n = mt(t, e);\n      if (!n) return t + \"\";\n      var r = n[0],\n        i = n[1];\n      return i < 0 ? \"0.\" + new Array(-i).join(\"0\") + r : r.length > i + 1 ? r.slice(0, i + 1) + \".\" + r.slice(i + 1) : r + new Array(i - r.length + 2).join(\"0\");\n    }\n    gt.prototype = pt.prototype, pt.prototype.toString = function () {\n      return this.fill + this.align + this.sign + this.symbol + (this.zero ? \"0\" : \"\") + (void 0 === this.width ? \"\" : Math.max(1, 0 | this.width)) + (this.comma ? \",\" : \"\") + (void 0 === this.precision ? \"\" : \".\" + Math.max(0, 0 | this.precision)) + (this.trim ? \"~\" : \"\") + this.type;\n    };\n    var wt = {\n      \"%\": function _(t, e) {\n        return (100 * t).toFixed(e);\n      },\n      b: function b(t) {\n        return Math.round(t).toString(2);\n      },\n      c: function c(t) {\n        return t + \"\";\n      },\n      d: function d(t) {\n        return Math.abs(t = Math.round(t)) >= 1e21 ? t.toLocaleString(\"en\").replace(/,/g, \"\") : t.toString(10);\n      },\n      e: function e(t, _e32) {\n        return t.toExponential(_e32);\n      },\n      f: function f(t, e) {\n        return t.toFixed(e);\n      },\n      g: function g(t, e) {\n        return t.toPrecision(e);\n      },\n      o: function o(t) {\n        return Math.round(t).toString(8);\n      },\n      p: function p(t, e) {\n        return bt(100 * t, e);\n      },\n      r: bt,\n      s: function s(t, e) {\n        var n = mt(t, e);\n        if (!n) return t + \"\";\n        var r = n[0],\n          i = n[1],\n          s = i - (ct = 3 * Math.max(-8, Math.min(8, Math.floor(i / 3)))) + 1,\n          o = r.length;\n        return s === o ? r : s > o ? r + new Array(s - o + 1).join(\"0\") : s > 0 ? r.slice(0, s) + \".\" + r.slice(s) : \"0.\" + new Array(1 - s).join(\"0\") + mt(t, Math.max(0, e + s - 1))[0];\n      },\n      X: function X(t) {\n        return Math.round(t).toString(16).toUpperCase();\n      },\n      x: function x(t) {\n        return Math.round(t).toString(16);\n      }\n    };\n    function yt(t) {\n      return t;\n    }\n    var vt,\n      kt,\n      xt,\n      Et = Array.prototype.map,\n      At = [\"y\", \"z\", \"a\", \"f\", \"p\", \"n\", \"µ\", \"m\", \"\", \"k\", \"M\", \"G\", \"T\", \"P\", \"E\", \"Z\", \"Y\"];\n    function Bt(t) {\n      var e = t.domain;\n      return t.ticks = function (t) {\n        var n = e();\n        return function (t, e, n) {\n          var r,\n            i,\n            s,\n            o,\n            a = -1;\n          if (n = +n, (t = +t) == (e = +e) && n > 0) return [t];\n          if ((r = e < t) && (i = t, t = e, e = i), 0 === (o = h(t, e, n)) || !isFinite(o)) return [];\n          if (o > 0) {\n            var _n18 = Math.round(t / o),\n              _r21 = Math.round(e / o);\n            for (_n18 * o < t && ++_n18, _r21 * o > e && --_r21, s = new Array(i = _r21 - _n18 + 1); ++a < i;) s[a] = (_n18 + a) * o;\n          } else {\n            o = -o;\n            var _n19 = Math.round(t * o),\n              _r22 = Math.round(e * o);\n            for (_n19 / o < t && ++_n19, _r22 / o > e && --_r22, s = new Array(i = _r22 - _n19 + 1); ++a < i;) s[a] = (_n19 + a) / o;\n          }\n          return r && s.reverse(), s;\n        }(n[0], n[n.length - 1], null == t ? 10 : t);\n      }, t.tickFormat = function (t, n) {\n        var r = e();\n        return function (t, e, n, r) {\n          var i,\n            s = function (t, e, n) {\n              var r = Math.abs(e - t) / Math.max(0, n),\n                i = Math.pow(10, Math.floor(Math.log(r) / Math.LN10)),\n                s = r / i;\n              return s >= o ? i *= 10 : s >= a ? i *= 5 : s >= l && (i *= 2), e < t ? -i : i;\n            }(t, e, n);\n          switch ((r = gt(null == r ? \",f\" : r)).type) {\n            case \"s\":\n              var h = Math.max(Math.abs(t), Math.abs(e));\n              return null != r.precision || isNaN(i = function (t, e) {\n                return Math.max(0, 3 * Math.max(-8, Math.min(8, Math.floor(_t(e) / 3))) - _t(Math.abs(t)));\n              }(s, h)) || (r.precision = i), xt(r, h);\n            case \"\":\n            case \"e\":\n            case \"g\":\n            case \"p\":\n            case \"r\":\n              null != r.precision || isNaN(i = function (t, e) {\n                return t = Math.abs(t), e = Math.abs(e) - t, Math.max(0, _t(e) - _t(t)) + 1;\n              }(s, Math.max(Math.abs(t), Math.abs(e)))) || (r.precision = i - (\"e\" === r.type));\n              break;\n            case \"f\":\n            case \"%\":\n              null != r.precision || isNaN(i = function (t) {\n                return Math.max(0, -_t(Math.abs(t)));\n              }(s)) || (r.precision = i - 2 * (\"%\" === r.type));\n          }\n          return kt(r);\n        }(r[0], r[r.length - 1], null == t ? 10 : t, n);\n      }, t.nice = function (n) {\n        null == n && (n = 10);\n        var r,\n          i,\n          s = e(),\n          o = 0,\n          a = s.length - 1,\n          l = s[o],\n          u = s[a],\n          f = 10;\n        for (u < l && (i = l, l = u, u = i, i = o, o = a, a = i); f-- > 0;) {\n          if ((i = h(l, u, n)) === r) return s[o] = l, s[a] = u, e(s);\n          if (i > 0) l = Math.floor(l / i) * i, u = Math.ceil(u / i) * i;else {\n            if (!(i < 0)) break;\n            l = Math.ceil(l * i) / i, u = Math.floor(u * i) / i;\n          }\n          r = i;\n        }\n        return t;\n      }, t;\n    }\n    function St() {\n      var t = function () {\n        var t,\n          e,\n          n,\n          r,\n          i,\n          s,\n          o = at,\n          a = at,\n          l = it,\n          h = lt;\n        function u() {\n          var t,\n            e,\n            n,\n            l = Math.min(o.length, a.length);\n          return h !== lt && (t = o[0], e = o[l - 1], t > e && (n = t, t = e, e = n), h = function h(n) {\n            return Math.max(t, Math.min(e, n));\n          }), r = l > 2 ? ft : ut, i = s = null, f;\n        }\n        function f(e) {\n          return null == e || isNaN(e = +e) ? n : (i || (i = r(o.map(t), a, l)))(t(h(e)));\n        }\n        return f.invert = function (n) {\n          return h(e((s || (s = r(a, o.map(t), J)))(n)));\n        }, f.domain = function (t) {\n          return arguments.length ? (o = Array.from(t, ot), u()) : o.slice();\n        }, f.range = function (t) {\n          return arguments.length ? (a = Array.from(t), u()) : a.slice();\n        }, f.rangeRound = function (t) {\n          return a = Array.from(t), l = st, u();\n        }, f.clamp = function (t) {\n          return arguments.length ? (h = !!t || lt, u()) : h !== lt;\n        }, f.interpolate = function (t) {\n          return arguments.length ? (l = t, u()) : l;\n        }, f.unknown = function (t) {\n          return arguments.length ? (n = t, f) : n;\n        }, function (n, r) {\n          return t = n, e = r, u();\n        };\n      }()(lt, lt);\n      return t.copy = function () {\n        return e = t, St().domain(e.domain()).range(e.range()).interpolate(e.interpolate()).clamp(e.clamp()).unknown(e.unknown());\n        var e;\n      }, e.apply(t, arguments), Bt(t);\n    }\n    function It(t, e) {\n      if ((n = (t = e ? t.toExponential(e - 1) : t.toExponential()).indexOf(\"e\")) < 0) return null;\n      var n,\n        r = t.slice(0, n);\n      return [r.length > 1 ? r[0] + r.slice(2) : r, +t.slice(n + 1)];\n    }\n    vt = function (t) {\n      var e,\n        n,\n        r = void 0 === t.grouping || void 0 === t.thousands ? yt : (e = Et.call(t.grouping, Number), n = t.thousands + \"\", function (t, r) {\n          for (var i = t.length, s = [], o = 0, a = e[0], l = 0; i > 0 && a > 0 && (l + a + 1 > r && (a = Math.max(1, r - l)), s.push(t.substring(i -= a, i + a)), !((l += a + 1) > r));) a = e[o = (o + 1) % e.length];\n          return s.reverse().join(n);\n        }),\n        i = void 0 === t.currency ? \"\" : t.currency[0] + \"\",\n        s = void 0 === t.currency ? \"\" : t.currency[1] + \"\",\n        o = void 0 === t.decimal ? \".\" : t.decimal + \"\",\n        a = void 0 === t.numerals ? yt : function (t) {\n          return function (e) {\n            return e.replace(/[0-9]/g, function (e) {\n              return t[+e];\n            });\n          };\n        }(Et.call(t.numerals, String)),\n        l = void 0 === t.percent ? \"%\" : t.percent + \"\",\n        h = void 0 === t.minus ? \"−\" : t.minus + \"\",\n        u = void 0 === t.nan ? \"NaN\" : t.nan + \"\";\n      function f(t) {\n        var e = (t = gt(t)).fill,\n          n = t.align,\n          f = t.sign,\n          c = t.symbol,\n          d = t.zero,\n          g = t.width,\n          p = t.comma,\n          m = t.precision,\n          _ = t.trim,\n          b = t.type;\n        \"n\" === b ? (p = !0, b = \"g\") : wt[b] || (void 0 === m && (m = 12), _ = !0, b = \"g\"), (d || \"0\" === e && \"=\" === n) && (d = !0, e = \"0\", n = \"=\");\n        var w = \"$\" === c ? i : \"#\" === c && /[boxX]/.test(b) ? \"0\" + b.toLowerCase() : \"\",\n          y = \"$\" === c ? s : /[%p]/.test(b) ? l : \"\",\n          v = wt[b],\n          k = /[defgprs%]/.test(b);\n        function x(t) {\n          var i,\n            s,\n            l,\n            c = w,\n            x = y;\n          if (\"c\" === b) x = v(t) + x, t = \"\";else {\n            var E = (t = +t) < 0 || 1 / t < 0;\n            if (t = isNaN(t) ? u : v(Math.abs(t), m), _ && (t = function (t) {\n              t: for (var e, n = t.length, r = 1, i = -1; r < n; ++r) switch (t[r]) {\n                case \".\":\n                  i = e = r;\n                  break;\n                case \"0\":\n                  0 === i && (i = r), e = r;\n                  break;\n                default:\n                  if (!+t[r]) break t;\n                  i > 0 && (i = 0);\n              }\n              return i > 0 ? t.slice(0, i) + t.slice(e + 1) : t;\n            }(t)), E && 0 == +t && \"+\" !== f && (E = !1), c = (E ? \"(\" === f ? f : h : \"-\" === f || \"(\" === f ? \"\" : f) + c, x = (\"s\" === b ? At[8 + ct / 3] : \"\") + x + (E && \"(\" === f ? \")\" : \"\"), k) for (i = -1, s = t.length; ++i < s;) if (48 > (l = t.charCodeAt(i)) || l > 57) {\n              x = (46 === l ? o + t.slice(i + 1) : t.slice(i)) + x, t = t.slice(0, i);\n              break;\n            }\n          }\n          p && !d && (t = r(t, 1 / 0));\n          var A = c.length + t.length + x.length,\n            B = A < g ? new Array(g - A + 1).join(e) : \"\";\n          switch (p && d && (t = r(B + t, B.length ? g - x.length : 1 / 0), B = \"\"), n) {\n            case \"<\":\n              t = c + t + x + B;\n              break;\n            case \"=\":\n              t = c + B + t + x;\n              break;\n            case \"^\":\n              t = B.slice(0, A = B.length >> 1) + c + t + x + B.slice(A);\n              break;\n            default:\n              t = B + c + t + x;\n          }\n          return a(t);\n        }\n        return m = void 0 === m ? 6 : /[gprs]/.test(b) ? Math.max(1, Math.min(21, m)) : Math.max(0, Math.min(20, m)), x.toString = function () {\n          return t + \"\";\n        }, x;\n      }\n      return {\n        format: f,\n        formatPrefix: function formatPrefix(t, e) {\n          var n = f(((t = gt(t)).type = \"f\", t)),\n            r = 3 * Math.max(-8, Math.min(8, Math.floor(_t(e) / 3))),\n            i = Math.pow(10, -r),\n            s = At[8 + r / 3];\n          return function (t) {\n            return n(i * t) + s;\n          };\n        }\n      };\n    }({\n      thousands: \",\",\n      grouping: [3],\n      currency: [\"$\", \"\"]\n    }), kt = vt.format, xt = vt.formatPrefix;\n    var Mt,\n      Tt = /^(?:(.)?([<>=^]))?([+\\-( ])?([$#])?(0)?(\\d+)?(,)?(\\.\\d+)?(~)?([a-z%])?$/i;\n    function zt(t) {\n      if (!(e = Tt.exec(t))) throw new Error(\"invalid format: \" + t);\n      var e;\n      return new Ot({\n        fill: e[1],\n        align: e[2],\n        sign: e[3],\n        symbol: e[4],\n        zero: e[5],\n        width: e[6],\n        comma: e[7],\n        precision: e[8] && e[8].slice(1),\n        trim: e[9],\n        type: e[10]\n      });\n    }\n    function Ot(t) {\n      this.fill = void 0 === t.fill ? \" \" : t.fill + \"\", this.align = void 0 === t.align ? \">\" : t.align + \"\", this.sign = void 0 === t.sign ? \"-\" : t.sign + \"\", this.symbol = void 0 === t.symbol ? \"\" : t.symbol + \"\", this.zero = !!t.zero, this.width = void 0 === t.width ? void 0 : +t.width, this.comma = !!t.comma, this.precision = void 0 === t.precision ? void 0 : +t.precision, this.trim = !!t.trim, this.type = void 0 === t.type ? \"\" : t.type + \"\";\n    }\n    function Ct(t, e) {\n      var n = It(t, e);\n      if (!n) return t + \"\";\n      var r = n[0],\n        i = n[1];\n      return i < 0 ? \"0.\" + new Array(-i).join(\"0\") + r : r.length > i + 1 ? r.slice(0, i + 1) + \".\" + r.slice(i + 1) : r + new Array(i - r.length + 2).join(\"0\");\n    }\n    zt.prototype = Ot.prototype, Ot.prototype.toString = function () {\n      return this.fill + this.align + this.sign + this.symbol + (this.zero ? \"0\" : \"\") + (void 0 === this.width ? \"\" : Math.max(1, 0 | this.width)) + (this.comma ? \",\" : \"\") + (void 0 === this.precision ? \"\" : \".\" + Math.max(0, 0 | this.precision)) + (this.trim ? \"~\" : \"\") + this.type;\n    };\n    var Rt = {\n      \"%\": function _(t, e) {\n        return (100 * t).toFixed(e);\n      },\n      b: function b(t) {\n        return Math.round(t).toString(2);\n      },\n      c: function c(t) {\n        return t + \"\";\n      },\n      d: function d(t) {\n        return Math.abs(t = Math.round(t)) >= 1e21 ? t.toLocaleString(\"en\").replace(/,/g, \"\") : t.toString(10);\n      },\n      e: function e(t, _e33) {\n        return t.toExponential(_e33);\n      },\n      f: function f(t, e) {\n        return t.toFixed(e);\n      },\n      g: function g(t, e) {\n        return t.toPrecision(e);\n      },\n      o: function o(t) {\n        return Math.round(t).toString(8);\n      },\n      p: function p(t, e) {\n        return Ct(100 * t, e);\n      },\n      r: Ct,\n      s: function s(t, e) {\n        var n = It(t, e);\n        if (!n) return t + \"\";\n        var r = n[0],\n          i = n[1],\n          s = i - (Mt = 3 * Math.max(-8, Math.min(8, Math.floor(i / 3)))) + 1,\n          o = r.length;\n        return s === o ? r : s > o ? r + new Array(s - o + 1).join(\"0\") : s > 0 ? r.slice(0, s) + \".\" + r.slice(s) : \"0.\" + new Array(1 - s).join(\"0\") + It(t, Math.max(0, e + s - 1))[0];\n      },\n      X: function X(t) {\n        return Math.round(t).toString(16).toUpperCase();\n      },\n      x: function x(t) {\n        return Math.round(t).toString(16);\n      }\n    };\n    function Nt(t) {\n      return t;\n    }\n    var Lt,\n      Ut,\n      Pt = Array.prototype.map,\n      $t = [\"y\", \"z\", \"a\", \"f\", \"p\", \"n\", \"µ\", \"m\", \"\", \"k\", \"M\", \"G\", \"T\", \"P\", \"E\", \"Z\", \"Y\"];\n    Lt = function (t) {\n      var e,\n        n,\n        r = void 0 === t.grouping || void 0 === t.thousands ? Nt : (e = Pt.call(t.grouping, Number), n = t.thousands + \"\", function (t, r) {\n          for (var i = t.length, s = [], o = 0, a = e[0], l = 0; i > 0 && a > 0 && (l + a + 1 > r && (a = Math.max(1, r - l)), s.push(t.substring(i -= a, i + a)), !((l += a + 1) > r));) a = e[o = (o + 1) % e.length];\n          return s.reverse().join(n);\n        }),\n        i = void 0 === t.currency ? \"\" : t.currency[0] + \"\",\n        s = void 0 === t.currency ? \"\" : t.currency[1] + \"\",\n        o = void 0 === t.decimal ? \".\" : t.decimal + \"\",\n        a = void 0 === t.numerals ? Nt : function (t) {\n          return function (e) {\n            return e.replace(/[0-9]/g, function (e) {\n              return t[+e];\n            });\n          };\n        }(Pt.call(t.numerals, String)),\n        l = void 0 === t.percent ? \"%\" : t.percent + \"\",\n        h = void 0 === t.minus ? \"−\" : t.minus + \"\",\n        u = void 0 === t.nan ? \"NaN\" : t.nan + \"\";\n      function f(t) {\n        var e = (t = zt(t)).fill,\n          n = t.align,\n          f = t.sign,\n          c = t.symbol,\n          d = t.zero,\n          g = t.width,\n          p = t.comma,\n          m = t.precision,\n          _ = t.trim,\n          b = t.type;\n        \"n\" === b ? (p = !0, b = \"g\") : Rt[b] || (void 0 === m && (m = 12), _ = !0, b = \"g\"), (d || \"0\" === e && \"=\" === n) && (d = !0, e = \"0\", n = \"=\");\n        var w = \"$\" === c ? i : \"#\" === c && /[boxX]/.test(b) ? \"0\" + b.toLowerCase() : \"\",\n          y = \"$\" === c ? s : /[%p]/.test(b) ? l : \"\",\n          v = Rt[b],\n          k = /[defgprs%]/.test(b);\n        function x(t) {\n          var i,\n            s,\n            l,\n            c = w,\n            x = y;\n          if (\"c\" === b) x = v(t) + x, t = \"\";else {\n            var E = (t = +t) < 0 || 1 / t < 0;\n            if (t = isNaN(t) ? u : v(Math.abs(t), m), _ && (t = function (t) {\n              t: for (var e, n = t.length, r = 1, i = -1; r < n; ++r) switch (t[r]) {\n                case \".\":\n                  i = e = r;\n                  break;\n                case \"0\":\n                  0 === i && (i = r), e = r;\n                  break;\n                default:\n                  if (!+t[r]) break t;\n                  i > 0 && (i = 0);\n              }\n              return i > 0 ? t.slice(0, i) + t.slice(e + 1) : t;\n            }(t)), E && 0 == +t && \"+\" !== f && (E = !1), c = (E ? \"(\" === f ? f : h : \"-\" === f || \"(\" === f ? \"\" : f) + c, x = (\"s\" === b ? $t[8 + Mt / 3] : \"\") + x + (E && \"(\" === f ? \")\" : \"\"), k) for (i = -1, s = t.length; ++i < s;) if (48 > (l = t.charCodeAt(i)) || l > 57) {\n              x = (46 === l ? o + t.slice(i + 1) : t.slice(i)) + x, t = t.slice(0, i);\n              break;\n            }\n          }\n          p && !d && (t = r(t, 1 / 0));\n          var A = c.length + t.length + x.length,\n            B = A < g ? new Array(g - A + 1).join(e) : \"\";\n          switch (p && d && (t = r(B + t, B.length ? g - x.length : 1 / 0), B = \"\"), n) {\n            case \"<\":\n              t = c + t + x + B;\n              break;\n            case \"=\":\n              t = c + B + t + x;\n              break;\n            case \"^\":\n              t = B.slice(0, A = B.length >> 1) + c + t + x + B.slice(A);\n              break;\n            default:\n              t = B + c + t + x;\n          }\n          return a(t);\n        }\n        return m = void 0 === m ? 6 : /[gprs]/.test(b) ? Math.max(1, Math.min(21, m)) : Math.max(0, Math.min(20, m)), x.toString = function () {\n          return t + \"\";\n        }, x;\n      }\n      return {\n        format: f,\n        formatPrefix: function formatPrefix(t, e) {\n          var n,\n            r = f(((t = zt(t)).type = \"f\", t)),\n            i = 3 * Math.max(-8, Math.min(8, Math.floor((n = e, ((n = It(Math.abs(n))) ? n[1] : NaN) / 3)))),\n            s = Math.pow(10, -i),\n            o = $t[8 + i / 3];\n          return function (t) {\n            return r(s * t) + o;\n          };\n        }\n      };\n    }({\n      thousands: \",\",\n      grouping: [3],\n      currency: [\"$\", \"\"]\n    }), Ut = Lt.format, Lt.formatPrefix;\n    var jt = n(1934);\n    var Ft = jt.expose,\n      Dt = (jt.registerSerializer, jt.Transfer);\n    var qt = /*#__PURE__*/function () {\n      function qt(t, e) {\n        _classCallCheck(this, qt);\n        this.blockPosition = t, this.dataPosition = e;\n      }\n      _createClass(qt, [{\n        key: \"toString\",\n        value: function toString() {\n          return \"\".concat(this.blockPosition, \":\").concat(this.dataPosition);\n        }\n      }, {\n        key: \"compareTo\",\n        value: function compareTo(t) {\n          return this.blockPosition - t.blockPosition || this.dataPosition - t.dataPosition;\n        }\n      }], [{\n        key: \"min\",\n        value: function min() {\n          var e,\n            n = 0;\n          for (var _len = arguments.length, t = new Array(_len), _key = 0; _key < _len; _key++) {\n            t[_key] = arguments[_key];\n          }\n          for (; !e; n += 1) e = t[n];\n          for (; n < t.length; n += 1) e.compareTo(t[n]) > 0 && (e = t[n]);\n          return e;\n        }\n      }]);\n      return qt;\n    }();\n    function Ht(t) {\n      var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;\n      var n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : !1;\n      if (n) throw new Error(\"big-endian virtual file offsets not implemented\");\n      return new qt(1099511627776 * t[e + 7] + 4294967296 * t[e + 6] + 16777216 * t[e + 5] + 65536 * t[e + 4] + 256 * t[e + 3] + t[e + 2], t[e + 1] << 8 | t[e]);\n    }\n    var Zt = /*#__PURE__*/function () {\n      function Zt(t, e, n, r) {\n        _classCallCheck(this, Zt);\n        this.minv = t, this.maxv = e, this.bin = n, this._fetchedSize = r;\n      }\n      _createClass(Zt, [{\n        key: \"toUniqueString\",\n        value: function toUniqueString() {\n          return \"\".concat(this.minv.toString(), \"..\").concat(this.maxv.toString(), \" (bin \").concat(this.bin, \", fetchedSize \").concat(this.fetchedSize(), \")\");\n        }\n      }, {\n        key: \"toString\",\n        value: function toString() {\n          return this.toUniqueString();\n        }\n      }, {\n        key: \"compareTo\",\n        value: function compareTo(t) {\n          return this.minv.compareTo(t.minv) || this.maxv.compareTo(t.maxv) || this.bin - t.bin;\n        }\n      }, {\n        key: \"fetchedSize\",\n        value: function fetchedSize() {\n          return void 0 !== this._fetchedSize ? this._fetchedSize : this.maxv.blockPosition + 65536 - this.minv.blockPosition;\n        }\n      }]);\n      return Zt;\n    }();\n    var Gt = n(8806),\n      Wt = n.n(Gt);\n    function Xt(t) {\n      return new Promise(function (e) {\n        return setTimeout(e, t);\n      });\n    }\n    function Vt(t, e) {\n      var n = [];\n      var r;\n      if (0 === t.length) return t;\n      t.sort(function (t, e) {\n        var n = t.minv.blockPosition - e.minv.blockPosition;\n        return 0 === n ? t.minv.dataPosition - e.minv.dataPosition : n;\n      });\n      var _iterator10 = _createForOfIteratorHelper(t),\n        _step10;\n      try {\n        for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {\n          var _o10 = _step10.value;\n          (!e || _o10.maxv.compareTo(e) > 0) && (void 0 === r ? (n.push(_o10), r = _o10) : (i = r, (s = _o10).minv.blockPosition - i.maxv.blockPosition < 65e3 && s.maxv.blockPosition - i.minv.blockPosition < 5e6 ? _o10.maxv.compareTo(r.maxv) > 0 && (r.maxv = _o10.maxv) : (n.push(_o10), r = _o10)));\n        }\n      } catch (err) {\n        _iterator10.e(err);\n      } finally {\n        _iterator10.f();\n      }\n      var i, s;\n      return n;\n    }\n    function Kt(t, e) {\n      return {\n        lineCount: function (t) {\n          if (t.greaterThan(Number.MAX_SAFE_INTEGER) || t.lessThan(Number.MIN_SAFE_INTEGER)) throw new Error(\"integer overflow\");\n          return t.toNumber();\n        }(Wt().fromBytesLE(Array.prototype.slice.call(t, e, e + 8), !0))\n      };\n    }\n    function Yt(t, e) {\n      return t ? t.compareTo(e) > 0 ? e : t : e;\n    }\n    function Jt(t) {\n      var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (t) {\n        return t;\n      };\n      var n = 0,\n        r = 0;\n      var i = [],\n        s = {};\n      for (var _o11 = 0; _o11 < t.length; _o11 += 1) if (!t[_o11]) {\n        if (r < _o11) {\n          var _a5 = t.toString(\"utf8\", r, _o11);\n          _a5 = e(_a5), i[n] = _a5, s[_a5] = n;\n        }\n        r = _o11 + 1, n += 1;\n      }\n      return {\n        refNameToId: s,\n        refIdToName: i\n      };\n    }\n    var Qt = /*#__PURE__*/_createClass(function Qt(_ref16) {\n      var t = _ref16.filehandle,\n        _ref16$renameRefSeq = _ref16.renameRefSeq,\n        e = _ref16$renameRefSeq === void 0 ? function (t) {\n          return t;\n        } : _ref16$renameRefSeq;\n      _classCallCheck(this, Qt);\n      this.filehandle = t, this.renameRefSeq = e;\n    });\n    var te = /*#__PURE__*/function (_Qt) {\n      _inherits(te, _Qt);\n      var _super3 = _createSuper(te);\n      function te() {\n        _classCallCheck(this, te);\n        return _super3.apply(this, arguments);\n      }\n      _createClass(te, [{\n        key: \"lineCount\",\n        value: function () {\n          var _lineCount = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee29(t, e) {\n            var n, r;\n            return _regeneratorRuntime().wrap(function _callee29$(_context32) {\n              while (1) switch (_context32.prev = _context32.next) {\n                case 0:\n                  _context32.next = 2;\n                  return this.parse(e);\n                case 2:\n                  _context32.t3 = t;\n                  _context32.t4 = n = _context32.sent.indices[_context32.t3];\n                  _context32.t2 = null === _context32.t4;\n                  if (_context32.t2) {\n                    _context32.next = 7;\n                    break;\n                  }\n                  _context32.t2 = void 0 === n;\n                case 7:\n                  if (!_context32.t2) {\n                    _context32.next = 11;\n                    break;\n                  }\n                  _context32.t5 = void 0;\n                  _context32.next = 12;\n                  break;\n                case 11:\n                  _context32.t5 = n.stats;\n                case 12:\n                  _context32.t6 = r = _context32.t5;\n                  _context32.t1 = null === _context32.t6;\n                  if (_context32.t1) {\n                    _context32.next = 16;\n                    break;\n                  }\n                  _context32.t1 = void 0 === r;\n                case 16:\n                  if (!_context32.t1) {\n                    _context32.next = 20;\n                    break;\n                  }\n                  _context32.t7 = void 0;\n                  _context32.next = 21;\n                  break;\n                case 20:\n                  _context32.t7 = r.lineCount;\n                case 21:\n                  _context32.t0 = _context32.t7;\n                  if (_context32.t0) {\n                    _context32.next = 24;\n                    break;\n                  }\n                  _context32.t0 = 0;\n                case 24:\n                  return _context32.abrupt(\"return\", _context32.t0);\n                case 25:\n                case \"end\":\n                  return _context32.stop();\n              }\n            }, _callee29, this);\n          }));\n          function lineCount(_x40, _x41) {\n            return _lineCount.apply(this, arguments);\n          }\n          return lineCount;\n        }()\n      }, {\n        key: \"_parse\",\n        value: function () {\n          var _parse2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee30(t) {\n            var e, n, r, i, s, _t19, _n20, _o12, _a6, _t20, _t21, _n21, _s8, _o13, _n22, _a7, _l4, _h3, _t22, _n23;\n            return _regeneratorRuntime().wrap(function _callee30$(_context33) {\n              while (1) switch (_context33.prev = _context33.next) {\n                case 0:\n                  _context33.next = 2;\n                  return this.filehandle.readFile(t);\n                case 2:\n                  e = _context33.sent;\n                  if (!(21578050 !== e.readUInt32LE(0))) {\n                    _context33.next = 5;\n                    break;\n                  }\n                  throw new Error(\"Not a BAI file\");\n                case 5:\n                  n = e.readInt32LE(4);\n                  i = 8;\n                  s = new Array(n);\n                  _t19 = 0;\n                case 9:\n                  if (!(_t19 < n)) {\n                    _context33.next = 39;\n                    break;\n                  }\n                  _n20 = e.readInt32LE(i);\n                  _o12 = void 0;\n                  i += 4;\n                  _a6 = {};\n                  _t20 = 0;\n                case 15:\n                  if (!(_t20 < _n20)) {\n                    _context33.next = 31;\n                    break;\n                  }\n                  _t21 = e.readUInt32LE(i);\n                  if (!(i += 4, 37450 === _t21)) {\n                    _context33.next = 21;\n                    break;\n                  }\n                  i += 4, _o12 = Kt(e, i + 16), i += 32;\n                  _context33.next = 28;\n                  break;\n                case 21:\n                  if (!(_t21 > 37450)) {\n                    _context33.next = 23;\n                    break;\n                  }\n                  throw new Error(\"bai index contains too many bins, please use CSI\");\n                case 23:\n                  _n21 = e.readInt32LE(i);\n                  i += 4;\n                  _s8 = new Array(_n21);\n                  for (_o13 = 0; _o13 < _n21; _o13++) {\n                    _n22 = Ht(e, i);\n                    i += 8;\n                    _a7 = Ht(e, i);\n                    i += 8, r = Yt(r, _n22), _s8[_o13] = new Zt(_n22, _a7, _t21);\n                  }\n                  _a6[_t21] = _s8;\n                case 28:\n                  _t20 += 1;\n                  _context33.next = 15;\n                  break;\n                case 31:\n                  _l4 = e.readInt32LE(i);\n                  i += 4;\n                  _h3 = new Array(_l4);\n                  for (_t22 = 0; _t22 < _l4; _t22++) {\n                    _n23 = Ht(e, i);\n                    i += 8, r = Yt(r, _n23), _h3[_t22] = _n23;\n                  }\n                  s[_t19] = {\n                    binIndex: _a6,\n                    linearIndex: _h3,\n                    stats: _o12\n                  };\n                case 36:\n                  _t19++;\n                  _context33.next = 9;\n                  break;\n                case 39:\n                  return _context33.abrupt(\"return\", {\n                    bai: !0,\n                    firstDataLine: r,\n                    maxBlockSize: 65536,\n                    indices: s,\n                    refCount: n\n                  });\n                case 40:\n                case \"end\":\n                  return _context33.stop();\n              }\n            }, _callee30, this);\n          }));\n          function _parse(_x42) {\n            return _parse2.apply(this, arguments);\n          }\n          return _parse;\n        }()\n      }, {\n        key: \"indexCov\",\n        value: function () {\n          var _indexCov = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee31(t, e, n) {\n            var r,\n              i,\n              s,\n              o,\n              _o$linearIndex,\n              a,\n              l,\n              h,\n              u,\n              f,\n              c,\n              d,\n              g,\n              _t23,\n              _e34,\n              _args34 = arguments;\n            return _regeneratorRuntime().wrap(function _callee31$(_context34) {\n              while (1) switch (_context34.prev = _context34.next) {\n                case 0:\n                  r = _args34.length > 3 && _args34[3] !== undefined ? _args34[3] : {};\n                  i = 16384;\n                  s = void 0 !== e;\n                  _context34.next = 5;\n                  return this.parse(r);\n                case 5:\n                  _context34.t0 = t;\n                  o = _context34.sent.indices[_context34.t0];\n                  if (o) {\n                    _context34.next = 9;\n                    break;\n                  }\n                  return _context34.abrupt(\"return\", []);\n                case 9:\n                  _o$linearIndex = o.linearIndex, a = _o$linearIndex === void 0 ? [] : _o$linearIndex, l = o.stats;\n                  if (!(0 === a.length)) {\n                    _context34.next = 12;\n                    break;\n                  }\n                  return _context34.abrupt(\"return\", []);\n                case 12:\n                  h = void 0 === n ? (a.length - 1) * i : (u = n) - u % i + 16384;\n                  f = void 0 === e ? 0 : function (t, e) {\n                    return t - t % 16384;\n                  }(e), c = new Array(s ? (h - f) / i : a.length - 1), d = a[a.length - 1].blockPosition;\n                  if (!(h > (a.length - 1) * i)) {\n                    _context34.next = 16;\n                    break;\n                  }\n                  throw new Error(\"query outside of range of linear index\");\n                case 16:\n                  g = a[f / i].blockPosition;\n                  for (_t23 = f / i, _e34 = 0; _t23 < h / i; _t23++, _e34++) c[_e34] = {\n                    score: a[_t23 + 1].blockPosition - g,\n                    start: _t23 * i,\n                    end: _t23 * i + i\n                  }, g = a[_t23 + 1].blockPosition;\n                  return _context34.abrupt(\"return\", c.map(function (t) {\n                    return _objectSpread(_objectSpread({}, t), {}, {\n                      score: t.score * ((null == l ? void 0 : l.lineCount) || 0) / d\n                    });\n                  }));\n                case 19:\n                case \"end\":\n                  return _context34.stop();\n              }\n            }, _callee31, this);\n          }));\n          function indexCov(_x43, _x44, _x45) {\n            return _indexCov.apply(this, arguments);\n          }\n          return indexCov;\n        }()\n      }, {\n        key: \"blocksForRange\",\n        value: function () {\n          var _blocksForRange = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee32(t, e, n) {\n            var r,\n              i,\n              s,\n              o,\n              a,\n              l,\n              h,\n              _i14,\n              _o14,\n              _o14$_i,\n              _t24,\n              _e35,\n              _n24,\n              _t25,\n              _iterator11,\n              _step11,\n              _e36,\n              u,\n              f,\n              c,\n              d,\n              _t26,\n              _e37,\n              _args35 = arguments;\n            return _regeneratorRuntime().wrap(function _callee32$(_context35) {\n              while (1) switch (_context35.prev = _context35.next) {\n                case 0:\n                  r = _args35.length > 3 && _args35[3] !== undefined ? _args35[3] : {};\n                  e < 0 && (e = 0);\n                  _context35.next = 4;\n                  return this.parse(r);\n                case 4:\n                  i = _context35.sent;\n                  if (i) {\n                    _context35.next = 7;\n                    break;\n                  }\n                  return _context35.abrupt(\"return\", []);\n                case 7:\n                  s = i.indices[t];\n                  if (s) {\n                    _context35.next = 10;\n                    break;\n                  }\n                  return _context35.abrupt(\"return\", []);\n                case 10:\n                  o = (l = n, [[0, 0], [1 + ((a = e) >> 26), 1 + ((l -= 1) >> 26)], [9 + (a >> 23), 9 + (l >> 23)], [73 + (a >> 20), 73 + (l >> 20)], [585 + (a >> 17), 585 + (l >> 17)], [4681 + (a >> 14), 4681 + (l >> 14)]]);\n                  h = [];\n                  for (_i14 = 0, _o14 = o; _i14 < _o14.length; _i14++) {\n                    _o14$_i = _slicedToArray(_o14[_i14], 2), _t24 = _o14$_i[0], _e35 = _o14$_i[1];\n                    for (_n24 = _t24; _n24 <= _e35; _n24++) if (s.binIndex[_n24]) {\n                      _t25 = s.binIndex[_n24];\n                      _iterator11 = _createForOfIteratorHelper(_t25);\n                      try {\n                        for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {\n                          _e36 = _step11.value;\n                          h.push(_e36);\n                        }\n                      } catch (err) {\n                        _iterator11.e(err);\n                      } finally {\n                        _iterator11.f();\n                      }\n                    }\n                  }\n                  u = s.linearIndex.length;\n                  c = Math.min(e >> 14, u - 1), d = Math.min(n >> 14, u - 1);\n                  for (_t26 = c; _t26 <= d; ++_t26) {\n                    _e37 = s.linearIndex[_t26];\n                    _e37 && (!f || _e37.compareTo(f) < 0) && (f = _e37);\n                  }\n                  return _context35.abrupt(\"return\", Vt(h, f));\n                case 17:\n                case \"end\":\n                  return _context35.stop();\n              }\n            }, _callee32, this);\n          }));\n          function blocksForRange(_x46, _x47, _x48) {\n            return _blocksForRange.apply(this, arguments);\n          }\n          return blocksForRange;\n        }()\n      }, {\n        key: \"parse\",\n        value: function () {\n          var _parse3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee33() {\n            var _this12 = this;\n            var t,\n              _args36 = arguments;\n            return _regeneratorRuntime().wrap(function _callee33$(_context36) {\n              while (1) switch (_context36.prev = _context36.next) {\n                case 0:\n                  t = _args36.length > 0 && _args36[0] !== undefined ? _args36[0] : {};\n                  return _context36.abrupt(\"return\", (this.setupP || (this.setupP = this._parse(t)[\"catch\"](function (t) {\n                    throw _this12.setupP = void 0, t;\n                  })), this.setupP));\n                case 2:\n                case \"end\":\n                  return _context36.stop();\n              }\n            }, _callee33, this);\n          }));\n          function parse() {\n            return _parse3.apply(this, arguments);\n          }\n          return parse;\n        }()\n      }, {\n        key: \"hasRefSeq\",\n        value: function () {\n          var _hasRefSeq = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee34(t) {\n            var e,\n              n,\n              _args37 = arguments;\n            return _regeneratorRuntime().wrap(function _callee34$(_context37) {\n              while (1) switch (_context37.prev = _context37.next) {\n                case 0:\n                  e = _args37.length > 1 && _args37[1] !== undefined ? _args37[1] : {};\n                  _context37.next = 3;\n                  return this.parse(e);\n                case 3:\n                  _context37.t1 = t;\n                  _context37.t2 = n = _context37.sent.indices[_context37.t1];\n                  _context37.t0 = null === _context37.t2;\n                  if (_context37.t0) {\n                    _context37.next = 8;\n                    break;\n                  }\n                  _context37.t0 = void 0 === n;\n                case 8:\n                  if (!_context37.t0) {\n                    _context37.next = 12;\n                    break;\n                  }\n                  _context37.t3 = void 0;\n                  _context37.next = 13;\n                  break;\n                case 12:\n                  _context37.t3 = n.binIndex;\n                case 13:\n                  return _context37.abrupt(\"return\", !!_context37.t3);\n                case 14:\n                case \"end\":\n                  return _context37.stop();\n              }\n            }, _callee34, this);\n          }));\n          function hasRefSeq(_x49) {\n            return _hasRefSeq.apply(this, arguments);\n          }\n          return hasRefSeq;\n        }()\n      }]);\n      return te;\n    }(Qt);\n    var ee = n(8764);\n    function ne(t) {\n      return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, \"default\") ? t[\"default\"] : t;\n    }\n    var re = new Int32Array([0, 1996959894, 3993919788, 2567524794, 124634137, 1886057615, 3915621685, 2657392035, 249268274, 2044508324, 3772115230, 2547177864, 162941995, 2125561021, 3887607047, 2428444049, 498536548, 1789927666, 4089016648, 2227061214, 450548861, 1843258603, 4107580753, 2211677639, 325883990, 1684777152, 4251122042, 2321926636, 335633487, 1661365465, 4195302755, 2366115317, 997073096, 1281953886, 3579855332, 2724688242, 1006888145, 1258607687, 3524101629, 2768942443, 901097722, 1119000684, 3686517206, 2898065728, 853044451, 1172266101, 3705015759, 2882616665, 651767980, 1373503546, 3369554304, 3218104598, 565507253, 1454621731, 3485111705, 3099436303, 671266974, 1594198024, 3322730930, 2970347812, 795835527, 1483230225, 3244367275, 3060149565, 1994146192, 31158534, 2563907772, 4023717930, 1907459465, 112637215, 2680153253, 3904427059, 2013776290, 251722036, 2517215374, 3775830040, 2137656763, 141376813, 2439277719, 3865271297, 1802195444, 476864866, 2238001368, 4066508878, 1812370925, 453092731, 2181625025, 4111451223, 1706088902, 314042704, 2344532202, 4240017532, 1658658271, 366619977, 2362670323, 4224994405, 1303535960, 984961486, 2747007092, 3569037538, 1256170817, 1037604311, 2765210733, 3554079995, 1131014506, 879679996, 2909243462, 3663771856, 1141124467, 855842277, 2852801631, 3708648649, 1342533948, 654459306, 3188396048, 3373015174, 1466479909, 544179635, 3110523913, 3462522015, 1591671054, 702138776, 2966460450, 3352799412, 1504918807, 783551873, 3082640443, 3233442989, 3988292384, 2596254646, 62317068, 1957810842, 3939845945, 2647816111, 81470997, 1943803523, 3814918930, 2489596804, 225274430, 2053790376, 3826175755, 2466906013, 167816743, 2097651377, 4027552580, 2265490386, 503444072, 1762050814, 4150417245, 2154129355, 426522225, 1852507879, 4275313526, 2312317920, 282753626, 1742555852, 4189708143, 2394877945, 397917763, 1622183637, 3604390888, 2714866558, 953729732, 1340076626, 3518719985, 2797360999, 1068828381, 1219638859, 3624741850, 2936675148, 906185462, 1090812512, 3747672003, 2825379669, 829329135, 1181335161, 3412177804, 3160834842, 628085408, 1382605366, 3423369109, 3138078467, 570562233, 1426400815, 3317316542, 2998733608, 733239954, 1555261956, 3268935591, 3050360625, 752459403, 1541320221, 2607071920, 3965973030, 1969922972, 40735498, 2617837225, 3943577151, 1913087877, 83908371, 2512341634, 3803740692, 2075208622, 213261112, 2463272603, 3855990285, 2094854071, 198958881, 2262029012, 4057260610, 1759359992, 534414190, 2176718541, 4139329115, 1873836001, 414664567, 2282248934, 4279200368, 1711684554, 285281116, 2405801727, 4167216745, 1634467795, 376229701, 2685067896, 3608007406, 1308918612, 956543938, 2808555105, 3495958263, 1231636301, 1047427035, 2932959818, 3654703836, 1088359270, 936918e3, 2847714899, 3736837829, 1202900863, 817233897, 3183342108, 3401237130, 1404277552, 615818150, 3134207493, 3453421203, 1423857449, 601450431, 3009837614, 3294710456, 1567103746, 711928724, 3020668471, 3272380065, 1510334235, 755167117]);\n    function ie(t) {\n      if (Buffer.isBuffer(t)) return t;\n      if (\"number\" == typeof t) return Buffer.alloc(t);\n      if (\"string\" == typeof t) return Buffer.from(t);\n      throw new Error(\"input must be buffer, number, or string, received \" + _typeof(t));\n    }\n    function se(t, e) {\n      t = ie(t), Buffer.isBuffer(e) && (e = e.readUInt32BE(0));\n      var n = -1 ^ ~~e;\n      for (var r = 0; r < t.length; r++) n = re[255 & (n ^ t[r])] ^ n >>> 8;\n      return -1 ^ n;\n    }\n    function oe() {\n      return function (t) {\n        var e = ie(4);\n        return e.writeInt32BE(t, 0), e;\n      }(se.apply(null, arguments));\n    }\n    oe.signed = function () {\n      return se.apply(null, arguments);\n    }, oe.unsigned = function () {\n      return se.apply(null, arguments) >>> 0;\n    };\n    var ae = ne(oe);\n    var le = n(1334),\n      he = n.n(le);\n    var ue = /*#__PURE__*/function () {\n      function ue(t) {\n        var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n        _classCallCheck(this, ue);\n        this.baseOverrides = {}, this.url = t;\n        var n = e.fetch || globalThis.fetch.bind(globalThis);\n        if (!n) throw new TypeError(\"no fetch function supplied, and none found in global environment\");\n        e.overrides && (this.baseOverrides = e.overrides), this.fetchImplementation = n;\n      }\n      _createClass(ue, [{\n        key: \"getBufferFromResponse\",\n        value: function () {\n          var _getBufferFromResponse2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee35(t) {\n            var e;\n            return _regeneratorRuntime().wrap(function _callee35$(_context38) {\n              while (1) switch (_context38.prev = _context38.next) {\n                case 0:\n                  _context38.next = 2;\n                  return t.arrayBuffer();\n                case 2:\n                  e = _context38.sent;\n                  return _context38.abrupt(\"return\", ee.lW.from(e));\n                case 4:\n                case \"end\":\n                  return _context38.stop();\n              }\n            }, _callee35);\n          }));\n          function getBufferFromResponse(_x50) {\n            return _getBufferFromResponse2.apply(this, arguments);\n          }\n          return getBufferFromResponse;\n        }()\n      }, {\n        key: \"fetch\",\n        value: function () {\n          var _fetch3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee36(t, e) {\n            var n;\n            return _regeneratorRuntime().wrap(function _callee36$(_context39) {\n              while (1) switch (_context39.prev = _context39.next) {\n                case 0:\n                  _context39.prev = 0;\n                  _context39.next = 3;\n                  return this.fetchImplementation(t, e);\n                case 3:\n                  n = _context39.sent;\n                  _context39.next = 14;\n                  break;\n                case 6:\n                  _context39.prev = 6;\n                  _context39.t0 = _context39[\"catch\"](0);\n                  if (\"\".concat(_context39.t0).includes(\"Failed to fetch\")) {\n                    _context39.next = 10;\n                    break;\n                  }\n                  throw _context39.t0;\n                case 10:\n                  console.warn(\"generic-filehandle: refetching \".concat(t, \" to attempt to work around chrome CORS header caching bug\"));\n                  _context39.next = 13;\n                  return this.fetchImplementation(t, _objectSpread(_objectSpread({}, e), {}, {\n                    cache: \"reload\"\n                  }));\n                case 13:\n                  n = _context39.sent;\n                case 14:\n                  return _context39.abrupt(\"return\", n);\n                case 15:\n                case \"end\":\n                  return _context39.stop();\n              }\n            }, _callee36, this, [[0, 6]]);\n          }));\n          function fetch(_x51, _x52) {\n            return _fetch3.apply(this, arguments);\n          }\n          return fetch;\n        }()\n      }, {\n        key: \"read\",\n        value: function () {\n          var _read3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee37(t) {\n            var e,\n              n,\n              r,\n              i,\n              _i$headers2,\n              s,\n              o,\n              _i$overrides2,\n              a,\n              l,\n              h,\n              _r23,\n              _i15,\n              _s9,\n              _o15,\n              _args40 = arguments;\n            return _regeneratorRuntime().wrap(function _callee37$(_context40) {\n              while (1) switch (_context40.prev = _context40.next) {\n                case 0:\n                  e = _args40.length > 1 && _args40[1] !== undefined ? _args40[1] : 0;\n                  n = _args40.length > 2 ? _args40[2] : undefined;\n                  r = _args40.length > 3 && _args40[3] !== undefined ? _args40[3] : 0;\n                  i = _args40.length > 4 && _args40[4] !== undefined ? _args40[4] : {};\n                  _i$headers2 = i.headers, s = _i$headers2 === void 0 ? {} : _i$headers2, o = i.signal, _i$overrides2 = i.overrides, a = _i$overrides2 === void 0 ? {} : _i$overrides2;\n                  n < 1 / 0 ? s.range = \"bytes=\".concat(r, \"-\").concat(r + n) : n === 1 / 0 && 0 !== r && (s.range = \"bytes=\".concat(r, \"-\"));\n                  l = _objectSpread(_objectSpread(_objectSpread({}, this.baseOverrides), a), {}, {\n                    headers: _objectSpread(_objectSpread(_objectSpread({}, s), a.headers), this.baseOverrides.headers),\n                    method: \"GET\",\n                    redirect: \"follow\",\n                    mode: \"cors\",\n                    signal: o\n                  });\n                  _context40.next = 9;\n                  return this.fetch(this.url, l);\n                case 9:\n                  h = _context40.sent;\n                  if (h.ok) {\n                    _context40.next = 12;\n                    break;\n                  }\n                  throw new Error(\"HTTP \".concat(h.status, \" \").concat(h.statusText, \" \").concat(this.url));\n                case 12:\n                  if (!(200 === h.status && 0 === r || 206 === h.status)) {\n                    _context40.next = 20;\n                    break;\n                  }\n                  _context40.next = 15;\n                  return this.getBufferFromResponse(h);\n                case 15:\n                  _r23 = _context40.sent;\n                  _i15 = _r23.copy(t, e, 0, Math.min(n, _r23.length));\n                  _s9 = h.headers.get(\"content-range\");\n                  _o15 = /\\/(\\d+)$/.exec(_s9 || \"\");\n                  return _context40.abrupt(\"return\", ((null == _o15 ? void 0 : _o15[1]) && (this._stat = {\n                    size: parseInt(_o15[1], 10)\n                  }), {\n                    bytesRead: _i15,\n                    buffer: t\n                  }));\n                case 20:\n                  if (!(200 === h.status)) {\n                    _context40.next = 22;\n                    break;\n                  }\n                  throw new Error(\"${this.url} fetch returned status 200, expected 206\");\n                case 22:\n                  throw new Error(\"HTTP \".concat(h.status, \" fetching \").concat(this.url));\n                case 23:\n                case \"end\":\n                  return _context40.stop();\n              }\n            }, _callee37, this);\n          }));\n          function read(_x53) {\n            return _read3.apply(this, arguments);\n          }\n          return read;\n        }()\n      }, {\n        key: \"readFile\",\n        value: function () {\n          var _readFile2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee38() {\n            var t,\n              e,\n              n,\n              _n25,\n              _n25$headers,\n              r,\n              i,\n              _n25$overrides,\n              s,\n              o,\n              a,\n              _args41 = arguments;\n            return _regeneratorRuntime().wrap(function _callee38$(_context41) {\n              while (1) switch (_context41.prev = _context41.next) {\n                case 0:\n                  t = _args41.length > 0 && _args41[0] !== undefined ? _args41[0] : {};\n                  \"string\" == typeof t ? (e = t, n = {}) : (e = t.encoding, n = t, delete n.encoding);\n                  _n25 = n;\n                  _n25$headers = _n25.headers;\n                  r = _n25$headers === void 0 ? {} : _n25$headers;\n                  i = _n25.signal;\n                  _n25$overrides = _n25.overrides;\n                  s = _n25$overrides === void 0 ? {} : _n25$overrides;\n                  o = _objectSpread(_objectSpread({\n                    headers: r,\n                    method: \"GET\",\n                    redirect: \"follow\",\n                    mode: \"cors\",\n                    signal: i\n                  }, this.baseOverrides), s);\n                  _context41.next = 11;\n                  return this.fetch(this.url, o);\n                case 11:\n                  a = _context41.sent;\n                  if (a) {\n                    _context41.next = 14;\n                    break;\n                  }\n                  throw new Error(\"generic-filehandle failed to fetch\");\n                case 14:\n                  if (!(200 !== a.status)) {\n                    _context41.next = 16;\n                    break;\n                  }\n                  throw Object.assign(new Error(\"HTTP \".concat(a.status, \" fetching \").concat(this.url)), {\n                    status: a.status\n                  });\n                case 16:\n                  if (!(\"utf8\" === e)) {\n                    _context41.next = 18;\n                    break;\n                  }\n                  return _context41.abrupt(\"return\", a.text());\n                case 18:\n                  if (!e) {\n                    _context41.next = 20;\n                    break;\n                  }\n                  throw new Error(\"unsupported encoding: \".concat(e));\n                case 20:\n                  return _context41.abrupt(\"return\", this.getBufferFromResponse(a));\n                case 21:\n                case \"end\":\n                  return _context41.stop();\n              }\n            }, _callee38, this);\n          }));\n          function readFile() {\n            return _readFile2.apply(this, arguments);\n          }\n          return readFile;\n        }()\n      }, {\n        key: \"stat\",\n        value: function () {\n          var _stat3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee39() {\n            var _t27;\n            return _regeneratorRuntime().wrap(function _callee39$(_context42) {\n              while (1) switch (_context42.prev = _context42.next) {\n                case 0:\n                  if (this._stat) {\n                    _context42.next = 6;\n                    break;\n                  }\n                  _t27 = ee.lW.allocUnsafe(10);\n                  _context42.next = 4;\n                  return this.read(_t27, 0, 10, 0);\n                case 4:\n                  if (this._stat) {\n                    _context42.next = 6;\n                    break;\n                  }\n                  throw new Error(\"unable to determine size of file at \".concat(this.url));\n                case 6:\n                  return _context42.abrupt(\"return\", this._stat);\n                case 7:\n                case \"end\":\n                  return _context42.stop();\n              }\n            }, _callee39, this);\n          }));\n          function stat() {\n            return _stat3.apply(this, arguments);\n          }\n          return stat;\n        }()\n      }, {\n        key: \"close\",\n        value: function () {\n          var _close2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee40() {\n            return _regeneratorRuntime().wrap(function _callee40$(_context43) {\n              while (1) switch (_context43.prev = _context43.next) {\n                case 0:\n                case \"end\":\n                  return _context43.stop();\n              }\n            }, _callee40);\n          }));\n          function close() {\n            return _close2.apply(this, arguments);\n          }\n          return close;\n        }()\n      }]);\n      return ue;\n    }();\n    var fe = n(9777);\n    function ce(_x54) {\n      return _ce.apply(this, arguments);\n    }\n    function _ce() {\n      _ce = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee68(t) {\n        var e, _n48, r, i, _s26, _o28, _s27, _a15, a, _t95, _e87;\n        return _regeneratorRuntime().wrap(function _callee68$(_context72) {\n          while (1) switch (_context72.prev = _context72.next) {\n            case 0:\n              _context72.prev = 0;\n              _n48 = 0, r = 0;\n              i = [];\n              _o28 = 0;\n            case 4:\n              _a15 = t.subarray(_n48);\n              if (!(_s26 = new fe.Inflate(), (_s27 = _s26, e = _s27.strm), _s26.push(_a15, fe.Z_SYNC_FLUSH), _s26.err)) {\n                _context72.next = 7;\n                break;\n              }\n              throw new Error(_s26.msg);\n            case 7:\n              _n48 += e.next_in, i[r] = _s26.result, _o28 += i[r].length, r += 1;\n            case 8:\n              if (e.avail_in) {\n                _context72.next = 4;\n                break;\n              }\n            case 9:\n              a = new Uint8Array(_o28);\n              for (_t95 = 0, _e87 = 0; _t95 < i.length; _t95++) a.set(i[_t95], _e87), _e87 += i[_t95].length;\n              return _context72.abrupt(\"return\", ee.lW.from(a));\n            case 14:\n              _context72.prev = 14;\n              _context72.t0 = _context72[\"catch\"](0);\n              if (!\"\".concat(_context72.t0).match(/incorrect header check/)) {\n                _context72.next = 18;\n                break;\n              }\n              throw new Error(\"problem decompressing block: incorrect gzip header check\");\n            case 18:\n              throw _context72.t0;\n            case 19:\n            case \"end\":\n              return _context72.stop();\n          }\n        }, _callee68, null, [[0, 14]]);\n      }));\n      return _ce.apply(this, arguments);\n    }\n    var de = n(5237),\n      ge = n.n(de),\n      pe = n(7298),\n      me = n.n(pe);\n    function _e(t, e) {\n      return Math.floor(t / Math.pow(2, e));\n    }\n    var be = /*#__PURE__*/function (_Qt2) {\n      _inherits(be, _Qt2);\n      var _super4 = _createSuper(be);\n      function be() {\n        var _this13;\n        _classCallCheck(this, be);\n        _this13 = _super4.apply(this, arguments), _this13.maxBinNumber = 0, _this13.depth = 0, _this13.minShift = 0;\n        return _this13;\n      }\n      _createClass(be, [{\n        key: \"lineCount\",\n        value: function () {\n          var _lineCount2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee41(t, e) {\n            var n, r;\n            return _regeneratorRuntime().wrap(function _callee41$(_context44) {\n              while (1) switch (_context44.prev = _context44.next) {\n                case 0:\n                  _context44.next = 2;\n                  return this.parse(e);\n                case 2:\n                  _context44.t3 = t;\n                  _context44.t4 = n = _context44.sent.indices[_context44.t3];\n                  _context44.t2 = null === _context44.t4;\n                  if (_context44.t2) {\n                    _context44.next = 7;\n                    break;\n                  }\n                  _context44.t2 = void 0 === n;\n                case 7:\n                  if (!_context44.t2) {\n                    _context44.next = 11;\n                    break;\n                  }\n                  _context44.t5 = void 0;\n                  _context44.next = 12;\n                  break;\n                case 11:\n                  _context44.t5 = n.stats;\n                case 12:\n                  _context44.t6 = r = _context44.t5;\n                  _context44.t1 = null === _context44.t6;\n                  if (_context44.t1) {\n                    _context44.next = 16;\n                    break;\n                  }\n                  _context44.t1 = void 0 === r;\n                case 16:\n                  if (!_context44.t1) {\n                    _context44.next = 20;\n                    break;\n                  }\n                  _context44.t7 = void 0;\n                  _context44.next = 21;\n                  break;\n                case 20:\n                  _context44.t7 = r.lineCount;\n                case 21:\n                  _context44.t0 = _context44.t7;\n                  if (_context44.t0) {\n                    _context44.next = 24;\n                    break;\n                  }\n                  _context44.t0 = 0;\n                case 24:\n                  return _context44.abrupt(\"return\", _context44.t0);\n                case 25:\n                case \"end\":\n                  return _context44.stop();\n              }\n            }, _callee41, this);\n          }));\n          function lineCount(_x55, _x56) {\n            return _lineCount2.apply(this, arguments);\n          }\n          return lineCount;\n        }()\n      }, {\n        key: \"indexCov\",\n        value: function () {\n          var _indexCov2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee42() {\n            return _regeneratorRuntime().wrap(function _callee42$(_context45) {\n              while (1) switch (_context45.prev = _context45.next) {\n                case 0:\n                  return _context45.abrupt(\"return\", []);\n                case 1:\n                case \"end\":\n                  return _context45.stop();\n              }\n            }, _callee42);\n          }));\n          function indexCov() {\n            return _indexCov2.apply(this, arguments);\n          }\n          return indexCov;\n        }()\n      }, {\n        key: \"parseAuxData\",\n        value: function parseAuxData(t, e) {\n          var n = t.readInt32LE(e),\n            r = 65536 & n ? \"zero-based-half-open\" : \"1-based-closed\",\n            i = {\n              0: \"generic\",\n              1: \"SAM\",\n              2: \"VCF\"\n            }[15 & n];\n          if (!i) throw new Error(\"invalid Tabix preset format flags \".concat(n));\n          var s = {\n              ref: t.readInt32LE(e + 4),\n              start: t.readInt32LE(e + 8),\n              end: t.readInt32LE(e + 12)\n            },\n            o = t.readInt32LE(e + 16),\n            a = o ? String.fromCharCode(o) : \"\",\n            l = t.readInt32LE(e + 20),\n            h = t.readInt32LE(e + 24);\n          return _objectSpread({\n            columnNumbers: s,\n            coordinateType: r,\n            metaValue: o,\n            metaChar: a,\n            skipLines: l,\n            format: i,\n            formatFlags: n\n          }, Jt(t.subarray(e + 28, e + 28 + h), this.renameRefSeq));\n        }\n      }, {\n        key: \"_parse\",\n        value: function () {\n          var _parse4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee43(t) {\n            var e, n, r, i, s, o, a, l, h, _t28, _e38, _r24, _i16, _t29, _t30, _e39, _i17, _r25, _e40, _s10;\n            return _regeneratorRuntime().wrap(function _callee43$(_context46) {\n              while (1) switch (_context46.prev = _context46.next) {\n                case 0:\n                  _context46.next = 2;\n                  return this.filehandle.readFile(t);\n                case 2:\n                  e = _context46.sent;\n                  _context46.next = 5;\n                  return ce(e);\n                case 5:\n                  n = _context46.sent;\n                  if (!(21582659 === n.readUInt32LE(0))) {\n                    _context46.next = 10;\n                    break;\n                  }\n                  r = 1;\n                  _context46.next = 13;\n                  break;\n                case 10:\n                  if (!(38359875 !== n.readUInt32LE(0))) {\n                    _context46.next = 12;\n                    break;\n                  }\n                  throw new Error(\"Not a CSI file\");\n                case 12:\n                  r = 2;\n                case 13:\n                  this.minShift = n.readInt32LE(4), this.depth = n.readInt32LE(8), this.maxBinNumber = ((1 << 3 * (this.depth + 1)) - 1) / 7;\n                  i = n.readInt32LE(12), s = i >= 30 ? this.parseAuxData(n, 16) : void 0, o = n.readInt32LE(16 + i);\n                  l = 16 + i + 4;\n                  h = new Array(o);\n                  for (_t28 = 0; _t28 < o; _t28++) {\n                    _e38 = n.readInt32LE(l);\n                    l += 4;\n                    _r24 = {};\n                    _i16 = void 0;\n                    for (_t29 = 0; _t29 < _e38; _t29++) {\n                      _t30 = n.readUInt32LE(l);\n                      if (l += 4, _t30 > this.maxBinNumber) _i16 = Kt(n, l + 28), l += 44;else {\n                        a = Yt(a, Ht(n, l)), l += 8;\n                        _e39 = n.readInt32LE(l);\n                        l += 4;\n                        _i17 = new Array(_e39);\n                        for (_r25 = 0; _r25 < _e39; _r25 += 1) {\n                          _e40 = Ht(n, l);\n                          l += 8;\n                          _s10 = Ht(n, l);\n                          l += 8, a = Yt(a, _e40), _i17[_r25] = new Zt(_e40, _s10, _t30);\n                        }\n                        _r24[_t30] = _i17;\n                      }\n                    }\n                    h[_t28] = {\n                      binIndex: _r24,\n                      stats: _i16\n                    };\n                  }\n                  return _context46.abrupt(\"return\", _objectSpread({\n                    csiVersion: r,\n                    firstDataLine: a,\n                    indices: h,\n                    refCount: o,\n                    csi: !0,\n                    maxBlockSize: 65536\n                  }, s));\n                case 19:\n                case \"end\":\n                  return _context46.stop();\n              }\n            }, _callee43, this);\n          }));\n          function _parse(_x57) {\n            return _parse4.apply(this, arguments);\n          }\n          return _parse;\n        }()\n      }, {\n        key: \"blocksForRange\",\n        value: function () {\n          var _blocksForRange2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee44(t, e, n) {\n            var r,\n              i,\n              s,\n              o,\n              a,\n              _iterator12,\n              _step12,\n              _step12$value,\n              _t31,\n              _e41,\n              _n26,\n              _t32,\n              _iterator13,\n              _step13,\n              _e42,\n              _args47 = arguments;\n            return _regeneratorRuntime().wrap(function _callee44$(_context47) {\n              while (1) switch (_context47.prev = _context47.next) {\n                case 0:\n                  r = _args47.length > 3 && _args47[3] !== undefined ? _args47[3] : {};\n                  e < 0 && (e = 0);\n                  _context47.next = 4;\n                  return this.parse(r);\n                case 4:\n                  i = _context47.sent;\n                  s = null == i ? void 0 : i.indices[t];\n                  if (s) {\n                    _context47.next = 8;\n                    break;\n                  }\n                  return _context47.abrupt(\"return\", []);\n                case 8:\n                  o = this.reg2bins(e, n);\n                  if (!(0 === o.length)) {\n                    _context47.next = 11;\n                    break;\n                  }\n                  return _context47.abrupt(\"return\", []);\n                case 11:\n                  a = [];\n                  _iterator12 = _createForOfIteratorHelper(o);\n                  try {\n                    for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {\n                      _step12$value = _slicedToArray(_step12.value, 2), _t31 = _step12$value[0], _e41 = _step12$value[1];\n                      for (_n26 = _t31; _n26 <= _e41; _n26++) if (s.binIndex[_n26]) {\n                        _t32 = s.binIndex[_n26];\n                        _iterator13 = _createForOfIteratorHelper(_t32);\n                        try {\n                          for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {\n                            _e42 = _step13.value;\n                            a.push(_e42);\n                          }\n                        } catch (err) {\n                          _iterator13.e(err);\n                        } finally {\n                          _iterator13.f();\n                        }\n                      }\n                    }\n                  } catch (err) {\n                    _iterator12.e(err);\n                  } finally {\n                    _iterator12.f();\n                  }\n                  return _context47.abrupt(\"return\", Vt(a, new qt(0, 0)));\n                case 15:\n                case \"end\":\n                  return _context47.stop();\n              }\n            }, _callee44, this);\n          }));\n          function blocksForRange(_x58, _x59, _x60) {\n            return _blocksForRange2.apply(this, arguments);\n          }\n          return blocksForRange;\n        }()\n      }, {\n        key: \"reg2bins\",\n        value: function reg2bins(t, e) {\n          (t -= 1) < 1 && (t = 1), e > Math.pow(2, 50) && (e = Math.pow(2, 34)), e -= 1;\n          var n = 0,\n            r = 0,\n            i = this.minShift + 3 * this.depth;\n          var s = [];\n          for (; n <= this.depth; i -= 3, r += 1 * Math.pow(2, 3 * n), n += 1) {\n            var _n27 = r + _e(t, i),\n              _o16 = r + _e(e, i);\n            if (_o16 - _n27 + s.length > this.maxBinNumber) throw new Error(\"query \".concat(t, \"-\").concat(e, \" is too large for current binning scheme (shift \").concat(this.minShift, \", depth \").concat(this.depth, \"), try a smaller query or a coarser index binning scheme\"));\n            s.push([_n27, _o16]);\n          }\n          return s;\n        }\n      }, {\n        key: \"parse\",\n        value: function () {\n          var _parse5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee45() {\n            var _this14 = this;\n            var t,\n              _args48 = arguments;\n            return _regeneratorRuntime().wrap(function _callee45$(_context48) {\n              while (1) switch (_context48.prev = _context48.next) {\n                case 0:\n                  t = _args48.length > 0 && _args48[0] !== undefined ? _args48[0] : {};\n                  return _context48.abrupt(\"return\", (this.setupP || (this.setupP = this._parse(t)[\"catch\"](function (t) {\n                    throw _this14.setupP = void 0, t;\n                  })), this.setupP));\n                case 2:\n                case \"end\":\n                  return _context48.stop();\n              }\n            }, _callee45, this);\n          }));\n          function parse() {\n            return _parse5.apply(this, arguments);\n          }\n          return parse;\n        }()\n      }, {\n        key: \"hasRefSeq\",\n        value: function () {\n          var _hasRefSeq2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee46(t) {\n            var e,\n              n,\n              _args49 = arguments;\n            return _regeneratorRuntime().wrap(function _callee46$(_context49) {\n              while (1) switch (_context49.prev = _context49.next) {\n                case 0:\n                  e = _args49.length > 1 && _args49[1] !== undefined ? _args49[1] : {};\n                  _context49.next = 3;\n                  return this.parse(e);\n                case 3:\n                  _context49.t1 = t;\n                  _context49.t2 = n = _context49.sent.indices[_context49.t1];\n                  _context49.t0 = null === _context49.t2;\n                  if (_context49.t0) {\n                    _context49.next = 8;\n                    break;\n                  }\n                  _context49.t0 = void 0 === n;\n                case 8:\n                  if (!_context49.t0) {\n                    _context49.next = 12;\n                    break;\n                  }\n                  _context49.t3 = void 0;\n                  _context49.next = 13;\n                  break;\n                case 12:\n                  _context49.t3 = n.binIndex;\n                case 13:\n                  return _context49.abrupt(\"return\", !!_context49.t3);\n                case 14:\n                case \"end\":\n                  return _context49.stop();\n              }\n            }, _callee46, this);\n          }));\n          function hasRefSeq(_x61) {\n            return _hasRefSeq2.apply(this, arguments);\n          }\n          return hasRefSeq;\n        }()\n      }]);\n      return be;\n    }(Qt);\n    var we = \"=ACMGRSVTWYHKDBN\".split(\"\"),\n      ye = \"MIDNSHP=X???????\".split(\"\");\n    var ve = /*#__PURE__*/function () {\n      function ve(t) {\n        _classCallCheck(this, ve);\n        this.data = {}, this._tagList = [], this._allTagsParsed = !1;\n        var e = t.bytes,\n          n = t.fileOffset,\n          r = e.byteArray,\n          i = e.start;\n        this.data = {}, this.bytes = e, this._id = n, this._refID = r.readInt32LE(i + 4), this.data.start = r.readInt32LE(i + 8), this.flags = (4294901760 & r.readInt32LE(i + 16)) >> 16;\n      }\n      _createClass(ve, [{\n        key: \"get\",\n        value: function get(t) {\n          return this[t] ? (this.data[t] || (this.data[t] = this[t]()), this.data[t]) : this._get(t.toLowerCase());\n        }\n      }, {\n        key: \"end\",\n        value: function end() {\n          return this.get(\"start\") + this.get(\"length_on_ref\");\n        }\n      }, {\n        key: \"seq_id\",\n        value: function seq_id() {\n          return this._refID;\n        }\n      }, {\n        key: \"_get\",\n        value: function _get(t) {\n          return t in this.data || (this.data[t] = this._parseTag(t)), this.data[t];\n        }\n      }, {\n        key: \"_tags\",\n        value: function _tags() {\n          var _this15 = this;\n          this._parseAllTags();\n          var t = [\"seq\"];\n          this.isSegmentUnmapped() || t.push(\"start\", \"end\", \"strand\", \"score\", \"qual\", \"MQ\", \"CIGAR\", \"length_on_ref\", \"template_length\"), this.isPaired() && t.push(\"next_segment_position\", \"pair_orientation\"), t = t.concat(this._tagList || []);\n          for (var _i18 = 0, _Object$keys = Object.keys(this.data); _i18 < _Object$keys.length; _i18++) {\n            var _e43 = _Object$keys[_i18];\n            _e43.startsWith(\"_\") || \"next_seq_id\" === _e43 || t.push(_e43);\n          }\n          var e = {};\n          return t.filter(function (t) {\n            if (t in _this15.data && void 0 === _this15.data[t] || \"CG\" === t || \"cg\" === t) return !1;\n            var n = t.toLowerCase(),\n              r = e[n];\n            return e[n] = !0, !r;\n          });\n        }\n      }, {\n        key: \"parent\",\n        value: function parent() {}\n      }, {\n        key: \"children\",\n        value: function children() {\n          return this.get(\"subfeatures\");\n        }\n      }, {\n        key: \"id\",\n        value: function id() {\n          return this._id;\n        }\n      }, {\n        key: \"mq\",\n        value: function mq() {\n          var t = (65280 & this.get(\"_bin_mq_nl\")) >> 8;\n          return 255 === t ? void 0 : t;\n        }\n      }, {\n        key: \"score\",\n        value: function score() {\n          return this.get(\"mq\");\n        }\n      }, {\n        key: \"qual\",\n        value: function qual() {\n          var t;\n          return null === (t = this.qualRaw()) || void 0 === t ? void 0 : t.join(\" \");\n        }\n      }, {\n        key: \"qualRaw\",\n        value: function qualRaw() {\n          if (this.isSegmentUnmapped()) return;\n          var _this$bytes = this.bytes,\n            t = _this$bytes.start,\n            e = _this$bytes.byteArray,\n            n = t + 36 + this.get(\"_l_read_name\") + 4 * this.get(\"_n_cigar_op\") + this.get(\"_seq_bytes\"),\n            r = this.get(\"seq_length\");\n          return e.subarray(n, n + r);\n        }\n      }, {\n        key: \"strand\",\n        value: function strand() {\n          return this.isReverseComplemented() ? -1 : 1;\n        }\n      }, {\n        key: \"multi_segment_next_segment_strand\",\n        value: function multi_segment_next_segment_strand() {\n          if (!this.isMateUnmapped()) return this.isMateReverseComplemented() ? -1 : 1;\n        }\n      }, {\n        key: \"name\",\n        value: function name() {\n          return this.get(\"_read_name\");\n        }\n      }, {\n        key: \"_read_name\",\n        value: function _read_name() {\n          var t = this.get(\"_l_read_name\"),\n            _this$bytes2 = this.bytes,\n            e = _this$bytes2.byteArray,\n            n = _this$bytes2.start;\n          return e.toString(\"ascii\", n + 36, n + 36 + t - 1);\n        }\n      }, {\n        key: \"_parseTag\",\n        value: function _parseTag(t) {\n          if (this._allTagsParsed) return;\n          var _this$bytes3 = this.bytes,\n            e = _this$bytes3.byteArray,\n            n = _this$bytes3.start;\n          var r = this._tagOffset || n + 36 + this.get(\"_l_read_name\") + 4 * this.get(\"_n_cigar_op\") + this.get(\"_seq_bytes\") + this.get(\"seq_length\");\n          var i = this.bytes.end;\n          var s;\n          for (; r < i && s !== t;) {\n            var _n28 = String.fromCharCode(e[r], e[r + 1]);\n            s = _n28.toLowerCase();\n            var _o17 = String.fromCharCode(e[r + 2]);\n            var a = void 0;\n            switch (r += 3, _o17) {\n              case \"A\":\n                a = String.fromCharCode(e[r]), r += 1;\n                break;\n              case \"i\":\n                a = e.readInt32LE(r), r += 4;\n                break;\n              case \"I\":\n                a = e.readUInt32LE(r), r += 4;\n                break;\n              case \"c\":\n                a = e.readInt8(r), r += 1;\n                break;\n              case \"C\":\n                a = e.readUInt8(r), r += 1;\n                break;\n              case \"s\":\n                a = e.readInt16LE(r), r += 2;\n                break;\n              case \"S\":\n                a = e.readUInt16LE(r), r += 2;\n                break;\n              case \"f\":\n                a = e.readFloatLE(r), r += 4;\n                break;\n              case \"Z\":\n              case \"H\":\n                for (a = \"\"; r <= i;) {\n                  var _t33 = e[r++];\n                  if (0 === _t33) break;\n                  a += String.fromCharCode(_t33);\n                }\n                break;\n              case \"B\":\n                {\n                  a = \"\";\n                  var _t34 = e[r++],\n                    _i19 = String.fromCharCode(_t34),\n                    _s11 = e.readInt32LE(r);\n                  if (r += 4, \"i\" === _i19) if (\"CG\" === _n28) for (var _t35 = 0; _t35 < _s11; _t35++) {\n                    var _t36 = e.readInt32LE(r);\n                    a += (_t36 >> 4) + ye[15 & _t36], r += 4;\n                  } else for (var _t37 = 0; _t37 < _s11; _t37++) a += e.readInt32LE(r), _t37 + 1 < _s11 && (a += \",\"), r += 4;\n                  if (\"I\" === _i19) if (\"CG\" === _n28) for (var _t38 = 0; _t38 < _s11; _t38++) {\n                    var _t39 = e.readUInt32LE(r);\n                    a += (_t39 >> 4) + ye[15 & _t39], r += 4;\n                  } else for (var _t40 = 0; _t40 < _s11; _t40++) a += e.readUInt32LE(r), _t40 + 1 < _s11 && (a += \",\"), r += 4;\n                  if (\"s\" === _i19) for (var _t41 = 0; _t41 < _s11; _t41++) a += e.readInt16LE(r), _t41 + 1 < _s11 && (a += \",\"), r += 2;\n                  if (\"S\" === _i19) for (var _t42 = 0; _t42 < _s11; _t42++) a += e.readUInt16LE(r), _t42 + 1 < _s11 && (a += \",\"), r += 2;\n                  if (\"c\" === _i19) for (var _t43 = 0; _t43 < _s11; _t43++) a += e.readInt8(r), _t43 + 1 < _s11 && (a += \",\"), r += 1;\n                  if (\"C\" === _i19) for (var _t44 = 0; _t44 < _s11; _t44++) a += e.readUInt8(r), _t44 + 1 < _s11 && (a += \",\"), r += 1;\n                  if (\"f\" === _i19) for (var _t45 = 0; _t45 < _s11; _t45++) a += e.readFloatLE(r), _t45 + 1 < _s11 && (a += \",\"), r += 4;\n                  break;\n                }\n              default:\n                console.warn(\"Unknown BAM tag type '\".concat(_o17, \"', tags may be incomplete\")), a = void 0, r = i;\n            }\n            if (this._tagOffset = r, this._tagList.push(_n28), s === t) return a;\n            this.data[s] = a;\n          }\n          this._allTagsParsed = !0;\n        }\n      }, {\n        key: \"_parseAllTags\",\n        value: function _parseAllTags() {\n          this._parseTag(\"\");\n        }\n      }, {\n        key: \"_parseCigar\",\n        value: function _parseCigar(t) {\n          return t.match(/\\d+\\D/g).map(function (t) {\n            return [t.match(/\\D/)[0].toUpperCase(), Number.parseInt(t, 10)];\n          });\n        }\n      }, {\n        key: \"isPaired\",\n        value: function isPaired() {\n          return !!(1 & this.flags);\n        }\n      }, {\n        key: \"isProperlyPaired\",\n        value: function isProperlyPaired() {\n          return !!(2 & this.flags);\n        }\n      }, {\n        key: \"isSegmentUnmapped\",\n        value: function isSegmentUnmapped() {\n          return !!(4 & this.flags);\n        }\n      }, {\n        key: \"isMateUnmapped\",\n        value: function isMateUnmapped() {\n          return !!(8 & this.flags);\n        }\n      }, {\n        key: \"isReverseComplemented\",\n        value: function isReverseComplemented() {\n          return !!(16 & this.flags);\n        }\n      }, {\n        key: \"isMateReverseComplemented\",\n        value: function isMateReverseComplemented() {\n          return !!(32 & this.flags);\n        }\n      }, {\n        key: \"isRead1\",\n        value: function isRead1() {\n          return !!(64 & this.flags);\n        }\n      }, {\n        key: \"isRead2\",\n        value: function isRead2() {\n          return !!(128 & this.flags);\n        }\n      }, {\n        key: \"isSecondary\",\n        value: function isSecondary() {\n          return !!(256 & this.flags);\n        }\n      }, {\n        key: \"isFailedQc\",\n        value: function isFailedQc() {\n          return !!(512 & this.flags);\n        }\n      }, {\n        key: \"isDuplicate\",\n        value: function isDuplicate() {\n          return !!(1024 & this.flags);\n        }\n      }, {\n        key: \"isSupplementary\",\n        value: function isSupplementary() {\n          return !!(2048 & this.flags);\n        }\n      }, {\n        key: \"cigar\",\n        value: function cigar() {\n          if (this.isSegmentUnmapped()) return;\n          var _this$bytes4 = this.bytes,\n            t = _this$bytes4.byteArray,\n            e = _this$bytes4.start,\n            n = this.get(\"_n_cigar_op\");\n          var r = e + 36 + this.get(\"_l_read_name\");\n          var i = this.get(\"seq_length\");\n          var s = \"\",\n            o = 0,\n            a = t.readInt32LE(r),\n            l = a >> 4,\n            h = ye[15 & a];\n          if (\"S\" === h && l === i) return r += 4, a = t.readInt32LE(r), l = a >> 4, h = ye[15 & a], \"N\" !== h && console.warn(\"CG tag with no N tag\"), this.data.length_on_ref = l, this.get(\"CG\");\n          for (var _e44 = 0; _e44 < n; ++_e44) a = t.readInt32LE(r), l = a >> 4, h = ye[15 & a], s += l + h, \"H\" !== h && \"S\" !== h && \"I\" !== h && (o += l), r += 4;\n          return this.data.length_on_ref = o, s;\n        }\n      }, {\n        key: \"length_on_ref\",\n        value: function length_on_ref() {\n          return this.data.length_on_ref || this.get(\"cigar\"), this.data.length_on_ref;\n        }\n      }, {\n        key: \"_n_cigar_op\",\n        value: function _n_cigar_op() {\n          return 65535 & this.get(\"_flag_nc\");\n        }\n      }, {\n        key: \"_l_read_name\",\n        value: function _l_read_name() {\n          return 255 & this.get(\"_bin_mq_nl\");\n        }\n      }, {\n        key: \"_seq_bytes\",\n        value: function _seq_bytes() {\n          return this.get(\"seq_length\") + 1 >> 1;\n        }\n      }, {\n        key: \"getReadBases\",\n        value: function getReadBases() {\n          return this.seq();\n        }\n      }, {\n        key: \"seq\",\n        value: function seq() {\n          var _this$bytes5 = this.bytes,\n            t = _this$bytes5.byteArray,\n            e = _this$bytes5.start,\n            n = e + 36 + this.get(\"_l_read_name\") + 4 * this.get(\"_n_cigar_op\"),\n            r = this.get(\"_seq_bytes\"),\n            i = this.get(\"seq_length\");\n          var s = \"\",\n            o = 0;\n          for (var _e45 = 0; _e45 < r; ++_e45) {\n            var _r26 = t[n + _e45];\n            s += we[(240 & _r26) >> 4], o++, o < i && (s += we[15 & _r26], o++);\n          }\n          return s;\n        }\n      }, {\n        key: \"getPairOrientation\",\n        value: function getPairOrientation() {\n          if (!this.isSegmentUnmapped() && !this.isMateUnmapped() && this._refID === this._next_refid()) {\n            var _t46 = this.isReverseComplemented() ? \"R\" : \"F\",\n              _e46 = this.isMateReverseComplemented() ? \"R\" : \"F\";\n            var n = \" \",\n              r = \" \";\n            this.isRead1() ? (n = \"1\", r = \"2\") : this.isRead2() && (n = \"2\", r = \"1\");\n            var _i20 = [];\n            return this.template_length() > 0 ? (_i20[0] = _t46, _i20[1] = n, _i20[2] = _e46, _i20[3] = r) : (_i20[2] = _t46, _i20[3] = n, _i20[0] = _e46, _i20[1] = r), _i20.join(\"\");\n          }\n          return \"\";\n        }\n      }, {\n        key: \"_bin_mq_nl\",\n        value: function _bin_mq_nl() {\n          return this.bytes.byteArray.readInt32LE(this.bytes.start + 12);\n        }\n      }, {\n        key: \"_flag_nc\",\n        value: function _flag_nc() {\n          return this.bytes.byteArray.readInt32LE(this.bytes.start + 16);\n        }\n      }, {\n        key: \"seq_length\",\n        value: function seq_length() {\n          return this.bytes.byteArray.readInt32LE(this.bytes.start + 20);\n        }\n      }, {\n        key: \"_next_refid\",\n        value: function _next_refid() {\n          return this.bytes.byteArray.readInt32LE(this.bytes.start + 24);\n        }\n      }, {\n        key: \"_next_pos\",\n        value: function _next_pos() {\n          return this.bytes.byteArray.readInt32LE(this.bytes.start + 28);\n        }\n      }, {\n        key: \"template_length\",\n        value: function template_length() {\n          return this.bytes.byteArray.readInt32LE(this.bytes.start + 32);\n        }\n      }, {\n        key: \"toJSON\",\n        value: function toJSON() {\n          var t = {};\n          for (var _i21 = 0, _Object$keys2 = Object.keys(this); _i21 < _Object$keys2.length; _i21++) {\n            var _e47 = _Object$keys2[_i21];\n            _e47.startsWith(\"_\") || \"bytes\" === _e47 || (t[_e47] = this[_e47]);\n          }\n          return t;\n        }\n      }]);\n      return ve;\n    }();\n    var ke = /*#__PURE__*/function () {\n      function ke() {\n        _classCallCheck(this, ke);\n      }\n      _createClass(ke, [{\n        key: \"read\",\n        value: function read() {\n          throw new Error(\"never called\");\n        }\n      }, {\n        key: \"stat\",\n        value: function stat() {\n          throw new Error(\"never called\");\n        }\n      }, {\n        key: \"readFile\",\n        value: function readFile() {\n          throw new Error(\"never called\");\n        }\n      }, {\n        key: \"close\",\n        value: function close() {\n          throw new Error(\"never called\");\n        }\n      }]);\n      return ke;\n    }();\n    var xe = /*#__PURE__*/function () {\n      function xe(_ref17) {\n        var _this16 = this;\n        var t = _ref17.bamFilehandle,\n          e = _ref17.bamPath,\n          n = _ref17.bamUrl,\n          r = _ref17.baiPath,\n          i = _ref17.baiFilehandle,\n          s = _ref17.baiUrl,\n          o = _ref17.csiPath,\n          a = _ref17.csiFilehandle,\n          l = _ref17.csiUrl,\n          h = _ref17.htsget,\n          _ref17$yieldThreadTim = _ref17.yieldThreadTime,\n          u = _ref17$yieldThreadTim === void 0 ? 100 : _ref17$yieldThreadTim,\n          _ref17$renameRefSeqs = _ref17.renameRefSeqs,\n          f = _ref17$renameRefSeqs === void 0 ? function (t) {\n            return t;\n          } : _ref17$renameRefSeqs;\n        _classCallCheck(this, xe);\n        if (this.htsget = !1, this.featureCache = new (ge())({\n          cache: new (me())({\n            maxSize: 50\n          }),\n          fill: function () {\n            var _fill = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee47(t, e) {\n              var n, r, _yield$_this16$_readC, i, s, o;\n              return _regeneratorRuntime().wrap(function _callee47$(_context50) {\n                while (1) switch (_context50.prev = _context50.next) {\n                  case 0:\n                    n = t.chunk;\n                    r = t.opts;\n                    _context50.next = 4;\n                    return _this16._readChunk({\n                      chunk: n,\n                      opts: _objectSpread(_objectSpread({}, r), {}, {\n                        signal: e\n                      })\n                    });\n                  case 4:\n                    _yield$_this16$_readC = _context50.sent;\n                    i = _yield$_this16$_readC.data;\n                    s = _yield$_this16$_readC.cpositions;\n                    o = _yield$_this16$_readC.dpositions;\n                    return _context50.abrupt(\"return\", _this16.readBamFeatures(i, s, o, n));\n                  case 9:\n                  case \"end\":\n                    return _context50.stop();\n                }\n              }, _callee47);\n            }));\n            function fill(_x62, _x63) {\n              return _fill.apply(this, arguments);\n            }\n            return fill;\n          }()\n        }), this.renameRefSeq = f, t) this.bam = t;else if (e) this.bam = new (he())(e);else if (n) {\n          var _t47 = new URL(n),\n            _e48 = _t47.username,\n            _r27 = _t47.password;\n          _e48 && _r27 ? (n = \"\".concat(_t47.protocol, \"//\").concat(_t47.host).concat(_t47.pathname).concat(_t47.search), this.bam = new ue(n, {\n            overrides: {\n              credentials: \"include\",\n              headers: {\n                Authorization: \"Basic \" + btoa(_e48 + \":\" + _r27)\n              }\n            }\n          })) : this.bam = new ue(n);\n        } else {\n          if (!h) throw new Error(\"unable to initialize bam\");\n          this.htsget = !0, this.bam = new ke();\n        }\n        if (a) this.index = new be({\n          filehandle: a\n        });else if (o) this.index = new be({\n          filehandle: new (he())(o)\n        });else if (l) this.index = new be({\n          filehandle: new ue(l)\n        });else if (i) this.index = new te({\n          filehandle: i\n        });else if (r) this.index = new te({\n          filehandle: new (he())(r)\n        });else if (s) {\n          var _t48 = new URL(s),\n            _e49 = _t48.username,\n            _n29 = _t48.password;\n          _e49 && _n29 ? (s = \"\".concat(_t48.protocol, \"//\").concat(_t48.host).concat(_t48.pathname).concat(_t48.search), this.index = new te({\n            filehandle: new ue(s, {\n              overrides: {\n                credentials: \"include\",\n                headers: {\n                  Authorization: \"Basic \" + btoa(_e49 + \":\" + _n29)\n                }\n              }\n            })\n          })) : this.index = new te({\n            filehandle: new ue(s)\n          });\n        } else if (e) this.index = new te({\n          filehandle: new (he())(\"\".concat(e, \".bai\"))\n        });else if (n) {\n          var _t49 = new URL(n),\n            _e50 = _t49.username,\n            _r28 = _t49.password;\n          if (_e50 && _r28) {\n            var _n30 = \"\".concat(_t49.protocol, \"//\").concat(_t49.host).concat(_t49.pathname, \".bai\").concat(_t49.search);\n            this.index = new te({\n              filehandle: new ue(_n30, {\n                overrides: {\n                  credentials: \"include\",\n                  headers: {\n                    Authorization: \"Basic \" + btoa(_e50 + \":\" + _r28)\n                  }\n                }\n              })\n            });\n          } else this.index = new te({\n            filehandle: new ue(\"\".concat(n, \".bai\"))\n          });\n        } else {\n          if (!h) throw new Error(\"unable to infer index format\");\n          this.htsget = !0;\n        }\n        this.yieldThreadTime = u;\n      }\n      _createClass(xe, [{\n        key: \"getHeaderPre\",\n        value: function () {\n          var _getHeaderPre = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee48(t) {\n            var e, n, r, i, _t50, _n31, s, o, _yield$this$_readRefS, a, l;\n            return _regeneratorRuntime().wrap(function _callee48$(_context51) {\n              while (1) switch (_context51.prev = _context51.next) {\n                case 0:\n                  e = function () {\n                    var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};\n                    return \"aborted\" in t ? {\n                      signal: t\n                    } : t;\n                  }(t);\n                  if (this.index) {\n                    _context51.next = 3;\n                    break;\n                  }\n                  return _context51.abrupt(\"return\");\n                case 3:\n                  _context51.next = 5;\n                  return this.index.parse(e);\n                case 5:\n                  n = _context51.sent;\n                  r = n.firstDataLine ? n.firstDataLine.blockPosition + 65535 : void 0;\n                  if (!r) {\n                    _context51.next = 17;\n                    break;\n                  }\n                  _t50 = r + 65536;\n                  _context51.next = 11;\n                  return this.bam.read(ee.lW.alloc(_t50), 0, _t50, 0, e);\n                case 11:\n                  _n31 = _context51.sent;\n                  if (_n31.bytesRead) {\n                    _context51.next = 14;\n                    break;\n                  }\n                  throw new Error(\"Error reading header\");\n                case 14:\n                  i = _n31.buffer.subarray(0, Math.min(_n31.bytesRead, r));\n                  _context51.next = 20;\n                  break;\n                case 17:\n                  _context51.next = 19;\n                  return this.bam.readFile(e);\n                case 19:\n                  i = _context51.sent;\n                case 20:\n                  _context51.next = 22;\n                  return ce(i);\n                case 22:\n                  s = _context51.sent;\n                  if (!(21840194 !== s.readInt32LE(0))) {\n                    _context51.next = 25;\n                    break;\n                  }\n                  throw new Error(\"Not a BAM file\");\n                case 25:\n                  o = s.readInt32LE(4);\n                  this.header = s.toString(\"utf8\", 8, 8 + o);\n                  _context51.next = 29;\n                  return this._readRefSeqs(o + 8, 65535, e);\n                case 29:\n                  _yield$this$_readRefS = _context51.sent;\n                  a = _yield$this$_readRefS.chrToIndex;\n                  l = _yield$this$_readRefS.indexToChr;\n                  return _context51.abrupt(\"return\", (this.chrToIndex = a, this.indexToChr = l, function (t) {\n                    var e = t.split(/\\r?\\n/),\n                      n = [];\n                    var _iterator14 = _createForOfIteratorHelper(e),\n                      _step14;\n                    try {\n                      for (_iterator14.s(); !(_step14 = _iterator14.n()).done;) {\n                        var _t51 = _step14.value;\n                        var _t51$split = _t51.split(/\\t/),\n                          _t51$split2 = _toArray(_t51$split),\n                          _e51 = _t51$split2[0],\n                          _r29 = _t51$split2.slice(1);\n                        _e51 && n.push({\n                          tag: _e51.slice(1),\n                          data: _r29.map(function (t) {\n                            var e = t.indexOf(\":\");\n                            return {\n                              tag: t.slice(0, e),\n                              value: t.slice(e + 1)\n                            };\n                          })\n                        });\n                      }\n                    } catch (err) {\n                      _iterator14.e(err);\n                    } finally {\n                      _iterator14.f();\n                    }\n                    return n;\n                  }(this.header)));\n                case 33:\n                case \"end\":\n                  return _context51.stop();\n              }\n            }, _callee48, this);\n          }));\n          function getHeaderPre(_x64) {\n            return _getHeaderPre.apply(this, arguments);\n          }\n          return getHeaderPre;\n        }()\n      }, {\n        key: \"getHeader\",\n        value: function getHeader(t) {\n          var _this17 = this;\n          return this.headerP || (this.headerP = this.getHeaderPre(t)[\"catch\"](function (t) {\n            throw _this17.headerP = void 0, t;\n          })), this.headerP;\n        }\n      }, {\n        key: \"getHeaderText\",\n        value: function () {\n          var _getHeaderText = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee49() {\n            var t,\n              _args52 = arguments;\n            return _regeneratorRuntime().wrap(function _callee49$(_context52) {\n              while (1) switch (_context52.prev = _context52.next) {\n                case 0:\n                  t = _args52.length > 0 && _args52[0] !== undefined ? _args52[0] : {};\n                  _context52.next = 3;\n                  return this.getHeader(t);\n                case 3:\n                  return _context52.abrupt(\"return\", this.header);\n                case 4:\n                case \"end\":\n                  return _context52.stop();\n              }\n            }, _callee49, this);\n          }));\n          function getHeaderText() {\n            return _getHeaderText.apply(this, arguments);\n          }\n          return getHeaderText;\n        }()\n      }, {\n        key: \"_readRefSeqs\",\n        value: function () {\n          var _readRefSeqs2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee50(t, e, n) {\n            var r, _yield$this$bam$read, i, s, o, a, l, h, u, _r30, _i22, _s12, _a8;\n            return _regeneratorRuntime().wrap(function _callee50$(_context53) {\n              while (1) switch (_context53.prev = _context53.next) {\n                case 0:\n                  if (!(t > e)) {\n                    _context53.next = 2;\n                    break;\n                  }\n                  return _context53.abrupt(\"return\", this._readRefSeqs(t, 2 * e, n));\n                case 2:\n                  r = e + 65536;\n                  _context53.next = 5;\n                  return this.bam.read(ee.lW.alloc(r), 0, e, 0, n);\n                case 5:\n                  _yield$this$bam$read = _context53.sent;\n                  i = _yield$this$bam$read.bytesRead;\n                  s = _yield$this$bam$read.buffer;\n                  if (i) {\n                    _context53.next = 10;\n                    break;\n                  }\n                  throw new Error(\"Error reading refseqs from header\");\n                case 10:\n                  _context53.next = 12;\n                  return ce(s.subarray(0, Math.min(i, e)));\n                case 12:\n                  o = _context53.sent;\n                  a = o.readInt32LE(t);\n                  l = t + 4;\n                  h = {}, u = [];\n                  _r30 = 0;\n                case 17:\n                  if (!(_r30 < a)) {\n                    _context53.next = 24;\n                    break;\n                  }\n                  _i22 = o.readInt32LE(l), _s12 = this.renameRefSeq(o.toString(\"utf8\", l + 4, l + 4 + _i22 - 1)), _a8 = o.readInt32LE(l + _i22 + 4);\n                  if (!(h[_s12] = _r30, u.push({\n                    refName: _s12,\n                    length: _a8\n                  }), l = l + 8 + _i22, l > o.length)) {\n                    _context53.next = 21;\n                    break;\n                  }\n                  return _context53.abrupt(\"return\", (console.warn(\"BAM header is very big.  Re-fetching \".concat(e, \" bytes.\")), this._readRefSeqs(t, 2 * e, n)));\n                case 21:\n                  _r30 += 1;\n                  _context53.next = 17;\n                  break;\n                case 24:\n                  return _context53.abrupt(\"return\", {\n                    chrToIndex: h,\n                    indexToChr: u\n                  });\n                case 25:\n                case \"end\":\n                  return _context53.stop();\n              }\n            }, _callee50, this);\n          }));\n          function _readRefSeqs(_x65, _x66, _x67) {\n            return _readRefSeqs2.apply(this, arguments);\n          }\n          return _readRefSeqs;\n        }()\n      }, {\n        key: \"getRecordsForRange\",\n        value: function () {\n          var _getRecordsForRange = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee52(t, e, n, r) {\n            return _regeneratorRuntime().wrap(function _callee52$(_context55) {\n              while (1) switch (_context55.prev = _context55.next) {\n                case 0:\n                  return _context55.abrupt(\"return\", function () {\n                    var _ref18 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee51(t) {\n                      var e, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _n32;\n                      return _regeneratorRuntime().wrap(function _callee51$(_context54) {\n                        while (1) switch (_context54.prev = _context54.next) {\n                          case 0:\n                            e = [];\n                            _iteratorAbruptCompletion = false;\n                            _didIteratorError = false;\n                            _context54.prev = 3;\n                            _iterator = _asyncIterator(t);\n                          case 5:\n                            _context54.next = 7;\n                            return _iterator.next();\n                          case 7:\n                            if (!(_iteratorAbruptCompletion = !(_step = _context54.sent).done)) {\n                              _context54.next = 13;\n                              break;\n                            }\n                            _n32 = _step.value;\n                            e = e.concat(_n32);\n                          case 10:\n                            _iteratorAbruptCompletion = false;\n                            _context54.next = 5;\n                            break;\n                          case 13:\n                            _context54.next = 19;\n                            break;\n                          case 15:\n                            _context54.prev = 15;\n                            _context54.t0 = _context54[\"catch\"](3);\n                            _didIteratorError = true;\n                            _iteratorError = _context54.t0;\n                          case 19:\n                            _context54.prev = 19;\n                            _context54.prev = 20;\n                            if (!(_iteratorAbruptCompletion && _iterator[\"return\"] != null)) {\n                              _context54.next = 24;\n                              break;\n                            }\n                            _context54.next = 24;\n                            return _iterator[\"return\"]();\n                          case 24:\n                            _context54.prev = 24;\n                            if (!_didIteratorError) {\n                              _context54.next = 27;\n                              break;\n                            }\n                            throw _iteratorError;\n                          case 27:\n                            return _context54.finish(24);\n                          case 28:\n                            return _context54.finish(19);\n                          case 29:\n                            return _context54.abrupt(\"return\", e);\n                          case 30:\n                          case \"end\":\n                            return _context54.stop();\n                        }\n                      }, _callee51, null, [[3, 15, 19, 29], [20,, 24, 28]]);\n                    }));\n                    return function (_x72) {\n                      return _ref18.apply(this, arguments);\n                    };\n                  }()(this.streamRecordsForRange(t, e, n, r)));\n                case 1:\n                case \"end\":\n                  return _context55.stop();\n              }\n            }, _callee52, this);\n          }));\n          function getRecordsForRange(_x68, _x69, _x70, _x71) {\n            return _getRecordsForRange.apply(this, arguments);\n          }\n          return getRecordsForRange;\n        }()\n      }, {\n        key: \"streamRecordsForRange\",\n        value: function streamRecordsForRange(t, e, n, r) {\n          var _this = this;\n          return _wrapAsyncGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee53() {\n            var i, s, _t52;\n            return _regeneratorRuntime().wrap(function _callee53$(_context56) {\n              while (1) switch (_context56.prev = _context56.next) {\n                case 0:\n                  _context56.next = 2;\n                  return _awaitAsyncGenerator(_this.getHeader(r));\n                case 2:\n                  s = null === (i = _this.chrToIndex) || void 0 === i ? void 0 : i[t];\n                  if (!(void 0 !== s && _this.index)) {\n                    _context56.next = 10;\n                    break;\n                  }\n                  _context56.next = 6;\n                  return _awaitAsyncGenerator(_this.index.blocksForRange(s, e - 1, n, r));\n                case 6:\n                  _t52 = _context56.sent;\n                  return _context56.delegateYield(_asyncGeneratorDelegate(_asyncIterator(_this._fetchChunkFeatures(_t52, s, e, n, r)), _awaitAsyncGenerator), \"t0\", 8);\n                case 8:\n                  _context56.next = 12;\n                  break;\n                case 10:\n                  _context56.next = 12;\n                  return [];\n                case 12:\n                case \"end\":\n                  return _context56.stop();\n              }\n            }, _callee53);\n          }))();\n        }\n      }, {\n        key: \"_fetchChunkFeatures\",\n        value: function _fetchChunkFeatures(t, e, n, r) {\n          var _this2 = this;\n          var i = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};\n          return _wrapAsyncGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee54() {\n            var s, o, a, _iterator15, _step15, _s13, _t54, l, _iterator16, _step16, _i23;\n            return _regeneratorRuntime().wrap(function _callee54$(_context57) {\n              while (1) switch (_context57.prev = _context57.next) {\n                case 0:\n                  s = i.viewAsPairs, o = [];\n                  a = !1;\n                  _iterator15 = _createForOfIteratorHelper(t);\n                  _context57.prev = 3;\n                  _iterator15.s();\n                case 5:\n                  if ((_step15 = _iterator15.n()).done) {\n                    _context57.next = 38;\n                    break;\n                  }\n                  _s13 = _step15.value;\n                  _context57.next = 9;\n                  return _awaitAsyncGenerator(_this2.featureCache.get(_s13.toString(), {\n                    chunk: _s13,\n                    opts: i\n                  }, i.signal));\n                case 9:\n                  _t54 = _context57.sent;\n                  l = [];\n                  _iterator16 = _createForOfIteratorHelper(_t54);\n                  _context57.prev = 12;\n                  _iterator16.s();\n                case 14:\n                  if ((_step16 = _iterator16.n()).done) {\n                    _context57.next = 23;\n                    break;\n                  }\n                  _i23 = _step16.value;\n                  if (!(_i23.seq_id() === e)) {\n                    _context57.next = 21;\n                    break;\n                  }\n                  if (!(_i23.get(\"start\") >= r)) {\n                    _context57.next = 20;\n                    break;\n                  }\n                  a = !0;\n                  return _context57.abrupt(\"break\", 23);\n                case 20:\n                  _i23.get(\"end\") >= n && l.push(_i23);\n                case 21:\n                  _context57.next = 14;\n                  break;\n                case 23:\n                  _context57.next = 28;\n                  break;\n                case 25:\n                  _context57.prev = 25;\n                  _context57.t0 = _context57[\"catch\"](12);\n                  _iterator16.e(_context57.t0);\n                case 28:\n                  _context57.prev = 28;\n                  _iterator16.f();\n                  return _context57.finish(28);\n                case 31:\n                  o.push(l);\n                  _context57.next = 34;\n                  return l;\n                case 34:\n                  if (!a) {\n                    _context57.next = 36;\n                    break;\n                  }\n                  return _context57.abrupt(\"break\", 38);\n                case 36:\n                  _context57.next = 5;\n                  break;\n                case 38:\n                  _context57.next = 43;\n                  break;\n                case 40:\n                  _context57.prev = 40;\n                  _context57.t1 = _context57[\"catch\"](3);\n                  _iterator15.e(_context57.t1);\n                case 43:\n                  _context57.prev = 43;\n                  _iterator15.f();\n                  return _context57.finish(43);\n                case 46:\n                  (function (t) {\n                    if (t && t.aborted) {\n                      if (\"undefined\" == typeof DOMException) {\n                        var _t53 = new Error(\"aborted\");\n                        throw _t53.code = \"ERR_ABORTED\", _t53;\n                      }\n                      throw new DOMException(\"aborted\", \"AbortError\");\n                    }\n                  })(i.signal);\n                  _context57.t2 = s;\n                  if (!_context57.t2) {\n                    _context57.next = 51;\n                    break;\n                  }\n                  _context57.next = 51;\n                  return _this2.fetchPairs(e, o, i);\n                case 51:\n                case \"end\":\n                  return _context57.stop();\n              }\n            }, _callee54, null, [[3, 40, 43, 46], [12, 25, 28, 31]]);\n          }))();\n        }\n      }, {\n        key: \"fetchPairs\",\n        value: function () {\n          var _fetchPairs = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee56(t, e, n) {\n            var _this18 = this;\n            var r, _n$maxInsertSize, i, s, o, a, l, h, _iterator19, _step19, _t58;\n            return _regeneratorRuntime().wrap(function _callee56$(_context59) {\n              while (1) switch (_context59.prev = _context59.next) {\n                case 0:\n                  r = n.pairAcrossChr, _n$maxInsertSize = n.maxInsertSize, i = _n$maxInsertSize === void 0 ? 2e5 : _n$maxInsertSize, s = {}, o = {};\n                  e.map(function (t) {\n                    var e = {};\n                    var _iterator17 = _createForOfIteratorHelper(t),\n                      _step17;\n                    try {\n                      for (_iterator17.s(); !(_step17 = _iterator17.n()).done;) {\n                        var _n34 = _step17.value;\n                        var _t56 = _n34.name(),\n                          _r31 = _n34.id();\n                        e[_t56] || (e[_t56] = 0), e[_t56]++, o[_r31] = 1;\n                      }\n                    } catch (err) {\n                      _iterator17.e(err);\n                    } finally {\n                      _iterator17.f();\n                    }\n                    for (var _i24 = 0, _Object$entries = Object.entries(e); _i24 < _Object$entries.length; _i24++) {\n                      var _Object$entries$_i = _slicedToArray(_Object$entries[_i24], 2),\n                        _t55 = _Object$entries$_i[0],\n                        _n33 = _Object$entries$_i[1];\n                      1 === _n33 && (s[_t55] = !0);\n                    }\n                  });\n                  a = [];\n                  e.map(function (e) {\n                    var _iterator18 = _createForOfIteratorHelper(e),\n                      _step18;\n                    try {\n                      for (_iterator18.s(); !(_step18 = _iterator18.n()).done;) {\n                        var _o18 = _step18.value;\n                        var _e52 = _o18.name(),\n                          _l5 = _o18.get(\"start\"),\n                          _h4 = _o18._next_pos(),\n                          u = _o18._next_refid();\n                        _this18.index && s[_e52] && (r || u === t && Math.abs(_l5 - _h4) < i) && a.push(_this18.index.blocksForRange(u, _h4, _h4 + 1, n));\n                      }\n                    } catch (err) {\n                      _iterator18.e(err);\n                    } finally {\n                      _iterator18.f();\n                    }\n                  });\n                  l = new Map();\n                  _context59.next = 7;\n                  return Promise.all(a);\n                case 7:\n                  h = _context59.sent;\n                  _iterator19 = _createForOfIteratorHelper(h.flat());\n                  try {\n                    for (_iterator19.s(); !(_step19 = _iterator19.n()).done;) {\n                      _t58 = _step19.value;\n                      l.has(_t58.toString()) || l.set(_t58.toString(), _t58);\n                    }\n                  } catch (err) {\n                    _iterator19.e(err);\n                  } finally {\n                    _iterator19.f();\n                  }\n                  _context59.next = 12;\n                  return Promise.all(_toConsumableArray(l.values()).map( /*#__PURE__*/function () {\n                    var _ref19 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee55(t) {\n                      var _yield$_this18$_readC, e, r, i, a, l, _iterator20, _step20, _t57;\n                      return _regeneratorRuntime().wrap(function _callee55$(_context58) {\n                        while (1) switch (_context58.prev = _context58.next) {\n                          case 0:\n                            _context58.next = 2;\n                            return _this18._readChunk({\n                              chunk: t,\n                              opts: n\n                            });\n                          case 2:\n                            _yield$_this18$_readC = _context58.sent;\n                            e = _yield$_this18$_readC.data;\n                            r = _yield$_this18$_readC.cpositions;\n                            i = _yield$_this18$_readC.dpositions;\n                            a = _yield$_this18$_readC.chunk;\n                            l = [];\n                            _context58.t0 = _createForOfIteratorHelper;\n                            _context58.next = 11;\n                            return _this18.readBamFeatures(e, r, i, a);\n                          case 11:\n                            _context58.t1 = _context58.sent;\n                            _iterator20 = (0, _context58.t0)(_context58.t1);\n                            try {\n                              for (_iterator20.s(); !(_step20 = _iterator20.n()).done;) {\n                                _t57 = _step20.value;\n                                s[_t57.get(\"name\")] && !o[_t57.id()] && l.push(_t57);\n                              }\n                            } catch (err) {\n                              _iterator20.e(err);\n                            } finally {\n                              _iterator20.f();\n                            }\n                            return _context58.abrupt(\"return\", l);\n                          case 15:\n                          case \"end\":\n                            return _context58.stop();\n                        }\n                      }, _callee55);\n                    }));\n                    return function (_x76) {\n                      return _ref19.apply(this, arguments);\n                    };\n                  }()));\n                case 12:\n                  return _context59.abrupt(\"return\", _context59.sent.flat());\n                case 13:\n                case \"end\":\n                  return _context59.stop();\n              }\n            }, _callee56);\n          }));\n          function fetchPairs(_x73, _x74, _x75) {\n            return _fetchPairs.apply(this, arguments);\n          }\n          return fetchPairs;\n        }()\n      }, {\n        key: \"_readRegion\",\n        value: function () {\n          var _readRegion2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee57(t, e) {\n            var n,\n              _yield$this$bam$read2,\n              r,\n              i,\n              _args60 = arguments;\n            return _regeneratorRuntime().wrap(function _callee57$(_context60) {\n              while (1) switch (_context60.prev = _context60.next) {\n                case 0:\n                  n = _args60.length > 2 && _args60[2] !== undefined ? _args60[2] : {};\n                  _context60.next = 3;\n                  return this.bam.read(ee.lW.alloc(e), 0, e, t, n);\n                case 3:\n                  _yield$this$bam$read2 = _context60.sent;\n                  r = _yield$this$bam$read2.bytesRead;\n                  i = _yield$this$bam$read2.buffer;\n                  return _context60.abrupt(\"return\", i.subarray(0, Math.min(r, e)));\n                case 7:\n                case \"end\":\n                  return _context60.stop();\n              }\n            }, _callee57, this);\n          }));\n          function _readRegion(_x77, _x78) {\n            return _readRegion2.apply(this, arguments);\n          }\n          return _readRegion;\n        }()\n      }, {\n        key: \"_readChunk\",\n        value: function () {\n          var _readChunk2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee59(_ref20) {\n            var t, e, n, _yield, r, i, s;\n            return _regeneratorRuntime().wrap(function _callee59$(_context62) {\n              while (1) switch (_context62.prev = _context62.next) {\n                case 0:\n                  t = _ref20.chunk, e = _ref20.opts;\n                  _context62.next = 3;\n                  return this._readRegion(t.minv.blockPosition, t.fetchedSize(), e);\n                case 3:\n                  n = _context62.sent;\n                  _context62.next = 6;\n                  return function () {\n                    var _ref21 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee58(t, e) {\n                      var _n35, _r32, _i25, _s14, _o19, a, l, _h5, u, f, _e53, _c2, _d, _g, _p, _c3, _t59, _e54;\n                      return _regeneratorRuntime().wrap(function _callee58$(_context61) {\n                        while (1) switch (_context61.prev = _context61.next) {\n                          case 0:\n                            _context61.prev = 0;\n                            _r32 = e.minv, _i25 = e.maxv;\n                            _s14 = _r32.blockPosition, _o19 = _r32.dataPosition;\n                            a = [], l = [], _h5 = [];\n                            u = 0, f = 0;\n                          case 5:\n                            _e53 = t.subarray(_s14 - _r32.blockPosition), _c2 = new fe.Inflate();\n                            if (!(_n35 = _c2.strm, _c2.push(_e53, fe.Z_SYNC_FLUSH), _c2.err)) {\n                              _context61.next = 8;\n                              break;\n                            }\n                            throw new Error(_c2.msg);\n                          case 8:\n                            _d = _c2.result;\n                            a.push(_d);\n                            _g = _d.length;\n                            l.push(_s14), _h5.push(_o19), 1 === a.length && _r32.dataPosition && (a[0] = a[0].subarray(_r32.dataPosition), _g = a[0].length);\n                            _p = _s14;\n                            if (!(_s14 += _n35.next_in, _o19 += _g, _p >= _i25.blockPosition)) {\n                              _context61.next = 16;\n                              break;\n                            }\n                            a[f] = a[f].subarray(0, _i25.blockPosition === _r32.blockPosition ? _i25.dataPosition - _r32.dataPosition + 1 : _i25.dataPosition + 1), l.push(_s14), _h5.push(_o19), u += a[f].length;\n                            return _context61.abrupt(\"break\", 18);\n                          case 16:\n                            u += a[f].length, f++;\n                          case 17:\n                            if (_n35.avail_in) {\n                              _context61.next = 5;\n                              break;\n                            }\n                          case 18:\n                            _c3 = new Uint8Array(u);\n                            for (_t59 = 0, _e54 = 0; _t59 < a.length; _t59++) _c3.set(a[_t59], _e54), _e54 += a[_t59].length;\n                            return _context61.abrupt(\"return\", {\n                              buffer: ee.lW.from(_c3),\n                              cpositions: l,\n                              dpositions: _h5\n                            });\n                          case 23:\n                            _context61.prev = 23;\n                            _context61.t0 = _context61[\"catch\"](0);\n                            if (!\"\".concat(_context61.t0).match(/incorrect header check/)) {\n                              _context61.next = 27;\n                              break;\n                            }\n                            throw new Error(\"problem decompressing block: incorrect gzip header check\");\n                          case 27:\n                            throw _context61.t0;\n                          case 28:\n                          case \"end\":\n                            return _context61.stop();\n                        }\n                      }, _callee58, null, [[0, 23]]);\n                    }));\n                    return function (_x80, _x81) {\n                      return _ref21.apply(this, arguments);\n                    };\n                  }()(n, t);\n                case 6:\n                  _yield = _context62.sent;\n                  r = _yield.buffer;\n                  i = _yield.cpositions;\n                  s = _yield.dpositions;\n                  return _context62.abrupt(\"return\", {\n                    data: r,\n                    cpositions: i,\n                    dpositions: s,\n                    chunk: t\n                  });\n                case 11:\n                case \"end\":\n                  return _context62.stop();\n              }\n            }, _callee59, this);\n          }));\n          function _readChunk(_x79) {\n            return _readChunk2.apply(this, arguments);\n          }\n          return _readChunk;\n        }()\n      }, {\n        key: \"readBamFeatures\",\n        value: function () {\n          var _readBamFeatures = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee60(t, e, n, r) {\n            var i, s, o, a, l, _h6;\n            return _regeneratorRuntime().wrap(function _callee60$(_context63) {\n              while (1) switch (_context63.prev = _context63.next) {\n                case 0:\n                  i = 0;\n                  s = [];\n                  o = 0, a = +Date.now();\n                case 3:\n                  if (!(i + 4 < t.length)) {\n                    _context63.next = 17;\n                    break;\n                  }\n                  l = i + 4 + t.readInt32LE(i) - 1;\n                  if (n) {\n                    for (; i + r.minv.dataPosition >= n[o++];);\n                    o--;\n                  }\n                  if (!(l < t.length)) {\n                    _context63.next = 14;\n                    break;\n                  }\n                  _h6 = new ve({\n                    bytes: {\n                      byteArray: t,\n                      start: i,\n                      end: l\n                    },\n                    fileOffset: e.length > 0 ? 256 * e[o] + (i - n[o]) + r.minv.dataPosition + 1 : ae.signed(t.slice(i, l))\n                  });\n                  s.push(_h6);\n                  _context63.t0 = this.yieldThreadTime && +Date.now() - a > this.yieldThreadTime;\n                  if (!_context63.t0) {\n                    _context63.next = 14;\n                    break;\n                  }\n                  _context63.next = 13;\n                  return Xt(1);\n                case 13:\n                  a = +Date.now();\n                case 14:\n                  i = l + 1;\n                case 15:\n                  _context63.next = 3;\n                  break;\n                case 17:\n                  return _context63.abrupt(\"return\", s);\n                case 18:\n                case \"end\":\n                  return _context63.stop();\n              }\n            }, _callee60, this);\n          }));\n          function readBamFeatures(_x82, _x83, _x84, _x85) {\n            return _readBamFeatures.apply(this, arguments);\n          }\n          return readBamFeatures;\n        }()\n      }, {\n        key: \"hasRefSeq\",\n        value: function () {\n          var _hasRefSeq3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee61(t) {\n            var e, n, r;\n            return _regeneratorRuntime().wrap(function _callee61$(_context64) {\n              while (1) switch (_context64.prev = _context64.next) {\n                case 0:\n                  r = null === (e = this.chrToIndex) || void 0 === e ? void 0 : e[t];\n                  return _context64.abrupt(\"return\", void 0 !== r && (null === (n = this.index) || void 0 === n ? void 0 : n.hasRefSeq(r)));\n                case 2:\n                case \"end\":\n                  return _context64.stop();\n              }\n            }, _callee61, this);\n          }));\n          function hasRefSeq(_x86) {\n            return _hasRefSeq3.apply(this, arguments);\n          }\n          return hasRefSeq;\n        }()\n      }, {\n        key: \"lineCount\",\n        value: function () {\n          var _lineCount3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee62(t) {\n            var e, n;\n            return _regeneratorRuntime().wrap(function _callee62$(_context65) {\n              while (1) switch (_context65.prev = _context65.next) {\n                case 0:\n                  n = null === (e = this.chrToIndex) || void 0 === e ? void 0 : e[t];\n                  return _context65.abrupt(\"return\", void 0 !== n && this.index ? this.index.lineCount(n) : 0);\n                case 2:\n                case \"end\":\n                  return _context65.stop();\n              }\n            }, _callee62, this);\n          }));\n          function lineCount(_x87) {\n            return _lineCount3.apply(this, arguments);\n          }\n          return lineCount;\n        }()\n      }, {\n        key: \"indexCov\",\n        value: function () {\n          var _indexCov3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee63(t, e, n) {\n            var r, i;\n            return _regeneratorRuntime().wrap(function _callee63$(_context66) {\n              while (1) switch (_context66.prev = _context66.next) {\n                case 0:\n                  if (this.index) {\n                    _context66.next = 2;\n                    break;\n                  }\n                  return _context66.abrupt(\"return\", []);\n                case 2:\n                  _context66.next = 4;\n                  return this.index.parse();\n                case 4:\n                  i = null === (r = this.chrToIndex) || void 0 === r ? void 0 : r[t];\n                  return _context66.abrupt(\"return\", void 0 === i ? [] : this.index.indexCov(i, e, n));\n                case 6:\n                case \"end\":\n                  return _context66.stop();\n              }\n            }, _callee63, this);\n          }));\n          function indexCov(_x88, _x89, _x90) {\n            return _indexCov3.apply(this, arguments);\n          }\n          return indexCov;\n        }()\n      }, {\n        key: \"blocksForRange\",\n        value: function () {\n          var _blocksForRange3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee64(t, e, n, r) {\n            var i, s;\n            return _regeneratorRuntime().wrap(function _callee64$(_context67) {\n              while (1) switch (_context67.prev = _context67.next) {\n                case 0:\n                  if (this.index) {\n                    _context67.next = 2;\n                    break;\n                  }\n                  return _context67.abrupt(\"return\", []);\n                case 2:\n                  _context67.next = 4;\n                  return this.index.parse();\n                case 4:\n                  s = null === (i = this.chrToIndex) || void 0 === i ? void 0 : i[t];\n                  return _context67.abrupt(\"return\", void 0 === s ? [] : this.index.blocksForRange(s, e, n, r));\n                case 6:\n                case \"end\":\n                  return _context67.stop();\n              }\n            }, _callee64, this);\n          }));\n          function blocksForRange(_x91, _x92, _x93, _x94) {\n            return _blocksForRange3.apply(this, arguments);\n          }\n          return blocksForRange;\n        }()\n      }]);\n      return xe;\n    }();\n    var Ee = {\n      BG: [.89, .89, .89, 1],\n      BG2: [.85, .85, .85, 1],\n      BG_MUTED: [.92, .92, .92, 1],\n      A: [0, 0, 1, 1],\n      C: [1, 0, 0, 1],\n      G: [0, 1, 0, 1],\n      T: [1, 1, 0, 1],\n      S: [0, 0, 0, .4],\n      H: [0, 0, 0, .5],\n      X: [0, 0, 0, .7],\n      I: [1, 0, 1, .5],\n      D: [1, .5, .5, .5],\n      N: [1, 1, 1, 1],\n      LARGE_INSERT_SIZE: [1, 0, 0, 1],\n      SMALL_INSERT_SIZE: [0, .24, .48, 1],\n      LL: [.15, .75, .75, 1],\n      RR: [.18, .24, .8, 1],\n      RL: [0, .5, .02, 1],\n      WHITE: [1, 1, 1, 1],\n      BLACK: [0, 0, 0, 1],\n      BLACK_05: [0, 0, 0, .5],\n      PLUS_STRAND: [.75, .75, 1, 1],\n      MINUS_STRAND: [1, .75, .75, 1],\n      MM_M6A_FOR: [.4, .2, .6, 1],\n      MM_M6A_REV: [.4, .2, .6, 1],\n      MM_M5C_FOR: [1, 0, 0, 1],\n      MM_M5C_REV: [1, 0, 0, 1],\n      HIGHLIGHTS_CG: [.95, .84, .84, 1],\n      HIGHLIGHTS_A: [.95, .89, .71, 1],\n      HIGHLIGHTS_T: [.95, .89, .71, 1],\n      HIGHLIGHTS_G: [.95, .84, .84, 1],\n      HIGHLIGHTS_C: [.95, .84, .84, 1],\n      HIGHLIGHTS_MZEROA: [.89, .84, .96, 1],\n      INDEX_DHS_BG: [0, 0, 0, 0]\n    };\n    var Ae = {};\n    Object.keys(Ee).map(function (t, e) {\n      return Ae[t] = e, null;\n    });\n    var Be = function Be(t) {\n        return t = t.toUpperCase(), \"\".concat(parseInt(t.slice(1, 3), 16), \",\").concat(parseInt(t.slice(3, 5), 16), \",\").concat(parseInt(t.slice(5, 7), 16));\n      },\n      Se = function Se(t, e) {\n        var n = 0,\n          r = 0,\n          i = !1,\n          s = 0;\n        var o = [];\n        for (var a = 0; a < t.length; a++) t[a].match(/[0-9]/g) ? (r = 10 * r + +t[a], i = !1) : \"^\" === t[a] ? i = !0 : (n += r, e ? o.push({\n          length: r,\n          type: t[a]\n        }) : i ? s -= 1 : o.push({\n          pos: n,\n          base: t[a],\n          length: 1,\n          bamSeqShift: s\n        }), r = 0, n += 1);\n        return o;\n      },\n      Ie = function Ie(t) {\n        return t.highlightReadsBy.length > 0 || t.outlineMateOnHover;\n      };\n    var Me = n(9593),\n      Te = n.n(Me),\n      ze = \"$\";\n    function Oe() {}\n    function Ce(t, e) {\n      var n = new Oe();\n      if (t instanceof Oe) t.each(function (t, e) {\n        n.set(e, t);\n      });else if (Array.isArray(t)) {\n        var r,\n          i = -1,\n          s = t.length;\n        if (null == e) for (; ++i < s;) n.set(i, t[i]);else for (; ++i < s;) n.set(e(r = t[i], i, t), r);\n      } else if (t) for (var o in t) n.set(o, t[o]);\n      return n;\n    }\n    Oe.prototype = Ce.prototype = {\n      constructor: Oe,\n      has: function has(t) {\n        return ze + t in this;\n      },\n      get: function get(t) {\n        return this[ze + t];\n      },\n      set: function set(t, e) {\n        return this[ze + t] = e, this;\n      },\n      remove: function remove(t) {\n        var e = ze + t;\n        return e in this && delete this[e];\n      },\n      clear: function clear() {\n        for (var t in this) t[0] === ze && delete this[t];\n      },\n      keys: function keys() {\n        var t = [];\n        for (var e in this) e[0] === ze && t.push(e.slice(1));\n        return t;\n      },\n      values: function values() {\n        var t = [];\n        for (var e in this) e[0] === ze && t.push(this[e]);\n        return t;\n      },\n      entries: function entries() {\n        var t = [];\n        for (var e in this) e[0] === ze && t.push({\n          key: e.slice(1),\n          value: this[e]\n        });\n        return t;\n      },\n      size: function size() {\n        var t = 0;\n        for (var e in this) e[0] === ze && ++t;\n        return t;\n      },\n      empty: function empty() {\n        for (var t in this) if (t[0] === ze) return !1;\n        return !0;\n      },\n      each: function each(t) {\n        for (var e in this) e[0] === ze && t(this[e], e.slice(1), this);\n      }\n    };\n    var Re = Ce;\n    function Ne() {}\n    var Le = Re.prototype;\n    Ne.prototype = function (t, e) {\n      var n = new Ne();\n      if (t instanceof Ne) t.each(function (t) {\n        n.add(t);\n      });else if (t) {\n        var r = -1,\n          i = t.length;\n        if (null == e) for (; ++r < i;) n.add(t[r]);else for (; ++r < i;) n.add(e(t[r], r, t));\n      }\n      return n;\n    }.prototype = {\n      constructor: Ne,\n      has: Le.has,\n      add: function add(t) {\n        return this[ze + (t += \"\")] = t, this;\n      },\n      remove: Le.remove,\n      clear: Le.clear,\n      values: Le.keys,\n      size: Le.size,\n      empty: Le.empty,\n      each: Le.each\n    };\n    var Ue = {\n      value: function value() {}\n    };\n    function Pe() {\n      for (var t, e = 0, n = arguments.length, r = {}; e < n; ++e) {\n        if (!(t = arguments[e] + \"\") || t in r || /[\\s.]/.test(t)) throw new Error(\"illegal type: \" + t);\n        r[t] = [];\n      }\n      return new $e(r);\n    }\n    function $e(t) {\n      this._ = t;\n    }\n    function je(t, e) {\n      for (var n, r = 0, i = t.length; r < i; ++r) if ((n = t[r]).name === e) return n.value;\n    }\n    function Fe(t, e, n) {\n      for (var r = 0, i = t.length; r < i; ++r) if (t[r].name === e) {\n        t[r] = Ue, t = t.slice(0, r).concat(t.slice(r + 1));\n        break;\n      }\n      return null != n && t.push({\n        name: e,\n        value: n\n      }), t;\n    }\n    $e.prototype = Pe.prototype = {\n      constructor: $e,\n      on: function on(t, e) {\n        var n,\n          r,\n          i = this._,\n          s = (r = i, (t + \"\").trim().split(/^|\\s+/).map(function (t) {\n            var e = \"\",\n              n = t.indexOf(\".\");\n            if (n >= 0 && (e = t.slice(n + 1), t = t.slice(0, n)), t && !r.hasOwnProperty(t)) throw new Error(\"unknown type: \" + t);\n            return {\n              type: t,\n              name: e\n            };\n          })),\n          o = -1,\n          a = s.length;\n        if (!(arguments.length < 2)) {\n          if (null != e && \"function\" != typeof e) throw new Error(\"invalid callback: \" + e);\n          for (; ++o < a;) if (n = (t = s[o]).type) i[n] = Fe(i[n], t.name, e);else if (null == e) for (n in i) i[n] = Fe(i[n], t.name, null);\n          return this;\n        }\n        for (; ++o < a;) if ((n = (t = s[o]).type) && (n = je(i[n], t.name))) return n;\n      },\n      copy: function copy() {\n        var t = {},\n          e = this._;\n        for (var n in e) t[n] = e[n].slice();\n        return new $e(t);\n      },\n      call: function call(t, e) {\n        if ((n = arguments.length - 2) > 0) for (var n, r, i = new Array(n), s = 0; s < n; ++s) i[s] = arguments[s + 2];\n        if (!this._.hasOwnProperty(t)) throw new Error(\"unknown type: \" + t);\n        for (s = 0, n = (r = this._[t]).length; s < n; ++s) r[s].value.apply(e, i);\n      },\n      apply: function apply(t, e, n) {\n        if (!this._.hasOwnProperty(t)) throw new Error(\"unknown type: \" + t);\n        for (var r = this._[t], i = 0, s = r.length; i < s; ++i) r[i].value.apply(e, n);\n      }\n    };\n    var De = Pe;\n    function qe(t, e) {\n      var n,\n        r,\n        i,\n        s,\n        o = De(\"beforesend\", \"progress\", \"load\", \"error\"),\n        a = Re(),\n        l = new XMLHttpRequest(),\n        h = null,\n        u = null,\n        f = 0;\n      function c(t) {\n        var e,\n          r = l.status;\n        if (!r && function (t) {\n          var e = t.responseType;\n          return e && \"text\" !== e ? t.response : t.responseText;\n        }(l) || r >= 200 && r < 300 || 304 === r) {\n          if (i) try {\n            e = i.call(n, l);\n          } catch (t) {\n            return void o.call(\"error\", n, t);\n          } else e = l;\n          o.call(\"load\", n, e);\n        } else o.call(\"error\", n, t);\n      }\n      if (\"undefined\" != typeof XDomainRequest && !(\"withCredentials\" in l) && /^(http(s)?:)?\\/\\//.test(t) && (l = new XDomainRequest()), \"onload\" in l ? l.onload = l.onerror = l.ontimeout = c : l.onreadystatechange = function (t) {\n        l.readyState > 3 && c(t);\n      }, l.onprogress = function (t) {\n        o.call(\"progress\", n, t);\n      }, n = {\n        header: function header(t, e) {\n          return t = (t + \"\").toLowerCase(), arguments.length < 2 ? a.get(t) : (null == e ? a.remove(t) : a.set(t, e + \"\"), n);\n        },\n        mimeType: function mimeType(t) {\n          return arguments.length ? (r = null == t ? null : t + \"\", n) : r;\n        },\n        responseType: function responseType(t) {\n          return arguments.length ? (s = t, n) : s;\n        },\n        timeout: function timeout(t) {\n          return arguments.length ? (f = +t, n) : f;\n        },\n        user: function user(t) {\n          return arguments.length < 1 ? h : (h = null == t ? null : t + \"\", n);\n        },\n        password: function password(t) {\n          return arguments.length < 1 ? u : (u = null == t ? null : t + \"\", n);\n        },\n        response: function response(t) {\n          return i = t, n;\n        },\n        get: function get(t, e) {\n          return n.send(\"GET\", t, e);\n        },\n        post: function post(t, e) {\n          return n.send(\"POST\", t, e);\n        },\n        send: function send(e, i, c) {\n          return l.open(e, t, !0, h, u), null == r || a.has(\"accept\") || a.set(\"accept\", r + \",*/*\"), l.setRequestHeader && a.each(function (t, e) {\n            l.setRequestHeader(e, t);\n          }), null != r && l.overrideMimeType && l.overrideMimeType(r), null != s && (l.responseType = s), f > 0 && (l.timeout = f), null == c && \"function\" == typeof i && (c = i, i = null), null != c && 1 === c.length && (c = function (t) {\n            return function (e, n) {\n              t(null == e ? n : null);\n            };\n          }(c)), null != c && n.on(\"error\", c).on(\"load\", function (t) {\n            c(null, t);\n          }), o.call(\"beforesend\", n, l), l.send(null == i ? null : i), n;\n        },\n        abort: function abort() {\n          return l.abort(), n;\n        },\n        on: function on() {\n          var t = o.on.apply(o, arguments);\n          return t === o ? n : t;\n        }\n      }, null != e) {\n        if (\"function\" != typeof e) throw new Error(\"invalid callback: \" + e);\n        return n.get(e);\n      }\n      return n;\n    }\n    function He(t, e) {\n      return function (n, r) {\n        var i = qe(n).mimeType(t).response(e);\n        if (null != r) {\n          if (\"function\" != typeof r) throw new Error(\"invalid callback: \" + r);\n          return i.get(r);\n        }\n        return i;\n      };\n    }\n    He(\"text/html\", function (t) {\n      return document.createRange().createContextualFragment(t.responseText);\n    }), He(\"application/json\", function (t) {\n      return JSON.parse(t.responseText);\n    });\n    var Ze = He(\"text/plain\", function (t) {\n      return t.responseText;\n    });\n    He(\"application/xml\", function (t) {\n      var e = t.responseXML;\n      if (!e) throw new Error(\"parse error\");\n      return e;\n    });\n    var Ge = {},\n      We = {};\n    function Xe(t) {\n      return new Function(\"d\", \"return {\" + t.map(function (t, e) {\n        return JSON.stringify(t) + \": d[\" + e + '] || \"\"';\n      }).join(\",\") + \"}\");\n    }\n    function Ve(t) {\n      var e = Object.create(null),\n        n = [];\n      return t.forEach(function (t) {\n        for (var r in t) r in e || n.push(e[r] = r);\n      }), n;\n    }\n    function Ke(t, e) {\n      var n = t + \"\",\n        r = n.length;\n      return r < e ? new Array(e - r + 1).join(0) + n : n;\n    }\n    function Ye(t) {\n      var e = new RegExp('[\"' + t + \"\\n\\r]\"),\n        n = t.charCodeAt(0);\n      function r(t, e) {\n        var r,\n          i = [],\n          s = t.length,\n          o = 0,\n          a = 0,\n          l = s <= 0,\n          h = !1;\n        function u() {\n          if (l) return We;\n          if (h) return h = !1, Ge;\n          var e,\n            r,\n            i = o;\n          if (34 === t.charCodeAt(i)) {\n            for (; o++ < s && 34 !== t.charCodeAt(o) || 34 === t.charCodeAt(++o););\n            return (e = o) >= s ? l = !0 : 10 === (r = t.charCodeAt(o++)) ? h = !0 : 13 === r && (h = !0, 10 === t.charCodeAt(o) && ++o), t.slice(i + 1, e - 1).replace(/\"\"/g, '\"');\n          }\n          for (; o < s;) {\n            if (10 === (r = t.charCodeAt(e = o++))) h = !0;else if (13 === r) h = !0, 10 === t.charCodeAt(o) && ++o;else if (r !== n) continue;\n            return t.slice(i, e);\n          }\n          return l = !0, t.slice(i, s);\n        }\n        for (10 === t.charCodeAt(s - 1) && --s, 13 === t.charCodeAt(s - 1) && --s; (r = u()) !== We;) {\n          for (var f = []; r !== Ge && r !== We;) f.push(r), r = u();\n          e && null == (f = e(f, a++)) || i.push(f);\n        }\n        return i;\n      }\n      function i(e, n) {\n        return e.map(function (e) {\n          return n.map(function (t) {\n            return o(e[t]);\n          }).join(t);\n        });\n      }\n      function s(e) {\n        return e.map(o).join(t);\n      }\n      function o(t) {\n        return null == t ? \"\" : t instanceof Date ? function (t) {\n          var e,\n            n = t.getUTCHours(),\n            r = t.getUTCMinutes(),\n            i = t.getUTCSeconds(),\n            s = t.getUTCMilliseconds();\n          return isNaN(t) ? \"Invalid Date\" : ((e = t.getUTCFullYear()) < 0 ? \"-\" + Ke(-e, 6) : e > 9999 ? \"+\" + Ke(e, 6) : Ke(e, 4)) + \"-\" + Ke(t.getUTCMonth() + 1, 2) + \"-\" + Ke(t.getUTCDate(), 2) + (s ? \"T\" + Ke(n, 2) + \":\" + Ke(r, 2) + \":\" + Ke(i, 2) + \".\" + Ke(s, 3) + \"Z\" : i ? \"T\" + Ke(n, 2) + \":\" + Ke(r, 2) + \":\" + Ke(i, 2) + \"Z\" : r || n ? \"T\" + Ke(n, 2) + \":\" + Ke(r, 2) + \"Z\" : \"\");\n        }(t) : e.test(t += \"\") ? '\"' + t.replace(/\"/g, '\"\"') + '\"' : t;\n      }\n      return {\n        parse: function parse(t, e) {\n          var n,\n            i,\n            s = r(t, function (t, r) {\n              if (n) return n(t, r - 1);\n              i = t, n = e ? function (t, e) {\n                var n = Xe(t);\n                return function (r, i) {\n                  return e(n(r), i, t);\n                };\n              }(t, e) : Xe(t);\n            });\n          return s.columns = i || [], s;\n        },\n        parseRows: r,\n        format: function format(e, n) {\n          return null == n && (n = Ve(e)), [n.map(o).join(t)].concat(i(e, n)).join(\"\\n\");\n        },\n        formatBody: function formatBody(t, e) {\n          return null == e && (e = Ve(t)), i(t, e).join(\"\\n\");\n        },\n        formatRows: function formatRows(t) {\n          return t.map(s).join(\"\\n\");\n        },\n        formatRow: s,\n        formatValue: o\n      };\n    }\n    var Je = Ye(\",\"),\n      Qe = Je.parse;\n    function tn(t, e) {\n      return function (n, r, i) {\n        arguments.length < 3 && (i = r, r = null);\n        var s = qe(n).mimeType(t);\n        return s.row = function (t) {\n          return arguments.length ? s.response(function (t, e) {\n            return function (n) {\n              return t(n.responseText, e);\n            };\n          }(e, r = t)) : r;\n        }, s.row(r), i ? s.get(i) : s;\n      };\n    }\n    Je.parseRows, Je.format, Je.formatBody, Je.formatRows, Je.formatRow, Je.formatValue, tn(\"text/csv\", Qe);\n    var en = Ye(\"\\t\"),\n      nn = en.parse,\n      rn = en.parseRows;\n    en.format, en.formatBody, en.formatRows, en.formatRow, en.formatValue, tn(\"text/tab-separated-values\", nn);\n    var sn = f(function (t) {\n      return t.pos;\n    }).left;\n    function on(t) {\n      var e = [],\n        n = {},\n        r = {};\n      var i = 0;\n      for (var _s15 = 0; _s15 < t.length; _s15++) {\n        var _o20 = Number(t[_s15][1]);\n        i += _o20;\n        var a = {\n          id: _s15,\n          chr: t[_s15][0],\n          pos: i - _o20\n        };\n        e.push(a), r[a.chr] = a, n[t[_s15][0]] = _o20;\n      }\n      return {\n        cumPositions: e,\n        chrPositions: r,\n        totalLength: i,\n        chromLengths: n\n      };\n    }\n    f(function (t) {\n      return t.from;\n    }).right;\n    var an = n(4803),\n      ln = n(2949);\n    var hn = n(6248),\n      un = function un(t, e) {\n        return t.reduce(function (t, n) {\n          return (t[n[e]] = t[n[e]] || []).push(n), t;\n        }, {});\n      };\n    function fn(t, e) {\n      var n = t[0],\n        r = e[0];\n      if (n.indexOf(\"_\") >= 0) {\n        var _t60 = n.split(\"_\");\n        if (r.indexOf(\"_\") >= 0) {\n          var _e55 = r.split(\"_\");\n          return fn(_t60[1], _e55[1]);\n        }\n        return 1;\n      }\n      if (r.indexOf(\"_\") >= 0) return -1;\n      var i = [],\n        s = [];\n      var _iterator21 = _createForOfIteratorHelper(n.match(/(\\d+|[^\\d]+)/g)),\n        _step21;\n      try {\n        for (_iterator21.s(); !(_step21 = _iterator21.n()).done;) {\n          var _t62 = _step21.value;\n          i.push(Number.isNaN(_t62) ? _t62.toLowerCase() : +_t62);\n        }\n      } catch (err) {\n        _iterator21.e(err);\n      } finally {\n        _iterator21.f();\n      }\n      var _iterator22 = _createForOfIteratorHelper(r.match(/(\\d+|[^\\d]+)/g)),\n        _step22;\n      try {\n        for (_iterator22.s(); !(_step22 = _iterator22.n()).done;) {\n          var _t63 = _step22.value;\n          i.push(Number.isNaN(_t63) ? _t63.toLowerCase() : +_t63);\n        }\n      } catch (err) {\n        _iterator22.e(err);\n      } finally {\n        _iterator22.f();\n      }\n      for (var _i26 = 0, _arr = [\"m\", \"y\", \"x\"]; _i26 < _arr.length; _i26++) {\n        var _t61 = _arr[_i26];\n        if (r.toLowerCase().includes(_t61)) return -1;\n        if (n.toLowerCase().includes(_t61)) return 1;\n      }\n      return i < s ? -1 : s > i ? 1 : 0;\n    }\n    var cn = function cn(t, e, n, r) {\n        var i = t.get(\"seq\"),\n          s = +t.get(\"start\") + 1 + n,\n          o = +t.get(\"end\") + 1 + n,\n          a = {\n            id: t.get(\"id\"),\n            mate_ids: [],\n            start: +t.get(\"start\") + 1,\n            from: s,\n            to: o,\n            fromWithClipping: s,\n            toWithClipping: o,\n            md: t.get(\"MD\"),\n            sa: t.get(\"SA\"),\n            chrName: e,\n            chrOffset: n,\n            cigar: t.get(\"cigar\"),\n            mapq: t.get(\"mq\"),\n            strand: 1 === t.get(\"strand\") ? \"+\" : \"-\",\n            row: null,\n            readName: t.get(\"name\"),\n            color: Ae.BG,\n            colorOverride: null,\n            mappingOrientation: null,\n            substitutions: [],\n            mm: t.get(\"MM\"),\n            ml: t.get(\"ML\"),\n            methylationOffsets: []\n          };\n        if (\"+\" === a.strand && r && r.plusStrandColor ? a.color = Ae.PLUS_STRAND : \"-\" === a.strand && r && r.minusStrandColor && (a.color = Ae.MINUS_STRAND), a.substitutions = function (t, e, n) {\n          var r = [],\n            i = null;\n          if (t.cigar) {\n            var _e56 = Se(t.cigar, !0);\n            var _n36 = 0;\n            var _iterator23 = _createForOfIteratorHelper(_e56),\n              _step23;\n            try {\n              for (_iterator23.s(); !(_step23 = _iterator23.n()).done;) {\n                var _i27 = _step23.value;\n                \"S\" !== _i27.type && \"H\" !== _i27.type ? \"X\" === _i27.type ? (r.push({\n                  pos: _n36,\n                  length: _i27.length,\n                  range: [_n36 + t.start, _n36 + t.start + _i27.length],\n                  type: \"X\"\n                }), _n36 += _i27.length) : \"I\" === _i27.type ? r.push({\n                  pos: _n36,\n                  length: _i27.length,\n                  range: [_n36 + t.start, _n36 + t.start + _i27.length],\n                  type: \"I\"\n                }) : \"D\" === _i27.type ? (r.push({\n                  pos: _n36,\n                  length: _i27.length,\n                  range: [_n36 + t.start, _n36 + t.start + _i27.length],\n                  type: \"D\"\n                }), _n36 += _i27.length) : \"N\" === _i27.type ? (r.push({\n                  pos: _n36,\n                  length: _i27.length,\n                  range: [_n36 + t.start, _n36 + t.start + _i27.length],\n                  type: \"N\"\n                }), _n36 += _i27.length) : \"=\" === _i27.type ? (r.push({\n                  pos: _n36,\n                  length: _i27.length,\n                  range: [_n36 + t.start, _n36 + t.start + _i27.length],\n                  type: \"=\"\n                }), _n36 += _i27.length) : \"M\" === _i27.type && (r.push({\n                  pos: _n36,\n                  length: _i27.length,\n                  range: [_n36 + t.start, _n36 + t.start + _i27.length],\n                  type: \"M\"\n                }), _n36 += _i27.length) : (r.push({\n                  pos: _n36,\n                  length: _i27.length,\n                  range: [_n36 + t.start, _n36 + t.start + _i27.length],\n                  type: _i27.type\n                }), _n36 += _i27.length);\n              }\n            } catch (err) {\n              _iterator23.e(err);\n            } finally {\n              _iterator23.f();\n            }\n            var _s16 = _e56[0],\n              _o21 = _e56[_e56.length - 1];\n            \"S\" === _s16.type && (i = _s16, r.push({\n              pos: -_s16.length,\n              type: \"S\",\n              length: _s16.length\n            })), \"S\" === _o21.type && r.push({\n              pos: t.to - t.from,\n              length: _o21.length,\n              type: \"S\"\n            }), \"H\" === _s16.type && r.push({\n              pos: -_s16.length,\n              type: \"H\",\n              length: _s16.length\n            }), \"H\" === _o21.type && r.push({\n              pos: t.to - t.from,\n              length: _o21.length,\n              type: \"H\"\n            });\n          }\n          if (t.md) {\n            var _n37 = Se(t.md, !1);\n            _n37.forEach(function (t) {\n              var n = t.pos + t.bamSeqShift,\n                r = n + t.length;\n              null !== i && (n += i.length, r += i.length), t.variant = e.substring(n, r), delete t.bamSeqShift;\n            }), r = _n37.concat(r);\n          }\n          return r;\n        }(a, i), r.methylation && (a.methylationOffsets = function (t, e, n) {\n          var r = [];\n          var i = {\n              unmodifiedBase: \"\",\n              code: \"\",\n              strand: \"\",\n              offsets: [],\n              probabilities: []\n            },\n            s = function s(t, e) {\n              var n = [];\n              for (var _r33 = 0; _r33 < t.length; ++_r33) t[_r33] === e && n.push(_r33);\n              return n;\n            },\n            o = {\n              A: \"T\",\n              C: \"G\",\n              G: \"C\",\n              T: \"A\",\n              U: \"A\",\n              Y: \"R\",\n              R: \"Y\",\n              S: \"S\",\n              W: \"W\",\n              K: \"M\",\n              M: \"K\",\n              B: \"V\",\n              V: \"B\",\n              D: \"H\",\n              H: \"D\",\n              N: \"N\"\n            };\n          if (t.mm && t.ml) {\n            var _a9 = 0;\n            var _l6 = t.mm.split(\";\"),\n              _h7 = t.ml.split(\",\");\n            _l6.forEach(function (l) {\n              if (0 === l.length) return;\n              var u = Object.assign({}, i),\n                f = l.split(\",\");\n              u.unmodifiedBase = f[0].charAt(0), u.strand = f[0].charAt(1), u.code = f[0].charAt(2);\n              var c = f.length - 1,\n                d = new Array(c),\n                g = new Array(c),\n                p = \"+\" === t.strand ? s(e, u.unmodifiedBase) : s(e, o[u.unmodifiedBase]);\n              var m = 0;\n              if (\"+\" === t.strand) for (var _t64 = 1; _t64 < f.length; ++_t64) {\n                m += parseInt(f[_t64]);\n                var _e57 = p[m],\n                  _n38 = _h7[_t64 - 1 + _a9];\n                d[_t64 - 1] = _e57, g[_t64 - 1] = _n38, m += 1;\n              } else for (var _t65 = 1; _t65 < f.length; ++_t65) {\n                m += parseInt(f[_t65]);\n                var _e58 = p[p.length - m - 1],\n                  _n39 = _h7[_t65 - 1 + _a9];\n                d[c - _t65] = _e58, g[c - _t65] = _n39, m += 1;\n              }\n              if (\"C\" === u.unmodifiedBase && \"-\" === t.strand && n) for (var _t66 = 0; _t66 < c; ++_t66) d[_t66] -= 1;\n              var _ = 0,\n                b = 0,\n                w = 0;\n              var y = new Array(),\n                v = new Array();\n              var _iterator24 = _createForOfIteratorHelper(t.substitutions),\n                _step24;\n              try {\n                for (_iterator24.s(); !(_step24 = _iterator24.n()).done;) {\n                  var _e59 = _step24.value;\n                  if (\"S\" === _e59.type || \"H\" === _e59.type) b -= _e59.length, w = _e59.length;else if (\"M\" === _e59.type || \"=\" === _e59.type) for (; d[_] + b < _e59.pos + _e59.length;) d[_] + b >= _e59.pos && (y.push(d[_] + b - w), v.push(g[_])), _++;else \"X\" === _e59.type ? d[_] + b === _e59.pos && _++ : \"D\" === _e59.type ? b += _e59.length : \"I\" === _e59.type ? b -= _e59.length : \"N\" === _e59.type && (b += _e59.length);\n                  \"S\" !== _e59.type && \"H\" !== _e59.type || (b += _e59.length);\n                }\n              } catch (err) {\n                _iterator24.e(err);\n              } finally {\n                _iterator24.f();\n              }\n              u.offsets = y, u.probabilities = v, r.push(u), _a9 += c;\n            });\n          }\n          return r;\n        }(a, i, r.methylation.alignCpGEvents)), r.indexDHS) {\n          a.metadata = JSON.parse(t.get(\"CO\")), a.indexDHSColors = function (t) {\n            if (!t.indexDHS) return {};\n            var e = {\n              INDEX_DHS_BG: [0, 0, 0, 0]\n            };\n            return Object.entries(t.indexDHS.itemRGBMap).map(function (t) {\n              var n = t[0],\n                r = n.split(\",\").map(function (t) {\n                  return parseFloat((parseFloat(t) / 255).toFixed(2));\n                });\n              e[\"INDEX_DHS_\".concat(n)] = [].concat(_toConsumableArray(r), [1]);\n            }), _objectSpread(_objectSpread({}, Ee), e);\n          }(r);\n          var _e60 = {};\n          Object.keys(a.indexDHSColors).map(function (t, n) {\n            return _e60[t] = n, null;\n          }), Ae = _e60, a.color = Ae.INDEX_DHS_BG;\n        }\n        var l = 0,\n          h = 0;\n        var _iterator25 = _createForOfIteratorHelper(a.substitutions),\n          _step25;\n        try {\n          for (_iterator25.s(); !(_step25 = _iterator25.n()).done;) {\n            var _t67 = _step25.value;\n            (\"S\" === _t67.type || \"H\" === _t67.type) && _t67.pos < 0 ? l = -_t67.length : (\"S\" === _t67.type || \"H\" === _t67.type) && _t67.pos > 0 && (h = _t67.length);\n          }\n        } catch (err) {\n          _iterator25.e(err);\n        } finally {\n          _iterator25.f();\n        }\n        return a.fromWithClipping += l, a.toWithClipping += h, a;\n      },\n      dn = function dn(t) {\n        var e = un(t, \"readName\");\n        return Object.entries(e).forEach(function (_ref22) {\n          var _ref23 = _slicedToArray(_ref22, 2),\n            t = _ref23[0],\n            e = _ref23[1];\n          if (2 === e.length) {\n            var _t68 = e[0],\n              n = e[1];\n            _t68.mate_ids = [n.id], n.mate_ids = [_t68.id];\n          } else if (e.length > 2) {\n            var _t69 = e.map(function (t) {\n              return t.id;\n            });\n            e.forEach(function (e) {\n              e.mate_ids = _t69;\n            });\n          }\n        }), e;\n      },\n      gn = function gn(t) {\n        var e = [],\n          n = Object.keys(t);\n        var _loop2 = function _loop2() {\n          var i = {\n            row: null,\n            substitutions: []\n          };\n          for (var _e61 = 0; _e61 < n.length; _e61++) i[n[_e61]] = t[n[_e61]][r];\n          if (i.from += 1, i.to += 1, i.variants && (i.substitutions = i.variants.map(function (t) {\n            return {\n              pos: t[1] - (i.from - i.chrOffset) + 1,\n              variant: t[2].toUpperCase(),\n              length: 1\n            };\n          })), i.cigars) {\n            var _iterator26 = _createForOfIteratorHelper(i.cigars),\n              _step26;\n            try {\n              for (_iterator26.s(); !(_step26 = _iterator26.n()).done;) {\n                var _t70 = _step26.value;\n                i.substitutions.push({\n                  pos: _t70[0] - (i.from - i.chrOffset) + 1,\n                  type: _t70[1].toUpperCase(),\n                  length: _t70[2]\n                });\n              }\n            } catch (err) {\n              _iterator26.e(err);\n            } finally {\n              _iterator26.f();\n            }\n          }\n          e.push(i);\n        };\n        for (var r = 0; r < t[n[0]].length; r++) {\n          _loop2();\n        }\n        return e;\n      },\n      pn = {},\n      mn = {},\n      _n = {},\n      bn = {},\n      wn = {},\n      yn = {},\n      vn = new (Te())({\n        max: 20\n      }),\n      kn = {},\n      xn = {},\n      En = new (Te())({\n        max: 20\n      }),\n      An = {},\n      Bn = {};\n    function Sn(t, e) {\n      var n = bn[e].authHeader,\n        r = {\n          headers: {}\n        };\n      return n && (r.headers.Authorization = n), fetch(t, r);\n    }\n    var In = {\n        maxTileWidth: 2e5\n      },\n      Mn = function Mn(t) {\n        var _An$t = An[t],\n          e = _An$t.chromSizesUrl,\n          n = _An$t.bamUrl,\n          r = e ? [mn[n], wn[e]] : [mn[n]];\n        return Promise.all(r).then(function (r) {\n          var i = 1024;\n          var s = null;\n          if (r.length > 1) s = r[1];else {\n            var _t71 = [];\n            var _iterator27 = _createForOfIteratorHelper(pn[n].indexToChr),\n              _step27;\n            try {\n              for (_iterator27.s(); !(_step27 = _iterator27.n()).done;) {\n                var _step27$value = _step27.value,\n                  _e62 = _step27$value.refName,\n                  _r34 = _step27$value.length;\n                _t71.push([_e62, _r34]);\n              }\n            } catch (err) {\n              _iterator27.e(err);\n            } finally {\n              _iterator27.f();\n            }\n            _t71.sort(fn), s = on(_t71);\n          }\n          yn[e] = s;\n          var o = {\n            tile_size: i,\n            bins_per_dimension: i,\n            max_zoom: Math.ceil(Math.log(s.totalLength / i) / Math.log(2)),\n            max_width: s.totalLength,\n            min_pos: [0],\n            max_pos: [s.totalLength]\n          };\n          return kn[t] = o, o;\n        });\n      },\n      Tn = /*#__PURE__*/function () {\n        var _ref24 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee65(t, e, n) {\n          var _n$t, r, i, _An$t2, s, o, a, l, h;\n          return _regeneratorRuntime().wrap(function _callee65$(_context68) {\n            while (1) switch (_context68.prev = _context68.next) {\n              case 0:\n                _n$t = _n[t], r = _n$t.maxTileWidth, i = _n$t.maxSampleSize, _An$t2 = An[t], s = _An$t2.bamUrl, o = _An$t2.fastaUrl, a = _An$t2.chromSizesUrl, l = pn[s], h = o && xn[o] ? xn[o] : null;\n                return _context68.abrupt(\"return\", Mn(t).then(function (s) {\n                  var o = +s.max_width / Math.pow(2, +e),\n                    u = [];\n                  if (o > r) return new Promise(function (t) {\n                    return t([]);\n                  });\n                  var f = s.min_pos[0] + n * o;\n                  var c = s.min_pos[0] + (n + 1) * o,\n                    d = yn[a],\n                    g = d.chromLengths,\n                    p = d.cumPositions;\n                  var _loop3 = function _loop3(_r35) {\n                    var s = p[_r35].chr,\n                      o = p[_r35].pos,\n                      a = p[_r35].pos + g[s];\n                    if (vn.set(\"\".concat(t, \".\").concat(e, \".\").concat(n), []), En.set(\"\".concat(t, \".\").concat(e, \".\").concat(n), []), o <= f && f < a) {\n                      var _d2 = {\n                        viewAsPairs: Ie(Bn[t]),\n                        maxSampleSize: i || 1e3,\n                        maxInsertSize: 1e3\n                      };\n                      if (!(c > a)) {\n                        var _i28 = Math.ceil(c - o),\n                          _a10 = Math.floor(f - o);\n                        u.push(l.getRecordsForRange(s, _a10, _i28, _d2).then(function (i) {\n                          var o = i.map(function (e) {\n                            return cn(e, s, p[_r35].pos, Bn[t]);\n                          });\n                          return vn.set(\"\".concat(t, \".\").concat(e, \".\").concat(n), vn.get(\"\".concat(t, \".\").concat(e, \".\").concat(n)).concat(o)), [];\n                        })), h && u.push(h.getSequence(s, _a10, _i28).then(function (o) {\n                          var l = {\n                            id: \"\".concat(s, \":\").concat(_a10, \"-\").concat(_i28),\n                            chrom: s,\n                            start: _a10,\n                            stop: _i28,\n                            chromOffset: p[_r35].pos,\n                            data: o\n                          };\n                          return En.set(\"\".concat(t, \".\").concat(e, \".\").concat(n), En.get(\"\".concat(t, \".\").concat(e, \".\").concat(n)).concat(l)), [];\n                        }));\n                        return 1; // break\n                      }\n                      u.push(l.getRecordsForRange(s, f - o, a - o, _d2).then(function (i) {\n                        var o = i.map(function (e) {\n                          return cn(e, s, p[_r35].pos, Bn[t]);\n                        });\n                        vn.set(\"\".concat(t, \".\").concat(e, \".\").concat(n), vn.get(\"\".concat(t, \".\").concat(e, \".\").concat(n)).concat(o));\n                      })), h && u.push(h.getSequence(s, f - o, a - o).then(function (i) {\n                        var l = {\n                          id: \"\".concat(s, \":\").concat(f - o, \"-\").concat(a - o),\n                          chrom: s,\n                          start: f - o,\n                          stop: a - o,\n                          chromOffset: p[_r35].pos,\n                          data: i\n                        };\n                        En.set(\"\".concat(t, \".\").concat(e, \".\").concat(n), En.get(\"\".concat(t, \".\").concat(e, \".\").concat(n)).concat(l));\n                      })), f = a;\n                    }\n                  };\n                  for (var _r35 = 0; _r35 < p.length; _r35++) {\n                    if (_loop3(_r35)) break;\n                  }\n                  return Promise.all(u).then(function (t) {\n                    return t.flat();\n                  });\n                }));\n              case 2:\n              case \"end\":\n                return _context68.stop();\n            }\n          }, _callee65);\n        }));\n        return function Tn(_x95, _x96, _x97) {\n          return _ref24.apply(this, arguments);\n        };\n      }(),\n      zn = function zn(t, e, n) {\n        var r = t.max_width / Math.pow(2, e);\n        return [n * r, (n + 1) * r];\n      };\n    function On(t, e, n) {\n      var r = t.fromWithClipping - n,\n        i = t.toWithClipping + n;\n      if (null === t.row || void 0 === t.row) {\n        for (var _n40 = 0; _n40 < e.length; _n40++) {\n          if (!e[_n40]) return;\n          var _s17 = e[_n40].from,\n            _o22 = e[_n40].to;\n          if (i < _s17) return t.row = _n40, void (e[_n40] = {\n            from: r,\n            to: _o22\n          });\n          if (r > _o22) return t.row = _n40, void (e[_n40] = {\n            from: _s17,\n            to: i\n          });\n        }\n        t.row = e.length, e.push({\n          from: r,\n          to: i\n        });\n      } else {\n        var _n41 = t.row;\n        if (e[_n41]) {\n          var _t72 = e[_n41].from,\n            _s18 = e[_n41].to;\n          e[_n41] = {\n            from: Math.min(r, _t72),\n            to: Math.max(i, _s18)\n          };\n        } else e[_n41] = {\n          from: r,\n          to: i\n        };\n      }\n    }\n    function Cn(t, e) {\n      var _Object$assign = Object.assign({\n          prevRows: [],\n          padding: 5\n        }, e || {}),\n        n = _Object$assign.prevRows,\n        r = _Object$assign.padding;\n      var i = [];\n      var s = new Set(t.map(function (t) {\n          return t.id;\n        })),\n        o = n.flat().filter(function (t) {\n          return s.has(t.id);\n        });\n      e.maxRows && e.maxRows;\n      for (var _t73 = 0; _t73 < o.length; _t73++) On(o[_t73], i, r);\n      var a = new Set(o.map(function (t) {\n        return t.id;\n      }));\n      var l = [];\n      var h = t.filter(function (t) {\n        return !a.has(t.id);\n      });\n      if (0 === o.length) {\n        h.sort(function (t, e) {\n          return t.fromWithClipping - e.fromWithClipping;\n        });\n        var _iterator28 = _createForOfIteratorHelper(h),\n          _step28;\n        try {\n          for (_iterator28.s(); !(_step28 = _iterator28.n()).done;) {\n            var _t74 = _step28.value;\n            On(_t74, i, r);\n          }\n        } catch (err) {\n          _iterator28.e(err);\n        } finally {\n          _iterator28.f();\n        }\n        l = h;\n      } else {\n        var _t75 = (o[0].fromWithClipping + o[o.length - 1].to) / 2,\n          _e63 = h.filter(function (e) {\n            return e.fromWithClipping <= _t75;\n          });\n        _e63.sort(function (t, e) {\n          return e.fromWithClipping - t.fromWithClipping;\n        });\n        var _iterator29 = _createForOfIteratorHelper(_e63),\n          _step29;\n        try {\n          for (_iterator29.s(); !(_step29 = _iterator29.n()).done;) {\n            var _t76 = _step29.value;\n            On(_t76, i, r);\n          }\n        } catch (err) {\n          _iterator29.e(err);\n        } finally {\n          _iterator29.f();\n        }\n        var _n42 = h.filter(function (e) {\n          return e.fromWithClipping > _t75;\n        });\n        _n42.sort(function (t, e) {\n          return t.fromWithClipping - e.fromWithClipping;\n        });\n        var _iterator30 = _createForOfIteratorHelper(_n42),\n          _step30;\n        try {\n          for (_iterator30.s(); !(_step30 = _iterator30.n()).done;) {\n            var _t77 = _step30.value;\n            On(_t77, i, r);\n          }\n        } catch (err) {\n          _iterator30.e(err);\n        } finally {\n          _iterator30.f();\n        }\n        l = _e63.concat(o, _n42);\n      }\n      var u = [];\n      var _loop4 = function _loop4(_t78) {\n        u[_t78] = l.filter(function (e) {\n          return e.row === _t78;\n        });\n      };\n      for (var _t78 = 0; _t78 < i.length; _t78++) {\n        _loop4(_t78);\n      }\n      return u;\n    }\n    var Rn = Math.pow(2, 20),\n      Nn = Math.pow(2, 21),\n      Ln = Math.pow(2, 21),\n      Un = new Float32Array(Rn),\n      Pn = new Float32Array(Nn),\n      $n = new Int32Array(Ln);\n    function jn(t) {\n      for (var e in t) return !1;\n      return !0;\n    }\n    var Fn = {\n      init: function init(t, e, r, i, s, o, a, l) {\n        if (_n[t] = a ? _objectSpread(_objectSpread({}, In), a) : In, i && s) {\n          var _t79 = new ln.kC(i),\n            _e64 = new ln.kC(s),\n            _n43 = n(496),\n            _r36 = _n43.IndexedFasta;\n          xn[i] = new _r36({\n            fasta: _t79,\n            fai: _e64\n          });\n        }\n        o && (wn[o] = wn[o] || new Promise(function (t) {\n          !function (t, e) {\n            var n = {\n              absToChr: function absToChr(t) {\n                return n.chrPositions ? function (t, e) {\n                  if (!e || !e.cumPositions || !e.cumPositions.length) return null;\n                  var n = sn(e.cumPositions, t);\n                  var r = e.cumPositions[e.cumPositions.length - 1].chr,\n                    i = e.chromLengths[r];\n                  n -= n > 0 && 1;\n                  var s = Math.floor(t - e.cumPositions[n].pos),\n                    o = 0;\n                  return s < 0 && (o = s - 1, s = 1), n === e.cumPositions.length - 1 && s > i && (o = s - i, s = i), [e.cumPositions[n].chr, s, o, n];\n                }(t, n) : null;\n              },\n              chrToAbs: function chrToAbs() {\n                var _ref25 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [],\n                  _ref26 = _slicedToArray(_ref25, 2),\n                  t = _ref26[0],\n                  e = _ref26[1];\n                return n.chrPositions ? (r = t, i = e, n.chrPositions[r].pos + i) : null;\n                var r, i;\n              }\n            };\n            Ze(t, function (t, r) {\n              if (t) e && e(null);else {\n                var _t80 = on(rn(r));\n                Object.keys(_t80).forEach(function (e) {\n                  n[e] = _t80[e];\n                }), e && e(n);\n              }\n            });\n          }(o, t);\n        })), pn[e] || (pn[e] = new xe({\n          bamUrl: e,\n          baiUrl: r\n        }), mn[e] = pn[e].getHeader()), An[t] = {\n          bamUrl: e,\n          fastaUrl: i,\n          chromSizesUrl: o\n        }, Bn[t] = l;\n      },\n      serverInit: function serverInit(t, e, n, r) {\n        bn[t] = {\n          server: e,\n          tilesetUid: n,\n          authHeader: r\n        };\n      },\n      tilesetInfo: Mn,\n      serverTilesetInfo: function serverTilesetInfo(t) {\n        return Sn(\"\".concat(bn[t].server, \"/tileset_info/?d=\").concat(bn[t].tilesetUid), t).then(function (t) {\n          return t.json();\n        }).then(function (e) {\n          var n = e[bn[t].tilesetUid];\n          return kn[t] = n, n;\n        });\n      },\n      serverFetchTilesDebounced: function () {\n        var _serverFetchTilesDebounced = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee66(t, e) {\n          var n, r, i, _iterator31, _step31, _loop5, s;\n          return _regeneratorRuntime().wrap(function _callee66$(_context70) {\n            while (1) switch (_context70.prev = _context70.next) {\n              case 0:\n                n = bn[t], r = {}, i = [];\n                _iterator31 = _createForOfIteratorHelper(e);\n                _context70.prev = 2;\n                _loop5 = /*#__PURE__*/_regeneratorRuntime().mark(function _loop5() {\n                  var n, _n$split, _n$split2, e, s, o, a, _zn, _zn2, l, h, _i29;\n                  return _regeneratorRuntime().wrap(function _loop5$(_context69) {\n                    while (1) switch (_context69.prev = _context69.next) {\n                      case 0:\n                        n = _step31.value;\n                        _n$split = n.split(\".\"), _n$split2 = _slicedToArray(_n$split, 2), e = _n$split2[0], s = _n$split2[1];\n                        o = kn[t];\n                        a = !1;\n                        _zn = zn(o, e, s), _zn2 = _slicedToArray(_zn, 2), l = _zn2[0], h = _zn2[1];\n                      case 5:\n                        if (!(e > 0)) {\n                          _context69.next = 13;\n                          break;\n                        }\n                        _i29 = \"\".concat(t, \".\").concat(e, \".\").concat(s);\n                        if (!vn.has(_i29)) {\n                          _context69.next = 10;\n                          break;\n                        }\n                        r[n] = vn.get(_i29).filter(function (t) {\n                          return l < t.to && h > t.from;\n                        }), r[n].tilePositionId = n, vn.set(\"\".concat(t, \".\").concat(n), r[n]), a = !0;\n                        return _context69.abrupt(\"break\", 13);\n                      case 10:\n                        e -= 1, s = Math.floor(s / 2);\n                      case 11:\n                        _context69.next = 5;\n                        break;\n                      case 13:\n                        a || i.push(n);\n                      case 14:\n                      case \"end\":\n                        return _context69.stop();\n                    }\n                  }, _loop5);\n                });\n                _iterator31.s();\n              case 5:\n                if ((_step31 = _iterator31.n()).done) {\n                  _context70.next = 9;\n                  break;\n                }\n                return _context70.delegateYield(_loop5(), \"t0\", 7);\n              case 7:\n                _context70.next = 5;\n                break;\n              case 9:\n                _context70.next = 14;\n                break;\n              case 11:\n                _context70.prev = 11;\n                _context70.t1 = _context70[\"catch\"](2);\n                _iterator31.e(_context70.t1);\n              case 14:\n                _context70.prev = 14;\n                _iterator31.f();\n                return _context70.finish(14);\n              case 17:\n                s = i.map(function (t) {\n                  return \"d=\".concat(n.tilesetUid, \".\").concat(t);\n                });\n                return _context70.abrupt(\"return\", Sn(\"\".concat(bn[t].server, \"/tiles/?\").concat(s.join(\"&\")), t).then(function (t) {\n                  return t.json();\n                }).then(function (i) {\n                  var s = {};\n                  var _iterator32 = _createForOfIteratorHelper(e),\n                    _step32;\n                  try {\n                    for (_iterator32.s(); !(_step32 = _iterator32.n()).done;) {\n                      var _r37 = _step32.value;\n                      var _e65 = \"\".concat(t, \".\").concat(_r37),\n                        _o23 = \"\".concat(n.tilesetUid, \".\").concat(_r37);\n                      if (i[_o23]) {\n                        var _t81 = i[_o23];\n                        i[_o23].error || (_t81 = gn(i[_o23])), _t81.tilePositionId = _r37, s[_r37] = _t81, vn.set(_e65, _t81);\n                      }\n                    }\n                  } catch (err) {\n                    _iterator32.e(err);\n                  } finally {\n                    _iterator32.f();\n                  }\n                  return _objectSpread(_objectSpread({}, r), s);\n                }));\n              case 19:\n              case \"end\":\n                return _context70.stop();\n            }\n          }, _callee66, null, [[2, 11, 14, 17]]);\n        }));\n        function serverFetchTilesDebounced(_x98, _x99) {\n          return _serverFetchTilesDebounced.apply(this, arguments);\n        }\n        return serverFetchTilesDebounced;\n      }(),\n      fetchTilesDebounced: function () {\n        var _fetchTilesDebounced = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee67(t, e) {\n          var n, r, i, _iterator33, _step33, _n44, _e67, _s19, _o24;\n          return _regeneratorRuntime().wrap(function _callee67$(_context71) {\n            while (1) switch (_context71.prev = _context71.next) {\n              case 0:\n                n = {}, r = [], i = [];\n                _iterator33 = _createForOfIteratorHelper(e);\n                try {\n                  for (_iterator33.s(); !(_step33 = _iterator33.n()).done;) {\n                    _n44 = _step33.value;\n                    _e67 = _n44.split(\".\"), _s19 = parseInt(_e67[0], 10), _o24 = parseInt(_e67[1], 10);\n                    Number.isNaN(_o24) || Number.isNaN(_s19) ? console.warn(\"Invalid tile zoom or position:\", _s19, _o24) : (r.push(_n44), i.push(Tn(t, _s19, _o24)));\n                  }\n                } catch (err) {\n                  _iterator33.e(err);\n                } finally {\n                  _iterator33.f();\n                }\n                return _context71.abrupt(\"return\", Promise.all(i).then(function (t) {\n                  for (var _e66 = 0; _e66 < t.length; _e66++) {\n                    var _i30 = r[_e66];\n                    n[_i30] = t[_e66], n[_i30].tilePositionId = _i30;\n                  }\n                  return n;\n                }));\n              case 4:\n              case \"end\":\n                return _context71.stop();\n            }\n          }, _callee67);\n        }));\n        function fetchTilesDebounced(_x100, _x101) {\n          return _fetchTilesDebounced.apply(this, arguments);\n        }\n        return fetchTilesDebounced;\n      }(),\n      tile: Tn,\n      renderSegments: function renderSegments(e, n, r, i, o, a, l, h, u, f) {\n        var c = {},\n          d = {};\n        var g,\n          p = {},\n          m = null;\n        var _iterator34 = _createForOfIteratorHelper(n),\n          _step34;\n        try {\n          for (_iterator34.s(); !(_step34 = _iterator34.n()).done;) {\n            var _P = _step34.value;\n            var _$ = null;\n            try {\n              if (_$ = vn.get(\"\".concat(e, \".\").concat(_P)), _$.error) continue;\n            } catch (F) {\n              continue;\n            }\n            if (!_$) continue;\n            var _iterator59 = _createForOfIteratorHelper(_$),\n              _step59;\n            try {\n              for (_iterator59.s(); !(_step59 = _iterator59.n()).done;) {\n                var _D = _step59.value;\n                c[_D.id] = _D;\n              }\n            } catch (err) {\n              _iterator59.e(err);\n            } finally {\n              _iterator59.f();\n            }\n            var _j = En.get(\"\".concat(e, \".\").concat(_P));\n            if (_j && h.methylation && h.methylation.highlights) {\n              var _q = Object.keys(h.methylation.highlights);\n              var _iterator60 = _createForOfIteratorHelper(_j),\n                _step60;\n              try {\n                for (_iterator60.s(); !(_step60 = _iterator60.n()).done;) {\n                  var _H = _step60.value;\n                  var _Z = parseInt(_H.start) + parseInt(_H.chromOffset),\n                    _G = _H.data.toUpperCase();\n                  var _iterator61 = _createForOfIteratorHelper(_q),\n                    _step61;\n                  try {\n                    for (_iterator61.s(); !(_step61 = _iterator61.n()).done;) {\n                      var _W = _step61.value;\n                      if (\"M0A\" !== _W) {\n                        var _X = _W.toUpperCase(),\n                          _V = _W.length;\n                        var _K = _G.indexOf(_X);\n                        for (!jn(d) && d[_W] || (d[_W] = new Array()); _K > -1;) d[_W].push(_K + _Z + 1), _K = _G.indexOf(_X, _K + _V);\n                      } else if (\"M0A\" === _W) {\n                        var _Y = _G.indexOf(\"A\"),\n                          _J = _G.indexOf(\"T\"),\n                          _Q = Math.min(_Y, _J);\n                        for (!jn(d) && d[_W] || (d[_W] = new Array()); _Q > -1;) d[_W].push(_Q + _Z + 1), _Y = _G.indexOf(\"A\", _Q + 1), _J = _G.indexOf(\"T\", _Q + 1), _Q = -1 !== _Y && -1 !== _J ? Math.min(_Y, _J) : -1 === _Y ? _J : -1 === _J ? _Y : -1;\n                        m = new Set(_toConsumableArray(d[_W]));\n                      }\n                    }\n                  } catch (err) {\n                    _iterator61.e(err);\n                  } finally {\n                    _iterator61.f();\n                  }\n                }\n              } catch (err) {\n                _iterator60.e(err);\n              } finally {\n                _iterator60.f();\n              }\n            }\n          }\n        } catch (err) {\n          _iterator34.e(err);\n        } finally {\n          _iterator34.f();\n        }\n        var _ = Object.values(c);\n        if (h.minMappingQuality > 0 && (_ = _.filter(function (t) {\n          return t.mapq >= h.minMappingQuality;\n        })), function (t, e) {\n          var n = e.outlineMateOnHover,\n            r = e.highlightReadsBy.includes(\"insertSize\"),\n            i = e.highlightReadsBy.includes(\"pairOrientation\"),\n            s = e.highlightReadsBy.includes(\"insertSizeAndPairOrientation\");\n          var o;\n          if (!(r || i || s)) return n ? void dn(t) : void 0;\n          o = dn(t), Object.entries(o).forEach(function (_ref27) {\n            var _ref28 = _slicedToArray(_ref27, 2),\n              t = _ref28[0],\n              n = _ref28[1];\n            if (2 === n.length) {\n              var _t82 = n[0],\n                _l7 = n[1];\n              _t82.colorOverride = null, _l7.colorOverride = null;\n              var _h8 = (a = _l7, (o = _t82).from < a.from ? Math.max(0, a.from - o.to) : Math.max(0, o.from - a.to)),\n                _u2 = e.largeInsertSizeThreshold && _h8 > e.largeInsertSizeThreshold,\n                _f2 = e.smallInsertSizeThreshold && _h8 < e.smallInsertSizeThreshold,\n                _c4 = \"+\" === _t82.strand && \"+\" === _l7.strand,\n                _d3 = \"-\" === _t82.strand && \"-\" === _l7.strand,\n                _g2 = _t82.from < _l7.from && \"-\" === _t82.strand;\n              r && (_u2 ? _t82.colorOverride = Ae.LARGE_INSERT_SIZE : _f2 && (_t82.colorOverride = Ae.SMALL_INSERT_SIZE)), (i || s && (_u2 || _f2)) && (_c4 ? (_t82.colorOverride = Ae.LL, _t82.mappingOrientation = \"++\") : _d3 ? (_t82.colorOverride = Ae.RR, _t82.mappingOrientation = \"--\") : _g2 && (_t82.colorOverride = Ae.RL, _t82.mappingOrientation = \"-+\")), _l7.colorOverride = _t82.colorOverride, _l7.mappingOrientation = _t82.mappingOrientation;\n            }\n            var o, a;\n          });\n        }(_, h), Ie(h) && (!u || !f)) {\n          var _tt = Number.MAX_VALUE,\n            _et = -Number.MAX_VALUE;\n          var _nt = kn[e];\n          var _iterator35 = _createForOfIteratorHelper(n),\n            _step35;\n          try {\n            for (_iterator35.s(); !(_step35 = _iterator35.n()).done;) {\n              var _rt = _step35.value;\n              var _it = _rt.split(\".\")[0],\n                _st = _rt.split(\".\")[1],\n                _ot = zn(_nt, +_it, +_st);\n              _tt = Math.min(_tt, _ot[0]), _et = Math.max(_et, _ot[1]);\n            }\n          } catch (err) {\n            _iterator35.e(err);\n          } finally {\n            _iterator35.f();\n          }\n          _ = _.filter(function (t) {\n            return t.to >= _tt && t.from <= _et;\n          });\n        }\n        var _ref29 = [Number.MAX_VALUE, -Number.MAX_VALUE],\n          b = _ref29[0],\n          w = _ref29[1];\n        for (var _at = 0; _at < _.length; _at++) _[_at].from < b && (b = _[_at].from), _[_at].to > w && (w = _[_at].to);\n        var y = null;\n        if (un) {\n          var _lt = h && h.groupBy;\n          _lt = _lt || null, y = un(_, _lt);\n        } else y = {\n          \"null\": _\n        };\n        var v = null;\n        if ((u || f) && h.methylation) {\n          var _ht = f || u,\n            _ut = f ? f.order : null,\n            _ft = _ht.range.left.start,\n            _ct = _ht.range.right.stop,\n            _dt = _ht.viewportRange.left.start,\n            _gt = _ht.viewportRange.right.stop,\n            _pt = _ht.method,\n            _mt = _ht.distanceFn,\n            _t83 = _ht.eventCategories,\n            _bt = (_ht.linkage, _ht.epsilon),\n            _wt = _ht.minimumPoints,\n            _yt = {\n              min: _ht.probabilityThresholdRange[0],\n              max: _ht.probabilityThresholdRange[1]\n            },\n            _vt = _ht.eventOverlapType;\n          var _kt = null;\n          var _xt = _ct - _ft,\n            _Et = _.length,\n            _At = new Array();\n          var _Bt = 0;\n          var _It = {};\n          switch (_pt) {\n            case \"AGNES\":\n              switch (_mt) {\n                case \"Euclidean\":\n                  _kt = an.WI;\n                  for (var _Mt = 0; _Mt < _Et; ++_Mt) {\n                    var _Tt = _[_Mt],\n                      _zt = (_Tt.to, _Tt.from, new Array(_xt).fill(-255)),\n                      _Ot = _Tt.from - _Tt.chrOffset,\n                      _Ct = _Tt.to - _Tt.chrOffset,\n                      _Rt = _Tt.methylationOffsets;\n                    switch (_vt) {\n                      case \"Full viewport\":\n                        if (_Ot < _dt && _Ct > _gt) {\n                          var _Nt = _ft - _Ot,\n                            _Lt = _Nt + _xt;\n                          var _iterator36 = _createForOfIteratorHelper(_Rt),\n                            _step36;\n                          try {\n                            for (_iterator36.s(); !(_step36 = _iterator36.n()).done;) {\n                              var _Pt = _step36.value;\n                              var _$t = _Pt.offsets,\n                                _jt = _Pt.probabilities;\n                              if (_t83.includes(\"m6A+\") && \"A\" === _Pt.unmodifiedBase || _t83.includes(\"m6A-\") && \"T\" === _Pt.unmodifiedBase || _t83.includes(\"5mC\") && \"C\" === _Pt.unmodifiedBase) for (var _Ft = 0; _Ft < _$t.length; _Ft++) {\n                                var _qt = _$t[_Ft],\n                                  _Ht = _jt[_Ft];\n                                _qt >= _Nt && _qt <= _Lt && _yt.min <= _Ht && _yt.max >= _Ht && (_zt[_qt - _Nt] = parseInt(_Ht));\n                              }\n                            }\n                          } catch (err) {\n                            _iterator36.e(err);\n                          } finally {\n                            _iterator36.f();\n                          }\n                          _It[_Bt] = _Mt, _At[_Bt++] = _zt;\n                        }\n                        break;\n                      case \"Full region\":\n                        if (_Ot < _ft && _Ct > _ct) {\n                          var _Zt = _ft - _Ot,\n                            _Gt = _Zt + _xt;\n                          var _iterator37 = _createForOfIteratorHelper(_Rt),\n                            _step37;\n                          try {\n                            for (_iterator37.s(); !(_step37 = _iterator37.n()).done;) {\n                              var _Wt = _step37.value;\n                              var _Xt = _Wt.offsets,\n                                _Vt = _Wt.probabilities;\n                              if (_t83.includes(\"m6A+\") && \"A\" === _Wt.unmodifiedBase || _t83.includes(\"m6A-\") && \"T\" === _Wt.unmodifiedBase || _t83.includes(\"5mC\") && \"C\" === _Wt.unmodifiedBase) for (var _Kt = 0; _Kt < _Xt.length; _Kt++) {\n                                var _Yt = _Xt[_Kt],\n                                  _Jt = _Vt[_Kt];\n                                _Yt >= _Zt && _Yt <= _Gt && _yt.min <= _Jt && _yt.max >= _Jt && (_zt[_Yt - _Zt] = parseInt(_Jt));\n                              }\n                            }\n                          } catch (err) {\n                            _iterator37.e(err);\n                          } finally {\n                            _iterator37.f();\n                          }\n                          _It[_Bt] = _Mt, _At[_Bt++] = _zt;\n                        }\n                        break;\n                      case \"Partial region\":\n                        if (_Ot < _ft && _Ct > _ct) {\n                          var _Qt3 = _ft - _Ot,\n                            _te = _Qt3 + _xt;\n                          var _iterator38 = _createForOfIteratorHelper(_Rt),\n                            _step38;\n                          try {\n                            for (_iterator38.s(); !(_step38 = _iterator38.n()).done;) {\n                              var _ee = _step38.value;\n                              var _ne = _ee.offsets,\n                                _re = _ee.probabilities;\n                              if (_t83.includes(\"m6A+\") && \"A\" === _ee.unmodifiedBase || _t83.includes(\"m6A-\") && \"T\" === _ee.unmodifiedBase || _t83.includes(\"5mC\") && \"C\" === _ee.unmodifiedBase) for (var _ie = 0; _ie < _ne.length; _ie++) {\n                                var _se = _ne[_ie],\n                                  _oe = _re[_ie];\n                                _se >= _Qt3 && _se <= _te && _yt.min <= _oe && _yt.max >= _oe && (_zt[_se - _Qt3] = parseInt(_oe));\n                              }\n                            }\n                          } catch (err) {\n                            _iterator38.e(err);\n                          } finally {\n                            _iterator38.f();\n                          }\n                          _It[_Bt] = _Mt, _At[_Bt++] = _zt;\n                        } else if (_Ot >= _ft && _Ct <= _ct) {\n                          var _ae = _Ot - _ft;\n                          var _iterator39 = _createForOfIteratorHelper(_Rt),\n                            _step39;\n                          try {\n                            for (_iterator39.s(); !(_step39 = _iterator39.n()).done;) {\n                              var _le = _step39.value;\n                              var _he = _le.offsets,\n                                _ue = _le.probabilities;\n                              if (_t83.includes(\"m6A+\") && \"A\" === _le.unmodifiedBase || _t83.includes(\"m6A-\") && \"T\" === _le.unmodifiedBase || _t83.includes(\"5mC\") && \"C\" === _le.unmodifiedBase) for (var _fe = 0; _fe < _he.length; _fe++) {\n                                var _ce2 = _he[_fe],\n                                  _de = parseInt(_ue[_fe]);\n                                _ae + _ce2 < _xt && _yt.min <= _de && _yt.max >= _de && (_zt[_ae + _ce2] = _de);\n                              }\n                            }\n                          } catch (err) {\n                            _iterator39.e(err);\n                          } finally {\n                            _iterator39.f();\n                          }\n                          _It[_Bt] = _Mt, _At[_Bt++] = _zt;\n                        } else if (_Ot < _ft && _Ct <= _ct && _Ct > _ft) {\n                          var _ge = _ft - _Ot,\n                            _pe = _Ct - _Ot;\n                          var _iterator40 = _createForOfIteratorHelper(_Rt),\n                            _step40;\n                          try {\n                            for (_iterator40.s(); !(_step40 = _iterator40.n()).done;) {\n                              var _me = _step40.value;\n                              var _e68 = _me.offsets,\n                                _be = _me.probabilities;\n                              if (_t83.includes(\"m6A+\") && \"A\" === _me.unmodifiedBase || _t83.includes(\"m6A-\") && \"T\" === _me.unmodifiedBase || _t83.includes(\"5mC\") && \"C\" === _me.unmodifiedBase) for (var _we = 0; _we < _e68.length; _we++) {\n                                var _ye = _e68[_we],\n                                  _ve = parseInt(_be[_we]);\n                                _ye >= _ge && _ye <= _pe && _yt.min <= _ve && _yt.max >= _ve && (_zt[_ye - _ge] = _ve);\n                              }\n                            }\n                          } catch (err) {\n                            _iterator40.e(err);\n                          } finally {\n                            _iterator40.f();\n                          }\n                          _It[_Bt] = _Mt, _At[_Bt++] = _zt;\n                        } else if (_Ot >= _ft && _Ot < _ct && _Ct > _ct) {\n                          var _ke = _Ot - _ft,\n                            _xe = _ct - _Ot + _ke;\n                          var _iterator41 = _createForOfIteratorHelper(_Rt),\n                            _step41;\n                          try {\n                            for (_iterator41.s(); !(_step41 = _iterator41.n()).done;) {\n                              var _Ee = _step41.value;\n                              var _Be = _Ee.offsets,\n                                _Se = _Ee.probabilities;\n                              if (_t83.includes(\"m6A+\") && \"A\" === _Ee.unmodifiedBase || _t83.includes(\"m6A-\") && \"T\" === _Ee.unmodifiedBase || _t83.includes(\"5mC\") && \"C\" === _Ee.unmodifiedBase) for (var _Me = 0; _Me < _Be.length; _Me++) {\n                                var _Te = _Be[_Me],\n                                  _ze = parseInt(_Se[_Me]);\n                                _Te >= _ke && _Te < _xe && _yt.min <= _ze && _yt.max >= _ze && (_zt[_Te] = _ze);\n                              }\n                            }\n                          } catch (err) {\n                            _iterator41.e(err);\n                          } finally {\n                            _iterator41.f();\n                          }\n                          _It[_Bt] = _Mt, _At[_Bt++] = _zt;\n                        }\n                        break;\n                      default:\n                        throw new Error(\"Event overlap type [\".concat(_vt, \"] is unknown or unsupported for cluster matrix generation\"));\n                    }\n                  }\n                  break;\n                case \"Jaccard\":\n                  _kt = an.eN;\n                  for (var _Oe = 0; _Oe < _Et; ++_Oe) {\n                    var _Ce = _[_Oe],\n                      _Re = (_Ce.to, _Ce.from, new Array(_xt).fill(0)),\n                      _Ne = _Ce.from - _Ce.chrOffset,\n                      _Le = _Ce.to - _Ce.chrOffset,\n                      _Ue = _Ce.methylationOffsets;\n                    switch (_vt) {\n                      case \"Full viewport\":\n                        if (_Ne < _dt && _Le > _gt) {\n                          var _Pe = _ft - _Ne,\n                            _$e = _Pe + _xt;\n                          var _iterator42 = _createForOfIteratorHelper(_Ue),\n                            _step42;\n                          try {\n                            for (_iterator42.s(); !(_step42 = _iterator42.n()).done;) {\n                              var _je = _step42.value;\n                              var _Fe = _je.offsets,\n                                _De = _je.probabilities;\n                              if (_t83.includes(\"m6A+\") && \"A\" === _je.unmodifiedBase || _t83.includes(\"m6A-\") && \"T\" === _je.unmodifiedBase || _t83.includes(\"5mC\") && \"C\" === _je.unmodifiedBase) for (var _qe = 0; _qe < _Fe.length; _qe++) {\n                                var _He = _Fe[_qe],\n                                  _Ze = _De[_qe];\n                                _He >= _Pe && _He <= _$e && _yt.min <= _Ze && _yt.max >= _Ze && (_Re[_He - _Pe] = 1);\n                              }\n                            }\n                          } catch (err) {\n                            _iterator42.e(err);\n                          } finally {\n                            _iterator42.f();\n                          }\n                          _It[_Bt] = _Oe, _At[_Bt++] = _Re;\n                        }\n                        break;\n                      case \"Full region\":\n                        if (_Ne < _ft && _Le > _ct) {\n                          var _Ge = _ft - _Ne,\n                            _We = _Ge + _xt;\n                          var _iterator43 = _createForOfIteratorHelper(_Ue),\n                            _step43;\n                          try {\n                            for (_iterator43.s(); !(_step43 = _iterator43.n()).done;) {\n                              var _Xe = _step43.value;\n                              var _Ve = _Xe.offsets,\n                                _Ke = _Xe.probabilities;\n                              if (_t83.includes(\"m6A+\") && \"A\" === _Xe.unmodifiedBase || _t83.includes(\"m6A-\") && \"T\" === _Xe.unmodifiedBase || _t83.includes(\"5mC\") && \"C\" === _Xe.unmodifiedBase) for (var _Ye = 0; _Ye < _Ve.length; _Ye++) {\n                                var _Je = _Ve[_Ye],\n                                  _Qe = _Ke[_Ye];\n                                _Je >= _Ge && _Je <= _We && _yt.min <= _Qe && _yt.max >= _Qe && (_Re[_Je - _Ge] = 1);\n                              }\n                            }\n                          } catch (err) {\n                            _iterator43.e(err);\n                          } finally {\n                            _iterator43.f();\n                          }\n                          _It[_Bt] = _Oe, _At[_Bt++] = _Re;\n                        }\n                        break;\n                      case \"Partial region\":\n                        if (_Ne < _ft && _Le > _ct) {\n                          var _tn = _ft - _Ne,\n                            _en = _tn + _xt;\n                          var _iterator44 = _createForOfIteratorHelper(_Ue),\n                            _step44;\n                          try {\n                            for (_iterator44.s(); !(_step44 = _iterator44.n()).done;) {\n                              var _nn = _step44.value;\n                              var _rn = _nn.offsets,\n                                _sn = _nn.probabilities;\n                              if (_t83.includes(\"m6A+\") && \"A\" === _nn.unmodifiedBase || _t83.includes(\"m6A-\") && \"T\" === _nn.unmodifiedBase || _t83.includes(\"5mC\") && \"C\" === _nn.unmodifiedBase) for (var _on = 0; _on < _rn.length; _on++) {\n                                var _ln = _rn[_on],\n                                  _fn = _sn[_on];\n                                _ln >= _tn && _ln <= _en && _yt.min <= _fn && _yt.max >= _fn && (_Re[_ln - _tn] = 1);\n                              }\n                            }\n                          } catch (err) {\n                            _iterator44.e(err);\n                          } finally {\n                            _iterator44.f();\n                          }\n                          _It[_Bt] = _Oe, _At[_Bt++] = _Re;\n                        } else if (_Ne >= _ft && _Le <= _ct) {\n                          var _cn = _Ne - _ft;\n                          var _iterator45 = _createForOfIteratorHelper(_Ue),\n                            _step45;\n                          try {\n                            for (_iterator45.s(); !(_step45 = _iterator45.n()).done;) {\n                              var _gn = _step45.value;\n                              var _pn = _gn.offsets,\n                                _mn = _gn.probabilities;\n                              if (_t83.includes(\"m6A+\") && \"A\" === _gn.unmodifiedBase || _t83.includes(\"m6A-\") && \"T\" === _gn.unmodifiedBase || _t83.includes(\"5mC\") && \"C\" === _gn.unmodifiedBase) for (var _n45 = 0; _n45 < _pn.length; _n45++) {\n                                var _bn = _pn[_n45],\n                                  _wn = parseInt(_mn[_n45]);\n                                _cn + _bn < _xt && _yt.min <= _wn && _yt.max >= _wn && (_Re[_cn + _bn] = 1);\n                              }\n                            }\n                          } catch (err) {\n                            _iterator45.e(err);\n                          } finally {\n                            _iterator45.f();\n                          }\n                          _It[_Bt] = _Oe, _At[_Bt++] = _Re;\n                        } else if (_Ne < _ft && _Le <= _ct && _Le > _ft) {\n                          var _xn = _ft - _Ne,\n                            _Bn = _Le - _Ne;\n                          var _iterator46 = _createForOfIteratorHelper(_Ue),\n                            _step46;\n                          try {\n                            for (_iterator46.s(); !(_step46 = _iterator46.n()).done;) {\n                              var _Sn = _step46.value;\n                              var _In = _Sn.offsets,\n                                _Mn = _Sn.probabilities;\n                              if (_t83.includes(\"m6A+\") && \"A\" === _Sn.unmodifiedBase || _t83.includes(\"m6A-\") && \"T\" === _Sn.unmodifiedBase || _t83.includes(\"5mC\") && \"C\" === _Sn.unmodifiedBase) for (var _Tn = 0; _Tn < _In.length; _Tn++) {\n                                var _On = _In[_Tn],\n                                  _Fn = parseInt(_Mn[_Tn]);\n                                _On >= _xn && _On <= _Bn && _yt.min <= _Fn && _yt.max >= _Fn && (_Re[_On - _xn] = 1);\n                              }\n                            }\n                          } catch (err) {\n                            _iterator46.e(err);\n                          } finally {\n                            _iterator46.f();\n                          }\n                          _It[_Bt] = _Oe, _At[_Bt++] = _Re;\n                        } else if (_Ne >= _ft && _Ne < _ct && _Le > _ct) {\n                          var Dn = _Ne - _ft,\n                            qn = _ct - _Ne + Dn;\n                          var _iterator47 = _createForOfIteratorHelper(_Ue),\n                            _step47;\n                          try {\n                            for (_iterator47.s(); !(_step47 = _iterator47.n()).done;) {\n                              var Hn = _step47.value;\n                              var Zn = Hn.offsets,\n                                Gn = Hn.probabilities;\n                              if (_t83.includes(\"m6A+\") && \"A\" === Hn.unmodifiedBase || _t83.includes(\"m6A-\") && \"T\" === Hn.unmodifiedBase || _t83.includes(\"5mC\") && \"C\" === Hn.unmodifiedBase) for (var Wn = 0; Wn < Zn.length; Wn++) {\n                                var Xn = Zn[Wn],\n                                  Vn = parseInt(Gn[Wn]);\n                                Xn >= Dn && Xn < qn && _yt.min <= Vn && _yt.max >= Vn && (_Re[Xn] = 1);\n                              }\n                            }\n                          } catch (err) {\n                            _iterator47.e(err);\n                          } finally {\n                            _iterator47.f();\n                          }\n                          _It[_Bt] = _Oe, _At[_Bt++] = _Re;\n                        }\n                        break;\n                      default:\n                        throw new Error(\"Event overlap type [\".concat(_vt, \"] is unknown or unsupported for cluster matrix generation\"));\n                    }\n                  }\n                  break;\n                default:\n                  throw new Error(\"Cluster distance function [\".concat(_mt, \"] is unknown or unsupported for subregion cluster matrix construction\"));\n              }\n              break;\n            case \"DBSCAN\":\n              if (\"Euclidean\" !== _mt) throw new Error(\"Cluster distance function [\".concat(_mt, \"] is unknown or unsupported for subregion cluster matrix construction\"));\n              _kt = function _kt(t, e) {\n                return Math.hypot.apply(Math, _toConsumableArray(Object.keys(t).map(function (n) {\n                  return e[n] - t[n];\n                })));\n              };\n              for (var Kn = 0; Kn < _Et; ++Kn) {\n                var Yn = _[Kn],\n                  Jn = (Yn.to, Yn.from, new Array(_xt).fill(-255)),\n                  Qn = Yn.from - Yn.chrOffset,\n                  tr = Yn.to - Yn.chrOffset,\n                  er = Yn.methylationOffsets;\n                switch (_vt) {\n                  case \"Full viewport\":\n                    if (Qn < _dt && tr > _gt) {\n                      var nr = _ft - Qn,\n                        rr = nr + _xt;\n                      var _iterator48 = _createForOfIteratorHelper(er),\n                        _step48;\n                      try {\n                        for (_iterator48.s(); !(_step48 = _iterator48.n()).done;) {\n                          var ir = _step48.value;\n                          var sr = ir.offsets,\n                            or = ir.probabilities;\n                          if (_t83.includes(\"m6A+\") && \"A\" === ir.unmodifiedBase || _t83.includes(\"m6A-\") && \"T\" === ir.unmodifiedBase || _t83.includes(\"5mC\") && \"C\" === ir.unmodifiedBase) for (var ar = 0; ar < sr.length; ar++) {\n                            var lr = sr[ar],\n                              hr = or[ar];\n                            lr >= nr && lr <= rr && _yt.min <= hr && _yt.max >= hr && (Jn[lr - nr] = parseInt(hr));\n                          }\n                        }\n                      } catch (err) {\n                        _iterator48.e(err);\n                      } finally {\n                        _iterator48.f();\n                      }\n                      _It[_Bt] = Kn, _At[_Bt++] = Jn;\n                    }\n                    break;\n                  case \"Full region\":\n                    if (Qn < _ft && tr > _ct) {\n                      var ur = _ft - Qn,\n                        fr = ur + _xt;\n                      var _iterator49 = _createForOfIteratorHelper(er),\n                        _step49;\n                      try {\n                        for (_iterator49.s(); !(_step49 = _iterator49.n()).done;) {\n                          var cr = _step49.value;\n                          var dr = cr.offsets,\n                            gr = cr.probabilities;\n                          if (_t83.includes(\"m6A+\") && \"A\" === cr.unmodifiedBase || _t83.includes(\"m6A-\") && \"T\" === cr.unmodifiedBase || _t83.includes(\"5mC\") && \"C\" === cr.unmodifiedBase) for (var pr = 0; pr < dr.length; pr++) {\n                            var mr = dr[pr],\n                              _r = gr[pr];\n                            mr >= ur && mr <= fr && _yt.min <= _r && _yt.max >= _r && (Jn[mr - ur] = parseInt(_r));\n                          }\n                        }\n                      } catch (err) {\n                        _iterator49.e(err);\n                      } finally {\n                        _iterator49.f();\n                      }\n                      _It[_Bt] = Kn, _At[_Bt++] = Jn;\n                    }\n                    break;\n                  case \"Partial region\":\n                    if (Qn < _ft && tr > _ct) {\n                      var br = _ft - Qn,\n                        wr = br + _xt;\n                      var _iterator50 = _createForOfIteratorHelper(er),\n                        _step50;\n                      try {\n                        for (_iterator50.s(); !(_step50 = _iterator50.n()).done;) {\n                          var yr = _step50.value;\n                          var vr = yr.offsets,\n                            kr = yr.probabilities;\n                          if (_t83.includes(\"m6A+\") && \"A\" === yr.unmodifiedBase || _t83.includes(\"m6A-\") && \"T\" === yr.unmodifiedBase || _t83.includes(\"5mC\") && \"C\" === yr.unmodifiedBase) for (var xr = 0; xr < vr.length; xr++) {\n                            var Er = vr[xr],\n                              Ar = kr[xr];\n                            Er >= br && Er <= wr && _yt.min <= Ar && _yt.max >= Ar && (Jn[Er - br] = parseInt(Ar));\n                          }\n                        }\n                      } catch (err) {\n                        _iterator50.e(err);\n                      } finally {\n                        _iterator50.f();\n                      }\n                      _It[_Bt] = Kn, _At[_Bt++] = Jn;\n                    } else if (Qn >= _ft && tr <= _ct) {\n                      var Br = Qn - _ft;\n                      var _iterator51 = _createForOfIteratorHelper(er),\n                        _step51;\n                      try {\n                        for (_iterator51.s(); !(_step51 = _iterator51.n()).done;) {\n                          var Sr = _step51.value;\n                          var Ir = Sr.offsets,\n                            Mr = Sr.probabilities;\n                          if (_t83.includes(\"m6A+\") && \"A\" === Sr.unmodifiedBase || _t83.includes(\"m6A-\") && \"T\" === Sr.unmodifiedBase || _t83.includes(\"5mC\") && \"C\" === Sr.unmodifiedBase) for (var Tr = 0; Tr < Ir.length; Tr++) {\n                            var zr = Ir[Tr],\n                              Or = parseInt(Mr[Tr]);\n                            Br + zr < _xt && _yt.min <= Or && _yt.max >= Or && (Jn[Br + zr] = Or);\n                          }\n                        }\n                      } catch (err) {\n                        _iterator51.e(err);\n                      } finally {\n                        _iterator51.f();\n                      }\n                      _It[_Bt] = Kn, _At[_Bt++] = Jn;\n                    } else if (Qn < _ft && tr <= _ct && tr > _ft) {\n                      var Cr = _ft - Qn,\n                        Rr = tr - Qn;\n                      var _iterator52 = _createForOfIteratorHelper(er),\n                        _step52;\n                      try {\n                        for (_iterator52.s(); !(_step52 = _iterator52.n()).done;) {\n                          var Nr = _step52.value;\n                          var Lr = Nr.offsets,\n                            Ur = Nr.probabilities;\n                          if (_t83.includes(\"m6A+\") && \"A\" === Nr.unmodifiedBase || _t83.includes(\"m6A-\") && \"T\" === Nr.unmodifiedBase || _t83.includes(\"5mC\") && \"C\" === Nr.unmodifiedBase) for (var Pr = 0; Pr < Lr.length; Pr++) {\n                            var $r = Lr[Pr],\n                              jr = parseInt(Ur[Pr]);\n                            $r >= Cr && $r <= Rr && _yt.min <= jr && _yt.max >= jr && (Jn[$r - Cr] = jr);\n                          }\n                        }\n                      } catch (err) {\n                        _iterator52.e(err);\n                      } finally {\n                        _iterator52.f();\n                      }\n                      _It[_Bt] = Kn, _At[_Bt++] = Jn;\n                    } else if (Qn >= _ft && Qn < _ct && tr > _ct) {\n                      var Fr = Qn - _ft,\n                        Dr = _ct - Qn + Fr;\n                      var _iterator53 = _createForOfIteratorHelper(er),\n                        _step53;\n                      try {\n                        for (_iterator53.s(); !(_step53 = _iterator53.n()).done;) {\n                          var qr = _step53.value;\n                          var Hr = qr.offsets,\n                            Zr = qr.probabilities;\n                          if (_t83.includes(\"m6A+\") && \"A\" === qr.unmodifiedBase || _t83.includes(\"m6A-\") && \"T\" === qr.unmodifiedBase || _t83.includes(\"5mC\") && \"C\" === qr.unmodifiedBase) for (var Gr = 0; Gr < Hr.length; Gr++) {\n                            var Wr = Hr[Gr],\n                              Xr = parseInt(Zr[Gr]);\n                            Wr >= Fr && Wr < Dr && _yt.min <= Xr && _yt.max >= Xr && (Jn[Wr] = Xr);\n                          }\n                        }\n                      } catch (err) {\n                        _iterator53.e(err);\n                      } finally {\n                        _iterator53.f();\n                      }\n                      _It[_Bt] = Kn, _At[_Bt++] = Jn;\n                    }\n                    break;\n                  default:\n                    throw new Error(\"Event overlap type [\".concat(_vt, \"] is unknown or unsupported for cluster matrix generation\"));\n                }\n              }\n              break;\n            default:\n              throw new Error(\"Cluster method [\".concat(_pt, \"] is unknown or unsupported for subregion cluster matrix construction\"));\n          }\n          if (_At.length > 0) switch (_pt) {\n            case \"AGNES\":\n              var _ref30 = (0, an.eM)({\n                  data: _At,\n                  distance: _kt,\n                  linkage: an.bP\n                }),\n                Vr = _ref30.clusters,\n                Kr = _ref30.distances,\n                Yr = _ref30.order,\n                Jr = _ref30.clustersGivenK;\n              v = f ? null : Vr;\n              var Qr = (f ? _ut : Yr).map(function (t) {\n                var e = _It[t];\n                return [_[e]];\n              });\n              for (var _i31 = 0, _Object$keys3 = Object.keys(y); _i31 < _Object$keys3.length; _i31++) {\n                var ni = _Object$keys3[_i31];\n                var ri = Qr;\n                y[ni] = {}, y[ni].rows = ri;\n              }\n              break;\n            case \"DBSCAN\":\n              var ti = function ti(t) {\n                var e = [],\n                  n = [];\n                for (var _r38 = 0; _r38 < t.length; _r38++) {\n                  var _i32 = t[_r38];\n                  if (Array.isArray(_i32)) n.push(t, _r38), _r38 = -1, t = _i32;else for (e.push(_i32); _r38 === t.length - 1 && n.length;) _r38 = n.pop(), t = n.pop();\n                }\n                return e;\n              };\n              var ei = hn({\n                dataset: _At,\n                epsilon: _bt,\n                minimumPoints: _wt,\n                distanceFunction: _kt\n              });\n              if (v = f ? null : ei, ei.clusters.length > 0) {\n                var ii = ti(ei.clusters.concat(ei.noise)),\n                  si = (f ? _ut : ii).map(function (t) {\n                    var e = _It[t];\n                    return [_[e]];\n                  });\n                for (var _i33 = 0, _Object$keys4 = Object.keys(y); _i33 < _Object$keys4.length; _i33++) {\n                  var oi = _Object$keys4[_i33];\n                  var ai = si;\n                  y[oi] = {}, y[oi].rows = ai;\n                }\n              } else for (var _i34 = 0, _Object$keys5 = Object.keys(y); _i34 < _Object$keys5.length; _i34++) {\n                var li = _Object$keys5[_i34];\n                var hi = Cn(y[li], {\n                  prevRows: l[li] && l[li].rows || []\n                });\n                y[li] = {}, y[li].rows = hi;\n              }\n              break;\n            default:\n              throw new Error(\"Cluster method [\".concat(_pt, \"] is unknown or unsupported for subregion clustering\"));\n          } else for (var _i35 = 0, _Object$keys6 = Object.keys(y); _i35 < _Object$keys6.length; _i35++) {\n            var ui = _Object$keys6[_i35];\n            var fi = Cn(y[ui], {\n              prevRows: l[ui] && l[ui].rows || []\n            });\n            y[ui] = {}, y[ui].rows = fi;\n          }\n        } else for (var _i36 = 0, _Object$keys7 = Object.keys(y); _i36 < _Object$keys7.length; _i36++) {\n          var ci = _Object$keys7[_i36];\n          var di = Cn(y[ci], {\n            prevRows: l[ci] && l[ci].rows || []\n          });\n          y[ci] = {}, y[ci].rows = di;\n        }\n        var k = Object.values(y).map(function (t) {\n          return t.rows.length;\n        }).reduce(function (t, e) {\n          return t + e;\n        }, 0);\n        var x = h.showCoverage ? h.coverageHeight : 0;\n        var E = s().domain(t(0, k + x)).range([0, a[1]]).paddingInner(.2);\n        var A = 0,\n          B = 0,\n          S = 0;\n        var I = function I(t, e) {\n            if (A > Rn - 2) {\n              Rn *= 2;\n              var _t84 = Un;\n              Un = new Float32Array(Rn), Un.set(_t84);\n            }\n            return Un[A++] = t, Un[A++] = e, A / 2 - 1;\n          },\n          M = function M(t, e, n) {\n            if (S >= Ln - 3) {\n              Ln *= 2;\n              var _t85 = $n;\n              $n = new Int32Array(Ln), $n.set(_t85);\n            }\n            $n[S++] = t, $n[S++] = e, $n[S++] = n;\n          },\n          T = function T(t, e, n, r, i) {\n            var s = t,\n              o = s + n,\n              a = e,\n              l = e + r,\n              h = I(s, a),\n              u = I(o, a),\n              f = I(s, l),\n              c = I(o, l);\n            (function (t, e) {\n              if (B >= Nn - 4) {\n                Nn *= 2;\n                var _t86 = Pn;\n                Pn = new Float32Array(Nn), Pn.set(_t86);\n              }\n              for (var _e69 = 0; _e69 < 4; _e69++) Pn[B++] = t;\n            })(i), M(h, u, f), M(f, c, u);\n          },\n          z = St().domain(r).range(i);\n        var O = 0;\n        var C = Object.keys(y).sort();\n        var _iterator54 = _createForOfIteratorHelper(C),\n          _step54;\n        try {\n          for (_iterator54.s(); !(_step54 = _iterator54.n()).done;) {\n            var gi = _step54.value;\n            y[gi].start = E(x), x += y[gi].rows.length, y[gi].end = E(x - 1) + E.bandwidth(), E.step(), E.bandwidth(), O += 1;\n          }\n        } catch (err) {\n          _iterator54.e(err);\n        } finally {\n          _iterator54.f();\n        }\n        if (T(0, 0, a[0], a[1], Ae.WHITE), h.showCoverage) {\n          var pi = 1e4;\n          g = Math.max(Math.floor((w - b) / pi), 1);\n          var mi = function (t, e, n) {\n            var r = {};\n            var i = 0;\n            var _An$t3 = An[t],\n              s = _An$t3.chromSizesUrl,\n              o = _An$t3.bamUrl;\n            if (!yn[s]) return {\n              coverage: r,\n              maxCoverage: i\n            };\n            var _loop6 = function _loop6() {\n              var s = e[_t87].from,\n                o = e[_t87].to;\n              for (var _t88 = s - s % n + n; _t88 < o; _t88 += n) r[_t88] || (r[_t88] = {\n                reads: 0,\n                matches: 0,\n                variants: {\n                  A: 0,\n                  C: 0,\n                  G: 0,\n                  T: 0,\n                  N: 0\n                },\n                range: \"\"\n              }), r[_t88].reads++, r[_t88].matches++, i = Math.max(i, r[_t88].reads);\n              e[_t87].substitutions.forEach(function (t) {\n                if (t.variant) {\n                  var _e71 = s + t.pos;\n                  if (!r[_e71]) return;\n                  r[_e71].matches--, r[_e71].variants[t.variant] || (r[_e71].variants[t.variant] = 0), r[_e71].variants[t.variant]++;\n                }\n              });\n            };\n            for (var _t87 = 0; _t87 < e.length; _t87++) {\n              _loop6();\n            }\n            var a = yn[s].absToChr;\n            return Object.entries(r).forEach(function (_ref31) {\n              var _ref32 = _slicedToArray(_ref31, 2),\n                t = _ref32[0],\n                e = _ref32[1];\n              var r = a(t);\n              var i = r[0] + \":\" + Ut(\",\")(r[1]);\n              if (n > 1) {\n                var _e70 = a(parseInt(t, 10) + n - 1);\n                i += \"-\" + Ut(\",\")(_e70[1]);\n              }\n              e.range = i;\n            }), {\n              coverage: r,\n              maxCoverage: i\n            };\n          }(e, _, g);\n          p = mi.coverage;\n          var _i = mi.maxCoverage,\n            bi = t(0, h.coverageHeight),\n            wi = [E(0), E(h.coverageHeight - 1) + E.bandwidth()],\n            yi = s().domain(bi).range(wi).paddingInner(.05);\n          var vi,\n            ki,\n            xi,\n            Ei = Ae.BG_MUTED;\n          var Ai = (z(1) - z(0)) * g,\n            Bi = yi.bandwidth() * h.coverageHeight,\n            Si = Bi / _i;\n          for (var _i37 = 0, _Object$keys8 = Object.keys(p); _i37 < _Object$keys8.length; _i37++) {\n            var Ii = _Object$keys8[_i37];\n            vi = z(Ii), ki = Bi;\n            for (var _i38 = 0, _Object$keys9 = Object.keys(p[Ii].variants); _i38 < _Object$keys9.length; _i38++) {\n              var Mi = _Object$keys9[_i38];\n              xi = p[Ii].variants[Mi] * Si, ki -= xi;\n              var Ti = 1 === g ? Ae[Mi] : Ei;\n              T(vi, ki, Ai, xi, Ti);\n            }\n            xi = p[Ii].matches * Si, ki -= xi, 1 === g && (Ei = Ii % 2 == 0 ? Ae.BG : Ae.BG2), T(vi, ki, Ai, xi, Ei);\n          }\n        }\n        var _loop7 = function _loop7() {\n          var zi = _Object$values[_i39];\n          var Oi = zi.rows,\n            Ci = t(0, Oi.length),\n            Ri = [zi.start, zi.end],\n            Ni = h && h.indexDHS ? .25 : h && h.methylation && h.methylation.hasOwnProperty(\"fiberPadding\") ? h.methylation.fiberPadding : .25,\n            Li = s().domain(Ci).range(Ri).paddingInner(Ni);\n          var Ui, Pi, $i, ji;\n          Oi.map(function (t, e) {\n            $i = Li(e);\n            var n = Li.bandwidth();\n            ji = $i + n, t.map(function (t, e) {\n              if (!t.from || !t.to) return;\n              var r = z(t.from),\n                i = z(t.to);\n              if (Ui = r, Pi = i, h && h.indexDHS ? T(Ui, $i, Pi - Ui, n, Ae.INDEX_DHS_BG) : T(Ui, $i, Pi - Ui, n, t.colorOverride || t.color), h && h.methylation && h.methylation.hideSubstitutions) {\n                if (!jn(d)) {\n                  var _e72 = Object.keys(d);\n                  for (var _i40 = 0, _e73 = _e72; _i40 < _e73.length; _i40++) {\n                    var _r39 = _e73[_i40];\n                    var _e74 = _r39.length,\n                      _i41 = Math.max(1, z(_e74) - z(0)),\n                      _s20 = Ae[\"HIGHLIGHTS_\".concat(_r39)],\n                      _o25 = d[_r39];\n                    if (\"M0A\" !== _r39) {\n                      var _iterator55 = _createForOfIteratorHelper(_o25),\n                        _step55;\n                      try {\n                        for (_iterator55.s(); !(_step55 = _iterator55.n()).done;) {\n                          var _e75 = _step55.value;\n                          _e75 >= t.from && _e75 < t.to && (Ui = z(_e75), Pi = Ui + _i41, T(Ui, $i, _i41, n, _s20));\n                        }\n                      } catch (err) {\n                        _iterator55.e(err);\n                      } finally {\n                        _iterator55.f();\n                      }\n                    }\n                  }\n                }\n                var _e76 = h && h.methylation && h.methylation.categoryAbbreviations && h.methylation.categoryAbbreviations.includes(\"5mC+\"),\n                  _r40 = h && h.methylation && h.methylation.categoryAbbreviations && h.methylation.categoryAbbreviations.includes(\"5mC-\"),\n                  _i42 = h && h.methylation && h.methylation.categoryAbbreviations && h.methylation.categoryAbbreviations.includes(\"m6A+\"),\n                  _s21 = h && h.methylation && h.methylation.categoryAbbreviations && h.methylation.categoryAbbreviations.includes(\"m6A-\"),\n                  _o26 = h && h.methylation && h.methylation.probabilityThresholdRange ? h.methylation.probabilityThresholdRange[0] : 0,\n                  _a11 = h && h.methylation && h.methylation.probabilityThresholdRange ? h.methylation.probabilityThresholdRange[1] + 1 : 256;\n                var _l8 = null;\n                var _iterator56 = _createForOfIteratorHelper(t.methylationOffsets),\n                  _step56;\n                try {\n                  var _loop8 = function _loop8() {\n                    var h = _step56.value;\n                    var u = h.offsets,\n                      f = h.probabilities,\n                      c = 1;\n                    switch (h.unmodifiedBase) {\n                      case \"C\":\n                        \"m\" === h.code && \"+\" === h.strand && _e76 && (_l8 = Ae.MM_M5C_FOR);\n                        break;\n                      case \"G\":\n                        \"m\" === h.code && \"-\" === h.strand && _r40 && (_l8 = Ae.MM_M5C_REV);\n                        break;\n                      case \"A\":\n                        \"a\" === h.code && \"+\" === h.strand && _i42 && (_l8 = Ae.MM_M6A_FOR);\n                        break;\n                      case \"T\":\n                        \"a\" === h.code && \"-\" === h.strand && _s21 && (_l8 = Ae.MM_M6A_REV);\n                    }\n                    if (_l8) {\n                      if (\"a\" === h.code && \"M0A\" in d) {\n                        var _e77 = new Set(u.filter(function (t, e) {\n                            return f[e] < _o26;\n                          }).map(function (e) {\n                            return e + t.from;\n                          })),\n                          _r41 = 1,\n                          _i43 = Math.max(1, z(_r41) - z(0)),\n                          _s22 = Ae.HIGHLIGHTS_MZEROA,\n                          _a12 = _toConsumableArray(m).filter(function (t) {\n                            return !_e77.has(t);\n                          });\n                        var _iterator57 = _createForOfIteratorHelper(_a12),\n                          _step57;\n                        try {\n                          for (_iterator57.s(); !(_step57 = _iterator57.n()).done;) {\n                            var _e78 = _step57.value;\n                            _e78 >= t.from && _e78 <= t.to && (Ui = z(_e78), Pi = Ui + _i43, T(Ui, $i, _i43, n, _s22));\n                          }\n                        } catch (err) {\n                          _iterator57.e(err);\n                        } finally {\n                          _iterator57.f();\n                        }\n                      }\n                      var _e79 = Math.max(1, z(c) - z(0));\n                      u.filter(function (t, e) {\n                        return f[e] >= _o26 && f[e] < _a11;\n                      }).map(function (r) {\n                        Ui = z(t.from + r), Pi = Ui + _e79, T(Ui, $i, _e79, n, _l8);\n                      });\n                    }\n                  };\n                  for (_iterator56.s(); !(_step56 = _iterator56.n()).done;) {\n                    _loop8();\n                  }\n                } catch (err) {\n                  _iterator56.e(err);\n                } finally {\n                  _iterator56.f();\n                }\n              }\n              if (h && h.indexDHS) {\n                var _e80 = h.indexDHS ? t.metadata : {};\n                var _r42 = Ae.BLACK;\n                h.indexDHS && (_r42 = Ae[\"INDEX_DHS_\".concat(_e80.rgb)]);\n                var _iterator58 = _createForOfIteratorHelper(t.substitutions),\n                  _step58;\n                try {\n                  for (_iterator58.s(); !(_step58 = _iterator58.n()).done;) {\n                    var _e81 = _step58.value;\n                    Ui = z(t.from + _e81.pos);\n                    var _i45 = Math.max(1, z(_e81.length) - z(0)),\n                      _s24 = Math.max(1, z(.1) - z(0));\n                    if (Pi = Ui + _i45, \"A\" === _e81.variant) T(Ui, $i, _i45, n, Ae.A);else if (\"C\" === _e81.variant) T(Ui, $i, _i45, n, Ae.C);else if (\"G\" === _e81.variant) T(Ui, $i, _i45, n, Ae.G);else if (\"T\" === _e81.variant) T(Ui, $i, _i45, n, Ae.T);else if (\"S\" === _e81.type) T(Ui, $i, _i45, n, Ae.S);else if (\"H\" === _e81.type) T(Ui, $i, _i45, n, Ae.H);else if (\"X\" === _e81.type) T(Ui, $i, _i45, n, Ae.X);else if (\"I\" === _e81.type) T(Ui, $i, _s24, n, Ae.I);else if (\"D\" === _e81.type) {\n                      T(Ui, $i, _i45, n, Ae.D);\n                      var _t89 = 6,\n                        _e82 = .1;\n                      for (var _s25 = 0; _s25 <= _t89; _s25++) T(Ui + _s25 * _i45 / _t89, $i, _e82, n, _r42);\n                    } else if (\"N\" === _e81.type) {\n                      var _t90 = ($i + ji) / 2,\n                        _e83 = Math.min((ji - $i) / 4.5, 1);\n                      T(Ui, _t90 + _e83 / 2, Pi - Ui, _e83, _r42);\n                    } else {\n                      var _t91 = .5 * Li.bandwidth();\n                      T(Ui, $i + .25 * (ji - $i), _i45, _t91, _r42);\n                    }\n                  }\n                } catch (err) {\n                  _iterator58.e(err);\n                } finally {\n                  _iterator58.f();\n                }\n                if (h && h.indexDHS) {\n                  var _i44 = t.from - t.chrOffset,\n                    _s23 = _e80.summit.start,\n                    _o27 = _e80.summit.end - _s23,\n                    _a13 = _s23 - _i44,\n                    _l9 = z(t.from + _a13),\n                    _h9 = $i,\n                    _u3 = Math.max(1, z(_o27) - z(0));\n                  T(_l9, _h9, _u3, n, _r42);\n                }\n              }\n            });\n          });\n        };\n        for (var _i39 = 0, _Object$values = Object.values(y); _i39 < _Object$values.length; _i39++) {\n          _loop7();\n        }\n        var R = Un.slice(0, A).buffer,\n          N = Pn.slice(0, B).buffer,\n          L = $n.slice(0, S).buffer,\n          U = {\n            rows: y,\n            tileIds: n,\n            coverage: p,\n            coverageSamplingDistance: g,\n            positionsBuffer: R,\n            colorsBuffer: N,\n            ixBuffer: L,\n            xScaleDomain: r,\n            xScaleRange: i,\n            clusterResultsToExport: v\n          };\n        return Dt(U, [U.positionsBuffer, N, L]);\n      },\n      exportSegmentsAsBED12: function exportSegmentsAsBED12(t, e, n, r, i, s, o, a, l) {\n        var h = {},\n          u = [];\n        var _iterator62 = _createForOfIteratorHelper(e),\n          _step62;\n        try {\n          for (_iterator62.s(); !(_step62 = _iterator62.n()).done;) {\n            var _p2 = _step62.value;\n            var _m3 = vn.get(\"\".concat(t, \".\").concat(_p2));\n            if (_m3.error) throw new Error(_m3.error);\n            var _iterator80 = _createForOfIteratorHelper(_m3),\n              _step80;\n            try {\n              for (_iterator80.s(); !(_step80 = _iterator80.n()).done;) {\n                var _2 = _step80.value;\n                h[_2.id] = _2;\n              }\n            } catch (err) {\n              _iterator80.e(err);\n            } finally {\n              _iterator80.f();\n            }\n          }\n        } catch (err) {\n          _iterator62.e(err);\n        } finally {\n          _iterator62.f();\n        }\n        var f = Object.values(h);\n        a.minMappingQuality > 0 && (f = f.filter(function (t) {\n          return t.mapq >= a.minMappingQuality;\n        }));\n        var _ref33 = [Number.MAX_VALUE, -Number.MAX_VALUE],\n          c = _ref33[0],\n          d = _ref33[1];\n        for (var _b = 0; _b < f.length; _b++) f[_b].from < c && (c = f[_b].from), f[_b].to > d && (d = f[_b].to);\n        var g = null;\n        if (un) {\n          var _w = a && a.groupBy;\n          _w = _w || null, g = un(f, _w);\n        } else g = {\n          \"null\": f\n        };\n        if (l && a.methylation) {\n          var _y = l.range.left.chrom,\n            _v = l.range.left.start,\n            _k = l.range.right.stop,\n            _x102 = l.method,\n            _E = l.distanceFn,\n            _A = l.eventCategories,\n            _B = (l.linkage, l.epsilon),\n            _S = l.minimumPoints,\n            _I = {\n              min: l.probabilityThresholdRange[0],\n              max: l.probabilityThresholdRange[1]\n            };\n          var _M = null;\n          var _T = _k - _v,\n            _z = f.length,\n            _O = new Array();\n          var _C = 0;\n          var _R = {};\n          switch (_x102) {\n            case \"AGNES\":\n              switch (_E) {\n                case \"Euclidean\":\n                  _M = an.WI;\n                  for (var _N = 0; _N < _z; ++_N) {\n                    var _L = f[_N],\n                      _U = (_L.to, _L.from, new Array(_T).fill(-255)),\n                      _P2 = _L.from - _L.chrOffset,\n                      _$2 = _L.to - _L.chrOffset;\n                    switch (eventOverlapType) {\n                      case \"Full region\":\n                        if (_P2 < _v && _$2 > _k) {\n                          var _j2 = _v - _P2,\n                            _F = _j2 + _T;\n                          var _iterator63 = _createForOfIteratorHelper(mos),\n                            _step63;\n                          try {\n                            for (_iterator63.s(); !(_step63 = _iterator63.n()).done;) {\n                              var _D2 = _step63.value;\n                              var _q2 = _D2.offsets,\n                                _H2 = _D2.probabilities;\n                              if (_A.includes(\"m6A+\") && \"A\" === _D2.unmodifiedBase || _A.includes(\"m6A-\") && \"T\" === _D2.unmodifiedBase || _A.includes(\"5mC\") && \"C\" === _D2.unmodifiedBase) for (var _Z2 = 0; _Z2 < _q2.length; _Z2++) {\n                                var _G2 = _q2[_Z2],\n                                  _W2 = _H2[_Z2];\n                                _G2 >= _j2 && _G2 <= _F && _I.min <= _W2 && _I.max >= _W2 && (_U[_G2 - _j2] = parseInt(_W2));\n                              }\n                            }\n                          } catch (err) {\n                            _iterator63.e(err);\n                          } finally {\n                            _iterator63.f();\n                          }\n                          _R[_C] = _N, _O[_C++] = _U;\n                        }\n                        break;\n                      case \"Partial region\":\n                        if (_P2 < _v && _$2 > _k) {\n                          var _X2 = _v - _P2,\n                            _V2 = _X2 + _T;\n                          var _iterator64 = _createForOfIteratorHelper(mos),\n                            _step64;\n                          try {\n                            for (_iterator64.s(); !(_step64 = _iterator64.n()).done;) {\n                              var _K2 = _step64.value;\n                              var _Y2 = _K2.offsets,\n                                _J2 = _K2.probabilities;\n                              if (_A.includes(\"m6A+\") && \"A\" === _K2.unmodifiedBase || _A.includes(\"m6A-\") && \"T\" === _K2.unmodifiedBase || _A.includes(\"5mC\") && \"C\" === _K2.unmodifiedBase) for (var _Q2 = 0; _Q2 < _Y2.length; _Q2++) {\n                                var _tt2 = _Y2[_Q2],\n                                  _et2 = _J2[_Q2];\n                                _tt2 >= _X2 && _tt2 <= _V2 && _I.min <= _et2 && _I.max >= _et2 && (_U[_tt2 - _X2] = parseInt(_et2));\n                              }\n                            }\n                          } catch (err) {\n                            _iterator64.e(err);\n                          } finally {\n                            _iterator64.f();\n                          }\n                          _R[_C] = _N, _O[_C++] = _U;\n                        } else if (_P2 >= _v && _$2 <= _k) {\n                          var _nt2 = _P2 - _v;\n                          var _iterator65 = _createForOfIteratorHelper(mos),\n                            _step65;\n                          try {\n                            for (_iterator65.s(); !(_step65 = _iterator65.n()).done;) {\n                              var _rt2 = _step65.value;\n                              var _it2 = _rt2.offsets,\n                                _st2 = _rt2.probabilities;\n                              if (_A.includes(\"m6A+\") && \"A\" === _rt2.unmodifiedBase || _A.includes(\"m6A-\") && \"T\" === _rt2.unmodifiedBase || _A.includes(\"5mC\") && \"C\" === _rt2.unmodifiedBase) for (var _ot2 = 0; _ot2 < _it2.length; _ot2++) {\n                                var _at2 = _it2[_ot2],\n                                  _lt2 = parseInt(_st2[_ot2]);\n                                _nt2 + _at2 < _T && _I.min <= _lt2 && _I.max >= _lt2 && (_U[_nt2 + _at2] = _lt2);\n                              }\n                            }\n                          } catch (err) {\n                            _iterator65.e(err);\n                          } finally {\n                            _iterator65.f();\n                          }\n                          _R[_C] = _N, _O[_C++] = _U;\n                        } else if (_P2 < _v && _$2 <= _k && _$2 > _v) {\n                          var _ht2 = _v - _P2,\n                            _ut2 = _$2 - _P2;\n                          var _iterator66 = _createForOfIteratorHelper(mos),\n                            _step66;\n                          try {\n                            for (_iterator66.s(); !(_step66 = _iterator66.n()).done;) {\n                              var _ft2 = _step66.value;\n                              var _ct2 = _ft2.offsets,\n                                _dt2 = _ft2.probabilities;\n                              if (_A.includes(\"m6A+\") && \"A\" === _ft2.unmodifiedBase || _A.includes(\"m6A-\") && \"T\" === _ft2.unmodifiedBase || _A.includes(\"5mC\") && \"C\" === _ft2.unmodifiedBase) for (var _gt2 = 0; _gt2 < _ct2.length; _gt2++) {\n                                var _pt2 = _ct2[_gt2],\n                                  _mt2 = parseInt(_dt2[_gt2]);\n                                _pt2 >= _ht2 && _pt2 <= _ut2 && _I.min <= _mt2 && _I.max >= _mt2 && (_U[_pt2 - _ht2] = _mt2);\n                              }\n                            }\n                          } catch (err) {\n                            _iterator66.e(err);\n                          } finally {\n                            _iterator66.f();\n                          }\n                          _R[_C] = _N, _O[_C++] = _U;\n                        } else if (_P2 >= _v && _P2 < _k && _$2 > _k) {\n                          var _t92 = _P2 - _v,\n                            _bt2 = _k - _P2 + _t92;\n                          var _iterator67 = _createForOfIteratorHelper(mos),\n                            _step67;\n                          try {\n                            for (_iterator67.s(); !(_step67 = _iterator67.n()).done;) {\n                              var _wt2 = _step67.value;\n                              var _yt2 = _wt2.offsets,\n                                _vt2 = _wt2.probabilities;\n                              if (_A.includes(\"m6A+\") && \"A\" === _wt2.unmodifiedBase || _A.includes(\"m6A-\") && \"T\" === _wt2.unmodifiedBase || _A.includes(\"5mC\") && \"C\" === _wt2.unmodifiedBase) for (var _kt2 = 0; _kt2 < _yt2.length; _kt2++) {\n                                var _xt2 = _yt2[_kt2],\n                                  _Et2 = parseInt(_vt2[_kt2]);\n                                _xt2 >= _t92 && _xt2 < _bt2 && _I.min <= _Et2 && _I.max >= _Et2 && (_U[_xt2] = _Et2);\n                              }\n                            }\n                          } catch (err) {\n                            _iterator67.e(err);\n                          } finally {\n                            _iterator67.f();\n                          }\n                          _R[_C] = _N, _O[_C++] = _U;\n                        }\n                        break;\n                      default:\n                        throw new Error(\"Event overlap type [\".concat(eventOverlapType, \"] is unknown or unsupported for cluster matrix generation\"));\n                    }\n                  }\n                  break;\n                case \"Jaccard\":\n                  _M = an.eN;\n                  for (var _At2 = 0; _At2 < _z; ++_At2) {\n                    var _Bt2 = f[_At2],\n                      _St = (_Bt2.to, _Bt2.from, new Array(_T).fill(0)),\n                      _It2 = _Bt2.from - _Bt2.chrOffset,\n                      _Mt2 = _Bt2.to - _Bt2.chrOffset;\n                    switch (eventOverlapType) {\n                      case \"Full region\":\n                        if (_It2 < _v && _Mt2 > _k) {\n                          var _Tt2 = _v - _It2,\n                            _zt2 = _Tt2 + _T;\n                          var _iterator68 = _createForOfIteratorHelper(mos),\n                            _step68;\n                          try {\n                            for (_iterator68.s(); !(_step68 = _iterator68.n()).done;) {\n                              var _Ot2 = _step68.value;\n                              var _Ct2 = _Ot2.offsets,\n                                _Rt2 = _Ot2.probabilities;\n                              if (_A.includes(\"m6A+\") && \"A\" === _Ot2.unmodifiedBase || _A.includes(\"m6A-\") && \"T\" === _Ot2.unmodifiedBase || _A.includes(\"5mC\") && \"C\" === _Ot2.unmodifiedBase) for (var _Nt2 = 0; _Nt2 < _Ct2.length; _Nt2++) {\n                                var _Lt2 = _Ct2[_Nt2],\n                                  _Ut = _Rt2[_Nt2];\n                                _Lt2 >= _Tt2 && _Lt2 <= _zt2 && _I.min <= _Ut && _I.max >= _Ut && (_St[_Lt2 - _Tt2] = 1);\n                              }\n                            }\n                          } catch (err) {\n                            _iterator68.e(err);\n                          } finally {\n                            _iterator68.f();\n                          }\n                          _R[_C] = _At2, _O[_C++] = _St;\n                        }\n                        break;\n                      case \"Partial region\":\n                        if (_It2 < _v && _Mt2 > _k) {\n                          var _Pt2 = _v - _It2,\n                            _$t2 = _Pt2 + _T;\n                          var _iterator69 = _createForOfIteratorHelper(mos),\n                            _step69;\n                          try {\n                            for (_iterator69.s(); !(_step69 = _iterator69.n()).done;) {\n                              var _jt2 = _step69.value;\n                              var _Ft2 = _jt2.offsets,\n                                _Dt = _jt2.probabilities;\n                              if (_A.includes(\"m6A+\") && \"A\" === _jt2.unmodifiedBase || _A.includes(\"m6A-\") && \"T\" === _jt2.unmodifiedBase || _A.includes(\"5mC\") && \"C\" === _jt2.unmodifiedBase) for (var _qt2 = 0; _qt2 < _Ft2.length; _qt2++) {\n                                var _Ht2 = _Ft2[_qt2],\n                                  _Zt2 = _Dt[_qt2];\n                                _Ht2 >= _Pt2 && _Ht2 <= _$t2 && _I.min <= _Zt2 && _I.max >= _Zt2 && (_St[_Ht2 - _Pt2] = 1);\n                              }\n                            }\n                          } catch (err) {\n                            _iterator69.e(err);\n                          } finally {\n                            _iterator69.f();\n                          }\n                          _R[_C] = _At2, _O[_C++] = _St;\n                        } else if (_It2 >= _v && _Mt2 <= _k) {\n                          var _Gt2 = _It2 - _v;\n                          var _iterator70 = _createForOfIteratorHelper(mos),\n                            _step70;\n                          try {\n                            for (_iterator70.s(); !(_step70 = _iterator70.n()).done;) {\n                              var _Wt2 = _step70.value;\n                              var _Xt2 = _Wt2.offsets,\n                                _Vt2 = _Wt2.probabilities;\n                              if (_A.includes(\"m6A+\") && \"A\" === _Wt2.unmodifiedBase || _A.includes(\"m6A-\") && \"T\" === _Wt2.unmodifiedBase || _A.includes(\"5mC\") && \"C\" === _Wt2.unmodifiedBase) for (var _Kt2 = 0; _Kt2 < _Xt2.length; _Kt2++) {\n                                var _Yt2 = _Xt2[_Kt2],\n                                  _Jt2 = parseInt(_Vt2[_Kt2]);\n                                _Gt2 + _Yt2 < _T && _I.min <= _Jt2 && _I.max >= _Jt2 && (_St[_Gt2 + _Yt2] = 1);\n                              }\n                            }\n                          } catch (err) {\n                            _iterator70.e(err);\n                          } finally {\n                            _iterator70.f();\n                          }\n                          _R[_C] = _At2, _O[_C++] = _St;\n                        } else if (_It2 < _v && _Mt2 <= _k && _Mt2 > _v) {\n                          var _Qt4 = _v - _It2,\n                            _te2 = _Mt2 - _It2;\n                          var _iterator71 = _createForOfIteratorHelper(mos),\n                            _step71;\n                          try {\n                            for (_iterator71.s(); !(_step71 = _iterator71.n()).done;) {\n                              var _ee2 = _step71.value;\n                              var _ne2 = _ee2.offsets,\n                                _re2 = _ee2.probabilities;\n                              if (_A.includes(\"m6A+\") && \"A\" === _ee2.unmodifiedBase || _A.includes(\"m6A-\") && \"T\" === _ee2.unmodifiedBase || _A.includes(\"5mC\") && \"C\" === _ee2.unmodifiedBase) for (var _ie2 = 0; _ie2 < _ne2.length; _ie2++) {\n                                var _se2 = _ne2[_ie2],\n                                  _oe2 = parseInt(_re2[_ie2]);\n                                _se2 >= _Qt4 && _se2 <= _te2 && _I.min <= _oe2 && _I.max >= _oe2 && (_St[_se2 - _Qt4] = 1);\n                              }\n                            }\n                          } catch (err) {\n                            _iterator71.e(err);\n                          } finally {\n                            _iterator71.f();\n                          }\n                          _R[_C] = _At2, _O[_C++] = _St;\n                        } else if (_It2 >= _v && _It2 < _k && _Mt2 > _k) {\n                          var _ae2 = _It2 - _v,\n                            _le2 = _k - _It2 + _ae2;\n                          var _iterator72 = _createForOfIteratorHelper(mos),\n                            _step72;\n                          try {\n                            for (_iterator72.s(); !(_step72 = _iterator72.n()).done;) {\n                              var _he2 = _step72.value;\n                              var _ue2 = _he2.offsets,\n                                _fe2 = _he2.probabilities;\n                              if (_A.includes(\"m6A+\") && \"A\" === _he2.unmodifiedBase || _A.includes(\"m6A-\") && \"T\" === _he2.unmodifiedBase || _A.includes(\"5mC\") && \"C\" === _he2.unmodifiedBase) for (var _ce3 = 0; _ce3 < _ue2.length; _ce3++) {\n                                var _de2 = _ue2[_ce3],\n                                  _ge2 = parseInt(_fe2[_ce3]);\n                                _de2 >= _ae2 && _de2 < _le2 && _I.min <= _ge2 && _I.max >= _ge2 && (_St[_de2] = 1);\n                              }\n                            }\n                          } catch (err) {\n                            _iterator72.e(err);\n                          } finally {\n                            _iterator72.f();\n                          }\n                          _R[_C] = _At2, _O[_C++] = _St;\n                        }\n                        break;\n                      default:\n                        throw new Error(\"Event overlap type [\".concat(eventOverlapType, \"] is unknown or unsupported for cluster matrix generation\"));\n                    }\n                  }\n                  break;\n                default:\n                  throw new Error(\"Cluster distance function [\".concat(_E, \"] is unknown or unsupported for BED12 export cluster matrix generation\"));\n              }\n              break;\n            case \"DBSCAN\":\n              if (\"Euclidean\" !== _E) throw new Error(\"Cluster distance function [\".concat(_E, \"] is unknown or unsupported for subregion cluster matrix construction\"));\n              _M = function _M(t, e) {\n                return Math.hypot.apply(Math, _toConsumableArray(Object.keys(t).map(function (n) {\n                  return e[n] - t[n];\n                })));\n              };\n              for (var _pe2 = 0; _pe2 < _z; ++_pe2) {\n                var _me2 = f[_pe2],\n                  _e84 = (_me2.to, _me2.from, new Array(_T).fill(-255)),\n                  _be2 = _me2.from - _me2.chrOffset,\n                  _we2 = _me2.to - _me2.chrOffset;\n                switch (eventOverlapType) {\n                  case \"Full region\":\n                    if (_be2 < _v && _we2 > _k) {\n                      var _ye2 = _v - _be2,\n                        _ve2 = _ye2 + _T;\n                      var _iterator73 = _createForOfIteratorHelper(mos),\n                        _step73;\n                      try {\n                        for (_iterator73.s(); !(_step73 = _iterator73.n()).done;) {\n                          var _ke2 = _step73.value;\n                          var _xe2 = _ke2.offsets,\n                            _Ee2 = _ke2.probabilities;\n                          if (_A.includes(\"m6A+\") && \"A\" === _ke2.unmodifiedBase || _A.includes(\"m6A-\") && \"T\" === _ke2.unmodifiedBase || _A.includes(\"5mC\") && \"C\" === _ke2.unmodifiedBase) for (var _Se2 = 0; _Se2 < _xe2.length; _Se2++) {\n                            var _Ie = _xe2[_Se2],\n                              _Me2 = _Ee2[_Se2];\n                            _Ie >= _ye2 && _Ie <= _ve2 && _I.min <= _Me2 && _I.max >= _Me2 && (_e84[_Ie - _ye2] = parseInt(_Me2));\n                          }\n                        }\n                      } catch (err) {\n                        _iterator73.e(err);\n                      } finally {\n                        _iterator73.f();\n                      }\n                      _R[_C] = _pe2, _O[_C++] = _e84;\n                    }\n                    break;\n                  case \"Partial region\":\n                    if (_be2 < _v && _we2 > _k) {\n                      var _Te2 = _v - _be2,\n                        _ze2 = _Te2 + _T;\n                      var _iterator74 = _createForOfIteratorHelper(mos),\n                        _step74;\n                      try {\n                        for (_iterator74.s(); !(_step74 = _iterator74.n()).done;) {\n                          var _Oe2 = _step74.value;\n                          var _Ce2 = _Oe2.offsets,\n                            _Re2 = _Oe2.probabilities;\n                          if (_A.includes(\"m6A+\") && \"A\" === _Oe2.unmodifiedBase || _A.includes(\"m6A-\") && \"T\" === _Oe2.unmodifiedBase || _A.includes(\"5mC\") && \"C\" === _Oe2.unmodifiedBase) for (var _Ne2 = 0; _Ne2 < _Ce2.length; _Ne2++) {\n                            var _Le2 = _Ce2[_Ne2],\n                              _Ue2 = _Re2[_Ne2];\n                            _Le2 >= _Te2 && _Le2 <= _ze2 && _I.min <= _Ue2 && _I.max >= _Ue2 && (_e84[_Le2 - _Te2] = parseInt(_Ue2));\n                          }\n                        }\n                      } catch (err) {\n                        _iterator74.e(err);\n                      } finally {\n                        _iterator74.f();\n                      }\n                      _R[_C] = _pe2, _O[_C++] = _e84;\n                    } else if (_be2 >= _v && _we2 <= _k) {\n                      var _Pe2 = _be2 - _v;\n                      var _iterator75 = _createForOfIteratorHelper(mos),\n                        _step75;\n                      try {\n                        for (_iterator75.s(); !(_step75 = _iterator75.n()).done;) {\n                          var _$e2 = _step75.value;\n                          var _je2 = _$e2.offsets,\n                            _Fe2 = _$e2.probabilities;\n                          if (_A.includes(\"m6A+\") && \"A\" === _$e2.unmodifiedBase || _A.includes(\"m6A-\") && \"T\" === _$e2.unmodifiedBase || _A.includes(\"5mC\") && \"C\" === _$e2.unmodifiedBase) for (var _De2 = 0; _De2 < _je2.length; _De2++) {\n                            var _qe2 = _je2[_De2],\n                              _He2 = parseInt(_Fe2[_De2]);\n                            _Pe2 + _qe2 < _T && _I.min <= _He2 && _I.max >= _He2 && (_e84[_Pe2 + _qe2] = _He2);\n                          }\n                        }\n                      } catch (err) {\n                        _iterator75.e(err);\n                      } finally {\n                        _iterator75.f();\n                      }\n                      _R[_C] = _pe2, _O[_C++] = _e84;\n                    } else if (_be2 < _v && _we2 <= _k && _we2 > _v) {\n                      var _Ze2 = _v - _be2,\n                        _Ge2 = _we2 - _be2;\n                      var _iterator76 = _createForOfIteratorHelper(mos),\n                        _step76;\n                      try {\n                        for (_iterator76.s(); !(_step76 = _iterator76.n()).done;) {\n                          var _We2 = _step76.value;\n                          var _Xe2 = _We2.offsets,\n                            _Ve2 = _We2.probabilities;\n                          if (_A.includes(\"m6A+\") && \"A\" === _We2.unmodifiedBase || _A.includes(\"m6A-\") && \"T\" === _We2.unmodifiedBase || _A.includes(\"5mC\") && \"C\" === _We2.unmodifiedBase) for (var _Ke2 = 0; _Ke2 < _Xe2.length; _Ke2++) {\n                            var _Ye2 = _Xe2[_Ke2],\n                              _Je2 = parseInt(_Ve2[_Ke2]);\n                            _Ye2 >= _Ze2 && _Ye2 <= _Ge2 && _I.min <= _Je2 && _I.max >= _Je2 && (_e84[_Ye2 - _Ze2] = _Je2);\n                          }\n                        }\n                      } catch (err) {\n                        _iterator76.e(err);\n                      } finally {\n                        _iterator76.f();\n                      }\n                      _R[_C] = _pe2, _O[_C++] = _e84;\n                    } else if (_be2 >= _v && _be2 < _k && _we2 > _k) {\n                      var _Qe2 = _be2 - _v,\n                        _tn2 = _k - _be2 + _Qe2;\n                      var _iterator77 = _createForOfIteratorHelper(mos),\n                        _step77;\n                      try {\n                        for (_iterator77.s(); !(_step77 = _iterator77.n()).done;) {\n                          var _en2 = _step77.value;\n                          var _nn2 = _en2.offsets,\n                            _rn2 = _en2.probabilities;\n                          if (_A.includes(\"m6A+\") && \"A\" === _en2.unmodifiedBase || _A.includes(\"m6A-\") && \"T\" === _en2.unmodifiedBase || _A.includes(\"5mC\") && \"C\" === _en2.unmodifiedBase) for (var _sn2 = 0; _sn2 < _nn2.length; _sn2++) {\n                            var _on2 = _nn2[_sn2],\n                              _ln2 = parseInt(_rn2[_sn2]);\n                            _on2 >= _Qe2 && _on2 < _tn2 && _I.min <= _ln2 && _I.max >= _ln2 && (_e84[_on2] = _ln2);\n                          }\n                        }\n                      } catch (err) {\n                        _iterator77.e(err);\n                      } finally {\n                        _iterator77.f();\n                      }\n                      _R[_C] = _pe2, _O[_C++] = _e84;\n                    }\n                    break;\n                  default:\n                    throw new Error(\"Event overlap type [\".concat(eventOverlapType, \"] is unknown or unsupported for cluster matrix generation\"));\n                }\n              }\n              break;\n            default:\n              throw new Error(\"Cluster method [\".concat(_x102, \"] is unknown or unsupported for BED12 export cluster matrix generation\"));\n          }\n          if (_O.length > 0) switch (_x102) {\n            case \"AGNES\":\n              var _ref34 = (0, an.eM)({\n                  data: _O,\n                  distance: _M,\n                  linkage: an.bP,\n                  onProgress: null\n                }),\n                _fn2 = _ref34.clusters,\n                _cn2 = _ref34.distances,\n                _dn = _ref34.order,\n                _gn2 = _ref34.clustersGivenK,\n                _pn2 = _dn.map(function (t) {\n                  var e = _R[t];\n                  return [f[e]];\n                });\n              for (var _i46 = 0, _Object$keys10 = Object.keys(g); _i46 < _Object$keys10.length; _i46++) {\n                var _bn2 = _Object$keys10[_i46];\n                var _wn2 = _pn2;\n                g[_bn2] = {}, g[_bn2].rows = _wn2;\n              }\n              break;\n            case \"DBSCAN\":\n              var _mn2 = function _mn2(t) {\n                var e = [],\n                  n = [];\n                for (var _r43 = 0; _r43 < t.length; _r43++) {\n                  var _i47 = t[_r43];\n                  if (Array.isArray(_i47)) n.push(t, _r43), _r43 = -1, t = _i47;else for (e.push(_i47); _r43 === t.length - 1 && n.length;) _r43 = n.pop(), t = n.pop();\n                }\n                return e;\n              };\n              var _n46 = hn({\n                dataset: _O,\n                epsilon: _B,\n                minimumPoints: _S,\n                distanceFunction: _M\n              });\n              if (_n46.clusters.length > 0) {\n                var _yn = _mn2(_n46.clusters.concat(_n46.noise)).map(function (t) {\n                  var e = _R[t];\n                  return [f[e]];\n                });\n                for (var _i48 = 0, _Object$keys11 = Object.keys(g); _i48 < _Object$keys11.length; _i48++) {\n                  var _kn = _Object$keys11[_i48];\n                  var _xn2 = _yn;\n                  g[_kn] = {}, g[_kn].rows = _xn2;\n                }\n              } else for (var _i49 = 0, _Object$keys12 = Object.keys(g); _i49 < _Object$keys12.length; _i49++) {\n                var _En = _Object$keys12[_i49];\n                var _An = Cn(g[_En], {\n                  prevRows: o[_En] && o[_En].rows || []\n                });\n                g[_En] = {}, g[_En].rows = _An;\n              }\n              break;\n            default:\n              throw new Error(\"Cluster method [\".concat(_x102, \"] is unknown or unsupported for BED12 export clustering\"));\n          } else for (var _i50 = 0, _Object$keys13 = Object.keys(g); _i50 < _Object$keys13.length; _i50++) {\n            var _Bn2 = _Object$keys13[_i50];\n            var _Sn2 = Cn(g[_Bn2], {\n              prevRows: o[_Bn2] && o[_Bn2].rows || []\n            });\n            g[_Bn2] = {}, g[_Bn2].rows = _Sn2;\n          }\n          Object.values(g).map(function (t) {\n            return t.rows.length;\n          }).reduce(function (t, e) {\n            return t + e;\n          }, 0);\n          for (var _i51 = 0, _Object$values2 = Object.values(g); _i51 < _Object$values2.length; _i51++) {\n            var _In2 = _Object$values2[_i51];\n            var _Mn2 = _In2.rows;\n            _Mn2.map(function (t, e) {\n              t.map(function (t, e) {\n                var n = a && a.methylation && a.methylation.categoryAbbreviations && a.methylation.categoryAbbreviations.includes(\"5mC+\"),\n                  r = a && a.methylation && a.methylation.categoryAbbreviations && a.methylation.categoryAbbreviations.includes(\"5mC-\"),\n                  i = a && a.methylation && a.methylation.categoryAbbreviations && a.methylation.categoryAbbreviations.includes(\"m6A+\"),\n                  s = a && a.methylation && a.methylation.categoryAbbreviations && a.methylation.categoryAbbreviations.includes(\"m6A-\"),\n                  o = a && a.methylation && a.methylation.probabilityThresholdRange ? a.methylation.probabilityThresholdRange[0] : 0,\n                  h = a && a.methylation && a.methylation.probabilityThresholdRange ? a.methylation.probabilityThresholdRange[1] + 1 : 255;\n                var f = null;\n                var c = {\n                  chrom: _y,\n                  chromStart: t.start - 1,\n                  chromEnd: t.start + (t.to - t.from) - 1,\n                  name: \"\".concat(l.name, \"__\").concat(t.readName),\n                  score: 1e3,\n                  strand: t.strand,\n                  thickStart: t.start - 1,\n                  thickEnd: t.start + (t.to - t.from) - 1,\n                  itemRgb: Be(l.colors[0]),\n                  blockCount: 0,\n                  blockSizes: [],\n                  blockStarts: []\n                };\n                var _iterator78 = _createForOfIteratorHelper(t.methylationOffsets),\n                  _step78;\n                try {\n                  for (_iterator78.s(); !(_step78 = _iterator78.n()).done;) {\n                    var _e85 = _step78.value;\n                    var _t93 = _e85.offsets,\n                      _a14 = _e85.probabilities,\n                      _l10 = 1;\n                    switch (_e85.unmodifiedBase) {\n                      case \"C\":\n                        \"m\" === _e85.code && \"+\" === _e85.strand && n && (f = null);\n                        break;\n                      case \"G\":\n                        \"m\" === _e85.code && \"-\" === _e85.strand && r && (f = null);\n                        break;\n                      case \"A\":\n                        \"a\" === _e85.code && \"+\" === _e85.strand && i && (f = Ae.MM_M6A_FOR);\n                        break;\n                      case \"T\":\n                        \"a\" === _e85.code && \"-\" === _e85.strand && s && (f = Ae.MM_M6A_REV);\n                    }\n                    if (f) {\n                      var _e86 = 0;\n                      var _iterator79 = _createForOfIteratorHelper(_t93),\n                        _step79;\n                      try {\n                        for (_iterator79.s(); !(_step79 = _iterator79.n()).done;) {\n                          var _n47 = _step79.value;\n                          var _t94 = _a14[_e86];\n                          _t94 >= o && _t94 < h && (c.blockCount++, c.blockSizes.push(_l10), c.blockStarts.push(_n47 - 1)), _e86++;\n                        }\n                      } catch (err) {\n                        _iterator79.e(err);\n                      } finally {\n                        _iterator79.f();\n                      }\n                      c.blockStarts.sort(function (t, e) {\n                        return t - e;\n                      });\n                    }\n                  }\n                } catch (err) {\n                  _iterator78.e(err);\n                } finally {\n                  _iterator78.f();\n                }\n                u.push(c);\n              });\n            });\n          }\n        }\n        return {\n          uid: l.uid,\n          bed12Elements: u\n        };\n      }\n    };\n    Ft(Fn);\n  }();\n})();");
;// CONCATENATED MODULE: ./src/PileupTrack.js
function PileupTrack_typeof(o) { "@babel/helpers - typeof"; return PileupTrack_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, PileupTrack_typeof(o); }
function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct.bind(); } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }
function PileupTrack_toConsumableArray(arr) { return PileupTrack_arrayWithoutHoles(arr) || PileupTrack_iterableToArray(arr) || PileupTrack_unsupportedIterableToArray(arr) || PileupTrack_nonIterableSpread(); }
function PileupTrack_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function PileupTrack_iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function PileupTrack_arrayWithoutHoles(arr) { if (Array.isArray(arr)) return PileupTrack_arrayLikeToArray(arr); }
function PileupTrack_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function PileupTrack_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? PileupTrack_ownKeys(Object(t), !0).forEach(function (r) { PileupTrack_defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : PileupTrack_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function PileupTrack_defineProperty(obj, key, value) { key = PileupTrack_toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function PileupTrack_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function PileupTrack_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, PileupTrack_toPropertyKey(descriptor.key), descriptor); } }
function PileupTrack_createClass(Constructor, protoProps, staticProps) { if (protoProps) PileupTrack_defineProperties(Constructor.prototype, protoProps); if (staticProps) PileupTrack_defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function PileupTrack_toPropertyKey(arg) { var key = PileupTrack_toPrimitive(arg, "string"); return PileupTrack_typeof(key) === "symbol" ? key : String(key); }
function PileupTrack_toPrimitive(input, hint) { if (PileupTrack_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (PileupTrack_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get.bind(); } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }
function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (PileupTrack_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function PileupTrack_createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = PileupTrack_unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || PileupTrack_unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function PileupTrack_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return PileupTrack_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return PileupTrack_arrayLikeToArray(o, minLen); }
function PileupTrack_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }




var createColorTexture = function createColorTexture(PIXI, colors) {
  var colorTexRes = Math.max(2, Math.ceil(Math.sqrt(colors.length)));
  var rgba = new Float32Array(Math.pow(colorTexRes, 2) * 4);
  colors.forEach(function (color, i) {
    // eslint-disable-next-line prefer-destructuring
    rgba[i * 4] = color[0]; // r
    // eslint-disable-next-line prefer-destructuring
    rgba[i * 4 + 1] = color[1]; // g
    // eslint-disable-next-line prefer-destructuring
    rgba[i * 4 + 2] = color[2]; // b
    // eslint-disable-next-line prefer-destructuring
    rgba[i * 4 + 3] = color[3]; // a
  });
  return [PIXI.Texture.fromBuffer(rgba, colorTexRes, colorTexRes), colorTexRes];
};
function transformY(p, t) {
  return p * t.k + t.y;
}
function invY(p, t) {
  return (p - t.y) / t.k;
}
function subPos(read, sub) {
  var subStart = read.from + sub.pos;
  var subEnd = read.from + sub.pos + sub.length;
  return [subStart, subEnd];
}

/** The distance between a substitution and the mouse position */
function calcSubDistance(mousePos, read, sub) {
  var _subPos = subPos(read, sub),
    _subPos2 = _slicedToArray(_subPos, 2),
    subStart = _subPos2[0],
    subEnd = _subPos2[1];
  var subDistance = null;
  if (mousePos < subStart) {
    subDistance = subStart - mousePos;
  } else if (mousePos > subEnd) {
    subDistance = mousePos - subEnd;
  } else {
    subDistance = 0;
  }
  return subDistance;
}

/** Find the thearest substition to the mouse position */
function findNearestSub(mousePos, read, nearestDistance) {
  var subs = read.substitutions;
  var nearestSub = null;
  var nearestSubDistance = Number.MAX_VALUE;
  var _iterator = PileupTrack_createForOfIteratorHelper(subs),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var sub = _step.value;
      var subDistance = calcSubDistance(mousePos, read, sub);
      if (subDistance < nearestSubDistance) {
        nearestSub = sub;
        nearestSubDistance = subDistance;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  if (nearestSubDistance < nearestDistance) {
    return nearestSub;
  }
  return null;
}
var scaleScalableGraphics = function scaleScalableGraphics(graphics, xScale, drawnAtScale) {
  var tileK = (drawnAtScale.domain()[1] - drawnAtScale.domain()[0]) / (xScale.domain()[1] - xScale.domain()[0]);
  var newRange = xScale.domain().map(drawnAtScale);
  var posOffset = newRange[0];
  graphics.scale.x = tileK;
  graphics.position.x = -posOffset * tileK;
};
var getTilePosAndDimensions = function getTilePosAndDimensions(zoomLevel, tilePos, binsPerTileIn, tilesetInfo) {
  /**
   * Get the tile's position in its coordinate system.
   *
   * TODO: Replace this function with one imported from
   * HGC.utils.trackUtils
   */
  var xTilePos = tilePos[0];
  var yTilePos = tilePos[1];
  if (tilesetInfo.resolutions) {
    // the default bins per tile which should
    // not be used because the right value should be in the tileset info

    var binsPerTile = binsPerTileIn;
    var sortedResolutions = tilesetInfo.resolutions.map(function (x) {
      return +x;
    }).sort(function (a, b) {
      return b - a;
    });
    var chosenResolution = sortedResolutions[zoomLevel];
    var _tileWidth = chosenResolution * binsPerTile;
    var _tileHeight = _tileWidth;
    var _tileX = chosenResolution * binsPerTile * tilePos[0];
    var _tileY = chosenResolution * binsPerTile * tilePos[1];
    return {
      tileX: _tileX,
      tileY: _tileY,
      tileWidth: _tileWidth,
      tileHeight: _tileHeight
    };
  }

  // max_width should be substitutable with 2 ** tilesetInfo.max_zoom
  var totalWidth = tilesetInfo.max_width;
  var totalHeight = tilesetInfo.max_width;
  var minX = tilesetInfo.min_pos[0];
  var minY = tilesetInfo.min_pos[1];
  var tileWidth = totalWidth / Math.pow(2, zoomLevel);
  var tileHeight = totalHeight / Math.pow(2, zoomLevel);
  var tileX = minX + xTilePos * tileWidth;
  var tileY = minY + yTilePos * tileHeight;
  return {
    tileX: tileX,
    tileY: tileY,
    tileWidth: tileWidth,
    tileHeight: tileHeight
  };
};
var toVoid = function toVoid() {};
function eqSet(as, bs) {
  return as.size === bs.size && PileupTrack_all(isIn(bs), as);
}
function PileupTrack_all(pred, as) {
  var _iterator2 = PileupTrack_createForOfIteratorHelper(as),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var a = _step2.value;
      if (!pred(a)) return false;
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  return true;
}
function isIn(as) {
  return function (a) {
    return as.has(a);
  };
}
var PileupTrack = function PileupTrack(HGC) {
  /**
     if (!new.target) {
       throw new Error(
         'Uncaught TypeError: Class constructor cannot be invoked without "new"',
       );
     }
    */
  var PileupTrackClass = /*#__PURE__*/function (_HGC$tracks$Tiled1DPi) {
    _inherits(PileupTrackClass, _HGC$tracks$Tiled1DPi);
    var _super = _createSuper(PileupTrackClass);
    function PileupTrackClass(context, options) {
      var _this;
      PileupTrack_classCallCheck(this, PileupTrackClass);
      var worker = spawn(BlobWorker.fromText(cjs_js_dist_worker));

      // this is where the threaded tile fetcher is called
      // We also need to pass the track options as some of them influence how the data needs to be loaded
      context.dataFetcher = new bam_fetcher(context.dataConfig, options, worker, HGC);
      _this = _super.call(this, context, options);
      context.dataFetcher.track = _assertThisInitialized(_this);

      // console.log(`${this.id} | options ${JSON.stringify(options)}`);

      _this.trackId = _this.id;
      _this.viewId = context.viewUid;
      _this.originalHeight = context.definition.height;
      _this.worker = worker;
      _this.isShowGlobalMousePosition = context.isShowGlobalMousePosition;
      _this.valueScaleTransform = HGC.libraries.d3Zoom.zoomIdentity;

      // this.optionsDict = {};
      // this.optionsDict[trackId] = options;

      // this.backgroundColor = (options.methylation) ? '#1c1c1cff' : (options.indexDHS) '#00000000';

      _this.maxTileWidthReached = false;
      _this.loadingText = new HGC.libraries.PIXI.Text('Loading', {
        fontSize: '12px',
        fontFamily: 'Arial',
        fill: 'grey'
      });
      _this.loadingText.x = 100;
      _this.loadingText.y = 100;
      _this.loadingText.anchor.x = 0;
      _this.loadingText.anchor.y = 0;
      if (_this.options.showLoadingText) {
        _this.pLabel.addChild(_this.loadingText);
      }
      _this.externalInit(options);

      // console.log(`setting up pileup-track: ${this.id}`);

      _this.bc = new BroadcastChannel("pileup-track-".concat(_this.id));
      _this.bc.postMessage({
        state: 'loading',
        msg: _this.loadingText.text,
        uid: _this.id
      });
      _this.monitor = new BroadcastChannel("pileup-track-viewer");
      _this.monitor.onmessage = function (event) {
        return _this.handlePileupTrackViewerMessage(event.data);
      };

      // this.handlePileupMessage = this.handlePileupTrackViewerMessage;
      return _this;
    }

    // Some of the initialization code is factored out, so that we can 
    // reset/reinitialize if an option change requires it
    PileupTrack_createClass(PileupTrackClass, [{
      key: "externalInit",
      value: function externalInit(options) {
        // we scale the entire view up until a certain point
        // at which point we redraw everything to get rid of
        // artifacts
        // this.drawnAtScale keeps track of the scale at which
        // we last rendered everything
        this.drawnAtScale = HGC.libraries.d3Scale.scaleLinear();
        this.prevRows = [];
        this.coverage = {};
        this.yScaleBands = {};

        // The bp distance for which the samples are chosen for the coverage.
        this.coverageSamplingDistance = 1;
        this.loadMates = areMatesRequired(this.options);
        // The following will be used to quickly find the mate when hovering over a read.
        // It will only be populated if this.loadMates==true to save memory
        this.readsById = {};
        this.previousTileIdsUsedForRendering = {};
        this.prevOptions = Object.assign({}, options);

        // graphics for highliting reads under the cursor
        this.mouseOverGraphics = new HGC.libraries.PIXI.Graphics();
        this.fetching = new Set();
        this.rendering = new Set();
        if (this.options.showMousePosition && !this.hideMousePosition) {
          this.hideMousePosition = HGC.utils.showMousePosition(this, this.is2d, this.isShowGlobalMousePosition());
        }
        this.clusterReorderData = null;
        this.clusterData = null;
        this.bed12ExportData = null;
        this.setUpShaderAndTextures(options);
      }
    }, {
      key: "initTile",
      value: function initTile() {}
    }, {
      key: "colorToArray",
      value: function colorToArray(color) {
        var rgb = HGC.libraries.d3Color.rgb(color);
        var array = [rgb.r / 255, rgb.g / 255, rgb.b / 255, rgb.opacity];
        return array;
      }
    }, {
      key: "colorArrayToString",
      value: function colorArrayToString(colorArray) {
        var r = Math.round(colorArray[0] * 255);
        var g = Math.round(colorArray[1] * 255);
        var b = Math.round(colorArray[2] * 255);
        var rgbaString = "rgba(".concat(r, ", ").concat(g, ", ").concat(b, ", ").concat(colorArray[3], ")");
        var color = HGC.libraries.d3Color.color(rgbaString);
        return color.hex();
      }
    }, {
      key: "setUpShaderAndTextures",
      value: function setUpShaderAndTextures(options) {
        var _this2 = this;
        // console.log(`setUpShaderAndTextures`);

        // console.log(`setUpShaderAndTextures | ${this.id} | options ${JSON.stringify(options)}`);

        var colorDict = PILEUP_COLORS;
        if (options && options.colorScale && options.colorScale.length == 6) {
          var _options$colorScale$m = options.colorScale.map(function (x) {
            return _this2.colorToArray(x);
          });
          var _options$colorScale$m2 = _slicedToArray(_options$colorScale$m, 6);
          colorDict.A = _options$colorScale$m2[0];
          colorDict.T = _options$colorScale$m2[1];
          colorDict.G = _options$colorScale$m2[2];
          colorDict.C = _options$colorScale$m2[3];
          colorDict.N = _options$colorScale$m2[4];
          colorDict.X = _options$colorScale$m2[5];
        } else if (options && options.colorScale && options.colorScale.length == 11) {
          var _options$colorScale$m3 = options.colorScale.map(function (x) {
            return _this2.colorToArray(x);
          });
          var _options$colorScale$m4 = _slicedToArray(_options$colorScale$m3, 11);
          colorDict.A = _options$colorScale$m4[0];
          colorDict.T = _options$colorScale$m4[1];
          colorDict.G = _options$colorScale$m4[2];
          colorDict.C = _options$colorScale$m4[3];
          colorDict.N = _options$colorScale$m4[4];
          colorDict.X = _options$colorScale$m4[5];
          colorDict.LARGE_INSERT_SIZE = _options$colorScale$m4[6];
          colorDict.SMALL_INSERT_SIZE = _options$colorScale$m4[7];
          colorDict.LL = _options$colorScale$m4[8];
          colorDict.RR = _options$colorScale$m4[9];
          colorDict.RL = _options$colorScale$m4[10];
        } else if (options && options.colorScale) {
          console.error("colorScale must contain 6 or 11 entries. See https://github.com/higlass/higlass-pileup#options.");
        }

        // console.log(`this.options.methylationTagColor ${this.options.methylationTagColor}`);
        // if (this.options && this.options.methylationTagColor) {
        //   colorDict.MM = this.colorToArray(this.options.methylationTagColor);
        // }
        if (options && options.methylation && options.methylation.categories && options.methylation.colors) {
          options.methylation.categories.forEach(function (category, index) {
            if (category.unmodifiedBase === 'A' && category.code === 'a' && category.strand === '+') {
              colorDict.MM_M6A_FOR = _this2.colorToArray(options.methylation.colors[index]);
            } else if (category.unmodifiedBase === 'T' && category.code === 'a' && category.strand === '-') {
              colorDict.MM_M6A_REV = _this2.colorToArray(options.methylation.colors[index]);
            } else if (category.unmodifiedBase === 'C' && category.code === 'm' && category.strand === '+') {
              colorDict.MM_M5C_FOR = _this2.colorToArray(options.methylation.colors[index]);
            } else if (category.unmodifiedBase === 'G' && category.code === 'm' && category.strand === '-') {
              colorDict.MM_M5C_REV = _this2.colorToArray(options.methylation.colors[index]);
            }
          });
        }
        if (options && options.methylation && options.methylation.highlights) {
          var highlights = Object.keys(options.methylation.highlights);
          highlights.forEach(function (highlight) {
            colorDict["HIGHLIGHTS_".concat(highlight)] = _this2.colorToArray(options.methylation.highlights[highlight]);
          });
        }
        if (options && typeof options.plusStrandColor !== 'undefined') {
          colorDict.PLUS_STRAND = this.colorToArray(options.plusStrandColor);
        }
        if (options && typeof options.minusStrandColor !== 'undefined') {
          colorDict.MINUS_STRAND = this.colorToArray(options.minusStrandColor);
        }

        //
        // add Index DHS color table data, if available
        //
        if (options && options.indexDHS) {
          var indexDHSColorDict = indexDHSColors(options);
          colorDict = PileupTrack_objectSpread(PileupTrack_objectSpread({}, colorDict), indexDHSColorDict);
          if (options.indexDHS.backgroundColor) {
            // console.log(`[PileupTrack] options.indexDHS.backgroundColor ${options.indexDHS.backgroundColor}`);
            colorDict.INDEX_DHS_BG = this.colorToArray(options.indexDHS.backgroundColor);
          }
        }
        var colors = Object.values(colorDict);
        var _createColorTexture = createColorTexture(HGC.libraries.PIXI, colors),
          _createColorTexture2 = _slicedToArray(_createColorTexture, 2),
          colorMapTex = _createColorTexture2[0],
          colorMapTexRes = _createColorTexture2[1];
        var uniforms = new HGC.libraries.PIXI.UniformGroup({
          uColorMapTex: colorMapTex,
          uColorMapTexRes: colorMapTexRes
        });
        this.shader = HGC.libraries.PIXI.Shader.from("\n    attribute vec2 position;\n    attribute float aColorIdx;\n\n    uniform mat3 projectionMatrix;\n    uniform mat3 translationMatrix;\n\n    uniform sampler2D uColorMapTex;\n    uniform float uColorMapTexRes;\n\n    varying vec4 vColor;\n\n    void main(void)\n    {\n        // Half a texel (i.e., pixel in texture coordinates)\n        float eps = 0.5 / uColorMapTexRes;\n        float colorRowIndex = floor((aColorIdx + eps) / uColorMapTexRes);\n        vec2 colorTexIndex = vec2(\n          (aColorIdx / uColorMapTexRes) - colorRowIndex + eps,\n          (colorRowIndex / uColorMapTexRes) + eps\n        );\n        vColor = texture2D(uColorMapTex, colorTexIndex);\n\n        gl_Position = vec4((projectionMatrix * translationMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n    }\n\n", "\nvarying vec4 vColor;\n\n    void main(void) {\n        gl_FragColor = vColor;\n    }\n", uniforms);
      }
    }, {
      key: "handlePileupTrackViewerMessage",
      value: function handlePileupTrackViewerMessage(data) {
        // console.log(`data ${JSON.stringify(data)} | ${JSON.stringify(this.options)}`);
        if (data.state === 'mouseover') {
          if (this.id !== data.uid) {
            this.clearMouseOver();
          }
        }
        if (data.state === 'request') {
          switch (data.msg) {
            case "refresh-layout":
              if (!this.options.methylation) break;
              // this.dataFetcher = new BAMDataFetcher(
              //   this.dataFetcher.dataConfig,
              //   this.options,
              //   this.worker,
              //   HGC,
              // );
              // this.dataFetcher.track = this;
              for (var key in this.prevRows) {
                var _iterator3 = PileupTrack_createForOfIteratorHelper(this.prevRows[key].rows),
                  _step3;
                try {
                  for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                    var row = _step3.value;
                    var _iterator4 = PileupTrack_createForOfIteratorHelper(row),
                      _step4;
                    try {
                      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                        var segment = _step4.value;
                        // console.log(`rerender > segment.id ${segment.id} | ${Object.getOwnPropertyNames(segment)}`);
                        segment.methylationOffsets = [];
                      }
                    } catch (err) {
                      _iterator4.e(err);
                    } finally {
                      _iterator4.f();
                    }
                  }
                } catch (err) {
                  _iterator3.e(err);
                } finally {
                  _iterator3.f();
                }
              }
              this.prevRows = [];
              this.removeTiles(Object.keys(this.fetchedTiles));
              this.fetching.clear();
              this.refreshTiles();
              this.externalInit(this.options);
              // this.updateExistingGraphics();
              this.prevOptions = Object.assign({}, this.options);
              break;
            case "cluster-reorder-data":
              if (this.id === data.uid) {
                if (!this.options.methylation || this.clusterReorderData && this.clusterReorderData.uid === data.uid && !this.clusterData) break;
                this.dataFetcher = new bam_fetcher(this.dataFetcher.dataConfig, this.options, this.worker, HGC);
                this.dataFetcher.track = this;
                this.prevRows = [];
                this.removeTiles(Object.keys(this.fetchedTiles));
                this.fetching.clear();
                this.refreshTiles();
                this.externalInit(this.options);
                if (this.clusterData) {
                  this.clusterData = null;
                }
                this.clusterReorderData = {
                  uid: data.uid,
                  order: data.order,
                  range: data.range,
                  viewportRange: data.viewportRange,
                  method: data.method,
                  distanceFn: data.distanceFn,
                  eventCategories: data.eventCategories,
                  linkage: data.linkage,
                  epsilon: data.epsilon,
                  minimumPoints: data.minimumPoints,
                  probabilityThresholdRange: data.probabilityThresholdRange,
                  eventOverlapType: data.eventOverlapType
                };
                // console.log(`cluster-reorder-data | ${this.id} | ${data.uid} | ${JSON.stringify(this.clusterReorderData)}`);
                this.updateExistingGraphics();
                this.prevOptions = Object.assign({}, this.options);
              }
              break;
            case "cluster-layout":
              if (!this.options.methylation || this.clusterData && !this.clusterReorderData) break;
              this.dataFetcher = new bam_fetcher(this.dataFetcher.dataConfig, this.options, this.worker, HGC);
              this.dataFetcher.track = this;
              this.prevRows = [];
              this.removeTiles(Object.keys(this.fetchedTiles));
              this.fetching.clear();
              this.refreshTiles();
              this.externalInit(this.options);
              this.clusterData = {
                range: data.range,
                viewportRange: data.viewportRange,
                method: data.method,
                distanceFn: data.distanceFn,
                eventCategories: data.eventCategories,
                linkage: data.linkage,
                epsilon: data.epsilon,
                minimumPoints: data.minimumPoints,
                probabilityThresholdRange: data.probabilityThresholdRange,
                eventOverlapType: data.eventOverlapType
              };
              this.updateExistingGraphics();
              this.prevOptions = Object.assign({}, this.options);
              break;
            case "bed12-layout":
              if (!this.options.methylation) break;
              var bed12Name = "".concat(this.options.methylation.group, "/").concat(this.options.methylation.set);
              var bed12Colors = this.options.methylation.colors;
              this.bed12ExportData = {
                range: data.range,
                method: data.method,
                distanceFn: data.distanceFn,
                eventCategories: data.eventCategories,
                linkage: data.linkage,
                epsilon: data.epsilon,
                minimumPoints: data.minimumPoints,
                probabilityThresholdRange: data.probabilityThresholdRange,
                eventOverlapType: data.eventOverlapType,
                uid: this.id,
                name: bed12Name,
                colors: bed12Colors
              };
              this.exportBED12Layout();
              break;
            default:
              break;
          }
        }
      }
    }, {
      key: "rerender",
      value: function rerender(options) {
        _get(_getPrototypeOf(PileupTrackClass.prototype), "rerender", this).call(this, options);
        this.options = options;
        if (this.options.showMousePosition && !this.hideMousePosition) {
          this.hideMousePosition = HGC.utils.showMousePosition(this, this.is2d, this.isShowGlobalMousePosition());
        }
        if (!this.options.showMousePosition && this.hideMousePosition) {
          this.hideMousePosition();
          this.hideMousePosition = undefined;
        }
        this.setUpShaderAndTextures(options);
        // Reset the following, so the graphic actually updates
        this.previousTileIdsUsedForRendering = {};

        // Reset everything and overwrite the datafetcher if the data needs to be loaded differently,
        // we need to realign or we need to recolor. Expensive, but only happens if options change.
        if (areMatesRequired(options) !== this.loadMates || JSON.stringify(this.prevOptions.highlightReadsBy) !== JSON.stringify(options.highlightReadsBy) || this.prevOptions.largeInsertSizeThreshold !== options.largeInsertSizeThreshold || this.prevOptions.smallInsertSizeThreshold !== options.smallInsertSizeThreshold || this.prevOptions.minMappingQuality !== options.minMappingQuality) {
          this.dataFetcher = new bam_fetcher(this.dataFetcher.dataConfig, options, this.worker, HGC);
          this.dataFetcher.track = this;
          this.prevRows = [];
          this.removeTiles(Object.keys(this.fetchedTiles));
          this.fetching.clear();
          this.refreshTiles();
          this.externalInit(options);
        }
        this.updateExistingGraphics();
        this.prevOptions = Object.assign({}, options);
      }
    }, {
      key: "exportBED12Layout",
      value: function exportBED12Layout() {
        var _this3 = this;
        // console.log(`exportBED12Layout called`);
        this.bc.postMessage({
          state: 'export_bed12_start',
          msg: 'Begin BED12 export worker processing',
          uid: this.id
        });
        this.worker.then(function (tileFunctions) {
          tileFunctions.exportSegmentsAsBED12(_this3.dataFetcher.uid, Object.values(_this3.fetchedTiles).map(function (x) {
            return x.remoteId;
          }), _this3._xScale.domain(), _this3._xScale.range(), _this3.position, _this3.dimensions, _this3.prevRows, _this3.options, _this3.bed12ExportData).then(function (toExport) {
            // console.log(`toExport ${JSON.stringify(toExport)}`);

            if (_this3.clusterReorderData) {
              _this3.clusterReorderData = null;
            }
            if (_this3.clusterData) {
              _this3.clusterData = null;
            }
            if (_this3.bed12ExportData) {
              _this3.bed12ExportData = null;
            }
            _this3.bc.postMessage({
              state: 'export_bed12_end',
              msg: 'Completed (exportBED12Layout Promise fulfillment)',
              uid: _this3.id,
              data: toExport
            });
          });
        });
      }
    }, {
      key: "updateExistingGraphics",
      value: function updateExistingGraphics() {
        var _this4 = this;
        // console.log(`updateExistingGraphics (start) | ${this.id}`);
        var updateExistingGraphicsStart = performance.now();
        if (!this.maxTileWidthReached) {
          this.loadingText.text = 'Rendering...';
          this.bc.postMessage({
            state: 'update_start',
            msg: this.loadingText.text,
            uid: this.id
          });
        } else {
          // console.log(`updateExistingGraphics (A) | ${this.id}`);
          this.worker.then(function (tileFunctions) {
            tileFunctions.renderSegments(_this4.dataFetcher.uid, Object.values(_this4.fetchedTiles).map(function (x) {
              return x.remoteId;
            }), _this4._xScale.domain(), _this4._xScale.range(), _this4.position, _this4.dimensions, _this4.prevRows, _this4.options, _this4.clusterData, _this4.clusterReorderData).then(function (toRender) {
              // console.log(`toRender (maxTileWidthReached) ${JSON.stringify(toRender)}`);
              // if (this.clusterReorderData) {
              //   this.clusterReorderData = null;
              // }
              if (_this4.segmentGraphics) {
                _this4.pMain.removeChild(_this4.segmentGraphics);
              }
              _this4.draw();
              _this4.animate();
              var updateExistingGraphicsEndA = performance.now();
              var elapsedTimeA = updateExistingGraphicsEndA - updateExistingGraphicsStart;
              var msg = {
                state: 'update_end',
                msg: 'Completed (maxTileWidthReached)',
                uid: _this4.id,
                elapsedTime: elapsedTimeA
              };
              // console.log(`${JSON.stringify(msg)}`);
              _this4.bc.postMessage(msg);
            });
          });
          return;
        }

        // console.log(`updateExistingGraphics (B1) | ${this.id}`);
        var fetchedTileIds = new Set(Object.keys(this.fetchedTiles));
        if (!eqSet(this.visibleTileIds, fetchedTileIds)) {
          this.updateLoadingText();
          return;
        }

        // Prevent multiple renderings with the same tiles. This can happen when multiple new tiles come in at once
        // console.log(`updateExistingGraphics (B2) | ${this.id}`);
        if (eqSet(this.previousTileIdsUsedForRendering, fetchedTileIds)) {
          return;
        }
        this.previousTileIdsUsedForRendering = fetchedTileIds;
        // console.log(`updateExistingGraphics (B2+) | ${this.id}`);

        var fetchedTileKeys = Object.keys(this.fetchedTiles);
        for (var _i = 0, _fetchedTileKeys = fetchedTileKeys; _i < _fetchedTileKeys.length; _i++) {
          var fetchedTileKey = _fetchedTileKeys[_i];
          this.fetching["delete"](fetchedTileKey);
          this.rendering.add(fetchedTileKey);
        }
        // fetchedTileKeys.forEach((x) => {
        //   this.fetching.delete(x);
        //   this.rendering.add(x);
        // });

        this.updateLoadingText();

        // console.log(`updateExistingGraphics (B3) | ${this.id}`);
        // if (this.clusterReorderData) {
        //   console.log(`clusterReorderData exists`);
        // }

        this.worker.then(function (tileFunctions) {
          tileFunctions.renderSegments(_this4.dataFetcher.uid, Object.values(_this4.fetchedTiles).map(function (x) {
            return x.remoteId;
          }), _this4._xScale.domain(), _this4._xScale.range(), _this4.position, _this4.dimensions, _this4.prevRows, _this4.options, _this4.clusterData, _this4.clusterReorderData).then(function (toRender) {
            // console.log(`toRender.tileIds ${JSON.stringify(toRender.tileIds)}`);

            if (!toRender) return;
            if (toRender.clusterResultsToExport) {
              _this4.bc.postMessage({
                state: 'export_subregion_clustering_results',
                msg: 'Completed subregion clustering',
                uid: _this4.id,
                data: toRender.clusterResultsToExport
              });
              // console.log(`export_subregion_clustering_end | ${this.id} | ${toRender.clusterResultsToExport}`);
            }
            _this4.loadingText.visible = false;
            for (var _i2 = 0, _fetchedTileKeys2 = fetchedTileKeys; _i2 < _fetchedTileKeys2.length; _i2++) {
              var _fetchedTileKey = _fetchedTileKeys2[_i2];
              _this4.rendering["delete"](_fetchedTileKey);
            }
            // fetchedTileKeys.forEach((x) => {
            //   this.rendering.delete(x);
            // });

            _this4.updateLoadingText();
            if (_this4.maxTileWidthReached) {
              // if (
              //   this.segmentGraphics &&
              //   this.options.collapseWhenMaxTileWidthReached
              // ) {
              //   this.pMain.removeChild(this.segmentGraphics);
              // }
              if (_this4.segmentGraphics) {
                _this4.segmentGraphics.clear();
                _this4.pMain.removeChild(_this4.segmentGraphics);
                _this4.pBorder.clear();
              }
              if (_this4.mouseOverGraphics) {
                requestAnimationFrame(_this4.animate);
                _this4.mouseOverGraphics.clear();
                _this4.pMain.removeChild(_this4.mouseOverGraphics);
                _this4.pBorder.clear();
              }
              _this4.loadingText.visible = false;
              _this4.draw();
              _this4.animate();
              requestAnimationFrame(_this4.animate);
              var updateExistingGraphicsEndB = performance.now();
              var elapsedTimeB = updateExistingGraphicsEndB - updateExistingGraphicsStart;
              var _msg = {
                state: 'update_end',
                msg: 'Completed (maxTileWidthReached)',
                uid: _this4.id,
                elapsedTime: elapsedTimeB
              };
              // console.log(`${JSON.stringify(msg)}`);
              _this4.bc.postMessage(_msg);
              return;
            }
            _this4.errorTextText = null;
            _this4.pBorder.clear();
            _this4.drawError();
            _this4.animate();
            _this4.positions = new Float32Array(toRender.positionsBuffer);
            _this4.colors = new Float32Array(toRender.colorsBuffer);
            _this4.ixs = new Int32Array(toRender.ixBuffer);
            var newGraphics = new HGC.libraries.PIXI.Graphics();
            _this4.prevRows = toRender.rows;
            _this4.coverage = toRender.coverage;
            _this4.coverageSamplingDistance = toRender.coverageSamplingDistance;
            if (_this4.loadMates) {
              _this4.readsById = {};
              for (var key in _this4.prevRows) {
                var _iterator5 = PileupTrack_createForOfIteratorHelper(_this4.prevRows[key].rows),
                  _step5;
                try {
                  for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
                    var row = _step5.value;
                    var _iterator6 = PileupTrack_createForOfIteratorHelper(row),
                      _step6;
                    try {
                      for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
                        var segment = _step6.value;
                        if (segment.id in _this4.readsById) return;
                        _this4.readsById[segment.id] = segment;
                        _this4.readsById[segment.id]['groupKey'] = key;
                      }
                    } catch (err) {
                      _iterator6.e(err);
                    } finally {
                      _iterator6.f();
                    }
                  }
                  // this.prevRows[key].rows.forEach((row) => {
                  //   row.forEach((segment) => {
                  //     if (segment.id in this.readsById) return;
                  //     this.readsById[segment.id] = segment;
                  //     // Will be needed later in the mouseover to determine the correct yPos for the mate
                  //     this.readsById[segment.id]['groupKey'] = key;
                  //   });
                  // });
                } catch (err) {
                  _iterator5.e(err);
                } finally {
                  _iterator5.f();
                }
              }
            }
            var geometry = new HGC.libraries.PIXI.Geometry().addAttribute('position', _this4.positions, 2); // x,y
            geometry.addAttribute('aColorIdx', _this4.colors, 1);
            geometry.addIndex(_this4.ixs);
            if (_this4.positions.length) {
              var state = new HGC.libraries.PIXI.State();
              var mesh = new HGC.libraries.PIXI.Mesh(geometry, _this4.shader, state);
              newGraphics.addChild(mesh);
            }
            _this4.pMain.x = _this4.position[0];
            if (_this4.segmentGraphics) {
              _this4.pMain.removeChild(_this4.segmentGraphics);
            }
            _this4.pMain.addChild(newGraphics);
            _this4.segmentGraphics = newGraphics;

            // remove and add again to place on top
            _this4.pMain.removeChild(_this4.mouseOverGraphics);
            _this4.pMain.addChild(_this4.mouseOverGraphics);
            _this4.yScaleBands = {};
            for (var _key2 in _this4.prevRows) {
              _this4.yScaleBands[_key2] = HGC.libraries.d3Scale.scaleBand().domain(HGC.libraries.d3Array.range(0, _this4.prevRows[_key2].rows.length)).range([_this4.prevRows[_key2].start, _this4.prevRows[_key2].end]).paddingInner(0.2);
            }
            _this4.drawnAtScale = HGC.libraries.d3Scale.scaleLinear().domain(toRender.xScaleDomain).range(toRender.xScaleRange);
            scaleScalableGraphics(_this4.segmentGraphics, _this4._xScale, _this4.drawnAtScale);

            // if somebody zoomed vertically, we want to readjust so that
            // they're still zoomed in vertically
            _this4.segmentGraphics.scale.y = _this4.valueScaleTransform.k;
            _this4.segmentGraphics.position.y = _this4.valueScaleTransform.y;
            _this4.draw();
            _this4.animate();
            if (_this4.clusterReorderData) {
              _this4.clusterReorderData = null;
            }
            if (_this4.clusterData) {
              _this4.clusterData = null;
            }
            if (_this4.bed12ExportData) {
              _this4.bed12ExportData = null;
            }
            var updateExistingGraphicsEndC = performance.now();
            var elapsedTimeC = updateExistingGraphicsEndC - updateExistingGraphicsStart;
            var msg = {
              state: 'update_end',
              msg: 'Completed (renderSegments Promise fulfillment)',
              uid: _this4.id,
              elapsedTime: elapsedTimeC
            };
            // console.log(`${JSON.stringify(msg)}`);
            // this.bc.postMessage(msg);
          });
          // .catch(err => {
          //   // console.log('err:', err);
          //   // console.log('err:', err.message);
          //   this.errorTextText = err.message;

          //   // console.log('errorTextText:', this.errorTextText);
          //   // this.draw();
          //   // this.animate();
          //   this.drawError();
          //   this.animate();

          //   // console.log('this.pBorder:', this.pBorder);
          // });
        });
      }
    }, {
      key: "updateLoadingText",
      value: function updateLoadingText() {
        this.loadingText.visible = true;
        this.loadingText.text = '';
        if (this.maxTileWidthReached) return;
        if (!this.tilesetInfo) {
          this.loadingText.text = 'Fetching tileset info...';
          this.bc.postMessage({
            state: 'fetching_tileset_info',
            msg: this.loadingText.text,
            uid: this.id
          });
          return;
        }
        if (this.fetching.size) {
          this.loadingText.text = "Fetching... ".concat(PileupTrack_toConsumableArray(this.fetching).map(function (x) {
            return x.split('|')[0];
          }).join(' '));
          this.bc.postMessage({
            state: 'fetching',
            msg: this.loadingText.text,
            uid: this.id
          });
        }
        if (this.rendering.size) {
          this.loadingText.text = "Rendering... ".concat(PileupTrack_toConsumableArray(this.rendering).join(' '));
          this.bc.postMessage({
            state: 'rendering',
            msg: this.loadingText.text,
            uid: this.id
          });
        }
        if (!this.fetching.size && !this.rendering.size && this.tilesetInfo) {
          this.loadingText.visible = false;
          // this.bc.postMessage({state: 'update_end', msg: 'Completed',  uid: this.id});
        }
      }
    }, {
      key: "draw",
      value: function draw() {
        // const valueScale = HGC.libraries.d3Scale
        //   .scaleLinear()
        //   .domain([0, this.prevRows.length])
        //   .range([0, this.dimensions[1]]);
        // HGC.utils.trackUtils.drawAxis(this, valueScale);
        this.trackNotFoundText.text = 'Track not found';
        this.trackNotFoundText.visible = true;
      }
    }, {
      key: "indexDHSElementCategory",
      value: function indexDHSElementCategory(colormap, rgb) {
        return "<div style=\"display:inline-block; position:relative; top:-2px;\">\n        <svg width=\"10\" height=\"10\">\n          <rect width=\"10\" height=\"10\" rx=\"2\" ry=\"2\" style=\"fill:rgb(".concat(rgb, ");stroke:black;stroke-width:2;\" />\n        </svg>\n        <span style=\"position:relative; top:1px; font-weight:600;\">").concat(colormap[rgb], "</span>\n      </div>");
      }
    }, {
      key: "indexDHSElementCartoon",
      value: function indexDHSElementCartoon(elementStart, elementEnd, rgb, subs, summitStart, summitEnd, elementId) {
        var elementCartoon = '';
        var elementCartoonWidth = 200;
        var elementCartoonGeneHeight = 30;
        var elementCartoonHeight = elementCartoonGeneHeight + 10;
        var elementCartoonMiddle = elementCartoonHeight / 2;
        function pos2pixel(pos) {
          return (pos - elementStart) / ((elementEnd - elementStart) * 1.0) * elementCartoonWidth;
        }
        var blockCount = 0;
        var blockStarts = [];
        var blockSizes = [];
        var _iterator7 = PileupTrack_createForOfIteratorHelper(subs),
          _step7;
        try {
          for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
            var sub = _step7.value;
            if (sub.type === 'M') {
              blockCount++;
              blockStarts.push(sub.pos);
              blockSizes.push(sub.length);
            }
          }
        } catch (err) {
          _iterator7.e(err);
        } finally {
          _iterator7.f();
        }
        if (blockCount > 0) {
          elementCartoon += "<svg width=\"".concat(elementCartoonWidth, "\" height=\"").concat(elementCartoonHeight, "\">\n          <style type=\"text/css\">\n            .ticks {stroke:rgb(").concat(rgb, ");stroke-width:1px;fill:none;}\n            .gene {stroke:rgb(").concat(rgb, ");stroke-width:1px;fill:none;}\n            .translate { fill:rgb(").concat(rgb, ");fill-opacity:1;}\n            .exon { fill:rgb(").concat(rgb, ");fill-opacity:1;}\n            .score { fill:rgb(").concat(rgb, ");fill-opacity:1;font:bold 12px sans-serif;}\n            .id { fill:rgb(").concat(rgb, ");fill-opacity:1;font:bold 12px sans-serif;}\n          </style>\n          <defs>\n            <path id=\"ft\" class=\"ticks\" d=\"m -3 -3  l 3 3  l -3 3\" />\n            <path id=\"rt\" class=\"ticks\" d=\"m 3 -3  l -3 3  l 3 3\" />\n          </defs>\n        ");
          var isElementBarPlotLike = true;
          var ecStart = pos2pixel(elementStart);
          var ecEnd = pos2pixel(elementEnd);
          elementCartoon += "<line class=\"gene\" x1=".concat(ecStart, " x2=").concat(ecEnd, " y1=").concat(elementCartoonMiddle, " y2=").concat(elementCartoonMiddle, " />");
          var ecThickStart = pos2pixel(summitStart);
          var ecThickEnd = pos2pixel(summitEnd);
          var ecThickY = elementCartoonMiddle - elementCartoonGeneHeight / 4;
          var ecThickHeight = elementCartoonGeneHeight / 2;
          var ecThickWidth = ecThickEnd - ecThickStart;
          if (isElementBarPlotLike) {
            ecThickWidth = ecThickWidth !== 1 ? 1 : ecThickWidth;
          }
          var realIdTextAnchor = '';
          if (ecThickStart < 0.15 * elementCartoonWidth) {
            realIdTextAnchor = 'start';
          } else if (ecThickStart >= 0.15 * elementCartoonWidth && ecThickStart <= 0.85 * elementCartoonWidth) {
            realIdTextAnchor = 'middle';
          } else {
            realIdTextAnchor = 'end';
          }
          elementCartoon += "<rect class=\"translate\" x=".concat(ecThickStart, " y=").concat(ecThickY, " width=").concat(ecThickWidth, " height=").concat(ecThickHeight, " />");
          var ecLabelDy = '-0.25em';
          elementCartoon += "<text class=\"id\" text-anchor=\"".concat(realIdTextAnchor, "\" x=").concat(ecThickStart, " y=").concat(ecThickY, " dy=").concat(ecLabelDy, ">").concat(elementId, "</text>");
          var ecExonStart = 0;
          var ecExonWidth = 0;
          var ecExonY = elementCartoonMiddle - elementCartoonGeneHeight / 8;
          var ecExonHeight = elementCartoonGeneHeight / 4;
          for (var i = 0; i < blockCount; i++) {
            ecExonStart = pos2pixel(elementStart + +blockStarts[i]);
            ecExonWidth = pos2pixel(elementStart + +blockSizes[i]);
            elementCartoon += "<rect class=\"exon\" x=".concat(ecExonStart, " y=").concat(ecExonY, " width=").concat(ecExonWidth, " height=").concat(ecExonHeight, " />");
          }
          // add whiskers separately
          if (isElementBarPlotLike) {
            // leftmost whisker
            ecExonStart = ecStart;
            ecExonWidth = ecStart + 1;
            elementCartoon += "<rect class=\"exon\" x=".concat(ecExonStart, " y=").concat(ecExonY, " width=").concat(ecExonWidth, " height=").concat(ecExonHeight, " />");
            // rightmost whisker
            ecExonStart = ecEnd - 1;
            ecExonWidth = ecEnd;
            elementCartoon += "<rect class=\"exon\" x=".concat(ecExonStart, " y=").concat(ecExonY, " width=").concat(ecExonWidth, " height=").concat(ecExonHeight, " />");
          }
          elementCartoon += '</svg>';
        }
        return elementCartoon;
      }
    }, {
      key: "clearMouseOver",
      value: function clearMouseOver() {
        this.mouseOverGraphics.clear();
        requestAnimationFrame(this.animate);
      }
    }, {
      key: "getMouseOverHtml",
      value: function getMouseOverHtml(trackX, trackYIn) {
        if (this.maxTileWidthReached) return;

        // const trackY = this.valueScaleTransform.invert(track)
        this.mouseOverGraphics.clear();
        // Prevents 'stuck' read outlines when hovering quickly
        requestAnimationFrame(this.animate);
        var msg = {
          state: 'mouseover',
          msg: 'mouseover event',
          uid: this.id
        };
        this.monitor.postMessage(msg);
        var trackY = invY(trackYIn, this.valueScaleTransform);
        var bandCoverageStart = 0;
        var bandCoverageEnd = Number.MAX_SAFE_INTEGER;
        if (this.yScaleBands) {
          for (var _i3 = 0, _Object$keys = Object.keys(this.yScaleBands); _i3 < _Object$keys.length; _i3++) {
            var key = _Object$keys[_i3];
            var yScaleBand = this.yScaleBands[key];
            var _yScaleBand$range = yScaleBand.range(),
              _yScaleBand$range2 = _slicedToArray(_yScaleBand$range, 2),
              start = _yScaleBand$range2[0],
              end = _yScaleBand$range2[1];
            bandCoverageEnd = Math.min(start, bandCoverageEnd);
            if (start <= trackY && trackY <= end) {
              var eachBand = yScaleBand.step();
              var index = Math.floor((trackY - start) / eachBand);
              var rows = this.prevRows[key].rows;
              if (index >= 0 && index < rows.length) {
                var row = rows[index];
                var _iterator8 = PileupTrack_createForOfIteratorHelper(row),
                  _step8;
                try {
                  for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
                    var read = _step8.value;
                    var readTrackFrom = this._xScale(read.from);
                    var readTrackTo = this._xScale(read.to);
                    if (readTrackFrom <= trackX && trackX <= readTrackTo) {
                      var xPos = this._xScale(read.from);
                      var yPos = transformY(yScaleBand(index), this.valueScaleTransform);
                      var MAX_DIST = 10;
                      var nearestDistance = this._xScale.invert(MAX_DIST) - this._xScale.invert(0);
                      var mousePos = this._xScale.invert(trackX);
                      // find the nearest substitution (or indel)
                      var nearestSub = findNearestSub(mousePos, read, nearestDistance);
                      if (this.options.outlineReadOnHover) {
                        var width = this._xScale(read.to) - this._xScale(read.from);
                        var height = yScaleBand.bandwidth() * this.valueScaleTransform.k;
                        this.mouseOverGraphics.lineStyle({
                          width: 1,
                          color: 0
                        });
                        this.mouseOverGraphics.drawRect(xPos, yPos, width, height);
                        this.animate();
                      }
                      if (this.options.outlineMateOnHover) {
                        this.outlineMate(read, yScaleBand);
                      }
                      var insertSizeHtml = this.getInsertSizeMouseoverHtml(read);
                      var chimericReadHtml = read.mate_ids.length > 1 ? "<span style=\"color:red;\">Chimeric alignment</span><br>" : "";
                      var mappingOrientationHtml = "";
                      if (read.mappingOrientation) {
                        var style = "";
                        if (read.colorOverride) {
                          var color = Object.keys(PILEUP_COLORS)[read.colorOverride];
                          var htmlColor = this.colorArrayToString(PILEUP_COLORS[color]);
                          style = "style=\"color:".concat(htmlColor, ";\"");
                        }
                        mappingOrientationHtml = "<span ".concat(style, "> Mapping orientation: ").concat(read.mappingOrientation, "</span><br>");
                      }

                      // let mouseOverHtml =
                      //   `Name: ${read.readName}<br>` +
                      //   `Position: ${read.chrName}:${
                      //     read.from - read.chrOffset
                      //   }<br>` +
                      //   `Read length: ${read.to - read.from}<br>` +
                      //   `MAPQ: ${read.mapq}<br>` +
                      //   `Strand: ${read.strand}<br>` +
                      //   insertSizeHtml +
                      //   chimericReadHtml +
                      //   mappingOrientationHtml;

                      // if (nearestSub && nearestSub.type) {
                      //   mouseOverHtml += `Nearest operation: ${cigarTypeToText(
                      //     nearestSub.type,
                      //   )} (${nearestSub.length})`;
                      // } else if (nearestSub && nearestSub.variant) {
                      //   mouseOverHtml += `Nearest operation: ${nearestSub.base} &rarr; ${nearestSub.variant}`;
                      // }

                      var dataX = this._xScale.invert(trackX);
                      var positionText = null;
                      var eventText = null;
                      var eventProbability = null;
                      if (this.options.chromInfo) {
                        var atcX = HGC.utils.absToChr(dataX, this.options.chromInfo);
                        var chrom = atcX[0];
                        var position = Math.ceil(atcX[1]);
                        positionText = "".concat(chrom, ":").concat(position);
                        var methylationOffset = position - (read.from - read.chrOffset);
                        var _iterator9 = PileupTrack_createForOfIteratorHelper(read.methylationOffsets),
                          _step9;
                        try {
                          for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
                            var mo = _step9.value;
                            var moQuery = mo.offsets.indexOf(methylationOffset);
                            if (moQuery !== -1) {
                              // console.log(`mo @ ${methylationOffset} ${moQuery} | ${mo.unmodifiedBase} ${mo.strand} ${mo.probabilities[moQuery]}`);
                              eventText = mo.unmodifiedBase === 'A' || mo.unmodifiedBase === 'T' ? 'm6A' : '5mC';
                              eventProbability = parseInt(mo.probabilities[moQuery]);
                              if (eventProbability < this.options.methylation.probabilityThresholdRange[0]) {
                                eventProbability = null;
                              }
                              break;
                            }
                          }
                        } catch (err) {
                          _iterator9.e(err);
                        } finally {
                          _iterator9.f();
                        }
                      }
                      var output = "<div class=\"track-mouseover-menu-table\">";
                      if (positionText) {
                        output += "\n                    <div class=\"track-mouseover-menu-table-item\">\n                      <label for=\"position\" class=\"track-mouseover-menu-table-item-label\">Position</label>\n                      <div name=\"position\" class=\"track-mouseover-menu-table-item-value\">".concat(positionText, "</div>\n                    </div>\n                    ");
                      }
                      if (eventText && eventProbability) {
                        output += "\n                    <div class=\"track-mouseover-menu-table-item\">\n                      <label for=\"eventType\" class=\"track-mouseover-menu-table-item-label\">Event</label>\n                      <div name=\"eventType\" class=\"track-mouseover-menu-table-item-value\">".concat(eventText, "</div>\n                    </div>\n                    <div class=\"track-mouseover-menu-table-item\">\n                      <label for=\"eventProbability\" class=\"track-mouseover-menu-table-item-label\">Probability (ML)</label>\n                      <div name=\"eventProbability\" class=\"track-mouseover-menu-table-item-value\">").concat(eventProbability, "</div>\n                    </div>\n                    ");
                      }

                      // let cellLineText = null;
                      // if (this.options.methylation && this.options.methylation.group && this.options.methylation.set) {
                      //   groupText = `${this.options.methylation.group}/${this.options.methylation.set}`;
                      //   if (this.options.methylation.haplotype) {
                      //     groupText += ` (${this.options.methylation.haplotype})`;
                      //   }
                      // }

                      // let cellLineText = null;
                      // if (this.options.methylation && this.options.methylation.group) {
                      //   cellLineText = `${this.options.methylation.group}`;
                      // }

                      // if (cellLineText) {
                      //   output += `
                      //   <div class="track-mouseover-menu-table-item">
                      //     <label for="cell_line" class="track-mouseover-menu-table-item-label">Cell line</label>
                      //     <div name="cell_line" class="track-mouseover-menu-table-item-value">${cellLineText}</div>
                      //   </div>
                      //   `;
                      // }

                      // let conditionText = null;
                      // if (this.options.methylation && this.options.methylation.set) {
                      //   conditionText = `${this.options.methylation.set}`;
                      // }

                      // if (conditionText) {
                      //   output += `
                      //   <div class="track-mouseover-menu-table-item">
                      //     <label for="condition" class="track-mouseover-menu-table-item-label">Condition</label>
                      //     <div name="condition" class="track-mouseover-menu-table-item-value">${conditionText}</div>
                      //   </div>
                      //   `;
                      // }

                      // let donorText = null;
                      // if (this.options.methylation && this.options.methylation.donor) {
                      //   donorText = `${this.options.methylation.donor}`;
                      // }

                      // if (donorText) {
                      //   output += `
                      //   <div class="track-mouseover-menu-table-item">
                      //     <label for="donor" class="track-mouseover-menu-table-item-label">Donor</label>
                      //     <div name="donor" class="track-mouseover-menu-table-item-value">${donorText}</div>
                      //   </div>
                      //   `;
                      // }

                      // let haplotypeText = null;
                      // if (this.options.methylation && this.options.methylation.haplotype) {
                      //   haplotypeText = `${this.options.methylation.haplotype}`;
                      // }

                      // if (haplotypeText) {
                      //   output += `
                      //   <div class="track-mouseover-menu-table-item">
                      //     <label for="haplotype" class="track-mouseover-menu-table-item-label">Haplotype</label>
                      //     <div name="haplotype" class="track-mouseover-menu-table-item-value">${haplotypeText}</div>
                      //   </div>
                      //   `;
                      // }

                      if (this.options.indexDHS) {
                        var readNameLabel = 'Index DHS';
                        var readNameValue = "".concat(read.readName, " | ").concat(this.options.name);
                        output += "<div class=\"track-mouseover-menu-table-item\">\n                      <label for=\"readName\" class=\"track-mouseover-menu-table-item-label\">".concat(readNameLabel, "</label>\n                      <div name=\"readName\" class=\"track-mouseover-menu-table-item-value\">").concat(readNameValue, "</div>\n                    </div>");
                      } else {
                        var _readNameLabel = 'Name';
                        var _readNameValue = read.readName;
                        output += "<div class=\"track-mouseover-menu-table-item\">\n                      <label for=\"readName\" class=\"track-mouseover-menu-table-item-label\">".concat(_readNameLabel, "</label>\n                      <div name=\"readName\" class=\"track-mouseover-menu-table-item-value\">").concat(_readNameValue, "</div>\n                    </div>");
                      }
                      var readIntervalLabel = this.options.methylation ? 'Interval' : this.options.indexDHS ? 'Range' : 'Interval';
                      var readIntervalValue = "".concat(read.chrName, ":").concat(read.from - read.chrOffset, "-").concat(read.to - read.chrOffset - 1);
                      readIntervalValue += this.options.methylation ? " (".concat(read.strand, ")") : '';
                      output += "<div class=\"track-mouseover-menu-table-item\">\n                    <label for=\"readInterval\" class=\"track-mouseover-menu-table-item-label\">".concat(readIntervalLabel, "</label>\n                    <div name=\"readInterval\" class=\"track-mouseover-menu-table-item-value\">").concat(readIntervalValue, "</div>\n                  </div>");
                      if (this.options.methylation) {
                        var readLength = "".concat(read.to - read.from);
                        output += "<div class=\"track-mouseover-menu-table-item\">\n                      <label for=\"readLength\" class=\"track-mouseover-menu-table-item-label\">Length</label>\n                      <div name=\"readLength\" class=\"track-mouseover-menu-table-item-value\">".concat(readLength, "</div>\n                    </div>");
                      }
                      if (this.options.indexDHS) {
                        var metadata = read.metadata;
                        // const realId = metadata.dhs.id;
                        var elementSummit = "".concat(read.chrName, ":").concat(parseInt(metadata.summit.start + (metadata.summit.end - metadata.summit.start) / 2));
                        var elementScorePrecision = 4;
                        var elementScore = Number.parseFloat(metadata.dhs.score).toPrecision(elementScorePrecision);
                        var elementBiosampleCount = Number.parseInt(metadata.dhs.n);
                        output += "<div class=\"track-mouseover-menu-table-item\">\n                      <label for=\"readSummit\" class=\"track-mouseover-menu-table-item-label\">Summit</label>\n                      <div name=\"readSummit\" class=\"track-mouseover-menu-table-item-value\">".concat(elementSummit, "</div>\n                    </div>");
                        output += "<div class=\"track-mouseover-menu-table-item\">\n                      <label for=\"readScore\" class=\"track-mouseover-menu-table-item-label\">Score</label>\n                      <div name=\"readScore\" class=\"track-mouseover-menu-table-item-value\">".concat(elementScore, "</div>\n                    </div>");
                        output += "<div class=\"track-mouseover-menu-table-item\">\n                      <label for=\"readCategory\" class=\"track-mouseover-menu-table-item-label\">Category</label>\n                      <div name=\"readCategory\" class=\"track-mouseover-menu-table-item-value\">".concat(this.indexDHSElementCategory(this.options.indexDHS.itemRGBMap, metadata.rgb), "</div>\n                    </div>");
                        var indexDHSStart = read.from - read.chrOffset;
                        var indexDHSEnd = read.to - read.chrOffset - 1;
                        output += "<div class=\"track-mouseover-menu-table-item\">\n                      <label for=\"readStructure\" class=\"track-mouseover-menu-table-item-label\">Structure</label>\n                      <div name=\"readStructure\" class=\"track-mouseover-menu-table-item-value track-mouseover-menu-table-item-value-svg\">".concat(this.indexDHSElementCartoon(indexDHSStart, indexDHSEnd, metadata.rgb, read.substitutions, metadata.summit.start, metadata.summit.end, metadata.dhs.id), "</div>\n                    </div>");
                        output += "<div class=\"track-mouseover-menu-table-item\">\n                      <label for=\"readSamples\" class=\"track-mouseover-menu-table-item-label\">Samples</label>\n                      <div name=\"readSamples\" class=\"track-mouseover-menu-table-item-value\">Found in <span style=\"font-weight: 900; padding-left:5px; padding-right:5px;\">".concat(elementBiosampleCount, "</span> / ").concat(this.options.indexDHS.biosampleCount, " biosamples</div>\n                    </div>");
                      }

                      // if (nearestSub && nearestSub.type) {
                      //   const readNearestOp = `${nearestSub.length}${cigarTypeToText(nearestSub.type)}`;
                      //   output += `<div class="track-mouseover-menu-table-item">
                      //     <label for="readNearestOp" class="track-mouseover-menu-table-item-label">Nearest op</label>
                      //     <div name="readNearestOp" class="track-mouseover-menu-table-item-value">${readNearestOp}</div>
                      //   </div>`;
                      // }
                      // else if (nearestSub && nearestSub.variant) {
                      //   const readNearestOp = `${nearestSub.length} (${nearestSub.variant})`;
                      //   output += `<div class="track-mouseover-menu-table-item">
                      //     <label for="readNearestOp" class="track-mouseover-menu-table-item-label">Nearest op</label>
                      //     <div name="readNearestOp" class="track-mouseover-menu-table-item-value">${readNearestOp}</div>
                      //   </div>`;
                      // }

                      output += "</div>";
                      return output;
                      // + `CIGAR: ${read.cigar || ''} MD: ${read.md || ''}`);
                    }
                  }
                } catch (err) {
                  _iterator8.e(err);
                } finally {
                  _iterator8.f();
                }
              }
            }
          }

          // var val = self.yScale.domain()[index];
          if (this.options.showCoverage && bandCoverageStart <= trackY && trackY <= bandCoverageEnd) {
            var _mousePos = this._xScale.invert(trackX);
            var bpIndex = Math.floor(_mousePos);
            bpIndex = bpIndex - bpIndex % this.coverageSamplingDistance;
            if (this.coverage[bpIndex]) {
              var readCount = this.coverage[bpIndex];
              var matchPercent = readCount.matches / readCount.reads * 100;
              var range = readCount.range.includes('-') ? "Range: ".concat(readCount.range, "<br>") : "Position: ".concat(readCount.range, "<br>");
              var mouseOverHtml = "Reads: ".concat(readCount.reads, "<br>") + "Matches: ".concat(readCount.matches, " (").concat(matchPercent.toFixed(2), "%)<br>") + range;
              for (var _i4 = 0, _Object$keys2 = Object.keys(readCount.variants); _i4 < _Object$keys2.length; _i4++) {
                var variant = _Object$keys2[_i4];
                if (readCount.variants[variant] > 0) {
                  var variantPercent = readCount.variants[variant] / readCount.reads * 100;
                  mouseOverHtml += "".concat(variant, ": ").concat(readCount.variants[variant], " (").concat(variantPercent.toFixed(2), "%)<br>");
                }
              }
              return mouseOverHtml;
            }
          }
        }
        return '';
      }
    }, {
      key: "getInsertSizeMouseoverHtml",
      value: function getInsertSizeMouseoverHtml(read) {
        var insertSizeHtml = "";
        if (this.options.highlightReadsBy.includes('insertSize') || this.options.highlightReadsBy.includes('insertSizeAndPairOrientation')) {
          if (read.mate_ids.length === 1 && read.mate_ids[0] && read.mate_ids[0] in this.readsById) {
            var mate = this.readsById[read.mate_ids[0]];
            var insertSize = calculateInsertSize(read, mate);
            var style = "";
            if ('largeInsertSizeThreshold' in this.options && insertSize > this.options.largeInsertSizeThreshold || 'smallInsertSizeThreshold' in this.options && insertSize < this.options.smallInsertSizeThreshold) {
              var color = Object.keys(PILEUP_COLORS)[read.colorOverride || read.color];
              var htmlColor = this.colorArrayToString(PILEUP_COLORS[color]);
              style = "style=\"color:".concat(htmlColor, ";\"");
            }
            insertSizeHtml = "Insert size: <span ".concat(style, ">").concat(insertSize, "</span><br>");
          }
        }
        return insertSizeHtml;
      }
    }, {
      key: "outlineMate",
      value: function outlineMate(read, yScaleBand) {
        var _iterator10 = PileupTrack_createForOfIteratorHelper(read.mate_ids),
          _step10;
        try {
          for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
            var mate_id = _step10.value;
            if (!this.readsById[mate_id]) {
              return;
            }
            var mate = this.readsById[mate_id];
            // We assume the mate height is the same, but width might be different
            var mate_width = this._xScale(mate.to) - this._xScale(mate.from);
            var mate_height = yScaleBand.bandwidth() * this.valueScaleTransform.k;
            var mate_xPos = this._xScale(mate.from);
            var mate_yPos = transformY(this.yScaleBands[mate.groupKey](mate.row), this.valueScaleTransform);
            this.mouseOverGraphics.lineStyle({
              width: 1,
              color: 0
            });
            this.mouseOverGraphics.drawRect(mate_xPos, mate_yPos, mate_width, mate_height);
          }
          // read.mate_ids.forEach((mate_id) => {
          //   if (!this.readsById[mate_id]) {
          //     return;
          //   }
          //   const mate = this.readsById[mate_id];
          //   // We assume the mate height is the same, but width might be different
          //   const mate_width =
          //     this._xScale(mate.to) - this._xScale(mate.from);
          //   const mate_height =
          //     yScaleBand.bandwidth() * this.valueScaleTransform.k;
          //   const mate_xPos = this._xScale(mate.from);
          //   const mate_yPos = transformY(
          //     this.yScaleBands[mate.groupKey](mate.row),
          //     this.valueScaleTransform,
          //   );
          //   this.mouseOverGraphics.lineStyle({
          //     width: 1,
          //     color: 0,
          //   });
          //   this.mouseOverGraphics.drawRect(
          //     mate_xPos,
          //     mate_yPos,
          //     mate_width,
          //     mate_height,
          //   );
          // });
        } catch (err) {
          _iterator10.e(err);
        } finally {
          _iterator10.f();
        }
        this.animate();
      }
    }, {
      key: "calculateZoomLevel",
      value: function calculateZoomLevel() {
        return HGC.utils.trackUtils.calculate1DZoomLevel(this.tilesetInfo, this._xScale, this.maxZoom);
      }
    }, {
      key: "calculateVisibleTiles",
      value: function calculateVisibleTiles() {
        var tiles = HGC.utils.trackUtils.calculate1DVisibleTiles(this.tilesetInfo, this._xScale);
        var _iterator11 = PileupTrack_createForOfIteratorHelper(tiles),
          _step11;
        try {
          for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
            var tile = _step11.value;
            var _getTilePosAndDimensi = getTilePosAndDimensions(tile[0], [tile[1]], this.tilesetInfo.tile_size, this.tilesetInfo),
              tileX = _getTilePosAndDimensi.tileX,
              tileWidth = _getTilePosAndDimensi.tileWidth;
            var DEFAULT_MAX_TILE_WIDTH = 2e5;
            if (tileWidth > (this.tilesetInfo.max_tile_width || this.dataFetcher.dataConfig.options && this.dataFetcher.dataConfig.options.maxTileWidth || this.options.maxTileWidth || DEFAULT_MAX_TILE_WIDTH)) {
              if (this.options.collapseWhenMaxTileWidthReached) {
                this.pubSub.publish('trackDimensionsModified', {
                  height: 20,
                  resizeParentDiv: true,
                  trackId: this.trackId,
                  viewId: this.viewId
                });
              }
              this.errorTextText = this.dataFetcher.dataConfig.options && this.dataFetcher.dataConfig.options.maxTileWidthReachedMessage ? this.dataFetcher.dataConfig.options.maxTileWidthReachedMessage : "Zoom in to load data";
              this.drawError();
              this.animate();
              this.maxTileWidthReached = true;
              var msg = {
                state: 'update_end',
                msg: 'Completed (calculateVisibleTiles)',
                uid: this.id
              };
              // console.log(`${JSON.stringify(msg)}`);
              this.bc.postMessage(msg);
              return;
            } else {
              this.maxTileWidthReached = false;
              if (this.options.collapseWhenMaxTileWidthReached) {
                this.pubSub.publish('trackDimensionsModified', {
                  height: this.originalHeight,
                  resizeParentDiv: true,
                  trackId: this.trackId,
                  viewId: this.viewId
                });
              }
            }
            this.errorTextText = null;
            this.pBorder.clear();
            this.drawError();
            this.animate();
          }
          // const { tileX, tileWidth } = getTilePosAndDimensions(
          //   this.calculateZoomLevel(),
          // )
        } catch (err) {
          _iterator11.e(err);
        } finally {
          _iterator11.f();
        }
        this.setVisibleTiles(tiles);
      }
    }, {
      key: "setPosition",
      value: function setPosition(newPosition) {
        _get(_getPrototypeOf(PileupTrackClass.prototype), "setPosition", this).call(this, newPosition);
        var _this$position = _slicedToArray(this.position, 2);
        this.pMain.position.x = _this$position[0];
        this.pMain.position.y = _this$position[1];
        var _this$position2 = _slicedToArray(this.position, 2);
        this.pMouseOver.position.x = _this$position2[0];
        this.pMouseOver.position.y = _this$position2[1];
        var _newPosition = _slicedToArray(newPosition, 2);
        this.loadingText.x = _newPosition[0];
        this.loadingText.y = _newPosition[1];
      }
    }, {
      key: "movedY",
      value: function movedY(dY) {
        var vst = this.valueScaleTransform;
        var height = this.dimensions[1];

        // clamp at the bottom and top
        if (vst.y + dY / vst.k > -(vst.k - 1) * height && vst.y + dY / vst.k < 0) {
          this.valueScaleTransform = vst.translate(0, dY / vst.k);
        }

        // this.segmentGraphics may not have been initialized if the user
        // was zoomed out too far
        if (this.segmentGraphics) {
          this.segmentGraphics.position.y = this.valueScaleTransform.y;
        }
        this.animate();
      }
    }, {
      key: "zoomedY",
      value: function zoomedY(yPos, kMultiplier) {
        var newTransform = HGC.utils.trackUtils.zoomedY(yPos, kMultiplier, this.valueScaleTransform, this.dimensions[1]);
        this.valueScaleTransform = newTransform;
        this.segmentGraphics.scale.y = newTransform.k;
        this.segmentGraphics.position.y = newTransform.y;
        this.mouseOverGraphics.clear();
        this.animate();
      }
    }, {
      key: "zoomed",
      value: function zoomed(newXScale, newYScale) {
        _get(_getPrototypeOf(PileupTrackClass.prototype), "zoomed", this).call(this, newXScale, newYScale);
        if (this.segmentGraphics) {
          scaleScalableGraphics(this.segmentGraphics, newXScale, this.drawnAtScale);
        }
        this.mouseOverGraphics.clear();
        this.animate();
      }
    }, {
      key: "exportSVG",
      value: function exportSVG() {
        var track = null;
        var base = null;
        this.clearMouseOver();
        if (_get(_getPrototypeOf(PileupTrackClass.prototype), "exportSVG", this)) {
          var _get$call = _get(_getPrototypeOf(PileupTrackClass.prototype), "exportSVG", this).call(this);
          var _get$call2 = _slicedToArray(_get$call, 2);
          base = _get$call2[0];
          track = _get$call2[1];
        } else {
          base = document.createElement('g');
          track = base;
        }
        this.mouseOverGraphics.clear();
        this.animate();

        // base = document.createElement('g');
        // track = base;

        var output = document.createElement('g');
        track.appendChild(output);
        output.setAttribute('transform', "translate(".concat(this.pMain.position.x, ",").concat(this.pMain.position.y, ") scale(").concat(this.pMain.scale.x, ",").concat(this.pMain.scale.y, ")"));
        var gSegment = document.createElement('g');
        output.appendChild(gSegment);
        if (this.segmentGraphics) {
          var b64string = HGC.services.pixiRenderer.plugins.extract.base64(
          // this.segmentGraphics, 'image/png', 1,
          this.pMain.parent.parent);

          // const xPositions = this.positions.filter((x,i) => i%2 == 0);
          // let minX = Number.MAX_SAFE_INTEGER;

          // for (let i = 0; i < xPositions.length; i++) {
          //   if (xPositions[i] < minX) {
          //     minX = xPositions[i];
          //   }
          // }
          var gImage = document.createElement('g');
          gImage.setAttribute('transform', "translate(0,0)");
          var image = document.createElement('image');
          image.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', b64string);
          gImage.appendChild(image);
          gSegment.appendChild(gImage);

          // gSegment.appendChild(image);
        }
        // if (this.positions) {
        //   // short for colorIndex
        //   let ci = 0;

        //   for (let i = 0; i < this.positions.length; i += 12) {
        //     const rect = document.createElement('rect');

        //     rect.setAttribute('x', this.positions[i]);
        //     rect.setAttribute('y', this.positions[i + 1]);

        //     rect.setAttribute(
        //       'width',
        //       this.positions[i + 10] - this.positions[i]
        //     );

        //     rect.setAttribute(
        //       'height',
        //       this.positions[i + 11] - this.positions[i + 1]
        //     );

        //     const red = Math.ceil(255 * this.colors[ci]);
        //     const green = Math.ceil(255 * this.colors[ci + 1]);
        //     const blue = Math.ceil(255 * this.colors[ci + 2]);
        //     const alpha = this.colors[ci + 3];

        //     rect.setAttribute('fill', `rgba(${red},${green},${blue},${alpha})`);
        //     gSegment.appendChild(rect);
        //     ci += 24;
        //   }
        // }

        return [base, base];
      }
    }]);
    return PileupTrackClass;
  }(HGC.tracks.Tiled1DPixiTrack);
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }
  return _construct(PileupTrackClass, args);
};
var icon = '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="1.5"><path d="M4 2.1L.5 3.5v12l5-2 5 2 5-2v-12l-5 2-3.17-1.268" fill="none" stroke="currentColor"/><path d="M10.5 3.5v12" fill="none" stroke="currentColor" stroke-opacity=".33" stroke-dasharray="1,2,0,0"/><path d="M5.5 13.5V6" fill="none" stroke="currentColor" stroke-opacity=".33" stroke-width=".9969299999999999" stroke-dasharray="1.71,3.43,0,0"/><path d="M9.03 5l.053.003.054.006.054.008.054.012.052.015.052.017.05.02.05.024 4 2 .048.026.048.03.046.03.044.034.042.037.04.04.037.04.036.042.032.045.03.047.028.048.025.05.022.05.02.053.016.053.014.055.01.055.007.055.005.055v.056l-.002.056-.005.055-.008.055-.01.055-.015.054-.017.054-.02.052-.023.05-.026.05-.028.048-.03.046-.035.044-.035.043-.038.04-4 4-.04.037-.04.036-.044.032-.045.03-.046.03-.048.024-.05.023-.05.02-.052.016-.052.015-.053.012-.054.01-.054.005-.055.003H8.97l-.053-.003-.054-.006-.054-.008-.054-.012-.052-.015-.052-.017-.05-.02-.05-.024-4-2-.048-.026-.048-.03-.046-.03-.044-.034-.042-.037-.04-.04-.037-.04-.036-.042-.032-.045-.03-.047-.028-.048-.025-.05-.022-.05-.02-.053-.016-.053-.014-.055-.01-.055-.007-.055L4 10.05v-.056l.002-.056.005-.055.008-.055.01-.055.015-.054.017-.054.02-.052.023-.05.026-.05.028-.048.03-.046.035-.044.035-.043.038-.04 4-4 .04-.037.04-.036.044-.032.045-.03.046-.03.048-.024.05-.023.05-.02.052-.016.052-.015.053-.012.054-.01.054-.005L8.976 5h.054zM5 10l4 2 4-4-4-2-4 4z" fill="currentColor"/><path d="M7.124 0C7.884 0 8.5.616 8.5 1.376v3.748c0 .76-.616 1.376-1.376 1.376H3.876c-.76 0-1.376-.616-1.376-1.376V1.376C2.5.616 3.116 0 3.876 0h3.248zm.56 5.295L5.965 1H5.05L3.375 5.295h.92l.354-.976h1.716l.375.975h.945zm-1.596-1.7l-.592-1.593-.58 1.594h1.172z" fill="currentColor"/></svg>';
PileupTrack.config = {
  type: 'pileup',
  datatype: ['reads'],
  orientation: '1d-horizontal',
  name: 'Pileup Track',
  thumbnail: new DOMParser().parseFromString(icon, 'text/xml').documentElement,
  availableOptions: ['axisPositionHorizontal', 'axisLabelFormatting', 'colorScale', 'groupBy', 'labelPosition', 'labelLeftMargin', 'labelRightMargin', 'labelTopMargin', 'labelBottomMargin', 'labelColor', 'labelTextOpacity', 'labelBackgroundOpacity', 'outlineReadOnHover', 'outlineMateOnHover', 'showMousePosition', 'workerScriptLocation', 'plusStrandColor', 'minusStrandColor', 'showCoverage', 'coverageHeight', 'maxTileWidth', 'collapseWhenMaxTileWidthReached', 'minMappingQuality', 'highlightReadsBy', 'smallInsertSizeThreshold', 'largeInsertSizeThreshold',
  // 'minZoom',
  'showLoadingText'],
  defaultOptions: {
    // minZoom: null,
    axisPositionHorizontal: 'right',
    axisLabelFormatting: 'normal',
    colorScale: [
    // A T G C N other
    '#08519c', '#6baed6', '#993404', '#fe9929', '#808080', '#DCDCDC'],
    outlineReadOnHover: false,
    outlineMateOnHover: false,
    showMousePosition: false,
    showCoverage: false,
    coverageHeight: 10,
    // unit: number of rows
    maxTileWidth: 2e5,
    collapseWhenMaxTileWidthReached: false,
    minMappingQuality: 0,
    highlightReadsBy: [],
    largeInsertSizeThreshold: 1000,
    showLoadingText: false
  },
  optionsInfo: {
    outlineReadOnHover: {
      name: 'Outline read on hover',
      inlineOptions: {
        yes: {
          value: true,
          name: 'Yes'
        },
        no: {
          value: false,
          name: 'No'
        }
      }
    },
    outlineMateOnHover: {
      name: 'Outline read mate on hover',
      inlineOptions: {
        yes: {
          value: true,
          name: 'Yes'
        },
        no: {
          value: false,
          name: 'No'
        }
      }
    },
    highlightReadsBy: {
      name: 'Highlight reads by',
      inlineOptions: {
        none: {
          value: [],
          name: 'None'
        },
        insertSize: {
          value: ["insertSize"],
          name: 'Insert size'
        },
        pairOrientation: {
          value: ["pairOrientation"],
          name: 'Pair orientation'
        },
        insertSizeAndPairOrientation: {
          value: ["insertSizeAndPairOrientation"],
          name: 'Insert size and pair orientation'
        },
        insertSizeOrPairOrientation: {
          value: ["insertSize", "pairOrientation"],
          name: 'Insert size or pair orientation'
        }
      }
    },
    minMappingQuality: {
      name: 'Minimal read mapping quality',
      inlineOptions: {
        zero: {
          value: 0,
          name: '0'
        },
        one: {
          value: 1,
          name: '1'
        },
        five: {
          value: 5,
          name: '5'
        },
        ten: {
          value: 10,
          name: '10'
        },
        twentyfive: {
          value: 25,
          name: '25'
        },
        fifty: {
          value: 50,
          name: '50'
        }
      }
    },
    showCoverage: {
      name: 'Show coverage',
      inlineOptions: {
        yes: {
          value: true,
          name: 'Yes'
        },
        no: {
          value: false,
          name: 'No'
        }
      }
    },
    groupBy: {
      name: 'Group by',
      inlineOptions: {
        strand: {
          value: 'strand',
          name: 'Strand'
        },
        hpTag: {
          value: 'tags.HP',
          name: 'HP tag'
        },
        nothing: {
          value: null,
          name: 'Nothing'
        }
      }
    },
    colorScale: {
      name: 'Color scheme',
      inlineOptions: {
        drums: {
          value: [
          // A T G C N other
          '#007FFF', '#e8e500', '#008000', '#FF0038', '#800080', '#DCDCDC'],
          name: 'DRuMS'
        },
        logos: {
          value: [
          // A T G C N other
          '#22ca03', '#c40003', '#f6af08', '#0000c7', '#808080', '#DCDCDC'],
          name: 'Logos / IGV'
        },
        bluesGreens: {
          value: [
          // A T G C N other
          '#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#808080', '#DCDCDC'],
          name: 'Blues / Greens  (CB friendly)'
        },
        bluesBeiges: {
          value: ['#08519c', '#6baed6', '#993404', '#fe9929', '#808080', '#DCDCDC'],
          name: 'Blues / Beiges (CB friendly, default)'
        }
      }
    }
  }
};
/* harmony default export */ const src_PileupTrack = (PileupTrack);
;// CONCATENATED MODULE: ./src/index.js


src({
  name: 'PileupTrack',
  track: src_PileupTrack,
  config: src_PileupTrack.config
});
/* harmony default export */ const src_0 = (src_PileupTrack);
})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});