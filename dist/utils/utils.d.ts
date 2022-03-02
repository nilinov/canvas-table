/**
 * js各种公用且与业务无关的工具类方法
 */
/**
 * undefined null '' [] {} 为空
 * @param {*} obj
 * @return {boolean} is_empty
 */
export declare const isEmpty: (obj: any) => boolean;
export declare const isNotEmpty: (obj: any) => boolean;
export declare const isNotEmptyArray: (arr: any) => boolean;
export declare const isFunction: (fun: any) => boolean;
/**
 * null,undefined,false 转为 ''
 * @param value
 * @param str
 * @return {*|string}
 */
export declare const toBlank: (value: any, str?: string) => string;
export declare const percentCalc: (number: string | number, parentNumber: () => number) => number;
export declare const cssParser: {
    multiValue<T>(value: T | T[]): T[];
    border(str: string): {
        width: any;
        color: any;
    };
};
export declare const debounce: (method: any, delay: any) => (...args: any[]) => void;
