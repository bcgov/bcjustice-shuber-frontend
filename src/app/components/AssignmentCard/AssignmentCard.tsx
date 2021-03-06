import React from 'react';
import { Assignment } from '../../api';
import AssignmentDutyAddModal from '../../containers/AssignmentDutyAddModal';
import './AssignmentCard.css';

export interface AssignmentCardProps {
    assignment: Assignment;
}

export default class AssignmentCard extends React.PureComponent<AssignmentCardProps, {}> {
    render() {
        const { assignment: { title, id } } = this.props;
        return (
            <div className="assignment-card" >
                <div className="assignment-card-title" title={title}>
                    {title}
                </div>
                <div className="assignment-actions">
                    <AssignmentDutyAddModal assignmentId={id}/>
                </div>
            </div>            
        );
    }
}
