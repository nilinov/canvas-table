"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Layer = _interopRequireDefault(require("./Layer"));

var _draw = require("../utils/draw");

var _utils = require("../utils/utils");

class LayerText extends _Layer.default {
  constructor(props) {
    super(props);
    this.props = props;
    this._textEllipsis = '';
  }

  get text() {
    return (0, _utils.toBlank)(this.props.text);
  }

  get textEllipsis() {
    if (!this._textEllipsis) {
      this._textEllipsis = (0, _draw.text2Ellipsis)(this.ctx, this.text, this.innerWidth);
    }

    return this._textEllipsis;
  }

  render(text = this.textEllipsis) {
    this.drawText(text);
  }

}

exports.default = LayerText;