import { defineComponent, computed, createVNode, ref, mergeProps, withCtx, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { n as numericProp, t as truthProp, c as createNamespace, h as addUnit } from "./index-Cm1_ppAu.js";
import { s as stdin_default$1, a as showToast } from "./function-call-BpCHN0rm.js";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from "vue/server-renderer";
import { useRouter } from "vue-router";
import { u as usePlayerStore } from "./player-CH_xINOg.js";
import { c as calculateCultivationGainPerSecond, u as useIntervalFn } from "./gameConstants-nrAnxKd7.js";
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
        error?.message || "修炼失败，请稍后重试";
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
        showToast("突破成功！");
      } catch (error) {
        error?.message || "突破失败，请稍后重试";
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
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page" }, _attrs))} data-v-c00410e2><div class="header" data-v-c00410e2><h1 class="title" data-v-c00410e2>凡人修仙传·掌上仙途</h1><p class="subtitle" data-v-c00410e2>静坐吐纳，修炼真元</p></div>`);
      if (playerInfo.value) {
        _push(`<div class="card" data-v-c00410e2><div class="row" data-v-c00410e2><span class="label" data-v-c00410e2>道号</span><span class="value" data-v-c00410e2>${ssrInterpolate(playerInfo.value.username)}</span></div><div class="row" data-v-c00410e2><span class="label" data-v-c00410e2>境界</span><span class="value" data-v-c00410e2>${ssrInterpolate(playerInfo.value.realmLabel)}</span></div><div class="row" data-v-c00410e2><span class="label" data-v-c00410e2>灵根</span><span class="value" data-v-c00410e2>${ssrInterpolate(playerInfo.value.spiritRootLabel)}</span></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (playerInfo.value) {
        _push(`<div class="card" data-v-c00410e2><div class="row" data-v-c00410e2><span class="label" data-v-c00410e2>当前修为</span><span class="value" data-v-c00410e2>${ssrInterpolate(playerInfo.value.cultivation)} / ${ssrInterpolate(playerInfo.value.maxCultivation)}</span></div>`);
        _push(ssrRenderComponent(_component_van_progress, {
          percentage: progressPercent.value,
          "show-pivot": false
        }, null, _parent));
        _push(`<div class="row" data-v-c00410e2><span class="label" data-v-c00410e2>修炼速度</span><span class="value" data-v-c00410e2>${ssrInterpolate(cultivationSpeed.value.toFixed(2))} / 秒 </span></div></div>`);
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
              _push2(` 打坐修炼 `);
            } else {
              return [
                createTextVNode(" 打坐修炼 ")
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
              _push2(` 突破 `);
            } else {
              return [
                createTextVNode(" 突破 ")
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
              _push2(`${ssrInterpolate(autoCultivate.value ? "暂停挂机" : "开始挂机")}`);
            } else {
              return [
                createTextVNode(toDisplayString(autoCultivate.value ? "暂停挂机" : "开始挂机"), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<p class="hint" data-v-c00410e2> 挂机开启时，每秒自动结算一次修为，离线时间也会在下次结算时一次补齐。 </p></div>`);
      } else {
        _push(`<div class="empty" data-v-c00410e2><p data-v-c00410e2>尚未登录，请先前往登录页。</p>`);
        _push(ssrRenderComponent(_component_van_button, {
          type: "primary",
          round: "",
          block: "",
          to: { path: "/login" }
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` 去登录 `);
            } else {
              return [
                createTextVNode(" 去登录 ")
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
export {
  index as default
};
//# sourceMappingURL=index-By0J7HVx.js.map
