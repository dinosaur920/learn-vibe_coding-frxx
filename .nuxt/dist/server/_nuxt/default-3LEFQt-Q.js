import { ref, watch, nextTick, createVNode, defineComponent, getCurrentInstance, computed, mergeProps, withCtx, createTextVNode, useSSRContext } from "vue";
import { L as windowWidth, M as windowHeight, N as useRect, A as makeNumericProp, n as numericProp, t as truthProp, c as createNamespace, k as useChildren, a as getZIndexStyle, G as BORDER_TOP_BOTTOM, e as extend, j as useRoute, y as useParent, O as Badge, r as routeProps, o as isObject, I as Icon } from "./index-Cm1_ppAu.js";
import { o as onPopupReopen, c as callInterceptor } from "./on-popup-reopen-uhTaiOfv.js";
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "../server.mjs";
import "D:/workSpace/demo1222/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "D:/workSpace/demo1222/node_modules/hookable/dist/index.mjs";
import "D:/workSpace/demo1222/node_modules/unctx/dist/index.mjs";
import "D:/workSpace/demo1222/node_modules/h3/dist/index.mjs";
import "vue-router";
import "D:/workSpace/demo1222/node_modules/radix3/dist/index.mjs";
import "D:/workSpace/demo1222/node_modules/defu/dist/defu.mjs";
import "D:/workSpace/demo1222/node_modules/ufo/dist/index.mjs";
import "D:/workSpace/demo1222/node_modules/klona/dist/index.mjs";
const useHeight = (element, withSafeArea) => {
  const height = ref();
  const setHeight = () => {
    height.value = useRect(element).height;
  };
  onPopupReopen(() => nextTick(setHeight));
  watch([windowWidth, windowHeight], setHeight);
  return height;
};
function usePlaceholder(contentRef, bem2) {
  const height = useHeight(contentRef);
  return (renderContent) => createVNode("div", {
    "class": bem2("placeholder"),
    "style": {
      height: height.value ? `${height.value}px` : void 0
    }
  }, [renderContent()]);
}
const [name$1, bem$1] = createNamespace("tabbar");
const tabbarProps = {
  route: Boolean,
  fixed: truthProp,
  border: truthProp,
  zIndex: numericProp,
  placeholder: Boolean,
  activeColor: String,
  beforeChange: Function,
  inactiveColor: String,
  modelValue: makeNumericProp(0),
  safeAreaInsetBottom: {
    type: Boolean,
    default: null
  }
};
const TABBAR_KEY = Symbol(name$1);
var stdin_default$1 = defineComponent({
  name: name$1,
  props: tabbarProps,
  emits: ["change", "update:modelValue"],
  setup(props, {
    emit,
    slots
  }) {
    const root = ref();
    const {
      linkChildren
    } = useChildren(TABBAR_KEY);
    const renderPlaceholder = usePlaceholder(root, bem$1);
    const enableSafeArea = () => {
      var _a;
      return (_a = props.safeAreaInsetBottom) != null ? _a : props.fixed;
    };
    const renderTabbar = () => {
      var _a;
      const {
        fixed,
        zIndex,
        border
      } = props;
      return createVNode("div", {
        "ref": root,
        "role": "tablist",
        "style": getZIndexStyle(zIndex),
        "class": [bem$1({
          fixed
        }), {
          [BORDER_TOP_BOTTOM]: border,
          "van-safe-area-bottom": enableSafeArea()
        }]
      }, [(_a = slots.default) == null ? void 0 : _a.call(slots)]);
    };
    const setActive = (active, afterChange) => {
      callInterceptor(props.beforeChange, {
        args: [active],
        done() {
          emit("update:modelValue", active);
          emit("change", active);
          afterChange();
        }
      });
    };
    linkChildren({
      props,
      setActive
    });
    return () => {
      if (props.fixed && props.placeholder) {
        return renderPlaceholder(renderTabbar);
      }
      return renderTabbar();
    };
  }
});
const [name, bem] = createNamespace("tabbar-item");
const tabbarItemProps = extend({}, routeProps, {
  dot: Boolean,
  icon: String,
  name: numericProp,
  badge: numericProp,
  badgeProps: Object,
  iconPrefix: String
});
var stdin_default = defineComponent({
  name,
  props: tabbarItemProps,
  emits: ["click"],
  setup(props, {
    emit,
    slots
  }) {
    const route = useRoute();
    const vm = getCurrentInstance().proxy;
    const {
      parent,
      index
    } = useParent(TABBAR_KEY);
    if (!parent) {
      if (process.env.NODE_ENV !== "production") {
        console.error("[Vant] <TabbarItem> must be a child component of <Tabbar>.");
      }
      return;
    }
    const active = computed(() => {
      var _a;
      const {
        route: route2,
        modelValue
      } = parent.props;
      if (route2 && "$route" in vm) {
        const {
          $route
        } = vm;
        const {
          to
        } = props;
        const config = isObject(to) ? to : {
          path: to
        };
        return $route.matched.some((val) => {
          const pathMatched = "path" in config && config.path === val.path;
          const nameMatched = "name" in config && config.name === val.name;
          return pathMatched || nameMatched;
        });
      }
      return ((_a = props.name) != null ? _a : index.value) === modelValue;
    });
    const onClick = (event) => {
      var _a;
      if (!active.value) {
        parent.setActive((_a = props.name) != null ? _a : index.value, route);
      }
      emit("click", event);
    };
    const renderIcon = () => {
      if (slots.icon) {
        return slots.icon({
          active: active.value
        });
      }
      if (props.icon) {
        return createVNode(Icon, {
          "name": props.icon,
          "classPrefix": props.iconPrefix
        }, null);
      }
    };
    return () => {
      var _a;
      const {
        dot,
        badge
      } = props;
      const {
        activeColor,
        inactiveColor
      } = parent.props;
      const color = active.value ? activeColor : inactiveColor;
      return createVNode("div", {
        "role": "tab",
        "class": bem({
          active: active.value
        }),
        "style": {
          color
        },
        "tabindex": 0,
        "aria-selected": active.value,
        "onClick": onClick
      }, [createVNode(Badge, mergeProps({
        "dot": dot,
        "class": bem("icon"),
        "content": badge
      }, props.badgeProps), {
        default: renderIcon
      }), createVNode("div", {
        "class": bem("text")
      }, [(_a = slots.default) == null ? void 0 : _a.call(slots, {
        active: active.value
      })])]);
    };
  }
});
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_van_tabbar = stdin_default$1;
  const _component_van_tabbar_item = stdin_default;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "layout" }, _attrs))} data-v-a01bed2d><div class="layout-content" data-v-a01bed2d>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</div>`);
  _push(ssrRenderComponent(_component_van_tabbar, {
    route: "",
    fixed: "",
    "safe-area-inset-bottom": ""
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_van_tabbar_item, {
          replace: "",
          to: "/",
          icon: "fire-o"
        }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(` 修炼 `);
            } else {
              return [
                createTextVNode(" 修炼 ")
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_van_tabbar_item, {
          replace: "",
          to: "/cave",
          icon: "home-o"
        }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(` 洞府 `);
            } else {
              return [
                createTextVNode(" 洞府 ")
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_van_tabbar_item, {
          replace: "",
          to: "/inventory",
          icon: "bag-o"
        }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(` 行囊 `);
            } else {
              return [
                createTextVNode(" 行囊 ")
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_van_tabbar_item, {
            replace: "",
            to: "/",
            icon: "fire-o"
          }, {
            default: withCtx(() => [
              createTextVNode(" 修炼 ")
            ]),
            _: 1
          }),
          createVNode(_component_van_tabbar_item, {
            replace: "",
            to: "/cave",
            icon: "home-o"
          }, {
            default: withCtx(() => [
              createTextVNode(" 洞府 ")
            ]),
            _: 1
          }),
          createVNode(_component_van_tabbar_item, {
            replace: "",
            to: "/inventory",
            icon: "bag-o"
          }, {
            default: withCtx(() => [
              createTextVNode(" 行囊 ")
            ]),
            _: 1
          })
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _default = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-a01bed2d"]]);
export {
  _default as default
};
//# sourceMappingURL=default-3LEFQt-Q.js.map
