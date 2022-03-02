import Layer from "./Layer";
import { IComponent } from "../typings/Component";
declare type ILayerTextProps = IComponent.ILayerTextProps;
export default class LayerText extends Layer {
    protected props: ILayerTextProps;
    constructor(props: ILayerTextProps);
    get text(): string;
    protected _textEllipsis: string;
    get textEllipsis(): string;
    render(text?: string): void;
}
export {};
