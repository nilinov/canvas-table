import { IComponent } from "../typings/Component";
import Layer from "../component/Layer";
declare type ILayerEventProps = IComponent.ILayerEventProps;
declare type IEventCollection = IComponent.IEventCollection;
export declare class LayerEvent {
    constructor(props?: ILayerEventProps);
    clientX: number;
    clientY: number;
    path: Layer[];
    target: Layer;
    type: keyof IEventCollection;
    private _isPropagationStopped;
    get isPropagationStopped(): boolean;
    stopPropagation(): void;
    copy(changes?: ILayerEventProps): LayerEvent;
}
export {};
