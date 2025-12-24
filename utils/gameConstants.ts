type RealmConfig = {
  maxCultivation: number;
  label: string;
};

type SpiritRootConfig = {
  label: string;
};

export enum Realm {
  QI_1 = "QI_1",
  QI_2 = "QI_2",
  QI_3 = "QI_3",
  QI_4 = "QI_4",
  QI_5 = "QI_5",
  QI_6 = "QI_6",
  QI_7 = "QI_7",
  QI_8 = "QI_8",
  QI_9 = "QI_9",
  QI_10 = "QI_10",
}

export enum SpiritRoot {
  FAKE = "FAKE",
  TRUE = "TRUE",
  HEAVEN = "HEAVEN",
  MUTANT = "MUTANT",
}

const orderedRealms: Realm[] = [
  Realm.QI_1,
  Realm.QI_2,
  Realm.QI_3,
  Realm.QI_4,
  Realm.QI_5,
  Realm.QI_6,
  Realm.QI_7,
  Realm.QI_8,
  Realm.QI_9,
  Realm.QI_10,
];

export const MAX_REALM = Realm.QI_10;

export function getNextRealm(realm: Realm): Realm | null {
  const index = orderedRealms.indexOf(realm);
  if (index === -1) {
    return null;
  }
  if (index >= orderedRealms.length - 1) {
    return null;
  }
  return orderedRealms[index + 1];
}

const realmConfigs: Record<Realm, RealmConfig> = {
  QI_1: {
    maxCultivation: 100,
    label: "炼气一层",
  },
  QI_2: {
    maxCultivation: 150,
    label: "炼气二层",
  },
  QI_3: {
    maxCultivation: 225,
    label: "炼气三层",
  },
  QI_4: {
    maxCultivation: 340,
    label: "炼气四层",
  },
  QI_5: {
    maxCultivation: 510,
    label: "炼气五层",
  },
  QI_6: {
    maxCultivation: 765,
    label: "炼气六层",
  },
  QI_7: {
    maxCultivation: 1150,
    label: "炼气七层",
  },
  QI_8: {
    maxCultivation: 1725,
    label: "炼气八层",
  },
  QI_9: {
    maxCultivation: 2590,
    label: "炼气九层",
  },
  QI_10: {
    maxCultivation: 3885,
    label: "炼气十层",
  },
};

const spiritRootConfigs: Record<SpiritRoot, SpiritRootConfig> = {
  FAKE: {
    label: "伪灵根",
  },
  TRUE: {
    label: "真灵根",
  },
  HEAVEN: {
    label: "天灵根",
  },
  MUTANT: {
    label: "变异灵根",
  },
};

export function getRealmLabel(realm: Realm) {
  return realmConfigs[realm].label;
}

export function getRealmMaxCultivation(realm: Realm) {
  return realmConfigs[realm].maxCultivation;
}

export function getSpiritRootLabel(spiritRoot: SpiritRoot) {
  return spiritRootConfigs[spiritRoot].label;
}

export function getRandomSpiritRoot() {
  const values = Object.values(SpiritRoot);
  const index = Math.floor(Math.random() * values.length);
  return values[index];
}

export const BASE_CULTIVATION_PER_SECOND = 1;

const spiritRootMultipliers: Record<SpiritRoot, number> = {
  FAKE: 0.7,
  TRUE: 1,
  HEAVEN: 1.3,
  MUTANT: 1.1,
};

const realmMultipliers: Record<Realm, number> = {
  QI_1: 1,
  QI_2: 1.05,
  QI_3: 1.1,
  QI_4: 1.15,
  QI_5: 1.2,
  QI_6: 1.25,
  QI_7: 1.3,
  QI_8: 1.35,
  QI_9: 1.4,
  QI_10: 1.45,
};

export function getSpiritRootMultiplier(spiritRoot: SpiritRoot) {
  return spiritRootMultipliers[spiritRoot] ?? 1;
}

export function getRealmMultiplier(realm: Realm) {
  return realmMultipliers[realm] ?? 1;
}

export function calculateCultivationGainPerSecond(
  spiritRoot: SpiritRoot,
  realm: Realm
) {
  return (
    BASE_CULTIVATION_PER_SECOND *
    getSpiritRootMultiplier(spiritRoot) *
    getRealmMultiplier(realm)
  );
}

export enum CavePlotStatus {
  EMPTY = "EMPTY",
  GROWING = "GROWING",
  READY = "READY",
}

export enum HerbId {
  SPIRIT_GRASS = "SPIRIT_GRASS",
  SPIRIT_FLOWER = "SPIRIT_FLOWER",
  SPIRIT_VINE = "SPIRIT_VINE",
  SPIRIT_FRUIT = "SPIRIT_FRUIT",
  SPIRIT_ORCHID = "SPIRIT_ORCHID",
  SPIRIT_LOTUS = "SPIRIT_LOTUS",
}

export enum HerbRarity {
  COMMON = "COMMON",
  RARE = "RARE",
  EPIC = "EPIC",
}

type HerbConfig = {
  id: HerbId;
  name: string;
  matureSeconds: number;
  rarity: HerbRarity;
  rarityLabel: string;
};

const herbConfigs: Record<HerbId, HerbConfig> = {
  [HerbId.SPIRIT_GRASS]: {
    id: HerbId.SPIRIT_GRASS,
    name: "灵草·青芽",
    matureSeconds: 60,
    rarity: HerbRarity.COMMON,
    rarityLabel: "凡品",
  },
  [HerbId.SPIRIT_FLOWER]: {
    id: HerbId.SPIRIT_FLOWER,
    name: "灵花·翠蕊",
    matureSeconds: 180,
    rarity: HerbRarity.COMMON,
    rarityLabel: "凡品",
  },
  [HerbId.SPIRIT_VINE]: {
    id: HerbId.SPIRIT_VINE,
    name: "灵藤·碧络",
    matureSeconds: 300,
    rarity: HerbRarity.RARE,
    rarityLabel: "上品",
  },
  [HerbId.SPIRIT_FRUIT]: {
    id: HerbId.SPIRIT_FRUIT,
    name: "灵果·丹霞",
    matureSeconds: 480,
    rarity: HerbRarity.RARE,
    rarityLabel: "上品",
  },
  [HerbId.SPIRIT_ORCHID]: {
    id: HerbId.SPIRIT_ORCHID,
    name: "幽兰·紫霄",
    matureSeconds: 720,
    rarity: HerbRarity.EPIC,
    rarityLabel: "极品",
  },
  [HerbId.SPIRIT_LOTUS]: {
    id: HerbId.SPIRIT_LOTUS,
    name: "灵莲·青灵",
    matureSeconds: 900,
    rarity: HerbRarity.EPIC,
    rarityLabel: "极品",
  },
};

export const BASIC_HERB_IDS: HerbId[] = [
  HerbId.SPIRIT_GRASS,
  HerbId.SPIRIT_FLOWER,
  HerbId.SPIRIT_VINE,
  HerbId.SPIRIT_FRUIT,
  HerbId.SPIRIT_ORCHID,
  HerbId.SPIRIT_LOTUS,
];

export function getHerbConfig(id: HerbId): HerbConfig {
  return herbConfigs[id];
}

export function getHerbConfigById(id: string): HerbConfig | null {
  const values = Object.values(HerbId) as HerbId[];
  const matched = values.find((value) => value === id);
  if (!matched) {
    return null;
  }
  return herbConfigs[matched];
}
