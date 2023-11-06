export interface IUseCase<T> {
    execute: () => Promise<T>;
}
