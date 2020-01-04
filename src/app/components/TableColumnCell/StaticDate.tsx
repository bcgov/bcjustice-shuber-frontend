import * as React from 'react';
import { Field } from 'redux-form';

import { Glyphicon } from 'react-bootstrap';

import * as Types from './types';

import DateColumn from './Date';

const StaticDateColumn = (label?: string, options?: Types.FieldColumnOptions): Types.TableColumnCell => {
    label = label || '';

    const fieldName = (options && options.fieldName) ? options.fieldName : 'textField';
    const displayInfo = (options && options.displayInfo) ? options.displayInfo : false;
    const colStyle = (options && options.colStyle) ? options.colStyle : {};
    const placeholder = (options && options.placeholder) ? options.placeholder : undefined;
    const filterable = (options && options.filterable) ? options.filterable : false;

    const filterComponentOptions = (options)
        ? Object.create(options) as Types.FieldColumnOptions
        : {} as Types.FieldColumnOptions;

    filterComponentOptions.filterable = false;
    filterComponentOptions.displayInfo = false;

    return {
        title: label,
        colStyle: colStyle,
        filterable: filterable,
        // TODO: Finish me!
        filterComponent: (filterable) ? DateColumn('Date', fieldName, filterComponentOptions) : undefined,
        displayInfo,
        FormRenderer: ({ fieldInstanceName }) => (
            <Field
                // TODO: Pass in field name as prop or whatever
                name={`${fieldInstanceName}.${fieldName}`}
                component={(p) => <span className="table-cell-text">{new Date(p.input.value).toDateString()}</span>}
            />
        ),
        CanceledRender: ({ model }) => (<div>StaticDate Cancelled Display</div>)
    };
};

export default StaticDateColumn;
