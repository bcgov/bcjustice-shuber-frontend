import React from 'react';
import {
    Field,
    FieldArray, FieldsProps
} from 'redux-form';

import { Table, FormGroup, Button, Glyphicon, Well, OverlayTrigger, Tooltip } from 'react-bootstrap';

import * as CellTypes from '../../components/TableColumnCell';
// TODO: Move this into a common location with AdminForm
import DataTableHeaderRow from './DataTableHeaderRow';
import DataTableFilterRow from './DataTableFilterRow';
import HeaderSaveButton from '../../plugins/AdminRoles/containers/HeaderSaveButton';

export interface ColumnRendererProps {
    index: number;
    fields: FieldsProps<Partial<any>>;
    model: Partial<any>;
    fieldInstanceName: string;
}

export type ColumnRenderer = React.ComponentType<ColumnRendererProps>;

export interface DetailComponentProps {
    parentModel?: any;
    parentModelId?: any;
}

export interface ModalComponentProps {}

export const EmptyDetailRow: React.SFC<DetailComponentProps> = () => (<div />);

// TODO: This is the same as LeavesFieldTableProps... make the other one use a generic?
export interface DataTableProps {
    title: React.ReactNode;
    buttonLabel?: React.ReactNode; // TODO... a hash of values maybe :)
    fieldName: string;
    filterFieldName?: string;
    columns: CellTypes.Types.TableColumnCell[];
    actionsColumn?: CellTypes.Types.TableColumnCell;
    displayHeaderActions?: boolean;
    displayHeaderSave?: boolean;
    displayActionsColumn?: boolean;
    expandable?: boolean;
    expandedRows?: Set<number>;
    modalProps?: any;
    modalComponent: React.ReactType<ModalComponentProps>;
    rowComponent: React.ReactType<DetailComponentProps>;
    initialValue?: any;
    filterable?: boolean;
    filterRows?: Function;
}

// let RENDER_COUNT = 0;
// let ARR_RENDER_COUNT = 0;

export default class DataTable<T> extends React.Component<DataTableProps> {
    static defaultProps = {
        displayHeaderActions: false,
        displayHeaderSave: true,
        displayActionsColumn: true,
        expandable: false,
        // expandedRows: false,
        // TODO: What is up with default props?
        rowComponent: <div />,
        modalProps: {},
        modalComponent: <div />,
        actionsColumn: null,
        buttonLabel: 'Create',
        initialValue: {},
        filterable: false,
        filterRows: () => true
    };

    static MappedTextColumn = CellTypes.MappedText;
    static StaticTextColumn = CellTypes.StaticText;
    static StaticDateColumn = CellTypes.StaticDate;
    static TextFieldColumn = CellTypes.TextField;
    static TextAreaColumn = CellTypes.TextArea;
    static SelectorFieldColumn = CellTypes.SelectorField;
    static CheckboxColumn = CellTypes.Checkbox;
    static DateColumn = CellTypes.Date;
    static TimeColumn = CellTypes.Time;
    static RoleCodeColumn = CellTypes.RoleCode;
    static LeaveSubCodeColumn = CellTypes.LeaveSubCode;
    static ButtonColumn = CellTypes.Button;
    static CancelColumn = CellTypes.Cancel;

    static ActionsColumn = CellTypes.Actions;

    state = {
        expandedRows: new Set(),
        activeRowId: null,
        isModalOpen: false
    };

    constructor(props: DataTableProps) {
        super(props);
    }

    onExpandRowClicked(rowIdx: number) {
        const { expandedRows } = this.state;

        if (!expandedRows.has(rowIdx)) {
            expandedRows.add(rowIdx);
        } else {
            expandedRows.delete(rowIdx);
        }

        this.setState({
            expandedRows: expandedRows
        });
    }

    setActiveRow(id: any) {
        this.setState({
            activeRowId: id
        });
    }

    // @ts-ignore
    render() {
        const componentInstance = this;

        const {
            fieldName,
            filterFieldName,
            title,
            buttonLabel,
            columns = [],
            actionsColumn,
            displayHeaderActions = false,
            displayHeaderSave = true,
            displayActionsColumn = true,
            expandable = false,
            rowComponent,
            modalProps,
            modalComponent,
            initialValue,
            filterable,
            filterRows,
        } = this.props;

        const {
            expandedRows,
            isModalOpen,
            activeRowId
        } = this.state;

        // return (<div>This would be the Table</div>);

        // TODO: Rename as detail component, cause that's what this really is...
        const RowComponent = rowComponent;
        const ModalComponent = modalComponent;

        // RENDER_COUNT++;
        // console.log('DATATABLE RENDER COUNT: ' + RENDER_COUNT);

        return (
            <div className="data-table">
                {title}
                {filterable && filterFieldName && (
                    <div className="data-table-filter-row">
                        <Table striped={true}>
                            {/* We're doing the filter row as a separate table because nesting it in the FieldArray causes
                            binding issues or issues with initialValues or something...
                            basically, redux-form doesn't like it so we're not gonna force it. */}
                            <thead>
                                <DataTableFilterRow<Partial<any & T>>
                                    fieldName={filterFieldName}
                                    columns={columns}
                                    expandable={expandable}
                                    filterable={filterable}
                                />
                            </thead>
                        </Table>
                    </div>
                )}
                <FieldArray<Partial<any & T>>
                    name={fieldName}
                    component={(props) => {
                        // ARR_RENDER_COUNT++;
                        // console.log('DATATABLE FieldArray COMPONENT RENDER COUNT: ' + ARR_RENDER_COUNT);
                        const { fields } = props;
                        return (
                            <div className="data-table-header-row">
                                <Table striped={true} >
                                    <thead>
                                        <DataTableHeaderRow
                                            fields={fields}
                                            columns={columns}
                                            expandable={expandable}
                                            filterable={filterable}
                                            displayHeaderActions={displayHeaderActions}
                                            displayHeaderSave={displayHeaderSave}
                                            // TODO: Rename this, what kind of button is it :)
                                            buttonLabel={buttonLabel}
                                        />
                                    </thead>

                                    <tbody>
                                    {fields.length === 0 && (
                                        <tr>
                                            <td colSpan={expandable ? columns.length + 2 : columns.length + 1}>
                                                <Well
                                                    style={{textAlign: 'center'}}>No records found.</Well></td>
                                        </tr>
                                    )}
                                    {fields.length > 0 && fields.map((fieldInstanceName, index) => {
                                        const fieldModel: Partial<any & T> = fields.get(index);
                                        const {id = null, cancelDate = undefined} = fieldModel || {};

                                        return (
                                            <>
                                                <tr key={index}>
                                                    {expandable && (
                                                        <td>
                                                            <FormGroup>
                                                                <Button
                                                                    bsStyle="link"
                                                                    onClick={() => this.onExpandRowClicked(index)}
                                                                    style={{color: '#666666'}}
                                                                >
                                                                    {id && expandedRows && !expandedRows.has(index) && (
                                                                        <Glyphicon glyph="triangle-right"/>
                                                                    )}
                                                                    {id && expandedRows && expandedRows.has(index) && (
                                                                        <Glyphicon glyph="triangle-bottom"/>
                                                                    )}
                                                                </Button>
                                                            </FormGroup>
                                                        </td>
                                                    )}
                                                    {
                                                        columns
                                                            .map((col, colIndex) => {
                                                                const Column = cancelDate != undefined
                                                                    ? col.CanceledRender
                                                                    : col.FormRenderer;

                                                                return (
                                                                    <td key={colIndex}>
                                                                        <Column
                                                                            model={fieldModel}
                                                                            fieldInstanceName={fieldInstanceName}
                                                                            fields={fields}
                                                                            index={index}
                                                                            callbackContext={componentInstance}
                                                                        />
                                                                    </td>
                                                                );
                                                            })
                                                    }
                                                    {displayActionsColumn && (() => {
                                                        const rowActionsColumn = actionsColumn || CellTypes.Actions();

                                                        const Column = cancelDate != undefined
                                                            ? rowActionsColumn.CanceledRender
                                                            : rowActionsColumn.FormRenderer;

                                                        // TODO: Make this use a class?
                                                        // Flex align end to make sure buttons are right-aligned
                                                        return (
                                                            <td style={{
                                                                display: 'flex',
                                                                justifyContent: 'flex-end'
                                                            }}>
                                                                <Column
                                                                    model={fieldModel}
                                                                    fieldInstanceName={fieldInstanceName}
                                                                    fields={fields}
                                                                    index={index}
                                                                    callbackContext={componentInstance}
                                                                />
                                                            </td>
                                                        );
                                                    })()}
                                                </tr>
                                                {expandable && expandedRows && expandedRows.has(index) && (
                                                    <tr key={index * 2}>
                                                        <td>{/* Nest the Table for sub-rows */}</td>
                                                        {/* tslint:disable-next-line:max-line-length */}
                                                        <td style={{margin: '0', padding: '0'}}
                                                            colSpan={expandable ? columns.length + 1 : columns.length}>
                                                            <RowComponent
                                                                parentModel={fieldModel}
                                                                parentModelId={fieldModel.id}
                                                            />
                                                        </td>
                                                    </tr>
                                                )}
                                                <ModalComponent
                                                    isOpen={activeRowId && (activeRowId === fieldModel.id)}
                                                    {...modalProps}
                                                    parentModel={fieldModel}
                                                    parentModelId={fieldModel.id}
                                                />
                                            </>
                                        );
                                    })}
                                    </tbody>
                                </Table>
                            </div>
                        );
                    }}
                />
            </div>
        );
    }

}
