import { getCurrentInstance, defineComponent, createVNode, reactive, ref, computed, provide, watch, nextTick, createTextVNode, mergeProps, Fragment } from "vue";
import { u as unknownProp, t as truthProp, n as numericProp, m as makeStringProp, c as createNamespace, e as extend, r as routeProps, j as useRoute, I as Icon, i as isDef, w as withInstall, k as useChildren, p as preventDefault, F as FORM_KEY, l as getRootScrollTop, o as isObject, s as setRootScrollTop, q as isFunction, v as isPromise, x as useParent, a as addUnit, C as CUSTOM_FIELD_INJECTION_KEY, y as useEventListener, z as makeNumericProp, A as toArray, B as formatNumber, D as clamp, E as BORDER_TOP_BOTTOM } from "./index-HaumD47W.js";
import { u as useExpose, a as useScopeId } from "./player-DGNQd8vS.js";
let current = 0;
function useId() {
  const vm = getCurrentInstance();
  const { name: name2 = "unknown" } = (vm == null ? void 0 : vm.type) || {};
  if (process.env.NODE_ENV === "test") {
    return name2;
  }
  return `${name2}-${++current}`;
}
const [name$3, bem$3] = createNamespace("cell");
const cellSharedProps = {
  tag: makeStringProp("div"),
  icon: String,
  size: String,
  title: numericProp,
  value: numericProp,
  label: numericProp,
  center: Boolean,
  isLink: Boolean,
  border: truthProp,
  iconPrefix: String,
  valueClass: unknownProp,
  labelClass: unknownProp,
  titleClass: unknownProp,
  titleStyle: null,
  arrowDirection: String,
  required: {
    type: [Boolean, String],
    default: null
  },
  clickable: {
    type: Boolean,
    default: null
  }
};
const cellProps = extend({}, cellSharedProps, routeProps);
var stdin_default$3 = defineComponent({
  name: name$3,
  props: cellProps,
  setup(props, {
    slots
  }) {
    const route = useRoute();
    const renderLabel = () => {
      const showLabel = slots.label || isDef(props.label);
      if (showLabel) {
        return createVNode("div", {
          "class": [bem$3("label"), props.labelClass]
        }, [slots.label ? slots.label() : props.label]);
      }
    };
    const renderTitle = () => {
      var _a;
      if (slots.title || isDef(props.title)) {
        const titleSlot = (_a = slots.title) == null ? void 0 : _a.call(slots);
        if (Array.isArray(titleSlot) && titleSlot.length === 0) {
          return;
        }
        return createVNode("div", {
          "class": [bem$3("title"), props.titleClass],
          "style": props.titleStyle
        }, [titleSlot || createVNode("span", null, [props.title]), renderLabel()]);
      }
    };
    const renderValue = () => {
      const slot = slots.value || slots.default;
      const hasValue = slot || isDef(props.value);
      if (hasValue) {
        return createVNode("div", {
          "class": [bem$3("value"), props.valueClass]
        }, [slot ? slot() : createVNode("span", null, [props.value])]);
      }
    };
    const renderLeftIcon = () => {
      if (slots.icon) {
        return slots.icon();
      }
      if (props.icon) {
        return createVNode(Icon, {
          "name": props.icon,
          "class": bem$3("left-icon"),
          "classPrefix": props.iconPrefix
        }, null);
      }
    };
    const renderRightIcon = () => {
      if (slots["right-icon"]) {
        return slots["right-icon"]();
      }
      if (props.isLink) {
        const name2 = props.arrowDirection && props.arrowDirection !== "right" ? `arrow-${props.arrowDirection}` : "arrow";
        return createVNode(Icon, {
          "name": name2,
          "class": bem$3("right-icon")
        }, null);
      }
    };
    return () => {
      var _a;
      const {
        tag,
        size,
        center,
        border,
        isLink,
        required
      } = props;
      const clickable = (_a = props.clickable) != null ? _a : isLink;
      const classes = {
        center,
        required: !!required,
        clickable,
        borderless: !border
      };
      if (size) {
        classes[size] = !!size;
      }
      return createVNode(tag, {
        "class": bem$3(classes),
        "role": clickable ? "button" : void 0,
        "tabindex": clickable ? 0 : void 0,
        "onClick": route
      }, {
        default: () => {
          var _a2;
          return [renderLeftIcon(), renderTitle(), renderValue(), renderRightIcon(), (_a2 = slots.extra) == null ? void 0 : _a2.call(slots)];
        }
      });
    };
  }
});
const Cell = withInstall(stdin_default$3);
const [name$2, bem$2] = createNamespace("form");
const formProps = {
  colon: Boolean,
  disabled: Boolean,
  readonly: Boolean,
  required: [Boolean, String],
  showError: Boolean,
  labelWidth: numericProp,
  labelAlign: String,
  inputAlign: String,
  scrollToError: Boolean,
  scrollToErrorPosition: String,
  validateFirst: Boolean,
  submitOnEnter: truthProp,
  showErrorMessage: truthProp,
  errorMessageAlign: String,
  validateTrigger: {
    type: [String, Array],
    default: "onBlur"
  }
};
var stdin_default$2 = defineComponent({
  name: name$2,
  props: formProps,
  emits: ["submit", "failed"],
  setup(props, {
    emit,
    slots
  }) {
    const {
      children,
      linkChildren
    } = useChildren(FORM_KEY);
    const getFieldsByNames = (names) => {
      if (names) {
        return children.filter((field) => names.includes(field.name));
      }
      return children;
    };
    const validateSeq = (names) => new Promise((resolve, reject) => {
      const errors = [];
      const fields = getFieldsByNames(names);
      fields.reduce((promise, field) => promise.then(() => {
        if (!errors.length) {
          return field.validate().then((error) => {
            if (error) {
              errors.push(error);
            }
          });
        }
      }), Promise.resolve()).then(() => {
        if (errors.length) {
          reject(errors);
        } else {
          resolve();
        }
      });
    });
    const validateAll = (names) => new Promise((resolve, reject) => {
      const fields = getFieldsByNames(names);
      Promise.all(fields.map((item) => item.validate())).then((errors) => {
        errors = errors.filter(Boolean);
        if (errors.length) {
          reject(errors);
        } else {
          resolve();
        }
      });
    });
    const validateField = (name2) => {
      const matched = children.find((item) => item.name === name2);
      if (matched) {
        return new Promise((resolve, reject) => {
          matched.validate().then((error) => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          });
        });
      }
      return Promise.reject();
    };
    const validate = (name2) => {
      if (typeof name2 === "string") {
        return validateField(name2);
      }
      return props.validateFirst ? validateSeq(name2) : validateAll(name2);
    };
    const resetValidation = (name2) => {
      if (typeof name2 === "string") {
        name2 = [name2];
      }
      const fields = getFieldsByNames(name2);
      fields.forEach((item) => {
        item.resetValidation();
      });
    };
    const getValidationStatus = () => children.reduce((form, field) => {
      form[field.name] = field.getValidationStatus();
      return form;
    }, {});
    const scrollToField = (name2, options) => {
      children.some((item) => {
        if (item.name === name2) {
          item.$el.scrollIntoView(options);
          return true;
        }
        return false;
      });
    };
    const getValues = () => children.reduce((form, field) => {
      if (field.name !== void 0) {
        form[field.name] = field.formValue.value;
      }
      return form;
    }, {});
    const submit = () => {
      const values = getValues();
      validate().then(() => emit("submit", values)).catch((errors) => {
        emit("failed", {
          values,
          errors
        });
        const {
          scrollToError,
          scrollToErrorPosition
        } = props;
        if (scrollToError && errors[0].name) {
          scrollToField(errors[0].name, scrollToErrorPosition ? {
            block: scrollToErrorPosition
          } : void 0);
        }
      });
    };
    const onSubmit = (event) => {
      preventDefault(event);
      submit();
    };
    linkChildren({
      props
    });
    useExpose({
      submit,
      validate,
      getValues,
      scrollToField,
      resetValidation,
      getValidationStatus
    });
    return () => {
      var _a;
      return createVNode("form", {
        "class": bem$2(),
        "onSubmit": onSubmit
      }, [(_a = slots.default) == null ? void 0 : _a.call(slots)]);
    };
  }
});
function isEmptyValue(value) {
  if (Array.isArray(value)) {
    return !value.length;
  }
  if (value === 0) {
    return false;
  }
  return !value;
}
function runSyncRule(value, rule) {
  if (isEmptyValue(value)) {
    if (rule.required) {
      return false;
    }
    if (rule.validateEmpty === false) {
      return true;
    }
  }
  if (rule.pattern && !rule.pattern.test(String(value))) {
    return false;
  }
  return true;
}
function runRuleValidator(value, rule) {
  return new Promise((resolve) => {
    const returnVal = rule.validator(value, rule);
    if (isPromise(returnVal)) {
      returnVal.then(resolve);
      return;
    }
    resolve(returnVal);
  });
}
function getRuleMessage(value, rule) {
  const { message } = rule;
  if (isFunction(message)) {
    return message(value, rule);
  }
  return message || "";
}
function startComposing({ target }) {
  target.composing = true;
}
function endComposing({ target }) {
  if (target.composing) {
    target.composing = false;
    target.dispatchEvent(new Event("input"));
  }
}
function resizeTextarea(input, autosize) {
  const scrollTop = getRootScrollTop();
  input.style.height = "auto";
  let height = input.scrollHeight;
  if (isObject(autosize)) {
    const { maxHeight, minHeight } = autosize;
    if (maxHeight !== void 0) {
      height = Math.min(height, maxHeight);
    }
    if (minHeight !== void 0) {
      height = Math.max(height, minHeight);
    }
  }
  if (height) {
    input.style.height = `${height}px`;
    setRootScrollTop(scrollTop);
  }
}
function mapInputType(type, inputmode) {
  if (type === "number") {
    type = "text";
    inputmode != null ? inputmode : inputmode = "decimal";
  }
  if (type === "digit") {
    type = "tel";
    inputmode != null ? inputmode : inputmode = "numeric";
  }
  return { type, inputmode };
}
function getStringLength(str) {
  return [...str].length;
}
function cutString(str, maxlength) {
  return [...str].slice(0, maxlength).join("");
}
const [name$1, bem$1] = createNamespace("field");
const fieldSharedProps = {
  id: String,
  name: String,
  leftIcon: String,
  rightIcon: String,
  autofocus: Boolean,
  clearable: Boolean,
  maxlength: numericProp,
  max: Number,
  min: Number,
  formatter: Function,
  clearIcon: makeStringProp("clear"),
  modelValue: makeNumericProp(""),
  inputAlign: String,
  placeholder: String,
  autocomplete: String,
  autocapitalize: String,
  autocorrect: String,
  errorMessage: String,
  enterkeyhint: String,
  clearTrigger: makeStringProp("focus"),
  formatTrigger: makeStringProp("onChange"),
  spellcheck: {
    type: Boolean,
    default: null
  },
  error: {
    type: Boolean,
    default: null
  },
  disabled: {
    type: Boolean,
    default: null
  },
  readonly: {
    type: Boolean,
    default: null
  },
  inputmode: String
};
const fieldProps = extend({}, cellSharedProps, fieldSharedProps, {
  rows: numericProp,
  type: makeStringProp("text"),
  rules: Array,
  autosize: [Boolean, Object],
  labelWidth: numericProp,
  labelClass: unknownProp,
  labelAlign: String,
  showWordLimit: Boolean,
  errorMessageAlign: String,
  colon: {
    type: Boolean,
    default: null
  }
});
var stdin_default$1 = defineComponent({
  name: name$1,
  props: fieldProps,
  emits: ["blur", "focus", "clear", "keypress", "clickInput", "endValidate", "startValidate", "clickLeftIcon", "clickRightIcon", "update:modelValue"],
  setup(props, {
    emit,
    slots
  }) {
    const id = useId();
    const state = reactive({
      status: "unvalidated",
      focused: false,
      validateMessage: ""
    });
    const inputRef = ref();
    const clearIconRef = ref();
    const customValue = ref();
    const {
      parent: form
    } = useParent(FORM_KEY);
    const getModelValue = () => {
      var _a;
      return String((_a = props.modelValue) != null ? _a : "");
    };
    const getProp = (key) => {
      if (isDef(props[key])) {
        return props[key];
      }
      if (form && isDef(form.props[key])) {
        return form.props[key];
      }
    };
    const showClear = computed(() => {
      const readonly = getProp("readonly");
      if (props.clearable && !readonly) {
        const hasValue = getModelValue() !== "";
        const trigger = props.clearTrigger === "always" || props.clearTrigger === "focus" && state.focused;
        return hasValue && trigger;
      }
      return false;
    });
    const formValue = computed(() => {
      if (customValue.value && slots.input) {
        return customValue.value();
      }
      return props.modelValue;
    });
    const showRequiredMark = computed(() => {
      var _a;
      const required = getProp("required");
      if (required === "auto") {
        return (_a = props.rules) == null ? void 0 : _a.some((rule) => rule.required);
      }
      return required;
    });
    const runRules = (rules) => rules.reduce((promise, rule) => promise.then(() => {
      if (state.status === "failed") {
        return;
      }
      let {
        value
      } = formValue;
      if (rule.formatter) {
        value = rule.formatter(value, rule);
      }
      if (!runSyncRule(value, rule)) {
        state.status = "failed";
        state.validateMessage = getRuleMessage(value, rule);
        return;
      }
      if (rule.validator) {
        if (isEmptyValue(value) && rule.validateEmpty === false) {
          return;
        }
        return runRuleValidator(value, rule).then((result) => {
          if (result && typeof result === "string") {
            state.status = "failed";
            state.validateMessage = result;
          } else if (result === false) {
            state.status = "failed";
            state.validateMessage = getRuleMessage(value, rule);
          }
        });
      }
    }), Promise.resolve());
    const resetValidation = () => {
      state.status = "unvalidated";
      state.validateMessage = "";
    };
    const endValidate = () => emit("endValidate", {
      status: state.status,
      message: state.validateMessage
    });
    const validate = (rules = props.rules) => new Promise((resolve) => {
      resetValidation();
      if (rules) {
        emit("startValidate");
        runRules(rules).then(() => {
          if (state.status === "failed") {
            resolve({
              name: props.name,
              message: state.validateMessage
            });
            endValidate();
          } else {
            state.status = "passed";
            resolve();
            endValidate();
          }
        });
      } else {
        resolve();
      }
    });
    const validateWithTrigger = (trigger) => {
      if (form && props.rules) {
        const {
          validateTrigger
        } = form.props;
        const defaultTrigger = toArray(validateTrigger).includes(trigger);
        const rules = props.rules.filter((rule) => {
          if (rule.trigger) {
            return toArray(rule.trigger).includes(trigger);
          }
          return defaultTrigger;
        });
        if (rules.length) {
          validate(rules);
        }
      }
    };
    const limitValueLength = (value) => {
      var _a;
      const {
        maxlength
      } = props;
      if (isDef(maxlength) && getStringLength(value) > +maxlength) {
        const modelValue = getModelValue();
        if (modelValue && getStringLength(modelValue) === +maxlength) {
          return modelValue;
        }
        const selectionEnd = (_a = inputRef.value) == null ? void 0 : _a.selectionEnd;
        if (state.focused && selectionEnd) {
          const valueArr = [...value];
          const exceededLength = valueArr.length - +maxlength;
          valueArr.splice(selectionEnd - exceededLength, exceededLength);
          return valueArr.join("");
        }
        return cutString(value, +maxlength);
      }
      return value;
    };
    const updateValue = (value, trigger = "onChange") => {
      var _a, _b;
      const originalValue = value;
      value = limitValueLength(value);
      const limitDiffLen = originalValue.length - value.length;
      if (props.type === "number" || props.type === "digit") {
        const isNumber = props.type === "number";
        value = formatNumber(value, isNumber, isNumber);
        if (trigger === "onBlur" && value !== "" && (props.min !== void 0 || props.max !== void 0)) {
          const adjustedValue = clamp(+value, (_a = props.min) != null ? _a : -Infinity, (_b = props.max) != null ? _b : Infinity);
          if (+value !== adjustedValue) {
            value = adjustedValue.toString();
          }
        }
      }
      let formatterDiffLen = 0;
      if (props.formatter && trigger === props.formatTrigger) {
        const {
          formatter,
          maxlength
        } = props;
        value = formatter(value);
        if (isDef(maxlength) && getStringLength(value) > +maxlength) {
          value = cutString(value, +maxlength);
        }
        if (inputRef.value && state.focused) {
          const {
            selectionEnd
          } = inputRef.value;
          const bcoVal = cutString(originalValue, selectionEnd);
          formatterDiffLen = formatter(bcoVal).length - bcoVal.length;
        }
      }
      if (inputRef.value && inputRef.value.value !== value) {
        if (state.focused) {
          let {
            selectionStart,
            selectionEnd
          } = inputRef.value;
          inputRef.value.value = value;
          if (isDef(selectionStart) && isDef(selectionEnd)) {
            const valueLen = value.length;
            if (limitDiffLen) {
              selectionStart -= limitDiffLen;
              selectionEnd -= limitDiffLen;
            } else if (formatterDiffLen) {
              selectionStart += formatterDiffLen;
              selectionEnd += formatterDiffLen;
            }
            inputRef.value.setSelectionRange(Math.min(selectionStart, valueLen), Math.min(selectionEnd, valueLen));
          }
        } else {
          inputRef.value.value = value;
        }
      }
      if (value !== props.modelValue) {
        emit("update:modelValue", value);
      }
    };
    const onInput = (event) => {
      if (!event.target.composing) {
        updateValue(event.target.value);
      }
    };
    const blur = () => {
      var _a;
      return (_a = inputRef.value) == null ? void 0 : _a.blur();
    };
    const focus = () => {
      var _a;
      return (_a = inputRef.value) == null ? void 0 : _a.focus();
    };
    const adjustTextareaSize = () => {
      const input = inputRef.value;
      if (props.type === "textarea" && props.autosize && input) {
        resizeTextarea(input, props.autosize);
      }
    };
    const onFocus = (event) => {
      state.focused = true;
      emit("focus", event);
      nextTick(adjustTextareaSize);
      if (getProp("readonly")) {
        blur();
      }
    };
    const onBlur = (event) => {
      state.focused = false;
      updateValue(getModelValue(), "onBlur");
      emit("blur", event);
      if (getProp("readonly")) {
        return;
      }
      validateWithTrigger("onBlur");
      nextTick(adjustTextareaSize);
    };
    const onClickInput = (event) => emit("clickInput", event);
    const onClickLeftIcon = (event) => emit("clickLeftIcon", event);
    const onClickRightIcon = (event) => emit("clickRightIcon", event);
    const onClear = (event) => {
      preventDefault(event);
      emit("update:modelValue", "");
      emit("clear", event);
    };
    const showError = computed(() => {
      if (typeof props.error === "boolean") {
        return props.error;
      }
      if (form && form.props.showError && state.status === "failed") {
        return true;
      }
    });
    const labelStyle = computed(() => {
      const labelWidth = getProp("labelWidth");
      const labelAlign = getProp("labelAlign");
      if (labelWidth && labelAlign !== "top") {
        return {
          width: addUnit(labelWidth)
        };
      }
    });
    const onKeypress = (event) => {
      const ENTER_CODE = 13;
      if (event.keyCode === ENTER_CODE) {
        const submitOnEnter = form && form.props.submitOnEnter;
        if (!submitOnEnter && props.type !== "textarea") {
          preventDefault(event);
        }
        if (props.type === "search") {
          blur();
        }
      }
      emit("keypress", event);
    };
    const getInputId = () => props.id || `${id}-input`;
    const getValidationStatus = () => state.status;
    const renderInput = () => {
      const controlClass = bem$1("control", [getProp("inputAlign"), {
        error: showError.value,
        custom: !!slots.input,
        "min-height": props.type === "textarea" && !props.autosize
      }]);
      if (slots.input) {
        return createVNode("div", {
          "class": controlClass,
          "onClick": onClickInput
        }, [slots.input()]);
      }
      const inputAttrs = {
        id: getInputId(),
        ref: inputRef,
        name: props.name,
        rows: props.rows !== void 0 ? +props.rows : void 0,
        class: controlClass,
        disabled: getProp("disabled"),
        readonly: getProp("readonly"),
        autofocus: props.autofocus,
        placeholder: props.placeholder,
        autocomplete: props.autocomplete,
        autocapitalize: props.autocapitalize,
        autocorrect: props.autocorrect,
        enterkeyhint: props.enterkeyhint,
        spellcheck: props.spellcheck,
        "aria-labelledby": props.label ? `${id}-label` : void 0,
        "data-allow-mismatch": "attribute",
        onBlur,
        onFocus,
        onInput,
        onClick: onClickInput,
        onChange: endComposing,
        onKeypress,
        onCompositionend: endComposing,
        onCompositionstart: startComposing
      };
      if (props.type === "textarea") {
        return createVNode("textarea", mergeProps(inputAttrs, {
          "inputmode": props.inputmode
        }), null);
      }
      return createVNode("input", mergeProps(mapInputType(props.type, props.inputmode), inputAttrs), null);
    };
    const renderLeftIcon = () => {
      const leftIconSlot = slots["left-icon"];
      if (props.leftIcon || leftIconSlot) {
        return createVNode("div", {
          "class": bem$1("left-icon"),
          "onClick": onClickLeftIcon
        }, [leftIconSlot ? leftIconSlot() : createVNode(Icon, {
          "name": props.leftIcon,
          "classPrefix": props.iconPrefix
        }, null)]);
      }
    };
    const renderRightIcon = () => {
      const rightIconSlot = slots["right-icon"];
      if (props.rightIcon || rightIconSlot) {
        return createVNode("div", {
          "class": bem$1("right-icon"),
          "onClick": onClickRightIcon
        }, [rightIconSlot ? rightIconSlot() : createVNode(Icon, {
          "name": props.rightIcon,
          "classPrefix": props.iconPrefix
        }, null)]);
      }
    };
    const renderWordLimit = () => {
      if (props.showWordLimit && props.maxlength) {
        const count = getStringLength(getModelValue());
        return createVNode("div", {
          "class": bem$1("word-limit")
        }, [createVNode("span", {
          "class": bem$1("word-num")
        }, [count]), createTextVNode("/"), props.maxlength]);
      }
    };
    const renderMessage = () => {
      if (form && form.props.showErrorMessage === false) {
        return;
      }
      const message = props.errorMessage || state.validateMessage;
      if (message) {
        const slot = slots["error-message"];
        const errorMessageAlign = getProp("errorMessageAlign");
        return createVNode("div", {
          "class": bem$1("error-message", errorMessageAlign)
        }, [slot ? slot({
          message
        }) : message]);
      }
    };
    const renderLabel = () => {
      const labelWidth = getProp("labelWidth");
      const labelAlign = getProp("labelAlign");
      const colon = getProp("colon") ? ":" : "";
      if (slots.label) {
        return [slots.label(), colon];
      }
      if (props.label) {
        return createVNode("label", {
          "id": `${id}-label`,
          "for": slots.input ? void 0 : getInputId(),
          "data-allow-mismatch": "attribute",
          "onClick": (event) => {
            preventDefault(event);
            focus();
          },
          "style": labelAlign === "top" && labelWidth ? {
            width: addUnit(labelWidth)
          } : void 0
        }, [props.label + colon]);
      }
    };
    const renderFieldBody = () => [createVNode("div", {
      "class": bem$1("body")
    }, [renderInput(), showClear.value && createVNode(Icon, {
      "ref": clearIconRef,
      "name": props.clearIcon,
      "class": bem$1("clear")
    }, null), renderRightIcon(), slots.button && createVNode("div", {
      "class": bem$1("button")
    }, [slots.button()])]), renderWordLimit(), renderMessage()];
    useExpose({
      blur,
      focus,
      validate,
      formValue,
      resetValidation,
      getValidationStatus
    });
    provide(CUSTOM_FIELD_INJECTION_KEY, {
      customValue,
      resetValidation,
      validateWithTrigger
    });
    watch(() => props.modelValue, () => {
      updateValue(getModelValue());
      resetValidation();
      validateWithTrigger("onChange");
      nextTick(adjustTextareaSize);
    });
    useEventListener("touchstart", onClear, {
      target: computed(() => {
        var _a;
        return (_a = clearIconRef.value) == null ? void 0 : _a.$el;
      })
    });
    return () => {
      const disabled = getProp("disabled");
      const labelAlign = getProp("labelAlign");
      const LeftIcon = renderLeftIcon();
      const renderTitle = () => {
        const Label = renderLabel();
        if (labelAlign === "top") {
          return [LeftIcon, Label].filter(Boolean);
        }
        return Label || [];
      };
      return createVNode(Cell, {
        "size": props.size,
        "class": bem$1({
          error: showError.value,
          disabled,
          [`label-${labelAlign}`]: labelAlign
        }),
        "center": props.center,
        "border": props.border,
        "isLink": props.isLink,
        "clickable": props.clickable,
        "titleStyle": labelStyle.value,
        "valueClass": bem$1("value"),
        "titleClass": [bem$1("label", [labelAlign, {
          required: showRequiredMark.value
        }]), props.labelClass],
        "arrowDirection": props.arrowDirection
      }, {
        icon: LeftIcon && labelAlign !== "top" ? () => LeftIcon : null,
        title: renderTitle,
        value: renderFieldBody,
        extra: slots.extra
      });
    };
  }
});
const [name, bem] = createNamespace("cell-group");
const cellGroupProps = {
  title: String,
  inset: Boolean,
  border: truthProp
};
var stdin_default = defineComponent({
  name,
  inheritAttrs: false,
  props: cellGroupProps,
  setup(props, {
    slots,
    attrs
  }) {
    const renderGroup = () => {
      var _a;
      return createVNode("div", mergeProps({
        "class": [bem({
          inset: props.inset
        }), {
          [BORDER_TOP_BOTTOM]: props.border && !props.inset
        }]
      }, attrs, useScopeId()), [(_a = slots.default) == null ? void 0 : _a.call(slots)]);
    };
    const renderTitle = () => createVNode("div", {
      "class": bem("title", {
        inset: props.inset
      })
    }, [slots.title ? slots.title() : props.title]);
    return () => {
      if (props.title || slots.title) {
        return createVNode(Fragment, null, [renderTitle(), renderGroup()]);
      }
      return renderGroup();
    };
  }
});
export {
  stdin_default as a,
  stdin_default$1 as b,
  stdin_default$2 as s
};
//# sourceMappingURL=index-CRnLP5qR.js.map
