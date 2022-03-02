import { Component } from "../component/Component";
import { ICanvasTable } from "../typings/CanvasTable";
import CanvasTable from "../core/CanvasTable";
import { BodyRow } from "./BodyRow";
import { obj } from "../typings/common";
declare type ISectionProps = ICanvasTable.ISectionProps;
export declare class BodySection extends Component {
    private props;
    constructor(props: ISectionProps);
    init(): void;
    top: number;
    get width(): number;
    get height(): number;
    table: CanvasTable;
    rows: BodyRow[];
    diff(newData: obj[]): BodyRow[];
    render(start?: number, renderLen?: number): void;
    clear(): void;
}
export {};
