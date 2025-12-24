<template>
  <div class="page">
    <div class="header">
      <h1 class="title">凡人修仙传·掌上仙途</h1>
      <p class="subtitle">静坐吐纳，修炼真元</p>
    </div>

    <div v-if="playerInfo" class="card">
      <div class="row">
        <span class="label">道号</span>
        <span class="value">{{ playerInfo.username }}</span>
      </div>
      <div class="row">
        <span class="label">境界</span>
        <span class="value">{{ playerInfo.realmLabel }}</span>
      </div>
      <div class="row">
        <span class="label">灵根</span>
        <span class="value">{{ playerInfo.spiritRootLabel }}</span>
      </div>
    </div>

    <div v-if="playerInfo" class="card">
      <div class="row">
        <span class="label">当前修为</span>
        <span class="value">
          {{ playerInfo.cultivation }} / {{ playerInfo.maxCultivation }}
        </span>
      </div>
      <van-progress :percentage="progressPercent" :show-pivot="false" />
    </div>

    <div v-if="playerInfo" class="actions">
      <van-button type="primary" round block :loading="cultivating" @click="onCultivateOnce">
        打坐修炼
      </van-button>
      <van-button type="default" round block @click="toggleAutoCultivate">
        {{ autoCultivate ? "暂停挂机" : "开始挂机" }}
      </van-button>
      <p class="hint">
        挂机开启时，每秒自动结算一次修为，离线时间也会在下次结算时一次补齐。
      </p>
    </div>

    <div v-else class="empty">
      <p>尚未登录，请先前往登录页。</p>
      <van-button type="primary" round block :to="{ path: '/login' }">
        去登录
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import { showToast } from "vant"
import { useIntervalFn } from "@vueuse/core"
import { usePlayerStore } from "~/stores/player"

const router = useRouter()
const playerStore = usePlayerStore()

const cultivating = ref(false)
const autoCultivate = ref(true)

const playerInfo = computed(() => playerStore.playerInfo)

const progressPercent = computed(() => {
  if (!playerInfo.value || playerInfo.value.maxCultivation <= 0) {
    return 0
  }
  const value = (playerInfo.value.cultivation / playerInfo.value.maxCultivation) * 100
  if (value < 0) {
    return 0
  }
  if (value > 100) {
    return 100
  }
  return Math.floor(value)
})

const runCultivate = async () => {
  if (!playerInfo.value) {
    return
  }
  if (typeof (playerStore as any).cultivate !== "function") {
    return
  }
  try {
    await playerStore.cultivate()
  } catch (error: any) {
    const message = error?.message || "修炼失败，请稍后重试"
    showToast(message)
  }
}

const onCultivateOnce = async () => {
  if (!playerInfo.value) {
    showToast("请先登录")
    router.push("/login")
    return
  }
  if (cultivating.value) {
    return
  }
  cultivating.value = true
  try {
    await runCultivate()
  } finally {
    cultivating.value = false
  }
}

const toggleAutoCultivate = () => {
  autoCultivate.value = !autoCultivate.value
}

const { pause, resume } = useIntervalFn(
  () => {
    if (!autoCultivate.value) {
      return
    }
    if (!playerInfo.value) {
      return
    }
    if (typeof (playerStore as any).cultivate !== "function") {
      return
    }
    playerStore.cultivate().catch(() => { })
  },
  1000,
  {
    immediate: false
  }
)

onMounted(async () => {
  try {
    if (!playerInfo.value) {
      await playerStore.fetchProfile()
    }
    if (!playerInfo.value) {
      router.push("/login")
      return
    }
    resume()
  } catch {
    router.push("/login")
  }
})

onBeforeUnmount(() => {
  pause()
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 24px 16px 32px;
  box-sizing: border-box;
  background: #0b1020;
  color: #f5f5f5;
}

.header {
  text-align: center;
  margin-bottom: 16px;
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

.card {
  margin-top: 12px;
  padding: 12px;
  border-radius: 8px;
  background: rgba(15, 22, 40, 0.9);
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  margin-bottom: 6px;
}

.row:last-child {
  margin-bottom: 0;
}

.label {
  color: #9fa3b0;
}

.value {
  color: #f5f5f5;
}

.actions {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hint {
  margin: 0;
  font-size: 12px;
  color: #8f9bb3;
}

.empty {
  margin-top: 32px;
}
</style>
