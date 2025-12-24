<template>
  <div class="layout">
    <div class="layout-content">
      <slot />
    </div>
    <van-tabbar route fixed safe-area-inset-bottom>
      <van-tabbar-item replace to="/" icon="fire-o">
        修炼
      </van-tabbar-item>
      <van-tabbar-item replace to="/cave" icon="home-o">
        洞府
      </van-tabbar-item>
      <van-tabbar-item replace to="/inventory" icon="bag-o">
        行囊
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout-content {
  flex: 1;
  overflow-y: auto;
}
</style>

