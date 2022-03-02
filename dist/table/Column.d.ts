import { ICanvasTable } from "../typings/CanvasTable";
declare type IColumnProps = ICanvasTable.IColumnProps;
export declare class Column {
    private props;
    constructor(props: IColumnProps);
    get align(): "left" | "right" | "center";
    get width(): number;
    get left(): number;
    get index(): number;
    get fixedIndex(): number;
    get name(): string;
    get title(): string | (() => import("../component/Layer").default);
    get key(): string;
    get table(): import("../core/CanvasTable").default;
    get fixed(): "left" | "right";
    get isRender(): boolean;
    get customRender(): (value: any, record: any) => "string" | import("../component/Layer").default;
    get onCell(): ICanvasTable.ITableEventHandler;
}
export {};
