export class PaginationModel<T> {
    items: T[];
    totalItemCount: number;
    totalItemLoaded: number;
    page: number;
    pageSize: number;

    constructor(items: T[], page: number, pageSize: number, totalItemCount: number = 0, totalItemLoaded: number = 0) {
        this.items = items;
        this.page = page;
        this.pageSize = pageSize;
        this.totalItemCount = totalItemCount;
        this.totalItemLoaded = totalItemLoaded;
    }
}