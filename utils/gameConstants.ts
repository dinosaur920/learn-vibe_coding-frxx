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
  MUTANT: 1.1
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
  QI_10: 1.45
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
