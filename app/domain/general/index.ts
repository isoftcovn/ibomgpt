import CountryModel from 'app/models/general/response/CountryModel';

export interface IGeneralRepository {
    getCountries: () => Array<CountryModel>;
}
