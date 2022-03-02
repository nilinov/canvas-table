"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tree = require("../utils/tree");

var _utils = require("../utils/utils");

var _Text = _interopRequireDefault(require("../component/Text"));

var _Layer = _interopRequireDefault(require("../component/Layer"));

var _draw = require("../utils/draw");

class HeaderTreeNode extends _Text.default {
  constructor(props) {
    super(props);
    this.props = props;
    this.parentCell = null;
    this.childrenCell = [];
    this._width = null;
    this._height = null;
    this._left = null;
    this._top = null;
    this.customRendered = null;
    this.style.backgroundColor = this.table.style.headerBackColor;
    this.style.fontWeight = 'bold';
    this.parentCell = props.parent; // 把自身添加到父元素的children中

    if (this.parentCell) {
      this.parentCell.childrenCell.push(this);
    }
  }

  get table() {
    return this.props.table;
  }

  get header() {
    return this.table.header;
  }

  get fixed() {
    return this.props.colProps.fixed;
  }

  get width() {
    if (this._width === null) {
      this._width = (0, _tree.treeGetLeaf)(this, 'childrenCell').reduce((pre, curr) => pre + (curr.props.colProps.width || this.table.style.columnWidth), 0);
    }

    return this._width;
  }

  get height() {
    if (this._height === null) {
      if ((0, _utils.isEmpty)(this.childrenCell)) {
        let space = this.table.header.deep - (this.treeHeight - 1 + (0, _tree.treeGetDeep)(this.props.colProps) - 1);
        this._height = space * this.table.style.headerRowHeight;
      } else {
        this._height = this.table.style.headerRowHeight;
      }
    }

    return this._height;
  }

  get left() {
    if (this._left === null) {
      let left = 0;
      const siblings = this.siblings;

      if ((0, _utils.isEmpty)(this.parentCell)) {
        switch (this.fixed) {
          case 'left':
            for (let i = 0, cell = null; i < siblings.length; i++) {
              cell = siblings[i];

              if (cell.fixed !== 'left') {
                break;
              }

              if (cell === this) {
                break;
              }

              left += cell.width;
            }

            break;

          case 'right':
            for (let i = siblings.length - 1, cell = null; i >= 0; i--) {
              cell = siblings[i];

              if (cell.fixed !== 'right') {
                break;
              }

              left += cell.width;

              if (cell === this) {
                break;
              }
            }

            left = this.table.style.width - left;
            break;

          default:
            for (let i = 0, cell = null; i < siblings.length; i++) {
              cell = siblings[i];

              if (cell === this) {
                break;
              }

              left += cell.width;
            }

        }
      } else {
        for (let i = 0, cell = null; i < siblings.length; i++) {
          cell = siblings[i];

          if (cell === this) {
            break;
          }

          left += cell.width;
        }

        left += this.parentCell.left;
      }

      this._left = left;
    }

    if (this.fixed !== 'left' && this.fixed !== 'right') {
      return this._left - this.table.scroller.left;
    }

    return this._left;
  }

  get top() {
    if (this._top === null) {
      this._top = (this.treeHeight - 1) * this.table.style.headerRowHeight - 1;
    }

    return this._top;
  } // get isRender() {
  //   let vertical = !(this.left + this.width < 0 || this.left > this.table.style.width);
  //   let horizontal = !(this.top + this.height < 0 || this.top > this.table.style.height);
  //   return vertical && horizontal
  // }


  get align() {
    return this.props.colProps.align || ((0, _utils.isEmpty)(this.props.colProps.children) ? 'left' : 'center');
  }

  get text() {
    return this.props.colProps.title + '';
  } // 获取树的高度


  get treeHeight() {
    // 获取当前节点深度
    let height = 0;
    let current = this;

    while (current) {
      height++; // 防止死循环

      if (height > 10000) {
        return 10000;
      }

      current = current.parentCell;
    }

    return height;
  }

  get siblings() {
    if (this.parentCell) {
      return [...this.parentCell.childrenCell];
    } else {
      return [...this.header.rootCells];
    }
  }

  borderRect() {
    const {
      left,
      top,
      width,
      height
    } = this; // border-bottom

    const borderTop = top + height;
    (0, _draw.drawLine)(this.ctx, left, borderTop, left + width, borderTop); // border-right

    if (this.header.deep > 1) {
      (0, _draw.drawLine)(this.ctx, left + width - 1, top - 1, left + width - 1, top + height - 1);
    }
  }

  get zIndex() {
    return this.fixed === 'left' || this.fixed === 'right' ? 1 : 0;
  }

  render() {
    if (!this.isRender) {
      return;
    }

    this.borderRect();

    if (typeof this.props.colProps.title === 'function') {
      if (this.customRendered === null) {
        this.customRendered = this.props.colProps.title();

        if (this.customRendered instanceof _Layer.default) {
          this.customRendered.parent = this;
          this.children = [this.customRendered];
        }
      }

      if (typeof this.customRendered === 'string') {
        super.render(this.customRendered);
      }
    } else {
      super.render();
    }
  }

}

var _default = HeaderTreeNode;
exports.default = _default;