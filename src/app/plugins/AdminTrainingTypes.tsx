import React from 'react';

import {
    FormErrors
} from 'redux-form';

import { Dispatch } from 'redux';

import { RootState } from '../store';

import {
    getLeaveSubCodes,
    createOrUpdateLeaveSubCodes,
    deleteLeaveSubCodes
} from '../modules/leaves/actions';

import {
    getAllTrainingLeaveSubCodes as getAllLeaveSubCodes
} from '../modules/leaves/selectors';

import { IdType, LeaveSubCode } from '../api';

import {
    FormContainerBase,
    FormContainerProps,
} from '../components/Form/FormContainer';

import DataTable, { DetailComponentProps, EmptyDetailRow } from '../components/Table/DataTable';
import { AdminTrainingTypesProps } from './AdminTrainingTypes';
import RemoveRow from '../components/TableColumnActions/RemoveRow';
import ExpireRow from '../components/TableColumnActions/ExpireRow';

export interface AdminTrainingTypesProps extends FormContainerProps {
    leaveTypes?: any[];
    trainingLeaveTypes?: any[];
}

export interface AdminTrainingTypesDisplayProps extends FormContainerProps {

}

class AdminTrainingTypesDisplay extends React.PureComponent<AdminTrainingTypesDisplayProps, any> {
    render() {
        const { data = [] } = this.props;
        return (
            <div />
        );
    }
}

export default class AdminTrainingTypes extends FormContainerBase<AdminTrainingTypesProps> {
    // NOTICE!
    // This key maps to the [appScope: FrontendScope] (in the token)
    // To set permissions for a new plugin, add a corresponding entry under System Settings > Components
    // with the name as defined as the plugin's name.
    name = 'ADMIN_PLUGIN_TRAINING_TYPES';
    // END NOTICE
    reduxFormKey = 'leaves';
    formFieldNames = {
        trainingLeaveTypes: 'leaves.trainingLeaveTypes'
    };
    title: string = ' Training Leave Types';

    FormComponent = (props: FormContainerProps<AdminTrainingTypesProps>) => {
        const onFilterSubCode = (event: Event, newValue: any, previousValue: any, name: string) => {
            const { setPluginFilters } = props;
            if (setPluginFilters) {
                setPluginFilters({
                    leaves: {
                        subCode: newValue
                    }
                });
            }
        };

        const onFilterEffectiveDate = (event: Event, newValue: any, previousValue: any, name: string) => {
            const { setPluginFilters } = props;
            if (setPluginFilters) {
                setPluginFilters({
                    leaves: {
                        effectiveDate: newValue
                    }
                });
            }
        };

        const onFilterExpiryDate = (event: Event, newValue: any, previousValue: any, name: string) => {
            const { setPluginFilters } = props;
            if (setPluginFilters) {
                setPluginFilters({
                    leaves: {
                        expiryDate: newValue
                    }
                });
            }
        };

        return (
            <div>
                <DataTable
                    fieldName={this.formFieldNames.trainingLeaveTypes}
                    filterFieldName={(this.filterFieldNames) ? `${this.filterFieldNames.trainingLeaveTypes}` : undefined}
                    title={''} // Leave this blank
                    buttonLabel={'Add Training Type'}
                    actionsColumn={DataTable.ActionsColumn({
                        actions: [
                            ({ fields, index, model }) => <RemoveRow fields={fields} index={index} model={model} />,
                            ({ fields, index, model }) => { return (model && model.id) ? (<ExpireRow fields={fields} index={index} model={model} />) : null; },
                        ]
                    })}
                    columns={[
                        // DataTable.TextFieldColumn('Leave Type', { fieldName: 'code', displayInfo: true }),
                        DataTable.TextFieldColumn('Training Leave Sub Code', { fieldName: 'subCode', colStyle: { width: '200px' }, displayInfo: true, filterable: true, filterColumn: onFilterSubCode }),
                        DataTable.TextFieldColumn('Description', { fieldName: 'description', colStyle: { width: '300px' }, displayInfo: false }),
                        DataTable.DateColumn('Effective Date', 'effectiveDate', { colStyle: { width: '175px'}, displayInfo: true, filterable: true, filterColumn: onFilterEffectiveDate }),
                        DataTable.DateColumn('Expiry Date', 'expiryDate', { colStyle: { width: '175px'}, displayInfo: true, filterable: true, filterColumn: onFilterExpiryDate }),
                        // DataTable.StaticTextColumn('Created By', { fieldName: 'createdBy', colStyle: { width: '175px' }, displayInfo: false }),
                        // DataTable.StaticDateColumn('Date Created', { fieldName: 'createdDtm', colStyle: { width: '175px' }, displayInfo: false }),
                        // DataTable.SelectorFieldColumn('Status', { displayInfo: true }),

                    ]}
                    filterable={false}
                    expandable={false}
                    // expandedRows={[1, 2]}
                    rowComponent={EmptyDetailRow}
                    modalComponent={EmptyDetailRow}
                    displayHeaderActions={true}
                />
            </div>
        );
    }

    DisplayComponent = (props: FormContainerProps<AdminTrainingTypesDisplayProps>) => (
        <div>
            {/*<Alert>No leaves exist</Alert>*/}
            <AdminTrainingTypesDisplay {...props} />
        </div>
    )

    validate(values: AdminTrainingTypesProps = {}): FormErrors | undefined {
        return undefined;
    }

    fetchData(dispatch: Dispatch<{}>, filters: {} | undefined) {
        dispatch(getLeaveSubCodes()); // This data needs to always be available for select lists
    }

    getData(state: RootState, filters: any | undefined) {
        // Get filter data
        const filterData = this.getFilterData(filters);
        // console.log(filterData);

        // Get form data
        // TODO: Depending on component state, some of these calls will need to be filtered!
        const leaveTypes = getAllLeaveSubCodes(state) || undefined;

        const leaveTypesArray: any[] = [];
        // TODO: Maybe this should go in the selector or something instead? Not sure...

        Object.keys(leaveTypes).forEach(t => {
            const leaveType = Object.assign(
                {
                    id: leaveTypes[t].subCode
                },
                leaveTypes[t]
            );
            leaveTypesArray.push(leaveType);
        });

        return {
            ...filterData,
            trainingLeaveTypes: leaveTypesArray
        };
    }

    getDataFromFormValues(formValues: {}, initialValues: {}): FormContainerProps {
        return super.getDataFromFormValues(formValues) || {
        };
    }

    mapDeletesFromFormValues(map: any) {
        const deletedLeaveTypeIds: IdType[] = [];

        if (map.trainingLeaveTypes) {
            const initialValues = map.trainingLeaveTypes.initialValues;
            const existingIds = map.trainingLeaveTypes.values.map((val: any) => val.id);

            const removeLeaveTypeIds = initialValues
                .filter((val: any) => (existingIds.indexOf(val.id) === -1))
                .map((val: any) => val.id);

            deletedLeaveTypeIds.push(...removeLeaveTypeIds);
        }

        return {
            trainingLeaveTypes: deletedLeaveTypeIds
        };
    }

    async onSubmit(formValues: any, initialValues: any, dispatch: Dispatch<any>): Promise<any[]> {
        const data: any = this.getDataFromFormValues(formValues, initialValues);
        const dataToDelete: any = this.getDataToDeleteFromFormValues(formValues, initialValues) || {};

        // Delete records before saving new ones!
        const deletedLeaveTypes: IdType[] = dataToDelete.trainingLeaveTypes as IdType[];

        const leaveTypes: Partial<LeaveSubCode>[] = data.trainingLeaveTypes.map((c: LeaveSubCode) => ({
            ...c,
            createdBy: 'DEV - FRONTEND',
            updatedBy: 'DEV - FRONTEND',
            createdDtm: new Date().toISOString(),
            updatedDtm: new Date().toISOString()
        }));

        console.log('dumping AdminTrainingTypes grid data');
        console.log(deletedLeaveTypes);
        console.log(leaveTypes);
        return Promise.all([
            dispatch(deleteLeaveSubCodes(deletedLeaveTypes)),
            dispatch(createOrUpdateLeaveSubCodes(leaveTypes))
        ]);
    }
}
