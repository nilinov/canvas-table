"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Layer = _interopRequireDefault(require("./Layer"));

var _draw = require("../utils/draw");

class Svg extends _Layer.default {
  constructor(props) {
    // this.ctx
    super(props);
    this.props = props; // if (isEmpty(props && props.style && props.style.padding)) {
    //   this.style.padding = [0, 8, 0, 8];
    // }
    //

    this.init();
  }

  init() {
    const {
      path,
      style: {
        color
      }
    } = this.props;
    svgInit(path, color || '').then(img => {
      img && img.addEventListener('load', () => {
        this.table.render();
      }, {
        once: true
      });
    });
  }

  render() {
    // console.log( `SVG: render` )
    const {
      path,
      style: {
        color
      }
    } = this.props;
    const key = imgKey(path, color);
    const img = imgCache[key];

    if (img && img.complete) {
      this.ctx.drawImage(img, this.left, this.top, this.width - 1, this.height - 1);
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
    }
  }

  childrenRender() {}

}

const imgCache = {};
const originSvgCache = {};
const loadingSvg = {};

async function svgInit(path, color) {
  const key = imgKey(path, color);

  if (imgCache[key]) {
    return null;
  }

  if (loadingSvg[path]) {
    return null;
  }

  imgCache[key] = base64_2_img(path, color);
  return imgCache[key];
}

function imgKey(path, color) {
  return path + '__' + color;
}

async function svgLoad(path) {
  if (originSvgCache[path]) {
    return null;
  }

  loadingSvg[path] = true;
  const [res, err] = await fetch(path).then(res => [res, null], err => [null, err]);

  if (err) {
    console.warn(err);
    return null;
  }

  originSvgCache[path] = await res.text();
  delete loadingSvg[path];
  return originSvgCache[path];
}

function base64_2_img(base64, color) {
  // svg = svg.replace('<svg ', `<svg fill="${color}" `)
  // const blob = new Blob([svg], {type: 'image/svg+xml'});
  // const url = URL.createObjectURL(blob);
  const image = document.createElement('img');
  image.addEventListener('load', () => {// URL.revokeObjectURL(url)
  }, {
    once: true
  });
  image.src = base64;
  return image;
}

var _default = Svg;
exports.default = _default;