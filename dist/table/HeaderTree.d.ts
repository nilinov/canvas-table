import { Component } from "../component/Component";
import { ICanvasTable } from "../typings/CanvasTable";
import HeaderTreeNode from "./HeaderTreeNode";
import { Column } from "./Column";
declare type IColumn = ICanvasTable.IColumn;
declare type ITableHeaderProps = ICanvasTable.ITableHeaderProps;
export declare class HeaderTree extends Component {
    private props;
    constructor(props: ITableHeaderProps);
    columns: Column[];
    leftColumns: Column[];
    rightColumns: Column[];
    notFixedColumns: Column[];
    columnsInit({ fixedLeft, notFixed, fixedRight }: {
        [key: string]: IColumn[];
    }): void;
    deep: number;
    rootCells: HeaderTreeNode[];
    leafCells: HeaderTreeNode[];
    cellNodesInit({ fixedLeft, notFixed, fixedRight }: {
        [key: string]: IColumn[];
    }): void;
    get cells(): HeaderTreeNode[];
    top: number;
    get width(): number;
    get height(): number;
    get table(): import("../core/CanvasTable").default;
    render(): void;
}
export {};
