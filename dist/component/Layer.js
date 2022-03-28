"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Component = require("./Component");

var _utils = require("../utils/utils");

var _tree = require("../utils/tree");

var _draw = require("../utils/draw");

class Layer extends _Component.Component {
  constructor(props) {
    super();
    this.props = props;
    this._ctx = null;
    this.parent = null;
    this.children = [];
    this.style = {};
    this.eventHandlers = {};
    this._ctx = props.ctx;
    this.styleInit();
    this.children = [...(props.children || [])];
    this.children.forEach(child => {
      child.parent = this;
    });

    if ((0, _utils.isNotEmpty)(props.event)) {
      for (const key in props.event) {
        this.on(key, props.event[key]);
      }
    }

    if (props.popTitle) {
      this.on('onMouseEnter', () => {
        this.table.tooltip.show(props.popTitle, this);
      });
      this.on('onMouseLeave', () => {
        this.table.tooltip.hide();
      });
    }

    if (!props.disabled && props.event) {
      this.on('onMouseEnter', () => {// this.ctx.canvas.parentElement.style.cursor = 'pointer';
      });
      this.on('onMouseLeave', () => {// this.ctx.canvas.parentElement.style.cursor = 'auto';
      });
    }
  }

  get ctx() {
    return (0, _tree.treeInherit)(this, '_ctx');
  }

  get table() {
    const cell = (0, _tree.treeBackFind)(this, layer => !layer.parent);
    return cell.table;
  }

  styleInit() {
    let {
      padding,
      border,
      ...style
    } = { ...Layer.defaultStyle,
      ...(this.props.style || {})
    };

    if ((0, _utils.isNotEmpty)(padding)) {
      this.style.padding = _utils.cssParser.multiValue(padding);
    } else {
      this.style.padding = [0, 0, 0, 0];
    }

    if ((0, _utils.isNotEmpty)(border)) {
      this.style.border = _utils.cssParser.multiValue(border).map(b => _utils.cssParser.border(b));
    }

    this.style = { ...this.style,
      ...style
    }; // this.style.top =
    // this.style.
  }

  get isRender() {
    const vertical = !(this.left + this.width < 0 || this.left > this.ctx.canvas.width);
    const horizontal = !(this.top + this.height < 0 || this.top > this.ctx.canvas.height);
    return vertical && horizontal;
  }

  get sibings() {
    return this.parent ? this.parent.children || [] : [];
  }

  get left() {
    const parent = this.parent;
    const parentLeft = (parent ? parent.left + parent.padding.left : 0) + this.style.left;
    let preSiblingsLeft = 0;

    for (let pre of this.sibings) {
      if (pre === this) {
        break;
      }

      preSiblingsLeft += pre.width + (parent.props.gutter || 0);
    }

    return parentLeft + preSiblingsLeft + this.style.left;
  }

  get top() {
    const parent = this.parent;
    let verticalTop = 0;

    if (parent) {
      switch (this.style.verticalAlign) {
        case 'bottom':
          verticalTop = parent.height - this.height;
          break;

        case 'middle':
          verticalTop = (parent.height - this.height) / 2;
      }
    }

    const parentTop = parent ? parent.top + parent.padding.top : 0; // console.log(parentTop, verticalTop, this.style.top )

    return parentTop + verticalTop + this.style.top + this.style.top;
  }

  get innerWidth() {
    return this.width - this.padding.right - this.padding.left;
  }

  get width() {
    const parentInnerWidth = this.parent ? this.parent.innerWidth : 0;
    return (0, _utils.percentCalc)(this.style.width, () => this.parent ? parentInnerWidth : 0);
  }

  get innerHeight() {
    return this.height - this.padding.top - this.padding.bottom;
  }

  get height() {
    const parentInnerHeight = this.parent ? this.parent.innerHeight : 0;
    return (0, _utils.percentCalc)(this.style.height, () => this.parent ? parentInnerHeight : 0);
  } // set padding () {
  //   this.style.padding = cssParser.multiValue(this.style.padding);
  // }


  get padding() {
    const [top, right, bottom, left] = this.style.padding;
    return {
      top,
      right,
      bottom,
      left
    };
  }

  get border() {
    const [top, right, bottom, left] = this.style.padding;
    return {
      top,
      right,
      bottom,
      left
    };
  }

  get align() {
    return this.style.align;
  }

  get zIndex() {
    return this.style.zIndex;
  }

  clear() {
    const {
      left,
      top,
      height,
      width
    } = this;
    this.ctx.clearRect(left, top, width, height);
  }

  childrenRender() {
    const children = [...(this.children || [])];

    if ((0, _utils.isEmpty)(children)) {
      return;
    }

    children.sort((a, b) => a.zIndex - b.zIndex).forEach(child => {
      child.innerRender();
    });
  }

  baseRender() {
    const {
      backgroundColor,
      border
    } = this.style;
    const {
      left,
      top,
      width,
      height
    } = this;

    if (backgroundColor) {
      (0, _draw.drawRect)(this.ctx, left, top + 1, width, height - 1, backgroundColor);
    }

    if ((0, _utils.isNotEmptyArray)(border)) {
      const [topB, rightB, bottomB, leftB] = border;

      if (topB) {
        (0, _draw.drawLine)(this.ctx, left, top, left + width, top, topB.color);
      }

      if (rightB) {
        (0, _draw.drawLine)(this.ctx, left + width, top, left + width, top + height, rightB.color);
      }

      if (bottomB) {
        (0, _draw.drawLine)(this.ctx, left, top + height, left + width, top + height, bottomB.color);
      }

      if (leftB) {
        (0, _draw.drawLine)(this.ctx, left, top, left, top + height, leftB.color);
      }
    }

    if (this.props.fill instanceof Function) {
      (0, _draw.drawRect)(this.ctx, left + 1, top + 1, width - 1, height - 1, this.props.fill());
    } else if (this.props.fill) {
      (0, _draw.drawRect)(this.ctx, left + 1, top + 1, width - 1, height - 1, this.props.fill);
    }

    if (this.props.validate) {
      (0, _draw.drawLine)(this.ctx, left, top, left + width, top, this.props.validate);
      (0, _draw.drawLine)(this.ctx, left + width - 1, top, left + width - 1, top + height, this.props.validate);
      (0, _draw.drawLine)(this.ctx, left, top + height - 1, left + width, top + height - 1, this.props.validate);
      (0, _draw.drawLine)(this.ctx, left, top, left, top + height, this.props.validate);
    }
  }

  render() {}

  innerRender() {
    if (this.isRender) {
      // this.clear();
      this.baseRender();
      this.render();
      this.childrenRender();
    }
  }

  drawText(str) {
    let ctx = this.ctx;
    let {
      left,
      top,
      height,
      width
    } = this;
    let x = 0;
    let y = top + height / 2;
    ctx.save();

    switch (this.align) {
      case "center":
        x = left + width / 2;
        ctx.textAlign = 'center';
        break;

      case "right":
        x = left + width - this.padding.right;
        ctx.textAlign = 'right';
        break;

      case "left":
      default:
        x = left + this.padding.left;
        ctx.textAlign = 'left';
    }

    if (this.style.color) {
      ctx.fillStyle = this.style.color;
    }

    const fontSize = this.style.fontSize || this.table.style.fontSize;
    const fontFamily = this.style.fontFamily || this.table.style.fontFamily;
    const fontWeight = this.style.fontWeight || 'normal';
    ctx.font = [fontWeight, fontSize, fontFamily].join(' '); // console.log(left, this.column.width, top , this.row.height)

    ctx.fillText(str, x, y + this.padding.top);
    ctx.restore();
  }

  on(name, handler) {
    if (!this.eventHandlers[name]) {
      this.eventHandlers[name] = [];
    }

    this.eventHandlers[name].push(handler);
  }

  off(name, handler) {
    const handlers = this.eventHandlers[name];

    if (handlers) {
      if (typeof handler === 'function') {
        const delIndex = handlers.indexOf(handler);

        if (~delIndex) {
          handlers.splice(delIndex, 1);
        }
      } else {
        delete this.eventHandlers[name];
      }
    }
  }

  trigger(type, event) {
    if (this.props.disabled) {
      return;
    }

    const handlers = this.eventHandlers[type];
    handlers && handlers.forEach(handler => {
      typeof handler === 'function' && handler(event);
    });
  }

}

exports.default = Layer;
Layer.defaultStyle = {
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  padding: 0,
  // color:
  // font: string
  // fontSize: number
  zIndex: 0,
  align: 'left',
  overflow: 'ellipsis',
  verticalAlign: 'middle'
};