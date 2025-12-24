import { ref, isRef, watch, getCurrentScope, onScopeDispose, unref } from "vue";
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
  return spiritRootMultipliers[spiritRoot] ?? 1;
}
function getRealmMultiplier(realm) {
  return realmMultipliers[realm] ?? 1;
}
function calculateCultivationGainPerSecond(spiritRoot, realm) {
  return BASE_CULTIVATION_PER_SECOND * getSpiritRootMultiplier(spiritRoot) * getRealmMultiplier(realm);
}
var CavePlotStatus = /* @__PURE__ */ ((CavePlotStatus2) => {
  CavePlotStatus2["EMPTY"] = "EMPTY";
  CavePlotStatus2["GROWING"] = "GROWING";
  CavePlotStatus2["READY"] = "READY";
  return CavePlotStatus2;
})(CavePlotStatus || {});
var HerbId = /* @__PURE__ */ ((HerbId2) => {
  HerbId2["SPIRIT_GRASS"] = "SPIRIT_GRASS";
  HerbId2["SPIRIT_FLOWER"] = "SPIRIT_FLOWER";
  HerbId2["SPIRIT_VINE"] = "SPIRIT_VINE";
  HerbId2["SPIRIT_FRUIT"] = "SPIRIT_FRUIT";
  HerbId2["SPIRIT_ORCHID"] = "SPIRIT_ORCHID";
  HerbId2["SPIRIT_LOTUS"] = "SPIRIT_LOTUS";
  return HerbId2;
})(HerbId || {});
const herbConfigs = {
  [
    "SPIRIT_GRASS"
    /* SPIRIT_GRASS */
  ]: {
    id: "SPIRIT_GRASS",
    name: "灵草·青芽",
    matureSeconds: 60,
    rarity: "COMMON",
    rarityLabel: "凡品"
  },
  [
    "SPIRIT_FLOWER"
    /* SPIRIT_FLOWER */
  ]: {
    id: "SPIRIT_FLOWER",
    name: "灵花·翠蕊",
    matureSeconds: 180,
    rarity: "COMMON",
    rarityLabel: "凡品"
  },
  [
    "SPIRIT_VINE"
    /* SPIRIT_VINE */
  ]: {
    id: "SPIRIT_VINE",
    name: "灵藤·碧络",
    matureSeconds: 300,
    rarity: "RARE",
    rarityLabel: "上品"
  },
  [
    "SPIRIT_FRUIT"
    /* SPIRIT_FRUIT */
  ]: {
    id: "SPIRIT_FRUIT",
    name: "灵果·丹霞",
    matureSeconds: 480,
    rarity: "RARE",
    rarityLabel: "上品"
  },
  [
    "SPIRIT_ORCHID"
    /* SPIRIT_ORCHID */
  ]: {
    id: "SPIRIT_ORCHID",
    name: "幽兰·紫霄",
    matureSeconds: 720,
    rarity: "EPIC",
    rarityLabel: "极品"
  },
  [
    "SPIRIT_LOTUS"
    /* SPIRIT_LOTUS */
  ]: {
    id: "SPIRIT_LOTUS",
    name: "灵莲·青灵",
    matureSeconds: 900,
    rarity: "EPIC",
    rarityLabel: "极品"
  }
};
const BASIC_HERB_IDS = [
  "SPIRIT_GRASS",
  "SPIRIT_FLOWER",
  "SPIRIT_VINE",
  "SPIRIT_FRUIT",
  "SPIRIT_ORCHID",
  "SPIRIT_LOTUS"
  /* SPIRIT_LOTUS */
];
function getHerbConfig(id) {
  return herbConfigs[id];
}
export {
  BASIC_HERB_IDS as B,
  CavePlotStatus as C,
  HerbId as H,
  calculateCultivationGainPerSecond as c,
  getHerbConfig as g,
  useIntervalFn as u
};
//# sourceMappingURL=gameConstants-nrAnxKd7.js.map
