import React from 'react';
import { FormFieldTextBox } from '../FormFields/TextBox';
import { FormFieldBaseProps } from '../model';
import { FormFieldDateBox } from '../FormFields/Datebox';
import { FormFieldSelectBox } from '../FormFields/Selectbox';
import { FormFieldCheckBox } from '../FormFields/Checkbox';
import { FormFieldTextArea } from '../FormFields/TextArea';
import { FormFieldFileBox } from '../FormFields/FilePicker';
import { FormFieldRemotePickerBox } from '../FormFields/RemotePicker';
import { FormFieldSet } from '../FormFields/FieldSet';
import { FormFieldsGroup } from '../FormFields/FieldsGroup';

interface IProps extends FormFieldBaseProps {}

export const FormFieldGenerator = React.memo((props: IProps) => {
    const { field } = props;
    const { input_type, type } = field;

    if (type === 'fieldgroup') {
        return <FormFieldsGroup {...props} />;
    }

    if (type === 'fieldset') {
        return <FormFieldSet {...props} />;
    }

    if (input_type === 'textbox') {
        return <FormFieldTextBox {...props} />;
    }

    if (input_type === 'textarea') {
        return <FormFieldTextArea {...props} />;
    }

    if (input_type === 'datebox') {
        return <FormFieldDateBox template={'row'} {...props} />;
    }

    if (input_type === 'selectbox') {
        return <FormFieldSelectBox {...props} />;
    }

    if (input_type === 'checkbox') {
        return <FormFieldCheckBox {...props} />;
    }

    if (input_type === 'm-file') {
        return <FormFieldFileBox {...props} />;
    }

    if (input_type === 'search-api' || input_type === 'm-search-api') {
        return <FormFieldRemotePickerBox {...props} />;
    }

    return null;
});
