import React from 'react';
import {
    Table
} from 'react-bootstrap';
import {
    FormErrors
} from 'redux-form';

import { Dispatch } from 'redux';

import {
    getFrontendScopes
} from '../../modules/roles/actions';

import { RootState } from '../../store';

import {
    getAllFrontendScopes
} from '../../modules/roles/selectors';

import { IdType } from '../../api';

import {
    FormContainerBase,
    FormContainerProps,
} from '../../components/Form/FormContainer';

import DataTable, { EmptyDetailRow } from '../../components/Table/DataTable';

import FrontendScopeSelector from './FrontendScopeSelector';

export interface AdminFrontendScopesProps extends FormContainerProps {
    frontendScopes?: any[];
}

export interface AdminFrontendScopesDisplayProps extends FormContainerProps {

}

class AdminFrontendScopesDisplay extends React.PureComponent<AdminFrontendScopesDisplayProps, any> {
    render() {
        const { data = [] } = this.props;

        // TODO: Rip out dummy data
        const testData = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];
        return (
            <div>
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

export default class AdminFrontendScopesGrid extends FormContainerBase<AdminFrontendScopesProps> {
    name = 'roles';
    formFieldNames = {
        frontendScopes: 'roles.frontendScopes'
    };
    title: string = 'Register Components';

    FormComponent = (props: FormContainerProps<AdminFrontendScopesProps>) => {
        return (
            <div>
                <DataTable
                    fieldName={this.formFieldNames.frontendScopes}
                    title={''} // Leave this blank
                    buttonLabel={'Add Component'}
                    displayHeaderActions={true}
                    columns={[
                        DataTable.SelectorFieldColumn('Component', { fieldName: 'id', selectorComponent: FrontendScopeSelector, displayInfo: true, disabled: true }),
                        DataTable.TextFieldColumn('Code', { fieldName: 'code', displayInfo: true, disabled: true }),
                        DataTable.TextFieldColumn('Description', { fieldName: 'description', displayInfo: true, disabled: true })
                    ]}
                    rowComponent={EmptyDetailRow}
                    modalComponent={EmptyDetailRow}
                />
            </div>
        );
    }

    // TODO: Figure out why Fragments aren't working...
    DisplayComponent = (props: FormContainerProps<AdminFrontendScopesDisplayProps>) => (
        <div>
            {/*<Alert>No roles exist</Alert>*/}
            <AdminFrontendScopesDisplay {...props} />
        </div>
    )

    validate(values: AdminFrontendScopesProps = {}): FormErrors | undefined {
        return undefined;
    }

    // TODO: Not sure if this should be roleId or what, I'm not there yet...
    fetchData(roleId: IdType, dispatch: Dispatch<{}>) {
        dispatch(getFrontendScopes()); // This data needs to always be available for select lists
    }

    getData(roleId: IdType, state: RootState) {
        const frontendScopes = getAllFrontendScopes(state) || undefined;
        return {
            frontendScopes
        };
    }

    getDataFromFormValues(formValues: {}): FormContainerProps {
        return super.getDataFromFormValues(formValues) || {
        };
    }
}
