import { defineComponent, ref, computed, mergeProps, withCtx, createTextVNode, toDisplayString, isRef, watch, createVNode, getCurrentScope, onScopeDispose, unref, Transition, Teleport, nextTick, provide, Fragment, useSSRContext, withDirectives, vShow } from 'vue';
import { n as numericProp, t as truthProp, c as createNamespace, a as addUnit, u as unknownProp, w as withInstall, e as extend, m as makeStringProp, i as isDef, b as makeNumberProp, p as pick, g as getZIndexStyle, d as useGlobalZIndex, I as Icon, H as HAPTICS_FEEDBACK, T as TAP_OFFSET, f as getScrollParent, h as preventDefault } from './index-HaumD47W.mjs';
import { u as usePlayerStore, s as stdin_default$4, a as showToast, b as useExpose, c as useScopeId, L as Loading } from './player-DGNQd8vS.mjs';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { useRouter } from 'vue-router';
import { P as POPUP_TOGGLE_KEY, c as callInterceptor } from './on-popup-reopen-DMW2JSr1.mjs';
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

const [name$3, bem$3] = createNamespace("progress");
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
var stdin_default$3 = defineComponent({
  name: name$3,
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
          "class": bem$3("pivot", {
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
        "class": bem$3(),
        "style": rootStyle
      }, [createVNode("span", {
        "class": bem$3("portion", {
          inactive: props.inactive
        }),
        "style": portionStyle
      }, null), renderPivot()]);
    };
  }
});
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
function tryOnScopeDispose(fn) {
  if (getCurrentScope()) {
    onScopeDispose(fn);
    return true;
  }
  return false;
}
function toValue(r) {
  return typeof r === "function" ? r() : unref(r);
}
const isClient = false;
typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
function useIntervalFn(cb, interval = 1e3, options = {}) {
  const {
    immediate = true,
    immediateCallback = false
  } = options;
  let timer = null;
  const isActive = ref(false);
  function clean() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }
  function pause() {
    isActive.value = false;
    clean();
  }
  function resume() {
    const intervalValue = toValue(interval);
    if (intervalValue <= 0)
      return;
    isActive.value = true;
    if (immediateCallback)
      cb();
    clean();
    timer = setInterval(cb, intervalValue);
  }
  if (isRef(interval) || typeof interval === "function") {
    const stopWatch = watch(interval, () => {
      if (isActive.value && isClient)
        ;
    });
    tryOnScopeDispose(stopWatch);
  }
  tryOnScopeDispose(pause);
  return {
    isActive,
    pause,
    resume
  };
}
const BASE_CULTIVATION_PER_SECOND = 1;
const spiritRootMultipliers = {
  FAKE: 0.7,
  TRUE: 1,
  HEAVEN: 1.3,
  MUTANT: 1.1
};
const realmMultipliers = {
  QI_1: 1,
  QI_2: 1.05,
  QI_3: 1.1,
  QI_4: 1.15,
  QI_5: 1.2,
  QI_6: 1.25,
  QI_7: 1.3,
  QI_8: 1.35,
  QI_9: 1.4,
  QI_10: 1.45
};
function getSpiritRootMultiplier(spiritRoot) {
  var _a;
  return (_a = spiritRootMultipliers[spiritRoot]) != null ? _a : 1;
}
function getRealmMultiplier(realm) {
  var _a;
  return (_a = realmMultipliers[realm]) != null ? _a : 1;
}
function calculateCultivationGainPerSecond(spiritRoot, realm) {
  return BASE_CULTIVATION_PER_SECOND * getSpiritRootMultiplier(spiritRoot) * getRealmMultiplier(realm);
}
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
      const _component_van_progress = stdin_default$3;
      const _component_van_button = stdin_default$4;
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
//# sourceMappingURL=index-cd53yhYW.mjs.map
