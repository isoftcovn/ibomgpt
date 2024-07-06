import { IFieldValues } from '@components/FormGenerator/model';
import {IPickerItemModel} from '../models/general';

export interface IRichTextEditorNavigationParams {
    html?: string;
    onDone: (html: string) => void;
}

export interface IBomPickerNavgationParams {
    title: string;
    data: IPickerItemModel[];
    selectedItems: IPickerItemModel[];
    multiple: boolean;
    autofocus?: boolean;
    sourceAPI?: string;
    sourceAPIParams?: FormData;
    onSubmit: (selectedValues: Record<string, IPickerItemModel>) => void;
    onFetchDataSuccess?: (data: IPickerItemModel[]) => void;
}

export type AppStackParamList = {
    SplashScreen: undefined;
    SignIn: undefined;
    SignUpEmail: undefined;
    Languages: undefined;
    AppTab: undefined;
    HomeTab: undefined;
    HomeScreen: undefined;
    Conversation: {
        objectId: number;
        objectInstanceId: number;
        name?: string;
    };
    ParticipantList: {
        objectId: number;
        objectInstanceId: number;
    };
    ConversationInfo: {
        objectId: number;
        objectInstanceId: number;
    };
    CommonFilter: {
        title?: string;
        initialFilters?: Record<string, IFieldValues>;
        onSubmit: (values: Record<string, IFieldValues>, refAPI: string) => void;
    };
    PdfViewer: {
        url: string;
    };
    RichTextEditor: IRichTextEditorNavigationParams;
    IBomPicker: IBomPickerNavgationParams;
    DeveloperConsole: undefined;
    NetworkDebugger: undefined;
};

export type AllRouteParamList = AppStackParamList;
