"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.debounce = exports.cssParser = exports.percentCalc = exports.toBlank = exports.isFunction = exports.isNotEmptyArray = exports.isNotEmpty = exports.isEmpty = void 0;

/**
 * js各种公用且与业务无关的工具类方法
 */

/**
 * undefined null '' [] {} 为空
 * @param {*} obj
 * @return {boolean} is_empty
 */
const isEmpty = obj => {
  let isEmpty = false;

  if (obj === undefined || obj === null || obj === '') {
    isEmpty = true;
  } else if (Array.isArray(obj) && obj.length === 0) {
    isEmpty = true;
  } else if (obj.constructor === Object && Object.keys(obj).length === 0) {
    isEmpty = true;
  }

  return isEmpty;
};

exports.isEmpty = isEmpty;

const isNotEmpty = obj => {
  return !isEmpty(obj);
};

exports.isNotEmpty = isNotEmpty;

const isNotEmptyArray = arr => {
  return Array.isArray(arr) && !isEmpty(arr);
};

exports.isNotEmptyArray = isNotEmptyArray;

const isFunction = fun => {
  return typeof fun === 'function';
};
/**
 * null,undefined,false 转为 ''
 * @param value
 * @param str
 * @return {*|string}
 */


exports.isFunction = isFunction;

const toBlank = (value, str = '') => {
  return value || value === 0 ? value + '' : str;
}; // export const removeBlank = (str) => {
//   let parseReg = /\s{2,}/g;
//   if (typeof str === 'string') {
//     return str.replace(parseReg, ' ');
//   }
//   return str;
// };


exports.toBlank = toBlank;

const percentCalc = (number, parentNumber) => {
  if (typeof number === 'string') {
    if (/^\d{1,2}%$/.test(number)) {
      return parseInt(number.substring(0, -1)) * 0.01 * parentNumber();
    } else {
      return parentNumber();
    }
  } else if (typeof number === 'number') {
    return number;
  } else {
    return parentNumber();
  }
};

exports.percentCalc = percentCalc;
const cssParser = {
  multiValue(value) {
    let result = [];

    if (Array.isArray(value)) {
      switch (value.length) {
        case 1:
          result = [value[0], value[0], value[0], value[0]];
          break;

        case 2:
          result = [value[0], value[1], value[0], value[1]];
          break;

        case 3:
          result = [value[0], value[1], value[2], value[1]];
          break;

        case 4:
        default:
          result = [...value];
          break;
      }
    } else {
      result = [value, value, value, value];
    }

    return result;
  },

  border(str) {
    if (str) {
      let [width, color] = str.split(/\s{1,}/g);
      width = parseInt(width);
      return {
        width,
        color
      };
    } else {
      return null;
    }
  }

}; // export const throttling = function(action, delay) { // 函数节流
//   let last = 0;
//   return function(...args){
//     let curr = + new Date();
//     if (curr - last > delay){
//       action.apply(this, args) ;
//       last = curr
//     }
//   }
// };

exports.cssParser = cssParser;

const debounce = function (method, delay) {
  let timer = null;
  return function (...args) {
    let context = this;
    clearTimeout(timer);
    timer = setTimeout(function () {
      method.apply(context, args);
    }, delay);
  };
};

exports.debounce = debounce;