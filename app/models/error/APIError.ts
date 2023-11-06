export class APIError extends Error {
    statusCode?: number;
    code?: string;
    rawData?: any;

    constructor(message: string, statusCode: number | undefined, code: string | undefined, rawData: any | undefined) {
        super(message);
        this.name = 'APIError';
        this.statusCode = statusCode;
        this.code = code;
        this.rawData = rawData;
    }

    toString = () => this.message;
}
