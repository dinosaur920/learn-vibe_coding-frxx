import { defineStore } from "pinia"

export type PlayerInfo = {
  id: number
  username: string
  email: string | null
  realm: string
  realmLabel: string
  cultivation: number
  maxCultivation: number
  spiritRoot: string
  spiritRootLabel: string
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

type RegisterPayload = {
  username: string
  password: string
}

type LoginPayload = {
  username: string
  password: string
}

export const usePlayerStore = defineStore("player", {
  state: () => ({
    playerInfo: null as PlayerInfo | null,
    token: null as string | null
  }),
  actions: {
    async register(payload: RegisterPayload) {
      const { data, error } = await useFetch<SuccessResponse<PlayerInfo> | ErrorResponse>("/api/user/register", {
        method: "POST",
        body: payload
      })

      if (error.value) {
        throw error.value
      }

      if (!data.value) {
        throw new Error("注册失败")
      }

      if (!data.value.success) {
        throw new Error(data.value.message)
      }

      this.playerInfo = data.value.data
    },
    async login(payload: LoginPayload) {
      const { data, error } = await useFetch<SuccessResponse<PlayerInfo> | ErrorResponse>("/api/user/login", {
        method: "POST",
        body: payload
      })

      if (error.value) {
        throw error.value
      }

      if (!data.value) {
        throw new Error("登录失败")
      }

      if (!data.value.success) {
        throw new Error(data.value.message)
      }

      this.playerInfo = data.value.data
    },
    async fetchProfile() {
      const { data, error } = await useFetch<SuccessResponse<PlayerInfo> | ErrorResponse>("/api/user/profile", {
        method: "GET"
      })

      if (error.value) {
        throw error.value
      }

      if (!data.value) {
        throw new Error("获取玩家信息失败")
      }

      if (!data.value.success) {
        if (data.value.code === "AUTH_UNAUTHORIZED") {
          this.playerInfo = null
          this.token = null
          return
        }
        throw new Error(data.value.message)
      }

      this.playerInfo = data.value.data
    },
    async cultivate() {
      const { data, error } = await useFetch<SuccessResponse<PlayerInfo> | ErrorResponse>("/api/game/cultivate", {
        method: "POST"
      })

      if (error.value) {
        throw error.value
      }

      if (!data.value) {
        throw new Error("修炼失败")
      }

      if (!data.value.success) {
        if (data.value.code === "AUTH_UNAUTHORIZED") {
          this.playerInfo = null
          this.token = null
          return
        }
        throw new Error(data.value.message)
      }

      this.playerInfo = data.value.data
    },
    async breakthrough() {
      const { data, error } = await useFetch<SuccessResponse<PlayerInfo> | ErrorResponse>("/api/game/breakthrough", {
        method: "POST"
      })

      if (error.value) {
        throw error.value
      }

      if (!data.value) {
        throw new Error("突破失败")
      }

      if (!data.value.success) {
        if (data.value.code === "AUTH_UNAUTHORIZED") {
          this.playerInfo = null
          this.token = null
          return
        }
        throw new Error(data.value.message)
      }

      this.playerInfo = data.value.data
    },
    logout() {
      this.playerInfo = null
      this.token = null
    }
  }
})
