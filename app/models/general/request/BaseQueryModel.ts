import {PageSize} from '../../../shared/constants';

export default class BaseQueryModel {
    page: number;
    pageSize: number;

    constructor() {
        this.page = 1;
        this.pageSize = PageSize.Default;
    }
}
