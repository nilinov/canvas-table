import { obj } from "../typings/common";
declare const h: (tag: any, props?: obj, ...children: any[]) => any;
export default h;
export interface IRefer<T> {
    current: T;
}
export declare const createRef: <T>() => IRefer<T>;
