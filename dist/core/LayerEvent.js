"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LayerEvent = void 0;

class LayerEvent {
  constructor(props = {}) {
    this.target = null;
    this._isPropagationStopped = false;
    this.clientX = props.clientX;
    this.clientY = props.clientY;
    this.path = props.path || [];
    this.target = this.path[0] || null;
    this.type = props.type;
  }

  get isPropagationStopped() {
    return this._isPropagationStopped;
  }

  stopPropagation() {
    this._isPropagationStopped = true;
  }

  copy(changes = {}) {
    const {
      clientX,
      clientY,
      path,
      type
    } = this;
    return new LayerEvent({
      clientX,
      clientY,
      path: [...(path || [])],
      type,
      ...changes
    });
  }

}

exports.LayerEvent = LayerEvent;