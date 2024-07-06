export enum ListState {
    initial,
    loading,
    refreshing,
    loadingMore,
    done
}

export interface IPickerItemModel {
    text: string;
    value: string;
}