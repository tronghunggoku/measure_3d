(function anonymous() {
    function G(a) {
        return "boolean" == typeof a ? a : 0 <= "yesontrue1".indexOf(String(a).toLowerCase())
    }
    function d(a, c, d, r, f) {
        3 == a || 4 == a || 5 == a ? b[c] = d : b.registerattribute(c, d, r, f);
        M.push(c)
    }
    function h(a, b, c, d) {
        a.addEventListener(b, c, d);
        N.push({
            obj: a,
            eventname: b,
            callback: c,
            capture: d
        })
    }
    function E(a) {
        var b, c = N.length, d;
        for (b = 0; b < c; b++)
            if (d = N[b],
            null == a || d.obj === a)
                d.obj.removeEventListener(d.eventname, d.callback, d.capture),
                N.splice(b, 1),
                b--,
                c--
    }
    function sa() {
        function a(a) {
            p = !0;
            0 < n && (q.seek(n),
            n = -1)
        }
        function d(a) {
            f && e && (V(e.src + " - loading failed"),
            e = null)
        }
        function H(a) {
            0 == y && (z(),
            q.paused = g = !0,
            I(null),
            0 == b.iscomplete && (b.iscomplete = !0,
            b.triggerevent("onvideocomplete")))
        }
        function r() {
            if (f && c && !(2 > c.readyState)) {
                var a = m.timertick
                  , d = 0
                  , w = Number(c.duration);
                isNaN(w) || 0 >= w || (e ? (g && !e.paused ? e.pause() : !g && e.paused && e.play(),
                d = e.currentTime) : g ? d = x : (0 == A && (A = a),
                d = x + J * Math.max(0, (a - A) / 1E3)),
                d >= w - .02 ? (d = w,
                y ? (x = 0,
                A = a + .1,
                e && (e.currentTime = 0)) : (z(),
                q.paused = g = !0,
                I(null),
                0 == b.iscomplete && (b.iscomplete = !0,
                b.triggerevent("onvideocomplete")))) : b.iscomplete = !1,
                B = d,
                .01 < Math.abs(c.currentTime - B) && (c.currentTime = Number(B.toFixed(2))),
                c.autoplay = !0)
            }
        }
        var q = this
          , g = q.paused = !0
          , k = null
          , e = null
          , l = null
          , p = !1
          , n = -1
          , A = 0
          , x = 0;
        (function() {
            if (!0 !== window.krpanoHideiPhoneMediaControlsStyle) {
                window.krpanoHideiPhoneMediaControlsStyle = !0;
                var a = document.createElement("style");
                a.type = "text/css";
                a.innerHTML = "*::-webkit-media-controls-panel{display: none!important;-webkit-appearance:none;} *::--webkit-media-controls-play-button{display: none!important;-webkit-appearance:none;} *::-webkit-media-controls-start-playback-button{display: none!important;-webkit-appearance:none;}";
                document.getElementsByTagName("head")[0].appendChild(a)
            }
        }
        )();
        q.start = function() {
            b.iPhoneMode = !0;
            c.autoplay = !0;
            c.pause();
            c.style.webkitMediaControls = !1;
            var f = ca(b.videourl, ["m4a", "mp3"])
              , f = m.parsePath(f);
            n = -1;
            f ? (null == e && (l ? (e = l,
            l = null) : e = document.createElement("audio")),
            E(e),
            h(e, "canplay", a, !0),
            h(e, "error", d, !0),
            h(e, "ended", H, !0),
            e.loop = y,
            p = e.autoplay = !1,
            e.src = f,
            e.load(),
            e.pause()) : e && (e.src && (e.pause(),
            l = e),
            e = null);
            A = x = 0;
            g = b.pausedonstart;
            q.paused = g;
            k = setInterval(r, 1E3 / 60);
            c.currentTime = 0
        }
        ;
        q.play_audio = function() {
            e && e.play()
        }
        ;
        q.play = function() {
            1 == g && (g = q.paused = !1,
            b.iscomplete ? (b.iscomplete = !1,
            x = 0,
            e && (e.currentTime = 0)) : x = c.currentTime,
            A = m.timertick + .1,
            e && e.play(),
            I(null))
        }
        ;
        q.pause = function() {
            0 == g && (e && e.pause(),
            x = c.currentTime,
            g = q.paused = !0,
            I(null))
        }
        ;
        q.seek = function(a) {
            e ? p ? (e.currentTime = a,
            n = -1) : n = a : (n = -1,
            A = 0,
            x = a)
        }
        ;
        q.remove = function() {
            k && (clearInterval(k),
            k = null);
            e && (e.src && (e.pause(),
            l = e),
            e = null)
        }
        ;
        q.setplaybackrate = function(a) {
            if (e)
                try {
                    e.playbackRate = a
                } catch (b) {}
        }
        ;
        q.setloop = function(a) {
            e && (e.loop = a)
        }
        ;
        q.need_touchstart_play = function() {
            return null != e && e.paused
        }
        ;
        q.try_touchstart_play = function() {
            return e ? (e.play(),
            0 == e.paused) : !0
        }
    }
    function V(a) {
        if (m && b) {
            var c = b ? b.onerror : null;
            null != c && "" != c && "null" != ("" + c).toLowerCase() ? (b.videoerror = a,
            b.triggerevent("onerror")) : m.trace(3, a + "!")
        }
    }
    function da(a) {
        var c = G(b.html5controls);
        a = a.style;
        a.pointerEvents = c ? "auto" : "none";
        a.position = "absolute";
        a.width = "100%";
        a.height = "100%";
        a.left = 0;
        a.top = 0;
        a.opacity = 1;
        a.backgroundColor = "transparent";
        a[K] = "translateZ(0)";
        a[K + "Origin"] = "0 0";
        c && k.ie && 0 == b.capture && (b.capture = !0)
    }
    function ea() {
        var a = null
          , a = document.createElement("video");
        if (!a || !a.play)
            return null;
        da(a);
        return a
    }
    function W(a) {
        b && (a = document.visibilityState,
        !0 === document.hidden || "hidden" == a || "prerender" == a || "unloaded" == a ? 0 == b.ispaused && b.autopause && 0 == b.isautopaused && (b.isautopaused = !0,
        z()) : b.autoresume && b.isautopaused && (b.isautopaused = !1,
        O()))
    }
    function fa(a, c) {
        b.registercontentsize(a, c);
        b.forceresize = !0;
        b.videowidth = a;
        b.videoheight = c;
        b.havevideosize = !0;
        b.isvideoready = !0;
        b.current_videourl = v;
        if (b.onvideoreadyCB)
            b.onvideoreadyCB();
        b.triggerevent("onvideoready")
    }
    function ca(a, c) {
        C = null;
        var d = ("" + a).split("|");
        if (1 < d.length || c) {
            var f = p;
            c && (f = c);
            var g = f.length, h = d.length, m, e, k = [];
            for (m = 0; m < h; m++)
                if (e = d[m]) {
                    var l = e;
                    if (0 != e.indexOf("rtmp:")) {
                        var n = e.indexOf("?");
                        0 < n && (e = e.slice(0, n));
                        n = e.indexOf("#");
                        0 < n && (e = e.slice(0, n));
                        n = e.lastIndexOf(".");
                        if (1 < n)
                            for (n = ("" + e.slice(n + 1)).toLowerCase(),
                            e = 0; e < g; e++)
                                if (n == f[e]) {
                                    if (c)
                                        return l;
                                    k.push({
                                        type: n,
                                        inorder: m,
                                        url: l,
                                        used: !1
                                    });
                                    break
                                }
                    }
                }
            if (c)
                return null;
            if (0 < k.length)
                return "" != b.preferredformat && k.sort(function(a, c) {
                    var d = a.type
                      , e = c.type
                      , f = "m3u" == d || "m3u8" == d ? 0 : "mp4" == d || "m4v" == d ? 1 : "webm" == d ? 2 : 3
                      , w = "m3u" == e || "m3u8" == e ? 0 : "mp4" == e || "m4v" == e ? 1 : "webm" == e ? 2 : 3
                      , g = ("" + b.preferredformat).toLowerCase();
                    "" != g && (d == g && (f = -1),
                    e == g && (w = -1));
                    return f > w ? 1 : f < w ? -1 : a.inorder > c.inorder ? 1 : a.inorder < c.inorder ? -1 : 0
                }),
                C = k,
                ga()
        }
        return a
    }
    function ga() {
        if (C) {
            var a, c;
            c = C.length;
            for (a = 0; a < c; a++)
                if (0 == C[a].used)
                    return C[a].used = !0,
                    C[a].url
        }
        return null
    }
    function X(a, c) {
        var b = !0;
        if (!k.android || !k.chrome) {
            var d = c.indexOf("://");
            if (0 < d) {
                var f = document.domain
                  , d = c.slice(d + 3, c.indexOf("/", d + 3));
                location.port && (f += ":" + location.port);
                f == d && (b = !1)
            }
        }
        b && ((b = m.security.cors) && "" != b || (b = "anonymous"),
        a.crossOrigin = b)
    }
    function ha(a, d, H, r) {
        b.videourl = void 0 === a || null == a || "" == a || "null" == ("" + a).toLowerCase() ? null : a;
        b.posterurl = void 0 === d || null == d || "" == d || "null" == ("" + d).toLowerCase() ? null : d;
        b.pausedonstart = G(H);
        r = Number(r);
        if (isNaN(r) || 0 > r)
            r = 0;
        B = r;
        t = 0 < r ? r : -1;
        0 < t && (b.posterurl = null);
        a = ca(b.videourl);
        v = a = m.parsePath(a);
        b.isvideoready = !1;
        b.havevideosize = !1;
        b.isautopaused = !1;
        b.isvideoready = !1;
        b.isseeking = 0 < t && null == f;
        b.iscomplete = !1;
        b.ispaused = !0;
        b.loadedbytes = 0;
        b.totalbytes = 0;
        b.totaltime = 0;
        b.videoerror = "";
        null != a && (c && c.src ? f ? f.pause() : c.pause() : null == c && (c = ea(),
        b.videoDOM = c,
        Y(c)),
        b.posterurl && (b.pausedonstart || k.mobile || k.tablet) ? (null == g && (g = document.createElement("img"),
        h(g, "error", ta, !1),
        h(g, "load", ua, !1)),
        a = b.posterurl,
        Z = a = m.parsePath(a),
        X(g, a),
        g.src = a) : ia())
    }
    function ta(a) {
        c && V(Z + " - loading failed")
    }
    function ua(a) {
        if (c) {
            a = g.naturalWidth;
            var d = g.naturalHeight;
            da(g);
            b.sprite && b.sprite.appendChild(g);
            b.posterDOM = g;
            fa(a, d);
            ia()
        }
    }
    function ia() {
        c && c.src || !ja || 0 != aa || (c.src = "data:",
        0 == F && (F = !0,
        b.userinteractionworkarounds && (h(D(), "touchstart", ka, !0),
        h(D(), "touchend", ka, !0)),
        b.needuserinteraction = !0,
        b.triggerevent("onneedtouch"),
        b.triggerevent("onneeduserinteraction")));
        E(c);
        u && (clearInterval(u),
        u = null);
        f && f.remove();
        h(c, "loadedmetadata", l, !1);
        h(c, "loadeddata", l, !1);
        h(c, "canplay", l, !1);
        h(c, "canplaythrough", l, !1);
        h(c, "play", l, !1);
        h(c, "pause", l, !1);
        h(c, "playing", l, !1);
        h(c, "seeking", l, !1);
        h(c, "waiting", l, !1);
        h(c, "seeked", l, !1);
        h(c, "stalled", l, !1);
        h(c, "suspend", l, !1);
        h(c, "ended", l, !1);
        h(c, "timeupdate", l, !1);
        h(c, "emptied", l, !1);
        h(c, "progress", P, !1);
        k.ios && (u = setInterval(P, 500));
        h(c, "error", va, !1);
        c.loop = b.loop;
        c.autoplay = b.pausedonstart ? !1 : !0;
        c.preload = b.html5preload;
        c.controls = b.html5controls;
        b.playsinline && (c.setAttribute("playsinline", ""),
        c.setAttribute("webkit-playsinline", ""));
        c.setAttribute("x5-video-player-type", "h5");
        la(Q);
        ma(R);
        na(J);
        oa(S);
        X(c, v);
        c.src = v;
        c.load();
        f ? f.start() : b.pausedonstart ? c.pause() : T(c)
    }
    function Y(a) {
        k.ios && (null == a || a && !0 !== a.paused) && (m.iOS_current_video = a)
    }
    function va(a) {
        if (c) {
            a = null;
            a = c.error ? c.error.code : 0;
            if (3 <= a) {
                var b = ga();
                if (b) {
                    v = a = m.parsePath(b);
                    X(c, v);
                    c.src = v;
                    c.load();
                    return
                }
            }
            switch (a) {
            case 1:
                a = "video loading aborted";
                break;
            case 2:
                a = "network loading error";
                break;
            case 3:
                a = "video decoding failed (corrupted data or unsupported codec)";
                break;
            case 4:
                a = "loading video failed";
                break;
            default:
                a = "unknown error"
            }
            a && V(v + " - " + a)
        }
    }
    function P(a) {
        null != u && a && "progress" == a.type && (clearInterval(u),
        u = null);
        if (c && c.buffered) {
            var d, f;
            d = c.buffered.length;
            f = c.duration;
            if (0 < f && (b.totaltime = f,
            0 < d)) {
                var g = 0;
                for (a = 0; a < d; a++) {
                    var h = c.buffered.end(a);
                    h > g && (g = h)
                }
                b.loadedbytes = 1048576 * g | 0;
                b.totalbytes = 1048576 * f | 0
            }
        }
    }
    function l(a) {
        if (c) {
            if (0 == b.havevideosize) {
                var d = c.videoWidth
                  , g = c.videoHeight;
                0 < d && 0 < g && fa(d, g)
            }
            switch (a.type) {
            case "loadedmetadata":
            case "loadeddata":
                0 < t && L(t);
                P();
                break;
            case "canplay":
            case "canplaythrough":
                0 < t && L(t);
                P();
                null == f ? 0 == b.pausedonstart && c.paused && 1 != b.needuserinteraction && T(c) : 0 == b.pausedonstart && f.need_touchstart_play() && (f.play_audio(),
                (c.paused && !f || f && f.need_touchstart_play()) && pa());
                break;
            case "seeking":
            case "seeked":
                b.isseeking = f ? !1 : "seeking" == a.type,
                0 < t && "seeked" == a.type && c.currentTime > t - .5 && (t = -1);
            case "play":
            case "pause":
            case "playing":
            case "waiting":
            case "stalled":
            case "suspend":
            case "ended":
            case "timeupdate":
                I(a)
            }
        }
    }
    function I(a) {
        a = !1;
        g && 2 <= c.readyState && (0 == c.paused || f && 0 == f.paused) && (a = !0,
        k.chromemobile && 0 == c.currentTime && (a = !1));
        a && (E(g),
        g.parentNode && g.parentNode.removeChild(g),
        g = Z = b.posterDOM = null);
        b.isvideoready && (a = f ? f : c,
        b.ispaused != a.paused && (0 == a.paused ? (b.ispaused = !1,
        b.triggerevent("onvideoplay")) : (b.ispaused = !0,
        b.triggerevent("onvideopaused"))),
        null == f && b.iscomplete != c.ended && (1 == c.ended ? (z(),
        0 == b.iscomplete && (b.iscomplete = !0,
        b.triggerevent("onvideocomplete"))) : b.iscomplete = !1))
    }
    function D() {
        return document.body ? document.body : document
    }
    function ka(a) {
        c && (c.src = v,
        ba())
    }
    function pa() {
        0 == F && (F = !0,
        b.userinteractionworkarounds && (h(D(), "touchstart", U, !0),
        h(D(), "touchend", U, !0),
        h(D(), "mousedown", U, !0),
        h(D(), "mouseup", U, !0)),
        b.needuserinteraction = !0,
        b.triggerevent("onneedtouch"),
        b.triggerevent("onneeduserinteraction"))
    }
    function ba() {
        F && (F = !1,
        E(D()),
        b.needuserinteraction = !1,
        b.triggerevent("ongottouch"),
        b.triggerevent("ongotuserinteraction"))
    }
    function wa(a, c, b) {
        var d = a.play();
        if (void 0 !== d)
            d.then(function() {
                null != c && c(a)
            })["catch"](function(c) {
                null != b && b(a)
            });
        else
            0 == a.paused ? null != c && c(a) : (f && f.need_touchstart_play(),
            null != b && b(a))
    }
    function T(a, b) {
        wa(a, function(a) {
            ba();
            c == a && (Y(c),
            null != b && b(c, !0))
        }, function() {
            pa();
            null != b && b(a, !1)
        })
    }
    function U(a) {
        c && (qa = m.timertick,
        f ? f.try_touchstart_play() : T(c))
    }
    function xa(a) {
        y = G(a);
        c && (c.loop = y);
        f && f.setloop(a)
    }
    function ya() {
        return y
    }
    function za(a) {
        L(a)
    }
    function Aa() {
        if (c) {
            var a = Number(c.currentTime);
            if (!isNaN(a))
                return a
        }
        return B
    }
    function la(a) {
        a = Number(a);
        isNaN(a) ? a = 1 : 0 > a ? a = 0 : 1 < a && (a = 1);
        Q = a;
        c && (c.volume = a)
    }
    function Ba() {
        return Q
    }
    function ma(a) {
        R = a;
        c && (c.muted = a)
    }
    function Ca() {
        return R
    }
    function na(a) {
        a = Number(a);
        if (isNaN(a) || 0 == a)
            a = 1;
        J = a;
        if (c)
            try {
                c.playbackRate = a
            } catch (b) {}
        f && f.setplaybackrate(a)
    }
    function Da() {
        return J
    }
    function oa(a) {
        S = a = G(a);
        c && k.safari && (c.airplay = c["x-webkit-airplay"] = a ? "allow" : "disallow")
    }
    function Ea() {
        return S
    }
    function O() {
        f ? f.play() : c && T(c);
        b.pausedonstart = !1
    }
    function z() {
        f ? f.pause() : c && c.pause();
        b.pausedonstart = !0;
        ba()
    }
    function Fa() {
        var a = m.timertick - qa;
        !c.paused && 200 > a || c && (0 == c.paused || f && 0 == f.paused ? z() : O())
    }
    function L(a) {
        if (c && c.src) {
            var b = 0
              , b = 0 < ("" + a).indexOf("%") && 0 < c.duration ? parseFloat(a) / 100 * c.duration : Number(a);
            isNaN(b) || (f ? f.seek(b) : c.currentTime = b)
        }
    }
    function Ga() {
        L(0);
        z()
    }
    function ra() {
        c && (c.pause(),
        f && f.remove(),
        E(c),
        g && g.parentNode && g.parentNode.removeChild(g),
        c && c.parentNode && c.parentNode.removeChild(c),
        b.videoDOM = null,
        b.posterDOM = null,
        b.iPhoneMode = !1,
        Y(null),
        c = g = null,
        b.videourl = null,
        b.isvideoready = !1,
        b.ispaused = !0,
        b.iscomplete = !1,
        b.isseeking = !1,
        b.isautopaused = !1,
        b.havevideosize = !1,
        b.videowidth = 0,
        b.videoheight = 0,
        b.loadedbytes = 0,
        b.totalbytes = 0,
        b.totaltime = 0,
        b.videoerror = "",
        B = 0)
    }
    this.name = "Videoplayer";
    this.version = "1.20.9";
    this.build = "2020-11-19";
    var m = null
      , k = null
      , b = null
      , c = null
      , g = null
      , Z = null
      , v = null
      , C = null
      , p = []
      , K = "transform"
      , f = null
      , t = -1
      , F = !1
      , u = null
      , aa = !1
      , ja = !1
      , y = !1
      , Q = 1
      , R = !1
      , J = 1
      , S = !1
      , B = 0
      , M = []
      , N = [];
    this.registerplugin = function(a, l, H) {
        m = a;
        k = m.device;
        b = H;
        "1.20" > m.version || "2019-09-01" > m.build ? m.trace(3, "Videoplayer plugin - too old krpano version (min. 1.20)") : (K = m.browser.css.transform,
        (c = ea()) ? (void 0 !== c.canPlayType ? (c.canPlayType("video/mp4").match(/maybe|probably/i) && (p.push("mp4"),
        p.push("m4v"),
        p.push("mov"),
        p.push("3gp")),
        c.canPlayType("video/webm").match(/maybe|probably/i) && p.push("webm"),
        c.canPlayType("video/ogg").match(/maybe|probably/i) && (p.push("ogg"),
        p.push("ogv")),
        c.canPlayType("video/hls").match(/maybe|probably/i) && (p.push("m3u"),
        p.push("m3u8"))) : (p.push("mp4"),
        p.push("mov")),
        d(0, "videourl", null),
        d(0, "altvideourl", null),
        d(0, "posterurl", null),
        d(0, "panovideo", !1),
        d(0, "use_as_videopano", !1),
        d(0, "pausedonstart", !1),
        d(0, "autopause", !0),
        d(0, "autoresume", !1),
        d(0, "preferredformat", ""),
        d(0, "playsinline", !0),
        d(0, "iphoneworkarounds", !0),
        d(0, "userinteractionworkarounds", !0),
        d(1, "touchworkarounds", b.userinteractionworkarounds, function(a) {
            b.userinteractionworkarounds = a
        }, function() {
            return b.userinteractionworkarounds
        }),
        d(0, "html5controls", !1),
        d(0, "html5preload", "auto"),
        d(1, "loop", y, xa, ya),
        d(1, "time", B, za, Aa),
        d(1, "volume", Q, la, Ba),
        d(1, "muted", R, ma, Ca),
        d(1, "playbackrate", J, na, Da),
        d(1, "airplay", S, oa, Ea),
        d(2, "onvideoready", null),
        d(2, "onvideoplay", null),
        d(2, "onvideopaused", null),
        d(2, "onvideocomplete", null),
        d(2, "onerror", null),
        d(2, "onneedtouch", null),
        d(2, "ongottouch", null),
        d(2, "onneeduserinteraction", null),
        d(2, "ongotuserinteraction", null),
        d(3, "playvideo", ha),
        d(3, "play", O),
        d(3, "resume", O),
        d(3, "pause", z),
        d(3, "togglepause", Fa),
        d(3, "seek", L),
        d(3, "stop", Ga),
        d(3, "closevideo", ra),
        d(4, "isvideoready", !1),
        d(4, "iswaiting", !1),
        d(4, "ispaused", !0),
        d(4, "iscomplete", !1),
        d(4, "isseeking", !1),
        d(4, "isautopaused", !1),
        d(4, "havevideosize", !1),
        d(4, "needuserinteraction", !1),
        d(1, "needtouch", b.needuserinteraction, function(a) {
            b.needuserinteraction = a
        }, function() {
            return b.needuserinteraction
        }),
        d(4, "videowidth", 0),
        d(4, "videoheight", 0),
        d(4, "loadedbytes", 0),
        d(4, "totalbytes", 0),
        d(4, "totaltime", 0),
        d(4, "videoerror", ""),
        d(5, "videoDOM", c),
        d(5, "posterDOM", g),
        d(5, "iPhoneMode", !1),
        h(window, "pagehide", W, !1),
        h(window, "pageshow", W, !1),
        h(document, "visibilitychange", W, !1),
        ja = k.ios && k.iphone && 10 <= k.iosversion,
        aa = window.matchMedia("(-webkit-video-playable-inline)").matches,
        k.iphone && 1 == b.iphoneworkarounds && 0 == aa && (f = new sa),
        b.sprite && (0 == b.use_as_videopano && 0 == b.panovideo || !k.panovideosupport) && !0 !== b.renderToBitmap && b.sprite.appendChild(c),
        ha(b.altvideourl ? b.altvideourl : b.videourl, b.posterurl, b.pausedonstart, b.time)) : m.trace(2, "Videoplayer plugin - HTML5 video is not supported by this browser!"))
    }
    ;
    this.unloadplugin = function() {
        ra();
        var a, c = M.length;
        for (a = 0; a < c; a++)
            delete b[M[a]];
        M = null;
        E(null);
        u && (clearInterval(u),
        u = null);
        m = k = b = null
    }
    ;
    this.onresize = function(a, d) {
        if (c && b && !0 !== b.renderToBitmap) {
            var f = c.videoWidth
              , h = c.videoHeight;
            if (0 < f && 0 < h) {
                if (G(b.html5controls))
                    var k = b.imagewidth / f
                      , f = f * k
                      , h = h * k;
                var k = f + "px"
                  , l = h + "px"
                  , p = "hotspot" == b._type && b.distorted ? 1 : m.stagescale
                  , f = "translateZ(0) scale(" + a * p / f + "," + d * p / h + ")";
                g && (k != g.style.width && (g.style.width = k),
                l != g.style.width && (g.style.height = l),
                g.style[K] = f);
                k != c.style.width && (c.style.width = k);
                l != c.style.height && (c.style.height = l);
                c.style[K] = f
            }
        }
        return !1
    }
    ;
    var qa = 0
}
)
