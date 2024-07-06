import { AppStackParamList } from '@navigation/RouteParams';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {StyleProp, ViewStyle} from 'react-native';

// fieldset means group of inputs are similar
export type FormType = 'string' | 'fieldset' | 'int' | 'fieldgroup';
export type FormInputType =
    | 'search-api'
    | 'm-search-api'
    | 'textbox'
    | 'radio'
    | 'select'
    | 'selectbox'
    | 'datebox'
    | 'textarea'
    | 'hidden'
    | 'checkbox'
    | 'm-file';

export interface IFormInputParams {
    key: string;
    type: 'fix' | 'dynamic';
    value: string;
}

export interface IFormSelectInputOption {
    id: number;
    text: string;
    is_selected?: 1 | 0;
}

export interface IFormDynamicInput {
    id: string; // field name
    label: string;
    ref_api?: string;
    method?: 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE';
    param?: IFormInputParams[];
    type?: FormType;
    input_type: FormInputType;
    max?: number;
    min?: number;
    is_required?: 1 | 0;
    format_date?: string;
    value?: string;
    value_text?: string;
    options?: IFormSelectInputOption[];
    items?: IFormDynamicInput[];
    groupContainerStyle?: StyleProp<ViewStyle>;
    fieldContainerStyle?: StyleProp<ViewStyle>;
    fieldContentStyle?: StyleProp<ViewStyle>;
    fieldContentSpacerStyle?: StyleProp<ViewStyle>;
    fieldSelectedFilesContainerStyle?: StyleProp<ViewStyle>;
}

export interface FormFieldBaseProps {
    field: IFormDynamicInput;
    navigation: StackNavigationProp<AppStackParamList, any>;
    route: RouteProp<AppStackParamList, any>;
}

export interface IFileValue {
    name: string;
    type?: string;
    uri: string;
}

export interface IFieldValues {
    text: string;
    value: string | number | IFileValue[];
}
