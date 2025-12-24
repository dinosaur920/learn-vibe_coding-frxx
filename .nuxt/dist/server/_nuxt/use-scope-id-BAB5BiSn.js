import { getCurrentInstance } from "vue";
import { e as extend } from "./index-Cm1_ppAu.js";
function useExpose(apis) {
  const instance = getCurrentInstance();
  if (instance) {
    extend(instance.proxy, apis);
  }
}
const useScopeId = () => {
  var _a;
  const { scopeId } = ((_a = getCurrentInstance()) == null ? void 0 : _a.vnode) || {};
  return scopeId ? { [scopeId]: "" } : null;
};
export {
  useScopeId as a,
  useExpose as u
};
//# sourceMappingURL=use-scope-id-BAB5BiSn.js.map
