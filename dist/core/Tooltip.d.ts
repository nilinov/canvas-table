/** @jsx h */
import Layer from "../component/Layer";
declare class Tooltip {
    wrapper: HTMLElement;
    constructor();
    show(text: any, layer: Layer): void;
    hide(): void;
    domInit(): any;
}
export default Tooltip;
