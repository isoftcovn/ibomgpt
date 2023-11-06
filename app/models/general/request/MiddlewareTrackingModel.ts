export class MiddlewareTrackingModel {
    action: string;
    value: number | string;
    contentId: number | string;
    metadata?: Record<string, any>;

    constructor(action: string, contentId: number | string) {
        this.action = action;
        this.value = 0;
        this.contentId = contentId;
    }
}
