import { ICanvasTable } from "../typings/CanvasTable";
import { BodyCell } from "./BodyCell";
import Layer from "../component/Layer";
import { IComponent } from "../typings/Component";
import { LayerEvent } from "../core/LayerEvent";
declare type IRowProps = ICanvasTable.IRowProps;
declare type IEventCollection = IComponent.IEventCollection;
export declare class BodyRow extends Layer {
    protected props: IRowProps;
    constructor(props: IRowProps);
    index: number;
    get data(): import("../typings/common").obj<any>;
    get cells(): BodyCell[];
    cellsCreate(): void;
    get left(): number;
    get width(): number;
    get top(): number;
    get isRender(): boolean;
    get height(): number;
    get table(): import("../core/CanvasTable").default;
    update(): void;
    trigger(type: keyof IEventCollection, event: LayerEvent): void;
    highlight(flag: boolean): void;
    get ctx(): CanvasRenderingContext2D;
    render(): void;
}
export {};
