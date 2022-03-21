"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _h = _interopRequireDefault(require("../utils/h"));

/** @jsx h */
class Tooltip {
  constructor() {
    this.wrapper = null;
    this.domInit();
  }

  show(text, layer) {
    this.wrapper.style.display = 'inline-block';
    this.wrapper.innerHTML = text;
    const clientRect = layer.table.wrapper.getBoundingClientRect();
    const top = layer.top + clientRect.top;
    const left = layer.left + clientRect.left + layer.width / 2;
    this.wrapper.style.top = top + 'px';
    this.wrapper.style.left = left + 'px';
  }

  hide() {
    this.wrapper.style.display = 'none';
  }

  domInit() {
    return (0, _h.default)("div", {
      ref: ref => {
        this.wrapper = ref;
      },
      className: 'x-tooltip'
    });
  }

}

var _default = Tooltip;
exports.default = _default;