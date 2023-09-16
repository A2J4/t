var $jscomp = $jscomp || {}; $jscomp.scope = {}; $jscomp.arrayIteratorImpl = function (c) { var Oa = 0; return function () { return Oa < c.length ? { done: !1, value: c[Oa++] } : { done: !0 } } }; $jscomp.arrayIterator = function (c) { return { next: $jscomp.arrayIteratorImpl(c) } }; $jscomp.makeIterator = function (c) { var Oa = "undefined" != typeof Symbol && Symbol.iterator && c[Symbol.iterator]; return Oa ? Oa.call(c) : $jscomp.arrayIterator(c) }; $jscomp.ASSUME_ES5 = !1; $jscomp.ASSUME_NO_NATIVE_MAP = !1; $jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function (c, Oa, z) { c != Array.prototype && c != Object.prototype && (c[Oa] = z.value) }; $jscomp.getGlobal = function (c) { return "undefined" != typeof window && window === c ? c : "undefined" != typeof global && null != global ? global : c }; $jscomp.global = $jscomp.getGlobal(this);
$jscomp.polyfill = function (c, Oa, z, r) { if (Oa) { z = $jscomp.global; c = c.split("."); for (r = 0; r < c.length - 1; r++) { var b = c[r]; b in z || (z[b] = {}); z = z[b] } c = c[c.length - 1]; r = z[c]; Oa = Oa(r); Oa != r && null != Oa && $jscomp.defineProperty(z, c, { configurable: !0, writable: !0, value: Oa }) } }; $jscomp.polyfill("Array.prototype.fill", function (c) { return c ? c : function (c, z, r) { var b = this.length || 0; 0 > z && (z = Math.max(0, b + z)); if (null == r || r > b) r = b; r = Number(r); 0 > r && (r = Math.max(0, b + r)); for (z = Number(z || 0); z < r; z++)this[z] = c; return this } }, "es6", "es3");
$jscomp.FORCE_POLYFILL_PROMISE = !1;
$jscomp.polyfill("Promise", function (c) {
    function Oa() { this.batch_ = null } function z(a) { return a instanceof b ? a : new b(function (b, f) { b(a) }) } if (c && !$jscomp.FORCE_POLYFILL_PROMISE) return c; Oa.prototype.asyncExecute = function (a) { null == this.batch_ && (this.batch_ = [], this.asyncExecuteBatch_()); this.batch_.push(a); return this }; Oa.prototype.asyncExecuteBatch_ = function () { var a = this; this.asyncExecuteFunction(function () { a.executeBatch_() }) }; var r = $jscomp.global.setTimeout; Oa.prototype.asyncExecuteFunction = function (a) {
        r(a,
            0)
    }; Oa.prototype.executeBatch_ = function () { for (; this.batch_ && this.batch_.length;) { var a = this.batch_; this.batch_ = []; for (var b = 0; b < a.length; ++b) { var f = a[b]; a[b] = null; try { f() } catch (bb) { this.asyncThrow_(bb) } } } this.batch_ = null }; Oa.prototype.asyncThrow_ = function (a) { this.asyncExecuteFunction(function () { throw a; }) }; var b = function (a) { this.state_ = 0; this.result_ = void 0; this.onSettledCallbacks_ = []; var b = this.createResolveAndReject_(); try { a(b.resolve, b.reject) } catch (f) { b.reject(f) } }; b.prototype.createResolveAndReject_ =
        function () { function a(a) { return function (h) { f || (f = !0, a.call(b, h)) } } var b = this, f = !1; return { resolve: a(this.resolveTo_), reject: a(this.reject_) } }; b.prototype.resolveTo_ = function (a) { if (a === this) this.reject_(new TypeError("A Promise cannot resolve to itself")); else if (a instanceof b) this.settleSameAsPromise_(a); else { a: switch (typeof a) { case "object": var e = null != a; break a; case "function": e = !0; break a; default: e = !1 }e ? this.resolveToNonPromiseObj_(a) : this.fulfill_(a) } }; b.prototype.resolveToNonPromiseObj_ = function (a) {
            var b =
                void 0; try { b = a.then } catch (f) { this.reject_(f); return } "function" == typeof b ? this.settleSameAsThenable_(b, a) : this.fulfill_(a)
        }; b.prototype.reject_ = function (a) { this.settle_(2, a) }; b.prototype.fulfill_ = function (a) { this.settle_(1, a) }; b.prototype.settle_ = function (a, b) { if (0 != this.state_) throw Error("Cannot settle(" + a + ", " + b + "): Promise already settled in state" + this.state_); this.state_ = a; this.result_ = b; this.executeOnSettledCallbacks_() }; b.prototype.executeOnSettledCallbacks_ = function () {
            if (null != this.onSettledCallbacks_) {
                for (var a =
                    0; a < this.onSettledCallbacks_.length; ++a)e.asyncExecute(this.onSettledCallbacks_[a]); this.onSettledCallbacks_ = null
            }
        }; var e = new Oa; b.prototype.settleSameAsPromise_ = function (a) { var b = this.createResolveAndReject_(); a.callWhenSettled_(b.resolve, b.reject) }; b.prototype.settleSameAsThenable_ = function (a, b) { var f = this.createResolveAndReject_(); try { a.call(b, f.resolve, f.reject) } catch (bb) { f.reject(bb) } }; b.prototype.then = function (a, e) {
            function f(a, b) {
                return "function" == typeof a ? function (b) { try { Pa(a(b)) } catch (Ua) { h(Ua) } } :
                    b
            } var Pa, h, Na = new b(function (a, b) { Pa = a; h = b }); this.callWhenSettled_(f(a, Pa), f(e, h)); return Na
        }; b.prototype["catch"] = function (a) { return this.then(void 0, a) }; b.prototype.callWhenSettled_ = function (a, b) { function f() { switch (Pa.state_) { case 1: a(Pa.result_); break; case 2: b(Pa.result_); break; default: throw Error("Unexpected state: " + Pa.state_); } } var Pa = this; null == this.onSettledCallbacks_ ? e.asyncExecute(f) : this.onSettledCallbacks_.push(f) }; b.resolve = z; b.reject = function (a) { return new b(function (b, f) { f(a) }) }; b.race =
            function (a) { return new b(function (b, f) { for (var e = $jscomp.makeIterator(a), h = e.next(); !h.done; h = e.next())z(h.value).callWhenSettled_(b, f) }) }; b.all = function (a) { var e = $jscomp.makeIterator(a), f = e.next(); return f.done ? z([]) : new b(function (a, b) { function h(b) { return function (f) { Pa[b] = f; x--; 0 == x && a(Pa) } } var Pa = [], x = 0; do Pa.push(void 0), x++, z(f.value).callWhenSettled_(h(Pa.length - 1), b), f = e.next(); while (!f.done) }) }; return b
}, "es6", "es3");
$jscomp.checkStringArgs = function (c, Oa, z) { if (null == c) throw new TypeError("The 'this' value for String.prototype." + z + " must not be null or undefined"); if (Oa instanceof RegExp) throw new TypeError("First argument to String.prototype." + z + " must not be a regular expression"); return c + "" };
$jscomp.polyfill("String.prototype.startsWith", function (c) { return c ? c : function (c, z) { var r = $jscomp.checkStringArgs(this, c, "startsWith"); c += ""; for (var b = r.length, e = c.length, a = Math.max(0, Math.min(z | 0, r.length)), Pa = 0; Pa < e && a < b;)if (r[a++] != c[Pa++]) return !1; return Pa >= e } }, "es6", "es3"); $jscomp.findInternal = function (c, Oa, z) { c instanceof String && (c = String(c)); for (var r = c.length, b = 0; b < r; b++) { var e = c[b]; if (Oa.call(z, e, b, c)) return { i: b, v: e } } return { i: -1, v: void 0 } };
$jscomp.polyfill("Array.prototype.find", function (c) { return c ? c : function (c, z) { return $jscomp.findInternal(this, c, z).v } }, "es6", "es3"); $jscomp.polyfill("String.prototype.endsWith", function (c) { return c ? c : function (c, z) { var r = $jscomp.checkStringArgs(this, c, "endsWith"); c += ""; void 0 === z && (z = r.length); for (var b = Math.max(0, Math.min(z | 0, r.length)), e = c.length; 0 < e && 0 < b;)if (r[--b] != c[--e]) return !1; return 0 >= e } }, "es6", "es3"); $jscomp.SYMBOL_PREFIX = "jscomp_symbol_";
$jscomp.initSymbol = function () { $jscomp.initSymbol = function () { }; $jscomp.global.Symbol || ($jscomp.global.Symbol = $jscomp.Symbol) }; $jscomp.Symbol = function () { var c = 0; return function (Oa) { return $jscomp.SYMBOL_PREFIX + (Oa || "") + c++ } }();
$jscomp.initSymbolIterator = function () { $jscomp.initSymbol(); var c = $jscomp.global.Symbol.iterator; c || (c = $jscomp.global.Symbol.iterator = $jscomp.global.Symbol("iterator")); "function" != typeof Array.prototype[c] && $jscomp.defineProperty(Array.prototype, c, { configurable: !0, writable: !0, value: function () { return $jscomp.iteratorPrototype($jscomp.arrayIteratorImpl(this)) } }); $jscomp.initSymbolIterator = function () { } };
$jscomp.initSymbolAsyncIterator = function () { $jscomp.initSymbol(); var c = $jscomp.global.Symbol.asyncIterator; c || (c = $jscomp.global.Symbol.asyncIterator = $jscomp.global.Symbol("asyncIterator")); $jscomp.initSymbolAsyncIterator = function () { } }; $jscomp.iteratorPrototype = function (c) { $jscomp.initSymbolIterator(); c = { next: c }; c[$jscomp.global.Symbol.iterator] = function () { return this }; return c };
$jscomp.iteratorFromArray = function (c, Oa) { $jscomp.initSymbolIterator(); c instanceof String && (c += ""); var z = 0, r = { next: function () { if (z < c.length) { var b = z++; return { value: Oa(b, c[b]), done: !1 } } r.next = function () { return { done: !0, value: void 0 } }; return r.next() } }; r[Symbol.iterator] = function () { return r }; return r }; $jscomp.polyfill("Array.prototype.keys", function (c) { return c ? c : function () { return $jscomp.iteratorFromArray(this, function (c) { return c }) } }, "es6", "es3");
$jscomp.polyfill("Math.log10", function (c) { return c ? c : function (c) { return Math.log(c) / Math.LN10 } }, "es6", "es3"); $jscomp.polyfill("String.prototype.repeat", function (c) { return c ? c : function (c) { var z = $jscomp.checkStringArgs(this, null, "repeat"); if (0 > c || 1342177279 < c) throw new RangeError("Invalid count value"); c |= 0; for (var r = ""; c;)if (c & 1 && (r += z), c >>>= 1) z += z; return r } }, "es6", "es3");
$jscomp.stringPadding = function (c, Oa) { var z = void 0 !== c ? String(c) : " "; return 0 < Oa && z ? z.repeat(Math.ceil(Oa / z.length)).substring(0, Oa) : "" }; $jscomp.polyfill("String.prototype.padStart", function (c) { return c ? c : function (c, z) { var r = $jscomp.checkStringArgs(this, null, "padStart"); return $jscomp.stringPadding(z, c - r.length) + r } }, "es8", "es3");
$jscomp.polyfill("Promise.prototype.finally", function (c) { return c ? c : function (c) { return this.then(function (z) { return Promise.resolve(c()).then(function () { return z }) }, function (z) { return Promise.resolve(c()).then(function () { throw z; }) }) } }, "es9", "es3"); var isInNode = "object" === typeof process && "function" === typeof require && "object" === typeof global, isInWorker = "undefined" !== typeof WorkerGlobalScope && self instanceof WorkerGlobalScope || isInNode;
function execBoth(c, Oa, z) { return !isInWorker && c ? c.apply(this, z || []) : isInWorker && Oa ? Oa.apply(this, z || []) : {} } function execWorker(c, Oa) { return execBoth(void 0, c, Oa) } function execMain(c, Oa) { return execBoth(c, void 0, Oa) } execWorker(function () { isInNode && (global.self = global); self.$ = { isArray: Array.isArray || function (c) { return "array" === jQuery.type(c) }, noop: function () { } } });
execMain(function () {
    window.onerror = function (c, r, b, e, a) { if ((b || e) && /\.js/i.exec(r)) { void 0 == a && (a = {}); var Pa = ""; try { Pa = $.fingerprint() } catch (f) { } $.post("bug.php", { version: CSTIMER_VERSION, fp: Pa, msg: c, url: r, line: b, col: e, stack: a.stack }); DEBUG && console.log(CSTIMER_VERSION, Pa, c, r, b, e, a) } }; for (var c = "CSTIMER_VERSION LANG_SET LANG_STR LANG_CUR OK_LANG CANCEL_LANG RESET_LANG ABOUT_LANG ZOOM_LANG BUTTON_TIME_LIST BUTTON_OPTIONS BUTTON_EXPORT BUTTON_DONATE PROPERTY_SR PROPERTY_USEINS PROPERTY_USEINS_STR PROPERTY_SHOWINS PROPERTY_VOICEINS PROPERTY_VOICEINS_STR PROPERTY_VOICEVOL PROPERTY_PHASES PROPERTY_TIMERSIZE PROPERTY_USEMILLI PROPERTY_SMALLADP PROPERTY_SCRSIZE PROPERTY_SCRMONO PROPERTY_SCRLIM PROPERTY_SCRALIGN PROPERTY_SCRALIGN_STR PROPERTY_SCRFAST PROPERTY_SCRKEYM PROPERTY_SCRCLK PROPERTY_SCRCLK_STR PROPERTY_WNDSCR PROPERTY_WNDSTAT PROPERTY_WNDTOOL PROPERTY_WND_STR EXPORT_DATAEXPORT EXPORT_TOFILE EXPORT_FROMFILE EXPORT_TOSERV EXPORT_FROMSERV EXPORT_FROMOTHER EXPORT_USERID EXPORT_INVID EXPORT_ERROR EXPORT_NODATA EXPORT_UPLOADED EXPORT_CODEPROMPT EXPORT_ONLYOPT EXPORT_ACCOUNT EXPORT_LOGINGGL EXPORT_LOGINWCA EXPORT_LOGOUTCFM EXPORT_LOGINAUTHED IMPORT_FINAL_CONFIRM BUTTON_SCRAMBLE BUTTON_TOOLS IMAGE_UNAVAILABLE TOOLS_SELECTFUNC TOOLS_CROSS TOOLS_EOLINE TOOLS_ROUX1 TOOLS_222FACE TOOLS_GIIKER TOOLS_IMAGE TOOLS_STATS TOOLS_HUGESTATS TOOLS_DISTRIBUTION TOOLS_TREND TOOLS_METRONOME TOOLS_BATTLE TOOLS_BATTLE_HEAD TOOLS_BATTLE_TITLE TOOLS_BATTLE_STATUS TOOLS_BATTLE_INFO TOOLS_BATTLE_JOINALERT TOOLS_BATTLE_LEAVEALERT TOOLS_CFMTIME TOOLS_SOLVERS TOOLS_RECONS TOOLS_RECONS_NODATA TOOLS_TRAINSTAT TOOLS_BLDHELPER TOOLS_SYNCSEED TOOLS_SYNCSEED_SEED TOOLS_SYNCSEED_INPUT TOOLS_SYNCSEED_30S TOOLS_SYNCSEED_HELP TOOLS_SYNCSEED_DISABLE TOOLS_SYNCSEED_INPUTA OLCOMP_UPDATELIST OLCOMP_VIEWRESULT OLCOMP_VIEWMYRESULT OLCOMP_START OLCOMP_SUBMIT OLCOMP_SUBMITAS OLCOMP_WCANOTICE OLCOMP_OLCOMP OLCOMP_ANONYM OLCOMP_ME OLCOMP_WCAACCOUNT OLCOMP_ABORT OLCOMP_WITHANONYM PROPERTY_IMGSIZE TIMER_INSPECT TIMER_SOLVE PROPERTY_USEMOUSE PROPERTY_TIMEU PROPERTY_TIMEU_STR PROPERTY_PRETIME PROPERTY_ENTERING PROPERTY_ENTERING_STR PROPERTY_INTUNIT PROPERTY_INTUNIT_STR PROPERTY_COLOR PROPERTY_COLORS PROPERTY_VIEW PROPERTY_VIEW_STR PROPERTY_UIDESIGN PROPERTY_UIDESIGN_STR COLOR_EXPORT COLOR_IMPORT COLOR_FAIL PROPERTY_FONTCOLOR_STR PROPERTY_COLOR_STR PROPERTY_FONT PROPERTY_FONT_STR PROPERTY_FORMAT PROPERTY_USEKSC PROPERTY_NTOOLS PROPERTY_AHIDE SCRAMBLE_LAST SCRAMBLE_NEXT SCRAMBLE_SCRAMBLE SCRAMBLE_SCRAMBLING SCRAMBLE_LENGTH SCRAMBLE_INPUT PROPERTY_VRCSPEED PROPERTY_VRCMP PROPERTY_VRCMPS PROPERTY_GIIKERVRC PROPERTY_GIISOK_DELAY PROPERTY_GIISOK_DELAYS PROPERTY_GIISOK_KEY PROPERTY_GIISOK_MOVE PROPERTY_GIISOK_MOVES PROPERTY_GIISBEEP PROPERTY_GIIRST PROPERTY_GIIRSTS CONFIRM_GIIRST PROPERTY_GIIAED scrdata SCRAMBLE_NOOBST SCRAMBLE_NOOBSS SCROPT_TITLE SCROPT_BTNALL SCROPT_BTNNONE SCROPT_EMPTYALT STATS_CFM_RESET STATS_CFM_DELSS STATS_CFM_DELMUL STATS_CFM_DELETE STATS_COMMENT STATS_REVIEW STATS_DATE STATS_SSSTAT STATS_CURROUND STATS_CURSESSION STATS_CURSPLIT STATS_EXPORTCSV STATS_SSMGR_TITLE STATS_SSMGR_NAME STATS_SSMGR_DETAIL STATS_SSMGR_OPS STATS_SSMGR_ORDER STATS_SSMGR_ODCFM STATS_SSMGR_SORTCFM STATS_ALERTMG STATS_PROMPTSPL STATS_ALERTSPL STATS_AVG STATS_SUM STATS_SOLVE STATS_TIME STATS_SESSION STATS_SESSION_NAME STATS_SESSION_NAMEC STATS_STRING STATS_PREC STATS_PREC_STR STATS_TYPELEN STATS_STATCLR STATS_ABSIDX STATS_XSESSION_DATE STATS_XSESSION_NAME STATS_XSESSION_SCR STATS_XSESSION_CALC STATS_RSFORSS PROPERTY_PRINTSCR PROPERTY_PRINTDATE PROPERTY_SUMMARY PROPERTY_IMRENAME PROPERTY_SCR2SS PROPERTY_SS2SCR PROPERTY_SS2PHASES PROPERTY_STATINV PROPERTY_STATSSUM PROPERTY_STATTHRES PROPERTY_STATAL PROPERTY_STATALU PROPERTY_DELMUL PROPERTY_TOOLSFUNC PROPERTY_TRIM PROPERTY_TRIMR PROPERTY_TRIM_MED PROPERTY_STKHEAD PROPERTY_TOOLPOS PROPERTY_TOOLPOS_STR PROPERTY_HIDEFULLSOL PROPERTY_IMPPREV PROPERTY_AUTOEXP PROPERTY_AUTOEXP_OPT PROPERTY_SCRASIZE MODULE_NAMES BGIMAGE_URL BGIMAGE_INVALID BGIMAGE_OPACITY BGIMAGE_IMAGE BGIMAGE_IMAGE_STR SHOW_AVG_LABEL SHOW_DIFF_LABEL SHOW_DIFF_LABEL_STR USE_LOGOHINT TOOLS_SCRGEN SCRGEN_NSCR SCRGEN_PRE SCRGEN_GEN TOOLS_RECONS_TITLE TOOLS_DLYSTAT TOOLS_DLYSTAT1 TOOLS_DLYSTAT_OPT1 TOOLS_DLYSTAT_OPT2 PROPERTY_GIIMODE PROPERTY_GIIMODES PROPERTY_VRCAH PROPERTY_VRCAHS VRCREPLAY_TITLE VRCREPLAY_ORI VRCREPLAY_SHARE GIIKER_CONNECT GIIKER_RESET PROPERTY_SHOWAD PROPERTY_GIIORI".split(" "),
        Oa = 0; Oa < c.length; Oa++)window[c[Oa]] = window[c[Oa]] || "|||||||||||||||"; window.requestAnimFrame = function () { return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (c, r) { return window.setTimeout(c, 1E3 / 60) } }(); window.localStorage || (window.localStorage = {}); "properties" in localStorage || "https:" == location.protocol || "localhost" == location.hostname || (location.href = "https:" + location.href.substring(location.protocol.length));
    window.performance && window.performance.now && ($.now = function () { return Math.floor(window.performance.now()) }); $.urlParam = function (c) { c = (new RegExp("[?&]" + c + "=([^&#]*)")).exec(window.location.href); return null == c ? null : c[1] || 0 }; $.hashParam = function (c) { c = (new RegExp("[#&]" + c + "=([^&#]*)")).exec(window.location.hash); return null == c ? null : c[1] || 0 }; $.clearUrl = function (c) {
        var z = (new RegExp("[?&](" + c + "=[^&#]*&?)")).exec(window.location.href); c = c ? location.href.replace(z[1], "").replace(/\?$/, "") : location.pathname;
        history && history.replaceState ? history.replaceState(void 0, void 0, c) : location.href = c
    }; $.clearHash = function (c) { var z = (new RegExp("[#&](" + c + "=[^&#]*&?)")).exec(window.location.href); c = c ? location.href.replace(z[1], "").replace(/#$/, "") : location.pathname + location.search; history && history.replaceState ? history.replaceState(void 0, void 0, c) : location.href = c }; $.clipboardCopy = function (c, r) {
        var b = $("<textarea>" + c + "</textarea>").appendTo(document.body); b.focus().select(); var e = !1; try { e = document.execCommand("copy") } catch (a) { } b.remove();
        return e
    }; $.fingerprint = function () {
        var c = window.screen && [Math.max(screen.height, screen.width), Math.min(screen.height, screen.width), screen.colorDepth].join("x"), r = (new Date).getTimezoneOffset(), b = $.map(navigator.plugins, function (b) { return [b.name, b.description, $.map(b, function (a) { return [a.type, a.suffixes].join("~") }).sort().join(",")].join("::") }).sort().join(";"); c = [navigator.userAgent, navigator.language, !!window.sessionStorage, !!window.localStorage, !!window.indexedDB, navigator.doNotTrack, c, r, b].join("###");
        return $.sha256(c)
    }; $.ctxDrawPolygon = function (c, r, b, e) { if (c) { e = e || [1, 0, 0, 0, 1, 0]; b = $.ctxTransform(b, e); c.beginPath(); c.fillStyle = r; c.moveTo(b[0][0], b[1][0]); for (r = 1; r < b[0].length; r++)c.lineTo(b[0][r], b[1][r]); c.closePath(); c.fill(); c.stroke() } }; $.ctxRotate = function (c, r) { return $.ctxTransform(c, [Math.cos(r), -Math.sin(r), 0, Math.sin(r), Math.cos(r), 0]) }; $.ctxTransform = function (c) {
        for (var r, b = 1; b < arguments.length; b++) {
            var e = arguments[b]; 3 == e.length && (e = [e[0], 0, e[1] * e[0], 0, e[0], e[2] * e[0]]); r = [[], []]; for (b =
                0; b < c[0].length; b++)r[0][b] = c[0][b] * e[0] + c[1][b] * e[1] + e[2], r[1][b] = c[0][b] * e[3] + c[1][b] * e[4] + e[5]
        } return r
    }; $.delayExec = function () { var c = {}; return function (r, b, e) { c[r] && (clearTimeout(c[r][0]), delete c[r]); e = setTimeout(b, e); c[r] = [e, b] } }(); $.waitUser = function () { var c = []; return { reg: function (r) { c.push(r) }, call: function () { for (var r = 0; r < c.length; r++)c[r](); c = [] } } }(); "serviceWorker" in navigator ? $(function () { navigator.serviceWorker.register("sw.js") }) : window.applicationCache && $(function () {
        applicationCache.addEventListener("updateready",
            function (c) { applicationCache.status == applicationCache.UPDATEREADY && (applicationCache.swapCache(), location.reload()) }, !1)
    }); navigator.storage && navigator.storage.persisted && navigator.storage.persisted().then(function (c) { if (c) return Promise.resolve(c); if (navigator.storage.persist) return navigator.storage.persist() }).then(function (c) { $.persistent = c })
}); var DEBUGM = !1, DEBUGWK = !1, DEBUG = isInWorker ? DEBUGWK : DEBUGM && !!$.urlParam("debug");
Array.prototype.indexOf || (Array.prototype.indexOf = function (c) { for (var Oa = 0; Oa < this.length; Oa++)if (this[Oa] == c) return Oa; return -1 });
Function.prototype.bind || (Function.prototype.bind = function (c) { if ("function" !== typeof this) throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable"); var Oa = Array.prototype.slice.call(arguments, 1), z = this, r = function () { }, b = function () { return z.apply(this instanceof r ? this : c, Oa.concat(Array.prototype.slice.call(arguments))) }; this.prototype && (r.prototype = this.prototype); b.prototype = new r; return b }); execBoth(function () {
    var c = function (c, r) { var b = (c & 65535) + (r & 65535); return (c >> 16) + (r >> 16) + (b >> 16) << 16 | b & 65535 }, Oa = function (c, r) { return c >>> r | c << 32 - r }; $.sha256 = function (z) {
        /[\x80-\xFF]/.test(z) && (z = unescape(encodeURI(z))); for (var r = z, b = [], e = 0; e < 8 * r.length; e += 8)b[e >> 5] |= (r.charCodeAt(e / 8) & 255) << 24 - e % 32; var a = 8 * z.length; r = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401,
            4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298];
        z = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225]; e = [64]; b[a >> 5] |= 128 << 24 - a % 32; b[(a + 64 >> 9 << 4) + 15] = a; for (a = 0; a < b.length; a += 16) {
            for (var Pa = z[0], f = z[1], bb = z[2], h = z[3], Na = z[4], Qa = z[5], x = z[6], Ta = z[7], Ua = 0; 64 > Ua; Ua++) {
                var Wa = Ua; if (16 > Ua) var Ra = b[a + Ua]; else { Ra = e[Ua - 2]; Ra = Oa(Ra, 17) ^ Oa(Ra, 19) ^ Ra >>> 10; Ra = c(Ra, e[Ua - 7]); var $a = e[Ua - 15]; $a = Oa($a, 7) ^ Oa($a, 18) ^ $a >>> 3; Ra = c(c(Ra, $a), e[Ua - 16]) } e[Wa] = Ra; Wa = Na; Wa = Oa(Wa, 6) ^ Oa(Wa, 11) ^ Oa(Wa, 25); Wa = c(c(c(c(Ta, Wa), Na & Qa ^ ~Na & x), r[Ua]),
                    e[Ua]); Ta = Pa; Ta = Oa(Ta, 2) ^ Oa(Ta, 13) ^ Oa(Ta, 22); Ra = c(Ta, Pa & f ^ Pa & bb ^ f & bb); Ta = x; x = Qa; Qa = Na; Na = c(h, Wa); h = bb; bb = f; f = Pa; Pa = c(Wa, Ra)
            } z[0] = c(Pa, z[0]); z[1] = c(f, z[1]); z[2] = c(bb, z[2]); z[3] = c(h, z[3]); z[4] = c(Na, z[4]); z[5] = c(Qa, z[5]); z[6] = c(x, z[6]); z[7] = c(Ta, z[7])
        } b = ""; for (r = 0; r < 4 * z.length; r++)b += "0123456789abcdef".charAt(z[r >> 2] >> 8 * (3 - r % 4) + 4 & 15) + "0123456789abcdef".charAt(z[r >> 2] >> 8 * (3 - r % 4) & 15); return b
    }
});
execBoth(function () {
    function c(a, c) { for (var f = a.slice(), h = 0; 16 > h; h++)a[h] = b[f[e[h]]] ^ c[h] } function Oa(a, b) { for (var c = a.slice(), f = 0; 16 > f; f++)a[e[f]] = r[c[f] ^ b[f]] } function z(c) { if (0 == a.length) { for (var f = 0; 256 > f; f++)b[r[f]] = f; for (f = 0; 128 > f; f++)a[f] = f << 1, a[128 + f] = f << 1 ^ 27 } c = c.slice(); f = 1; for (var e = 16; 176 > e; e += 4) { var h = c.slice(e - 4, e); 0 == e % 16 && (h = [r[h[1]] ^ f, r[h[2]], r[h[3]], r[h[0]]], f = a[f]); for (var Pa = 0; 4 > Pa; Pa++)c[e + Pa] = c[e + Pa - 16] ^ h[Pa] } this.key = c } var r = [99, 124, 119, 123, 242, 107, 111, 197, 48, 1, 103, 43, 254, 215,
        171, 118, 202, 130, 201, 125, 250, 89, 71, 240, 173, 212, 162, 175, 156, 164, 114, 192, 183, 253, 147, 38, 54, 63, 247, 204, 52, 165, 229, 241, 113, 216, 49, 21, 4, 199, 35, 195, 24, 150, 5, 154, 7, 18, 128, 226, 235, 39, 178, 117, 9, 131, 44, 26, 27, 110, 90, 160, 82, 59, 214, 179, 41, 227, 47, 132, 83, 209, 0, 237, 32, 252, 177, 91, 106, 203, 190, 57, 74, 76, 88, 207, 208, 239, 170, 251, 67, 77, 51, 133, 69, 249, 2, 127, 80, 60, 159, 168, 81, 163, 64, 143, 146, 157, 56, 245, 188, 182, 218, 33, 16, 255, 243, 210, 205, 12, 19, 236, 95, 151, 68, 23, 196, 167, 126, 61, 100, 93, 25, 115, 96, 129, 79, 220, 34, 42, 144, 136, 70, 238, 184,
        20, 222, 94, 11, 219, 224, 50, 58, 10, 73, 6, 36, 92, 194, 211, 172, 98, 145, 149, 228, 121, 231, 200, 55, 109, 141, 213, 78, 169, 108, 86, 244, 234, 101, 122, 174, 8, 186, 120, 37, 46, 28, 166, 180, 198, 232, 221, 116, 31, 75, 189, 139, 138, 112, 62, 181, 102, 72, 3, 246, 14, 97, 53, 87, 185, 134, 193, 29, 158, 225, 248, 152, 17, 105, 217, 142, 148, 155, 30, 135, 233, 206, 85, 40, 223, 140, 161, 137, 13, 191, 230, 66, 104, 65, 153, 45, 15, 176, 84, 187, 22], b = [], e = [0, 13, 10, 7, 4, 1, 14, 11, 8, 5, 2, 15, 12, 9, 6, 3], a = []; z.prototype.decrypt = function (b) {
            for (var f = this.key.slice(160, 176), e = 0; 16 > e; e++)b[e] ^= f[e];
            for (f = 144; 16 <= f; f -= 16) { c(b, this.key.slice(f, f + 16)); e = b; for (var h = 0; 16 > h; h += 4) { var Pa = e[h + 0], Qa = e[h + 1], x = e[h + 2], Ta = e[h + 3], Ua = Pa ^ Qa ^ x ^ Ta, r = a[Ua], Ra = a[a[r ^ Pa ^ x]] ^ Ua; Ua ^= a[a[r ^ Qa ^ Ta]]; e[h + 0] = e[h + 0] ^ Ra ^ a[Pa ^ Qa]; e[h + 1] = e[h + 1] ^ Ua ^ a[Qa ^ x]; e[h + 2] = e[h + 2] ^ Ra ^ a[x ^ Ta]; e[h + 3] = e[h + 3] ^ Ua ^ a[Ta ^ Pa] } } c(b, this.key.slice(0, 16)); return b
        }; z.prototype.encrypt = function (b) {
            Oa(b, this.key.slice(0, 16)); for (var c = 16; 160 > c; c += 16) {
                for (var e = b, h = 12; 0 <= h; h -= 4) {
                    var Pa = e[h + 0], Qa = e[h + 1], x = e[h + 2], Ta = e[h + 3], Ua = Pa ^ Qa ^ x ^ Ta; e[h + 0] = e[h + 0] ^
                        Ua ^ a[Pa ^ Qa]; e[h + 1] = e[h + 1] ^ Ua ^ a[Qa ^ x]; e[h + 2] = e[h + 2] ^ Ua ^ a[x ^ Ta]; e[h + 3] = e[h + 3] ^ Ua ^ a[Ta ^ Pa]
                } Oa(b, this.key.slice(c, c + 16))
            } c = this.key.slice(160, 176); for (e = 0; 16 > e; e++)b[e] ^= c[e]; return b
        }; $.aes128 = function (a) { return new z(a) }
}); function MersenneTwisterObject(c, Oa) {
    function z(a, b) { var e = a & 65535, c = b & 65535; var f = e * c; var h = f >>> 16; h = h + e * ((b & 4294901760) >>> 16) & 65535; h += ((a & 4294901760) >>> 16) * c; h &= 65535; e = h << 16 | f & 65535; return 0 > e ? e + 4294967296 : e } function r(b) { var e = 0 < arguments.length && isFinite(b) ? b & 4294967295 : 5489, c; a = [e]; Pa = 624; for (c = 1; 624 > c; a[c] = e = z(e ^ e >>> 30, 1812433253) + c++); } function b(b, e) {
        var c = b.length, f; r(1 < arguments.length && isFinite(e) ? e : 19650218); var h = a[0]; var Pa = 1; var bb = 0; for (f = Math.max(624, c); f; bb %= c, f--)a[Pa] = h = (a[Pa++] ^
            z(h ^ h >>> 30, 1664525)) + b[bb] + bb++ & 4294967295, 623 < Pa && (a[0] = h = a[623], Pa = 1); for (f = 623; f; f--)a[Pa] = h = (a[Pa] ^ z(h ^ h >>> 30, 1566083941)) - Pa++ & 4294967295, 623 < Pa && (a[0] = h = a[623], Pa = 1); a[0] = 2147483648
    } function e() {
        for (var b, e; 624 <= Pa || 0 > Pa;) { Pa = Math.max(0, Pa - 624); for (e = 0; 227 > e; b = a[e] & 2147483648 | a[e + 1] & 2147483647, a[e] = a[e + 397] ^ b >>> 1 ^ f[b & 1], e++); for (; 623 > e; b = a[e] & 2147483648 | a[e + 1] & 2147483647, a[e] = a[e + -227] ^ b >>> 1 ^ f[b & 1], e++); b = a[623] & 2147483648 | a[0] & 2147483647; a[623] = a[396] ^ b >>> 1 ^ f[b & 1] } b = a[Pa++]; b ^= b >>> 11; b ^= b <<
            7 & 2636928640; b ^= b << 15 & 4022730752; b ^= b >>> 18; return 0 > b ? b + 4294967296 : b
    } var a = [], Pa = NaN, f = [0, 2567483615]; 1 < arguments.length ? b(Oa, c) : 0 < arguments.length ? r(c) : r(); return function () { return (67108864 * (e() >>> 5) + (e() >>> 6)) / 9007199254740992 }
} Math.random = new MersenneTwisterObject((new Date).getTime()); var mathlib = function () {
    function c(a, w, n, Sa, Za, b) { var Xa = a[w]; a[w] = a[Za] ^ b; a[Za] = a[Sa] ^ b; a[Sa] = a[n] ^ b; a[n] = Xa ^ b } function Oa(a) { for (var w = arguments.length - 1, n = a[arguments[w]]; 1 < w; w--)a[arguments[w]] = a[arguments[w - 1]]; a[arguments[1]] = n; return Oa } function z(a, w, n, Sa) { n = n || 1; for (var Za = w.length, b = [], Xa = 0; Xa < Za; Xa++)b[Xa] = a[w[Xa]]; for (Xa = 0; Xa < Za; Xa++) { var e = (Xa + n) % Za; a[w[e]] = b[Xa]; Sa && (a[w[e]] += Sa[e] - Sa[Xa] + Sa[Sa.length - 1]) } return z } function r(a, w) { return a[w >> 3] >> ((w & 7) << 2) & 15 } function b(a, w) {
        var n, Sa,
        Za; for (n = Sa = 0; n < w; ++n)for (Sa *= w - n, Za = n + 1; Za < w; ++Za)a[Za] < a[n] && ++Sa; return Sa
    } function e(a, w) { var n; var Sa = 0; for (n = w - 2; 0 <= n; --n)Sa ^= a % (w - n), a = ~~(a / (w - n)); return Sa & 1 } function a(a, w, n) { w = w || 8; for (var Sa = 0, Za = 1985229328, b = 0; b < w - 1; ++b) { var Xa = a[b] << 2; Sa = (w - b) * Sa + (Za >> Xa & 7); Za -= 286331152 << Xa } return 0 > n ? Sa >> 1 : Sa } function Pa(a, w, n, Sa) {
        n = (n || 8) - 1; var Za = 1985229328, b = 0; 0 > Sa && (w <<= 1); for (var Xa = 0; Xa < n; ++Xa) { var e = Va[n - Xa], c = ~~(w / e); b ^= c; w %= e; c <<= 2; a[Xa] = Za >> c & 7; e = (1 << c) - 1; Za = (Za & e) + (Za >> 4 & ~e) } 0 > Sa && 0 != (b &
            1) ? (a[n] = a[n - 1], a[n - 1] = Za & 7) : a[n] = Za & 7; return a
    } function f(b, w, n) { this.length = w; this.evenbase = n; this.get = "p" == b ? function (n) { return a(n, this.length, this.evenbase) } : function (n) { var a = this.evenbase, w = Math.abs(a); a = 0 > a ? 0 : n[0] % w; for (var Sa = this.length - 1; 0 < Sa; Sa--)a = a * w + n[Sa] % w; return a }; this.set = "p" == b ? function (n, a) { return Pa(n, a, this.length, this.evenbase) } : function (n, a) { for (var w = a, Sa = this.length, Za = this.evenbase, b = Math.abs(Za), Xa = b * Sa, e = 1; e < Sa; e++)n[e] = w % b, Xa -= n[e], w = ~~(w / b); n[0] = (0 > Za ? Xa : w) % b; return n } }
    function bb(a, w, n, Sa) { Sa = Sa || 6; if ($.isArray(n)) { var b = new f(n[1], n[2], n[3]); n = n[0]; for (var Xa = 0; Xa < Sa; Xa++) { a[Xa] = []; for (var e = 0; e < w; e++) { var c = b.set([], e); n(c, Xa); a[Xa][e] = b.get(c) } } } else for (Xa = 0; Xa < Sa; Xa++)for (a[Xa] = [], e = 0; e < w; e++)a[Xa][e] = n(e, Xa) } function h() { this.ca = [0, 1, 2, 3, 4, 5, 6, 7]; this.ea = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22] } function Na(a, w) {
        this.sgs = []; this.sgsi = []; this.Tk = []; this.gen = a; this.invMap = {}; var n = a[0].length; this.e = []; for (var Sa = 0; Sa < n; Sa++)this.e[Sa] = Sa; for (Sa = 0; Sa < n; Sa++)this.sgs.push([]),
            this.sgsi.push([]), this.Tk.push([]), this.sgs[Sa][Sa] = this.e, this.sgsi[Sa][Sa] = this.e; for (Sa = 0; Sa < a.length; Sa++) { var b = a[Sa]; w && (b = this.permMult(this.permMult(this.permInv(w), b), w)); this.knutha(n - 1, b) }
    } function Qa(a, w, n, Sa, b, e, c, f) {
        var Za = $.isArray(b); e = e || 6; c = c || 3; f = f || 256; Sa = Sa || 256; for (var Xa = 0, h = n + 7 >>> 3; Xa < h; Xa++)a[Xa] = -1; a[w >> 3] ^= 15 << ((w & 7) << 2); for (Xa = w = 0; Xa <= Sa; Xa++) {
            h = 0; var y = Xa >= f, Pa = Xa + 1 ^ 15, hb = y ? 15 : Xa, Va = y ? Xa : 15, x = 0; a: for (; x < n; x++, w >>= 4) {
                if (0 == (x & 7) && (w = a[x >> 3], !y && -1 == w)) { x += 7; continue } if ((w &
                    15) == hb) for (var $a = 0; $a < e; $a++)for (var Na = x, Ra = 0; Ra < c; Ra++)if (Na = Za ? b[$a][Na] : b(Na, $a), r(a, Na) == Va) { ++h; if (y) { a[x >> 3] ^= Pa << ((x & 7) << 2); continue a } a[Na >> 3] ^= Pa << ((Na & 7) << 2) }
            } if (0 == h) break; DEBUG && console.log("[prun]", h)
        }
    } function x(a, w, n) { this.N_STATES = n.length; this.N_MOVES = a; this.N_POWER = w; this.state_params = n; this.inited = !1 } function Ta(a) { return a } function Ua(a, w, n, Sa, b) {
        this.solvedStates = a; this.doMove = w; this.movesList = []; for (var Za in n) this.movesList.push([Za, n[Za]]); this.state2Idxs = []; this.moveTables =
            []; this.prunTables = []; this.isPartial = b || !1; this.prunHashs = Sa || [Ta]
    } function Wa(a, w, n) { this.solvedStates = a; this.doMove = w; this.movesList = []; for (var Sa in n) this.movesList.push([Sa, n[Sa]]); this.prunTable = {}; this.toUpdateArr = null; this.prunTableSize = 0; this.prunDepth = -1; this.cost = 0; this.MAX_PRUN_SIZE = 1E5 } function Ra(a) { return ~~(Ya.random() * a) } for (var $a = [], Va = [1], y = 0; 32 > y; ++y) { $a[y] = []; for (var db = 0; 32 > db; ++db)$a[y][db] = 0 } for (y = 0; 32 > y; ++y)for ($a[y][0] = $a[y][y] = 1, Va[y + 1] = Va[y] * (y + 1), db = 1; db < y; ++db)$a[y][db] =
        $a[y - 1][db - 1] + $a[y - 1][db]; h.SOLVED = new h; h.EdgeMult = function (a, w, n) { for (var Sa = 0; 12 > Sa; Sa++)n.ea[Sa] = a.ea[w.ea[Sa] >> 1] ^ w.ea[Sa] & 1 }; h.CornMult = function (a, w, n) { for (var Sa = 0; 8 > Sa; Sa++)n.ca[Sa] = a.ca[w.ca[Sa] & 7] & 7 | ((a.ca[w.ca[Sa] & 7] >> 3) + (w.ca[Sa] >> 3)) % 3 << 3 }; h.CubeMult = function (a, w, n) { h.CornMult(a, w, n); h.EdgeMult(a, w, n) }; h.prototype.init = function (a, w) { this.ca = a.slice(); this.ea = w.slice(); return this }; h.prototype.hashCode = function () { for (var a = 0, w = 0; 20 > w; w++)a = 0 | 31 * a + (12 > w ? this.ea[w] : this.ca[w - 12]); return a };
    h.prototype.isEqual = function (a) { a = a || h.SOLVED; for (var w = 0; 8 > w; w++)if (this.ca[w] != a.ca[w]) return !1; for (w = 0; 12 > w; w++)if (this.ea[w] != a.ea[w]) return !1; return !0 }; var mb = [[8, 9, 20], [6, 18, 38], [0, 36, 47], [2, 45, 11], [29, 26, 15], [27, 44, 24], [33, 53, 42], [35, 17, 51]], cb = [[5, 10], [7, 19], [3, 37], [1, 46], [32, 16], [28, 25], [30, 43], [34, 52], [23, 12], [21, 41], [50, 39], [48, 14]]; h.prototype.toFaceCube = function (a, w) {
        a = a || mb; w = w || cb; for (var n = [], Sa = 0; 54 > Sa; Sa++)n[Sa] = "URFDLB"[~~(Sa / 9)]; for (var b = 0; 8 > b; b++) {
            Sa = this.ca[b] & 7; for (var e = this.ca[b] >>
                3, Xa = 0; 3 > Xa; Xa++)n[a[b][(Xa + e) % 3]] = "URFDLB"[~~(a[Sa][Xa] / 9)]
        } for (b = 0; 12 > b; b++)for (Sa = this.ea[b] >> 1, e = this.ea[b] & 1, Xa = 0; 2 > Xa; Xa++)n[w[b][(Xa + e) % 2]] = "URFDLB"[~~(w[Sa][Xa] / 9)]; return n.join("")
    }; h.prototype.invFrom = function (a) { for (var w = 0; 12 > w; w++)this.ea[a.ea[w] >> 1] = w << 1 | a.ea[w] & 1; for (w = 0; 8 > w; w++)this.ca[a.ca[w] & 7] = w | 32 >> (a.ca[w] >> 3) & 24; return this }; h.prototype.fromFacelet = function (a, w, n) {
        w = w || mb; n = n || cb; for (var Sa = 0, b = [], e = a[4] + a[13] + a[22] + a[31] + a[40] + a[49], Xa = 0; 54 > Xa; ++Xa) {
            b[Xa] = e.indexOf(a[Xa]);
            if (-1 == b[Xa]) return -1; Sa += 1 << (b[Xa] << 2)
        } if (10066329 != Sa) return -1; var c; for (Xa = 0; 8 > Xa; ++Xa) { for (c = 0; 3 > c && 0 != b[w[Xa][c]] && 3 != b[w[Xa][c]]; ++c); a = b[w[Xa][(c + 1) % 3]]; Sa = b[w[Xa][(c + 2) % 3]]; for (e = 0; 8 > e; ++e)if (a == ~~(w[e][1] / 9) && Sa == ~~(w[e][2] / 9)) { this.ca[Xa] = e | c % 3 << 3; break } } for (Xa = 0; 12 > Xa; ++Xa)for (e = 0; 12 > e; ++e) { if (b[n[Xa][0]] == ~~(n[e][0] / 9) && b[n[Xa][1]] == ~~(n[e][1] / 9)) { this.ea[Xa] = e << 1; break } if (b[n[Xa][0]] == ~~(n[e][1] / 9) && b[n[Xa][1]] == ~~(n[e][0] / 9)) { this.ea[Xa] = e << 1 | 1; break } } return this
    }; h.prototype.verify =
        function () { for (var a = 0, w = 0, n = 0; 12 > n; n++)a |= 256 << (this.ea[n] >> 1), w ^= this.ea[n] & 1; n = []; for (var Sa = 0; 8 > Sa; Sa++)a |= 1 << (this.ca[Sa] & 7), w += this.ca[Sa] >> 3 << 1, n.push(this.ca[Sa] & 7); return 1048575 != a || 0 != w % 6 || e(b(this.ea, 12), 12) != e(b(n, 8), 8) ? -1 : 0 }; h.moveCube = function () {
            for (var a = [], w = 0; 18 > w; w++)a[w] = new h; a[0].init([3, 0, 1, 2, 4, 5, 6, 7], [6, 0, 2, 4, 8, 10, 12, 14, 16, 18, 20, 22]); a[3].init([20, 1, 2, 8, 15, 5, 6, 19], [16, 2, 4, 6, 22, 10, 12, 14, 8, 18, 20, 0]); a[6].init([9, 21, 2, 3, 16, 12, 6, 7], [0, 19, 4, 6, 8, 17, 12, 14, 3, 11, 20, 22]); a[9].init([0,
                1, 2, 3, 5, 6, 7, 4], [0, 2, 4, 6, 10, 12, 14, 8, 16, 18, 20, 22]); a[12].init([0, 10, 22, 3, 4, 17, 13, 7], [0, 2, 20, 6, 8, 10, 18, 14, 16, 4, 12, 22]); a[15].init([0, 1, 11, 23, 4, 5, 18, 14], [0, 2, 4, 23, 8, 10, 12, 21, 16, 18, 7, 15]); for (w = 0; 18 > w; w += 3)for (var n = 0; 2 > n; n++)h.EdgeMult(a[w + n], a[w], a[w + n + 1]), h.CornMult(a[w + n], a[w], a[w + n + 1]); return a
        }(); h.rotCube = function () {
            for (var a = (new h).init([3, 0, 1, 2, 7, 4, 5, 6], [6, 0, 2, 4, 14, 8, 10, 12, 23, 17, 19, 21]), w = (new h).init([5, 4, 7, 6, 1, 0, 3, 2], [12, 10, 8, 14, 4, 2, 0, 6, 18, 16, 22, 20]), n = (new h).init([8, 20, 13, 17, 19, 15, 22, 10],
                [3, 16, 11, 18, 7, 22, 15, 20, 1, 9, 13, 5]), b = new h, e = new h, c = [], f = 0; 24 > f; f++)c[f] = (new h).init(b.ca, b.ea), h.CornMult(b, a, e), h.EdgeMult(b, a, e), b.init(e.ca, e.ea), 3 == f % 4 && (h.CornMult(b, w, e), h.EdgeMult(b, w, e), b.init(e.ca, e.ea)), 7 == f % 8 && (h.CornMult(b, n, e), h.EdgeMult(b, n, e), b.init(e.ca, e.ea)); a = []; w = []; n = []; var y = [], Pa = []; for (f = 0; 24 > f; f++)w[f] = c[f].hashCode(), n[f] = [], y[f] = [], Pa[f] = []; for (f = 0; 18 > f; f++)a[f] = h.moveCube[f].hashCode(); for (f = 0; 24 > f; f++)for (var x = 0; 24 > x; x++) {
                    h.CornMult(c[f], c[x], b); h.EdgeMult(c[f], c[x],
                        b); var ab = w.indexOf(b.hashCode()); n[f][x] = ab; y[ab][x] = f
                } for (f = 0; 24 > f; f++)for (x = 0; 18 > x; x++)h.CornMult(c[y[0][f]], h.moveCube[x], b), h.EdgeMult(c[y[0][f]], h.moveCube[x], b), h.CornMult(b, c[f], e), h.EdgeMult(b, c[f], e), ab = a.indexOf(e.hashCode()), Pa[f][x] = ab; h.rotMult = n; h.rotMulI = y; h.rotMulM = Pa; h.rot2str = ";y';y2;y;z2;y' z2;y2 z2;y z2;y' x';y2 x';y x';x';y' x;y2 x;y x;x;y z;z;y' z;y2 z;y' z';y2 z';y z';z'".split(";"); return c
        }(); h.prototype.edgeCycles = function () {
            for (var a = [], w = [0, 0, 0], n = 0, b = !1, e = 0; 12 > e; ++e)if (!a[e]) {
                var c =
                    -1, f = !1, h = e; do a[h] = !0, ++c, f ^= this.ea[h] & 1, h = this.ea[h] >> 1; while (h != e); n += c >> 1; c & 1 && (b = !b, ++n); f && (0 == c ? ++w[0] : c & 1 ? w[2] ^= 1 : ++w[1])
            } w[1] += w[2]; n = w[0] < w[1] ? n + (w[0] + w[1] >> 1) : n + (w[1] + [0, 2, 3, 5, 6, 8, 9][w[0] - w[1] >> 1]); return n - b
        }; var lb = /^\s*([URFDLB]w?|[EMSyxz]|2-2[URFDLB]w)(['2]?)(@\d+)?\s*$/, gb = new h; h.prototype.selfMoveStr = function (a, w) {
            var n = lb.exec(a); if (n) {
                var b = n[1], e = "2'".indexOf(n[2] || "-") + 2; w && (e = 4 - e); n[3] && (this.tstamp = ~~n[3].slice(1)); this.ori = this.ori || 0; var c = "URFDLB".indexOf(b); if (-1 != c) return n =
                    h.rotMulM[this.ori][3 * c + e % 4 - 1], h.EdgeMult(this, h.moveCube[n], gb), h.CornMult(this, h.moveCube[n], gb), this.init(gb.ca, gb.ea), n; c = "UwRwFwDwLwBw".indexOf(b); if (-1 != c) { c >>= 1; n = h.rotMulM[this.ori][(c + 3) % 6 * 3 + e % 4 - 1]; h.EdgeMult(this, h.moveCube[n], gb); h.CornMult(this, h.moveCube[n], gb); this.init(gb.ca, gb.ea); c = [3, 15, 17, 1, 11, 23][c]; for (b = 0; b < e; b++)this.ori = h.rotMult[c][this.ori]; return n } c = "2-2Uw 2-2Rw 2-2Fw 2-2Dw 2-2Lw 2-2Bw".split(" ").indexOf(b); -1 == c && (c = [null, null, "S", "E", "M", null].indexOf(b)); if (-1 != c) {
                        b =
                        (c + 3) % 6 * 3 + e % 4 - 1; n = h.rotMulM[this.ori][3 * c + (4 - e) % 4 - 1]; h.EdgeMult(this, h.moveCube[n], gb); h.CornMult(this, h.moveCube[n], gb); this.init(gb.ca, gb.ea); b = h.rotMulM[this.ori][b]; h.EdgeMult(this, h.moveCube[b], gb); h.CornMult(this, h.moveCube[b], gb); this.init(gb.ca, gb.ea); c = [3, 15, 17, 1, 11, 23][c]; for (b = 0; b < e; b++)this.ori = h.rotMult[c][this.ori]; return n + 18
                    } c = "yxz".indexOf(b); if (-1 != c) for (c = [3, 15, 17][c], b = 0; b < e; b++)this.ori = h.rotMult[c][this.ori]
            }
        }; h.prototype.selfConj = function (a) {
            void 0 === a && (a = this.ori); 0 != a && (h.CornMult(h.rotCube[a],
                this, gb), h.EdgeMult(h.rotCube[a], this, gb), h.CornMult(gb, h.rotCube[h.rotMulI[0][a]], this), h.EdgeMult(gb, h.rotCube[h.rotMulI[0][a]], this), this.ori = h.rotMulI[this.ori][a] || 0)
        }; y = function () {
            var a = [11, 8, 9, 10, 6, 7, 4, 5, 1, 2, 3, 0], w = [[5, 1, 2, 3, 4], [10, 6, 2, 0, 5], [6, 7, 3, 0, 1], [7, 8, 4, 0, 2], [8, 9, 5, 0, 3], [9, 10, 1, 0, 4], [11, 7, 2, 1, 10], [11, 8, 3, 2, 6], [11, 9, 4, 3, 7], [11, 10, 5, 4, 8], [11, 6, 1, 5, 9], [6, 10, 9, 8, 7]]; return {
                doMove: function (n, b, e, c) {
                    e = (e % 5 + 5) % 5; if (0 != e) {
                        for (var Sa = 11 * b, f = [[], [], [], [], []], Za = 0; 5 > Za; Za++) {
                            var Xa = w[b][Za], h = w[Xa].indexOf(b);
                            if (0 == c || 1 == c) f[Za].push(Sa + Za), f[Za].push(Sa + Za + 5), f[Za].push(11 * Xa + h % 5 + 5), f[Za].push(11 * Xa + h % 5), f[Za].push(11 * Xa + (h + 1) % 5); if (1 == c || 2 == c) { f[Za].push(11 * Xa + 10); for (var y = 1; 5 > y; y++)f[Za].push(11 * Xa + (h + y) % 5 + 5); for (y = 2; 5 > y; y++)f[Za].push(11 * Xa + (h + y) % 5); y = 4 - Za; var x = a[b]; Xa = w[x][y]; h = w[Xa].indexOf(x); f[Za].push(11 * x + y); f[Za].push(11 * x + y + 5); f[Za].push(11 * Xa + 10); for (y = 0; 5 > y; y++)f[Za].push(11 * Xa + (h + y) % 5 + 5), f[Za].push(11 * Xa + (h + y) % 5) }
                        } for (Za = 0; Za < f[0].length; Za++)mathlib.acycle(n, [f[0][Za], f[1][Za], f[2][Za],
                        f[3][Za], f[4][Za]], e)
                    }
                }, oppFace: a, adjFaces: w
            }
        }(); Na.prototype.permMult = function (a, w) { for (var n = [], b = 0; b < a.length; b++)n[b] = w[a[b]]; return n }; Na.prototype.permInv = function (a) { for (var b = [], n = 0; n < a.length; n++)b[a[n]] = n; return b }; Na.prototype.isMember = function (a, b) { b = b || 0; for (var n = a.length - 1; n >= b; n--) { var w = a[n]; if (!this.sgs[n][w]) return !1; w !== n && (a = this.permMult(a, this.sgsi[n][w])) } return !0 }; Na.prototype.minkwitz = function () {
            var a = [], b = 8, n = 0; this.words = []; this.isNew = []; for (var e = 0; e < this.e.length; e++) {
                this.words[e] =
                []; this.words[e][e] = []; this.isNew[e] = []; for (var c = 0; c < e; c++)this.sgs[e][c] && !this.words[e][c] && (this.words[e][c] = null, n++)
            } this.invMap = {}; for (e = 0; e < this.gen.length; e++) { var f = this.gen[e]; for (c = e; c < this.gen.length; c++) { for (var h = !0, y = 0; y < this.e.length; y++)if (f[this.gen[c][y]] != y) { h = !1; break } h && (this.invMap[e] = c, this.invMap[c] = e) } void 0 == this.invMap[e] && (this.invMap[e] = ~e, this.invMap[~e] = e) } var x = function (a, n) {
                for (var w = -1, e = a.length - 1; 0 <= e; e--) {
                    var c = a[e]; if (!this.sgs[e][c]) return -2; if (!this.words[e][c]) return this.words[e][c] =
                        n, this.isNew[e][c] = 3, this.sgs[e][c] = a, this.sgsi[e][c] = this.permInv(a), 1; n.length < this.words[e][c].length && (w = this.sgs[e][c], this.sgs[e][c] = a, this.sgsi[e][c] = this.permInv(a), a = w, w = this.words[e][c], this.words[e][c] = n, this.isNew[e][c] = 3, n = w, w = 0); if (n.length + this.words[e][c].length > b) return w; a = this.permMult(a, this.sgsi[e][c]); for (var f = this.words[e][c].length - 1; 0 <= f; f--)n.push(this.invMap[this.words[e][c][f]])
                }
            }, Pa = function (b, w, e) {
                if (0 >= w) return e.call(this, b, a); for (var c = 0; c < this.gen.length && 0 < n; c++) {
                    a.push(c);
                    var f = Pa.call(this, this.permMult(b, this.gen[c]), w - 1, e); a.pop(); 0 > f || (a.push(this.invMap[c]), Pa.call(this, this.permMult(b, this.permInv(this.gen[c])), w - 1, e), a.pop())
                }
            }, ab = function () {
                for (var a = 0, w = 0, e = 0; e < this.e.length; e++)for (var c = 0; c < e; c++)0 < this.isNew[e][c] && this.isNew[e][c]--, this.isNew[e][c] && w++; console.log("newCnt", w); for (e = 0; e < this.e.length; e++) {
                    w = !0; for (c = 0; c < e; c++)if (this.sgs[e][c] && !this.words[e][c]) { w = !1; break } for (c = 0; c < e; c++)if (this.words[e][c]) for (var f = e; f < this.e.length; f++)if (!w || e ==
                        f) for (var Sa = e == f ? c : 0; Sa < f; Sa++)if (this.words[f][Sa]) { var Za = this.words[e][c].length + this.words[f][Sa].length; if (!(Za > b || 0 == this.isNew[e][c] && 0 == this.isNew[f][Sa] && e == f)) { var Xa = this.sgs[e][c][this.sgs[f][Sa][e]]; this.words[e][Xa] && this.words[e][Xa].length < 1.5 * Za && e != f || (Za = x.call(this, this.permMult(this.sgs[f][Sa], this.sgs[e][c]), this.words[f][Sa].concat(this.words[e][c])), -1 < Za && a++, 0 < Za && n--) } }
                } return a
            }; c = $.now(); var Va = 0; for (e = 1; 100 > e && 0 < n; e++)Pa.call(this, this.e, e, function (a, e) {
                var w = x.call(this,
                    a, e.slice()); Va++; 0 < w && n--; if (0 == Va % 1E3) { var c = ab.call(this); b = Math.round(1.25 * b); console.log(c, n, b) } return w
            }); console.log("final", $.now() - c); ab.call(this); console.log("init minkwitz", $.now() - c); window.sgs1 = this
        }; Na.prototype.getGen = function (a) { for (var e = [], n = a.length - 1; 0 <= n; n--) { var b = a[n]; if (!this.sgs[n][b]) return null; b !== n && (a = this.permMult(a, this.sgsi[n][b]), e.push(this.words[n][b])) } return e.reverse() }; Na.prototype.knutha = function (a, e) {
            this.Tk[a].push(e); for (var n = 0; n < this.sgs[a].length; n++)this.sgs[a][n] &&
                this.knuthb(a, this.permMult(this.sgs[a][n], e))
        }; Na.prototype.knuthb = function (a, e) { var n = e[a]; if (this.sgs[a][n]) n = this.permMult(e, this.sgsi[a][n]), this.isMember(n) || this.knutha(a - 1, n); else for (this.sgs[a][n] = e, this.sgsi[a][n] = this.permInv(e), n = 0; n < this.Tk[a].length; n++)this.knuthb(a, this.permMult(e, this.Tk[a][n])) }; Na.prototype.size = function () { for (var a = this.sgs.length, e = 1, n = 0; n < a; n++) { for (var b = 0, c = 0; c < a; c++)this.sgs[n][c] && b++; e *= b } return e }; Na.prototype.intersect = function (a, e) {
            if (this.size() > a.size()) return a.intersect(this,
                e); e = e || 1E5; for (var n = new Na([this.sgs[0][0]]), b = this.sgs.length, w = n.cnt = 0; w < b; w++)for (var c = 0; c < w; c++)if (this.sgs[w][c] && !n.sgs[w][c] && (this.enumDFS(w - 1, this.sgs[w][c], function (a) { n.knutha(b - 1, a); return !0 }, function (b, w) { if (n.cnt > e || -1 == n.cnt) return n.cnt = -1, !1; n.cnt++; if (!a.isMember(w, b)) return !1; for (var c = 0; c < n.sgs[b].length - 1; c++)if (n.sgs[b][c] && n.permMult(w, n.sgs[b][c])[b] < w[b]) return !1; return !0 }), -1 == n.cnt)) return n; return n
        }; Na.prototype.enumDFS = function (a, e, n, b) {
            if (!b || b(a + 1, e)) {
                if (0 == a) return n(e);
                for (var w = 0; w <= a; w++)if (this.sgs[a][w]) { var c = this.enumDFS(a - 1, this.permMult(this.sgs[a][w], e), n, b); if (c) return c }
            }
        }; Na.prototype["enum"] = function (a) { this.enumDFS(this.sgs.length - 1, this.sgs[0][0], a) }; Na.prototype.rndElem = function () { for (var a = this.e.slice(), e = this.e.length - 1; 0 <= e; e--) { for (var n = 0, b = 0, c = 0; c <= e; c++)this.sgs[e][c] && 1 > Ra(++n) && (b = c); b !== e && (a = this.permMult(a, this.sgsi[e][b])) } return a }; db = x.prototype; db.search = function (a, e, n) {
            n = (n || 99) + 1; if (!this.inited) {
                this.move = []; this.prun = []; for (var b =
                    0; b < this.N_STATES; b++) { var w = this.state_params[b], c = w[0], f = w[1], h = w[2], y = w[3]; w = w[4]; this.move[b] = []; this.prun[b] = []; bb(this.move[b], h, f, this.N_MOVES); Qa(this.prun[b], c, h, y, this.move[b], this.N_MOVES, this.N_POWER, w) } this.inited = !0
            } for (this.sol = []; e < n && !this.idaSearch(a, e, -1); e++); return e == n ? null : this.sol.reverse()
        }; db.toStr = function (a, e, n) { for (var b = [], w = 0; w < a.length; w++)b.push(e[a[w][0]] + n[a[w][1]]); return b.join(" ").replace(/ +/g, " ") }; db.idaSearch = function (a, e, n) {
            for (var b = this.N_STATES, w = 0; w <
                b; w++)if (r(this.prun[w], a[w]) > e) return !1; if (0 == e) return !0; for (var c = a[0] + e + n + 1, f = 0; f < this.N_MOVES; f++) { var h = (f + c) % this.N_MOVES; if (h != n) for (var y = a.slice(), Xa = 0; Xa < this.N_POWER; Xa++) { for (w = 0; w < b; w++)y[w] = this.move[w][h][y[w]]; if (this.idaSearch(y, e - 1, h)) return this.sol.push([h, Xa]), !0 } } return !1
        }; db = Ua.prototype; db.initPrun = function () {
            if (0 == this.moveTables.length) for (var a = 0; a < this.prunHashs.length; a++) {
                for (var e = {}, n = [null], b = [], c = 0; c < this.solvedStates.length; c++) {
                    var f = this.prunHashs[a](this.solvedStates[c]);
                    f in e || (e[f] = n.length << 8, n.push(f))
                } c = 1; for (var h = 0, y = +new Date; c != n.length;) { f = n[c]; var x = (e[f] & 255) + 1; x != h && (DEBUG && console.log("[phSolver] initPrun", h, n.length - 1, +new Date - y), h = x, b.push(n.length - 1)); for (var Pa = [], ab = 0; ab < this.movesList.length; ab++) { var Va = this.doMove(f, this.movesList[ab][0]); Va && (Va in e || (e[Va] = n.length << 8 | x, n.push(Va)), Pa[ab] = e[Va] >> 8) } n[c] = Pa; c++ } this.moveTables[a] = n; this.prunTables[a] = b; this.state2Idxs[a] = e
            }
        }; db.search = function (a, e, n) {
            this.initPrun(); this.sol = []; this.subOpt =
                !1; this.rawState = a; this.state = []; for (var b = 0; b < this.prunHashs.length; b++) { var c = this.prunHashs[b](a); this.state.push(this.state2Idxs[b][c] >> 8) } this.visited = {}; this.maxl = e || 0; return this.searchNext(n)
        }; db.searchNext = function (a, e) { this.initPrun(); a = a + 1 || 99; this.prevSolStr = this.solArr ? this.solArr.join(",") : null; this.solArr = null; for (this.cost = e || -1; this.maxl < a; this.maxl++) { if (0 == this.cost) return null; if (this.idaSearch(this.state, this.maxl, null, 0)) break } return this.solArr }; db.idaSearch = function (a, e, n,
            b) {
                if (this.getPruning(a) > e) return !1; if (0 == e) { e = this.rawState; var c = [], w = []; for (n = 0; n < this.sol.length; n++) { var f = this.movesList[this.sol[n]][0]; e = this.doMove(e, f); c.push(f); w.push(e); if (!this.subOpt && e in this.visited && this.visited[a] < b) return !1 } if (-1 == this.solvedStates.indexOf(e)) return !1; for (n = 0; n < w.length; n++)this.visited[w[n]] = n; this.subOpt = !0; if (c.join(",") == this.prevSolStr) return !1; this.solArr = c; return !0 } if (0 <= this.cost) { if (0 == this.cost) return !0; this.cost-- } c = null == n ? "" : this.movesList[n][0];
            w = null == n ? -1 : this.movesList[n][1]; for (var Sa = this.sol[b] || 0; Sa < this.movesList.length; Sa++)if (f = this.movesList[Sa], n = f[1] ^ w, f = f[0], !(0 == n || 0 == (n & 15) && f <= c)) { f = !1; var h = !0, y = []; for (n = 0; n < a.length; n++) { var x = this.moveTables[n][a[n]][Sa]; if (x) x != a[n] && (h = !1); else { f = !0; break } y.push(x) } if (!(f || h && !this.isPartial)) { this.sol[b] = Sa; if (this.idaSearch(y, e - 1, Sa, b + 1)) return !0; this.sol.pop() } } return !1
        }; db.getPruning = function (a) { for (var e = 0, n = 0; n < a.length; n++)for (var b = this.prunTables[n]; b[e] < a[n];)e++; return e };
    db = Wa.prototype; db.calcNumOfStates = function () {
        for (var a = this.solvedStates[0].length, e = [], n = 0; n < this.movesList.length; n++) { for (var b = [], c = 0; c < a; c++)b.push(c + 32); var f = this.doMove(String.fromCharCode.apply(null, b), this.movesList[n][0]); if (f && !(f in this.prunTable)) { for (c = 0; c < a; c++)b[c] = f.charCodeAt(c) - 32; e.push(b) } } n = []; b = this.solvedStates[0]; var h = []; for (c = 0; c < a; c++)h[c] = c; var y = []; for (c = 0; c < a; c++)if (!y[c]) for (f = c + 1; f < a; f++)if (b[c] == b[f] && c % 9 % 2 == f % 9 % 2) { var x = h.slice(); x[c] = f; x[f] = c; y[f] = 1; n.push(x) } for (b =
            0; 100 > b; b++) { var Pa = []; for (c = 0; c < a; c++)Pa[c] = c; for (c = 0; c < a; c++) { f = ~~(Math.random() * (a - c)) + c; var ab = Pa[c]; Pa[c] = Pa[f]; Pa[f] = ab } ab = new Na(n, Pa); Pa = new Na(e, Pa); var Va = ab.intersect(Pa); if (-1 != Va.cnt) { console.log(b); break } } console.log(Va.cnt, ab.size(), Pa.size(), Va.size(), Pa.size() / Va.size())
    }; db.updatePrun = function (a) {
        a = void 0 === a ? this.prunDepth + 1 : a; for (var e = this.prunDepth + 1; e <= a; e++) {
            if (this.prevSize >= this.MAX_PRUN_SIZE) { DEBUG && console.log("[gSolver] skipPrun", e, this.prunTableSize); break } var n = +new Date;
            if (1 > e) for (var b = this.prevSize = 0; b < this.solvedStates.length; b++) { var c = this.solvedStates[b]; c in this.prunTable || (this.prunTable[c] = e, this.prunTableSize++) } else this.updatePrunBFS(e - 1); if (0 == this.cost) break; this.prunDepth = e; DEBUG && console.log("[gSolver] updatePrun", e, this.prunTableSize - this.prevSize, +new Date - n); this.prevSize = this.prunTableSize
        }
    }; db.updatePrunBFS = function (a) {
        if (null == this.toUpdateArr) { this.toUpdateArr = []; for (var e in this.prunTable) this.prunTable[e] == a && this.toUpdateArr.push(e) } for (; 0 !=
            this.toUpdateArr.length;) { e = this.toUpdateArr.pop(); for (var n = 0; n < this.movesList.length; n++) { var b = this.doMove(e, this.movesList[n][0]); !b || b in this.prunTable || (this.prunTable[b] = a + 1, this.prunTableSize++) } if (0 <= this.cost) { if (0 == this.cost) return; this.cost-- } } this.toUpdateArr = null
    }; db.search = function (a, e, n) { this.sol = []; this.subOpt = !1; this.state = a; this.visited = {}; this.maxl = e || 0; return this.searchNext(n) }; db.searchNext = function (a, e) {
        a = a + 1 || 99; this.prevSolStr = this.solArr ? this.solArr.join(",") : null; this.solArr =
            null; for (this.cost = e || -1; this.maxl < a; this.maxl++) { this.updatePrun(Math.ceil(this.maxl / 2)); if (0 == this.cost) return null; if (this.idaSearch(this.state, this.maxl, null, 0)) break } return this.solArr
    }; db.getPruning = function (a) { a = this.prunTable[a]; return void 0 === a ? this.prunDepth + 1 : a }; db.idaSearch = function (a, e, n, b) {
        if (this.getPruning(a) > e) return !1; if (0 == e) { if (-1 == this.solvedStates.indexOf(a)) return !1; a = this.getSolArr(); this.subOpt = !0; if (a.join(",") == this.prevSolStr) return !1; this.solArr = a; return !0 } if (!this.subOpt) {
            if (a in
                this.visited && this.visited[a] < b) return !1; this.visited[a] = b
        } if (0 <= this.cost) { if (0 == this.cost) return !0; this.cost-- } var c = null == n ? "" : this.movesList[n][0]; n = null == n ? -1 : this.movesList[n][1]; for (var w = this.sol[b] || 0; w < this.movesList.length; w++) { var f = this.movesList[w], h = f[1] ^ n; f = f[0]; if (!(0 == h || 0 == (h & 15) && f <= c) && (h = this.doMove(a, f)) && h != a) { this.sol[b] = w; if (this.idaSearch(h, e - 1, w, b + 1)) return !0; this.sol.pop() } } return !1
    }; db.getSolArr = function () {
        for (var a = [], e = 0; e < this.sol.length; e++)a.push(this.movesList[this.sol[e]][0]);
        return a
    }; var Ya = function () { function a(a, c) { if (c && (c != b || n > a)) { for (var w = [], f = 0; f < c.length; f++)w[f] = c.charCodeAt(f); e = new MersenneTwisterObject(w[0], w); n = 0; b = c } for (; n < a;)e(), n++ } var e, n, b; a(0, "" + (new Date).getTime()); return { random: function () { n++; return e() }, getSeed: function () { return [n, b] }, setSeed: a } }(), fb = /^\s*(\d+)-(\d+)-(\d+) (\d+):(\d+):(\d+)\s*$/; Math.TAU = 2 * Math.PI; return {
        Cnk: $a, fact: Va, getPruning: r, setNPerm: function (a, e, n) {
            var b, c; a[n - 1] = 0; for (b = n - 2; 0 <= b; --b)for (a[b] = e % (n - b), e = ~~(e / (n - b)), c =
                b + 1; c < n; ++c)a[c] >= a[b] && ++a[c]
        }, getNPerm: b, getNParity: e, get8Perm: a, set8Perm: Pa, coord: f, createMove: bb, edgeMove: function (a, e) { 0 == e ? c(a, 0, 7, 8, 4, 1) : 1 == e ? c(a, 3, 6, 11, 7, 0) : 2 == e ? c(a, 0, 1, 2, 3, 0) : 3 == e ? c(a, 2, 5, 10, 6, 1) : 4 == e ? c(a, 1, 4, 9, 5, 0) : 5 == e && c(a, 11, 10, 9, 8, 0) }, circle: Oa, circleOri: c, acycle: z, schreierSims: Na, createPrun: Qa, CubieCube: h, minx: y, SOLVED_FACELET: "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB", fillFacelet: function (a, e, n, b, c) {
            for (var w = 0; w < a.length; w++)for (var f = 0; f < a[w].length; f++)e[a[w][(f +
                b[w]) % a[w].length]] = ~~(a[n[w]][f] / c)
        }, rn: Ra, rndEl: function (a) { return a[~~(Ya.random() * a.length)] }, rndProb: function (a) { for (var e = 0, n = 0, b = 0; b < a.length; b++)0 != a[b] && (Ya.random() < a[b] / (e + a[b]) && (n = b), e += a[b]); return n }, rndHit: function (a) { return Ya.random() < a }, time2str: function (a, e) {
            if (!a) return "N/A"; var b = new Date(1E3 * a); return (e || "%Y-%M-%D %h:%m:%s").replace("%Y", b.getFullYear()).replace("%M", ("0" + (b.getMonth() + 1)).slice(-2)).replace("%D", ("0" + b.getDate()).slice(-2)).replace("%h", ("0" + b.getHours()).slice(-2)).replace("%m",
                ("0" + b.getMinutes()).slice(-2)).replace("%s", ("0" + b.getSeconds()).slice(-2))
        }, str2time: function (a) { a = fb.exec(a); if (!a) return null; var e = new Date(0); e.setFullYear(~~a[1]); e.setMonth(~~a[2] - 1); e.setDate(~~a[3]); e.setHours(~~a[4]); e.setMinutes(~~a[5]); e.setSeconds(~~a[6]); return ~~(e.getTime() / 1E3) }, obj2str: function (a) { return "string" == typeof a ? a : JSON.stringify(a) }, str2obj: function (a) { return "string" != typeof a ? a : JSON.parse(a) }, valuedArray: function (a, e) { for (var b = [], c = 0; c < a; c++)b[c] = e; return b }, idxArray: function (a,
            e) { for (var b = [], c = 0; c < a.length; c++)b.push(a[c][e]); return b }, Solver: x, rndPerm: function (a, e) { for (var b = 0, c = [], f = 0; f < a; f++)c[f] = f; for (f = 0; f < a - 1; f++) { var w = Ra(a - f); Oa(c, f, f + w); b ^= 0 != w } e && b && Oa(c, 0, 1); return c }, gSolver: Wa, phSolver: Ua, getSeed: Ya.getSeed, setSeed: Ya.setSeed
    }
}(); var sbtree = function () {
    function c(e, a, c, f) { this.k = e; this.v = a; this.left = c || b; this.right = f || b; this.size = 1; this.sum = e; this.sk2 = Math.pow(e, 2) } function Oa(e) { this.root = b; this.cmp = e } function z(e, a, c) { return e == b || z(e.get(c), a, c) && a(e) && z(e.get(c ^ 1), a, c) } function r(e, a) { var b = e.get(a ^ 1); e.set(a ^ 1, b.get(a)); b.set(a, e); b.size = e.size; e.size = e.get(0).size + e.get(1).size + 1; b.sum = e.sum; e.sum = e.get(0).sum + e.get(1).sum + e.k; b.sk2 = e.sk2; e.sk2 = e.get(0).sk2 + e.get(1).sk2 + Math.pow(e.k, 2); return b } var b = null; b = new c(0, 0);
    b.left = b; b.right = b; b.size = 0; c.prototype.get = function (e) { return e ? this.right : this.left }; c.prototype.set = function (e, a) { e ? this.right = a : this.left = a }; Oa.prototype.find = function (e) { for (var a = this.root; a != b;) { if (e == a.k) return a.v; a = a.get(0 > this.cmp(a.k, e) ^ 0) } }; Oa.prototype.cumSum = function (e) { if (e >= this.root.size || 0 == this.root.size) return this.root.sum; for (var a = this.root, b = 0; 0 < e;) { var c = a.get(0).size; if (e < c) a = a.get(0); else { b += a.get(0).sum; if (e == c) break; b += a.k; e -= c + 1; a = a.get(1) } } return b }; Oa.prototype.cumSk2 =
        function (e) { if (e >= this.root.size || 0 == this.root.size) return this.root.sk2; for (var a = this.root, b = 0; 0 < e;) { var c = a.get(0).size; if (e < c) a = a.get(0); else { b += a.get(0).sk2; if (e == c) break; b += Math.pow(a.k, 2); e -= c + 1; a = a.get(1) } } return b }; Oa.prototype.rank = function (e) { for (var a = this.root; a != b;) { var c = a.get(0).size; if (e < c) a = a.get(0); else { if (e == c) return a.k; e -= c + 1; a = a.get(1) } } return 0 > e ? -1E300 : 1E300 }; Oa.prototype.rankOf = function (e) {
            for (var a = this.root, c = 0; a != b;)0 > this.cmp(a.k, e) ? (c += a.get(0).size + 1, a = a.get(1)) : a =
                a.get(0); return c
        }; Oa.prototype.traverse = function (e, a) { return z(this.root, e, a ^ 0) }; Oa.prototype.insertR = function (e, a, Pa) { if (e == b) return new c(a, Pa); e.size += 1; e.sum += a; e.sk2 += Math.pow(a, 2); var f = 0 > this.cmp(e.k, a) ^ 0; e.set(f, this.insertR(e.get(f), a, Pa)); e.get(f).get(f).size > e.get(f ^ 1).size ? e = r(e, f ^ 1) : e.get(f).get(f ^ 1).size > e.get(f ^ 1).size && (f ^= 1, e.set(f ^ 1, r(e.get(f ^ 1), f ^ 1)), e = r(e, f)); return e }; Oa.prototype.insert = function (e, a) { this.root = this.insertR(this.root, e, a); return this }; Oa.prototype.remove = function (e) {
            this.root =
            this.removeR(this.root, e); return this
        }; Oa.prototype.removeR = function (e, a) { if (e == b) return b; --e.size; e.sum -= a; e.sk2 -= Math.pow(a, 2); if (e.k == a) { if (e.get(0) == b || e.get(1) == b) return e.get(e.get(0) == b ^ 0); for (var c = e.get(0); c.get(1) != b;)c = c.get(1); e.k = c.k; e.v = c.v; a = c.k } c = 0 > this.cmp(e.k, a) ^ 0; e.set(c, this.removeR(e.get(c), a)); return e }; return { tree: function (e) { return new Oa(e) } }
}(); var SQLFile = execMain(function () {
    function c(c, r, b) { var e = 0; if (b) for (var a = 0; a < b; a++)e = e << 8 | c[r[0]++]; else { do e = e << 7 | c[r[0]] & 127; while (128 <= c[r[0]++]) } return e } function Oa(z, r, b) {
        r = 1 == r ? 100 : (r - 1) * c(z, [16], 2); var e = z[r], a = z[r + 3] << 8 | z[r + 4], Pa = [r + 8], f = -1; e & 8 || (f = c(z, Pa, 4)); for (var bb = 0; bb < a; bb++) {
            var h = [(100 == r ? 0 : r) + c(z, [Pa[0] + 2 * bb], 2)]; if (2 != e && 10 != e) if (5 == e) h = c(z, h, 4), Oa(z, h, b); else if (13 == e) {
                var Na = c(z, h), Qa = z, x = h[0], Ta = b, Ua = [x], Wa = c(Qa, Ua), Ra = x + Wa; x = Ua; Ua = []; for (Wa = []; x[0] < Ra;)Ua.push(c(Qa, x)); for (Ra =
                    0; Ra < Ua.length; Ra++) { var $a = Ua[Ra]; 0 == $a ? Wa[Ra] = null : 1 <= $a && 4 >= $a ? Wa[Ra] = c(Qa, x, $a) : 5 == $a ? (Wa[Ra] = void 0, c(Qa, x, 6)) : 6 == $a ? (Wa[Ra] = void 0, c(Qa, x, 8)) : 7 == $a ? (Wa[Ra] = void 0, c(Qa, x, 8)) : 8 == $a ? Wa[Ra] = 0 : 9 == $a ? Wa[Ra] = 1 : 10 != $a && 11 != $a && (0 == Ua[Ra] % 2 ? (Wa[Ra] = Qa.slice(x[0], x[0] + ($a - 12) / 2), x[0] += ($a - 12) / 2) : (Wa[Ra] = String.fromCharCode.apply(null, Qa.slice(x[0], x[0] + ($a - 13) / 2)), x[0] += ($a - 13) / 2)) } Ta(Wa); h[0] += Na
            }
        } -1 != f && Oa(z, f, b)
    } return {
        loadTableList: function (c) { var r = {}; Oa(c, 1, function (b) { r[b[2]] = [b[3], b[4]] }); return r },
        loadPage: Oa
    }
}); var TimerDataConverter = execMain(function () {
    function c(b) { try { return decodeURIComponent(escape(b)) } catch (e) { } return b } function Oa(b, e) { b = c(b).split(/\r?\n/g); for (var a = [], Pa = [], f = [], r = 0, h = 0; h < b.length; h++) { for (var Na = b[h].split(e), Qa = 0; Qa < Na.length; Qa++)f.push(Na[Qa]), r += (Na[Qa].match(/"/g) || []).length, 0 == r % 2 && (f = f.join(","), '"' == f[0] && (f = f.replace(/""/g, '"').slice(1, -1)), Pa.push(f), f = []); 0 == r % 2 && (a.push(Pa), Pa = [], f = [], r = 0) } return a } var z = /^(DNF)?\(?(\d*?):?(\d*?):?(\d*\.?\d*?)(\+)?\)?$/, r = {
        csTimer: [/^{"session1"/i,
            function (b) {
                b = JSON.parse(c(b)); var e = {}; try { e = mathlib.str2obj(mathlib.str2obj(b.properties).sessionData) } catch (Ta) { } var a = [], Pa; for (Pa in b) {
                    var f = /^session(\d+)$/.exec(Pa); if (f) {
                        var r = {}, h = []; try { h = mathlib.str2obj(b[Pa]) } catch (Ta) { } if ($.isArray(h) && 0 != h.length) {
                            for (var Na = [], Qa = 0; Qa < h.length; Qa++) { var x = h[Qa]; $.isArray(x) && $.isArray(x[0]) && (x[0] = $.map(x[0], Number), Na.push(x)) } r.times = Na; ~~f[1] in e ? (h = e[~~f[1]], r.name = h.name || f[1], r.opt = h.opt || { scrType: h.scr || "333", phases: h.phases || 1 }, r.rank = h.rank) :
                                (r.name = f[1], r.opt = {}, r.rank = a.length + 1); a.push(r)
                        }
                    }
                } a.sort(function (a, e) { return a.rank - e.rank }); return a
            }], csTimerCSV: [/^No\.;Time;Comment;Scramble;Date;P\.1/i, function (b) {
                b = Oa(b, ";"); for (var e = [], a = b[0].length - 5, c = 1; c < b.length; c++) {
                    var f = b[c], r = [], h = z.exec(f[1]); if (h) {
                        for (r[0] = h[1] ? -1 : h[5] ? 2E3 : 0; "" == f[f.length - 1];)f.pop(); for (var Na = 5; Na < f.length; Na++)h = z.exec(f[Na]), h = Math.round(36E5 * ~~h[2] + 6E4 * ~~h[3] + 1E3 * parseFloat(h[4])), r[f.length - Na] = (r[f.length - Na + 1] || 0) + h; r = [r, f[3], f[2], mathlib.str2time(f[4])];
                        e.push(r)
                    } else console.log("Invalid data detected")
                } return [{ name: "import", opt: { phases: a }, times: e }]
            }], ZYXTimer: [/^Session: /i, function (b) { }], TwistyTimer: [/^Puzzle,Category,Time\(millis\),Date\(millis\),Scramble,Penalty,Comment/i, function (b) {
                b = Oa(b, ";"); for (var e = { 333: "333", 222: "222so", 444: "444wca", 555: "555wca", pyra: "pyrso", skewb: "skbso", mega: "mgmp", sq1: "sqrs", clock: "clkwca", 666: "666wca", 777: "777wca" }, a = {}, c = [], f = 1; f < b.length; f++) {
                    var r = b[f]; if (7 == r.length) {
                        var h = r[0] + "-" + r[1], Na = [{ 0: 0, 1: 2E3, 2: -1 }[r[5]],
                        Math.round(r[2])]; h in a || (a[h] = c.length, c.push({ name: h, opt: { scrType: e[r[0]] || "333" }, times: [] })); c[a[h]].times.push([Na, r[4], r[6], Math.round(r[3] / 1E3)])
                    }
                } return c
            }], BlockKeeper: [/^{"puzzles":\[{"name":/i, function (b) {
                b = JSON.parse(c(b)).puzzles; var e = { "3x3x3": "333", "2x2x2": "222so", "4x4x4": "444wca", "5x5x5": "555wca", Pyraminx: "pyrso", Skewb: "skbso", Megaminx: "mgmp", "Square-1": "sqrs", Clock: "clkwca", "6x6x6": "666wca", "7x7x7": "777wca", "3x3x3 BLD": "333ni", "4x4x4 BLD": "444bld", "5x5x5 BLD": "555bld" }, a = []; $.each(b,
                    function (b, c) { var f = c.name, h = c.scrambler, Pa = c.splits; $.each(c.sessions, function (b, c) { var x = c.name, Na = []; $.each(c.records, function (a, e) { var b = [{ OK: 0, "+2": 2E3, DNF: -1 }[e.result], Math.round(1E3 * e.time)]; Array.prototype.push.apply(b, $.map(e.split.reverse(), function (a) { return Math.round(1E3 * a) })); Na.push([b, e.scramble, e.comment || "", Math.round(e.date / 1E3)]) }); 0 != Na.length && a.push({ name: f + "-" + x, opt: { phases: Pa, scrType: e[h] || "333" }, times: Na }) }) }); return a
            }], PrismaTimer: [/^[^\t\n]*(\t[^\t\n]*){4}\n/i, function (b) { }],
        "DCTimer.raw": [/^\d+[\r\n]+[^\t\n]*(\t[^\t\n]*){11}[\r\n]+/i, function (b) { b = c(b).split(/[\r\n]+/); for (var e = {}, a = 0, Pa = [], f = 0; f < b.length; f++)if (/^\d+$/.exec(b[f])) a = ~~b[f], e[a] = Pa.length, Pa.push({ name: a, opt: {}, times: [] }); else { var r = b[f].split("\t"); 6 > r.length || Pa[e[a]].times.push([["1" == r[2] ? "1" == r[1] ? 2E3 : 0 : -1, ~~r[0]], r[3], r[5], mathlib.str2time(r[4])]) } return Pa }], "DCTimer.sqlite": [/^SQLite format 3\0/i, function (b) {
            for (var e = new Uint8Array(b.length), a = 0; a < b.length; a++)e[a] = b.charCodeAt(a); b = SQLFile.loadTableList(e);
            var Pa = {}, f = [], r = function (a, e) { a in Pa || (Pa[a] = f.length, f.push({ name: e || a + 1, opt: {}, times: [] })) }; SQLFile.loadPage(e, b.sessiontb[0], function (a) { r(a[0], c(a[1])) }); for (var h in b) if (a = /^result(\d+|tb)$/.exec(h)) { var Na = ("tb" == a[1] ? 1 : ~~a[1]) - 1; SQLFile.loadPage(e, b[h][0], function (a) { r(Na); f[Pa[Na]].times.push([["1" == a[3] ? "1" == a[2] ? 2E3 : 0 : -1, ~~a[1]], c(a[4] || ""), c(a[6] || ""), mathlib.str2time(a[5])]) }) } SQLFile.loadPage(e, b.resultstb[0], function (a) {
                var e = a[1]; r(e); f[Pa[e]].times.push([["1" == a[4] ? "1" == a[3] ? 2E3 :
                    0 : -1, ~~a[2]], c(a[5] || ""), c(a[7] || ""), mathlib.str2time(a[6])])
            }); return f
        }], "mateus.cubetimer": [/^"Category";"Time \(MM:SS\.SSS\)";"Scrambler";"Date";"Penalty \+2 \(yes or no\)";"DNF \(yes or no\)";"Section"\n/i, function (b) {
            b = Oa(b, ";"); for (var e = {
                "3x3x3": "333", "2x2x2": "222so", "4x4x4": "444wca", "5x5x5": "555wca", Pyraminx: "pyrso", Skewb: "skbso", Megaminx: "mgmp", "Square-1": "sqrs", "Rubik's Clock": "clkwca", "6x6x6": "666wca", "7x7x7": "777wca", "3x3x3 Blindfolded": "333ni", "4x4x4 Blindfolded": "444bld", "5x5x5 Blindfolded": "555bld",
                "3x3x3 One-Handed": "333oh", "3x3x3 Multi-Blindfolded": "r3ni", "3x3x3 With Feet": "333ft", "3x3x3 Fewest Moves": "333fm"
            }, a = {}, c = [], f = 1; f < b.length; f++) { var r = b[f]; if (!(7 > r.length)) { var h = r[0] + "-" + r[6], Na = z.exec(r[1]); if (Na) { Na = Math.round(36E5 * ~~Na[2] + 6E4 * ~~Na[3] + 1E3 * parseFloat(Na[4])); var Qa = r[2], x = 0; "yes" == r[5] ? x = -1 : "yes" == r[4] && (x = 2E3); h in a || (a[h] = c.length, c.push({ name: h, opt: { scrType: e[r[0]] || "333" }, times: [] })); c[a[h]].times.push([[x, Na], Qa, "", mathlib.str2time(r[3] + ":00")]) } else console.log("Invalid data detected") } } return c
        }],
        "CubeDesk.new": [/^{"sessions":\[/i, function (b) {
            b = JSON.parse(c(b)); var e = {}, a = {}; $.each(b.sessions, function (b, c) { e[c.id] = c.name; a[c.id] = c.order }); var Pa = { 222: "222so", 333: "333", 444: "444wca", 555: "555wca", pyram: "pyrso", skewb: "skbso", minx: "mgmp", sq1: "sqrs", clock: "clkwca", 666: "666wca", 777: "777wca", "333mirror": "333", "222oh": "222so", "333oh": "333oh", "333bl": "333ni" }, f = [], r = {}; $.each(b.solves, function (b, c) {
                var h = c.session_id + "-" + c.cube_type; h in r || (r[h] = f.length, f.push({
                    name: (e[c.session_id] || c.session_id) +
                        "-" + c.cube_type, opt: { scrType: Pa[c.cube_type] || "333" }, rank: a[c.session_id], times: []
                })); h = f[r[h]]; var x = 0; c.dnf ? x = -1 : c.plus_two && (x = 2E3); h.times.push([[x, 1E3 * c.raw_time], c.scramble, c.notes || "", Math.round(c.started_at / 1E3)]); (x = Pa[c.cube_type]) && (h.opt.scrType = x)
            }); $.each(f, function (a, e) { e.times.sort(function (a, e) { return a[3] - e[3] }) }); f.sort(function (a, e) { return a.rank - e.rank }); return f
        }]
    }; return function (b) {
        var e = void 0, a; for (a in r) if (r[a][0].exec(b)) {
            console.log("try read by " + a); try {
                e = r[a][1](b);
                break
            } catch (Pa) { console.log(Pa) }
        } return e
    }
}); var LZString = function () {
    function c(b, e) { if (!z[b]) { z[b] = {}; for (var a = 0; a < b.length; a++)z[b][b.charAt(a)] = a } return z[b][e] } var Oa = String.fromCharCode, z = {}, r = {
        compressToBase64: function (b) { if (null == b) return ""; b = r._compress(b, 6, function (e) { return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(e) }); switch (b.length % 4) { default: case 0: return b; case 1: return b + "==="; case 2: return b + "=="; case 3: return b + "=" } }, decompressFromBase64: function (b) {
            return null == b ? "" : "" == b ? null : r._decompress(b.length,
                32, function (e) { return c("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", b.charAt(e)) })
        }, compressToUTF16: function (b) { return null == b ? "" : r._compress(b, 15, function (e) { return Oa(e + 32) }) + " " }, decompressFromUTF16: function (b) { return null == b ? "" : "" == b ? null : r._decompress(b.length, 16384, function (e) { return b.charCodeAt(e) - 32 }) }, compressToUint8Array: function (b) { b = r.compress(b); for (var e = new Uint8Array(2 * b.length), a = 0, c = b.length; a < c; a++) { var f = b.charCodeAt(a); e[2 * a] = f >>> 8; e[2 * a + 1] = f % 256 } return e },
        decompressFromUint8Array: function (b) { if (null === b || void 0 === b) return r.decompress(b); for (var e = Array(b.length / 2), a = 0, c = e.length; a < c; a++)e[a] = 256 * b[2 * a] + b[2 * a + 1]; var f = []; e.forEach(function (a) { f.push(Oa(a)) }); return r.decompress(f.join("")) }, compressToEncodedURIComponent: function (c) { return null == c ? "" : r._compress(c, 6, function (e) { return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$".charAt(e) }) }, decompressFromEncodedURIComponent: function (b) {
            if (null == b) return ""; if ("" == b) return null;
            b = b.replace(/ /g, "+"); return r._decompress(b.length, 32, function (e) { return c("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$", b.charAt(e)) })
        }, compress: function (c) { return r._compress(c, 16, function (e) { return Oa(e) }) }, _compress: function (c, e, a) {
            if (null == c) return ""; var b, f = {}, r = {}, h = "", Na = 2, Qa = 3, x = 2, Ta = [], Ua = 0, z = 0, Ra; for (Ra = 0; Ra < c.length; Ra += 1) {
                var $a = c.charAt(Ra); Object.prototype.hasOwnProperty.call(f, $a) || (f[$a] = Qa++, r[$a] = !0); var Va = h + $a; if (Object.prototype.hasOwnProperty.call(f, Va)) h =
                    Va; else {
                        if (Object.prototype.hasOwnProperty.call(r, h)) { if (256 > h.charCodeAt(0)) { for (b = 0; b < x; b++)Ua <<= 1, z == e - 1 ? (z = 0, Ta.push(a(Ua)), Ua = 0) : z++; var y = h.charCodeAt(0); for (b = 0; 8 > b; b++)Ua = Ua << 1 | y & 1, z == e - 1 ? (z = 0, Ta.push(a(Ua)), Ua = 0) : z++, y >>= 1 } else { y = 1; for (b = 0; b < x; b++)Ua = Ua << 1 | y, z == e - 1 ? (z = 0, Ta.push(a(Ua)), Ua = 0) : z++, y = 0; y = h.charCodeAt(0); for (b = 0; 16 > b; b++)Ua = Ua << 1 | y & 1, z == e - 1 ? (z = 0, Ta.push(a(Ua)), Ua = 0) : z++, y >>= 1 } Na--; 0 == Na && (Na = Math.pow(2, x), x++); delete r[h] } else for (y = f[h], b = 0; b < x; b++)Ua = Ua << 1 | y & 1, z == e - 1 ? (z = 0, Ta.push(a(Ua)),
                            Ua = 0) : z++, y >>= 1; Na--; 0 == Na && (Na = Math.pow(2, x), x++); f[Va] = Qa++; h = String($a)
                }
            } if ("" !== h) {
                if (Object.prototype.hasOwnProperty.call(r, h)) {
                    if (256 > h.charCodeAt(0)) { for (b = 0; b < x; b++)Ua <<= 1, z == e - 1 ? (z = 0, Ta.push(a(Ua)), Ua = 0) : z++; y = h.charCodeAt(0); for (b = 0; 8 > b; b++)Ua = Ua << 1 | y & 1, z == e - 1 ? (z = 0, Ta.push(a(Ua)), Ua = 0) : z++, y >>= 1 } else { y = 1; for (b = 0; b < x; b++)Ua = Ua << 1 | y, z == e - 1 ? (z = 0, Ta.push(a(Ua)), Ua = 0) : z++, y = 0; y = h.charCodeAt(0); for (b = 0; 16 > b; b++)Ua = Ua << 1 | y & 1, z == e - 1 ? (z = 0, Ta.push(a(Ua)), Ua = 0) : z++, y >>= 1 } Na--; 0 == Na && (Na = Math.pow(2,
                        x), x++); delete r[h]
                } else for (y = f[h], b = 0; b < x; b++)Ua = Ua << 1 | y & 1, z == e - 1 ? (z = 0, Ta.push(a(Ua)), Ua = 0) : z++, y >>= 1; Na--; 0 == Na && x++
            } y = 2; for (b = 0; b < x; b++)Ua = Ua << 1 | y & 1, z == e - 1 ? (z = 0, Ta.push(a(Ua)), Ua = 0) : z++, y >>= 1; for (; ;)if (Ua <<= 1, z == e - 1) { Ta.push(a(Ua)); break } else z++; return Ta.join("")
        }, decompress: function (b) { return null == b ? "" : "" == b ? null : r._decompress(b.length, 32768, function (e) { return b.charCodeAt(e) }) }, _decompress: function (b, e, a) {
            var c = [], f = 4, r = 4, h = 3, Na = [], z, x, Ta = a(0), Ua = e, Wa = 1; for (z = 0; 3 > z; z += 1)c[z] = z; var Ra = 0; var $a =
                Math.pow(2, 2); for (x = 1; x != $a;) { var Va = Ta & Ua; Ua >>= 1; 0 == Ua && (Ua = e, Ta = a(Wa++)); Ra |= (0 < Va ? 1 : 0) * x; x <<= 1 } switch (Ra) { case 0: Ra = 0; $a = Math.pow(2, 8); for (x = 1; x != $a;)Va = Ta & Ua, Ua >>= 1, 0 == Ua && (Ua = e, Ta = a(Wa++)), Ra |= (0 < Va ? 1 : 0) * x, x <<= 1; var y = Oa(Ra); break; case 1: Ra = 0; $a = Math.pow(2, 16); for (x = 1; x != $a;)Va = Ta & Ua, Ua >>= 1, 0 == Ua && (Ua = e, Ta = a(Wa++)), Ra |= (0 < Va ? 1 : 0) * x, x <<= 1; y = Oa(Ra); break; case 2: return "" }z = c[3] = y; for (Na.push(y); ;) {
                    if (Wa > b) return ""; Ra = 0; $a = Math.pow(2, h); for (x = 1; x != $a;)Va = Ta & Ua, Ua >>= 1, 0 == Ua && (Ua = e, Ta = a(Wa++)), Ra |=
                        (0 < Va ? 1 : 0) * x, x <<= 1; switch (y = Ra) { case 0: Ra = 0; $a = Math.pow(2, 8); for (x = 1; x != $a;)Va = Ta & Ua, Ua >>= 1, 0 == Ua && (Ua = e, Ta = a(Wa++)), Ra |= (0 < Va ? 1 : 0) * x, x <<= 1; c[r++] = Oa(Ra); y = r - 1; f--; break; case 1: Ra = 0; $a = Math.pow(2, 16); for (x = 1; x != $a;)Va = Ta & Ua, Ua >>= 1, 0 == Ua && (Ua = e, Ta = a(Wa++)), Ra |= (0 < Va ? 1 : 0) * x, x <<= 1; c[r++] = Oa(Ra); y = r - 1; f--; break; case 2: return Na.join("") }0 == f && (f = Math.pow(2, h), h++); if (c[y]) y = c[y]; else if (y === r) y = z + z.charAt(0); else return null; Na.push(y); c[r++] = z + y.charAt(0); f--; z = y; 0 == f && (f = Math.pow(2, h), h++)
                }
        }
    }; return r
}(); var min2phase = function () {
    function c() { this.move = []; this.moveSol = []; this.nodeUD = []; this.valid1 = 0; this.allowShorter = !1; this.cc = new a; this.urfCubieCube = []; this.urfCoordCube = []; this.phase1Cubie = []; this.preMoveCubes = []; this.preMoves = []; this.maxPreMoves = this.preMoveLen = 0; this.isRec = !1; for (var b = 0; 21 > b; b++)this.nodeUD[b] = new Ta, this.phase1Cubie[b] = new a; for (b = 0; 6 > b; b++)this.urfCubieCube[b] = new a, this.urfCoordCube[b] = new Ta; for (b = 0; 20 > b; b++)this.preMoveCubes[b + 1] = new a } function Oa(a, b, e) {
        return e ? b << 1 | a &
            1 : b | a & 248
    } function z(a, b) { return b ? a >> 1 : a & 7 } function r(a, b, e) { a[b >> 3] ^= e << (b << 2) } function b(a, b, e) { return Math.min(a, b[e >> 3] >> (e << 2) & 15) } function e(a, b, e) { a = Bb[a]; e && (a ^= 14540032 >> ((a & 15) << 1) & 3); return a & 65520 | jb[a & 15][b] } function a() { this.ca = [0, 1, 2, 3, 4, 5, 6, 7]; this.ea = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22] } function Pa(a, b, e, c) { e--; for (var n = 1985229328, f = 0; f < e; ++f) { var w = db[e - f], h = ~~(b / w); b %= w; h <<= 2; a[f] = Oa(a[f], n >> h & 15, c); w = (1 << h) - 1; n = (n & w) + (n >> 4 & ~w) } a[e] = Oa(a[e], n & 15, c) } function f(a, b, e) {
        for (var c = 0, n =
            1985229328, f = 0; f < b - 1; ++f) { var w = z(a[f], e) << 2; c = (b - f) * c + (n >> w & 15); n -= 286331152 << w } return c
    } function bb(a, b, e, c) { a[e - 1] = Oa(a[e - 1], 0, c); for (var n = e - 2; 0 <= n; --n) { a[n] = Oa(a[n], b % (e - n), c); b = ~~(b / (e - n)); for (var f = n + 1; f < e; ++f)z(a[f], c) >= z(a[n], c) && (a[f] = Oa(a[f], z(a[f], c) + 1, c)) } } function h(a, b, e) { for (var c = 0, n = 0; n < b; ++n) { c *= b - n; for (var f = n + 1; f < b; ++f)z(a[f], e) < z(a[n], e) && ++c } return c } function Na(a, b, e) { for (var c = 0, n = 4, f = a.length - 1; 0 <= f; f--)(z(a[f], e) & 12) == b && (c += y[f][n--]); return c } function Qa(a, b, e, c) {
        for (var n =
            a.length - 1, f = 4, w = n; 0 <= n; n--)b >= y[n][f] ? (b -= y[n][f--], a[n] = Oa(a[n], f | e, c)) : ((w & 12) == e && (w -= 4), a[n] = Oa(a[n], w--, c))
    } function x(a, b) { for (var e = 0, c = b - 2; 0 <= c; c--)e ^= a % (b - c), a = ~~(a / (b - c)); return e & 1 } function Ta() { this.flipc = this.twistc = this.prun = this.slice = this.fsym = this.flip = this.tsym = this.twist = 0 } function Ua() {
        function b(b, c, e, n, f, w, h) {
            for (var y = new a, x = new a, Sa = 0, ab = 2 <= f ? 1 : 2, Va = 1 != f ? a.EdgeConjugate : a.CornConjugate, Za = 0; Za < b; Za++)if (void 0 === e[Za]) {
                w.call(y, Za); for (var $a = 0; 16 > $a; $a += ab) {
                    Va(y, $a, x); var r =
                        h.call(x); 0 == f && (Eb[Sa << 3 | $a >> 1] = r); r == Za && (n[Sa] |= 1 << $a / ab); e[r] = (Sa << 4 | $a) / ab
                } c[Sa++] = Za
            } return Sa
        } function e(a, b, e, f, w, h, y, Sa) { for (var x = 0; x < e; x++) { a[x] = []; w.call(c, b[x]); for (var ab = 0; ab < f; ab++)y(c, hb[Sa ? Sa[ab] : ab], n), a[x][ab] = h.call(n) } } var c = new a, n = new a, f, w = (new a).initCoord(28783, 0, 259268407, 0), h = (new a).initCoord(15138, 0, 119765538, 7), y = (new a).initCoord(5167, 0, 83473207, 0); for (f = 0; 8 > f; f++)y.ca[f] |= 24; for (f = 0; 16 > f; f++)ob[f] = (new a).init(c.ca, c.ea), a.CornMultFull(c, h, n), a.EdgeMult(c, h, n), c.init(n.ca,
            n.ea), 3 == f % 4 && (a.CornMultFull(c, y, n), a.EdgeMult(c, y, n), c.init(n.ca, n.ea)), 7 == f % 8 && (a.CornMultFull(c, w, n), a.EdgeMult(c, w, n), c.init(n.ca, n.ea)); for (f = 0; 16 > f; f++)jb[f] = [], eb[f] = [], kb[f] = [], qb[f] = [], ab[f] = []; for (f = 0; 16 > f; f++)for (w = 0; 16 > w; w++)jb[f][w] = f ^ w ^ 84660 >> w & f << 1 & 2, eb[jb[f][w]][w] = f; c = new a; for (h = 0; 16 > h; h++)for (w = 0; 18 > w; w++) { a.CornConjugate(hb[w], eb[0][h], c); y = 0; a: for (; 18 > y; y++) { for (f = 0; 8 > f; f++)if (hb[y].ca[f] != c.ca[f]) continue a; kb[h][w] = y; ab[h][lb[w]] = lb[y]; break } 0 == h % 2 && (qb[w << 3 | h >> 1] = kb[h][w]) } b(2048,
                nb, rb, yb, 0, a.prototype.setFlip, a.prototype.getFlip); b(2187, ub, vb, Fb, 1, a.prototype.setTwist, a.prototype.getTwist); b(40320, wb, zb, pb, 2, a.prototype.setEPerm, a.prototype.getEPerm); w = new a; for (f = 0; 2768 > f; f++)Pa(w.ea, wb[f], 8, !0), Cb[f] = Na(w.ea, 0, !0) + 70 * x(wb[f], 8), c.invFrom(w), Bb[f] = zb[c.getEPerm()]; c = new a; n = new a; e(tb, nb, 336, 18, a.prototype.setFlip, a.prototype.getFlipSym, a.EdgeMult); e(Ab, ub, 324, 18, a.prototype.setTwist, a.prototype.getTwistSym, a.CornMult); e(Gb, wb, 2768, 10, a.prototype.setEPerm, a.prototype.getEPermSym,
                    a.EdgeMult, cb); e(Hb, wb, 2768, 10, a.prototype.setCPerm, a.prototype.getCPermSym, a.CornMult, cb); for (f = 0; 495 > f; f++) { Kb[f] = []; sb[f] = []; c.setUDSlice(f); for (w = 0; 18 > w; w++)a.EdgeMult(c, hb[w], n), Kb[f][w] = n.getUDSlice(); for (w = 0; 16 > w; w += 2)a.EdgeConjugate(c, eb[0][w], n), sb[f][w >> 1] = n.getUDSlice() } for (f = 0; 24 > f; f++) { Jb[f] = []; Ob[f] = []; c.setMPerm(f); for (w = 0; 10 > w; w++)a.EdgeMult(c, hb[cb[w]], n), Jb[f][w] = n.getMPerm(); for (w = 0; 16 > w; w++)a.EdgeConjugate(c, eb[0][w], n), Ob[f][w] = n.getMPerm() } for (f = 0; 140 > f; f++) {
                        Rb[f] = []; Pb[f] = [];
                        c.setCComb(f % 70); for (w = 0; 10 > w; w++)a.CornMult(c, hb[cb[w]], n), Rb[f][w] = n.getCComb() + 70 * (165 >> w & 1 ^ ~~(f / 70)); for (w = 0; 16 > w; w++)a.CornConjugate(c, eb[0][w], n), Pb[f][w] = n.getCComb() + 70 * ~~(f / 70)
                    }
    } function Wa(a, b, c, e, n, f, w, h) {
        var y = h & 15, x = 1 == (h >> 4 & 1) ? 14540032 : 0, Sa = h >> 8 & 15, ab = h >> 12 & 15, Za = h >> 16 & 15, $a = (1 << y) - 1, Na = null == e; c *= b; h = 1 == (h >> 5 & 1) ? 10 : 18; var Ra = 10 == h ? 66 : 599186, Pa = (a[c >> 3] >> (c << 2) & 15) - 1; if (-1 == Pa) { for (var Ta = 0; Ta < (c >> 3) + 1; Ta++)a[Ta] = 4294967295; r(a, 0, 15); Pa = 0 } else r(a, c, 15 ^ Pa + 1); for (ab = 0 < Va ? Math.min(Math.max(Pa +
            1, Za), ab) : ab; Pa < ab;) {
                var Xa = (Za = Pa > Sa) ? 15 : Pa, z = 286331153 * Xa, Ua = Za ? Pa : 15; Pa++; Qb++; var hb = Pa ^ 15, kb = 0, Qa = 0; for (Ta = 0; Ta < c; Ta++, Qa >>= 4) {
                    if (0 == (Ta & 7)) { Qa = a[Ta >> 3]; var Ya = Qa ^ z; if (0 == (Ya - 286331153 & ~Ya & 2290649224)) { Ta += 7; continue } } if ((Qa & 15) == Xa) {
                        Ya = Ta % b; var cb = ~~(Ta / b), eb = 0, db = 0; Na && (eb = rb[Ya], db = eb & 7, eb >>= 3); for (var mb = 0; mb < h; mb++) {
                            var nb = f[cb][mb]; var bb = Na ? Eb[tb[eb][qb[mb << 3 | db]] ^ db ^ nb & $a] : n[e[Ya][mb]][nb & $a]; nb >>= y; var Wa = nb * b + bb, jb = a[Wa >> 3] >> (Wa << 2) & 15; if (jb != Ua) jb < Pa - 1 && (mb += Ra >> mb & 3); else {
                                kb++; if (Za) {
                                    r(a,
                                        Ta, hb); break
                                } r(a, Wa, hb); Wa = 1; for (jb = w[nb]; 0 != (jb >>= 1); Wa++)if (1 == (jb & 1)) { var ub = nb * b; ub = Na ? ub + Eb[rb[bb] ^ Wa] : ub + n[bb][Wa ^ x >> (Wa << 1) & 3]; (a[ub >> 3] >> (ub << 2) & 15) == Ua && (r(a, ub, hb), kb++) }
                            }
                        }
                    }
                }
        } r(a, c, Pa + 1 ^ 15); return Pa + 1
    } function Ra(a) { Nb = Wa(xb, 2048, 324, null, null, Ab, Fb, 103939); Qb > a || (ac = Wa(Ib, 495, 324, Kb, sb, Ab, Fb, 431619), Qb > a || (Vb = Wa(Mb, 495, 336, Kb, sb, tb, yb, 431619), Qb > a || (Sb = Wa(Lb, 24, 2768, Jb, Ob, Hb, pb, 584244), Qb > a || (Wb = Wa(Tb, 140, 2768, Rb, Pb, Gb, pb, 514084))))) } function $a() {
        0 > Qb && (Ua(), Qb = 0); if (0 == Qb) Ra(99); else if (54 >
            Qb) Ra(Qb); else return !0; return !1
    } for (var Va = 2, y = [], db = [1], mb = "U ;U2;U';R ;R2;R';F ;F2;F';D ;D2;D';L ;L2;L';B ;B2;B'".split(";"), cb = [0, 1, 2, 4, 7, 9, 10, 11, 13, 16, 3, 5, 6, 8, 12, 14, 15, 17], lb = [], gb = [], Ya = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], [6, 7, 8, 0, 1, 2, 3, 4, 5, 15, 16, 17, 9, 10, 11, 12, 13, 14], [3, 4, 5, 6, 7, 8, 0, 1, 2, 12, 13, 14, 15, 16, 17, 9, 10, 11], [2, 1, 0, 5, 4, 3, 8, 7, 6, 11, 10, 9, 14, 13, 12, 17, 16, 15], [8, 7, 6, 2, 1, 0, 5, 4, 3, 17, 16, 15, 11, 10, 9, 14, 13, 12], [5, 4, 3, 8, 7, 6, 2, 1, 0, 14, 13, 12, 17, 16, 15, 11, 10, 9]], fb = 0; 18 > fb; fb++)lb[cb[fb]] = fb; for (fb =
        0; 10 > fb; fb++)for (var Xa = ~~(cb[fb] / 3), w = gb[fb] = 0; 10 > w; w++) { var n = ~~(cb[w] / 3); gb[fb] |= (Xa == n || Xa % 3 == n % 3 && Xa >= n ? 1 : 0) << w } for (fb = gb[10] = 0; 13 > fb; fb++)for (y[fb] = [], db[fb + 1] = db[fb] * (fb + 1), w = y[fb][0] = y[fb][fb] = 1; 13 > w; w++)y[fb][w] = w <= fb ? y[fb - 1][w - 1] + y[fb - 1][w] : 0; a.EdgeMult = function (a, b, c) { for (var e = 0; 12 > e; e++)c.ea[e] = a.ea[b.ea[e] >> 1] ^ b.ea[e] & 1 }; a.CornMult = function (a, b, c) { for (var e = 0; 8 > e; e++)c.ca[e] = a.ca[b.ca[e] & 7] & 7 | ((a.ca[b.ca[e] & 7] >> 3) + (b.ca[e] >> 3)) % 3 << 3 }; a.CornMultFull = function (a, b, c) {
            for (var e = 0; 8 > e; e++) {
                var n =
                    a.ca[b.ca[e] & 7] >> 3, f = b.ca[e] >> 3, w = n + (3 > n ? f : 6 - f); w = w % 3 + (3 > n == 3 > f ? 0 : 3); c.ca[e] = a.ca[b.ca[e] & 7] & 7 | w << 3
            }
        }; a.CornConjugate = function (a, b, c) { var e = ob[eb[0][b]]; b = ob[b]; for (var n = 0; 8 > n; n++) { var f = a.ca[b.ca[n] & 7] >> 3; c.ca[n] = e.ca[a.ca[b.ca[n] & 7] & 7] & 7 | (3 > e.ca[a.ca[b.ca[n] & 7] & 7] >> 3 ? f : (3 - f) % 3) << 3 } }; a.EdgeConjugate = function (a, b, c) { var e = ob[eb[0][b]]; b = ob[b]; for (var n = 0; 12 > n; n++)c.ea[n] = e.ea[a.ea[b.ea[n] >> 1] >> 1] ^ a.ea[b.ea[n] >> 1] & 1 ^ b.ea[n] & 1 }; a.prototype.init = function (a, b) { this.ca = a.slice(); this.ea = b.slice(); return this };
    a.prototype.initCoord = function (a, b, c, e) { Pa(this.ca, a, 8, !1); this.setTwist(b); bb(this.ea, c, 12, !0); this.setFlip(e); return this }; a.prototype.isEqual = function (a) { for (var b = 0; 8 > b; b++)if (this.ca[b] != a.ca[b]) return !1; for (b = 0; 12 > b; b++)if (this.ea[b] != a.ea[b]) return !1; return !0 }; a.prototype.setFlip = function (a) { for (var b = 0, c, e = 10; 0 <= e; e--, a >>= 1)b ^= c = a & 1, this.ea[e] = this.ea[e] & 254 | c; this.ea[11] = this.ea[11] & 254 | b }; a.prototype.getFlip = function () { for (var a = 0, b = 0; 11 > b; b++)a = a << 1 | this.ea[b] & 1; return a }; a.prototype.getFlipSym =
        function () { return rb[this.getFlip()] }; a.prototype.setTwist = function (a) { for (var b = 15, c, e = 6; 0 <= e; e--, a = ~~(a / 3))b -= c = a % 3, this.ca[e] = this.ca[e] & 7 | c << 3; this.ca[7] = this.ca[7] & 7 | b % 3 << 3 }; a.prototype.getTwist = function () { for (var a = 0, b = 0; 7 > b; b++)a += (a << 1) + (this.ca[b] >> 3); return a }; a.prototype.getTwistSym = function () { return vb[this.getTwist()] }; a.prototype.setCPerm = function (a) { Pa(this.ca, a, 8, !1) }; a.prototype.getCPerm = function () { return f(this.ca, 8, !1) }; a.prototype.getCPermSym = function () {
            var a = zb[f(this.ca, 8, !1)];
            return a ^ 14540032 >> ((a & 15) << 1) & 3
        }; a.prototype.setEPerm = function (a) { Pa(this.ea, a, 8, !0) }; a.prototype.getEPerm = function () { return f(this.ea, 8, !0) }; a.prototype.getEPermSym = function () { return zb[f(this.ea, 8, !0)] }; a.prototype.getUDSlice = function () { return 494 - Na(this.ea, 8, !0) }; a.prototype.setUDSlice = function (a) { Qa(this.ea, 494 - a, 8, !0) }; a.prototype.getMPerm = function () { return h(this.ea, 12, !0) % 24 }; a.prototype.setMPerm = function (a) { bb(this.ea, a, 12, !0) }; a.prototype.getCComb = function () { return Na(this.ca, 0, !1) }; a.prototype.setCComb =
            function (a) { Qa(this.ca, a, 0, !1) }; a.prototype.URFConjugate = function () { var b = new a; a.CornMult(a.urf2, this, b); a.CornMult(b, a.urf1, this); a.EdgeMult(a.urf2, this, b); a.EdgeMult(b, a.urf1, this) }; var Sa = [[8, 9, 20], [6, 18, 38], [0, 36, 47], [2, 45, 11], [29, 26, 15], [27, 44, 24], [33, 53, 42], [35, 17, 51]], Za = [[5, 10], [7, 19], [3, 37], [1, 46], [32, 16], [28, 25], [30, 43], [34, 52], [23, 12], [21, 41], [50, 39], [48, 14]]; a.prototype.toFaceCube = function (a, b) {
                a = a || Sa; b = b || Za; for (var c = [], e = 0; 54 > e; e++)c[e] = "URFDLB"[~~(e / 9)]; for (var n = 0; 8 > n; n++) {
                    e = this.ca[n] &
                    7; for (var f = this.ca[n] >> 3, w = 0; 3 > w; w++)c[a[n][(w + f) % 3]] = "URFDLB"[~~(a[e][w] / 9)]
                } for (n = 0; 12 > n; n++)for (e = this.ea[n] >> 1, f = this.ea[n] & 1, w = 0; 2 > w; w++)c[b[n][(w + f) % 2]] = "URFDLB"[~~(b[e][w] / 9)]; return c.join("")
            }; a.prototype.invFrom = function (a) { for (var b = 0; 12 > b; b++)this.ea[a.ea[b] >> 1] = b << 1 | a.ea[b] & 1; for (b = 0; 8 > b; b++)this.ca[a.ca[b] & 7] = b | 32 >> (a.ca[b] >> 3) & 24; return this }; a.prototype.fromFacelet = function (a, b, e) {
                b = b || Sa; e = e || Za; for (var c = 0, n = [], f = a[4] + a[13] + a[22] + a[31] + a[40] + a[49], w = 0; 54 > w; ++w) {
                    n[w] = f.indexOf(a[w]);
                    if (-1 == n[w]) return -1; c += 1 << (n[w] << 2)
                } if (10066329 != c) return -1; var h; for (w = 0; 8 > w; ++w) { for (h = 0; 3 > h && 0 != n[b[w][h]] && 3 != n[b[w][h]]; ++h); a = n[b[w][(h + 1) % 3]]; c = n[b[w][(h + 2) % 3]]; for (f = 0; 8 > f; ++f)if (a == ~~(b[f][1] / 9) && c == ~~(b[f][2] / 9)) { this.ca[w] = f | h % 3 << 3; break } } for (w = 0; 12 > w; ++w)for (f = 0; 12 > f; ++f) { if (n[e[w][0]] == ~~(e[f][0] / 9) && n[e[w][1]] == ~~(e[f][1] / 9)) { this.ea[w] = f << 1; break } if (n[e[w][0]] == ~~(e[f][1] / 9) && n[e[w][1]] == ~~(e[f][0] / 9)) { this.ea[w] = f << 1 | 1; break } }
            }; Ta.prototype.set = function (a) {
                this.twist = a.twist; this.tsym =
                    a.tsym; this.flip = a.flip; this.fsym = a.fsym; this.slice = a.slice; this.prun = a.prun; this.twistc = a.twistc; this.flipc = a.flipc
            }; Ta.prototype.calcPruning = function (a) { this.prun = Math.max(Math.max(b(ac, Ib, 495 * this.twist + sb[this.slice][this.tsym]), b(Vb, Mb, 495 * this.flip + sb[this.slice][this.fsym])), Math.max(b(Nb, xb, this.twistc >> 3 << 11 | Eb[this.flipc ^ this.twistc & 7]), b(Nb, xb, this.twist << 11 | Eb[this.flip << 3 | this.fsym ^ this.tsym]))) }; Ta.prototype.setWithPrun = function (e, c) {
                this.twist = e.getTwistSym(); this.flip = e.getFlipSym();
                this.tsym = this.twist & 7; this.twist >>= 3; this.prun = b(Nb, xb, this.twist << 11 | Eb[this.flip ^ this.tsym]); if (this.prun > c) return !1; this.fsym = this.flip & 7; this.flip >>= 3; this.slice = e.getUDSlice(); this.prun = Math.max(this.prun, Math.max(b(ac, Ib, 495 * this.twist + sb[this.slice][this.tsym]), b(Vb, Mb, 495 * this.flip + sb[this.slice][this.fsym]))); if (this.prun > c) return !1; var n = new a; a.CornConjugate(e, 1, n); a.EdgeConjugate(e, 1, n); this.twistc = n.getTwistSym(); this.flipc = n.getFlipSym(); this.prun = Math.max(this.prun, b(Nb, xb, this.twistc >>
                    3 << 11 | Eb[this.flipc ^ this.twistc & 7])); return this.prun <= c
            }; Ta.prototype.doMovePrun = function (a, e, c) { this.slice = Kb[a.slice][e]; this.flip = tb[a.flip][qb[e << 3 | a.fsym]]; this.fsym = this.flip & 7 ^ a.fsym; this.flip >>= 3; this.twist = Ab[a.twist][qb[e << 3 | a.tsym]]; this.tsym = this.twist & 7 ^ a.tsym; this.twist >>= 3; return this.prun = Math.max(Math.max(b(ac, Ib, 495 * this.twist + sb[this.slice][this.tsym]), b(Vb, Mb, 495 * this.flip + sb[this.slice][this.fsym])), b(Nb, xb, this.twist << 11 | Eb[this.flip << 3 | this.fsym ^ this.tsym])) }; Ta.prototype.doMovePrunConj =
                function (a, e) { e = kb[3][e]; this.flipc = tb[a.flipc >> 3][qb[e << 3 | a.flipc & 7]] ^ a.flipc & 7; this.twistc = Ab[a.twistc >> 3][qb[e << 3 | a.twistc & 7]] ^ a.twistc & 7; return b(Nb, xb, this.twistc >> 3 << 11 | Eb[this.flipc ^ this.twistc & 7]) }; c.prototype.solution = function (a, b, e, c, n, f, w) {
                    $a(); a = this.verify(a); if (0 != a) return "Error " + Math.abs(a); void 0 === b && (b = 21); void 0 === e && (e = 1E9); void 0 === c && (c = 0); void 0 === n && (n = 0); this.sol = b + 1; this.probe = 0; this.probeMax = e; this.probeMin = Math.min(c, e); this.verbose = n; this.moveSol = null; this.isRec = !1; this.firstFilters =
                        [0, 0, 0, 0, 0, 0]; this.lastFilters = [0, 0, 0, 0, 0, 0]; for (b = 0; 3 > b; b++)void 0 !== f && (this.firstFilters[b] |= 3591 << 3 * ~~(Ya[(3 - b) % 3][3 * f] / 3), this.lastFilters[b + 3] |= 3591 << 3 * ~~(Ya[(3 - b) % 3][3 * f] / 3)), void 0 !== w && (this.lastFilters[b] |= 3591 << 3 * ~~(Ya[(3 - b) % 3][3 * w] / 3), this.firstFilters[b + 3] |= 3591 << 3 * ~~(Ya[(3 - b) % 3][3 * w] / 3)); this.initSearch(); return this.search()
                }; c.prototype.initSearch = function () {
                    this.conjMask = 0; this.maxPreMoves = 7 < this.conjMask ? 0 : 20; for (var b = 0; 6 > b; b++)if (this.urfCubieCube[b].init(this.cc.ca, this.cc.ea),
                        this.urfCoordCube[b].setWithPrun(this.urfCubieCube[b], 20), this.cc.URFConjugate(), 2 == b % 3) { var e = (new a).invFrom(this.cc); this.cc.init(e.ca, e.ea) }
                }; c.prototype.next = function (a, b, e) { this.probe = 0; this.probeMax = a; this.probeMin = Math.min(b, a); this.moveSol = null; this.isRec = !0; this.verbose = e; return this.search() }; c.prototype.verify = function (a) {
                    if (-1 == this.cc.fromFacelet(a)) return -1; for (var b = a = 0, e = 0; 12 > e; e++)b |= 1 << (this.cc.ea[e] >> 1), a ^= this.cc.ea[e] & 1; if (4095 != b) return -2; if (0 != a) return -3; for (e = a = b = 0; 8 > e; e++)b |=
                        1 << (this.cc.ca[e] & 7), a += this.cc.ca[e] >> 3; return 255 != b ? -4 : 0 != a % 3 ? -5 : 0 != (x(h(this.cc.ea, 12, !0), 12) ^ x(this.cc.getCPerm(), 8)) ? -6 : 0
                }; c.prototype.phase1PreMoves = function (b, e, c) {
                    if (b == this.maxPreMoves - 1 && 0 != (this.lastFilter >> e & 1)) return 1; this.preMoveLen = this.maxPreMoves - b; if (this.isRec ? this.depth1 == this.length1 - this.preMoveLen : 0 == this.preMoveLen || 0 == (225207 >> e & 1)) if (this.depth1 = this.length1 - this.preMoveLen, this.phase1Cubie[0].init(c.ca, c.ea), this.allowShorter = 7 == this.depth1 && 0 != this.preMoveLen, this.nodeUD[this.depth1 +
                        1].setWithPrun(c, this.depth1) && 0 == this.phase1(this.nodeUD[this.depth1 + 1], this.depth1, -1)) return 0; if (0 == b || this.preMoveLen + 7 >= this.length1) return 1; var n = 0; if (1 == b || this.preMoveLen + 1 + 7 >= this.length1) n |= 225207; e = 3 * ~~(e / 3); for (var f = 0; 18 > f; f++)if (f == e || f == e - 9 || f == e + 9) f += 2; else if (!(this.isRec && f != this.preMoves[this.maxPreMoves - b] || 0 != (n & 1 << f)) && (a.CornMult(hb[f], c, this.preMoveCubes[b]), a.EdgeMult(hb[f], c, this.preMoveCubes[b]), this.preMoves[this.maxPreMoves - b] = f, 0 == this.phase1PreMoves(b - 1, f, this.preMoveCubes[b]))) return 0;
                    return 1
                }; c.prototype.search = function () { for (this.length1 = this.isRec ? this.length1 : 0; this.length1 < this.sol; this.length1++)for (this.urfIdx = this.isRec ? this.urfIdx : 0; 6 > this.urfIdx; this.urfIdx++)if (0 == (this.conjMask & 1 << this.urfIdx) && (this.firstFilter = this.firstFilters[this.urfIdx], this.lastFilter = this.lastFilters[this.urfIdx], 0 == this.phase1PreMoves(this.maxPreMoves, -30, this.urfCubieCube[this.urfIdx], 0))) return null == this.moveSol ? "Error 8" : this.moveSol; return null == this.moveSol ? "Error 7" : this.moveSol }; c.prototype.initPhase2Pre =
                    function () {
                        this.isRec = !1; if (this.probe >= (null == this.moveSol ? this.probeMax : this.probeMin)) return 0; ++this.probe; for (var b = this.valid1; b < this.depth1; b++)a.CornMult(this.phase1Cubie[b], hb[this.move[b]], this.phase1Cubie[b + 1]), a.EdgeMult(this.phase1Cubie[b], hb[this.move[b]], this.phase1Cubie[b + 1]); this.valid1 = this.depth1; b = this.initPhase2(this.phase1Cubie[this.depth1]); if (0 == b || 0 == this.preMoveLen || 2 == b) return b; b = 3 * ~~(this.preMoves[this.preMoveLen - 1] / 3) + 1; a.CornMult(hb[b], this.phase1Cubie[this.depth1],
                            this.phase1Cubie[this.depth1 + 1]); a.EdgeMult(hb[b], this.phase1Cubie[this.depth1], this.phase1Cubie[this.depth1 + 1]); this.preMoves[this.preMoveLen - 1] += 2 - this.preMoves[this.preMoveLen - 1] % 3 * 2; b = this.initPhase2(this.phase1Cubie[this.depth1 + 1]); this.preMoves[this.preMoveLen - 1] += 2 - this.preMoves[this.preMoveLen - 1] % 3 * 2; return b
                    }; c.prototype.initPhase2 = function (a) {
                        var e = a.getCPermSym(), c = e & 15; e >>= 4; var n = a.getEPermSym(), f = n & 15; n >>= 4; a = a.getMPerm(); var w = Math.max(b(Wb, Tb, 140 * n + Pb[Cb[e] & 255][eb[f][c]]), b(Sb, Lb,
                            24 * e + Ob[a][c])), h = Math.min(13, this.sol - this.length1); if (w >= h) return w > h ? 2 : 1; var y; for (y = h - 1; y >= w; y--) { var x = this.phase2(n, f, e, c, a, y, this.depth1, 10); if (0 > x) break; y -= x; this.moveSol = []; for (x = 0; x < this.depth1 + y; x++)this.appendSolMove(this.move[x]); for (x = this.preMoveLen - 1; 0 <= x; x--)this.appendSolMove(this.preMoves[x]); this.sol = this.moveSol.length; this.moveSol = this.solutionToString() } return y != h - 1 ? this.probe >= this.probeMin ? 0 : 1 : 1
                    }; c.prototype.phase1 = function (a, b, e) {
                        if (b == this.depth1 - 1 && 0 != (this.firstFilter >>
                            e & 1)) return 1; if (0 == a.prun && 5 > b) { if (this.allowShorter || 0 == b) { this.depth1 -= b; var c = this.initPhase2Pre(); this.depth1 += b; return c } return 1 } for (var n = 0; 18 > n; n += 3)if (n != e && n != e - 9) for (var f = 0; 3 > f; f++)if (c = n + f, !this.isRec || c == this.move[this.depth1 - b]) {
                                var w = this.nodeUD[b].doMovePrun(a, c, !0); if (w > b) break; else if (w == b) continue; w = this.nodeUD[b].doMovePrunConj(a, c); if (w > b) break; else if (w == b) continue; this.move[this.depth1 - b] = c; this.valid1 = Math.min(this.valid1, this.depth1 - b); c = this.phase1(this.nodeUD[b], b - 1, n);
                                if (0 == c) return 0; if (2 == c) break
                            } return 1
                    }; c.prototype.appendSolMove = function (a) {
                        if (0 == this.moveSol.length) this.moveSol.push(a); else {
                            var b = ~~(a / 3), e = ~~(this.moveSol[this.moveSol.length - 1] / 3); b == e ? (a = (a % 3 + this.moveSol[this.moveSol.length - 1] % 3 + 1) % 4, 3 == a ? this.moveSol.pop() : this.moveSol[this.moveSol.length - 1] = 3 * b + a) : 1 < this.moveSol.length && b % 3 == e % 3 && b == ~~(this.moveSol[this.moveSol.length - 2] / 3) ? (a = (a % 3 + this.moveSol[this.moveSol.length - 2] % 3 + 1) % 4, 3 == a ? (this.moveSol[this.moveSol.length - 2] = this.moveSol[this.moveSol.length -
                                1], this.moveSol.pop()) : this.moveSol[this.moveSol.length - 2] = 3 * b + a) : this.moveSol.push(a)
                        }
                    }; c.prototype.phase2 = function (a, c, n, f, w, h, y, x) {
                        if (0 == this.depth1 && 1 == y && 0 != (this.firstFilter >> cb[x] & 1)) return -1; if (0 == a && 0 == n && 0 == w && (0 < this.preMoveLen || 0 == (this.lastFilter >> cb[x] & 1))) return h; x = gb[x]; for (var Sa = 0; 10 > Sa; Sa++)if (0 != (x >> Sa & 1)) Sa += 66 >> Sa & 3; else {
                            var Va = Jb[w][Sa], Za = Hb[n][ab[f][Sa]], $a = jb[Za & 15][f]; Za >>= 4; if (!(b(Sb, Lb, 24 * Za + Ob[Va][$a]) >= h)) {
                                var r = Gb[a][ab[c][Sa]], Na = jb[r & 15][c]; r >>= 4; if (!(b(Wb, Tb, 140 *
                                    r + Pb[Cb[Za] & 255][eb[Na][$a]]) >= h)) { var Pa = e(r, Na, !1), Ta = e(Za, $a, !0); if (!(b(Wb, Tb, 140 * (Pa >> 4) + Pb[Cb[Ta >> 4] & 255][eb[Pa & 15][Ta & 15]]) >= h) && (Va = this.phase2(r, Na, Za, $a, Va, h - 1, y + 1, Sa), 0 <= Va)) return this.move[y] = cb[Sa], Va }
                            }
                        } return -1
                    }; c.prototype.solutionToString = function () { var a = "", b = 0 != (this.verbose & 2) ? (this.urfIdx + 3) % 6 : this.urfIdx; if (3 > b) for (var e = 0; e < this.moveSol.length; ++e)a += mb[Ya[b][this.moveSol[e]]] + " "; else for (e = this.moveSol.length - 1; 0 <= e; --e)a += mb[Ya[b][this.moveSol[e]]] + " "; return a }; var hb = [],
                        ob = [], jb = [], eb = [], kb = [], ab = [], qb = [], nb = [], rb = [], ub = [], vb = [], wb = [], zb = [], yb = [], Fb = [], pb = [], Eb = [], Cb = [], Bb = [], Kb = [], Ab = [], tb = [], sb = [], Ib = [], Mb = [], xb = [], Hb = [], Gb = [], Jb = [], Ob = [], Rb = [], Pb = [], Lb = [], Tb = [], Nb = 15, ac = 15, Vb = 15, Sb = 15, Wb = 15; for (fb = 0; 18 > fb; fb++)hb[fb] = new a; hb[0].initCoord(15120, 0, 119750400, 0); hb[3].initCoord(21021, 1494, 323403417, 0); hb[6].initCoord(8064, 1236, 29441808, 550); hb[9].initCoord(9, 0, 5880, 0); hb[12].initCoord(1230, 412, 2949660, 0); hb[15].initCoord(224, 137, 328552, 137); for (fb = 0; 18 > fb; fb += 3)for (Xa =
                            0; 2 > Xa; Xa++)a.EdgeMult(hb[fb + Xa], hb[fb], hb[fb + Xa + 1]), a.CornMult(hb[fb + Xa], hb[fb], hb[fb + Xa + 1]); a.urf1 = (new a).initCoord(2531, 1373, 67026819, 1367); a.urf2 = (new a).initCoord(2089, 1906, 322752913, 2040); var Qb = -1; return {
                                Search: c, solve: function (a) { return (new c).solution(a) }, randomCube: function () { var b = ~~(2048 * Math.random()), e = ~~(2187 * Math.random()); do { var c = ~~(Math.random() * db[12]); var n = ~~(Math.random() * db[8]) } while (x(n, 8) != x(c, 12)); return (new a).initCoord(n, e, c, b).toFaceCube() }, initFull: function () {
                                    Va = 0;
                                    $a()
                                }
                            }
}(); "undefined" !== typeof module && "undefined" !== typeof module.exports && (module.exports = min2phase); var cubeutil = function () {
    function c(a) { for (var b = {}, e = 0; e < a.length; e++) { var c = a[e]; "-" != c && (b[c] = b[c] || [], b[c].push(e)) } a = []; for (c in b) 1 < b[c].length && a.push(b[c]); return a } function Oa(a, b) { var e = Ya[a[1]], c = a[0]; b = b || gb; for (var n = 0; n < b.length; n++)for (var f = b[n], w = c[e[f[0]]], h = 1; h < f.length; h++)if (c[e[f[h]]] != w) return 1; return 0 } function z(a) { return Oa(a, Qa) ? 9 : Oa(a, Ra) ? 4 + Oa(a, x) + Oa(a, Ta) + Oa(a, Ua) + Oa(a, Wa) : Oa(a, Va) ? 4 : Oa(a, $a) ? 3 : Oa(a, y) ? 2 : Oa(a) ? 1 : 0 } function r(a) {
        return Oa(a, Qa) ? 7 : Oa(a, Ra) ? 2 + Oa(a, x) + Oa(a,
            Ta) + Oa(a, Ua) + Oa(a, Wa) : Oa(a, $a) ? 2 : Oa(a) ? 1 : 0
    } function b(a) { return Oa(a, Qa) ? 4 : Oa(a, Ra) ? 3 : Oa(a, $a) ? 2 : Oa(a) ? 1 : 0 } function e(a) { return Oa(a, Ra) ? 2 : Oa(a) ? 1 : 0 } function a(a) { return Oa(a, db) ? 4 : Oa(a, mb) ? 3 : Oa(a, cb) ? 2 : Oa(a) ? 1 : 0 } function Pa(a, b) { return a in fb ? Oa(b, fb[a][1]) : Oa(b) } function f(a, b, e) { for (var c = 99, n = 0; n < e; n++)c = Math.min(c, b([a, n])); return c } function bb(a) {
        var b = [0, 1, 2, 3, 4, 5]; return $.map(a, function (a, e) {
            function c(a, b) {
                0 == n.length || ~~(n[n.length - 1] / 3) != a ? n.push(3 * a + b) : (b = (b + n[n.length - 1] % 3 + 1) % 4, 3 ==
                    b ? n.pop() : n[n.length - 1] = 3 * a + b)
            } for (var n = [], f = 0; f < a.length; f++) { var w = b.indexOf("URFDLB".indexOf(a[f][0][0])), h = " 2'".indexOf(a[f][0][1]) % 3; if (f == a.length - 1 || 100 < a[f + 1][1] - a[f][1]) c(w, h); else { var y = b.indexOf("URFDLB".indexOf(a[f + 1][0][0])), x = " 2'".indexOf(a[f + 1][0][1]) % 3; if (w != y && w % 3 == y % 3 && 2 == h + x) { y = w % 3; w = (h - 1) * [1, 1, -1, -1, -1, 1][w] + 1; c(y + 6, w); for (h = 0; h < w + 1; h++) { x = []; for (var Sa = 0; 6 > Sa; Sa++)x[Sa] = b[Xa[y][Sa]]; b = x } f++ } else c(w, h) } } return [[$.map(n, function (a) {
                return "URFDLBEMS".charAt(~~(a / 3)) + " 2'".charAt(a %
                    3)
            }).join(""), n.length]]
        })
    } function h(a, b, e) { for (var c = [], n = 0; 24 > n; n++)0 == Oa([a, n], b) && c.push(n); for (b = 0; b < e.length; b++)for (n = 0; n < c.length; n++)if (0 == Oa([a, c[n]], e[b])) return b; return -1 } function Na(a) { switch (a) { case "cfop": return ["pll", "oll", "f2l", "cross"]; case "fp": return ["op", "cf"]; case "cf4op": return "pll oll f2l-4 f2l-3 f2l-2 f2l-1 cross".split(" "); case "roux": return ["l6e", "cmll", "sb", "fb"]; case "cf4o2p2": return "pll cpll oll eoll f2l-4 f2l-3 f2l-2 f2l-1 cross".split(" "); case "n": return ["solve"] } }
    var Qa = c("----U--------R--R-----F--F--D-DDD-D-----L--L-----B--B-"), x = c("----U-------RR-RR-----FF-FF-DDDDD-D-----L--L-----B--B-"), Ta = c("----U--------R--R----FF-FF-DD-DDD-D-----LL-LL----B--B-"), Ua = c("----U--------RR-RR----F--F--D-DDD-DD----L--L----BB-BB-"), Wa = c("----U--------R--R-----F--F--D-DDDDD----LL-LL-----BB-BB"), Ra = c("----U-------RRRRRR---FFFFFFDDDDDDDDD---LLLLLL---BBBBBB"), $a = c("UUUUUUUUU---RRRRRR---FFFFFFDDDDDDDDD---LLLLLL---BBBBBB"), Va = c("-U-UUU-U----RRRRRR---FFFFFFDDDDDDDDD---LLLLLL---BBBBBB"),
        y = c("UUUUUUUUUr-rRRRRRRf-fFFFFFFDDDDDDDDDl-lLLLLLLb-bBBBBBB"), db = c("---------------------F--F--D--D--D-----LLLLLL-----B--B"), mb = c("------------RRRRRR---F-FF-FD-DD-DD-D---LLLLLL---B-BB-B"), cb = c("U-U---U-Ur-rRRRRRRf-fF-FF-FD-DD-DD-Dl-lLLLLLLb-bB-BB-B"), lb = c("---------------R-R------F-FD-D---D-D------L-L------B-B"), gb = c(mathlib.SOLVED_FACELET), Ya = function () {
            function a(a, b) { for (var e = [], c = 0; 54 > c; c++)e[b[c]] = a[c]; return e } for (var b = [2, 5, 8, 1, 4, 7, 0, 3, 6, 18, 19, 20, 21, 22, 23, 24, 25, 26, 36, 37, 38, 39, 40, 41, 42, 43,
                44, 33, 30, 27, 34, 31, 28, 35, 32, 29, 45, 46, 47, 48, 49, 50, 51, 52, 53, 9, 10, 11, 12, 13, 14, 15, 16, 17], e = [53, 52, 51, 50, 49, 48, 47, 46, 45, 11, 14, 17, 10, 13, 16, 9, 12, 15, 0, 1, 2, 3, 4, 5, 6, 7, 8, 18, 19, 20, 21, 22, 23, 24, 25, 26, 42, 39, 36, 43, 40, 37, 44, 41, 38, 35, 34, 33, 32, 31, 30, 29, 28, 27], c = [11, 14, 17, 10, 13, 16, 9, 12, 15, 29, 32, 35, 28, 31, 34, 27, 30, 33, 20, 23, 26, 19, 22, 25, 18, 21, 24, 38, 41, 44, 37, 40, 43, 36, 39, 42, 2, 5, 8, 1, 4, 7, 0, 3, 6, 51, 48, 45, 52, 49, 46, 53, 50, 47], n = [], f = [], w = 0; 54 > w; w++)f[w] = w; for (w = 0; 24 > w; w++)n[w] = f.slice(), f = a(f, w & 1 ? e : c), 5 == w % 6 && (f = a(f, c), f = a(f, c)),
                    11 == w % 12 && (f = a(f, b), f = a(f, b)); return n
        }(), fb = { cross: [6, Qa], f2l: [6, Ra], oll: [6, $a], eoll: [6, Va], cpll: [6, y], fb: [24, db], sb: [24, mb], cmll: [24, cb] }, Xa = [[0, 2, 4, 3, 5, 1], [5, 1, 0, 2, 4, 3], [4, 0, 2, 1, 3, 5]], w = function () { var a = []; return function (b) { if (0 == a.length) for (var e = 0; 22 > e; e++) { var n = 21 == e ? "UUUUUUUUUFFFRRRBBBLLL" : scramble_333.getPLLImage(e)[0]; a.push(c("012345678cdeRRRRRR9abFFFFFFDDDDDDDDDijkLLLLLLfghBBBBBB".replace(/[0-9a-z]/g, function (a) { return n[parseInt(a, 36)].toLowerCase() }))) } return h(b, $a, a) } }(), n = function () {
            var a =
                []; return function (b) { if (0 == a.length) for (var e = 0; 58 > e; e++) { var n = scramble_333.getOLLImage(e)[0].replace(/G/g, "-"); a.push(c("012345678cdeRRRRRR9abFFFFFFDDDDDDDDDijkLLLLLLfghBBBBBB".replace(/[0-9a-z]/g, function (a) { return n[parseInt(a, 36)].toLowerCase() }))) } return h(b, Ra, a) }
        }(), Sa = function () {
            var a = []; return function (b) {
                if (0 == a.length) for (var e = 0; 40 > e; e++) {
                    var n = scramble_222.getEGLLImage(e)[0].replace(/G/g, "-"); a.push(c("0-1---2-36-7---R-R4-5---F-FD-D---D-Da-b---L-L8-9---B-B".replace(/[0-9a-z]/g, function (a) {
                        return n[parseInt(a,
                            36)].toLowerCase()
                    })))
                } return h(b, lb, a)
            }
        }(); return {
            getProgress: function (c, n) { switch (n) { case "cfop": return f(c, b, 6); case "fp": return f(c, e, 6); case "cf4op": return f(c, r, 6); case "roux": return f(c, a, 24); case "cf4o2p2": return f(c, z, 6); case "n": return f(c, Oa, 1) } }, getStepNames: Na, getStepCount: function (a) { return (a = Na(a)) ? a.length : 0 }, getStepProgress: function (a, b, e) { e || (e = a in fb ? fb[a][0] : 1); return f(b, Pa.bind(null, a), e) }, getPrettyMoves: bb, getPrettyReconstruction: function (a, b) {
                for (var e = "", c = bb(a), n = Na(b).reverse(),
                    f = 0, w = 0; w < c.length; w++)f += c[w][1], e += c[w][0].replace(/ /g, "") + (n[w] ? " // " + n[w] + " " + c[w][1] + " move(s)" : "") + "\n"; return { prettySolve: e, totalMoves: f }
            }, moveSeq2str: function (a) { return $.map(a, function (a) { return a[0].trim() + "@" + a[1] }).join(" ") }, getScrambledState: function (a, b) {
                var e = a[1]; if (tools.isPuzzle("333", a)) {
                    e = kernel.parseScramble(e, "URFDLB"); for (var c = new mathlib.CubieCube, n = new mathlib.CubieCube, f = c.ori = 0; f < e.length; f++) {
                        var w = e[f][0], h = e[f][2], y = 3 * w + h - 1; if (!(0 > y || 18 <= y)) {
                            if (2 == e[f][1]) {
                                y = [3, 15,
                                    17, 1, 11, 23][w]; for (var x = 0; x < h; x++)c.ori = mathlib.CubieCube.rotMult[y][c.ori]; y = mathlib.CubieCube.rotMulM[c.ori][(w + 3) % 6 * 3 + h - 1]
                            } mathlib.CubieCube.EdgeMult(c, mathlib.CubieCube.moveCube[y], n); mathlib.CubieCube.CornMult(c, mathlib.CubieCube.moveCube[y], n); c.init(n.ca, n.ea)
                        }
                    } return b ? c.toFaceCube() : c
                }
            }, identStep: function (a, b) { switch (a) { case "PLL": return w(b); case "OLL": return n(b); case "C2CLL": return Sa(b) } }, getIdentData: function (a) {
                var b = {
                    PLL: [w, scramble_333.getPLLImage, 0, 21, 0], OLL: [n, scramble_333.getOLLImage,
                        1, 58, 1], CLL: [Sa, scramble_222.getEGLLImage, 0, 40, 1]
                }; return a ? b[a] : b
            }
        }
}(); var puzzleFactory = execMain(function () {
    function c(a, b) { this.twistyScene = a; this.twisty = b } function Oa(Pa, f, bb, h) {
        if (void 0 == window.twistyjs) e = Oa.bind(null, Pa, f, bb, h), !r && document.createElement("canvas").getContext ? (r = !0, $.getScript("js/twisty.js", function () { e && e() })) : h(void 0, !0); else {
            for (var Na = /^q[2l]?$/.exec(Pa.style) ? "q" : "v", Qa = null, x = 0; x < a.length; x++)if (a[x][0] == bb) { Qa = a[x]; break } if (x = !Qa || Qa[1] != Na) Qa ? Qa[1] = Na : (Qa = [bb, Na], a.push(Qa)), b = "q" == Na ? new twistyjs.qcube.TwistyScene : new twistyjs.TwistyScene,
                Qa[2] = new c(b, null), bb.empty().append(Qa[2].getDomElement()), Qa[2].addMoveListener(f); f = Pa.puzzle; f.startsWith("cube") ? (Pa.type = "cube", Pa.faceColors = z(kernel.getProp("colcube"), [3, 4, 5, 0, 1, 2]), Pa.dimension = ~~f.slice(4) || 3, Pa.stickerWidth = 1.7) : "skb" == f ? (Pa.type = "skewb", Pa.faceColors = z(kernel.getProp("colskb"), [0, 5, 4, 2, 1, 3])) : "mgm" == f ? (Pa.type = "mgm", Pa.faceColors = z(kernel.getProp("colmgm"), [0, 2, 1, 5, 4, 3, 11, 9, 8, 7, 6, 10])) : "pyr" == f ? (Pa.type = "pyr", Pa.faceColors = z(kernel.getProp("colpyr"), [3, 1, 2, 0])) : "sq1" ==
                    f ? (Pa.type = "sq1", Pa.faceColors = z(kernel.getProp("colsq1"), [0, 5, 4, 2, 1, 3])) : "clk" == f && (Pa.type = "clk", Pa.faceColors = z(kernel.getProp("colclk"), [1, 2, 0, 3, 4])); Pa.scale = .9; Qa[2].twistyScene.initializeTwisty(Pa); Qa[2].twisty = Qa[2].twistyScene.getTwisty(); Qa[2].resize(); h(Qa[2], x)
        }
    } function z(a, b) { var e = []; a = (a || "").match(/#[0-9a-fA-F]{3}/g) || []; for (var c = 0; c < a.length; c++)e.push(~~kernel.ui.nearColor(a[b[c]], 0, !0).replace("#", "0x")); return e } var r = !1, b; c.prototype.keydown = function (a) { return this.twistyScene.keydown(a) };
    c.prototype.resize = function () { return this.twistyScene.resize() }; c.prototype.addMoves = function (a) { return this.twistyScene.addMoves(a) }; c.prototype.applyMoves = function (a) { return this.twistyScene.applyMoves(a) }; c.prototype.addMoveListener = function (a) { return this.twistyScene.addMoveListener(a) }; c.prototype.getDomElement = function () { return this.twistyScene.getDomElement() }; c.prototype.isRotation = function (a) { return this.twisty.isInspectionLegalMove(this.twisty, a) }; c.prototype.move2str = function (a) { return this.twisty.move2str(a) };
    c.prototype.moveInv = function (a) { return this.twisty.moveInv(a) }; c.prototype.toggleColorVisible = function (a) { return this.twisty.toggleColorVisible(this.twisty, a) }; c.prototype.isSolved = function (a) { return this.twisty.isSolved(this.twisty, a) }; c.prototype.moveCnt = function (a) { return this.twisty.moveCnt(a) }; c.prototype.parseScramble = function (a, b) { return this.twisty.parseScramble(a, b) }; var e = null, a = []; return { init: Oa }
}); var gripRecons = execBoth(function () {
    function c() {
        for (var b = [[2, 0, "R ", 100, 3, null], [0, 1, "R ", 100, 3, null], [2, 1, "R2", 150, 4, null], [1, 2, "R2", 150, 4, null], [1, 0, "R'", 100, 5, null], [0, 2, "R'", 100, 5, null], [2, 2, "F ", 150, 6, null], [2, 2, "F'", 200, 8, null], [0, 0, "M ", 300, 21, 11], [0, 0, "M2", 300, 22, 6], [0, 0, "M'", 200, 23, 15], [1, 4, "x'", 30, null, 11], [2, 3, "x ", 30, null, 15], [0, 0, "y ", 150, null, 3], [0, 0, "y'", 150, null, 1], [1, 1, "y ", 100, null, 3], [1, 1, "y'", 100, null, 1], [2, 2, "y ", 100, null, 3], [2, 2, "y'", 100, null, 1], [0, 1, "G01", 80, null, null], [1,
            0, "G10", 80, null, null], [0, 2, "G02", 80, null, null], [2, 0, "G20", 80, null, null], [1, 2, "G12", 120, null, null], [2, 1, "G21", 120, null, null]], e = 0; 3 > e; e++) { var a = [0, 3, 4][e]; b.push([a, a, "D ", 300, 9, null]); b.push([a, a, "D2", 250, 10, null]); b.push([a, a, "D'", 150, 11, null]); b.push([a, a, "U ", 100, 0, null]); b.push([a, a, "U2", 150, 1, null]); b.push([a, a, "U'", 200, 2, null]) } var c = { U: "U", R: "L", D: "D", F: "F", E: "E", S: "S", y: "y" }, f = { " ": "'", 2: "2", "'": " " }, r = { 0: 0, 1: 3, 2: 4, 3: 1, 4: 2 }; a = [/^([URFDLBESyz])([ 2'])|G(\d)(\d)$/, function (a, b, e, h, x) {
                return "G" ==
                    a[0] ? "G" + r[~~h] + r[~~x] : b in c ? c[b] + f[e] : a
            }]; var h = function (a) { return null == a || 7 == ~~(a / 3) ? a : 3 * [0, 4, 2, 3, 1, 5, 6, 7, 8][~~(a / 3)] + (2 - a % 3) }, Na = function (a) { return null == a ? a : { 3: 1, 1: 3 }[a] || a }, z = b.length; for (e = 0; e < z; e++) { var x = b[e]; b.push([r[x[0]], r[x[1]], x[2].replace(a[0], a[1]), x[3] + 30, h(x[4]), Na(x[5])]) } return b
    } function Oa(b, e, a) {
        var c = new r, f = {}; c.push([0, b]); f[b] = [0, b, null]; for (b = 0; ;) {
            var z = c.pop(); if (!z) break; else if (z[1] == a) break; else if (z[0] > f[z[1]][0]) continue; b++; for (var h = f[z[1]][0], Na = e(z[1]), Qa = 0; Qa <
                Na.length; Qa++) { var x = Na[Qa]; if (!(x[1] in f) || h + x[0] < f[x[1]][0]) f[x[1]] = [h + x[0], z[1], x[2]], c.push([h + x[0], x[1]]) }
        } return f
    } function z(b, e, a) {
        for (var r = c(), f = Oa(-1, function (c) {
            var f = []; if (-1 == c) { for (c = 0; 24 > c; c++)if (!(e >> c & 1)) for (var h = 0; 5 > h; h++)f.push([0, c << 3 | h, [0, 0, mathlib.CubieCube.rot2str[c]]]); return f } h = c >> 8; var Na = c >> 3 & 31, z = c & 7; h == b.length && (a >> Na & 1 || f.push([0, -2, [0, 0, "Gend ori=" + Na + " hand=" + z]])); for (c = 0; c < r.length; c++) {
                var Ra = r[c]; if (Ra[0] == z) {
                    var $a = Ra[1], Va = Na, y = h; if (null != Ra[4]) {
                        if (mathlib.CubieCube.rotMulM[Na][Ra[4] %
                            18] + (18 <= Ra[4] ? 18 : 0) != b[h]) continue; y++
                    } null != Ra[5] && (Va = mathlib.CubieCube.rotMult[Ra[5]][Va]); f.push([Ra[3], y << 8 | Va << 3 | $a, Ra])
                }
            } return f
        }, -2), z = -2, h = []; -1 != z;) { var Na = f[z]; if (!Na) break; Na.splice(2, 0, z); h.push(Na); z = Na[1] } h.reverse(); return h
    } var r = function () {
        function b() { this.arr = [] } b.prototype.pop = function () { var b = this.arr, a = b.pop(); if (!b.length) return a; for (var c = b[0], f = 0; ;) { var r = 2 * f + 1; r + 1 < b.length && b[r][0] > b[r + 1][0] && r++; if (r >= b.length || a[0] <= b[r][0]) break; b[f] = b[r]; f = r } b[f] = a; return c }; b.prototype.push =
            function (b) { for (var a = this.arr, c = a.length, e; 0 <= (e = c - 1 >> 1) && b[0] < a[e][0];)a[c] = a[e], c = e; a[c] = b }; return b
    }(); return {
        getBestAlgorithmStr: function (b, c, a) { var e = new mathlib.CubieCube; e.ori = 0; b = b.split(/ +/); for (var f = [], r = 0; r < b.length; r++) { var h = e.selfMoveStr(b[r]); void 0 != h && f.push(h) } return z(f, c, a) }, getBestAlgorithm: z, getPrettyReconstruction: function (b, c) {
            var a = "", e = [], f = new mathlib.CubieCube; f.ori = 0; var r = []; b = cubeutil.getPrettyMoves(b); for (var h = 0; h < b.length; h++) {
                for (var Na = b[h][0], Qa = 0; Qa < Na.length; Qa +=
                    2) { var x = f.selfMoveStr(Na.slice(Qa, Qa + 2)); void 0 != x && e.push(x) } r.push(e.length)
            } f = z(e); var Ta = Na = 0; Qa = cubeutil.getStepNames(c).reverse(); for (h = 0; h < f.length; h++)for (x = f[h][2]; x >> 8 >= r[Na];) { Ta = f.slice(Ta, h + 1); for (var Ua = [], Wa = 0; Wa < Ta.length; Wa++) { var Ra = Ta[Wa]; "G" != Ra[3][2][0] && Ua.push(Ra[3][2]) } Ta = Ua.join(" ").replace(/ +/g, " "); a += Ta + (Qa[Na] ? " // " + Qa[Na] + " " + (r[Na] - (r[Na - 1] || 0)) + " move(s)" : "") + "\n"; Ta = h + 1; Na++ } return { prettySolve: a, totalMoves: e.length }
        }, updateReconsOri: function (b) {
            var c = b.split(" "),
            a = []; b = []; for (var r = new mathlib.CubieCube, f = r.ori = 0; f < c.length; f++) { var bb = /^(.*)@(\d+)$/.exec(c[f]); if (bb) { var h = r.selfMoveStr(bb[1]); void 0 != h && (a.push(h), b.push(~~bb[2])) } } c = z(a); a = []; r = []; var Na = 0; for (f = bb = 0; f < c.length; f++) {
                var Qa = c[f]; if ("G" != Qa[3][2][0]) {
                    var x = Qa[2] >> 8; if (x == Na) for (Qa = Qa[3][2].split(" "), h = 0; h < Qa.length; h++)Qa[h] && r.push(Qa[h]); else {
                        var Ta = b[x - 1]; for (h = 0; h < r.length; h++)Na = bb + Math.floor((Ta - bb) * (h + 1) / (r.length + 1)), a.push(r[h].trim() + "@" + Na); a.push(Qa[3][2].trim() + "@" + Ta); Na =
                            x; bb = Ta; r = []
                    }
                }
            } return a.join(" ").replace(/[EMS]/g, function (a) { return ["2-2Dw", "2-2Lw", "2-2Fw"]["EMS".indexOf(a)] })
        }
    }
}); var JSON; JSON || (JSON = {});
(function () {
    function c(a) { return 10 > a ? "0" + a : a } function Oa(a) { b.lastIndex = 0; return b.test(a) ? '"' + a.replace(b, function (a) { var b = Pa[a]; return "string" === typeof b ? b : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4) }) + '"' : '"' + a + '"' } function z(b, c) {
        var h, r, x = e, Ta = c[b]; Ta && "object" === typeof Ta && "function" === typeof Ta.toJSON && (Ta = Ta.toJSON(b)); "function" === typeof f && (Ta = f.call(c, b, Ta)); switch (typeof Ta) {
            case "string": return Oa(Ta); case "number": return isFinite(Ta) ? "" + Ta : "null"; case "boolean": case "null": return "" +
                Ta; case "object": if (!Ta) return "null"; e += a; var Pa = []; if ("[object Array]" === Object.prototype.toString.apply(Ta)) { var Wa = Ta.length; for (h = 0; h < Wa; h += 1)Pa[h] = z(h, Ta) || "null"; var Ra = 0 === Pa.length ? "[]" : e ? "[\n" + e + Pa.join(",\n" + e) + "\n" + x + "]" : "[" + Pa.join(",") + "]"; e = x; return Ra } if (f && "object" === typeof f) for (Wa = f.length, h = 0; h < Wa; h += 1)"string" === typeof f[h] && (r = f[h], (Ra = z(r, Ta)) && Pa.push(Oa(r) + (e ? ": " : ":") + Ra)); else for (r in Ta) Object.prototype.hasOwnProperty.call(Ta, r) && (Ra = z(r, Ta)) && Pa.push(Oa(r) + (e ? ": " : ":") +
                    Ra); Ra = 0 === Pa.length ? "{}" : e ? "{\n" + e + Pa.join(",\n" + e) + "\n" + x + "}" : "{" + Pa.join(",") + "}"; e = x; return Ra
        }
    } "function" !== typeof Date.prototype.toJSON && (Date.prototype.toJSON = function () { return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + c(this.getUTCMonth() + 1) + "-" + c(this.getUTCDate()) + "T" + c(this.getUTCHours()) + ":" + c(this.getUTCMinutes()) + ":" + c(this.getUTCSeconds()) + "Z" : null }, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function () { return this.valueOf() }); var r = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        b = /[\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, e, a, Pa = { "\b": "\\b", "\t": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\" }, f; "function" !== typeof JSON.stringify && (JSON.stringify = function (b, c, r) { var h; a = e = ""; if ("number" === typeof r) for (h = 0; h < r; h += 1)a += " "; else "string" === typeof r && (a = r); if ((f = c) && "function" !== typeof c && ("object" !== typeof c || "number" !== typeof c.length)) throw Error("JSON.stringify"); return z("", { "": b }) });
    "function" !== typeof JSON.parse && (JSON.parse = function (a, b) {
        function c(a, e) { var f, h, x = a[e]; if (x && "object" === typeof x) for (f in x) Object.prototype.hasOwnProperty.call(x, f) && (h = c(x, f), void 0 !== h ? x[f] = h : delete x[f]); return b.call(a, e, x) } var e; a = "" + a; r.lastIndex = 0; r.test(a) && (a = a.replace(r, function (a) { return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4) })); if (/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
            "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return e = eval("(" + a + ")"), "function" === typeof b ? c({ "": e }, "") : e; throw new SyntaxError("JSON.parse");
    })
})(); var kernel = execMain(function () {
    function c(a, b) { DEBUG && console.log("[signal]", a, b); if (void 0 != f[a]) for (var c in f[a]) if (void 0 === f[a][c][1] || f[a][c][1].exec(b[0])) f[a][c][0](a, b) } function Oa(a, b, c, e) { void 0 == f[b] && (f[b] = {}); f[b][a] = [c, e] } function z(a, b) {
        if (0 > a) return "DNF"; var c = h("useMilli"); a = Math.floor(a / (c ? 1 : 10)); var e = a % (c ? 1E3 : 100); a = Math.floor(a / (c ? 1E3 : 100)); var f = h("timeFormat"), x = 0, r = 0; "h" == f ? (f = a % 60, x = Math.floor(a / 60) % 60, r = Math.floor(a / 3600)) : "m" == f ? (f = a % 60, x = Math.floor(a / 60)) : f = a; var Va = (b =
            b && h("smallADP")) ? ["</span>"] : []; Va.push(e); 10 > e && Va.push("0"); 100 > e && c && Va.push("0"); Va.push(f + "." + (b ? '<span style="font-size:0.75em;">' : "")); 10 > f && 0 < x + r && Va.push("0"); 0 < x + r && Va.push(x + ":"); 10 > x && 0 < r && Va.push("0"); 0 < r && Va.push(r + ":"); return Va.reverse().join("")
    } function r() { for (var a = h(tools.isCurTrainScramble() ? "preScrT" : "preScr", "").split(" "), b = new mathlib.CubieCube, c = 0; c < a.length; c++)b.selfMoveStr(a[c]); return b.ori || 0 } function b(a) {
        if (0 >= a) return a; var b = h("useMilli") ? 1 : 10; return Math.round(a /
            b) * b
    } function e() { timer.refocus() } $.ajaxSetup({ cache: !0 }); var a = $("<div />").css("visibility", "hidden"), Pa = $('<div id="wndctn" />'), f = {}, bb = function () {
        function a() { var a = $(this).data("module"); b(a); e(a) } function b(a) { if (!Za[a][0].hasClass("enable")) { for (var b in Za) Za[b][0].removeClass("enable"); Za[a][0].addClass("enable"); qb = a } } function e(a) { setTimeout(function () { Ua.scrollTop(a ? Ua.scrollTop() + Za[a][1].position().top - 3 : nb) }, 0) } function f() {
            nb = Ua.scrollTop(); var a = "kernel", c; for (c in Za) 50 < Za[c][1].position().top ||
                (a = c); b(a)
        } function h(a) {
            a = $(this); var b = a.prop("name"); if (a.is(".opthelp")) " [?] " == a.html() ? a.html("<br> [?] " + $('strong[data="opt_' + a.attr("data") + '"]').parent().html().split("</strong>. ")[1]) : a.html(" [?] "); else if (a.is("select")) Ta(b, a.val()); else switch (a.prop("type")) {
                case "checkbox": Ta(b, a.prop("checked")); break; case "color": if (a.attr("data")) { var c = 4 * ~~a.attr("data") - 4, e = Ra(b); Ta(b, [e.slice(0, c), x.nearColor(a.val()), e.slice(c + 4)].join("")) } else Ta(b, a.val()); break; case "text": case "button": for (c in Sa) if (b in
                    Sa[c]) { c = Sa[c][b]; e = Ra(b); switch (a.val()) { case "+": e = Math.min(e + 1, c[3][2]); break; case "-": e = Math.max(e - 1, c[3][1]); break; default: a.val().match(/^\d+$/) && (e = +a.val().match(/^0*(.+)$/)[1], e = Math.max(Math.min(e, c[3][2]), c[3][1])) }c[0].val(e); Ta(b, e); break }
            }
        } function r() {
            Za = {}; kb.empty(); Qa.empty(); Ua.unbind("scroll").scroll(f); for (var b in MODULE_NAMES) {
                0 === qb && (qb = b); var c = Za[b] = [$("<div>"), $("<tr>")]; c[0].html('<span class="icon" style="font-size:1em;">' + Wa[b] + "</span><span>" + MODULE_NAMES[b] + "</span>").addClass("tab").data("module",
                    b).click(a).appendTo(kb); c[1].append($("<th>").html('<span class="icon">' + Wa[b] + "</span> " + MODULE_NAMES[b].replace(/-?<br>-?/g, "")), $('<th class="sr">').html(PROPERTY_SR), $('<th class="sr">').html('<span class="icon"></span>')); Qa.append(c[1]); for (var e in Sa[b]) {
                        c = Sa[b][e]; var n = Ra(e), w = c[1], y = Ra("sr_" + e), r = $('<td class="sr">'); c[4] & 1 && r.append($('<input type="checkbox" name="sr_' + e + '"' + (y ? " checked" : "") + ">").click(h)); y = $("<td colspan=2>"); if (0 > w) if ($.urlParam("debug")) w = ~w; else continue; if (0 ==
                            w) c[0] = $('<input type="checkbox" name="' + e + '">').prop("checked", n).click(h), y.append($("<label>").append(c[0], c[2])); else if (1 == w) { c[0] = $('<select name="' + e + '">'); var Va = c[3][1], ab = c[3][2]; for (w = 0; w < Va.length; w++)c[0].append($("<option />").val(Va[w]).html(ab[w])); c[0].val(n); c[0].change(h); y.append(c[2], ": ", c[0]) } else if (2 == w) c[0] = $('<input type="text" maxlength="4" name="' + e + '">').val(n).change(h), n = $('<input type="button" style="width: 1.5em;" value="+" name="' + e + '">').click(h), w = $('<input type="button" style="width: 1.5em;" value="-" name="' +
                                e + '">').click(h), y.append(c[2] + "(" + c[3][1] + "~" + c[3][2] + ")", $("<span>").css("white-space", "nowrap").append(w, c[0], n)); else if (3 == w) c[0] = $('<input type="color" name="' + e + '">').val(n).change(h), y.append(c[2], ": ", c[0]); else if (4 == w) {
                                    Va = n.match(/#[0-9a-fA-F]{3}/g) || []; c[0] = $('<input type="text" name="' + e + '" style="display:none">').val(n); n = []; for (w = 0; w < Va.length; w++)n.push($('<input type="color" name="' + e + '" data="' + (w + 1) + '" class="mulcolor">').val(x.nearColor(Va[w], 0, !0)).change(h)); y.append(c[2], ": ",
                                        c[0], n)
                                } else 5 == w && ($.urlParam("debug") ? (c[0] = $('<input type="text" name="' + e + '" readonly>').val(n), y.append(c[2] + " (" + e + "): ", c[0])) : (c[0] = $('<input type="text" name="' + e + '" style="display:none">').val(n), y.append(c[2], c[0]))); 0 < $('strong[data="opt_' + e + '"]').length && y.append($('<span class="click opthelp" data="' + e + '"/>').html(" [?] ").click(h)); Qa.append($("<tr>").append(y, r))
                    }
            } Qa.append($('<tr style="height: 10em;">')); Za[qb][0].click()
        } function Na() {
            Pa && (r(), Pa = !1); $(".opthelp").html(" [?] ");
            e(); x.showDialog([eb, $.noop, void 0, $.noop, [RESET_LANG, function () { for (var a in n) { var b = n[a]; void 0 === b || Ra(a) === b || a.startsWith("session") || (delete w[a], c("property", [a, b, "reset"])) } r(); return !1 }], [BUTTON_EXPORT.replace(/-?<br>-?/g, ""), exportFunc.exportProperties]], "option", BUTTON_OPTIONS.replace(/-?<br>-?/g, ""), function () { ab.find('select[name="lang"]').focus().blur(); e() })
        } function Ra(a, b) {
            void 0 != b && void 0 == n[a] && (n[a] = b, c("property", [a, Ra(a), "set"])); w[a] === n[a] && delete w[a]; return a in w ? w[a] :
                n[a]
        } function Ta(a, b, e) { for (var n in Sa) if (a in Sa[n] && void 0 !== Sa[n][a][0] && Sa[n][a][0].val() != b) { Sa[n][a][0].val(b); break } Ra(a) !== b && (w[a] = b, c("property", [a, Ra(a), e || "modify"])) } function z() { localStorage.properties = JSON.stringify(w) } function Xa() { var a = localStorage.properties; void 0 != a && "" != a && (w = JSON.parse(a)) } var w = {}, n = {}, Sa = {}, Za = {}, Pa = !0, Ua = $('<div class="noScrollBar">'), Qa = $('<table class="opttable">'), eb = $('<table class="options" />'), kb = $("<td />"), ab = $("<td />").addClass("tabValue"); eb.append($("<tr />").append(kb,
            ab.append(Ua.append(Qa)))); var qb = 0, nb = 0, Wa = { kernel: "", ui: "", color: "", timer: "", scramble: "", stats: "", tools: "", vrc: "" }; $(function () { Xa(); x.addButton("property", BUTTON_OPTIONS, Na, 1); Oa("property", "property", z) }); return {
                get: Ra, set: Ta, reg: function (a, b, e, f, w, h) { Pa = !0; void 0 == Sa[a] && (Sa[a] = {}); Sa[a][b] = [void 0, e, f, w, h]; n[b] = w[0]; n["sr_" + b] = 2 == (h & 2); c("property", [b, Ra(b), "set"]) }, getSProps: function () { var a = {}, b; for (b in w) 0 != b.indexOf("sr_") && Ra("sr_" + b, !1) && (a[b] = Ra(b)); return a }, setSProps: function (a) {
                    for (var b in n) 0 !=
                        b.indexOf("sr_") && Ra("sr_" + b, !1) && (b in a ? Ta(b, a[b], "session") : Ta(b, n[b], "session"))
                }, load: Xa, reload: r
            }
    }(), h = bb.get, Na = bb.set, Qa = bb.reg; $(function () {
        var a = LANG_CUR || "en-us"; Qa("kernel", "lang", 1, "Language", [a, (LANG_SET + "|h").split("|").slice(1), (LANG_STR + "|help translation").split("|")]); Na("lang", a); Qa("kernel", "showad", 0, PROPERTY_SHOWAD, [!0]); Oa("kernel", "property", function (b, c) {
            c[1] != a && "modify" == c[2] && ("h" == c[1] ? confirm("Press OK to redirect to crowdin for translating cstimer") && (window.location.href =
                "https://crowdin.com/project/cstimer") : window.location.href = "?lang=" + c[1], Na("lang", a))
        }, /^lang$/); if ($.urlParam("lang")) { var b = "lang=" + $.urlParam("lang"); document.cookie = b + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/"; $.clearUrl("lang") }
    }); var x = function () {
        function b(a, b, c, e) { rb = rb || $("#leftbar"); rb.children(".c" + e).click(c).find("span:first").html(b) } function f() {
            var a = $(this), b = a.data("module"); kb[b].button ? (a.removeClass("enable"), ab && kb[b].auto || kb[b].div.stop(!0, !0).fadeOut(200, function (a) {
                return function () {
                    c("button",
                        [a, !1])
                }
            }(b))) : (a.addClass("enable"), c("button", [b, !0]), kb[b].div.stop(!0, !0).fadeIn(200), ab && kb[b].auto && kb[b].div.hide()); kb[b].button = !kb[b].button; Na(b, kb[b].button)
        } function y() { var a = $(this).attr("data"); Na(a, !h(a, !1)) } function x() { if (document.fullscreenElement) document.exitFullscreen && document.exitFullscreen(); else { var a = $("body")[0]; a.requestFullscreen && a.requestFullscreen() } } function r(b, c, e, n) {
            qb = !0; wb.removeClass().addClass("dialog").addClass("dialog" + c); zb.html(e); "option" == c ? zb.prepend(Cb.unbind("click").click(x)) :
                "logo" == c && zb.prepend(Bb.unbind("click").click(function () { location.reload(!0) })); yb.children().appendTo(a); b[0].appendTo(yb.empty()); Fb.empty(); 2 > b.length ? yb.css("bottom", "0") : yb.css("bottom", "2.5em"); void 0 != b[1] && Fb.append(pb.unbind("click").click(function () { $.waitUser.call(); b[1] && b[1](); Ra() })); void 0 != b[2] && Fb.append(Eb.unbind("click").click(function () { $.waitUser.call(); b[2] && b[2](); Ra() })); nb.unbind("click"); void 0 != b[3] && nb.click(function () { $.waitUser.call(); b[3] && b[3](); Ra() }); for (c = 4; c < b.length; c++)Fb.append($('<input type="button" class="buttonOK">').val(b[c][0]).unbind("click").click(function (a) {
                    return function () {
                        $.waitUser.call();
                        a() && Ra()
                    }
                }(b[c][1]))); wb.stop(!0, !0).fadeTo(100, .98, function () { b[0].focus(); n && n() }); nb.stop(!0, !0).fadeTo(100, .25)
        } function Ra() { wb.stop(!0, !0).fadeOut(100, function () { qb || (yb.children().appendTo(a), wb.removeClass(), e()) }); nb.hide(); qb = !1 } function Ta() { if (!ab) { ab = !0; Ua(); for (var a in kb) kb[a].auto && kb[a].button && kb[a].div.stop(!0, !0).fadeOut(100); c("ashow", !1) } } function z() { if (ab) { ab = !1; Ua(); for (var a in kb) kb[a].auto && kb[a].button && kb[a].div.stop(!0, !0).fadeIn(100); c("ashow", !0) } } function Ua(a) {
            var b =
                !1, c; for (c in kb) if (kb[c].button) { b = !0; break } b && !ab || a || jQuery.fx.off ? rb.stop(!0, !0).fadeTo(200, 1) : rb.stop(!0, !0).fadeTo(200, .01)
        } function Wa(a) { for (var b = 0; 7 > b; b++)sb[b] = w(a.substr(4 * b, 4)); Na("col-font", w(sb[0], 0, !0)); Na("col-back", w(sb[1], 0, !0)); Na("col-board", w(sb[2], 0, !0)); Na("col-button", w(sb[3], 0, !0)); Na("col-link", w(sb[4], 0, !0)); Na("col-logo", w(sb[5], 0, !0)); Na("col-logoback", w(sb[6], 0, !0)); Xa() } function Xa() {
            for (var a = "ns" == h("uidesign") || "mtns" == h("uidesign") ? Ab[1] : Ab[0], b = "#000" == w(sb[0]) ?
                -1 : 1, c = 0; c < Ib.length; c++)a = a.replace("?", w(sb[Ib[c] & 15], (Ib[c] << 20 >> 24) * b)); Kb[0].styleSheet ? Kb[0].styleSheet.cssText = a : Kb[0].innerHTML = a
        } function w(a, b, c) {
            var e, n; b = b || 0; (n = /^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/.exec(a)) && (e = [n[1] + n[1], n[2] + n[2], n[3] + n[3]]); (n = /^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/.exec(a)) && (e = [n[1], n[2], n[3]]); for (a = 0; 3 > a; a++)e[a] = parseInt(e[a], 16), e[a] += b, e[a] = Math.min(Math.max(e[a], 0), 255), e[a] = Math.round(e[a] / 17).toString(16); return "#" + (c ? e[0] + e[0] + e[1] +
                e[1] + e[2] + e[2] : e[0] + e[1] + e[2])
        } function n(a) { return (a = /^\s*((#[0-9a-fA-F]{3}){7})\s*$/.exec(a)) ? (Wa(a[1]), !0) : !1 } function Sa() { return sb.join("") } function Za() { "mt" == h("uidesign") || "mtns" == h("uidesign") ? $("html").addClass("mtds") : $("html").removeClass("mtds") } function hb() { var a = $(window).width(), b = $(window).height(), c = h("view"); (xb = "m" == c ? !0 : "d" == c ? !1 : 1.2 > a / b) ? $("html").addClass("m") : $("html").removeClass("m") } function ob(a, b) {
            if ("property" == a) switch (b[0]) {
                case "color": if ("u" != b[1]) if ("i" == b[1] ||
                    "e" == b[1]) { var c = Sa(), e = prompt(EXPORT_CODEPROMPT, c); e && e != c && !n(e) && alert(COLOR_FAIL); bb.set("color", "u") } else Wa(tb["r" == b[1] ? ~~(Math.random() * tb.length) : b[1] - 1]); break; case "font": "r" == b[1] ? $("#container, #multiphase").css("font-family", ["lcd", "lcd2", "lcd3", "lcd4", "lcd5"][~~(5 * Math.random())]) : $("#container, #multiphase").css("font-family", b[1]); break; case "col-font": case "col-back": case "col-board": case "col-button": case "col-link": case "col-logo": case "col-logoback": c = Mb.indexOf(b[0].substring(4,
                        b[0].length)); e = b[1]; e = w(e); sb[c] != e && (sb[c] = e, Na("color", "u"), Xa()); break; case "zoom": $("html").removeClass("p70 p80 p90 p100 p110 p125 p150").addClass("p" + ~~(100 * b[1])), $(window).trigger("resize"), Za(); case "view": hb(); break; case "uidesign": Za(); Xa(); break; case "wndScr": jb("scramble", "f" == b[1]); break; case "wndStat": jb("stats", "f" == b[1]); break; case "wndTool": jb("tools", "f" == b[1])
            }
        } function jb(a, b) { kb[a] ? b ? kb[a].div.addClass("fixed") : kb[a].div.removeClass("fixed") : $(jb.bind(void 0, a, b)) } function eb() {
            n(window.location.hash) &&
            (bb.set("color", "u"), $.clearHash())
        } var kb = {}, ab = !1, qb = !1, nb, rb, ub = $("<div />"), vb = { scramble: "scrHide", tools: "toolHide", stats: "statHide" }, wb = $("<div />").addClass("dialog"), zb = $("<div />").addClass("title"), yb = $("<div />").addClass("value"), Fb = $("<div />").addClass("button"), pb = $('<input type="button" class="buttonOK">').val(OK_LANG), Eb = $('<input type="button" class="buttonOK">').val(CANCEL_LANG); wb.append(zb, yb, Fb); var Cb = $('<span style="position:absolute;left:0.5em" class="click">&nbsp;⇱&nbsp;</span>'),
            Bb = $('<span style="float:left;" class="click">&nbsp;↻&nbsp;</span>'), Kb = $("<style>").appendTo("head"), Ab = "html,body,textarea,#leftbar{color:?;background-color:?}#leftbar{border-color:?}#logo{color:?;border-color:?;background-color:?}.mybutton,.tab,.cntbar{border-color:?}html:not(.m) .mybutton:hover,.mybutton:active,.tab:active,.mywindow,.popup,.dialog{background-color:?}.mybutton.enable,.tab.enable,.cntbar,.selected,table.opttable tr th:first-child,div.helptable h2,div.helptable h3,.sflt div.sgrp{background-color:?}#gray{background-color:?}html:not(.m) .times:hover,html:not(.m) .click:hover,.times:active,.click:active,textarea{background-color:?}.click{color:?}.mywindow,.popup,.dialog,.table,.table td,.table th,textarea,.tabValue,.opttable td.sr,.sflt .bimg{border-color:?}html:not(.m) #avgstr .click:hover,#avgstr .click:active{background-color:?}select,input[type='button'],input[type='text']{color:?;background:?;border-color:?}input:disabled,table.opttable tr:nth-child(odd) td:first-child,div.helptable li:nth-child(odd){background:?}.mywindow::before,.popup,.dialog,#leftbar::before";
        Ab = [Ab + "{box-shadow:0 0 .6em ?}", Ab + "{box-shadow:none}"]; var tb = "#000#efc#fdd#fbb#00f#ff0#000 #000#ffe#ff9#ff0#00f#fa0#000 #fff#600#668#408#ccf#0ff#000 #fff#000#555#888#aaa#000#aaa #000#fff#ccc#ddd#555#fff#888 #fff#227#9c3#563#580#dad#000 #9aa#023#034#b80#28d#678#034 #678#ffe#eed#ffe#28d#678#eed".split(" "), sb = "#000 #efc #fdd #fbb #dbb #ff0 #000".split(" "), Ib = [0, 1, 545, 5, 549, 6, 546, 2, 3, 0, 546, 4, 546, 545, 0, 3826, 546, 274, 0], Mb = "font back board button link logo logoback".split(" "), xb = !1; $(function () {
            nb =
            $("#gray"); Oa("ui", "property", ob, /^(?:color|font|col-.+|zoom|view|uidesign|wnd(?:Scr|Stat|Tool))/); Qa("ui", "zoom", 1, ZOOM_LANG, ["1", "0.7 0.8 0.9 1 1.1 1.25 1.5".split(" "), "70% 80% 90% 100% 110% 125% 150%".split(" ")]); Qa("ui", "font", 1, PROPERTY_FONT, ["lcd", "r Arial lcd lcd2 lcd3 lcd4 lcd5 Roboto".split(" "), PROPERTY_FONT_STR.split("|").concat("Roboto")]); Qa("kernel", "ahide", 0, PROPERTY_AHIDE, [!0]); Qa("ui", "uidesign", 1, PROPERTY_UIDESIGN, ["n", ["n", "mt", "ns", "mtns"], PROPERTY_UIDESIGN_STR.split("|")]);
            Qa("ui", "view", 1, PROPERTY_VIEW, ["a", ["a", "m", "d"], PROPERTY_VIEW_STR.split("|")]); Qa("color", "color", 1, PROPERTY_COLOR, ["1", "uer12345678".split(""), PROPERTY_COLOR_STR.split("|")]); var a = PROPERTY_COLORS.split("|"); Qa("color", "col-font", 3, a[0], ["#000000"]); Qa("color", "col-back", 3, a[1], ["#eeffcc"]); Qa("color", "col-board", 3, a[2], ["#ffdddd"]); Qa("color", "col-button", 3, a[3], ["#ffbbbb"]); Qa("color", "col-link", 3, a[4], ["#0000ff"]); Qa("color", "col-logo", 3, a[5], ["#ffff00"]); Qa("color", "col-logoback", 3, a[6], ["#000000"]);
            Qa("color", "col-timer", 4, "Timer", ["#f00#0d0#dd0#080#f00"]); Qa("color", "colcube", 4, "Cube", ["#ff0#fa0#00f#fff#f00#0d0"]); Qa("color", "colpyr", 4, "Pyraminx", ["#0f0#f00#00f#ff0"]); Qa("color", "colskb", 4, "Skewb", ["#fff#00f#f00#ff0#0f0#f80"]); Qa("color", "colmgm", 4, "Megaminx", ["#fff#d00#060#81f#fc0#00b#ffb#8df#f83#7e0#f9f#999"]); Qa("color", "colsq1", 4, "SQ1", ["#ff0#f80#0f0#fff#f00#00f"]); Qa("color", "colclk", 4, "Clock", ["#f00#37b#5cf#ff0#850"]); Qa("color", "col15p", 4, "15 Puzzle", ["#f99#9f9#99f#fff"]); Qa("color",
                "colfto", 4, "FTO", ["#fff#808#f00#0d0#00f#bbb#ff0#fa0"]); Qa("ui", "wndScr", 1, PROPERTY_WNDSCR, ["n", ["n", "f"], PROPERTY_WND_STR.split("|")]); Qa("ui", "wndStat", 1, PROPERTY_WNDSTAT, ["n", ["n", "f"], PROPERTY_WND_STR.split("|")]); Qa("ui", "wndTool", 1, PROPERTY_WNDTOOL, ["n", ["n", "f"], PROPERTY_WND_STR.split("|")]); $(".donate").appendTo(ub); b("donate", BUTTON_DONATE, function () { r([ub, 0, void 0, 0], "stats", BUTTON_DONATE.replace(/-?<br>-?/g, "")) }, 5); rb.appendTo(Pa).mouseenter(function () { Ua(!0) }).mouseleave(function () { Ua() });
            setTimeout(Ua, 3E3); wb.appendTo("body"); $(window).resize(hb); $(window).bind("hashchange", eb); eb(); "https:" != location.protocol && (document.title = "[UNSAFE] " + document.title); if (navigator.wakeLock && navigator.wakeLock.request) {
                var c = function () { return navigator.wakeLock.request("screen").then(function (a) { DEBUG && console.log("[ui]", "Screen Wake Lock is active"); a.addEventListener("release", function () { DEBUG && console.log("[ui]", "Screen Wake Lock is released") }) }) }; c(); document.addEventListener("visibilitychange",
                    function () { "visible" === document.visibilityState && c() })
            }
        }); return {
            addWindow: function (a, b, e, n, w, x) { e.appendTo(Pa); e.addClass("mywindow"); e.append($('<span class="chide" data="' + vb[a] + '"></span>').click(y)); n = h(a, n); rb = rb || $("#leftbar"); rb.children(".c" + x).addClass(n ? "enable" : "").data("module", a).click(f).find("span:first").html(b); kb[a] = { button: n, div: e, auto: w }; n ? e.show() : e.hide(); c("button", [a, n]) }, addButton: b, showDialog: r, hideDialog: Ra, isDialogShown: function (a) { return wb.hasClass("dialog" + a) }, exportColor: Sa,
            nearColor: w, setAutoShow: function (a) { (a = a || !h("ahide")) ? z() : Ta(); timer.showAvgDiv(a) }, hide: Ta, show: z, isPop: function () { return qb }, toggleLeftBar: Ua
        }
    }(), Ta = function () {
        function a(a, b, c, e, f) { this.data = a; this.callback = b; this.select1 = c; this.select2 = e; this.reset(f) } function b(a, b, c) { for (var e = 0; e < a.length; e++)if ($.isArray(a[e][1])) for (var f = 0; f < a[e][1].length; f++) { if (a[e][1][f][1] == b) { c(e, f); return } } else if (a[e][1] == b) { c(e, null); break } } var c = a.prototype; c.loadSelect2 = function (a) {
            e(); a = a || 0; var b = ~~this.select1.prop("selectedIndex");
            b = (this.data[b] || [])[1]; this.select2.empty(); if ($.isArray(b)) { this.select2.show(); for (var c = 0; c < b.length; c++)this.select2.append($("<option>").html(b[c][0]).val(b[c][1])); this.select2.prop("selectedIndex", a) } else this.select2.hide(); this.onSelect2Change()
        }; c.onSelect1Change = function () { this.loadSelect2() }; c.onSelect2Change = function () { this.callback && this.callback(this.getSelected()) }; c.getSelIdx = function () {
            var a = ~~this.select1.prop("selectedIndex"); if (!$.isArray((this.data[a] || [])[1])) return [a]; var b =
                ~~this.select2.prop("selectedIndex"); return [a, b]
        }; c.getSelected = function () { var a = this.getSelIdx(), b = (this.data[a[0]] || [])[1]; return 1 == a.length ? b : (b && b[a[1]] || [])[1] }; c.reset = function (a) {
            a = a || this.getSelected(); this.select1.empty(); for (var b = 0; b < this.data.length; b++)this.select1.append($("<option>").html(this.data[b][0]).val($.isArray(this.data[b][1]) ? b : this.data[b][1])); this.select1.unbind("change").change(this.onSelect1Change.bind(this)); this.select2.unbind("change").change(this.onSelect2Change.bind(this));
            a && this.loadVal(a)
        }; c.loadVal = function (a) { var c = this.callback; this.callback = null; b(this.data, a, function (a, b) { this.select1.prop("selectedIndex", a); this.loadSelect2(b) }.bind(this)); this.callback = c }; c.getValName = function (a) { var c = null; b(this.data, a, function (a, b) { c = this.data[a][0]; null != b && (c += ">" + this.data[a][1][b][0]) }.bind(this)); return c }; c.getValIdx = function (a) { var c = null; b(this.data, a, function (a, b) { c = 100 * a + (null == b ? b : 99) }); return c }; return a
    }(); (function () {
        function a(a, y) {
            if ("bgImgO" == y[0]) e.stop(!0,
                !0).fadeTo(0, y[1] / 100); else if ("bgImgS" == y[0]) if ("n" == y[1]) e.hide(), f = "n"; else if (e.show(), "u" == y[1]) if ("modify" == y[2]) { var Va = prompt(BGIMAGE_URL, b); x.exec(Va) && 2048 > Va.length ? (b = Va, e.attr("src", b), Na("bgImgSrc", b)) : (alert(BGIMAGE_INVALID), Na("bgImgS", f), bb.reload()) } else b = h("bgImgSrc", b), e.attr("src", b); else "f" == y[1] ? (storage.getKey("bgImgFile").then(function (a) { a ? e.attr("src", URL.createObjectURL(a)) : "modify" != y[2] && (Na("bgImgS", "n"), bb.reload()) }), "modify" == y[2] && (r.unbind("change").change(function () {
                    if (r[0].files.length) {
                        var a =
                            r[0].files[0]; e.attr("src", URL.createObjectURL(a)); storage.setKey("bgImgFile", a)
                    }
                }), r.click())) : (f = y[1], e.attr("src", c[y[1]]))
        } var b = "", c = ["https://i.imgur.com/X7Xi7D1.png", "https://i.imgur.com/K4zbMsu.png", "https://i.imgur.com/Fsh6MaM.png"], e, f = 0, x = /^((http|https|ftp):\/\/)?(\w(:\w)?@)?([0-9a-z_-]+\.)*?([a-z0-9-]+\.[a-z]{2,6}(\.[a-z]{2})?(:[0-9]{2,6})?)((\/[^?#<>\/\\*":]*)+(\?[^#]*)?(#.*)?)?$/i, r = $('<input type="file" id="imgfile" accept="image/*"/>'); $(function () {
            e = $("#bgImage"); Oa("bgImage", "property",
                a, /^bgImg[OS]$/); Qa("ui", "bgImgO", 2, BGIMAGE_OPACITY, [25, 0, 100]); Qa("ui", "bgImgS", 1, BGIMAGE_IMAGE, ["n", ["n", "u", 0, 1, 2, "f"], BGIMAGE_IMAGE_STR.split("|").slice(0, -1).concat(1, 2, 3, "upload")])
        })
    })(); var Ua = /^([\d]+(?:-\d+)?)?([FRUBLDfrubldzxySME])(?:([w])|&sup([\d]);)?([2'])?$/, Wa = function () { function a() { c && clearTimeout(c) } function b() { a(); timer.onkeydown({ which: 28 }) } var c = 0; return { startLongTouch: function () { a(); c = setTimeout(b, 2E3) }, clearLongTouch: a } }(), Ra = !0; $(function () {
        Qa("kernel", "useMilli", 0, PROPERTY_USEMILLI,
            [!1], 1); Qa("kernel", "timeFormat", 1, PROPERTY_FORMAT, ["h", ["h", "m", "s"], ["hh:mm:ss.XX(X)", "mm:ss.XX(X)", "ss.XX(X)"]], 1); a.appendTo("body"); Pa.appendTo("body"); $(document).keydown(function (a) { $.waitUser.call(); Ra = !0; c("keydown", a); timer.onkeydown(a); return Ra }); $(document).keyup(function (a) { Ra = !0; c("keyup", a); timer.onkeyup(a); return Ra }); $("#container").bind("touchstart", function (a) { $.waitUser.call(); $(a.target).is(".click") || (Wa.startLongTouch(), e(), timer.onkeydown({ which: 32 }), a.preventDefault && a.preventDefault()) });
        $("#container").bind("touchend", function (a) { Wa.clearLongTouch(); $(a.target).is(".click") || (e(), timer.onkeyup({ which: 32 }), a.preventDefault && a.preventDefault()) }); $("#container").bind("touch", function (a) { $(a.target).is(".click") || a.preventDefault && a.preventDefault() }); $("#touch").remove(); $("#container").mousedown(function (a) { $.waitUser.call(); !$(a.target).is(".click") && 1 == a.which && h("useMouse") && (timer.onkeydown({ which: 32 }), a.preventDefault && a.preventDefault()) }); $("#container").mouseup(function (a) {
            !$(a.target).is(".click") &&
            1 == a.which && h("useMouse") && (timer.onkeyup({ which: 32 }), a.preventDefault && a.preventDefault())
        }); try { document.cookie = "fp=" + $.fingerprint() + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/" } catch ($a) { }
    }); $(function () {
        for (var a = "properties cachedScr devData wcaData gglData locData".split(" "), b = 0; b < a.length; b++)try { JSON.parse(localStorage[a[b]] || "{}") } catch (mb) { delete localStorage[a[b]] } var c = []; for (b = 1; b <= ~~h("sessionN", 15); b++)a.push("session" + b); for (b = 0; b < localStorage.length; b++) {
            var e = localStorage.key(b);
            -1 == a.indexOf(e) && c.push(e)
        } for (b = 0; b < c.length; b++)delete localStorage[c[b]]
    }); return {
        pretty: z, getProp: h, setProp: Na, regProp: Qa, getSProps: bb.getSProps, setSProps: bb.setSProps, regListener: Oa, addWindow: x.addWindow, addButton: x.addButton, pushSignal: c, showDialog: x.showDialog, hideDialog: x.hideDialog, isDialogShown: x.isDialogShown, exportColor: x.exportColor, clrKey: function () { Ra = !1 }, temp: a, reprop: bb.reload, loadProp: bb.load, parseScramble: function (a, b, c) {
            a = a || ""; c && (a = h(tools.isCurTrainScramble() ? "preScrT" : "preScr") +
                " " + a); c = []; a = a.split(" "); for (var e, f, y, x = 0; x < a.length; x++)if (e = Ua.exec(a[x]), null != e) if (y = "FRUBLDfrubldzxySME".indexOf(e[2]), 14 < y) e = "2'".indexOf(e[5] || "X") + 2, y = [0, 4, 5][y % 3], c.push([b.indexOf("FRUBLD".charAt(y)), 2, e]), c.push([b.indexOf("FRUBLD".charAt(y)), 1, 4 - e]); else { f = (e[1] || "").split("-"); var r = ~~f[1] || -1; f = 12 > y ? ~~f[0] || ~~e[4] || ("w" == e[3] || 5 < y) && 2 || 1 : -1; e = (12 > y ? 1 : -1) * ("2'".indexOf(e[5] || "X") + 2); c.push([b.indexOf("FRUBLD".charAt(y % 6)), f, e, r]) } return c
        }, getConjMoves: function (a, b, c) {
            if (!a) return a;
            void 0 === c && (c = r()); b && (c = mathlib.CubieCube.rotMulI[0][c || 0]); return a.replace(/[URFDLB]/g, function (a) { return "URFDLB".charAt(mathlib.CubieCube.rotMulM[c][3 * "URFDLB".indexOf(a)] / 3) })
        }, getPreConj: r, blur: e, ui: x, TwoLvMenu: Ta, pround: function (a, c) { return z(b(a), c) }, round: b
    }
}); var exportFunc = execMain(function () {
    function c() { return storage.exportAll().then(function (a) { a.properties = mathlib.str2obj(localStorage.properties); nb = JSON.stringify(a) }) } function Oa() { var a = null; try { a = JSON.parse(this.result) } catch (wb) { logohint.push("Invalid Data"); return } z(a) } function z(a) {
        var b = 0, c = 0, e = 0; storage.exportAll().then(function (n) {
            for (var f = 1; f <= ~~kernel.getProp("sessionN"); f++) {
                var w = mathlib.str2obj(n["session" + f] || []), h = mathlib.str2obj(a["session" + f] || []); w.length != h.length && (b++, c += Math.max(h.length -
                    w.length, 0), e += Math.max(w.length - h.length, 0))
            } return confirm(IMPORT_FINAL_CONFIRM.replace("%d", b).replace("%a", c).replace("%r", e)) ? Promise.resolve() : Promise.reject()
        }).then(function () { if ("properties" in a) { var b = localStorage.devData || "{}", c = localStorage.wcaData || "{}", e = localStorage.gglData || "{}", n = localStorage.locData || "{}"; localStorage.clear(); localStorage.devData = b; localStorage.wcaData = c; localStorage.gglData = e; localStorage.locData = n; localStorage.properties = mathlib.obj2str(a.properties); kernel.loadProp() } storage.importAll(a).then(function () { location.reload() }) },
            $.noop)
    } function r(a) { this.files.length && a.readAsText(this.files[0], "UTF-8") } function b(a) { return a && /^[A-Za-z0-9]+$/.exec(a) } function e(a, b) { try { return JSON.parse(localStorage[a])[b] || "" } catch (zb) { return "" } } function a(a) { if (a.target === n[0] || a.target === w[0]) a = e("wcaData", "cstimer_token"); else { a = prompt(EXPORT_USERID, e("locData", "id")); if (null == a) return; localStorage.locData = JSON.stringify({ id: a, compid: e("locData", "compid") }); kernel.pushSignal("export", ["account", "locData"]) } if (b(a)) return a; alert(EXPORT_INVID) }
    function Pa(a) { return new Promise(function (b, c) { var e = LZString.compressToEncodedURIComponent(nb); $.post("https://cstimer.net/userdata.php", { id: a, data: e }, function (a) { 0 == a.retcode ? b(a) : c(a) }, "json").error(c) }) } function f(b) { var c = a(b); if (c) { var e = $(b.target), n = e.html(); e.html("..."); Pa(c).then(function () { alert(EXPORT_UPLOADED) }, function () { alert(EXPORT_ERROR) }).then(function () { e.html(n) }) } } function bb(b) {
        var c = a(b); if (c) {
            var e = $(b.target), n = e.html(); e.html("Check File List..."); var f = function () { alert(EXPORT_ERROR) },
                w = function () { e.html(n) }; b = function (a) { a = ~~a.data; if (0 == a) return alert("No Data Found"), w(); var b = 1; if (kernel.getProp("expp") && (b = ~~prompt("You have %d file(s), load (1 - lastest one, 2 - lastest but one, etc) ?".replace("%d", a), "1"), 0 >= b || b > a)) return w(); e.html("Import Data..."); $.post("https://cstimer.net/userdata.php", { id: c, offset: b - 1 }, h, "json").error(f).always(w) }; var h = function (a) {
                    var b = a.retcode; if (0 == b) try { z(JSON.parse(LZString.decompressFromEncodedURIComponent(a.data))) } catch (Kb) { alert(EXPORT_ERROR) } else 404 ==
                        b ? alert(EXPORT_NODATA) : alert(EXPORT_ERROR); w()
                }; kernel.getProp("expp") ? $.post("https://cstimer.net/userdata.php", { id: c, cnt: 1 }, b, "json").error(f).always(w) : b({ data: 1 })
        }
    } function h() {
        var a = e("gglData", "access_token"); a && (hb.html("Check File List..."), $.ajax("https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&orderBy=modifiedTime desc&q=name%3D%27cstimer.txt%27", { type: "GET", beforeSend: function (b) { b.setRequestHeader("Authorization", "Bearer " + a) } }).success(function (b, c, e) {
            b = b.files; if (0 == b.length) return alert("No Data Found"),
                Ra(); c = 1; if (kernel.getProp("expp") && (c = ~~prompt("You have %d file(s), load (1 - lastest one, 2 - lastest but one, etc) ?".replace("%d", b.length), "1"), 0 >= c || c > b.length)) return Ra(); hb.html("Import Data..."); $.ajax("https://www.googleapis.com/drive/v3/files/" + b[c - 1].id + "?alt=media", { type: "GET", beforeSend: function (b) { b.setRequestHeader("Authorization", "Bearer " + a) } }).success(function (a) {
                    try { a = JSON.parse(LZString.decompressFromEncodedURIComponent(a)) } catch (pb) { return alert("No Valid Data Found"), Ra() } Ra();
                    z(a)
                }).error(function () { alert(EXPORT_ERROR + "\nPlease Re-login"); Va() }); for (c = 10; c < b.length; c++)$.ajax("https://www.googleapis.com/drive/v3/files/" + b[c].id, { type: "DELETE", beforeSend: function (b) { b.setRequestHeader("Authorization", "Bearer " + a) } })
        }).error(function () { alert(EXPORT_ERROR + "\nPlease Re-login"); Va() }))
    } function Na(a) {
        a = a || e("gglData", "access_token"); if (!a) return Promise.reject("Invalid Account"); ob.html("Create File..."); return new Promise(function (b, c) {
            $.ajax("https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable",
                { type: "POST", contentType: "application/json", data: JSON.stringify({ parents: ["appDataFolder"], name: "cstimer.txt" }), beforeSend: function (b) { b.setRequestHeader("Authorization", "Bearer " + a) } }).success(function (a, e, n) { a = n.getResponseHeader("location"); ob.html("Uploading Data..."); $.ajax(a, { type: "PUT", contentType: "text/plain", data: LZString.compressToEncodedURIComponent(nb) }).success(function (a, c, e) { Ra(); b() }).error(function (a, b, e) { Va(); c(EXPORT_ERROR) }) }).error(function (a, b, e) {
                    Va(); 401 == a.status ? c("Timeout, Please Re-login") :
                        c(EXPORT_ERROR)
                })
        })
    } function Qa() { c().then(function () { if (window.Blob) { var a = new Blob([nb], { type: "text/plain" }); kb.attr("href", URL.createObjectURL(a)); kb.attr("download", "cstimer_" + mathlib.time2str(new Date / 1E3, "%Y%M%D_%h%m%s") + ".txt") } kernel.showDialog([gb, 0, void 0, 0, [EXPORT_ONLYOPT, Ta], [EXPORT_ACCOUNT, Ua]], "export", EXPORT_DATAEXPORT) }) } function x(a) { a = LZString.compressToEncodedURIComponent(JSON.stringify(a)); var b = prompt(EXPORT_CODEPROMPT, a); if (b && b != a) { try { b = JSON.parse(LZString.decompressFromEncodedURIComponent(b)) } catch (zb) { return } return b } }
    function Ta() { var a = JSON.parse(localStorage.properties), b = {}, c; for (c in a) c.startsWith("session") || (b[c] = a[c]); b = x(b); if (!b) return !1; a = JSON.parse(localStorage.properties); for (c in a) c.startsWith("session") && (b[c] = a[c]); localStorage.properties = mathlib.obj2str(b); location.reload(); return !1 } function Ua() {
        var a = { wcaData: localStorage.wcaData, gglData: localStorage.gglData, locData: localStorage.locData }, b = x(a); if (!b) return !1; for (var c in a) b[c] && (localStorage[c] = b[c], kernel.pushSignal("export", ["account",
            c])); location.reload(); return !1
    } function Wa() { var a = JSON.parse(localStorage.wcaData || "{}"); Xa.unbind("click"); w.unbind("click").removeClass("click"); n.unbind("click").removeClass("click"); a.access_token ? (a = a.wca_me, fb.html("WCAID: " + a.wca_id + "<br>Name: " + a.name), Xa.click($a.bind(void 0, !0)).addClass("click"), w.addClass("click").click(bb), n.addClass("click").click(f)) : (fb.html(EXPORT_LOGINWCA), Xa.click(function () { location.href = cb }).addClass("click")) } function Ra() {
        var a = JSON.parse(localStorage.gglData ||
            "{}"); Za.unbind("click"); hb.unbind("click").removeClass("click").html(EXPORT_FROMSERV + " (Google)"); ob.unbind("click").removeClass("click").html(EXPORT_TOSERV + " (Google)"); a.access_token ? (a = a.ggl_me, Sa.html("Name: " + a.displayName + "<br>Email: " + a.emailAddress), Za.click(Va.bind(void 0, !0)).addClass("click"), hb.addClass("click").click(h), ob.addClass("click").click(function () { Na().then(function () { alert("Export Success") }).reject(function (a) { alert(a) }) })) : (Sa.html(EXPORT_LOGINGGL), Za.click(function () {
                location.href =
                lb
            }).addClass("click"))
    } function $a(a) { if (!a || confirm(EXPORT_LOGOUTCFM)) delete localStorage.wcaData, kernel.pushSignal("export", ["account", "wcaData"]) } function Va(a) { if (!a || confirm(EXPORT_LOGOUTCFM)) delete localStorage.gglData, kernel.pushSignal("export", ["account", "gglData"]) } function y(a, c) {
        if ("atexpa" == c[0]) if ("id" == c[1]) {
            var n = e("locData", "id"); b(n) && "modify" != c[2] || (n = prompt(EXPORT_USERID, n), b(n) ? (localStorage.locData = JSON.stringify({ id: n, compid: e("locData", "compid") }), kernel.pushSignal("export",
                ["account", "locData"])) : (null != n && alert(EXPORT_INVID), kernel.setProp("atexpa", "n")))
        } else "wca" == c[1] ? b(e("wcaData", "cstimer_token")) || (alert("Please Login with WCA Account in Export Panel First"), kernel.setProp("atexpa", "n")) : "ggl" != c[1] || e("gglData", "access_token") || (alert("Please Login with Google Account in Export Panel First"), kernel.setProp("atexpa", "n")); else "export" == a && ("wcaData" == c[1] ? Wa() : "gglData" == c[1] && Ra())
    } function db() {
        var a = kernel.getProp("atexpa", "n"); "n" != a && (c().then(function () {
            if ("id" ==
                a || "wca" == a) { var c = "id" == a ? e("locData", "id") : e("wcaData", "cstimer_token"); b(c) ? Pa(c).then(function () { logohint.push("Auto Export Success") }, function () { logohint.push("Auto Export Failed") }) : (logohint.push("Auto Export Abort"), kernel.setProp("atexpa", "n")) } else if ("f" == a) {
                    if (window.Blob) {
                        c = new Blob([nb], { type: "text/plain" }); var n = $('<a class="click"/>'); n.attr("href", URL.createObjectURL(c)); n.attr("download", "cstimer_" + mathlib.time2str(new Date / 1E3, "%Y%M%D_%h%m%s") + ".txt"); n.appendTo("body"); n[0].click();
                        n.remove()
                    }
                } else "ggl" == a && ((c = e("gglData", "access_token")) ? Na(c).then(function () { logohint.push("Auto Export Success") }, function () { logohint.push("Auto Export Failed") }) : (logohint.push("Auto Export Abort"), kernel.setProp("atexpa", "n")))
        }), ub = rb = 0)
    } function mb() { "n" != kernel.getProp("atexpa", "n") && (ub += 1, ub >= kernel.getProp("atexpi", 100) && (rb && clearTimeout(rb), rb = setTimeout(db, 1E3))) } var cb = "https://www.worldcubeassociation.org/oauth/authorize?client_id=63a89d6694b1ea2d7b7cbbe174939a4d2adf8dd26e69acacd1280af7e7727554&response_type=code&scope=public&redirect_uri=" +
        encodeURI(location.href.split("?")[0]), lb = "https://accounts.google.com/o/oauth2/v2/auth?client_id=738060786798-octf9tngnn8ibd6kau587k34au263485.apps.googleusercontent.com&response_type=token&scope=https://www.googleapis.com/auth/drive.appdata&redirect_uri=" + encodeURI(location.href.split("?")[0]), gb = $("<div />"), Ya = $('<table class="expOauth expUpDown">'), fb = $("<td></td>"), Xa = $("<tr>").append('<td class="img"/>', fb), w = $('<a class="click"/>').html(EXPORT_FROMSERV + " (csTimer)").click(bb), n = $('<a class="click"/>').html(EXPORT_TOSERV +
            " (csTimer)").click(f), Sa = $("<td></td>"), Za = $("<tr>").append('<td class="img"/>', Sa), hb = $('<a class="click"/>'), ob = $('<a class="click"/>'), jb = $('<input type="file" id="file" accept="text/*"/>'), eb = $('<input type="file" id="file" accept="text/*"/>'), kb = $('<a class="click"/>').html(EXPORT_TOFILE), ab = $('<a class="click"/>').html(EXPORT_FROMSERV + " (csTimer)").click(bb), qb = $('<a class="click"/>').html(EXPORT_TOSERV + " (csTimer)").click(f), nb; Ya.append($("<tr>").append($("<td>").append($('<a class="click"/>').html(EXPORT_FROMFILE).click(function () { jb.click() })),
                $("<td>").append(kb)), $("<tr>").append($("<td>").append(ab), $("<td>").append(qb)), $("<tr>").append($("<td colspan=2>").append($('<a class="click"/>').html(EXPORT_FROMOTHER).click(function () { eb.click() })))); var rb, ub = 0; $(function () {
                    kernel.regListener("export", "time", mb); kernel.regListener("export", "property", y, /^atexpa$/); kernel.regListener("export", "export", y, /^account$/); kernel.regProp("kernel", "atexpa", 1, PROPERTY_AUTOEXP, ["n", ["n", "f", "id", "wca", "ggl"], PROPERTY_AUTOEXP_OPT.split("|")]); kernel.regProp("kernel",
                        "atexpi", -2, "Auto Export Interval (Solves)", [100, [50, 100, 200, 500], ["50", "100", "200", "500"]]); kernel.regProp("kernel", "expp", 0, PROPERTY_IMPPREV, [!1]); kernel.addButton("export", BUTTON_EXPORT, Qa, 2); gb.append("<br>", $('<div class="expOauth">').append($('<table id="wcaLogin">').append(Xa), $('<table class="expUpDown">').append($("<tr>").append($("<td>").append(w), $("<td>").append(n)))), $('<div class="expOauth">').append($('<table id="gglLogin">').append(Za), $('<table class="expUpDown">').append($("<tr>").append($("<td>").append(hb),
                            $("<td>").append(ob)))), Ya); if (window.FileReader && window.Blob) { var a = new FileReader; a.onload = Oa; var b = new FileReader; b.onload = function () { 0 == stats.importSessions(TimerDataConverter(this.result)) && logohint.push("No session imported") }; jb.change(r.bind(jb[0], a)); eb.change(r.bind(eb[0], b)) } $.urlParam("code") ? (fb.html(EXPORT_LOGINAUTHED), $.post("oauthwca.php", { code: $.urlParam("code") }, function (a) {
                                "access_token" in a ? (localStorage.wcaData = JSON.stringify(a), kernel.pushSignal("export", ["account", "wcaData"])) :
                                (alert(EXPORT_ERROR), $a())
                            }, "json").error(function () { alert(EXPORT_ERROR); $a() }).always(function () { Wa(); $.clearUrl("code") }), Qa()) : Wa(); if ($.hashParam("access_token")) {
                                var c = $.hashParam("access_token"); Sa.html(EXPORT_LOGINAUTHED); $.get("https://www.googleapis.com/drive/v3/about", { fields: "user", access_token: c }, function (a) { "user" in a ? (localStorage.gglData = JSON.stringify({ access_token: c, ggl_me: a.user }), kernel.pushSignal("export", ["account", "gglData"])) : (alert(EXPORT_ERROR), Va()) }, "json").error(function (a,
                                    b, c) { 401 == a.status ? alert("Timeout, Please Re-login") : alert(EXPORT_ERROR); Va() }).always(function () { Ra(); $.clearHash() }); Qa()
                            } else Ra()
                }); return { exportProperties: Ta, isValidId: b, getDataId: e, logoutFromWCA: $a, wcaLoginUrl: cb }
}); var logohint = execMain(function () {
    function c() { b = void 0; Oa() } function Oa() {
        if (Pa) a.removeClass("hint"), a.html("ABOUT"), b = void 0; else if (void 0 == b) if (b = r.shift(), void 0 == b) a.removeClass("hint"), a.html("csTimer"); else {
            a.html('<div class="pad" style="width: ' + e.width() + 'px; ">csTimer</div><span style="font-family: sans-serif; margin: 0 1em 0 1em;">' + b + '</span><div class="pad" style="width: ' + e.width() + 'px; position: absolute;">csTimer</div>'); a.removeClass("hint"); var c = .1 * (b.length + 15) + "s"; a.css({
                "-webkit-animation-duration": c,
                "-moz-animation-duration": c, "animation-duration": c
            }); setTimeout(function () { a.addClass("hint") })
        }
    } function z() { var a = ["Webkit", "Moz", "O", "ms", "Khtml"], b = document.createElement("div"); if (void 0 !== b.style.animationName) return !0; for (var c = 0; c < a.length; c++)if (void 0 !== b.style[a[c] + "AnimationName"]) return !0; return !1 } var r = [], b, e, a, Pa = !1, f = !1; $(function () {
        e = $("#logo"); a = e.children().children(); a.bind("oanimationend animationend webkitAnimationEnd", c); var b = $("#about"), h = b.children("h1").appendTo(kernel.temp).html();
        e.mouseenter(function () { Pa = !0; Oa() }); e.mouseleave(function () { Pa = !1; Oa() }); e.click(function () { "https:" != location.protocol && confirm("Your access to csTimer is unsafe. Press OK for safe access.") && (location.protocol = "https:"); b.show(); kernel.showDialog([b, 0, void 0, 0], "logo", h) }); b.hide(); kernel.regProp("kernel", "useLogo", 0, USE_LOGOHINT, [!0], 1); f = z()
    }); return { push: function (a) { f && kernel.getProp("useLogo", !0) && (r.push(a), Oa()) } }
}); var timer = execMain(function (c, Oa, z, r, b, e) {
    function a(a) { a != x && (x = a, Ya.renderUtil(), kernel.pushSignal("timerStatus", x)) } function Pa() { var a = z("useIns"); if (!0 === a || "a" == a) return !0; if (!1 === a || "n" == a) return !1; if ("b" == a) return null == /^(333ni|444bld|555bld|r3ni)$/.exec(z("scrType")) } function f(b, c, e) { if (c < x) for (b = x; b > c; b--)Ta[b] = e - Ua; a(Math.min(c, x) || 1) } function bb(a) {
        DEBUG && console.log("[timer] update timer offset"); if ($("html").hasClass("m") && !a) {
            a = $("html").hasClass("toolt"); var b = $("body").height(),
                c = $("#scrambleDiv").is(":visible") ? $("#scrambleDiv").outerHeight() : 0, e = $("#stats").offset().top || b; a ? c += $("#toolsDiv").is(":visible") ? $("#toolsDiv").outerHeight() : 0 : e = Math.min(e, $("#toolsDiv").offset().top || b); a = c + e - b; $("#timer,#rtimer").css({ "padding-bottom": Math.max(-a, 0), "padding-top": Math.max(a, 0) })
        } else $("#timer,#rtimer").css({ "padding-bottom": 0, "padding-top": 0 })
    } function h(a) { $.delayExec("timer_offset", bb.bind(null, a), 50) } function Na(a) {
        var b = a.which; if (17 == b) if (a = a.originalEvent, 1 == a.location ||
            1 == a.keyLocation) b = 256; else if (2 == a.location || 2 == a.keyLocation) b = 257; return b
    } var Qa, x = -1, Ta = [], Ua, Wa, Ra = [], $a = [], Va = ["#f00", "#0d0", "#dd0", "#080", "#f00"], y = { play: $.noop }, db = y, mb = y, cb = y, lb = y; void 0 !== window.Audio && $.waitUser.reg(function () {
        db = new Audio("data:audio/mp3;base64,//M4xAATSYYMAUxAAFnLyWJYln7RIAmBMD5PP7MLFh+v9gwMDBZyIn6JW5Ydg3AXBeH59S7vomiV+iILi7veiV///6In/wgoKGI7/+CbwQDH/gg7/5QEP5QMKs/q0cGlVL/ljQ06DnN/5yXn//M4xBEYsl6gAZmQASxhYji4zI0B9iVDm+gt1kQHSPZI/sgyZbMyXMRcn6bsgzk2M2J3LBLCgP5fSQQW7ikxUiqM2RpJiFP/f+Sw5hE80QQb//qbbzpPigBWhVKI71IfgLsD/GxF3etnsPVA//M4xA0YQhbUVc9IAYJsgBw94rEX5Zn32GB9ZJjM7WRsZByUJeG5tRzP///Pf5e/fnvj/6fnaROkqmWIVzyANulyUmy0y1+SM9qVIYeNThdSTt+Mr1dybYemoxoARO2BkwVpYBgP+hht2G3h//M4xAsXug7E9VgwA7hYwgWS6ksd1YZlz3SGJu9Tf9Nnh/QES1GjUas4DDPRsz6mUfOZ3RfFmnfdROWbCX//9enmoPCRJo0UuSOVVU+V6fM7/5rt///nr+Ei8PQumSH7twFhltkx/BAAAFsm//M4xAsYCnKY95k4ABXvCvTG+ZhpjLmGBPUOxY3uVbnhYC4i/qKgAl+s8ajiCcam+fG70NEYoMjT/vwWlhsMgsAjmx1l/gwsIok2JGjyp+n9yZUajYIgaaj///UfPJqlScmqAFAtFAtFottF//M4xAkXS38GX4EoArXUKwIPwD8ku8n7kImb5JCZqG+RnJ9PnezvO6//xA8+8g+tVcRFjauathAUMIAg8OCgodAezJxwoKOn/djpbbVGFFOQUZkIuqDVK7HdP6bt///jx1VoiZeQAK3+k2aJ//M4xAoX40MLHcg4AlCJVEGgLifPIFMGlO////2X6/6SbmA9JMKweDx2qhCSf/1Pfi1TVnqpD/55tUNLr/1qk5p6O2utkSc8w0003od7sk9roq6oceebQ46drqNR5yw+xpV1WIZlWJqoxBjD//M4xAkXIOsTGs4GXjzGCDgkBTJvzm+iZZL5OW2BQRQBdEfi9JG599JMa2qxISC8DMToZwZIgjTOMAiYj/MZDgIJ2fNmfZFBebWkAANCaSsG/c0cwBRxz//sPu///i3+hZvpd//JGObwoVXH//M4xAsXCPseWMMRI8KLBT5VTQZUaR+psYbbV0pcQAUJGtAxqeZjEEUMqUIQMQiIkmrChKdhgrzxluLhsqa6EwWtCAvBcUQPulnoHANyQxiijuwFEl1g/ilr/3+2/SqCVmRApRzgVEsmKcqa//M4xA0S+KLxv0lIAhehSRNXiyJCQgBBEhJYImmHiEERSGUIpCoBh7FgaUDLuoeCsFgayolLVHg0VO6w1LAXLfrLD8l9n2Tv//iIO5R88yRoxfLP60GESF0/nDMiacux54YAujYBIUHPuRFR//M4xCAcMsawAZhQAODgtEJMKyu88L8FgVhXC4IU1e74kCDGBMhIcWIyMSDf3GotCEFUPwGBgxceEQvKHf88kHCckfod///7Hj8w8uSD99yMyQyY3+Z/2c40nLu+VQKFvTbkoA8CijpNUkRQ//M4xA4UohrVn8YoAhQVpc+iJgUeAYryHnlIYPHDplFSoYxSxEVp6loHgsMDxxIWyzGo6lMY0vyiI4xUMpfvZ9v+WVkMpBIPIZyoJCTyKYKh1QEk3DdbkAgLmdaIAcZrvsZeRo1qN88WJe2b//M4xBoU0nq1t08oAkWHSapRERYpS1ZNEOpyCp0Z++Uhjcm/mvnRL9Dv6nRT3br/9a/daqivOpyT8pTzgdIm56oH3p//+tVpyS2yWSSWyWi261igBtlcTNuVMBDryxNmQvt1gMnh+q60Ycbs//M4xCUeAybGX5g4AkzzRWNhIP6tk+xpFjEOmsZHS80mXQ8xH5r/NJFqHl6Hdf4nJElTqabU3/uYY4PRuJghEUkNweCKPgJKVRTen+aNyZDdP////zFJsJA0nEDxuhAcDEgkEYjEkkgkjUJZ//M4xAwXgx7yX4IoAgCeXYgZ9oovHihUXv7Ob1OeQaRxi+hFflYXMXqt/92vlci/8+rttZXrai+ScQFMgn+Zv+1DvnPJDjTnnTd2UUIKCjyD55GfPCQixBcxX/z//BO33bDbW2PRBjsKUcCg//M4xA0UGqL2W8gQAtSYFFPQa5Z7v//KBhBHkIrkVz/oxFc4s7//5SlKvXuV35So77I900dv1///09f/SoslqKxA4cB8FoiEsBLGq7ksGoGKm+utulrklKqGKg0DDy3oNQvNH1uL2O9JZx/n//M4xBsUYQLiWsCMqo2CtyElAU930DGtGeUSEkYJXP///9Mk4BAkwIKORLN/LB2eh3K2nip0RZW3/DX/+HSxP/+s7spJrvAhfRAKXHSVTp/qR1yZwT//SsEOql7ChW9Q/OMbWcqTwk5mHqx3//M4xCgVUiJ0VEjKfJvMY0oqpWoY8RDupfzZhIqlN///0EmUDU9LHg0HOCodwVU8AnQaBUFfrKkt5CppLbfCQZI1EFRdF8qqmnnCQw/NfiYYhS57l/GgCLKyId/5H+VALvUe/75r5Xyx5n8e//M4xDENOQJoHjBKtLM67iEbxmn4ZnCdCLoqFQ9kxWiedXM7lVzLTKYul04P0UbpIFFAR5lxub6eFzRpwGWZebNGnFXF5s0//7s7O+bm5RpxRYJhmKEv//5UKiwtrUxBTUUzLjk5LjVVVVVV//M4xFsTMXHgAHsMHFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");
        mb = new Audio("data:audio/mp3;base64,//M4xAASgV4kFUwQACCAxs7JZPjOBIJicEBEdOxLJ6/6P3mlKTvt5zn5CBCEbI2c7oc57qf/XyEZTnQOBgYGLP/5c/1ygICQEP//EYPh+XBAMQ+Xf/wfbFqFNoEQoEFQEAoFAB+AVB4IMjon//M4xBUaKkrKX48oAFfHUmf89zpuUPoIoH/EBQgAD2Doh8EcCEYrHQOfg5IqAYuEADFAFIHufiYfOwfFyFFBYcHRAO/9XIRpJyy1dxT/+MFHac/xYuZar/fl+6pO7///UgWBacsstohOUoCw//M4xAsYGUbNn8wwAAMnmZ+cDu8djuSCYwYOmCwwdXtktWsTP35ZVoIgRJ5bXk6qf1VUR/f45seXnP2/2UZaUqN4JCMUOZ/QXBZBJxhp0akGam/eSOtFNysFTrfvaRb86SJV/8UPUrp+zSj1//M4xAkWefLEAMMG6O9KX1ERIatSpfyIuESQIBoKtVAipJxzbQQL48CaGZwhwiYAxOflcSz+973gNziP9c/v5/0/PsIzp/FcDcOP1BFm4cWZOejhzT30AwOIEAKnIInmpCW45KAB9YbUZ/KO//M4xA4XWgcGXnnS9wSLgdo+4uIZd65P8BmAVW7Y7RdHPK0MI1NPaSAaisaW6PReado2a3tr53Z8shskyFmpyIk2z3asoILchTb6As0mgosPDodNkqQyWtyzkN9VAOkEPxM62BmWyoOLzh2U//M4xA8Wo0bYVmBTPhU4VyIfetOVNubJtJwyjshE7b2ZpJtlITxc1n/J8XP///PMvDxcXPIwoA2s1hyf////4epZ4XqCenBIuF2M//9QvWE0dqBj/xLGEsUPE0jEFdMCsIqJSpRLJos62sp0//M4xBMZMz68BGoN5Wl11LRQpL29v/6e3///639n///10zdl8ltVyki9kGU76S73MSKDiwVgLnoYqS8dkGQxmRWYCIdkDyemBEJt8sECJ2ygAEKBwu6AY8ogACBZO52rx//7v/////6///////M4xA0WszrIAAhS/P6/8eVUMxJ6xGbUUV4y5GK2pLIUAIUTHlEKNVUUhYRFAMCkbC4YGRWQHAYoRJsg2ygsiFIlCSHN7VkjS8W1rJ2LYOTYG2bOm0LajK9swZdtrdttoNb7LQuMMOlQ3VRo//M4xBEZGU8SWMPS0tIV9Mkfd/1pqxzFRKswhSTgwWwQgQwhCwHACoEwdQyVi3qp5kt5l4gufzHb1ftPqNOHREJQLGOQMB6sJEcosEZvF0clGJo0hQoSQm2gQNrHxOBCKpL/dt/t4P83PyNq//M4xAsWcU8uWU9gA8fiEqmxOxkCxR4akYDKVhCQ5ihISWhdx7Aacl4qxKysejiaMq0RKVKjw1EIlXx7kNyh+YhTYQTIuJ6qH1XMejdTtLLsn1CrEeL7987UtHZP8DNiNI+8XNT2ZP9/uW15//M4xBAYwl6sAZhQAFu1p+7QEoFEBV6g1nEhETM/vMKP1RNwuAaAayAeGj0oc6q/i2hhO+PSRjjjX/FwXAsFAWAaAQzeahzov+TmOYx/5pqev7f9jx4WAgbOC3//B9weLoMQSAOtHnOtlwEc//M4xAwYUX64AY94ADqMNCC4LhWjHbCcscWKI+gkIRT5wve2X0GfevrOLVi2pfW/m3v4L2Die0CG/rPiJDe/fhRLzvp9YpesOBPrWKfGcRgVO0IKLecj34HDowGogX0kfwaqGKkalAB07DTR//M4xAkVUXa4988oA96hJKmadYbXjLDpmV8xPo1k6wuL0PCxnMJGMhSyrzFKVW7Sh0OgUtEsVmKxerFKpf0Q4iHg87wUFGhQV/pgoKCjcgoKahBS/0L/v/XqRrkvl1uuAHPRw8YD6obbAZWC//M4xBIUulrVv0YYAsy5WpzC/FjkoESgR4UTt+wwhRQCEFLAKVdjpuarL+uveMFSGZM6nmZMaEOIWDlW/5/+0r5//SO+5f3a+jXFKZxDY3GQ/s1JvAR00Bwm8O7JGQqoMUFo+y7mpgYG2r2Z//M4xB4bcyaYAY+AANJE6Zpfv7lAmES+t//rfSMzhikn//v2djA6YGqX//rdb6ponW8jSfJ8ibkXHX//3y4gabqQ8Zw1DEgm8QXFPFzCAAEwcY4A9QdIpc9///iBPL////////3//6M9cxlS//M4xA8XA0bMC8A4AsjHnuerv7VVCh9rmHodKIIiiUY7mD6VLmXU0bsJZcfcyYaPisRxwBgOwHnjQeMG4TgVGQhDhUTEwinA9B6g6NmFprmIhYajYcHygjk2V4VncGh/pRDV74GwDcP0CGGr//M4xBITSQr3GHgSwgw5n97yKxUMaHpRn1/7kgiEwoT78OtpAEDCCkDp+fpVl4UQo5o98MXf/aeWXBfInf////X4SBp//7b0qgCIGi9cuqFSVYVE2qotihQ5KWrE2fOIiAMVuhpaCTI7/0Dw//M4xCMUaO6dskgKwLA0WAQe/sCeCz8RJOxE10qrOhphGAQkGn1nexseGgoPBWMWAhKWWRDTIK5UA5ZtAroFgVAmNWRLlixNLy/xbJKikZ29gwqyerczBhX/o6Kibf/0+/1bYxSlaitzCKf3//M4xDAVGx5cFEiKzEdAiCD1rIHqlm6GpKZeWj6Gh46mGkVqGKVhIPHby1Zy8pfCQqpAWOqAYgcSGJhoGRGZHsMxdJkWFmegGRWgKiMBC6xUMgJn8e2aBkUDxrjxVMCirFixoKioo3FW/4sS//M4xDoR2CIEAkiEADQVFG4q38BBIRhkyEm1TEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");
        cb = new Audio("data:audio/mp3;base64,//M4xAATEZoICUEQACAAAAAAVjGPIABjGMYxjGQhG/qc7znAAAQQhCEIBgZzn//nfIT///OACCAgCAIA+D4f1AgCDu/4Pg//BAEAQBD+D4Pg4CDogB8PlAQV/lyZtCAp/v2yc4zIHc/+UWAK//M4xBIZMvKIAZqQAQy6fRSNAxgABQc3y4i7ilB2l4t/20mIGbn//xmCKEgXDEr/+2w43WSBgVCJ/+mtTILdRIHCXMRzx3kQZD/9uympqz5UM0lui5eOEQNP/+r//N5Z/e8LkFm0AKioK/UN//M4xAwX0eawAdhAAUrHCF0Xyt8mH+FmJNO7GaWW0L6MPJXkR+2bc26/iL/uuZmIOmYGTZtbRo0aTfrOMMts4YKnqUUfYjnHGhktCIExYjMNlU6UuxpZy0mb/nM+giFCFaQQgI7LAFMBlv/y//M4xAsX4mbGXsIKnHpCwXElk/qwtoiMigBBRYYAMG6v9geFWqiha0rlTWVobWLi5m11Vmyl9ZVVaWYqKvf+yGsipuxhoULRZkKJGs9SX4wt/f67oUPCYo0ih1Et/Of4NOUpySxlRsf7ZHkf//M4xAoXSl68flmEulpKJzj4HRAjce2at13fUYlVa81Ao7xm5DvuRGYrbf1B1ZtrXZqLSczrZVqtDG85ZwpvKJarJLMnQxnUvK2//CiRQaXEHfWHyDUPGvKdAnuygnfJqiqqAaP/y5zeISIf//M4xAsWMzKwVBhTraE4JQMQ82CUXHSsAKLmIWCKLSuDZK6KLh/93cGBwg5oV5fy3/////5f/cqr14yU5IbSzejWjcl3qChaEaQIIGKuYrKMJvAILCg9DdUmbiO/5EAFgTgHV3kXGB5LzZhY//M4xBEXU0K8CkCTPLCnbWj/8LVfenb+v/9lMdhLkuZ////+h1e0////ZWuiu25JXU4gIdVOhgZI5auESAnYXYPtGLUVNkw7AZqT2UR1DRMOtEiMdJ1sojbqlksl0lij/vaaaWCAoUoOsOYj//M4xBIZWW7yWNMHKgmVLqEkBMvdl3bkthguWpAMJL5dmCBEMMvMFyiijcL0EPwsO/78WKl4Qx4ODxz9SJW37VEMH3l3Vxg5RrFjA8GI/soju6ZTz88GLg1nCLfLsQODdZMRym1ANb0zCehG//M4xAsU4SrBjgvMHF48ZpdH8XJp18bP0yXW60P4TU4WFxtISSN2WosJZ57tW1Wz5kjP9f1uU8oycSAssqs7rDT4iJCUaBn01bMlSOf1AZ5D3f4l4hWAC+VSUH1YSABA8DgzLD94INFxHhUG//M4xBYUgzq09kBFXhnywvc/I/749Tqi5YJPyMGAtWO9FRGXONgyKILofPtDMho9WsaEq/9P/9eZGWRgyPkdzI/V9NCXBB+oZTwx/5ZkohiZfFYWGUnhLK43nk8bR3byGp2OQCms4M5k3dYz//M4xCMUYUqgKsFNDAaLS6pDeQeM4oGqVgmMfV/0df0+e75mZaYIerAmcBUFUJFXNty0TEQM06bMf/jVoBMla1FwGt16zGA8NQefkpVAN0tnbzz1C06KzuUensbO9SV2RyYMOpFsarqJI2lK//M4xDAVQXalH1kYAK/2GsnDmUuZ6l+FJuXQlnlBR08KxEVjwEKmGf/rKgLDpVyG/5QgguSRiMOCQQOSyqMhGmSI0qtdpYGVsYNfgCHScsHWrAQqDrQckoEi/yCXUjSk/79aKf+tajBVaCz7//M4xDojc86+X5loAn+t02X//f7r9bplxtM2HeRmHqp0/93U2b3TlQ8xzl8e6kEFIG6mMEDI31/TTdvYvpM7oJjHGDJURsphZqqLhgSBcUZnkhwkoPw/f//5IHv//x5CJQBtaN/99owR/who//M4xAsVOd7mX8FAAsYFIH97r8ivyxIagvaf/+l6J/+44QAExgoMmpeCDHv///WmHpMo1Q7I9pQ4RgqFjCyGND0Wg0tx4RPLWFfkXvhVMOs//yhIeIwEkmhE332M1sAGU0ua+qxgESxhRLOA//M4xBUTyKKa/ghGBJqX1Y3AokRAV3UCp3w6dBqJRj/wKWbIhICjGB0iGjxLKlfqCvJMO5ICkg6GvhUSkQkBSAFIgsEgyk7VBP1OmAhQMBDCArw0eOsDoSPFSowOkiEYBe0CkAqAkUCIkggI//M4xCQSKB4U0hiCALz3UDICqAtg0sVLFSXCj0ZEJAXrLLHu3niRH8e4iSlS06dh0NJMQU1FMy45OS41qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq");
        lb = new Audio("data:audio/mp3;base64,//M4xAASgSo1hUMQAIAgkWD33c9AN9ELeOf9d85/5CanO6HOhCNO//+hGUIQ5lw/EDogh8uH9YYLg+/UCEoCCwfLh/5Q4JDgPwQD6gQcDhwT/WDjidYYH41Hok//1+vs9vT8Aq1dS2NBQo9g//M4xBUaQmL2X4dAALQ2Nv44Xi2W/qxHUQblV/6FjBgoCtYppT/xUXgeJR7XVZl//o6MtmtX//9V+PR4UurefhUiY9P/v+HYURyEZPn2FUyg0IfGvlAQE4nuPo+d//Of6skEArDfvp+iADgm//M4xAsWqQbBZ88wAI8Z4TAwlzUxOFRqMwLkt7PBjyPCAzN57EJBCEQ7AhBUQ9J+MoqjYeqLUyR06dGBVigkZSuiSkjqVA08t/50tzOeqOg0HZglErtv+wsDIx9qsCCVRS8ugA0eMpdgLnQG//M4xA8Y+N7OVg4eHLkxaawiYEAmMzp+pVi0QgyWuSbfaLu2JCPMS48djN2OjQPo8Gm+1MTkQMvbWocLgBnJur3ebwmcLuKCc5bAgWU5jkzRmh7dVJw5hgQGKdTD4rLwfD/TApD6T3GsZ+jo//M4xAoVsMbllgvSOoaajtekUtnRNv4yigtZDycK1KCSjIEDHoXy5yCw8KkJoEIdZuEOmhM5IuAjwKlxUSmGXpCh5P7V0accB0u6n2KTHs/+J5P4YiA5EjpdEQKAAbh9B4FwOix3NYbHKio4//M4xBIWU0bg9jgfcoo1b0Gx3zTUfScea3RH////////j/////6huEM0ydj1nWzrgtgR8MM7g1AmhYF2q9N5b1G5qxk0wODIi0UWAfZJ4g3yTn+q1Q5KzlECQfkaxWsgj0I/RRb/2/v//9Vn//M4xBcaw0rBl0FoAHpf////sy1rrb///X//9kzydJBKkiipmY6O8Yom4cw0Lw+HguQW4KkIodoUAHsGwDYC1iJEUSQl5CFMcBNJIqCiC8hVRGw6AP4LeBlCxD0BcBVDFxaPvr/f9//9/t/L//M4xAsX2j8eX404AtuxjqjEzRIDwC51mFMl6MqmiWPEEbHnxoe62msPLMPPJsxnnBRvKtc+e6/LDrecjN+Y6DpnoPkzmXvmkjvb8z+hpR/FQ0fVKkELosVELRvtIqHf8qqbyaTMDIgnGhw1//M4xAoXiV7Yy494AId4yhnCcPiNF1KghyHyKgIIj2VKqcJqpPDrepyth2GrAcR63Fmhap8aeZtrEPE1J7TUjYiapaTTJjUCZuxLP8534sKLvX6+C4hRnyd0DLYhIa//DdW4SwYlwqtK1Zk1//M4xAoWEa64AZloABtJuengjtCaHvhxARYZEw5I8VtBIRvIKJJF4vLXxLjIzQLyKNFvpHx3Eqo7UmkZGX47RhB7ukbKMdnZt/cwmKNFmSQRnale8WIoQL1XARX18OEI5r/AaBcP1ehjqz4B//M4xBAXUuasAY84AAD8RB4wufax6mmJf3WY046i/zjS3OU//PQ0uPKg3dB48anHo0z5NmGhojnMTOHWGhxU1f/5U51m2tOpr+v//PtY2etxwtYLAVa3Fv/kFQpAY3wDgA//5BYdMtqpa7qi//M4xBEVET7Bt9iAAKTOTxnaPGEt9Kbeq7T3to8ZWvAPiGSMzEig4TiSjIqpKYpmyNlq9dSq+kg99n99MvhEXLFp27/U0OmrQK7fT6LGtJPVSABDsRjmAGH14mKnQlMUeVmib52Ev1vKSCGb//M4xBsU6MK5v1gYAMWnvrRa/zK6+rut4USRcWHkoCREFWw8SVVdAQdBo8HRLeCsc4JPLfaeI5aSK/4dEqVAwHyIVGvtUgAIKPKv/z/gAHxAkOJGEARIEghZOYmCTCxgEhs/SVqNzJ2S2uDz//M4xCYei86plZpoAGGcep4x54vonz6NvVVur6+YKXNqmQSPaS0UEqnQ7amo+j//Q01ejW3/6v+7et+gTDpTX//9PU03WmbvtQLhoMASZsSR0iCmE8GACQf//7f//xwgr9UCSgS2iC2oEfkI//M4xAoUC0LuX8EoAkdUf8b5/89Cd0///qqi5G///yodv50YXKLlExcABN0KYgoJoVxgmKkDpSOAwmKCwFDrGPRuzt6/00Zyr///1+jWOR0U0WKqEAls1wn0iBHCH/MIKAQktE4BU5EiRASW//M4xBgTIbrOXgmKlv/7y8scFEknl8///NZQ6KwiKiQecrf//5qVYxpQ64iCRKFDQVT88VBU7/1Q7/9raCJGRCTaAkYG01QNZFtww1LYo1EwKhNwSArlhI8Ej0OiURAIed1FQEPksJu8qIiS//M4xCoSsGIcFDBGQIqWW7wCAvkbSQiKjDp5YSDgdyxYe4986HQ0HdodEpUiSkxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq")
    });
    var gb, Ya = function () {
        function a(a) { a && void 0 == Za ? (requestAnimFrame(c), Za = 1, gb = 0) : a || void 0 == Za || (Za = void 0); Xa = bb ? Na : Sa } function c(a) {
            if (0 != x && -1 != x && -4 != x && void 0 != Za) {
                a = ($.now() - Ua)*(3/5); if (-3 == x || -2 == x && Pa()) f(Xa, "n" != z("timeU") ? 17E3 < a ? "DNF" : 15E3 < a ? "+2" : 15 - ~~(a / 1E3) : TIMER_INSPECT); else { var b = r(0 < a ? a : 0, !0); f(Xa, { u: b, c: b.replace(/([.>])(\d)\d+(<|$)/, "$1$2$3"), s: b.split(".")[0], n: TIMER_SOLVE, i: TIMER_SOLVE }[z("timeU")]) } -3 == x || -2 == x ? (Xa !== Na && (12E3 <= a ? f(Na, '<div style="font-family: Arial;">Go!!!</div>') :
                    8E3 <= a && f(Na, '<div style="font-family: Arial;">8s!</div>')), "n" != z("voiceIns") && (b = y, 7900 <= a && 7900 > gb && (b = "1" == z("voiceIns") ? db : cb), 11900 <= a && 11900 > gb && (b = "1" == z("voiceIns") ? mb : lb), b.volume = ~~z("voiceVol") / 100, b.play())) : Xa !== Na && f(Na, ""); gb = a; requestAnimFrame(c)
            }
        } function e(a) { /^[rgy]$/.exec(a) && (a = Va["rgy".indexOf(a)]); Sa.css("color", a); Na.css("color", a) } function n(a) { f(bb ? Na : Sa, (void 0 != a ? r(a, !0) : "--:--") + '<div class="insplabel">&#59062;</div><div class="difflabel"/>') } function f(a, b) {
            var c = a ===
                Na ? 1 : 0; jb[c] !== b && (jb[c] = b, a.html(b))
        } function w(a, b) { Oa = b ? Oa + a : a } function h(a, b) { for (var c = [], e = b; e > a; e--)c.push(r(Ta[e] - ~~Ta[e + 1], !0)); return a == b || 1 == b || 0 == c.length ? "" : '<div style="font-size: 0.65em">=' + c.join("<br>+") + "</div>" } var Sa, Na = $("<div />"), Xa, Za, $a = $('<div style="line-height:0.6em;" />'), Qa = $('<div style="position:relative;font-size:0.3em;">'), hb = $('<span class="click" style="position:relative;z-index:20;font-family:Arial;">'), Oa = "", jb = ["", ""], bb = !1, gb = 0, ob, sb = !1; $(function () {
            Sa = $("#lcd");
            $("#multiphase").append(Na, $a, Qa.append(hb))
        }); return {
            setRunning: a, color: e, val: n, setEnable: function (a) { a ? Sa.show() : Sa.hide() }, append: function (a) { f(Na, Na.html() + a) }, setStaticAppend: w, fixDisplay: function (c, n) { var f = !1; 0 == x ? Ya.color("r") : -1 == x || -4 == x ? e(c && n ? Pa() ? "g" : "r" : "") : -2 == x ? (e(c && n ? "g" : ""), f = Pa()) : (-3 == x ? e(c && n ? "y" : "r") : e(c ? "g" : ""), f = !0); b.setAutoShow(0 == x || -1 == x); a(f) }, renderUtil: function (a) {
                Pa() && -1 != [-1, -4].indexOf(x) && z("showIns") ? (Sa.addClass("insp"), Na.addClass("insp")) : (Sa.removeClass("insp"),
                    Na.removeClass("insp")); a && -1 == x ? sb = !0 : -1 != x && (sb = !1); a = -2 < x && !sb ? h(Math.max(0, x), Math.max(Ta.length - 1, x)) : ""; $a.html(a + Oa); if (-1 == x || 0 == x) {
                        if (-1 != "sb".indexOf(z("input"))) Ya.val(Wa); else if (Ya.val(sb ? 0 : Ta[1] || 0), !sb && Ta[1] && Ra && Ra[1] && "n" != z("showDiff")) { a = Ta[1] - Ra[1]; var b = $(".difflabel").html("(" + (0 < a ? "+" : 0 == a ? "" : "-") + r(Math.abs(Ra[1] - Ta[1])) + ")"), c = z("showDiff"); 0 != a && "b" != c && b.css("color", 0 < a == ("gr" == c) ? Va[3] : Va[4]) } if (ob && ob[4] && !sb) {
                            Qa.show(); var e = "string" == typeof ob[4][1] && ob[4][1] || tools.getCurPuzzle() ||
                                "333"; a = "333" == e ? recons.getMoveCnt(ob[4][0]) : ob[4][2]; b = STATS_REVIEW; 0 < a && (b = a + " turns<br>" + ~~(1E5 * a / ob[0][1]) / 100 + " tps"); hb.html(b).unbind("click").click(function () { replay.popupReplay(ob[1], ob[4][0], e) })
                        } else Qa.hide()
                    } else Qa.hide()
            }, setRecons: function (a) { ob = a }, reset: function (b, c) { bb = b; Sa.empty(); Na.empty(); bb ? (Sa.removeClass("activetimer"), Na.addClass("activetimer")) : (Sa.addClass("activetimer"), Na.removeClass("activetimer")); jb[0] = ""; jb[1] = ""; w("", !1); n(0, bb); a(!1); fb.updatePos(c ? !bb : bb) }
        }
    }(),
        fb = function () {
            function a(a) { a && (n.html(a[0]).unbind("click"), void 0 != a[2] ? n.addClass("click").click(function () { a[4](a[2][0], a[2][1], a[2][2], a[2][3]) }) : n.removeClass("click"), f.html(a[1]).unbind("click"), void 0 != a[3] ? f.addClass("click").click(function () { a[4](a[3][0], a[3][1], a[3][2], a[3][3]) }) : f.removeClass("click"), Ta = a[5] ? a[5][0].slice() : [0], Ra = a[6] ? a[6][0].slice() : null, Ya.setRecons(a[5]), Ya.renderUtil()) } function b(b, c) { y = c; a(y) } var e, n = $('<span class="click">'), f = $('<span class="click">'), w = !0,
                h = !1, y; $(function () { e = $("#avgstr").append(n, "<br>", f); c("timer", "avg", b) }); return { showAvgDiv: function (a) { a && z("showAvg") ? w || (e.show(), w = !0) : w && (e.hide(), w = !1) }, updatePos: function (b) { h != !!b && ((h = !!b) ? e.appendTo("#multiphase") : e.appendTo("#container"), a(y)) } }
        }(), Xa = function () {
            function b() { void 0 != y && (clearTimeout(y), y = void 0) } function c() { if (-1 == x || -3 == x) -1 == x && (Ya.reset(Va), n()), a(-2), y = void 0, Ya.fixDisplay(!0, !0) } function n() {
                Va && (Sa.is(":hidden") && (Sa.show().appendTo("#container"), Sa.empty().append(r)),
                    Sa.css("height", z("timerSize") * $("#logo").width() / 12 + "px"), image.llImage.drawImage("GGGGGGGGGGGGGGGGGGGGG", [], r[0]))
            } function f(a, b, c) { var e = Na; 255 < a ? Na = b ? Na & ~(1 << a) : Na | 1 << a : c.ctrlKey || (Na = 0); return 32 == a || 3 == e && 255 < a || 3 == Na } var w = 0, h = 0, y = void 0, Sa = $("<div>"), r = $('<canvas style="height:100%;">'), Va = !1, Na = 0; return {
                onkeydown: function (Sa, r) {
                    if (28 != Sa) {
                        var Va = f(Sa, 0, r); if (!DEBUG || Va) {
                            var ab = $.now(); if (!(200 > ab - w)) {
                                if (0 < x) {
                                    w = ab; Ta[x] = (w - Ua)*(3/5); if (27 == Sa) {
                                        ab = [-1]; for (var Na = 1; x < Ta.length;)ab[Na++] = Ta[x++]; Ta =
                                            ab; a(1)
                                    } a(x - 1); 0 == x && (h = w, 32 != Sa && a(-1), Ya.fixDisplay(!1, Va),  e("time", Ta))
                                } else Va ? x == (Pa() ? -3 : -1) && void 0 == y ? y = setTimeout(c, z("preTime")) : -1 == x && Pa() && (a(-4), n()) : 27 == Sa && -1 >= x && (b(), a(-1), Ya.fixDisplay(!1, !1), n()); Ya.fixDisplay(!0, Va); Va && kernel.clrKey()
                            }
                        }
                    }
                }, onkeyup: function (c, e) {
                    a: {
                        var n = f(c, 1, e); var w = $.now(); if (n) if (0 == x) a(-1); else if (-1 == x || -3 == x) { if (b(), 500 > w - h) { Ya.fixDisplay(!1, n); n = void 0; break a } } else if (-2 == x) {
                            var y = Pa() ? w - Ua : 0; Ua = w; Ta = [17E3 < y ? -1 : 15E3 < y ? 2E3 : 0]; a(z("phases")); Va && "333" ==
                                tools.getCurPuzzle() && (w = tools.getCurScramble(), image.llImage.draw(3, w[1], r[0]))
                        } else -4 == x && (Ua = w, a(-3)); Ya.fixDisplay(!1, n); n && kernel.clrKey(); n = void 0
                    } return n
                }, detectTrigger: f, reset: function (a) { void 0 != y && (clearTimeout(y), y = void 0); w = h = 0; (Va = "l" == a) ? n() : Sa.hide() }
            }
        }(), w = function () {
            var b = $('<textarea id="inputTimer" rows="1" />'), c = 0; $(function () { $("#lcd").after(b) }); return {
                setEnable: function (a) { a ? b.show() : b.hide(); a ? (jb = b, b[0].select(), b.unbind("click").click(function () { b[0].select() })) : jb = void 0 },
                parseInput: function () {
                    var a = /^\s*(?:[\d]+\. )?\(?(DNF)?\(?(\d*?):?(\d*?):?(\d*\.?\d*?)(\+)?\)?(?:=([\d:.+]+?))?(?:\[([^\]]+)\])?\)?\s*(?:   ([^@].*?))?(?:   @(.*?))?\s*$/, n = /^(\d*?):?(\d*?):?(\d*\.?\d*?)$/, f = b.val(), w = $.now(); if (/^[\s\n]*$/.exec(f) && w > c + 500) kernel.pushSignal("ctrl", ["scramble", "next"]), c = w; else for (f = f.split(/\s*[,\n]\s*/), w = 0; w < f.length; w++) {
                        var h = a.exec(f[w]); if (null != h && "" != h[4]) {
                            var y = ~~Math.round(36E5 * Math.floor(h[2]) + 6E4 * Math.floor(h[3]) + 1E3 * parseFloat(h[4])); if (!(0 >= y)) {
                                if ("" ==
                                    h[2] && "" == h[3] && /^\d+$/.exec(h[4])) { var x = kernel.getProp("intUN") || 20100; y = Math.floor(y / (x % 1E4)); var Sa = Math.floor(y / 1E7); var r = Math.floor(y / 1E5) % 100; var Va = y % 1E5; 2E4 < x ? y = 6E4 * (60 * Sa + r) + Va : 1E4 < x && (y = 6E4 * (100 * Sa + r) + Va) } "DNF" == h[1] ? x = -1 : "+" == h[5] && 2E3 < y ? (x = 2E3, y -= 2E3) : x = 0; Sa = []; if (h[6]) {
                                        Sa = h[6].split("+").reverse(); r = y; for (Va = 0; Va < Sa.length; Va++) { var Na = n.exec(Sa[Va]); if (null == Na) { r = 1E8; break } r -= Math.round(36E5 * Math.floor(Na[1]) + 6E4 * Math.floor(Na[2]) + 1E3 * parseFloat(Na[3])); Sa[Va] = Math.max(0, r) } Math.abs(r) >
                                            10 * Sa.length ? Sa = [] : Sa.pop()
                                    } r = h[7] || ""; Va = h[8]; Ta = [r, Va, [x, y].concat(Sa)]; (y = mathlib.str2time(h[9])) && Ta.push(y); e("time", Ta); kernel.clrKey()
                            }
                        }
                    } b.val("")
                }, onkeydown: function (b, c) { if (28 != b) { var e = Xa.detectTrigger(b, 0, c), n = $.now(); !Pa() || 200 > n - 0 || (-3 == x || 27 == b ? (a(e ? 0 : -1), Ya.fixDisplay(!1, !1)) : e && -1 == x && a(-4), Ya.fixDisplay(!0, e), e && kernel.clrKey()) } }, onkeyup: function (b, c) {
                    a: {
                        var e = Xa.detectTrigger(b, 1, c); var n = $.now(); if (Pa()) {
                            if (e) if (0 == x) a(-1); else if (-1 == x || -3 == x) {
                                if (500 > n - 0) {
                                    Ya.fixDisplay(!1, e);
                                    e = void 0; break a
                                }
                            } else -4 == x && (Ua = n, a(-3)); Ya.fixDisplay(!1, e); e && kernel.clrKey()
                        } e = void 0
                    } return e
                }, clear: function () { b.val("") }
            }
        }(), n = function () {
            function b(b) {
                if (c) {
                    var w = $.now(); if (b.on) {
                        Wa = b.time_milli; Ya.renderUtil(); if (b.running) { if (-3 == x || -4 == x) f = w - Ua - Wa, Ya.reset(); Ta = [0]; a(1); Ua = w - Wa; Ya.fixDisplay(!1, !0) } else -1 != x || !Pa() || 0 != Wa || "R" != b.signalHeader && "L" != b.signalHeader ? -3 != x && -4 != x && (a(-1), Ya.fixDisplay(!1, !0)) : (a(-3), Ua = w, Ya.fixDisplay(!1, !0)); n.running && !b.running && 0 != b.time_milli && (f = Pa() ?
                            17E3 < f ? -1 : 15E3 < f ? 2E3 : 0 : 0, Ta = [f, ~~Wa], e("time", Ta)); b.greenLight ? Ya.color("g") : b.rightHand && b.leftHand ? Ya.color("r") : -4 == x ? Ya.color("g") : Ya.color(""); Ya.setRunning(-3 == x || b.running && 67 != b.signalHeader)
                    } else Wa = void 0, a(-1), Ya.fixDisplay(!1, !0); n = b
                }
            } var c = !1, n = {}, f; return {
                setEnable: function (a) {
                    (c = "s" == a || "m" == a) ? (stackmatutil.setCallBack(b), stackmatutil.init(a, !1).then($.noop, function () {
                        kernel.showDialog([$("<div>Press OK To Connect To Stackmat</div>"), function () {
                            stackmatutil.init(a, !0).then($.noop,
                                console.log)
                        }, 0, 0], "share", "Stackmat Connect")
                    })) : stackmatutil.stop()
                }, onkeyup: function (b) { var c = $.now(); 32 == b && -4 == x && (a(-3), Ya.reset(), Ua = c, Ya.fixDisplay(!1, 32 == b)); 32 == b && kernel.clrKey() }, onkeydown: function (b) { var c = $.now(); 32 == b && -1 == x && Pa() && n.on && 0 == n.time_milli ? (a(-4), Ua = c, Ya.fixDisplay(!0, !0)) : 27 == b && -1 >= x && (a(-1), Ya.fixDisplay(!0, !1)); 32 == b && kernel.clrKey() }
            }
        }(), Sa = function () {
            function b(b) {
                if (w) switch (DEBUG && console.log("[gantimer] timer event received", GanTimerState[b.state], b), b.state) {
                    case GanTimerState.HANDS_ON: Ya.color("r");
                        break; case GanTimerState.HANDS_OFF: Ya.fixDisplay(!1, !0); break; case GanTimerState.GET_SET: Ya.color("g"); break; case GanTimerState.IDLE: h = 0; 0 < Wa || -1 != x ? (Wa = 0, a(-1), Ya.reset(), Ya.fixDisplay(!1, !0)) : -1 == x && Pa() && (a(-3), Ua = $.now(), Ya.fixDisplay(!1, !0)); Ya.renderUtil(); break; case GanTimerState.RUNNING: -3 == x && (h = $.now() - Ua, h = Pa() ? 17E3 < h ? -1 : 15E3 < h ? 2E3 : 0 : 0); Ua = $.now(); Ya.reset(); Ta = [h]; a(1); Ya.fixDisplay(!1, !0); break; case GanTimerState.STOPPED: Wa = b.recordedTime.asTimestamp; Ta[1] = Wa; a(-1); Ya.renderUtil(); Ya.fixDisplay(!1,
                            !0); e("time", Ta); break; case GanTimerState.DISCONNECT: Wa = void 0, a(-1), Ya.renderUtil(), Ya.fixDisplay(!1, !0), c()
                }
            } function c() { $.delayExec("ganTimerReconnect", function () { DEBUG && console.log("[gantimer] attempting to reconnect timer device"); n(!0) }, 2500) } function n(c) {
                GanTimerDriver.connect(c).then(function () { DEBUG && console.log("[gantimer] timer device successfully connected"); GanTimerDriver.setStateUpdateCallback(b); Wa = 0; a(-1); Ya.reset(); Ya.renderUtil(); Ya.fixDisplay(!1, !0) })["catch"](function (a) {
                    DEBUG &&
                    console.log("[gantimer] failed to connect to timer", a); c || alert(a)
                })
            } function f() { var a = $("<div>").addClass("click").append("If you have enabled WCA inspection in settings,<br>use GAN logo button right on the timer to start/cancel inspection."), b = $("<div>").append("<br><br>").append("<b>Press OK to connect to GAN Smart Timer</b>").append("<br><br>").append(a).append(gb); GanTimerDriver.disconnect().then(function () { kernel.showDialog([b, function () { n() }, 0, 0], "share", "GAN Smart Timer") }) } var w = !1, h = 0;
            return { setEnable: function (a) { (w = "b" == a) ? (Wa = void 0, f()) : GanTimerDriver.disconnect() }, onkeyup: function (a) { 32 != a || GanTimerDriver.isConnected() || f() }, onkeydown: $.noop }
        }(), Za = function () {
            function b(b, c, y) {
                if (1 != c) {
                    y = y || $.now(); if (-3 == x || -2 == x) {
                        if (r.isRotation(b) && !/^(333ni|444bld|555bld)$/.exec(Wa)) { 0 == c && $a[0].push([r.move2str(b), 0]); return } Na = Pa() ? y - Ua : 0; Ua = y; Ra = 0; Ta = [17E3 < Na ? -1 : 15E3 < Na ? 2E3 : 0]; a(3 == hb && "r3" != Wa ? cubeutil.getStepCount(z("vrcMP", "n")) : 1); var Sa = $a[0]; $a = []; for (var Va = 0; Va < x; Va++)$a[Va] =
                            []; $a[x] = Sa; Xa = x; f(Xa, r.isSolved(z("vrcMP", "n")), y); w(); Ya.fixDisplay(!1, !0)
                    } if (1 <= x) {
                        /^(333ni|444bld|555bld)$/.exec(Wa) && !r.isRotation(b) && r.toggleColorVisible(0 == r.isSolved(z("vrcMP", "n"))); 0 == c && $a[x - 1].push([r.move2str(b), y - Ua]); if (2 == c) { var ab = r.isSolved(z("vrcMP", "n")); f(Xa, ab, y); w() } 2 == c && 0 == ab && (Ra += r.moveCnt(), /^r\d+$/.exec(Wa) && 0 != Za.length ? ("r3" != Wa && hb++, n(!0), h()) : (Ya.setStaticAppend(""), a(-1), $("#lcd").css({ visibility: "unset" }), Ya.fixDisplay(!1, !0), $a.reverse(), e("time", ["", 0, Ta, 0, [$.map($a,
                            cubeutil.moveSeq2str).filter($.trim).join(" "), cb, Ra]])))
                    }
                }
            } function n(a) { if ((!fb || z("input") != Va) && Oa) { fb = !0; Va = z("input"); var c = hb; c || (c = 3); c = { puzzle: "cube" + c, allowDragging: !0 }; -1 != ["skb", "mgm", "pyr", "sq1", "clk"].indexOf(cb) && (c = { puzzle: cb }); c.style = z("input"); puzzleFactory.init(c, b, db, function (b, c) { r = b; c && !r && (db.css("height", ""), db.html("--:--")); if (!a || c) Ya.setStaticAppend(""), Ya.fixDisplay(!1, !0), Ya.renderUtil(), Sa(z("timerSize")) }) } } function w() {
                /^r\d+$/.exec(Wa) && (Ya.setStaticAppend(Za.length +
                    1 + "/" + Qa.length), Ya.renderUtil())
            } function h() { n(); var a = Za; /^r\d+$/.exec(Wa) && (a = Za.shift().match(/\d+\) (.*)$/)[1], w()); a = r.parseScramble(a, !0); fb = !1; r.applyMoves(a); r.moveCnt(!0); $a = [[]] } function y(a, b) { if ("scramble" == a || "scrambleX" == a) { Wa = b[0]; Za = b[1]; var c = tools.puzzleType(Wa), e = mb.indexOf(c); "cubennn" == c && (e = b[2]); -1 == e || hb == e && cb == c || (hb = e, cb = c, fb = !1, n()); (c = b[0].match(/^r(\d)\d*$/)) ? (Qa = Za.split("\n"), hb != ~~c[1] && (hb = ~~c[1], fb = !1, n())) : Qa = null } } function Sa(a) {
                db.css("height", a * $("#logo").width() /
                    9 + "px"); r && r.resize()
            } var r, Va = "", Na = 0, Ra = 0, Xa = 1, Za, Qa, Wa, hb, cb, mb = " sq1 222 333 444 555 666 777 888 999 101010 111111 skb mgm pyr clk".split(" "), fb = !1, db = $("<div />"), Oa = !1; $(function () { c("timer", "scramble", y); c("timer", "scrambleX", y); db.appendTo("#container") }); return {
                onkeydown: function (b) {
                    if (void 0 != r) {
                        var c = $.now(); if (-1 == x) 32 == b && (Qa && (Za = Qa.slice()), h(), Pa() ? (Ua = c, a(-3)) : (Ya.val(0), a(-2)), $("#lcd").css({ visibility: "hidden" }), Ya.fixDisplay(!1, !0)); else if (-3 == x || -2 == x || 1 <= x) if (27 == b || 28 == b) {
                            var f =
                                1 <= x; Ya.setStaticAppend(""); a(-1); n(); $("#lcd").css({ visibility: "unset" }); Ya.fixDisplay(!1, !0); f && ($a.reverse(), e("time", ["", 0, [-1, c - Ua], 0, [$.map($a, cubeutil.moveSeq2str).filter($.trim).join(" "), cb, Ra]]))
                        } else c = { keyCode: help.getMappedCode(b) }, r.keydown(c); 27 != b && 32 != b || kernel.clrKey()
                    }
                }, setEnable: function (a) { (Oa = a) ? db.show() : (db.hide(), fb = !1) }, setSize: Sa, reset: n
            }
        }(), hb = function () {
            function b() { Va && (clearTimeout(Va), Va = 0); Na && (clearTimeout(Na), Na = 0) } function n(c, n, y) {
                var ab = y[1] || $.now(), Za = Qa; Qa =
                    c; if (Sa) {
                        r && Wa.setState(c, n, !1); b(); var hb = z("vrcMP", "n"); if (-1 == x) { if (!w(Qa, !0)) { var cb = z("giiSD"); "s" == cb ? giikerutil.checkScramble() && h(ab) : "n" != cb && (Va = setTimeout(function () { h(ab) }, 1E3 * ~~cb)); cb = z("giiSM"); "n" != cb && { x4: /^([URFDLB][ '])\1\1\1/, xi2: /^([URFDLB])( \1'\1 \1'|'\1 \1'\1 )/ }[cb].exec(n.join("")) && (Na = setTimeout(function () { h(ab) }, 1E3)) } } else if (-3 == x || -2 == x) {
                            Ra = Pa() ? ab - Ua : 0; Ua = ab; Ta = [17E3 < Ra ? -1 : 15E3 < Ra ? 2E3 : 0]; a(cubeutil.getStepCount(hb)); $a = []; for (cb = 0; cb < x; cb++)$a[cb] = []; Xa = x; cb = cubeutil.getProgress(Za,
                                hb); f(Xa, cb, ab); Ya.reset(r); Ya.fixDisplay(!1, !0)
                        } if (1 <= x && ($a[x - 1].push([n[0], y[0], y[1]]), c = cubeutil.getProgress(c, hb), f(Xa, c, ab), w(Qa, !1))) if ($a.reverse(), hb = cubeutil.getPrettyReconstruction($a, hb), giikerutil.setLastSolve(hb.prettySolve), Ta[1] = ab - Ua, a(-1), giikerutil.reSync(), Ya.fixDisplay(!1, !0), 0 != Ta[1]) {
                            hb = giikerutil.tsLinearFix($a.flat()); c = 0; DEBUG && console.log("time fit, old=", Ta); for (cb = 0; cb < $a.length; cb++)c += $a[cb].length, Ta[$a.length - cb] = 0 == c ? 0 : hb[c - 1][1]; DEBUG && console.log("time fit, new=",
                                Ta); hb = kernel.getConjMoves(cubeutil.moveSeq2str(hb), !0); e("time", ["", 0, Ta, 0, [hb, "333"]])
                        } else "t" == z("giiMode") && kernel.pushSignal("ctrl", ["scramble", "next"])
                    }
            } function w(a, b) { if (b) return a == mathlib.SOLVED_FACELET && "n" == z("giiMode"); if ("t" == z("giiMode")) { var c = { coll: "cpll", cmll: "cmll", oll: "oll", eols: "oll", wvls: "oll", zbls: "eoll" }[(tools.getCurScramble() || [])[0]]; if (c) return 0 == cubeutil.getStepProgress(c, a) } return a == mathlib.SOLVED_FACELET } function h(c) {
                b(); if (-1 == x) {
                    if ("n" == kernel.getProp("giiMode")) {
                        if (!giikerutil.checkScramble()) {
                            var n =
                                scramble_333.genFacelet(Qa); e("scramble", ["333", kernel.getConjMoves(n, !0), 0])
                        } giikerutil.markScrambled()
                    } else giikerutil.markScrambled(!0); a(-2); Ua = c; Ya.reset(r); Ya.fixDisplay(!0, !0); z("giiBS") && metronome.playTick()
                }
            } function y(a) { (r = a) ? Za.show() : Za.hide(); a && Wa.resetVRC(!0, !0) } var Sa = !1, r = !1, Va = 0, Na = 0, Ra = 0, Za = $("<div />"), Xa = 1, Qa = mathlib.SOLVED_FACELET, Wa = function () {
                function a(a, f) {
                    if ((!e || f) && r) {
                        var h = { puzzle: "cube3", style: z("giiVRC") }; puzzleFactory.init(h, $.noop, Za, function (e, f) {
                            w = e; f && !w && (Za.css("height",
                                ""), Za.html("--:--")); if (!a || f) Ya.fixDisplay(!1, !0), b(z("timerSize")); n.fromFacelet(mathlib.SOLVED_FACELET); if (w) { for (var h = w.parseScramble("U2 U2", !0), y = n.ori = 0; y < h.length; y++)n.selfMoveStr(w.move2str(h[y])); w.applyMoves(h); h = z("giiOri"); c("auto" == h ? -1 : ~~h) }
                        }); e = !0
                    }
                } function b(a) { Za.css("height", a * $("#logo").width() / 9 + "px"); w && w.resize() } function c(a) {
                    h = a; if (-1 != h && n.ori != h) {
                        a = mathlib.CubieCube.rot2str[mathlib.CubieCube.rotMulI[h][n.ori]].split(/\s+/); for (var b = 0; b < a.length; b++)n.selfMoveStr(a[b]);
                        w.applyMoves(w.parseScramble(a.join(" ")))
                    }
                } var e = !1, n = new mathlib.CubieCube, f = new mathlib.CubieCube, w, h = -1; return {
                    resetVRC: a, setState: function (b, c, h) {
                        if (void 0 != w && r) {
                            f.fromFacelet(b); h = []; for (var y = !0, Sa = 0; Sa < c.length; Sa++)if (h.push(c[Sa]), f.selfMoveStr(c[Sa], !0), f.isEqual(n)) { y = !1; break } y ? (a(!1), n.fromFacelet(mathlib.SOLVED_FACELET), h = scramble_333.genFacelet(b)) : h = h.reverse().join(" "); c = h.match(/^\s*$/) || !w ? [] : w.parseScramble(kernel.getConjMoves(h, !0, n.ori)); 5 > c.length ? w.addMoves(c) : w.applyMoves(c);
                            e = !1; n.fromFacelet(b)
                        }
                    }, setOri: c, setSize: b
                }
            }(); $(function () { Za.appendTo("#container"); c("giikerVRC", "property", function (a, b) { r && (Wa.resetVRC(!0, !0), Wa.setState(Qa, ["U2", "U2"], !1)) }, /^(?:preScrT?|isTrainScr|giiOri)$/) }); return {
                setEnable: function (a) {
                    (Sa = "g" == a) && !GiikerCube.isConnected() ? (giikerutil.setCallback(n), kernel.showDialog([$("<div>Press OK To Connect To Bluetooth Cube</div>").append(gb), function () { giikerutil.init()["catch"](function (a) { DEBUG && console.log("[giiker] init failed", a) }) }, 0, 0],
                        "share", "Bluetooth Connect")) : Sa || giikerutil.stop(); y(Sa && "n" != z("giiVRC"))
                }, onkeydown: function (c) {
                    $.now(); if (27 == c || 28 == c) { if (c = 1 <= x, b(), a(-1), giikerutil.reSync(), Ya.fixDisplay(!1, !0), c) { Ta[0] = -1; $a.reverse(); c = giikerutil.tsLinearFix($a.flat()); var n = 0; DEBUG && console.log("time fit, old=", Ta); for (var f = 0; f < $a.length; f++)n += $a[f].length, Ta[$a.length - f] = 0 == n ? 0 : c[n - 1][1]; DEBUG && console.log("time fit, new=", Ta); c = kernel.getConjMoves(cubeutil.moveSeq2str(c), !0); e("time", ["", 0, Ta, 0, [c, "333"]]) } } else 32 ==
                        c && z("giiSK") && (w(Qa, !0) || -1 == x && h($.now()))
                }, setVRC: y, setSize: Wa.setSize
            }
        }(), ob = "input phases preScrT? isTrainScr giiOri useMilli showDiff smallADP giiVRC col-timer".split(" "); $(function () {
            Qa = $("#container"); gb = $(".instruction").appendTo(kernel.temp); c("timer", "property", function (b, c) {
                "timerSize" == c[0] && (Qa.css("font-size", c[1] + "em"), Za.setSize(c[1]), hb.setSize(c[1])); "timerSize" != c[0] && "phases" != c[0] || $("#multiphase").css("font-size", z("timerSize") / Math.max(z("phases"), 4) + "em"); "input" == c[0] &&
                    (n.setEnable(c[1]), hb.setEnable(c[1]), Sa.setEnable(c[1])); "showAvg" == c[0] && fb.showAvgDiv(c[1]); "giiVRC" == c[0] && "set" != c[2] && hb.setEnable(z("input")); 0 <= ["toolPos", "scrHide", "toolHide", "statHide"].indexOf(c[0]) && h(!1); 0 <= ["useIns", "scrType", "showIns"].indexOf(c[0]) && Ya.renderUtil(); "col-timer" == c[0] && (Va = (c[1] || "#f00#0d0#dd0#080#f00").match(/#[0-9a-fA-F]{3}/g)); if (-1 != $.inArray(c[0], ob)) {
                        var e = z("input"); a(-1); Za.setEnable("v" == e || "q" == e); Za.reset(); Ya.setEnable("i" != e); Ya.reset(/^[ilvq]$/.exec(e) ||
                            "g" == e && "n" != z("giiVRC"), "i" == e); Xa.reset(e); w.setEnable("i" == e); Ya.renderUtil(); Ya.fixDisplay(!1, !0)
                    }
            }, /^(?:input|phases|scrType|preScrT?|isTrainScr|giiOri|timerSize|showAvg|showDiff|useMilli|smallADP|giiVRC|toolPos|scrHide|toolHide|statHide|useIns|showIns|col-timer)$/); c("timer", "ashow", function (a, b) { h(!b) }); c("timer", "button", h.bind(null, !1)); c("timer", "session", h.bind(null, !1)); c("timer", "scrfix", h.bind(null, !1)); $(window).bind("resize", h.bind(null, !1)); Oa("vrc", "vrcSpeed", 1, PROPERTY_VRCSPEED,
                [100, [0, 50, 100, 200, 500, 1E3], "∞ 20 10 5 2 1".split(" ")], 1); Oa("vrc", "vrcOri", -2, "PROPERTY_VRCORI", ["6,12", ["6,12", "10,11"], ["UF", "URF"]], 1); Oa("vrc", "vrcMP", 1, PROPERTY_VRCMP, ["n", "n cfop fp cf4op cf4o2p2 roux".split(" "), PROPERTY_VRCMPS.split("|")], 1); Oa("vrc", "vrcAH", 1, PROPERTY_VRCAH, ["01", ["00", "01", "10", "11"], PROPERTY_VRCAHS.split("|")], 1); Oa("vrc", "giiMode", 1, PROPERTY_GIIMODE, ["n", ["n", "t"], PROPERTY_GIIMODES.split("|")], 1); Oa("vrc", "giiVRC", 1, PROPERTY_GIIKERVRC, ["v", ["n", "v", "q", "ql", "q2"], ["None",
                    "Virtual", "qCube", "qLast", "q2Look"]], 1); Oa("vrc", "giiOri", 1, PROPERTY_GIIORI, ["auto", "auto 0 3 2 1 4 5 6 7 23 14 19 8 17 10 21 12 11 22 13 18 15 16 9 20".split(" "), "auto;(UF);(UR) y;(UB) y2;(UL) y';(DF) z2;(DL) z2 y;(DB) z2 y2;(DR) z2 y';(RF) z';(RD) z' y;(RB) z' y2;(RU) z' y';(LF) z;(LU) z y;(LB) z y2;(LD) z y';(BU) x';(BR) x' y;(BD) x' y2;(BL) x' y';(FD) x;(FR) x y;(FU) x y2;(FL) x y'".split(";")], 1); Oa("vrc", "giiSD", 1, PROPERTY_GIISOK_DELAY, ["s", "2345ns".split(""), PROPERTY_GIISOK_DELAYS.split("|")],
                        1); Oa("vrc", "giiSK", 0, PROPERTY_GIISOK_KEY, [!0], 1); Oa("vrc", "giiSM", 1, PROPERTY_GIISOK_MOVE, ["n", ["x4", "xi2", "n"], PROPERTY_GIISOK_MOVES.split("|")], 1); Oa("vrc", "giiBS", 0, PROPERTY_GIISBEEP, [!0], 1); Oa("vrc", "giiRST", 1, PROPERTY_GIIRST, ["p", ["a", "p", "n"], PROPERTY_GIIRSTS.split("|")]); Oa("vrc", "giiAED", 0, PROPERTY_GIIAED, [!1]); Oa("timer", "useMouse", 0, PROPERTY_USEMOUSE, [!1], 1); Oa("timer", "useIns", 1, PROPERTY_USEINS, ["n", ["a", "b", "n"], PROPERTY_USEINS_STR.split("|")], 1); Oa("timer", "showIns", 0, PROPERTY_SHOWINS,
                            [!0], 1); Oa("timer", "voiceIns", 1, PROPERTY_VOICEINS, ["1", ["n", "1", "2"], PROPERTY_VOICEINS_STR.split("|")], 1); Oa("timer", "voiceVol", 2, PROPERTY_VOICEVOL, [100, 1, 100], 1); Oa("timer", "input", 1, PROPERTY_ENTERING, ["t", "tismvgqbl".split(""), PROPERTY_ENTERING_STR.split("|")], 1); Oa("timer", "intUN", 1, PROPERTY_INTUNIT, [20100, [1, 100, 1E3, 10001, 10100, 11E3, 20001, 20100, 21E3], "X X.XX X.XXX X:XX X:XX.XX X:XX.XXX X:XX:XX X:XX:XX.XX X:XX:XX.XXX".split(" ")], 1); Oa("timer", "timeU", 1, PROPERTY_TIMEU, ["c", ["u", "c", "s", "i", "n"],
                                PROPERTY_TIMEU_STR.split("|")], 1); Oa("timer", "preTime", 1, PROPERTY_PRETIME, [300, [0, 300, 550, 1E3], ["0", "0.3", "0.55", "1"]], 1); Oa("timer", "phases", 2, PROPERTY_PHASES, [1, 1, 10], 3); Oa("kernel", "showAvg", 0, SHOW_AVG_LABEL, [!0], 1); Oa("kernel", "showDiff", 1, SHOW_DIFF_LABEL, ["rg", ["rg", "gr", "b", "n"], SHOW_DIFF_LABEL_STR.split("|")], 1); Oa("ui", "timerSize", 2, PROPERTY_TIMERSIZE, [20, 1, 100], 1); Oa("ui", "smallADP", 0, PROPERTY_SMALLADP, [!0], 1); Va = kernel.getProp("col-timer", "#f00#0d0#dd0#080#f00").match(/#[0-9a-fA-F]{3}/g)
        });
    var jb; return {
        onkeydown: function (a) { if (!b.isPop()) { var c = Na(a), e = $(document.activeElement); if (e.is("input, textarea, select")) if ("i" == z("input") && "inputTimer" == e.prop("id")) 13 == c && w.parseInput(); else return; else e.blur(); -1 == x && 27 == c && Ya.renderUtil(!0); switch (z("input")) { case "t": case "l": Xa.onkeydown(c, a); break; case "s": n.onkeydown(c, a); break; case "b": Sa.onkeydown(c, a); break; case "i": w.onkeydown(c, a); break; case "v": case "q": Za.onkeydown(c, a); break; case "g": hb.onkeydown(c, a) } } }, onkeyup: function (a) {
            if (!b.isPop()) {
                var c =
                    Na(a), e = $(document.activeElement); if (e.is("input, textarea, select")) if ("i" == z("input") && "inputTimer" == e.prop("id")) 13 == c && w.clear(); else return; else e.blur(); switch (z("input")) { case "t": case "l": Xa.onkeyup(c, a); break; case "s": n.onkeyup(c, a); break; case "b": Sa.onkeyup(c, a); break; case "i": w.onkeyup(c, a) }
            }
        }, showAvgDiv: fb.showAvgDiv, refocus: function () { void 0 != jb ? jb.focus() : document.activeElement && document.activeElement.blur && document.activeElement.blur() }, getStatus: function () { return x }, getCurTime: function (a) {
            return 0 <
                x ? (a || $.now()) - Ua : 0
        }, getStartTime: function () { return Ua || $.now() }
    }
}, [kernel.regListener, kernel.regProp, kernel.getProp, kernel.pretty, kernel.ui, kernel.pushSignal]); var scrMgr = function (c, Oa) {
    function z(a, b, e) { a = a || [[""]]; b = b || [""]; e = e || 0; for (var f = 0, h = -1, r = [], Ta, z, Pa = 0; Pa < e; Pa++) { do Ta = c(a.length), z = c(a[Ta].length), Ta != h && (f = 0, h = Ta); while (0 != (f >> z & 1)); f |= 1 << z; a[Ta][z].constructor == Array ? r.push(Oa(a[Ta][z]) + Oa(b)) : r.push(a[Ta][z] + Oa(b)) } return r.join(" ") } function r(c, z, h) { DEBUG && console.log("[regscr]", c); if ($.isArray(c)) for (h = 0; h < c.length; h++)b[c[h]] = z; else b[c] = z, void 0 != h && (e[c] = h[0], a[c] = h[1], Pa[c] = h[2]); return r } var b = { blank: function () { return "N/A" } }, e = {},
        a = {}, Pa = {}; return {
            reg: r, scramblers: b, filters: e, probs: a, imgGens: Pa, mega: z, formatScramble: function (a) { return a.replace(/[$#]\{([^\}]+)\}/g, function (a, c) { if ("$" == a[0]) { var e = [c]; "[" == c[0] && (e = JSON.parse(c)); return b[e[0]].apply(this, e) } return "#" == a[0] ? z.apply(this, JSON.parse("[" + c + "]")) : "" }) }, rndState: function (a, b) { if (void 0 != b) { var c = b.slice(); void 0 == a && (a = c); if (0 == b[0]) return a.slice(); for (var e = 0; e < a.length; e++)a[e] || (c[e] = 0); return mathlib.rndProb(c) } }, fixCase: function (a, b) {
                return void 0 == a ? mathlib.rndProb(b) :
                    a
            }
        }
}(mathlib.rn, mathlib.rndEl), scramble = execMain(function (c, Oa) {
    function z() { kernel.blur(); kernel.pushSignal("scrambling", jb); n.html(SCRAMBLE_SCRAMBLING + "..."); rb = !jb || /^(remote|input$)/.exec(jb) ? rb : jb; ub || (ab = jb, qb = eb, nb = kb); ub = !1; qb && vb.addClass("click").unbind("click").click(r); jb = cb.getSelected(); kb = ~~w.val(); ab != jb && kernel.setProp("scrType", jb); eb = ""; requestAnimFrame(Pa) } function r() {
        ub = !0; n.html(a(ab, qb, nb, !0)); vb.removeClass("click").unbind("click"); void 0 != qb && kernel.pushSignal("scrambleX",
            a(ab, qb, nb))
    } function b() { ub ? (ub = !1, n.html(a(jb, eb, kb, !0)), vb.addClass("click").unbind("click").click(r), kernel.pushSignal("scrambleX", a(jb, eb, kb))) : z() } function e() { if (eb) { var a = kernel.getProp("scrClk", "n"); "c" == a ? $.clipboardCopy(n.text()) && logohint.push("scramble copied") : "+" == a && b() } } function a(a, b, c, e, f) {
        b = b || ""; c = c || 0; var w = /^\$T([a-zA-Z0-9]+)(-[0-9]+)?\$\s*(.*)$/.exec(b); w && (a = w[1], b = w[3], c = ~~w[2]); return e ? (a = b.replace(/~/g, "").replace(/\\n/g, "\n").replace(/`([^`]*)`/g, "$1").length, a = kernel.getProp("scrASize") ?
            Math.max(.25, Math.round(20 * Math.pow(50 / Math.max(a, 10), .3)) / 20) : 1, n.css("font-size", a + "em"), DEBUG && console.log("[scrFontSize]", a), b.replace(/~/g, "&nbsp;").replace(/\\n/g, "\n").replace(/`([^`]*)`/g, f || kernel.getProp("scrKeyM", !1) ? "<u>$1</u>" : "$1")) : [a, b.replace(/~/g, "").replace(/\\n/g, "\n").replace(/`([^`]*)`/g, "$1"), c]
    } function Pa() { h(); eb ? (eb = eb.replace(/(\s*)$/, ""), n.html(a(jb, eb, kb, !0)), kernel.pushSignal("scramble", a(jb, eb, kb))) : n.html(SCRAMBLE_SCRAMBLING + "... ") } function f(a, b, c) {
        zb && !a[0].startsWith("nocache_") &&
        (csTimerWorker && csTimerWorker.getScramble ? yb = yb || csTimerWorker.getScramble(a, function (a, b) { DEBUG && console.log("[scrcache]", a + " cached by csTimerWorker"); bb(a, b) }.bind(void 0, b)) : c || (yb = yb || setTimeout(function (a, b) { var c = Wa[b[0]]; bb(a, c.apply(c, b)) }.bind(void 0, b, a), 500)))
    } function bb(a, b) { var c = JSON.parse(localStorage.cachedScr || null) || {}; $.isArray(c) && (c = {}); c[a] = b; localStorage.cachedScr = JSON.stringify(c); yb = 0 } function h() {
        if (jb) {
            eb = ""; var a = Za[jb] || jb; if ("input" == a) eb = pb.next(); else if (pb.clear(),
                a.startsWith("remote")) eb = Fb.next(a); else if (Fb.clear(), a in Wa) { var b = JSON.parse(localStorage.cachedScr || null) || {}, c = JSON.stringify([a, kb, hb[1]]); zb && c in b && !a.startsWith("nocache_") ? (eb = b[c], delete b[c], localStorage.cachedScr = JSON.stringify(b)) : eb = Wa[a](a, kb, Bb(hb[1], $a[a])); f([a, kb, Bb(hb[1], $a[a])], c) } else requestAnimFrame(Pa)
        }
    } function Na() {
        kernel.blur(); var a = cb.getSelIdx(); a = scrdata[a[0]][1][a[1]][2]; w.val(Math.abs(a)); w[0].disabled = 0 >= a; a = cb.getSelected(); hb = JSON.parse(kernel.getProp("scrFlt",
            JSON.stringify([a, Ra[a]]))); lb[0].disabled = w[0].disabled && !(a in Ra); hb[0] != a && (hb = [a, Ra[a] && mathlib.valuedArray(Ra[a].length, 1)], kernel.setProp("scrFlt", JSON.stringify(hb), "session"))
    } function Qa() { Na(); z() } function x() {
        function a() { if (jb in Ra) { for (var a = mathlib.valuedArray(Ra[jb].length, 1), c = !1, n = 0; n < b.length; n++)b[n][0].checked ? c = !0 : a[n] = 0; c ? (hb = [jb, a], a = JSON.stringify(hb), kernel.getProp("scrFlt") != a && (e = !0, kernel.setProp("scrFlt", a))) : alert(SCROPT_EMPTYALT); e && z() } } Ya.empty(); var b = [], c = [], e =
            !1; if (jb in Ra) {
                var n = Ra[jb], f = Va[jb], w = n; hb[0] == jb && (w = hb[1] || n); Ya.append("<br>", fb, Xa, "<br><br>"); for (var h = {}, y = 0; y < n.length; y++) { var Sa = n[y].indexOf("-"); -1 == Sa ? h[n[y]] = [y] : (Sa = n[y].slice(0, Sa), h[Sa] = h[Sa] || [], h[Sa].push(y)) } for (y = 0; y < n.length; y++) { Sa = $('<input type="checkbox">').val(y); w[y] && (Sa[0].checked = !0); b.push(Sa); Sa = $("<label>").append(Sa, n[y]); if (f) { var r = $("<canvas>"); r.width("5em"); r.height("5em"); Sa.append("<br>", r); f(y, r); Sa.addClass("bimg") } c.push(Sa) } var x = function (a) {
                    var c = 0;
                    $.each(h[a], function (a, e) { c += b[e][0].checked ? 1 : 0 }); return c + "/" + h[a].length
                }, Na; for (Na in h) 1 == h[Na].length && Ya.append(c[h[Na][0]]); for (Na in h) 1 != h[Na].length && Ya.append($("<div>").attr("data", Na).append($('<div class="sgrp">').append($("<span>").html(Na + " " + x(Na)), " | ", $('<span class="click">').html(SCROPT_BTNALL).click(function () { var a = $(this).parent().parent().attr("data"); $.each(h[a], function (a, c) { b[c][0].checked = !0 }); $(this).parent().children().first().html(a + " " + x(a)) }), " | ", $('<span class="click">').html(SCROPT_BTNNONE).click(function () {
                    var a =
                        $(this).parent().parent().attr("data"); $.each(h[a], function (a, c) { b[c][0].checked = !1 }); $(this).parent().children().first().html(a + " " + x(a))
                }), " | ", $('<span class="click">[+]</span>').click(function () { $(this).parent().next().toggle() })), $("<div>").append($.map(h[Na], function (a) { b[a].change(function () { var a = $(this).parent().parent().parent().attr("data"); $(this).parent().parent().parent().find("span:first").html(a + " " + x(a)) }); return c[a] })))); fb.unbind("click").click(function () {
                    for (var a = 0; a < b.length; a++)b[a][0].checked ||
                        (b[a][0].checked = !0), b[a].change()
                }); Xa.unbind("click").click(function () { for (var a = 0; a < b.length; a++)b[a][0].checked && (b[a][0].checked = !1), b[a].change() })
            } kernel.showDialog([gb, a, null, a], "scropt", SCROPT_TITLE)
    } function Ta(c, e) {
        "time" == c ? Eb ? z() : (n.empty(), kernel.pushSignal("scramble", ["-", "", 0])) : "property" == c ? "scrSize" == e[0] ? Sa.css("font-size", e[1] / 7 + "em") : "scrMono" == e[0] ? y.css("font-family", e[1] ? "Monospace" : "Arial") : "scrType" == e[0] ? e[1] != cb.getSelected() && (cb.loadVal(e[1]), Qa()) : "scrLim" == e[0] ? e[1] ?
            Sa.addClass("limit") : Sa.removeClass("limit") : "scrAlign" == e[0] ? "c" == e[1] ? y.css("text-align", "center") : "l" == e[1] ? y.css("text-align", "left") : "r" == e[1] && y.css("text-align", "right") : "scrFast" == e[0] ? (Za["444wca"] = e[1] ? "444m" : "444wca", "444wca" == jb && z()) : "scrKeyM" == e[0] ? n.html(ub ? a(ab, qb || "", nb || 0, !0) : a(jb, eb || "", kb, !0)) : "scrHide" == e[0] && (e[1] ? db.hide() : db.show()) : "button" == c && "scramble" == e[0] ? (Eb = e[1]) && "" == n.html() && z() : "ctrl" == c && "scramble" == e[0] ? "last" == e[1] ? r() : "next" == e[1] && b() : "scrfix" == c && e && n.html(a(jb,
                e, kb, !0, !0))
    } function Ua(a, b) { for (var c = 0; c < scrdata.length; c++)for (var e = 0; e < scrdata[c][1].length; e++)if (scrdata[c][1][e][1] == a) { b(c, e); return } } var Wa = scrMgr.scramblers, Ra = scrMgr.filters, $a = scrMgr.probs, Va = scrMgr.imgGens, y = $('<div id="scrambleDiv"/>'), db = $("<div />").addClass("title"), mb = [$("<select />"), $("<select />")], cb = new kernel.TwoLvMenu(scrdata, Qa, mb[0], mb[1], "333"), lb = $('<input type="button" class="icon">').val(""), gb = $("<div>"), Ya = $('<div class="sflt">'), fb = $('<input type="button">').val(SCROPT_BTNALL),
        Xa = $('<input type="button">').val(SCROPT_BTNNONE), w = $('<input type="text" maxlength="3">'), n = $("<div>"), Sa = $('<div id="scrambleTxt"/>'), Za = { "333oh": "333", "333ft": "333" }, hb = "", ob = $("<textarea />"), jb, eb, kb = 0, ab, qb, nb = 0, rb = "333", ub = !1, vb = $("<span />").html(SCRAMBLE_LAST), wb = $("<span />").addClass("click").html(SCRAMBLE_NEXT).click(b), zb = !0, yb = 0; $(function () {
            if (csTimerWorker && csTimerWorker.getScramble) {
                var a = ['["444wca",40,null]'], b = JSON.parse(localStorage.cachedScr || null) || {}; $.isArray(b) && (b = {}); for (var c =
                    0; c < a.length; c++)a[c] in b || setTimeout(f.bind(void 0, JSON.parse(a[c]), a[c], !0), 2500 + ~~(5E3 * Math.random()))
            }
        }); var Fb = function () {
            function a() { kernel.setProp("scrType", rb) } function b(a) { if (!$.isArray(a)) return !1; c = a; return 0 != c.length } var c = []; return {
                next: function (e) {
                    for (var n = null; !n && 0 != c.length;)n = c.shift(); if (n) return n; "remoteComp" == e ? window.onlinecomp ? onlinecomp.getScrambles().then(function (c) { b(c) ? requestAnimFrame(Pa) : a() }, a) : a() : "remoteBattle" == e ? window.battle ? battle.getScrambles().then(function (c) {
                        b(c) ?
                        requestAnimFrame(Pa) : a()
                    }, a) : a() : "remoteURL" == e && $.getJSON("https://cstimer.net/testRemoteScramble.php", function (c) { b(c) ? requestAnimFrame(Pa) : a() }).error(a); return ""
                }, clear: function () { c = [] }
            }
        }(), pb = function () {
            function a() { var a = ob.val(); if (a.match(/^\s*$/)) a = !1; else { c = []; a = a.split("\n"); for (var b = 0; b < a.length; b++) { var e = a[b]; null == e.match(/^\s*$/) && c.push(e.replace(/^\d+[\.\),]\s*/, "")) } a = 0 != c.length } a ? Pa() : kernel.setProp("scrType", rb) } function b() { kernel.setProp("scrType", rb) } var c = []; return {
                next: function () {
                    for (var e =
                        null; !e && 0 != c.length;)e = c.shift(); if (e) return e; ob.val(""); kernel.showDialog([ob, a, b], "input", SCRAMBLE_INPUT); return ""
                }, clear: function () { c = [] }
            }
        }(), Eb = !1, Cb = function () {
            function a() { var a = ~~n.val(); r = ""; for (var b = eb, c = w.val(), e = 0; e < a; e++)h(), r += c.replace("1", e + 1) + eb + "\n"; eb = b; f.text(r); f.select() } function b(a) {
                if (r) {
                    a = new Blob([r], { type: "text/plain" }); var b = $('<a class="click"/>').appendTo("body"); b.attr("href", URL.createObjectURL(a)); b.attr("download", "Scrambles_" + mathlib.time2str(new Date / 1E3, "%Y%M%D_%h%m%s") +
                        ".txt"); b[0].click(); b.remove()
                }
            } var c = $("<div />").css("text-align", "center").css("font-size", "0.7em"), e = $("<span />").addClass("click").html(SCRGEN_GEN), n = $('<input type="text" maxlength="3">').val(5), f = $('<textarea rows="10" style="width: 100%" readonly />'), w = $('<select><option value="1. ">1. </option><option value="1) ">1) </option><option value="(1) ">(1) </option><option value=""></option></select>'), Sa = $('<span class="click">').html("Download"); c.append(SCRGEN_NSCR, n, "&nbsp;", SCRGEN_PRE).append(w,
                "<br>", e, " | ", Sa, "<br>", f); var r = ""; return function (n) { n && (n.empty().append(c.width(y.width() / 2)), w.unbind("change").change(kernel.blur), e.unbind("click").click(a), Sa.unbind("click").click(b)) }
        }(), Bb = scrMgr.rndState; $(function () {
            kernel.regListener("scramble", "time", Ta); kernel.regListener("scramble", "property", Ta, /^scr(?:Size|Mono|Type|Lim|Align|Fast|KeyM|Hide)$/); kernel.regListener("scramble", "button", Ta, /^scramble$/); kernel.regListener("scramble", "ctrl", Ta, /^scramble$/); kernel.regListener("scramble",
                "scrfix", Ta); kernel.regProp("scramble", "scrSize", 2, PROPERTY_SCRSIZE, [15, 5, 50], 1); kernel.regProp("scramble", "scrASize", 0, PROPERTY_SCRASIZE, [!0], 1); kernel.regProp("scramble", "scrMono", 0, PROPERTY_SCRMONO, [!0], 1); kernel.regProp("scramble", "scrLim", 0, PROPERTY_SCRLIM, [!1], 1); kernel.regProp("scramble", "scrAlign", 1, PROPERTY_SCRALIGN, ["c", ["c", "l", "r"], PROPERTY_SCRALIGN_STR.split("|")], 1); kernel.regProp("scramble", "preScr", 1, "pre-scramble", ["", ";y;y2;y';z2;z2 y;z2 y2;z2 y';z';z' y;z' y2;z' y';z;z y;z y2;z y';x';x' y;x' y2;x' y';x;x y;x y2;x y'".split(";"),
                    "(UF);(UR) y;(UB) y2;(UL) y';(DF) z2;(DL) z2 y;(DB) z2 y2;(DR) z2 y';(RF) z';(RD) z' y;(RB) z' y2;(RU) z' y';(LF) z;(LU) z y;(LB) z y2;(LD) z y';(BU) x';(BR) x' y;(BD) x' y2;(BL) x' y';(FD) x;(FR) x y;(FU) x y2;(FL) x y'".split(";")], 1); kernel.regProp("scramble", "preScrT", 1, "training pre-scramble", ["z2", ";y;y2;y';z2;z2 y;z2 y2;z2 y';z';z' y;z' y2;z' y';z;z y;z y2;z y';x';x' y;x' y2;x' y';x;x y;x y2;x y'".split(";"), "(UF);(UR) y;(UB) y2;(UL) y';(DF) z2;(DL) z2 y;(DB) z2 y2;(DR) z2 y';(RF) z';(RD) z' y;(RB) z' y2;(RU) z' y';(LF) z;(LU) z y;(LB) z y2;(LD) z y';(BU) x';(BR) x' y;(BD) x' y2;(BL) x' y';(FD) x;(FR) x y;(FU) x y2;(FL) x y'".split(";")],
                        1); kernel.regProp("scramble", "scrFast", 0, PROPERTY_SCRFAST, [!1]); kernel.regProp("scramble", "scrKeyM", 0, PROPERTY_SCRKEYM, [!1], 1); kernel.regProp("scramble", "scrClk", 1, PROPERTY_SCRCLK, ["n", ["n", "c", "+"], PROPERTY_SCRCLK_STR.split("|")], 1); kernel.regProp("scramble", "scrType", -6, "Scramble Type", ["333"], 3); w.change(z); lb.click(x); gb.append($("<div>").append(SCRAMBLE_LENGTH + ": ", w), Ya); db.append($("<nobr>").append(mb[0], " ", mb[1], " ", lb), " <wbr>"); db.append($("<nobr>").append(vb, "/", wb, SCRAMBLE_SCRAMBLE));
            y.append(db, Sa.append(n).click(e)); tools.regTool("scrgen", TOOLS_SCRGEN, Cb); Sa.click(function () { db.show(); kernel.blur(); kernel.setProp("scrHide", !1) }); kernel.regProp("ui", "scrHide", -1, "Hide Scramble Selector", [!1]); kernel.addWindow("scramble", BUTTON_SCRAMBLE, y, !0, !0, 3); Na()
        }); return {
            getTypeName: function (a) { var b = ""; Ua(a, function (a, c) { b = scrdata[a][0] + ">" + scrdata[a][1][c][0] }); return b }, getTypeIdx: function (a) { var b = 1E300; Ua(a, function (a, c) { b = 100 * a + c }); return b }, scrStd: a, setCacheEnable: function (a) {
                zb =
                a
            }
        }
}, [mathlib.rn, mathlib.rndEl]); (function (c, Oa, z) {
    function r(a, b) { var e = f[a]; switch (e.length) { case 1: return c(e[0], [""], b); case 2: return c(e[0], e[1], b); case 3: return c(e[0], e[1], e[2]) } } function b(b, c) {
        var e = h[b], f = e[1], r = e[2], x = 0, Na = 0, Va = [], y = [["R", "R'"], ["R'", "R"], ["L", "L'"], ["L'", "L"], ["F'", "F"], ["F", "F'"], ["B", "B'"], ["B'", "B"]], Pa = ["U", "D"]; e = e[0]; for (var Qa = 0; Qa < r.length; Qa++)Va[Qa] = 0; for (Qa = 0; Qa < c; Qa++) {
            for (var cb = !1; !cb;)for (var bb = "", gb = 0; gb < r.length; gb++) { var Ya = Oa(4); Va[gb] += Ya; 0 != Ya && (cb = !0, bb += " " + r[gb] + a[Ya - 1]) } cb = Oa(8);
            gb = Oa(2); Ya = Oa(3); e += bb + " " + y[cb][0] + " " + Pa[gb] + a[Ya] + " " + y[cb][1]; 0 == gb && (x += Ya + 1); 1 == gb && (Na += Ya + 1)
        } for (Qa = 0; Qa < r.length; Qa++)Ya = 4 - Va[Qa] % 4, 4 > Ya && (e += " " + r[Qa] + a[Ya - 1]); x = 4 - x % 4; Na = 4 - Na % 4; 4 > x && (e += " U" + a[x - 1]); 4 > Na && (e += " D" + a[Na - 1]); return e += " " + z(f)
    } function e(a, b) { var c = bb[a].replace(/%l/g, b).replace(/%c/g, '["","2","\'"]'); return scrMgr.formatScramble(c) } var a = ["", "2", "'"], Pa = ["", "2", "'", "2'"], f = {
        111: [[["x"], ["y"], ["z"]], a], 2223: [[["U"], ["R"], ["F"]], a], 2226: [[[["U", "D"]], [["R", "L"]], [["F", "B"]]],
            a], "333o": [[["U", "D"], ["R", "L"], ["F", "B"]], a], 334: [[[["U", "U'", "U2"], ["u", "u'", "u2"]], [["R2", "L2", "M2"]], [["F2", "B2", "S2"]]]], 336: [[[["U", "U'", "U2"], ["u", "u'", "u2"], ["3u", "3u2", "3u'"]], [["R2", "L2", "M2"]], [["F2", "B2", "S2"]]]], 888: [["U D u d 3u 3d 4u".split(" "), "R L r l 3r 3l 4r".split(" "), "F B f b 3f 3b 4f".split(" ")], a], 999: [["U D u d 3u 3d 4u 4d".split(" "), "R L r l 3r 3l 4r 4l".split(" "), "F B f b 3f 3b 4f 4b".split(" ")], a], 101010: [["U D u d 3u 3d 4u 4d 5u".split(" "), "R L r l 3r 3l 4r 4l 5r".split(" "),
            "F B f b 3f 3b 4f 4b 5f".split(" ")], a], 111111: [["U D u d 3u 3d 4u 4d 5u 5d".split(" "), "R L r l 3r 3l 4r 4l 5r 5l".split(" "), "F B f b 3f 3b 4f 4b 5f 5b".split(" ")], a], 444: [[["U", "D", "u"], ["R", "L", "r"], ["F", "B", "f"]], a], "444m": [[["U", "D", "Uw"], ["R", "L", "Rw"], ["F", "B", "Fw"]], a], 555: [[["U", "D", "u", "d"], ["R", "L", "r", "l"], ["F", "B", "f", "b"]], a], "555wca": [[["U", "D", "Uw", "Dw"], ["R", "L", "Rw", "Lw"], ["F", "B", "Fw", "Bw"]], a], "666p": [[["U", "D", "2U", "2D", "3U"], ["R", "L", "2R", "2L", "3R"], ["F", "B", "2F", "2B", "3F"]],
                a], "666wca": [[["U", "D", "Uw", "Dw", "3Uw"], ["R", "L", "Rw", "Lw", "3Rw"], ["F", "B", "Fw", "Bw", "3Fw"]], a], "666s": [[["U", "D", "U&sup2;", "D&sup2;", "U&sup3;"], ["R", "L", "R&sup2;", "L&sup2;", "R&sup3;"], ["F", "B", "F&sup2;", "B&sup2;", "F&sup3;"]], a], "666si": [[["U", "D", "u", "d", "3u"], ["R", "L", "r", "l", "3r"], ["F", "B", "f", "b", "3f"]], a], "777p": [["U D 2U 2D 3U 3D".split(" "), "R L 2R 2L 3R 3L".split(" "), "F B 2F 2B 3F 3B".split(" ")], a], "777wca": [["U D Uw Dw 3Uw 3Dw".split(" "), "R L Rw Lw 3Rw 3Lw".split(" "), "F B Fw Bw 3Fw 3Bw".split(" ")],
                    a], "777s": [["U D U&sup2; D&sup2; U&sup3; D&sup3;".split(" "), "R L R&sup2; L&sup2; R&sup3; L&sup3;".split(" "), "F B F&sup2; B&sup2; F&sup3; B&sup3;".split(" ")], a], "777si": [["U D u d 3u 3d".split(" "), "R L r l 3r 3l".split(" "), "F B f b 3f 3b".split(" ")], a], cm3: [[[["U<", "U>", "U2"], ["E<", "E>", "E2"], ["D<", "D>", "D2"]], [["R^", "Rv", "R2"], ["M^", "Mv", "M2"], ["L^", "Lv", "L2"]]]], cm2: [[[["U<", "U>", "U2"], ["D<", "D>", "D2"]], [["R^", "Rv", "R2"], ["L^", "Lv", "L2"]]]], 233: [[[["U", "U'", "U2"]], ["R2", "L2"], ["F2", "B2"]]],
        fto: [[["U", "D"], ["F", "B"], ["L", "BR"], ["R", "BL"]], ["", "'"]], gear: [[["U"], ["R"], ["F"]], " 2 3 4 5 6 ' 2' 3' 4' 5'".split(" ")], sfl: [[["R", "L"], ["U", "D"]], a], ufo: [[["A"], ["B"], ["C"], [["U", "U'", "U2'", "U2", "U3"]]]], "2gen": [[["U"], ["R"]], a], "2genl": [[["U"], ["L"]], a], roux: [[["U"], ["M"]], a], "3gen_F": [[["U"], ["R"], ["F"]], a], "3gen_L": [[["U"], ["R", "L"]], a], RrU: [[["U"], ["R", "r"]], a], RrUu: [[["U", "u"], ["R", "r"]], a], minx2g: [[["U"], ["R"]], Pa], half: [[["U", "D"], ["R", "L"], ["F", "B"]], ["2"]], lsll: [[[["R U R'", "R U2 R'",
            "R U' R'"]], [["F' U F", "F' U2 F", "F' U' F"]], [["U", "U2", "U'"]]]], prco: [[["F", "B"], ["U", "D"], ["L", "DBR"], ["R", "DBL"], ["BL", "DR"], ["BR", "DL"]], Pa], skb: [[["R"], ["L"], ["B"], ["U"]], ["", "'"]], ivy: [[["R"], ["L"], ["D"], ["B"]], ["", "'"]], 112: [[["R"], ["R"]], a], eide: [[["OMG"], ["WOW"], ["WTF"], ["WOO-HOO WOO-HOO MATYAS YES YES YAY YEEEEEEEEEEEES".split(" ")], ["HAHA"], ["XD"], [":D"], ["LOL"]], ["", "", "", "!!!"]]
    }, bb = {
        sia113: '#{[["U","u"],["R","r"]],%c,%l} z2 #{[["U","u"],["R","r"]],%c,%l}', sia123: '#{[["U"],["R","r"]],%c,%l} z2 #{[["U"],["R","r"]],%c,%l}',
        sia222: '#{[["U"],["R"],["F"]],%c,%l} z2 y #{[["U"],["R"],["F"]],%c,%l}', 335: '#{[[["U","U\'","U2"],["D","D\'","D2"]],["R2","L2"],["F2","B2"]],0,%l} / ${333}', 337: '#{[[["U","U\'","U2","u","u\'","u2","U u","U u\'","U u2","U\' u","U\' u\'","U\' u2","U2 u","U2 u\'","U2 u2"],["D","D\'","D2","d","d\'","d2","D d","D d\'","D d2","D\' d","D\' d\'","D\' d2","D2 d","D2 d\'","D2 d2"]],["R2","L2"],["F2","B2"]],0,%l} / ${333}', r234: "2) ${222so}\\n3) ${333}\\n4) ${[444,40]}", r2345: '${r234}\\n5) ${["555",60]}', r23456: '${r2345}\\n6) ${["666p",80]}',
        r234567: '${r23456}\\n7) ${["777p",100]}', r234w: '2) ${222so}\\n3) ${333}\\n4) ${["444m",40]}', r2345w: '${r234w}\\n5) ${["555wca",60]}', r23456w: '${r2345w}\\n6) ${["666wca",80]}', r234567w: '${r23456w}\\n7) ${["777wca",100]}', rmngf: '${r2345w}\\n3oh) ${333}\\npyr) ${["pyrso",10]}\\n skb) ${skbso}\\nsq1) ${sqrs}\\nclk) ${clkwca}\\nmgm) ${["mgmp",70]}', "333ni": '${333}#{[[""]],["","Rw ","Rw2 ","Rw\' ","Fw ","Fw\' "],1}#{[[""]],["","Uw","Uw2","Uw\'"],1}', "444bld": '${444wca}#{[[""]],[""," x"," x2"," x\'"," z"," z\'"],1}#{[[""]],[""," y"," y2"," y\'"],1}',
        "555bld": '${["555wca",%l]}#{[[""]],[""," 3Rw"," 3Rw2"," 3Rw\'"," 3Fw"," 3Fw\'"],1}#{[[""]],[""," 3Uw"," 3Uw2"," 3Uw\'"],1}'
    }, h = {
        "4edge": ["r b2", ["b2 r'", "b2 U2 r U2 r U2 r U2 r"], ["u"]], "5edge": ["r R b B", ["B' b' R' r'", "B' b' R' U2 r U2 r U2 r U2 r"], ["u", "d"]], "6edge": ["3r r 3b b", ["3b' b' 3r' r'", "3b' b' 3r' U2 r U2 r U2 r U2 r", "3b' b' r' U2 3r U2 3r U2 3r U2 3r", "3b' b' r2 U2 3r U2 3r U2 3r U2 3r U2 r"], ["u", "3u", "d"]], "7edge": ["3r r 3b b", ["3b' b' 3r' r'", "3b' b' 3r' U2 r U2 r U2 r U2 r", "3b' b' r' U2 3r U2 3r U2 3r U2 3r",
            "3b' b' r2 U2 3r U2 3r U2 3r U2 3r U2 r"], ["u", "3u", "3d", "d"]]
    }, Na; for (Na in f) scrMgr.reg(Na, r); for (Na in bb) scrMgr.reg(Na, e); for (Na in h) scrMgr.reg(Na, b); scrMgr.reg("cubennn", function (b, e) {
        if (1 >= e) return "N/A"; for (var f = [[], [], []], h = 0; h < e - 1; h++)0 == h % 2 ? (f[0].push((4 > h ? "" : ~~(h / 2 + 1)) + (2 > h ? "U" : "u")), f[1].push((4 > h ? "" : ~~(h / 2 + 1)) + (2 > h ? "R" : "r")), f[2].push((4 > h ? "" : ~~(h / 2 + 1)) + (2 > h ? "F" : "f"))) : (f[0].push((4 > h ? "" : ~~(h / 2 + 1)) + (2 > h ? "D" : "d")), f[1].push((4 > h ? "" : ~~(h / 2 + 1)) + (2 > h ? "L" : "l")), f[2].push((4 > h ? "" : ~~(h / 2 + 1)) +
            (2 > h ? "B" : "b"))); return c(f, a, 10 * e)
    })
})(scrMgr.mega, mathlib.rn, mathlib.rndEl); var scramble_333 = function (c, Oa, z, r, b, e) {
    function a(a) { a.cp = [0, 1, 2, 3, 4, 5, 6, 7]; a.co = [0, 0, 0, 0, 0, 0, 0, 0]; a.ep = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]; a.eo = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] } function Pa(a, b, c) { var e; for (e = 0; 8 > e; ++e) { c.cp[e] = a.cp[b.cp[e]]; var n = a.co[b.cp[e]]; var f = b.co[e]; var w = n; w += 3 > n ? f : 6 - f; w %= 3; 3 <= n !== 3 <= f && (w += 3); c.co[e] = w } } function f() { a(this) } function bb(b, c, e, n) {
        a(this); z(this.cp, b); b = c; var f = 0; for (c = 6; 0 <= c; --c)f += this.co[c] = b % 3, b = ~~(b / 3); this.co[7] = (15 - f) % 3; Oa(this.ep, e, 12); e = n; b = 0; for (n = 10; 0 <= n; --n)b ^=
            this.eo[n] = e & 1, e >>= 1; this.eo[11] = b
    } function h(a, b, c) { var e; for (e = 0; 12 > e; ++e)c.ep[e] = a.ep[b.ep[e]], c.eo[e] = b.eo[e] ^ a.eo[b.ep[e]] } function Na() { Na = $.noop; var a, b; ob[0] = new bb(15120, 0, 119750400, 0); ob[3] = new bb(21021, 1494, 323403417, 0); ob[6] = new bb(8064, 1236, 29441808, 550); ob[9] = new bb(9, 0, 5880, 0); ob[12] = new bb(1230, 412, 2949660, 0); ob[15] = new bb(224, 137, 328552, 137); for (a = 0; 18 > a; a += 3)for (b = 0; 2 > b; ++b)ob[a + b + 1] = new f, h(ob[a + b], ob[a], ob[a + b + 1]), Pa(ob[a + b], ob[a], ob[a + b + 1]) } function Qa() {
        return Ra(0xffffffffffff,
            0xffffffffffff, 4294967295, 4294967295)
    } function x(a) { for (var b = 0, c = 0; c < a.length; c++)-1 == a[c] && b++; return b } function Ta(a, c, e) { for (var n = 0, f = 0, w = 0; w < a.length; w++)-1 != a[w] && (n += a[w]); n %= e; for (w = 0; w < a.length - 1; w++)-1 == a[w] && (1 == c-- ? a[w] = ((e << 4) - n) % e : (a[w] = b(e), n += a[w])), f *= e, f += a[w]; return f } function Ua(a, e, n) {
        for (var f = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], w = 0; w < a.length; w++)-1 != a[w] && (f[a[w]] = -1); for (var h = w = 0; w < f.length; w++)-1 != f[w] && (f[h++] = f[w]); var y; for (w = 0; w < a.length && 0 < e; w++)if (-1 == a[w]) {
            h = b(e); for (a[w] =
                f[h]; 11 > h; h++)f[h] = f[h + 1]; 2 == e-- && (y = w)
        } r(c(a, a.length), a.length) == 1 - n && (e = a[w - 1], a[w - 1] = a[y], a[y] = e); return c(a, a.length)
    } function Wa(a, b) { if ("number" !== typeof a) return a; for (var c = [], e = 0; e < b; e++) { var n = a & 15; c[e] = 15 == n ? -1 : n; a /= 16 } return c } function Ra(a, b, n, w, y, Sa, Va, Ra) {
        Na(); y = y || rb; Sa = Sa || rb; a = Wa(a, 12); b = Wa(b, 12); n = Wa(n, 8); w = Wa(w, 8); var ab = ""; do {
            var Za = b.slice(), z = a.slice(), Xa = w.slice(), $a = n.slice(); Za = Ta(Za, x(Za), 2); Xa = Ta(Xa, x(Xa), 3); var Qa = x(z), Ya = x($a); 1 == Qa && (Ua(z, Qa, -1), Qa = 0); 1 == Ya && (Ua($a,
                Ya, -1), Ya = 0); 0 == Qa && 0 == Ya ? (z = c(z, 12), $a = c($a, 8)) : 0 != Qa && 0 == Ya ? ($a = c($a, 8), z = Ua(z, Qa, r($a, 8))) : (z = 0 == Qa && 0 != Ya ? c(z, 12) : Ua(z, Qa, -1), $a = Ua($a, Ya, r(z, 12))); if (0 != $a + Xa + z + Za) {
                    ab = new bb($a, Xa, z, Za); z = new f; $a = e(Sa); Za = e(y); for (Xa = 0; Xa < $a.length; Xa++)Pa(ob[$a[Xa]], ab, z), h(ob[$a[Xa]], ab, z), Qa = z, z = ab, ab = Qa; for (Xa = 0; Xa < Za.length; Xa++)Pa(ab, ob[Za[Xa]], z), h(ab, ob[Za[Xa]], z), Qa = z, z = ab, ab = Qa; $a = ab; z = []; ab = [85, 82, 70, 68, 76, 66]; for (Za = 0; 54 > Za; ++Za)z[Za] = ab[~~(Za / 9)]; for (Ya = 0; 8 > Ya; ++Ya)for (Qa = $a.cp[Ya], Za = $a.co[Ya],
                        Xa = 0; 3 > Xa; ++Xa)z[jb[Ya][(Xa + Za) % 3]] = ab[~~(jb[Qa][Xa] / 9)]; for (Ya = 0; 12 > Ya; ++Ya)for (Qa = $a.ep[Ya], Za = $a.eo[Ya], Xa = 0; 2 > Xa; ++Xa)z[eb[Ya][(Xa + Za) % 2]] = ab[~~(eb[Qa][Xa] / 9)]; ab = String.fromCharCode.apply(null, z); ab = (new min2phase.Search).solution(ab, 21, 1E9, 50, 2, Ra, Va)
                }
        } while (3 >= ab.length); return ab.replace(/ +/g, " ")
    } function $a() { return Ra(0xffffffffffff, 0xffffffffffff, 1985229328, 0) } function Va() { return Ra(0xba9876543210, 0, 4294967295, 4294967295) } function y() { return Ra(0xba987654ffff, 65535, 1985282047, 65535) }
    function db(a, b, c) { a = ub[scrMgr.fixCase(c, vb)][0]; b = Math.pow(16, a & 15); c = Math.pow(16, a >> 8 & 15); return Ra(0xba9f7654ffff - 7 * b, 64424574975 - (15 ^ a >> 4 & 1) * b, 1986002943 - 11 * c, 1048575 - (15 ^ a >> 12 & 3) * c, ab) } function mb(a, b, c, e, n) {
        var w = b[scrMgr.fixCase(e, c)][0]; b = [[5, 10], [7, 19], [3, -1], [1, -1], null, null, null, null, [23, 12]][w & 15]; c = w >> 4 & 1; e = [[8, 20, 9], [6, -1, 18], [0, -1, -1], [2, 11, -1], [-1, 15, 26]][w >> 8 & 15]; w = w >> 12 & 3; a = a.split(""); for (var f = 0; 3 > f; f++)2 > f && 0 <= b[f] && (a[b[f]] = "BR".charAt(c ^ f)), 0 <= e[f] && (a[e[f]] = "URB".charAt((w +
            3 + f) % 3)); image.face3Image(a.join(""), n)
    } function cb() { return Ra(0xffff7654ffff, 0xffff0000ffff, 4294967295, 4294967295) } function lb(a, b, c) { a = Ib[scrMgr.fixCase(c, Mb)]; return Ra(0xba987654ffff, 0, a[0] + 1985216512, a[1], ab, ab) } function gb(a, c, e) { a = Ib[scrMgr.fixCase(e, Mb)]; c = b(4); e = []; for (var n = 0; n < ab.length; n++)e.push(ab[n].concat(qb[c])); return Ra(0xba98f6f4ffff, 4042326015, a[0] + 1985216512, a[1], e, ab) + nb[c] } function Ya(a, b, c) { a = Ib[b][2].replace(/e/g, a || "U"); image.llImage.drawImage(a, null, c) } function fb() {
        return Ra(0xba9876543f1f,
            0, 1985282047, 65535, ab)
    } function Xa(a, b, c) { a = xb[scrMgr.fixCase(c, Hb)]; return Ra(0xba9876540000 + a[1], 0, 1984954368 + a[0], 0, ab, ab) } function w() { var a = b(4); return Ra(0xba98f6f4ffff, 4042326015, 1985229328, 0, [qb[a]], ab) + nb[a] } function n(a, b, c) { a = Ib[scrMgr.fixCase(c, Mb)]; return Ra(0xba987654ffff, 65535, a[0] + 1985216512, a[1], ab, ab) } function Sa() { return Ra(0xba987654ffff, 65535, 1985229328, 0) } function Za(a, b) {
        var c = Pb[a].slice(1); 2 == c.length && (c = c.concat([[c[0][1], c[0][0]], [c[1][1], c[1][0]]])); c = ["DDDDDDDDD" + Pb[a][0],
            c]; if (!b) return c.concat([Rb[a]]); image.llImage.drawImage(c[0], c[1], b)
    } function hb(a, b) { for (var c = "", e = ac[a], n = 0; 21 > n; n++)4 == n ? c += "D" : (c += e & 1 ? "D" : "G", e >>= 1); if (!b) return [c, null, Nb[a]]; image.llImage.drawImage(c, null, b) } bb.prototype = f.prototype; for (var ob = [], jb = [[8, 9, 20], [6, 18, 38], [0, 36, 47], [2, 45, 11], [29, 26, 15], [27, 44, 24], [33, 53, 42], [35, 17, 51]], eb = [[5, 10], [7, 19], [3, 37], [1, 46], [32, 16], [28, 25], [30, 43], [34, 52], [23, 12], [21, 41], [50, 39], [48, 14]], kb = new min2phase.Search, ab = [[], [0], [1], [2]], qb = [[], [3, 14], [4,
        13], [5, 12]], nb = ["", "x'", "x2", "x"], rb = [[]], ub = [[8192, 4, "Easy-01"], [4113, 4, "Easy-02"], [8210, 4, "Easy-03"], [4099, 4, "Easy-04"], [8195, 4, "RE-05"], [4114, 4, "RE-06"], [8194, 4, "RE-07"], [4115, 4, "RE-08"], [8211, 4, "REFC-09"], [4098, 4, "REFC-10"], [8208, 4, "REFC-11"], [4097, 4, "REFC-12"], [8209, 4, "REFC-13"], [4096, 4, "REFC-14"], [8193, 4, "SPGO-15"], [4112, 4, "SPGO-16"], [0, 4, "SPGO-17"], [17, 4, "SPGO-18"], [3, 4, "PMS-19"], [18, 4, "PMS-20"], [2, 4, "PMS-21"], [19, 4, "PMS-22"], [1, 4, "Weird-23"], [16, 4, "Weird-24"], [1024, 4, "CPEU-25"], [1041, 4, "CPEU-26"],
        [5120, 4, "CPEU-27"], [9233, 4, "CPEU-28"], [5137, 4, "CPEU-29"], [9216, 4, "CPEU-30"], [24, 4, "EPCU-31"], [8, 4, "EPCU-32"], [8200, 4, "EPCU-33"], [4104, 4, "EPCU-34"], [8216, 4, "EPCU-35"], [4120, 4, "EPCU-36"], [1048, 1, "ECP-37"], [5128, 1, "ECP-38"], [9224, 1, "ECP-39"], [5144, 1, "ECP-40"], [9240, 1, "ECP-41"], [1032, 1, "Solved-42"]], vb = mathlib.idxArray(ub, 1), wb = mathlib.idxArray(ub, 2), zb = [], yb = [], Fb = [], pb = 0; pb < ub.length; pb++)ub[pb][0] & 240 || (zb.push(ub[pb]), yb.push(vb[pb]), Fb.push(wb[pb])); var Eb = [], Cb = []; for (pb = 0; 27 > pb; pb++)Eb[pb] = ~~(pb /
            9) << 12 | ~~(pb / 3) % 3 << 8 | pb % 3, Cb[pb] = 1; var Bb = [], Kb = [], Ab = []; for (pb = 0; 216 > pb; pb++) { var tb = pb % 27, sb = ~~(pb / 27); Bb[pb] = [~~(tb / 9) % 3 << 12 | ~~(tb / 3) % 3 << 8 | tb % 3, (sb >> 2 & 1) << 12 | (sb >> 1 & 1) << 8 | sb & 1]; Kb[pb] = 1; Ab[pb] = "WVLS;UB;UF;UF UB;UL;UB UL;UF UL;No Edge".split(";")[sb] + "-" + (tb + 1) } var Ib = [[12816, 8481, "FeFeeeBeBLGRDGDRGLDGD", 2, "H-1"], [8961, 4626, "ReLeeeReLBGBDGDFGFDGD", 2, "H-2"], [4611, 4626, "ReBeeeLeBFGRDGDLGFDGD", 4, "H-3"], [8211, 4626, "LeReeeFeFRGLDGDBGBDGD", 4, "H-4"], [12321, 4128, "DeLeeeReDBGRFGBDGFLGD", 4, "L-1"], [4611, 513,
                "DeReeeLeDFDBRDFDGLBGD", 4, "L-2"], [8961, 258, "DeBeeeLeDFGRFGRDGLBGD", 4, "L-3"], [12816, 4128, "DeLeeeFeDRGFLGBDGBRGD", 4, "L-4"], [12546, 4128, "DeLeeeLeDFGBRGBDGRFGD", 4, "L-5"], [8211, 513, "DeReeeReDBGLBGFDGFLGD", 4, "L-6"], [12816, 4386, "LeFeeeReFBGDRGLDGBDGD", 4, "Pi-1"], [8961, 8466, "FeLeeeFeRRGDBGBDGLDGD", 4, "Pi-2"], [4611, 4641, "ReLeeeReLBGDFGBDGFDGD", 4, "Pi-3"], [12546, 4386, "BeFeeeFeBRGDLGLDGRDGD", 4, "Pi-4"], [8211, 4641, "BeLeeeLeFFGDRGBDGRDGD", 4, "Pi-5"], [12321, 4386, "BeReeeLeBFGDLGFDGRDGD", 4, "Pi-6"], [12816, 8736, "ReBeeeFeDRGFLGDLGDBGD",
                4, "S-1"], [8961, 546, "BeReeeLeDFGRFGDBGDLGD", 4, "S-2"], [12321, 8736, "BeReeeFeDRGFLGDBGDLGD", 4, "S-3"], [8211, 8706, "ReBeeeLeDFGRFGDLGDBGD", 4, "S-4"], [12546, 8736, "FeBeeeLeDFGBRGDLGDRGD", 4, "S-5"], [4611, 8706, "LeReeeFeDRGLBGDBGDFGD", 4, "S-6"], [4611, 4098, "BeLeeeDeDBGRFGDFGRDGL", 4, "T-1"], [12546, 8448, "ReBeeeDeDLGBRGDLGFDGF", 4, "T-2"], [8961, 528, "BeFeeeDeDBGFLGDRGRDGL", 4, "T-3"], [12816, 8448, "FeFeeeDeDBGBRGDRGLDGL", 4, "T-4"], [8211, 4098, "BeBeeeDeDLGRFGDLGRDGF", 4, "T-5"], [12321, 8448, "FeBeeeDeDRGRFGDLGLDGB", 4, "T-6"], [8961,
                288, "LeLeeeDeDFGBRGBDGDFGR", 4, "U-1"], [12816, 4608, "LeReeeDeDBGBRGFDGDFGL", 4, "U-2"], [12321, 4608, "FeFeeeDeDBGBRGLDGDRGL", 4, "U-3"], [8211, 8193, "BeFeeeDeDFGBRGLDGDLGR", 4, "U-4"], [4611, 8193, "ReFeeeDeDBGRFGLDGDBGL", 4, "U-5"], [12546, 4608, "LeBeeeDeDBGRFGRDGDFGL", 4, "U-6"], [12816, 4353, "LeFeeeDeRRGFDGLDGBDGB", 4, "aS-1"], [8961, 4368, "ReFeeeDeLRGBDGLDGFDGB", 4, "aS-2"], [12321, 4353, "LeBeeeDeFFGLDGRDGBDGR", 4, "aS-3"], [8211, 4113, "LeFeeeDeBFGRDGLDGBDGR", 4, "aS-4"], [4611, 4113, "FeBeeeDeLFGBDGRDGLDGR", 4, "aS-5"], [12546, 4353, "FeBeeeDeRBGFDGRDGLDGL",
                4, "aS-6"], [12321, 0, "DeDeeeDeDBGRFGBRGFLGL", 4, "O-Adj"], [8961, 0, "DeDeeeDeDBGFLGRFGBRGL", 1, "O-Diag"], [12816, 0, "DeDeeeDeDBGBRGRFGFLGL", 1, "O-AUF"]], Mb = mathlib.idxArray(Ib, 3); tb = mathlib.idxArray(Ib, 4); var xb = [[205840, 12816, "FBar-1"], [205840, 12546, "FBar-2"], [205840, 12321, "FBar-3"], [205840, 8961, "FBar-4"], [205840, 8496, "FBar-5"], [205840, 8211, "FBar-6"], [205840, 4896, "FBar-7"], [205840, 4611, "FBar-8"], [205840, 4146, "FBar-9"], [205840, 786, "FBar-10"], [205840, 561, "FBar-11"], [205840, 291, "FBar-12"], [205825, 12801, "2Opp-1"],
                [205825, 12576, "2Opp-2"], [205825, 12306, "2Opp-3"], [205825, 8976, "2Opp-4"], [205825, 8451, "2Opp-5"], [205825, 8241, "2Opp-6"], [205825, 4866, "2Opp-7"], [205825, 4656, "2Opp-8"], [205825, 4131, "2Opp-9"], [205825, 801, "2Opp-10"], [205825, 531, "2Opp-11"], [205825, 306, "2Opp-12"], [201760, 12801, "ROpp-1"], [201760, 12576, "ROpp-2"], [201760, 12306, "ROpp-3"], [201760, 8976, "ROpp-4"], [201760, 8451, "ROpp-5"], [201760, 8241, "ROpp-6"], [201760, 4866, "ROpp-7"], [201760, 4656, "ROpp-8"], [201760, 4131, "ROpp-9"], [201760, 801, "ROpp-10"], [201760, 531, "ROpp-11"],
                [201760, 306, "ROpp-12"], [201730, 12816, "RBar-1"], [201730, 12546, "RBar-2"], [201730, 12321, "RBar-3"], [201730, 8961, "RBar-4"], [201730, 8496, "RBar-5"], [201730, 8211, "RBar-6"], [201730, 4896, "RBar-7"], [201730, 4611, "RBar-8"], [201730, 4146, "RBar-9"], [201730, 786, "RBar-10"], [201730, 561, "RBar-11"], [201730, 291, "RBar-12"], [197665, 12816, "2Bar-1"], [197665, 12546, "2Bar-2"], [197665, 12321, "2Bar-3"], [197665, 8961, "2Bar-4"], [197665, 8496, "2Bar-5"], [197665, 8211, "2Bar-6"], [197665, 4896, "2Bar-7"], [197665, 4611, "2Bar-8"], [197665, 4146,
                    "2Bar-9"], [197665, 786, "2Bar-10"], [197665, 561, "2Bar-11"], [197665, 291, "2Bar-12"], [197650, 12801, "FOpp-1"], [197650, 12576, "FOpp-2"], [197650, 12306, "FOpp-3"], [197650, 8976, "FOpp-4"], [197650, 8451, "FOpp-5"], [197650, 8241, "FOpp-6"], [197650, 4866, "FOpp-7"], [197650, 4656, "FOpp-8"], [197650, 4131, "FOpp-9"], [197650, 801, "FOpp-10"], [197650, 531, "FOpp-11"], [197650, 306, "FOpp-12"]], Hb = [], Gb = []; for (pb = 0; pb < xb.length; pb++)Hb[pb] = 1, Gb[pb] = xb[pb][2]; var Jb = [[4146, 12816], [12546, 12816], [12321, 12816], [8961, 12816], [12816, 12321], [12816,
                        12546], [12816, 8961], [12306, 12801], [8496, 12321], [4896, 12546], [12321, 12546], [12546, 12321], [12801, 12801], [12576, 12801], [4656, 12306], [12306, 12306], [531, 12801], [8976, 12801], [4656, 12801], [12576, 12306], [12801, 12306]], Ob = [1, 4, 4, 2, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 1, 1, 4, 4, 4, 4, 4], Rb = "H Ua Ub Z Aa Ab E F Ga Gb Gc Gd Ja Jb Na Nb Ra Rb T V Y".split(" "), Pb = [["BFBRLRFBFLRL", [1, 7], [3, 5]], ["BRBRLRFFFLBL", [3, 7], [7, 5], [5, 3]], ["BLBRBRFFFLRL", [3, 5], [5, 7], [7, 3]], ["LFLBRBRBRFLF", [1, 5], [3, 7]], ["LBBRRLBFRFLF", [0, 2], [2, 6], [6, 0]], ["RBFLRRFFLBLB",
                            [0, 6], [6, 8], [8, 0]], ["LBRFRBRFLBLF", [0, 6], [2, 8]], ["BFRFRBRBFLLL", [1, 7], [2, 8]], ["BRRFLBRBFLFL"], ["BFRFBBRLFLRL"], ["BFRFLBRRFLBL"], ["BLRFFBRBFLRL"], ["BBRFFBRRFLLL", [1, 5], [2, 8]], ["LBBRLLBRRFFF", [2, 8], [5, 7]], ["FBBRLLBFFLRR", [2, 6], [3, 5]], ["BBFLLRFFBRRL", [0, 8], [3, 5]], ["LLBRBLBFRFRF", [1, 3], [2, 8]], ["RBFLFRFLLBRB", [2, 8], [3, 7]], ["BBRFLBRFFLRL", [2, 8], [3, 5]], ["BBFLFRFRBRLL", [0, 8], [1, 5]], ["BBFLRRFLBRFL", [0, 8], [1, 3]]], Lb = [[0, 0], [4369, 4626], [4369, 4386], [4369, 546], [4369, 273], [17, 8226], [17, 4113], [17, 8706], [17, 273],
                            [17, 4368], [17, 8736], [17, 546], [17, 4353], [257, 8226], [257, 273], [257, 546], [257, 4113], [4369, 258], [4369, 18], [4369, 33], [4369, 0], [0, 4626], [0, 4386], [0, 18], [0, 33], [0, 258], [0, 273], [0, 546], [17, 0], [17, 528], [17, 8448], [17, 33], [17, 4098], [257, 33], [257, 528], [17, 4128], [17, 258], [17, 8208], [17, 513], [257, 4128], [257, 258], [17, 4608], [17, 288], [17, 18], [17, 8193], [257, 18], [257, 288], [17, 4641], [17, 4386], [17, 8466], [17, 8721], [257, 4641], [257, 4386], [17, 8481], [17, 4626], [257, 8481], [257, 4626], [257, 0]], Tb = [1, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
                                4, 4, 4, 4, 4, 1, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 2, 2], Nb = "PLL Point-1 Point-2 Point-3 Point-4 Square-5 Square-6 SLBS-7 SLBS-8 Fish-9 Fish-10 SLBS-11 SLBS-12 Knight-13 Knight-14 Knight-15 Knight-16 Point-17 Point-18 Point-19 CO-20 OCLL-21 OCLL-22 OCLL-23 OCLL-24 OCLL-25 OCLL-26 OCLL-27 CO-28 Awkward-29 Awkward-30 P-31 P-32 T-33 C-34 Fish-35 W-36 Fish-37 W-38 BLBS-39 BLBS-40 Awkward-41 Awkward-42 P-43 P-44 T-45 C-46 L-47 L-48 L-49 L-50 I-51 I-52 L-53 L-54 I-55 I-56 CO-57".split(" "),
                        ac = [255, 965120, 907776, 374304, 447360, 538123, 396054, 79402, 410514, 152458, 627788, 595470, 281363, 108088, 181144, 566809, 166684, 308097, 300805, 825861, 299685, 83290, 672858, 82170, 66014, 132222, 133470, 74874, 4783, 70542, 144042, 328598, 22059, 99228, 172728, 303569, 803475, 13195, 72238, 100924, 574105, 86698, 38221, 918166, 14891, 688796, 276579, 338706, 677386, 935442, 967760, 109336, 342338, 345874, 87818, 116504, 698904, 33469], Vb = [[], [9], [10], [11]], Sb = ["", "y", "y2", "y'"]; sb = "UR UF UL UB DR DF DL DB RF LF LB RB URF UFL ULB UBR DFR DLF DBL DRB".split(" ");
    for (pb = 0; 20 > pb; pb++) { var Wb = sb[pb]; sb[pb + 20] = (2 == Wb.length ? "OriE-" : "OriC-") + Wb; sb[pb] = (2 == Wb.length ? "PermE-" : "PermC-") + Wb } pb = mathlib.valuedArray(40, 0); scrMgr.reg("333", Qa)("333fm", function () { return "R' U' F " + Ra(0xffffffffffff, 0xffffffffffff, 4294967295, 4294967295, void 0, void 0, 2, 1) + "R' U' F" })("edges", $a)("corners", Va)("333custom", function (a, b, c) {
        var e = b = a = 0, n = 0, w = 4352; c = c || mathlib.valuedArray(40, 1); for (var f = 0; 12 > f; f++)w += (c[f] ? 69632 : 0) + (c[f + 20] ? 16 : 0), a += (c[f] ? 15 : f) * Math.pow(16, f), b += (c[f + 20] ? 15 :
            0) * Math.pow(16, f); for (f = 0; 8 > f; f++)w += (c[f + 12] ? 65792 : 0) + (c[f + 32] ? 1 : 0), e += (c[f + 12] ? 15 : f) * Math.pow(16, f), n += (c[f + 32] ? 15 : 0) * Math.pow(16, f); return 0 == (w & 1887470) ? "U' U " : Ra(a, b, e, n)
    }, [sb, pb])("ll", y)("lsll2", db, [wb, vb, mb.bind(null, "GGGGDGGGGGGGGRRGRRGGGBBGBBG", ub, vb)])("f2l", cb)("zbll", lb, [tb, Mb, Ya.bind(null, "D")])("zzll", fb)("zbls", db, [wb, vb, mb.bind(null, "GGGGDGGGGGGGGRRGRRGGGBBGBBG", ub, vb)])("ttll", Xa, [Gb, Hb, function (a, b) {
        for (var c = [], e = xb[a], n = 3; 0 <= n; n--)c.push(["FR", "LF", "BL", "RB", "GG"][e[0] >> 4 * n &
            15]), c.push("RFLB".charAt(e[1] >> 4 * n & 15)); c = c.join(""); c = c.slice(7) + c.slice(0, 7); c = ["GDDDDDDDD" + c, null]; if (!b) return c.concat([Gb[a]]); image.llImage.drawImage(c[0], c[1], b)
    }])("eols", function (a, b, c) { a = zb[scrMgr.fixCase(c, yb)]; b = Math.pow(16, a >> 8 & 15); return Ra(0xba9f7654ffff - 7 * Math.pow(16, a & 15), 0, 1986002943 - 11 * b, 1048575 - (15 ^ a >> 12 & 3) * b, ab) }, [Fb, yb, mb.bind(null, "GDGDDDGDGGGGGRRGRRGGGBBDBBG", zb, yb)])("wvls", function (a, b, c) { a = Eb[scrMgr.fixCase(c, Cb)]; return Ra(0xba9f7654ff8f, 0, 1986002767, 983072 | a) }, ["Oriented Rectangle-1 Rectangle-2 Tank-1 Bowtie-1 Bowtie-3 Tank-2 Bowtie-2 Bowtie-4 Snake-1 Adjacent-1 Adjacent-2 Gun-Far Sune-1 Pi-Near Gun-Back Pi-Front H-Side Snake-2 Adjacent-3 Adjacent-4 Gun-Sides H-Front Pi-Back Gun-Near Pi-Far Sune-2".split(" "),
        Cb, function (a, b) { var c = Eb[scrMgr.fixCase(a, Cb)], e = ["DGG", "GDG", "GGD"]; e = e[c & 3] + e[c >> 8 & 3] + e[c >> 12 & 3]; image.llImage.drawImage("3D6DDDBB0RR21G87G54GU".replace(/[0-9]/g, function (a) { return e[~~a] }), null, b) }])("vls", function (a, b, c) { a = Bb[scrMgr.fixCase(c, Kb)]; return Ra(0xba9f7654ff8f, 64424509440 + a[1], 1986002767, 983072 + a[0], [[2]]) }, [Ab, Kb, function (a, b) {
            var c = Bb[scrMgr.fixCase(a, Kb)], e = ["DGG", "GDG", "GGD"]; e = e[c[0] & 3] + e[c[0] >> 8 & 3] + e[c[0] >> 12 & 3]; var n = ["DG", "GD"]; n = n[c[1] & 3] + n[c[1] >> 8 & 3] + n[c[1] >> 12 & 3]; image.llImage.drawImage("6a0eDR3cR4dUFF21b87f5".replace(/[0-9]/g,
                function (a) { return e[~~a] }).replace(/[a-z]/g, function (a) { return n[a.charCodeAt(0) - 97] }), null, b)
        }])("lse", w)("cmll", gb, [tb, Mb, Ya.bind(null, "G")])("cll", n, [tb, Mb, Ya.bind(null, "G")])("coll", lb, [tb, Mb, Ya.bind(null, "D")])("ell", Sa)("pll", function (a, b, c) { a = Jb[scrMgr.fixCase(c, Ob)]; return Ra(a[0] + 0xba9876540000, 0, a[1] + 1985216512, 0, ab, ab) }, [Rb, Ob, Za])("oll", function (a, b, c) { a = Lb[scrMgr.fixCase(c, Tb)]; return Ra(0xba987654ffff, a[0], 1985282047, a[1], ab, ab) }, [Nb, Tb, hb])("2gll", function () {
            return Ra(0xba987654ffff,
                0, 1985229328, 65535, ab)
        })("sbrx", function (a, c, e) { a = b(4); return Ra(0xfa9ff6ffffff, 0xf00ff0ffffff, 4133486591, 4027580415, [qb[a]]) + nb[a] })("mt3qb", function () { var a = mathlib.rn(4); return Ra(0xffff765fffff, 0xffff000fffff, 4133486591, 4027580415, [Vb[a]]) + Sb[a] })("mteole", function () { var a = mathlib.rn(4), b = mathlib.rn(4); return Ra(0xba98765fffff + 4294967296 * (17767 & 15 << 4 * a), 1048575 + 4294967296 * (15 << 4 * a), 4133486591, 4027580415, [Vb[b]]) + Sb[b] })("mttdr", function () { return Ra(0xba98765fffff, 0, 4133486591, 4027580415) })("mt6cp",
            function () { return Ra(0xba98765fffff, 0, 4133486591, 0) })("mtl5ep", function () { return Ra(0xba98765fffff, 0, 1985229328, 0) })("mtcdrll", function () { return Ra(0xba98765fffff, 0, 1985282047, 65535) })("easyc", function (a, b) { var c = cross.getEasyCross(b); return Ra(c[0], c[1], 4294967295, 4294967295) })("easyxc", function (a, b) { var c = cross.getEasyXCross(b); return Ra(c[0], c[1], c[2], c[3]) })("eoline", function () { return Ra(0xffff7f5fffff, 0, 4294967295, 4294967295) }); return {
                getRandomScramble: Qa, getEdgeScramble: $a, getCornerScramble: Va,
                getLLScramble: y, getLSLLScramble: db, getZBLLScramble: lb, getZZLLScramble: fb, getTTLLScramble: Xa, getF2LScramble: cb, getLSEScramble: w, getCMLLScramble: gb, getCLLScramble: n, getELLScramble: Sa, getAnyScramble: Ra, getPLLImage: Za, getOLLImage: hb, genFacelet: function (a) { return kb.solution(a, 21, 1E9, 50, 2) }, solvFacelet: function (a) { return kb.solution(a, 21, 1E9, 50, 0) }
            }
}(mathlib.getNPerm, mathlib.setNPerm, mathlib.set8Perm, mathlib.getNParity, mathlib.rn, mathlib.rndEl); var scramble_444 = function (c, Oa, z) {
    function r(a, b) { var c; var e = Array(a); if (void 0 != b) for (c = 0; c < a; c++)e[c] = Array(b); return e } function b(a, b, c) { var e = lc[a]; e && !e.___clazz$ ? Db = e.prototype : (!e && (e = lc[a] = function () { }), Db = e.prototype = 0 > b ? {} : new lc[b], Db.castableTypeMap$ = c); for (var n = 3; n < arguments.length; ++n)arguments[n].prototype = Db; e.___clazz$ && (Db.___clazz$ = e.___clazz$, e.___clazz$ = null) } function e(a) { for (var b = {}, c = 0, e = a.length; c < e; ++c)b[a[c]] = 1; return b } function a() { } function Pa() { } function f(a, b) {
        var c =
            Array(b); if (3 == a) for (var e = 0; e < b; ++e) { var n = {}; n.l = n.m = n.h = 0; c[e] = n } else if (0 < a) for (n = [null, 0, !1][a], e = 0; e < b; ++e)c[e] = n; return c
    } function bb(a, b, c, e, n) { e = f(n, e); h(a, b, c, e); return e } function h(a, b, c, e) { Na(); var n = Dc, f = Ec; Na(); for (var w = 0, h = n.length; w < h; ++w)e[n[w]] = f[w]; e.___clazz$ = a; e.castableTypeMap$ = b; e.queryId$ = c; return e } function Na() { Na = a; Dc = []; Ec = []; var b = new Pa, c = Dc, e = Ec, n = 0, f, w; for (w in b) if (f = b[w]) c[n] = w, e[n] = f, ++n } function Qa() {
        Qa = a; vc = r(15582, 36); mc = r(15582); Yb = r(15582); fc = r(48, 48); Zb = r(48,
            36); gc = r(48); Fc = r(48)
    } function x(a, b) { var c; if (null != b && b.castableTypeMap$ && b.castableTypeMap$[21]) { for (c = 0; 24 > c; ++c)if (a.ct[c] != b.ct[c]) return !1; return !0 } return !1 } function Ta(a) { var b; var c = 0; var e = 8; for (b = 23; 0 <= b; --b)1 == a.ct[b] && (c += Oa[b][e--]); return c } function Ua(a) {
        var b; if (null != hc) return hc[Ta(a)]; for (b = 0; 48 > b; ++b) {
            var c = Ta(a); a: { var e; var n = 0; for (e = mc.length - 1; n <= e;) { var f = n + (~~(e - n) >> 1); var w = mc[f]; if (w < c) n = f + 1; else if (w > c) e = f - 1; else { c = f; break a } } c = -n - 1 } c = 0 <= c ? c : -1; if (-1 != c) return 64 * c + b;
            Ra(a, 0); 1 == b % 2 && Ra(a, 1); 7 == b % 8 && Ra(a, 2); 15 == b % 16 && Ra(a, 3)
        }
    } function Wa(a, b) {
        var c = b % 3; switch (~~(b / 3)) {
            case 0: ib(a.ct, 0, 1, 2, 3, c); break; case 1: ib(a.ct, 16, 17, 18, 19, c); break; case 2: ib(a.ct, 8, 9, 10, 11, c); break; case 3: ib(a.ct, 4, 5, 6, 7, c); break; case 4: ib(a.ct, 20, 21, 22, 23, c); break; case 5: ib(a.ct, 12, 13, 14, 15, c); break; case 6: ib(a.ct, 0, 1, 2, 3, c); ib(a.ct, 8, 20, 12, 16, c); ib(a.ct, 9, 21, 13, 17, c); break; case 7: ib(a.ct, 16, 17, 18, 19, c); ib(a.ct, 1, 15, 5, 9, c); ib(a.ct, 2, 12, 6, 10, c); break; case 8: ib(a.ct, 8, 9, 10, 11, c); ib(a.ct, 2, 19,
                4, 21, c); ib(a.ct, 3, 16, 5, 22, c); break; case 9: ib(a.ct, 4, 5, 6, 7, c); ib(a.ct, 10, 18, 14, 22, c); ib(a.ct, 11, 19, 15, 23, c); break; case 10: ib(a.ct, 20, 21, 22, 23, c); ib(a.ct, 0, 8, 4, 14, c); ib(a.ct, 3, 11, 7, 13, c); break; case 11: ib(a.ct, 12, 13, 14, 15, c), ib(a.ct, 1, 20, 7, 18, c), ib(a.ct, 0, 23, 6, 17, c)
        }
    } function Ra(a, b) {
        switch (b) {
            case 0: Wa(a, 19); Wa(a, 28); break; case 1: Wa(a, 21); Wa(a, 32); break; case 2: ib(a.ct, 0, 3, 1, 2, 1); ib(a.ct, 8, 11, 9, 10, 1); ib(a.ct, 4, 7, 5, 6, 1); ib(a.ct, 12, 15, 13, 14, 1); ib(a.ct, 16, 19, 21, 22, 1); ib(a.ct, 17, 18, 20, 23, 1); break; case 3: Wa(a,
                18), Wa(a, 29), Wa(a, 24), Wa(a, 35)
        }
    } function $a(a, b) { var c; for (c = 0; c < b; ++c)Ra(a, 0), 1 == c % 2 && Ra(a, 1), 7 == c % 8 && Ra(a, 2), 15 == c % 16 && Ra(a, 3) } function Va(a, b) { var c; var e = 8; for (c = 23; 0 <= c; --c)a.ct[c] = 0, b >= Oa[c][e] && (b -= Oa[c][e--], a.ct[c] = 1) } function y(a, b) { var c; for (c = 0; 24 > c; ++c)a.ct[c] = b.ct[c] } function db() { var a; this.ct = r(24); for (a = 0; 8 > a; ++a)this.ct[a] = 1; for (a = 8; 24 > a; ++a)this.ct[a] = 0 } function mb(a, b) { var c; this.ct = r(24); for (c = 0; 24 > c; ++c)this.ct[c] = ~~(a.ct[c] / 2) == b ? 1 : 0 } function cb(a) {
        var b; this.ct = r(24); for (b =
            0; 24 > b; ++b)this.ct[b] = a[b]
    } function lb() { lb = a; wc = r(70, 28); xc = r(6435, 28); ed = r(70, 16); fd = r(6435, 16); Ub = r(450450); gd = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0] } function gb(a) { var b; var c = 0; var e = 8; for (b = 14; 0 <= b; --b)a.ct[b] != a.ct[15] && (c += Oa[b][e--]); return c } function Ya(a) { var b; var c = 0; var e = 4; for (b = 6; 0 <= b; --b)a.rl[b] != a.rl[7] && (c += Oa[b][e--]); return 2 * c + a.parity } function fb(a, b) {
        a.parity ^= gd[b]; var c = b % 3; switch (~~(b / 3)) {
            case 0: ib(a.ct, 0, 1, 2, 3, c); break; case 1: ib(a.rl,
                0, 1, 2, 3, c); break; case 2: ib(a.ct, 8, 9, 10, 11, c); break; case 3: ib(a.ct, 4, 5, 6, 7, c); break; case 4: ib(a.rl, 4, 5, 6, 7, c); break; case 5: ib(a.ct, 12, 13, 14, 15, c); break; case 6: ib(a.ct, 0, 1, 2, 3, c); ib(a.rl, 0, 5, 4, 1, c); ib(a.ct, 8, 9, 12, 13, c); break; case 7: ib(a.rl, 0, 1, 2, 3, c); ib(a.ct, 1, 15, 5, 9, c); ib(a.ct, 2, 12, 6, 10, c); break; case 8: ib(a.ct, 8, 9, 10, 11, c); ib(a.rl, 0, 3, 6, 5, c); ib(a.ct, 3, 2, 5, 4, c); break; case 9: ib(a.ct, 4, 5, 6, 7, c); ib(a.rl, 3, 2, 7, 6, c); ib(a.ct, 11, 10, 15, 14, c); break; case 10: ib(a.rl, 4, 5, 6, 7, c); ib(a.ct, 0, 8, 4, 14, c); ib(a.ct, 3, 11,
                    7, 13, c); break; case 11: ib(a.ct, 12, 13, 14, 15, c), ib(a.rl, 1, 4, 7, 2, c), ib(a.ct, 1, 0, 7, 6, c)
        }
    } function Xa(a, b) { switch (b) { case 0: fb(a, 19); fb(a, 28); break; case 1: fb(a, 21); fb(a, 32); break; case 2: ib(a.ct, 0, 3, 1, 2, 1), ib(a.ct, 8, 11, 9, 10, 1), ib(a.ct, 4, 7, 5, 6, 1), ib(a.ct, 12, 15, 13, 14, 1), ib(a.rl, 0, 3, 5, 6, 1), ib(a.rl, 1, 2, 4, 7, 1) } } function w(a, b, c) { var e; for (e = 0; 16 > e; ++e)a.ct[e] = ~~(b.ct[e] / 2); for (e = 0; 8 > e; ++e)a.rl[e] = b.ct[e + 16]; a.parity = c } function n(a, b) {
        var c; var e = 8; a.ct[15] = 0; for (c = 14; 0 <= c; --c)b >= Oa[c][e] ? (b -= Oa[c][e--], a.ct[c] =
            1) : a.ct[c] = 0
    } function Sa(a, b) { var c; a.parity = b & 1; b >>>= 1; var e = 4; a.rl[7] = 0; for (c = 6; 0 <= c; --c)b >= Oa[c][e] ? (b -= Oa[c][e--], a.rl[c] = 1) : a.rl[c] = 0 } function Za() { this.rl = r(8); this.ct = r(16) } function hb() { hb = a; nc = r(29400, 20); hd = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1]; bc = r(29400); Gc = [0, 9, 14, 23, 27, 28, 41, 42, 46, 55, 60, 69]; Hc = r(70) } function ob(a) {
        var b; var c = 0; var e = 4; for (b = 6; 0 <= b; --b)a.ud[b] != a.ud[7] && (c += Oa[b][e--]); c *= 35; e = 4; for (b = 6; 0 <= b; --b)a.fb[b] != a.fb[7] && (c += Oa[b][e--]); var n = a.fb[7] ^ a.ud[7]; var f = 0; e = 4;
        for (b = 7; 0 <= b; --b)a.rl[b] != n && (f += Oa[b][e--]); return a.parity + 2 * (12 * c + Hc[f])
    } function jb(a, b, c) { var e; var n = b.ct[0] > b.ct[8] ^ b.ct[8] > b.ct[16] ^ b.ct[0] > b.ct[16] ? 1 : 0; for (e = 0; 8 > e; ++e)a.ud[e] = b.ct[e] & 1 ^ 1, a.fb[e] = b.ct[e + 8] & 1 ^ 1, a.rl[e] = b.ct[e + 16] & 1 ^ 1 ^ n; a.parity = n ^ c } function eb() { this.ud = r(8); this.rl = r(8); this.fb = r(8) } function kb() { kb = a } function ab() { var a; this.ct = r(24); for (a = 0; 24 > a; ++a)this.ct[a] = ~~(a / 4) } function qb(a) {
        ab.call(this); for (a = 0; 23 > a; ++a) {
            var b = a + c(24 - a); if (this.ct[b] != this.ct[a]) {
                var e = this.ct[a];
                this.ct[a] = this.ct[b]; this.ct[b] = e
            }
        }
    } function nb() { nb = a; Xb = r(18); var b, c; Xb[0] = new zb(15120, 0); Xb[3] = new zb(21021, 1494); Xb[6] = new zb(8064, 1236); Xb[9] = new zb(9, 0); Xb[12] = new zb(1230, 412); Xb[15] = new zb(224, 137); for (b = 0; 18 > b; b += 3)for (c = 0; 2 > c; ++c)Xb[b + c + 1] = new wb, vb(Xb[b + c], Xb[b], Xb[b + c + 1]) } function rb(a) { a.cp = [0, 1, 2, 3, 4, 5, 6, 7]; a.co = [0, 0, 0, 0, 0, 0, 0, 0] } function ub(a, b) { var c; for (c = 0; 8 > c; ++c)a.cp[c] = b.cp[c], a.co[c] = b.co[c] } function vb(a, b, c) {
        var e; for (e = 0; 8 > e; ++e) {
            c.cp[e] = a.cp[b.cp[e]]; var n = a.co[b.cp[e]];
            var f = b.co[e]; var w = n; w += 3 > n ? f : 6 - f; w %= 3; 3 <= n ^ 3 <= f && (w += 3); c.co[e] = w
        }
    } function wb() { rb(this) } function zb(a, b) { rb(this); mathlib.set8Perm(this.cp, a); var c = b, e; var n = 0; for (e = 6; 0 <= e; --e)n += this.co[e] = c % 3, c = ~~(c / 3); this.co[7] = (15 - n) % 3 } function yb(a) { zb.call(this, c(40320), c(2187)) } function Fb() { Fb = a; $b = r(1937880); yc = r(1538); zc = r(1538); ic = r(11880); id = [0, 1, 6, 3, 4, 5, 2, 7]; Ic = r(160, 12); Jc = r(160, 12); Kc = [1, 1, 1, 3, 12, 60, 360, 2520, 20160, 181440, 1814400, 19958400, 239500800]; Lc = [0, 2, 4, 6, 1, 3, 7, 5, 8, 9, 10, 11] } function pb(a,
        b, c, e, n) { var f = a.edgeo[n]; a.edgeo[n] = a.edge[e]; a.edge[e] = a.edgeo[c]; a.edgeo[c] = a.edge[b]; a.edge[b] = f } function Eb(a, b) { var c; a.isStd || Mb(a); var e = 0; var n = 1985229328; var f = 47768; for (c = 0; c < b; ++c) { var w = a.edge[c] << 2; e *= 12 - c; 32 <= w ? (e += f >> w - 32 & 15, f -= 4368 << w - 32) : (e += n >> w & 15, f -= 4369, n -= 286331152 << w) } return e } function Cb(a) { var b = Eb(a, 4); b = ic[b]; var c = b & 7; b >>= 3; Ab(a, c); a = Eb(a, 10) % 20160; return 20160 * b + a } function Bb(a, b) {
            a.isStd = !1; switch (b) {
                case 0: z(a.edge, 0, 4, 1, 5); z(a.edgeo, 0, 4, 1, 5); break; case 1: xb(a.edge,
                    0, 4, 1, 5); xb(a.edgeo, 0, 4, 1, 5); break; case 2: z(a.edge, 0, 5, 1, 4); z(a.edgeo, 0, 5, 1, 4); break; case 3: xb(a.edge, 5, 10, 6, 11); xb(a.edgeo, 5, 10, 6, 11); break; case 4: z(a.edge, 0, 11, 3, 8); z(a.edgeo, 0, 11, 3, 8); break; case 5: xb(a.edge, 0, 11, 3, 8); xb(a.edgeo, 0, 11, 3, 8); break; case 6: z(a.edge, 0, 8, 3, 11); z(a.edgeo, 0, 8, 3, 11); break; case 7: z(a.edge, 2, 7, 3, 6); z(a.edgeo, 2, 7, 3, 6); break; case 8: xb(a.edge, 2, 7, 3, 6); xb(a.edgeo, 2, 7, 3, 6); break; case 9: z(a.edge, 2, 6, 3, 7); z(a.edgeo, 2, 6, 3, 7); break; case 10: xb(a.edge, 4, 8, 7, 9); xb(a.edgeo, 4, 8, 7, 9); break;
                case 11: z(a.edge, 1, 9, 2, 10); z(a.edgeo, 1, 9, 2, 10); break; case 12: xb(a.edge, 1, 9, 2, 10); xb(a.edgeo, 1, 9, 2, 10); break; case 13: z(a.edge, 1, 10, 2, 9); z(a.edgeo, 1, 10, 2, 9); break; case 14: xb(a.edge, 0, 4, 1, 5); xb(a.edgeo, 0, 4, 1, 5); z(a.edge, 9, 11); z(a.edgeo, 8, 10); break; case 15: xb(a.edge, 5, 10, 6, 11); xb(a.edgeo, 5, 10, 6, 11); z(a.edge, 1, 3); z(a.edgeo, 0, 2); break; case 16: xb(a.edge, 0, 11, 3, 8); xb(a.edgeo, 0, 11, 3, 8); z(a.edge, 5, 7); z(a.edgeo, 4, 6); break; case 17: xb(a.edge, 2, 7, 3, 6); xb(a.edgeo, 2, 7, 3, 6); z(a.edge, 8, 10); z(a.edgeo, 9, 11); break; case 18: xb(a.edge,
                    4, 8, 7, 9); xb(a.edgeo, 4, 8, 7, 9); z(a.edge, 0, 2); z(a.edgeo, 1, 3); break; case 19: xb(a.edge, 1, 9, 2, 10), xb(a.edgeo, 1, 9, 2, 10), z(a.edge, 4, 6), z(a.edgeo, 5, 7)
            }
        } function Kb(a, b) { a.isStd = !1; switch (b) { case 0: Bb(a, 14); Bb(a, 17); break; case 1: pb(a, 11, 5, 10, 6); pb(a, 5, 10, 6, 11); pb(a, 1, 2, 3, 0); pb(a, 4, 9, 7, 8); pb(a, 8, 4, 9, 7); pb(a, 0, 1, 2, 3); break; case 2: Hb(a, 4, 5), Hb(a, 5, 4), Hb(a, 11, 8), Hb(a, 8, 11), Hb(a, 7, 6), Hb(a, 6, 7), Hb(a, 9, 10), Hb(a, 10, 9), Hb(a, 1, 1), Hb(a, 0, 0), Hb(a, 3, 3), Hb(a, 2, 2) } } function Ab(a, b) {
            for (; 2 <= b;)b -= 2, Kb(a, 1), Kb(a, 2); 0 != b && Kb(a,
                0)
        } function tb(a, b) { var c, e; var n = 1985229328; var f = 47768; for (c = e = 0; 11 > c; ++c) { var w = Kc[11 - c]; var h = ~~(b / w); b %= w; e ^= h; h <<= 2; 32 <= h ? (h -= 32, a.edge[c] = f >> h & 15, w = (1 << h) - 1, f = (f & w) + (f >> 4 & ~w)) : (a.edge[c] = n >> h & 15, w = (1 << h) - 1, n = (n & w) + (n >>> 4 & ~w) + (f << 28), f >>= 4) } 0 == (e & 1) ? a.edge[11] = n : (a.edge[11] = a.edge[10], a.edge[10] = n); for (c = 0; 12 > c; ++c)a.edgeo[c] = c; a.isStd = !0 } function sb(a, b) { var c; for (c = 0; 12 > c; ++c)a.edge[c] = b.edge[c], a.edgeo[c] = b.edgeo[c]; a.isStd = b.isStd } function Ib(a, b) {
            var c; null == a.temp && (a.temp = r(12)); for (c =
                0; 12 > c; ++c)a.temp[c] = c, a.edge[c] = b.ep[Lc[c] + 12] % 12; var e = 1; for (c = 0; 12 > c; ++c)for (; a.edge[c] != c;) { var n = a.edge[c]; a.edge[c] = a.edge[n]; a.edge[n] = n; var f = a.temp[c]; a.temp[c] = a.temp[n]; a.temp[n] = f; e ^= 1 } for (c = 0; 12 > c; ++c)a.edge[c] = a.temp[b.ep[Lc[c]] % 12]; return e
        } function Mb(a) { var b; null == a.temp && (a.temp = r(12)); for (b = 0; 12 > b; ++b)a.temp[a.edgeo[b]] = b; for (b = 0; 12 > b; ++b)a.edge[b] = a.temp[a.edge[b]], a.edgeo[b] = b; a.isStd = !0 } function xb(a, b, c, e, n) { var f = a[b]; a[b] = a[e]; a[e] = f; f = a[c]; a[c] = a[n]; a[n] = f } function Hb(a,
            b, c) { var e = a.edge[b]; a.edge[b] = a.edgeo[c]; a.edgeo[c] = e } function Gb() { this.edge = r(12); this.edgeo = r(12) } function Jb(a, b) { return a[b >> 4] >> ((b & 15) << 1) & 3 } function Ob(a, b, c) { var e = Jc[b]; var n = Ic[b]; var f = 0; var w = 1985229328; var h = 47768; for (b = 0; b < c; ++b) { var y = e[a[n[b]]] << 2; f *= 12 - b; 32 <= y ? (f += h >> y - 32 & 15, h -= 4368 << y - 32) : (f += w >> y & 15, h -= 4369, w -= 286331152 << y) } return f } function Rb(a) {
                var b = new Gb; var c = 0; var e = Jb($b, a); if (3 == e) return 10; for (; 0 != a;) {
                    0 == e ? e = 2 : --e; var n = ~~(a / 20160); n = yc[n]; var f = a % 20160; tb(b, 20160 *
                        n + f); for (n = 0; 17 > n; ++n) { f = Ob(b.edge, n << 3, 4); f = ic[f]; var w = f & 7; f >>= 3; w = Ob(b.edge, n << 3 | w, 10) % 20160; f = 20160 * f + w; if (Jb($b, f) == e) { ++c; a = f; break } }
                } return c
            } function Pb(a, b, c) { a[b >> 4] ^= (3 ^ c) << ((b & 15) << 1) } function Lb() { Lb = a } function Tb() { var a; this.ep = r(24); for (a = 0; 24 > a; ++a)this.ep[a] = a } function Nb(a) { Tb.call(this); for (a = 0; 23 > a; ++a) { var b = a + c(24 - a); if (b != a) { var e = this.ep[a]; this.ep[a] = this.ep[b]; this.ep[b] = e } } } function ac() { ac = a; Mc = [35, 1, 34, 2, 4, 6, 22, 5, 19] } function Vb(a, b) {
                var c = a.edge; var e = b.edge, n; for (n =
                    0; 24 > n; ++n)c.ep[n] = e.ep[n]; c = a.center; e = b.center; for (n = 0; 24 > n; ++n)c.ct[n] = e.ct[n]; ub(a.corner, b.corner); a.value = b.value; a.add1 = b.add1; a.length1 = b.length1; a.length2 = b.length2; a.length3 = b.length3; a.sym = b.sym; for (c = 0; 60 > c; ++c)a.moveBuffer[c] = b.moveBuffer[c]; a.moveLength = b.moveLength; a.edgeAvail = b.edgeAvail; a.centerAvail = b.centerAvail; a.cornerAvail = b.cornerAvail
            } function Sb(a) {
                for (; a.centerAvail < a.moveLength;) {
                    var b = a.center, c = a.moveBuffer[a.centerAvail++]; var e = c % 3; switch (~~(c / 3)) {
                        case 0: ib(b.ct, 0, 1,
                            2, 3, e); break; case 1: ib(b.ct, 16, 17, 18, 19, e); break; case 2: ib(b.ct, 8, 9, 10, 11, e); break; case 3: ib(b.ct, 4, 5, 6, 7, e); break; case 4: ib(b.ct, 20, 21, 22, 23, e); break; case 5: ib(b.ct, 12, 13, 14, 15, e); break; case 6: ib(b.ct, 0, 1, 2, 3, e); ib(b.ct, 8, 20, 12, 16, e); ib(b.ct, 9, 21, 13, 17, e); break; case 7: ib(b.ct, 16, 17, 18, 19, e); ib(b.ct, 1, 15, 5, 9, e); ib(b.ct, 2, 12, 6, 10, e); break; case 8: ib(b.ct, 8, 9, 10, 11, e); ib(b.ct, 2, 19, 4, 21, e); ib(b.ct, 3, 16, 5, 22, e); break; case 9: ib(b.ct, 4, 5, 6, 7, e); ib(b.ct, 10, 18, 14, 22, e); ib(b.ct, 11, 19, 15, 23, e); break; case 10: ib(b.ct,
                                20, 21, 22, 23, e); ib(b.ct, 0, 8, 4, 14, e); ib(b.ct, 3, 11, 7, 13, e); break; case 11: ib(b.ct, 12, 13, 14, 15, e), ib(b.ct, 1, 20, 7, 18, e), ib(b.ct, 0, 23, 6, 17, e)
                    }
                } return a.center
            } function Wb(a) { for (; a.cornerAvail < a.moveLength;) { var b = a.corner, c = a.moveBuffer[a.cornerAvail++] % 18; !b.temps && (b.temps = new wb); vb(b, Xb[c], b.temps); ub(b, b.temps) } return a.corner } function Qb(a) {
                for (; a.edgeAvail < a.moveLength;) {
                    var b = a.edge, c = a.moveBuffer[a.edgeAvail++]; var e = c % 3; switch (~~(c / 3)) {
                        case 0: ib(b.ep, 0, 1, 2, 3, e); ib(b.ep, 12, 13, 14, 15, e); break; case 1: ib(b.ep,
                            11, 15, 10, 19, e); ib(b.ep, 23, 3, 22, 7, e); break; case 2: ib(b.ep, 0, 11, 6, 8, e); ib(b.ep, 12, 23, 18, 20, e); break; case 3: ib(b.ep, 4, 5, 6, 7, e); ib(b.ep, 16, 17, 18, 19, e); break; case 4: ib(b.ep, 1, 20, 5, 21, e); ib(b.ep, 13, 8, 17, 9, e); break; case 5: ib(b.ep, 2, 9, 4, 10, e); ib(b.ep, 14, 21, 16, 22, e); break; case 6: ib(b.ep, 0, 1, 2, 3, e); ib(b.ep, 12, 13, 14, 15, e); ib(b.ep, 9, 22, 11, 20, e); break; case 7: ib(b.ep, 11, 15, 10, 19, e); ib(b.ep, 23, 3, 22, 7, e); ib(b.ep, 2, 16, 6, 12, e); break; case 8: ib(b.ep, 0, 11, 6, 8, e); ib(b.ep, 12, 23, 18, 20, e); ib(b.ep, 3, 19, 5, 13, e); break; case 9: ib(b.ep,
                                4, 5, 6, 7, e); ib(b.ep, 16, 17, 18, 19, e); ib(b.ep, 8, 23, 10, 21, e); break; case 10: ib(b.ep, 1, 20, 5, 21, e); ib(b.ep, 13, 8, 17, 9, e); ib(b.ep, 14, 0, 18, 4, e); break; case 11: ib(b.ep, 2, 9, 4, 10, e), ib(b.ep, 14, 21, 16, 22, e), ib(b.ep, 7, 15, 1, 17, e)
                    }
                } return a.edge
            } function od(a) {
                var b, c, e; var n = Array(a.moveLength - (a.add1 ? 2 : 0)); for (b = c = 0; b < a.length1; ++b)n[c++] = a.moveBuffer[b]; var f = a.sym; for (b = a.length1 + (a.add1 ? 2 : 0); b < a.moveLength; ++b)if (27 <= Zb[f][a.moveBuffer[b]]) { n[c++] = Zb[f][a.moveBuffer[b]] - 9; var w = Mc[Zb[f][a.moveBuffer[b]] - 27]; f = fc[f][w] } else n[c++] =
                    Zb[f][a.moveBuffer[b]]; b = fc[gc[f]]; a: { a = Sb(a); a = new cb(a.ct); for (e = 0; 48 > e; ++e) { w = !0; for (f = 0; 24 > f; ++f)if (a.ct[f] != ~~(f / 4)) { w = !1; break } if (w) { a = e; break a } Ra(a, 0); 1 == e % 2 && Ra(a, 1); 7 == e % 8 && Ra(a, 2); 15 == e % 16 && Ra(a, 3) } a = -1 } b = b[a]; a = []; f = b; for (b = c - 1; 0 <= b; --b)w = n[b], w = 3 * ~~(w / 3) + (2 - w % 3), 27 <= Zb[f][w] ? (a.push(Zb[f][w] - 9), w = Mc[Zb[f][w] - 27], f = fc[f][w]) : a.push(Zb[f][w]); f = -1; c = 0; e = [0, 0, 0]; for (b = 0; b < a.length; ++b) {
                        w = a[b]; if (f != ~~(w / 3) % 3) { for (n = 0; 3 > n; n++)e[n] % 4 && (a[c++] = Nc[9 * n + 3 * f + e[n] - 1] + " ", e[n] = 0); f = ~~(w / 3) % 3 } e[~~(w /
                            9)] += w % 3 + 1
                    } for (n = 0; 3 > n; n++)e[n] % 4 && (a[c++] = Nc[9 * n + 3 * f + e[n] - 1] + " ", e[n] = 0); return a = a.slice(0, c).join("")
            } function cc(a, b) { a.moveBuffer[a.moveLength++] = b } function qc() { this.moveBuffer = r(60); this.edge = new Tb; this.center = new ab; this.corner = new wb } function rc(a) { qc.call(this); Vb(this, a) } function Qc(a) { this.moveBuffer = r(60); this.edge = new Nb(a); this.center = new qb(a); this.corner = new yb(a) } function Rc() { } function Sc() {
                Sc = a; var b, c; Nc = "U  ;U2 ;U' ;R  ;R2 ;R' ;F  ;F2 ;F' ;D  ;D2 ;D' ;L  ;L2 ;L' ;B  ;B2 ;B' ;Uw ;Uw2;Uw';Rw ;Rw2;Rw';Fw ;Fw2;Fw';Dw ;Dw2;Dw';Lw ;Lw2;Lw';Bw ;Bw2;Bw'".split(";");
                dc = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19, 21, 22, 23, 25, 28, 30, 31, 32, 34, 36]; oc = [0, 1, 2, 4, 6, 7, 8, 9, 10, 11, 13, 15, 16, 17, 19, 22, 25, 28, 31, 34, 36]; jd = r(37); kd = r(37); jc = r(37, 36); Ac = r(29, 28); Bc = r(21, 20); Oc = r(36); pc = r(28); kc = r(20); for (b = 0; 29 > b; ++b)jd[dc[b]] = b; for (b = 0; 21 > b; ++b)kd[oc[b]] = b; for (b = 0; 36 > b; ++b) { for (c = 0; 36 > c; ++c)jc[b][c] = ~~(b / 3) == ~~(c / 3) || ~~(b / 3) % 3 == ~~(c / 3) % 3 && b > c; jc[36][b] = !1 } for (b = 0; 29 > b; ++b)for (c = 0; 28 > c; ++c)Ac[b][c] = jc[dc[b]][dc[c]]; for (b = 0; 21 > b; ++b)for (c = 0; 20 > c; ++c)Bc[b][c] = jc[oc[b]][oc[c]];
                for (b = 0; 36 > b; ++b)for (Oc[b] = 36, c = b; 36 > c; ++c)if (!jc[b][c]) { Oc[b] = c - 1; break } for (b = 0; 28 > b; ++b)for (pc[b] = 28, c = b; 28 > c; ++c)if (!Ac[b][c]) { pc[b] = c - 1; break } for (b = 0; 20 > b; ++b)for (kc[b] = 20, c = b; 20 > c; ++c)if (!Bc[b][c]) { kc[b] = c - 1; break }
            } function pd(a) {
                a.solution = ""; var b = Ua(new mb(Sb(a.c), 0)); var c = Ua(new mb(Sb(a.c), 1)); var n = Ua(new mb(Sb(a.c), 2)); var f = Yb[~~b >> 6]; var h = Yb[~~c >> 6]; var y = Yb[~~n >> 6]; a.p1SolsCnt = 0; a.arr2idx = 0; rd(a.p1sols.heap); for (a.length1 = (f < h ? f : h) < y ? f < h ? f : h : y; 100 > a.length1 && !(y <= a.length1 && sc(a, ~~n >>>
                    6, n & 63, a.length1, -1, 0) || f <= a.length1 && sc(a, ~~b >>> 6, b & 63, a.length1, -1, 0) || h <= a.length1 && sc(a, ~~c >>> 6, c & 63, a.length1, -1, 0)); ++a.length1); y = td(a.p1sols, bb(ud, e([25, 30, 40]), 24, 0, 0)); y.sort(function (a, b) { return a.value - b.value }); h = 9; do { n = y[0].value; a: for (; 100 > n; ++n)for (c = 0; c < y.length && !(y[c].value > n); ++c)if (!(n - y[c].length1 > h) && (Vb(a.c1, y[c]), w(a.ct2, Sb(a.c1), tc(Qb(a.c1).ep)), b = gb(a.ct2), f = Ya(a.ct2), a.length1 = y[c].length1, a.length2 = n - y[c].length1, Tc(a, b, f, a.length2, 28, 0))) break a; ++h } while (100 == n); a.arr2.sort(function (a,
                        b) { return a.value - b.value }); y = 0; n = 13; do { h = a.arr2[0].value; a: for (; 100 > h; ++h)for (c = 0; c < Math.min(a.arr2idx, 100) && !(a.arr2[c].value > h); ++c)if (!(h - a.arr2[c].length1 - a.arr2[c].length2 > n)) { b = Ib(a.e12, Qb(a.arr2[c])); jb(a.ct3, Sb(a.arr2[c]), b ^ tc(Wb(a.arr2[c]).cp)); b = ob(a.ct3); f = Eb(a.e12, 10); var Sa = Rb(Cb(a.e12)); if (Sa <= h - a.arr2[c].length1 - a.arr2[c].length2 && Uc(a, f, b, Sa, h - a.arr2[c].length1 - a.arr2[c].length2, 20, 0)) { y = c; break a } } ++n } while (100 == h); n = new rc(a.arr2[y]); a.length1 = n.length1; a.length2 = n.length2; h = h -
                            a.length1 - a.length2; for (c = 0; c < h; ++c)cc(n, oc[a.move3[c]]); a.solution = od(n)
            } function qd(a, b) {
                if (!ld) {
                    var c, e, f; var w = new db; for (c = 0; 24 > c; ++c)w.ct[c] = c; var h = new cb(w.ct); var Na = new cb(w.ct); var ab = new cb(w.ct); for (c = 0; 48 > c; ++c) { for (e = 0; 48 > e; ++e) { for (f = 0; 48 > f; ++f)x(w, h) && (fc[c][e] = f, 0 == f && (gc[c] = e)), Ra(h, 0), 1 == f % 2 && Ra(h, 1), 7 == f % 8 && Ra(h, 2), 15 == f % 16 && Ra(h, 3); Ra(w, 0); 1 == e % 2 && Ra(w, 1); 7 == e % 8 && Ra(w, 2); 15 == e % 16 && Ra(w, 3) } Ra(w, 0); 1 == c % 2 && Ra(w, 1); 7 == c % 8 && Ra(w, 2); 15 == c % 16 && Ra(w, 3) } for (c = 0; 48 > c; ++c)for (y(w, Na),
                        $a(w, gc[c]), e = 0; 36 > e; ++e)for (y(h, w), Wa(h, e), $a(h, c), f = 0; 36 > f; ++f)if (y(ab, Na), Wa(ab, f), x(ab, h)) { Zb[c][e] = f; break } Va(w, 0); for (c = 0; 48 > c; ++c)Fc[gc[c]] = Ta(w), Ra(w, 0), 1 == c % 2 && Ra(w, 1), 7 == c % 8 && Ra(w, 2), 15 == c % 16 && Ra(w, 3); hc = r(735471); w = new db; e = r(22984); for (Na = 0; 22984 > Na; Na++)e[Na] = 0; for (Na = h = 0; 735471 > Na; ++Na)if (0 == (e[~~Na >>> 5] & 1 << (Na & 31))) { Va(w, Na); for (c = 0; 48 > c; ++c)ab = Ta(w), e[~~ab >>> 5] |= 1 << (ab & 31), null != hc && (hc[ab] = h << 6 | gc[c]), Ra(w, 0), 1 == c % 2 && Ra(w, 1), 7 == c % 8 && Ra(w, 2), 15 == c % 16 && Ra(w, 3); mc[h++] = Na } w = new db; h =
                            new db; for (Na = 0; 15582 > Na; ++Na)for (Va(h, mc[Na]), ab = 0; 36 > ab; ++ab)y(w, h), Wa(w, ab), vc[Na][ab] = Ua(w); hc = null; uc(Yb); h = Yb[0] = 0; for (Na = 1; 15582 != Na;) { var z = (e = 4 < h) ? -1 : h; w = e ? h : -1; ++h; for (ab = 0; 15582 > ab; ++ab)if (Yb[ab] == z) for (f = 0; 27 > f; ++f)if (c = ~~vc[ab][f] >>> 6, Yb[c] == w) if (++Na, e) { Yb[ab] = h; break } else Yb[c] = h } Na = new Za; for (w = 0; 70 > w; ++w)for (h = 0; 28 > h; ++h)Sa(Na, w), fb(Na, dc[h]), wc[w][h] = Ya(Na); for (w = 0; 70 > w; ++w)for (Sa(Na, w), h = 0; 16 > h; ++h)ed[w][h] = Ya(Na), Xa(Na, 0), 1 == h % 2 && Xa(Na, 1), 7 == h % 8 && Xa(Na, 2); for (w = 0; 6435 > w; ++w)for (n(Na,
                                w), h = 0; 16 > h; ++h)fd[w][h] = gb(Na) & 65535, Xa(Na, 0), 1 == h % 2 && Xa(Na, 1), 7 == h % 8 && Xa(Na, 2); for (w = 0; 6435 > w; ++w)for (h = 0; 28 > h; ++h)n(Na, w), fb(Na, dc[h]), xc[w][h] = gb(Na) & 65535; uc(Ub); ab = Ub[0] = Ub[18] = Ub[28] = Ub[46] = Ub[54] = Ub[56] = 0; for (c = 6; 450450 != c;) { z = (f = 6 < ab) ? -1 : ab; var Pa = f ? ab : -1; ++ab; for (w = 0; 450450 > w; ++w)if (Ub[w] == z) for (Na = ~~(w / 70), e = w % 70, h = 0; 23 > h; ++h) { var Qa = xc[Na][h]; var hb = wc[e][h]; Qa = 70 * Qa + hb; if (Ub[Qa] == Pa) if (++c, f) { Ub[w] = ab; break } else Ub[Qa] = ab } } for (w = 0; 12 > w; ++w)Hc[Gc[w]] = w; Na = new eb; for (w = 0; 29400 > w; ++w)for (h =
                                    0; 20 > h; ++h) {
                                        e = Na; f = w; e.parity = f & 1; f >>>= 1; z = Gc[f % 12]; f = ~~(f / 12); ab = 4; for (c = 7; 0 <= c; --c)e.rl[c] = 0, z >= Oa[c][ab] && (z -= Oa[c][ab--], e.rl[c] = 1); z = f % 35; f = ~~(f / 35); ab = 4; e.fb[7] = 0; for (c = 6; 0 <= c; --c)z >= Oa[c][ab] ? (z -= Oa[c][ab--], e.fb[c] = 1) : e.fb[c] = 0; ab = 4; e.ud[7] = 0; for (c = 6; 0 <= c; --c)f >= Oa[c][ab] ? (f -= Oa[c][ab--], e.ud[c] = 1) : e.ud[c] = 0; ab = Na; c = h; ab.parity ^= hd[c]; switch (c) {
                                            case 0: case 1: case 2: ib(ab.ud, 0, 1, 2, 3, c % 3); break; case 3: ib(ab.rl, 0, 1, 2, 3, 1); break; case 4: case 5: case 6: ib(ab.fb, 0, 1, 2, 3, (c - 1) % 3); break; case 7: case 8: case 9: ib(ab.ud,
                                                4, 5, 6, 7, (c - 1) % 3); break; case 10: ib(ab.rl, 4, 5, 6, 7, 1); break; case 11: case 12: case 13: ib(ab.fb, 4, 5, 6, 7, (c + 1) % 3); break; case 14: ib(ab.ud, 0, 1, 2, 3, 1); ib(ab.rl, 0, 5, 4, 1, 1); ib(ab.fb, 0, 5, 4, 1, 1); break; case 15: ib(ab.rl, 0, 1, 2, 3, 1); ib(ab.fb, 1, 4, 7, 2, 1); ib(ab.ud, 1, 6, 5, 2, 1); break; case 16: ib(ab.fb, 0, 1, 2, 3, 1); ib(ab.ud, 3, 2, 5, 4, 1); ib(ab.rl, 0, 3, 6, 5, 1); break; case 17: ib(ab.ud, 4, 5, 6, 7, 1); ib(ab.rl, 3, 2, 7, 6, 1); ib(ab.fb, 3, 2, 7, 6, 1); break; case 18: ib(ab.rl, 4, 5, 6, 7, 1); ib(ab.fb, 0, 3, 6, 5, 1); ib(ab.ud, 0, 3, 4, 7, 1); break; case 19: ib(ab.fb, 4,
                                                    5, 6, 7, 1), ib(ab.ud, 0, 7, 6, 1, 1), ib(ab.rl, 1, 4, 7, 2, 1)
                                        }nc[w][h] = ob(Na) & 65535
                                } uc(bc); Na = bc[0] = 0; for (ab = 1; 29400 != ab;) { for (w = 0; 29400 > w; ++w)if (bc[w] == Na) for (h = 0; 17 > h; ++h)-1 == bc[nc[w][h]] && (bc[nc[w][h]] = Na + 1, ++ab); ++Na } w = new Gb; for (Na = 0; 20 > Na; ++Na)for (ab = 0; 8 > ab; ++ab) { tb(w, 0); Bb(w, Na); Ab(w, ab); for (h = 0; 12 > h; ++h)Ic[Na << 3 | ab][h] = w.edge[h]; Mb(w); for (h = 0; 12 > h; ++h)Jc[Na << 3 | ab][h] = w.temp[h] } h = new Gb; e = r(1485); for (Na = 0; 1485 > Na; Na++)e[Na] = 0; for (Na = w = 0; 11880 > Na; ++Na)if (0 == (e[~~Na >>> 3] & 1 << (Na & 7))) {
                                    tb(h, Na * Kc[8]); for (c =
                                        0; 8 > c; ++c)ab = Eb(h, 4), ab == Na && (zc[w] = (zc[w] | 1 << c) & 65535), e[~~ab >> 3] |= 1 << (ab & 7), ic[ab] = w << 3 | id[c], Kb(h, 0), 1 == c % 2 && (Kb(h, 1), Kb(h, 2)); yc[w++] = Na
                                } var qb; Na = new Gb; ab = new Gb; e = new Gb; uc($b); h = 0; Cc = 1; for (Pb($b, 0, 0); 31006080 != Cc;) {
                                    f = 9 < h; z = h % 3; w = (h + 1) % 3; c = f ? 3 : z; z = f ? z : 3; if (9 <= h) break; for (hb = 0; 31006080 > hb; hb += 16) {
                                        var mb = $b[~~hb >> 4]; if (f || -1 != mb) for (Qa = hb, Pa = hb + 16; Qa < Pa; ++Qa, mb >>= 2)if ((mb & 3) == c) {
                                            var kb = ~~(Qa / 20160); kb = yc[kb]; var jb = Qa % 20160; tb(Na, 20160 * kb + jb); for (kb = 0; 17 > kb; ++kb) {
                                                jb = Ob(Na.edge, kb << 3, 4); jb = ic[jb];
                                                var nb = jb & 7; jb >>= 3; var bb = Ob(Na.edge, kb << 3 | nb, 10) % 20160; bb = 20160 * jb + bb; if (Jb($b, bb) == z) { Pb($b, f ? Qa : bb, w); ++Cc; if (f) break; bb = zc[jb]; if (1 != bb) for (sb(ab, Na), Bb(ab, kb), Ab(ab, nb), qb = 1; 0 != (bb = ~~bb >> 1 & 65535); ++qb)1 == (bb & 1) && (sb(e, ab), Ab(e, qb), nb = 20160 * jb + Eb(e, 10) % 20160, Jb($b, nb) == z && (Pb($b, nb, w), ++Cc)) }
                                            }
                                        }
                                    } ++h
                                } ld = !0
                } a.c = new Qc(b); pd(a); return a.solution
            } function sc(a, b, c, e, n, f) {
                var h, y, Sa; if (0 == b) {
                    if (b = 0 == e) {
                        Vb(a.c1, a.c); for (b = 0; b < a.length1; ++b)cc(a.c1, a.move1[b]); switch (Fc[c]) {
                            case 0: cc(a.c1, 24); cc(a.c1,
                                35); a.move1[a.length1] = 24; a.move1[a.length1 + 1] = 35; a.add1 = !0; c = 19; break; case 12869: cc(a.c1, 18); cc(a.c1, 29); a.move1[a.length1] = 18; a.move1[a.length1 + 1] = 29; a.add1 = !0; c = 34; break; case 735470: a.add1 = !1, c = 0
                        }w(a.ct2, Sb(a.c1), tc(Qb(a.c1).ep)); b = gb(a.ct2); e = Ya(a.ct2); a.c1.value = Ub[70 * b + e] + a.length1; a.c1.length1 = a.length1; a.c1.add1 = a.add1; a.c1.sym = c; ++a.p1SolsCnt; if (500 > a.p1sols.heap.size) var r = new rc(a.c1); else {
                            c = a.p1sols; if (0 == c.heap.size) r = null; else {
                                b = c.heap.array[0]; e = c.heap; n = c.heap.size - 1; f = e.array[n];
                                e.array.splice(n, 1); --e.size; if (0 < c.heap.size) { ec(c.heap, 0, f); e = 0; n = c.heap.size; for (Sa = c.heap.array[e]; 2 * e + 1 < n;) { f = (h = 2 * e + 1, r = h + 1, y = h, r < n && 0 > c.heap.array[h].value - c.heap.array[r].value && (y = r), y); if (0 > c.heap.array[f].value - Sa.value) break; ec(c.heap, e, c.heap.array[f]); e = f } ec(c.heap, e, Sa) } r = b
                            } r.value > a.c1.value && Vb(r, a.c1)
                        } h = a.p1sols; b: {
                            y = h.heap.size; c = h.heap; b = c.size++; for (c.array[b] = r; 0 < y;) { c = y; y = ~~((y - 1) / 2); if (0 >= r.value - h.heap.array[y].value) { ec(h.heap, c, r); break b } ec(h.heap, c, h.heap.array[y]) } ec(h.heap,
                                y, r)
                        } b = 1E4 == a.p1SolsCnt
                    } return b
                } for (h = 0; 27 > h; h += 3)if (h != n && h != n - 9 && h != n - 18) for (Sa = 0; 3 > Sa; ++Sa) { y = h + Sa; r = vc[b][Zb[c][y]]; var x = Yb[~~r >>> 6]; if (x >= e) { if (x > e) break } else if (x = fc[c][r & 63], r >>>= 6, a.move1[f] = y, sc(a, r, x, e - 1, h, f + 1)) return !0 } return !1
            } function Tc(a, b, c, e, n, w) {
                var f; if (0 == b && 0 == Ub[c]) {
                    if (b = 0 == e) {
                        Vb(a.c2, a.c1); for (b = 0; b < a.length2; ++b)cc(a.c2, a.move2[b]); b = Qb(a.c2); c = 0; n = !1; for (e = 0; 12 > e; ++e)c |= 1 << b.ep[e], n = n != 12 <= b.ep[e]; 0 != (c & ~~c >> 12) || n ? b = !1 : (b = Ib(a.e12, Qb(a.c2)), jb(a.ct3, Sb(a.c2), b ^ tc(Wb(a.c2).cp)),
                            b = ob(a.ct3), Eb(a.e12, 10), c = Rb(Cb(a.e12)), a.arr2[a.arr2idx] ? Vb(a.arr2[a.arr2idx], a.c2) : a.arr2[a.arr2idx] = new rc(a.c2), a.arr2[a.arr2idx].value = a.length1 + a.length2 + Math.max(c, bc[b]), a.arr2[a.arr2idx].length2 = a.length2, ++a.arr2idx, b = a.arr2idx == a.arr2.length)
                    } return b
                } for (f = 0; 23 > f; ++f)if (Ac[n][f]) f = pc[f]; else { var h = xc[b][f]; var y = wc[c][f]; var Sa = Ub[70 * h + y]; if (Sa >= e) Sa > e && (f = pc[f]); else if (a.move2[w] = dc[f], Tc(a, h, y, e - 1, f, w + 1)) return !0 } return !1
            } function Uc(a, b, c, e, n, f, w) {
                var h; if (0 == n) return 0 == b && 0 == c;
                tb(a.tempe[w], b); for (h = 0; 17 > h; ++h)if (Bc[f][h]) h = kc[h]; else { b = nc[c][h]; var y = bc[b]; if (y >= n) y > n && 14 > h && (h = kc[h]); else { y = Ob(a.tempe[w].edge, h << 3, 10); var Sa = ~~(y / 20160); Sa = ic[Sa]; var r = Sa & 7; Sa >>= 3; var x = Ob(a.tempe[w].edge, h << 3 | r, 10) % 20160; r = e; Sa = Jb($b, 20160 * Sa + x); Sa = 3 == Sa ? 10 : (1227133513 << Sa >> r & 3) + r - 1; if (Sa >= n) Sa > n && 14 > h && (h = kc[h]); else if (Uc(a, y, b, Sa, n - 1, h, w + 1)) return a.move3[w] = h, !0 } } return !1
            } function Vc() {
                var a; this.p1sols = new bd(new Rc); this.move1 = r(15); this.move2 = r(20); this.move3 = r(20); this.c1 = new qc;
                this.c2 = new qc; this.ct2 = new Za; this.ct3 = new eb; this.e12 = new Gb; this.tempe = r(20); this.arr2 = r(100); for (a = 0; 20 > a; ++a)this.tempe[a] = new Gb
            } function Wc() { Wc = a } function tc(a) { var b, c, e; var n = e = 0; for (c = a.length; n < c; ++n)for (b = n; b < c; ++b)a[n] > a[b] && (e ^= 1); return e } function ib(a, b, c, e, n, w) { switch (w) { case 0: w = a[n]; a[n] = a[e]; a[e] = a[c]; a[c] = a[b]; a[b] = w; break; case 1: w = a[b]; a[b] = a[e]; a[e] = w; w = a[c]; a[c] = a[n]; a[n] = w; break; case 2: w = a[b], a[b] = a[c], a[c] = a[e], a[e] = a[n], a[n] = w } } function Xc() { } function Yc(a, b, c, e) {
                var n =
                    new Xc; n.typeName = a + b; $c(0 != c ? -c : 0) && ad(0 != c ? -c : 0, n); n.modifiers = 4; n.superclass = Pc; n.componentType = e; return n
            } function Zc(a, b, c, e) { var n = new Xc; n.typeName = a + b; $c(c) && ad(c, n); n.superclass = e; return n } function $c(a) { return "number" == typeof a && 0 < a } function ad(a, b) { b.seedId = a; if (2 == a) var c = String.prototype; else if (0 < a) if (c = lc[b.seedId]) c = c.prototype; else { c = lc[a] = function () { }; c.___clazz$ = b; return } else return; c.___clazz$ = b } function rd(a) { a.array = bb(md, e([30, 40]), 0, 0, 0); a.size = 0 } function ec(a, b, c) {
                var e = a.array[b];
                a.array[b] = c; return e
            } function sd() { this.array = bb(md, e([30, 40]), 0, 0, 0); this.array.length = 500 } function uc(a) { var b = a.length, c; for (c = 0; c < b; ++c)a[c] = -1 } function td(a, b) { var c = a.heap, e = b; if (e.length < c.size) { var n = f(0, c.size); h(e.___clazz$, e.castableTypeMap$, e.queryId$, n); e = n } for (n = 0; n < c.size; ++n)e[n] = c.array[n]; e.length > c.size && (e[c.size] = null); return e } function bd(a) { this.heap = new sd; this.cmp = a } function cd() { cd = a; Sc(); Wc(); Qa(); lb(); hb(); Fb(); kb(); nb(); Lb(); ac(); nd = new Vc } function dd() {
                cd(); return (scramble_333.getRandomScramble() +
                    qd(nd, Math)).replace(/\s+/g, " ")
            } var Db, lc = {}; b(1, -1, {}); Db.value = null; b(73, 1, {}, Pa); Db.queryId$ = 0; var Dc, Ec; b(153, 1, e([21]), db, mb, cb); var Yb, vc, Fc, hc = null, mc, gc, Zb, fc; b(154, 1, {}, Za); Db.parity = 0; var xc, Ub, fd, gd, wc, ed; b(155, 1, {}, eb); Db.parity = 0; var nc, hd, bc, Gc, Hc; b(156, 1, {}, ab, qb); b(157, 1, e([22]), wb, zb, yb); Db.temps = null; var Xb; b(158, 1, e([23]), Gb); Db.isStd = !0; Db.temp = null; var Lc, Cc = 0, $b, Kc, Ic, Jc, ic, yc, id, zc; b(159, 1, {}, Tb, Nb); b(160, 1, e([24, 34]), qc, rc, Qc); Db.compareTo$ = function (a) { return this.value - a.value };
    Db.add1 = !1; Db.center = null; Db.centerAvail = 0; Db.corner = null; Db.cornerAvail = 0; Db.edge = null; Db.edgeAvail = 0; Db.length1 = 0; Db.length2 = 0; Db.length3 = 0; Db.moveLength = 0; Db.sym = 0; Db.value = 0; var Mc; b(161, 1, {}, Rc); Db.compare = function (a, b) { return b.value - a.value }; var jc, Ac, Bc, dc, Nc, oc, Oc, pc, kc, jd, kd; b(163, 1, e([26]), Vc); Db.add1 = !1; Db.arr2idx = 0; Db.c = null; Db.length1 = 0; Db.length2 = 0; Db.p1SolsCnt = 0; Db.solution = ""; var ld = !1; Db.val$outerIter = null; Db.size = 0; b(239, 1, {}, bd); Db.cmp = null; Db.heap = null; var Pc = Zc("java.lang.",
        "Object", 1, null), md = Yc("[Ljava.lang.", "Object;", 356, Pc), vd = Zc("cs.threephase.", "FullCube", 160, Pc), ud = Yc("[Lcs.threephase.", "FullCube;", 381, vd), nd; scrMgr.reg("444wca", dd); return { getRandomScramble: dd }
}(mathlib.rn, mathlib.Cnk, mathlib.circle); (function (c, Oa, z, r) {
    function b(a, b) { b <<= 2; if (24 < b) { b = 48 - b; var c = a.ul; a.ul = (a.ul >> b | a.ur << 24 - b) & 16777215; a.ur = (a.ur >> b | c << 24 - b) & 16777215 } else 0 < b ? (c = a.ul, a.ul = (a.ul << b | a.ur >> 24 - b) & 16777215, a.ur = (a.ur << b | c >> 24 - b) & 16777215) : 0 == b ? (c = a.ur, a.ur = a.dl, a.dl = c, a.ml = 1 - a.ml) : -24 <= b ? (b = -b, c = a.dl, a.dl = (a.dl << b | a.dr >> 24 - b) & 16777215, a.dr = (a.dr << b | c >> 24 - b) & 16777215) : -24 > b && (b = 48 + b, c = a.dl, a.dl = (a.dl >> b | a.dr << 24 - b) & 16777215, a.dr = (a.dr >> b | c << 24 - b) & 16777215) } function e(a, b) {
        var c; 6 > b ? c = a.ul >> (5 - b << 2) : 12 > b ? c = a.ur >> (11 -
            b << 2) : 18 > b ? c = a.dl >> (17 - b << 2) : c = a.dr >> (23 - b << 2); return c & 15
    } function a(a, b, c) { 6 > b ? (a.ul &= ~(15 << (5 - b << 2)), a.ul |= c << (5 - b << 2)) : 12 > b ? (a.ur &= ~(15 << (11 - b << 2)), a.ur |= c << (11 - b << 2)) : 18 > b ? (a.dl &= ~(15 << (17 - b << 2)), a.dl |= c << (17 - b << 2)) : (a.dr &= ~(15 << (23 - b << 2)), a.dr |= c << (23 - b << 2)) } function Pa() { this.arr = []; this.prm = [] } function f(b) {
        var c; void 0 === b && (b = r(3678)); var e = new Pa; var n = Ya[b]; var w = 324508639; var f = 38177486; var h = c = 8; for (b = 0; 24 > b; b++)if (0 == (n >> b & 1)) {
            var y = r(c) << 2; a(e, 23 - b, f >> y & 15); y = (1 << y) - 1; f = (f & y) + (f >>
                4 & ~y); --c
        } else y = r(h) << 2, a(e, 23 - b, w >> y & 15), a(e, 22 - b, w >> y & 15), y = (1 << y) - 1, w = (w & y) + (w >> 4 & ~y), --h, ++b; e.ml = r(2); return e
    } function bb(a, c, n, f, y, Sa) {
        if (0 == n && 4 > f) {
            if (c = 0 == f) a: {
                c = a.Search_d; f = a.Search_c; c.ul = f.ul; c.ur = f.ur; c.dl = f.dl; c.dr = f.dr; c.ml = f.ml; for (c = 0; c < a.Search_length1; ++c)b(a.Search_d, a.Search_move[c]); c = a.Search_d; f = a.Search_sq; for (y = 0; 8 > y; ++y)c.prm[y] = e(c, 3 * y + 1) >> 1; f.cornperm = Oa(c.prm); f.topEdgeFirst = e(c, 0) == e(c, 1); y = f.topEdgeFirst ? 2 : 0; for (Sa = 0; 4 > Sa; y += 3, ++Sa)c.prm[Sa] = e(c, y) >> 1; f.botEdgeFirst =
                    e(c, 12) == e(c, 13); for (y = f.botEdgeFirst ? 14 : 12; 8 > Sa; y += 3, ++Sa)c.prm[Sa] = e(c, y) >> 1; f.edgeperm = Oa(c.prm); f.ml = c.ml; y = a.Search_sq.edgeperm; f = a.Search_sq.cornperm; Sa = a.Search_sq.ml; for (c = Math.max(Za[a.Search_sq.edgeperm << 1 | Sa], Za[a.Search_sq.cornperm << 1 | Sa]); c < a.Search_maxlen2; ++c)if (h(a, y, f, a.Search_sq.topEdgeFirst, a.Search_sq.botEdgeFirst, Sa, c, a.Search_length1, 0)) {
                        for (f = 0; f < c; ++f)b(a.Search_d, a.Search_move[a.Search_length1 + f]); f = a; y = ""; n = Sa = 0; for (c = c + a.Search_length1 - 1; 0 <= c; c--) {
                            var r = a.Search_move[c];
                            0 < r ? (r = 12 - r, Sa = 6 < r ? r - 12 : r) : 0 > r ? (r = 12 + r, n = 6 < r ? r - 12 : r) : (r = "/", c == a.Search_length1 - 1 && (r = "`/`"), y = 0 == Sa && 0 == n ? y + r : y + (" (" + Sa + "," + n + ")" + r), Sa = n = 0)
                        } if (0 != Sa || 0 != n) y += " (" + Sa + "," + n + ") "; f.Search_sol_string = y; c = !0; break a
                    } c = !1
            } return c
        } if (0 != Sa) { var x = w[c]; r = fb[x]; if (r < f && (a.Search_move[y] = 0, bb(a, x, r, f - 1, y + 1, 0))) return !0 } x = c; if (0 >= Sa) for (n = 0; ;) { n += Xa[x]; x = n >> 4; n &= 15; if (12 <= n) break; r = fb[x]; if (r > f) break; else if (r < f && (a.Search_move[y] = n, bb(a, x, r, f - 1, y + 1, 1))) return !0 } x = c; if (1 >= Sa) for (n = 0; ;) {
            n += gb[x]; x = n >> 4;
            n &= 15; if (6 <= n) break; r = fb[x]; if (r > f) break; else if (r < f && (a.Search_move[y] = -n, bb(a, x, r, f - 1, y + 1, 2))) return !0
        } return !1
    } function h(a, b, c, e, n, f, w, y, r) {
        var x, Na; if (0 == w && !e && n) return !0; if (0 != r && e == n) { var Va = ob[b]; var z = ob[c]; if (Za[Va << 1 | 1 - f] < w && Za[z << 1 | 1 - f] < w && (a.Search_move[y] = 0, h(a, Va, z, e, n, 1 - f, w - 1, y + 1, 0))) return !0 } if (0 >= r) {
            Va = (Na = !e) ? hb[b] : b; z = Na ? c : hb[c]; var Xa = Na ? 1 : 2; var Ra = Za[Va << 1 | f]; for (x = Za[z << 1 | f]; 12 > Xa && Ra <= w && Ra <= w;) {
                if (Ra < w && x < w && (a.Search_move[y] = Xa, h(a, Va, z, Na, n, f, w - 1, y + 1, 1))) return !0; (Na = !Na) ?
                    (Va = hb[Va], Ra = Za[Va << 1 | f], Xa += 1) : (z = hb[z], x = Za[z << 1 | f], Xa += 2)
            }
        } if (1 >= r) for (Va = (n = !n) ? Sa[b] : b, z = n ? c : Sa[c], Xa = n ? 1 : 2, Ra = Za[Va << 1 | f], x = Za[z << 1 | f]; Xa < (6 < w ? 6 : 12) && Ra <= w && Ra <= w;) { if (Ra < w && x < w && (a.Search_move[y] = -Xa, h(a, Va, z, e, n, f, w - 1, y + 1, 2))) return !0; (n = !n) ? (Va = Sa[Va], Ra = Za[Va << 1 | f], Xa += 1) : (z = Sa[z], x = Za[z << 1 | f], Xa += 2) } return !1
    } function Na(a, b) {
        a.Search_c = b; var c = b.ur & 1118481; c |= c >> 3; c |= c >> 6; c = c & 15 | c >> 12 & 48; var n = b.ul & 1118481; n |= n >> 3; n |= n >> 6; n = n & 15 | n >> 12 & 48; var f = b.dr & 1118481; f |= f >> 3; f |= f >> 6; f = f & 15 | f >> 12 &
            48; var w = b.dl & 1118481; w |= w >> 3; w |= w >> 6; w = w & 15 | w >> 12 & 48; var h, y; var Sa = 0; b.arr[0] = e(b, 0); for (h = 1; 24 > h; ++h)e(b, h) != b.arr[Sa] && (b.arr[++Sa] = e(b, h)); for (Sa = y = 0; 16 > Sa; ++Sa)for (h = Sa + 1; 16 > h; ++h)b.arr[Sa] > b.arr[h] && (y ^= 1); w = Ra(y << 24 | n << 18 | c << 12 | w << 6 | f); for (a.Search_length1 = fb[w]; 100 > a.Search_length1 && (a.Search_maxlen2 = Math.min(32 - a.Search_length1, 17), !bb(a, w, fb[w], a.Search_length1, 0, -1)); ++a.Search_length1); return a.Search_sol_string
    } function Qa() { this.Search_move = []; this.Search_d = new Pa; this.Search_sq = new Va }
    function x() {
        x = $.noop; n = [0, 3, 6, 12, 15, 24, 27, 30, 48, 51, 54, 60, 63]; Ya = []; fb = []; Xa = []; gb = []; w = []; var a, b; for (b = a = 0; 28561 > b; ++b) { var c = n[b % 13]; var e = n[~~(b / 13) % 13]; var f = n[~~(~~(b / 13) / 13) % 13]; var h = n[~~(~~(~~(b / 13) / 13) / 13)]; e = h << 18 | f << 12 | e << 6 | c; 16 == y(e) && (Ya[a++] = e) } a = new Wa; for (b = 0; 7356 > b; ++b) {
            Ua(a, b); e = Xa; c = b; var Sa = a; h = f = 0; do 0 == (Sa.top & 2048) ? (f += 1, Sa.top <<= 1) : (f += 2, Sa.top = Sa.top << 2 ^ 12291), h = 1 - h; while (0 != (y(Sa.top & 63) & 1)); 0 == (y(Sa.top) & 2) && (Sa.Shape_parity ^= h); e[c] = f; Xa[b] |= Ta(a) << 4; Ua(a, b); e = gb; c = b;
            Sa = a; h = f = 0; do 0 == (Sa.bottom & 2048) ? (f += 1, Sa.bottom <<= 1) : (f += 2, Sa.bottom = Sa.bottom << 2 ^ 12291), h = 1 - h; while (0 != (y(Sa.bottom & 63) & 1)); 0 == (y(Sa.bottom) & 2) && (Sa.Shape_parity ^= h); e[c] = f; gb[b] |= Ta(a) << 4; Ua(a, b); h = a.top & 63; e = y(h); c = y(a.bottom & 4032); a.Shape_parity ^= 1 & (e & c) >> 1; a.top = a.top & 4032 | a.bottom >> 6 & 63; a.bottom = a.bottom & 63 | h << 6; w[b] = Ta(a)
        } for (b = 0; 7536 > b; ++b)fb[b] = -1; fb[Ra(14378715)] = 0; fb[Ra(31157686)] = 0; fb[Ra(23967451)] = 0; fb[Ra(7191990)] = 0; e = 4; c = 0; for (a = -1; e != c;)for (c = e, ++a, b = 0; 7536 > b; ++b)if (fb[b] == a) {
            f =
            0; h = b; do h = Xa[h], f += h & 15, h >>= 4, -1 == fb[h] && (++e, fb[h] = a + 1); while (12 != f); f = 0; h = b; do h = gb[h], f += h & 15, h >>= 4, -1 == fb[h] && (++e, fb[h] = a + 1); while (12 != f); h = w[b]; -1 == fb[h] && (++e, fb[h] = a + 1)
        }
    } function Ta(a) { return db(Ya, a.top << 12 | a.bottom) << 1 | a.Shape_parity } function Ua(a, b) { a.Shape_parity = b & 1; a.top = Ya[b >> 1]; a.bottom = a.top & 4095; a.top >>= 12 } function Wa() { } function Ra(a) { return db(Ya, a & 16777215) << 1 | a >> 24 } function $a() {
        $a = $.noop; Za = []; ob = []; hb = []; Sa = []; var a, b, e; var n = []; for (b = 0; 40320 > b; ++b)c(n, b), z(n, 2, 4)(n, 3, 5),
            ob[b] = Oa(n), c(n, b), z(n, 0, 3, 2, 1), hb[b] = Oa(n), c(n, b), z(n, 4, 7, 6, 5), Sa[b] = Oa(n); for (b = 0; 80640 > b; ++b)Za[b] = -1; var f = Za[0] = 0; for (a = 1; 80640 > a;) { var w = (e = 11 <= f) ? -1 : f; n = e ? f : -1; ++f; b = 0; a: for (; 80640 > b; ++b)if (Za[b] == w) { var h = b >> 1; var y = b & 1; var r = ob[h] << 1 | 1 - y; if (Za[r] == n && (++a, Za[e ? b : r] = f, e)) continue a; r = h; for (h = 0; 4 > h; ++h)if (r = hb[r], Za[r << 1 | y] == n && (++a, Za[e ? b : r << 1 | y] = f, e)) continue a; for (h = 0; 4 > h; ++h)if (r = Sa[r], Za[r << 1 | y] == n && (++a, Za[e ? b : r << 1 | y] = f, e)) continue a } }
    } function Va() { } function y(a) {
        a -= a >> 1 & 1431655765;
        a = (a >> 2 & 858993459) + (a & 858993459); a = (a >> 4) + a & 252645135; a += a >> 8; return a + (a >> 16) & 63
    } function db(a, b) { var c; var e = 0; for (c = a.length - 1; e <= c;) { var n = e + (c - e >> 1); var f = a[n]; if (f < b) e = n + 1; else if (f > b) c = n - 1; else return n } return -e - 1 } function mb() {
        mb = $.noop; for (var a = new Wa, b = 0; b < jb.length; b++) {
            for (var c = [jb[b]], e = 0; e < c.length; e++) {
                var n = c[e]; do n = Xa[n << 1] >> 5, -1 == c.indexOf(n) && c.push(n); while (n != c[e]); do n = gb[n << 1] >> 5, -1 == c.indexOf(n) && c.push(n); while (n != c[e]); Ua(a, n << 1); n = a.top; a.top = a.bottom; a.bottom = n; n = Ta(a) >>
                    1; -1 == c.indexOf(n) && c.push(n)
            } jb[b] = c
        }
    } function cb(a, b, c) { x(); $a(); return Na(kb, f()) } var lb = Pa.prototype = function () { }.prototype; lb.dl = 10062778; lb.dr = 14536702; lb.ml = 0; lb.ul = 70195; lb.ur = 4544119; lb = Qa.prototype = function () { }.prototype; lb.Search_c = null; lb.Search_length1 = 0; lb.Search_maxlen2 = 0; lb.Search_sol_string = null; lb = Wa.prototype = function () { }.prototype; lb.bottom = 0; lb.Shape_parity = 0; lb.top = 0; var gb, Ya, fb, Xa, w, n; lb = Va.prototype = function () { }.prototype; lb.botEdgeFirst = !1; lb.cornperm = 0; lb.edgeperm = 0; lb.ml =
        0; lb.topEdgeFirst = !1; var Sa, Za, hb, ob, jb = [0, 1, 3, 18, 19, 1004, 1005, 1006, 1007, 1008, 1009, 1011, 1015, 1016, 1018, 1154, 1155, 1156, 1157, 1158, 1159, 1161, 1166, 1168, 424, 425, 426, 427, 428, 429, 431, 436, 95, 218, 341, 482, 528, 632, 1050, 342, 343, 345, 346, 348, 353, 223, 487, 533, 535, 1055, 219, 225, 483, 489, 639, 1051, 1057, 486, 1054, 1062, 6, 21, 34, 46, 59, 71, 144, 157, 182, 305, 7, 22, 35, 47, 60, 72, 145, 158, 183, 306, 8, 23, 36, 48, 61, 73, 146, 159, 184, 307], eb = [16, 16, 16, 10, 16, 24, 16, 24, 16, 24, 16, 16, 4, 24, 16, 48, 32, 48, 32, 48, 32, 32, 48, 16, 48, 32, 48, 16, 48, 32, 32, 48, 36, 48,
            72, 72, 48, 48, 72, 48, 36, 72, 48, 48, 72, 32, 48, 16, 32, 48, 16, 32, 48, 48, 16, 48, 48, 36, 72, 36, 72, 96, 96, 72, 96, 72, 72, 72, 72, 24, 48, 64, 64, 48, 64, 48, 48, 48, 48, 16, 24, 32, 32, 24, 32, 24, 24, 24, 24, 8], kb = new Qa; scrMgr.reg("sqrs", cb); scrMgr.reg("sqrcsp", function (a, b, c) { x(); $a(); mb(); a = mathlib.rndEl(jb[scrMgr.fixCase(c, eb)]); return Na(kb, f(a)) }, ["Star-x8 Star-x71 Star-x62 Star-x44 Star-x53 Square-Scallop Square-rPawn Square-Shield Square-Barrel Square-rFist Square-Mushroom Square-lPawn Square-Square Square-lFist Square-Kite Kite-Scallop Kite-rPawn Kite-Shield Kite-Barrel Kite-rFist Kite-Mushroom Kite-lPawn Kite-lFist Kite-Kite Barrel-Scallop Barrel-rPawn Barrel-Shield Barrel-Barrel Barrel-rFist Barrel-Mushroom Barrel-lPawn Barrel-lFist Scallop-Scallop Scallop-rPawn Scallop-Shield Scallop-rFist Scallop-Mushroom Scallop-lPawn Scallop-lFist Shield-rPawn Shield-Shield Shield-rFist Shield-Mushroom Shield-lPawn Shield-lFist Mushroom-rPawn Mushroom-rFist Mushroom-Mushroom Mushroom-lPawn Mushroom-lFist Pawn-rPawn-rPawn Pawn-rPawn-lPawn Pawn-rPawn-rFist Pawn-lPawn-rFist Pawn-lPawn-lPawn Pawn-rPawn-lFist Pawn-lPawn-lFist Fist-rFist-rFist Fist-lFist-rFist Fist-lFist-lFist Pair-x6 Pair-r42 Pair-x411 Pair-r51 Pair-l42 Pair-l51 Pair-x33 Pair-x312 Pair-x321 Pair-x222 L-x6 L-r42 L-x411 L-r51 L-l42 L-l51 L-x33 L-x312 L-x321 L-x222 Line-x6 Line-r42 Line-x411 Line-r51 Line-l42 Line-l51 Line-x33 Line-x312 Line-x321 Line-x222".split(" "),
                eb]); return { initialize: $.noop, getRandomScramble: cb }
})(mathlib.set8Perm, mathlib.get8Perm, mathlib.circle, mathlib.rn); (function () {
    function c(a, b) { var c = Pa.set([], b & 31), e = bb.set([], b >> 5), h = f.set([], a), y = []; mathlib.fillFacelet(z, y, [0, 1, 2, 3], e, 6); mathlib.fillFacelet(r, y, h, c, 6); c = [4, 2, 3, 1, 5, 0]; for (e = 0; 6 > e; e++)for (h = 0; 2 > h; h++) { var x = r[e][0 ^ h], Na = r[e][1 ^ h], Ta = 6 * ~~(x / 6) + c[(c.indexOf(x % 6) + 5) % 6], Qa = 6 * ~~(Na / 6) + c[(c.indexOf(Na % 6) + 1) % 6]; if (y[Ta] == y[x] && y[Qa] == y[Na]) return !1 } return !0 } function Oa(a, b) {
        for (var c = f.set([], a[0]), e = Pa.set([], a[1] & 31), h = bb.set([], a[1] >> 5), y = f.set([], b[0]), r = Pa.set([], b[1] & 31), x = bb.set([], b[1] >> 5),
            Na = [], z = [], Ta = [], Qa = 0; 6 > Qa; Qa++)Na[Qa] = c[y[Qa]], z[Qa] = e[y[Qa]] ^ r[Qa]; for (Qa = 0; 4 > Qa; Qa++)Ta[Qa] = h[Qa] + x[Qa]; return [f.get(Na), bb.get(Ta) << 5 | Pa.get(z)]
    } for (var z = [[3, 16, 11], [4, 23, 15], [5, 9, 22], [10, 17, 21]], r = [[1, 7], [2, 14], [0, 18], [6, 12], [8, 20], [13, 19]], b = new mathlib.Solver(4, 2, [[0, [function (a, b) { mathlib.acycle(a, e[b]) }, "p", 6, -1], 360], [0, function (b, c) { var f = Pa.set([], b & 31), h = bb.set([], b >> 5); h[c]++; mathlib.acycle(f, e[c], 1, a[c]); return bb.get(h) << 5 | Pa.get(f) }, 2592]]), e = [[0, 1, 3], [1, 2, 5], [0, 4, 2], [3, 5, 4]], a =
        [[0, 1, 0, 2], [0, 1, 0, 2], [0, 0, 1, 2], [0, 0, 1, 2]], Pa = new mathlib.coord("o", 6, -2), f = new mathlib.coord("p", 6, -1), bb = new mathlib.coord("o", 4, 3), h = [[0, 0], [183, 869], [87, 1729]], Na = [[1, 3, "L3Bar-1", "LLDGFFRRG"], [59, 3, "L3Bar-2", "DLLGFFRRG"], [25, 3, "L3Bar-3", "FFGDRRLLG"], [35, 3, "L3Bar-4", "GRRGLLFFD"], [12, 3, "LL-1", "LLGFFGGGG"], [10, 3, "LL-2", "GLLGGGGRR"], [2, 1, "LL-3", "RLRLFLFRF"], [4, 1, "LL-4", "FLFRFRLRL"], [3, 3, "L4NB-1", "FGGGGDGFGGGF"], [57, 3, "L4NB-2", "GGRGRGDGGGGR"], [53, 3, "L4NB-3", "GGDGRGGGRGGR"], [45, 3, "L4NB-4", "DGGFGGGFGGGF"],
        [33, 3, "L4NB-5", "GGDGGGGRGGGR"], [27, 3, "L4NB-6", "DGGGFGGGGGGF"], [49, 3, "L3NB-1", "RRGGGDGFF"], [43, 3, "L3NB-2", "GFFRRGDGG"], [41, 3, "L3NB-3", "GGGDLLFFG"], [51, 3, "L3NB-4", "GGGGRRLLD"], [8, 3, "Flip-1", "RLFLFFRRL"], [16, 3, "Flip-2", "LFFRRRLLFGGD"], [56, 1, "Flip-3", "RLFLFRFRLGGD"], [21, 3, "L4Blk-1", "GGDGGGLLL"], [13, 3, "L4Blk-2", "DGGLLLGGG"], [29, 3, "L4Bar-1", "GGGDGGGRR"], [37, 3, "L4Bar-2", "GGGFFGGGD"], [61, 3, "L4Bar-3", "GGGDGGLLG"], [5, 3, "L4Bar-4", "GGGGLLGGD"], [17, 3, "L4Bar-5", "GGGLLDGGG"], [11, 3, "L4Bar-6", "GGGGGGDLL"], [9, 3, "L4Bar-7",
            "RRGDGGGGG"], [19, 3, "L4Bar-8", "GFFGGGGGD"], [20, 3, "DFlip-1", "GGGRRGGGGGGD"], [18, 3, "DFlip-2", "GGGGGGGFFGGD"], [60, 1, "DFlip-3", "FFGRRGLLGGGD"], [58, 1, "DFlip-4", "GRRGLLGFFGGD"]], Qa = [], x = [], Ta = 0; Ta < Na.length; Ta++)Qa.push(Na[Ta][1]), x.push(Na[Ta][2]); scrMgr.reg(["pyro", "pyrso", "pyrnb", "pyr4c"], function (a) {
                var e = "pyro" == a ? 0 : 8, f = "pyrl4e" == a ? 2 : 7; do {
                    if ("pyro" == a || "pyrso" == a || "pyr4c" == a) { var h = mathlib.rn(360); var r = mathlib.rn(2592) } else if ("pyrl4e" == a) h = mathlib.get8Perm(mathlib.set8Perm([], mathlib.rn(12), 4, -1).concat([4,
                        5]), 6, -1), r = 864 * mathlib.rn(3) + mathlib.rn(8); else if ("pyrnb" == a) { do h = mathlib.rn(360), r = mathlib.rn(2592); while (!c(h, r)) } var y = b.search([h, r], 0).length; var x = b.toStr(b.search([h, r], e).reverse(), "ULRB", ["'", ""]) + " "; for (var Na = 0; 4 > Na; Na++) { var z = mathlib.rn("pyr4c" == a ? 2 : 3); 2 > z && (x += "lrbu".charAt(Na) + [" ", "' "][z], y++) }
                } while (y < f); return x
            })("pyrl4e", function (a, c, e) {
                c = Na[scrMgr.fixCase(e, Qa)][0]; a = mathlib.get8Perm(mathlib.set8Perm([], c & 1, 4, -1).concat([4, 5]), 6, -1); c = 864 * (c >> 1 & 3) + (c >> 3); a = Oa(mathlib.rndEl(h),
                    Oa([a, c], mathlib.rndEl(h))); a = b.toStr(b.search(a, 8).reverse(), "ULRB", ["'", ""]) + " "; for (c = 0; 4 > c; c++)e = mathlib.rn(3), 2 > e && (a += "lrbu".charAt(c) + [" ", "' "][e]); return a
            }, [x, Qa, function (a, b) { var c = Na[a]; if (!b) return ["GGG" + c[3], null, c[2]]; image.pyrllImage("GGG" + c[3], b) }])
})(); (function () {
    function c(a, c) { var e = f.set([], a % 12), x = Pa.set([], ~~(a / 12)), Na = bb.set([], c % 81); c = h.set([], ~~(c / 81)); for (var Va = [], y = 0; 6 > y; y++)Va[5 * y] = x[y]; mathlib.fillFacelet(r, Va, [0, 1, 2, 3], Na, 5); mathlib.fillFacelet(b, Va, e, c, 5); for (y = 0; 30 > y; y += 5)for (e = 1; 5 > e; e++)if (Va[y] == Va[y + e]) return !1; return !0 } function Oa(b, c) { var h = f.set([], b % 12), r = Pa.set([], ~~(b / 12)); mathlib.acycle(r, e[c]); mathlib.acycle(h, a[c]); return 12 * Pa.get(r) + f.get(h) } function z(b, c) {
        var e = bb.set([], b % 81), f = h.set([], ~~(b / 81)); e[c]++; mathlib.acycle(f,
            a[c], 1, [0, 2, 1, 3]); return 81 * h.get(f) + bb.get(e)
    } var r = [[4, 16, 7], [1, 11, 22], [26, 14, 8], [29, 19, 23]], b = [[3, 6, 12], [2, 21, 17], [27, 9, 18], [28, 24, 13]], e = [[0, 3, 1], [0, 2, 4], [1, 5, 2], [3, 4, 5]], a = [[0, 1, 2], [0, 3, 1], [0, 2, 3], [1, 3, 2]], Pa = new mathlib.coord("p", 6, -1), f = new mathlib.coord("p", 4, -1), bb = new mathlib.coord("o", 4, 3), h = new mathlib.coord("o", 4, -3), Na = new mathlib.Solver(4, 2, [[0, Oa, 4320], [0, z, 2187]]), Qa = new mathlib.Solver(4, 2, [[0, function (a, b) { return ~~(Oa(12 * a, b) / 12) }, 360], [0, function (a, b) { return z(a, b) % 81 }, 81]]), x =
        [0, 1, 2, 0, 2, 1, 1, 2, 0, 2, 1, 0]; scrMgr.reg(["skbo", "skbso", "skbnb"], function (a) { var b = "skbso" == a ? 6 : 2, e = "skbo" == a ? 0 : 8; do { var f = mathlib.rn(4320); var h = mathlib.rn(2187) } while (0 == f && 0 == h || x[f % 12] != (h + ~~(h / 3) + ~~(h / 9) + ~~(h / 27)) % 3 || null != Na.search([f, h], 0, b) || "skbnb" == a && !c(f, h)); a = Na.search([f, h], e).reverse(); f = []; h = ["L", "R", "B", "U"]; for (b = 0; b < a.length; b++) { e = a[b][0]; var r = 1 - a[b][1]; 2 == e && mathlib.acycle(h, [0, 3, 1], r + 1); f.push(h[e] + (1 == r ? "'" : "")) } return f.join(" ") })(["ivyo", "ivyso"], function (a) {
            var b = "ivyso" ==
                a ? 6 : 0; do { a = mathlib.rn(360); var c = mathlib.rn(81) } while (0 == a && 0 == c || null != Qa.search([a, c], 0, 1)); return Qa.toStr(Qa.search([a, c], b).reverse(), "RLDB", "' ")
        })
})(); var scramble_222 = function (c) {
    function Oa(a, b) { mathlib.acycle(a, f[b]) } function z(a, b) { mathlib.acycle(a, f[b], 1, bb[b]) } function r(a, b) { for (var c = mathlib.set8Perm([], a, 7), e = h.set([], b), f = [], y = 0; 24 > y; y++)f[y] = y >> 2; mathlib.fillFacelet(Na, f, c, e, 4); for (y = 0; 24 > y; y += 4)if ((1 << f[y] | 1 << f[y + 3]) & (1 << f[y + 1] | 1 << f[y + 2])) return !1; return !0 } function b(a, b, e) {
        var n = 0, f = 4; b = [0, 1, 2, 3]; var w = [0, 0, 0, 0, 0, 0, 0]; if ("222tcp" == a) n = Wa[scrMgr.fixCase(e, db)], w = [0, 0, 0, 0, 1, 0, 0], b = b.concat(Ta[0]); else if ("222tcn" == a) n = Ra[scrMgr.fixCase(e,
            cb)], w = [0, 0, 0, 0, 2, 0, 0], b = b.concat(Ta[0]); else if ("222eg0" == a) n = Ua[scrMgr.fixCase(e, Va)], b = b.concat(Ta[0]); else if ("222eg1" == a) n = Ua[scrMgr.fixCase(e, Va)], b = b.concat(Ta[2 + c(4)]); else if ("222eg2" == a) n = Ua[scrMgr.fixCase(e, Va)], b = b.concat(Ta[1]); else if ("222lsall" == a) { b = b.concat(Ta[0]); f = mathlib.rndPerm(4); f.push(f[3]); f[3] = 4; n = [0, $a[scrMgr.fixCase(e, gb)][0]]; for (e = 0; 5 > e; e++)n[0] |= f[e] << 4 * e; f = 5 } for (e = c(4); 0 < e--;)Oa(b, 0); a = b.slice(); for (e = 0; e < f; e++)b[e] = a[n[0] >> 4 * e & 15], w[e] = n[1] >> 4 * e & 15; for (n = c(4); 0 < n--;)z(w,
                0), Oa(b, 0); b = mathlib.get8Perm(b, 7); w = h.get(w); return Pa.toStr(Pa.search([b, w], 9).reverse(), "URF", "'2 ")
    } function e(a, b, c, e, f) { b = b[e]; for (var n = [], w = 0; 4 > w; w++)if (a) for (y = b[0] >> (w << 2) & 15, r = 0; 3 > r; r++)Sa = Qa.indexOf(Na[w][r]), n[Sa] = "DGU".charAt(0 == (r + 3 - y) % 3 ? 3 == w ? 2 : 0 : 1); else for (var h = b[0] >> (w << 2) & 15, y = b[1] >> (w << 2) & 15, r = 0; 3 > r; r++) { var Sa = Qa.indexOf(Na[w][r]); n[Sa] = "DLFURB".charAt(Na[h][(r + 3 - y) % 3] >> 2) } n = n.join(""); if (!f) return [n, null, c[e]]; image.llImage.drawImage(n, null, f) } function a(b, e, f) {
        var n = "222o" ==
            b ? 0 : 9; do { var w = 2; if ("222o" == b || "222so" == b) { var y = c(5040); var Na = c(729); w = 3 } else if ("222eg" == b) { Na = x[f & 7]; y = [0, 2, 3, 4, 5, 1][f >> 3]; y = mathlib.set8Perm([0, 0, 0, 0].concat(Ta[y]), c(24), 4); y = mathlib.get8Perm(y, 7); var Va = c(4); for (Na = h.set([], Na); 0 < Va--;)z(Na, 0); Na = h.get(Na) } else { if (/^222eg[012]$/.exec(b)) return a("222eg", e, [0, 8, 40][~~b[5]] + f); if ("222nb" == b) { do y = c(5040), Na = c(729); while (!r(y, Na)) } } } while (0 == y && 0 == Na || null != Pa.search([y, Na], 0, w)); return Pa.toStr(Pa.search([y, Na], n).reverse(), "URF", "'2 ")
    } var Pa =
        new mathlib.Solver(3, 3, [[0, [Oa, "p", 7], 5040], [0, [z, "o", 7, -3], 729]]), f = [[0, 2, 3, 1], [0, 1, 5, 4], [0, 4, 6, 2]], bb = [null, [0, 1, 0, 1, 3], [1, 0, 1, 0, 3]], h = new mathlib.coord("o", 7, -3), Na = [[3, 4, 9], [1, 20, 5], [2, 8, 17], [0, 16, 21], [13, 11, 6], [15, 7, 22], [12, 19, 10]], Qa = [0, 1, 2, 3, 8, 9, 4, 5, 20, 21, 16, 17], x = [0, 17, 5, 14, 8, 1, 2, 4], Ta = [[4, 5, 6], [4, 6, 5], [6, 5, 4], [5, 4, 6], [5, 6, 4], [6, 4, 5]], Ua = [[12816, 4641, 2, "H-1"], [12576, 4641, 2, "H-2"], [8976, 4641, 4, "H-3"], [12306, 4641, 4, "H-4"], [786, 528, 4, "L-1"], [8976, 528, 4, "L-2"], [531, 528, 4, "L-3"], [12816, 528, 4, "L-4"],
        [8211, 528, 4, "L-5"], [12306, 528, 4, "L-6"], [12816, 4626, 4, "Pi-1"], [531, 4626, 4, "Pi-2"], [8976, 4626, 4, "Pi-3"], [8211, 4626, 4, "Pi-4"], [12306, 4626, 4, "Pi-5"], [786, 4626, 4, "Pi-6"], [12816, 8736, 4, "S-1"], [531, 8736, 4, "S-2"], [786, 8736, 4, "S-3"], [12306, 8736, 4, "S-4"], [8211, 8736, 4, "S-5"], [8976, 8736, 4, "S-6"], [8976, 4128, 4, "T-1"], [8211, 4128, 4, "T-2"], [531, 4128, 4, "T-3"], [12816, 4128, 4, "T-4"], [12306, 4128, 4, "T-5"], [786, 4128, 4, "T-6"], [531, 8208, 4, "U-1"], [12816, 8208, 4, "U-2"], [786, 8208, 4, "U-3"], [12306, 8208, 4, "U-4"], [8976, 8208, 4, "U-5"],
        [8211, 8208, 4, "U-6"], [12816, 4113, 4, "aS-1"], [531, 4113, 4, "aS-2"], [786, 4113, 4, "aS-3"], [12306, 4113, 4, "aS-4"], [8976, 4113, 4, "aS-5"], [8211, 4113, 4, "aS-6"]], Wa = [[291, 545, 4, "Hammer-1"], [12321, 545, 4, "Hammer-2"], [306, 545, 4, "Hammer-3"], [561, 545, 4, "Hammer-4"], [801, 545, 4, "Hammer-5"], [8961, 545, 4, "Hammer-6"], [291, 4130, 4, "Spaceship-1"], [8961, 4130, 4, "Spaceship-2"], [4896, 4130, 4, "Spaceship-3"], [12321, 4130, 4, "Spaceship-4"], [12306, 4130, 4, "Spaceship-5"], [561, 4130, 4, "Spaceship-6"], [8241, 2, 4, "Stollery-1"], [12576, 2, 4, "Stollery-2"],
        [12801, 2, 4, "Stollery-3"], [8451, 2, 4, "Stollery-4"], [561, 2, 4, "Stollery-5"], [8496, 2, 4, "Stollery-6"], [291, 8738, 1, "Pinwheel-1"], [4146, 8738, 1, "Pinwheel-2"], [12801, 8738, 4, "Pinwheel-3"], [8241, 272, 2, "2Face-1"], [12546, 272, 4, "2Face-2"], [531, 272, 2, "2Face-3"], [12321, 272, 4, "2Face-4"], [4866, 290, 4, "Turtle-1"], [4146, 290, 4, "Turtle-2"], [12801, 290, 4, "Turtle-3"], [4656, 290, 4, "Turtle-4"], [8976, 290, 4, "Turtle-5"], [801, 290, 4, "Turtle-6"], [12816, 4370, 4, "Pinwheel Poser-1"], [12576, 4370, 4, "Pinwheel Poser-2"], [12801, 4370, 4, "Pinwheel Poser-3"],
        [8451, 4370, 4, "Pinwheel Poser-4"], [8976, 4370, 4, "Pinwheel Poser-5"], [8496, 4370, 4, "Pinwheel Poser-6"], [8241, 17, 4, "Gun-1"], [4146, 17, 4, "Gun-2"], [306, 17, 4, "Gun-3"], [12321, 17, 4, "Gun-4"], [8976, 17, 4, "Gun-5"], [8496, 17, 4, "Gun-6"]], Ra = [[4866, 4609, 4, "Hammer-1"], [12321, 4609, 4, "Hammer-2"], [8976, 4609, 4, "Hammer-3"], [12801, 4609, 4, "Hammer-4"], [4611, 4609, 4, "Hammer-5"], [12576, 4609, 4, "Hammer-6"], [291, 4114, 4, "Spaceship-1"], [4146, 4114, 4, "Spaceship-2"], [786, 4114, 4, "Spaceship-3"], [12801, 4114, 4, "Spaceship-4"], [4131, 4114, 4,
            "Spaceship-5"], [8496, 4114, 4, "Spaceship-6"], [291, 1, 4, "Stollery-1"], [12576, 1, 4, "Stollery-2"], [306, 1, 4, "Stollery-3"], [8451, 1, 4, "Stollery-4"], [12546, 1, 4, "Stollery-5"], [4611, 1, 4, "Stollery-6"], [291, 4369, 1, "Pinwheel-1"], [4146, 4369, 1, "Pinwheel-2"], [4896, 4369, 4, "Pinwheel-3"], [8241, 8194, 2, "2Face-1"], [306, 8194, 4, "2Face-2"], [4146, 8194, 2, "2Face-3"], [12321, 8194, 4, "2Face-4"], [8241, 4354, 4, "Turtle-1"], [12576, 4354, 4, "Turtle-2"], [4131, 4354, 4, "Turtle-3"], [12321, 4354, 4, "Turtle-4"], [306, 4354, 4, "Turtle-5"], [4611, 4354, 4,
            "Turtle-6"], [4866, 8482, 4, "Pinwheel Poser-1"], [531, 8482, 4, "Pinwheel Poser-2"], [8211, 8482, 4, "Pinwheel Poser-3"], [786, 8482, 4, "Pinwheel Poser-4"], [8976, 8482, 4, "Pinwheel Poser-5"], [801, 8482, 4, "Pinwheel Poser-6"], [291, 34, 4, "Gun-1"], [4146, 34, 4, "Gun-2"], [306, 34, 4, "Gun-3"], [8976, 34, 4, "Gun-4"], [786, 34, 4, "Gun-5"], [8496, 34, 4, "Gun-6"]], $a = [[0, "LS1-PBL"], [546, "LS1-Sune"], [273, "LS1-aSune"], [258, "LS1-Ua"], [33, "LS1-Ub"], [288, "LS1-La"], [528, "LS1-Lb"], [513, "LS1-Ta"], [18, "LS1-Tb"], [66081, "LS2-Hammer"], [66066, "LS2-Spaceship"],
            [66048, "LS2-StolleryA"], [65538, "LS2-StolleryB"], [65568, "LS2-StolleryC"], [65808, "LS2-2Face"], [65826, "LS2-Turtle"], [65553, "LS2-GunA"], [65793, "LS2-GunB"], [131346, "LS3-Hammer"], [131601, "LS3-Spaceship"], [131328, "LS3-StolleryA"], [131073, "LS3-StolleryB"], [131088, "LS3-StolleryC"], [131616, "LS3-2Face"], [131361, "LS3-Turtle"], [131106, "LS3-GunA"], [131586, "LS3-GunB"], [8226, "LS4-SuneA"], [8736, "LS4-SuneB"], [8706, "LS4-SuneC"], [8721, "LS4-PiA"], [8481, "LS4-PiB"], [8208, "LS4-U"], [8193, "LS4-L"], [8448, "LS4-T"], [8466, "LS4-H"],
            [73746, "LS5-HammerA"], [73986, "LS5-HammerB"], [74016, "LS5-SpaceshipA"], [74241, "LS5-SpaceshipB"], [73728, "LS5-Stollery"], [74274, "LS5-Pinwheel"], [73761, "LS5-TurtleA"], [74256, "LS5-TurtleB"], [74001, "LS5-Pinwheel Poser"], [139536, "LS6-Hammer"], [139521, "LS6-Spaceship"], [139266, "LS6-2Face"], [139281, "LS6-Turtle"], [139554, "LS6-Pinwheel PoserA"], [139809, "LS6-Pinwheel PoserB"], [139794, "LS6-Pinwheel PoserC"], [139776, "LS6-GunA"], [139296, "LS6-GunB"], [4113, "LS7-aSuneA"], [4368, "LS7-aSuneB"], [4353, "LS7-aSuneC"], [4626,
                "LS7-PiA"], [4386, "LS7-PiB"], [4608, "LS7-U"], [4098, "LS7-L"], [4128, "LS7-T"], [4641, "LS7-H"], [70176, "LS8-Hammer"], [69666, "LS8-Spaceship"], [69633, "LS8-2Face"], [70146, "LS8-Turtle"], [69921, "LS8-Pinwheel PoserA"], [69906, "LS8-Pinwheel PoserB"], [70161, "LS8-Pinwheel PoserC"], [69648, "LS8-GunA"], [69888, "LS8-GunB"], [135681, "LS9-HammerA"], [135201, "LS9-HammerB"], [135186, "LS9-SpaceshipA"], [135456, "LS9-SpaceshipB"], [135168, "LS9-Stollery"], [135441, "LS9-Pinwheel"], [135426, "LS9-TurtleA"], [135696, "LS9-TurtleB"], [135714,
                "LS9-Pinwheel Poser"]], Va = mathlib.idxArray(Ua, 2), y = mathlib.idxArray(Ua, 3), db = mathlib.idxArray(Wa, 2), mb = mathlib.idxArray(Wa, 3), cb = mathlib.idxArray(Ra, 2), lb = mathlib.idxArray(Ra, 3), gb = mathlib.valuedArray($a.length, 1), Ya = mathlib.idxArray($a, 1); scrMgr.reg(["222o", "222so", "222nb"], a)("222eg0", b, [y, Va, e.bind(null, !1, Ua, y)])("222eg1", b, [y, Va, e.bind(null, !1, Ua, y)])("222eg2", b, [y, Va, e.bind(null, !1, Ua, y)])("222tcp", b, [mb, db, e.bind(null, !1, Wa, mb)])("222tcn", b, [lb, cb, e.bind(null, !1, Ra, lb)])("222lsall", b, [Ya, gb,
                    e.bind(null, !0, $a, Ya)])("222eg", a, ["EG0-O EG0-H EG0-L EG0-Pi EG0-S EG0-T EG0-U EG0-aS EG1B-O EG1B-H EG1B-L EG1B-Pi EG1B-S EG1B-T EG1B-U EG1B-aS EG1L-O EG1L-H EG1L-L EG1L-Pi EG1L-S EG1L-T EG1L-U EG1L-aS EG1F-O EG1F-H EG1F-L EG1F-Pi EG1F-S EG1F-T EG1F-U EG1F-aS EG1R-O EG1R-H EG1R-L EG1R-Pi EG1R-S EG1R-T EG1R-U EG1R-aS EG2-O EG2-H EG2-L EG2-Pi EG2-S EG2-T EG2-U EG2-aS".split(" "), [1, 2, 4, 4, 4, 4, 4, 4, 1, 2, 4, 4, 4, 4, 4, 4, 1, 2, 4, 4, 4, 4, 4, 4, 1, 2, 4, 4, 4, 4, 4, 4, 1, 2, 4, 4, 4, 4, 4, 4, 1, 2, 4, 4, 4, 4, 4, 4]]); return {
                        getEGLLImage: e.bind(null,
                            Ua, y)
                    }
}(mathlib.rn); (function () {
    function c(a, b) { mathlib.acycle(a, [0, b + 1]) } function Oa(a, b) { var c = mathlib.set8Perm([], ~~(a / 3), 4); mathlib.acycle(c, f[b]); return 3 * mathlib.get8Perm(c, 4) + (a % 3 + (0 == b ? 1 : 0)) % 3 } function z(b, c, f) { return 72 * e[f][~~(c / 72)] + a[(f + b) % 3][c % 72] } function r(b, c, f, z) {
        if (0 == c) return 0 == b[0] && 0 == b[1] && 0 == b[2] && 0 == b[3]; if (Math.max(mathlib.getPruning(Pa[0], 72 * b[0] + b[1]), mathlib.getPruning(Pa[1], 72 * b[0] + b[2]), mathlib.getPruning(Pa[2], 72 * b[0] + b[3])) > c) return !1; for (var h = 0; 3 > h; h++)if (h != f) for (var Na = b.slice(),
            Qa = 0; 11 > Qa; Qa++) { Na[0] = e[h][Na[0]]; for (var Oa = 1; 4 > Oa; Oa++)Na[Oa] = a[(h + Oa - 1) % 3][Na[Oa]]; if (r(Na, c - 1, h, z)) return z.push("URF".charAt(h) + "' 2' 3' 4' 5' 6 5 4 3 2 ".split(" ")[Qa]), !0 }
    } function b() { b = $.noop; mathlib.createMove(a, 72, Oa, 3); mathlib.createMove(e, 24, [c, "p", 4], 3); for (var f = 0; 3 > f; f++)mathlib.createPrun(Pa[f], 0, 1728, 5, z.bind(null, f), 3, 12, 0) } var e = [], a = [], Pa = [[], [], []], f = [[0, 3, 2, 1], [0, 1], [0, 3]]; scrMgr.reg(["gearo", "gearso"], function (a) {
        b(); do {
            var c = [mathlib.rn(24)]; for (var e = 0; 3 > e; e++) {
                do c[e +
                    1] = mathlib.rn(72); while (15 == mathlib.getPruning(Pa[e], 72 * c[0] + c[e + 1]))
            }
        } while (0 == c); a = "gearso" == a ? 4 : 0; for (e = []; !r(c, a, -1, e);)a++; return e.reverse().join(" ")
    })
})(); (function () { var c = new mathlib.Solver(4, 1, [[0, function (c, r) { var b = mathlib.set8Perm([], c >> 4, 4); mathlib.acycle(b, Oa[r]); return (mathlib.get8Perm(b, 4) << 4) + (c & 15 ^ 1 << r) }, 384]]), Oa = [[0, 1], [2, 3], [0, 3], [1, 2]]; scrMgr.reg("133", function () { var z = 1 + mathlib.rn(191); z = 2 * z + ((mathlib.getNParity(z >> 3, 4) ^ z >> 1 ^ z >> 2 ^ z) & 1); return c.toStr(c.search([z], 0), "RLFB", [""]) }) })(); (function (c, Oa) {
    function z() { z = $.noop; for (var a = [], r, f = 0; 40320 > f; f++)b[f] = []; for (f = 0; 40320 > f; f++)mathlib.set8Perm(a, f), c(a, 0, 1, 2, 3), r = b[0][f] = Oa(a), c(a, 4, 5, 6, 7), r = b[1][r] = Oa(a), c(a, 2, 5)(a, 3, 6), r = b[2][r] = Oa(a), c(a, 0, 5)(a, 3, 4), b[3][r] = Oa(a); mathlib.createPrun(e, 0, 40320, 12, b, 4, 3) } function r(a, z, f, bb, h) {
        if (0 == f) return 0 == a + z; if (mathlib.getPruning(e, a) > f) return !1; var Na, Qa; for (Qa = 0; 4 > Qa; Qa++)if (Qa != bb) {
            var x = a; var Pa = z; for (Na = 0; Na < (2 > Qa ? 3 : 1); Na++) {
                x = b[Qa][x]; var Ua = Qa; 2 > Ua || (Pa = mathlib.set8Perm([], Pa,
                    3), 2 == Ua ? c(Pa, 0, 1) : 3 == Ua && c(Pa, 0, 2), Pa = Oa(Pa, 3)); if (r(x, Pa, f - 1, Qa, h)) return h.push(["U", "D", "R2", "F2"][Qa] + (2 > Qa ? " 2'".charAt(Na) : "")), !0
            }
        }
    } var b = [], e = []; scrMgr.reg("223", function () { z(); do { var a = mathlib.rn(40320); var b = mathlib.rn(6) } while (0 == b + a); for (var c = [], e = 0; 99 > e && !r(a, b, e, -1, c); e++); return c.reverse().join(" ") })
})(mathlib.circle, mathlib.get8Perm); var clock = function (c, Oa) {
    function z(a, b, c, e, r) { for (var f = a[0].length; e < f; e++)a[c][e] = (a[c][e] + a[b][e] * r) % 12 } var r = [[0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0], [0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0], [1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0], [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0], [1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0], [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0], [11, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0], [0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 1, 1, 1], [0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 1, 1, 0, 1], [0, 0, 11, 0, 0, 0, 0, 0, 0, 1, 1,
        1, 0, 0], [11, 0, 11, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0], [11, 0, 0, 0, 0, 0, 11, 0, 0, 1, 0, 1, 1, 1], [0, 0, 0, 0, 0, 0, 11, 0, 11, 0, 1, 1, 1, 1], [0, 0, 11, 0, 0, 0, 0, 0, 11, 1, 1, 1, 0, 1], [11, 0, 11, 0, 0, 0, 11, 0, 11, 1, 1, 1, 1, 1]], b = [-1, 1, -1, -1, -1, 5, -1, 7, -1, -1, -1, 11], e = [7695, 42588, 47187, 85158, 86697, 156568, 181700, 209201, 231778], a = "UR DR DL UL U R D L ALL".split(" "); scrMgr.reg("clko", function (Pa) {
            var f = []; for (Pa = 0; 14 > Pa; Pa++)f[Pa] = c(12); Pa = []; Pa.length = 18; if (14 == f.length && 18 == Pa.length) for (var bb = 15, h = 0; h < Oa[18][14]; h++) {
                var Na = h; var Qa = 14; for (var x = 0, Ta = 17; 0 <=
                    Ta; Ta--)Na >= Oa[Ta][Qa] && (Na -= Oa[Ta][Qa--], x |= 1 << Ta); Qa = x; Na = !1; for (x = 0; x < e.length; x++)if ((Qa & e[x]) == e[x]) { Na = !0; break } if (!Na) {
                        Na = []; for (x = Ta = 0; 18 > x; x++)1 == (Qa >> x & 1) && (Na[Ta++] = x); Qa = []; for (Ta = 0; 14 > Ta; Ta++) { Qa[Ta] = []; for (x = 0; 14 > x; x++)Qa[Ta][x] = r[Na[x]][Ta]; Qa[Ta][14] = f[Ta] } b: {
                            x = Qa; Ta = x[0].length; for (var Ua = 0; Ua < Ta - 1; Ua++) {
                                if (-1 == b[x[Ua][Ua]]) {
                                    for (var Wa = -1, Ra = Ua + 1; 14 > Ra; Ra++)if (-1 != b[x[Ra][Ua]]) { Wa = Ra; break } if (-1 == Wa) c: for (Ra = Ua; 13 > Ra; Ra++)for (var $a = Ra + 1; 14 > $a; $a++)if (-1 != b[(x[Ra][Ua] + x[$a][Ua]) %
                                        12]) { z(x, $a, Ra, Ua, 1); Wa = Ra; break c } if (-1 == Wa) { for (Ra = Ua + 1; 14 > Ra; Ra++)if (0 != x[Ra][Ua]) { x = -1; break b } x = Ua + 1; break b } Ra = x; $a = Ra[Ua]; Ra[Ua] = Ra[Wa]; Ra[Wa] = $a
                                } Wa = b[x[Ua][Ua]]; for (Ra = Ua; Ra < Ta; Ra++)x[Ua][Ra] = x[Ua][Ra] * Wa % 12; for (Ra = Ua + 1; 14 > Ra; Ra++)z(x, Ua, Ra, Ua, 12 - x[Ra][Ua])
                            } x = 0
                        } if (0 == x) {
                            x = !0; for (Ta = 14; 14 > Ta; Ta++)if (0 != Qa[Ta][14]) { x = !1; break } if (x) {
                                x = Qa; for (Ta = x[0].length - 2; 0 < Ta; Ta--)for (Ua = Ta - 1; 0 <= Ua; Ua--)0 != x[Ua][Ta] && z(x, Ta, Ua, Ta, 12 - x[Ua][Ta]); for (Ta = x = 0; 14 > Ta; Ta++)0 != Qa[Ta][14] && x++; if (x < bb) {
                                    for (Ta = 0; 18 >
                                        Ta; Ta++)Pa[Ta] = 0; for (Ta = 0; 14 > Ta; Ta++)Pa[Na[Ta]] = Qa[Ta][14]; bb = x
                                }
                            }
                        }
                    }
            } f = ""; for (bb = 0; 9 > bb; bb++)h = Pa[bb], 0 != h && (Na = 6 >= h, 6 < h && (h = 12 - h), f += a[bb] + h + (Na ? "+" : "-") + " "); f += "y2 "; for (bb = 0; 9 > bb; bb++)h = Pa[bb + 9], 0 != h && (Na = 6 >= h, 6 < h && (h = 12 - h), f += a[bb] + h + (Na ? "+" : "-") + " "); Pa = !0; for (bb = 0; 4 > bb; bb++)1 == c(2) && (f += (Pa ? "" : " ") + a[bb], Pa = !1); return f
        }); return { moveArr: r }
}(mathlib.rn, mathlib.Cnk); (function () {
    var c = [[0, 1, 2, 3], [0, 2, 5, 4]], Oa = [[0, 0, 0, 0, 2], [0, 1, 0, 1, 2]], z = new mathlib.Solver(2, 3, [[0, function (r, b) { var e = r >> 3, a = r, z = r << 1 | mathlib.getNParity(e, 6) ^ a >> 1 & 1; e = mathlib.set8Perm([], e, 6); mathlib.acycle(e, c[b]); 0 == b && (a += 2); 1 == b && (z += 1); return mathlib.getNPerm(e, 6) << 3 | a & 6 | z >> 1 & 1 }, 5760], [0, [function (r, b) { mathlib.acycle(r, c[b], 1, Oa[b]) }, "o", 6, -2], 32]]); scrMgr.reg("lsemu", function () {
        do { var c = mathlib.rn(5760); var b = mathlib.rn(32) } while (0 == b + c); return z.toStr(z.search([c, b], 0), "UM", " 2'").replace(/ +/g,
            " ")
    })
})(); (function () {
    function c(a, c, f) {
        f = c = 0; do "mlsll" == a ? (c = mathlib.rn(11520), f = mathlib.rn(87480)) : "mgmpll" == a ? (c = 32 * Oa.get(mathlib.rndPerm(5, !0).concat([5])), f = 243 * r.get(mathlib.rndPerm(5, !0).concat([5]))) : "mgmll" == a && (c = z.set([], mathlib.rn(32)), c[0] += c[5], c[5] = 0, f = b.set([], mathlib.rn(243)), f[0] += f[5], f[5] = 0, c = 32 * Oa.get(mathlib.rndPerm(5, !0).concat([5])) + z.get(c), f = 243 * r.get(mathlib.rndPerm(5, !0).concat([5])) + b.get(f)); while (0 == c && 0 == f); a = e.search([c, f], 0); c = []; for (f = 0; f < a.length; f++) {
            var Pa = a[f]; c.push(["U",
                "R U", "F' U"][Pa[0]] + ["", "2", "2'", "'"][Pa[1]] + ["", " R'", " F"][Pa[0]])
        } return c.join(" ").replace(/ +/g, " ")
    } var Oa = new mathlib.coord("p", 6, -1), z = new mathlib.coord("o", 6, -2), r = new mathlib.coord("p", 6, -1), b = new mathlib.coord("o", 6, -3), e = new mathlib.Solver(3, 4, [[0, function (a, b) {
        var c = Oa.set([], a >> 5), e = z.set([], a & 31); 0 == b ? (mathlib.acycle(e, [0, 1, 2, 3, 4], 1), mathlib.acycle(c, [0, 1, 2, 3, 4], 1)) : 1 == b ? (mathlib.acycle(e, [0, 1, 2, 3, 5], 1), mathlib.acycle(c, [0, 1, 2, 3, 5], 1)) : 2 == b && (mathlib.acycle(e, [1, 2, 3, 4, 5], 1, [0, 0, 0,
            0, 1, 2]), mathlib.acycle(c, [1, 2, 3, 4, 5])); return Oa.get(c) << 5 | z.get(e)
    }, 11520], [0, function (a, c) { var e = r.set([], ~~(a / 243)), z = b.set([], a % 243); 0 == c ? (mathlib.acycle(z, [0, 1, 2, 3, 4], 1), mathlib.acycle(e, [0, 1, 2, 3, 4], 1)) : 1 == c ? (mathlib.acycle(z, [0, 5, 1, 2, 3], 1, [2, 0, 0, 0, 0, 3]), mathlib.acycle(e, [0, 5, 1, 2, 3])) : 2 == c && (mathlib.acycle(z, [0, 2, 3, 4, 5], 1, [1, 0, 0, 0, 1, 3]), mathlib.acycle(e, [0, 2, 3, 4, 5])); return 243 * r.get(e) + b.get(z) }, 87480]]); scrMgr.reg("mlsll", c)("mgmpll", c)("mgmll", c)
})(); var kilominx = function () {
    function c() { this.perm = []; this.twst = []; for (var a = 0; 20 > a; a++)this.perm[a] = a, this.twst[a] = 0 } function Oa() {
        for (var a = [], b = [], e = 0; 48 > e; e++)a[e] = new c; for (var f = 0; 48 > f; f += 4) { a[f].faceletMove(f >> 2, 1, 0); b[f] = a[f].hashCode(); for (var h = 0; 3 > h; h++)c.KiloMult(a[f + h], a[f], a[f + h + 1]), b[f + h + 1] = a[f + h + 1].hashCode() } c.moveCube = a; f = []; h = []; var y = [], r = [], x = [], Na = new c; for (e = 0; 60 > e; e++)f[e] = (new c).init(Na.perm, Na.twst), x[e] = f[e].hashCode(), h[e] = [], y[e] = [], Na.faceletMove(0, 1, 1), 4 == e % 5 && Na.faceletMove(4 ==
            e % 10 ? 1 : 2, 1, 1), 29 == e % 30 && (Na.faceletMove(1, 2, 1), Na.faceletMove(2, 1, 1), Na.faceletMove(0, 3, 1)); for (e = 0; 60 > e; e++)for (var z = 0; 60 > z; z++) { c.KiloMult(f[e], f[z], Na); var Va = x.indexOf(Na.hashCode()); h[e][z] = Va; y[Va][z] = e } for (e = 0; 60 > e; e++)for (r[e] = [], z = 0; 12 > z; z++)c.KiloMult3(f[y[0][e]], a[4 * z], f[e], Na), Va = b.indexOf(Na.hashCode()), r[e][z] = Va >> 2; c.symCube = f; c.symMult = h; c.symMulI = y; c.symMulM = r
    } function z(a) {
        this.map = new c; this.imap = new c; this.map.perm = a.slice(); for (var b = 0; 20 > b; b++)-1 == a.indexOf(b) && this.map.perm.push(b);
        this.imap.invFrom(this.map); this.tmp = new c
    } function r(a, b, c) { a = a[c][~~(b / 81 / 24)]; return 1944 * a[0] + 81 * Ta[~~(b / 81) % 24][a[1]] + Wa[Ua[a[1]][b % 81]][a[2]] } function b(a, b, c) { a = a[c][~~(b / 27 / 6)]; return 162 * a[0] + 27 * Ta[~~(b / 27) % 6][a[1]] + Wa[Ua[a[1]][b % 27 * 3] / 3][a[2]] } function e() {
        function b(a, b) { for (var c = 0; 4 > c; c++)a[c] = b % 3, b = ~~(b / 3) } function n(a) { for (var b = 0, c = 3; 0 <= c; c--)b = 3 * b + a[c]; return b } e = $.noop; var h = performance.now(); Oa(); for (var y = [], r = [], x = [], Na = 0; 24 > Na; Na++) {
            Ta[Na] = []; mathlib.setNPerm(y, Na, 4); for (var z =
                0; 24 > z; z++) { mathlib.setNPerm(r, z, 4); for (var Va = 0; 4 > Va; Va++)x[Va] = y[r[Va]]; Ta[Na][z] = mathlib.getNPerm(x, 4) }
        } for (z = 0; 24 > z; z++)for (Ua[z] = [], mathlib.setNPerm(r, z, 4), Na = 0; 81 > Na; Na++) { b(y, Na); for (Va = 0; 4 > Va; Va++)x[Va] = y[r[Va]]; Ua[z][Na] = n(x) } for (z = 0; 81 > z; z++)for (Wa[z] = [], b(r, z), Na = 0; 81 > Na; Na++) { b(y, Na); for (Va = 0; 4 > Va; Va++)x[Va] = (y[Va] + r[Va]) % 3; Wa[z][Na] = n(x) } y = new c; r = new c; for (x = 0; 12 > x; x++)for (Ra[x] = 1 << x, Na = 0; Na < x; Na++)c.KiloMult(c.moveCube[4 * x], c.moveCube[4 * Na], y), c.KiloMult(c.moveCube[4 * Na], c.moveCube[4 *
            x], r), y.isEqual(r) && (Ra[x] |= 1 << Na); a(); Pa(); f(); DEBUG && console.log("[kilo] init finished, tt=", performance.now() - h)
    } function a() { Ya = new z([5, 6, 7, 8, 9]); var a = new c, e = new c; mathlib.createMove(y, 1140, function (b, n) { Ya.set(a, b, 3); c.KiloMult(a, c.moveCube[4 * n], e); return Ya.get(e, 3) }, 12); mathlib.createPrun(cb, 0, 184680, 8, b.bind(null, y), 12, 4, 5) } function Pa() {
        fb = new z([13, 15, 16, 0, 1, 2, 3, 4, 10, 11, 12, 14, 17, 18, 19]); var a = new c, e = new c; mathlib.createMove(db, 455, function (b, n) {
            fb.set(a, b, 3); c.KiloMult(a, c.moveCube[4 *
                n], e); return fb.get(e, 3)
        }, 6); mathlib.createPrun(lb, 0, 73710, 8, b.bind(null, db), 6, 4, 4)
    } function f() { Xa = new z([0, 1, 2, 3, 4, 10, 11, 14, 17, 18]); var a = new c, b = new c; mathlib.createMove(mb, 210, function (e, n) { Xa.set(a, e); c.KiloMult(a, c.moveCube[4 * n], b); return Xa.get(b) }, 3); mathlib.createPrun(gb, 0, 408240, 14, r.bind(null, mb), 3, 4, 6) } function bb(a, b, c, e, f, h, y, r) {
        if (0 == h) return b(a); if (c(a) > h) return !1; for (var n = 0; n < f; n++)if (!(Ra[y] >> n & 1)) for (var w = a, Sa = 0; 4 > Sa; Sa++) {
            w = e(w, n); if (null == w) break; if (bb(w, b, c, e, f, h - 1, n, r)) return r.push([n,
                Sa]), !0
        } return !1
    } function h(a, b, c, e, f, h) { for (var n = [], w = 0; w <= h && !bb(a, b, c, e, f, w, -1, n); w++); n.reverse(); return n } function Na(a) { for (var b = [], c = 0; c < a.length; c++)b.push("U R F L BL BR DR DL DBL B DBR D".split(" ")[a[c][0]] + ["", "2", "2'", "'"][a[c][1]]); return b.join(" ") } function Qa(a) {
        e(); var n = new c, f = new c; n.init(a.perm, a.twst); var w = b.bind(null, y), x = Ya.get(n, 3); c.KiloMult3(c.symCube[c.symMulI[0][2]], n, c.symCube[2], f); var z = Ya.get(f, 3); z = [162 * x[0] + 27 * x[1] + x[2], 162 * z[0] + 27 * z[1] + z[2]]; x = +new Date; a = h(z,
            function (a) { return 0 == a[0] && 0 == a[1] }, function (a) { return Math.max(mathlib.getPruning(cb, a[0]), mathlib.getPruning(cb, a[1])) }, function (a, b) { var c = [w(a[0], b), w(a[1], $a[b])]; return c[0] == a[0] && c[1] == a[1] ? null : c }, 12, 9); for (z = 0; z < a.length; z++) { var Ra = a[z]; c.KiloMult(n, c.moveCube[4 * Ra[0] + Ra[1]], f); n.init(f.perm, f.twst) } DEBUG && console.log("[kilo] Phase1 in ", +new Date - x); var Qa = b.bind(null, db); x = fb.get(n, 3); c.KiloMult3(c.symCube[c.symMulI[0][1]], n, c.symCube[1], f); z = fb.get(f, 3); z = [162 * x[0] + 27 * x[1] + x[2], 162 *
                z[0] + 27 * z[1] + z[2]]; x = +new Date; var Pa = h(z, function (a) { return 0 == a[0] && 0 == a[1] }, function (a) { return Math.max(mathlib.getPruning(lb, a[0]), mathlib.getPruning(lb, a[1])) }, function (a, b) { var c = [Qa(a[0], b), Qa(a[1], Va[b])]; return c[0] == a[0] && c[1] == a[1] ? null : c }, 6, 14); for (z = 0; z < Pa.length; z++)Ra = Pa[z], c.KiloMult(n, c.moveCube[4 * Ra[0] + Ra[1]], f), n.init(f.perm, f.twst); DEBUG && console.log("[kilo] Phase2 in ", +new Date - x); var Ta = r.bind(null, mb); x = Xa.get(n); c.KiloMult3(c.symCube[c.symMulI[0][6]], n, c.symCube[6], f); z = Xa.get(f);
        c.KiloMult3(c.symCube[c.symMulI[0][29]], n, c.symCube[29], f); n = Xa.get(f); z = [1944 * x[0] + 81 * x[1] + x[2], 1944 * z[0] + 81 * z[1] + z[2], 1944 * n[0] + 81 * n[1] + n[2]]; x = +new Date; n = h(z, function (a) { return 0 == a[0] && 0 == a[1] && 0 == a[2] }, function (a) { return Math.max(mathlib.getPruning(gb, a[0]), mathlib.getPruning(gb, a[1]), mathlib.getPruning(gb, a[2])) }, function (a, b) { return [Ta(a[0], b), Ta(a[1], (b + 1) % 3), Ta(a[2], (b + 2) % 3)] }, 3, 14); DEBUG && console.log("[kilo] Phase3 in ", +new Date - x); DEBUG && console.log("[kilo] total length: ", a.length + Pa.length +
            n.length); return Na(Array.prototype.concat(a, Pa, n))
    } c.SOLVED = new c; var x = [[2, 8, 14], [3, 13, 19], [4, 18, 24], [0, 23, 29], [1, 28, 9], [58, 45, 41], [57, 50, 46], [56, 30, 51], [55, 35, 31], [59, 40, 36], [10, 7, 33], [15, 12, 38], [20, 17, 43], [25, 22, 48], [5, 27, 53], [49, 21, 42], [54, 26, 47], [34, 6, 52], [39, 11, 32], [44, 16, 37]]; c.prototype.toFaceCube = function (a) { a = a || x; for (var b = [], c = 0; 20 > c; c++)for (var e = this.perm[c], f = this.twst[c], w = 0; 3 > w; w++)b[a[c][(w + f) % 3]] = ~~(a[e][w] / 5); return b }; c.prototype.fromFacelet = function (a, b) {
        b = b || x; for (var c = 0,
            e = [], n = 0; 60 > n; ++n)e[n] = a[n], c += Math.pow(16, e[n]); if (93824992236885 != c) return -1; for (n = 0; 20 > n; n++)for (c = 0; 20 > c; c++) { for (var f = -1, w = 0; 3 > w; w++)if (~~(b[c][0] / 5) == e[b[n][w]] && ~~(b[c][1] / 5) == e[b[n][(w + 1) % 3]] && ~~(b[c][2] / 5) == e[b[n][(w + 2) % 3]]) { f = w; break } -1 != f && (this.perm[n] = c, this.twst[n] = f) } return this
    }; c.prototype.hashCode = function () { for (var a = 0, b = 0; 20 > b; b++)a = 0 | 31 * a + 3 * this.perm[b] + this.twst[b]; return a }; c.KiloMult = function (a, b, c) {
        for (var e = 0; 20 > e; e++)c.perm[e] = a.perm[b.perm[e]], c.twst[e] = (a.twst[b.perm[e]] +
            b.twst[e]) % 3
    }; c.KiloMult3 = function (a, b, c, e) { for (var n = 0; 20 > n; n++)e.perm[n] = a.perm[b.perm[c.perm[n]]], e.twst[n] = (a.twst[b.perm[c.perm[n]]] + b.twst[c.perm[n]] + c.twst[n]) % 3 }; c.prototype.invFrom = function (a) { for (var b = 0; 20 > b; b++)this.perm[a.perm[b]] = b, this.twst[a.perm[b]] = (3 - a.twst[b]) % 3; return this }; c.prototype.init = function (a, b) { this.perm = a.slice(); this.twst = b.slice(); return this }; c.prototype.isEqual = function (a) { for (var b = 0; 20 > b; b++)if (this.perm[b] != a.perm[b] || this.twst[b] != a.twst[b]) return !1; return !0 };
    c.prototype.setComb = function (a, b) { b = b || 4; for (var c = 19, e = 19; 0 <= e; e--)a >= mathlib.Cnk[e][b] ? (a -= mathlib.Cnk[e][b--], this.perm[e] = b) : this.perm[e] = c--, this.twst[e] = 0 }; c.prototype.getComb = function (a) { for (var b = a = a || 4, c = 0, e = 0, f = [], w = 19; 0 <= w; w--)this.perm[w] < b && (c += mathlib.Cnk[w][a--], e = 3 * e + this.twst[w], f[a] = this.perm[w]); return [c, mathlib.getNPerm(f, b), e] }; c.prototype.faceletMove = function (a, b, c) {
        for (var e = this.toFaceCube(), n = [], f = 0; 12 > f; f++) {
            for (var w = 0; 5 > w; w++)n[11 * f + w] = e[5 * f + w], n[11 * f + w + 5] = 0; n[11 * f + 10] =
                0
        } mathlib.minx.doMove(n, a, b, c); for (f = 0; 12 > f; f++)for (w = 0; 5 > w; w++)e[5 * f + w] = n[11 * f + w]; this.fromFacelet(e)
    }; z.prototype.get = function (a, b) { c.KiloMult3(this.imap, a, this.map, this.tmp); return this.tmp.getComb(b) }; z.prototype.set = function (a, b, e) { this.tmp.setComb(b, e); c.KiloMult3(this.map, this.tmp, this.imap, a) }; c.CombCoord = z; var Ta = [], Ua = [], Wa = [], Ra = [], $a = [0, 3, 4, 5, 1, 2, 8, 9, 10, 6, 7, 11], Va = [0, 2, 3, 4, 5, 1, 7, 8, 9, 10, 6, 11], y = [], db = [], mb = [], cb = [], lb = [], gb = [], Ya, fb, Xa; scrMgr.reg("klmso", function () {
        e(); var a = new c; a.perm =
            mathlib.rndPerm(20, !0); for (var b = 60, f = 0; 19 > f; f++) { var h = mathlib.rn(3); a.twst[f] = h; b -= h } a.twst[19] = b % 3; return Qa(a)
    }); return c
}(); (function (c, Oa, z) {
    function r(a, b, e, f) { void 0 == f && (f = [""]); for (var h = 0, r, x = [], Na = 0; Na < e; Na++) { do r = c(a.length); while (h >> r & 1); x.push(a[r] + Oa(f)); h &= ~b[r]; h |= 1 << r } return x.join(" ") } function b(a) { return " " + Oa([a + "=0", a + "+1", a + "+2", a + "+3", a + "+4", a + "+5", a + "+6", a + "-5", a + "-4", a + "-3", a + "-2", a + "-1"]) + " " } function e() { return Oa(["U", "d"]) + Oa(["U", "d"]) } function a(a, b, e, f) {
        for (var h = [[0, -1], [1, 0], [-1, 0], [0, 1]], r = 0, x = 3, Na, z = 5, Va = [], Ra = 0; Ra < b; Ra++) {
            do Na = c(4); while (0 > r + h[Na][0] || 3 < r + h[Na][0] || 0 > x + h[Na][1] || 3 <
                x + h[Na][1] || 3 == Na + z); r += h[Na][0]; x += h[Na][1]; 0 < Va.length && Va[Va.length - 1][0] == Na ? Va[Va.length - 1][1]++ : Va.push([Na, 1]); z = Na
        } b = ""; for (Ra = 0; Ra < Va.length; Ra++)if (h = a ? Va[Ra][0] : 3 - Va[Ra][0], h = (e ? "￪￩￫￬" : "ULRD").charAt(h), f) b += h + (1 == Va[Ra][1] ? "" : Va[Ra][1]) + " "; else for (r = 0; r < Va[Ra][1]; r++)b += h + " "; return b
    } function Pa(a, b) { var c = "", e, f; for (e = 0; e < b; e++) { c += "  "; for (f = 0; f < a; f++)c += (0 == f % 2 ? "R" : "D") + Oa(["++", "--"]) + " "; c += "U" + (c.endsWith("-- ") ? "'\\n" : "~\\n") } return c } function f(a, b) {
        Ta = []; var c; bb(1, a, b); var e =
            ""; for (c = 0; c < Ta[0].length; c++) { var f = Ta[0][c]; e = 7 == f[0] ? e + "/" : e + (" (" + f[0] + "," + f[1] + ") ") } return e
    } function bb(a, b, e) { for (var f = 0; f < a; f++) { Ua = [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0]; Ta[f] = []; for (var y = 0; y < e;) { var r = c(12) - 5, x = 2 == b ? 0 : c(12) - 5, Na = (0 == r ? 0 : 1) + (0 == x ? 0 : 1); (y + Na <= e || 1 != b) && (0 < Na || 0 == y) && h(r, x) && (1 == b && (y += Na), 0 < Na && (Ta[f][Ta[f].length] = [r, x]), y < e || 1 != b) && (y++, Ta[f][Ta[f].length] = [7, 0], h(7, 0)) } } } function h(a, b) {
        var c; if (7 == a) { for (c = 0; 6 > c; c++)mathlib.circle(Ua, c + 6, c + 12); return !0 } if (Ua[(17 -
            a) % 12] || Ua[(11 - a) % 12] || Ua[12 + (17 - b) % 12] || Ua[12 + (11 - b) % 12]) return !1; var e = Ua.slice(0, 12); var f = Ua.slice(12, 24); for (c = 0; 12 > c; c++)Ua[c] = e[(12 + c - a) % 12], Ua[c + 12] = f[(12 + c - b) % 12]; return !0
    } function Na(a, b) { for (var e = 0, f = [], h = 0; 4 > h; h++)f[h] = c(3), 0 < f[h] ? (f[h] = "ulrb".charAt(h) + ["! ", "' "][f[h] - 1], e++) : f[h] = ""; return a.substr(0, a.length - b * e) + " " + f.join("") } var Qa = ["", "2", "'"], x = ["", "2", "'", "2'"], Ta = [], Ua = []; scrMgr.reg("444yj", function (a, b) {
        var e = [["U", "D"], ["R", "L", "r"], ["F", "B", "f"]], f = [], h = 0, r, x = ""; var Na =
            -1; for (r = 0; r < b; r++) { var z = 0; do { var Ra = c(e.length), Pa = c(e[Ra].length); if (Ra != Na || 0 == f[Pa]) { if (Ra == Na) f[Pa] = 1, z = c(Qa.length); else { for (Na = 0; Na < e[Ra].length; Na++)f[Na] = 0; Na = Ra; f[Pa] = 1; z = c(Qa.length) } 0 == Ra && 0 == Pa && (h = (h + 4 + z) % 4); x = 1 == Ra && 2 == Pa ? 0 == h || 3 == h ? x + ("l" + Qa[z] + " ") : x + ("r" + Qa[z] + " ") : 2 == Ra && 2 == Pa ? 0 == h || 1 == h ? x + ("b" + Qa[z] + " ") : x + ("f" + Qa[z] + " ") : x + (e[Ra][Pa] + Qa[z] + " "); z = 1 } } while (0 == z) } return x
    }); scrMgr.reg("bic", function (a, b) {
        function e(a) {
            var b = [], c, e, f, y = 0; for (c = 0; 9 > c; c++) {
                for (e = f = 0; e < b.length; e++)b[e] ==
                    r[h[a][c]] && (f = 1); 0 == f && (b[b.length] = r[h[a][c]], 0 == r[h[a][c]] && (y = 1))
            } return 5 == b.length && 1 == y
        } function f(a, b) { for (var c = 0; c < b; c++) { var e = r[h[a][0]]; r[h[a][0]] = r[h[a][6]]; r[h[a][6]] = r[h[a][4]]; r[h[a][4]] = r[h[a][2]]; r[h[a][2]] = e; e = r[h[a][7]]; r[h[a][7]] = r[h[a][5]]; r[h[a][5]] = r[h[a][3]]; r[h[a][3]] = r[h[a][1]]; r[h[a][1]] = e } } for (var h = [[0, 1, 2, 5, 8, 7, 6, 3, 4], [6, 7, 8, 13, 20, 19, 18, 11, 12], [0, 3, 6, 11, 18, 17, 16, 9, 10], [8, 5, 2, 15, 22, 21, 20, 13, 14]], r = [1, 1, 2, 3, 3, 2, 4, 4, 0, 5, 6, 7, 8, 9, 10, 10, 5, 6, 7, 8, 9, 11, 11], x = "", Na = [], z, Ra, Pa,
            Ta; Na.length < b;) { z = [1, 1, 1, 1]; for (Ra = 0; 4 > Ra; Ra++)1 != z[Ra] || e(Ra) || (z[Ra] = 0); for (Ra = 0; 0 == Ra;)Pa = c(4), 1 == z[Pa] && (Ta = c(3) + 1, f(Pa, Ta), Ra = 1); Na[Na.length] = [Pa, Ta]; 2 <= Na.length && Na[Na.length - 1][0] == Na[Na.length - 2][0] && (Na[Na.length - 2][1] = (Na[Na.length - 2][1] + Na[Na.length - 1][1]) % 4, Na = Na.slice(0, Na.length - 1)); 1 <= Na.length && 0 == Na[Na.length - 1][1] && (Na = Na.slice(0, Na.length - 1)) } for (z = 0; z < b; z++)x += "UFLR"[Na[z][0]] + Qa[Na[z][1] - 1] + " "; return x
    }); scrMgr.reg("15p 15pm 15pat clkwca clk clkc clke giga mgmo mgmp mgmc klmp heli redi redim pyrm prcp mpyr r3 r3ni sq1h sq1t sq2 ssq1t bsq -1 333noob lol".split(" "),
        function (h, Ra) {
            var Qa = ""; switch (h) {
                case "15p": return a(!1, Ra); case "15pm": return a(!0, Ra); case "15pat": return a(!1, Ra, !0, !0); case "clkwca": var Va = "0+ 1+ 2+ 3+ 4+ 5+ 6+ 1- 2- 3- 4- 5-".split(" "); Qa = "UR? DR? DL? UL? U? R? D? L? ALL? y2 U? R? D? L? ALL?????"; for (var y = 0; 14 > y; y++)Qa = Qa.replace("?", Oa(Va)); return Qa.replace("?", Oa(["", " UR"])).replace("?", Oa(["", " DR"])).replace("?", Oa(["", " DL"])).replace("?", Oa(["", " UL"])); case "clk": return "UU" + b("u") + "dU" + b("u") + "dd" + b("u") + "Ud" + b("u") + "dU" + b("u") +
                    "Ud" + b("u") + "UU" + b("u") + "UU" + b("u") + "UU" + b("u") + "dd     " + e() + "\\ndd" + b("d") + "dU" + b("d") + "UU" + b("d") + "Ud" + b("d") + "UU     UU     Ud     dU     UU     dd" + b("d") + e(); case "clkc": Qa = ""; for (y = 0; 4 > y; y++)Qa += "(" + (c(12) - 5) + ", " + (c(12) - 5) + ") / "; for (y = 0; 6 > y; y++)Qa += "(" + (c(12) - 5) + ") / "; for (y = 0; 4 > y; y++)Qa += Oa(["d", "U"]); return Qa; case "clke": return "UU" + b("u") + "dU" + b("u") + "dU" + b("u") + "UU" + b("u") + "UU" + b("u") + "UU" + b("u") + "Ud" + b("u") + "Ud" + b("u") + "dd" + b("u") + "dd     " + e() + "\\nUU     UU     dU" + b("d") + "dU     dd" +
                        b("d") + "Ud     Ud" + b("d") + "UU     UU" + b("d") + "dd" + b("d") + e(); case "giga": Qa = ""; for (y = 0; y < Math.ceil(Ra / 10); y++) { Qa += "  "; for (Va = 0; 10 > Va; Va++)Qa += (0 == Va % 2 ? "Rr".charAt(c(2)) : "Dd".charAt(c(2))) + Oa(["+ ", "++", "- ", "--"]) + " "; Qa += "y" + Oa(x) + "\\n" } return Qa; case "mgmo": return r("F B U D L DBR DL BR DR BL R DBL".split(" "), [1364, 2728, 1681, 2402, 2629, 1418, 2329, 1574, 1129, 2198, 421, 602], Ra); case "mgmp": return Pa(10, Math.ceil(Ra / 10)); case "mgmc": Qa = Math.ceil(Ra / 10); y = ""; var Ua; for (Va = 0; Va < Qa; Va++) {
                            y += " "; for (Ua =
                                0; 5 > Ua; Ua++)y += Oa(["+", "-"]) + Oa(["+", "-"]) + " "; y += "U" + Oa(["'\\n", "~\\n"])
                        } return y; case "klmp": return Pa(10, Math.ceil(Ra / 10)); case "heli": return r("UF UR UB UL FR BR BL FL DF DR DB DL".split(" "), [154, 53, 106, 197, 771, 1542, 3084, 2313, 2704, 1328, 2656, 1472], Ra); case "redi": return r("LRFBlrfb".split(""), [28, 44, 67, 131, 193, 194, 52, 56], Ra, ["", "'"]); case "redim": Qa = []; for (y = 0; y < Ra; y++)Qa.push(z([["R"], ["L"]], ["", "'"], 3 + c(3))); return Qa.join(" x "); case "pyrm": return Qa = z([["U"], ["L"], ["R"], ["B"]], ["!", "'"], Ra),
                            Na(Qa, 3).replace(/!/g, ""); case "prcp": return Pa(10, Math.ceil(Ra / 10)); case "mpyr": return Qa = r("U! L! R! B! Uw Lw Rw Bw".split(" "), [224, 208, 176, 112, 238, 221, 187, 119], Ra, ["!", "'"]), Na(Qa, 4).replace(/!/g, ""); case "r3": for (y = 0; y < Ra; y++)Qa += (0 == y ? "" : "\\n") + (y + 1) + ") ${333}"; return scrMgr.formatScramble(Qa); case "r3ni": for (y = 0; y < Ra; y++)Qa += (0 == y ? "" : "\\n") + (y + 1) + ") ${333ni}"; return scrMgr.formatScramble(Qa); case "sq1h": return f(1, Ra); case "sq1t": return f(0, Ra); case "sq2": for (y = 0; y < Ra;)if (Va = c(12) - 5, Ua = c(12) -
                                5, 0 != Va || 0 != Ua) y++, Qa += "(" + Va + "," + Ua + ") / "; return Qa; case "ssq1t": Ta = []; bb(2, 0, Ra); y = Ta[0]; Va = Ta[1]; Ua = ""; 7 == y[0][0] && (y = [[0, 0]].concat(y)); 7 == Va[0][0] && (Va = [[0, 0]].concat(Va)); for (Qa = 0; Qa < Ra; Qa++)Ua += "(" + y[2 * Qa][0] + "," + Va[2 * Qa][0] + "," + Va[2 * Qa][1] + "," + y[2 * Qa][1] + ") / "; return Ua; case "bsq": return f(2, Ra); case "-1": for (y = 0; y < Ra; y++)Qa += String.fromCharCode(32 + c(224)); return Qa + "Error: subscript out of range"; case "333noob": return Qa = z(SCRAMBLE_NOOBST, SCRAMBLE_NOOBSS.split("|"), Ra).replace(/t/, "T"),
                                    Qa.substr(0, Qa.length - 2) + "."; case "lol": return Qa = z([["L"], ["O"]], 0, Ra), Qa.replace(/ /g, "")
            }console.log("Error")
        })
})(mathlib.rn, mathlib.rndEl, scrMgr.mega); var storage = execMain(function () {
    function c(a) { a = "" + a; return String.fromCharCode(47 + a.length) + a } function Oa(a, b) { return "session_" + c(a) + (void 0 == b ? "" : "_" + c(b)) } function z(a) { console.log("IndexedDB Error", a || "undefined") } function r(b, c, e, Na) { (Na = Na || a) ? (Na = Na.transaction(["sessions"], b), Na.oncomplete = e || $.noop, Na.onerror = z, Na = Na.objectStore("sessions"), c(Na)) : requestAnimFrame(function () { r(b, c, e) }) } function b(a, b) {
        return new Promise(function (c, f) {
            if (e) r("readwrite", function (b) {
                b.clear(); for (var c = 1; c <=
                    ~~kernel.getProp("sessionN"); c++)for (var e = mathlib.str2obj(a["session" + c] || []), f = 0; f < (Math.ceil(e.length / 100) || 1); f++)b.put(e.slice(100 * f, 100 * (f + 1)), Oa(c, f))
            }, c, b); else { for (var h = 1; h <= ~~kernel.getProp("sessionN"); h++)localStorage["session" + h] = mathlib.obj2str(a["session" + h]); c() }
        })
    } var e = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB, a, Pa = /^session_\d(\d+)_\d(\d+)$/; e && $(function () {
        var c = e.open("cstimer", 1); c.onerror = z; c.onupgradeneeded = function (a) {
            DEBUG &&
            console.log("Update Data From LocalStorage"); var c = a.target.result; c.createObjectStore("sessions").transaction.oncomplete = function (a) { b(localStorage, c) }
        }; c.onsuccess = function (b) { DEBUG && console.log("Success opening DB"); a = b.target.result }
    }); return {
        set: function (a, b, c) {
            return new Promise(function (f, h) {
                e ? r("readwrite", function (e) { var f = ~~(c / 100), h = IDBKeyRange.bound(Oa(a, f), Oa(a + 1), !1, !0); for (e["delete"](h); f < (Math.ceil(b.length / 100) || 1); f++)e.put(b.slice(100 * f, 100 * (f + 1)), Oa(a, f)) }, function () { f(b) }) : (localStorage["session" +
                    a] = JSON.stringify(b), f(b))
            })
        }, get: function (a, b, c) { return new Promise(function (f, h) { var x = []; if (e) r("readonly", function (b) { var c = IDBKeyRange.bound(Oa(a), Oa(a + 1), !1, !0); b.openCursor(c).onsuccess = function (a) { if (a = a.target.result) Array.prototype.push.apply(x, a.value), a["continue"]() } }, function () { b = b || 0; c = c || x.length; if (0 != b || c != x.length) x = x.slice(b, c); f(x) }); else { var Na = localStorage["session" + a]; void 0 != Na && "" != Na && (x = JSON.parse(Na)); if (0 != b || c != x.length) x = x.slice(b, c); f(x) } }) }, del: function (a, b, c) {
            e ?
                r("readwrite", function (c) { c["delete"](IDBKeyRange.bound(Oa(a), Oa(a + 1), !1, !0)); var e = IDBKeyRange.bound(Oa(b), Oa(b + 1), !1, !0); c.openCursor(e).onsuccess = function (b) { if (b = b.target.result) { var e = Pa.exec(b.key); e && (c.put(b.value, Oa(a, ~~e[2])), c["delete"](b.key)); b["continue"]() } } }, c) : (localStorage["session" + a] = localStorage["session" + b], delete localStorage["session" + b], c && requestAnimFrame(c))
        }, setKey: function (a, b) {
            return new Promise(function (c, f) {
                e ? r("readwrite", function (c) { c.put(b, a) }, function () { c(!0) }) :
                    (localStorage[a] = b, c(!0))
            })
        }, getKey: function (a) { return new Promise(function (b, c) { var f; e ? r("readonly", function (b) { b.get(a).onsuccess = function (a) { f = a.target.result } }, function () { b(f) }) : b(localStorage[a]) }) }, importAll: b, exportAll: function () {
            return new Promise(function (a, b) {
                var c = {}; if (e) r("readonly", function (a) { a.openCursor().onsuccess = function (a) { if (a = a.target.result) { var b = Pa.exec(a.key); b && (b = ~~b[1], c["session" + b] = c["session" + b] || [], Array.prototype.push.apply(c["session" + b], a.value)); a["continue"]() } } },
                    function () { a(c) }); else { for (var f = 1; f <= ~~kernel.getProp("sessionN"); f++)void 0 != localStorage["session" + f] && (c["session" + f] = mathlib.str2obj(localStorage["session" + f])); a(c) }
            })
        }
    }
}); var TimeStat = execMain(function () {
    function c(r, b, e, a) { this.avgSizes = r.slice(); this.timeAt = e; this.timeSort = a || c.dnfsort; this.reset(b) } function Oa(c, b) { return "p" == b[0] ? Math.ceil(c / 100 * b.slice(1)) : "m" == b ? Math.max(0, c >> 1) : ~~b } function z(c) { var b = kernel.getProp("trim", "p5"), e = kernel.getProp("trimr", "a"), a = Oa(c, b); b = Oa(c, "a" == e ? b : e); return a + b == c ? [Math.max(a - 1, 0), Math.max(b - 1, 0)] : [a, b] } c.dnfsort = function (c, b) { return c == b ? 0 : 0 > c ? 1 : 0 > b ? -1 : c - b }; c.prototype.reset = function (c) {
        this.timesLen = c; this.shouldRecalc =
            !0
    }; c.prototype.getAllStats = function () { this.genStats(); var c = this.timesLen - this.tree.rankOf(-1); return [c, c == this.timesLen ? -1 : this.tree.cumSum(this.timesLen - c) / (this.timesLen - c)] }; c.prototype.genStats = function () { if (this.shouldRecalc) { this._bestAvg = []; this.lastAvg = []; this.treesAvg = []; this.tree = sbtree.tree(this.timeSort); this.bestTime = this.worstTime = -1; this.bestTimeIndex = this.worstTimeIndex = 0; var c = this.timesLen; this.timesLen = 0; this.toLength(c); this.shouldRecalc = !1 } }; c.prototype.pushed = function (c) {
        this.genStats();
        this.doPushed(c)
    }; c.prototype.bestAvg = function (c, b) { var e = this._bestAvg[c] || []; e = e[e.length - 1] || [-1, 0, -1, -1, 0]; return void 0 !== b ? e[b] : e }; c.prototype.doPushed = function (c, b) {
        var e = []; this.timesLen++; var a = this.timesLen - 1, r = this.timeAt(a); this.tree.insert(r, a); if (!b) {
            var f = this.bestTime; this.bestTime = 0 == this.timesLen ? -1 : this.tree.rank(0); this.bestTimeIndex = this.tree.find(this.bestTime); this.worstTime = 0 == this.timesLen ? -1 : this.tree.rank(Math.max(0, this.tree.rankOf(-1) - 1)); this.worstTimeIndex = this.tree.find(this.worstTime);
            0 > this.timeSort(r, f) && -1 != f && e.push("single")
        } for (f = 0; f < this.avgSizes.length; f++) {
            var Oa = Math.abs(this.avgSizes[f]); if (this.timesLen < Oa) break; var h = 0 > this.avgSizes[f] ? [0, 0] : z(Oa), Na = Oa - h[0] - h[1], Qa = this.treesAvg[f] || sbtree.tree(this.timeSort); if (this.timesLen == Oa) { for (var x = 0; x < Oa; x++)Qa.insert(this.timeAt(x), x); this._bestAvg[f] = [] } else Qa.remove(this.timeAt(a - Oa)).insert(r, a); x = Qa.cumSum(Oa - h[1]) - Qa.cumSum(h[0]); var Ta = Math.sqrt((Qa.cumSk2(Oa - h[1]) - Qa.cumSk2(h[0]) - x * x / Na) / (Na - 1)) / 1E3; h = [Qa.rankOf(-1) <
                Oa - h[1] ? -1 : x / Na, Ta, Qa.rank(h[0] - 1), Qa.rank(Oa - h[1])]; 0 > this.timeSort(h[0], this.bestAvg(f, 0)) && (0 <= this.bestAvg(f, 0) && !b && e.push((0 < this.avgSizes[f] ? "ao" : "mo") + Oa), this._bestAvg[f].push(h.concat([a - Oa + 1]))); this.lastAvg[f] = h; this.treesAvg[f] = Qa
        } 0 == e.length || c || logohint.push("Session best " + e.join(" ") + "!")
    }; c.prototype.toLength = function (c) { for (; this.timesLen > c;)this.toPop(this.timesLen - 1 != c); for (; this.timesLen < c;)this.doPushed(!0, this.timesLen + 1 != c) }; c.prototype.toPop = function (c) {
        var b = this.timesLen -
            1, e = this.timeAt(b); this.tree.remove(e); c || (this.bestTime = 0 == this.timesLen ? -1 : this.tree.rank(0), this.bestTimeIndex = this.tree.find(this.bestTime), this.worstTime = 0 == this.timesLen ? -1 : this.tree.rank(Math.max(0, this.tree.rankOf(-1) - 1)), this.worstTimeIndex = this.tree.find(this.worstTime)); for (var a = 0; a < this.avgSizes.length; a++) {
                var r = Math.abs(this.avgSizes[a]); if (this.timesLen < r) break; else if (this.timesLen == r) { this.lastAvg[a] = null; this.treesAvg[a] = null; this._bestAvg[a] = null; continue } var f = this.treesAvg[a];
                f.remove(e).insert(this.timeAt(b - r), b - r); if (!c) { var Oa = 0 > this.avgSizes[a] ? [0, 0] : z(r), h = r - Oa[0] - Oa[1], Na = f.cumSum(r - Oa[1]) - f.cumSum(Oa[0]), Qa = Math.sqrt((f.cumSk2(r - Oa[1]) - f.cumSk2(Oa[0]) - Na * Na / h) / (h - 1)) / 1E3; f = [f.rankOf(-1) < r - Oa[1] ? -1 : Na / h, Qa, f.rank(Oa[0] - 1), f.rank(r - Oa[1])]; this.lastAvg[a] = f } this.bestAvg(a, 4) == b - r + 1 && this._bestAvg[a].pop()
            } this.timesLen--
    }; c.prototype.getThres = function () {
        for (var c = [], b = 0; b < this.avgSizes.length; b++) {
            var e = Math.abs(this.avgSizes[b]); if (this.timesLen < e) break; var a = 0 >
                this.avgSizes[b] ? [0, 0] : z(e), Pa = e - a[0] - a[1], f = this.treesAvg[b] || sbtree.tree(this.timeSort), Oa = this.timeAt(this.timesLen - e), h = a[0]; a = e - a[1] - 1; 0 > this.timeSort(Oa, f.rank(h)) ? (h += 1, Oa = 0) : 0 > this.timeSort(f.rank(a), Oa) && (--a, Oa = 0); var Na = this.bestAvg(b, 0); f.rankOf(-1) < a ? c[b] = -1 : -1 == Na ? c[b] = -2 : (Oa = f.cumSum(a + 1) - f.cumSum(h) - Oa, Pa = Na * Pa - Oa, h = 0 == h ? 0 : f.rank(h - 1), e = a == e - 1 ? -1 : f.rank(a + 1), 0 >= Pa || 0 > this.timeSort(Pa, h) ? c[b] = -1 : 0 > this.timeSort(e, Pa) ? c[b] = -2 : c[b] = Pa)
        } return c
    }; c.prototype.getMinMaxInt = function () {
        return this.getAllStats()[0] ==
            this.timesLen ? null : [this.worstTime, this.bestTime, this.getBestDiff(this.worstTime - this.bestTime)]
    }; c.prototype.getBestDiff = function (c) { var b = [100, 200, 500, 1E3, 2E3, 5E3, 1E4, 2E4, 5E4, 1E5]; if ("a" == kernel.getProp("disPrec")) { c /= 10; for (var e = 0; e < b.length; e++)if (c < b[e]) { c = b[e]; break } } else c = b[kernel.getProp("disPrec")]; return c }; c.prototype.runAvgMean = function (c, b, e, a) {
        e = e || b; if (!(0 > c || c + b > this.timesLen)) {
            a = 0 == a ? [0, 0] : z(e); if (0 >= e - a[0] - a[1]) return [-1, 0, -1, -1]; for (var r = sbtree.tree(this.timeSort), f = 0; f < e; f++)r.insert(this.timeAt(c +
                f), f); for (var Oa = e - a[0] - a[1], h = r.cumSum(e - a[1]) - r.cumSum(a[0]), Na = Math.sqrt((r.cumSk2(e - a[1]) - r.cumSk2(a[0]) - h * h / Oa) / (Oa - 1)) / 1E3, Qa = [[r.rankOf(-1) < e - a[1] ? -1 : h / Oa, Na, r.rank(a[0] - 1), r.rank(e - a[1])]], x = c - e, Ta = e; Ta < b; Ta++)r.remove(this.timeAt(x + Ta)).insert(this.timeAt(c + Ta), f), h = r.cumSum(e - a[1]) - r.cumSum(a[0]), Na = Math.sqrt((r.cumSk2(e - a[1]) - r.cumSk2(a[0]) - h * h / Oa) / (Oa - 1)) / 1E3, Qa.push([r.rankOf(-1) < e - a[1] ? -1 : h / Oa, Na, r.rank(a[0] - 1), r.rank(e - a[1])]); return Qa
        }
    }; c.prototype.getTrimList = function (c, b, e, a) {
        var r =
            [], f = [], Oa = z(b); e = -2 > e ? 0 : e; for (var h = 0; h < b; h++) { var Na = this.timeAt(c + h), Qa = this.timeSort(Na, e); Na = this.timeSort(a, Na); 0 > Qa ? r.push(h) : 0 > Na ? f.push(h) : 0 == Qa && r.length < Oa[0] ? r.unshift(h) : 0 == Na && f.length < Oa[1] && f.unshift(h) } return r.slice(r.length - Oa[0]).concat(f.slice(f.length - Oa[1]))
    }; return c
}); var stats = execMain(function (c, Oa, z) {
    function r(a) { if ("string" == typeof a[0]) { var b = [a[2], a[1] || Mb, a[0], a[3] || Math.round(((new Date).getTime() - a[2][1]) / 1E3)]; a[4] && b.push(a[4]); eb.push(b); a = a[2] } else eb.push([a, Mb, "", Math.round(((new Date).getTime() - a[1]) / 1E3)]); Lb.push(null); tb.pushed(); sb.pushed(); Ib.save(eb.length - 1); a.length - 1 > Cb ? pb.updateTable(!1) : pb.appendRow(eb.length - 1); Ta(["push"]); kernel.pushSignal("timestd", eb[eb.length - 1]) } function b(a, b) {
        a < .7 * eb.length ? (b(), tb.reset(eb.length), sb.reset(eb.length)) :
        (tb.toLength(a), sb.toLength(a), b(), tb.toLength(eb.length), sb.toLength(eb.length))
    } function e(a) { if (kernel.getProp("delmul")) { var c = prompt(STATS_CFM_DELMUL, 1); if (null == c || !/^\d+$/.exec(c) || 0 == ~~c) return; c = ~~c } else { if (!confirm(STATS_CFM_DELETE)) return; c = 1 } b(a, function () { eb.splice(a, c); Lb.splice(a, c) }); Ib.save(a); pb.updateTable(!1); Ta(["delete", a, c]); return !0 } function a(a) { for (var b = 0, c = 0, e = 0; e < eb.length; e++) { var n = eb[e][0]; -1 == n[0] || n.length <= a ? c += 1 : b += y(a, e) } return c == eb.length ? -1 : b / (eb.length - c) }
    function Pa(a, b) { switch (a[0]) { case 0: return c(a[1]); case -1: return "DNF" + (b ? "(" + c(a[1]) + ")" : ""); default: return c(a[0] + a[1]) + "+" } } function f(a) { if (2 == a.length) return ""; var b = []; b.push(c(a[a.length - 1])); for (var e = a.length - 2; 1 <= e; e--)b.push(c(a[e] - a[e + 1])); return "=" + b.join("+") } function bb(a) { a = ~~$(a.target).attr("data"); var b = tb; 0 != a && (b = new TimeStat(Ab, eb.length, y.bind(void 0, a))); lb(b, db, 0 == a ? 0 : STATS_CURSPLIT.replace("%d", a)) } function h(a, b, e) {
        var n = eb[a], f = n[0], w = []; w.push('<td class="times">' + (n[2] &&
            "*") + (a + 1) + "</td>"); w.push('<td class="times">' + Pa(f, !1) + "</td>"); var h = kernel.getProp("statsrc", "t"); n = tb.prettyFunc || [c, z]; "t" != h[0] && (w.pop(), w.push('<td class="times"><span style="opacity:0.5">' + Pa(f, !1) + "</span> " + n[0](tb.timeAt(a)).split(" ")[0] + "</td>")); h = tb.runAvgMean(a - Gb + 1, Gb, 0, 0 < xb ? void 0 : 0); var y = tb.runAvgMean(a - Jb + 1, Jb, 0, 0 < Hb ? void 0 : 0); w.push("<td" + (h ? ' class="times"' : "") + ">" + (h ? n[1](h[0][0]) : "-") + "</td><td" + (y ? ' class="times"' : "") + ">" + (y ? n[1](y[0][0]) : "-") + "</td>"); if (1 < b) {
                w.push("<td>" +
                    c(f[f.length - 1]) + "</td>"); for (n = f.length - 2; 1 <= n; n--)w.push("<td>" + c(f[n] - f[n + 1]) + "</td>"); for (n = f.length - 1; n < b; n++)w.push("<td>-</td>")
            } w = w.join(""); e && e.html(w); return '<tr data="' + a + '">' + w + "</tr>"
    } function Na(b) {
        vb.empty().unbind("click").click(bb); var e = eb.length, n = tb.getAllStats(), f = tb.prettyFunc || [c, z], w = e == n[0] ? 0 : (e - n[0]) * n[1]; vb.append('<th colspan="4" data="0" class="times">' + STATS_SOLVE + ": " + (e - n[0]) + "/" + e + "<br>" + STATS_AVG + ": " + f[1](n[1]) + (kernel.getProp("statssum") ? "<br>" + STATS_SUM + ": " +
            f[0](w) : "") + "</th>").css("font-size", "1.2em"); if (1 < b) for (e = 1; e <= b; e++)vb.append('<th data="' + e + '" class="times">' + z(a(e)) + "</th>").css("font-size", "")
    } function Qa(a) {
        a || (a = $('<select style="max-width:4em;">')); a.unbind("change").change(function (a) { kernel.setProp("statsrc", $(a.target).val()) }); var b = kernel.getProp("statsrc", "t"), c = [["t", STATS_TIME]]; if (1 != Cb) for (var e = 0; e < Cb; e++)c.push(["p" + (e + 1), "P." + (e + 1)]); e = hb(); for (var n in e) c.push(["m" + n, e[n][0]]); n = !1; for (e = 0; e < c.length; e++)a.append($("<option>").val(c[e][0]).html(c[e][1])),
            c[e][0] == b && (n = !0); a.val(b); n || kernel.setProp("statsrc", "t"); return 1 == c.length ? STATS_TIME : a
    } function x() {
        if (!Fb) {
            if (kernel.getProp("statsum")) {
                yb.css("display", "inline-block"); tb.getAllStats(); var a = Qa(), b = tb.prettyFunc || [c, z], e = []; 0 < eb.length ? (e.push('<td class="times click" data="cs">' + b[0](tb.timeAt(eb.length - 1)) + "</td>"), e.push('<td class="times click" data="bs">' + b[0](tb.bestTime) + "</td>")) : (e.push("<td><span>-</span></td>"), e.push("<td><span>-</span></td>")); for (var f = [], w = tb.getThres(), h =
                    kernel.getProp("statthres", !1), y = 0; y < Ab.length; y++) { var r = Math.abs(Ab[y]); eb.length >= r && (f.push("<tr><th>" + "am"[Ab[y] >>> 31] + "o" + r + "</th>"), f.push('<td class="times click" data="c' + "am"[Ab[y] >>> 31] + y + '">' + b[1](tb.lastAvg[y][0]) + "</td>"), f.push('<td class="times click" data="b' + "am"[Ab[y] >>> 31] + y + '">' + b[1](tb.bestAvg(y, 0)) + "</td>"), h && f.push('<td class="times">' + (0 > w[y] ? ["N/A", "∞"][-1 - w[y]] : b[0](w[y])) + "</td>")) } b = $("<tr>").append("<th></th><th>" + Bb[1] + "</th><th>" + Bb[0] + "</th>"); h && b.append("<th>" +
                        Bb[13] + "</th>"); zb.empty().append(b, $("<tr>").append($('<th style="padding:0">').append(a), e.join("")), f.join(""))
            } else zb.empty(), yb.hide(); n()
        }
    } function Ta(a) {
        if (!Fb) {
            x(); for (var b in Pb) Pb[b](a); a = eb.length - 1; b = sb.runAvgMean(a - Gb + 1, Gb, 0, 0 < xb ? void 0 : 0); var c = sb.runAvgMean(a - Jb + 1, Jb, 0, 0 < Hb ? void 0 : 0); kernel.pushSignal("avg", [(0 < xb ? "ao" : "mo") + Gb + ": " + (b ? z(b[0][0]) : "-"), (0 < Hb ? "ao" : "mo") + Jb + ": " + (c ? z(c[0][0]) : "-"), b ? [a - Gb + 1, Gb, 10 * Gb, 0 > xb] : void 0, c ? [a - Jb + 1, Jb, 10 * Jb, 0 > Hb] : void 0, Ra.bind(void 0, sb, db),
            eb[a], 0 == a ? null : eb[a - 1]])
        }
    } function Ua() { var a = kernel.getProp("statsrc", "t"); if ("t" != a) { if ("p" == a[0]) return y.bind(void 0, ~~a.slice(1)); if ("m" == a[0]) return a = a.slice(1), Za.bind(null, a) } return Kb } function Wa(a, b, c) {
        if (!b) return "N/A"; var e = Pa(b[0], !0) + f(b[0]) + (b[2] ? "[" + b[2] + "]" : ""); -1 != $.inArray(a, c) && (e = "(" + e + ")"); kernel.getProp("printScr") && (e += "   " + b[1]); kernel.getProp("printDate") && (e += "   @" + mathlib.time2str(b[3])); return kernel.getProp("printScr") || kernel.getProp("printDate") ? a + 1 + ". " + e + " \n" :
            e + ", "
    } function Ra(a, b, e, n, f, w) {
        if (0 != a.timesLen) {
            var h = [0, [null], [null]], y = []; 0 != e + n && (w ? h = a.runAvgMean(e, n, 0, 0)[0] : (h = a.runAvgMean(e, n)[0], y = a.getTrimList(e, n, h[2], h[3]))); var r = ""; if (kernel.getProp("printDate") && 2 < n) { r = b(e); var x = b(e + n - 1); r = Bb[11].replace("%s", mathlib.time2str(r && r[3])).replace("%e", mathlib.time2str(x && x[3])); r = " (" + r + ")" } r = [mathlib.time2str(+new Date / 1E3, Bb[3]) + r + "\n"]; x = a.prettyFunc || [c, z]; 1 < f && (2 == f ? r.push(Bb[8]) : 10 == f ? r.push(Bb[5]) : w ? r.push(Bb[6].replace("%mk", ~~(f / 10))) : r.push(Bb[7].replace("%mk",
                ~~(f / 10))), r.push(": " + x[10 == f ? 0 : 1](h[0]))); r.push("\n\n" + Bb[10] + "\n"); if (kernel.getProp("absidx")) for (f = 0; f < y.length; f++)y[f] += e; for (f = 0; f < n; f++)r.push(Wa(kernel.getProp("absidx") ? e + f : f, b(e + f), y)); r = r.join("").slice(0, -2); ab.val(r); kernel.showDialog([ab, cb, void 0, cb, [STATS_EXPORTCSV, function () { $a(a, b, e, n); return !1 }]], "stats", STATS_CURROUND); ab[0].select()
        }
    } function $a(a, b, e, n) {
        if (0 != a.timesLen) {
            window.Blob || alert("Do not support your browser!"); a = ["No.;Time;Comment;Scramble;Date"]; for (var f = 0; f <
                Cb; f++)a[0] += ";P." + (f + 1); for (f = 0; f < n; f++) { var w = b(e + f), h = []; h.push(f + 1); h.push(Pa(w[0], !0)); h.push(w[2] ? w[2] : ""); h.push(w[1]); h.push(mathlib.time2str(w[3])); h.push(c(w[0][w[0].length - 1])); for (var y = w[0].length - 2; 1 <= y; y--)h.push(c(w[0][y] - w[0][y + 1])); for (y = w[0].length - 1; y < Cb; y++)h.push(""); for (y = 0; y < h.length; y++) { w = h; var r = y, x = h[y]; x = x.toString(); if (-1 != x.indexOf(";") || -1 != x.indexOf("\n")) x = '"' + x.replace(/"/g, '""') + '"'; w[r] = x } a.push(h.join(";")) } a = a.join("\r\n"); b = new Blob([a], { type: "text/csv" }); e =
                    $('<a class="click"/>').appendTo("body"); e.attr("href", URL.createObjectURL(b)); e.attr("download", "csTimerExport_" + mathlib.time2str(new Date / 1E3, "%Y%M%D_%h%m%s") + ".csv"); e[0].click(); e.remove()
        }
    } function Va(a, b, c) {
        c = $(c.target).attr("data"); if (void 0 != c) {
            var e = ~~c.substr(2); switch (c.substr(0, 2)) {
                case "bs": Ra(a, b, a.bestTimeIndex, 1, 10, !0); break; case "cs": Ra(a, b, a.timesLen - 1, 1, 10, !0); break; case "ws": Ra(a, b, a.worstTimeIndex, 1, 10, !0); break; case "bm": Ra(a, b, a.bestAvg(e, 4), -Ab[e], 10 * -Ab[e], !0); break; case "cm": Ra(a,
                    b, a.timesLen + Ab[e], -Ab[e], 10 * -Ab[e], !0); break; case "ba": Ra(a, b, a.bestAvg(e, 4), Ab[e], 10 * Ab[e], !1); break; case "ca": Ra(a, b, a.timesLen - Ab[e], Ab[e], 10 * Ab[e], !1); break; case "tt": lb(a, b)
            }
        }
    } function y(a, b) { var c = (eb[b] || [[-1, 1]])[0]; return -1 == c[0] || c.length <= a ? -1 : Rb * ~~((0 == a ? c[0] + c[1] : c[c.length - a] - (c[c.length - a + 1] || 0)) / Rb) } function db(a) { return eb[a] } function mb(a) {
        for (var b = [], c = 0; c < a.length; c++)b.push(c); b.sort(function (b, c) { var e = a[b][3] || 0, n = a[c][3] || 0; return e == n ? b - c : e - n }); for (c = 0; c < a.length; c++)b[c] =
            a[b[c]]; return b
    } function cb() { ab.val("") } function lb(a, b, e) {
        var n = a.getAllStats(), f = n[0], w = a.runAvgMean(0, eb.length)[0]; n = n[1]; var h = a.timesLen, y = ""; if (kernel.getProp("printDate") && 2 < h) { y = b(0); var r = b(h - 1); y = Bb[11].replace("%s", mathlib.time2str(y && y[3])).replace("%e", mathlib.time2str(r && r[3])); y = " (" + y + ")" } r = tb.prettyFunc || [c, z]; y = [mathlib.time2str(+new Date / 1E3, Bb[3]) + y]; y.push(Bb[4].replace("%d", h - f + "/" + h) + "\n"); y.push(Bb[5]); y.push("    " + Bb[0] + ": " + r[0](a.bestTime)); y.push("    " + Bb[2] + ": " +
            r[0](a.worstTime) + "\n"); for (f = 0; f < Ab.length; f++) { var x = Math.abs(Ab[f]); h >= x && (y.push(Bb[7 - (Ab[f] >>> 31)].replace("%mk", x)), y.push("    " + Bb[1] + ": " + r[1](a.lastAvg[f][0]) + " (σ = " + gb(a.lastAvg[f][1], 2) + ")"), y.push("    " + Bb[0] + ": " + r[1](a.bestAvg(f, 0)) + " (σ = " + gb(a.bestAvg(f, 1), 2) + ")\n")) } y.push(Bb[8].replace("%v", r[1](w[0])).replace("%sgm", gb(w[1], 2)).replace(/[{}]/g, "")); y.push(Bb[9].replace("%v", r[1](n) + "\n")); if (0 != h) {
                y.push(Bb[10]); w = []; for (n = 0; n < h; n++)w.push(Wa(n, b(n), [])); w = w.join("").slice(0,
                    -2); y.push(w)
            } y = y.join("\n"); ab.val(y); kernel.showDialog([ab, cb, void 0, cb, [STATS_EXPORTCSV, function () { $a(a, b, 0, h); return !1 }]], "stats", e || STATS_CURSESSION); ab[0].select()
    } function gb(a, b) { a && a != Number.POSITIVE_INFINITY && a != Number.NEGATIVE_INFINITY || (a = 0); for (var c = "" + Math.round(a * Math.pow(10, b)); c.length < b + 1;)c = "0" + c; var e = c.length; return c.substr(0, e - b) + "." + c.substr(e - b, b) } function Ya(a) {
        a = a.split(/[\s,;]+/); for (var b = /([am])o(\d+)/, c = [], e = 0; e < a.length; e++) {
            var n = b.exec(a[e]); if (!n) return !1; c.push(("a" ==
                n[1] ? 1 : -1) * ~~n[2])
        } c.sort(function (a, b) { return Math.abs(a) - Math.abs(b) }); return c
    } function fb(a) { var b = kernel.getProp("statalu"); if (a || !/^\s*([am]o\d+[\s,;]*)+\s*$/.exec(b)) a = prompt("Statistics Details", b || "mo3 ao5 ao12 ao100"), /^\s*([am]o\d+[\s,;]*)+\s*$/.exec(a) && Ya(a) ? kernel.setProp("statalu", a) : (null != a && alert("INVALID VALUES!"), kernel.setProp("statal", "mo3 ao5 ao12 ao100"), kernel.reprop()) } function Xa(a) {
        var b = Ya(a); b ? (Ab = b, tb = new TimeStat(Ab, eb.length, Ua()), tb.prettyFunc = ob(), sb = new TimeStat([],
            eb.length, Kb), crossSessionStats.updateStatal(Ab), Ta(["statal", a])) : (kernel.setProp("statal", "mo3 ao5 ao12 ao100"), kernel.reprop())
    } function w(a, c) {
        if ("time" == a) r(c); else if ("scramble" == a || "scrambleX" == a) Mb = c[1]; else if ("property" == a) if (/^(:?useMilli|timeFormat|stat[12][tl]|statinv)$/.exec(c[0])) Rb = kernel.getProp("useMilli") ? 1 : 10, xb = [1, -1][~~kernel.getProp("stat1t")] * kernel.getProp("stat1l"), Hb = [1, -1][~~kernel.getProp("stat2t")] * kernel.getProp("stat2l"), Gb = Math.abs(xb), Jb = Math.abs(Hb), pb.updateTable(!1),
            Ta(["property", c[0]]); else if ("statsum" == c[0] || "statthres" == c[0]) x(); else if ("statssum" == c[0]) Na(Cb), n(); else if ("statal" == c[0]) { var e = c[1]; "u" == e && fb("modify" == c[2]); e = kernel.getProp("statal"); Xa("u" == e ? kernel.getProp("statalu") : e) } else "statalu" == c[0] ? Xa(c[1]) : "trim" == c[0] || "trimr" == c[0] ? (tb.reset(eb.length), sb.reset(eb.length), crossSessionStats.updateStatal(Ab), pb.updateTable(!1), Ta(["property", c[0]])) : "view" == c[0] ? n() : "statHide" == c[0] ? c[1] ? nb.hide() : nb.show() : "statsrc" == c[0] ? (tb = new TimeStat(Ab,
                eb.length, Ua()), tb.prettyFunc = ob(), pb.updateTable(!0)) : "wndStat" == c[0] ? n() : "sr_statal" == c[0] && kernel.setProp("sr_statalu", c[1]); else if ("ctrl" == a && "stats" == c[0]) "clr" == c[1] ? Ib.getButton().click() : "undo" == c[1] ? Eb.delLast() : "OK" == c[1] ? Eb.setCfm(0) : "+2" == c[1] ? Eb.setCfm(2E3) : "DNF" == c[1] && Eb.setCfm(-1); else if ("ashow" == a && !c) pb.hideAll(); else if ("button" == a && "stats" == c[0] && c[1]) setTimeout(n, 50); else if ("giirecons" == a) {
                    var f = eb.length - 1; 0 > f || eb[f][1] != c[0] || (b(f, function () { eb[f][4] = c[1]; Lb[f] = null }), Ib.save(f),
                        Ta(["giirecons", f]))
                }
    } function n() { $("html").hasClass("m") ? qb.height(Math.max(yb.height(), vb.height() + 2 * ub.height())) : null != qb[0].offsetParent && qb.outerHeight(~~(kb.height() - (nb.is(":hidden") ? 0 : nb.outerHeight()) - yb.outerHeight() - 5)) } function Sa(a, b, c) { Tb[a] = b; c && (Nb[a] = [b, c]) } function Za(a, b) { if (!(b >= eb.length) && a in Tb) return Lb[b] || (Lb[b] = {}), a in Lb[b] || (Lb[b][a] = Tb[a](eb[b], b)), Lb[b][a] } function hb() {
        var a = {}, b; for (b in Nb) for (var c = Math.max(eb.length - 10, 0); c < eb.length; c++)if (-1 != Za(b, c)) {
            a[b] =
            Nb[b][1]; break
        } return a
    } function ob(a) { if (!a) { var b = kernel.getProp("statsrc", "t"); "m" == b[0] && (a = b.slice(1)) } return Nb[a] ? (a = Nb[a][1], [a[1], a[2] || a[1]]) : [c, z] } function jb(a, b) { var c = -1; (b[2] || "").replace(/[0-9]+(\.[0-9]+)?/g, function (b) { 0 == a && (c = 1E3 * parseFloat(b)); a-- }); return c } var eb = [], kb = $('<div id="stats" />'), ab = $('<textarea rows="10" readonly />'), qb = $('<div class="myscroll" />'), nb = $("<div>"), rb = $("<table />").click(function (a) {
        a = $(a.target); if (a.is("td,td>span") && "-" != a.html()) {
            a.is("td>span") &&
            (a = a.parent()); var b = a.prevAll(), c = b.length; b = ~~(0 == c ? a : b.eq(-1)).html().replace("*", "") - 1; if (!(4 < c || 0 > c)) switch (c) { case 0: if (kernel.getProp("rsfor1s")) { Ra(tb, db, b, 1, 10, !0); break } case 1: Eb.proc(b, a); break; case 2: Ra(tb, db, b - Gb + 1, Gb, 10 * Gb, 0 > xb); break; case 3: Ra(tb, db, b - Jb + 1, Jb, 10 * Jb, 0 > Hb) }
        }
    }).addClass("table"), ub = $("<tr />"), vb = $("<tr />"), wb = $('<tr class="click" ><th class="click" colspan="15">...</th></tr>'), zb = $('<table class="sumtable" />').click(function (a) { Va(tb, db, a) }).addClass("table"), yb = $('<div class="statc" />'),
        Fb = !0, pb = function () {
            function a(a) {
                if (ab && ab.idx == a) ab = null; else {
                    for (var b = [], e = 0; e < eb.length; e++)b[e] = e; if (0 == a) b.sort(function (a, b) { return TimeStat.dnfsort(tb.timeAt(a), tb.timeAt(b)) }); else if (1 == a || 2 == a) { var n = 1 == a ? Gb : Jb, f = sb.runAvgMean(0, eb.length, n, 0 < (1 == a ? xb : Hb) ? void 0 : 0); b.sort(function (a, b) { return Math.max(a, b) < n - 1 ? 0 : Math.min(a, b) < n - 1 ? a > b ? -1 : 1 : TimeStat.dnfsort(f[a - n + 1][0], f[b - n + 1][0]) }) } ab = {}; for (e = 0; e < eb.length - 1; e++)ab[b[e]] = b[e + 1]; ab[-1] = b[0]; ab[b[eb.length - 1]] = -1; ab.len = eb.length; ab.idx =
                        a
                } c(!1)
            } function b(a) { return ab && a in ab ? ab[a] : -1 == a ? eb.length - 1 : a - 1 } function c(c) {
                Cb = 1; for (var f = 0; f < eb.length; f++)Cb = Math.max(Cb, eb[f][0].length - 1); f = ab ? ab.idx : -1; Sa.html(STATS_TIME + (0 == f ? "*" : "")); Va.html((0 < xb ? "ao" : "mo") + Gb + (1 == f ? "*" : "")); Qa.html((0 < Hb ? "ao" : "mo") + Jb + (2 == f ? "*" : "")); ub.empty().append(z, Sa, Va, Qa); if (1 < Cb) for (f = 0; f < Cb; f++)ub.append("<th>P." + (f + 1) + "</th>"); ab && ab.len != eb.length && n(); Ra = []; Xa = b(-1); kernel.getProp("statinv") ? rb.empty().append(ub, wb, vb) : rb.empty().append(vb, ub, wb); w();
                0 > Xa ? wb.unbind("click").hide() : wb.unbind("click").click(pb.showAll).show(); z.unbind("click").click(e); Sa.unbind("click").click(a.bind(null, 0)); Va.unbind("click").click(a.bind(null, 1)); Qa.unbind("click").click(a.bind(null, 2)); Na(Cb); c && Ta(["table"]); qb.scrollTop(kernel.getProp("statinv") ? rb[0].scrollHeight : 0)
            } function e() {
                var a = prompt("Filter Pattern: (23*, 15.1*, comments, scrambles, date)"); null != a && a != x && (x = a ? (a + "").replace(/[.\\+*?\[\^\]$(){}=!<>|:\-]/g, "\\$&").replace(/\\\*/g, ".*").replace(/\\\?/g,
                    ".") : ".*", r = new RegExp(x, "g"), c(!1))
            } function n() { if (".*" == x && null == ab) return !1; x = ".*"; r = /.*/; ab = null; c(!1); return !0 } function w() { for (var a = Ra.length + 50, c = []; 0 <= Xa && Ra.length < a;) { var e = eb[Xa]; if (r.exec(Pa(e[0], !0) + f(e[0])) || r.exec(e[1]) || r.exec(e[2]) || r.exec(mathlib.time2str(e[3]))) c.push(h(Xa, Cb)), Ra.push(Xa); Xa = b(Xa) } kernel.getProp("statinv") ? wb.after(c.reverse().join("")) : wb.before(c.join("")) } function y(a) { w(); 0 > Xa && wb.unbind("click").hide() } var r = /.*/, x = ".*", z = $('<th class="click">').html("&#8981;"),
                Sa = $('<th class="click">'), Va = $('<th class="click">'), Qa = $('<th class="click">'), Ra = [], Xa = 0, ab = null; return {
                    appendRow: function (a) { if (!n()) { var b = h(a, Cb); kernel.getProp("statinv") ? (vb.before(b), qb.scrollTop(rb[0].scrollHeight)) : (ub.after(b), qb.scrollTop(0)); Ra.unshift(a); Na(Cb); 50 < Ra.length && pb.hideAll() } }, showAll: y, hideAll: function () { for (; 50 < Ra.length;)(kernel.getProp("statinv") ? wb.next() : wb.prev()).remove(), Xa = Ra.pop(); 0 <= b(Xa) && wb.unbind("click").click(y).show() }, updateTable: c, updateFrom: function (a) {
                        for (var b =
                            Math.min(a + Math.max(Gb, Jb), eb.length), c = kernel.getProp("statinv"), e = vb.parent().children(), n = 0; n < Ra.length; n++)if (!(Ra[n] < a || Ra[n] >= b)) { var f = c ? Ra.length + 1 - n : 2 + n; Ra[n] != ~~e.eq(f).attr("data") ? console.log("[stats] update from error", Ra[n], f, e[f]) : h(Ra[n], Cb, e.eq(f)) } Na(Cb)
                    }
                }
        }(), Eb = function () {
            function a() {
                0 > Za || Za >= eb.length || (kernel.getProp("statsrc", "t").startsWith("mcomment") ? (b(Za, function () { eb[Za][2] = Sa.val(); Lb[Za] = null }), Ib.save(Za), pb.updateFrom(Za), Ta(["comment", Za])) : (eb[Za][2] = Sa.val(), Lb[Za] =
                    null, Ib.save(Za), h(Za, Cb, Oa), x()))
            } function c(a) {
                a = $(a.target); var b = a.attr("data"); b && ("p" == b ? (a = { " OK ": 0, " +2 ": 2E3, " DNF ": -1 }[a.html()], y(a, Za)) : "d" == b ? e(Za) && (Za = void 0, n()) : "s" == b ? (a = eb[Za], $.clipboardCopy(a[1]) && logohint.push("scramble copied")) : "c" == b ? (a = eb[Za], $.clipboardCopy(Pa(a[0], !0) + f(a[0]) + (a[2] ? "[" + a[2] + "]" : "") + "   " + a[1] + "   @" + mathlib.time2str(a[3])) && logohint.push("solve copied")) : "r" == b && (a = eb[Za], a[4] && (b = "string" == typeof a[4][1] && a[4][1] || tools.getCurPuzzle() || "333", replay.popupReplay(a[1],
                    a[4][0], b))))
            } function n() { kernel.isDialogShown("cfm") && kernel.hideDialog(); Ya && (Na.css("font-size", "0.8em"), Ya.empty().append(Na), Za = eb.length - 1, Oa = kernel.getProp("statinv") ? vb.prev() : ub.next(), w()) } function w() {
                if (eb[Za]) {
                    var b = eb[Za], e = ""; b[4] && (e = $('<span class="click" data="r">' + STATS_REVIEW + "</span>"), e = $("<tr>").append($("<td>").append(e), $("<td>").append(ab))); Na.empty().append(z, "<br>", f(b[0]), "<br>").append('<span class="click" data="c"> &#128203; </span>|<span class="click" data="p"> OK </span>|<span class="click" data="p"> +2 </span>|<span class="click" data="p"> DNF </span>| ',
                        Va).append("<br>", $('<table style="display:inline-block;">').append($("<tr>").append("<td>" + STATS_COMMENT + "</td>", $("<td>").append(Sa)), $("<tr>").append('<td><span class="click" data="s">' + SCRAMBLE_SCRAMBLE + "</span></td>", $("<td>").append(Qa)), $("<tr>").append("<td>" + STATS_DATE + "</td>", $("<td>").append(Xa)), e)).unbind("click").click(c); z.html(Pa(b[0], !0)); Qa.val(b[1]); Xa.val(mathlib.time2str(b[3])); Sa.val(b[2]).unbind("change").change(a); ab.val(b[4] ? JSON.stringify(b[4]) : "")
                } else Na.empty()
            } function y(a,
                c) { eb[c][0][0] != a && (b(c, function () { eb[c][0][0] = a; Lb[c] = null }), Ib.save(c), pb.updateFrom(c), Ta(["penalty", c]), c == Za && w(), kernel.pushSignal("timepnt", eb[c])) } function r(a, b) { Ya = a; void 0 != a && n() } var Na = $('<div style="text-align:center; font-family: initial;">'), z = $('<span style="font-size:2.5em;"/>'), Sa = $('<input type="text">').css("width", "8em"), Va = $('<input type="button" data="d">').val("X"), Qa = $('<input type="text" readonly>').css("width", "8em"), Xa = $('<input type="text" readonly>').css("width", "8em"),
                    ab = $('<input type="text" readonly>').css("width", "8em"), Za = 0, Oa, Ya; $(function () { tools.regTool("cfm", TOOLS_CFMTIME, r); kernel.regListener("cfm", "session", n) }); return {
                        proc: function (a, b) { Za = a; Oa = b.parent(); w(); Na.css("font-size", "1.2em"); var c = [Na, n, void 0, n, [STATS_SSSTAT, function () { n(); Ra(tb, db, a, 1, 10, !0) }]], e = eb[a]; e && e[4] && c.push([TOOLS_RECONS, function () { n(); kernel.pushSignal("reqrec", [eb[a], a]) }]); kernel.showDialog(c, "cfm", "Solves No." + (a + 1)) }, delLast: function () {
                            0 != eb.length && e(eb.length - 1) && (Za =
                                void 0, n())
                        }, setCfm: function (a) { 0 != eb.length && y(a, eb.length - 1) }
                    }
        }(), Cb = 0, Bb = STATS_STRING.split("|"); for (Oa = 0; 13 > Oa; Oa++)Bb[Oa] = Bb[Oa] || ""; var Kb = y.bind(void 0, 0), Ab = [-3, 5, 12, 50, 100, 1E3], tb = new TimeStat(Ab, 0, Kb), sb = new TimeStat([], 0, Kb), Ib = function () {
            function a(a) { cb = a; kernel.setProp("session", cb); Wa[cb] = Wa[cb] || { name: cb, opt: {} }; kernel.setSProps(Wa[cb].opt || {}); b(); return Na() } function b() {
                for (var a = 1; a <= Ua; a++) {
                    "object" != typeof Wa[a] && (Wa[a] = {}); var b = { name: a, opt: {} }, e; for (e in b) void 0 === Wa[a][e] &&
                        (Wa[a][e] = b[e]); Wa[a].scr && (Wa[a].opt.scrType = Wa[a].scr, delete Wa[a].scr); Wa[a].phases && (Wa[a].opt.phases = Wa[a].phases, delete Wa[a].phases); Wa[a].rank = Wa[a].rank || a
                } c(); gb.empty(); for (a = 0; a < db.length; a++)gb.append($("<option />").val(db[a]).html(Wa[db[a]].name)); gb.append(jb, lb); gb.val(cb)
            } function c() { db = []; for (var a = 1; a <= Ua; a++)db.push(a); db.sort(function (a, b) { return Wa[a].rank - Wa[b].rank }); for (a = 0; a < db.length; a++)Wa[db[a]].rank = a + 1; kernel.setProp("sessionData", JSON.stringify(Wa)) } function e(a) {
                return Wa[a].rank +
                    "-" + Wa[a].name
            } function n(a, c) { $.isNumeric(a) || (a = (Wa[cb] || {}).rank || Ua); cb = ++Ua; var e = new Date; e = e.getMonth() + 1 + "." + e.getDate() + " " + Ob; kernel.setProp("sessionN", Ua); var n = Wa[db[a - 1]] || {}; Wa[cb] = void 0 === c || c ? { name: n.name || e, opt: JSON.parse(JSON.stringify(n.opt || {})), rank: a + .5 } : { name: e, opt: kernel.getSProps(), rank: a + .5 }; b() } function f(b, c) { n(b, c); eb = []; Lb = []; sb.reset(eb.length); tb.reset(eb.length); Sa(); a(cb); kernel.blur(); kernel.getProp("imrename") && r(cb, !0) } function w(b) {
                b != Ua && (Wa[b] = Wa[Ua]); delete Wa[Ua];
                storage.del(b, Ua); Ua--; kernel.setProp("sessionN", Ua); kernel.setProp("sessionData", JSON.stringify(Wa)); 0 == Ua ? f() : cb == b ? kernel.setProp("session", 1) : cb == Ua + 1 && a(b)
            } function h(a) { if (0 != ("stat" in Wa[a] ? Wa[a].stat[0] : 1) && !confirm(STATS_CFM_DELSS.replace("%s", e(a)))) return !1; w(a); return !0 } function y() { confirm(STATS_CFM_RESET) && (eb = [], Lb = [], tb.reset(), sb.reset(), Sa(), pb.updateTable(!0), kernel.blur()) } function r(a, b) {
                void 0 === a && (a = cb); var c = prompt(b ? STATS_SESSION_NAMEC : STATS_SESSION_NAME, Wa[a].name); null !=
                    c && (c = $("<div/>").text(c).html(), Wa[a].name = c, kernel.setProp("sessionData", JSON.stringify(Wa)))
            } function x(a, b) { Fb = !1; eb = b; Lb = []; tb.reset(eb.length); sb.reset(eb.length); pb.updateTable(!0); Wa[a] = Wa[a] || { name: a, opt: {} }; Wa[a].stat = [eb.length].concat(sb.getAllStats()); Wa[a].date = [(eb[0] || [])[3], (eb[eb.length - 1] || [])[3]]; kernel.setProp("sessionData", JSON.stringify(Wa)); kernel.isDialogShown("ssmgr") && Ta(); kernel.pushSignal("session", "load") } function Na() { return storage.get(cb).then(x.bind(void 0, cb)) } function Sa(a) {
                Wa[cb].stat =
                [eb.length].concat(sb.getAllStats()); Wa[cb].date = [(eb[0] || [])[3], (eb[eb.length - 1] || [])[3]]; kernel.setProp("sessionData", JSON.stringify(Wa)); return storage.set(cb, eb, a)
            } function Va(c) {
                c = $(c.target); if (c.is("td, th, select") && (c.hasClass("click") || c.is("select"))) {
                    for (var e = c.parent(); !e.is("tr");)e = e.parent(); var n = e.children(); 5 > n.length && (n = e.prev().children()); e = ~~n.first().html().replace(/-.*$/, ""); n = db[e - 1]; switch (c.attr("data") || c.val()) {
                        case "r": r(n); break; case "u": 1 != e && (Wa[n].rank--, Wa[db[e -
                            2]].rank++, kernel.setProp("sessionData", JSON.stringify(Wa))); break; case "d": e != db.length && (Wa[n].rank++, Wa[db[e]].rank--, kernel.setProp("sessionData", JSON.stringify(Wa))); break; case "s": a(n); break; case "+": f(e); break; case "x": h(n); break; case "m": Ra(n); break; case "o": Xa(); break; case "p": Qa(); break; case "e": Za(c.parent()); return; case "g": nb = !1; break; case "gn": nb = "name"; break; case "gs": nb = "scr"; break; case "v": storage.get(n).then(function (a) {
                                $a(new TimeStat([], a.length, function (a, b) {
                                    return -1 == a[b][0][0] ?
                                        -1 : ~~((a[b][0][0] + a[b][0][1]) / Rb) * Rb
                                }.bind(void 0, a)), function (a, b) { return a[b] }.bind(void 0, a), 0, a.length)
                            }); break; default: return
                    }kernel.blur(); b(); Ta()
                }
            } function Qa() { var a = prompt(STATS_PROMPTSPL.replace("%s", e(cb)), ~~(eb.length / 2)); if (null != a) if (a = ~~a, 1 > a || a > eb.length - 1) alert(STATS_ALERTSPL); else { var b = cb, c = eb.slice(-a); n(); storage.set(cb, c).then(function () { cb = b; eb = eb.slice(0, -a); Lb = []; tb.reset(); sb.reset(); Sa(); x(cb, eb) }) } } function Ra(b) {
                if (cb != b && confirm(STATS_ALERTMG.replace("%f", e(cb)).replace("%t",
                    e(b)))) { var c = cb; storage.get(b).then(function (a) { Array.prototype.push.apply(a, eb); return storage.set(b, a) }).then(function (e) { delete Wa[b].stat; Wa[cb].date = [(e[0] || [])[3], (e[e.length - 1] || [])[3]]; kernel.setProp("sessionData", JSON.stringify(Wa)); a(b); w(c) }) }
            } function Xa() { for (var a = mb(eb), b = 0, c = 0; c < eb.length; c++)a[c] != eb[c] && b++; 0 == b ? logohint.push("Already sorted") : confirm(STATS_SSMGR_SORTCFM.replace("%d", b)) && (eb = a, Lb = [], tb.reset(), sb.reset(), Sa(), x(cb, eb)) } function Pa(a) {
                var b = db[a - 1], c = Wa[b], e = ["?/?",
                    "?"]; if ("stat" in c) { var n = c.stat; e[0] = n[0] - n[1] + "/" + n[0]; e[1] = z(n[2]) } n = STATS_SSMGR_OPS.split("|"); n = '<select><option value="">...</option><option value="r">' + n[0] + '</option><option value="+">' + n[1] + '</option><option value="' + (b == cb ? 'p">' + n[2] : 'm">' + n[3]) + '</option><option value="x">' + n[4] + "</option>" + (b == cb ? '<option value="o">' + n[5] + "</option>" : "") + '<option value="v">' + STATS_EXPORTCSV + "</option></select>"; var f = 1 == a ? "<td></td>" : '<td class="click" data="u">&#8593;</td>', w = a == db.length ? "<td></td>" :
                        '<td class="click" data="d">&#8595;</td>', h = "<td>" + scramble.getTypeName(c.opt.scrType || "333") + "</td>", y = "<td>" + e[0] + "</td>"; e = "<td>" + e[1] + "</td>"; var r = mathlib.time2str((Wa[b].date || [])[1], "%Y-%M-%D"); return '<tr class="' + (b == cb ? "selected mhide" : "mhide") + '"><td class="click" data="s">' + a + "-" + c.name + (b == cb ? "*" : "") + "</td>" + y + e + "<td>" + r + "</td>" + h + "<td>" + (c.opt.phases || 1) + "</td>" + f + w + '<td class="seltd">' + n + '</td></tr><tr class="' + (b == cb ? "selected " : "") + 'mshow t"><td class="click" data="s" rowspan=2>' +
                            a + "-" + c.name + (b == cb ? "*" : "") + "</td>" + y + h + f + w + '</tr><tr class="' + (b == cb ? "selected " : "") + 'mshow b">' + e + "<td>" + r + "&nbsp;" + (c.opt.phases || 1) + 'P.</td><td class="seltd" colspan=2>' + n + "</td></tr>"
            } function ab(a) {
                for (var b = !1, c = [], e = 0; e < a.length; e++) { var n = db[a[e]]; b = b || cb == n; c.push(Wa[n].name + "(" + scramble.getTypeName(Wa[n].opt.scrType || "333") + ")") } c = c.join(", "); 45 < c.length && (c = c.slice(0, 42) + "..."); return "<tr" + (b ? ' class="selected"' : "") + '><td class="click" data="e" colspan=9 style="text-align:left;">' + (b ?
                    "*" : "") + "[+] " + a.length + " session(s): " + c + "</td></tr>"
            } function Za(a) { for (var b = a.next(); b.is(":hidden"); b = b.next())b.css("display", ""); a.remove() } function Ta() {
                c(); hb.empty().append('<tr class="mhide"><th class="click" data=' + ("name" == nb ? '"g">[+]' : '"gn">[-]') + " " + STATS_SSMGR_NAME + "</th><th>" + STATS_SOLVE + "</th><th>" + STATS_AVG + "</th><th>" + STATS_DATE + '</th><th class="click" data=' + ("scr" == nb ? '"g">[+]' : '"gs">[-]') + " " + SCRAMBLE_SCRAMBLE + '</th><th>P.</th><th colspan=3>OP</th></tr><tr class="mshow t"><th rowspan=2 class="click" data=' +
                    ("name" == nb ? '"g">[+]' : '"gn">[-]') + " " + STATS_SSMGR_NAME + "</th><th>" + STATS_SOLVE + '</th><th class="click" data=' + ("scr" == nb ? '"g">[+]' : '"gs">[-]') + " " + SCRAMBLE_SCRAMBLE + '</th><th colspan=2 rowspan=2>OP</th></tr><tr class="mshow b"><th>' + STATS_AVG + "</th><th>" + STATS_DATE + " & P.</th></tr>"); for (var a = [], b = NaN, e = 0; e < db.length; e++) { var n = Wa[db[e]]; nb && n[nb] == b ? a[a.length - 1].push(e) : (a.push([e]), b = n[nb]) } for (e = 0; e < a.length; e++)if (1 == a[e].length) hb.append(Pa(a[e][0] + 1)); else for (hb.append(ab(a[e])), b = 0; b < a[e].length; b++)hb.append($(Pa(a[e][b] +
                        1)).hide()); hb.unbind("click").click(Va).unbind("change").change(Va)
            } function Oa() { Ta(); kernel.showDialog([fb, 0, void 0, 0, [STATS_SSMGR_ORDER, function () { if (!confirm(STATS_SSMGR_ODCFM)) return !1; for (var a = [], e = 1; e <= Ua; e++)a.push(e); a.sort(function (a, b) { var c = scramble.getTypeIdx(Wa[a].opt.scrType || "333"), e = scramble.getTypeIdx(Wa[b].opt.scrType || "333"); return c == e ? Wa[a].rank - Wa[b].rank : c - e }); for (e = 0; e < a.length; e++)Wa[a[e]].rank = e + 1; c(); b(); Ta(); return !1 }]], "ssmgr", STATS_SSMGR_TITLE) } function Ya(c, e) {
                if ("property" ==
                    c) "set" == e[2] || "session" == e[2] || e[0].startsWith("session") || (Wa[cb].opt = kernel.getSProps(), kernel.setProp("sessionData", JSON.stringify(Wa))), "session" == e[0] && ~~e[1] != cb ? a(e[1]) : "sessionData" == e[0] ? (Wa = JSON.parse(e[1]), "set" != e[2] && b()) : "sessionN" == e[0] ? Ua = e[1] : "scrType" == e[0] ? (Ob = e[1], "modify" == e[2] && kernel.getProp("scr2ss") && f(void 0, !1)) : "statclr" == e[0] && (e[1] ? kb.val("X").unbind("click").click(y) : kb.val("+").unbind("click").click(f)); else if ("ctrl" == c && "stats" == e[0]) {
                        var n = Wa[cb].rank; "+" == e[1] &&
                            n < Ua ? kernel.setProp("session", db[n]) : "-" == e[1] && 1 < n && kernel.setProp("session", db[n - 2])
                    }
            } var Ua = 15, cb = -1, fb = $("<div />"), hb = $("<table />").appendTo(fb).addClass("table ssmgr"), kb = $('<input type="button">').val("+"), Wa, db, jb = $("<option />").val("new").html("New.."), lb = $("<option />").val("del").html("Delete.."), gb = $("<select />").change(function () { kernel.blur(); "new" == gb.val() ? f(Ua, !1) : "del" == gb.val() ? h(cb) || gb.val(cb) : a(~~gb.val()) }), nb = !1; $(function () {
                kernel.regListener("ssmgr", "property", Ya); kernel.regListener("ssmgr",
                    "ctrl", Ya, /^stats$/); kernel.regProp("stats", "sessionN", -6, "Number of Sessions", [15]); kernel.regProp("stats", "sessionData", -6, "Session Data", ["{}"]); Ua = kernel.getProp("sessionN"); Wa = JSON.parse(kernel.getProp("sessionData")); b(); kernel.setProp("sessionData", JSON.stringify(Wa)); kernel.regProp("stats", "session", -6, "Current Session Index", [1])
            }); return {
                getSelect: function () { return gb }, showMgrTable: Oa, importSessions: function (c) {
                    if (c && 0 != c.length) {
                        for (var e = cb, n = 0; n < c.length; n++) {
                            var f = c[n], w = kernel.getSProps(),
                            h; for (h in f.opt) w[h] = f.opt[h]; cb = ++Ua; Wa[cb] = { name: f.name || cb, opt: w, rank: Ua }; kernel.setProp("sessionN", Ua); eb = f.times; Lb = []; tb.reset(eb.length); sb.reset(eb.length); Sa()
                        } b(); a(e); Oa(); logohint.push("Import %d session(s)".replace("%d", c.length)); return c.length
                    }
                }, getButton: function () { return kb }, rank2idx: function (a) { return db[a - 1] }, load: Na, save: Sa
            }
        }(), Mb = "", xb = 5, Hb = 12, Gb = 5, Jb = 12, Ob = "333", Rb = 1; $(function () {
            kernel.regListener("stats", "time", w); kernel.regListener("stats", "scramble", w); kernel.regListener("stats",
                "scrambleX", w); kernel.regListener("stats", "property", w, /^(:?useMilli|timeFormat|stat(:?sum|thres|[12][tl]|alu?|inv|Hide|src|ssum)|session(:?Data)?|scrType|phases|trimr?|view|wndStat|sr_.*)$/); kernel.regListener("stats", "ctrl", w, /^stats$/); kernel.regListener("stats", "ashow", w); kernel.regListener("stats", "button", w); kernel.regListener("stats", "giirecons", w); kernel.regProp("stats", "trim", 1, PROPERTY_TRIM, ["p5", "0 1 p1 p5 p10 p20 m".split(" "), ["0", "1", "1%", "5%", "10%", "20%", "50%/" + PROPERTY_TRIM_MED]],
                    1); kernel.regProp("stats", "trimr", 1, PROPERTY_TRIMR, ["a", "a 0 1 p1 p5 p10 p20 m".split(" "), ["auto", "0", "1", "1%", "5%", "10%", "20%", "50%/" + PROPERTY_TRIM_MED]], 1); kernel.regProp("stats", "statsum", 0, PROPERTY_SUMMARY, [!0], 1); kernel.regProp("stats", "statthres", 0, PROPERTY_STATTHRES, [!1], 1); kernel.regProp("stats", "printScr", 0, PROPERTY_PRINTSCR, [!0], 1); kernel.regProp("stats", "printDate", 0, PROPERTY_PRINTDATE, [!1], 1); kernel.regProp("stats", "imrename", 0, PROPERTY_IMRENAME, [!1], 1); kernel.regProp("stats", "scr2ss",
                        0, PROPERTY_SCR2SS, [!1]); kernel.regProp("stats", "statssum", 0, PROPERTY_STATSSUM, [!1], 1); kernel.regProp("stats", "statinv", 0, PROPERTY_STATINV, [!1], 1); kernel.regProp("stats", "statclr", 0, STATS_STATCLR, [!0], 1); kernel.regProp("stats", "absidx", 0, STATS_ABSIDX, [!1], 1); kb.append(nb.append($('<span class="click" />').html(STATS_SESSION).click(Ib.showMgrTable), Ib.getSelect(), Ib.getButton()), yb.append(zb), $('<div class="stattl">').append(qb.append(rb))); $(window).bind("resize", n); rb.append(ub, vb); kernel.addWindow("stats",
                            BUTTON_TIME_LIST, kb, !0, !0, 4); qb.bind("scroll", function () { var a = qb[0]; a.scrollHeight - a.scrollTop < a.clientHeight + 5 && !kernel.getProp("statinv") && wb.click() }); var a = STATS_TYPELEN.split("|"); kernel.regProp("stats", "stat1t", 1, a[0].replace("%d", 1), [0, [0, 1], a.slice(2)], 1); kernel.regProp("stats", "stat1l", 2, a[1].replace("%d", 1), [5, 3, 1E3], 1); kernel.regProp("stats", "stat2t", 1, a[0].replace("%d", 2), [0, [0, 1], a.slice(2)], 1); kernel.regProp("stats", "stat2l", 2, a[1].replace("%d", 2), [12, 3, 1E3], 1); kernel.regProp("stats",
                                "rsfor1s", 0, STATS_RSFORSS, [!1]); kernel.regProp("stats", "statalu", 5, PROPERTY_STATALU, ["mo3 ao5 ao12 ao100"], 1); kernel.regProp("stats", "statal", 1, PROPERTY_STATAL, ["mo3 ao5 ao12 ao100", ["mo3 ao5 ao12 ao100", "mo3 ao5 ao12 ao25 ao50 ao100", "mo3 ao5 ao12 ao25 ao50 ao100 ao200 ao500 ao1000 ao2000 ao5000 ao10000", "u"], ["mo3 ao5 ao12 ao100", "mo3 ao5 ao12 ao25 ao50 ao100", "mo3 ao5 ao12 ao25 ao50 ao100 ao200 ao500 ao1000 ao2000 ao5000 ao10000", "Custom"]], 1); kernel.regProp("stats", "delmul", 0, PROPERTY_DELMUL,
                                    [!0]); kernel.regProp("ui", "statHide", -1, "Hide Session Title", [!1]); kernel.setProp("sr_statalu", kernel.getProp("sr_statal"))
        }); var Pb = {}, Lb = [], Tb = {}, Nb = {}; for (Oa = 0; 5 > Oa; Oa++)Sa("comment" + Oa, jb.bind(null, Oa), [STATS_COMMENT + (Oa + 1), function (a) { return "" + (0 <= a ? (.001 * a).toFixed(kernel.getProp("useMilli") ? 3 : 2).replace(/\.?0+$/, "") : "N/A") }, function (a) { return "" + (0 <= a ? (.001 * a).toFixed(kernel.getProp("useMilli") ? 3 : 2) : "DNF") }]); Sa("commentmbld", function (a) {
            if (0 > a[0][0]) return -1; var b = []; (a[2] || "").replace(/[0-9]+/g,
                function (a) { b.push(parseInt(a)) }); return 2 > b.length || 2 > b[0] || b[0] > b[1] || 2 * b[0] < b[1] || 255 <= b[1] ? -1 : 1024 * (255 - (2 * b[0] - b[1])) + ~~(a[0][0] + a[0][1]) / Math.pow(2, 26) + b[0] / Math.pow(2, 34)
        }, ["MBLD", function (a) { if (0 > a) return "DNF"; if (261121 < a) return "N/A"; var b = a * Math.pow(2, 34) & 255; return "" + b + "/" + (2 * b - (255 - Math.floor(a) / 1024)) + " " + kernel.pretty(~~(a % 1 * Math.pow(2, 26))).split(".")[0] }, function (a) { if (0 > a) return "DNF"; var b = 255 - Math.floor(a) / 1024; return "" + (0 <= a ? b.toFixed(kernel.getProp("useMilli") ? 3 : 2) : "DNF") }]); return {
            importSessions: Ib.importSessions,
            getReviewUrl: function (a) { return "https://alg.cubing.net/?alg=" + encodeURIComponent((a[4][0] || "").replace(/@(\d+)/g, "/*$1*/").replace(/-/g, "&#45;")) + "&setup=" + encodeURIComponent(a[1] || "") }, pretty: Pa, getStat12: function () { return [xb, Hb, Gb, Jb] }, getTimesStatsList: function () { return sb }, getTimesStatsTable: function () { return tb }, getSessionManager: function () { return Ib }, getSortedTimesByDate: mb, trim: gb, timesAt: db, timeAt: Kb, infoClick: Va, regUtil: function (a, b) { Pb[a] = b }, regExtraInfo: Sa, getExtraInfo: Za
        }
}, [kernel.pretty,
kernel.round, kernel.pround]); var stattool = execMain(function (c, Oa, z) {
    function r() {
        if (Pa) {
            var b = stats.getTimesStatsTable(), r = b.avgSizes, h = b.getAllStats(), Na = h[0], Qa = h[1], x = 0; for (h = 0; h < b.timesLen; h++)x += stats.timesAt(h)[0][1]; h = b.prettyFunc || [c, z]; var Ta = []; Ta.push('<span class="click" data="tt">' + a[4].replace("%d", b.timesLen - Na + "/" + b.timesLen) + ", " + a[9].replace("%v", h[1](Qa)) + "</span>\n"); Ta.push("<span>" + a[12].replace("%d", c(x)) + "</span>\n"); Ta.push(a[0] + ': <span class="click" data="bs">' + h[0](b.bestTime) + "</span>"); Ta.push(" | " +
                a[2] + ': <span class="click" data="ws">' + h[0](b.worstTime) + "</span>\n"); Na = !1; Qa = '<table class="table"><tr><td></td><td>' + a[1] + "</td><td>" + a[0] + "</td></tr>"; for (x = 0; x < r.length; x++) {
                    var Oa = Math.abs(r[x]); b.timesLen >= Oa && (Na || (Na = !0, Ta.push(Qa)), Ta.push("<tr><td>" + a[7 - (r[x] >>> 31)].replace("%mk", Oa)), Ta.push('<td><span class="click" data="c' + "am"[r[x] >>> 31] + x + '">' + h[1](b.lastAvg[x][0]) + " (σ=" + stats.trim(b.lastAvg[x][1], 2) + ")</span></td>"), Ta.push('<td><span class="click" data="b' + "am"[r[x] >>> 31] + x + '">' +
                        h[1](b.bestAvg(x, 0)) + " (σ=" + stats.trim(b.bestAvg(x, 1), 2) + ")</span></td></tr>"))
                } Na && Ta.push("</table>"); Ta = Ta.join(""); e.html(Ta.replace(/\n/g, "<br>"))
        }
    } function b(a, b) { (Pa = void 0 != a) && !/^scr/.exec(b) && (a.empty().append(e.unbind("click").click(function (a) { stats.infoClick(stats.getTimesStatsTable(), stats.timesAt, a) })), r()) } var e = $("<div />").css("text-align", "center").css("font-size", "0.7em"), a = STATS_STRING.split("|"); for (Oa = 0; 13 > Oa; Oa++)a[Oa] = a[Oa] || ""; var Pa = !1; $(function () {
        "undefined" != typeof tools &&
        tools.regTool("stats", TOOLS_STATS, b); stats.regUtil("stattool", r)
    }); return { update: r }
}, [kernel.pretty, kernel.round, kernel.pround]); var trend = execMain(function (c) {
    function Oa() {
        if (f && e[0].getContext) {
            var b = stats.getStat12(), r = b[0], Pa = b[1], Va = b[2], y = b[3]; a = e[0].getContext("2d"); b = kernel.getProp("imgSize") / 10; bb = 50; e.width(9.6 * b + "em"); e.height(6 * b + "em"); e.attr("width", 8 * bb + 1); e.attr("height", 5 * bb + 5); h = 5 * bb; bb *= 8; var Oa = stats.getTimesStatsTable(), Ua = Oa.getMinMaxInt(); if (Ua) {
                var cb = Oa.timesLen; b = Oa.getBestDiff((Ua[0] - Ua[1]) * Ta); var lb = Math.ceil(Ua[0] / b) * b; Ua = ~~(Ua[1] / b) * b; var gb = lb - Ua, Ya = [0, 1, 1, 0, 0], fb = [0, 0, 1, 1, 0]; a.fillStyle = "#fff";
                a.beginPath(); a.moveTo(Ya[0] * (bb - 35) + 35, (1 - fb[0]) * (h - 25) + 25); for (var Xa = 1; Xa < Ya.length; Xa++)a.lineTo(Ya[Xa] * (bb - 35) + 35, (1 - fb[Xa]) * (h - 25) + 25); a.fill(); a.closePath(); a.lineWidth = 2; if (1 < cb) { fb = []; Xa = []; for (Ya = 0; Ya < cb; Ya++) { var w = Oa.timeAt(Ya); -1 != w && (fb.push(Ya / (cb - 1)), Xa.push(Math.max(0, Math.min(1, (w - Ua) / gb)))) } z(fb, Xa, "#888") } if (cb > Va) {
                    fb = []; Xa = []; w = Oa.runAvgMean(0, cb, Va, 0 < r ? void 0 : 0); for (Ya = 0; Ya < w.length; Ya++)-1 != w[Ya][0] && (fb.push((Ya + Va - 1) / (cb - 1)), Xa.push(Math.max(0, Math.min(1, (w[Ya][0] - Ua) / gb))));
                    z(fb, Xa, "#f00")
                } if (cb > y) { fb = []; Xa = []; Oa = Oa.runAvgMean(0, cb, y, 0 < Pa ? void 0 : 0); for (Ya = 0; Ya < Oa.length; Ya++)-1 != Oa[Ya][0] && (fb.push((Ya + y - 1) / (cb - 1)), Xa.push(Math.max(0, Math.min(1, (Oa[Ya][0] - Ua) / gb)))); z(fb, Xa, "#00f") } a.clearRect(0, 0, bb, 25); a.clearRect(0, 0, 35, h); a.clearRect(0, h, bb + 1, h + 5); a.lineWidth = 2; a.font = "12pt Arial"; a.fillStyle = kernel.getProp("col-font"); a.fillText("time", 50, 13); a.strokeStyle = "#888"; a.beginPath(); a.moveTo(90, 7); a.lineTo(130, 7); a.stroke(); a.fillText((0 < r ? "ao" : "mo") + Va, 160, 13); a.strokeStyle =
                    "#f00"; a.beginPath(); a.moveTo(200, 7); a.lineTo(240, 7); a.stroke(); a.fillText((0 < Pa ? "ao" : "mo") + y, 270, 13); a.strokeStyle = "#00f"; a.beginPath(); a.moveTo(310, 7); a.lineTo(350, 7); a.stroke(); a.fillStyle = kernel.getProp("col-font"); a.strokeStyle = "#ccc"; a.lineWidth = 1; a.textAlign = "right"; r = 1E3 <= b ? /[^\.]+(?=\.)/ : /[^\.]+\.[\d]/; for (Ya = Ua; Ya <= lb; Ya += b)Pa = c(Ya).match(r)[0], Va = (lb - Ya) / gb, Va = 1 - (1 - Va - x) / Ta, 0 > Va || 1 < Va || (a.fillText(Pa, 30, Va * (h - 25) + 30), z([Na, Na + Qa], [(Ya - Ua) / gb, (Ya - Ua) / gb], "#ccc")); z([Na, Na + Qa, Na + Qa, Na, Na],
                        [x, x, x + Ta, x + Ta, x], "#000")
            }
        }
    } function z(b, c, e) { a.strokeStyle = e; a.beginPath(); for (e = 0; e < b.length; e++)b[e] = (b[e] - Na) / Qa, c[e] = (c[e] - x) / Ta; a.moveTo(b[0] * (bb - 35) + 35, (1 - c[0]) * (h - 25) + 25); for (e = 1; e < b.length; e++)a.lineTo(b[e] * (bb - 35) + 35, (1 - c[e]) * (h - 25) + 25); a.stroke(); a.closePath() } function r(a) {
        var b = $(a.target); b.hasClass("click") && (a = b.attr("data"), "x" == a ? (Ua = "y", b.attr("data", "y"), b.html("")) : "y" == a ? (Ua = "x", b.attr("data", "x"), b.html("")) : (b = { p: 1, m: -1 }[a] || 0, a = { l: Math.sqrt(.5), s: Math.sqrt(2) }[a] || 1, "x" ==
            Ua ? (Na += b * Qa * .25 + Qa * (1 - a), Qa *= a, Qa = Math.min(Math.max(Qa, .1), 1), Na = Math.min(Math.max(Na, 0), 1 - Qa)) : (x += b * Ta * .25 + Ta * (1 - a) / 2, Ta *= a, Ta = Math.min(Math.max(Ta, .1), 1), x = Math.min(Math.max(x, 0), 1 - Ta)), Oa()))
    } function b(a, b) {
        (f = void 0 != a) && !/^scr/.exec(b) && (a.empty().append(Pa.empty().append(e, "<br>", ['<span class="click" data="%" style="font-family: iconfont, Arial;display:inline-block;width:2em;">$</span>'.replace("$", "").replace("%", "x"), '<span class="click" data="%" style="font-family: iconfont, Arial;display:inline-block;width:2em;">$</span>'.replace("$",
            "&lt;").replace("%", "p"), '<span class="click" data="%" style="font-family: iconfont, Arial;display:inline-block;width:2em;">$</span>'.replace("$", "&gt;").replace("%", "m"), '<span class="click" data="%" style="font-family: iconfont, Arial;display:inline-block;width:2em;">$</span>'.replace("$", "").replace("%", "l"), '<span class="click" data="%" style="font-family: iconfont, Arial;display:inline-block;width:2em;">$</span>'.replace("$", "").replace("%", "s")].join("")).unbind("click").click(r)), Oa())
    } var e =
        $('<canvas style="margin-bottom:-0.4em"/>'), a, Pa = $('<div style="text-align:center">'), f = !1, bb, h, Na = 0, Qa = 1, x = 0, Ta = 1, Ua = "x"; $(function () { "undefined" != typeof tools && (kernel.regListener("trend", "property", function (a, b) { "disPrec" == b[0] && Oa() }, /^disPrec|col-font$/), e[0].getContext && tools.regTool("trend", TOOLS_TREND, b)); stats.regUtil("trend", Oa) }); return { update: Oa }
}, [kernel.pretty]); var distribution = execMain(function (c) {
    function Oa() {
        if (b) {
            r.empty(); var e = stats.getTimesStatsTable(), a = e.getMinMaxInt(); if (a) {
                var z = e.timesLen, f = a[0], Oa = a[1]; a = a[2]; f = ~~(f / a); Oa = ~~(Oa / a); for (var h = {}, Na = {}, Qa = 0, x = Na[f + 1] = 0; x < z; x++) { var Ta = e.timeAt(x); -1 != Ta ? (Ta = ~~(Ta / a), h[Ta] = (h[Ta] || 0) + 1, Qa = Math.max(h[Ta], Qa), Na[Ta] = x + 1) : Na[f + 1] = x + 1 } for (x = f; x > Oa; x--)Na[x] = Math.max(Na[x + 1], Na[x] || 0); e = []; Ta = 0; var Ua = 1E3 <= a ? /[^\.]+(?=\.)/ : /[^\.]+\.[\d]/, Wa = c(f * a).match(Ua)[0].length; for (x = Oa; x <= f; x++) {
                    Oa = c(x * a).match(Ua)[0];
                    var Ra = c((x + 1) * a).match(Ua)[0]; h[x] = h[x] || 0; Ta += h[x]; Oa = mathlib.valuedArray(Wa - Oa.length, "&nbsp;").join("") + Oa; Ra = mathlib.valuedArray(Wa - Ra.length, "&nbsp;").join("") + Ra; e.push("<tr><td>" + Oa + '+</td><td><span class="cntbar" style="width: ' + h[x] / Qa * 5 + 'em;">' + h[x] + "</span></td><td>&nbsp;&lt;" + Ra + '</td><td><span class="cntbar" style="width: ' + Ta / z * 5 + 'em; white-space: nowrap;">' + (z - Na[x + 1]) + "/" + Ta + "</span></td></tr>")
                } r.html('<table style="border:none;">' + e.join("") + "</table>")
            }
        }
    } function z(c, a) {
        (b = void 0 !=
            c) && !/^scr/.exec(a) && (c.empty().append(r), Oa())
    } var r = $("<div />"), b = !1; $(function () { "undefined" != typeof tools && (kernel.regListener("distribution", "property", function (b, a) { "disPrec" == a[0] && Oa() }, /^disPrec$/), kernel.regProp("tools", "disPrec", 1, STATS_PREC, ["a", ["a", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9], STATS_PREC_STR.split("|")], 1), tools.regTool("distribution", TOOLS_DISTRIBUTION, z)); stats.regUtil("distribution", Oa) }); return { update: Oa }
}, [kernel.pretty]); var crossSessionStats = execMain(function (c, Oa, z) {
    function r(a) { return -1 == Wa[a][0][0] ? -1 : ~~((Wa[a][0][0] + Wa[a][0][1]) / Ra) * Ra } function b(a) { return Wa[a] } function e() {
        Wa = []; Ra = kernel.getProp("useMilli") ? 1 : 10; for (var a = Promise.resolve(), b = ~~kernel.getProp("sessionN"), e = JSON.parse(kernel.getProp("sessionData")), f = Na.val(), y = x.val(), r = -1 == Qa.val() ? -1 : ~~(+new Date / 1E3) - 86400 * Qa.val(), Va = 0; Va < b; Va++) {
            var Xa = stats.getSessionManager().rank2idx(Va + 1); if ("*" == f || e[Xa].name == f) if ("*" == y || (e[Xa].opt.scrType || "333") ==
                y) a = a.then(function (a) { return new Promise(function (b) { storage.get(a).then(function (a) { for (var c = 0; c < a.length; c++)(a[c][3] || 0) < r || Wa.push(a[c]); b() }) }) }.bind(void 0, Xa))
        } a.then(function () {
            Wa = stats.getSortedTimesByDate(Wa); Ua.reset(Wa.length); var a = Ua.getAllStats(), b = a[0], e = a[1], f = 0; for (a = 0; a < Wa.length; a++)f += Wa[a][0][1]; a = []; a.push('<span class="click" data="tt">' + $a[4].replace("%d", Ua.timesLen - b + "/" + Ua.timesLen) + ", " + $a[9].replace("%v", z(e)) + "</span>\n"); a.push("<span>" + $a[12].replace("%d", c(f)) +
                "</span>\n"); a.push($a[0] + ': <span class="click" data="bs">' + c(Ua.bestTime) + "</span>"); a.push(" | " + $a[2] + ': <span class="click" data="ws">' + c(Ua.worstTime) + "</span>\n"); b = !1; e = '<table class="table"><tr><td></td><td>' + $a[1] + "</td><td>" + $a[0] + "</td></tr>"; f = Ua.avgSizes; for (var y = 0; y < f.length; y++) {
                    var r = Math.abs(f[y]); Ua.timesLen >= r && (b || (b = !0, a.push(e)), a.push("<tr><td>" + $a[7 - (f[y] >>> 31)].replace("%mk", r)), a.push('<td><span class="click" data="c' + "am"[f[y] >>> 31] + y + '">' + z(Ua.lastAvg[y][0]) + " (σ=" + stats.trim(Ua.lastAvg[y][1],
                        2) + ")</span></td>"), a.push('<td><span class="click" data="b' + "am"[f[y] >>> 31] + y + '">' + z(Ua.bestAvg(y, 0)) + " (σ=" + stats.trim(Ua.bestAvg(y, 1), 2) + ")</span></td></tr>"))
                } b && a.push("</table>"); a = a.join(""); h.html(a.replace(/\n/g, "<br>"))
        })
    } function a() {
        var a = !1, b = JSON.parse(kernel.getProp("sessionData")); $.each(b, function (b, c) { y[b] && c.name == y[b].name && (c.opt || {}).scrType == (y[b].opt || {}).scrType || (a = !0) }); y = b; if (a) {
            var c = [], e = []; Na.empty().append($("<option />").val("*").html(STATS_XSESSION_NAME)); x.empty().append($("<option />").val("*").html(STATS_XSESSION_SCR));
            $.each(b, function (a, b) { var f = b.name; -1 == $.inArray(f, c) && (c.push(f), Na.append($("<option />").val(f).html(f))); f = (b.opt || {}).scrType || "333"; -1 == $.inArray(f, e) && (e.push(f), x.append($("<option />").val(f).html(scramble.getTypeName(f)))) })
        }
    } function Pa(c, f) { (Va = c) && !/^scr/.exec(f) && (a(), c.empty().append(bb), Ta.unbind("click").click(e), h.unbind("click").click(function (a) { stats.infoClick(Ua, b, a) })) } function f(b, c) { "sessionData" == c[0] && Va && a() } Oa = STATS_XSESSION_DATE.split("|"); var bb = $("<div />").css("text-align",
        "center").css("font-size", "0.7em"), h = $("<div />"), Na = $("<select>"), Qa = $("<select>").append($("<option>").val(-1).html(Oa[0]), $("<option>").val(1).html(Oa[1]), $("<option>").val(7).html(Oa[2]), $("<option>").val(30).html(Oa[3]), $("<option>").val(365).html(Oa[4])).val(-1), x = $("<select>"), Ta = $('<span class="click">' + STATS_XSESSION_CALC + "</span>"), Ua = new TimeStat([], 0, r), Wa = [], Ra = 1, $a = STATS_STRING.split("|"); for (Oa = 0; 13 > Oa; Oa++)$a[Oa] = $a[Oa] || ""; var Va = null, y = {}; $(function () {
            bb.append(Na, Qa, x, " ", Ta, "<br>",
                h); "undefined" != typeof tools && tools.regTool("hugestats", TOOLS_HUGESTATS, Pa); kernel.regListener("labelstat", "property", f, /^sessionData$/)
        }); return { update: $.noop, updateStatal: function (a) { Ua = new TimeStat(a, 0, r) } }
}, [kernel.pretty, kernel.round, kernel.pround]); var periodStats = execMain(function () {
    function c(a) { a -= x; var b = new Date(1E3 * a); switch (Ta) { case "d": return ~~(a / 86400); case "w": return ~~((a / 86400 - Na.val()) / 7); case "m": return 12 * b.getFullYear() + b.getMonth(); case "y": return b.getFullYear() } } function Oa(a) { switch (Ta) { case "d": return mathlib.time2str(86400 * a + x, "%Y-%M-%D"); case "w": return mathlib.time2str(86400 * (7 * a + ~~Na.val()) + x, "Start@ %Y-%M-%D"); case "m": return ~~(a / 12) + "-" + ("0" + (a % 12 + 1)).slice(-2); case "y": return "" + a } } function z() {
        for (var a = Promise.resolve(),
            b = ~~kernel.getProp("sessionN"), e = 0; e < b; e++) { var f = stats.getSessionManager().rank2idx(e + 1); a = a.then(function (a) { return new Promise(function (b) { storage.get(a).then(function (e) { stats[a] = {}; for (var n = 0; n < e.length; n++)if (e[n][3]) { var f = c(e[n][3]); stats[a][f] = stats[a][f] || [0, 0]; stats[a][f][0] += 1; stats[a][f][1] += -1 != e[n][0][0] } b() }) }) }.bind(void 0, f)) } return a.then(function () { Qa = stats })
    } function r(a) {
        a = $(a.target).html(); "&gt;" == a ? Wa-- : "&lt;" == a ? Wa = Math.min(Wa + 1, 0) : "+" == a ? Ra++ : "-" == a && (Ra = Math.max(1, Ra -
            1)); b()
    } function b() {
        if (mb) {
            var b = $('<table class="table">'), c = TOOLS_DLYSTAT1.split("|"); cb.empty().append(c[0], f.unbind("change").change(a), " " + c[1], bb.unbind("change").change(a), " " + c[2], Na.unbind("change").change(a), "<br>", b); c = JSON.parse(kernel.getProp("sessionData")); for (var e = ~~kernel.getProp("sessionN"), h = $("<tr>").append(Va.unbind("click").click(r), $a.unbind("click").click(r)), x = $("<tr>").append(y.unbind("click").click(r), db.unbind("click").click(r)), w = 0; w < Ra; w++)h.append($("<td rowspan=2>").html(Oa(Ua -
                w + Wa).replace(" ", "<br>"))); b.append(h, x); for (w = 0; w < e; w++)if (h = stats.getSessionManager().rank2idx(w + 1), 0 != Object.keys(Qa[h] || {}).length) { x = $("<tr>").append($("<td colspan=2>").html(c[h].name)); for (var n = 0; n < Ra; n++) { var z = Qa[h][Ua - n + Wa]; x.append($("<td>").html(z ? z[1] + "/" + z[0] : "-")) } b.append(x) }
        }
    } function e(b, c) { mb = !!b; b && !/^scr/.exec(c) && (b.empty().append(cb), a()) } function a() { mb && (Ta = f.val(), x = 3600 * bb.val() + 60 * (new Date).getTimezoneOffset(), Ua = c(+new Date / 1E3), z().then(b)) } var Pa = TOOLS_DLYSTAT_OPT1.split("|"),
        f = $("<select>").append($("<option>").val("d").html(Pa[0]), $("<option>").val("w").html(Pa[1]), $("<option>").val("m").html(Pa[2]), $("<option>").val("y").html(Pa[3])).val("d"), bb = $("<select>"); for (Pa = 0; 24 > Pa; Pa++) { var h = ("0" + Pa).slice(-2) + ":00"; bb.append($("<option>").val(Pa).html(h)) } Pa = TOOLS_DLYSTAT_OPT2.split("|"); var Na = $("<select>").append($("<option>").val(3).html(Pa[0]), $("<option>").val(4).html(Pa[1]), $("<option>").val(5).html(Pa[2]), $("<option>").val(6).html(Pa[3]), $("<option>").val(0).html(Pa[4]),
            $("<option>").val(1).html(Pa[5]), $("<option>").val(2).html(Pa[6])).val(3), Qa = [], x, Ta, Ua, Wa = 0, Ra = 3, $a = $('<td class="click">').html("&gt;"), Va = $('<td class="click">').html("&lt;"), y = $('<td class="click">').html("+"), db = $('<td class="click">').html("-"); $("<td colspan=1>"); var mb = !1, cb = $("<div />").css("text-align", "center").css({ "font-size": "0.7em", "max-height": "20em", "overflow-y": "auto" }); $(function () {
                "undefined" != typeof tools && tools.regTool("dlystat", TOOLS_DLYSTAT, e); kernel.regListener("dlystat",
                    "property", b, /^sessionData$/); stats.regUtil("dlystat", a)
            }); return { update: a }
}); var recons = execMain(function () {
    function c() { this.clear() } function Oa(a, b) {
        if (a && a[4] && !(0 > a[0][0])) {
            var e = a[4], f = new mathlib.CubieCube; new mathlib.CubieCube; f.ori = 0; e = e[0].split(/ +/); for (var h = e.length - 1; 0 <= h; h--)f.selfMoveStr(e[h], !0); f.selfConj(); h = f.toFaceCube(); var y = [], r = new c, x = new mathlib.CubieCube; x.invFrom(f); var Na = 0, z = 0, w = [], n = cubeutil.getProgress(h, b); for (h = 0; h < e.length; h++) {
                var Sa = f.selfMoveStr(e[h], !1); if (void 0 != Sa) {
                    z = Math.min(z, f.tstamp); r.push(Sa); var Va = ~~(Sa / 3); w.push(["URFDLB".charAt(Va %
                        6) + " 2'".charAt(Sa % 3), f.tstamp]); 6 <= Va && w.push(["DLBURF".charAt(Va % 6) + "'2 ".charAt(Sa % 3), f.tstamp])
                } Sa = cubeutil.getProgress(f.toFaceCube(), b); if (Sa < n) { Va = new mathlib.CubieCube; mathlib.CubieCube.EdgeMult(x, f, Va); mathlib.CubieCube.CornMult(x, f, Va); for (y[--n] = [Na, z, f.tstamp, r.moveCnt, Va, w]; n > Sa;)y[--n] = [f.tstamp, f.tstamp, f.tstamp, 0, new mathlib.CubieCube, []]; x.invFrom(f); Na = f.tstamp; r.clear(); w = []; z = 1E9 }
            } e = cubeutil.getStepCount(b); f = []; for (h = 0; h < e; h++)f[h] = (y[h] || [])[5] || []; return { data: y, rawMoves: f.reverse() }
        }
    }
    function z(a, b, c, e, f) {
        for (var h = 0, y = 0, r = [], Na = [], z = 0; z < a.length; z++) { y += a[z][1] + a[z][2]; var w = a[z][0].split("-"); 0 != r.length && r[r.length - 1][0] == w[0] || r.push([w[0], 0, 0, 0]); Na[z] = r.length - 1; w = r[r.length - 1]; for (var n = 1; 4 > n; n++)w[n] += a[z][n]; h = Math.max(w[1] + w[2], h) } w = []; var Sa = 0, Va = 0, Qa = 0, Oa = -1; for (z = 0; z < a.length; z++) {
            var cb = a[z]; Sa += cb[1]; Va += cb[2]; Qa += cb[3]; if (Na[z] == Na[z + 1] && Na[z] != Na[z - 1]) {
                Oa = Na[z]; n = r[Oa]; var mb = ["", n[0], n[1] / h * 100, n[2] / h * 100, c ? Math.round(n[1] / y * 1E3) / 10 + "%" : kernel.pretty(n[1]), c ?
                    Math.round(n[2] / y * 1E3) / 10 + "%" : kernel.pretty(n[2]), Math.round(10 * n[3]) / 10, 0 < n[3] && 0 < n[1] + n[2] ? Math.round(n[3] / (n[1] + n[2]) * 1E4) / 10 : "N/A", "click sstep"], kb = '<tr style="$0" data="$1"><td rowspan=2 class="$8" style="padding-bottom:0;padding-top:0;">$1</td><td colspan=4 style="padding:0;"><span class="cntbar sty2" style="height:0.2em;float:left;border:none;width:$2%;">&nbsp;</span><span class="cntbar" style="height:0.2em;float:left;border:none;width:$3%;">&nbsp;</span></td></tr><tr style="$0" data="$1"><td style="padding-bottom:0;padding-top:0;">$4</td><td style="padding-bottom:0;padding-top:0;">$5</td><td style="padding-bottom:0;padding-top:0;">$6</td><td style="padding-bottom:0;padding-top:0;">$7</td></tr>';
                for (n = 0; 9 > n; n++)kb = kb.replace(new RegExp("\\$" + n, "g"), mb[n]); w.push(kb)
            } cb = [Na[z] == Oa ? "display:none;" : "", cb[0], cb[1] / h * 100, cb[2] / h * 100, c ? Math.round(cb[1] / y * 1E3) / 10 + "%" : kernel.pretty(cb[1]), c ? Math.round(cb[2] / y * 1E3) / 10 + "%" : kernel.pretty(cb[2]), Math.round(10 * cb[3]) / 10, 0 < cb[3] && 0 < cb[1] + cb[2] ? Math.round(cb[3] / (cb[1] + cb[2]) * 1E4) / 10 : "N/A", ""]; kb = '<tr style="$0" data="$1"><td rowspan=2 class="$8" style="padding-bottom:0;padding-top:0;">$1</td><td colspan=4 style="padding:0;"><span class="cntbar sty2" style="height:0.2em;float:left;border:none;width:$2%;">&nbsp;</span><span class="cntbar" style="height:0.2em;float:left;border:none;width:$3%;">&nbsp;</span></td></tr><tr style="$0" data="$1"><td style="padding-bottom:0;padding-top:0;">$4</td><td style="padding-bottom:0;padding-top:0;">$5</td><td style="padding-bottom:0;padding-top:0;">$6</td><td style="padding-bottom:0;padding-top:0;">$7</td></tr>';
            for (n = 0; 9 > n; n++)kb = kb.replace(new RegExp("\\$" + n, "g"), cb[n]); w.push(kb)
        } a = $("<tr>").append(b ? $("<td>").append(Ra) : $('<td style="padding:0;">').append(Ua), "<td>" + (c ? Math.round(Sa / y * 1E3) / 10 + "%" : kernel.pretty(Sa)) + "</td><td>" + (c ? Math.round(Va / y * 1E3) / 10 + "%" : kernel.pretty(Va)) + "</td>", $("<td>").append(e || f ? x : Math.round(10 * Qa) / 10), "<td>" + (0 < Qa && 0 < Sa + Va ? Math.round(Qa / (Sa + Va) * 1E4) / 10 : "N/A") + "</td>"); Ta.empty().append($a); $a.after(w.join(""), a); Ua.unbind("change").change(Pa); Wa.unbind("change").change(Pa);
        Ta.unbind("click").click(Pa); Ra.text("No." + b); (e || f) && x.children("a").attr("href", "https://alg.cubing.net/?alg=" + encodeURIComponent(f) + "&setup=" + encodeURIComponent(e)).text(Math.round(10 * Qa) / 10)
    } function r(a) { Ta.empty().append($a); $a.after($("<tr>").append(a ? $("<td>").append(Ra) : $('<td style="padding:0;">').append(Ua), "<td colspan=4>" + TOOLS_RECONS_NODATA + "</td>")); Ua.unbind("change").change(Pa); Wa.unbind("change").change(Pa); Ta.unbind("click").click(Pa); Ra.text("---") } function b(b, c) {
        (h = void 0 != b) &&
        !/^scr/.exec(c) && (b.empty().append(Qa.append(Ta)), a())
    } function e(a, b) { if (h) { var c = Wa.val() || "cf4op", e = c.endsWith("%"); c = c.replace("%", ""); var f = b[0], y = Oa(f, c); if (y) { for (var x = y.data, Na = cubeutil.getStepNames(c), Va = [], Qa = Na.length - 1; 0 <= Qa; Qa--) { var w = x[Qa] || [0, 0, 0, 0]; Va.push([Na[Qa], w[1] - w[0], w[2] - w[1], w[3]]) } c = cubeutil.getPrettyReconstruction(y.rawMoves, c).prettySolve; z(Va, b[1] + 1, e, f[1], c) } else r(!0) } } function a() {
        if (h) {
            var a = stats.getTimesStatsTable().timesLen, b = Ua.val(); if (b = "single" == b ? Math.min(1,
                a) : "mo5" == b ? Math.min(5, a) : "mo12" == b ? Math.min(12, a) : "mo100" == b ? Math.min(100, a) : a) {
                    var c = Wa.val() || "cf4op", e = c.endsWith("%"); c = c.replace("%", ""); for (var f = cubeutil.getStepNames(c), x = 0, Na = [], Qa = a - 1; Qa >= a - b; Qa--) { var Ra = stats.getExtraInfo("recons_" + c, Qa); if (Ra) { var Xa = Ra.data; x++; for (var w = f.length - 1; 0 <= w; w--) { var n = Xa[w] || [0, 0, 0, 0], Sa = f.length - w - 1; Na[Sa] = Na[Sa] || [f[w], 0, 0, 0]; Na[Sa][1] += n[1] - n[0]; Na[Sa][2] += n[2] - n[1]; Na[Sa][3] += n[3] } } } if (0 == x) r(!1); else {
                        for (w = 0; w < f.length; w++)Na[w][1] /= x, Na[w][2] /= x,
                            Na[w][3] /= x; 1 == b ? (b = cubeutil.getPrettyReconstruction(Ra.rawMoves, c).prettySolve, z(Na, null, e, stats.timesAt(a - 1)[1], b)) : z(Na, null, e)
                    }
            } else r(!1)
        }
    } function Pa(b) { if ("change" == b.type) kernel.setProp("rcMthd", Wa.val()), a(); else if (b = $(b.target), b.is(".click") && !b.is(".exturl")) if (b.is(".sstep")) { b = b.parent(); var c = b.attr("data") + "-"; for (b = b.next().next(); b && b.attr("data").startsWith(c);)b.toggle(), b = b.next() } else a() } function f(a, b, c, e, f) {
        return (a = stats.getExtraInfo("recons_" + a, f)) ? (a.data[c[0]] || [0, 0,
            0, 0])[c[1]] - (a.data[b[0]] || [0, 0, 0, 0])[b[1]] : -1
    } function bb(a, b, c, e) { a = stats.getExtraInfo("recons_" + a, e); if (!a) return -1; for (e = c = 0; e < a.data.length; e++) { var f = a.data[e] || [0, 0, 0, 0]; c += b ? f[1] - f[0] : f[2] - f[1] } return c } var h, Na = TOOLS_RECONS_TITLE.split("|"), Qa = $('<div style="font-size:0.9em;" />'), x = $("<div>").append('<a target="_blank" class="exturl click"></a>'), Ta = $('<table class="table">'), Ua = $("<select>"), Wa = $("<select>"), Ra = $('<span class="click" />'), $a = $("<tr>").append($('<th style="padding:0;">').append(Wa),
        "<th>" + Na[0] + "</th><th>" + Na[1] + "</th><th>" + Na[2] + "</th><th>" + Na[3] + "</th>"); c.prototype.push = function (a) { a = ~~(a / 3); var b = 1 << a; a % 3 != this.lastMove % 3 && (this.lastMove = a, this.lastPow = 0); this.moveCnt += (this.lastPow & b) == b ? 0 : 1; this.lastPow |= b }; c.prototype.clear = function () { this.lastPow = 0; this.lastMove = -3; this.moveCnt = 0 }; $(function () {
            "undefined" != typeof tools && tools.regTool("recons", TOOLS_RECONS + ">step", b); stats.regUtil("recons", a); stats.regExtraInfo("recons_cf4op", function (a) { return Oa(a, "cf4op") }); stats.regExtraInfo("recons_roux",
                function (a) { return Oa(a, "roux") }); stats.regExtraInfo("recons_cfop_ct", f.bind(null, "cf4op", [6, 0], [6, 2]), ["cross " + STATS_TIME, kernel.pretty]); stats.regExtraInfo("recons_cfop_ft", f.bind(null, "cf4op", [5, 0], [2, 2]), ["F2L " + STATS_TIME, kernel.pretty]); stats.regExtraInfo("recons_cfop_ot", f.bind(null, "cf4op", [1, 0], [1, 2]), ["OLL " + STATS_TIME, kernel.pretty]); stats.regExtraInfo("recons_cfop_pt", f.bind(null, "cf4op", [0, 0], [0, 2]), ["PLL " + STATS_TIME, kernel.pretty]); stats.regExtraInfo("recons_cfop_it", bb.bind(null,
                    "cf4op", !0), ["CFOP " + Na[0], kernel.pretty]); stats.regExtraInfo("recons_cfop_et", bb.bind(null, "cf4op", !1), ["CFOP " + Na[1], kernel.pretty]); kernel.regListener("recons", "reqrec", e); for (var c = ["single", "mo5", "mo12", "mo100", "all"], h = 0; h < c.length; h++)Ua.append('<option value="' + c[h] + '">' + c[h] + "</option>"); c = [["cf4op", "cfop"], ["roux", "roux"]]; for (h = 0; h < c.length; h++)Wa.append('<option value="' + c[h][0] + '">' + c[h][1] + "</option>"), Wa.append('<option value="' + c[h][0] + '%">' + c[h][1] + "%</option>"); Wa.val(kernel.getProp("rcMthd",
                        "cf4op"))
        }); return { calcRecons: Oa, getMoveCnt: function (a) { a = a.split(/ +/); var b = new mathlib.CubieCube; b.ori = 0; for (var e = new c, f = 0; f < a.length; f++) { var h = b.selfMoveStr(a[f], !1); void 0 != h && e.push(h) } return e.moveCnt } }
}), caseStat = execMain(function () {
    function c() {
        if (b) {
            for (var a = stats.getTimesStatsTable().timesLen, c = f.val() || "PLL", e = cubeutil.getIdentData(c), h = 0, r = [], z = a - 1; z >= a - a; z--) {
                var Ra = stats.getExtraInfo("recons_cf4op_" + c, z); if (Ra) {
                    h++; var $a = Ra[0]; r[$a] = r[$a] || [0, 0, 0, 0]; var Va = [1].concat(Ra.slice(1));
                    for (Ra = 0; 4 > Ra; Ra++)r[$a][Ra] += Va[Ra]
                }
            } Pa.empty().append(bb); a = 0; for (Ra = e[2]; Ra < e[3]; Ra++)r[Ra] && (a = Math.max(a, (r[Ra][1] + r[Ra][2]) / r[Ra][0])); for (Ra = e[2]; Ra < e[3]; Ra++)if (r[Ra]) {
                c = r[Ra]; $("<tr>"); z = [e[1](Ra)[2], c[0], c[1] / c[0] / a * 100, c[2] / c[0] / a * 100, kernel.pretty(c[1] / c[0]), kernel.pretty(c[2] / c[0]), Math.round(c[3] / c[0] * 10) / 10, Math.round(c[3] / (c[1] + c[2]) * 1E4) / 10]; c = '<tr><td rowspan=2 style="padding-bottom:0;padding-top:0;">$0</td><td rowspan=2 style="padding:0"><canvas/></td><td rowspan=2 style="padding-bottom:0;padding-top:0;">$1</td><td colspan=4 style="padding:0;"><span class="cntbar sty2" style="height:0.25em;float:left;border:none;width:$2%;">&nbsp;</span><span class="cntbar" style="height:0.25em;float:left;border:none;width:$3%;">&nbsp;</span></td></tr><tr><td style="padding-bottom:0;padding-top:0;">$4</td><td style="padding-bottom:0;padding-top:0;">$5</td><td style="padding-bottom:0;padding-top:0;">$6</td><td style="padding-bottom:0;padding-top:0;">$7</td></tr>';
                for ($a = 0; 8 > $a; $a++)c = c.replace(new RegExp("\\$" + $a, "g"), z[$a]); c = $(c); z = c.find("canvas"); z.css({ width: "2em", height: "2em", display: "block" }); e[1](Ra, z); Pa.append(c)
            } f.unbind("change").change(Oa); 0 == h && bb.after("<tr><td colspan=7>" + TOOLS_RECONS_NODATA + "</td></tr>")
        }
    } function Oa(a) { "change" == a.type && c() } function z(e, f) { (b = void 0 != e) && !/^scr/.exec(f) && (e.empty().append(a.append(Pa)), c()) } function r(a, b, c) {
        if (b = stats.getExtraInfo("recons_cf4op", c)) if (a = cubeutil.getIdentData(a), b = b.data[a[4]]) return h = h ||
            new mathlib.CubieCube, h.invFrom(b[4]), [a[0](h.toFaceCube()), b[1] - b[0], b[2] - b[1], b[3]]
    } var b, e = TOOLS_RECONS_TITLE.split("|"), a = $('<div style="font-size:0.9em;" />'), Pa = $('<table class="table">'), f = $("<select>"), bb = $("<tr>").append($('<th colspan=2 style="padding:0;">').append(f), "<th>N</th><th>" + e[0] + "</th><th>" + e[1] + "</th><th>" + e[2] + "</th><th>" + e[3] + "</th>"), h; $(function () {
        "undefined" != typeof tools && tools.regTool("casestat", TOOLS_RECONS + ">cases", z); stats.regUtil("casestat", c); for (var a = ["PLL", "OLL"],
            b = 0; b < a.length; b++)f.append('<option value="' + a[b] + '">' + a[b] + "</option>"), stats.regExtraInfo("recons_cf4op_" + a[b], r.bind(null, a[b]))
    })
}), scatter = execMain(function () {
    function c() { h.html(TOOLS_RECONS_NODATA); bb.unbind("change").change(b); f.hide() } function Oa(b, e) {
        if (!b || !b[4]) return c(); var r = recons.calcRecons(b, e); if (!r) return c(); f.show(); Pa = a[0].getContext("2d"); var y = kernel.getProp("imgSize") / 10; Qa = 50; a.width(9.6 * y + "em"); a.height(4.8 * y + "em"); a.attr("width", 8 * Qa + 1); a.attr("height", 4 * Qa + 5); x = 4 * Qa;
        Qa *= 8; y = r.data[0][2]; for (var Na = 0, z = 0; z < r.data.length; z++)Na += r.data[z][5].length; z = [0, 1, 1, 0, 0]; var Va = [0, 0, 1, 1, 0]; Pa.fillStyle = "#fff"; Pa.beginPath(); Pa.moveTo(z[0] * (Qa - 0), (1 - Va[0]) * (x - 0)); for (var Oa = 1; Oa < z.length; Oa++)Pa.lineTo(z[Oa] * (Qa - 0), (1 - Va[Oa]) * (x - 0)); Pa.fill(); Pa.closePath(); Va = 0; Oa = []; var $a = [], Xa = [], w = 0, n = 0; for (z = r.data.length - 1; 0 <= z; z--) {
            for (var Sa = r.data[z], Za = 0; Za < Sa[5].length; Za++)if ($a.push(Va / (Na - 1)), Oa.push(Sa[5][Za][1] / y), Va++, 1 < Oa.length) {
                Pa.lineWidth = 3; var hb = "#888"; Oa[1] - Oa[0] >
                    3 / (Na - 1) ? (hb = "#f00", w += Oa[1] - Oa[0]) : Oa[1] - Oa[0] > 2 / (Na - 1) && (hb = "#00f", n += Oa[1] - Oa[0]); var bb = Oa, jb = $a; Pa.strokeStyle = hb; Pa.beginPath(); for (hb = 0; hb < bb.length; hb++)bb[hb] = (bb[hb] - Ta) / Ua, jb[hb] = (jb[hb] - Wa) / Ra; Pa.moveTo(bb[0] * (Qa - 0), (1 - jb[0]) * (x - 0)); for (hb = 1; hb < bb.length; hb++)Pa.lineTo(bb[hb] * (Qa - 0), (1 - jb[hb]) * (x - 0)); Pa.stroke(); Pa.closePath(); Oa = Oa.slice(Oa.length - 1); $a = $a.slice($a.length - 1)
            } 0 != z && Xa.push([Oa[0] * (Qa - 0), (1 - $a[0]) * (x - 0)])
        } for (z = 0; z < Xa.length; z++)Pa.strokeStyle = "#000", Pa.lineWidth = 1, Pa.beginPath(),
            Pa.arc(Xa[z][0], Xa[z][1], 4, 0, 2 * Math.PI), Pa.stroke(), Pa.closePath(); h.html(" " + '<span style="color:$">$</span>'.replace("$", "#f00").replace("$", kernel.pretty(w * y)) + " " + '<span style="color:$">$</span>'.replace("$", "#00f").replace("$", kernel.pretty(n * y)) + " " + '<span style="color:$">$</span>'.replace("$", "#888").replace("$", kernel.pretty((1 - w - n) * y)))
    } function z() { if (Na && a[0].getContext) { var b = stats.getTimesStatsTable().timesLen; Oa(stats.timesAt(b - 1), bb.val() || "cf4op") } } function r(b, c) {
        Na && a[0].getContext &&
        Oa(c[0], bb.val() || "cf4op")
    } function b(a) { if ("change" == a.type) return z(); var b = $(a.target); b.hasClass("click") && (a = b.attr("data"), "x" == a ? ($a = "y", b.attr("data", "y"), b.html("")) : "y" == a ? ($a = "x", b.attr("data", "x"), b.html("")) : (b = { p: 1, m: -1 }[a] || 0, a = { l: Math.sqrt(.5), s: Math.sqrt(2) }[a] || 1, "x" == $a ? (Ta += b * Ua * .25 + Ua * (1 - a) / 2, Ua *= a, Ua = Math.min(Math.max(Ua, .1), 1), Ta = Math.min(Math.max(Ta, 0), 1 - Ua)) : (Wa += b * Ra * .25 + Ra * (1 - a) / 2, Ra *= a, Ra = Math.min(Math.max(Ra, .1), 1), Wa = Math.min(Math.max(Wa, 0), 1 - Ra)), z())) } function e(c,
        e) { (Na = void 0 != c) && !/^scr/.exec(e) && (c.empty().append(bb, h, f.empty().append(a).unbind("click").click(b)), bb.unbind("change").change(b), z()) } var a = $("<canvas />"), Pa, f = $('<div style="text-align:center">'), bb = $("<select>"), h = $('<span style="font-size:0.8em;">'), Na = !1, Qa, x, Ta = 0, Ua = 1, Wa = 0, Ra = 1, $a = "x"; $(function () {
            "undefined" != typeof tools && a[0].getContext && tools.regTool("scatter", TOOLS_RECONS + ">scatter", e); stats.regUtil("scatter", z); kernel.regListener("scatter", "reqrec", r); for (var b = [["cf4op", "cfop"],
            ["roux", "roux"]], c = 0; c < b.length; c++)bb.append('<option value="' + b[c][0] + '">' + b[c][1] + "</option>")
        }); return { update: z }
}); var trainStat = execMain(function () {
    function c(a, b) { return stats.timeAt(a[b]) } function Oa() {
        if (e) {
            for (var a = stats.getTimesStatsTable().timesLen, b = f.val() || "PLL", r = cubeutil.getIdentData(b), x = 0, Oa = [], Ua = a - 1; Ua >= a - a; Ua--) { var Wa = stats.getExtraInfo("scramcase_" + b, Ua); Wa && (Wa = Wa[0], Oa[Wa] = Oa[Wa] || [], Oa[Wa].push(Ua)) } Pa.empty().append(bb); a = 0; for (b = r[2]; b < r[3]; b++)if (Oa[b]) {
                Ua = new TimeStat([], Oa[b].length, c.bind(null, Oa[b])); var Ra = Ua.getAllStats(); Wa = Oa[b].length - Ra[0]; 0 == Wa ? Oa[b] = null : (Ra = Ra[1], Oa[b] = [Ua.bestTime,
                    Ra, Wa, Oa[b].length], a = Math.max(a, Ra))
            } for (b = r[2]; b < r[3]; b++)if (Oa[b]) {
                Ua = Oa[b]; $("<tr>"); Wa = [r[1](b)[2], Ua[2] + "/" + Ua[3], Ua[0] / a * 100, (Ua[1] - Ua[0]) / a * 100, kernel.pretty(Ua[0]), kernel.pround(Ua[1])]; Ua = '<tr><td rowspan=2 style="padding-bottom:0;padding-top:0;">$0</td><td rowspan=2 style="padding:0"><canvas/></td><td rowspan=2 style="padding-bottom:0;padding-top:0;">$1</td><td colspan=4 style="padding:0;"><span class="cntbar" style="height:0.25em;float:left;border:none;width:$2%;">&nbsp;</span><span class="cntbar sty2" style="height:0.25em;float:left;border:none;width:$3%;">&nbsp;</span></td></tr><tr><td style="padding-bottom:0;padding-top:0;">$4</td><td style="padding-bottom:0;padding-top:0;">$5</td></tr>';
                for (Ra = 0; 6 > Ra; Ra++)Ua = Ua.replace(new RegExp("\\$" + Ra, "g"), Wa[Ra]); Ua = $(Ua); Wa = Ua.find("canvas"); Wa.css({ width: "2em", height: "2em", display: "block" }); r[1](b, Wa); Pa.append(Ua); x++
            } f.unbind("change").change(z); 0 == x && bb.after("<tr><td colspan=5>" + TOOLS_RECONS_NODATA + "</td></tr>")
        }
    } function z(a) { "change" == a.type && Oa() } function r(b, c) { (e = void 0 != b) && !/^scr/.exec(c) && (b.empty().append(a.append(Pa)), Oa()) } function b(a, b, c) { if (b = cubeutil.getScrambledState([null, b[1]])) return [cubeutil.getIdentData(a)[0](b.toFaceCube())] }
    var e, a = $('<div style="font-size:0.9em;" />'), Pa = $('<table class="table">'), f = $("<select>"), bb = $("<tr>").append($('<th colspan=2 style="padding:0;">').append(f), "<th>N</th><th>best</th><th>mean</th>"); $(function () { "undefined" != typeof tools && tools.regTool("trainstat", TOOLS_TRAINSTAT, r); stats.regUtil("trainstat", Oa); for (var a = ["PLL", "OLL", "CLL"], c = 0; c < a.length; c++)f.append('<option value="' + a[c] + '">' + a[c] + "</option>"), stats.regExtraInfo("scramcase_" + a[c], b.bind(null, a[c])) })
}); var tools = execMain(function () {
    function c(a, b) { if (-1 == a) for (var e = 0; e < kernel.getProp("NTools"); e++)c(e, b); else if (!f) { for (e in Wa) Wa[e](); h[a].empty() } else for (e in Wa) if (e == Na[a]) Wa[e](h[a], b) } function Oa(a, b) { for (var c in Wa) if (c == Na[a]) Wa[c](void 0, b) } function z(a) {
        if (/^222(so|[236o]|eg[012]?|tc[np]|lsall|nb)$/.exec(a)) return "222"; if (/^(333(oh?|ni|f[mt]|custom)?|(z[zb]|[coep]|c[om]|2g|ls|tt)?ll|lse(mu)?|2genl?|3gen_[LF]|edges|corners|f2l|lsll2|(zb|w?v|eo)ls|roux|RrU|half|easyx?c|eoline|sbrx|mt(3qb|eole|tdr|6cp|l5ep|cdrll)|nocache_333bldspec)$/.exec(a)) return "333";
        if (/^(444([mo]|wca|yj|bld)?|4edge|RrUu)$/.exec(a)) return "444"; if (/^(555(wca|bld)?|5edge)$/.exec(a)) return "555"; if (/^(666(si|[sp]|wca)?|6edge)$/.exec(a)) return "666"; if (/^(777(si|[sp]|wca)?|7edge)$/.exec(a)) return "777"; if (/^888$/.exec(a)) return "888"; if (/^999$/.exec(a)) return "999"; if (/^101010$/.exec(a)) return "101010"; if (/^111111$/.exec(a)) return "111111"; if (/^cubennn$/.exec(a)) return "cubennn"; if (/^pyr(s?[om]|l4e|nb|4c)$/.exec(a)) return "pyr"; if (/^skb(s?o|nb)?$/.exec(a)) return "skb"; if (/^sq(rs|1[ht]|rcsp)$/.exec(a)) return "sq1";
        if (/^clk(wca|o)$/.exec(a)) return "clk"; if (/^(mgmp|mgmo|minx2g|mlsll|mgmpll|mgmll)$/.exec(a)) return "mgm"; if (/^(klmso|klmp)$/.exec(a)) return "klm"; if (/^15p(at|ra?p?)?$/.exec(a)) return "15p"; if (/^15p(rmp|m)$/.exec(a)) return "15b"; if (/^8p(at|ra?p?)?$/.exec(a)) return "8p"; if (/^8p(rmp|m)$/.exec(a)) return "8b"; if (/^sq2$/.exec(a)) return "sq2"; if (/^fto$/.exec(a)) return "fto"
    } function r(a, b) {
        DEBUG && console.log("[func select]", a, b); kernel.blur(); for (var e = void 0 === a ? 4 : a + 1, f = void 0 === a ? 0 : a; f < e; f++) {
            var h = x[f].getSelected();
            Na[f] != h && (Oa(f, "property"), Na[f] = h, kernel.setProp("toolsfunc", JSON.stringify(Na)), c(f, "property"))
        }
    } function b(a, b) {
        if ("property" == a) if ("imgSize" == b[0] || /^col/.exec(b[0])) for (var e = 0; e < kernel.getProp("NTools"); e++)"image" == Na[e] && c(e, a); else if ("NTools" == b[0]) for (e = 0; 4 > e; e++)e < b[1] ? (bb[e].show(), "" == h[e].html() && c(e, a)) : (bb[e].hide(), Oa(e, a)); else if ("toolHide" == b[0]) { e = !b[1]; for (var z = 0; 4 > z; z++)e ? Qa[z].show() : Qa[z].hide() } else if ("toolsfunc" == b[0] && "session" == b[2]) {
            z = JSON.parse(b[1]); for (e = 0; 4 >
                e; e++)x[e].loadVal(z[e]); r()
        } else "toolPos" == b[0] && ($("html").removeClass("toolf toolt"), -1 != "ft".indexOf(b[1]) && $("html").addClass("tool" + b[1])); else if ("scramble" == a || "scrambleX" == a) Pa = b, kernel.setProp("isTrainScr", !!Ra.exec((Pa || [])[0])), c(-1, a); else if ("button" == a && "tools" == b[0]) if (f = b[1]) for (e = 0; e < kernel.getProp("NTools"); e++)f && "" == h[e].html() && c(e, a); else c(-1, a)
    } function e(a) { $(a.target).hasClass("click") || $(a.target).is("input, textarea, select") || kernel.setProp("toolHide", !1) } function a(a) {
        a =
        $(this); if ("a" == a.attr("data")) a.prevAll().show(), a.prev().hide(), a.hide(); else if ("n" == a.attr("data")) { var b = a.prevAll(":hidden"); b.last().show(); 1 == b.length && (a.next().hide(), a.hide()) }
    } for (var Pa = ["-", "", 0], f = !1, bb = [], h = [], Na = ["image", "stats", "cross"], Qa = [], x = [], Ta = [], Ua = 0; 4 > Ua; Ua++)h[Ua] = $("<div />"), Qa[Ua] = $("<span />"), x[Ua] = new kernel.TwoLvMenu(Ta, r.bind(null, Ua), $("<select />"), $("<select />")), bb[Ua] = $("<div />").css("display", "inline-block"); $(function () {
        kernel.regListener("tools", "property",
            b, /^(?:imgSize|image|toolsfunc|NTools|col(?:cube|pyr|skb|sq1|mgm)|toolHide|toolPos)$/); kernel.regListener("tools", "scramble", b); kernel.regListener("tools", "scrambleX", b); kernel.regListener("tools", "button", b, /^tools$/); for (var a = $('<div id="toolsDiv"/>'), c = 0; 4 > c; c++)h[c].click(e), Qa[c].append("<br>", TOOLS_SELECTFUNC, x[c].select1, x[c].select2), bb[c].append(h[c], Qa[c]).appendTo(a), 1 == c && a.append("<br>"); kernel.regProp("tools", "toolPos", 1, PROPERTY_TOOLPOS, ["b", ["b", "f", "t"], PROPERTY_TOOLPOS_STR.split("|")]);
        kernel.regProp("tools", "solSpl", 0, PROPERTY_HIDEFULLSOL, [!1]); kernel.regProp("tools", "imgSize", 2, PROPERTY_IMGSIZE, [15, 5, 50]); kernel.regProp("tools", "NTools", 2, PROPERTY_NTOOLS, [1, 1, 4]); c = JSON.stringify(["image", "stats", "cross", "distribution"]); kernel.regProp("tools", "toolsfunc", 5, PROPERTY_TOOLSFUNC, [c], 1); kernel.regProp("tools", "isTrainScr", -6, "Is Train Scramble", [!1], 0); var f = kernel.getProp("toolsfunc", c); -1 == f.indexOf("[") && (f = c.replace("image", f), kernel.setProp("toolsfunc", f)); Na = JSON.parse(f); kernel.addWindow("tools",
            BUTTON_TOOLS, a, !1, !0, 6); kernel.regProp("ui", "toolHide", -1, "Hide Tools Selector", [!1])
    }); var Wa = {}, Ra = /^((z[zb]|[coep]|c[om]|2g|ls|tt)?ll|lse(mu)?|2genl?|3gen_[LF]|f2l|lsll2|(zb|w?v|eo)ls|roux|eoline|sbrx|mt(3qb|eole|tdr|6cp|l5ep|cdrll)|222(eg[012]?|tc[np]|lsall))$/; return {
        regTool: function (a, b, c) {
            DEBUG && console.log("[regtool]", a, b); Wa[a] = c; b = b.split(">"); if (2 == b.length) {
                c = -1; for (var e = 0; e < Ta.length; e++)if (Ta[e][0] == b[0] && $.isArray(Ta[e][1])) { c = e; break } -1 != c ? Ta[c][1].push([b[1], a]) : Ta.push([b[0], [[b[1],
                    a]]])
            } else Ta.push([b[0], a]); for (e = 0; 4 > e; e++)x[e].reset(Na[e])
        }, getCurScramble: function () { return Pa }, getCurPuzzle: function () { return z(Pa[0]) }, getSolutionSpan: function (b) { for (var c = $("<span />"), e = 0; e < b.length; e++)c.append('<span style="display:none;">&nbsp;' + b[e] + "</span>"); kernel.getProp("solSpl") ? (c.append($('<span class="click" data="n">[+1]</span>').click(a)), c.append($('<span class="click" data="a">[' + b.length + "f]</span>").click(a))) : c.children().show(); return c }, scrambleType: function (a) {
            return null ==
                a.match(/^([\d]?[xyzFRUBLDfrubldSME]([w]|&sup[\d];)?[2']?\s*)+$/) ? "-" : a.match(/^([xyzFRU][2']?\s*)+$/) ? "222o" : a.match(/^([xyzFRUBLDSME][2']?\s*)+$/) ? "333" : a.match(/^(([xyzFRUBLDfru]|[FRU]w)[2']?\s*)+$/) ? "444" : a.match(/^(([xyzFRUBLDfrubld])[w]?[2']?\s*)+$/) ? "555" : "-"
        }, puzzleType: z, isCurTrainScramble: function (a) { return !!Ra.exec((a || Pa || [])[0]) }, isPuzzle: function (a, b) {
            b = b || Pa; var c = z(b[0]); b = b[1]; return c ? c == a : "222" == a ? b.match(/^([xyzFRU][2']?\s*)+$/) : "333" == a ? b.match(/^([xyzFRUBLDSME][2']?\s*)+$/) :
                "444" == a ? b.match(/^(([xyzFRUBLDfru]|[FRU]w)[2']?\s*)+$/) : "555" == a ? b.match(/^(([xyzFRUBLDfrubld])[w]?[2']?\s*)+$/) : "skb" == a ? b.match(/^([RLUB]'?\s*)+$/) : "pyr" == a ? b.match(/^([RLUBrlub]'?\s*)+$/) : "sq1" == a ? b.match(/^$/) : "fto" == a ? b.match(/^(([FRUBLD]|(?:BL)|(?:BR))[']?\s*)+$/) : !1
        }
    }
}); var image = execMain(function () {
    function c(a) { var b = a[0]; "input" == b && (b = tools.scrambleType(a[1])); b = tools.puzzleType(b); var c; for (c = 0; 12 > c; c++)if (b == y[c]) return Ta.draw(c, a[1]), !0; return "cubennn" == b ? (Ta.draw(a[2], a[1]), !0) : "pyr" == b ? (x(a[1]), !0) : "skb" == b ? (Qa(a[1]), !0) : "sq1" == b || "sq2" == b ? (Na(a[1], "sq2" == b), !0) : "clk" == b ? (h(a[1]), !0) : "mgm" == b || "klm" == b ? (bb(a[1], "klm" == b), !0) : "fto" == b ? ($a(a[1]), !0) : "15b" == b || "15p" == b ? (Va(b[2], 4, a[1]), !0) : "8b" == b || "8p" == b ? (Va(b[1], 3, a[1]), !0) : !1 } function Oa(a) {
        a && (z = $("<canvas>"),
            r = z[0].getContext("2d"), a.empty().append(z), c(tools.getCurScramble()) || a.html(IMAGE_UNAVAILABLE))
    } var z, r, b = Math.sqrt(3) / 2, e = Math.PI, a = $.ctxRotate, Pa = $.ctxTransform, f = $.ctxDrawPolygon, bb = function () {
        function b(b, c, h, y, x) { if (x) for (x = 0; 5 > x; x++)f(r, Va[b[c + x]], a([w, n], 2 * e / 5 * x + y), h); else { for (x = 0; 5 > x; x++)f(r, Va[b[c + x]], a([Na, Ra], 2 * e / 5 * x + y), h), f(r, Va[b[c + x + 5]], a([Sa, Qa], 2 * e / 5 * x + y), h); f(r, Va[b[c + 10]], a([Oa, Pa], y), h) } } var c = (Math.sqrt(5) + 1) / 2, h = .25 / Math.tan(e / 5), y = 2.6 + 3 * Math.cos(.1 * e) * c, x = 2.2 + 1 * Math.sin(.1 *
            e) * c, Na = [0, h, 0, -h], Ra = [-1, -.75, -.5, -.75], w = [0, Math.sin(.4 * e) / 2, 0, -Math.sin(.4 * e) / 2], n = [-1, -(1 + Math.cos(.4 * e)) / 2, -Math.cos(.4 * e), -(1 + Math.cos(.4 * e)) / 2], Sa = [Math.cos(.1 * e) - h, h, 0, .5 * Math.sin(.4 * e)], Qa = [-Math.sin(.1 * e) + -.25, -.75, -.5, .5 * -Math.cos(.4 * e)], Oa = [.5 * Math.sin(0 * e), .5 * Math.sin(.4 * e), .5 * Math.sin(.8 * e), .5 * Math.sin(1.2 * e), .5 * Math.sin(1.6 * e)], Pa = [.5 * -Math.cos(0 * e), .5 * -Math.cos(.4 * e), .5 * -Math.cos(.8 * e), .5 * -Math.cos(1.2 * e), .5 * -Math.cos(1.6 * e)], Va = "#fff #d00 #060 #81f #fc0 #00b #ffb #8df #f83 #7e0 #f9f #999".split(" ");
        return function (a, n) {
            Va = kernel.getProp("colmgm").match(db); for (var f = [], w = 0; 12 > w; w++)for (var h = 0; 11 > h; h++)f[11 * w + h] = w; a.replace(/(?:^|\s*)(?:([DLR])(\+\+?|--?)|(U|F|D?B?R|D?B?L|D|B)(\d?)('?)|\[([ufrl])('?)\])(?:$|\s*)/g, function (a, b, c, e, n, w, h, r) { b ? mathlib.minx.doMove(f, "DL?R".indexOf(b), ("+" == c[0] ? -1 : 1) * c.length, 2) : e ? mathlib.minx.doMove(f, "U R F L BL BR DR DL DBL B DBR D".split(" ").indexOf(e), (w ? -1 : 1) * (~~n || 1), 0) : mathlib.minx.doMove(f, "urfl".indexOf(h), r ? -1 : 1, 1) }); w = kernel.getProp("imgSize") / 7.5;
            z.width(7 * w + "em"); z.height(3.5 * w + "em"); z.attr("width", 392); z.attr("height", 196); b(f, 0, [40, 2.6 + 0 * c, 2.2 + 0 * c], 0 * e, n); b(f, 11, [40, 2.6 + Math.cos(.1 * e) * c, 2.2 + Math.sin(.1 * e) * c], .2 * e, n); b(f, 22, [40, 2.6 + Math.cos(.5 * e) * c, 2.2 + Math.sin(.5 * e) * c], .6 * e, n); b(f, 33, [40, 2.6 + Math.cos(.9 * e) * c, 2.2 + Math.sin(.9 * e) * c], 1 * e, n); b(f, 44, [40, 2.6 + Math.cos(1.3 * e) * c, 2.2 + Math.sin(1.3 * e) * c], 1.4 * e, n); b(f, 55, [40, 2.6 + Math.cos(1.7 * e) * c, 2.2 + Math.sin(1.7 * e) * c], 1.8 * e, n); b(f, 66, [40, y + Math.cos(.7 * e) * c, x + Math.sin(.7 * e) * c], 0 * e, n); b(f, 77, [40, y + Math.cos(.3 *
                e) * c, x + Math.sin(.3 * e) * c], 1.6 * e, n); b(f, 88, [40, y + Math.cos(1.9 * e) * c, x + Math.sin(1.9 * e) * c], 1.2 * e, n); b(f, 99, [40, y + Math.cos(1.5 * e) * c, x + Math.sin(1.5 * e) * c], .8 * e, n); b(f, 110, [40, y + Math.cos(1.1 * e) * c, x + Math.sin(1.1 * e) * c], .4 * e, n); b(f, 121, [40, y + 0 * c, x + 0 * c], 1 * e, n); r && (r.fillStyle = "#000", r.font = "20px serif", r.textAlign = "center", r.textBaseline = "middle", r.fillText("U", 104, 88), r.fillText("F", 104, 40 * (2.2 + Math.sin(.5 * e) * c)))
        }
    }(), h = function () {
        var b = /([UD][RL]|ALL|[UDRLy])(\d[+-]?)?/, c = "UR DR DL UL U R D L ALL".split(" "),
        f = ["#f00", "#37b", "#5cf", "#ff0", "#850"]; return function (h) {
            f = kernel.getProp("colclk").match(db); var y = h.split(/\s+/), x = clock.moveArr, Na = 9; h = [0, 0, 0, 0]; for (var w = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], n = 0; n < y.length; n++) { var Sa = b.exec(y[n]); if (Sa) if ("y2" == Sa[0]) Na = 0; else { var Ra = c.indexOf(Sa[1]) + Na; if (void 0 == Sa[2]) h[Ra % 9] = 1; else { var Qa = ~~Sa[2][0]; Qa = "+" == Sa[2][1] ? Qa : 12 - Qa; for (Sa = 0; 14 > Sa; Sa++)w[Sa] = (w[Sa] + x[Ra][Sa] * Qa) % 12 } } } w = [w[0], w[3], w[6], w[1], w[4], w[7], w[2], w[5], w[8], 12 - w[2], w[10], 12 - w[8], w[9], w[11], w[13],
            12 - w[0], w[12], 12 - w[6]]; h = [h[3], h[2], h[0], h[1], 1 - h[0], 1 - h[1], 1 - h[3], 1 - h[2]]; n = kernel.getProp("imgSize") / 7.5; z.width(6.25 * n + "em"); z.height(3 * n + "em"); z.attr("width", 375); z.attr("height", 180); y = [10, 30, 50]; x = [10, 30, 50, 75, 95, 115]; for (n = 0; 18 > n; n++)Na = [f[1], f[2]][~~(n / 9)], Ra = [3, x[~~(n / 3)], y[n % 3]], r && (Sa = Pa(a([[1, 1, 0, -1, -1, -1, 1, 0], [0, -1, -8, -1, 0, 1, 1, 0]], w[n] / 6 * e), Ra), Qa = Sa[0], Sa = Sa[1], r.beginPath(), r.fillStyle = Na, r.arc(Qa[7], Sa[7], 9 * Ra[0], 0, 2 * e), r.fill(), r.beginPath(), r.fillStyle = f[3], r.strokeStyle = f[0], r.moveTo(Qa[0],
                Sa[0]), r.bezierCurveTo(Qa[1], Sa[1], Qa[1], Sa[1], Qa[2], Sa[2]), r.bezierCurveTo(Qa[3], Sa[3], Qa[3], Sa[3], Qa[4], Sa[4]), r.bezierCurveTo(Qa[5], Sa[5], Qa[6], Sa[6], Qa[0], Sa[0]), r.closePath(), r.fill(), r.stroke()); y = [20, 40]; x = [20, 40, 85, 105]; for (n = 0; 8 > n; n++)w = [f[4], f[3]][h[n]], Na = [3, x[~~(n / 2)], y[n % 2]], r && (Ra = Pa([[0], [0]], Na), r.beginPath(), r.fillStyle = w, r.strokeStyle = "#000", r.arc(Ra[0][0], Ra[1][0], 3 * Na[0], 0, 2 * e), r.fill(), r.stroke())
        }
    }(), Na = function () {
        function c(a) {
            for (var b = [], c = 0; 12 > c; c++)b[(c + a[0]) % 12] = h[c]; for (c =
                0; 12 > c; c++)b[c + 12] = h[(c + a[1]) % 12 + 12]; if (a[2]) for (y = 1 - y, c = 0; 6 > c; c++)mathlib.circle(b, c + 6, 23 - c); h = b
        } var h = [], y = 0, x = [[0, -.5, .5], [0, -b - 1, -b - 1]], Na = [[0, -.5, -b - 1, -b - 1], [0, -b - 1, -b - 1, -.5]], Ra = [[0, -.5, -b - 1], [0, -b - 1, -b - 1]], Qa = [[0, -b - 1, -b - 1], [0, -b - 1, -.5]], w = Pa(x, [.66, 0, 0]), n = Pa(Na, [.66, 0, 0]), Sa = Pa(Ra, [.66, 0, 0]), Oa = Pa(Qa, [.66, 0, 0]), Va = { U: "#ff0", R: "#f80", F: "#0f0", D: "#fff", L: "#f00", B: "#00f" }, Ta = /^\s*\(\s*(-?\d+),\s*(-?\d+)\s*\)\s*$/; return function (Na, Xa) {
            var Pa = kernel.getProp("colsq1").match(db); Va = {
                U: Pa[0], R: Pa[1],
                F: Pa[2], D: Pa[3], L: Pa[4], B: Pa[5]
            }; h = [0, 1, 2, 4, 5, 6, 8, 9, 10, 12, 13, 14, 17, 16, 18, 21, 20, 22, 25, 24, 26, 29, 28, 30]; y = 0; var ab = Na.split("/"); for (Pa = 0; Pa < ab.length; Pa++)if (/^\s*$/.exec(ab[Pa])) c([0, 0, 1]); else { var Ua = Ta.exec(ab[Pa]); c([~~Ua[1] + 12, ~~Ua[2] + 12, 1]) } c([0, 0, 1]); Pa = kernel.getProp("imgSize") / 10; z.width(11 * Pa / 1.3 + "em"); z.height(6.3 * Pa / 1.3 + "em"); z.attr("width", 495); z.attr("height", 283.5); for (Pa = 0; 24 > Pa; Pa++) {
                ab = h[Pa] & 1; Ua = (12 > Pa ? Pa - 3 : -Pa) * e / 6; var Za = (12 > Pa ? Pa - 5 : -1 - Pa) * e / 6, Ya = 12 > Pa ? [45, 2.7, 2.7] : [45, 2.7 + 5.4,
                    2.7], Wa = (Pa + 1) % 12 + (12 > Pa ? 0 : 12), cb = h[Pa] >> 1, fb = Va["UD"[8 <= cb ? 1 : 0]]; 0 == cb % 2 ? Xa ? (!ab && 12 <= Pa ? Ua += e / 6 : ab && 12 > Pa && (Ua -= e / 6), f(r, Va["LBBRRFFLBLRBFRLF"[cb + ab]], a(ab ? Ra : Qa, Ua), Ya), f(r, fb, a(ab ? Sa : Oa, Ua), Ya)) : cb == h[Wa] >> 1 && (f(r, Va["LBBRRFFLBLRBFRLF"[cb]], a(Qa, Ua), Ya), f(r, Va["LBBRRFFLBLRBFRLF"[cb + 1]], a(Ra, Ua), Ya), f(r, fb, a(n, Ua), Ya)) : (f(r, Va["-B-R-F-L-B-R-F-L"[cb]], a(x, Za), Ya), f(r, fb, a(w, Za), Ya))
            } Ya = [45, 5.4, 5.7]; f(r, Va.L, [[-b - 1, -b - 1, -.5, -.5], [.5, -.5, -.5, .5]], Ya); 0 == y ? f(r, Va.L, [[b + 1, b + 1, -.5, -.5], [.5, -.5, -.5, .5]],
                Ya) : f(r, Va.R, [[b, b, -.5, -.5], [.5, -.5, -.5, .5]], Ya)
        }
    }(), Qa = function () {
        var a = [], c = "#fff #00f #f00 #ff0 #0f0 #f80".split(" "), e = [[45 * b, 45 * b, 186.75 * b, -22.5, 22.5, 45], [45 * b, 0, 328.5 * b, -22.5, 45, 67.5], [45 * b, 0, 234 * b, -22.5, 45, 114.75], [0, -45 * b, 139.5 * b, 45, -22.5, 209.25], [45 * b, 0, 139.5 * b, 22.5, 45, 114.75], [45 * b, 0, 45 * b, 22.5, 45, 67.5]]; return function (h) {
            c = kernel.getProp("colskb").match(db); for (var y = 0, x = 0; 6 > x; x++)for (var Na = 0; 5 > Na; Na++)a[y++] = x; h = kernel.parseScramble(h, "RULB"); for (x = 0; x < h.length; x++) {
                y = h[x][0]; Na = 1 == h[x][2] ?
                    1 : 2; for (var w = 0; w < Na; w++)switch (y) {
                        case 0: mathlib.circle(a, 10, 5, 15); mathlib.circle(a, 14, 8, 17); mathlib.circle(a, 12, 9, 16); mathlib.circle(a, 13, 6, 19); mathlib.circle(a, 24, 4, 28); break; case 1: mathlib.circle(a, 0, 25, 5); mathlib.circle(a, 2, 26, 7); mathlib.circle(a, 4, 27, 9); mathlib.circle(a, 1, 28, 6); mathlib.circle(a, 21, 19, 12); break; case 2: mathlib.circle(a, 20, 15, 25); mathlib.circle(a, 23, 18, 29); mathlib.circle(a, 21, 16, 28); mathlib.circle(a, 24, 19, 27); mathlib.circle(a, 13, 9, 1); break; case 3: mathlib.circle(a, 5, 25, 15), mathlib.circle(a,
                            9, 28, 19), mathlib.circle(a, 8, 26, 18), mathlib.circle(a, 7, 29, 17), mathlib.circle(a, 2, 23, 14)
                    }
            } x = kernel.getProp("imgSize") / 10; z.width((8 * b + .3) * x + "em"); z.height(6.2 * x + "em"); z.attr("width", 45 * (8 * b + .3) + 1); z.attr("height", 280); for (x = 0; 6 > x; x++)h = x, y = e[h], f(r, c[a[5 * h]], [[-1, 0, 1, 0], [0, 1, 0, -1]], y), f(r, c[a[5 * h + 1]], [[-1, -1, 0], [0, -1, -1]], y), f(r, c[a[5 * h + 2]], [[0, 1, 1], [-1, -1, 0]], y), f(r, c[a[5 * h + 3]], [[-1, -1, 0], [0, 1, 1]], y), f(r, c[a[5 * h + 4]], [[0, 1, 1], [1, 1, 0]], y)
        }
    }(), x = function () {
        var a = [], c = ["#0f0", "#f00", "#00f", "#ff0"], e = [3.5,
            1.5, 5.5, 3.5], h = [0, 3 * b, 3 * b, 6.5 * b], y = [0, 6, 5, 4], x = [1, 7, 3, 5], Na = [2, 8, 4, 3], w = [[0, 1, 2], [2, 3, 0], [1, 0, 3], [3, 2, 1]], n = [-.5, .5, 0], Sa = [b, b, 0], Ra = [-b, -b, 0]; return function (Qa) {
                c = kernel.getProp("colpyr").match(db); for (var Oa = 0, Pa = 0; 4 > Pa; Pa++)for (var Va = 0; 9 > Va; Va++)a[Oa++] = Pa; Qa = kernel.parseScramble(Qa, "URLB"); for (Pa = 0; Pa < Qa.length; Pa++) {
                    var Xa = Qa[Pa][0] + (2 == Qa[Pa][1] ? 4 : 0); Oa = 1 == Qa[Pa][2] ? 1 : 2; Va = 4 <= Xa ? 1 : 4; Xa = w[Xa % 4]; for (var Ta = 0; Ta < Va; Ta++)for (var Ua = 0; Ua < Oa; Ua++)mathlib.circle(a, 9 * Xa[0] + y[Ta], 9 * Xa[1] + x[Ta], 9 * Xa[2] +
                        Na[Ta])
                } Pa = kernel.getProp("imgSize") / 10; z.width(7 * Pa + "em"); z.height(6.5 * b * Pa + "em"); z.attr("width", 315); z.attr("height", 292.5 * b); for (Pa = 0; 4 > Pa; Pa++) { Qa = Pa; Oa = 0 != Qa; Va = [0, -1, 1, 0, .5, -.5, 0, -.5, .5]; Xa = [0, 2, 2, 2, 1, 1, 2, 3, 3]; for (Ta = 0; Ta < Xa.length; Ta++)Xa[Ta] *= Oa ? -b : b, Va[Ta] *= Oa ? -1 : 1; for (Ta = 0; 9 > Ta; Ta++)f(r, c[a[9 * Qa + Ta]], [n, 6 <= Ta != Oa ? Ra : Sa], [45, e[Qa] + Va[Ta], h[Qa] + Xa[Ta]]) }
            }
    }(), Ta = function () {
        function a(a, b, e, f) {
            var n = f * f, h, w, r; 5 < a && (a -= 6); for (r = 0; r < e; r++) {
                for (h = 0; h < f; h++) {
                    if (0 == a) {
                        var y = 6 * n - f * b - f + h; var x = 2 * n -
                            f * b - 1 - h; var z = 3 * n - f * b - 1 - h; var Na = 5 * n - f * b - f + h
                    } else 1 == a ? (y = 3 * n + b + f * h, x = 3 * n + b - f * (h + 1), z = n + b - f * (h + 1), Na = 5 * n + b + f * h) : 2 == a ? (y = 3 * n + b * f + h, x = 4 * n + f - 1 - b + f * h, z = b * f + f - 1 - h, Na = 2 * n - 1 - b - f * h) : 3 == a ? (y = 4 * n + b * f + f - 1 - h, x = 2 * n + b * f + h, z = n + b * f + h, Na = 5 * n + b * f + f - 1 - h) : 4 == a ? (y = 6 * n - 1 - b - f * h, x = f - 1 - b + f * h, z = 2 * n + f - 1 - b + f * h, Na = 4 * n - 1 - b - f * h) : 5 == a && (y = 4 * n - f - b * f + h, x = 2 * n - f + b - f * h, z = n - 1 - b * f - h, Na = 4 * n + b + f * h); var Qa = c[y]; c[y] = c[x]; c[x] = c[z]; c[z] = c[Na]; c[Na] = Qa
                } if (0 == b) for (h = 0; h + h < f; h++)for (w = 0; w + w < f - 1; w++)y = a * n + h + w * f, z = a * n + (f - 1 - h) + (f - 1 - w) * f, 3 > a ? (x =
                    a * n + (f - 1 - w) + h * f, Na = a * n + w + (f - 1 - h) * f) : (Na = a * n + (f - 1 - w) + h * f, x = a * n + w + (f - 1 - h) * f), Qa = c[y], c[y] = c[x], c[x] = c[z], c[z] = c[Na], c[Na] = Qa
            }
        } function b(b, e) { var f = 0; c = []; for (var h = 0; 6 > h; h++)for (var n = 0; n < b * b; n++)c[f++] = h; f = kernel.parseScramble(e, "DLBURF", !0); for (h = 0; h < f.length; h++) { for (n = 0; n < f[h][1]; n++)a(f[h][0], n, f[h][2], b); if (-1 == f[h][1]) { for (n = 0; n < b - 1; n++)a(f[h][0], n, -f[h][2], b); a((f[h][0] + 3) % 6, 0, f[h][2] + 4, b) } } return c } var c = [], e = "#ff0 #fa0 #00f #fff #f00 #0d0".split(" "); return {
            draw: function (a, h) {
                b(a, h); var y =
                    kernel.getProp("imgSize") / 50; z.width(39 * y + "em"); z.height(29 * y + "em"); z.attr("width", 30 * (39 * a / 9 + .2)); z.attr("height", 30 * (29 * a / 9 + .2)); e = kernel.getProp("colcube").match(db); for (y = 0; 6 > y; y++) { var w = y, n = a, x = 10 / 9, Na = 10 / 9; 0 == w ? (x *= n, Na *= 2 * n) : 1 == w ? (x *= 0, Na *= n) : 2 == w ? (x *= 3 * n, Na *= n) : 3 == w ? (x *= n, Na *= 0) : 4 == w ? (x *= 2 * n, Na *= n) : 5 == w && (x *= n, Na *= n); for (var Qa = 0; Qa < n; Qa++)for (var Ra = 1 == w || 2 == w ? n - 1 - Qa : Qa, Oa = 0; Oa < n; Oa++)f(r, e[c[(w * n + (0 == w ? n - 1 - Oa : Oa)) * n + Ra]], [[Qa, Qa, Qa + 1, Qa + 1], [Oa, Oa + 1, Oa + 1, Oa]], [30, x + .1, Na + .1]) }
            }, genPosit: b
        }
    }(),
        Ua = function () {
            function b(b, c, h) {
                var r = $(h), y = kernel.getProp("colcube").match(db); h = r[0].getContext("2d"); var x = 3; 12 == b.length && (x = 2); r.attr("width", 50 * (x + 1.2)); r.attr("height", 50 * (x + 1.2)); for (r = 0; r < x * x; r++) { var w = r % x + .5, n = ~~(r / x) + .5; f(h, y["DLBURF".indexOf(b[r])] || "#888", [[w, w + 1, w + 1, w], [n, n, n + 1, n + 1]], [50, .1, .1]) } for (r = 0; r < 4 * x; r++)w = r % x, n = ~~(r / x), f(h, y["DLBURF".indexOf(b[r + x * x])] || "#888", a([[w - x / 2, w - x / 2 + 1, .9 * (w - x / 2 + 1), .9 * (w - x / 2)], [x / 2 + .05, x / 2 + .05, x / 2 + .5, x / 2 + .5]], -n * e / 2), [50, .6 + x / 2, .6 + x / 2]); c = c || [];
                for (r = 0; r < c.length; r++) { n = c[r]; b = n[0] % x + 1.1; y = ~~(n[0] / x) + 1.1; w = n[1] % x + 1.1; n = ~~(n[1] / x) + 1.1; var Na = Math.sqrt((b - w) * (b - w) + (y - n) * (y - n)); f(h, "#000", a([[.2, Na - .4, Na - .4, Na - .1, Na - .4, Na - .4, .2], [.05, .05, .15, 0, -.15, -.05, -.05]], Math.atan2(n - y, w - b)), [50, b, y]) }
            } return { drawImage: b, draw: function (a, c, e) { c = Ta.genPosit(a, c); for (var f = [], h = 0; h < a * a; h++)f.push("DLBURF"[c[3 * a * a + h]]); for (var r = 0; 4 > r; r++) { var w = [5, 4, 2, 1][r] * a * a; for (h = 0; h < a; h++)f.push("DLBURF"[c[w + [h, h, a - 1 - h, a - 1 - h][r]]]) } b(f.join(""), [], e) } }
        }(), Wa = function () {
            var a =
                [[20 * b, -20 * b, 61 * b, 10, 10, 0], [20 * b, 0, 62 * b, -10, 20, 61.5], [20 * b, 0, 0, 10, 20, 31.5]]; return function (c, e) { var h = $(e), r = kernel.getProp("colcube").match(db), y = h[0].getContext("2d"); h.attr("width", 122 * b + 1); h.attr("height", 122.5); for (h = 0; 27 > h; h++) { var x = h % 3, w = ~~(h / 3) % 3; f(y, r["DLBURF".indexOf(c[h])] || "#888", [[x, x + 1, x + 1, x], [w, w, w + 1, w + 1]], a[~~(h / 9)]) } }
        }(), Ra = function () {
            return function (c, h) {
                var r = $(h); r.attr("width", 120 * b + 1); r.attr("height", 120 * b + 1); var y = kernel.getProp("colpyr").match(db); r = r[0].getContext("2d");
                for (var x = 0, Na = 0; 3 > Na; Na++)for (var z = 0; 3 > z; z++)for (var w = 0; w < 2 * Na + 1; w++) { var n = -b * Na + b * w; var Sa = Na / 2; n = 0 == w % 2 ? [[n, n - b, n + b], [Sa, Sa + .5, Sa + .5]] : [[n - b, n, n + b], [Sa, Sa + .5, Sa]]; f(r, y["FLRD".indexOf(c[x])] || "#888", a(n, e / 3 * 4 * z), [20, 3 * b, 3 + (6 * b - 4.5) / 2]); x++ }
            }
        }(), $a = function () {
            function a(a) {
                if ("U" == a) { for (var b = [9, 10, 14, 15, 17], e = [36, 37, 38, 39, 40], f = [27, 29, 28, 32, 31], n = 0; 5 > n; n++)mathlib.circle(c, b[n], e[n], f[n]); mathlib.circle(c, 18, 67, 45); mathlib.circle(c, 0, 4, 8); mathlib.circle(c, 1, 3, 6); mathlib.circle(c, 2, 7, 5) } if ("L" ==
                    a) { b = [0, 1, 5, 6, 8]; e = [18, 20, 19, 23, 22]; f = [71, 70, 69, 68, 67]; for (n = 0; 5 > n; n++)mathlib.circle(c, b[n], e[n], f[n]); mathlib.circle(c, 27, 62, 40); mathlib.circle(c, 9, 17, 13); mathlib.circle(c, 10, 15, 12); mathlib.circle(c, 14, 16, 11) } if ("R" == a) { b = [8, 6, 7, 3, 4]; var h = [45, 46, 47, 48, 49]; e = [26, 25, 21, 20, 18]; for (n = 0; 5 > n; n++)mathlib.circle(c, b[n], h[n], e[n]); mathlib.circle(c, 17, 36, 58); mathlib.circle(c, 27, 31, 35); mathlib.circle(c, 29, 32, 34); mathlib.circle(c, 28, 33, 30) } if ("F" == a) {
                        f = [27, 29, 30, 34, 35]; h = [58, 59, 60, 61, 62]; b = [13, 12, 16, 15, 17];
                        for (n = 0; 5 > n; n++)mathlib.circle(c, f[n], h[n], b[n]); mathlib.circle(c, 8, 49, 71); mathlib.circle(c, 18, 26, 22); mathlib.circle(c, 20, 25, 23); mathlib.circle(c, 19, 21, 24)
                    } if ("B" == a) { b = [4, 3, 2, 1, 0]; f = [67, 68, 64, 65, 63]; h = [53, 51, 50, 46, 45]; for (n = 0; 5 > n; n++)mathlib.circle(c, b[n], f[n], h[n]); mathlib.circle(c, 54, 31, 9); mathlib.circle(c, 36, 40, 44); mathlib.circle(c, 37, 39, 42); mathlib.circle(c, 38, 43, 41) } if ("BR" == a) {
                        e = [36, 37, 41, 42, 44]; h = [54, 56, 55, 59, 58]; f = [35, 34, 33, 32, 31]; for (n = 0; 5 > n; n++)mathlib.circle(c, e[n], h[n], f[n]); mathlib.circle(c,
                            63, 26, 4); mathlib.circle(c, 45, 53, 49); mathlib.circle(c, 46, 51, 48); mathlib.circle(c, 50, 52, 47)
                    } if ("BL" == a) { e = [44, 42, 43, 39, 40]; b = [9, 10, 11, 12, 13]; h = [62, 61, 57, 56, 54]; for (n = 0; 5 > n; n++)mathlib.circle(c, e[n], b[n], h[n]); mathlib.circle(c, 53, 0, 22); mathlib.circle(c, 63, 67, 71); mathlib.circle(c, 65, 68, 70); mathlib.circle(c, 64, 69, 66) } if ("D" == a) {
                        h = [49, 48, 52, 51, 53]; f = [63, 65, 66, 70, 71]; e = [22, 23, 24, 25, 26]; for (n = 0; 5 > n; n++)mathlib.circle(c, h[n], f[n], e[n]); mathlib.circle(c, 44, 13, 35); mathlib.circle(c, 54, 62, 58); mathlib.circle(c,
                            56, 61, 59); mathlib.circle(c, 55, 57, 60)
                    }
            } function b(a, b, c, e, f) { r.beginPath(); r.moveTo(a * f, b * f); r.lineTo(c * f, e * f); r.lineWidth = 3; r.stroke(); r.lineWidth = 1 } var c = [], e = "#fff #808 #f00 #0d0 #00f #bbb #ff0 #fa0".split(" "); return function (h) {
                e = kernel.getProp("colfto").match(db); for (var y = 0, x = 0; 8 > x; x++)for (var w = 0; 9 > w; w++)c[y++] = x; h = h.split(" "); for (x = 0; x < h.length; x++)y = h[x], y.endsWith("'") && (y = y.replace("'", ""), a(y)), a(y); x = kernel.getProp("imgSize") / 50; z.width(39 * x + "em"); z.height(18 * x + "em"); z.attr("width",
                    651); z.attr("height", 301); x = {
                        0: [[0, 2, 1], [0, 0, 1]], 1: [[2, 3, 1], [0, 1, 1]], 2: [[2, 4, 3], [0, 0, 1]], 3: [[4, 5, 3], [0, 1, 1]], 4: [[4, 6, 5], [0, 0, 1]], 5: [[1, 3, 2], [1, 1, 2]], 6: [[3, 4, 2], [1, 2, 2]], 7: [[3, 5, 4], [1, 1, 2]], 8: [[2, 4, 3], [2, 2, 3]], 9: [[0, 1, 0], [0, 1, 2]], 10: [[0, 1, 1], [2, 1, 3]], 11: [[0, 1, 0], [2, 3, 4]], 12: [[0, 1, 1], [4, 3, 5]], 13: [[0, 1, 0], [4, 5, 6]], 14: [[1, 2, 1], [1, 2, 3]], 15: [[1, 2, 2], [3, 2, 4]], 16: [[1, 2, 1], [3, 4, 5]], 17: [[2, 3, 2], [2, 3, 4]], 18: [[2, 3, 4], [4, 3, 4]], 19: [[1, 2, 3], [5, 4, 5]], 20: [[2, 4, 3], [4, 4, 5]], 21: [[3, 4, 5], [5, 4, 5]], 22: [[0, 1, 2], [6, 5, 6]],
                        23: [[1, 3, 2], [5, 5, 6]], 24: [[2, 3, 4], [6, 5, 6]], 25: [[3, 5, 4], [5, 5, 6]], 26: [[4, 5, 6], [6, 5, 6]], 27: [[3, 4, 4], [3, 2, 4]], 28: [[4, 5, 5], [2, 1, 3]], 29: [[4, 5, 4], [2, 3, 4]], 30: [[4, 5, 5], [4, 3, 5]], 31: [[5, 6, 6], [1, 0, 2]], 32: [[5, 6, 5], [1, 2, 3]], 33: [[5, 6, 6], [3, 2, 4]], 34: [[5, 6, 5], [3, 4, 5]], 35: [[5, 6, 6], [5, 4, 6]]
                    }; for (h = 0; 72 > h; h++) { y = x[h % 36]; w = y[0]; var n = 36 <= h ? 7 : 0; f(r, e[c[h]], [[w[0] + n, w[1] + n, w[2] + n], y[1]], [50, 0, 0]) } b(0, 0, 6, 6, 50); b(6, 0, 0, 6, 50); b(7, 0, 13, 6, 50); b(13, 0, 7, 6, 50); r.fillStyle = kernel.getProp("col-font"); r.strokeStyle = kernel.getProp("col-font");
                r.font = "25px monospace"; r.textAlign = "center"; r.textBaseline = "middle"; r.fillText("U", 150, 80); r.fillText("R", 50 * 4.4, 150); r.fillText("F", 150, 50 * 4.4); r.fillText("L", 80, 150); r.fillText("B", 500, 80); r.fillText("BL", 570, 150); r.fillText("D", 500, 50 * 4.4); r.fillText("BR", 430, 150)
            }
        }(), Va = function () {
            return function (a, b, c) {
                for (var e = [], h = [[1, 0], [0, 1], [0, -1], [-1, 0]], y = 0; y < b * b; y++)e[y] = y; y = b - 1; var x = b - 1, w = /([ULRD\uFFEA\uFFE9\uFFEB\uFFEC])([\d]?)/; c = c.split(" "); for (var n = 0; n < c.length; n++) {
                    var Na = w.exec(c[n]); if (Na) {
                        var Qa =
                            "ULRD￪￩￫￬".indexOf(Na[1]) % 4; Na = ~~Na[2] || 1; Qa = h["b" == a ? 3 - Qa : Qa]; for (var Ra = 0; Ra < Na; Ra++)mathlib.circle(e, y * b + x, (y + Qa[0]) * b + x + Qa[1]), y += Qa[0], x += Qa[1]
                    }
                } a = kernel.getProp("imgSize") / 50; z.width(30 * a + "em"); z.height(30 * a + "em"); z.attr("width", 50 * (b + .2)); z.attr("height", 50 * (b + .2)); a = kernel.getProp("col15p").match(db); a[b - 1] = a[a.length - 1]; for (y = 0; y < b; y++)for (c = 0; c < b; c++)h = e[c * b + y], x = Math.min(~~(h / b), h % b), h++, f(r, a[x], [[y + .05, y + .05, y + 1 - .05, y + 1 - .05], [c + .05, c + 1 - .05, c + 1 - .05, c + .05]], [50, .1, .1]), h != b * b && (r.fillStyle =
                    "#000", r.font = "30px monospace", r.textAlign = "center", r.textBaseline = "middle", r.fillText(h, 50 * (y + .5 + .1), 50 * (c + .5 + .1)))
            }
        }(), y = "  222 333 444 555 666 777 888 999 101010 111111".split(" "), db = /#[0-9a-fA-F]{3}/g; $(function () { z = $("<canvas>"); z[0].getContext && tools.regTool("image", TOOLS_IMAGE, Oa) }); return { draw: c, llImage: Ua, pyrllImage: Ra, face3Image: Wa }
}); var cross = function (c, Oa, z, r, b, e, a) {
    function Pa(a, b) { var c = Ya[b][~~(a / 24)]; return 24 * ~~(c / 384) + fb[a % 24][(c >> 4) % 24] } function f(a, b) { var c = Ya[b][a >> 4]; return ~~(c / 384) << 4 | Xa[a & 15][(c >> 4) % 24] ^ c & 15 } function bb(a, b) { for (var c = 3; 0 <= c; c--)b[c] = a & 1, a >>= 1 } function h(a) { for (var b = 0, c = 0; 4 > c; c++)b <<= 1, b |= a[c]; return b } function Na(a, b) { var c = Ya[b][~~(a / 384)]; return 384 * ~~(c / 384) + 16 * fb[(a >> 4) % 24][(c >> 4) % 24] + (Xa[a & 15][(c >> 4) % 24] ^ c & 15) } function Qa() {
        Qa = $.noop; for (var a = 0; 24 > a; a++)fb[a] = []; for (a = 0; 16 > a; a++)Xa[a] = [];
        var n = [], w = [], y = []; for (a = 0; 24 > a; a++)for (var x = 0; 24 > x; x++) { r(n, a, 4); r(w, x, 4); for (var Na = 0; 4 > Na; Na++)y[Na] = n[w[Na]]; fb[a][x] = b(y, 4); if (16 > a) { bb(a, n); for (Na = 0; 4 > Na; Na++)y[Na] = n[w[Na]]; Xa[a][x] = h(y) } } c(Ya, 495, function (a, c) { for (var f = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], n = 4, h = 0; 12 > h; h++)a >= e[11 - h][n] ? (a -= e[11 - h][n--], f[h] = n << 1) : f[h] = -1; Oa(f, c); a = 0; n = 4; var w = 0, r = []; for (h = 0; 12 > h; h++)0 <= f[h] && (a += e[11 - h][n--], r[n] = f[h] >> 1, w |= (f[h] & 1) << 3 - n); return 24 * a + b(r, 4) << 4 | w }); mb = []; cb = []; z(mb, 0, 11880, 5, Pa); z(cb, 0, 7920, 6, f)
    } function x() {
        x =
        $.noop; Ta(); var a = 5; z(Sa, 296 + 576 * (72 * a + 2 * a), 331776, 7, function (a, b) { var c = a % 576, e = ~~(a / 576); return 24 * n[~~(c / 24)][b] + w[c % 24][b] + 576 * (24 * n[~~(e / 24)][b] + w[e % 24][b]) }); a = 6; z(Za, 296 + 576 * (72 * a + 2 * a), 331776, 7, function (a, b) { var c = a % 576, e = ~~(a / 576); return 24 * n[~~(c / 24)][b] + w[c % 24][b] + 576 * (24 * n[~~(e / 24)][b] + w[e % 24][b]) })
    } function Ta() {
        function a(a, b) {
            var c = ~~(a / 3); return 3 * [[3, 1, 2, 7, 0, 5, 6, 4], [0, 1, 6, 2, 4, 5, 7, 3], [1, 2, 3, 0, 4, 5, 6, 7], [0, 5, 1, 3, 4, 6, 2, 7], [4, 0, 2, 3, 5, 1, 6, 7], [0, 1, 2, 3, 7, 4, 5, 6]][b][c] + (a % 3 + [[2, 0, 0, 1, 1, 0, 0,
                2], [0, 0, 1, 2, 0, 0, 2, 1], [0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 2, 0, 0, 2, 1, 0], [1, 2, 0, 0, 2, 1, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0]][b][c]) % 3
        } Ta = $.noop; Qa(); for (var b = 0; 24 > b; b++) { n[b] = []; w[b] = []; for (var c = 0; 6 > c; c++) { n[b][c] = a(b, c); var e = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]; e[b >> 1] = b & 1; Oa(e, c); for (var f = 0; 12 > f; f++)if (0 <= e[f]) { w[b][c] = f << 1 | e[f]; break } } } lb = []; for (b = 0; 4 > b; b++)c = [], z(c, 72 * (b + 4) + 2 * (b + 4), 576, 5, function (a, b) { return 24 * n[~~(a / 24)][b] + w[a % 24][b] }), lb[b] = c
    } function Ua(b, c, e, h, r, y, x, Na) {
        if (0 == y) return 0 == b && 0 == c && 8 == e[0] && 12 == h[0] &&
            (10 == e[1] && 15 == h[1] || 12 == e[1] && 18 == h[1]); if (a(mb, b) > y || a(cb, c) > y || a(r, 24 * h[0] + e[0] + 576 * (24 * h[1] + e[1])) > y) return !1; var z, Sa; for (Sa = 0; 6 > Sa; Sa++)if (Sa != x && Sa != x - 3) { var Qa = b; var Ra = c; var Oa = e; var Va = h; for (z = 0; 3 > z; z++)if (Qa = Pa(Qa, Sa), Ra = f(Ra, Sa), Oa = [w[Oa[0]][Sa], w[Oa[1]][Sa]], Va = [n[Va[0]][Sa], n[Va[1]][Sa]], Ua(Qa, Ra, Oa, Va, r, y - 1, Sa, Na)) return Na.push("FRUBLD".charAt(Sa) + " 2'".charAt(z)), !0 } return !1
    } function Wa(b, c, e, h, r, y, x, Na) {
        if (0 == y) return 0 == b && 0 == c && e == 2 * (r + 4) && h == 3 * (r + 4); if (a(mb, b) > y || a(cb, c) > y || a(lb[r],
            24 * h + e) > y) return !1; var z, Sa; for (Sa = 0; 6 > Sa; Sa++)if (Sa != x && Sa != x - 3) { var Qa = b; var Ra = c; var Oa = e; var Va = h; for (z = 0; 3 > z; z++)if (Qa = Pa(Qa, Sa), Ra = f(Ra, Sa), Oa = w[Oa][Sa], Va = n[Va][Sa], Wa(Qa, Ra, Oa, Va, r, y - 1, Sa, Na)) return Na.push("FRUBLD".charAt(Sa) + " 2'".charAt(z)), !0 } return !1
    } function Ra(b, c, e, n, h) {
        if (0 == e) return 0 == b && 0 == c; if (a(mb, b) > e || a(cb, c) > e) return !1; var w, r; for (r = 0; 6 > r; r++)if (r != n && r != n - 3) {
            var y = b; var x = c; for (w = 0; 3 > w; w++)if (y = Pa(y, r), x = f(x, r), Ra(y, x, e - 1, r, h)) return h.push("FRUBLD".charAt(r) + " 2'".charAt(w)),
                !0
        } return !1
    } function $a(a) { Qa(); for (var b = [], c = 0; 6 > c; c++) { for (var e = 0, n = 0, h = 0; h < a.length; h++)for (var w = ob[c].indexOf("FRUBLD".charAt(a[h][0])), r = a[h][2], y = 0; y < r; y++)e = f(e, w), n = Pa(n, w); h = []; for (w = 0; 100 > w && !Ra(n, e, w, -1, h); w++); h.reverse(); b.push(h) } return b } function Va(a, b) {
        Ta(); for (var c = 0, e = 0, h = [8, 10, 12, 14], r = [12, 15, 18, 21], y = 0; y < a.length; y++)for (var x = ob[b].indexOf("FRUBLD".charAt(a[y][0])), Na = a[y][2], z = 0; z < Na; z++) { c = f(c, x); e = Pa(e, x); for (var Sa = 0; 4 > Sa; Sa++)h[Sa] = w[h[Sa]][x], r[Sa] = n[r[Sa]][x] } y = [];
        x = !1; for (Na = 0; !x;) { for (Sa = 0; 4 > Sa; Sa++)if (Wa(e, c, h[Sa], r[Sa], Sa, Na, -1, y)) { x = !0; break } Na++ } y.reverse(); return y
    } function y() { y = $.noop; Qa(); gb = []; z(gb, 0, 190080, 7, Na, 6, 3, 6) } function db(a) { var b = ~~(a / 384), c = (a >> 4) % 24, f = [], n = [], h = [], w = []; bb(a & 15, w); r(h, c, 4); a = 4; c = [7, 6, 5, 4, 10, 9, 8, 11, 3, 2, 1, 0]; for (var y = 0; 12 > y; y++)b >= e[11 - y][a] ? (b -= e[11 - y][a--], f[c[y]] = h[a], n[c[y]] = w[a]) : f[c[y]] = n[c[y]] = -1; return [f, n] } var mb, cb, lb, gb, Ya = [], fb = [], Xa = [], w = [], n = [], Sa = [], Za = [], hb = "DULRFB".split(""), ob = "FRUBLD FLDBRU FDRBUL FULBDR URBDLF DRFULB".split(" "),
        jb = "&nbsp;&nbsp; z2 z' z&nbsp; x' x&nbsp;".split(" "), eb = ["FRUBLD", "RBULFD", "BLUFRD", "LFURBD"], kb; execMain(function () {
            function a() {
                var b = $(this).parent(), c = "DULRFB".indexOf(b.html()[0]); Va(kb, c); var e = $(this).html(); if ("ec" == e) { var h = Va(kb, c); e = "xx" } else if ("xx" == e) {
                    var r = kb; x(); h = []; for (e = 0; 4 > e; e++) {
                        for (var y = 0, Na = 0, z = [8, 10, 12], Qa = [12, 15, 18], Ra = 0; Ra < r.length; Ra++)for (var Oa = eb[e].indexOf("FRUBLD".charAt(ob[c].indexOf("FRUBLD".charAt(r[Ra][0])))), Ta = r[Ra][2], Xa = 0; Xa < Ta; Xa++)y = f(y, Oa), Na = Pa(Na, Oa),
                            z = [w[z[0]][Oa], w[z[1]][Oa], w[z[2]][Oa]], Qa = [n[Qa[0]][Oa], n[Qa[1]][Oa], n[Qa[2]][Oa]]; h.push([Na, y, z, Qa])
                    } r = []; Ra = !1; for (y = 0; !Ra;) { for (e = 0; 4 > e; e++) { Na = h[e]; if (Ua(Na[0], Na[1], [Na[2][0], Na[2][1]], [Na[3][0], Na[3][1]], Sa, y, -1, r)) { Ra = !0; break } if (Ua(Na[0], Na[1], [Na[2][0], Na[2][2]], [Na[3][0], Na[3][2]], Za, y, -1, r)) { Ra = !0; break } } y++ } r.reverse(); for (Ra = 0; Ra < r.length; Ra++)r[Ra] = eb[e]["FRUBLD".indexOf(r[Ra][0])] + r[Ra][1]; h = r; e = "<<"
                } else h = $a(kb)[c], e = "ec"; e = $("<span />").html(e).addClass("click").click(a); b.empty().append(hb[c] +
                    "(", e, "): " + jb[c], tools.getSolutionSpan(h), "<br>")
            } function b(b) { if (b) if (tools.isPuzzle("333")) { var c = tools.getCurScramble()[1]; b.empty(); kb = kernel.parseScramble(c, "FRUBLD"); c = $a(kb); for (var e = 0; 6 > e; e++) { var f = $('<span class="sol"/>'), n = $("<span />").html("ec").addClass("click").click(a); f.append(hb[e] + "(", n, "): " + jb[e], tools.getSolutionSpan(c[e]), "<br>"); b.append(f) } } else b.html(IMAGE_UNAVAILABLE) } $(function () { tools.regTool("cross", TOOLS_SOLVERS + ">" + TOOLS_CROSS, b) })
        }); return {
            solve: $a, getEasyCross: function (b) {
                y();
                var c = Math.min(b % 10, 8), e = Math.min(~~(b / 10), 8); b = Math.min(c, e); c = Math.max(c, e); e = [0, 1, 16, 174, 1568, 11377, 57758, 155012, 189978, 190080]; e = mathlib.rn(e[c + 1] - e[b]) + 1; var f; for (f = 0; 190080 > f; f++) { var n = a(gb, f); if (n <= c && n >= b && 0 == --e) break } return db(f)
            }, getEasyXCross: function (b) {
                y(); Ta(); b = Math.max(0, Math.min(b, 8)); for (var c = [1, 16, 174, 1568, 11377, 57758, 155012, 189978, 190080][b], f = !1; !f;) {
                    for (var n = [], h = 0; 500 > h; h++)n.push(mathlib.rn(c)); n.sort(function (a, b) { return b - a }); var w = [], r = 0; for (h = 0; 190080 > h; h++)if (!(a(gb,
                        h) > b)) { for (; n[n.length - 1] == r;)w.push(h), n.pop(); if (0 == n.length) break; r++ } n = mathlib.rndPerm(500); for (h = 0; 500 > h; h++) {
                            var x = w[n[h]], Na = ~~(x / 384), z = 24 * Na + (x >> 4) % 24, Sa = Na << 4 | x & 15, Qa = []; Ra(z, Sa, b, -1, Qa); r = mathlib.rndPerm(8).slice(4); var Oa = mathlib.rndPerm(8), Pa = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; Qa = 4; for (var Va = 0; 12 > Va; Va++)Na >= e[11 - Va][Qa] ? (Na -= e[11 - Va][Qa--], Pa[Va] = -1) : Pa[Va] = Oa.pop(); for (Va = 0; 4 > Va; Va++)if (r[Va] = 3 * r[Va] + mathlib.rn(3), Oa[Va] = 2 * Pa.indexOf(Va) + mathlib.rn(2), !(f || a(lb[Va], 24 * r[Va] + Oa[Va]) > b)) for (Qa =
                                [], Na = 0; Na <= b; Na++)if (Wa(z, Sa, Oa[Va], r[Va], Va, Na, -1, Qa)) { f = !0; break } if (f) { b = db(x); b[2] = mathlib.valuedArray(8, -1); b[3] = mathlib.valuedArray(8, -1); c = [7, 6, 5, 4, 10, 9, 8, 11, 3, 2, 1, 0]; f = [6, 5, 4, 7, 2, 1, 0, 3]; for (h = 0; 4 > h; h++)b[0][c[Oa[h] >> 1]] = c[h + 4], b[1][c[Oa[h] >> 1]] = Oa[h] % 2, b[2][f[~~(r[h] / 3)]] = f[h + 4], b[3][f[~~(r[h] / 3)]] = (30 - r[h]) % 3; return b }
                        }
                }
            }
        }
}(mathlib.createMove, mathlib.edgeMove, mathlib.createPrun, mathlib.setNPerm, mathlib.getNPerm, mathlib.Cnk, mathlib.getPruning); execMain(function (c, Oa, z, r) {
    function b(a, b) { var c = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], e = a % 12, f = ~~(a / 12); f >= e && f++; c[e] = 2; c[f] = 4; Oa(c, b); for (var h = 0; 12 > h; h++)1 == c[h] >> 1 ? e = h : 2 == c[h] >> 1 && (f = h); f > e && f--; return 12 * f + e } function e() { e = $.noop; c(f, 2048, [Oa, "o", 12, -2]); c(bb, 132, b) } function a(a, b) {
        e(); var c = kernel.parseScramble(a, "FRUBLD"); b.empty(); for (var r = 0; 12 > r; r++) {
            for (var Na = 0, y = 116, z = 0; z < c.length; z++)for (var Oa = x[r].indexOf("FRUBLD".charAt(c[z][0])), Pa = c[z][2], Ua = 0; Ua < Pa; Ua++)Na = f[Oa][Na], y = bb[Oa][y]; Na = h.search([Na,
                y], 0); for (z = 0; z < Na.length; z++)Na[z] = "FRUBLD".charAt(Na[z][0]) + " 2'".charAt(Na[z][1]); b.append($('<span class="sol">').append(Qa[r] + ": " + Ta[r], tools.getSolutionSpan(Na)), "<br>")
        }
    } function Pa(b, c) {
        if (c) if (tools.isPuzzle("333")) {
            var h = tools.getCurScramble(); if ("eocross" == b) {
                h = h[1]; e(); h = kernel.parseScramble(h, "FRUBLD"); c.empty(); for (var r = 0; 12 > r; r++) {
                    for (var z = 0, y = 116, Oa = 129, Pa = 0; Pa < h.length; Pa++)for (var Ua = x[r].indexOf("FRUBLD".charAt(h[Pa][0])), Wa = h[Pa][2], gb = 0; gb < Wa; gb++)z = f[Ua][z], y = bb[Ua][y], Oa =
                        bb[Ua][Oa]; z = Na.search([z, y, Oa], 0); for (Pa = 0; Pa < z.length; Pa++)z[Pa] = "FRUBLD".charAt(z[Pa][0]) + " 2'".charAt(z[Pa][1]); c.append($('<span class="sol">').append(Qa[r] + ": " + Ta[r], tools.getSolutionSpan(z)), "<br>")
                }
            } else a(h[1], c)
        } else c.html(IMAGE_UNAVAILABLE)
    } var f = [], bb = [], h = new mathlib.Solver(6, 3, [[0, [Oa, "o", 12, -2], 2048], [116, b, 132]]), Na = new mathlib.Solver(6, 3, [[0, [Oa, "o", 12, -2], 2048], [116, b, 132], [129, b, 132]]), Qa = "D(LR) D(FB) U(LR) U(FB) L(UD) L(FB) R(UD) R(FB) F(LR) F(UD) B(LR) B(UD)".split(" "), x = "FRUBLD RBULFD FLDBRU LBDRFU FDRBUL DBRUFL FULBDR UBLDFR URBDLF RDBLUF DRFULB RUFLDB".split(" "),
        Ta = "&nbsp;&nbsp;&nbsp; &nbsp;y&nbsp; z2&nbsp; z2y z'&nbsp; z'y &nbsp;z&nbsp; z&nbsp;y x'&nbsp; x'y &nbsp;x&nbsp; x&nbsp;y".split(" "); $(function () { tools.regTool("eoline", TOOLS_SOLVERS + ">" + TOOLS_EOLINE, Pa.bind(null, "eoline")); tools.regTool("eocross", TOOLS_SOLVERS + ">EOCross", Pa.bind(null, "eocross")) }); return { solve: a }
}, [mathlib.createMove, mathlib.edgeMove, mathlib.createPrun, mathlib.getPruning]); execMain(function (c) {
    function Oa(b, f) { e.ca = [0, 0, 0, 0, 0, 0, 0, 0]; for (var h = 1; 3 > h; h++) { var r = b % 24; b = ~~(b / 24); e.ca[r & 7] = h | r & 24 } c.CornMult(e, c.moveCube[3 * f], a); r = []; for (h = 0; 8 > h; h++)r[a.ca[h] & 7] = h | a.ca[h] & 24; b = 0; for (h = 2; 0 < h; h--)b = 24 * b + r[h]; return b } function z(b, f) { e.ea = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; for (var h = 1; 4 > h; h++) { var r = b % 24; b = ~~(b / 24); e.ea[r >> 1] = h << 1 | r & 1 } c.EdgeMult(e, c.moveCube[3 * f], a); r = []; for (h = 0; 12 > h; h++)r[a.ea[h] >> 1] = h << 1 | a.ea[h] & 1; b = 0; for (h = 3; 0 < h; h--)b = 24 * b + r[h]; return b } function r(a, b) {
        b.empty();
        for (var c = 0; 4 > c; c++) {
            a: { var e = a, r = bb[c]; var Na = [126]; for (var Qa = [11964], $a = 1; 4 > $a; $a++)Na[$a] = Oa(Na[$a - 1], 4), Qa[$a] = z(Qa[$a - 1], 4); var Va = []; r = r.split(""); for (var y = 0; 4 > y; y++) { Va[y] = r.join(""); var db = kernel.parseScramble(e, Va[y]); for ($a = 0; $a < db.length; $a++)for (var mb = db[$a][0], cb = 0; cb < db[$a][2]; cb++)Na[y] = Oa(Na[y], mb), Qa[y] = z(Qa[y], mb); mathlib.circle(r, 0, 2, 3, 5) } for (r = 1; 12 > r; r++)for (y = 0; 4 > y; y++)if (e = Pa.search([Na[y], Qa[y]], 1 == r ? 0 : r, r)) { e.push(y); Na = e; break a } Na = void 0 } Qa = Na.pop(); 0 == c % 2 && (Qa = (Qa + 2) %
                4); for (y = 0; y < Na.length; y++)Na[y] = "URFDLB".charAt(Na[y][0]) + " 2'".charAt(Na[y][1]); b.append($('<span class="sol">').append(f[c] + ": " + h[c] + ["&nbsp;&nbsp;&nbsp;", "x'&nbsp;", "x2&nbsp;", "x&nbsp;&nbsp;"][Qa], tools.getSolutionSpan(Na)), "<br>")
        }
    } function b(a) { if (a) if (tools.isPuzzle("333")) { var b = tools.getCurScramble(); r(b[1], a) } else a.html(IMAGE_UNAVAILABLE) } var e = new c, a = new c, Pa = new mathlib.Solver(6, 3, [[126, Oa, 576], [11964, z, 13824]]), f = ["LU", "LD", "FU", "FD"], bb = ["DRBULF", "URFDLB", "DBLUFR", "UBRDFL"], h = ["&nbsp;&nbsp;",
        "&nbsp;&nbsp;", "y&nbsp;", "y&nbsp;"]; $(function () { tools.regTool("roux1", TOOLS_SOLVERS + ">" + TOOLS_ROUX1, b) }); return { solve: r }
}, [mathlib.CubieCube]); var gsolver = function () {
    function c(a, c) { for (var e = 0; e < z.length; e++)c = a(c, z[e]); for (e = 0; e < b.length; e++)c = a(c, b[e]); return c } function Oa(a, b) { var c = {}; b = b || " 2'"; for (var e in a) for (var f = 0; f < b.length; f++)c[e + b[f]] = a[e]; return c } var z, r, b, e = function () {
        function a(a, b) { for (var e = a.split(""), f = c["URF".indexOf(b[0])], h = "? 2'".indexOf(b[1]), r = 0; r < f.length; r++)mathlib.acycle(e, f[r], h); return e.join("") } var b = "URFDLB".split(""), c = [[[0, 1, 3, 2], [4, 8, 16, 20], [5, 9, 17, 21]], [[4, 5, 7, 6], [1, 22, 13, 9], [3, 20, 15, 11]], [[8,
            9, 11, 10], [2, 4, 13, 19], [3, 6, 12, 17]]], e = new mathlib.gSolver("XXXX???????????????????? ????XXXX???????????????? ????????XXXX???????????? ????????????XXXX???????? ????????????????XXXX???? ????????????????????XXXX".split(" "), a, Oa({ U: 1, R: 2, F: 3 })); return function (c, f) {
                z = kernel.parseScramble(c, "URF"); for (var h = "UUUURRRRFFFFDDDDLLLLBBBB", r = 0; r < z.length; r++) { var x = z[r]; h = a(h, "URF".charAt(x[0]) + " 2'".charAt(x[2] - 1)) } for (x = 0; 6 > x; x++) {
                    var y = []; for (r = 0; 24 > r; r++)y.push(h[r] == "URFDLB".charAt(x) ? "X" : "?"); r = e.search(y.join(""),
                        0); f.append(b[x] + ": ", tools.getSolutionSpan(r), "<br>")
                }
            }
    }(), a = function () {
        function e(a, b) { for (var c = a.split(""), e = Ua["URFDLBurfdlbMESxyz".indexOf(b[0])], f = "? 2'".indexOf(b[1]), n = 0; n < e.length; n++)mathlib.acycle(c, e[n], f); return c.join("") } function f(a, b, c) { c += " // orientation \n"; for (var e = 0; e < b.length && void 0 != b[e]; e++)c += b[e].join(" ").replace(/\s+/g, " ") + " // " + a[e].head + (0 == b[e].length ? " skip" : "") + "\n"; return "https://alg.cubing.net/?alg=" + encodeURIComponent(c) } function h(a, h) {
            var n = +new Date, y =
                [null, 0], x = []; b = []; for (var Na = 0; Na < a.length; Na++) {
                    if (!a[Na].solv) { a[Na].solv = {}; for (var z in a[Na].step) a[Na].solv[z] = new mathlib.gSolver([z], e, a[Na].move) } var Sa = void 0, Qa = e, Oa = a[Na].solv, Ra = a[Na].step, Pa = a[Na].fmov || []; y = y[1]; var Va = a[Na].maxl || 10, Ta = 0; a: for (; Ta < Va + 1; Ta++)for (var Ua in Oa) if ((Ra[Ua] | y) == Ra[Ua]) {
                        var Xa = c(Qa, Ua); Sa = Oa[Ua].search(Xa, 0, Ta); if (void 0 != Sa) { y |= Ra[Ua]; break a } for (var Wa = 0; Wa < Pa.length; Wa++)if (Sa = Qa(Xa, Pa[Wa]), Sa = Oa[Ua].search(Sa, 0, Ta), void 0 != Sa) {
                            Sa.unshift(Pa[Wa]); y |=
                                Ra[Ua]; break a
                        }
                    } y = [Sa, y]; x[Na] = y[0]; if (void 0 == y[0]) { h.append(a[Na].head + ": &nbsp;(no solution found in %d moves)".replace("%d", a[Na].maxl || 10), "<br>"); break } h.append(a[Na].head + ": ", 0 == x[Na].length ? "&nbsp;(skip)" : tools.getSolutionSpan(x[Na]), "<br>"); b = b.concat(x[Na]); DEBUG && console.log("[step solver]", a[Na].head + ": ", x[Na], "->", y[1], c(e, mathlib.SOLVED_FACELET), +new Date - n)
                } h.append($('<a class="click" target="_blank">alg.cubing.net</a>').attr("href", f(a, x, w) + "&setup=" + encodeURIComponent(r)))
        } function Pa() {
            w =
            Ya.val(); a.exec(fb, r, Xa.empty())
        } var Ua = [[[0, 2, 8, 6], [1, 5, 7, 3], [18, 36, 45, 9], [19, 37, 46, 10], [20, 38, 47, 11]], [[9, 11, 17, 15], [10, 14, 16, 12], [2, 51, 29, 20], [5, 48, 32, 23], [8, 45, 35, 26]], [[18, 20, 26, 24], [19, 23, 25, 21], [6, 9, 29, 44], [7, 12, 28, 41], [8, 15, 27, 38]], [[27, 29, 35, 33], [28, 32, 34, 30], [24, 15, 51, 42], [25, 16, 52, 43], [26, 17, 53, 44]], [[36, 38, 44, 42], [37, 41, 43, 39], [0, 18, 27, 53], [3, 21, 30, 50], [6, 24, 33, 47]], [[45, 47, 53, 51], [46, 50, 52, 48], [2, 36, 33, 17], [1, 39, 34, 14], [0, 42, 35, 11]], [[0, 2, 8, 6], [1, 5, 7, 3], [18, 36, 45, 9], [19, 37, 46, 10], [20,
            38, 47, 11], [21, 39, 48, 12], [22, 40, 49, 13], [23, 41, 50, 14]], [[9, 11, 17, 15], [10, 14, 16, 12], [2, 51, 29, 20], [5, 48, 32, 23], [8, 45, 35, 26], [1, 52, 28, 19], [4, 49, 31, 22], [7, 46, 34, 25]], [[18, 20, 26, 24], [19, 23, 25, 21], [6, 9, 29, 44], [7, 12, 28, 41], [8, 15, 27, 38], [3, 10, 32, 43], [4, 13, 31, 40], [5, 16, 30, 37]], [[27, 29, 35, 33], [28, 32, 34, 30], [24, 15, 51, 42], [25, 16, 52, 43], [26, 17, 53, 44], [21, 12, 48, 39], [22, 13, 49, 40], [23, 14, 50, 41]], [[36, 38, 44, 42], [37, 41, 43, 39], [0, 18, 27, 53], [3, 21, 30, 50], [6, 24, 33, 47], [1, 19, 28, 52], [4, 22, 31, 49], [7, 25, 34, 46]], [[45, 47, 53, 51],
            [46, 50, 52, 48], [2, 36, 33, 17], [1, 39, 34, 14], [0, 42, 35, 11], [5, 37, 30, 16], [4, 40, 31, 13], [3, 43, 32, 10]], [[1, 19, 28, 52], [4, 22, 31, 49], [7, 25, 34, 46]], [[21, 12, 48, 39], [22, 13, 49, 40], [23, 14, 50, 41]], [[3, 10, 32, 43], [4, 13, 31, 40], [5, 16, 30, 37]], [[9, 11, 17, 15], [10, 14, 16, 12], [2, 51, 29, 20], [5, 48, 32, 23], [8, 45, 35, 26], [36, 42, 44, 38], [37, 39, 43, 41], [0, 53, 27, 18], [3, 50, 30, 21], [6, 47, 33, 24], [1, 52, 28, 19], [4, 49, 31, 22], [7, 46, 34, 25]], [[0, 2, 8, 6], [1, 5, 7, 3], [18, 36, 45, 9], [19, 37, 46, 10], [20, 38, 47, 11], [27, 33, 35, 29], [28, 30, 34, 32], [24, 42, 51, 15], [25,
                43, 52, 16], [26, 44, 53, 17], [21, 39, 48, 12], [22, 40, 49, 13], [23, 41, 50, 14]], [[18, 20, 26, 24], [19, 23, 25, 21], [6, 9, 29, 44], [7, 12, 28, 41], [8, 15, 27, 38], [45, 51, 53, 47], [46, 48, 52, 50], [2, 17, 33, 36], [1, 14, 34, 39], [0, 11, 35, 42], [3, 10, 32, 43], [4, 13, 31, 40], [5, 16, 30, 37]]], Wa = Oa({ U: 0, R: 17, F: 34, D: 48, L: 65, B: 82 }), Ra = Oa({ U: 0, R: 17, F: 34, L: 65, B: 82 }), $a = Oa({ U: 0, R: 17, M: 97, r: 113 }), Va = Oa({ U: 0, R: 17, L: 65 }), y = [{ move: Wa, maxl: 8, head: "Cross", step: { "----U--------R--R-----F--F--D-DDD-D-----L--L-----B--B-": 0 } }, {
                    move: Ra, head: "F2L-1", step: {
                        "----U-------RR-RR-----FF-FF-DDDDD-D-----L--L-----B--B-": 1,
                        "----U--------R--R----FF-FF-DD-DDD-D-----LL-LL----B--B-": 2, "----U--------RR-RR----F--F--D-DDD-DD----L--L----BB-BB-": 4, "----U--------R--R-----F--F--D-DDDDD----LL-LL-----BB-BB": 8
                    }
                }, {
                    move: Ra, head: "F2L-2", step: {
                        "----U-------RR-RR----FFFFFFDDDDDD-D-----LL-LL----B--B-": 3, "----U-------RRRRRR----FF-FF-DDDDD-DD----L--L----BB-BB-": 5, "----U--------RR-RR---FF-FF-DD-DDD-DD----LL-LL---BB-BB-": 6, "----U-------RR-RR-----FF-FF-DDDDDDD----LL-LL-----BB-BB": 9, "----U--------R--R----FF-FF-DD-DDDDD----LLLLLL----BB-BB": 10,
                        "----U--------RR-RR----F--F--D-DDDDDD---LL-LL----BBBBBB": 12
                    }
                }, { move: Ra, head: "F2L-3", step: { "----U-------RRRRRR---FFFFFFDDDDDD-DD----LL-LL---BB-BB-": 7, "----U-------RR-RR----FFFFFFDDDDDDDD----LLLLLL----BB-BB": 11, "----U-------RRRRRR----FF-FF-DDDDDDDD---LL-LL----BBBBBB": 13, "----U--------RR-RR---FF-FF-DD-DDDDDD---LLLLLL---BBBBBB": 14 } }, { move: Ra, head: "F2L-4", step: { "----U-------RRRRRR---FFFFFFDDDDDDDDD---LLLLLL---BBBBBB": 15 } }], db = [{ move: Wa, maxl: 10, fmov: ["x ", "x2", "x'"], head: "Step 1", step: { "---------------------F--F--D--D--D-----LLLLLL-----B--B": 0 } },
                { move: $a, maxl: 16, head: "Step 2", step: { "------------RRRRRR---F-FF-FD-DD-DD-D---LLLLLL---B-BB-B": 1 } }], bb = [{ move: Wa, maxl: 8, head: "2x2x2", step: { "---------------------FF-FF-DD-DD--------LL-LL---------": 1, "------------------------------DD-DD----LL-LL-----BB-BB": 2 } }, { move: Wa, maxl: 10, head: "2x2x3", step: { "---------------------FF-FF-DD-DD-DD----LLLLLL----BB-BB": 3 } }], cb = [{ move: Wa, maxl: 10, head: "EOLine", step: { "-H-HUH-H-----R-------HFH-F--D-HDH-D-----L-------HBH-B-": 0 } }, {
                    move: Va, maxl: 16, head: "ZZF2L1", step: {
                        "-H-HUH-H----RRRRRR---HFF-FF-DDHDD-DD----L-------BBHBB-": 1,
                        "-H-HUH-H-----R-------FFHFF-DD-DDHDD----LLLLLL---HBB-BB": 2
                    }
                }, { move: Va, maxl: 16, head: "ZZF2L2", step: { "-H-HUH-H----RRRRRR---FFFFFFDDDDDDDDD---LLLLLL---BBBBBB": 3 } }], lb = [{ move: Wa, maxl: 7, head: "EO", step: { "-H-HUH-H-----R-------HFH----H-HDH-H-----L-------HBH---": 0 } }, { move: Wa, maxl: 10, head: "DR", step: { "UUUUUUUUU---RRR------FFF---UUUUUUUUU---RRR------FFF---": 1 } }], gb, Ya, fb, Xa, w = "z2"; execMain(function () {
                    for (var a = "z2;;z ;z';x ;x'".split(";"), b = 0; 6 > b; b++)for (var c = 0; 3 > c; c++)a.push(a[b] + " y" + " 2'".charAt(c)); Ya = $("<select>");
                    for (b = 0; b < a.length; b++)Ya.append($("<option>").val(a[b]).html(a[b]))
                }); return {
                    exec: function (a, f, r) {
                        if ("222" == a) {
                            z = kernel.parseScramble(f, "URFDLB"); for (a = 0; a < z.length; a++)z[a] = "URFDLB".charAt(z[a][0]) + " 2'".charAt(z[a][2] - 1); f = "URF UFL ULB UBR DFR DLF DBL DRB".split(" "); var n = "----UU-UURR-RR-----FF-FF------------------------------ ---UU-UU----------FF-FF--------------LL-LL------------ UU-UU-------------------------------LL-LL-----BB-BB--- -UU-UU----RR-RR------------------------------BB-BB---- ------------RR-RR-----FF-FF-DD-DD--------------------- ---------------------FF-FF-DD-DD--------LL-LL--------- ------------------------------DD-DD----LL-LL-----BB-BB -------------RR-RR-------------DD-DD------------BB-BB-".split(" ");
                            gb = gb || new mathlib.gSolver(n, e, Wa); for (a = 0; 8 > a; a++) { r.append(f[a] + ": "); b = []; var x = gb.search(c(e, n[a]), 0); x ? r.append(tools.getSolutionSpan(x), "<br>") : r.append("no solution found<br>") }
                        } else {
                            Xa = r; fb = a; n = w.split(" "); x = [0, 1, 2, 3, 4, 5]; for (var Na = [[5, 1, 0, 2, 4, 3], [0, 2, 4, 3, 5, 1], [1, 3, 2, 4, 0, 5]], Sa = 0; Sa < n.length; Sa++)if (n[Sa][0]) for (var Qa = "xyz".indexOf(n[Sa][0]), Oa = "? 2'".indexOf(n[Sa][1] || " "), Ra = 0; Ra < Oa; Ra++)for (var Va = 0; 6 > Va; Va++)x[Va] = Na[Qa][x[Va]]; for (Va = 0; 6 > Va; Va++)x[Va] = "URFDLB".charAt(x[Va]); n = x.join("");
                            z = kernel.parseScramble(f, "URFDLB"); for (f = 0; f < z.length; f++)z[f] = n.charAt(z[f][0]) + " 2'".charAt(z[f][2] - 1); r.append("Orientation:", Ya.unbind("change").change(Pa), "<br>"); "cf" == a && h(y, r); "roux" == a && h(db, r); "petrus" == a && h(bb, r); "zz" == a && h(cb, r); "eodr" == a && h(lb, r)
                        }
                    }, move: e
                }
    }(), Pa = function () {
        function a(a, b) {
            if (!a) return null; b = ~~b; a = a.split("|"); if (0 == b) { var c = a[0].slice(6); a[0] = a[0].slice(0, 6) + a[1].slice(6); a[1] = a[1].slice(0, 6) + c } else if (c = 0 < b ? 0 : 1, b = Math.abs(b), a[c] = a[c].slice(b) + a[c].slice(0, b), /[a-h]/.exec(a[c][0] +
                a[c][6])) return null; return a.join("|")
        } function e(a) { for (var b = 0, c = 0, e = [], f = 0; f < a.length; f++)0 == a[f] ? (0 == b && 0 == c ? e.push("/") : e.push((b + 5) % 12 - 5 + "," + ((c + 5) % 12 - 5) + "/"), b = c = 0) : 0 < a[f] ? b += ~~a[f] : c -= ~~a[f]; return e } for (var f = { 0: 33 }, h = 1; 12 > h; h++)f["" + h] = 0, f["" + -h] = 16; var r, Oa; return function (h, x) {
            r = r || new mathlib.gSolver(["0Aa0Aa0Aa0Aa|Aa0Aa0Aa0Aa0", "0Aa0Aa0Aa0Aa|0Aa0Aa0Aa0Aa", "Aa0Aa0Aa0Aa0|Aa0Aa0Aa0Aa0", "Aa0Aa0Aa0Aa0|0Aa0Aa0Aa0Aa"], a, f); Oa = Oa || new mathlib.gSolver(["0Aa0Aa0Aa0Aa|Bb1Bb1Bb1Bb1", "0Aa0Aa0Aa0Aa|1Bb1Bb1Bb1Bb",
                "Aa0Aa0Aa0Aa0|Bb1Bb1Bb1Bb1", "Aa0Aa0Aa0Aa0|1Bb1Bb1Bb1Bb"], a, f); z = []; for (var Na = /^\s*\(\s*(-?\d+),\s*(-?\d+)\s*\)\s*$/, y = h.split("/"), Qa = 0; Qa < y.length; Qa++) { if (!/^\s*$/.exec(y[Qa])) { var Pa = Na.exec(y[Qa]); ~~Pa[1] && z.push((~~Pa[1] + 12) % 12); ~~Pa[2] && z.push(-(~~Pa[2] + 12) % 12) } z.push(0) } 0 < z.length && z.pop(); b = []; Na = r.search(c(a, "0Aa0Aa0Aa0Aa|Aa0Aa0Aa0Aa0"), 0); x.append("Shape: ", tools.getSolutionSpan(e(Na)), "<br>"); b = b.concat(Na); Na = Oa.search(c(a, "0Aa0Aa0Aa0Aa|Bb1Bb1Bb1Bb1"), 0); x.append("Color: ", tools.getSolutionSpan(e(Na)),
                    "<br>")
        }
    }(), f = function () {
        function a(a, b) { for (var c = a.split(""), f = e["RULBrbxy".indexOf(b[0])], h = "? '*".indexOf(b[1]), r = 0; r < f.length; r++)mathlib.acycle(c, f[r], h); return c.join("") } var e = [[[5, 25, 15], [9, 28, 17], [7, 29, 16], [8, 26, 19], [23, 14, 4]], [[0, 20, 25], [2, 21, 27], [4, 22, 29], [1, 23, 26], [19, 7, 11]], [[10, 15, 20], [13, 18, 24], [11, 16, 23], [14, 19, 22], [29, 1, 8]], [[25, 20, 15], [29, 23, 19], [28, 21, 18], [27, 24, 17], [13, 9, 2]], [[0, 25, 5], [4, 26, 7], [3, 27, 9], [2, 28, 6], [17, 12, 21]], [[0, 20, 25], [2, 21, 27], [4, 22, 29], [1, 23, 26], [19, 7, 11]], [[0,
            25, 15, 10], [1, 27, 19, 13], [2, 29, 18, 11], [3, 26, 17, 14], [4, 28, 16, 12], [6, 7, 9, 8], [21, 23, 24, 22]], [[5, 10, 20, 25], [6, 11, 21, 26], [7, 12, 22, 27], [8, 13, 23, 28], [9, 14, 24, 29], [1, 2, 4, 3], [16, 18, 19, 17]], []], f; return function (e, h) {
                f = f || new mathlib.gSolver(["?L?L??B?B?UUUUU?R?R???F?F?????", "?F?F??L?L?UUUUU?B?B???R?R?????", "?R?R??F?F?UUUUU?L?L???B?B?????", "?B?B??R?R?UUUUU?F?F???L?L?????"], a, Oa({ R: 0, r: 1, B: 2, b: 3 }, " '")); z = kernel.parseScramble(e, "RULB"); for (var r = 0; r < z.length; r++)z[r] = "RULB".charAt(z[r][0]) + " 2'".charAt(z[r][2] -
                    1); var x = "URFDLB".split(""), Na = "UUUUU?RR???FF????????LL???BB?? ???BBUUUUU??L?L?FF????????R?R? ?B?B??R?R?UUUUU?F?F???L?L????? ????????RR???BBUUUUU???LL???FF ?BB????????R?R????FFUUUUU??L?L ??F?F??R?R???????B?B?L?L?UUUUU".split(" "); for (r = 0; 6 > r; r++) {
                        b = []; var Qa = ["x*", "y ", null, "x ", "y*", "y'"], y = ~~(c(a, "U????R????F????D????L????B????").indexOf(x[r]) / 5); Qa[y] && b.push(Qa[y]); (Qa = f.search(c(a, Na[r]), 0)) ? (h.append(x[r] + ": "), b[0] && h.append("&nbsp;" + b[0].replace("'", "2").replace("*", "'")), h.append(tools.getSolutionSpan(Qa),
                            "<br>")) : h.append(x[r] + ": no solution found<br>")
                    }
            }
    }(), bb = function () {
        function a(a, b) { for (var c = a.split(""), f = e["RULB".indexOf(b[0])], h = "? '".indexOf(b[1]), r = 0; r < f.length; r++)mathlib.acycle(c, f[r], h); return c.join("") } var e = [[[5, 9, 22], [0, 7, 20], [1, 8, 18]], [[3, 16, 11], [1, 14, 6], [2, 12, 7]], [[4, 23, 15], [2, 18, 13], [0, 19, 14]], [[10, 17, 21], [8, 12, 19], [6, 13, 20]]], f; return function (e, h) {
            f = f || new mathlib.gSolver(["????FF??RRR??L?L?L?DDDDD"], a, Oa({ R: 0, U: 1, L: 2, B: 3 }, " '")); z = kernel.parseScramble(e, "RULBrulb"); e = []; for (var r =
                0; r < z.length; r++)1 == z[r][1] && e.push("RULB".charAt(z[r][0]) + " 2'".charAt(z[r][2] - 1)); var x = ["D", "L", "R", "F"], Na = [["RULB", "LUBR", "BURL"], ["URBL", "LRUB", "BRLU"], ["RLBU", "ULRB", "BLUR"], ["RBUL", "UBLR", "LBRU"]]; for (r = 0; 4 > r; r++) {
                    b = []; var Qa, y = 0; a: for (; 99 > y; y++)for (var Pa = 0; 3 > Pa; Pa++) {
                        var Ta = Na[r][Pa]; z = []; for (var Ua = 0; Ua < e.length; Ua++)z.push("RULB"[Ta.indexOf(e[Ua][0])] + e[Ua][1]); if (Qa = f.search(c(a, "????FF??RRR??L?L?L?DDDDD"), y, y)) {
                            for (Ua = 0; Ua < Qa.length; Ua++)Qa[Ua] = Ta["RULB".indexOf(Qa[Ua][0])] + Qa[Ua][1];
                            break a
                        }
                    } Qa ? h.append(x[r] + ": ", tools.getSolutionSpan(Qa), "<br>") : h.append(x[r] + ": no solution found<br>")
                }
        }
    }(); (function () {
        function a(a, b) { var c = a.indexOf("-"), e = c >> 2; c &= 3; var f = a.split(""), h = ~~b[1], r = [e << 2 | c]; if ("V" == b[0]) { if ("$" == f[e << 2 | h]) return null; for (var y = c > h ? -1 : 1; c != h;)c += y, r.push(e << 2 | c) } else { if ("$" == f[h << 2 | c]) return null; for (y = e > h ? -1 : 1; e != h;)e += y, r.push(e << 2 | c) } r.reverse(); mathlib.acycle(f, r); return f.join("") } function c(a) {
            var b = []; a = a.split(""); for (var c = 0; c < a.length; c++)"?" == a[c] && (a[c] =
                "-", b.push(a.join("")), a[c] = "?"); return b
        } function e(c, e) { for (var f = [], h = 0; h < e.length; h++)f[h] = c[e[h]]; c = f.join(""); for (h = 0; h < b.length; h++)c = a(c, b[h]); return c } function f(a) { do { var b = mathlib.rndPerm(a * a); var c = (a - 1 - ~~(b.indexOf(b.length - 1) / a)) * (a - 1); for (var e = 0; e < b.length; e++)for (var f = e + 1; f < b.length; f++)b[e] > b[f] && b[e] != b.length - 1 && c++ } while (0 != c % 2); return b } function h(a, c) {
            var h = +new Date, r = [], y = 0; if (4 == a) {
                r[0] = f(4); for (var x = r[0], Na = [], Qa = [0, 4, 8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15], Oa = 0; 16 > Oa; Oa++)Na[Oa] =
                    Qa[x[Qa[Oa]]]; r[1] = Na; x = 0; a: for (; 99 > x; x++)for (y = 0; 2 > y; y++)if (Na = r[y].indexOf(r[y].length - 1), b = ["V" + (Na & 3), "H" + (Na >> 2)], Na = z.search(e("0123???????????-", r[y]), x, x)) { b = b.concat(Na); break a } x = Pa.search(e("01234???8???c??-", r[y]).replace(/[0123]/g, "$"), 0); b = b.concat(x)
            } else if (3 == a) { x = f(3); Na = [5, 6, 7, 9, 10, 11, 13, 14, 15]; for (Qa = 0; 16 > Qa; Qa++)r[Qa] = Na[x[Na.indexOf(Qa)]] || Qa; Na = r.indexOf(r.length - 1); b = ["V" + (Na & 3), "H" + (Na >> 2)]; r = [r] } x = Va.search(e("0123456789abcde-", r[y]).replace(/[012348c]/g, "$"), 0); b = b.concat(x);
            DEBUG && console.log("[15p solver]", y, e("0123456789abcde-", r[y]), b.join(""), b.length, +new Date - h); x = c.slice(3 == a ? 3 : 4); h = []; Qa = 1 == y ? "VH" : "HV"; y = -1 == x.indexOf("a") ? ["DR", "UL"] : ["￬￫", "￪￩"]; r = -1 != x.indexOf("m"); x = -1 != x.indexOf("p"); var w = [-1, -1]; for (Na = 0; Na < b.length; Na++) { var n = ~~b[Na][1], Sa = Qa.indexOf(b[Na][0]); -1 != w[Sa] && w[Sa] != n && (0 < h.length && h[h.length - 1][0] == Sa ? (Oa = h[h.length - 1], Oa[1] += n - w[Sa], 0 == Oa[1] && h.pop()) : h.push([Sa, n - w[Sa]])); w[Sa] = n } for (Na = 0; Na < h.length; Na++) {
                Oa = h[Na]; Qa = y[r != 0 < Oa[1] ? 0 : 1][Oa[0]];
                Oa = Math.abs(Oa[1]); h[Na] = []; if (x) h[Na].push(Qa + Oa); else for (; 0 < Oa--;)h[Na].push(Qa); h[Na] = h[Na].join(" ")
            } h.reverse(); return h.join(" ").replace(/1/g, "")
        } var r = Oa({ V: 0, H: 1 }, "0123"), z = new mathlib.gSolver(c("0123????????????"), a, r), Pa = new mathlib.gSolver(c("$$$$4???8???c???"), a, r), Va = new mathlib.gSolver(["$$$$$567$9ab$de-"], a, r); scrMgr.reg(["15prp", "15prap", "15prmp"], h.bind(null, 4))(["8prp", "8prap", "8prmp"], h.bind(null, 3))
    })(); var h = execMain(function () {
        function e(a) {
            var b = Ya[0].getBoundingClientRect(),
            c = a.offsetX / 30 * Ya[0].width / b.width; a = a.offsetY / 30 * Ya[0].height / b.height; for (b = 0; 6 > b; b++)if (c >= 3.3 * Sa[b] && c <= 3.3 * Sa[b] + 3 && a >= 3.3 * Za[b] && a <= 3.3 * Za[b] + 3) { var e = ~~(c - 3.3 * Sa[b]), h = ~~(a - 3.3 * Za[b]); Xa = Xa.split(""); Xa[9 * b + 3 * h + e] = n; Xa = Xa.join(""); f(fb, b, e, h, Xa) } c >= Sa[6] && c <= Sa[6] + 5 && a >= Za[6] && a <= Za[6] + 2 && (e = ~~(c - Sa[6]), h = ~~(a - Za[6]), n = "URFDLB-XYZ".charAt(2 * e + h), $.ctxDrawPolygon(fb, w[n], hb, [30, 1.5, 1.5])); 1 == Va ? $a() : 2 == Va && Ra()
        } function f(a, b, c, e, f) {
            $.ctxDrawPolygon(a, w[f[9 * b + 3 * e + c]], [[c, c, c + 1, c + 1], [e, e + 1, e +
                1, e]], [30, 3.3 * Sa[b], 3.3 * Za[b]])
        } function h(a) { a = y.val(); y.val(""); kernel.blur(); "input" == a ? (a = prompt("U1U2...U9R1..R9F1..D1..L1..B1..B9", Xa), null != a && (ob.exec(a) ? r(a) : logohint.push("Invalid Input"))) : "" != a && r(a) } function r(a) {
            Xa = a; a = fb; var b = Xa, c = kernel.getProp("imgSize") / 48; Ya.width(39 * c + "em"); Ya.height(29 * c + "em"); Ya.attr("width", 391); Ya.attr("height", 87 / 9 * 30 + 1); for (c = 0; 6 > c; c++)for (var e = 0; 3 > e; e++)for (var h = 0; 3 > h; h++)f(a, c, e, h, b); for (e = 0; 5 > e; e++)for (h = 0; 2 > h; h++)$.ctxDrawPolygon(a, w["URFDLB-XYZ".charAt(2 *
                e + h)], [[e, e, e + 1, e + 1], [h, h + 1, h + 1, h]], [30, 7.25, .5]); $.ctxDrawPolygon(a, w[n], hb, [30, 1.5, 1.5]); 1 == Va ? $a() : 2 == Va && Ra()
        } function Pa() { if (Va) { var a = jb[1].searchNext(1E3, 1E3); var b = lb.length + " sol(s), @" + ~~((+new Date - eb) / 1E3) + "s|" + jb[1].maxl + "f"; a && lb.push(a.join(" ") + " (" + a.length + "f)"); a && 1 == Va ? (cb.html(lb.join("\n")), cb[0].scrollTop = cb[0].scrollHeight, kb = 0) : (cb.html(lb.join("\n") + "\n" + b), cb[0].scrollTop = cb[0].scrollHeight, kb = setTimeout(Pa, 1)) } } function Wa() {
            jb[0] != Xa && (jb[0] = Xa, jb[1] = new mathlib.gSolver([Xa],
                a.move, Oa({ U: 0, R: 17, F: 34, D: 48, L: 65, B: 82 }))); var b = c(a.move, Xa); jb[1].search(b, 0, 0); eb = +new Date; lb = []; Pa()
        } function Ra() { 0 == Va ? (bb.val("Stop Solve!"), mb.prop("disabled", !0), Va = 2) : (bb.val("Batch Solve!"), mb.prop("disabled", !1), Va = 0); kernel.blur(); Va && Wa() } function $a() { 0 == Va ? (mb.val("Stop Solve!"), bb.prop("disabled", !0), Va = 1) : (mb.val("Single Solve!"), bb.prop("disabled", !1), Va = 0); kernel.blur(); Va && Wa() } var Va = 0, y = $('<select style="font-size:0.75em;">'), bb = $('<input type="button" value="Batch Solve!" style="font-size:0.75em;">'),
            mb = $('<input type="button" value="Single Solve!" style="font-size:0.75em;">'), cb = $('<textarea wrap=off rows="2" cols="30" style="font-size:0.75em;">'), lb = [], gb = {
                "3x3x3": mathlib.SOLVED_FACELET, Empty: "----U--------R--------F--------D--------L--------B----", "2x2x2": "----UU-UURR-RR-----FF-FF------------------------------", "2x2x3": "---UUUUUURR-RR----FFFFFF-------------LL-LL------------", Cross: "----U--------R--R-----F--F--D-DDD-D-----L--L-----B--B-", XCross: "----U-------RR-RR-----FF-FF-DDDDD-D-----L--L-----B--B-",
                EOLine: "-X-XUX-X-----R-------XFX-F--D-XDX-D-----L-------XBX-B-", Roux1: "---------------------F--F--D--D--D-----LLLLLL-----B--B", Domino: "UUUUUUUUU---RRR------FFF---UUUUUUUUU---RRR------FFF---", "EO&CO": "XYXYUYXYX----R-------YFY---XYXYDYXYX----L-------YBY---", Corner: "U-U---U-UR-R---R-RF-F---F-FD-D---D-DL-L---L-LB-B---B-B"
            }, Ya, fb, Xa = mathlib.SOLVED_FACELET, w = { U: "#fff", R: "#f00", F: "#0d0", D: "#ff0", L: "#fa0", B: "#00f", "-": "#777", X: "#0ff", Y: "#f0f", Z: "#000" }, n = "-", Sa = [1, 2, 1, 1, 0, 3, 7.25], Za = [0, 1, 1, 2, 1, 1, .5], hb = [[-.7,
            -.7, .7, .7], [-.7, .7, .7, -.7]], ob = /^[URFDLBXYZ-]{54}$/, jb = ["", null], eb = 0, kb = 0; $(function () { Ya = $("<canvas>"); if (Ya[0].getContext) { fb = Ya[0].getContext("2d"); y.append($("<option>").val("").html("Edit subset")); for (var a in gb) y.append($("<option>").val(gb[a]).html(a)); y.append($("<option>").val("input").html("...")); r(gb.Cross) } }); return function (a, c) {
                z = kernel.parseScramble(a, "URFDLB"); for (var f = 0; f < z.length; f++)z[f] = "URFDLB".charAt(z[f][0]) + " 2'".charAt(z[f][2] - 1); b = []; c.empty().append(y.unbind("change").change(h),
                    " ").append(bb.unbind("click").click(Ra), "").append(mb.unbind("click").click($a), "<br>").append(cb.empty(), "<br>").append(Ya.unbind("mousedown").bind("mousedown", e)); Va && (kb && (clearTimeout(kb), kb = 0), Wa())
            }
    }); execMain(function () {
        function b(b, c) {
            if (c) {
                c.empty(); var x = $('<span class="sol"/>'), Na = tools.getCurScramble(); r = Na[1]; if ("222face" == b && tools.isPuzzle("222")) e(Na[1], x); else if ("333udf" == b && tools.isPuzzle("333") && /^[URFDLB 2']+$/.exec(Na[1])) h(Na[1], x); else if (b.startsWith("333") && tools.isPuzzle("333") &&
                    /^[URFDLB 2']+$/.exec(Na[1])) a.exec(b.slice(3), Na[1], x); else if ("sq1cs" == b && tools.isPuzzle("sq1")) Pa(Na[1], x); else if ("skbl1" == b && tools.isPuzzle("skb")) f(Na[1], x); else if ("pyrv" == b && tools.isPuzzle("pyr")) bb(Na[1], x); else { c.html(IMAGE_UNAVAILABLE); return } c.append(x)
            }
        } $(function () {
            tools.regTool("222face", TOOLS_SOLVERS + ">" + TOOLS_222FACE, b.bind(null, "222face")); tools.regTool("333cf", TOOLS_SOLVERS + ">Cross + F2L", b.bind(null, "333cf")); tools.regTool("333roux", TOOLS_SOLVERS + ">Roux S1 + S2", b.bind(null, "333roux"));
            tools.regTool("333petrus", TOOLS_SOLVERS + ">2x2x2 + 2x2x3", b.bind(null, "333petrus")); tools.regTool("333zz", TOOLS_SOLVERS + ">EOLine + ZZF2L", b.bind(null, "333zz")); tools.regTool("333222", TOOLS_SOLVERS + ">2x2x2", b.bind(null, "333222")); tools.regTool("333eodr", TOOLS_SOLVERS + ">EO + DR", b.bind(null, "333eodr")); tools.regTool("sq1cs", TOOLS_SOLVERS + ">SQ1 S1 + S2", b.bind(null, "sq1cs")); tools.regTool("pyrv", TOOLS_SOLVERS + ">Pyraminx V", b.bind(null, "pyrv")); tools.regTool("skbl1", TOOLS_SOLVERS + ">Skewb Face", b.bind(null,
                "skbl1")); tools.regTool("333udf", TOOLS_SOLVERS + ">3x3x3 General", b.bind(null, "333udf"))
        })
    }); return { rubiksCube: a }
}(); var scrHinter = execMain(function (c) {
    function Oa(a, b, e) {
        var f = new c, r = new c; b && f.init(b.ca, b.ea); b = 99; f.isEqual(a) && (b = 0); for (var z, x = 0; x < e.length; x++) { var Oa = 3 * e[x][0]; for (z = 0; 3 > z; z++)if (c.EdgeMult(f, c.moveCube[Oa + z], r), c.CornMult(f, c.moveCube[Oa + z], r), r.isEqual(a)) { b = z == e[x][2] - 1 ? x + 1 : x; break } if (b == x) break; Oa = 3 * e[x][0] + e[x][2] - 1; c.EdgeMult(f, c.moveCube[Oa], r); c.CornMult(f, c.moveCube[Oa], r); f.init(r.ca, r.ea) } if (99 == b) return null; a = []; for (x = 0; x < e.length; x++)Oa = e[x], 0 == b && 0 == x && (Oa = [Oa[0], Oa[1], (Oa[2] -
            z + 7) % 4]), a.push((x == b ? "`" : "") + "URFDLB".charAt(Oa[0]) + [null, "", "2", "'"][Oa[2]]); a = a.join(" "); b != e.length && (a += "`"); return a = kernel.getConjMoves(a, !0)
    } var z = [], r = null, b = null, e = null, a = new c; return {
        setScramble: function (c) { r = c; c = kernel.getConjMoves(c); c = kernel.parseScramble(c, "URFDLB"); z = c.slice(); e = b = null; a = new mathlib.CubieCube; for (var f = 0; f < c.length; f++) { var Oa = 3 * c[f][0] + c[f][2] - 1; 0 > Oa || 18 <= Oa || a.selfMoveStr("URFDLB".charAt(c[f][0]) + " 2'".charAt(c[f][2] - 1)) } }, getScrCubie: function () { return a }, checkScramble: function (b) {
            return "" ==
                r ? !1 : a.isEqual(b)
        }, checkState: function (Pa) {
            if (r && (DEBUG || GiikerCube.isConnected()) && "333" == tools.getCurPuzzle() && 0 == timer.getCurTime()) {
                var f = null, bb = null; b && (f = Oa(Pa, b, e)); if (null == f || -1 == f.indexOf("`")) bb = Oa(Pa, null, z), f = b = null; if (null == bb && null == f) { b = new c; b.init(Pa.ca, Pa.ea); f = new c; f.invFrom(Pa); var h = new c; c.EdgeMult(f, a, h); c.CornMult(f, a, h); e = scramble_333.genFacelet(h.toFaceCube()); e = kernel.parseScramble(e, "URFDLB"); f = Oa(Pa, b, e) } Pa = f ? r + "\n=> " + f : bb; kernel.pushSignal("scrfix", Pa + (-1 == Pa.indexOf("`") ?
                    ' <span style="color:green">✔</span>' : ""))
            }
        }
    }
}, [mathlib.CubieCube]), giikerutil = execMain(function (c) {
    function Oa() {
        "n" != kernel.getProp("giiVRC") && "g" == kernel.getProp("input") ? Xa.css("font-size", "") : Xa.css("font-size", "75%"); Xa.empty(); Xa.append($("<tr>").append($("<td colspan=2>").append(Va))); GiikerCube.isConnected() || DEBUG && gb ? (Xa.append($("<tr>").append(Ya, fb)).append($("<tr>").append($("<td colspan=2>").append(y.unbind("click").click(Pa)))).append($("<tr>").append($("<td>").append(db), $("<td>").append(mb))).append(lb),
            Va.html(gb).addClass("click").unbind("click").click(Wa), w()) : Va.html(TOOLS_GIIKER + "<br>" + GIIKER_CONNECT).addClass("click").unbind("click").click(Ta)
    } function z(a) { a && (a.empty().append(Xa), Oa()) } function r(a) { Sa = a[0]; Ya.html('<span style="font-family:iconfont;"></span> ' + (Sa || "??") + "%"); gb = a[1]; Va.html(gb) } function b() { GiikerCube.isConnected() ? (GiikerCube.getCube().getBatteryLevel().then(function (a) { r(a) }), n = setTimeout(b, 6E4)) : n = 0 } function e() {
        ab && (clearTimeout(ab), ab = 0); kernel.getProp("giiAED") &&
            (ab = setTimeout(function () {
                a: { var b = nb.slice(rb); if (1 != b.length % 2) { var e = []; e[b.length] = new c; for (var f = b.length - 1; 0 <= f; f--)e[f] = new c, c.CubeMult(c.moveCube[b[f][0]], e[f + 1], e[f]); for (f = 1; 3 > f; f++) { qb = 0; if (a(b, 0, f, new c, e)) { b = f; break a } if (9999 < qb) break } } b = 99 } 99 != b && (b = jb.toFaceCube(), 2 >= cubeutil.getProgress(b, "cfop") || (b = scramble_333.genFacelet(jb.toFaceCube()), 10 > b.length / 3 ? DEBUG && console.log("[giiker]", "Possible error, gen=" + b.replace(/ /g, "") + ", ignore") : (DEBUG && console.log("[giiker]", "Almost error, gen=" +
                    b.replace(/ /g, "") + ", mark solved"), Pa())))
            }, 1E3))
    } function a(b, e, f, n, h) { if (0 == f) return n.isEqual((new c).invFrom(h[e])); for (var w = new c; e < b.length - 1; e++) { if (~~(b[e][0] / 3) % 3 != ~~(b[e + 1][0] / 3) % 3) { var r = (new c).init(n.ca, n.ea); c.CubeMult(r, c.moveCube[b[e + 1][0]], w); c.CubeMult(w, c.moveCube[b[e][0]], r); c.CubeMult(r, h[e + 2], w); if (9999 < ++qb) break; if (w.edgeCycles() < f) var y = a(b, e + 2, f - 1, r, h); if (y) return !0 } c.CubeMult(n, c.moveCube[b[e][0]], w); n.init(w.ca, w.ea) } return !1 } function Pa() {
        kb.invFrom(ob); eb = mathlib.SOLVED_FACELET;
        kernel.setProp("giiSolved", hb); rb = nb.length; wb = 0; w(); Za(eb, ["U "], [null, $.now()])
    } function f(a, f, h, r) {
        var y = $.now(); h = h || [y, y]; gb != r && (gb = r, Oa()); hb = a; ob.fromFacelet(hb); c.EdgeMult(kb, ob, jb); c.CornMult(kb, ob, jb); eb = jb.toFaceCube(); 0 < f.length && (a = 3 * "URFDLB".indexOf(f[0][0]) + " 2'".indexOf(f[0][1]), nb.push([a, h[0], h[1]])); 0 < wb && Na(); 10 < nb.length && (50 < nb.length - rb && 0 < rb && nb[rb - 1][2] < timer.getStartTime() && (nb = nb.slice(rb), rb = 0), a = bb(nb, !0), fb.html('<span style="font-family:iconfont;"></span> ' + Math.round(1E5 *
            (a[0] - 1)) / 1E3 + "%")); eb == mathlib.SOLVED_FACELET && ($a(), rb = nb.length, wb = 0); w(); 0 == n && b(); e(); a = eb; zb && (c.EdgeMult(zb, jb, yb), c.CornMult(zb, jb, yb), a = yb.toFaceCube()); Za(a, f, h); scrHinter.checkState(jb)
    } function bb(a, b) { for (var c = 0, e = 0, f = 0, n = 0, h = 0, w = 0, r = 0; r < a.length; r++) { var y = a[r][b ? 2 : 1], x = a[r][b ? 1 : 2]; null != y && null != x && (w++, c += y, e += x, f += y * x, n += y * y, h += x * x) } h = w * h - e * e; n = w * n - c * c; r = w * f - c * e; f = .001 > n ? 1 : r / n; r = .001 > n || .001 > h ? 1 : Math.pow(r, 2) / n / h; return [f, 1 > w ? 0 : e / w - f * c / w, r, 3 > w || .001 > n ? 0 : Math.sqrt(h / n * (1 - r) / (w - 2))] }
    function h(a, b, c) { if (0 == a.length) return a; var e = bb(a), f = e[0]; e = e[1]; var n = Math.round(f * a[0][1] + e), h = Math.round(f * a[a.length - 1][1] + e); null == b || b > n ? b = n : null != c && c < h && (b -= Math.min(n - b, h - c)); for (c = 0; c < a.length; c++)a[c][1] = Math.round(f * a[c][1] + e) - b; return a } function Na() {
        for (var a = nb.length - rb, b = "", c = 0; c < wb; c++) { var e = nb[c + rb][0]; b += "URFDLB".charAt(~~(e / 3)) + " 2'".charAt(e % 3) } var f = "", n = []; for (c = wb; c < a; c++)n.push(nb[c + rb].slice()); n = h(n); for (c = 0; c < n.length; c++)e = n[c], f += "URFDLB".charAt(~~(e[0] / 3)) + " 2'".charAt(e[0] %
            3) + "/*" + e[1] + "*/"; Qa(db, "Raw (" + a + ")", b, f)
    } function Qa(a, b, c, e) { c || e ? a.attr("href", "https://alg.cubing.net/?alg=" + encodeURIComponent(e) + "&setup=" + encodeURIComponent(c)) : a.removeAttr("href"); a.html(b) } function x(a, b) { "disconnect" == a && (logohint.push("Bluetooth disconnected!"), Oa()) } function Ta() {
        Sa = n = 0; gb = null; hb = mathlib.SOLVED_FACELET; ob = new c; jb = new c; eb = hb; kb = new c; nb = []; rb = 0; fb.html('<span style="font-family:iconfont;"></span> 0%'); Qa(db, "Raw(N/A)"); Qa(mb, "Pretty(N/A)"); hb = kernel.getProp("giiSolved",
            mathlib.SOLVED_FACELET); ob.fromFacelet(hb); kb.invFrom(ob); GiikerCube.setCallback(f); GiikerCube.setEventCallback(x); return GiikerCube.isConnected() ? Promise.resolve() : GiikerCube.init().then(function () { logohint.push("Bluetooth successfully connected!") })
    } function Ua() { return GiikerCube.isConnected() ? GiikerCube.stop().then(function () { x("disconnect") }) : Promise.resolve() } function Wa() { GiikerCube.isConnected() && confirm("Disconnect?") && Ua() } function Ra(a, b) {
        if ("scrambling" == a) ub = ""; else if ("scramble" == a ||
            "scrambleX" == a) { var c = b[0]; ub = b[1]; "333" != tools.puzzleType(c) && (ub = ""); scrHinter.setScramble(ub); scrHinter.checkState(jb) } else "property" == a ? 0 <= ["giiVRC", "imgSize"].indexOf(b[0]) ? Oa() : /^(preScrT?|isTrainScr)$/.exec(b[0]) && (scrHinter.setScramble(ub), scrHinter.checkState(jb)) : "timestd" != a || b[4] || (vb = [timer.getStartTime(), b[0][1], b[1]], setTimeout($a, 0))
    } function $a() {
        if (vb) {
            var a = vb[0], b = nb.length, c = vb[2]; 0 < b && nb[b - 1][2] > vb[0] + vb[1] + 1E3 && (vb = null); for (var e = nb.length - 1; 0 <= e && !(nb[e][2] < a - 500); e--)b = e;
            if (b != nb.length) {
                a = new mathlib.CubieCube; var f = [], n = mathlib.CubieCube.rotMulI[0][kernel.getPreConj()]; for (e = b; e < nb.length; e++) { b = nb[e].slice(); var w = mathlib.CubieCube.rotMulM[n][b[0]]; b[0] = "URFDLB".charAt(~~(w / 3)) + " 2'".charAt(w % 3); f.push(b); a.selfMoveStr(b[0]) } f = h(f); e = cubeutil.moveSeq2str(f); kernel.pushSignal("giirecons", [c, [e, "333"]]); f = (c || "").split(" "); c = new mathlib.CubieCube; for (e = 0; e < f.length; e++)c.selfMoveStr(f[e]); e = new mathlib.CubieCube; e.invFrom(a); c.toFaceCube() == e.toFaceCube() && (DEBUG &&
                    console.log("[bluetooth] recons clear, cube solved"), vb = null)
            }
        }
    } var Va = $("<span></span>"), y = $("<span>" + GIIKER_RESET + "</span>").addClass("click"), db = $('<a target="_blank">Raw(N/A)</a>').addClass("click"), mb = $('<a target="_blank">Pretty(N/A)</a>').addClass("click"), cb = $("<canvas>").css({ display: "block", "box-sizing": "content-box", margin: "auto", padding: "5px" }), lb = $("<tr>").append($('<td colspan=2 style="padding:0;">').append(cb)), gb = null, Ya = $("<td>").html('<span style="font-family:iconfont;"></span> ??%'),
        fb = $("<td>").html('<span style="font-family:iconfont;"></span> 0%'), Xa = $('<table class="table">'), w = function () {
            var a = [], b, c = [[1, -.5, 1.5, 0, .5, 0], [.5, 0, 3, -.5, 1, 1.5], [1, 0, 0, 0, 1, 1.5], [1, .5, 5.5, 0, .5, 0], [-.5, 0, 7, -.5, -1, 4.5], [-1, 0, 10, 0, -1, 4.5]]; return function () {
                if (cb) if ("n" != kernel.getProp("giiVRC") && "g" == kernel.getProp("input")) lb.hide(); else {
                    a = kernel.getProp("colcube").match(/#[0-9a-fA-F]{3}/g); lb.show(); b = cb[0].getContext("2d"); var e = kernel.getProp("imgSize") / 60; cb.width(10 / 4.5 * 21 * e + "em"); cb.height(21 *
                        e + "em"); cb.attr("width", 300); cb.attr("height", 135); for (e = 0; 6 > e; e++) { for (var f = e, n = eb, h = c[f].slice(), w = 0; w < h.length; w++)h[w] *= 30; for (w = 0; 3 > w; w++)for (var r = 0; 3 > r; r++)$.ctxDrawPolygon(b, a["DLBURF".indexOf(n[3 * (3 * f + r) + w])], [[w, w, w + 1, w + 1], [r, r + 1, r + 1, r]], h) }
                }
            }
        }(), n = 0, Sa = 0, Za = $.noop, hb = mathlib.SOLVED_FACELET, ob = new c, jb = new c, eb = hb, kb = new c, ab = 0, qb = 0, nb = [], rb = 0, ub, vb = null, wb = 0, zb = null, yb = new c; $(function () {
            kernel.regListener("giiker", "scramble", Ra); kernel.regListener("giiker", "scrambling", Ra); kernel.regListener("giiker",
                "scrambleX", Ra); kernel.regListener("giiker", "timestd", Ra); kernel.regListener("giiker", "property", Ra, /^(?:giiVRC|imgSize|preScrT?|isTrainScr)$/); tools.regTool("giikerutil", TOOLS_GIIKER, z)
        }); return {
            setCallback: function (a) { Za = a }, markSolved: Pa, checkScramble: function () { return scrHinter.checkScramble(jb) }, markScrambled: function (a) {
                var b = jb; a && (b = scrHinter.getScrCubie()); b.isEqual(jb) || (DEBUG && console.log("[bluetooth] scramble equal, start hack!"), zb = new mathlib.CubieCube, yb.invFrom(jb), c.EdgeMult(b, yb,
                    zb), c.CornMult(b, yb, zb), rb = nb.length, Za(b.toFaceCube(), ["U "], [null, $.now()])); wb = nb.length - rb; Na(); Qa(mb, "Pretty(N/A)")
            }, init: Ta, stop: Ua, isSync: function () { return null == zb }, reSync: function () { zb && (zb = null, Za(eb, ["U "], [null, $.now()])) }, tsLinearFix: h, updateBattery: r, setLastSolve: function (a) { Qa(mb, "Pretty", kernel.getConjMoves(ub), a) }
        }
}, [mathlib.CubieCube]); var metronome = execMain(function () {
    function c(a) { return 99 < a ? a : " " + a } function Oa(a) {
        a ? (a.empty().append("BPM: ", h, Qa, "<br />").append("Vol: ", Na, x, "<br />", bb, "<br />").append("<br />", $("<label>").append(Wa, '<span class="click"> Beep at</span>'), "<br />", Ua), h.unbind().on("input", function () { $.waitUser.call(); f && (Qa.html(c(h.val())), r()) }), Na.unbind().on("input", function () { $.waitUser.call(); f && (x.html(c(Na.val())), Ta.gain.value = Na.val() / 100) }), bb.html(Ra ? "Stop!" : "Start!"), bb.unbind().click(function () {
            $.waitUser.call();
            Ra = !Ra; bb.html(Ra ? "Stop!" : "Start!"); r()
        }), z()) : (null != $a && (clearInterval($a), $a = null), Ra = !1)
    } function z() { Wa.unbind("change").change(e).prop("checked", kernel.getProp("beepEn")); Ua.unbind("change").change(e).val(kernel.getProp("beepAt")); e() } function r() { null != $a && (clearInterval($a), $a = null); if (Ra) { var a = 6E4 / ~~h.val(); $a = setInterval(b, a) } } function b(a) { if (f) { var b = f.createOscillator(); b.type = "sine"; b.frequency.value = a || 440; b.connect(Ta); b.start(f.currentTime); b.stop(f.currentTime + .1) } } function e(b) {
        b &&
        $.waitUser.call(); Wa.prop("checked") ? a(Ua.val()) : null != Va && (clearInterval(Va), Va = null); kernel.setProp("beepEn", Wa.prop("checked")); kernel.blur()
    } function a(a) { null != Va && (clearInterval(Va), Va = null); a = a.split(","); for (var b = 0; b < a.length; b++)a[b] = ~~(1E3 * a[b].trim()) / 1E3; a = a.filter(Number); a.sort(function (a, b) { return a - b }); y = a; Ua.val(a.join(",")); kernel.setProp("beepAt", a.join(",")); Va = setInterval(Pa, 100) } function Pa() {
        var a = ~~timer.getCurTime() / 1E3; if (0 == a) db = 0; else {
            for (var c = !1; db < y.length && a > y[db] -
                .05;)++db, c = !0; c && b(550)
        }
    } var f, bb = $('<span style="display:inline-block; text-align:center; width:100%;"/>').addClass("click"), h = $('<input type="range" value="60" min="10" max="360" style="width:7em;" />'), Na = $('<input type="range" value="30" min="0" max="100" style="width:7em;" />'), Qa = $("<span />").html(" 60"), x = $("<span />").html(" 30"), Ta, Ua = $('<input type="text" style="width:7em;" />'), Wa = $('<input type="checkbox" />'), Ra = !1, $a = null, Va = null, y = [], db = 0; $(function () {
        kernel.regProp("tools", "beepEn",
            -6, "Beep Enable", [!1]); kernel.regProp("tools", "beepAt", -6, "Beep At", ["5,10,15,20"]); var a = window.AudioContext || window.webkitAudioContext; void 0 !== a && ($.waitUser.reg(function () { f = new a; Ta = f.createGain(); Ta.gain.value = .3; Ta.connect(f.destination) }), tools.regTool("mtrnm", TOOLS_METRONOME, Oa)); z()
    }); return { playTick: b }
}); var onlinecomp = execMain(function () {
    function c(a, b) { for (; lb.length > b;)lb.pop().remove(); var e = a; if (-1 != gb.indexOf(e)) e = null; else { var f = []; e += "|"; for (var n = e.length, h = $('<select style="max-width: unset;">'), w = 0; w < gb.length; w++)if (gb[w].startsWith(e)) { var r = gb[w].slice(n).split("|", 1)[0]; -1 == f.indexOf(r) && (f.push(r), h.append($("<option>").val(r).html(r))) } e = 0 == f.length ? null : h.change(Oa) } e && (lb[b] = e, $a.append(lb[b]), c(a + "|" + lb[b].val(), b + 1)) } function Oa(a) {
        a = $(a.target).prevAll("select").length; for (var b =
            "", e = 0; e <= a; e++)b = b + "|" + lb[e].val(); c(b, a + 1); f(); b == "|" + OLCOMP_UPDATELIST + "..." && z()
    } function z() { Ra.val("..."); $.post("https://cstimer.net/comp.php", { action: "list" }, function (a) { gb = []; a = JSON.parse(a).data; for (var b = 0; b < a.length; b++) { var e = a[b].fullname; Ya[e] = a[b].name; for (var n = JSON.parse(a[b].value), h = 0; h < n.length; h++)gb.push("|" + e + "|" + n[h]) } gb.push("|" + OLCOMP_UPDATELIST + "..."); Ya[OLCOMP_UPDATELIST + "..."] = "update"; c("", 0); f(); Ra.hide() }).error(function () { logohint.push("Network Error"); Ra.val(OLCOMP_UPDATELIST) }) }
    function r() { for (var a = "", b = 0; b < lb.length; b++)a += "|" + lb[b].val(); if (-1 == gb.indexOf(a)) alert("Invalid Input"); else return b = a.slice(1).split("|", 1)[0], a = a.slice(b.length + 2), b = Ya[b], [b, a] } function b() {
        var a = r(); $.post("https://cstimer.net/comp.php", { action: "scramble", comp: a[0], path: a[1] }, function (a) {
            a = JSON.parse(a); 0 == a.retcode && a.data ? (n = a = a.data, Sa = $.map(a, function (a) { return (a = /^\$T([a-zA-Z0-9]+)\$\s*(.*)$/.exec(a)) ? scramble.getTypeName(a[1]) : "???" }), f(!0), kernel.setProp("scrType", "remoteComp")) :
                logohint.push(a.reason || "Server Error")
        }).error(function () { logohint.push("Network Error") })
    } function e() { var b = prompt(OLCOMP_SUBMITAS, exportFunc.getDataId("locData", "compid")); if (null == b) return !1; if (!exportFunc.isValidId(b)) return alert(EXPORT_INVID), !1; localStorage.locData = JSON.stringify({ id: exportFunc.getDataId("locData", "id"), compid: b }); a(); return b } function a() {
        Ta.empty().append("ID: "); Ua.empty(); Wa.empty(); if (exportFunc.getDataId("wcaData", "cstimer_token")) {
            var b = exportFunc.getDataId("wcaData",
                "wca_me").wca_id; Ua.append(b || "WCA Account", " (WCA)").click(function () { exportFunc.logoutFromWCA(!0); a() }); Ta.append(Ua)
        } else Ua.append(EXPORT_LOGINWCA), Ua.click(function () { location.href = exportFunc.wcaLoginUrl }), (b = exportFunc.getDataId("locData", "compid")) ? Wa.append(b + " (" + OLCOMP_ANONYM + ")") : Wa.append("N/A (" + OLCOMP_ANONYM + ")"), Ta.append(Wa.unbind("click").click(e), " | ", Ua)
    } function Pa(b, e) {
        !b || fb ? fb = !!b : (b.empty().append($('<div style="font-size: 0.75em; text-align: center;">').append(Ta, Ra, $a).append(Va).append(y,
            " ", db, " ").append($("<label>").append(cb, OLCOMP_WITHANONYM), " ", mb)), c("", 0), a(), f(), fb = !0)
    } function f(a, b) { Xa = []; a || (n = [], Sa = []); b || (w = !1); bb() } function bb() {
        y.unbind("click"); db.unbind("click"); mb.unbind("click").click(Qa); if (2 > lb.length) y.attr("disabled", !0).val(OLCOMP_START), db.attr("disabled", !0); else {
            Va.empty(); if (0 == Sa.length) lb[0].val().startsWith("*") || lb[0].val().startsWith("+") || w ? w ? y.attr("disabled", !0).val(OLCOMP_SUBMIT) : y.attr("disabled", !0).val(OLCOMP_START) : y.removeAttr("disabled").val(OLCOMP_START).click(b);
            else { for (var a = 0; a < Sa.length; a++)/^\$T([a-zA-Z0-9]+)\$\s*(.*)$/.exec(Sa[a]), Va.append(a + 1 + ". " + (Xa[a] ? stats.pretty(Xa[a][0]) : Sa[a]), "<br>"); Xa.length != Sa.length || w ? y.attr("disabled", !0) : (y.removeAttr("disabled"), y.val(OLCOMP_SUBMIT).click(h)) } db.removeAttr("disabled").click(Na)
        } kernel.blur()
    } function h() {
        if (!w) {
            var a = exportFunc.getDataId("wcaData", "cstimer_token") || exportFunc.getDataId("locData", "compid") || e(); if (a) {
                var b = r(); $.post("https://cstimer.net/comp.php", {
                    action: "submit", comp: b[0], path: b[1],
                    uid: a, value: JSON.stringify(Xa)
                }, function (a) { '{"retcode":0}' == a ? (w = !0, logohint.push("Submitted")) : logohint.push("Network Error"); bb() }).error(function () { logohint.push("Network Error") })
            }
        }
    } function Na() {
        if (0 == Xa.length || w || confirm(OLCOMP_ABORT)) {
            f(!1, !0); var a = r(), b = cb.prop("checked") ? 1 : 0; $.post("https://cstimer.net/comp.php", { action: "result", comp: a[0], path: a[1], anonym: b }, function (a) {
                try { a = JSON.parse(a) } catch (zb) { a = {} } if (0 !== a.retcode) logohint.push("Server Error"); else {
                    var b = $.sha256("cstimer_public_salt_" +
                        exportFunc.getDataId("locData", "compid")), c = (exportFunc.getDataId("wcaData", "wca_me") || {}).wca_id, e = a.scramble; a = $.map(a.data, function (a) { var b = JSON.parse(a.value); if (5 == b.length) { var c = new TimeStat([5], b.length, function (a) { return -1 == b[a][0][0] ? -1 : b[a][0][0] + b[a][0][1] }); c.getAllStats(); return { uid: a.uid, wca_id: a.wca_id, value: b, ao5: c.lastAvg[0][0], bo5: c.bestTime } } }); a.sort(function (a, b) { var c = TimeStat.dnfsort(a.ao5, b.ao5); return 0 == c ? TimeStat.dnfsort(a.bo5, b.bo5) : c }); for (var f = ['<table class="table"><tr><th></th><th>User</th><th>ao5</th><th>bo5</th><th>Results</th></tr>'],
                            n = 0; n < a.length; n++) {
                                var h = a[n].uid, w = a[n].value, r = a[n].ao5, y = a[n].bo5, x = a[n].wca_id; f.push("<tr><td>" + (n + 1) + "</td>"); void 0 !== x ? (h = x ? '<a target="_blank" href="https://www.worldcubeassociation.org/persons/' + x + '">' + x + "</a>" : OLCOMP_WCAACCOUNT, f.push(x == c ? "<th>" + OLCOMP_ME + ":" + h + "</th><td>" : "<td>" + h + "</td><td>")) : f.push(h == b ? "<th>" + OLCOMP_ME + "</th><td>" : "<td>" + OLCOMP_ANONYM + "</td><td>"); f.push(kernel.pretty(r) + "</td><td>" + kernel.pretty(y) + "</td><td>"); for (h = 0; h < w.length; h++)4 < w[h].length ? (w[h][1] = scramble.scrStd("",
                                    e[h] || "")[1], f.push('<a target="_blank" class="click" href="' + stats.getReviewUrl(w[h]) + '">' + stats.pretty(w[h][0]) + "</a> ")) : f.push(stats.pretty(w[h][0]) + " "); f.push("</td>"); f.push("</tr>")
                    } f.push("</table>"); Va.empty().html(f.join(""))
                }
            }).error(function () { logohint.push("Network Error") })
        }
    } function Qa() {
        if (0 == Xa.length || w || confirm(OLCOMP_ABORT)) {
            f(!1, !0); var a = exportFunc.getDataId("wcaData", "cstimer_token") || exportFunc.getDataId("locData", "compid") || e(); a && $.post("https://cstimer.net/comp.php", {
                action: "myresult",
                uid: a
            }, function (a) {
                try { a = JSON.parse(a) } catch (ab) { a = {} } if (0 !== a.retcode) logohint.push("Server Error"); else {
                    a = a.data; for (var b = ['<table class="table"><tr><th></th><th>Comp.</th><th>ao5</th><th>bo5</th><th>Results</th></tr>'], c = 0; c < a.length; c++) {
                        var e = JSON.parse(a[c].value); if (5 != e.length) return; var f = new TimeStat([5], e.length, function (a) { return -1 == e[a][0][0] ? -1 : e[a][0][0] + e[a][0][1] }); f.getAllStats(); b.push("<tr><td>" + (c + 1) + "</td>"); b.push("<td>" + a[c].fullname + "|" + a[c].path + "</td>"); b.push("<td>" + kernel.pretty(f.lastAvg[0][0]) +
                            "</td>"); b.push("<td>" + kernel.pretty(f.bestTime) + "</td><td>"); for (f = 0; f < e.length; f++)4 < e[f].length ? (e[f][1] = scramble.scrStd("", JSON.parse(a[c].scramble)[f] || "")[1], b.push('<a target="_blank" class="click" href="' + stats.getReviewUrl(e[f]) + '">' + stats.pretty(e[f][0]) + "</a> ")) : b.push(stats.pretty(e[f][0]) + " "); b.push("</td>"); b.push("</tr>")
                    } b.push("</table>"); Va.empty().html(b.join(""))
                }
            }).error(function () { logohint.push("Network Error") })
        }
    } function x(b, c) {
        if (fb) if ("export" == b) a(); else {
            c = JSON.parse(JSON.stringify(c));
            var e = c[1]; c[1] = ""; c[2] = ""; if ("timestd" == b) for (var f = Xa.length; f < n.length; f++) { var h = scramble.scrStd("", n[f])[1]; if (h != e) c[0] = [-1, 1], Xa.push(c); else { Xa.push(c); break } } else if ("timepnt" == b) for (f = 0; f < Xa.length; f++)if (h = scramble.scrStd("", n[f])[1], h == e) { Xa[f] = c; break } bb()
        }
    } var Ta = $("<div>"), Ua = $('<span class="click">'), Wa = $('<span class="click">'), Ra = $('<input type="button">').val(OLCOMP_UPDATELIST).click(z), $a = $("<div>"), Va = $('<div class="noScrollBar" style="max-height: 8em; overflow-y: auto;">'), y =
        $('<input type="button">'), db = $('<input type="button">').val(OLCOMP_VIEWRESULT), mb = $('<input type="button">').val(OLCOMP_VIEWMYRESULT), cb = $('<input type="checkbox">'), lb = [], gb = [], Ya = {}, fb = !1, Xa = [], w = !1, n = [], Sa = []; $(function () { tools.regTool("onlinecomp", OLCOMP_OLCOMP, Pa); kernel.regListener("onlinecomp", "timestd", x); kernel.regListener("onlinecomp", "timepnt", x); kernel.regListener("onlinecomp", "export", x, /^account$/) }); return { getScrambles: function () { return 0 == Xa.length ? Promise.resolve(n.slice()) : Promise.reject() } }
}); var battle = execMain(function () {
    function c(a) { Va && y && Ra.isConnected() && (!a && $a && (clearTimeout($a), $a = 0), a && Ra.pushMsg({ action: "heartBeat", roomId: Va, accountId: y }), $a = setTimeout(c.bind(null, !0), 15E3)) } function Oa(a) {
        if (a || !Va) { a = prompt(TOOLS_BATTLE_JOINALERT + " [a-zA-Z0-9]", Va || 100 + ~~(900 * Math.random())); if (!/^[0-9a-zA-Z]{3,20}$/.exec(a)) { alert("invalid room ID"); return } Va = a } Ra.isConnected() ? r() && Va && Ra.remoteCall({ action: "joinRoom", roomId: Va, accountId: y, scramble: scramble_333.getRandomScramble().trim() }).then(function (a) {
            DEBUG &&
            console.log("[battle] joinRoom ret=", JSON.stringify(a)); c()
        }) : Ra.connect().then(Oa.bind(null, !1))
    } function z(b) { r(!0) && Va && (b || confirm(TOOLS_BATTLE_LEAVEALERT + "?")) && (Ra.remoteCall({ action: "leaveRoom", roomId: Va, accountId: y }).then(Ra.close, Ra.close), db = null, a(), c()) } function r(a) { return !db && a || !Ra.isConnected() ? y = null : y = exportFunc.getDataId("wcaData", "cstimer_token") || exportFunc.getDataId("locData", "compid") || f() } function b(a) {
        r(!0) && Va && Ra.remoteCall({ action: "updateStatus", roomId: Va, accountId: y, status: a }).then(function (a) {
            DEBUG &&
            console.log("[battle] update status ret=", a); c()
        })
    } function e(a, b) { if (r(!0) && Va) { var e = a[1]; if (e == db.cur[1] || e == db.last[1]) if (!mb || mb[1] != a[1] || b && a[0][1] == mb[0][1]) mb = a, Ra.remoteCall({ action: "uploadSolve", roomId: Va, accountId: y, solveId: e == db.cur[1] ? db.cur[0] : db.last[0], time: a, scramble: scramble_333.getRandomScramble().trim() }).then(function (a) { DEBUG && console.log("[battle] upload solve ret=", a); c() }) } } function a() {
        DEBUG && console.log("[battle] render room", db); db ? Na.hide() : Na.show(); cb.empty(); var a =
            TOOLS_BATTLE_TITLE.split("|").slice(0, 3); a.splice(1, 0, "ELO"); cb.append($("<tr>").append($("<td colspan=5>").append(Ta[0] + ": ", Ua, "&nbsp;", Wa))); cb.append("<tr><td colspan=2>" + a.join("</td><td>") + "</td></tr>"); Ua.unbind("click"); Wa.unbind("click"); if (db) {
                Ua.removeClass("click").html(db.roomId); Wa.click(z.bind(null, !1)).show(); a = db.players; for (var b = db.solves, c = {}, e = !1, f = ("???|" + TOOLS_BATTLE_STATUS).split("|"), h = 0; h < b.length; h++) {
                    var r = b[h], y = r.accountId; c[y] = c[y] || {}; c[y][r.solveId] = [r.time, r.soltime];
                    r.solveId == db.cur[0] && (e = !0)
                } a.sort(function (a, b) { return b.elo - a.elo }); b = db.cur[0]; for (h = 0; h < a.length; h++) {
                    r = a[h]; y = r.accountId; -1 != y.indexOf("|") ? y = "<b>" + y.split("|")[1] + "</b>" : 10 < y.length && (y = y.slice(0, 4) + "..." + y.slice(y.length - 3)); var x = (c[r.accountId] || {})[b], Qa = "SOLVED" == r.status, Pa = (c[r.accountId] || {})[b - 1]; Pa = (Pa = Qa ? x : Pa) ? stats.pretty(Pa[0], !0) : "N/A"; e && !Qa && (Pa = '<span style="color:#888">' + Pa + "</span>"); cb.append("<tr><td>" + (h + 1) + "</td><td>" + y + "</td><td>" + r.elo + "</td><td>" + f[["READY", "INSPECT",
                        "SOLVING", "SOLVED", "LOSS"].indexOf(r.status) + 1] + "</td><td>" + Pa + "</td></tr>")
                }
            } else cb.append('<tr><td colspan=5 style="width:0;">' + TOOLS_BATTLE_INFO + "</td></tr>"), Ua.addClass("click").html(Ta[1]).click(Oa.bind(null, !0)), Wa.hide()
    } function Pa() {
        Na.empty().append("ID: "); Qa.empty(); x.empty(); if (exportFunc.getDataId("wcaData", "cstimer_token")) { var a = exportFunc.getDataId("wcaData", "wca_me").wca_id; Qa.append(a || "WCA Account", " (WCA)").click(function () { exportFunc.logoutFromWCA(!0); Pa() }); Na.append(Qa) } else Qa.append(EXPORT_LOGINWCA),
            Qa.click(function () { location.href = exportFunc.wcaLoginUrl }), a = exportFunc.getDataId("locData", "compid"), x.append((a || "N/A") + " (" + OLCOMP_ANONYM + ")"), Na.append(x.unbind("click").click(f), " | ", Qa)
    } function f() { var a = prompt(OLCOMP_SUBMITAS, exportFunc.getDataId("locData", "compid")); if (null == a) return !1; if (!exportFunc.isValidId(a)) return alert(EXPORT_INVID), !1; localStorage.locData = JSON.stringify({ id: exportFunc.getDataId("locData", "id"), compid: a }); Pa(); return a } function bb(b, c) {
        !b || lb ? (lb = !!b, b || Ra.close()) :
        (b.empty().append($('<div style="font-size: 0.75em; text-align: center;">').append(Na, cb)), Pa(), a(), lb = !0)
    } function h(a, c) { if (lb) if ("export" == a) Pa(); else if ("timerStatus" == a) { var f = "READY"; 0 < c ? f = "SOLVING" : -2 > c && (f = "INSPECT"); f != gb && (gb = f, b(f)) } else c = JSON.parse(JSON.stringify(c)), "timestd" == a ? e(c, !1) : "timepnt" == a && e(c, !0) } var Na = $("<div>"), Qa = $('<span class="click">'), x = $('<span class="click">'), Ta = TOOLS_BATTLE_HEAD.split("|"), Ua = $('<span class="click">').html(Ta[1]), Wa = $('<span class="click">').html("[X]"),
        Ra = function () {
            function a(a) { for (h = !0; 0 < Na.length;)Na.pop()() } function b(a) { h = !1; x && x("close") } function c(a) { h = !1; x && x("error") } function e(a) { a = JSON.parse(a.data); var b = a.msgid; if (b in y) { var c = y[b]; delete y[b]; c(a) } else x && x("msg", a) } var f, h = !1, r = 1, y = [], x = null, Na = []; return {
                connect: function () { return h ? Promise.resolve() : new Promise(function (n, h) { Na.push(n); f = new WebSocket("wss://cstimer.net/ws20230409"); f.onopen = a; f.onclose = b; f.onerror = c; f.onmessage = e }) }, close: function () {
                    if (!h) return -1; f.close(); h =
                        !1; return 0
                }, isConnected: function () { return h }, setCallback: function (a) { x = a }, pushMsg: function (a) { if (!h) return -1; f.send(JSON.stringify(a)); return 0 }, remoteCall: function (a) { return new Promise(function (b, c) { h ? (a.msgid = r, y[r] = b, r++, f.send(JSON.stringify(a)), setTimeout(function (a) { a(-2) }.bind(null, c), 5E3)) : c(-1) }) }
            }
        }(), $a = 0, Va, y, db, mb = [[-1, 1], null]; Ra.setCallback(function (b, c) {
            "msg" == b ? "roomInfo" in c && (db = c.roomInfo, db && db.cur[1] && db.cur[1] != mb[1] && (Ya && Ya(["$T333$" + db.cur[1]]), Ya = null, "remoteBattle" != kernel.getProp("scrType") &&
                kernel.setProp("scrType", "remoteBattle"))) : (db = null, "remoteBattle" == kernel.getProp("scrType") && kernel.pushSignal("ctrl", ["scramble", "next"])); a()
        }); var cb, lb = !1, gb = "READY", Ya; $(function () { cb = $('<table class="table">'); tools.regTool("battle", TOOLS_BATTLE, bb); kernel.regListener("battle", "timestd", h); kernel.regListener("battle", "timepnt", h); kernel.regListener("battle", "timerStatus", h); kernel.regListener("battle", "export", h, /^account$/) }); return {
            getScrambles: function () {
                return db ? db.cur[1] && db.cur[1] !=
                    mb[1] ? Promise.resolve(["$T333$" + db.cur[1]]) : new Promise(function (a, b) { Ya = a }) : Promise.reject()
            }
        }
}); execMain(function () {
    function c() { var a = prompt(TOOLS_SYNCSEED_INPUTA); kernel.blur(); null != a && (/^[a-zA-Z0-9]+$/.exec(a) ? Oa(a) : logohint.push("Invalid Value")) } function Oa(b) { h = !0; Na = Na || mathlib.getSeed(); mathlib.setSeed(0, "syncseed" + b); scramble.setCacheEnable(!1); a.html(b).addClass("click"); kernel.pushSignal("ctrl", ["scramble", "next"]) } function z() {
        h && confirm(TOOLS_SYNCSEED_DISABLE) && (h && (h = !1, mathlib.setSeed(0, Na[1] + "" + Na[0]), Na = void 0, scramble.setCacheEnable(!0), kernel.pushSignal("ctrl", ["scramble",
            "next"])), a.html("N/A").unbind("click").removeClass("click"))
    } function r() { Oa("" + ~~((new Date).getTime() / 1E3 / 30)); kernel.blur() } function b() { alert(TOOLS_SYNCSEED_HELP) } function e(e) { e && e.empty().append(TOOLS_SYNCSEED_SEED, Pa.unbind("click").click(b), ": ", a.unbind("click").click(z)).append("<br><br>", f.unbind("click").click(c)).append("<br>", bb.unbind("click").click(r)) } var a = $("<span>").html("N/A"), Pa = $('<span class="click">').html("[?]"), f = $('<input type="button">').val(TOOLS_SYNCSEED_INPUT), bb =
        $('<input type="button">').val(TOOLS_SYNCSEED_30S), h = !1, Na; $(function () { tools.regTool("syncseed", TOOLS_SYNCSEED, e) })
}); var bldhelper = execMain(function () {
    function c(a, b) { if (void 0 == b) { for (var e = [], f = 0; f < a; f++) { var n = c(a, f + 1); e.push.apply(e, n) } return e } if (a < b || 1 > a || 1 > b) return []; if (a == b) return [mathlib.valuedArray(a, 1)]; e = c(a - 1, b - 1); for (f = 0; f < e.length; f++)e[f].push(1); var h = c(a - b, b); for (f = 0; f < h.length; f++) { n = h[f]; for (var w = 0; w < n.length; w++)n[w]++ } return e.concat(h) } function Oa(a, b, c, e, f, h, w, r, y) {
        for (var n = 0, x = 0, Na = 0, z = 0; z < r.length; z++)1 == r[z] ? x++ : (Na += r[z], n++); y && 3 == (a & 3) && (a &= -3); var Sa = 0, Oa = null; for (z = 0; 3 > z; z++)if (0 !=
            (a >> z & 1)) {
                var Qa = n - (z >> 1), Pa = Na + n - 2 * (z >> 1); if (!(Qa < f[0] || Qa > f[1] || Pa < h[0] || Pa > h[1])) {
                    Pa = 1 == z ? 1 : 0; var Ra = c + Pa; Qa = b + c + (2 > z ? 1 : 0); if (!(x < Math.max(Qa, e[0] + Pa) || c > e[1])) {
                        var Va = x - Qa, Ta = 0, Ua = null, Xa = 0; for (Pa = Math.max(e[0] - c, 0); Pa <= Math.min(e[1] - c, Va); Pa++) {
                            var Wa = n + x; var Za = w, ab = x - Ra - Pa, $a = Ra + Pa; if (ab + $a > Wa) Wa = [0, null]; else {
                                for (var Ya = 0, eb = [], cb = ab; cb < Wa - 1; cb++) { var bb = cb < ab + $a ? 1 : 0; bb = mathlib.rn(Za - bb) + bb; eb.push(bb); Ya += bb } if (ab + $a < Wa) eb.push((Za * Wa - Ya) % Za), Wa = [Math.pow(Za - 1, $a) * Math.pow(Za, Wa - ab - $a - 1),
                                mathlib.valuedArray(ab, 0).concat(eb)]; else { var db = mathlib.valuedArray(Za, 0); db[0] = 1; for (cb = 0; cb < $a; cb++) { bb = mathlib.valuedArray(Za, 0); for (var kb = 1; kb < Za; kb++)for (var jb = 0; jb < Za; jb++)bb[(kb + jb) % Za] += db[jb]; db = bb } if (0 == db[0]) Wa = [0, null]; else { for (Ya = (Za * Wa - Ya) % Za; 0 == Ya && 0 < $a;) { Ya = 0; eb = []; for (cb = ab; cb < Wa - 1; cb++)bb = cb < ab + $a ? 1 : 0, bb = mathlib.rn(Za - bb) + bb, eb.push(bb), Ya += bb; Ya = (Za * Wa - Ya) % Za } eb.push(Ya); Wa = [db[0], mathlib.valuedArray(ab, 0).concat(eb)] } }
                            } ab = Wa[0] * mathlib.Cnk[Va][Pa]; Ta += ab; mathlib.rndHit(ab /
                                Ta) && (Ua = Wa[1], Xa = Pa)
                        } if (0 != Ta || y) {
                            Ta *= Math.pow(w, Na - n); Ra = r.slice(0, r.length - Qa); Pa = x + Na - Qa; for (Wa = 1; 0 < Ra.length;) { Za = Ra.pop(); ab = 1; Wa *= mathlib.Cnk[Pa][Za] * mathlib.fact[Za - 1]; for (Pa -= Za; Ra[Ra.length - 1] == Za;)Ra.pop(), ab++, Wa *= mathlib.Cnk[Pa][Za] * mathlib.fact[Za - 1], Wa /= ab, Pa -= Za; 1 == Za && 2 == z && (Wa *= Na, Wa /= x + Na - Qa) } Pa = (y ? 1 : Ta) * Wa; Sa += Pa; if (mathlib.rndHit(Pa / Sa)) {
                                Ta = []; for (Pa = 0; Pa < n; Pa++) { Oa = Ua.pop(); Za = r[Pa]; for (ab = 0; ab < Za - 1; ab++)Wa = mathlib.rn(w), Ta.push(Wa), Oa += w - Wa; Ta.push(Oa % w) } Oa = mathlib.rndPerm(Va);
                                for (Pa = 0; Pa < Oa.length; Pa++)Oa[Pa] < Xa ? Ta.push(Ua.pop()) : Ta.push(Ua.shift()); 2 > z ? (Ta.unshift(0 == z ? Ua.shift() : Ua.pop()), Ta.splice.apply(Ta, [1, 0].concat(Ua))) : Ta.splice.apply(Ta, [0, 0].concat(Ua)); Ra = r.slice(0, r.length - Qa); Oa = []; Ua = [0]; ab = 2 == z ? 1 : 0; 0 == ab && (Oa[0] = [0, Ta.shift()]); for (Pa = 1; Pa < Na + x; Pa++)Pa >= 1 + b + c ? (Ua[ab] = Pa, ab++) : Oa[Pa] = [Pa, Ta.shift()]; Pa = x + Na - Qa; Qa = mathlib.rndPerm(Pa); 2 == z && Qa.indexOf(0) >= Na && (Pa = (Qa.indexOf(0) - mathlib.rn(Na) + Pa) % Pa, Qa = Qa.slice(Pa).concat(Qa.slice(0, Pa))); Xa = []; for (Pa = 0; Pa <
                                    Ra.length; Pa++)for (Wa = Qa.slice(0, Ra[Pa]), Xa.push(Wa), Qa = Qa.slice(Ra[Pa]), Va = 0; Va < Wa.length; Va++)Oa[Ua[Wa[Va]]] = [Ua[Wa[(Va + 1) % Wa.length]], Ta.shift()]
                            }
                        }
                    }
                }
        } return [Sa, Oa]
    } function z(a) { for (var b = 0, c = 0; c < a.length; c++)b ^= a[c] + 1; return b & 1 } function r(a, b) {
        for (var e = a.cfix.split(" "), f = [], n = [], w = /^(UFR|UFL|UBL|UBR|DFR|DFL|DBL|DBR)(\+?)$/i, r = h.split(" "), y = 0; y < e.length; y++) { var x = w.exec(e[y]); x && x[1] != r[a.cbuff[0] % 8] && (x[2] ? n.push(r.indexOf(x[1])) : f.push(r.indexOf(x[1]))) } var Na = a.efix.split(" "); e = []; var Sa =
            []; w = /^(UR|UF|UL|UB|DR|DF|DL|DB|FR|FL|BL|BR)(\+?)$/i; for (y = 0; y < Na.length; y++)(x = w.exec(Na[y])) && x[1] != r[a.ebuff[0] % 12 + 8] && (x[2] ? Sa.push(r.indexOf(x[1]) - 8) : e.push(r.indexOf(x[1]) - 8)); Na = a.ceparity; r = [0, 0]; x = [null, null]; var Qa = c(8); for (y = 0; y < Qa.length; y++) { var Pa = z(Qa[y]); 0 != (Na >> Pa & 1) && (w = Oa(a.cbuff[1], f.length, n.length, a.cnerrLR, a.cscycLR, a.cncodeLR, 3, Qa[y]), r[Pa] += w[0], mathlib.rndHit(w[0] / r[Pa]) && (x[Pa] = w[1])) } Qa = [0, 0]; var Ra = [null, null], Va = c(12); for (y = 0; y < Va.length; y++)Pa = z(Va[y]), 0 != (Na >> Pa & 1) &&
                (w = Oa(a.ebuff[1], e.length, Sa.length, a.enerrLR, a.escycLR, a.encodeLR, 2, Va[y]), Qa[Pa] += w[0], mathlib.rndHit(w[0] / Qa[Pa]) && (Ra[Pa] = w[1])); y = r[0] * Qa[0] + r[1] * Qa[1]; w = [y, x[1], Ra[1]]; mathlib.rndHit(r[0] * Qa[0] / y) && (w = [y, x[0], Ra[0]]); if (!b) return w; if (0 == w[0]) return "N/A"; r = [a.cbuff[0] % 8].concat(f, n); e = [a.ebuff[0] % 12].concat(e, Sa); for (y = 0; 8 > y; y++)-1 == r.indexOf(y) && r.push(y); for (y = 0; 12 > y; y++)-1 == e.indexOf(y) && e.push(y); f = []; n = []; for (y = 0; 8 > y; y++)f[r[y]] = r[w[1][y][0]] | w[1][y][1] << 3; for (y = 0; 12 > y; y++)n[e[y]] = e[w[2][y][0]] <<
                    1 | w[2][y][1]; Sa = new mathlib.CubieCube; y = mathlib.rndEl(" Rw Rw2 Rw' Fw Fw'".split(" ")); e = mathlib.rndEl(["", "Uw", "Uw2", "Uw'"]); w = Sa.selfMoveStr(y); r = Sa.selfMoveStr(e); Sa.init(f, n); Sa.ori = 0; if (Sa.isEqual()) return "U U'"; null != r && Sa.selfMoveStr("URFDLB".charAt(~~(r / 3)) + " 2'".charAt(r % 3), !0); null != w && Sa.selfMoveStr("URFDLB".charAt(~~(w / 3)) + " 2'".charAt(w % 3), !0); f = Sa.toFaceCube(); return (scramble_333.genFacelet(f) + " " + y + " " + e).replace(/ +/g, " ") || "U U'"
    } function b(b) {
        var c = $(b.target); if (b = c.attr("id")) {
            if (/^[ce]buff[01]$/.exec(b)) Na[b.slice(0,
                5)][~~b[5]] = ~~c.val(), f(); else if (b.endsWith("LR")) { var e = /^(\d{1,2})-(\d{1,2})$/.exec(c.val()) || /^((\d{1,2}))$/.exec(c.val()); if (!e) return; var n = ~~e[1]; e = ~~e[2]; Na[b] = [Math.min(n, e), Math.max(n, e)] } else if ("ceparity" == b) Na[b] = ~~c.val(); else if (b.endsWith("fix")) {
                    var r = c.val().toUpperCase().split(" "); c = {}; for (var y = "cfix" == b ? /^(UFR|UFL|UBL|UBR|DFR|DFL|DBL|DBR)(\+?)$/ : /^(UR|UF|UL|UB|DR|DF|DL|DB|FR|FL|BL|BR)(\+?)$/, x = 0; x < r.length; x++)(e = y.exec(r[x])) && (c[e[1]] = e[2]); e = []; for (n in c) e.push(n + c[n]); Na[b] =
                        e.join(" ")
                } else if ("bldsClr" == b || "bldsEg" == b) for (e in n = { cnerrLR: [0, 7], cscycLR: [0, 3], cncodeLR: [0, 10], enerrLR: [0, 11], escycLR: [0, 5], encodeLR: [0, 16] }, "bldsClr" == b ? (n.cfix = "", n.efix = "", n.ceparity = 3) : (n.cfix = "UBL DFR+", n.efix = "DR DF+", n.ceparity = 1), n) Na[e] = n[e]; else if ("bldsEdge" == b || "bldsCorn" == b) e = ~~c.val(), b = "bldsEdge" == b ? "e" : "c", Na[b + "fix"] = "", Na[b + "scycLR"] = "e" == b ? [0, 5] : [0, 3], 1 == e ? (Na[b + "buff"] = [Na[b + "buff"][0], 1], Na[b + "nerrLR"] = [0, 0], Na[b + "ncodeLR"] = [0, 0]) : 2 == e && (Na[b + "buff"] = [Na[b + "buff"][0], 7],
                    Na[b + "nerrLR"] = "e" == b ? [0, 11] : [0, 7], Na[b + "ncodeLR"] = "e" == b ? [0, 16] : [0, 10]); else if ("scheme" == b) { e = c.val(); if ("speffz" == e) Na.scheme = "CJM DIF ARE BQN VKP ULG XSH WTO BM CI DE AQ VO UK XG WS JP LF RH TN"; else if ("chichu" == e) Na.scheme = "JLK ABC DFE GHI XYZ WNM OPQ RTS GH AB CD EF OP IJ KL MN QR ST WX YZ"; else if ("custom" == e || "customed" == e) { b = prompt("Code for " + h, Na.scheme); if (!b) { Pa(); return } if (!/^([^\s]{3} ){8}([^\s]{2} ){11}[^\s]{2}$/i.exec(b)) { alert("Invalid Scheme!"); Pa(); return } Na.scheme = b } f() } kernel.setProp("bldSets",
                        JSON.stringify(Na)); a(Na, w)
        }
    } function e(a, b) { return a[b][0] + "-" + a[b][1] } function a(a, c) {
        c.empty(); Ta.empty(); db.empty(); for (var f = Na.scheme, n = 0; 24 > n; n++) { var w = ~~(n / 8), z = n % 8, Oa = h.slice(4 * z, 4 * z + 3); Oa = Oa.slice(w) + Oa.slice(0, w) + " [" + f.charAt(4 * z + w) + "]"; Ta.append('<option value="' + n + '">' + Oa + "</option>") } for (n = 0; 24 > n; n++)w = ~~(n / 12), z = n % 12, Oa = h.slice(32 + 3 * z, 3 * z + 34), Oa = Oa.slice(w) + Oa.slice(0, w) + " [" + f.charAt(32 + 3 * z + w) + "]", db.append('<option value="' + n + '">' + Oa + "</option>"); Wa.val(a.cfix); Ra.val(e(a, "cnerrLR"));
        $a.val(e(a, "cscycLR")); Va.val(e(a, "cncodeLR")); cb.val(a.efix); lb.val(e(a, "enerrLR")); gb.val(e(a, "escycLR")); Ya.val(e(a, "encodeLR")); x.val(0); y.val(0); Ta.val(a.cbuff[0]); db.val(a.ebuff[0]); Ua.val(a.cbuff[1]); mb.val(a.ebuff[1]); fb.val(a.ceparity); f = r(a); c.append($("<tr>").append($("<th>Coder</th>"), $("<td colspan=2>").append(Qa))); c.append($("<tr>").append($('<td colspan=3 style="width:0;">').append(Xa))); c.append($("<tr>").append($('<td colspan=3 style="height:0.2em;border:none;">'))); c.append($("<tr>").append('<th colspan=3>Scrambler|<span class="click" id="bldsClr">clr</span>|<span class="click" id="bldsEg">eg.</span></th>'));
        c.append($("<tr>").append($("<td>").append(fb), $("<td>").append(x), $("<td>").append(y))); c.append($("<tr>").append("<td>buffer</td>", $("<td>").append(Ta, Ua), $("<td>").append(db, mb))); c.append($("<tr>").append("<td>fixed</td>", $("<td>").append(Wa), $("<td>").append(cb))); c.append($("<tr>").append("<td>flip</td>", $("<td>").append(Ra), $("<td>").append(lb))); c.append($("<tr>").append("<td>ex-cyc</td>", $("<td>").append($a), $("<td>").append(gb))); c.append($("<tr>").append("<td>#codes</td>", $("<td>").append(Va),
            $("<td>").append(Ya))); n = f[0] / 4.325200327448986E19; c.append($("<tr>").append("<td>probs</td>", $("<td colspan=2>").append((0 == f[0] ? 0 : .001 > n ? n.toExponential(3) : Math.round(1E6 * n) / 1E4 + "%") + (1E-8 > n ? "<br>N=" + (1E8 < f[0] ? f[0].toExponential(3) : f[0]) : "")))); c.find("input,select").css({ padding: 0 }).unbind("change").change(b); c.find("span.click").unbind("click").click(b); c.find("td,th").css({ padding: 0 }); Pa(); return c
    } function Pa() {
        var a = Na.scheme; "CJM DIF ARE BQN VKP ULG XSH WTO BM CI DE AQ VO UK XG WS JP LF RH TN" ==
            a ? Qa.val("speffz") : "JLK ABC DFE GHI XYZ WNM OPQ RTS GH AB CD EF OP IJ KL MN QR ST WX YZ" == a ? Qa.val("chichu") : Qa.val("customed")
    } function f() {
        var a = tools.getCurScramble(), b = cubeutil.getScrambledState(a), c = Na.scheme, e = Na.cbuff[0], f = Na.ebuff[0]; a = ~~(e / 8); e %= 8; 165 >> e & 1 && (a = (3 - a) % 3); var h = ~~(f / 12); f %= 12; for (var w = [], r = 0; 8 > r; r++)w[r] = c.slice(4 * r, 4 * r + 3); var y = []; for (r = 0; 12 > r; r++)y[r] = c.slice(32 + 3 * r, 3 * r + 34); c = []; var x = [], z = new mathlib.CubieCube; z.init(b.ca, b.ea); b = 1 << e; for (r = 0; 8 > r; r++)z.ca[r] == r && (b |= 1 <<
            r); for (; 255 != b;)if (r = z.ca[e] & 7, r == e) { for (r = -1; b >> ++r & 1;); mathlib.circle(z.ca, r, e); c.push(r) } else c.push(z.ca[e]), z.ca[e] = (z.ca[r] + (z.ca[e] & 248)) % 24, z.ca[r] = r, b |= 1 << r; b = 1 << f; for (r = 0; 12 > r; r++)z.ea[r] == 2 * r && (b |= 1 << r); for (; 4095 != b;)if (r = z.ea[f] >> 1, r == f) { for (r = -1; b >> ++r & 1;); mathlib.circle(z.ea, r, f); x.push(2 * r) } else x.push(z.ea[f]), z.ea[f] = z.ea[r] ^ z.ea[f] & 1, z.ea[r] = r << 1, b |= 1 << r; e = [[], []]; for (r = 0; r < c.length; r++)f = c[r] & 7, z = ((c[r] >> 3) + 3 - a) % 3, 165 >> f & 1 && (z = (3 - z) % 3), e[0].push(w[f].charAt((3 - z) % 3)), 1 == r % 2 && e[0].push(" ");
        for (r = 0; r < x.length; r++)f = x[r] ^ h, e[1].push(y[f >> 1].charAt(f & 1)), 1 == r % 2 && e[1].push(" "); Xa.html("C: " + e[0].join("") + "<br>E: " + e[1].join(""))
    } function bb(b) { b && (tools.isPuzzle("333") ? (b.empty().append(w), a(Na, w), f()) : b.html(IMAGE_UNAVAILABLE)) } scrMgr.reg("nocache_333bldspec", function () { return r(Na, !0) }); var h = "UFR UFL UBL UBR DFR DFL DBL DBR UR UF UL UB DR DF DL DB FR FL BL BR", Na = {
        cbuff: [0, 7], cfix: "", cnerrLR: [0, 7], cscycLR: [0, 3], cncodeLR: [0, 10], ebuff: [1, 7], efix: "", enerrLR: [0, 11], escycLR: [0, 5], encodeLR: [0,
            16], ceparity: 3, scheme: "CJM DIF ARE BQN VKP ULG XSH WTO BM CI DE AQ VO UK XG WS JP LF RH TN"
    }, Qa, x, Ta, Ua, Wa, Ra, $a, Va, y, db, mb, cb, lb, gb, Ya, fb, Xa = $('<div style="text-align:left;">'), w = $('<table style="border-spacing:0; border:none;" class="table">'); $(function () {
        var a = JSON.parse(kernel.getProp("bldSets", "{}")); for (b in Na) b in a && (Na[b] = a[b]); Qa = $('<select id="scheme">'); var b = [["customed", "Customed"], ["speffz", "Speffz"], ["chichu", "ChiChu"], ["custom", "Custom"]]; for (a = 0; a < b.length; a++)Qa.append('<option value="' +
            b[a][0] + '">' + b[a][1] + "</option>"); x = $('<select id="bldsCorn">'); Ta = $('<select data="bufcorn" id="cbuff0" style="width:2em">'); Ua = $('<select id="cbuff1" style="width:2em">'); Wa = $('<input id="cfix" type="text" style="width:4em" value="" pattern="[URFDLBurfdlb +]*">'); Ra = $('<input id="cnerrLR" type="text" style="width:4em" value="" pattern="d{1,2}-d{1,2}">'); $a = $('<input id="cscycLR" type="text" style="width:4em" value="" pattern="d{1,2}-d{1,2}">'); Va = $('<input id="cncodeLR" type="text" style="width:4em" value="" pattern="d{1,2}-d{1,2}">');
        y = $('<select id="bldsEdge">'); db = $('<select data="bufedge" id="ebuff0" style="width:2em">'); mb = $('<select id="ebuff1" style="width:2em">'); cb = $('<input id="efix" type="text" style="width:4em" value="" pattern="[URFDLBurfdlb +]*">'); lb = $('<input id="enerrLR" type="text" style="width:4em" value="" pattern="d{1,2}-d{1,2}">'); gb = $('<input id="escycLR" type="text" style="width:4em" value=""> pattern="d{1,2}-d{1,2}"'); Ya = $('<input id="encodeLR" type="text" style="width:4em" value="" pattern="d{1,2}-d{1,2}">');
        fb = $('<select id="ceparity">'); b = [["any", 7], ["ok", 1], ["flip", 2], ["move", 4], ["not ok", 6], ["ok/flip", 3], ["ok/move", 5]]; for (a = 0; a < b.length; a++)Ua.append('<option value="' + b[a][1] + '">' + b[a][0] + "</option>"), mb.append('<option value="' + b[a][1] + '">' + b[a][0] + "</option>"); b = [["parity", 3], ["even", 1], ["odd", 2]]; for (a = 0; a < b.length; a++)fb.append('<option value="' + b[a][1] + '">' + b[a][0] + "</option>"); b = [["$", 0], ["solved", 1], ["any", 2]]; for (a = 0; a < b.length; a++)x.append('<option value="' + b[a][1] + '">' + b[a][0].replace("$",
            "Corner") + "</option>"), y.append('<option value="' + b[a][1] + '">' + b[a][0].replace("$", "Edge") + "</option>"); tools.regTool("bldhelper", TOOLS_BLDHELPER, bb)
    })
}); var replay = execMain(function () {
    function c(a) { a != Za && (Za = a, cb.html(Za ? "" : "")) } function Oa() { fb && (clearTimeout(fb), fb = 0); Ya = +new Date - Sa; c(1); a() } function z(a, b) { return b ? 0 > a ? -1 : a * $a[Va] : 0 > a ? -2E3 : a / $a[Va] } function r(b) { if (b > n) for (var c = n; c < b; c++)3 < Math.abs(b - 1 - c) ? Qa.applyMoves([w[c][0]]) : Qa.addMoves([w[c][0]]); else if (b < n) for (c = n - 1; c >= b; c--) { var e = Qa.moveInv(w[c][0]); 3 < Math.abs(b - 1 - c) ? Qa.applyMoves([e]) : Qa.addMoves([e]) } n = b; b = w[Math.max(0, b - 1)]; Sa = z(b ? b[1] : 0); a() } function b(a) {
        a = $(a.target); if (a.hasClass("click") ||
            a.is("input")) {
                var b = a.attr("data"), e = Za, h = z(Sa, !0); c(0); if ("l" == b) 0 < n && r(n - 1); else if ("n" == b) n < w.length && r(n + 1); else if ("p" == b) 0 == e && 0 < w.length && Sa >= z(w[w.length - 1][1]) && r(0), c(1 - e), 1 == Za && Oa(); else if ("s" == b) r(0); else if ("e" == b) r(w.length); else if ("r" == b) a: { a = Wa.val(); for (b = 0; b < w.length; b++)if (w[b][1] >= a) { r(b); break a } r(w.length) } else "s+" == b ? (Va = Math.min(Va + 1, $a.length - 1), y.html($a[Va] + "x"), Sa = z(h)) : "s-" == b ? (Va = Math.max(Va - 1, 0), y.html($a[Va] + "x"), Sa = z(h)) : "a" == b ? $.clipboardCopy(db) && logohint.push("share link copied") :
                    "o" == b && ((Ua = !Ua) ? a.html(ob[1]) : a.html(ob[0]), r(0), f(Ta))
        }
    } function e() { var a = +new Date - Ya; fb && (clearTimeout(fb), fb = 0); if (0 == Za) return Sa; for (; n < w.length && z(w[n][1]) <= a;)Qa.addMoves([w[n][0]]), n++; if (n >= w.length) return a; fb = setTimeout(e, z(w[n][1]) - a); return a } function a() {
        Sa = e(); var b = 0 < w.length ? w[w.length - 1][1] : 0; Sa = Math.min(Sa, z(b)); Wa.val(z(Sa, !0)); Ra.html((0 <= Sa ? kernel.pretty(z(Sa, !0)) : "--") + "/" + kernel.pretty(b)); for (var f = [], h = -4; 5 > h; h++) {
            var r = h + n; if (0 > r || r >= w.length) f[h + 4] = '<span style="color:#888;">~</span>',
                pad = mathlib.valuedArray(hb - 1, " ").join(""); else { var y = Qa.move2str(w[r][0]); pad = mathlib.valuedArray(hb - y.length, " ").join(""); Qa.isRotation(w[r][0]) && (y = '<span style="color:#888;">' + y + "</span>"); f[h + 4] = y } 0 == h && (f[h + 4] = "<b><u>" + f[h + 4] + "</u></b>"); f[h + 4] = pad + f[h + 4]
        } gb.empty(); gb.html(f.join("<br>")); Sa >= z(b) && c(0); 1 == Za && requestAnimFrame(a)
    } function Pa(a, b) {
        if (!Ua || !/^\d+$/.exec(x)) return b ? [] : a; var c = kernel.getProp("giiOri"); if ("auto" == c) return b ? [] : a; if (b) return Qa.parseScramble(mathlib.CubieCube.rot2str[c]);
        c = mathlib.CubieCube.rotMulI[0][~~c]; var e = "URFDLB".indexOf(a[2]); e = mathlib.CubieCube.rotMulM[c][3 * e] / 3; a = a.slice(); a[2] = "URFDLB".charAt(e); return a
    } function f(a) {
        Ta = a; mb.attr("href", "https://alg.cubing.net/?alg=" + encodeURIComponent((a || "").replace(/@(\d+)/g, "/*$1*/").replace(/-/g, "&#45;")) + "&setup=" + encodeURIComponent(lb || "")); var b = a.split(" "), c = []; a = []; for (var e = 0; e < b.length; e++) { var f = /^(.*)@(\d+)$/.exec(b[e]); f && (c.push(f[1]), a.push(~~f[2])) } b = Qa.parseScramble(c.join(" ")); if (b.length != a.length) console.log("parse error");
        else { Wa.attr("min", -1); Wa.attr("max", a[a.length - 1]); w = Pa(null, !0); for (e = 0; e < w.length; e++)w[e] = [w[e], -1]; for (e = 0; e < b.length; e++)0 == a[e] && Qa.isRotation(b[e]) && --a[e], w.push([Pa(b[e]), a[e]]); for (e = hb = 0; e < w.length; e++)hb = Math.max(hb, ("" + Qa.move2str(w[e][0])).length); n = 0; Sa = z(-1); Oa() }
    } function bb(a, e, n) {
        x = n || tools.puzzleType(tools.getCurScramble()[0]); n = "222 333 444 555 666 777 888 999 101010 111111".split(" ").indexOf(x); lb = a; db = (new URL("?vrcreplay=" + LZString.compressToEncodedURIComponent(JSON.stringify([a,
            e, x])), location)).toString(); var r = { puzzle: "cube3" }; -1 != n ? r.puzzle = "cube" + (n + 2) : -1 != ["skb", "mgm", "pyr", "sq1", "clk"].indexOf(x) && (r.puzzle = x); kernel.showDialog([h, function () { c(0) }, void 0, function () { c(0) }], "share", VRCREPLAY_TITLE, function () { puzzleFactory.init(r, $.noop, Na, function (c, n) { h.unbind("click").click(b); Wa.unbind("input click").bind("input", b); (Qa = c) && Qa.resize(); Xa = Qa.parseScramble(a); Qa.applyMoves(Xa); f(e) }) })
    } var h, Na, Qa, x, Ta, Ua = !0, Wa, Ra, $a = [.2, .3, .5, .7, 1, 1.5, 2, 3, 5], Va = 4, y, db, mb, cb, lb, gb,
        Ya = 0, fb = 0, Xa = [], w = [], n = 0, Sa = 0, Za = 0, hb = 0, ob = VRCREPLAY_ORI.split("|"); $(function () {
            h = $('<table style="height:98%">'); Na = $('<td style="height:80%">'); Wa = $('<input type="range" style="width:50%;" data="r">'); Ra = $('<span style="user-select:none;"></span>'); y = $('<span style="user-select:none;">1x</span>'); mb = $('<a target="_blank">⏯Alg</a>'); cb = $('<span class="click playbutton" data="%">$</span>'.replace("$", "").replace("%", "p")); gb = $('<td style="width:0%;font-family:monospace;white-space:pre;">'); h.append($("<tr>").append($("<td>").append('<span class="click playbutton" data="%">$</span>'.replace("$",
                ob[1]).replace("%", "o"), "| ", mb, " |", '<span class="click playbutton" data="%">$</span>'.replace("$", VRCREPLAY_SHARE).replace("%", "a"))), $("<tr>").append(Na, gb), $("<tr>").append($('<td style="display:flex;justify-content:center;">').append(y, " ", Wa, " ", Ra)), $("<tr>").append($("<td>").append('<span class="click playbutton" data="%">$</span>'.replace("$", "").replace("%", "s-"), '<span class="click playbutton" data="%">$</span>'.replace("$", "").replace("%", "s+"), '<span class="click playbutton" data="%">$</span>'.replace("$",
                    "").replace("%", "s"), '<span class="click playbutton" data="%">$</span>'.replace("$", "").replace("%", "l"), cb, '<span class="click playbutton" data="%">$</span>'.replace("$", "").replace("%", "n"), '<span class="click playbutton" data="%">$</span>'.replace("$", "").replace("%", "e")))); var a = $.urlParam("vrcreplay"); if (a) { $.clearUrl("vrcreplay"); try { a = JSON.parse(LZString.decompressFromEncodedURIComponent(decodeURIComponent(a))), setTimeout(function () { bb(a[0], a[1], a[2]) }, 500) } catch (eb) { console.log(eb) } }
        });
    return { popupReplay: bb, bindDomElem: function (a, b, c, e) { a.hasClass("click") || a.addClass("click"); a.unbind("click").click(bb.bind(null, b, c, e)) } }
}); var shortcuts = execMain(function () {
    function c(b, c) { if (kernel.getProp("useKSC")) { var a; c.altKey && c.ctrlKey ? a = r[c.which] : c.altKey ? a = Oa[c.which] : c.ctrlKey && (a = z[c.which]); void 0 != a && (void 0 == a[1] ? kernel.setProp(a[0][0], a[0][1]) : kernel.pushSignal(a[1], a[0]), kernel.clrKey(), kernel.blur()) } } var Oa = {
        49: [["scrType", "sqrs"]], 50: [["scrType", "222so"]], 51: [["scrType", "333"]], 52: [["scrType", "444wca"]], 53: [["scrType", "555wca"]], 54: [["scrType", "666wca"]], 55: [["scrType", "777wca"]], 67: [["scrType", "clkwca"]], 77: [["scrType",
            "mgmp"]], 80: [["scrType", "pyrso"]], 83: [["scrType", "skbso"]], 73: [["scrType", "input"]], 37: [["scramble", "last"], "ctrl"], 39: [["scramble", "next"], "ctrl"], 38: [["stats", "-"], "ctrl"], 40: [["stats", "+"], "ctrl"], 68: [["stats", "clr"], "ctrl"], 90: [["stats", "undo"], "ctrl"]
    }, z = { 49: [["stats", "OK"], "ctrl"], 50: [["stats", "+2"], "ctrl"], 51: [["stats", "DNF"], "ctrl"] }, r = { 84: [["input", "t"]], 73: [["input", "i"]], 83: [["input", "s"]], 77: [["input", "m"]], 86: [["input", "v"]], 71: [["input", "g"]] }; $(function () {
        kernel.regListener("shortcut",
            "keydown", c); kernel.regProp("tools", "useKSC", 0, PROPERTY_USEKSC, [!0])
    })
}); var help = execMain(function (c, Oa, z) {
    function r() { $(this).hasClass("enable") || b($(this).html()) } function b(b) { if (void 0 === b) for (b in h) break; a(b) && e(b) } function e(a, b) { Qa.children().appendTo(kernel.temp); for (var c in h) $("<div />").html(c).addClass(c == a ? "tab enable" : "tab disable").click(r).appendTo(Qa) } function a(a, b) { setTimeout(function () { h[a] && Ta.scrollTop(Ta.scrollTop() + h[a].position().top - 3) }, 0); return !0 } function Pa() {
        var a = ABOUT_LANG, b; for (b in h) 50 < h[b].position().top || (a = h[b].is("h1, h2, h3") ?
            h[b].html() : ABOUT_LANG); e(a)
    } function f(a) { var b = $(a.target).val(); kernel.blur(); $(a.target).val("..."); if (b in Ua) Oa("vrcKBL", b), bb(b); else if ("other" == b && (a = z("vrcKBL"), a = Ua[a] || a, a = prompt("input keyboard layout", a))) { 47 != a.length && alert("Invalid Keyboard Layout"); for (b = 0; b < a.length; b++)if (-1 == a.indexOf(Ua.qwerty.charAt(b))) { alert("Invalid Keyboard Layout"); return } Oa("vrcKBL", a); bb(a) } } function bb(a) {
        a in Ua && (a = Ua[a]); var b = []; a = a.toUpperCase(); for (var c = 0; c < Wa.length; c++) {
            b.push("<tr>"); for (var e =
                0; e < Wa[c].length; e++)b.push("<td>" + a[Wa[c][e]] + "<br><span>" + Ra[c][e] + "</span></td>"); b.push("</tr>")
        } c = $("#vrckey"); c.find("tr:not(:first)").remove(); e = $("<tr>"); var h = $('<select id="vrckeylayout">'); h.append($("<option />").val("...").html("select layout")); for (var r in Ua) h.append($("<option />").val(r).html(r)); h.append($("<option />").val("other").html("...")); h.unbind("change").change(f); c.append(e.append($('<th colspan="10">').append("Layout: ", h))); c.append(b.join("")); b = Ua.qwerty.toUpperCase();
        a = a.toUpperCase(); r = { 96: 192, 45: 189, 61: 187, 91: 219, 93: 221, 92: 220, 59: 186, 39: 222, 44: 188, 46: 190, 47: 191 }; $a = {}; for (c = 0; c < b.length; c++)e = b.charCodeAt(c), h = a.charCodeAt(c), e = r[e] || e, h = r[h] || h, e != h && ($a[h] = e), 186 == h && ($a[59] = e)
    } var h = {}, Na = $('<table class="options" />'), Qa = $("<td />"), x = $("<td />").addClass("tabValue"), Ta = $('<div class="noScrollBar helptable">'); Na.append($("<tr />").append(Qa, x.append(Ta))); var Ua = {
        qwerty: "`1234567890-=qwertyuiop[]\\asdfghjkl;'zxcvbnm,./", dvorak: "`1234567890[]',.pyfgcrl/=\\aoeuidhtns-;qjkxbmwvz",
        colemak: "`1234567890-=qwfpgjluy;[]\\arstdhneio'zxcvbkm,./"
    }, Wa = [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [13, 14, 15, 16, 17, 18, 19, 20, 21, 22], [26, 27, 28, 29, 30, 31, 32, 33, 34, 35], [37, 38, 39, 40, 41, 42, 43, 44, 45, 46]], Ra = ["<br>,<br>,&lt;,&gt;,  M,  M,&lt;,&gt;,<br>,<br>".split(","), " z';  B; L';Lw';  x;  x; Rw;  R; B';  z".split(";"), " y';  D;  L; U'; F';  F;  U; R'; D';  y".split(";"), " Dw; M';Uw'; Lw; x'; x';Rw'; Uw; M';Dw'".split(";")], $a = {}; $(function () {
        for (var a = $("#about").children(), e = 0; e < a.length; e++) {
            var f = a.eq(e), r = f.appendTo(Ta).html();
            f.is("h1, h2, h3") && !a.eq(e + 1).is("h1, h2, h3") ? h[r] = f : h[ABOUT_LANG] = h[ABOUT_LANG] || f
        } b(); $("#about").html(Na); Ta.scrollTop(); Ta.unbind("scroll").scroll(Pa); c("vrc", "vrcKBL", -6, "VRC Keyboard Layout", ["qwerty"]); a = z("vrcKBL"); bb(a)
    }); return { getMappedCode: function (a) { return $a[a] || a } }
}, [kernel.regProp, kernel.setProp, kernel.getProp]); var stackmat = execMain(function () {
    function c(c) {
        e = c; a = b.createMediaStreamSource(c); Pa = b.createScriptProcessor(1024, 1, 1); Pa.onaudioprocess = function (a) {
            a = a.inputBuffer.getChannelData(0); for (var b = 0; b < a.length; b++) {
                Na = Math.max(1E-4, Na + (a[b] * a[b] - Na) * Qa); var c = 1 / Math.sqrt(Na) * a[b]; x.unshift(c); if ((x.pop() - c) * (Ta ? 1 : -1) > Wa && Math.abs(c - (Ta ? 1 : -1)) - 1 > Ua && Ra > .6 * f) { for (var e = 0; e < Math.round(Ra / f); e++)bb(Ta); Ta ^= 1; Ra = 0 } else Ra > 2 * f && (bb(Ta), Ra -= f); Ra++; 10 > cb ? $a = Math.max(1E-4, $a + (Math.pow(c - (Ta ? 1 : -1), 2) - $a) * Qa) :
                    100 < cb && ($a = 1)
            }
        }; a.connect(Pa); Pa.connect(b.destination)
    } function Oa(a) {
        Va.push(a); a != mb ? (mb = a, cb = 1) : cb++; lb++; if (10 < cb) db = a, Va = [], 0 != y.length && (y = []), 100 < cb && Ya.on ? (Ya.on = !1, Ya.noise = Math.min(1, $a) || 0, Ya.power = Na, fb(Ya)) : 700 < lb && (lb = 100, Ya.noise = Math.min(1, $a) || 0, Ya.power = Na, fb(Ya)); else if (10 == Va.length) if (Va[0] == db || Va[9] != db) Va = Va.slice(1); else {
            a = 0; for (var b = 8; 0 < b; b--)a = a << 1 | (Va[b] == db ? 1 : 0); y.push(String.fromCharCode(a)); a: if (a = y, 9 == a.length || 10 == a.length) {
                DEBUG && console.log("[stackmat]", a); b =
                    /[0-9]/; var c = a[0]; if (/[ SILRCA]/.exec(c)) { for (var e = 64, f = 1; f < a.length - 3; f++) { if (!b.exec(a[f])) break a; e += ~~a[f] } e == a[a.length - 3].charCodeAt(0) && z(c, 6E4 * ~~a[1] + 1E3 * ~~(a[2] + a[3]) + ~~(a[4] + a[5] + (10 == a.length ? a[6] : "0")), 9 == a.length ? 10 : 1) }
            } Va = []
        }
    } function z(a, b, c) {
        var e = $.now(); 200 < e - gb && DEBUG && console.log("[stackmat] signal miss ", e - gb); gb = e; e = {}; e.time_milli = b; e.unit = c; e.on = !0; kernel.getProp("stkHead") || (a = "S"); b = c == Ya.unit ? e.time_milli > Ya.time_milli : Math.floor(e.time_milli / 10) > Math.floor(Ya.time_milli /
            10); e.greenLight = "A" == a; e.leftHand = "L" == a || "A" == a || "C" == a; e.rightHand = "R" == a || "A" == a || "C" == a; e.running = ("S" != a || "S" == Ya.signalHeader) && (" " == a || b); e.signalHeader = a; e.unknownRunning = !Ya.on; e.noise = Math.min(1, $a) || 0; e.power = Na; Ya = e; lb = 0; fb(Ya)
    } function r(a) {
        if (mb != db && 1 == cb && (Va.push(a), 24 == Va.length)) { for (var b = 0, c = 5; 0 <= c; c--) { b *= 10; for (var e = 0; 4 > e; e++)b += Va[4 * c + e] << e } Va = []; z("S", b, 1) } a != mb ? (mb = a, cb = 1) : cb++; 10 < cb && (db = a, Va = [], y = [], 1E3 < cb && Ya.on ? (Ya.on = !1, Ya.noise = Math.min(1, $a) || 0, Ya.power = Na, fb(Ya)) :
            4E3 < cb && (cb = 1E3, Ya.noise = Math.min(1, $a) || 0, Ya.power = Na, fb(Ya)))
    } var b, e, a, Pa, f, bb, h, Na = 1, Qa = 1E-4, x = [], Ta = 0, Ua = .2, Wa = .7, Ra = 0, $a = 0, Va = [], y = [], db = 0, mb = 0, cb = 0, lb = 0, gb = 0, Ya = { time_milli: 0, unit: 10, on: !1, greenLight: !1, leftHand: !1, rightHand: !1, running: !1, unknownRunning: !0, signalHeader: "I", noise: 1, power: 1 }, fb = $.noop; return {
        init: function (a, w, n) {
            h = a; void 0 === navigator.mediaDevices && (navigator.mediaDevices = {}); void 0 === navigator.mediaDevices.getUserMedia && (navigator.mediaDevices.getUserMedia = function (a) {
                var b =
                    navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia; return b ? new Promise(function (c, e) { b.call(navigator, a, c, e) }) : Promise.reject(Error("getUserMedia is not implemented in this browser"))
            }); b = new (window.AudioContext || window.webkitAudioContext); "m" == h ? (f = b.sampleRate / 8E3, bb = r) : (f = b.sampleRate / 1200, bb = Oa); Qa = .001 / f; x.length = Math.ceil(f / 6); Va = []; y = []; a = { echoCancellation: !1, noiseSuppression: !1 }; w && (a.deviceId = { exact: w }); return void 0 == e ? navigator.mediaDevices.getUserMedia({ audio: a }).then(function (a) {
                if ("suspended" ==
                    b.state && !n) return Promise.reject(); c(a)
            }, console.log) : Promise.resolve()
        }, stop: function () { if (void 0 != e) { try { a.disconnect(Pa), Pa.disconnect(b.destination), e.stop && e.stop() } catch (Xa) { } e = void 0 } }, updateInputDevices: function () {
            var a = [], b = Promise.resolve(a); return navigator.mediaDevices && navigator.mediaDevices.enumerateDevices ? navigator.mediaDevices.enumerateDevices().then(function (c) { for (var e = 0; e < c.length; e++) { var f = c[e]; "audioinput" === f.kind && a.push([f.deviceId, f.label || "microphone " + (a.length + 1)]) } return b }) :
                b
        }, setCallBack: function (a) { fb = a }
    }
});
execMain(function () { window.nativeStackmat && (stackmat = function () { DEBUG && console.log("Use Native Stackmat"); var c = "stackmat_callback_" + ~~(1E7 * Math.random()), Oa; nativeStackmat.setCallback(c); window[c] = function (c) { DEBUG && console.log(JSON.stringify(c)); Oa && Oa(c) }; return { init: function () { nativeStackmat.init(); return Promise.resolve() }, stop: function () { nativeStackmat.stop(); return Promise.resolve() }, updateInputDevices: function () { return Promise.resolve([[void 0, "native"]]) }, setCallBack: function (c) { Oa = c } } }()) }); var stackmatutil = execMain(function (c) {
    function Oa(a) { a ? (e = !0, a.empty().append(r, "<br>", "Device:&nbsp;&nbsp;", b)) : e = !1 } function z() { stackmat.updateInputDevices().then(function (a) { b.empty(); for (var c = 0; c < a.length; c++)b.append($("<option>").val(a[c][0]).text(a[c][1])); b.unbind("change").change(function () { stackmat.stop(); console.log("select device ", b.val()); stackmat.init(void 0, b.val(), !0); kernel.blur() }) }) } var r = $("<span>").html("status:  unknown"), b = $('<select style="font-size: 1rem;">'), e = !1; $(function () {
        tools.regTool("stackmatutil",
            "stackmat", Oa); kernel.regProp("timer", "stkHead", 0, PROPERTY_STKHEAD, [!0]); z()
    }); return {
        init: function (a, b) { return stackmat.init(a, void 0, b).then(z) }, stop: stackmat.stop, setCallBack: function (a) {
            stackmat.setCallBack(function (b) {
                if (e) {
                    var c = "status:  " + (b.on ? "on" : "off") + "<br>"; c += "noise:   " + ~~(100 * b.noise) + "%<br>"; c += "power:   " + ~~(100 * Math.log10(b.power)) / 10 + "dB<br>"; c += "header:  " + b.signalHeader + "<br>"; c += "pad:     " + (b.leftHand ? "L" : " ") + (b.rightHand ? "R" : " ") + "<br>"; c += "running: " + (b.running ? "yes" : "no");
                    r.html(c.replace(/ /g, "&nbsp;"))
                } a && a(b)
            })
        }
    }
}); var GiikerCube = execMain(function () {
    function c(a, b) { return a.toUpperCase() == b.toUpperCase() } function Oa() { return r ? Promise.resolve(z && z.clear()).then(function () { r.removeEventListener("gattserverdisconnected", f); r.gatt.disconnect(); r = null }) : Promise.resolve() } var z = void 0, r = null, b = function () {
        function a(a) { b(a.target.value) } function b(a) {
            for (var b = $.now(), c = [], e = 0; 20 > e; e++)c.push(a.getUint8(e)); if (167 == c[18]) {
                a = [176, 81, 104, 224, 86, 137, 237, 119, 38, 26, 193, 161, 210, 126, 150, 81, 93, 13, 236, 249, 89, 235, 88, 24, 113,
                    81, 214, 131, 130, 199, 2, 169, 39, 165, 171, 41]; var x = c[19] >> 4 & 15, Na = c[19] & 15; for (e = 0; 18 > e; e++)c[e] += a[e + x] + a[e + Na]; c = c.slice(0, 18)
            } a = []; for (e = 0; e < c.length; e++)a.push(c[e] >> 4 & 15), a.push(c[e] & 15); e = []; for (c = 0; 3 > c; c++)for (x = 8; 0 != x; x >>= 1)e.push(a[c + 28] & x ? 1 : 0); x = new mathlib.CubieCube; Na = [-1, 1, -1, 1, 1, -1, 1, -1]; for (c = 0; 8 > c; c++)x.ca[c] = a[c] - 1 | (3 + a[c + 8] * Na[c]) % 3 << 3; for (c = 0; 12 > c; c++)x.ea[c] = a[c + 16] - 1 << 1 | e[c]; e = x.toFaceCube(h, r); Na = a.slice(32, 40); x = []; for (c = 0; c < Na.length; c += 2)x.push("BDLURF".charAt(Na[c] - 1) + " 2'".charAt((Na[c +
                1] - 1) % 7)); if (DEBUG) { Na = []; for (c = 0; 40 > c; c++)Na.push("0123456789abcdef".charAt(a[c])); console.log("[giiker]", "Raw Data: ", a.join("")); console.log("[giiker]", "Current State: ", e); console.log("[giiker]", "A Valid Generator: ", scramble_333.genFacelet(e)); console.log("[giiker]", "Previous Moves: ", x.reverse().join(" ")); x.reverse() } bb(e, x, [b, b], f); return [e, x]
        } var c = null, e = null, f, h = [[26, 15, 29], [20, 8, 9], [18, 38, 6], [24, 27, 44], [51, 35, 17], [45, 11, 2], [47, 0, 36], [53, 42, 33]], r = [[25, 28], [23, 12], [19, 7], [21, 41], [32, 16],
        [5, 10], [3, 37], [30, 43], [52, 34], [48, 14], [46, 1], [50, 39]]; return {
            init: function (h) {
                f = h.name.startsWith("Gi") ? "Giiker" : "Mi Smart"; return h.gatt.connect().then(function (a) { c = a; return a.getPrimaryService("0000aadb-0000-1000-8000-00805f9b34fb") }).then(function (a) { return a.getCharacteristic("0000aadc-0000-1000-8000-00805f9b34fb") }).then(function (a) { e = a; return e.startNotifications() }).then(function () { return e.readValue() }).then(function (c) {
                    b(c)[0] != kernel.getProp("giiSolved", mathlib.SOLVED_FACELET) && (c = kernel.getProp("giiRST"),
                        ("a" == c || "p" == c && confirm(CONFIRM_GIIRST)) && giikerutil.markSolved()); return e.addEventListener("characteristicvaluechanged", a)
                })
            }, opservs: ["0000aadb-0000-1000-8000-00805f9b34fb", "0000aaaa-0000-1000-8000-00805f9b34fb"], getBatteryLevel: function () {
                var a, b, e, h = function (a) { e([a.target.value.getUint8(1), f]); b.removeEventListener("characteristicvaluechanged", h); b.stopNotifications() }; return c.getPrimaryService("0000aaaa-0000-1000-8000-00805f9b34fb").then(function (b) { a = b; return b.getCharacteristic("0000aaab-0000-1000-8000-00805f9b34fb") }).then(function (a) {
                    b =
                    a; return b.startNotifications()
                }).then(function () { return b.addEventListener("characteristicvaluechanged", h) }).then(function () { return a.getCharacteristic("0000aaac-0000-1000-8000-00805f9b34fb") }).then(function (a) { a.writeValue((new Uint8Array([181])).buffer); return new Promise(function (a) { e = a }) })
            }, clear: $.noop
        }
    }(), e = function () {
        function a(a) {
            for (var b = [], c = 0; c < a.byteLength; c++)b[c] = a.getUint8(c); if (null == jb) return b; a = jb.iv || []; if (16 < b.length) {
                var e = b.length - 16, f = jb.decrypt(b.slice(e)); for (c = 0; 16 > c; c++)b[c +
                    e] = f[c] ^ ~~a[c]
            } jb.decrypt(b); for (c = 0; 16 > c; c++)b[c] ^= ~~a[c]; return b
        } function b() {
            DEBUG && console.log("[gancube] v1init start"); return Ya.getCharacteristic("00002a28-0000-1000-8000-00805f9b34fb").then(function (a) { return a.readValue() }).then(function (a) {
                var b = a.getUint8(0) << 16 | a.getUint8(1) << 8 | a.getUint8(2); DEBUG && console.log("[gancube] version", b.toString(16)); jb = null; if (65543 < b && 65536 == (b & 16776704)) return Ya.getCharacteristic("00002a23-0000-1000-8000-00805f9b34fb").then(function (a) { return a.readValue() }).then(function (a) {
                    var c =
                        ab[b >> 8 & 255]; if (c) { c = JSON.parse(LZString.decompressFromEncodedURIComponent(c)); for (var e = 0; 6 > e; e++)c[e] = c[e] + a.getUint8(5 - e) & 255; a = c } else a = void 0; a ? (DEBUG && console.log("[gancube] key", JSON.stringify(a)), jb = $.aes128(a)) : logohint.push("Not support your Gan cube")
                }); logohint.push("Not support your Gan cube")
            }).then(function () { return gb.getCharacteristics() }).then(function (a) {
                for (var b = 0; b < a.length; b++) {
                    var e = a[b]; DEBUG && console.log("[gancube] v1init find chrct", e.uuid); c(e.uuid, "0000fff2-0000-1000-8000-00805f9b34fb") ?
                        fb = e : c(e.uuid, "0000fff5-0000-1000-8000-00805f9b34fb") ? Xa = e : c(e.uuid, "0000fff6-0000-1000-8000-00805f9b34fb") ? w = e : c(e.uuid, "0000fff7-0000-1000-8000-00805f9b34fb") && (n = e)
                }
            }).then(db)
        } function e() {
            if (!r || !r.watchAdvertisements) return Promise.reject(-1); var a = new AbortController; return new Promise(function (b, c) {
                var e = function (c) {
                    DEBUG && console.log("[gancube] receive adv event", c); a: if (c = c.manufacturerData, !(c instanceof DataView)) {
                        for (var f = $jscomp.makeIterator(ob), h = f.next(); !h.done; h = f.next())if (h = h.value,
                            c.has(h)) { DEBUG && console.log("[gancube] found Manufacturer Data under CIC = 0x" + h.toString(16).padStart(4, "0")); c = c.get(h); break a } DEBUG && console.log("[gancube] Looks like this cube has new unknown CIC"); c = void 0
                    } if (c && 6 <= c.byteLength) { f = []; for (h = 0; 6 > h; h++)f.push((c.getUint8(c.byteLength - h - 1) + 256).toString(16).slice(1)); r && r.removeEventListener("advertisementreceived", e); a.abort(); b(f.join(":")) }
                }; r.addEventListener("advertisementreceived", e); r.watchAdvertisements({ signal: a.signal }); setTimeout(function () {
                    r &&
                    r.removeEventListener("advertisementreceived", e); a.abort(); c(-2)
                }, 5E3)
            })
        } function f(a, b, c) {
            var e = JSON.parse(kernel.getProp("giiMacMap", "{}")), f = e[eb]; if (!f || a) f = prompt((b ? "The key provided might be wrong. " : "") + "MAC address (xx:xx:xx:xx:xx:xx) of your cube, can be found in CubeStation or about://bluetooth-internals/#devices", f || "xx:xx:xx:xx:xx:xx"); /^([0-9a-f]{2}[:-]){5}[0-9a-f]{2}$/i.exec(f) ? (f != e[eb] && (e[eb] = f, kernel.setProp("giiMacMap", JSON.stringify(e))), h(f, c)) : (logohint.push("Not a valid mac address, cannot connect to your Gan cube"),
                jb = null)
        } function h(a, b) { for (var c = [], e = 0; 6 > e; e++)c.push(parseInt(a.slice(3 * e, 3 * e + 2), 16)); var f = b || 0; e = JSON.parse(LZString.decompressFromEncodedURIComponent(ab[2 + 2 * f])); f = JSON.parse(LZString.decompressFromEncodedURIComponent(ab[3 + 2 * f])); for (var h = 0; 6 > h; h++)e[h] = (e[h] + c[5 - h]) % 255, f[h] = (f[h] + c[5 - h]) % 255; c = [e, f]; DEBUG && console.log("[gancube] ver=", b, " key=", JSON.stringify(c)); jb = $.aes128(c[0]); jb.iv = c[1] } function z(a) {
            var b = mathlib.valuedArray(20, 0); b[0] = a; if (hb) {
                a = b.slice(); if (null != jb) {
                    for (var c = jb.iv ||
                        [], e = 0; 16 > e; e++)a[e] ^= ~~c[e]; jb.encrypt(a); if (16 < a.length) { var f = a.length - 16, h = a.slice(f); for (e = 0; 16 > e; e++)h[e] ^= ~~c[e]; jb.encrypt(h); for (e = 0; 16 > e; e++)a[e + f] = h[e] }
                } DEBUG && console.log("[gancube] v2sendRequest", b, a); b = hb.writeValue((new Uint8Array(a)).buffer)
            } else DEBUG && console.log("[gancube] v2sendRequest cannot find v2write chrct"), b = void 0; return b
        } function Oa(a) {
            DEBUG && console.log("[gancube] v2init start"); Cb = 0; if (kb) {
                var b = JSON.parse(kernel.getProp("giiMacMap", "{}")), e = b[eb]; e && e.toUpperCase() ==
                    kb.toUpperCase() ? DEBUG && console.log("[gancube] v2init mac matched") : (DEBUG && console.log("[gancube] v2init mac updated"), b[eb] = kb, kernel.setProp("giiMacMap", JSON.stringify(b))); h(kb, a)
            } else f(!0, !1, a); return Sa.getCharacteristics().then(function (a) {
                DEBUG && console.log("[gancube] v2init find chrcts", a); for (var b = 0; b < a.length; b++) {
                    var e = a[b]; DEBUG && console.log("[gancube] v2init find chrct", e.uuid); c(e.uuid, "28be4cb6-cd67-11e9-a32f-2a2ae2dbcce4") ? Za = e : c(e.uuid, "28be4a4a-cd67-11e9-a32f-2a2ae2dbcce4") &&
                        (hb = e)
                } Za || DEBUG && console.log("[gancube] v2init cannot find v2read chrct")
            }).then(function () { DEBUG && console.log("[gancube] v2init v2read start notifications"); return Za.startNotifications() }).then(function () { DEBUG && console.log("[gancube] v2init v2read notification started"); return Za.addEventListener("characteristicvaluechanged", mb) }).then(function () { return z(5) }).then(function () { return z(4) }).then(function () { return z(9) })
        } function Pa() {
            var a = $.now(); DEBUG && console.log("[gancube]", "init cube state");
            bb(vb, qb, [null, a], eb); rb.fromFacelet(vb); Fb = yb; vb != kernel.getProp("giiSolved", mathlib.SOLVED_FACELET) && (a = kernel.getProp("giiRST"), ("a" == a || "p" == a && confirm(CONFIRM_GIIRST)) && giikerutil.markSolved())
        } function Va() { return 50 > pb ? Promise.resolve(!1) : fb.readValue().then(function (b) { b = a(b); for (var c = [], e = 0; e < b.length - 2; e += 3)for (var f = b[e ^ 1] << 16 | b[e + 1 ^ 1] << 8 | b[e + 2 ^ 1], h = 21; 0 <= h; h -= 3)c.push("URFDLB".charAt(f >> h & 7)), 12 == h && c.push("URFDLB".charAt(e / 3)); vb = c.join(""); pb = 0; if (-1 == Fb) Pa(); else return Promise.resolve(!0) }) }
        function y(a, b) {
            var c = yb - Fb & 255; DEBUG && 1 < c && console.log("[gancube]", "bluetooth event was lost, moveDiff = " + c); Fb = yb; pb += c; c > qb.length && (pb = 50, c = qb.length); for (var e = wb + zb, f = c - 1; 0 <= f; f--)e += nb[f]; 2E3 < Math.abs(a - e) && (DEBUG && console.log("[gancube]", "time adjust", a - e, "@", a), wb += a - e); for (f = c - 1; 0 <= f; f--)c = 3 * "URFDLB".indexOf(qb[f][0]) + " 2'".indexOf(qb[f][1]), mathlib.CubieCube.EdgeMult(rb, mathlib.CubieCube.moveCube[c], ub), mathlib.CubieCube.CornMult(rb, mathlib.CubieCube.moveCube[c], ub), wb += nb[f], bb(ub.toFaceCube(),
                qb.slice(f), [wb, 0 == f ? a : null], eb + (b ? "*" : "")), c = ub, ub = rb, rb = c, DEBUG && console.log("[gancube] move", qb[f], nb[f]); zb = a - wb
        } function db() {
            if (r) return Xa.readValue().then(function (b) {
                b = a(b); var c = $.now(); yb = b[12]; if (yb != Fb) {
                    qb = []; for (var e = 0; 6 > e; e++) { var f = b[13 + e]; qb.unshift("URFDLB".charAt(~~(f / 3)) + " 2'".charAt(f % 3)) } var h; return w.readValue().then(function (b) { h = b = a(b); return Va() }).then(function (a) {
                        if (!a) {
                            nb = []; for (var b = 0; 9 > b; b++)nb.unshift(h[2 * b + 1] | h[2 * b + 2] << 8); y(c, 0); a && rb.toFaceCube() != vb && (DEBUG &&
                                console.log("[gancube]", "Cube state check error"), DEBUG && console.log("[gancube]", "calc", rb.toFaceCube()), DEBUG && console.log("[gancube]", "read", vb), rb.fromFacelet(vb))
                        }
                    })
                }
            }).then(db)
        } function mb(a) { null != jb && cb(a.target.value) } function cb(b) {
            var c = $.now(); b = a(b); for (var e = 0; e < b.length; e++)b[e] = (b[e] + 256).toString(2).slice(1); b = b.join(""); e = parseInt(b.slice(0, 4), 2); if (1 != e) if (2 == e) {
                if (DEBUG && console.log("[gancube]", "v2 received move event", b), yb = parseInt(b.slice(4, 12), 2), yb != Fb) if (-1 == Fb) Fb = yb; else {
                    nb =
                    []; qb = []; var f = 0; for (e = 0; 7 > e; e++) { var h = parseInt(b.slice(12 + 5 * e, 17 + 5 * e), 2); nb[e] = parseInt(b.slice(47 + 16 * e, 63 + 16 * e), 2); qb[e] = "URFDLB".charAt(h >> 1) + " '".charAt(h & 1); 12 <= h && (qb[e] = "U ", f = 1) } Cb += f; 0 == f && y(c, 1)
                }
            } else if (4 == e) {
                if (DEBUG && console.log("[gancube]", "v2 received facelets event", b), yb = parseInt(b.slice(4, 12), 2), yb == Fb || -1 == Fb) {
                    f = new mathlib.CubieCube; h = 0; var n = 3840; for (e = 0; 7 > e; e++) { var r = parseInt(b.slice(12 + 3 * e, 15 + 3 * e), 2), w = parseInt(b.slice(33 + 2 * e, 35 + 2 * e), 2); n -= w << 3; n ^= r; f.ca[e] = w << 3 | r } f.ca[7] =
                        (n & 4088) % 24 | n & 7; for (e = 0; 11 > e; e++)r = parseInt(b.slice(47 + 4 * e, 51 + 4 * e), 2), w = parseInt(b.slice(91 + e, 92 + e), 2), h ^= r << 1 | w, f.ea[e] = r << 1 | w; f.ea[11] = h; 0 != f.verify() ? Cb++ : (vb = f.toFaceCube(), -1 == Fb ? Pa() : rb.toFaceCube() != vb && (DEBUG && console.log("[gancube]", "Cube state check error"), DEBUG && console.log("[gancube]", "calc", rb.toFaceCube()), DEBUG && console.log("[gancube]", "read", vb), rb.fromFacelet(vb), bb(vb, qb, [null, c], eb + "*")), Fb = yb)
                }
            } else if (5 == e) {
                DEBUG && console.log("[gancube]", "v2 received hardware info event", b);
                c = parseInt(b.slice(8, 16), 2) + "." + parseInt(b.slice(16, 24), 2); f = parseInt(b.slice(24, 32), 2) + "." + parseInt(b.slice(32, 40), 2); h = ""; for (e = 0; 8 > e; e++)h += String.fromCharCode(parseInt(b.slice(40 + 8 * e, 48 + 8 * e), 2)); b = 1 === parseInt(b.slice(104, 105), 2); DEBUG && console.log("[gancube]", "Hardware Version", c); DEBUG && console.log("[gancube]", "Software Version", f); DEBUG && console.log("[gancube]", "Device Name", h); DEBUG && console.log("[gancube]", "Gyro Enabled", b)
            } else 9 == e ? (DEBUG && console.log("[gancube]", "v2 received battery event",
                b), Eb = parseInt(b.slice(8, 16), 2), giikerutil.updateBattery([Eb, eb + "*"])) : DEBUG && console.log("[gancube]", "v2 received unknown event", b)
        } function lb() { Sa = Ya = gb = null; var a = Promise.resolve(); Za && (Za.removeEventListener("characteristicvaluechanged", mb), a = Za.stopNotifications()["catch"]($.noop), Za = null); kb = null; qb = []; nb = []; rb = new mathlib.CubieCube; ub = new mathlib.CubieCube; vb = mathlib.SOLVED_FACELET; wb = 0; Fb = -1; Eb = 100; return a } var gb, Ya, fb, Xa, w, n, Sa, Za, hb, ob = [1, 1281], jb = null, eb = null, kb = null, ab = "NoRgnAHANATADDWJYwMxQOxiiEcfYgSK6Hpr4TYCs0IG1OEAbDszALpA NoNg7ANATFIQnARmogLBRUCs0oAYN8U5J45EQBmFADg0oJAOSlUQF0g NoRgNATGBs1gLABgQTjCeBWSUDsYBmKbCeMADjNnXxHIoIF0g NoRg7ANAzBCsAMEAsioxBEIAc0Cc0ATJkgSIYhXIjhMQGxgC6QA NoVgNAjAHGBMYDYCcdJgCwTFBkYVgAY9JpJYUsYBmAXSA NoRgNAbAHGAsAMkwgMyzClH0LFcArHnAJzIqIBMGWEAukA".split(" "),
            qb = [], nb = [], rb = new mathlib.CubieCube, ub = new mathlib.CubieCube, vb = mathlib.SOLVED_FACELET, wb = 0, zb = 0, yb = -1, Fb = -1, pb = 1E3, Eb = 100, Cb = 0; $.parseV2Data = cb; return {
                init: function (a) {
                    lb(); eb = a.name; DEBUG && console.log("[gancube] init gan cube start"); return e().then(function (a) { DEBUG && console.log("[gancube] init, found cube bluetooth hardware MAC = " + a); kb = a }, function (a) { DEBUG && console.log("[gancube] init, unable to automatically determine cube MAC, error code = " + a) }).then(function () { return a.gatt.connect() }).then(function (a) { return a.getPrimaryServices() }).then(function (a) {
                        for (var e =
                            0; e < a.length; e++) { var f = a[e]; DEBUG && console.log("[gancube] checkHardware find service", f.uuid); c(f.uuid, "0000180a-0000-1000-8000-00805f9b34fb") ? Ya = f : c(f.uuid, "0000fff0-0000-1000-8000-00805f9b34fb") ? gb = f : c(f.uuid, "6e400001-b5a3-f393-e0a9-e50e24dc4179") && (Sa = f) } if (Sa) return Oa((eb || "").startsWith("AiCube") ? 1 : 0); if (gb && Ya) return b(); logohint.push("Not support your Gan cube")
                    })
                }, opservs: ["0000fff0-0000-1000-8000-00805f9b34fb", "0000180a-0000-1000-8000-00805f9b34fb", "6e400001-b5a3-f393-e0a9-e50e24dc4179"],
                cics: ob, getBatteryLevel: function () { return Sa ? Promise.resolve([Eb, eb + "*"]) : n ? n.readValue().then(function (b) { b = a(b); return Promise.resolve([b[7], eb]) }) : Promise.resolve([Eb, eb]) }, clear: lb
            }
    }(), a = function () {
        function a(a) {
            a = a.target.value; var c = $.now(); if (!(4 > a.byteLength) && 42 == a.getUint8(0) && 13 == a.getUint8(a.byteLength - 2) && 10 == a.getUint8(a.byteLength - 1)) {
                var e = a.getUint8(2), x = a.byteLength - 6; if (1 == e) for (e = 0; e < x; e += 2) {
                    var w = z[a.getUint8(3 + e) >> 1], n = [0, 2][a.getUint8(3 + e) & 1], Na = 3 * w + n; DEBUG && console.log("move",
                        "URFDLB".charAt(w) + " 2'".charAt(n)); mathlib.CubieCube.EdgeMult(lb, mathlib.CubieCube.moveCube[Na], cb); mathlib.CubieCube.CornMult(lb, mathlib.CubieCube.moveCube[Na], cb); mb = cb.toFaceCube(); bb(mb, ["URFDLB".charAt(w) + " 2'".charAt(n)], [c, c], h); w = cb; cb = lb; lb = w; 20 < ++Pa && (Pa = 0, f.writeValue((new Uint8Array([51])).buffer))
                } else if (2 == e) {
                    c = []; for (x = 0; 6 > x; x++)for (w = 9 * z[x], n = y[x], c[w + 4] = "BFUDRL".charAt(a.getUint8(3 + 9 * x)), e = 0; 8 > e; e++)c[w + Oa[(e + n) % 8]] = "BFUDRL".charAt(a.getUint8(3 + 9 * x + e + 1)); a = c.join(""); a != mb && (DEBUG &&
                        console.log("facelet", a), cb.fromFacelet(a))
                } else 3 != e && (5 == e ? (r = a.getUint8(3), DEBUG && console.log("battery level", r)) : 7 == e ? DEBUG && console.log("offline stats", b(a)) : 8 == e && DEBUG && console.log("cube type", b(a)))
            }
        } function b(a) { for (var b = [], c = 0; c < a.byteLength; c++)b.push(a.getUint8(c) >> 4 & 15), b.push(a.getUint8(c) & 15); return b } var c, e, f, h, r, z = [5, 2, 0, 3, 1, 4], Oa = [0, 1, 2, 5, 8, 7, 6, 3], y = [0, 0, 6, 2, 0, 0], Pa = 100, mb = mathlib.SOLVED_FACELET, cb = new mathlib.CubieCube, lb = new mathlib.CubieCube; return {
            init: function (b) {
                h = b.name.startsWith("GoCube") ?
                    "GoCube" : "Rubiks Connected"; return b.gatt.connect().then(function (a) { return a.getPrimaryService("6e400001-b5a3-f393-e0a9-e50e24dcca9e") }).then(function (a) { c = a; return c.getCharacteristic("6e400002-b5a3-f393-e0a9-e50e24dcca9e") }).then(function (a) { f = a; return c.getCharacteristic("6e400003-b5a3-f393-e0a9-e50e24dcca9e") }).then(function (a) { e = a; return e.startNotifications() }).then(function () { return e.addEventListener("characteristicvaluechanged", a) }).then(function () { return f.writeValue((new Uint8Array([51])).buffer) })
            },
            opservs: ["6e400001-b5a3-f393-e0a9-e50e24dcca9e"], getBatteryLevel: function () { f.writeValue((new Uint8Array([50])).buffer); return Promise.resolve([r, h]) }, clear: $.noop
        }
    }(), Pa = function () {
        function a(a, b) {
            if ("turn" == a) {
                var c = b.target.value, f = $.now(); if (!(1 > c.byteLength)) {
                    var h = c.getUint8(0); if (!(c.byteLength < 1 + 6 * h)) for (var r = 0; r < h; r++) {
                        var x = 1 + 6 * r, w = c.getUint8(x + 1) << 24 | c.getUint8(x + 0) << 16 | c.getUint8(x + 3) << 8 | c.getUint8(x + 2); w = Math.round(w / 65536 * 1E3); var n = c.getUint8(x + 4), Na = Math.round(c.getUint8(x + 5) / 36);
                        x = z[n]; Na = z[n] + Na; z[n] = (Na + 9) % 9; n = [3, 4, 5, 1, 2, 0][n]; if (5 <= x && 4 >= Na) x = 2; else if (4 >= x && 5 <= Na) x = 0; else continue; w += db; Na = 3 * n + x; DEBUG && console.log("move", "URFDLB".charAt(n) + " 2'".charAt(x)); mathlib.CubieCube.EdgeMult(y, mathlib.CubieCube.moveCube[Na], Pa); mathlib.CubieCube.CornMult(y, mathlib.CubieCube.moveCube[Na], Pa); Oa = Pa.toFaceCube(); bb(Oa, ["URFDLB".charAt(n) + " 2'".charAt(x)], [w, f], e); w = Pa; Pa = y; y = w
                    }
                }
            }
        } var b, e, f, h, r, z = [0, 0, 0, 0, 0, 0], Oa = mathlib.SOLVED_FACELET, Pa = new mathlib.CubieCube, y = new mathlib.CubieCube,
            db = 0; return {
                init: function (x) {
                    e = x.name; return x.gatt.connect().then(function (a) { return a.getPrimaryService("00001000-0000-1000-8000-00805f9b34fb") }).then(function (a) { b = a; return b.getCharacteristics() }).then(function (a) {
                        for (var b = 0; b < a.length; b++) {
                            var e = a[b]; DEBUG && console.log("[moyucube] init find chrct", e.uuid); c(e.uuid, "00001001-0000-1000-8000-00805f9b34fb") || (c(e.uuid, "00001002-0000-1000-8000-00805f9b34fb") ? f = e : c(e.uuid, "00001003-0000-1000-8000-00805f9b34fb") ? h = e : c(e.uuid, "00001004-0000-1000-8000-00805f9b34fb") &&
                                (r = e))
                        }
                    }).then(function () { f.addEventListener("characteristicvaluechanged", a.bind(null, "read")); h.addEventListener("characteristicvaluechanged", a.bind(null, "turn")); r.addEventListener("characteristicvaluechanged", a.bind(null, "gyro")); f.startNotifications(); h.startNotifications(); r.startNotifications() })
                }, opservs: ["00001000-0000-1000-8000-00805f9b34fb"], getBatteryLevel: $.noop, clear: $.noop
            }
    }(), f = function (a, b) {
        var c = Promise.resolve(); "disconnect" == a && (c = Promise.resolve(Oa())); return c.then(function () {
            return "function" ==
                typeof h && h(a, b)
        })
    }.bind(null, "disconnect"), bb = $.noop, h = $.noop; return {
        init: function (c) {
            if (!window.navigator || !window.navigator.bluetooth) return alert("Bluetooth API is not available. Ensure https access, and try chrome with chrome://flags/#enable-experimental-web-platform-features enabled"), Promise.reject(); c = Promise.resolve(!0); window.navigator.bluetooth.getAvailability && (c = window.navigator.bluetooth.getAvailability()); return c.then(function (c) {
                DEBUG && console.log("[bluetooth]", "is available", c);
                return c ? window.navigator.bluetooth.requestDevice({ filters: [{ namePrefix: "Gi" }, { namePrefix: "Mi Smart" }, { namePrefix: "GAN" }, { namePrefix: "MG" }, { namePrefix: "AiCube" }, { namePrefix: "GoCube" }, { namePrefix: "Rubiks" }, { namePrefix: "MHC" }], optionalServices: [].concat(b.opservs, e.opservs, a.opservs, Pa.opservs), optionalManufacturerData: [].concat(e.cics) }) : Promise.reject("Bluetooth is not available. Ensure HTTPS access, and check bluetooth is enabled on your device")
            }).then(function (c) {
                DEBUG && console.log("[bluetooth]",
                    c); r = c; c.addEventListener("gattserverdisconnected", f); return c.name.startsWith("Gi") || c.name.startsWith("Mi Smart Magic Cube") ? (z = b, b.init(c)) : c.name.startsWith("GAN") || c.name.startsWith("MG") || c.name.startsWith("AiCube") ? (z = e, e.init(c)) : c.name.startsWith("GoCube") || c.name.startsWith("Rubiks") ? (z = a, a.init(c)) : c.name.startsWith("MHC") ? (z = Pa, Pa.init(c)) : Promise.reject("Cannot detect device type")
            })
        }, stop: Oa, isConnected: function () { return null != r }, setCallback: function (a) { bb = a }, setEventCallback: function (a) {
            h =
            a
        }, getCube: function () { return z }
    }
}); var GanTimerState = {}; GanTimerState[GanTimerState.DISCONNECT = 0] = "DISCONNECT"; GanTimerState[GanTimerState.GET_SET = 1] = "GET_SET"; GanTimerState[GanTimerState.HANDS_OFF = 2] = "HANDS_OFF"; GanTimerState[GanTimerState.RUNNING = 3] = "RUNNING"; GanTimerState[GanTimerState.STOPPED = 4] = "STOPPED"; GanTimerState[GanTimerState.IDLE = 5] = "IDLE"; GanTimerState[GanTimerState.HANDS_ON = 6] = "HANDS_ON"; GanTimerState[GanTimerState.FINISHED = 7] = "FINISHED";
var GanTimerDriver = execMain(function () {
    function c(a) { var b = []; if (a) for (var c = 0; c < a.byteLength; c++)b.push(a.getUint8(c).toString(16).padStart(2, "0")); return b.join(" ") } function Oa(b) {
        b = b.target.value; try { if (b && 0 != b.byteLength && 254 == b.getUint8(0)) { var e = b.getUint16(b.byteLength - 2, !0), f = b.buffer.slice(2, b.byteLength - 2), r = new DataView(f); f = 65535; for (var z = 0; z < r.byteLength; ++z) { f ^= r.getUint8(z) << 8; for (var x = 0; 8 > x; ++x)f = 0 < (f & 32768) ? f << 1 ^ 4129 : f << 1 } var Oa = e == (f & 65535) } else Oa = !1 } catch (Ua) { Oa = !1 } Oa ? "function" ==
            typeof a && (Oa = a, e = { state: b.getUint8(3) }, e.state == GanTimerState.STOPPED && (r = b.getUint8(4), f = b.getUint8(5), b = b.getUint16(6, !0), e.recordedTime = { minutes: r, seconds: f, milliseconds: b, asTimestamp: 6E4 * r + 1E3 * f + b }), Oa(e)) : console.log("[GanTimerDriver] Invalid event data received from Timer: " + c(b))
    } function z() { b().then(function () { "function" == typeof a && a({ state: GanTimerState.DISCONNECT }) }) } function r(a) {
        var b = new AbortController; return new Promise(function (c, e) {
            if (a.watchAdvertisements) {
                var f = function (e) {
                    DEBUG &&
                    console.log("[GanTimerDriver] received advertisement packet from device", e); delete a.stopWaiting; a.removeEventListener("advertisementreceived", f); b.abort(); c(a)
                }; a.stopWaiting = function () { DEBUG && console.log("[GanTimerDriver] cancel waiting for device advertisements"); delete a.stopWaiting; a.removeEventListener("advertisementreceived", f); b.abort() }; a.addEventListener("advertisementreceived", f); a.watchAdvertisements({ signal: b.signal }); DEBUG && console.log("[GanTimerDriver] start waiting for device advertisement packet")
            } else e("Bluetooth Advertisements API is not supported by this browser")
        })
    }
    function b() { e && e.stopWaiting && e.stopWaiting(); return Pa ? (DEBUG && console.log("[GanTimerDriver] disconnecting from timer device"), Pa.service.device.removeEventListener("gattserverdisconnected", z), Pa.removeEventListener("characteristicvaluechanged", Oa), Pa.stopNotifications()["catch"]($.noop)["finally"](function () { Pa.service.device.gatt.disconnect(); Pa = void 0 })) : Promise.resolve() } var e, a, Pa; return {
        connect: function (a) {
            if (!window.navigator.bluetooth) return Promise.reject("Bluetooth API is not supported by this browser. Try fresh Chrome version!");
            var b = Promise.resolve(!0); window.navigator.bluetooth.getAvailability && (b = window.navigator.bluetooth.getAvailability()); return b.then(function (a) { if (!a) return Promise.reject("Bluetooth is not available. Ensure HTTPS access, and check bluetooth is enabled on your device") }).then(function () { DEBUG && console.log("[GanTimerDriver] requesting for bluetooth device, reconnect = " + !!a); return e && a ? r(e) : navigator.bluetooth.requestDevice({ filters: [{ namePrefix: "GAN" }, { namePrefix: "gan" }, { namePrefix: "Gan" }], optionalServices: ["0000fff0-0000-1000-8000-00805f9b34fb"] }) }).then(function (a) {
                DEBUG &&
                console.log("[GanTimerDriver] connecting to GATT server"); e = a; a.addEventListener("gattserverdisconnected", z); return a.gatt.connect()
            }).then(function (a) { DEBUG && console.log("[GanTimerDriver] getting timer primary service"); return a.getPrimaryService("0000fff0-0000-1000-8000-00805f9b34fb") }).then(function (a) { DEBUG && console.log("[GanTimerDriver] getting timer state characteristic"); return a.getCharacteristic("0000fff5-0000-1000-8000-00805f9b34fb") }).then(function (a) {
                DEBUG && console.log("[GanTimerDriver] start listening to state characteristic value updates");
                Pa = a; Pa.addEventListener("characteristicvaluechanged", Oa); Pa.startNotifications()
            })
        }, isConnected: function () { return !!Pa }, disconnect: b, setStateUpdateCallback: function (b) { a = b }
    }
}); var csTimerWorker = execBoth(function () { if (!window.Worker) return {}; var c = new Worker("js/cstimer.js"), Oa = {}, z = 0; c.onmessage = function (c) { c = c.data; var b = Oa[c[0]]; delete Oa[c[0]]; b && b(c[2]) }; c.postMessage([0, "set", ["SCRAMBLE_NOOBST", SCRAMBLE_NOOBST]]); c.postMessage([0, "set", ["SCRAMBLE_NOOBSS", SCRAMBLE_NOOBSS]]); return { getScramble: function (r, b) { ++z; Oa[z] = b; c.postMessage([z, "scramble", r]); return z } } }, function () {
    self.onmessage = function (c) {
        var Oa = c.data; c = Oa[0]; var z = Oa[1]; Oa = Oa[2]; var r = void 0; switch (z) {
            case "scramble": r =
                scrMgr.scramblers[Oa[0]]; r = r.apply(r, Oa); break; case "set": self[Oa[0]] = Oa[1]
        }postMessage([c, z, r])
    }; "undefined" !== typeof module && "undefined" !== typeof module.exports && (module.exports = { getScrambleTypes: function () { var c = [], Oa; for (Oa in scrMgr.scramblers) c.push(Oa); return c }, getScramble: function () { var c = scrMgr.scramblers[arguments[0]]; return c.apply(c, arguments) }, setGlobal: function (c, Oa) { self[c] = Oa } })
});
