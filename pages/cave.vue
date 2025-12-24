<template>
  <div class="page">
    <div class="header">
      <h1 class="title">洞府·药园</h1>
      <p class="subtitle">一方小院，静候灵草成熟</p>
    </div>

    <div v-if="plots.length > 0" class="plots">
      <div v-for="plot in plots" :key="plot.id" class="plot-card">
        <div class="plot-header">
          <div class="plot-title">
            第 {{ plot.slotIndex + 1 }} 块灵田
          </div>
          <div class="plot-status" :class="{
            'plot-status-empty': plot.status === caveStatusEmpty,
            'plot-status-growing': plot.status !== caveStatusEmpty && !plot.isMature,
            'plot-status-ready': plot.isMature,
          }">
            <span v-if="plot.status === caveStatusEmpty">空置</span>
            <span v-else-if="plot.isMature">可收获</span>
            <span v-else>生长中</span>
          </div>
        </div>

        <div class="plot-body">
          <div class="row">
            <span class="label">灵草</span>
            <span class="value">
              <span v-if="plot.herbName">{{ plot.herbName }}</span>
              <span v-else>尚未种植</span>
            </span>
          </div>

          <div v-if="plot.plantedAt" class="row">
            <span class="label">种下时间</span>
            <span class="value">
              {{ formatTime(plot.plantedAt) }}
            </span>
          </div>

          <div v-if="plot.matureAt" class="row">
            <span class="label">预计成熟</span>
            <span class="value">
              {{ formatTime(plot.matureAt) }}
            </span>
          </div>
        </div>

        <div class="plot-actions">
          <van-button v-if="plot.status === caveStatusEmpty" size="small" type="primary" block
            :loading="plantingSlotIndex === plot.slotIndex && planting" @click="openPlantSheet(plot.slotIndex)">
            种植灵草
          </van-button>

          <van-button v-else-if="plot.isMature" size="small" type="success" block
            :loading="harvestingSlotIndex === plot.slotIndex && harvesting" @click="onHarvest(plot.slotIndex)">
            收获灵草
          </van-button>

          <van-button v-else size="small" type="default" block disabled>
            正在生长
          </van-button>
        </div>
      </div>
    </div>

    <div v-else class="empty">
      <p>暂未查询到洞府信息，请尝试刷新或重新登录。</p>
    </div>

    <van-popup v-model:show="plantPopupVisible" position="center" round class="plant-popup">
      <div class="plant-popup-inner">
        <div class="plant-popup-header">
          <div class="plant-popup-title">
            选择要种下的灵草
          </div>
          <van-icon name="cross" class="plant-popup-close" @click="closePlantPopup" />
        </div>
        <div class="plant-popup-subtitle">
          不同品阶的灵草成熟时间与价值各不相同
        </div>
        <div class="plant-sheet">
          <div class="plant-sheet-grid">
            <div v-for="herb in herbOptions" :key="herb.id" class="herb-card" :class="[
              `herb-card-${herb.rarity}`,
            ]" @click="onConfirmPlant(herb.id)">
              <div class="herb-card-main">
                <van-icon :name="herb.icon" class="herb-icon" />
                <div class="herb-info">
                  <div class="herb-name">
                    {{ herb.name }}
                  </div>
                  <div class="herb-meta">
                    约 {{ herb.matureMinutes }} 分钟成熟
                  </div>
                </div>
              </div>
              <div class="herb-tag" :class="`herb-tag-${herb.rarity}`">
                {{ herb.rarityLabel }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import { useIntervalFn } from "@vueuse/core"
import dayjs from "dayjs"
import { showToast } from "vant"
import {
  BASIC_HERB_IDS,
  CavePlotStatus,
  HerbId,
  getHerbConfig,
} from "~/utils/gameConstants"

type CavePlotView = {
  id: number
  slotIndex: number
  status: string
  herbId: string | null
  herbName: string | null
  plantedAt: string | null
  matureAt: string | null
  isMature: boolean
}

type SuccessResponse<T> = {
  success: true
  data: T
}

type ErrorResponse = {
  success: false
  code: string
  message: string
}

type CaveStatusData = {
  plots: CavePlotView[]
}

type HerbOption = {
  id: string
  name: string
  matureMinutes: number
  icon: string
  rarity: "COMMON" | "RARE" | "EPIC"
  rarityLabel: string
}

const router = useRouter()

const loading = ref(false)
const plots = ref<CavePlotView[]>([])

const plantPopupVisible = ref(false)
const planting = ref(false)
const plantingSlotIndex = ref<number | null>(null)

const harvesting = ref(false)
const harvestingSlotIndex = ref<number | null>(null)

const caveStatusEmpty = CavePlotStatus.EMPTY

const herbOptions = computed<HerbOption[]>(() => {
  return BASIC_HERB_IDS.map((id) => {
    const config = getHerbConfig(id)
    let icon = "flower-o"
    if (config.id === HerbId.SPIRIT_FRUIT || config.id === HerbId.SPIRIT_ORCHID) {
      icon = "fire-o"
    }
    if (config.id === HerbId.SPIRIT_LOTUS) {
      icon = "diamond-o"
    }
    return {
      id: config.id,
      name: config.name,
      matureMinutes: Math.max(1, Math.round(config.matureSeconds / 60)),
      icon,
      rarity: config.rarity,
      rarityLabel: config.rarityLabel,
    }
  })
})

const formatTime = (iso: string | null) => {
  if (!iso) {
    return "-"
  }
  return dayjs(iso).format("HH:mm:ss")
}

const handleErrorResponse = (response: ErrorResponse) => {
  if (response.code === "AUTH_UNAUTHORIZED") {
    showToast(response.message)
    router.push("/login")
    return
  }
  showToast(response.message)
}

const loadStatus = async () => {
  if (loading.value) {
    return
  }
  loading.value = true
  try {
    const { data, error } = await useFetch<
      SuccessResponse<CaveStatusData> | ErrorResponse
    >("/api/cave/status", {
      method: "GET",
    })

    if (error.value) {
      throw error.value
    }

    if (!data.value) {
      throw new Error("加载洞府信息失败")
    }

    if (!data.value.success) {
      handleErrorResponse(data.value)
      return
    }

    plots.value = data.value.data.plots
  } catch (error: any) {
    const message = error?.message || "加载洞府信息失败"
    showToast(message)
  } finally {
    loading.value = false
  }
}

const refresh = async () => {
  await loadStatus()
}

const openPlantSheet = (slotIndex: number) => {
  plantingSlotIndex.value = slotIndex
  plantPopupVisible.value = true
}

const closePlantPopup = () => {
  plantPopupVisible.value = false
}

const onConfirmPlant = async (herbId: string) => {
  if (planting.value) {
    return
  }
  const slotIndex = plantingSlotIndex.value
  if (slotIndex === null) {
    plantPopupVisible.value = false
    return
  }
  planting.value = true
  try {
    const { data, error } = await useFetch<
      SuccessResponse<unknown> | ErrorResponse
    >("/api/cave/plant", {
      method: "POST",
      body: {
        slotIndex,
        herbId,
      },
    })

    if (error.value) {
      throw error.value
    }

    if (!data.value) {
      throw new Error("种植失败")
    }

    if (!data.value.success) {
      handleErrorResponse(data.value)
      return
    }

    showToast("种植成功")
    plantPopupVisible.value = false
    await loadStatus()
  } catch (error: any) {
    const message = error?.message || "种植失败，请稍后重试"
    showToast(message)
  } finally {
    planting.value = false
    plantingSlotIndex.value = null
  }
}

const onHarvest = async (slotIndex: number) => {
  if (harvesting.value) {
    return
  }
  harvesting.value = true
  harvestingSlotIndex.value = slotIndex
  try {
    const { data, error } = await useFetch<
      SuccessResponse<{ harvest: { herbName: string } }> | ErrorResponse
    >("/api/cave/harvest", {
      method: "POST",
      body: {
        slotIndex,
      },
    })

    if (error.value) {
      throw error.value
    }

    if (!data.value) {
      throw new Error("收获失败")
    }

    if (!data.value.success) {
      handleErrorResponse(data.value)
      return
    }

    const name = data.value.data.harvest.herbName
    if (name) {
      showToast(`收获到 ${name}`)
    } else {
      showToast("收获成功")
    }

    await loadStatus()
  } catch (error: any) {
    const message = error?.message || "收获失败，请稍后重试"
    showToast(message)
  } finally {
    harvesting.value = false
    harvestingSlotIndex.value = null
  }
}

const { pause, resume } = useIntervalFn(
  () => {
    loadStatus()
  },
  5000,
  {
    immediate: false,
  }
)

onMounted(async () => {
  await loadStatus()
  resume()
})

onBeforeUnmount(() => {
  pause()
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 24px 16px 80px;
  box-sizing: border-box;
  background: #0b1020;
  color: #f5f5f5;
}

.header {
  text-align: center;
  margin-bottom: 12px;
}

.title {
  margin: 0 0 4px;
  font-size: 20px;
}

.subtitle {
  margin: 0;
  font-size: 13px;
  color: #c9c9c9;
}

.plots {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.plot-card {
  padding: 12px;
  border-radius: 10px;
  background: rgba(15, 22, 40, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;
  min-height: 150px;
}

.plot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.plot-title {
  font-size: 14px;
}

.plot-status {
  padding: 2px 6px;
  border-radius: 999px;
  font-size: 11px;
}

.plot-status-empty {
  background: rgba(120, 120, 120, 0.24);
  color: #e0e0e0;
}

.plot-status-growing {
  background: rgba(56, 189, 248, 0.16);
  color: #38bdf8;
}

.plot-status-ready {
  background: rgba(74, 222, 128, 0.16);
  color: #4ade80;
}

.plot-body {
  font-size: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  color: #a3a3a3;
}

.value {
  color: #f5f5f5;
}

.plot-actions {
  margin-top: 4px;
}

.empty {
  margin-top: 40px;
  text-align: center;
  font-size: 14px;
  color: #c9c9c9;
}

.plant-popup {
  width: 88%;
  max-width: 420px;
}

.plant-popup-inner {
  padding: 16px 14px 14px;
  background: radial-gradient(circle at top, #020617 0, #020617 45%, #020617 100%);
  border-radius: 16px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.9);
  color: #e5e7eb;
}

.plant-popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.plant-popup-title {
  font-size: 16px;
}

.plant-popup-close {
  font-size: 18px;
  color: #9ca3af;
}

.plant-popup-subtitle {
  margin-top: 6px;
  font-size: 11px;
  color: #9ca3af;
}

.plant-sheet {
  margin-top: 12px;
  max-height: 320px;
  overflow-y: auto;
}

.plant-sheet-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.herb-card {
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 72px;
  cursor: pointer;
  box-shadow: 0 0 0 1px rgba(148, 163, 184, 0.35);
  transition: transform 0.12s ease-out, box-shadow 0.12s ease-out,
    background 0.12s ease-out;
}

.herb-card-COMMON {
  background: linear-gradient(135deg, #0f172a 0%, #020617 60%);
}

.herb-card-RARE {
  background: radial-gradient(circle at top left, #0f172a 0, #1d283a 40%, #020617 80%);
}

.herb-card-EPIC {
  background: radial-gradient(circle at top left, #4c1d95 0, #1e293b 45%, #020617 90%);
}

.herb-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 0 0 1px rgba(248, 250, 252, 0.3),
    0 8px 16px rgba(15, 23, 42, 0.8);
}

.herb-card-main {
  display: flex;
  align-items: center;
  gap: 8px;
}

.herb-icon {
  font-size: 24px;
  color: #f97316;
}

.herb-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.herb-name {
  font-size: 14px;
  color: #e5e7eb;
}

.herb-meta {
  font-size: 11px;
  color: #9ca3af;
}

.herb-tag {
  margin-top: 6px;
  align-self: flex-end;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 999px;
  border: 1px solid rgba(248, 250, 252, 0.4);
  color: #f9fafb;
}

.herb-tag-COMMON {
  border-color: #6b7280;
  color: #e5e7eb;
}

.herb-tag-RARE {
  border-color: #38bdf8;
  color: #7dd3fc;
}

.herb-tag-EPIC {
  border-color: #a855f7;
  color: #e879f9;
}
</style>
