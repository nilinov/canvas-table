import Layer from './Layer';
import { IComponent } from '../typings/Component';
declare type ILayerButtonProps = IComponent.ILayerButtonProps;
export default class LayerButton extends Layer {
    protected props: ILayerButtonProps;
    static defaultProps: ILayerButtonProps;
    constructor(props: ILayerButtonProps);
    roundRect(): void;
    iconRender(): void;
    render(): void;
}
export {};
