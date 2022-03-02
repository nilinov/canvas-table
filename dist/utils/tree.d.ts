interface IBaseTree {
    [key: string]: any;
    children?: IBaseTree[];
}
export declare const treeEach: <T extends IBaseTree>(tree: T | T[], handler: (tnode: T, deep?: number) => void, childrenKey?: string) => void;
export declare const treeBFEach: <T extends IBaseTree>(tree: T | T[], handler: (tnode: T, deep?: number) => void, childrenKey?: string) => void;
export declare const treeGetLeaf: <T extends IBaseTree>(tree: T | T[], childrenKey?: string) => T[];
export declare const treeGetDeep: <T extends IBaseTree>(tree: T | T[], childrenKey?: string) => number;
/**
 * 从本身节点开始，向后查找（包含本身）
 */
export declare const treeBackFind: <T extends IBaseTree>(node: T, filterCb: (tnode: T) => boolean, parentKey?: string) => T;
export declare const treeInherit: <T extends IBaseTree>(node: T, key: string, defaultValue?: any) => any;
export declare const treeGetPath: <T extends IBaseTree>(node: T) => T[];
export {};
