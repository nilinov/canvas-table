"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _style = require("../style/style");

var _Body = require("../table/Body");

var _Scroller = _interopRequireWildcard(require("./Scroller"));

var _utils = require("../utils/utils");

var _h = _interopRequireDefault(require("../utils/h"));

var _HeaderTree = require("../table/HeaderTree");

var _TableEvent = require("./TableEvent");

var _Button = _interopRequireDefault(require("../component/Button"));

var _Layer = _interopRequireDefault(require("../component/Layer"));

var _Text = _interopRequireDefault(require("../component/Text"));

var _Svg = _interopRequireDefault(require("../component/Svg"));

var _Tooltip = _interopRequireDefault(require("./Tooltip"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/** @jsx h */
const WRAPPER_PADDING = 0;

class CanvasTable {
  constructor(props) {
    this.props = props;
    this.style = null;
    this.outerHeight = 0;
    this.outerWidth = 0;
    this.ctx = null;
    this.event = null;
    this.tooltip = null;
    this.onWindowResizeHandler = (0, _utils.debounce)(() => {
      this.resize();
    }, 300);
    this._source = [];
    this.height = 0; // 表格数据高度

    this.width = 0; // 表格数据宽度

    this.dataHeight = 0; // 表格数据真实高度

    this.dataWidth = 0; // 表格数据真实宽度

    this.isFirstRender = true; // scrollPosition = {scrollLeft: 0, scrollTop: 0};
    // onScrollHandler = (left: number, top: number, direction: string) => {
    //   this.render();
    //   if (direction === 'up' && top === 0) {
    //     isFunction(this.props.onScrollTop) && this.props.onScrollTop()
    //   }
    //
    //   let {scrollHeight, scrollTop, scrollLeft, clientHeight} = this.scroller.scrollRef.current;
    //   if (direction === 'down' && scrollHeight - scrollTop === clientHeight) {
    //     isFunction(this.props.onScrollBottom) && this.props.onScrollBottom()
    //   }
    //
    //   this.scrollPosition = {scrollLeft, scrollTop};
    //   this.selectionCell.classList.remove('show')
    // };

    this.isScrollLoading = false;
    this.scrollMask = (0, _h.default)("div", {
      className: 'x-canvas-table-mask'
    });
    this.scrollPosition = {
      scrollLeft: 0,
      scrollTop: 0
    };

    this.onScrollHandler = (left, top, direction) => {
      this.render();

      if (direction === 'up' && top === 0) {
        (0, _utils.isFunction)(this.props.onScrollTop) && this.props.onScrollTop();
      }

      const {
        scrollHeight,
        scrollTop,
        scrollLeft,
        clientHeight
      } = this.scroller.scrollRef.current;
      const triggerHeight = this.props.scrollLoadHeight || 150;

      if (direction === 'down' && scrollHeight - scrollTop - triggerHeight <= clientHeight) {
        if (!this.isScrollLoading && (0, _utils.isFunction)(this.props.onScrollLoad)) {
          const start = () => {
            const scrollEl = this.wrapper;
            scrollEl.appendChild(this.scrollMask);
            this.isScrollLoading = true;
          };

          const end = () => {
            const scrollEl = this.wrapper;

            if (scrollEl.isSameNode(this.scrollMask.parentElement)) {
              scrollEl.removeChild(this.scrollMask);
            }

            this.isScrollLoading = false;
          };

          start();
          const promise = this.props.onScrollLoad();

          if (promise && promise.then) {
            promise.then(() => {
              end();
            }).catch(() => {
              end();
            });
          } else {
            end();
          }
        }
      } // if (direction === 'down' && scrollHeight - scrollTop === clientHeight) {
      //   isFunction(this.props.onScrollBottom) && this.props.onScrollBottom()
      // }


      this.scrollPosition = {
        scrollLeft,
        scrollTop
      };
      this.selectionCell && this.selectionCell.classList.remove('show');
      this.tooltip && this.tooltip.hide();
    };

    this._wrapper = null;
    this.init();
  }

  init(isFirstTime = true) {
    const {
      container,
      style
    } = this.props;
    this.styleCalc();
    this.domInit();

    if (isFirstTime) {
      this.event = new _TableEvent.CanvasTableEvent({
        table: this
      });

      if (container) {
        container.appendChild(this.wrapper);
      }
    }

    this.ctxInit();
    this.componentsInit();

    if (isFirstTime) {
      if (typeof style.height === 'string' || typeof style.width === 'string') {
        window.addEventListener('resize', this.onWindowResizeHandler);
      }
    }
  }

  styleCalc() {
    this.props.style = { ..._style.DEFAULT_STYLE,
      ...(this.props.style || {})
    };
    const {
      height,
      width,
      ...style
    } = this.props.style;
    this.style = style;
    this.outerWidth = (0, _utils.percentCalc)(width, () => this.props.container.clientWidth);
    this.outerHeight = (0, _utils.percentCalc)(height, () => this.props.container.clientHeight);
    this.style.width = this.outerWidth - _Scroller.SCROLLBAR_WIDTH - WRAPPER_PADDING * 2;
    this.style.height = this.outerHeight - _Scroller.SCROLLBAR_WIDTH - WRAPPER_PADDING * 2;
  }

  ctxInit() {
    this.ctx = this.canvas.getContext('2d', {
      alpha: false
    });
    this.ctx.setTransform(_style.PIXEL_RATIO, 0, 0, _style.PIXEL_RATIO, 0, 0);
    this.ctx.fillStyle = this.style.textColor;
    this.ctx.font = this.style.fontSize + ' ' + this.style.fontFamily;
    this.ctx.textBaseline = 'middle';
    this.ctx.strokeStyle = this.style.borderColor;
  }

  componentsInit() {
    this.header = new _HeaderTree.HeaderTree({
      colProps: this.props.columns,
      table: this
    });
    this.body = new _Body.BodySection({
      table: this
    });
  }

  set source(data) {
    const newSource = (0, _utils.isNotEmptyArray)(data) ? [...data] : [];
    this.body.rows = this.body.diff(newSource); // const newLength = newSource.length;
    // const oldLength = this.source.length;
    // for (let i = 0; i < newLength; i ++) {
    //   const newData = newSource[i];
    //   const oldData = this.source[i];
    //   // diff
    //   if (newData && !oldData) { // 新增
    //     this.body.rows.push(
    //       new BodyRow({
    //         ctx: this.ctx,
    //         table: this,
    //         index: i,
    //         onRow: this.props.onRow
    //       })
    //     )
    //   } else if (oldData && newData) { // 更新
    //     this.body.rows[i].update()
    //   }
    // }
    // // 删除
    // if (oldLength > newLength) {
    //   this.body.rows.splice(newLength, oldLength - newLength);
    // }

    this._source = [...newSource];
    this.sizeCalc();
    this.scroller.update(this.width, this.height, this.dataWidth, this.dataHeight);
    this.render(); // this.body.rows
  }

  get source() {
    return this._source;
  }

  sizeCalc() {
    this.dataHeight = this.header.height + this.source.length * this.style.rowHeight;
    this.dataWidth = this.header.columns.reduce((pre, col) => pre + col.width, 0);
    this.height = Math.max(this.style.height, this.dataHeight);
    this.width = Math.max(this.style.width, this.dataWidth);
  }

  render() {
    this.ctx.clearRect(0, 0, this.style.width, this.style.height);
    this.body.render();
    this.header.render();

    if (this.isFirstRender) {
      this.isFirstRender = false;
      setTimeout(() => {
        this.render();
      }, 30);
    }
  }

  resize() {
    // this.iconFont && this.iconFont.destroy();
    this.init(false);
    this.sizeCalc();
    this.scroller && this.scroller.update(this.width, this.height, this.dataWidth, this.dataHeight);
    this.render();
    this.scroller && this.scroller.scrollTo(this.scrollPosition.scrollLeft, this.scrollPosition.scrollTop);
  }

  get wrapper() {
    if (this._wrapper === null) {
      this._wrapper = (0, _h.default)("div", {
        className: 'x-canvas-table',
        style: {
          padding: `${WRAPPER_PADDING}px`
        }
      });
    }

    return this._wrapper;
  }

  domInit() {
    this.wrapper.innerHTML = '';
    const {
      height,
      width,
      rowHeight,
      padding,
      fontFamily,
      fontSize,
      textColor
    } = this.style;
    const {
      outerHeight,
      outerWidth
    } = this;
    this.wrapper.style.width = `${outerWidth}px`;
    this.wrapper.style.height = `${outerHeight}px`;
    this.wrapper.appendChild((0, _h.default)("canvas", {
      width: width * _style.PIXEL_RATIO,
      height: height * _style.PIXEL_RATIO,
      style: {
        height: `${height}px`,
        width: `${width}px`
      },
      ref: ref => {
        this.canvas = ref;
      }
    }));
    const scroll = (0, _h.default)(_Scroller.default, {
      ref: ref => {
        this.scroller = ref;
      },
      fixedLeftWidth: () => this.header.leftColumns.reduce((pre, val) => pre + val.width, 0),
      fixedRightWidth: () => this.header.rightColumns.reduce((pre, val) => pre + val.width, 0),
      height: outerHeight,
      width: outerWidth,
      onScroll: this.onScrollHandler
    }, (0, _h.default)("input", {
      readOnly: true,
      ref: ref => {
        this.selectionCell = ref;
      },
      className: 'x-canvas-table-selection-cell',
      style: {
        height: `${rowHeight - 1}px`,
        lineHeight: `${rowHeight - 1}px`,
        padding: `0 ${padding}px`,
        fontSize: fontSize,
        fontFamily: fontFamily,
        color: textColor
      },
      onclick: e => {
        e.preventDefault();
        e.stopPropagation();
      },
      onblur: () => this.selectionCell.classList.remove('show')
    }));
    this.wrapper.appendChild(scroll.wrapper);
    this.tooltip = (0, _h.default)(_Tooltip.default, null);
    this.wrapper.appendChild(this.tooltip.wrapper);
  }

  destroy() {
    window.removeEventListener('resize', this.onWindowResizeHandler);
  }

}

CanvasTable.Button = _Button.default;
CanvasTable.Layer = _Layer.default;
CanvasTable.Text = _Text.default;
CanvasTable.Svg = _Svg.default;
var _default = CanvasTable;
exports.default = _default;