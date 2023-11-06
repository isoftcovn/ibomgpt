export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

export class PropertyRequiredError extends ValidationError {
    property: string;
    constructor(property: string) {
        super('No property: ' + property);
        this.name = 'PropertyRequiredError';
        this.property = property;
    }
}
