import {PageSize} from '../../../shared/constants';

export default class BaseQueryModel {
    page: number;
    limit: number;

    [others: string]: any;

    constructor() {
        this.page = 1;
        this.limit = PageSize.Default;
    }
}
