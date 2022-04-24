//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var script = {
  name: 'ui-typeahead',
  props: {
    url: String,
    type: String,
    name: String,
    value: String,
    maxlength: Number,
    minlength: Number,
    required: String,
    classname: String
  },
  data: function data () {
    return {
      items: [],
      query: this.value,
      current: -1,
      loading: false,
      limit: 5,
      minChars: 1
    }
  },
  computed: {
    hasItems: function hasItems () {
      return this.items.length > 0
    }
  },

  methods: {
    update: function update () {
      var this$1 = this;

      if (!this.query) {
        return this.reset();
      }

      if (this.minChars && this.query.length < this.minChars) {
        return;
      }

      this.loading = true;

      this.fetch()
        .then(function (response) { return response.json(); })
        .then(function (response) {
          if (response && this$1.query) {
            this$1.items = this$1.limit ? response.slice(0, this$1.limit) : response;
            this$1.current = -1;
            this$1.loading = false;
          }
        });
    },
    fetch: function fetch$1 () {
      var url = this.url;
      url += (url.indexOf('?') === -1 ? '?' : '&') + 'q=' + encodeURIComponent(this.query);

      return fetch(url);
    },
    hit: function hit (e) {
      if (this.current !== -1) {
        this.value = this.items[this.current].text;
        this.reset();
      }
    },
    reset: function reset () {
      this.items = [];
      this.query = this.value;
      this.loading = false;
    },
    down: function down () {
      if (this.current < this.items.length - 1) {
        this.current++;
      } else {
        this.current = -1;
      }
    },
    up: function up () {
      if (this.current > 0) {
        this.current--;
      } else if (this.current === -1) {
        this.current = this.items.length - 1;
      } else {
        this.current = -1;
      }
    },
    setActive: function setActive (index) {
      this.current = index;
    },
    activeClass: function activeClass (index) {
      return {
        active: this.current === index
      }
    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    var options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    var hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            var originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            var existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

var isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return function (id, style) { return addStyle(id, style); };
}
var HEAD;
var styles = {};
function addStyle(id, css) {
    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        var code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                { style.element.setAttribute('media', css.media); }
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            var index = style.ids.size - 1;
            var textNode = document.createTextNode(code);
            var nodes = style.element.childNodes;
            if (nodes[index])
                { style.element.removeChild(nodes[index]); }
            if (nodes.length)
                { style.element.insertBefore(textNode, nodes[index]); }
            else
                { style.element.appendChild(textNode); }
        }
    }
}

/* script */
var __vue_script__ = script;

/* template */
var __vue_render__ = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "ui-typeahead" }, [
    _vm.type === "checkbox"
      ? _c("input", {
          directives: [
            {
              name: "model",
              rawName: "v-model",
              value: _vm.query,
              expression: "query",
            } ],
          class: _vm.classname,
          attrs: {
            name: _vm.name,
            maxlength: _vm.maxlength,
            minlength: _vm.minlength,
            required: _vm.required,
            autocomplete: "off",
            type: "checkbox",
          },
          domProps: {
            checked: Array.isArray(_vm.query)
              ? _vm._i(_vm.query, null) > -1
              : _vm.query,
          },
          on: {
            keydown: [
              function ($event) {
                if (
                  !$event.type.indexOf("key") &&
                  _vm._k($event.keyCode, "down", 40, $event.key, [
                    "Down",
                    "ArrowDown" ])
                ) {
                  return null
                }
                return _vm.down.apply(null, arguments)
              },
              function ($event) {
                if (
                  !$event.type.indexOf("key") &&
                  _vm._k($event.keyCode, "up", 38, $event.key, [
                    "Up",
                    "ArrowUp" ])
                ) {
                  return null
                }
                return _vm.up.apply(null, arguments)
              },
              function ($event) {
                if (
                  !$event.type.indexOf("key") &&
                  _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")
                ) {
                  return null
                }
                $event.stopPropagation();
                $event.preventDefault();
                return _vm.hit.apply(null, arguments)
              },
              function ($event) {
                if (
                  !$event.type.indexOf("key") &&
                  _vm._k($event.keyCode, "esc", 27, $event.key, [
                    "Esc",
                    "Escape" ])
                ) {
                  return null
                }
                return _vm.reset.apply(null, arguments)
              } ],
            blur: _vm.reset,
            input: _vm.update,
            change: function ($event) {
              var $$a = _vm.query,
                $$el = $event.target,
                $$c = $$el.checked ? true : false;
              if (Array.isArray($$a)) {
                var $$v = null,
                  $$i = _vm._i($$a, $$v);
                if ($$el.checked) {
                  $$i < 0 && (_vm.query = $$a.concat([$$v]));
                } else {
                  $$i > -1 &&
                    (_vm.query = $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
                }
              } else {
                _vm.query = $$c;
              }
            },
          },
        })
      : _vm.type === "radio"
      ? _c("input", {
          directives: [
            {
              name: "model",
              rawName: "v-model",
              value: _vm.query,
              expression: "query",
            } ],
          class: _vm.classname,
          attrs: {
            name: _vm.name,
            maxlength: _vm.maxlength,
            minlength: _vm.minlength,
            required: _vm.required,
            autocomplete: "off",
            type: "radio",
          },
          domProps: { checked: _vm._q(_vm.query, null) },
          on: {
            keydown: [
              function ($event) {
                if (
                  !$event.type.indexOf("key") &&
                  _vm._k($event.keyCode, "down", 40, $event.key, [
                    "Down",
                    "ArrowDown" ])
                ) {
                  return null
                }
                return _vm.down.apply(null, arguments)
              },
              function ($event) {
                if (
                  !$event.type.indexOf("key") &&
                  _vm._k($event.keyCode, "up", 38, $event.key, [
                    "Up",
                    "ArrowUp" ])
                ) {
                  return null
                }
                return _vm.up.apply(null, arguments)
              },
              function ($event) {
                if (
                  !$event.type.indexOf("key") &&
                  _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")
                ) {
                  return null
                }
                $event.stopPropagation();
                $event.preventDefault();
                return _vm.hit.apply(null, arguments)
              },
              function ($event) {
                if (
                  !$event.type.indexOf("key") &&
                  _vm._k($event.keyCode, "esc", 27, $event.key, [
                    "Esc",
                    "Escape" ])
                ) {
                  return null
                }
                return _vm.reset.apply(null, arguments)
              } ],
            blur: _vm.reset,
            input: _vm.update,
            change: function ($event) {
              _vm.query = null;
            },
          },
        })
      : _c("input", {
          directives: [
            {
              name: "model",
              rawName: "v-model",
              value: _vm.query,
              expression: "query",
            } ],
          class: _vm.classname,
          attrs: {
            name: _vm.name,
            maxlength: _vm.maxlength,
            minlength: _vm.minlength,
            required: _vm.required,
            autocomplete: "off",
            type: _vm.type,
          },
          domProps: { value: _vm.query },
          on: {
            keydown: [
              function ($event) {
                if (
                  !$event.type.indexOf("key") &&
                  _vm._k($event.keyCode, "down", 40, $event.key, [
                    "Down",
                    "ArrowDown" ])
                ) {
                  return null
                }
                return _vm.down.apply(null, arguments)
              },
              function ($event) {
                if (
                  !$event.type.indexOf("key") &&
                  _vm._k($event.keyCode, "up", 38, $event.key, [
                    "Up",
                    "ArrowUp" ])
                ) {
                  return null
                }
                return _vm.up.apply(null, arguments)
              },
              function ($event) {
                if (
                  !$event.type.indexOf("key") &&
                  _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")
                ) {
                  return null
                }
                $event.stopPropagation();
                $event.preventDefault();
                return _vm.hit.apply(null, arguments)
              },
              function ($event) {
                if (
                  !$event.type.indexOf("key") &&
                  _vm._k($event.keyCode, "esc", 27, $event.key, [
                    "Esc",
                    "Escape" ])
                ) {
                  return null
                }
                return _vm.reset.apply(null, arguments)
              } ],
            blur: _vm.reset,
            input: [
              function ($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.query = $event.target.value;
              },
              _vm.update ],
          },
        }),
    _vm._v(" "),
    _c(
      "ul",
      {
        directives: [
          {
            name: "show",
            rawName: "v-show",
            value: _vm.hasItems,
            expression: "hasItems",
          } ],
        staticClass: "list-unstyled",
      },
      _vm._l(_vm.items, function (item, $item) {
        return _c(
          "li",
          {
            class: _vm.activeClass($item),
            on: {
              mousedown: _vm.hit,
              mousemove: function ($event) {
                return _vm.setActive($item)
              },
            },
          },
          [_c("span", { domProps: { textContent: _vm._s(item.text) } })]
        )
      }),
      0
    ) ])
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  var __vue_inject_styles__ = function (inject) {
    if (!inject) { return }
    inject("data-v-1c8d3ecc_0", { source: ".ui-typeahead[data-v-1c8d3ecc] {\n  padding: 0;\n  border: none;\n  position: relative;\n}\n.ui-typeahead ul[data-v-1c8d3ecc] {\n  width: 100%;\n  max-height: 350px;\n  overflow-y: auto;\n  margin-top: 0.125rem 0 0;\n  position: absolute;\n  z-index: 999;\n  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);\n  border-radius: 5px;\n  border: 1px solid #ced4da;\n}\n.ui-typeahead ul > li[data-v-1c8d3ecc] {\n  background-color: #fff;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.125);\n  display: block;\n  padding: 0.25rem 1rem;\n  position: relative;\n  cursor: pointer;\n}\n.ui-typeahead ul > li[data-v-1c8d3ecc]:last-child {\n  border: none;\n}\n.ui-typeahead ul > li.active[data-v-1c8d3ecc], .ui-typeahead ul > li[data-v-1c8d3ecc]:hover {\n  color: #fff;\n  background-color: #007bff;\n}\n\n/*# sourceMappingURL=Typeahead.vue.map */", map: {"version":3,"sources":["/home/filsh/www/mailery/node_modules/@maileryio/widget-typeahead-assets/src/components/Typeahead.vue","Typeahead.vue"],"names":[],"mappings":"AA4HA;EACA,UAAA;EACA,YAAA;EACA,kBAAA;AC3HA;AD6HA;EACA,WAAA;EACA,iBAAA;EACA,gBAAA;EACA,wBAAA;EACA,kBAAA;EACA,YAAA;EACA,6CAAA;EACA,kBAAA;EACA,yBAAA;AC3HA;AD6HA;EACA,sBAAA;EACA,6CAAA;EACA,cAAA;EACA,qBAAA;EACA,kBAAA;EACA,eAAA;AC3HA;AD6HA;EACA,YAAA;AC3HA;AD8HA;EAEA,WAAA;EACA,yBAAA;AC7HA;;AAEA,wCAAwC","file":"Typeahead.vue","sourcesContent":["<template>\n  <div class=\"ui-typeahead\">\n    <input\n      :type=\"type\"\n      :name=\"name\"\n      :class=\"classname\"\n      :maxlength=\"maxlength\"\n      :minlength=\"minlength\"\n      :required=\"required\"\n      v-model=\"query\"\n      autocomplete=\"off\"\n      @keydown.down=\"down\"\n      @keydown.up=\"up\"\n      @keydown.enter.stop.prevent=\"hit\"\n      @keydown.esc=\"reset\"\n      @blur=\"reset\"\n      @input=\"update\"\n    />\n\n    <ul v-show=\"hasItems\" class=\"list-unstyled\">\n      <li v-for=\"(item, $item) in items\" :class=\"activeClass($item)\" @mousedown=\"hit\" @mousemove=\"setActive($item)\">\n        <span v-text=\"item.text\"></span>\n      </li>\n    </ul>\n  </div>\n</template>\n\n<script>\n  export default {\n    name: 'ui-typeahead',\n    props: {\n      url: String,\n      type: String,\n      name: String,\n      value: String,\n      maxlength: Number,\n      minlength: Number,\n      required: String,\n      classname: String\n    },\n    data () {\n      return {\n        items: [],\n        query: this.value,\n        current: -1,\n        loading: false,\n        limit: 5,\n        minChars: 1\n      }\n    },\n    computed: {\n      hasItems () {\n        return this.items.length > 0\n      }\n    },\n\n    methods: {\n      update () {\n        if (!this.query) {\n          return this.reset();\n        }\n\n        if (this.minChars && this.query.length < this.minChars) {\n          return;\n        }\n\n        this.loading = true;\n\n        this.fetch()\n          .then(response => response.json())\n          .then((response) => {\n            if (response && this.query) {\n              this.items = this.limit ? response.slice(0, this.limit) : response;\n              this.current = -1;\n              this.loading = false;\n            }\n          });\n      },\n      fetch () {\n        let url = this.url;\n        url += (url.indexOf('?') === -1 ? '?' : '&') + 'q=' + encodeURIComponent(this.query);\n\n        return fetch(url);\n      },\n      hit (e) {\n        if (this.current !== -1) {\n          this.value = this.items[this.current].text;\n          this.reset();\n        }\n      },\n      reset () {\n        this.items = [];\n        this.query = this.value;\n        this.loading = false;\n      },\n      down () {\n        if (this.current < this.items.length - 1) {\n          this.current++;\n        } else {\n          this.current = -1;\n        }\n      },\n      up () {\n        if (this.current > 0) {\n          this.current--;\n        } else if (this.current === -1) {\n          this.current = this.items.length - 1;\n        } else {\n          this.current = -1;\n        }\n      },\n      setActive (index) {\n        this.current = index\n      },\n      activeClass (index) {\n        return {\n          active: this.current === index\n        }\n      }\n    }\n  }\n</script>\n\n<style lang=\"scss\" scoped>\n  .ui-typeahead {\n    padding: 0;\n    border: none;\n    position: relative;\n\n    ul {\n      width: 100%;\n      max-height: 350px;\n      overflow-y: auto;\n      margin-top: .125rem 0 0;\n      position: absolute;\n      z-index: 999;\n      box-shadow: 0 .5rem 1rem rgba(0,0,0,.15);\n      border-radius: 5px;\n      border: 1px solid #ced4da;\n\n      &>li {\n        background-color: #fff;\n        border-bottom: 1px solid rgba(0,0,0,.125);\n        display: block;\n        padding: .25rem 1rem;\n        position: relative;\n        cursor: pointer;\n\n        &:last-child {\n          border: none;\n        }\n\n        &.active,\n        &:hover {\n          color: #fff;\n          background-color: #007bff;\n        }\n      }\n    }\n  }\n</style>\n",".ui-typeahead {\n  padding: 0;\n  border: none;\n  position: relative;\n}\n.ui-typeahead ul {\n  width: 100%;\n  max-height: 350px;\n  overflow-y: auto;\n  margin-top: 0.125rem 0 0;\n  position: absolute;\n  z-index: 999;\n  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);\n  border-radius: 5px;\n  border: 1px solid #ced4da;\n}\n.ui-typeahead ul > li {\n  background-color: #fff;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.125);\n  display: block;\n  padding: 0.25rem 1rem;\n  position: relative;\n  cursor: pointer;\n}\n.ui-typeahead ul > li:last-child {\n  border: none;\n}\n.ui-typeahead ul > li.active, .ui-typeahead ul > li:hover {\n  color: #fff;\n  background-color: #007bff;\n}\n\n/*# sourceMappingURL=Typeahead.vue.map */"]}, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__ = "data-v-1c8d3ecc";
  /* module identifier */
  var __vue_module_identifier__ = undefined;
  /* functional template */
  var __vue_is_functional_template__ = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  var __vue_component__ = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    createInjector,
    undefined,
    undefined
  );

var plugin = {
  install: install,
  component: __vue_component__
};

(function (plugin) {
  if (typeof window !== 'undefined' && window.Vue) {
    Vue.use(plugin);
  }
})(plugin);

function install(Vue, options) {
  Vue.component(__vue_component__.name, __vue_component__);
}

export default plugin;
export { install };
//# sourceMappingURL=main.esm.js.map
