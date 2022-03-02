"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CanvasTableEvent = void 0;

var _utils = require("../utils/utils");

var _LayerEvent = require("./LayerEvent");

class CanvasTableEvent {
  constructor(props) {
    this.props = props;
    this.eventX = 0;
    this.eventY = 0;

    this.eventHandler = (type, event) => {
      const {
        left,
        top
      } = this.table.wrapper.getBoundingClientRect();
      this.eventX = event.clientX - left;
      this.eventY = event.clientY - top; //y position within the element.
      // debugger

      const layEvt = this.eventGenerate(type);

      for (let layer of layEvt.path) {
        if (!layEvt.isPropagationStopped) {
          layer.trigger(type, layEvt);
        }
      }
    };

    this.lastMoveEvent = null;

    this.moveEventHandler = event => {
      const {
        left,
        top
      } = this.table.wrapper.getBoundingClientRect();
      this.eventX = event.clientX - left;
      this.eventY = event.clientY - top; //y position within the element.
      // debugger

      const currEvt = this.eventGenerate('onMouseEnter');
      const lastEvt = this.lastMoveEvent ? this.lastMoveEvent.copy({
        type: 'onMouseLeave'
      }) : null;
      const currRevPath = currEvt && currEvt.path ? [...currEvt.path].reverse() : [];
      const lastRevPath = lastEvt && lastEvt.path ? [...lastEvt.path].reverse() : [];
      const length = Math.max(currRevPath.length, lastRevPath.length);

      for (let i = 0; i < length; i++) {
        const last = lastRevPath[i];
        const curr = currRevPath[i];

        if (last !== curr) {
          if (lastEvt && !lastEvt.isPropagationStopped) {
            last && last.trigger(lastEvt.type, lastEvt);
          }

          if (!currEvt.isPropagationStopped) {
            curr && curr.trigger(currEvt.type, currEvt);
          }
        }
      }

      this.lastMoveEvent = currEvt;
    };

    this.onMouseLeave = event => {
      const lastEvt = this.lastMoveEvent ? this.lastMoveEvent.copy({
        type: 'onMouseLeave'
      }) : null;

      if ((0, _utils.isEmpty)(lastEvt)) {
        return;
      }

      for (let layer of lastEvt.path) {
        if (!lastEvt.isPropagationStopped) {
          layer.trigger(lastEvt.type, lastEvt);
        }
      }

      this.lastMoveEvent = null;
    };

    this.init();
  }

  init() {
    const wrapper = this.table.wrapper;
    wrapper.addEventListener('click', e => this.eventHandler('onClick', e));
    wrapper.addEventListener('dblclick', e => this.eventHandler('onDoubleClick', e));
    wrapper.addEventListener('contextmenu', e => this.eventHandler('onContextMenu', e));
    wrapper.addEventListener('mousemove', e => this.moveEventHandler(e));
    wrapper.addEventListener('mouseleave', e => this.onMouseLeave(e));
  }

  eventGenerate(type) {
    return new _LayerEvent.LayerEvent({
      type,
      path: this.pathGet(),
      clientX: this.eventX,
      clientY: this.eventY
    });
  }

  pathGet() {
    let entryLayer = null;

    if (this.eventY <= this.table.header.height) {
      // 点击事在header部分生效
      let cells = [...this.table.header.cells];
      cells.sort((a, b) => b.zIndex - a.zIndex);

      for (let headerCell of cells) {
        const {
          left,
          top,
          width,
          height
        } = headerCell;

        if (headerCell.isRender && left < this.eventX && left + width > this.eventX && top < this.eventY && top + height > this.eventY) {
          entryLayer = headerCell;
          break;
        }
      }
    } else {
      // 点击事在body部分生效
      for (let row of this.table.body.rows) {
        if (this.eventY > row.top && this.eventY < row.top + row.height) {
          entryLayer = row;
          break;
        }
      }
    }

    const clientCoordination = (layer, left = layer.left, top = layer.top) => {
      if (layer.parent) {
        return clientCoordination(layer.parent, left + layer.parent.left, top + layer.parent.top);
      } else {
        return {
          left,
          top
        };
      }
    };

    const pathDig = (layer, path = []) => {
      path.push(layer);

      if ((0, _utils.isNotEmptyArray)(layer.children)) {
        const sortedChildren = [...layer.children].sort((a, b) => b.zIndex - a.zIndex);

        for (let child of sortedChildren) {
          const {
            left,
            top,
            width,
            height
          } = child; // const {left, top} = clientCoordination(child);

          if (child.isRender && left < this.eventX && left + width > this.eventX && top < this.eventY && top + height > this.eventY) {
            return pathDig(child, path);
          }
        }

        return path;
      } else {
        return path;
      }
    };

    return entryLayer ? pathDig(entryLayer).reverse() : [];
  }

  get table() {
    return this.props.table;
  }

}

exports.CanvasTableEvent = CanvasTableEvent;