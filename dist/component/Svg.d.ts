import Layer from "./Layer";
import { IComponent } from "../typings/Component";
declare type ILayerProps = IComponent.ILayerProps;
interface ISvgProps extends ILayerProps {
    path: string;
}
declare class Svg extends Layer {
    protected props: ISvgProps;
    constructor(props: ISvgProps);
    init(): void;
    render(): void;
    childrenRender(): void;
}
export default Svg;
