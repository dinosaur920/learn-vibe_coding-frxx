import { defineComponent, ref, computed, mergeProps, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext } from 'vue';
import { n as numericProp, t as truthProp, c as createNamespace, h as addUnit } from './index-Cm1_ppAu.mjs';
import { s as stdin_default$1, a as showToast } from './function-call-BpCHN0rm.mjs';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { useRouter } from 'vue-router';
import { u as usePlayerStore } from './player-CH_xINOg.mjs';
import { c as calculateCultivationGainPerSecond, u as useIntervalFn } from './gameConstants-nrAnxKd7.mjs';
import { _ as _export_sfc } from './server.mjs';
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

const [name, bem] = createNamespace("progress");
const progressProps = {
  color: String,
  inactive: Boolean,
  pivotText: String,
  textColor: String,
  showPivot: truthProp,
  pivotColor: String,
  trackColor: String,
  strokeWidth: numericProp,
  percentage: {
    type: numericProp,
    default: 0,
    validator: (value) => +value >= 0 && +value <= 100
  }
};
var stdin_default = defineComponent({
  name,
  props: progressProps,
  setup(props) {
    const background = computed(() => props.inactive ? void 0 : props.color);
    const format = (rate) => Math.min(Math.max(+rate, 0), 100);
    const renderPivot = () => {
      const {
        textColor,
        pivotText,
        pivotColor,
        percentage
      } = props;
      const safePercentage = format(percentage);
      const text = pivotText != null ? pivotText : `${percentage}%`;
      if (props.showPivot && text) {
        const style = {
          color: textColor,
          left: `${safePercentage}%`,
          transform: `translate(-${safePercentage}%,-50%)`,
          background: pivotColor || background.value
        };
        return createVNode("span", {
          "style": style,
          "class": bem("pivot", {
            inactive: props.inactive
          })
        }, [text]);
      }
    };
    return () => {
      const {
        trackColor,
        percentage,
        strokeWidth
      } = props;
      const safePercentage = format(percentage);
      const rootStyle = {
        background: trackColor,
        height: addUnit(strokeWidth)
      };
      const portionStyle = {
        width: `${safePercentage}%`,
        background: background.value
      };
      return createVNode("div", {
        "class": bem(),
        "style": rootStyle
      }, [createVNode("span", {
        "class": bem("portion", {
          inactive: props.inactive
        }),
        "style": portionStyle
      }, null), renderPivot()]);
    };
  }
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const router = useRouter();
    const playerStore = usePlayerStore();
    const cultivating = ref(false);
    const autoCultivate = ref(true);
    const breakingThrough = ref(false);
    const playerInfo = computed(() => playerStore.playerInfo);
    const progressPercent = computed(() => {
      if (!playerInfo.value || playerInfo.value.maxCultivation <= 0) {
        return 0;
      }
      const value = playerInfo.value.cultivation / playerInfo.value.maxCultivation * 100;
      if (value < 0) {
        return 0;
      }
      if (value > 100) {
        return 100;
      }
      return Math.floor(value);
    });
    const cultivationSpeed = computed(() => {
      if (!playerInfo.value) {
        return 0;
      }
      const realm = playerInfo.value.realm;
      const spiritRoot = playerInfo.value.spiritRoot;
      return calculateCultivationGainPerSecond(spiritRoot, realm);
    });
    const canBreakthrough = computed(() => {
      if (!playerInfo.value) {
        return false;
      }
      if (playerInfo.value.maxCultivation <= 0) {
        return false;
      }
      return playerInfo.value.cultivation >= playerInfo.value.maxCultivation;
    });
    const runCultivate = async () => {
      if (!playerInfo.value) {
        return;
      }
      if (typeof playerStore.cultivate !== "function") {
        return;
      }
      try {
        await playerStore.cultivate();
      } catch (error) {
        (error == null ? void 0 : error.message) || "\u4FEE\u70BC\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5";
      }
    };
    const onCultivateOnce = async () => {
      if (!playerInfo.value) {
        router.push("/login");
        return;
      }
      if (cultivating.value) {
        return;
      }
      cultivating.value = true;
      try {
        await runCultivate();
      } finally {
        cultivating.value = false;
      }
    };
    const onBreakthrough = async () => {
      if (!playerInfo.value) {
        router.push("/login");
        return;
      }
      if (!canBreakthrough.value) {
        return;
      }
      if (breakingThrough.value) {
        return;
      }
      if (typeof playerStore.breakthrough !== "function") {
        return;
      }
      breakingThrough.value = true;
      try {
        await playerStore.breakthrough();
        showToast("\u7A81\u7834\u6210\u529F\uFF01");
      } catch (error) {
        (error == null ? void 0 : error.message) || "\u7A81\u7834\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5";
      } finally {
        breakingThrough.value = false;
      }
    };
    const toggleAutoCultivate = () => {
      autoCultivate.value = !autoCultivate.value;
    };
    useIntervalFn(
      () => {
        if (!autoCultivate.value) {
          return;
        }
        if (!playerInfo.value) {
          return;
        }
        if (typeof playerStore.cultivate !== "function") {
          return;
        }
        playerStore.cultivate().catch(() => {
        });
      },
      1e3,
      {
        immediate: false
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_van_progress = stdin_default;
      const _component_van_button = stdin_default$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page" }, _attrs))} data-v-c00410e2><div class="header" data-v-c00410e2><h1 class="title" data-v-c00410e2>\u51E1\u4EBA\u4FEE\u4ED9\u4F20\xB7\u638C\u4E0A\u4ED9\u9014</h1><p class="subtitle" data-v-c00410e2>\u9759\u5750\u5410\u7EB3\uFF0C\u4FEE\u70BC\u771F\u5143</p></div>`);
      if (playerInfo.value) {
        _push(`<div class="card" data-v-c00410e2><div class="row" data-v-c00410e2><span class="label" data-v-c00410e2>\u9053\u53F7</span><span class="value" data-v-c00410e2>${ssrInterpolate(playerInfo.value.username)}</span></div><div class="row" data-v-c00410e2><span class="label" data-v-c00410e2>\u5883\u754C</span><span class="value" data-v-c00410e2>${ssrInterpolate(playerInfo.value.realmLabel)}</span></div><div class="row" data-v-c00410e2><span class="label" data-v-c00410e2>\u7075\u6839</span><span class="value" data-v-c00410e2>${ssrInterpolate(playerInfo.value.spiritRootLabel)}</span></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (playerInfo.value) {
        _push(`<div class="card" data-v-c00410e2><div class="row" data-v-c00410e2><span class="label" data-v-c00410e2>\u5F53\u524D\u4FEE\u4E3A</span><span class="value" data-v-c00410e2>${ssrInterpolate(playerInfo.value.cultivation)} / ${ssrInterpolate(playerInfo.value.maxCultivation)}</span></div>`);
        _push(ssrRenderComponent(_component_van_progress, {
          percentage: progressPercent.value,
          "show-pivot": false
        }, null, _parent));
        _push(`<div class="row" data-v-c00410e2><span class="label" data-v-c00410e2>\u4FEE\u70BC\u901F\u5EA6</span><span class="value" data-v-c00410e2>${ssrInterpolate(cultivationSpeed.value.toFixed(2))} / \u79D2 </span></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (playerInfo.value) {
        _push(`<div class="actions" data-v-c00410e2>`);
        _push(ssrRenderComponent(_component_van_button, {
          type: "primary",
          round: "",
          block: "",
          loading: cultivating.value,
          onClick: onCultivateOnce
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` \u6253\u5750\u4FEE\u70BC `);
            } else {
              return [
                createTextVNode(" \u6253\u5750\u4FEE\u70BC ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_van_button, {
          type: "success",
          round: "",
          block: "",
          loading: breakingThrough.value,
          disabled: !canBreakthrough.value,
          onClick: onBreakthrough
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` \u7A81\u7834 `);
            } else {
              return [
                createTextVNode(" \u7A81\u7834 ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_van_button, {
          type: "default",
          round: "",
          block: "",
          onClick: toggleAutoCultivate
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(autoCultivate.value ? "\u6682\u505C\u6302\u673A" : "\u5F00\u59CB\u6302\u673A")}`);
            } else {
              return [
                createTextVNode(toDisplayString(autoCultivate.value ? "\u6682\u505C\u6302\u673A" : "\u5F00\u59CB\u6302\u673A"), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<p class="hint" data-v-c00410e2> \u6302\u673A\u5F00\u542F\u65F6\uFF0C\u6BCF\u79D2\u81EA\u52A8\u7ED3\u7B97\u4E00\u6B21\u4FEE\u4E3A\uFF0C\u79BB\u7EBF\u65F6\u95F4\u4E5F\u4F1A\u5728\u4E0B\u6B21\u7ED3\u7B97\u65F6\u4E00\u6B21\u8865\u9F50\u3002 </p></div>`);
      } else {
        _push(`<div class="empty" data-v-c00410e2><p data-v-c00410e2>\u5C1A\u672A\u767B\u5F55\uFF0C\u8BF7\u5148\u524D\u5F80\u767B\u5F55\u9875\u3002</p>`);
        _push(ssrRenderComponent(_component_van_button, {
          type: "primary",
          round: "",
          block: "",
          to: { path: "/login" }
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` \u53BB\u767B\u5F55 `);
            } else {
              return [
                createTextVNode(" \u53BB\u767B\u5F55 ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c00410e2"]]);

export { index as default };
//# sourceMappingURL=index-By0J7HVx.mjs.map
