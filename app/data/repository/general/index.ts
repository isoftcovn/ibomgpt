import { IGeneralRepository } from 'app/domain/general';
import CountryModel from 'app/models/general/response/CountryModel';

export class GeneralRepository implements IGeneralRepository {
    static countryJson: any;
    getCountries = (): Array<CountryModel> => {
        if (GeneralRepository.countryJson === undefined) {
            GeneralRepository.countryJson = require('../../../assets/country.json');
        }

        const countries: Array<CountryModel> = GeneralRepository.countryJson.map((item: any) => CountryModel.parseFromJson(item));
        return countries;
    };
}
