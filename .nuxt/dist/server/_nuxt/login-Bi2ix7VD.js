import { s as stdin_default, a as stdin_default$1, b as stdin_default$2 } from "./index-CRnLP5qR.js";
import { b as usePlayerStore, s as stdin_default$3, c as showToast } from "./player-DGNQd8vS.js";
import "./index-HaumD47W.js";
import { defineComponent, ref, mergeProps, withCtx, createVNode, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { useRouter } from "vue-router";
import { _ as _export_sfc } from "../server.mjs";
import "D:/workSpace/demo1222/node_modules/ohash/dist/index.mjs";
import "@vue/shared";
import "D:/workSpace/demo1222/node_modules/perfect-debounce/dist/index.mjs";
import "D:/workSpace/demo1222/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "D:/workSpace/demo1222/node_modules/hookable/dist/index.mjs";
import "D:/workSpace/demo1222/node_modules/unctx/dist/index.mjs";
import "D:/workSpace/demo1222/node_modules/h3/dist/index.mjs";
import "D:/workSpace/demo1222/node_modules/radix3/dist/index.mjs";
import "D:/workSpace/demo1222/node_modules/defu/dist/defu.mjs";
import "D:/workSpace/demo1222/node_modules/ufo/dist/index.mjs";
import "D:/workSpace/demo1222/node_modules/klona/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    const username = ref("");
    const password = ref("");
    const loading = ref(false);
    const router = useRouter();
    const playerStore = usePlayerStore();
    const onSubmit = async () => {
      if (!username.value || !password.value) {
        return;
      }
      loading.value = true;
      try {
        await playerStore.login({
          username: username.value,
          password: password.value
        });
        showToast("登录成功");
        router.push("/");
      } catch (error) {
        error?.message || "登录失败，请稍后重试";
      } finally {
        loading.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_van_form = stdin_default;
      const _component_van_cell_group = stdin_default$1;
      const _component_van_field = stdin_default$2;
      const _component_van_button = stdin_default$3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page" }, _attrs))} data-v-7fa6176b><div class="header" data-v-7fa6176b><h1 class="title" data-v-7fa6176b>凡人修仙传·掌上仙途</h1><p class="subtitle" data-v-7fa6176b>登录后踏上修仙之路</p></div>`);
      _push(ssrRenderComponent(_component_van_form, { onSubmit }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_van_cell_group, { inset: "" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_van_field, {
                    modelValue: username.value,
                    "onUpdate:modelValue": ($event) => username.value = $event,
                    name: "username",
                    label: "账号",
                    placeholder: "请输入账号",
                    autocomplete: "username",
                    clearable: ""
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_van_field, {
                    modelValue: password.value,
                    "onUpdate:modelValue": ($event) => password.value = $event,
                    name: "password",
                    label: "密码",
                    type: "password",
                    placeholder: "请输入密码",
                    autocomplete: "current-password",
                    clearable: ""
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_van_field, {
                      modelValue: username.value,
                      "onUpdate:modelValue": ($event) => username.value = $event,
                      name: "username",
                      label: "账号",
                      placeholder: "请输入账号",
                      autocomplete: "username",
                      clearable: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_van_field, {
                      modelValue: password.value,
                      "onUpdate:modelValue": ($event) => password.value = $event,
                      name: "password",
                      label: "密码",
                      type: "password",
                      placeholder: "请输入密码",
                      autocomplete: "current-password",
                      clearable: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="actions" data-v-7fa6176b${_scopeId}>`);
            _push2(ssrRenderComponent(_component_van_button, {
              round: "",
              block: "",
              type: "primary",
              "native-type": "submit",
              loading: loading.value
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` 登录 `);
                } else {
                  return [
                    createTextVNode(" 登录 ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_van_button, {
              round: "",
              block: "",
              type: "default",
              class: "register-button",
              to: { path: "/register" }
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` 去注册 `);
                } else {
                  return [
                    createTextVNode(" 去注册 ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode(_component_van_cell_group, { inset: "" }, {
                default: withCtx(() => [
                  createVNode(_component_van_field, {
                    modelValue: username.value,
                    "onUpdate:modelValue": ($event) => username.value = $event,
                    name: "username",
                    label: "账号",
                    placeholder: "请输入账号",
                    autocomplete: "username",
                    clearable: ""
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(_component_van_field, {
                    modelValue: password.value,
                    "onUpdate:modelValue": ($event) => password.value = $event,
                    name: "password",
                    label: "密码",
                    type: "password",
                    placeholder: "请输入密码",
                    autocomplete: "current-password",
                    clearable: ""
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                _: 1
              }),
              createVNode("div", { class: "actions" }, [
                createVNode(_component_van_button, {
                  round: "",
                  block: "",
                  type: "primary",
                  "native-type": "submit",
                  loading: loading.value
                }, {
                  default: withCtx(() => [
                    createTextVNode(" 登录 ")
                  ]),
                  _: 1
                }, 8, ["loading"]),
                createVNode(_component_van_button, {
                  round: "",
                  block: "",
                  type: "default",
                  class: "register-button",
                  to: { path: "/register" }
                }, {
                  default: withCtx(() => [
                    createTextVNode(" 去注册 ")
                  ]),
                  _: 1
                })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const login = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-7fa6176b"]]);
export {
  login as default
};
//# sourceMappingURL=login-Bi2ix7VD.js.map
