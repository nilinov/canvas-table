"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BodyCell = void 0;

var _Text = _interopRequireDefault(require("../component/Text"));

var _utils = require("../utils/utils");

var _Layer = _interopRequireDefault(require("../component/Layer"));

class BodyCell extends _Text.default {
  constructor(props) {
    super(props);
    this.props = props;
    this.customRendered = null;
    this.style.backgroundColor = 'white';
    this.on('onClick', () => {
      if (!(this.customRendered instanceof _Layer.default)) {
        this.showSelection();
      }
    });
    this.on('onMouseEnter', () => {
      if (this.textEllipsis.length !== this.text.length && this.textEllipsis !== this.text) {
        this.table.tooltip.show(this.text, this);
      }
    });
    this.on('onMouseLeave', () => {
      this.table.tooltip.hide();
    });
  }

  showSelection() {
    const selectionCell = this.table.selectionCell; // const {padding} = this.table.style;

    selectionCell.classList.remove('show');
    setTimeout(() => {
      selectionCell.value = this.text;
      selectionCell.style.top = `${this.top + this.table.scroller.top + 1}px`;
      selectionCell.style.left = `${this.left + this.table.scroller.left}px`; // let width = this.ctx.measureText(this.text).width + padding * 2 + 2;
      // if (this.left + width > this.table.width || width < this.width) {
      //   width = this.width
      // }

      selectionCell.style.width = `${this.width}px`;
      selectionCell.classList.add('show');
      selectionCell.select();
    }, 10);
  }

  update() {
    this._textEllipsis = '';
    this.customRendered = null;
    this.children = [];
  }

  get top() {
    return this.row.top;
  }

  get left() {
    return this.column.left;
  }

  get width() {
    return this.column.width;
  }

  get column() {
    return this.props.column;
  }

  get height() {
    return this.row.height;
  }

  get align() {
    return this.column.align;
  }

  get row() {
    return this.props.row;
  }

  get table() {
    return this.column.table;
  }

  get isRender() {
    return this.column.isRender && this.row.isRender;
  }

  get fixed() {
    return this.column.fixed;
  }

  get text() {
    return (0, _utils.toBlank)(typeof this.customRendered === 'string' ? this.customRendered : this.data);
  }

  get name() {
    return this.column.name;
  }

  get data() {
    return this.row.data && this.row.data[this.name];
  }

  get zIndex() {
    return this.fixed === 'left' || this.fixed === 'right' ? 1 : 0;
  }

  trigger(type, event) {
    super.trigger(type, event);

    if ((0, _utils.isFunction)(this.column.onCell)) {
      let collection = this.column.onCell(this.row.data, this.column.index);

      if (collection) {
        const handler = collection[type];

        if ((0, _utils.isFunction)(handler)) {
          handler(event);
        }
      }
    }
  }

  render() {
    if ((0, _utils.isFunction)(this.column.customRender)) {
      if ((0, _utils.isEmpty)(this.children)) {
        this.customRendered = this.column.customRender(this.data, this.row.data);

        if (this.customRendered instanceof _Layer.default) {
          this.customRendered.parent = this;
          this.children = [this.customRendered];
        }
      }

      if (typeof this.customRendered === 'string') {
        super.render();
      }
    } else {
      super.render();
    }
  }

}

exports.BodyCell = BodyCell;