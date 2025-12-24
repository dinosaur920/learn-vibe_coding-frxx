import { d as defineStore } from './server.mjs';
import { u as useFetch } from './function-call-BpCHN0rm.mjs';

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
        throw new Error("\u6CE8\u518C\u5931\u8D25");
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
        throw new Error("\u767B\u5F55\u5931\u8D25");
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
        throw new Error("\u83B7\u53D6\u73A9\u5BB6\u4FE1\u606F\u5931\u8D25");
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
        throw new Error("\u4FEE\u70BC\u5931\u8D25");
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
        throw new Error("\u7A81\u7834\u5931\u8D25");
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

export { usePlayerStore as u };
//# sourceMappingURL=player-CH_xINOg.mjs.map
