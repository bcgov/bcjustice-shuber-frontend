import React from 'react';
import {
    Button, Glyphicon
} from 'react-bootstrap';
import {
    submit
} from 'redux-form';
import { connect } from 'react-redux';
import { ButtonProps } from 'react-bootstrap';

export interface SaveButtonProps extends Partial<ButtonProps> {
    model?: any;
    modelId?: string;
    formName: string,
    submit?: () => void;
    onSave?: () => void;
}

class SaveButton extends React.PureComponent<SaveButtonProps>{
    private handleSave() {
        const { submit, onSave } = this.props;
        if (submit) {
            submit();
        }
        if (onSave) {
            onSave();
        }
    }
    render() {
        const { formName, model, submit, children = 'Save', style = {}, ...rest } = this.props;
        const { bsStyle = 'success' } = rest;

        return (
            <Button
                bsStyle="success"
                style={{ marginLeft: '10px' }}
                onClick={() => this.handleSave()}
            >
                <Glyphicon glyph="ok" />
            </Button>
        );
    }
}

const mapDispatchToProps = (dispatch: any, ownProps: SaveButtonProps) => {
    return {
        submit: () => dispatch(submit(ownProps.formName))
    };
};

export default connect<SaveButtonProps>(null, mapDispatchToProps)(SaveButton);
