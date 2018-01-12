import * as React from 'react';
import {
    Form,
    Image,
    Button,
    ListGroup,
    ListGroupItem,
    Glyphicon
} from 'react-bootstrap';
import {
    Field,
    FieldArray,
    InjectedFormProps
} from 'redux-form';
import { Validators } from '../../../infrastructure';
import {
    TextFormField,
    TrainingTypeSelector,
    DateField
} from '../../../components/Form';




export interface SheriffFormProps {
    handleSubmit?: () => void;
    onSubmitSuccess?: () => void;
}

interface TrainingProps {
    type?: string;

}

class TrainingFieldArray extends FieldArray<TrainingProps> {

}



export default class SheriffForm extends React.Component<SheriffFormProps & InjectedFormProps<any,SheriffFormProps>, any>{

    render() {
        const { handleSubmit } = this.props;

        return (
            <div>
                <Form onSubmit={handleSubmit} >

                    <Image responsive src="/img/avatar.png" circle width="150" height="150" />
                    <br />
                    <Field name="firstName" component={TextFormField} label="First Name" validate={[Validators.required]} />
                    <Field name="lastName" component={TextFormField} label="Last Name" validate={[Validators.required]} />
                    <Field name="badgeNumber" component={TextFormField} label="Badge Number" validate={[Validators.number, Validators.required]} />

                    <br />
                    
                    <h3>Worksite Details</h3>
                    <Field name="permanentLocation" component={TextFormField} label="Permanent Location" />
                    <Field name="permanentWorksite" component={TextFormField} label="Permanent Worksite" />
                    <Field name="currentLocation" component={TextFormField} label="Current Location" />
                    <Field name="currentWorksite" component={TextFormField} label="Current Worksite" />
                   
                    <br />
                    <h3>Training</h3>
                    <TrainingFieldArray name="training" component={(p) => {
                        const { fields } = p;
                        return (
                            <ListGroup >
                                {fields.map((trainingFieldName, index) => {
                                    return (
                                        <ListGroupItem key={index}>              
                                         <Button bsStyle="danger" onClick={() => fields.remove(index)} className="pull-right"><Glyphicon glyph="trash" /></Button><br/>                                                                     
                                            <Field name={`${trainingFieldName}.trainingType`} component={TrainingTypeSelector} label="Training Type " />
                                            <Field name={`${trainingFieldName}.certificationDate`} component={DateField} label="Certification Date" />
                                            <Field name={`${trainingFieldName}.expiryDate`} component={DateField} label="Expiry Date" />
                                        </ListGroupItem>)
                                }
                                )}
                                <br/>
                                <Button onClick={() => fields.push({})} ><Glyphicon glyph="plus" /></Button>
                            </ListGroup>
                        )
                    }} />
                </Form>

            </div>
        );


    }
}
