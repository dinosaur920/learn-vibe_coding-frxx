import { s as stdin_default$3, u as useFetch, a as showToast, L as Loading } from './function-call-BpCHN0rm.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createTextVNode, createVNode, createBlock, openBlock, Fragment, renderList, toDisplayString, watch, nextTick, provide, Teleport, Transition, withDirectives, vShow, useSSRContext } from 'vue';
import { s as stdin_default$4, e as extend, c as createNamespace, i as isDef, t as truthProp, u as unknownProp, n as numericProp, m as makeStringProp, a as useGlobalZIndex, w as withInstall, T as TAP_OFFSET, g as getScrollParent, p as preventDefault, I as Icon, H as HAPTICS_FEEDBACK, b as getZIndexStyle, d as makeNumberProp, f as pick } from './index-Cm1_ppAu.mjs';
import { u as useExpose, a as useScopeId } from './use-scope-id-BAB5BiSn.mjs';
import { P as POPUP_TOGGLE_KEY, c as callInterceptor } from './on-popup-reopen-uhTaiOfv.mjs';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrRenderComponent } from 'vue/server-renderer';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { C as CavePlotStatus, B as BASIC_HERB_IDS, g as getHerbConfig, H as HerbId, u as useIntervalFn } from './gameConstants-nrAnxKd7.mjs';
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

const popupSharedProps = {
  // whether to show popup
  show: Boolean,
  // z-index
  zIndex: numericProp,
  // whether to show overlay
  overlay: truthProp,
  // transition duration
  duration: numericProp,
  // teleport
  teleport: [String, Object],
  // prevent body scroll
  lockScroll: truthProp,
  // whether to lazy render
  lazyRender: truthProp,
  // callback function before close
  beforeClose: Function,
  // overlay props
  overlayProps: Object,
  // overlay custom style
  overlayStyle: Object,
  // overlay custom class name
  overlayClass: unknownProp,
  // Initial rendering animation
  transitionAppear: Boolean,
  // whether to close popup when overlay is clicked
  closeOnClickOverlay: truthProp
};
function getDirection(x, y) {
  if (x > y) {
    return "horizontal";
  }
  if (y > x) {
    return "vertical";
  }
  return "";
}
function useTouch() {
  const startX = ref(0);
  const startY = ref(0);
  const deltaX = ref(0);
  const deltaY = ref(0);
  const offsetX = ref(0);
  const offsetY = ref(0);
  const direction = ref("");
  const isTap = ref(true);
  const isVertical = () => direction.value === "vertical";
  const isHorizontal = () => direction.value === "horizontal";
  const reset = () => {
    deltaX.value = 0;
    deltaY.value = 0;
    offsetX.value = 0;
    offsetY.value = 0;
    direction.value = "";
    isTap.value = true;
  };
  const start = ((event) => {
    reset();
    startX.value = event.touches[0].clientX;
    startY.value = event.touches[0].clientY;
  });
  const move = ((event) => {
    const touch = event.touches[0];
    deltaX.value = (touch.clientX < 0 ? 0 : touch.clientX) - startX.value;
    deltaY.value = touch.clientY - startY.value;
    offsetX.value = Math.abs(deltaX.value);
    offsetY.value = Math.abs(deltaY.value);
    const LOCK_DIRECTION_DISTANCE = 10;
    if (!direction.value || offsetX.value < LOCK_DIRECTION_DISTANCE && offsetY.value < LOCK_DIRECTION_DISTANCE) {
      direction.value = getDirection(offsetX.value, offsetY.value);
    }
    if (isTap.value && (offsetX.value > TAP_OFFSET || offsetY.value > TAP_OFFSET)) {
      isTap.value = false;
    }
  });
  return {
    move,
    start,
    reset,
    startX,
    startY,
    deltaX,
    deltaY,
    offsetX,
    offsetY,
    direction,
    isVertical,
    isHorizontal,
    isTap
  };
}
let totalLockCount = 0;
const BODY_LOCK_CLASS = "van-overflow-hidden";
function useLockScroll(rootRef, shouldLock) {
  const touch = useTouch();
  const DIRECTION_UP = "01";
  const DIRECTION_DOWN = "10";
  const onTouchMove = (event) => {
    touch.move(event);
    const direction = touch.deltaY.value > 0 ? DIRECTION_DOWN : DIRECTION_UP;
    const el = getScrollParent(
      event.target,
      rootRef.value
    );
    const { scrollHeight, offsetHeight, scrollTop } = el;
    let status = "11";
    if (scrollTop === 0) {
      status = offsetHeight >= scrollHeight ? "00" : "01";
    } else if (scrollTop + offsetHeight >= scrollHeight) {
      status = "10";
    }
    if (status !== "11" && touch.isVertical() && !(parseInt(status, 2) & parseInt(direction, 2))) {
      preventDefault(event, true);
    }
  };
  const lock = () => {
    (void 0).addEventListener("touchstart", touch.start);
    (void 0).addEventListener("touchmove", onTouchMove, { passive: false });
    if (!totalLockCount) {
      (void 0).body.classList.add(BODY_LOCK_CLASS);
    }
    totalLockCount++;
  };
  const unlock = () => {
    if (totalLockCount) {
      (void 0).removeEventListener("touchstart", touch.start);
      (void 0).removeEventListener("touchmove", onTouchMove);
      totalLockCount--;
      if (!totalLockCount) {
        (void 0).body.classList.remove(BODY_LOCK_CLASS);
      }
    }
  };
  watch(shouldLock, (value) => {
    value ? lock() : unlock();
  });
}
function useLazyRender(show) {
  const inited = ref(false);
  watch(
    show,
    (value) => {
      if (value) {
        inited.value = value;
      }
    },
    { immediate: true }
  );
  return (render) => () => inited.value ? render() : null;
}
const [name$2, bem$2] = createNamespace("overlay");
const overlayProps = {
  show: Boolean,
  zIndex: numericProp,
  duration: numericProp,
  className: unknownProp,
  lockScroll: truthProp,
  lazyRender: truthProp,
  customStyle: Object,
  teleport: [String, Object]
};
var stdin_default$2 = defineComponent({
  name: name$2,
  inheritAttrs: false,
  props: overlayProps,
  setup(props, {
    attrs,
    slots
  }) {
    const root = ref();
    const lazyRender = useLazyRender(() => props.show || !props.lazyRender);
    const renderOverlay = lazyRender(() => {
      var _a;
      const style = extend(getZIndexStyle(props.zIndex), props.customStyle);
      if (isDef(props.duration)) {
        style.animationDuration = `${props.duration}s`;
      }
      return withDirectives(createVNode("div", mergeProps({
        "ref": root,
        "style": style,
        "class": [bem$2(), props.className]
      }, attrs), [(_a = slots.default) == null ? void 0 : _a.call(slots)]), [[vShow, props.show]]);
    });
    return () => {
      const Content = createVNode(Transition, {
        "name": "van-fade",
        "appear": true
      }, {
        default: renderOverlay
      });
      if (props.teleport) {
        return createVNode(Teleport, {
          "to": props.teleport
        }, {
          default: () => [Content]
        });
      }
      return Content;
    };
  }
});
const Overlay = withInstall(stdin_default$2);
const popupProps = extend({}, popupSharedProps, {
  round: Boolean,
  position: makeStringProp("center"),
  closeIcon: makeStringProp("cross"),
  closeable: Boolean,
  transition: String,
  iconPrefix: String,
  closeOnPopstate: Boolean,
  closeIconPosition: makeStringProp("top-right"),
  destroyOnClose: Boolean,
  safeAreaInsetTop: Boolean,
  safeAreaInsetBottom: Boolean
});
const [name$1, bem$1] = createNamespace("popup");
var stdin_default$1 = defineComponent({
  name: name$1,
  inheritAttrs: false,
  props: popupProps,
  emits: ["open", "close", "opened", "closed", "keydown", "update:show", "clickOverlay", "clickCloseIcon"],
  setup(props, {
    emit,
    attrs,
    slots
  }) {
    let opened;
    const zIndex = ref();
    const popupRef = ref();
    const lazyRender = useLazyRender(() => props.show || !props.lazyRender);
    const style = computed(() => {
      const style2 = {
        zIndex: zIndex.value
      };
      if (isDef(props.duration)) {
        const key = props.position === "center" ? "animationDuration" : "transitionDuration";
        style2[key] = `${props.duration}s`;
      }
      return style2;
    });
    const open = () => {
      if (!opened) {
        opened = true;
        zIndex.value = props.zIndex !== void 0 ? +props.zIndex : useGlobalZIndex();
        emit("open");
      }
    };
    const close = () => {
      if (opened) {
        callInterceptor(props.beforeClose, {
          done() {
            opened = false;
            emit("close");
            emit("update:show", false);
          }
        });
      }
    };
    const onClickOverlay = (event) => {
      emit("clickOverlay", event);
      if (props.closeOnClickOverlay) {
        close();
      }
    };
    const renderOverlay = () => {
      if (props.overlay) {
        const overlayProps2 = extend({
          show: props.show,
          class: props.overlayClass,
          zIndex: zIndex.value,
          duration: props.duration,
          customStyle: props.overlayStyle,
          role: props.closeOnClickOverlay ? "button" : void 0,
          tabindex: props.closeOnClickOverlay ? 0 : void 0
        }, props.overlayProps);
        return createVNode(Overlay, mergeProps(overlayProps2, useScopeId(), {
          "onClick": onClickOverlay
        }), {
          default: slots["overlay-content"]
        });
      }
    };
    const onClickCloseIcon = (event) => {
      emit("clickCloseIcon", event);
      close();
    };
    const renderCloseIcon = () => {
      if (props.closeable) {
        return createVNode(Icon, {
          "role": "button",
          "tabindex": 0,
          "name": props.closeIcon,
          "class": [bem$1("close-icon", props.closeIconPosition), HAPTICS_FEEDBACK],
          "classPrefix": props.iconPrefix,
          "onClick": onClickCloseIcon
        }, null);
      }
    };
    let timer;
    const onOpened = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        emit("opened");
      });
    };
    const onClosed = () => emit("closed");
    const onKeydown = (event) => emit("keydown", event);
    const renderPopup = lazyRender(() => {
      var _a;
      const {
        destroyOnClose,
        round,
        position,
        safeAreaInsetTop,
        safeAreaInsetBottom,
        show
      } = props;
      if (!show && destroyOnClose) {
        return;
      }
      return withDirectives(createVNode("div", mergeProps({
        "ref": popupRef,
        "style": style.value,
        "role": "dialog",
        "tabindex": 0,
        "class": [bem$1({
          round,
          [position]: position
        }), {
          "van-safe-area-top": safeAreaInsetTop,
          "van-safe-area-bottom": safeAreaInsetBottom
        }],
        "onKeydown": onKeydown
      }, attrs, useScopeId()), [(_a = slots.default) == null ? void 0 : _a.call(slots), renderCloseIcon()]), [[vShow, show]]);
    });
    const renderTransition = () => {
      const {
        position,
        transition,
        transitionAppear
      } = props;
      const name2 = position === "center" ? "van-fade" : `van-popup-slide-${position}`;
      return createVNode(Transition, {
        "name": transition || name2,
        "appear": transitionAppear,
        "onAfterEnter": onOpened,
        "onAfterLeave": onClosed
      }, {
        default: renderPopup
      });
    };
    watch(() => props.show, (show) => {
      if (show && !opened) {
        open();
        if (attrs.tabindex === 0) {
          nextTick(() => {
            var _a;
            (_a = popupRef.value) == null ? void 0 : _a.focus();
          });
        }
      }
      if (!show && opened) {
        opened = false;
        emit("close");
      }
    });
    useExpose({
      popupRef
    });
    useLockScroll(popupRef, () => props.show && props.lockScroll);
    provide(POPUP_TOGGLE_KEY, () => props.show);
    return () => {
      if (props.teleport) {
        return createVNode(Teleport, {
          "to": props.teleport
        }, {
          default: () => [renderOverlay(), renderTransition()]
        });
      }
      return createVNode(Fragment, null, [renderOverlay(), renderTransition()]);
    };
  }
});
const Popup = withInstall(stdin_default$1);
let lockCount = 0;
function lockClick(lock) {
  if (lock) {
    if (!lockCount) {
      (void 0).body.classList.add("van-toast--unclickable");
    }
    lockCount++;
  } else if (lockCount) {
    lockCount--;
    if (!lockCount) {
      (void 0).body.classList.remove("van-toast--unclickable");
    }
  }
}
const [name, bem] = createNamespace("toast");
const popupInheritProps = ["show", "overlay", "teleport", "transition", "overlayClass", "overlayStyle", "closeOnClickOverlay", "zIndex"];
const toastProps = {
  icon: String,
  show: Boolean,
  type: makeStringProp("text"),
  overlay: Boolean,
  message: numericProp,
  iconSize: numericProp,
  duration: makeNumberProp(2e3),
  position: makeStringProp("middle"),
  teleport: [String, Object],
  wordBreak: String,
  className: unknownProp,
  iconPrefix: String,
  transition: makeStringProp("van-fade"),
  loadingType: String,
  forbidClick: Boolean,
  overlayClass: unknownProp,
  overlayStyle: Object,
  closeOnClick: Boolean,
  closeOnClickOverlay: Boolean,
  zIndex: numericProp
};
var stdin_default = defineComponent({
  name,
  props: toastProps,
  emits: ["update:show"],
  setup(props, {
    emit,
    slots
  }) {
    let timer;
    let clickable = false;
    const toggleClickable = () => {
      const newValue = props.show && props.forbidClick;
      if (clickable !== newValue) {
        clickable = newValue;
        lockClick(clickable);
      }
    };
    const updateShow = (show) => emit("update:show", show);
    const onClick = () => {
      if (props.closeOnClick) {
        updateShow(false);
      }
    };
    const clearTimer = () => clearTimeout(timer);
    const renderIcon = () => {
      const {
        icon,
        type,
        iconSize,
        iconPrefix,
        loadingType
      } = props;
      const hasIcon = icon || type === "success" || type === "fail";
      if (hasIcon) {
        return createVNode(Icon, {
          "name": icon || type,
          "size": iconSize,
          "class": bem("icon"),
          "classPrefix": iconPrefix
        }, null);
      }
      if (type === "loading") {
        return createVNode(Loading, {
          "class": bem("loading"),
          "size": iconSize,
          "type": loadingType
        }, null);
      }
    };
    const renderMessage = () => {
      const {
        type,
        message
      } = props;
      if (slots.message) {
        return createVNode("div", {
          "class": bem("text")
        }, [slots.message()]);
      }
      if (isDef(message) && message !== "") {
        return type === "html" ? createVNode("div", {
          "key": 0,
          "class": bem("text"),
          "innerHTML": String(message)
        }, null) : createVNode("div", {
          "class": bem("text")
        }, [message]);
      }
    };
    watch(() => [props.show, props.forbidClick], toggleClickable);
    watch(() => [props.show, props.type, props.message, props.duration], () => {
      clearTimer();
      if (props.show && props.duration > 0) {
        timer = setTimeout(() => {
          updateShow(false);
        }, props.duration);
      }
    });
    return () => createVNode(Popup, mergeProps({
      "class": [bem([props.position, props.wordBreak === "normal" ? "break-normal" : props.wordBreak, {
        [props.type]: !props.icon
      }]), props.className],
      "lockScroll": false,
      "onClick": onClick,
      "onClosed": clearTimer,
      "onUpdate:show": updateShow
    }, pick(props, popupInheritProps)), {
      default: () => [renderIcon(), renderMessage()]
    });
  }
});
withInstall(stdin_default);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cave",
  __ssrInlineRender: true,
  setup(__props) {
    const router = useRouter();
    const loading = ref(false);
    const plots = ref([]);
    const plantPopupVisible = ref(false);
    const planting = ref(false);
    const plantingSlotIndex = ref(null);
    const harvesting = ref(false);
    const harvestingSlotIndex = ref(null);
    const caveStatusEmpty = CavePlotStatus.EMPTY;
    const herbOptions = computed(() => {
      return BASIC_HERB_IDS.map((id) => {
        const config = getHerbConfig(id);
        let icon = "flower-o";
        if (config.id === HerbId.SPIRIT_FRUIT || config.id === HerbId.SPIRIT_ORCHID) {
          icon = "fire-o";
        }
        if (config.id === HerbId.SPIRIT_LOTUS) {
          icon = "diamond-o";
        }
        return {
          id: config.id,
          name: config.name,
          matureMinutes: Math.max(1, Math.round(config.matureSeconds / 60)),
          icon,
          rarity: config.rarity,
          rarityLabel: config.rarityLabel
        };
      });
    });
    const formatTime = (iso) => {
      if (!iso) {
        return "-";
      }
      return dayjs(iso).format("HH:mm:ss");
    };
    const handleErrorResponse = (response) => {
      if (response.code === "AUTH_UNAUTHORIZED") {
        showToast(response.message);
        router.push("/login");
        return;
      }
      showToast(response.message);
    };
    const loadStatus = async () => {
      if (loading.value) {
        return;
      }
      loading.value = true;
      try {
        const { data, error } = await useFetch("/api/cave/status", {
          method: "GET"
        }, "$XZ6wQ-2SB6");
        if (error.value) {
          throw error.value;
        }
        if (!data.value) {
          throw new Error("\u52A0\u8F7D\u6D1E\u5E9C\u4FE1\u606F\u5931\u8D25");
        }
        if (!data.value.success) {
          handleErrorResponse(data.value);
          return;
        }
        plots.value = data.value.data.plots;
      } catch (error) {
        (error == null ? void 0 : error.message) || "\u52A0\u8F7D\u6D1E\u5E9C\u4FE1\u606F\u5931\u8D25";
      } finally {
        loading.value = false;
      }
    };
    const openPlantSheet = (slotIndex) => {
      plantingSlotIndex.value = slotIndex;
      plantPopupVisible.value = true;
    };
    const closePlantPopup = () => {
      plantPopupVisible.value = false;
    };
    const onConfirmPlant = async (herbId) => {
      if (planting.value) {
        return;
      }
      const slotIndex = plantingSlotIndex.value;
      if (slotIndex === null) {
        plantPopupVisible.value = false;
        return;
      }
      planting.value = true;
      try {
        const { data, error } = await useFetch("/api/cave/plant", {
          method: "POST",
          body: {
            slotIndex,
            herbId
          }
        }, "$6QHMosjBWc");
        if (error.value) {
          throw error.value;
        }
        if (!data.value) {
          throw new Error("\u79CD\u690D\u5931\u8D25");
        }
        if (!data.value.success) {
          handleErrorResponse(data.value);
          return;
        }
        showToast("\u79CD\u690D\u6210\u529F");
        plantPopupVisible.value = false;
        await loadStatus();
      } catch (error) {
        (error == null ? void 0 : error.message) || "\u79CD\u690D\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5";
      } finally {
        planting.value = false;
        plantingSlotIndex.value = null;
      }
    };
    const onHarvest = async (slotIndex) => {
      if (harvesting.value) {
        return;
      }
      harvesting.value = true;
      harvestingSlotIndex.value = slotIndex;
      try {
        const { data, error } = await useFetch("/api/cave/harvest", {
          method: "POST",
          body: {
            slotIndex
          }
        }, "$kMwzh6bDLa");
        if (error.value) {
          throw error.value;
        }
        if (!data.value) {
          throw new Error("\u6536\u83B7\u5931\u8D25");
        }
        if (!data.value.success) {
          handleErrorResponse(data.value);
          return;
        }
        const name2 = data.value.data.harvest.herbName;
        if (name2) {
          showToast(`\u6536\u83B7\u5230 ${name2}`);
        } else {
          showToast("\u6536\u83B7\u6210\u529F");
        }
        await loadStatus();
      } catch (error) {
        (error == null ? void 0 : error.message) || "\u6536\u83B7\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5";
      } finally {
        harvesting.value = false;
        harvestingSlotIndex.value = null;
      }
    };
    useIntervalFn(
      () => {
        loadStatus();
      },
      5e3,
      {
        immediate: false
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_van_button = stdin_default$3;
      const _component_van_popup = stdin_default$1;
      const _component_van_icon = stdin_default$4;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page" }, _attrs))} data-v-8149f679><div class="header" data-v-8149f679><h1 class="title" data-v-8149f679>\u6D1E\u5E9C\xB7\u836F\u56ED</h1><p class="subtitle" data-v-8149f679>\u4E00\u65B9\u5C0F\u9662\uFF0C\u9759\u5019\u7075\u8349\u6210\u719F</p></div>`);
      if (plots.value.length > 0) {
        _push(`<div class="plots" data-v-8149f679><!--[-->`);
        ssrRenderList(plots.value, (plot) => {
          _push(`<div class="plot-card" data-v-8149f679><div class="plot-header" data-v-8149f679><div class="plot-title" data-v-8149f679> \u7B2C ${ssrInterpolate(plot.slotIndex + 1)} \u5757\u7075\u7530 </div><div class="${ssrRenderClass([{
            "plot-status-empty": plot.status === unref(caveStatusEmpty),
            "plot-status-growing": plot.status !== unref(caveStatusEmpty) && !plot.isMature,
            "plot-status-ready": plot.isMature
          }, "plot-status"])}" data-v-8149f679>`);
          if (plot.status === unref(caveStatusEmpty)) {
            _push(`<span data-v-8149f679>\u7A7A\u7F6E</span>`);
          } else if (plot.isMature) {
            _push(`<span data-v-8149f679>\u53EF\u6536\u83B7</span>`);
          } else {
            _push(`<span data-v-8149f679>\u751F\u957F\u4E2D</span>`);
          }
          _push(`</div></div><div class="plot-body" data-v-8149f679><div class="row" data-v-8149f679><span class="label" data-v-8149f679>\u7075\u8349</span><span class="value" data-v-8149f679>`);
          if (plot.herbName) {
            _push(`<span data-v-8149f679>${ssrInterpolate(plot.herbName)}</span>`);
          } else {
            _push(`<span data-v-8149f679>\u5C1A\u672A\u79CD\u690D</span>`);
          }
          _push(`</span></div>`);
          if (plot.plantedAt) {
            _push(`<div class="row" data-v-8149f679><span class="label" data-v-8149f679>\u79CD\u4E0B\u65F6\u95F4</span><span class="value" data-v-8149f679>${ssrInterpolate(formatTime(plot.plantedAt))}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          if (plot.matureAt) {
            _push(`<div class="row" data-v-8149f679><span class="label" data-v-8149f679>\u9884\u8BA1\u6210\u719F</span><span class="value" data-v-8149f679>${ssrInterpolate(formatTime(plot.matureAt))}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="plot-actions" data-v-8149f679>`);
          if (plot.status === unref(caveStatusEmpty)) {
            _push(ssrRenderComponent(_component_van_button, {
              size: "small",
              type: "primary",
              block: "",
              loading: plantingSlotIndex.value === plot.slotIndex && planting.value,
              onClick: ($event) => openPlantSheet(plot.slotIndex)
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(` \u79CD\u690D\u7075\u8349 `);
                } else {
                  return [
                    createTextVNode(" \u79CD\u690D\u7075\u8349 ")
                  ];
                }
              }),
              _: 2
            }, _parent));
          } else if (plot.isMature) {
            _push(ssrRenderComponent(_component_van_button, {
              size: "small",
              type: "success",
              block: "",
              loading: harvestingSlotIndex.value === plot.slotIndex && harvesting.value,
              onClick: ($event) => onHarvest(plot.slotIndex)
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(` \u6536\u83B7\u7075\u8349 `);
                } else {
                  return [
                    createTextVNode(" \u6536\u83B7\u7075\u8349 ")
                  ];
                }
              }),
              _: 2
            }, _parent));
          } else {
            _push(ssrRenderComponent(_component_van_button, {
              size: "small",
              type: "default",
              block: "",
              disabled: ""
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(` \u6B63\u5728\u751F\u957F `);
                } else {
                  return [
                    createTextVNode(" \u6B63\u5728\u751F\u957F ")
                  ];
                }
              }),
              _: 2
            }, _parent));
          }
          _push(`</div></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="empty" data-v-8149f679><p data-v-8149f679>\u6682\u672A\u67E5\u8BE2\u5230\u6D1E\u5E9C\u4FE1\u606F\uFF0C\u8BF7\u5C1D\u8BD5\u5237\u65B0\u6216\u91CD\u65B0\u767B\u5F55\u3002</p></div>`);
      }
      _push(ssrRenderComponent(_component_van_popup, {
        show: plantPopupVisible.value,
        "onUpdate:show": ($event) => plantPopupVisible.value = $event,
        position: "center",
        round: "",
        class: "plant-popup"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="plant-popup-inner" data-v-8149f679${_scopeId}><div class="plant-popup-header" data-v-8149f679${_scopeId}><div class="plant-popup-title" data-v-8149f679${_scopeId}> \u9009\u62E9\u8981\u79CD\u4E0B\u7684\u7075\u8349 </div>`);
            _push2(ssrRenderComponent(_component_van_icon, {
              name: "cross",
              class: "plant-popup-close",
              onClick: closePlantPopup
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="plant-popup-subtitle" data-v-8149f679${_scopeId}> \u4E0D\u540C\u54C1\u9636\u7684\u7075\u8349\u6210\u719F\u65F6\u95F4\u4E0E\u4EF7\u503C\u5404\u4E0D\u76F8\u540C </div><div class="plant-sheet" data-v-8149f679${_scopeId}><div class="plant-sheet-grid" data-v-8149f679${_scopeId}><!--[-->`);
            ssrRenderList(herbOptions.value, (herb) => {
              _push2(`<div class="${ssrRenderClass([[
                `herb-card-${herb.rarity}`
              ], "herb-card"])}" data-v-8149f679${_scopeId}><div class="herb-card-main" data-v-8149f679${_scopeId}>`);
              _push2(ssrRenderComponent(_component_van_icon, {
                name: herb.icon,
                class: "herb-icon"
              }, null, _parent2, _scopeId));
              _push2(`<div class="herb-info" data-v-8149f679${_scopeId}><div class="herb-name" data-v-8149f679${_scopeId}>${ssrInterpolate(herb.name)}</div><div class="herb-meta" data-v-8149f679${_scopeId}> \u7EA6 ${ssrInterpolate(herb.matureMinutes)} \u5206\u949F\u6210\u719F </div></div></div><div class="${ssrRenderClass([`herb-tag-${herb.rarity}`, "herb-tag"])}" data-v-8149f679${_scopeId}>${ssrInterpolate(herb.rarityLabel)}</div></div>`);
            });
            _push2(`<!--]--></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "plant-popup-inner" }, [
                createVNode("div", { class: "plant-popup-header" }, [
                  createVNode("div", { class: "plant-popup-title" }, " \u9009\u62E9\u8981\u79CD\u4E0B\u7684\u7075\u8349 "),
                  createVNode(_component_van_icon, {
                    name: "cross",
                    class: "plant-popup-close",
                    onClick: closePlantPopup
                  })
                ]),
                createVNode("div", { class: "plant-popup-subtitle" }, " \u4E0D\u540C\u54C1\u9636\u7684\u7075\u8349\u6210\u719F\u65F6\u95F4\u4E0E\u4EF7\u503C\u5404\u4E0D\u76F8\u540C "),
                createVNode("div", { class: "plant-sheet" }, [
                  createVNode("div", { class: "plant-sheet-grid" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(herbOptions.value, (herb) => {
                      return openBlock(), createBlock("div", {
                        key: herb.id,
                        class: ["herb-card", [
                          `herb-card-${herb.rarity}`
                        ]],
                        onClick: ($event) => onConfirmPlant(herb.id)
                      }, [
                        createVNode("div", { class: "herb-card-main" }, [
                          createVNode(_component_van_icon, {
                            name: herb.icon,
                            class: "herb-icon"
                          }, null, 8, ["name"]),
                          createVNode("div", { class: "herb-info" }, [
                            createVNode("div", { class: "herb-name" }, toDisplayString(herb.name), 1),
                            createVNode("div", { class: "herb-meta" }, " \u7EA6 " + toDisplayString(herb.matureMinutes) + " \u5206\u949F\u6210\u719F ", 1)
                          ])
                        ]),
                        createVNode("div", {
                          class: ["herb-tag", `herb-tag-${herb.rarity}`]
                        }, toDisplayString(herb.rarityLabel), 3)
                      ], 10, ["onClick"]);
                    }), 128))
                  ])
                ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/cave.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const cave = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8149f679"]]);

export { cave as default };
//# sourceMappingURL=cave-B-HOdBvT.mjs.map
