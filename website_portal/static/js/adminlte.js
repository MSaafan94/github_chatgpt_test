!(function (e, t) {
    "object" == typeof exports && "undefined" != typeof module
        ? t(exports, require("jquery"))
        : "function" == typeof define && define.amd
        ? define(["exports", "jquery"], t)
        : t(((e = "undefined" != typeof globalThis ? globalThis : e || self).adminlte = {}), e.jQuery);
})(this, function (e, t) {
    "use strict";
    function a(e) {
        return e && "object" == typeof e && "default" in e ? e : { default: e };
    }
    var n = a(t),
        i = "CardRefresh",
        o = "lte.cardrefresh",
        s = n.default.fn[i],
        l = "card",
        r = '[data-card-widget="card-refresh"]',
        d = {
            source: "",
            sourceSelector: "",
            params: {},
            trigger: r,
            content: ".card-body",
            loadInContent: !0,
            loadOnInit: !0,
            responseType: "",
            overlayTemplate: '<div class="overlay"><i class="fas fa-2x fa-sync-alt fa-spin"></i></div>',
            onLoadStart: function () {},
            onLoadDone: function (e) {
                return e;
            },
        },
        f = (function () {
            function e(e, t) {
                if (
                    ((this._element = e),
                    (this._parent = e.parents(".card").first()),
                    (this._settings = n.default.extend({}, d, t)),
                    (this._overlay = n.default(this._settings.overlayTemplate)),
                    e.hasClass(l) && (this._parent = e),
                    "" === this._settings.source)
                )
                    throw new Error("Source url was not defined. Please specify a url in your CardRefresh source option.");
            }
            var t = e.prototype;
            return (
                (t.load = function () {
                    var e = this;
                    this._addOverlay(),
                        this._settings.onLoadStart.call(n.default(this)),
                        n.default.get(
                            this._settings.source,
                            this._settings.params,
                            function (t) {
                                e._settings.loadInContent && ("" !== e._settings.sourceSelector && (t = n.default(t).find(e._settings.sourceSelector).html()), e._parent.find(e._settings.content).html(t)),
                                    e._settings.onLoadDone.call(n.default(e), t),
                                    e._removeOverlay();
                            },
                            "" !== this._settings.responseType && this._settings.responseType
                        ),
                        n.default(this._element).trigger(n.default.Event("loaded.lte.cardrefresh"));
                }),
                (t._addOverlay = function () {
                    this._parent.append(this._overlay), n.default(this._element).trigger(n.default.Event("overlay.added.lte.cardrefresh"));
                }),
                (t._removeOverlay = function () {
                    this._parent.find(this._overlay).remove(), n.default(this._element).trigger(n.default.Event("overlay.removed.lte.cardrefresh"));
                }),
                (t._init = function () {
                    var e = this;
                    n
                        .default(this)
                        .find(this._settings.trigger)
                        .on("click", function () {
                            e.load();
                        }),
                        this._settings.loadOnInit && this.load();
                }),
                (e._jQueryInterface = function (t) {
                    var a = n.default(this).data(o),
                        i = n.default.extend({}, d, n.default(this).data());
                    a || ((a = new e(n.default(this), i)), n.default(this).data(o, "string" == typeof t ? a : t)), "string" == typeof t && /load/.test(t) ? a[t]() : a._init(n.default(this));
                }),
                e
            );
        })();
    n.default(document).on("click", r, function (e) {
        e && e.preventDefault(), f._jQueryInterface.call(n.default(this), "load");
    }),
        n.default(function () {
            n.default(r).each(function () {
                f._jQueryInterface.call(n.default(this));
            });
        }),
        (n.default.fn[i] = f._jQueryInterface),
        (n.default.fn[i].Constructor = f),
        (n.default.fn[i].noConflict = function () {
            return (n.default.fn[i] = s), f._jQueryInterface;
        });
    var u = "CardWidget",
        c = "lte.cardwidget",
        h = n.default.fn[u],
        g = "card",
        p = "collapsed-card",
        m = "collapsing-card",
        v = "expanding-card",
        _ = "was-collapsed",
        b = "maximized-card",
        y = '[data-card-widget="remove"]',
        C = '[data-card-widget="collapse"]',
        w = '[data-card-widget="maximize"]',
        x = { animationSpeed: "normal", collapseTrigger: C, removeTrigger: y, maximizeTrigger: w, collapseIcon: "fa-minus", expandIcon: "fa-plus", maximizeIcon: "fa-expand", minimizeIcon: "fa-compress" },
        I = (function () {
            function e(e, t) {
                (this._element = e), (this._parent = e.parents(".card").first()), e.hasClass(g) && (this._parent = e), (this._settings = n.default.extend({}, x, t));
            }
            var t = e.prototype;
            return (
                (t.collapse = function () {
                    var e = this;
                    this._parent
                        .addClass(m)
                        .children(".card-body, .card-footer")
                        .slideUp(this._settings.animationSpeed, function () {
                            e._parent.addClass(p).removeClass(m);
                        }),
                        this._parent
                            .find("> .card-header " + this._settings.collapseTrigger + " ." + this._settings.collapseIcon)
                            .addClass(this._settings.expandIcon)
                            .removeClass(this._settings.collapseIcon),
                        this._element.trigger(n.default.Event("collapsed.lte.cardwidget"), this._parent);
                }),
                (t.expand = function () {
                    var e = this;
                    this._parent
                        .addClass(v)
                        .children(".card-body, .card-footer")
                        .slideDown(this._settings.animationSpeed, function () {
                            e._parent.removeClass(p).removeClass(v);
                        }),
                        this._parent
                            .find("> .card-header " + this._settings.collapseTrigger + " ." + this._settings.expandIcon)
                            .addClass(this._settings.collapseIcon)
                            .removeClass(this._settings.expandIcon),
                        this._element.trigger(n.default.Event("expanded.lte.cardwidget"), this._parent);
                }),
                (t.remove = function () {
                    this._parent.slideUp(), this._element.trigger(n.default.Event("removed.lte.cardwidget"), this._parent);
                }),
                (t.toggle = function () {
                    this._parent.hasClass(p) ? this.expand() : this.collapse();
                }),
                (t.maximize = function () {
                    this._parent
                        .find(this._settings.maximizeTrigger + " ." + this._settings.maximizeIcon)
                        .addClass(this._settings.minimizeIcon)
                        .removeClass(this._settings.maximizeIcon),
                        this._parent
                            .css({ height: this._parent.height(), width: this._parent.width(), transition: "all .15s" })
                            .delay(150)
                            .queue(function () {
                                var e = n.default(this);
                                e.addClass(b), n.default("html").addClass(b), e.hasClass(p) && e.addClass(_), e.dequeue();
                            }),
                        this._element.trigger(n.default.Event("maximized.lte.cardwidget"), this._parent);
                }),
                (t.minimize = function () {
                    this._parent
                        .find(this._settings.maximizeTrigger + " ." + this._settings.minimizeIcon)
                        .addClass(this._settings.maximizeIcon)
                        .removeClass(this._settings.minimizeIcon),
                        this._parent
                            .css("cssText", "height: " + this._parent[0].style.height + " !important; width: " + this._parent[0].style.width + " !important; transition: all .15s;")
                            .delay(10)
                            .queue(function () {
                                var e = n.default(this);
                                e.removeClass(b), n.default("html").removeClass(b), e.css({ height: "inherit", width: "inherit" }), e.hasClass(_) && e.removeClass(_), e.dequeue();
                            }),
                        this._element.trigger(n.default.Event("minimized.lte.cardwidget"), this._parent);
                }),
                (t.toggleMaximize = function () {
                    this._parent.hasClass(b) ? this.minimize() : this.maximize();
                }),
                (t._init = function (e) {
                    var t = this;
                    (this._parent = e),
                        n
                            .default(this)
                            .find(this._settings.collapseTrigger)
                            .click(function () {
                                t.toggle();
                            }),
                        n
                            .default(this)
                            .find(this._settings.maximizeTrigger)
                            .click(function () {
                                t.toggleMaximize();
                            }),
                        n
                            .default(this)
                            .find(this._settings.removeTrigger)
                            .click(function () {
                                t.remove();
                            });
                }),
                (e._jQueryInterface = function (t) {
                    var a = n.default(this).data(c),
                        i = n.default.extend({}, x, n.default(this).data());
                    a || ((a = new e(n.default(this), i)), n.default(this).data(c, "string" == typeof t ? a : t)),
                        "string" == typeof t && /collapse|expand|remove|toggle|maximize|minimize|toggleMaximize/.test(t) ? a[t]() : "object" == typeof t && a._init(n.default(this));
                }),
                e
            );
        })();
    n.default(document).on("click", C, function (e) {
        e && e.preventDefault(), I._jQueryInterface.call(n.default(this), "toggle");
    }),
        n.default(document).on("click", y, function (e) {
            e && e.preventDefault(), I._jQueryInterface.call(n.default(this), "remove");
        }),
        n.default(document).on("click", w, function (e) {
            e && e.preventDefault(), I._jQueryInterface.call(n.default(this), "toggleMaximize");
        }),
        (n.default.fn[u] = I._jQueryInterface),
        (n.default.fn[u].Constructor = I),
        (n.default.fn[u].noConflict = function () {
            return (n.default.fn[u] = h), I._jQueryInterface;
        });
    var T = "ControlSidebar",
        j = "lte.controlsidebar",
        S = n.default.fn[T],
        k = ".control-sidebar",
        Q = ".control-sidebar-content",
        H = '[data-widget="control-sidebar"]',
        z = ".main-header",
        F = ".main-footer",
        E = "control-sidebar-animate",
        D = "control-sidebar-open",
        L = "control-sidebar-slide-open",
        A = "layout-fixed",
        R = { controlsidebarSlide: !0, scrollbarTheme: "os-theme-light", scrollbarAutoHide: "l", target: k },
        M = (function () {
            function e(e, t) {
                (this._element = e), (this._config = t);
            }
            var t = e.prototype;
            return (
                (t.collapse = function () {
                    var e = n.default("body"),
                        t = n.default("html"),
                        a = this._config.target;
                    this._config.controlsidebarSlide
                        ? (t.addClass(E),
                          e
                              .removeClass(L)
                              .delay(300)
                              .queue(function () {
                                  n.default(a).hide(), t.removeClass(E), n.default(this).dequeue();
                              }))
                        : e.removeClass(D),
                        n.default(this._element).trigger(n.default.Event("collapsed.lte.controlsidebar"));
                }),
                (t.show = function () {
                    var e = n.default("body"),
                        t = n.default("html");
                    this._config.controlsidebarSlide
                        ? (t.addClass(E),
                          n
                              .default(this._config.target)
                              .show()
                              .delay(10)
                              .queue(function () {
                                  e
                                      .addClass(L)
                                      .delay(300)
                                      .queue(function () {
                                          t.removeClass(E), n.default(this).dequeue();
                                      }),
                                      n.default(this).dequeue();
                              }))
                        : e.addClass(D),
                        this._fixHeight(),
                        this._fixScrollHeight(),
                        n.default(this._element).trigger(n.default.Event("expanded.lte.controlsidebar"));
                }),
                (t.toggle = function () {
                    var e = n.default("body");
                    e.hasClass(D) || e.hasClass(L) ? this.collapse() : this.show();
                }),
                (t._init = function () {
                    var e = this,
                        t = n.default("body");
                    t.hasClass(D) || t.hasClass(L) ? (n.default(k).not(this._config.target).hide(), n.default(this._config.target).css("display", "block")) : n.default(k).hide(),
                        this._fixHeight(),
                        this._fixScrollHeight(),
                        n.default(window).resize(function () {
                            e._fixHeight(), e._fixScrollHeight();
                        }),
                        n.default(window).scroll(function () {
                            var t = n.default("body");
                            (t.hasClass(D) || t.hasClass(L)) && e._fixScrollHeight();
                        });
                }),
                (t._isNavbarFixed = function () {
                    var e = n.default("body");
                    return e.hasClass("layout-navbar-fixed") || e.hasClass("layout-sm-navbar-fixed") || e.hasClass("layout-md-navbar-fixed") || e.hasClass("layout-lg-navbar-fixed") || e.hasClass("layout-xl-navbar-fixed");
                }),
                (t._isFooterFixed = function () {
                    var e = n.default("body");
                    return e.hasClass("layout-footer-fixed") || e.hasClass("layout-sm-footer-fixed") || e.hasClass("layout-md-footer-fixed") || e.hasClass("layout-lg-footer-fixed") || e.hasClass("layout-xl-footer-fixed");
                }),
                (t._fixScrollHeight = function () {
                    var e = n.default("body"),
                        t = n.default(this._config.target);
                    if (e.hasClass(A)) {
                        var a = { scroll: n.default(document).height(), window: n.default(window).height(), header: n.default(z).outerHeight(), footer: n.default(F).outerHeight() },
                            i = Math.abs(a.window + n.default(window).scrollTop() - a.scroll),
                            o = n.default(window).scrollTop(),
                            s = this._isNavbarFixed() && "fixed" === n.default(z).css("position"),
                            l = this._isFooterFixed() && "fixed" === n.default(F).css("position"),
                            r = n.default(this._config.target + ", " + this._config.target + " " + Q);
                        if (0 === o && 0 === i) t.css({ bottom: a.footer, top: a.header }), r.css("height", a.window - (a.header + a.footer));
                        else if (i <= a.footer)
                            if (!1 === l) {
                                var d = a.header - o;
                                t.css("bottom", a.footer - i).css("top", d >= 0 ? d : 0), r.css("height", a.window - (a.footer - i));
                            } else t.css("bottom", a.footer);
                        else o <= a.header ? (!1 === s ? (t.css("top", a.header - o), r.css("height", a.window - (a.header - o))) : t.css("top", a.header)) : !1 === s ? (t.css("top", 0), r.css("height", a.window)) : t.css("top", a.header);
                        l && s ? (r.css("height", "100%"), t.css("height", "")) : (l || s) && (r.css("height", "100%"), r.css("height", ""));
                    }
                }),
                (t._fixHeight = function () {
                    var e = n.default("body"),
                        t = n.default(this._config.target + " " + Q);
                    if (e.hasClass(A)) {
                        var a = n.default(window).height(),
                            i = n.default(z).outerHeight(),
                            o = n.default(F).outerHeight(),
                            s = a - i;
                        this._isFooterFixed() && "fixed" === n.default(F).css("position") && (s = a - i - o),
                            t.css("height", s),
                            "undefined" != typeof n.default.fn.overlayScrollbars &&
                                t.overlayScrollbars({ className: this._config.scrollbarTheme, sizeAutoCapable: !0, scrollbars: { autoHide: this._config.scrollbarAutoHide, clickScrolling: !0 } });
                    } else t.attr("style", "");
                }),
                (e._jQueryInterface = function (t) {
                    return this.each(function () {
                        var a = n.default(this).data(j),
                            i = n.default.extend({}, R, n.default(this).data());
                        if ((a || ((a = new e(this, i)), n.default(this).data(j, a)), "undefined" === a[t])) throw new Error(t + " is not a function");
                        a[t]();
                    });
                }),
                e
            );
        })();
    n.default(document).on("click", H, function (e) {
        e.preventDefault(), M._jQueryInterface.call(n.default(this), "toggle");
    }),
        n.default(document).ready(function () {
            M._jQueryInterface.call(n.default(H), "_init");
        }),
        (n.default.fn[T] = M._jQueryInterface),
        (n.default.fn[T].Constructor = M),
        (n.default.fn[T].noConflict = function () {
            return (n.default.fn[T] = S), M._jQueryInterface;
        });
    var q = "DirectChat",
        N = "lte.directchat",
        O = n.default.fn[q],
        P = (function () {
            function e(e) {
                this._element = e;
            }
            return (
                (e.prototype.toggle = function () {
                    n.default(this._element).parents(".direct-chat").first().toggleClass("direct-chat-contacts-open"), n.default(this._element).trigger(n.default.Event("toggled.lte.directchat"));
                }),
                (e._jQueryInterface = function (t) {
                    return this.each(function () {
                        var a = n.default(this).data(N);
                        a || ((a = new e(n.default(this))), n.default(this).data(N, a)), a[t]();
                    });
                }),
                e
            );
        })();
    n.default(document).on("click", '[data-widget="chat-pane-toggle"]', function (e) {
        e && e.preventDefault(), P._jQueryInterface.call(n.default(this), "toggle");
    }),
        (n.default.fn[q] = P._jQueryInterface),
        (n.default.fn[q].Constructor = P),
        (n.default.fn[q].noConflict = function () {
            return (n.default.fn[q] = O), P._jQueryInterface;
        });
    var U = "Dropdown",
        B = "lte.dropdown",
        $ = n.default.fn[U],
        W = ".dropdown-menu",
        V = {},
        G = (function () {
            function e(e, t) {
                (this._config = t), (this._element = e);
            }
            var t = e.prototype;
            return (
                (t.toggleSubmenu = function () {
                    this._element.siblings().show().toggleClass("show"),
                        this._element.next().hasClass("show") || this._element.parents(W).first().find(".show").removeClass("show").hide(),
                        this._element.parents("li.nav-item.dropdown.show").on("hidden.bs.dropdown", function () {
                            n.default(".dropdown-submenu .show").removeClass("show").hide();
                        });
                }),
                (t.fixPosition = function () {
                    var e = n.default(".dropdown-menu.show");
                    if (0 !== e.length) {
                        e.hasClass("dropdown-menu-right") ? e.css({ left: "inherit", right: 0 }) : e.css({ left: 0, right: "inherit" });
                        var t = e.offset(),
                            a = e.width(),
                            i = n.default(window).width() - t.left;
                        t.left < 0 ? e.css({ left: "inherit", right: t.left - 5 }) : i < a && e.css({ left: "inherit", right: 0 });
                    }
                }),
                (e._jQueryInterface = function (t) {
                    return this.each(function () {
                        var a = n.default(this).data(B),
                            i = n.default.extend({}, V, n.default(this).data());
                        a || ((a = new e(n.default(this), i)), n.default(this).data(B, a)), ("toggleSubmenu" !== t && "fixPosition" !== t) || a[t]();
                    });
                }),
                e
            );
        })();
    n.default('.dropdown-menu [data-toggle="dropdown"]').on("click", function (e) {
        e.preventDefault(), e.stopPropagation(), G._jQueryInterface.call(n.default(this), "toggleSubmenu");
    }),
        n.default('.navbar [data-toggle="dropdown"]').on("click", function (e) {
            e.preventDefault(),
                n.default(e.target).parent().hasClass("dropdown-submenu") ||
                    setTimeout(function () {
                        G._jQueryInterface.call(n.default(this), "fixPosition");
                    }, 1);
        }),
        (n.default.fn[U] = G._jQueryInterface),
        (n.default.fn[U].Constructor = G),
        (n.default.fn[U].noConflict = function () {
            return (n.default.fn[U] = $), G._jQueryInterface;
        });
    var J = "ExpandableTable",
        K = "lte.expandableTable",
        X = n.default.fn[J],
        Y = ".expandable-body",
        Z = '[data-widget="expandable-table"]',
        ee = "aria-expanded",
        te = (function () {
            function e(e, t) {
                (this._options = t), (this._element = e);
            }
            var t = e.prototype;
            return (
                (t.init = function () {
                    n.default(Z).each(function (e, t) {
                        var a = n.default(t).attr(ee),
                            i = n.default(t).next(Y).children().first().children();
                        "true" === a ? i.show() : "false" === a && (i.hide(), i.parent().parent().addClass("d-none"));
                    });
                }),
                (t.toggleRow = function () {
                    var e = this._element,
                        t = e.attr(ee),
                        a = e.next(Y).children().first().children();
                    a.stop(),
                        "true" === t
                            ? (a.slideUp(500, function () {
                                  e.next(Y).addClass("d-none");
                              }),
                              e.attr(ee, "false"),
                              e.trigger(n.default.Event("collapsed.lte.expandableTable")))
                            : "false" === t && (e.next(Y).removeClass("d-none"), a.slideDown(500), e.attr(ee, "true"), e.trigger(n.default.Event("expanded.lte.expandableTable")));
                }),
                (e._jQueryInterface = function (t) {
                    return this.each(function () {
                        var a = n.default(this).data(K);
                        a || ((a = new e(n.default(this))), n.default(this).data(K, a)), "string" == typeof t && /init|toggleRow/.test(t) && a[t]();
                    });
                }),
                e
            );
        })();
    n.default(".expandable-table").ready(function () {
        te._jQueryInterface.call(n.default(this), "init");
    }),
        n.default(document).on("click", Z, function () {
            te._jQueryInterface.call(n.default(this), "toggleRow");
        }),
        (n.default.fn[J] = te._jQueryInterface),
        (n.default.fn[J].Constructor = te),
        (n.default.fn[J].noConflict = function () {
            return (n.default.fn[J] = X), te._jQueryInterface;
        });
    var ae = "Fullscreen",
        ne = "lte.fullscreen",
        ie = n.default.fn[ae],
        oe = '[data-widget="fullscreen"]',
        se = oe + " i",
        le = { minimizeIcon: "fa-compress-arrows-alt", maximizeIcon: "fa-expand-arrows-alt" },
        re = (function () {
            function e(e, t) {
                (this.element = e), (this.options = n.default.extend({}, le, t));
            }
            var t = e.prototype;
            return (
                (t.toggle = function () {
                    document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement ? this.windowed() : this.fullscreen();
                }),
                (t.fullscreen = function () {
                    document.documentElement.requestFullscreen
                        ? document.documentElement.requestFullscreen()
                        : document.documentElement.webkitRequestFullscreen
                        ? document.documentElement.webkitRequestFullscreen()
                        : document.documentElement.msRequestFullscreen && document.documentElement.msRequestFullscreen(),
                        n.default(se).removeClass(this.options.maximizeIcon).addClass(this.options.minimizeIcon);
                }),
                (t.windowed = function () {
                    document.exitFullscreen ? document.exitFullscreen() : document.webkitExitFullscreen ? document.webkitExitFullscreen() : document.msExitFullscreen && document.msExitFullscreen(),
                        n.default(se).removeClass(this.options.minimizeIcon).addClass(this.options.maximizeIcon);
                }),
                (e._jQueryInterface = function (t) {
                    var a = n.default(this).data(ne);
                    a || (a = n.default(this).data());
                    var i = n.default.extend({}, le, "object" == typeof t ? t : a),
                        o = new e(n.default(this), i);
                    n.default(this).data(ne, "object" == typeof t ? t : a), "string" == typeof t && /toggle|fullscreen|windowed/.test(t) ? o[t]() : o.init();
                }),
                e
            );
        })();
    n.default(document).on("click", oe, function () {
        re._jQueryInterface.call(n.default(this), "toggle");
    }),
        (n.default.fn[ae] = re._jQueryInterface),
        (n.default.fn[ae].Constructor = re),
        (n.default.fn[ae].noConflict = function () {
            return (n.default.fn[ae] = ie), re._jQueryInterface;
        });
    var de = "lte.iframe",
        fe = n.default.fn.IFrame,
        ue = '[data-widget="iframe"]',
        ce = '[data-widget="iframe-fullscreen"]',
        he = ".content-wrapper",
        ge = ".content-wrapper iframe",
        pe = '[data-widget="iframe"].iframe-mode .nav',
        me = '[data-widget="iframe"].iframe-mode .navbar-nav',
        ve = me + " .nav-item",
        _e = me + " .nav-link",
        be = '[data-widget="iframe"].iframe-mode .tab-content',
        ye = be + " .tab-empty",
        Ce = be + " .tab-loading",
        we = be + " .tab-pane",
        xe = ".main-sidebar .nav-item > a.nav-link",
        Ie = ".main-header .nav-item a.nav-link",
        Te = ".main-header a.dropdown-item",
        je = "iframe-mode",
        Se = "iframe-mode-fullscreen",
        ke = {
            onTabClick: function (e) {
                return e;
            },
            onTabChanged: function (e) {
                return e;
            },
            onTabCreated: function (e) {
                return e;
            },
            autoIframeMode: !0,
            autoItemActive: !0,
            autoShowNewTab: !0,
            allowDuplicates: !1,
            loadingScreen: !0,
            useNavbarItems: !0,
            scrollOffset: 40,
            scrollBehaviorSwap: !1,
            iconMaximize: "fa-expand",
            iconMinimize: "fa-compress",
        },
        Qe = (function () {
            function e(e, t) {
                (this._config = t), (this._element = e), this._init();
            }
            var t = e.prototype;
            return (
                (t.onTabClick = function (e) {
                    this._config.onTabClick(e);
                }),
                (t.onTabChanged = function (e) {
                    this._config.onTabChanged(e);
                }),
                (t.onTabCreated = function (e) {
                    this._config.onTabCreated(e);
                }),
                (t.createTab = function (e, t, a, i) {
                    var o = this,
                        s = "panel-" + a,
                        l = "tab-" + a;
                    this._config.allowDuplicates && ((s += "-" + Math.floor(1e3 * Math.random())), (l += "-" + Math.floor(1e3 * Math.random())));
                    var r =
                        '<li class="nav-item" role="presentation"><a href="#" class="btn-iframe-close" data-widget="iframe-close" data-type="only-this"><i class="fas fa-times"></i></a><a class="nav-link" data-toggle="row" id="' +
                        l +
                        '" href="#' +
                        s +
                        '" role="tab" aria-controls="' +
                        s +
                        '" aria-selected="false">' +
                        e +
                        "</a></li>";
                    n.default(me).append(unescape(escape(r)));
                    var d = '<div class="tab-pane fade" id="' + s + '" role="tabpanel" aria-labelledby="' + l + '"><iframe src="' + t + '"></iframe></div>';
                    if ((n.default(be).append(unescape(escape(d))), i))
                        if (this._config.loadingScreen) {
                            var f = n.default(Ce);
                            f.fadeIn(),
                                n.default(s + " iframe").ready(function () {
                                    "number" == typeof o._config.loadingScreen
                                        ? (o.switchTab("#" + l),
                                          setTimeout(function () {
                                              f.fadeOut();
                                          }, o._config.loadingScreen))
                                        : (o.switchTab("#" + l), f.fadeOut());
                                });
                        } else this.switchTab("#" + l);
                    this.onTabCreated(n.default("#" + l));
                }),
                (t.openTabSidebar = function (e, t) {
                    void 0 === t && (t = this._config.autoShowNewTab);
                    var a = n.default(e).clone();
                    void 0 === a.attr("href") && (a = n.default(e).parent("a").clone()), a.find(".right, .search-path").remove();
                    var i = a.find("p").text();
                    "" === i && (i = a.text());
                    var o = a.attr("href");
                    if ("#" !== o && "" !== o && void 0 !== o) {
                        var s = o
                                .replace("./", "")
                                .replace(/["&'./:=?[\]]/gi, "-")
                                .replace(/(--)/gi, ""),
                            l = "tab-" + s;
                        if (!this._config.allowDuplicates && n.default("#" + l).length > 0) return this.switchTab("#" + l);
                        ((!this._config.allowDuplicates && 0 === n.default("#" + l).length) || this._config.allowDuplicates) && this.createTab(i, o, s, t);
                    }
                }),
                (t.switchTab = function (e) {
                    var t = n.default(e),
                        a = t.attr("href");
                    n.default(ye).hide(),
                        n
                            .default(me + " .active")
                            .tab("dispose")
                            .removeClass("active"),
                        this._fixHeight(),
                        t.tab("show"),
                        t.parents("li").addClass("active"),
                        this.onTabChanged(t),
                        this._config.autoItemActive && this._setItemActive(n.default(a + " iframe").attr("src"));
                }),
                (t.removeActiveTab = function (e, t) {
                    if ("all" == e) n.default(ve).remove(), n.default(we).remove(), n.default(ye).show();
                    else if ("all-other" == e) n.default(ve + ":not(.active)").remove(), n.default(we + ":not(.active)").remove();
                    else if ("only-this" == e) {
                        var a = n.default(t),
                            i = a.parent(".nav-item"),
                            o = i.parent(),
                            s = i.index(),
                            l = a.siblings(".nav-link").attr("aria-controls");
                        if ((i.remove(), n.default("#" + l).remove(), n.default(be).children().length == n.default(ye + ", " + Ce).length)) n.default(ye).show();
                        else {
                            var r = s - 1;
                            this.switchTab(o.children().eq(r).find("a.nav-link"));
                        }
                    } else {
                        var d = n.default(ve + ".active"),
                            f = d.parent(),
                            u = d.index();
                        if ((d.remove(), n.default(we + ".active").remove(), n.default(be).children().length == n.default(ye + ", " + Ce).length)) n.default(ye).show();
                        else {
                            var c = u - 1;
                            this.switchTab(f.children().eq(c).find("a.nav-link"));
                        }
                    }
                }),
                (t.toggleFullscreen = function () {
                    n.default("body").hasClass(Se)
                        ? (n
                              .default(ce + " i")
                              .removeClass(this._config.iconMinimize)
                              .addClass(this._config.iconMaximize),
                          n.default("body").removeClass(Se),
                          n.default(ye + ", " + Ce).height("auto"),
                          n.default(he).height("auto"),
                          n.default(ge).height("auto"))
                        : (n
                              .default(ce + " i")
                              .removeClass(this._config.iconMaximize)
                              .addClass(this._config.iconMinimize),
                          n.default("body").addClass(Se)),
                        n.default(window).trigger("resize"),
                        this._fixHeight(!0);
                }),
                (t._init = function () {
                    if (window.frameElement && this._config.autoIframeMode) n.default("body").addClass(je);
                    else if (n.default(he).hasClass(je)) {
                        if (n.default(be).children().length > 2) {
                            var e = n.default(we + ":first-child");
                            e.show(), this._setItemActive(e.find("iframe").attr("src"));
                        }
                        this._setupListeners(), this._fixHeight(!0);
                    }
                }),
                (t._navScroll = function (e) {
                    var t = n.default(me).scrollLeft();
                    n.default(me).animate({ scrollLeft: t + e }, 250, "linear");
                }),
                (t._setupListeners = function () {
                    var e = this;
                    n.default(window).on("resize", function () {
                        setTimeout(function () {
                            e._fixHeight();
                        }, 1);
                    }),
                        n.default(document).on("click", xe + ", .sidebar-search-results .list-group-item", function (t) {
                            t.preventDefault(), e.openTabSidebar(t.target);
                        }),
                        this._config.useNavbarItems &&
                            n.default(document).on("click", Ie + ", " + Te, function (t) {
                                t.preventDefault(), e.openTabSidebar(t.target);
                            }),
                        n.default(document).on("click", _e, function (t) {
                            t.preventDefault(), e.onTabClick(t.target), e.switchTab(t.target);
                        }),
                        n.default(document).on("click", _e, function (t) {
                            t.preventDefault(), e.onTabClick(t.target), e.switchTab(t.target);
                        }),
                        n.default(document).on("click", '[data-widget="iframe-close"]', function (t) {
                            t.preventDefault();
                            var a = t.target;
                            "I" == a.nodeName && (a = t.target.offsetParent), e.removeActiveTab(a.attributes["data-type"] ? a.attributes["data-type"].nodeValue : null, a);
                        }),
                        n.default(document).on("click", ce, function (t) {
                            t.preventDefault(), e.toggleFullscreen();
                        });
                    var t = !1,
                        a = null;
                    n.default(document).on("mousedown", '[data-widget="iframe-scrollleft"]', function (n) {
                        n.preventDefault(), clearInterval(a);
                        var i = e._config.scrollOffset;
                        e._config.scrollBehaviorSwap || (i = -i),
                            (t = !0),
                            e._navScroll(i),
                            (a = setInterval(function () {
                                e._navScroll(i);
                            }, 250));
                    }),
                        n.default(document).on("mousedown", '[data-widget="iframe-scrollright"]', function (n) {
                            n.preventDefault(), clearInterval(a);
                            var i = e._config.scrollOffset;
                            e._config.scrollBehaviorSwap && (i = -i),
                                (t = !0),
                                e._navScroll(i),
                                (a = setInterval(function () {
                                    e._navScroll(i);
                                }, 250));
                        }),
                        n.default(document).on("mouseup", function () {
                            t && ((t = !1), clearInterval(a), (a = null));
                        });
                }),
                (t._setItemActive = function (e) {
                    n.default(xe + ", " + Te).removeClass("active"), n.default(Ie).parent().removeClass("active");
                    var t = n.default(Ie + '[href$="' + e + '"]'),
                        a = n.default('.main-header a.dropdown-item[href$="' + e + '"]'),
                        i = n.default(xe + '[href$="' + e + '"]');
                    t.each(function (e, t) {
                        n.default(t).parent().addClass("active");
                    }),
                        a.each(function (e, t) {
                            n.default(t).addClass("active");
                        }),
                        i.each(function (e, t) {
                            n.default(t).addClass("active"), n.default(t).parents(".nav-treeview").prevAll(".nav-link").addClass("active");
                        });
                }),
                (t._fixHeight = function (e) {
                    if ((void 0 === e && (e = !1), n.default("body").hasClass(Se))) {
                        var t = n.default(window).height(),
                            a = n.default(pe).outerHeight();
                        n.default(ye + ", " + Ce + ", " + ge).height(t - a), n.default(he).height(t);
                    } else {
                        var i = parseFloat(n.default(he).css("height")),
                            o = n.default(pe).outerHeight();
                        1 == e
                            ? setTimeout(function () {
                                  n.default(ye + ", " + Ce).height(i - o);
                              }, 50)
                            : n.default(ge).height(i - o);
                    }
                }),
                (e._jQueryInterface = function (t) {
                    var a = n.default(this).data(de),
                        i = n.default.extend({}, ke, n.default(this).data());
                    if ((a || ((a = new e(this, i)), n.default(this).data(de, a)), "string" == typeof t && /createTab|openTabSidebar|switchTab|removeActiveTab/.test(t))) {
                        for (var o, s = arguments.length, l = new Array(s > 1 ? s - 1 : 0), r = 1; r < s; r++) l[r - 1] = arguments[r];
                        (o = a)[t].apply(o, l);
                    }
                }),
                e
            );
        })();
    n.default(window).on("load", function () {
        Qe._jQueryInterface.call(n.default(ue));
    }),
        (n.default.fn.IFrame = Qe._jQueryInterface),
        (n.default.fn.IFrame.Constructor = Qe),
        (n.default.fn.IFrame.noConflict = function () {
            return (n.default.fn.IFrame = fe), Qe._jQueryInterface;
        });
    var He = "lte.layout",
        ze = n.default.fn.Layout,
        Fe = ".main-header",
        Ee = ".main-sidebar",
        De = ".main-sidebar .sidebar",
        Le = ".main-footer",
        Ae = "sidebar-focused",
        Re = { scrollbarTheme: "os-theme-light", scrollbarAutoHide: "l", panelAutoHeight: !0, panelAutoHeightMode: "min-height", preloadDuration: 200, loginRegisterAutoHeight: !0 },
        Me = (function () {
            function e(e, t) {
                (this._config = t), (this._element = e);
            }
            var t = e.prototype;
            console.log(t)
            return (
                (t.fixLayoutHeight = function (e) {
                    console.log('fixLayoutHeight')
                    void 0 === e && (e = null);
                    var t = n.default("body"),
                        a = 0;
                    (t.hasClass("control-sidebar-slide-open") || t.hasClass("control-sidebar-open") || "control_sidebar" === e) && (a = n.default(".control-sidebar-content").outerHeight());
                    var i = {
                            window: n.default(window).height(),
                            header: n.default(Fe).length > 0 ? n.default(Fe).outerHeight() : 0,
                            footer: n.default(Le).length > 0 ? n.default(Le).outerHeight() : 0,
                            sidebar: n.default(De).length > 0 ? n.default(De).height() : 0,
                            controlSidebar: a,
                        },
                        o = this._max(i),
                        s = this._config.panelAutoHeight;
                    !0 === s && (s = 0);
                    var l = n.default(".content-wrapper");
                    !1 !== s &&
                        (o === i.controlSidebar
                            ? l.css(this._config.panelAutoHeightMode, o + s)
                            : o === i.window
                            ? l.css(this._config.panelAutoHeightMode, o + s - i.header - i.footer)
                            : l.css(this._config.panelAutoHeightMode, o + s - i.header),
                        this._isFooterFixed() && l.css(this._config.panelAutoHeightMode, parseFloat(l.css(this._config.panelAutoHeightMode)) + i.footer)),
                        t.hasClass("layout-fixed") &&
                            ("undefined" != typeof n.default.fn.overlayScrollbars
                                ? n.default(De).overlayScrollbars({ className: this._config.scrollbarTheme, sizeAutoCapable: !0, scrollbars: { autoHide: this._config.scrollbarAutoHide, clickScrolling: !0 } })
                                : n.default(De).css("overflow-y", "auto"));
                }),
                (t.fixLoginRegisterHeight = function () {
                    var e = n.default("body"),
                        t = n.default(".login-box, .register-box");
                    if (0 === t.length) e.css("height", "auto"), n.default("html").css("height", "auto");
                    else {
                        var a = t.height();
                        e.css(this._config.panelAutoHeightMode) !== a && e.css(this._config.panelAutoHeightMode, a);
                    }
                }),
                (t._init = function () {
                    var e = this;
                    console.log('t._init')
                    this.fixLayoutHeight(),
                        !0 === this._config.loginRegisterAutoHeight
                            ? this.fixLoginRegisterHeight()
                            : this._config.loginRegisterAutoHeight === parseInt(this._config.loginRegisterAutoHeight, 10) && setInterval(this.fixLoginRegisterHeight, this._config.loginRegisterAutoHeight),
                        n.default(De).on("collapsed.lte.treeview expanded.lte.treeview", function () {
                            e.fixLayoutHeight();
                        }),
                        n.default(Ee).on("mouseenter mouseleave", function () {
                            n.default("body").hasClass("sidebar-collapse") && e.fixLayoutHeight();
                        }),
                        n.default('[data-widget="pushmenu"]').on("collapsed.lte.pushmenu shown.lte.pushmenu", function () {
                            setTimeout(function () {
                                e.fixLayoutHeight();
                            }, 300);
                        }),
                        n
                            .default('[data-widget="control-sidebar"]')
                            .on("collapsed.lte.controlsidebar", function () {
                                e.fixLayoutHeight();
                            })
                            .on("expanded.lte.controlsidebar", function () {
                                e.fixLayoutHeight("control_sidebar");
                            }),
                        n.default(window).resize(function () {
                            e.fixLayoutHeight();
                        }),
                        setTimeout(function () {
                            n.default("body.hold-transition").removeClass("hold-transition");
                        }, 50),
                        setTimeout(function () {
                            var e = n.default(".preloader");
                            e &&
                                (e.css("height", 0),
                                setTimeout(function () {
                                    e.children().hide();
                                }, 200));
                        }, this._config.preloadDuration);
                }),
                (t._max = function (e) {
                    var t = 0;
                    return (
                        Object.keys(e).forEach(function (a) {
                            e[a] > t && (t = e[a]);
                        }),
                        t
                    );
                }),
                (t._isFooterFixed = function () {
                    return "fixed" === n.default(Le).css("position");
                }),
                (e._jQueryInterface = function (t) {
                    return (
                        void 0 === t && (t = ""),
                        this.each(function () {
                            var a = n.default(this).data(He),
                                i = n.default.extend({}, Re, n.default(this).data());
                            a || ((a = new e(n.default(this), i)), n.default(this).data(He, a)), "init" === t || "" === t ? a._init() : ("fixLayoutHeight" !== t && "fixLoginRegisterHeight" !== t) || a[t]();
                        })
                    );
                }),
                e
            );
        })();
    n.default(window).on("load", function () {
        Me._jQueryInterface.call(n.default("body"));
        console.log('zzzzzzzzzzzzzzzzzzzzzzzzzz')
    }),
        n.default(De + " a")
            .on("focusin", function () {
                n.default(Ee).addClass(Ae);
            })
            .on("focusout", function () {
                n.default(Ee).removeClass(Ae);
            }),
        (n.default.fn.Layout = Me._jQueryInterface),
        (n.default.fn.Layout.Constructor = Me),
        (n.default.fn.Layout.noConflict = function () {
            return (n.default.fn.Layout = ze), Me._jQueryInterface;
        });
    var qe = "PushMenu",
        Ne = "lte.pushmenu",
        Oe = "." + Ne,
        Pe = n.default.fn[qe],
        Ue = '[data-widget="pushmenu"]',
        Be = "body",
        $e = "sidebar-collapse",
        We = "sidebar-open",
        Ve = "sidebar-is-opening",
        Ge = "sidebar-closed",
        Je = { autoCollapseSize: 992, enableRemember: !1, noTransitionAfterReload: !0 },
        Ke = (function () {
            function e(e, t) {
                (this._element = e), (this._options = n.default.extend({}, Je, t)), 0 === n.default("#sidebar-overlay").length && this._addOverlay(), this._init();
            }
            var t = e.prototype;
            return (
                (t.expand = function () {
                    var e = n.default(Be);
                    this._options.autoCollapseSize && n.default(window).width() <= this._options.autoCollapseSize && e.addClass(We),
                        e
                            .addClass(Ve)
                            .removeClass("sidebar-collapse sidebar-closed")
                            .delay(50)
                            .queue(function () {
                                e.removeClass(Ve), n.default(this).dequeue();
                            }),
                        this._options.enableRemember && localStorage.setItem("remember" + Oe, We),
                        n.default(this._element).trigger(n.default.Event("shown.lte.pushmenu"));
                }),
                (t.collapse = function () {
                    var e = n.default(Be);
                    this._options.autoCollapseSize && n.default(window).width() <= this._options.autoCollapseSize && e.removeClass(We).addClass(Ge),
                        e.addClass($e),
                        this._options.enableRemember && localStorage.setItem("remember" + Oe, $e),
                        n.default(this._element).trigger(n.default.Event("collapsed.lte.pushmenu"));
                }),
                (t.toggle = function () {
                    n.default(Be).hasClass($e) ? this.expand() : this.collapse();
                }),
                (t.autoCollapse = function (e) {
                    if ((void 0 === e && (e = !1), this._options.autoCollapseSize)) {
                        var t = n.default(Be);
                        n.default(window).width() <= this._options.autoCollapseSize ? t.hasClass(We) || this.collapse() : !0 === e && (t.hasClass(We) ? t.removeClass(We) : t.hasClass(Ge) && this.expand());
                    }
                }),
                (t.remember = function () {
                    if (this._options.enableRemember) {
                        var e = n.default("body");
                        localStorage.getItem("remember" + Oe) === $e
                            ? this._options.noTransitionAfterReload
                                ? e
                                      .addClass("hold-transition")
                                      .addClass($e)
                                      .delay(50)
                                      .queue(function () {
                                          n.default(this).removeClass("hold-transition"), n.default(this).dequeue();
                                      })
                                : e.addClass($e)
                            : this._options.noTransitionAfterReload
                            ? e
                                  .addClass("hold-transition")
                                  .removeClass($e)
                                  .delay(50)
                                  .queue(function () {
                                      n.default(this).removeClass("hold-transition"), n.default(this).dequeue();
                                  })
                            : e.removeClass($e);
                    }
                }),
                (t._init = function () {
                    var e = this;
                    this.remember(),
                        this.autoCollapse(),
                        n.default(window).resize(function () {
                            e.autoCollapse(!0);
                        });
                }),
                (t._addOverlay = function () {
                    var e = this,
                        t = n.default("<div />", { id: "sidebar-overlay" });
                    t.on("click", function () {
                        e.collapse();
                    }),
                        n.default(".wrapper").append(t);
                }),
                (e._jQueryInterface = function (t) {
                    return this.each(function () {
                        var a = n.default(this).data(Ne),
                            i = n.default.extend({}, Je, n.default(this).data());
                        a || ((a = new e(this, i)), n.default(this).data(Ne, a)), "string" == typeof t && /collapse|expand|toggle/.test(t) && a[t]();
                    });
                }),
                e
            );
        })();
    n.default(document).on("click", Ue, function (e) {
        e.preventDefault();
        var t = e.currentTarget;
        "pushmenu" !== n.default(t).data("widget") && (t = n.default(t).closest(Ue)), Ke._jQueryInterface.call(n.default(t), "toggle");
    }),
        n.default(window).on("load", function () {
            Ke._jQueryInterface.call(n.default(Ue));
        }),
        (n.default.fn[qe] = Ke._jQueryInterface),
        (n.default.fn[qe].Constructor = Ke),
        (n.default.fn[qe].noConflict = function () {
            return (n.default.fn[qe] = Pe), Ke._jQueryInterface;
        });
    var Xe = "SidebarSearch",
        Ye = "lte.sidebar-search",
        Ze = n.default.fn[Xe],
        et = "sidebar-search-open",
        tt = "fa-search",
        at = "fa-times",
        nt = "sidebar-search-results",
        it = "list-group",
        ot = '[data-widget="sidebar-search"]',
        st = ot + " .form-control",
        lt = ot + " .btn",
        rt = lt + " i",
        dt = ".sidebar-search-results",
        ft = ".sidebar-search-results .list-group",
        ut = { arrowSign: "->", minLength: 3, maxResults: 7, highlightName: !0, highlightPath: !1, highlightClass: "text-light", notFoundText: "No element found!" },
        ct = [],
        ht = (function () {
            function e(e, t) {
                (this.element = e), (this.options = n.default.extend({}, ut, t)), (this.items = []);
            }
            var a = e.prototype;
            return (
                (a.init = function () {
                    var e = this;
                    0 !== n.default(ot).length &&
                        (0 === n.default(ot).next(dt).length && n.default(ot).after(n.default("<div />", { class: nt })),
                        0 === n.default(dt).children(".list-group").length && n.default(dt).append(n.default("<div />", { class: it })),
                        this._addNotFound(),
                        n
                            .default(".main-sidebar .nav-sidebar")
                            .children()
                            .each(function (t, a) {
                                e._parseItem(a);
                            }));
                }),
                (a.search = function () {
                    var e = this,
                        t = n.default(st).val().toLowerCase();
                    if (t.length < this.options.minLength) return n.default(ft).empty(), this._addNotFound(), void this.close();
                    var a = ct.filter(function (e) {
                            return e.name.toLowerCase().includes(t);
                        }),
                        i = n.default(a.slice(0, this.options.maxResults));
                    n.default(ft).empty(),
                        0 === i.length
                            ? this._addNotFound()
                            : i.each(function (t, a) {
                                  n.default(ft).append(e._renderItem(escape(a.name), escape(a.link), a.path));
                              }),
                        this.open();
                }),
                (a.open = function () {
                    n.default(ot).parent().addClass(et), n.default(rt).removeClass(tt).addClass(at);
                }),
                (a.close = function () {
                    n.default(ot).parent().removeClass(et), n.default(rt).removeClass(at).addClass(tt);
                }),
                (a.toggle = function () {
                    n.default(ot).parent().hasClass(et) ? this.close() : this.open();
                }),
                (a._parseItem = function (e, t) {
                    var a = this;
                    if ((void 0 === t && (t = []), !n.default(e).hasClass("nav-header"))) {
                        var i = {},
                            o = n.default(e).clone().find("> .nav-link"),
                            s = n.default(e).clone().find("> .nav-treeview"),
                            l = o.attr("href"),
                            r = o.find("p").children().remove().end().text();
                        if (((i.name = this._trimText(r)), (i.link = l), (i.path = t), 0 === s.length)) ct.push(i);
                        else {
                            var d = i.path.concat([i.name]);
                            s.children().each(function (e, t) {
                                a._parseItem(t, d);
                            });
                        }
                    }
                }),
                (a._trimText = function (e) {
                    return t.trim(e.replace(/(\r\n|\n|\r)/gm, " "));
                }),
                (a._renderItem = function (e, t, a) {
                    var i = this;
                    if (((a = a.join(" " + this.options.arrowSign + " ")), (e = unescape(e)), this.options.highlightName || this.options.highlightPath)) {
                        var o = n.default(st).val().toLowerCase(),
                            s = new RegExp(o, "gi");
                        this.options.highlightName &&
                            (e = e.replace(s, function (e) {
                                return '<strong class="' + i.options.highlightClass + '">' + e + "</strong>";
                            })),
                            this.options.highlightPath &&
                                (a = a.replace(s, function (e) {
                                    return '<strong class="' + i.options.highlightClass + '">' + e + "</strong>";
                                }));
                    }
                    var l = n.default("<a/>", { href: t, class: "list-group-item" }),
                        r = n.default("<div/>", { class: "search-title" }).html(e),
                        d = n.default("<div/>", { class: "search-path" }).html(a);
                    return l.append(r).append(d), l;
                }),
                (a._addNotFound = function () {
                    n.default(ft).append(this._renderItem(this.options.notFoundText, "#", []));
                }),
                (e._jQueryInterface = function (t) {
                    var a = n.default(this).data(Ye);
                    a || (a = n.default(this).data());
                    var i = n.default.extend({}, ut, "object" == typeof t ? t : a),
                        o = new e(n.default(this), i);
                    n.default(this).data(Ye, "object" == typeof t ? t : a), "string" == typeof t && /init|toggle|close|open|search/.test(t) ? o[t]() : o.init();
                }),
                e
            );
        })();
    n.default(document).on("click", lt, function (e) {
        e.preventDefault(), ht._jQueryInterface.call(n.default(ot), "toggle");
    }),
        n.default(document).on("keyup", st, function (e) {
            return 38 == e.keyCode
                ? (e.preventDefault(), void n.default(ft).children().last().focus())
                : 40 == e.keyCode
                ? (e.preventDefault(), void n.default(ft).children().first().focus())
                : void setTimeout(function () {
                      ht._jQueryInterface.call(n.default(ot), "search");
                  }, 100);
        }),
        n.default(document).on("keydown", ft, function (e) {
            var t = n.default(":focus");
            38 == e.keyCode && (e.preventDefault(), t.is(":first-child") ? t.siblings().last().focus() : t.prev().focus()), 40 == e.keyCode && (e.preventDefault(), t.is(":last-child") ? t.siblings().first().focus() : t.next().focus());
        }),
        n.default(window).on("load", function () {
            ht._jQueryInterface.call(n.default(ot), "init");
        }),
        (n.default.fn[Xe] = ht._jQueryInterface),
        (n.default.fn[Xe].Constructor = ht),
        (n.default.fn[Xe].noConflict = function () {
            return (n.default.fn[Xe] = Ze), ht._jQueryInterface;
        });
    var gt = "NavbarSearch",
        pt = "lte.navbar-search",
        mt = n.default.fn[gt],
        vt = '[data-widget="navbar-search"]',
        _t = ".form-control",
        bt = "navbar-search-open",
        yt = { resetOnClose: !0, target: ".navbar-search-block" },
        Ct = (function () {
            function e(e, t) {
                (this._element = e), (this._config = n.default.extend({}, yt, t));
            }
            var t = e.prototype;
            return (
                (t.open = function () {
                    n.default(this._config.target).css("display", "flex").hide().fadeIn().addClass(bt), n.default(this._config.target + " " + _t).focus();
                }),
                (t.close = function () {
                    n.default(this._config.target).fadeOut().removeClass(bt), this._config.resetOnClose && n.default(this._config.target + " " + _t).val("");
                }),
                (t.toggle = function () {
                    n.default(this._config.target).hasClass(bt) ? this.close() : this.open();
                }),
                (e._jQueryInterface = function (t) {
                    return this.each(function () {
                        var a = n.default(this).data(pt),
                            i = n.default.extend({}, yt, n.default(this).data());
                        if ((a || ((a = new e(this, i)), n.default(this).data(pt, a)), !/toggle|close|open/.test(t))) throw new Error("Undefined method " + t);
                        a[t]();
                    });
                }),
                e
            );
        })();
    n.default(document).on("click", vt, function (e) {
        e.preventDefault();
        var t = n.default(e.currentTarget);
        "navbar-search" !== t.data("widget") && (t = t.closest(vt)), Ct._jQueryInterface.call(t, "toggle");
    }),
        (n.default.fn[gt] = Ct._jQueryInterface),
        (n.default.fn[gt].Constructor = Ct),
        (n.default.fn[gt].noConflict = function () {
            return (n.default.fn[gt] = mt), Ct._jQueryInterface;
        });
    var wt = n.default.fn.Toasts,
        xt = "topRight",
        It = "topLeft",
        Tt = "bottomRight",
        jt = "bottomLeft",
        St = { position: xt, fixed: !0, autohide: !1, autoremove: !0, delay: 1e3, fade: !0, icon: null, image: null, imageAlt: null, imageHeight: "25px", title: null, subtitle: null, close: !0, body: null, class: null },
        kt = (function () {
            function e(e, t) {
                (this._config = t), this._prepareContainer(), n.default("body").trigger(n.default.Event("init.lte.toasts"));
            }
            var t = e.prototype;
            return (
                (t.create = function () {
                    var e = n.default('<div class="toast" role="alert" aria-live="assertive" aria-atomic="true"/>');
                    e.data("autohide", this._config.autohide),
                        e.data("animation", this._config.fade),
                        this._config.class && e.addClass(this._config.class),
                        this._config.delay && 500 != this._config.delay && e.data("delay", this._config.delay);
                    var t = n.default('<div class="toast-header">');
                    if (null != this._config.image) {
                        var a = n.default("<img />").addClass("rounded mr-2").attr("src", this._config.image).attr("alt", this._config.imageAlt);
                        null != this._config.imageHeight && a.height(this._config.imageHeight).width("auto"), t.append(a);
                    }
                    if (
                        (null != this._config.icon && t.append(n.default("<i />").addClass("mr-2").addClass(this._config.icon)),
                        null != this._config.title && t.append(n.default("<strong />").addClass("mr-auto").html(this._config.title)),
                        null != this._config.subtitle && t.append(n.default("<small />").html(this._config.subtitle)),
                        1 == this._config.close)
                    ) {
                        var i = n.default('<button data-dismiss="toast" />').attr("type", "button").addClass("ml-2 mb-1 close").attr("aria-label", "Close").append('<span aria-hidden="true">&times;</span>');
                        null == this._config.title && i.toggleClass("ml-2 ml-auto"), t.append(i);
                    }
                    e.append(t), null != this._config.body && e.append(n.default('<div class="toast-body" />').html(this._config.body)), n.default(this._getContainerId()).prepend(e);
                    var o = n.default("body");
                    o.trigger(n.default.Event("created.lte.toasts")),
                        e.toast("show"),
                        this._config.autoremove &&
                            e.on("hidden.bs.toast", function () {
                                n.default(this).delay(200).remove(), o.trigger(n.default.Event("removed.lte.toasts"));
                            });
                }),
                (t._getContainerId = function () {
                    return this._config.position == xt
                        ? "#toastsContainerTopRight"
                        : this._config.position == It
                        ? "#toastsContainerTopLeft"
                        : this._config.position == Tt
                        ? "#toastsContainerBottomRight"
                        : this._config.position == jt
                        ? "#toastsContainerBottomLeft"
                        : void 0;
                }),
                (t._prepareContainer = function () {
                    if (0 === n.default(this._getContainerId()).length) {
                        var e = n.default("<div />").attr("id", this._getContainerId().replace("#", ""));
                        this._config.position == xt
                            ? e.addClass("toasts-top-right")
                            : this._config.position == It
                            ? e.addClass("toasts-top-left")
                            : this._config.position == Tt
                            ? e.addClass("toasts-bottom-right")
                            : this._config.position == jt && e.addClass("toasts-bottom-left"),
                            n.default("body").append(e);
                    }
                    this._config.fixed ? n.default(this._getContainerId()).addClass("fixed") : n.default(this._getContainerId()).removeClass("fixed");
                }),
                (e._jQueryInterface = function (t, a) {
                    return this.each(function () {
                        var i = n.default.extend({}, St, a),
                            o = new e(n.default(this), i);
                        "create" === t && o[t]();
                    });
                }),
                e
            );
        })();
    (n.default.fn.Toasts = kt._jQueryInterface),
        (n.default.fn.Toasts.Constructor = kt),
        (n.default.fn.Toasts.noConflict = function () {
            return (n.default.fn.Toasts = wt), kt._jQueryInterface;
        });
    var Qt = "TodoList",
        Ht = "lte.todolist",
        zt = n.default.fn[Qt],
        Ft = "done",
        Et = {
            onCheck: function (e) {
                return e;
            },
            onUnCheck: function (e) {
                return e;
            },
        },
        Dt = (function () {
            function e(e, t) {
                (this._config = t), (this._element = e), this._init();
            }
            var t = e.prototype;
            return (
                (t.toggle = function (e) {
                    e.parents("li").toggleClass(Ft), n.default(e).prop("checked") ? this.check(e) : this.unCheck(n.default(e));
                }),
                (t.check = function (e) {
                    this._config.onCheck.call(e);
                }),
                (t.unCheck = function (e) {
                    this._config.onUnCheck.call(e);
                }),
                (t._init = function () {
                    var e = this,
                        t = this._element;
                    t.find("input:checkbox:checked").parents("li").toggleClass(Ft),
                        t.on("change", "input:checkbox", function (t) {
                            e.toggle(n.default(t.target));
                        });
                }),
                (e._jQueryInterface = function (t) {
                    return this.each(function () {
                        var a = n.default(this).data(Ht);
                        a || (a = n.default(this).data());
                        var i = n.default.extend({}, Et, "object" == typeof t ? t : a),
                            o = new e(n.default(this), i);
                        n.default(this).data(Ht, "object" == typeof t ? t : a), "init" === t && o[t]();
                    });
                }),
                e
            );
        })();
    n.default(window).on("load", function () {
        Dt._jQueryInterface.call(n.default('[data-widget="todo-list"]'));
    }),
        (n.default.fn[Qt] = Dt._jQueryInterface),
        (n.default.fn[Qt].Constructor = Dt),
        (n.default.fn[Qt].noConflict = function () {
            return (n.default.fn[Qt] = zt), Dt._jQueryInterface;
        });
    var Lt = "Treeview",
        At = "lte.treeview",
        Rt = n.default.fn[Lt],
        Mt = ".nav-item",
        qt = ".nav-treeview",
        Nt = ".menu-open",
        Ot = '[data-widget="treeview"]',
        Pt = "menu-open",
        Ut = "menu-is-opening",
        Bt = { trigger: Ot + " .nav-link", animationSpeed: 300, accordion: !0, expandSidebar: !1, sidebarButtonSelector: '[data-widget="pushmenu"]' },
        $t = (function () {
            function e(e, t) {
                (this._config = t), (this._element = e);
            }
            var t = e.prototype;
            return (
                (t.init = function () {
                    n.default(".nav-item.menu-open .nav-treeview.menu-open").css("display", "block"), this._setupListeners();
                }),
                (t.expand = function (e, t) {
                    var a = this,
                        i = n.default.Event("expanded.lte.treeview");
                    if (this._config.accordion) {
                        var o = t.siblings(Nt).first(),
                            s = o.find(qt).first();
                        this.collapse(s, o);
                    }
                    t.addClass(Ut),
                        e.stop().slideDown(this._config.animationSpeed, function () {
                            t.addClass(Pt), n.default(a._element).trigger(i);
                        }),
                        this._config.expandSidebar && this._expandSidebar();
                }),
                (t.collapse = function (e, t) {
                    var a = this,
                        i = n.default.Event("collapsed.lte.treeview");
                    t.removeClass("menu-is-opening menu-open"),
                        e.stop().slideUp(this._config.animationSpeed, function () {
                            n.default(a._element).trigger(i), e.find(".menu-open > .nav-treeview").slideUp(), e.find(Nt).removeClass(Pt);
                        });
                }),
                (t.toggle = function (e) {
                    var t = n.default(e.currentTarget),
                        a = t.parent(),
                        i = a.find("> .nav-treeview");
                    if (i.is(qt) || (a.is(Mt) || (i = a.parent().find("> .nav-treeview")), i.is(qt))) {
                        e.preventDefault();
                        var o = t.parents(Mt).first();
                        o.hasClass(Pt) ? this.collapse(n.default(i), o) : this.expand(n.default(i), o);
                    }
                }),
                (t._setupListeners = function () {
                    var e = this,
                        t = void 0 !== this._element.attr("id") ? "#" + this._element.attr("id") : "";
                    n.default(document).on("click", "" + t + this._config.trigger, function (t) {
                        e.toggle(t);
                    });
                }),
                (t._expandSidebar = function () {
                    n.default("body").hasClass("sidebar-collapse") && n.default(this._config.sidebarButtonSelector).PushMenu("expand");
                }),
                (e._jQueryInterface = function (t) {
                    return this.each(function () {
                        var a = n.default(this).data(At),
                            i = n.default.extend({}, Bt, n.default(this).data());
                        a || ((a = new e(n.default(this), i)), n.default(this).data(At, a)), "init" === t && a[t]();
                    });
                }),
                e
            );
        })();
    n.default(window).on("load.lte.treeview", function () {
        n.default(Ot).each(function () {
            $t._jQueryInterface.call(n.default(this), "init");
        });
                console.log('ccccccccccccccccccccccccccc')
    }),
        (n.default.fn[Lt] = $t._jQueryInterface),
        (n.default.fn[Lt].Constructor = $t),
        (n.default.fn[Lt].noConflict = function () {
            return (n.default.fn[Lt] = Rt), $t._jQueryInterface;
        }),
        (e.CardRefresh = f),
        (e.CardWidget = I),
        (e.ControlSidebar = M),
        (e.DirectChat = P),
        (e.Dropdown = G),
        (e.ExpandableTable = te),
        (e.Fullscreen = re),
        (e.IFrame = Qe),
        (e.Layout = Me),
        (e.NavbarSearch = Ct),
        (e.PushMenu = Ke),
        (e.SidebarSearch = ht),
        (e.Toasts = kt),
        (e.TodoList = Dt),
        (e.Treeview = $t),
        Object.defineProperty(e, "__esModule", { value: !0 });
});
