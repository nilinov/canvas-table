"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HeaderTree = void 0;

var _Component = require("../component/Component");

var _HeaderTreeNode = _interopRequireDefault(require("./HeaderTreeNode"));

var _utils = require("../utils/utils");

var _tree = require("../utils/tree");

var _Column = require("./Column");

var _draw = require("../utils/draw");

class HeaderTree extends _Component.Component {
  constructor(props) {
    super();
    this.props = props; // 列配置的叶子节点是控制列的关键(除了锁列属性之外), 所以这四条属性都是叶子节点对应的列

    this.columns = [];
    this.leftColumns = [];
    this.rightColumns = [];
    this.notFixedColumns = [];
    this.deep = 1; // 深度

    this.rootCells = []; // 第一层的cells

    this.leafCells = []; // 叶子层的cells

    this.top = 0;
    const columnsProps = columnsPropsRearrange(props.colProps);
    this.columnsInit(columnsProps);
    this.cellNodesInit(columnsProps);
  }
  /*
   * 列处理规则:
   * 1. title属性每层都生效
   * 2. fixed字段只能在第一层设置, 子节点会自动继承
   * 3. align都可以设置, 没设置会继承父节点
   * 4. 其他所有属性只有在叶子节点设置才会生效
   */


  columnsInit({
    fixedLeft,
    notFixed,
    fixedRight
  }) {
    // 初始化列
    let colIndex = 0;
    const propsArr = [fixedLeft, notFixed, fixedRight];
    const colArr = [this.leftColumns, this.notFixedColumns, this.rightColumns]; // 所有表头单元格继承第一层的fixed属性

    [...fixedLeft, ...fixedRight, ...notFixed].forEach(rootCol => {
      (0, _tree.treeEach)(rootCol, colProps => {
        colProps.fixed = rootCol.fixed;
      });
    });
    propsArr.forEach((colProps, i) => {
      (0, _tree.treeGetLeaf)(colProps).forEach(prop => {
        colArr[i].push(new _Column.Column({ ...prop,
          table: this.props.table,
          index: colIndex++
        }));
      });
    });
    this.columns = [...this.leftColumns, ...this.notFixedColumns, ...this.rightColumns];
  }

  cellNodesInit({
    fixedLeft,
    notFixed,
    fixedRight
  }) {
    const propsQueue = [...fixedLeft, ...notFixed, ...fixedRight];
    const PARENT_KEY = '__PARENT__';
    let node = null;
    const table = this.table;

    while (propsQueue[0]) {
      const currProps = propsQueue.shift();
      node = new _HeaderTreeNode.default({
        colProps: currProps,
        popTitle: currProps.popTitle,
        parent: currProps[PARENT_KEY],
        table: table,
        ctx: table.ctx,
        style: {
          padding: [0, table.style.padding]
        }
      });

      if ((0, _utils.isEmpty)(currProps[PARENT_KEY])) {
        this.rootCells.push(node);
      }

      delete currProps[PARENT_KEY];

      if (Array.isArray(currProps.children)) {
        propsQueue.push(...currProps.children.map(child => {
          return {
            [PARENT_KEY]: node,
            ...child
          };
        }));
      }
    }

    if (node) {
      this.deep = node.treeHeight;
    }

    this.leafCells = (0, _tree.treeGetLeaf)(this.rootCells, 'childrenCell');
  }

  get cells() {
    let cells = [];
    (0, _tree.treeBFEach)(this.rootCells, cell => cells.push(cell), 'childrenCell');
    return cells;
  }

  get width() {
    return this.table.width;
  }

  get height() {
    return this.deep * this.table.style.headerRowHeight;
  }

  get table() {
    return this.props.table;
  }

  render() {
    if ((0, _utils.isEmpty)(this.rootCells)) {
      return;
    }

    const ctx = this.table.ctx;
    (0, _draw.drawRect)(ctx, 0, 0, this.table.style.width, this.height, this.table.style.headerBackColor);
    (0, _draw.drawLine)(ctx, 0, this.height - 1, this.table.style.width, this.height - 1);
    const fixLeftCells = this.rootCells.filter(cell => cell.fixed === 'left');
    const fixRightCells = this.rootCells.filter(cell => cell.fixed === 'right');
    const notFixedCells = this.rootCells.filter(cell => cell.fixed !== 'left' && cell.fixed !== 'right');
    ctx.save();
    ctx.beginPath();
    let leftWidth = fixLeftCells.reduce((pre, curr) => pre + curr.width, 0);
    let centerWidth = notFixedCells.reduce((pre, curr) => pre + curr.width, 0); // let rightWidth = notFixedCells.reduce((pre, curr) => pre + curr.width, 0);

    ctx.rect(leftWidth, 0, centerWidth, this.height);
    ctx.clip();
    (0, _tree.treeBFEach)(notFixedCells, cell => cell.innerRender(), 'childrenCell');
    ctx.restore();
    (0, _tree.treeBFEach)(fixLeftCells, cell => cell.innerRender(), 'childrenCell');
    (0, _tree.treeBFEach)(fixRightCells, cell => cell.innerRender(), 'childrenCell');
  }

}

exports.HeaderTree = HeaderTree;

function columnsPropsRearrange(colProps) {
  // 根据锁列的配置整理列的顺序
  const fixedLeft = colProps.filter(col => col.fixed === 'left').map((col, i) => {
    return { ...col,
      fixedIndex: i
    };
  });
  const fixedRight = colProps.filter(col => col.fixed === 'right').map((col, i) => {
    return { ...col,
      fixedIndex: i
    };
  });
  const notFixed = colProps.filter(col => !['left', 'right'].includes(col.fixed));
  return {
    fixedLeft,
    notFixed,
    fixedRight
  };
}