"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.treeGetPath = exports.treeInherit = exports.treeBackFind = exports.treeGetDeep = exports.treeGetLeaf = exports.treeBFEach = exports.treeEach = void 0;

var _utils = require("./utils");

const treeEach = (tree, handler, childrenKey = 'children') => {
  let deep = 1;

  const each = (tnode, cb) => {
    if (tnode) {
      cb(tnode, deep);
      const children = tnode[childrenKey];
      deep++;
      Array.isArray(children) && children.forEach(t => {
        each(t, cb);
      });
      deep--;
    }
  };

  if (Array.isArray(tree)) {
    tree.forEach(t => {
      each(t, handler);
    });
  } else {
    each(tree, handler);
  }
};

exports.treeEach = treeEach;

const treeBFEach = (tree, handler, childrenKey = 'children') => {
  const queue = Array.isArray(tree) ? [...tree] : [tree];

  while (queue[0]) {
    const curr = queue.shift();
    handler(curr);

    if (Array.isArray(curr[childrenKey])) {
      queue.push(...curr[childrenKey]);
    }
  }
};

exports.treeBFEach = treeBFEach;

const treeGetLeaf = (tree, childrenKey = 'children') => {
  const leafs = [];
  treeEach(tree, tnode => {
    if ((0, _utils.isEmpty)(tnode[childrenKey])) {
      leafs.push(tnode);
    }
  }, childrenKey);
  return leafs;
};

exports.treeGetLeaf = treeGetLeaf;

const treeGetDeep = (tree, childrenKey = 'children') => {
  let deep = 0;
  treeEach(tree, (tnode, currDeep) => {
    if (currDeep > deep) {
      deep = currDeep;
    }
  }, childrenKey);
  return deep;
};
/**
 * 从本身节点开始，向后查找（包含本身）
 */


exports.treeGetDeep = treeGetDeep;

const treeBackFind = (node, filterCb, parentKey = 'parent') => {
  let result = node,
      deep = 0;

  while (result) {
    deep++;

    if (filterCb(result)) {
      return result;
    } else {
      result = result[parentKey];
    }

    if (deep > 100) {
      return;
    }
  }

  return null;
};

exports.treeBackFind = treeBackFind;

const treeInherit = (node, key, defaultValue = null) => {
  const result = treeBackFind(node, tnode => {
    return (0, _utils.isNotEmpty)(tnode[key]);
  });
  return result ? result[key] : defaultValue;
};

exports.treeInherit = treeInherit;

const treeGetPath = node => {
  const path = [];
  treeBackFind(node, tnode => {
    path.push(tnode);
    return false;
  });
  return path;
};

exports.treeGetPath = treeGetPath;