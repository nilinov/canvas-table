/** @jsx h */
import { ICanvasTable } from "../typings/CanvasTable";
declare type ITableScrollerProps = ICanvasTable.ITableScrollerProps;
export declare const SCROLLBAR_WIDTH = 10;
export declare const BAR_WIDTH = 10;
export default class Scroller {
    private props;
    static hasStyle: boolean;
    constructor(props: ITableScrollerProps);
    scrollTo(left: number, top: number): void;
    private fixedLeftWidth;
    private fixedRightWidth;
    scrollWidth: number;
    scrollHeight: number;
    /**
     * 更新滚动的一些属性
     * @param left - 显示宽度
     * @param top  - 显示高度
     * @param dataWidth - 真实宽度
     * @param dataHeight - 真实高度
     */
    update(left: number, top: number, dataWidth: number, dataHeight: number): void;
    direction: string;
    top: number;
    left: number;
    scrollHandler: () => void;
    shadowDraw(type: 'left' | 'right' | 'both' | 'none'): void;
    shadowRender(): void;
    wrapper: HTMLElement;
    scrollRef: import("../utils/h").IRefer<HTMLDivElement>;
    scrollEndRef: import("../utils/h").IRefer<HTMLDivElement>;
    shadowLeftRef: import("../utils/h").IRefer<HTMLDivElement>;
    shadowRightRef: import("../utils/h").IRefer<HTMLDivElement>;
    domInit(): any;
}
export {};
