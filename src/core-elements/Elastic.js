var $ = core.VW.Web.JQuery;
var vox = core.VW.Web.Vox;
{
    var Elastic = function Elastic() {
        Elastic.$constructor ? Elastic.$constructor.apply(this, arguments) : Elastic.$superClass && Elastic.$superClass.apply(this, arguments);
    };
    Elastic.getStyleObject = function () {
        var dom = this.get(0);
        var style;
        var returns = {};
        if (window.getComputedStyle) {
            var camelize = function (a, b) {
                return b.toUpperCase();
            };
            style = window.getComputedStyle(dom, null);
            for (var i = 0, l = style.length; i < l; i++) {
                var prop = style[i];
                var camel = prop.replace(/\-([a-z])/g, camelize);
                var val = style.getPropertyValue(prop);
                returns[camel] = val;
            }
            ;
            return returns;
        }
        ;
        if (style = dom.currentStyle) {
            for (var prop in style) {
                returns[prop] = style[prop];
            }
            ;
            return returns;
        }
        ;
        return this.css();
    };
    Elastic.__defineGetter__('entities', function () {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            '\'': '&#39;',
            '/': '&#x2F;'
        };
    });
    Elastic.escapeHtml = function (html) {
        return String(html).replace(/[&<>"'\/]/g, function (self$0) {
            return function (s) {
                return self$0.entities[s];
            };
        }(this));
    };
    Elastic.register = function () {
        if (this.registered)
            return;
        $.fn.voxelastic = function () {
            var dp = [];
            this.each(function () {
                var o = $(this);
                var t = undefined;
                this.voxcss_element = this.voxcss_element || {};
                t = this.voxcss_element['vox-elastic'];
                if (!t) {
                    t = new Elastic(o);
                    this.voxcss_element['vox-elastic'] = t;
                }
                dp.push(t);
            });
            return dp;
        };
        $(function () {
            vox.mutation.watchAppend($('body'), function (ev) {
                ev.jTarget.voxelastic();
            }, '.vox-textarea, .vox-elastic');
            $('.vox-textarea, .vox-elastic').voxelastic();
        });
        this.registered = true;
    };
    Elastic.$constructor = function (obj) {
        obj = $(obj);
        var f = this.$ = {};
        f.obj = obj;
        this.adjust(obj);
    };
    Elastic.prototype.refresh = function () {
        var f = this.$;
        var sxl = f.obj.get(0).sxl;
        var refrescar = sxl.elastic ? sxl.elastic : null;
        if (refrescar)
            refrescar();
        else
            this.adjust(f.obj);
    };
    Elastic.prototype.adjust = function (obj) {
        var elastic = this;
        obj.each(function () {
            var e = $(this);
            if (!this.sxl) {
                this.sxl = {};
            }
            var div;
            if (!Elastic.adjustDiv) {
                div = $('<div>');
                div.addClass('sxl-elastic-provider');
                Elastic.adjustDiv = div;
                $('body').append(div);
            } else {
                div = Elastic.adjustDiv;
            }
            div.css(Elastic.getStyleObject.call(e));
            div.css('word-wrap', 'break-word');
            div.css('height', 'auto');
            div.css('position', 'fixed');
            div.css('top', '1000%');
            div.css('left', '1000%');
            div.css('bottom', 'auto');
            div.show();
            if (!this.value) {
                div.html('&nbsp;');
            } else {
                div.html(Elastic.escapeHtml(this.value));
                var di = this.value[this.value.length - 1];
                if (di == '\r' || di == '\n') {
                    div.append('&nbsp;');
                }
            }
            var h = div.height();
            e.height(h);
            e.css('overflow', 'hidden');
            var self = this;
            if (!this.sxl.elastic) {
                this.sxl.elastic = function () {
                    if (self.sxl.elastic.i) {
                        clearTimeout(self.sxl.elastic.i);
                        self.sxl.elastic.i = undefined;
                    }
                    self.sxl.elastic.i = setTimeout(function () {
                        elastic.adjust($(self));
                    }, 200);
                };
                e.bind('change click input cut paste keydown resize', this.sxl.elastic);
                $(window).resize(this.sxl.elastic);
            }
        });
    };
}
exports.default = Elastic;