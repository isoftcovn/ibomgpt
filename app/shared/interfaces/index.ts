export interface IDataList<T> {
    byId: {
        [key: string]: T
    };
    ids: string[];
}

export interface ISectionData<T> {
    [key: string]: T;
}
