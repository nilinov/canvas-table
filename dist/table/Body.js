"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BodySection = void 0;

var _Component = require("../component/Component");

var _BodyRow = require("./BodyRow");

var _utils = require("../utils/utils");

var _draw = require("../utils/draw");

class BodySection extends _Component.Component {
  constructor(props) {
    super();
    this.props = props;
    this.rows = [];
    this.init();
  }

  init() {
    this.table = this.props.table;
    this.top = this.table.header.height;
  }

  get width() {
    return this.table.style.width;
  }

  get height() {
    return (this.rows || []).reduce((pre, row) => pre + row.height, 0);
  }

  diff(newData) {
    if ((0, _utils.isEmpty)(newData)) {
      return [];
    } // const {rowKey} = this.table.props;
    // const keyObj:obj = {};
    // const keyRow:obj<BodyRow> = {};
    // const keySortArr = [];
    // const getKey = data => data.__key__ || data[rowKey];
    // if (isEmpty(getKey(newData[0]))) {


    return newData.map((data, i) => new _BodyRow.BodyRow({
      ctx: this.table.ctx,
      table: this.table,
      index: i
    })); // } else {
    //   newData.forEach(data => {
    //     keyObj[getKey(data)] = data;
    //     keySortArr.push(getKey(data))
    //   });
    //   this.rows.forEach(row => {
    //     keyRow[getKey(row.data)] = row
    //   });
    //   // 相同的直接替换
    //   Object.keys(keyObj).forEach(key => {
    //     if (keyRow && keyRow[key]) {
    //       keyObj[key] = keyRow[key]
    //     }
    //   });
    //   // 查找不同的行
    //   return keySortArr.map((key, i) => {
    //     const obj = keyObj[key];
    //     if (obj instanceof BodyRow) {
    //       obj.update();
    //       obj.index = i;
    //       return obj
    //     } else {
    //       const table = this.table;
    //       return new BodyRow({
    //         ctx: table.ctx,
    //         table: table,
    //         index: i
    //       })
    //     }
    //   });
    // }
  }

  render(start = 0, renderLen = this.table.source.length) {
    // const dataLen = this.source.length;
    // const rowLen = this.body.rows.length;
    // // 需要渲染的条数大于需要增加Row
    // if (renderLen > rowLen) {
    //
    // }
    if ((0, _utils.isEmpty)(this.rows)) {
      this.rows = Array.from({
        length: renderLen
      }).map((nul, i) => new _BodyRow.BodyRow({
        table: this.table,
        index: start + i
      }));
    }

    if ((0, _utils.isEmpty)(this.rows)) {
      const headerHeight = this.table.header.height;
      const bodyHeight = this.table.style.height - headerHeight;
      const bodyWidth = this.table.style.width;
      (0, _draw.noData)(this.table.ctx, 0, headerHeight, bodyWidth, bodyHeight);
    } else {
      this.rows.forEach(row => row.innerRender());
    }
  }

  clear() {
    this.rows.forEach(row => row.destroy());
    this.rows = [];
  }

}

exports.BodySection = BodySection;