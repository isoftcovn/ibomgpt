import { PageSize } from '@shared/constants';

export class ChatListRequestModel {
    page: number;
    limit: number;
    keysearch?: string;

    constructor(page?: number, limit?: number, keysearch?: string) {
        this.page = page ?? 1;
        this.limit = limit ?? PageSize.ChatList;
        this.keysearch = keysearch;
    }
}