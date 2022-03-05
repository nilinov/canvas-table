import {Component} from "../component/Component";
import {ICanvasTable} from "../typings/CanvasTable";
import HeaderTreeNode from "./HeaderTreeNode";
import {isEmpty} from "../utils/utils";
import {treeBFEach, treeEach, treeGetLeaf} from "../utils/tree";
import {Column} from "./Column";
import {drawLine, drawRect} from "../utils/draw";

type IColumn = ICanvasTable.IColumn;
type ITableHeaderProps = ICanvasTable.ITableHeaderProps;

export class HeaderTree extends Component {
    constructor(private props: ITableHeaderProps) {
        super();
        const columnsProps = columnsPropsRearrange(props.colProps);
        this.columnsInit(columnsProps);
        this.cellNodesInit(columnsProps)
    }

    // Листовой узел конфигурации столбца является ключом к управляющему
    // столбцу (за исключением атрибута блокировки столбца),
    // поэтому эти четыре атрибута являются столбцами,
    // соответствующими листовому узлу

    columns: Column[] = [];
    leftColumns: Column[] = [];
    rightColumns: Column[] = [];
    notFixedColumns: Column[] = [];

    /*
      * Правила обработки столбцов:
      * 1. Атрибут title действителен для каждого слоя
      * 2. Фиксированное поле может быть установлено только на первом уровне, и дочерние узлы автоматически наследуют
      * 3. align может быть установлен, если не установлен, он унаследует родительский узел
      * 4. Все остальные свойства вступят в силу, только если они установлены на конечном узле.
      */
    columnsInit({fixedLeft, notFixed, fixedRight}: { [key: string]: IColumn[] }) {
        // инициализируем столбец
        let colIndex = 0;
        const propsArr = [fixedLeft, notFixed, fixedRight];
        const colArr = [this.leftColumns, this.notFixedColumns, this.rightColumns];
        // Все ячейки заголовка наследуют фиксированное свойство первого уровня
        [...fixedLeft, ...fixedRight, ...notFixed].forEach(rootCol => {
            treeEach(rootCol, (colProps) => {
                colProps.fixed = rootCol.fixed
            })
        });
        propsArr.forEach((colProps, i) => {
            treeGetLeaf(colProps).forEach(prop => {
                colArr[i].push(
                    new Column({
                        ...prop,
                        table: this.props.table,
                        index: colIndex++
                    })
                )
            })
        });
        this.columns = [...this.leftColumns, ...this.notFixedColumns, ...this.rightColumns];
    }

    deep: number = 1; // Глубина
    rootCells: HeaderTreeNode[] = [];// ячейки в первом слое
    leafCells: HeaderTreeNode[] = []; // ячейки листового слоя

    cellNodesInit({fixedLeft, notFixed, fixedRight}: { [key: string]: IColumn[] }) {
        const propsQueue = [...fixedLeft, ...notFixed, ...fixedRight];
        const PARENT_KEY = '__PARENT__';
        let node: HeaderTreeNode = null;
        const table = this.table;

        while (propsQueue[0]) {
            const currProps = propsQueue.shift();
            node = new HeaderTreeNode({
                colProps: currProps,
                popTitle: currProps.popTitle,
                parent: currProps[PARENT_KEY],
                table: table,
                ctx: table.ctx,
                style: {
                    padding: [0, table.style.padding],
                    ...currProps.styleColumn,
                }
            });
            if (isEmpty(currProps[PARENT_KEY])) {
                this.rootCells.push(node)
            }
            delete currProps[PARENT_KEY];

            if (Array.isArray(currProps.children)) {
                propsQueue.push(...currProps.children.map(child => {
                    return {
                        [PARENT_KEY]: node,
                        ...child,
                    }
                }));
            }
        }

        if (node) {
            this.deep = node.treeHeight
        }
        this.leafCells = treeGetLeaf(this.rootCells, 'childrenCell');
    }

    get cells() {
        let cells: HeaderTreeNode[] = [];
        treeBFEach(this.rootCells, cell => cells.push(cell), 'childrenCell');
        return cells;
    }

    top: number = 0;

    get width() {
        return this.table.width
    }

    get height() {
        return this.deep * this.table.style.headerRowHeight
    };

    get table() {
        return this.props.table
    }

    render() {
        if (isEmpty(this.rootCells)) {
            return
        }
        const ctx = this.table.ctx;

        drawRect(ctx, 0, 0, this.table.style.width, this.height, this.table.style.headerBackColor);
        drawLine(ctx, 0, this.height - 1, this.table.style.width, this.height - 1);
        const fixLeftCells = this.rootCells.filter(cell => cell.fixed === 'left');
        const fixRightCells = this.rootCells.filter(cell => cell.fixed === 'right');
        const notFixedCells = this.rootCells.filter(cell => cell.fixed !== 'left' && cell.fixed !== 'right');

        ctx.save();
        ctx.beginPath();

        let leftWidth = fixLeftCells.reduce((pre, curr) => pre + curr.width, 0);
        let centerWidth = notFixedCells.reduce((pre, curr) => pre + curr.width, 0);
        // let rightWidth = notFixedCells.reduce((pre, curr) => pre + curr.width, 0);
        ctx.rect(leftWidth, 0, centerWidth, this.height);
        ctx.clip();
        treeBFEach(notFixedCells, cell => cell.innerRender(), 'childrenCell');
        ctx.restore();

        treeBFEach(fixLeftCells, cell => cell.innerRender(), 'childrenCell');
        treeBFEach(fixRightCells, cell => cell.innerRender(), 'childrenCell');
    }
}

function columnsPropsRearrange(colProps: IColumn[]) {
    // Упорядочить порядок столбцов в соответствии с конфигурацией столбца блокировки
    const fixedLeft = colProps
        .filter(col => col.fixed === 'left')
        .map((col, i) => {
            return {...col, fixedIndex: i}
        });
    const fixedRight = colProps
        .filter(col => col.fixed === 'right')
        .map((col, i) => {
            return {...col, fixedIndex: i}
        });

    const notFixed = colProps.filter(col => !['left', 'right'].includes(col.fixed));

    return {fixedLeft, notFixed, fixedRight}
}
