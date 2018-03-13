import * as React from 'react';
import {
    Panel,
    OverlayTrigger,
    Button,
    Glyphicon,
    Popover
} from 'react-bootstrap';
import { Assignment } from '../api/index';
import AssignmentDragSource from '../containers/AssignmentDragSource';
import AssignmentDetails from './AssignmentDetails';

export interface AssignmentCardProps {
    onClick?: () => void;
    assignment: Assignment;
    currentGroupId: number;
}

export default class AssignmentCard extends React.PureComponent<AssignmentCardProps, {}> {
    render() {
        const { currentGroupId, assignment: { title, id }, assignment } = this.props;
        const showAssignmentDetails = (
            <Popover id="popover-trigger-focus">
                <AssignmentDetails assignment={assignment} />
            </Popover>
        );
        return (
            <AssignmentDragSource id={id} currentGroupId={currentGroupId} >
                <Panel bsStyle="primary">
                    <h3>{title}</h3>
                    <OverlayTrigger trigger="focus" placement="right" overlay={showAssignmentDetails}>
                        <Button><Glyphicon glyph="menu-right" /></Button>
                    </OverlayTrigger>
                </Panel>
            </AssignmentDragSource>
        );

    }
}