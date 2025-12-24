import { v as isPromise, O as noop } from "./index-HaumD47W.js";
import { inject, watch } from "vue";
function callInterceptor(interceptor, {
  args = [],
  done,
  canceled,
  error
}) {
  if (interceptor) {
    const returnVal = interceptor.apply(null, args);
    if (isPromise(returnVal)) {
      returnVal.then((value) => {
        if (value) {
          done();
        } else if (canceled) {
          canceled();
        }
      }).catch(error || noop);
    } else if (returnVal) {
      done();
    } else if (canceled) {
      canceled();
    }
  } else {
    done();
  }
}
const POPUP_TOGGLE_KEY = /* @__PURE__ */ Symbol();
function onPopupReopen(callback) {
  const popupToggleStatus = inject(POPUP_TOGGLE_KEY, null);
  if (popupToggleStatus) {
    watch(popupToggleStatus, (show) => {
      if (show) {
        callback();
      }
    });
  }
}
export {
  POPUP_TOGGLE_KEY as P,
  callInterceptor as c,
  onPopupReopen as o
};
//# sourceMappingURL=on-popup-reopen-DMW2JSr1.js.map
