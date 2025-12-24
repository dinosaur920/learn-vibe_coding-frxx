import { d as defineStore } from "../server.mjs";
import { u as useFetch } from "./function-call-BpCHN0rm.js";
const usePlayerStore = defineStore("player", {
  state: () => ({
    playerInfo: null,
    token: null
  }),
  actions: {
    async register(payload) {
      const { data, error } = await useFetch("/api/user/register", {
        method: "POST",
        body: payload
      }, "$pkbWiIeQNi");
      if (error.value) {
        throw error.value;
      }
      if (!data.value) {
        throw new Error("注册失败");
      }
      if (!data.value.success) {
        throw new Error(data.value.message);
      }
      this.playerInfo = data.value.data;
    },
    async login(payload) {
      const { data, error } = await useFetch("/api/user/login", {
        method: "POST",
        body: payload
      }, "$ShvpT786Zb");
      if (error.value) {
        throw error.value;
      }
      if (!data.value) {
        throw new Error("登录失败");
      }
      if (!data.value.success) {
        throw new Error(data.value.message);
      }
      this.playerInfo = data.value.data;
    },
    async fetchProfile() {
      const { data, error } = await useFetch("/api/user/profile", {
        method: "GET"
      }, "$ZNOQHEzEyU");
      if (error.value) {
        throw error.value;
      }
      if (!data.value) {
        throw new Error("获取玩家信息失败");
      }
      if (!data.value.success) {
        if (data.value.code === "AUTH_UNAUTHORIZED") {
          this.playerInfo = null;
          this.token = null;
          return;
        }
        throw new Error(data.value.message);
      }
      this.playerInfo = data.value.data;
    },
    async cultivate() {
      const { data, error } = await useFetch("/api/game/cultivate", {
        method: "POST"
      }, "$byfe_taCqQ");
      if (error.value) {
        throw error.value;
      }
      if (!data.value) {
        throw new Error("修炼失败");
      }
      if (!data.value.success) {
        if (data.value.code === "AUTH_UNAUTHORIZED") {
          this.playerInfo = null;
          this.token = null;
          return;
        }
        throw new Error(data.value.message);
      }
      this.playerInfo = data.value.data;
    },
    async breakthrough() {
      const { data, error } = await useFetch("/api/game/breakthrough", {
        method: "POST"
      }, "$COMMd0azag");
      if (error.value) {
        throw error.value;
      }
      if (!data.value) {
        throw new Error("突破失败");
      }
      if (!data.value.success) {
        if (data.value.code === "AUTH_UNAUTHORIZED") {
          this.playerInfo = null;
          this.token = null;
          return;
        }
        throw new Error(data.value.message);
      }
      this.playerInfo = data.value.data;
    },
    logout() {
      this.playerInfo = null;
      this.token = null;
    }
  }
});
export {
  usePlayerStore as u
};
//# sourceMappingURL=player-CH_xINOg.js.map
