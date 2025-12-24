import { s as stdin_default$2, a as stdin_default, b as stdin_default$1 } from './index-h-ANtw95.mjs';
import { s as stdin_default$3, a as showToast } from './function-call-BpCHN0rm.mjs';
import { defineComponent, ref, mergeProps, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { useRouter } from 'vue-router';
import { u as usePlayerStore } from './player-CH_xINOg.mjs';
import { _ as _export_sfc } from './server.mjs';
import './index-Cm1_ppAu.mjs';
import './use-scope-id-BAB5BiSn.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@vue/shared';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "register",
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
        await playerStore.register({
          username: username.value,
          password: password.value
        });
        showToast("\u6CE8\u518C\u6210\u529F\uFF0C\u8BF7\u767B\u5F55");
        router.push("/login");
      } catch (error) {
        (error == null ? void 0 : error.message) || "\u6CE8\u518C\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5";
      } finally {
        loading.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_van_form = stdin_default$2;
      const _component_van_cell_group = stdin_default;
      const _component_van_field = stdin_default$1;
      const _component_van_button = stdin_default$3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page" }, _attrs))} data-v-a376acc7><div class="header" data-v-a376acc7><h1 class="title" data-v-a376acc7>\u51E1\u4EBA\u4FEE\u4ED9\u4F20\xB7\u638C\u4E0A\u4ED9\u9014</h1><p class="subtitle" data-v-a376acc7>\u65B0\u5EFA\u8D26\u53F7\uFF0C\u5F00\u542F\u4FEE\u4ED9\u65C5\u7A0B</p></div>`);
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
                    label: "\u8D26\u53F7",
                    placeholder: "\u8BF7\u8F93\u5165\u8D26\u53F7",
                    autocomplete: "username",
                    clearable: ""
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_van_field, {
                    modelValue: password.value,
                    "onUpdate:modelValue": ($event) => password.value = $event,
                    name: "password",
                    label: "\u5BC6\u7801",
                    type: "password",
                    placeholder: "\u8BF7\u8F93\u5165\u5BC6\u7801",
                    autocomplete: "new-password",
                    clearable: ""
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_van_field, {
                      modelValue: username.value,
                      "onUpdate:modelValue": ($event) => username.value = $event,
                      name: "username",
                      label: "\u8D26\u53F7",
                      placeholder: "\u8BF7\u8F93\u5165\u8D26\u53F7",
                      autocomplete: "username",
                      clearable: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_van_field, {
                      modelValue: password.value,
                      "onUpdate:modelValue": ($event) => password.value = $event,
                      name: "password",
                      label: "\u5BC6\u7801",
                      type: "password",
                      placeholder: "\u8BF7\u8F93\u5165\u5BC6\u7801",
                      autocomplete: "new-password",
                      clearable: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="actions" data-v-a376acc7${_scopeId}>`);
            _push2(ssrRenderComponent(_component_van_button, {
              round: "",
              block: "",
              type: "primary",
              "native-type": "submit",
              loading: loading.value
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` \u6CE8\u518C `);
                } else {
                  return [
                    createTextVNode(" \u6CE8\u518C ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_van_button, {
              round: "",
              block: "",
              type: "default",
              class: "login-button",
              to: { path: "/login" }
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` \u8FD4\u56DE\u767B\u5F55 `);
                } else {
                  return [
                    createTextVNode(" \u8FD4\u56DE\u767B\u5F55 ")
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
                    label: "\u8D26\u53F7",
                    placeholder: "\u8BF7\u8F93\u5165\u8D26\u53F7",
                    autocomplete: "username",
                    clearable: ""
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(_component_van_field, {
                    modelValue: password.value,
                    "onUpdate:modelValue": ($event) => password.value = $event,
                    name: "password",
                    label: "\u5BC6\u7801",
                    type: "password",
                    placeholder: "\u8BF7\u8F93\u5165\u5BC6\u7801",
                    autocomplete: "new-password",
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
                    createTextVNode(" \u6CE8\u518C ")
                  ]),
                  _: 1
                }, 8, ["loading"]),
                createVNode(_component_van_button, {
                  round: "",
                  block: "",
                  type: "default",
                  class: "login-button",
                  to: { path: "/login" }
                }, {
                  default: withCtx(() => [
                    createTextVNode(" \u8FD4\u56DE\u767B\u5F55 ")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/register.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const register = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a376acc7"]]);

export { register as default };
//# sourceMappingURL=register-Cfj2UYJh.mjs.map
