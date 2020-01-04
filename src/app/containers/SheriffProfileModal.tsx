import React from 'react';
import { RootState } from '../store';
import {
    Modal
} from 'react-bootstrap';
import {
    Sheriff,
    IdType
} from '../api';
import { connect } from 'react-redux';
import { IModalInjectedProps, connectModal } from 'redux-modal';
import { ConnectedShowModalButton } from './ConnectedShowModalButton';
import { show as showModal, hide as hideModal } from 'redux-modal';
import { Button } from 'react-bootstrap';
import { Glyphicon } from 'react-bootstrap';
import { getSheriff } from '../modules/sheriffs/selectors';
import SheriffProfile from './SheriffProfile';

interface SheriffProfileModalProps {
    sheriffId: IdType;
    isEditing?: boolean;
}

interface SheriffProfileModalStateProps {
    sheriff: Sheriff;
}

export interface SheriffProfileModalDispatchProps {
    showSheriffProfileModal: (sheriffId: IdType, isEditing: boolean) => void;
}

type CompositeProps =
    SheriffProfileModalProps & SheriffProfileModalDispatchProps & SheriffProfileModalStateProps & IModalInjectedProps;
class SheriffProfileModal extends React.PureComponent<CompositeProps> {

    render() {
        const {
            // sheriff,
            show,
            handleHide,
            isEditing = false,
            showSheriffProfileModal,
            sheriffId
        } = this.props;

        return (
            <Modal
                show={show}
                onHide={handleHide}
                // TODO: Accept a prop for dialogClassName...
                dialogClassName="modal-medium"
                style={{
                    maxSize: '70%'
                }}
            >
                <Modal.Header closeButton={true}>
                    {isEditing && 'Updating'} User Profile
                </Modal.Header>
                <Modal.Body>
                    {!isEditing && <Button
                        bsStyle="primary"
                        style={{ position: 'absolute', right: 15 }}
                        onClick={() => showSheriffProfileModal(sheriffId, true)}
                    >
                        <Glyphicon glyph="pencil" />
                    </Button>}
                    <SheriffProfile
                        isEditing={isEditing}
                        sheriffId={sheriffId}
                        onSubmitSuccess={() => showSheriffProfileModal(sheriffId, false)}
                    />
                </Modal.Body>
                {isEditing &&
                    <Modal.Footer>
                        <div>
                            <Button onClick={() => showSheriffProfileModal(sheriffId, false)}>
                                Cancel
                            </Button>
                            <SheriffProfile.SubmitButton>
                                Save
                            </SheriffProfile.SubmitButton>
                        </div>
                    </Modal.Footer>}
            </Modal>
        );
    }
}

const modalConfig = {
    name: 'SheriffProfileModal'
};

const showAction = (sheriffId: IdType, isEditing: boolean = false, sectionName?: string) => {
    const modalProps = { sheriffId, isEditing, sectionName };
    return showModal(modalConfig.name, modalProps);
};

const mapStateToModalProps = (state: RootState, { sheriffId }: SheriffProfileModalProps) => {
    const newProps = { sheriff: getSheriff(sheriffId)(state) as Sheriff };
    return newProps;
};

const mapDispatchToModalProps = () => {
    const newProps = { showSheriffProfileModal: showAction };
    return newProps;
};

const ConnectedModal = connect<
    SheriffProfileModalStateProps, SheriffProfileModalDispatchProps, SheriffProfileModalProps, RootState>(
        mapStateToModalProps,
        mapDispatchToModalProps
)(SheriffProfileModal) as any;

const ReduxModal = connectModal(modalConfig)(ConnectedModal);

export default class extends ReduxModal {
    static modalName = modalConfig.name;
    static ShowAction = showAction;
    static ShowButton = (props: SheriffProfileModalProps) => {
        return <ConnectedShowModalButton modalName={modalConfig.name} modalProps={props} />;
    };

    static HideAction = () => hideModal(modalConfig.name);
}
