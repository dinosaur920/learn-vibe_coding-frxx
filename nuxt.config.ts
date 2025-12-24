import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  modules: ["@pinia/nuxt", "@vant/nuxt", "@vueuse/nuxt"],
  typescript: {
    strict: true,
    typeCheck: false,
  },
  app: {
    head: {
      meta: [
        {
          name: "viewport",
          content:
            "width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no",
        },
      ],
    },
  },
});
