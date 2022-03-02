import CanvasTable from "./CanvasTable";
import Layer from "../component/Layer";
import { IComponent } from "../typings/Component";
import { LayerEvent } from "./LayerEvent";
declare type IEventCollection = IComponent.IEventCollection;
export declare class CanvasTableEvent {
    protected props: {
        table: CanvasTable;
    };
    constructor(props: {
        table: CanvasTable;
    });
    init(): void;
    eventX: number;
    eventY: number;
    eventHandler: (type: keyof IEventCollection, event: any) => void;
    private lastMoveEvent;
    moveEventHandler: (event: any) => void;
    onMouseLeave: (event: MouseEvent) => void;
    eventGenerate(type?: keyof IEventCollection): LayerEvent;
    pathGet(): Layer[];
    get table(): CanvasTable;
}
export {};
