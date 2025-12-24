var Realm = /* @__PURE__ */ ((Realm2) => {
  Realm2["QI_1"] = "QI_1";
  Realm2["QI_2"] = "QI_2";
  Realm2["QI_3"] = "QI_3";
  Realm2["QI_4"] = "QI_4";
  Realm2["QI_5"] = "QI_5";
  Realm2["QI_6"] = "QI_6";
  Realm2["QI_7"] = "QI_7";
  Realm2["QI_8"] = "QI_8";
  Realm2["QI_9"] = "QI_9";
  Realm2["QI_10"] = "QI_10";
  return Realm2;
})(Realm || {});
var SpiritRoot = /* @__PURE__ */ ((SpiritRoot2) => {
  SpiritRoot2["FAKE"] = "FAKE";
  SpiritRoot2["TRUE"] = "TRUE";
  SpiritRoot2["HEAVEN"] = "HEAVEN";
  SpiritRoot2["MUTANT"] = "MUTANT";
  return SpiritRoot2;
})(SpiritRoot || {});
const orderedRealms = [
  "QI_1" /* QI_1 */,
  "QI_2" /* QI_2 */,
  "QI_3" /* QI_3 */,
  "QI_4" /* QI_4 */,
  "QI_5" /* QI_5 */,
  "QI_6" /* QI_6 */,
  "QI_7" /* QI_7 */,
  "QI_8" /* QI_8 */,
  "QI_9" /* QI_9 */,
  "QI_10" /* QI_10 */
];
const MAX_REALM = "QI_10" /* QI_10 */;
function getNextRealm(realm) {
  const index = orderedRealms.indexOf(realm);
  if (index === -1) {
    return null;
  }
  if (index >= orderedRealms.length - 1) {
    return null;
  }
  return orderedRealms[index + 1];
}
const realmConfigs = {
  QI_1: {
    maxCultivation: 100,
    label: "\u70BC\u6C14\u4E00\u5C42"
  },
  QI_2: {
    maxCultivation: 150,
    label: "\u70BC\u6C14\u4E8C\u5C42"
  },
  QI_3: {
    maxCultivation: 225,
    label: "\u70BC\u6C14\u4E09\u5C42"
  },
  QI_4: {
    maxCultivation: 340,
    label: "\u70BC\u6C14\u56DB\u5C42"
  },
  QI_5: {
    maxCultivation: 510,
    label: "\u70BC\u6C14\u4E94\u5C42"
  },
  QI_6: {
    maxCultivation: 765,
    label: "\u70BC\u6C14\u516D\u5C42"
  },
  QI_7: {
    maxCultivation: 1150,
    label: "\u70BC\u6C14\u4E03\u5C42"
  },
  QI_8: {
    maxCultivation: 1725,
    label: "\u70BC\u6C14\u516B\u5C42"
  },
  QI_9: {
    maxCultivation: 2590,
    label: "\u70BC\u6C14\u4E5D\u5C42"
  },
  QI_10: {
    maxCultivation: 3885,
    label: "\u70BC\u6C14\u5341\u5C42"
  }
};
const spiritRootConfigs = {
  FAKE: {
    label: "\u4F2A\u7075\u6839"
  },
  TRUE: {
    label: "\u771F\u7075\u6839"
  },
  HEAVEN: {
    label: "\u5929\u7075\u6839"
  },
  MUTANT: {
    label: "\u53D8\u5F02\u7075\u6839"
  }
};
function getRealmLabel(realm) {
  return realmConfigs[realm].label;
}
function getRealmMaxCultivation(realm) {
  return realmConfigs[realm].maxCultivation;
}
function getSpiritRootLabel(spiritRoot) {
  return spiritRootConfigs[spiritRoot].label;
}
function getRandomSpiritRoot() {
  const values = Object.values(SpiritRoot);
  const index = Math.floor(Math.random() * values.length);
  return values[index];
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

export { BASE_CULTIVATION_PER_SECOND as B, MAX_REALM as M, Realm as R, SpiritRoot as S, getRealmMaxCultivation as a, getRealmLabel as b, getSpiritRootMultiplier as c, getRealmMultiplier as d, getRandomSpiritRoot as e, getSpiritRootLabel as f, getNextRealm as g };
//# sourceMappingURL=gameConstants.mjs.map
