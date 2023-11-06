import CountryModel from 'app/models/general/response/CountryModel';
import { IGeneralRepository } from '.';
import { IUseCase } from '../index';

export default class GetCountriesUseCase implements IUseCase<CountryModel[]> {
    generalRepository: IGeneralRepository;

    constructor(generalRepository: IGeneralRepository) {
        this.generalRepository = generalRepository;
    }

    execute = (): Promise<CountryModel[]> => {
        return Promise.resolve(this.generalRepository.getCountries());
    };
}
