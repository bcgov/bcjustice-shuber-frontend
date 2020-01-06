import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Button, Glyphicon, Well } from 'react-bootstrap';

// import { IdType } from '../api';
import Page from '../components/Page/Page';
import AdminForm from '../containers/AdminForm';
import { AdminFormProps } from '../components/AdminForm/AdminForm';

// Import plugins
import AdminRolesGridPlugin from '../plugins/AdminRoles/AdminRoles';
import SheriffProfileCreateModal from '../containers/SheriffProfileCreateModal';
import HeaderSaveButton from '../plugins/AdminRoles/containers/HeaderSaveButton';

export interface ManageRolesProps extends RouteComponentProps<any>{}

class ManageRoles extends React.PureComponent<AdminFormProps & Partial<ManageRolesProps>> {
    state = {
      isEditing: true
    };

    constructor(props: AdminFormProps) {
        super(props);

        this.toggleEditMode = this.toggleEditMode.bind(this);
    }

    toggleEditMode() {
        this.setState({
            isEditing: !this.state.isEditing
        });
    }

    render() {
        const { history, location } = this.props;
        const { isEditing } = this.state;

        return (
            <Page
                toolbar={
                    <Page.Toolbar
                        // TODO: Figure out a better way to space this... just a temporary placeholder / spacer for now
                        left={(
                            <div style={{ flex: 1, display: 'flex', position: 'relative', justifyContent: 'center', paddingTop: '10px' }}>
                                <div className="admin-form-filters-toggle">
                                    <Glyphicon glyph="chevron-down" />&nbsp;&nbsp;Display Role Search Filters
                                </div>
                            </div>
                        )}
                        right={(
                            <div style={{ marginTop: 3, paddingTop: '10px' }}>
                                <HeaderSaveButton formName={'AdminForm'} />
                                &nbsp;&nbsp;
                                <Button
                                    bsStyle="danger"
                                    // onClick={() => this.handleSave()}
                                >
                                    <Glyphicon glyph="ban-circle" /> Cancel
                                </Button>
                            </div>
                        )}
                    />
                }
            >
                <Well
                    style={{
                        display: 'flex',
                        backgroundColor: 'white',
                        flexDirection: 'column',
                        flex: '1 1',
                        maxWidth: '100%',
                        minWidth: 800,
                        height: 'max-content',
                        margin: '0 auto',
                        borderRadius: 0
                    }}
                >
                    <AdminForm
                        key={'admin-roles-grid'}
                        plugins={[
                            new AdminRolesGridPlugin()
                        ]}
                        isEditing={isEditing}
                    />
                </Well>
            </Page>
        );
    }
}

export default withRouter(ManageRoles);
