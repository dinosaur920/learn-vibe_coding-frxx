import { ref, isRef, watch, getCurrentScope, onScopeDispose, unref } from 'vue';

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
    name: "\u7075\u8349\xB7\u9752\u82BD",
    matureSeconds: 60,
    rarity: "COMMON",
    rarityLabel: "\u51E1\u54C1"
  },
  [
    "SPIRIT_FLOWER"
    /* SPIRIT_FLOWER */
  ]: {
    id: "SPIRIT_FLOWER",
    name: "\u7075\u82B1\xB7\u7FE0\u854A",
    matureSeconds: 180,
    rarity: "COMMON",
    rarityLabel: "\u51E1\u54C1"
  },
  [
    "SPIRIT_VINE"
    /* SPIRIT_VINE */
  ]: {
    id: "SPIRIT_VINE",
    name: "\u7075\u85E4\xB7\u78A7\u7EDC",
    matureSeconds: 300,
    rarity: "RARE",
    rarityLabel: "\u4E0A\u54C1"
  },
  [
    "SPIRIT_FRUIT"
    /* SPIRIT_FRUIT */
  ]: {
    id: "SPIRIT_FRUIT",
    name: "\u7075\u679C\xB7\u4E39\u971E",
    matureSeconds: 480,
    rarity: "RARE",
    rarityLabel: "\u4E0A\u54C1"
  },
  [
    "SPIRIT_ORCHID"
    /* SPIRIT_ORCHID */
  ]: {
    id: "SPIRIT_ORCHID",
    name: "\u5E7D\u5170\xB7\u7D2B\u9704",
    matureSeconds: 720,
    rarity: "EPIC",
    rarityLabel: "\u6781\u54C1"
  },
  [
    "SPIRIT_LOTUS"
    /* SPIRIT_LOTUS */
  ]: {
    id: "SPIRIT_LOTUS",
    name: "\u7075\u83B2\xB7\u9752\u7075",
    matureSeconds: 900,
    rarity: "EPIC",
    rarityLabel: "\u6781\u54C1"
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

export { BASIC_HERB_IDS as B, CavePlotStatus as C, HerbId as H, calculateCultivationGainPerSecond as c, getHerbConfig as g, useIntervalFn as u };
//# sourceMappingURL=gameConstants-nrAnxKd7.mjs.map
