export default defineNuxtRouteMiddleware((to) => {
  const publicPaths = ["/login", "/register"];
  if (publicPaths.includes(to.path)) {
    return;
  }

  if (process.server) {
    const headers = useRequestHeaders(["cookie"]);
    const cookie = headers.cookie || "";
    const hasToken = cookie.includes("auth_token=");
    if (!hasToken) {
      return navigateTo("/login");
    }
  }
});
