"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Layer = _interopRequireDefault(require("./Layer"));

class LayerButton extends _Layer.default {
  constructor(props) {
    super(props);
    this.props = props;
    this.props = { ...LayerButton.defaultProps,
      ...(this.props || {})
    };
    this.style.padding = [0, 8, 0, 8];
  }

  roundRect() {
    const w = this.width;
    const h = this.height;
    const x = this.left;
    const y = this.top;
    let r = 5;

    if (w < 2 * r) {
      r = w / 2;
    }

    if (h < 2 * r) {
      r = h / 2;
    }

    this.ctx.beginPath();
    this.ctx.moveTo(x + r, y);
    this.ctx.arcTo(x + w, y, x + w, y + h, r);
    this.ctx.arcTo(x + w, y + h, x, y + h, r);
    this.ctx.arcTo(x, y + h, x, y, r);
    this.ctx.arcTo(x, y, x + w, y, r);
    this.ctx.closePath();
  }

  iconRender() {
    const {
      iconSize,
      icon
    } = this.props;
    this.ctx.save();
    this.ctx.font = `${iconSize ? iconSize : '1em'} iconfont`;
    const hex = '0' + icon.slice(2, -1);
    this.drawText(String.fromCharCode(parseInt(hex)));
    this.ctx.restore();
  }

  render() {
    const {
      type,
      icon
    } = this.props;

    if (type === 'default') {
      this.roundRect();
      this.ctx.stroke();
    }

    if (icon) {
      this.iconRender();
    } // drawSvg(this.ctx, this.iconSvg, this.left + this.padding.left, this.top + this.padding.top);

  }

}

exports.default = LayerButton;
LayerButton.defaultProps = {
  type: 'default'
};