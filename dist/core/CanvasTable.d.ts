/** @jsx h */
import { ICanvasTable } from "../typings/CanvasTable";
import { BodySection } from "../table/Body";
import Scroller from "./Scroller";
import { HeaderTree } from "../table/HeaderTree";
import { CanvasTableEvent } from "./TableEvent";
import { obj } from "../typings/common";
import Button from "../component/Button";
import Layer from "../component/Layer";
import Text from "../component/Text";
import Svg from "../component/Svg";
import Tooltip from './Tooltip';
declare type ITableStyle = ICanvasTable.ITableStyle;
declare type ICanvasTableProps = ICanvasTable.ICanvasTableProps;
declare class CanvasTable {
    props: ICanvasTableProps;
    static Button: typeof Button;
    static Layer: typeof Layer;
    static Text: typeof Text;
    static Svg: typeof Svg;
    style: ITableStyle;
    constructor(props: ICanvasTableProps);
    outerHeight: number;
    outerWidth: number;
    ctx: CanvasRenderingContext2D;
    event: CanvasTableEvent;
    tooltip: Tooltip;
    init(isFirstTime?: boolean): void;
    onWindowResizeHandler: (...args: any[]) => void;
    styleCalc(): void;
    ctxInit(): void;
    header: HeaderTree;
    body: BodySection;
    componentsInit(): void;
    private _source;
    set source(data: obj[]);
    get source(): obj[];
    height: number;
    width: number;
    dataHeight: number;
    dataWidth: number;
    sizeCalc(): void;
    isFirstRender: boolean;
    render(): void;
    isScrollLoading: boolean;
    scrollMask: HTMLElement;
    scrollPosition: {
        scrollLeft: number;
        scrollTop: number;
    };
    onScrollHandler: (left: number, top: number, direction: string) => void;
    resize(): void;
    canvas: HTMLCanvasElement;
    scroller: Scroller;
    selectionCell: HTMLInputElement;
    _wrapper: HTMLElement;
    get wrapper(): HTMLElement;
    domInit(): void;
    destroy(): void;
}
export default CanvasTable;