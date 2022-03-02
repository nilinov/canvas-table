"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = void 0;

class Component {
  destroy() {
    Object.getOwnPropertyNames(this).forEach(key => {
      this[key] = null;
    });
  }

}

exports.Component = Component;