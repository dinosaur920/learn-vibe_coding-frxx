<template>
  <div class="page">
    <div class="header">
      <h1 class="title">凡人修仙传·掌上仙途</h1>
      <p class="subtitle">新建账号，开启修仙旅程</p>
    </div>
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="username"
          name="username"
          label="账号"
          placeholder="请输入账号"
          autocomplete="username"
          clearable
        />
        <van-field
          v-model="password"
          name="password"
          label="密码"
          type="password"
          placeholder="请输入密码"
          autocomplete="new-password"
          clearable
        />
      </van-cell-group>
      <div class="actions">
        <van-button round block type="primary" native-type="submit" :loading="loading">
          注册
        </van-button>
        <van-button round block type="default" class="login-button" :to="{ path: '/login' }">
          返回登录
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import { showToast } from "vant"
import { usePlayerStore } from "~/stores/player"

const username = ref("")
const password = ref("")
const loading = ref(false)

const router = useRouter()
const playerStore = usePlayerStore()

const onSubmit = async () => {
  if (!username.value || !password.value) {
    showToast("请输入账号和密码")
    return
  }

  loading.value = true
  try {
    await playerStore.register({
      username: username.value,
      password: password.value
    })
    showToast("注册成功，请登录")
    router.push("/login")
  } catch (error: any) {
    const message = error?.message || "注册失败，请稍后重试"
    showToast(message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 24px 16px;
  background: #0b1020;
  color: #f5f5f5;
  box-sizing: border-box;
}

.header {
  text-align: center;
  margin-bottom: 24px;
}

.title {
  font-size: 20px;
  margin: 0 0 4px;
}

.subtitle {
  margin: 0;
  font-size: 13px;
  color: #c9c9c9;
}

.actions {
  margin: 24px 0 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.login-button {
  margin-top: 4px;
}
</style>

