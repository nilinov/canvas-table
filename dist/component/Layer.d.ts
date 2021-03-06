import { Component } from "./Component";
import { IComponent } from "../typings/Component";
import { LayerEvent } from "../core/LayerEvent";
import CanvasTable from "../core/CanvasTable";
import { obj } from "../typings/common";
declare type ILayerStyle = IComponent.ILayerStyle;
declare type ILayerProps = IComponent.ILayerProps;
declare type IEventCollection = IComponent.IEventCollection;
export default class Layer extends Component {
    protected props: ILayerProps;
    private static defaultStyle;
    constructor(props: ILayerProps);
    _ctx: CanvasRenderingContext2D;
    get ctx(): CanvasRenderingContext2D;
    get table(): CanvasTable;
    parent: Layer;
    children: Layer[];
    style: ILayerStyle;
    styleInit(): void;
    get isRender(): boolean;
    get sibings(): Layer[];
    get left(): number;
    get top(): number;
    get innerWidth(): number;
    get width(): number;
    get innerHeight(): number;
    get height(): number;
    get padding(): {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    get border(): {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    get align(): "left" | "right" | "center";
    get zIndex(): number;
    clear(): void;
    childrenRender(): void;
    baseRender(): void;
    render(): void;
    innerRender(): void;
    drawText(str: string): void;
    protected eventHandlers: obj<Function[]>;
    on(name: string, handler: Function): void;
    off(name: string, handler?: Function): void;
    trigger(type: keyof IEventCollection, event: LayerEvent): void;
}
export {};
