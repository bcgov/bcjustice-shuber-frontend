import React from 'react';
import {
    Table
} from 'react-bootstrap';
import {
    FormErrors
} from 'redux-form';

import { Dispatch } from 'redux';

import {
    getUsers,
    createOrUpdateUsers,
    deleteUsers
} from '../../modules/users/actions';

import {
    getAllUsers,
    getUserRolesGroupedByUserId,
    findAllUsers,
    findUserRolesGroupedByUserId,
} from '../../modules/users/selectors';

import {
    getSheriffList as getSheriffs
} from '../../modules/sheriffs/actions';

import {
    getAllSheriffs,
    // findAllSheriffs
} from '../../modules/sheriffs/selectors';

import {
    getRoles,
    getUserRoles,
    createOrUpdateUserRoles,
    deleteUserRoles
} from '../../modules/roles/actions';

import {
    getAllRoles,
    getAllUserRoles,
    findAllRoles,
    findAllUserRoles
} from '../../modules/roles/selectors';

import {
    getLocations
} from '../../modules/system/action'; // TODO: Naming not consistent here!

import {
    getAllLocations,
    findAllLocations
} from '../../modules/system/selectors';

import { RootState } from '../../store';

import { User, UserRole, IdType, RoleApiScope, RoleFrontendScope } from '../../api';

import {
    FormContainerBase,
    FormContainerProps,
} from '../../components/Form/FormContainer';

import DataTable, { DetailComponentProps, EmptyDetailRow } from '../../components/Table/DataTable';

import RoleSelector from './RoleSelector';

import LocationDisplay from './LocationDisplay';
import GenderCodeDisplay from '../GenderCodeDisplay';
import EditRow from '../../components/TableColumnActions/EditRow';
import RemoveRow from '../../components/TableColumnActions/RemoveRow';
import ExpireRow from '../../components/TableColumnActions/ExpireRow';

// TODO: Fix this interface!
export interface AdminAssignUserRolesProps extends FormContainerProps {
    // roles?: any[];
    locations?: {}[];
    users?: {}[];
    userRoles?: {}[];
    userRolesGrouped?: {};
}

export interface AdminAssignUserRolesDisplayProps extends FormContainerProps {

}

class AdminAssignUserRolesDisplay extends React.PureComponent<AdminAssignUserRolesDisplayProps, any> {
    render() {
        const { data = [] } = this.props;

        // TODO: Rip out dummy data
        const testData = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];
        return (
            <div>
                {/*<h3>Roles</h3>*/}
                <Table responsive={true} striped={true} >
                    <thead>
                        <tr>
                            <th className="text-left">Role Name</th>
                            <th className="text-left">Role Code</th>
                            <th className="text-left">Description</th>
                            <th className="text-left">Date Created</th>
                            <th className="text-left">Status</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {testData.map(r => {
                            return (
                                <tr key={r.id}>
                                    <td>Test Role</td>
                                    <td>TEST_ROLE</td>
                                    <td>Ipsum Lorem Dolor</td>
                                    <td>{new Date().toLocaleDateString()}</td>
                                    <td>
                                        Active
                                    </td>
                                </tr>
                            );
                        })}

                    </tbody>
                </Table>
            </div>
        );
    }
}

export default class AdminAssignUserRoles extends FormContainerBase<AdminAssignUserRolesProps> {
    name = 'admin-assign-user-roles';
    reduxFormKey = 'roles';
    formFieldNames = {
        users: 'roles.users',
        userRoles: 'roles.userRoles',
        userRolesGrouped: 'roles.userRolesGrouped',
        // roles: 'roles.roles'
    };
    title: string = 'Assign User Roles';
    DetailComponent: React.SFC<DetailComponentProps> = ({ parentModelId }) => {
        const onButtonClicked = (ev: React.SyntheticEvent<any>, context: any, model: any) => {
            context.setActiveRow(model.id);
        };

        // If parentModelId is not supplied, the parent component is in a 'new' state, and its data has not been saved
        // Don't render the detail component
        if (!parentModelId) return null;

        return (
            <DataTable
                fieldName={`${this.formFieldNames.userRolesGrouped}['${parentModelId}']`}
                title={''} // Leave this blank
                buttonLabel={'Assign New Role'}
                displayHeaderActions={true}
                displayHeaderSave={false}
                actionsColumn={DataTable.ActionsColumn({
                    actions: [
                        ({ fields, index, model }) => <RemoveRow fields={fields} index={index} model={model} />,
                        ({ fields, index, model }) => { return (model && model.id) ? (<ExpireRow fields={fields} index={index} model={model} />) : null; }
                    ]
                })}
                columns={[
                    DataTable.SelectorFieldColumn('Assigned Role', { fieldName: 'roleId', colStyle: { width: '275px' }, selectorComponent: RoleSelector, displayInfo: true }),
                    // DataTable.StaticTextColumn('Description', { fieldName: 'description', colStyle: { width: '350px' }, displayInfo: false }),
                    // DataTable.StaticTextColumn('Role Code', { fieldName: 'roleCode', colStyle: { width: '180px' }, displayInfo: false }),
                    DataTable.DateColumn('Effective Date', 'effectiveDate', { colStyle: { width: '150px'}, displayInfo: true }),
                    // DataTable.DateColumn('Date Created', 'createdDtm'),
                    DataTable.DateColumn('Expiry Date', 'expiryDate', { colStyle: { width: '150px'}, displayInfo: true }),
                    DataTable.SelectorFieldColumn('Status', { colStyle: { width: '175px' }, displayInfo: true }),
                    DataTable.StaticTextColumn('Assigned By', { fieldName: 'createdBy', colStyle: { width: '200px' }, displayInfo: false }),
                    DataTable.StaticDateColumn('Date Assigned', { fieldName: 'createdDtm', colStyle: { width: '200px' }, displayInfo: false }),
                ]}
                expandable={false}
                rowComponent={EmptyDetailRow}
                initialValue={{
                    userId: parentModelId
                }}
                modalProps={{ userId: parentModelId }}
                modalComponent={EmptyDetailRow}
            />
        );
    }

    FormComponent = (props: FormContainerProps<AdminAssignUserRolesProps>) => {
        // TODO: We need to find a way to make sorting on multiple columns work, which probably involves figuring how to grab all the field values at once...
        const onFilterDisplayName = (event: Event, newValue: any, previousValue: any, name: string) => {
            const { setPluginFilters } = props;
            if (setPluginFilters) {
                console.log('setting plugin filters');
                setPluginFilters({
                    users: {
                        displayName: newValue
                    }
                });
            }
        };

        const onFilterBadgeNo = (event: Event, newValue: any, previousValue: any, name: string) => {
            const { setPluginFilters } = props;
            if (setPluginFilters) {
                console.log('setting plugin filters');
                setPluginFilters({
                    users: {
                        badgeNo: newValue
                    }
                });
            }
        };

        return (
            <div>
                <DataTable
                    fieldName={this.formFieldNames.users}
                    filterFieldName={(this.filterFieldNames) ? `${this.filterFieldNames.users}` : undefined}
                    title={''} // Leave this blank
                    buttonLabel={'Add User'}
                    displayHeaderActions={true}
                    displayActionsColumn={true}
                    actionsColumn={DataTable.ActionsColumn({
                        actions: [
                            ({ fields, index, model }) => { return (model && model.id) ? (<EditRow fields={fields} index={index} model={model} />) : null; },
                            ({ fields, index, model }) => <RemoveRow fields={fields} index={index} model={model} />,
                            ({ fields, index, model }) => { return (model && model.id) ? (<ExpireRow fields={fields} index={index} model={model} />) : null; }
                        ]
                    })}
                    columns={[
                        DataTable.StaticTextColumn('Full Name', { fieldName: 'displayName', colStyle: { width: '300px' }, displayInfo: false, filterable: true, filterColumn: onFilterDisplayName }),
                        // DataTable.StaticTextColumn('Last Name', { fieldName: 'lastName', colStyle: { width: '175px' }, displayInfo: false, filterable: true }),
                        // TODO: We temporarily disabled filtering on badgeNo, it's tied to the sheriff, not sure how to handle that case yet...
                        DataTable.StaticTextColumn('Badge No.', { fieldName: 'sheriff.badgeNo', colStyle: { width: '175px' }, displayInfo: false, filterable: false, filterColumn: onFilterBadgeNo }),
                        DataTable.StaticTextColumn('Rank', { fieldName: 'sheriff.rankCode', colStyle: { width: '175px' }, displayInfo: false, filterable: true }),
                        DataTable.MappedTextColumn('Gender', { fieldName: 'sheriff.genderCode', colStyle: { width: '175px' }, selectorComponent: GenderCodeDisplay, displayInfo: false, filterable: true }),
                        DataTable.MappedTextColumn('Home Location', { fieldName: 'sheriff.homeLocationId', colStyle: { width: '225px' }, selectorComponent: LocationDisplay, displayInfo: false, filterable: true }),
                        DataTable.MappedTextColumn('Current Location', { fieldName: 'sheriff.currentLocationId', colStyle: { width: '250px' }, selectorComponent: LocationDisplay, displayInfo: false, filterable: true }),
                        // DataTable.DateColumn('Date Created', 'createdDtm'),
                        // DataTable.SelectorFieldColumn('Status', { displayInfo: true }), // No point really in setting the status here

                    ]}
                    filterable={true}
                    expandable={true}
                    // expandedRows={[1, 2]}
                    rowComponent={this.DetailComponent}
                    modalComponent={EmptyDetailRow}
                />
            </div>
        );
    }

    DisplayComponent = (props: FormContainerProps<AdminAssignUserRolesDisplayProps>) => (
        <div>
            {/*<Alert>No roles exist</Alert>*/}
            <AdminAssignUserRolesDisplay {...props} />
        </div>
    )

    validate(values: AdminAssignUserRolesProps = {}): FormErrors | undefined {
        return undefined;
    }

    // TODO: Remove roleId from abstract
    // TODO: If we need to pre filter or server side filter,
    //  we'd implement filters here, filters is just a placeholder for now
    fetchData(dispatch: Dispatch<{}>, filters: {} | undefined) {
        dispatch(getLocations()); // This data needs to always be available for select lists
        dispatch(getSheriffs()); // This data needs to always be available for select lists
        dispatch(getUsers());
        dispatch(getUserRoles());
        dispatch(getRoles()); // This data needs to always be available for select lists
    }

    // OK, so how do we supply the filters...
    getData(state: RootState, filters: any | undefined) {
        // Get filter data
        const filterData = this.getFilterData(filters);
        // console.log('AdminAssignUserRoles filterData');
        // console.log(filterData);

        const locations = (filters && filters.locations)
            ? findAllLocations(filters.locations)(state)
            : getAllLocations(state);

        const users = (filters && filters.users)
            ? findAllUsers(filters.users)(state)
            : getAllUsers(state);

        // TODO: Finish this
        const sheriffs = (filters && filters.sheriffs)
            // ? findAllSheriffs(filters)(state)
            ? getAllSheriffs(state)
            : getAllSheriffs(state);

        const roles = (filters && filters.roles)
            ? findAllRoles(filters.roles)(state)
            : getAllRoles(state);

        const userRoles = (filters && filters.userRoles)
            ? findAllUserRoles(filters.userRoles)(state)
            : getAllUserRoles(state);

        const userRolesGrouped = (filters && filters.userRoles)
            ? findUserRolesGroupedByUserId(filters.userRoles)(state)
            : getUserRolesGroupedByUserId(state);

        return {
            ...filterData,
            locations,
            sheriffs,
            roles,
            users,
            userRoles,
            userRolesGrouped
        };
    }

    mapDeletesFromFormValues(map: any) {
        const deletedUserIds: IdType[] = [];
        const deletedUserRoleIds: IdType[] = [];

        if (map.users) {
            const initialValues = map.users.initialValues;
            const existingIds = map.users.values.map((val: any) => val.id);

            const removeUserIds = initialValues
                .filter((val: any) => (existingIds.indexOf(val.id) === -1))
                .map((val: any) => val.id);

            deletedUserIds.push(...removeUserIds);
        }

        if (map.userRolesGrouped) {
            const initialValues = map.userRolesGrouped.initialValues;

            const removeUserRoleIds = Object.keys(initialValues).reduce((acc: any, cur: any) => {
                const initValues = map.userRolesGrouped.initialValues[cur];
                const existingIds = map. userRolesGrouped.values[cur].map((val: any) => val.id);

                const removeIds = initValues
                    .filter((val: any) => (existingIds.indexOf(val.id) === -1))
                    .map((val: any) => val.id);

                return acc.concat(removeIds);
            }, []);

            deletedUserRoleIds.push(...removeUserRoleIds);
        }

        return {
            users: deletedUserIds,
            userRoles: deletedUserRoleIds
        };
    }

    getDataFromFormValues(formValues: {}, initialValues: {}): FormContainerProps {
        return super.getDataFromFormValues(formValues) || {
        };
    }

    async onSubmit(formValues: any, initialValues: any, dispatch: Dispatch<any>) {
        const data: any = this.getDataFromFormValues(formValues, initialValues) || {};
        const dataToDelete: any = this.getDataToDeleteFromFormValues(formValues, initialValues) || {};

        // Delete records before saving new ones!
        const deletedUsers: IdType[] = dataToDelete.users as IdType[];
        const deletedUserRoles: IdType[] = dataToDelete.userRoles as IdType[];

        const users: Partial<User>[] = (data.users) ? data.users.map((u: User) => ({
            ...u,
            // TODO: Need a way to set this stuff... createdBy, updated by fields should really be set in the backend using the current user
            // We're just going to set the fields here temporarily to quickly check if things are working in the meantime...
            createdBy: 'DEV - FRONTEND',
            updatedBy: 'DEV - FRONTEND',
            createdDtm: new Date().toISOString(),
            updatedDtm: new Date().toISOString(),
            revisionCount: 0 // TODO: Is there entity versioning anywhere in this project???
        })) : [];

        const userRoles: Partial<RoleApiScope>[] = (data.userRolesGrouped)
            ? Object.keys(data.userRolesGrouped)
                .reduce((acc, cur, idx) => {
                    return acc.concat(data.userRolesGrouped[cur]);
                }, [])
                .map((rs: RoleFrontendScope) => ({
                    ...rs,
                    createdBy: 'DEV - FRONTEND',
                    updatedBy: 'DEV - FRONTEND',
                    createdDtm: new Date().toISOString(),
                    updatedDtm: new Date().toISOString(),
                    revisionCount: 0
                }))
            : [];

        return Promise.all([
            dispatch(deleteUsers(deletedUsers)),
            dispatch(deleteUserRoles(deletedUserRoles)),
            dispatch(createOrUpdateUsers(users)),
            dispatch(createOrUpdateUserRoles(userRoles))
        ]);

    }
}
