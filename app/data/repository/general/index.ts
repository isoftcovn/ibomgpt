import ApiGateway from '@data/gateway/api';
import { AppResource } from '@data/gateway/api/resource';
import { AppVersionResponse } from '@models/general/response/AppVersionModel';
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

    checkAppVersion = async (versionName: string, platform: 'ios' | 'android'): Promise<AppVersionResponse> => {
        const resource = AppResource.General.CheckVersion();
        const formData = new FormData();
        formData.append('versionName', versionName);
        formData.append('platform', platform);
        const apiGateway = new ApiGateway({
            method: 'POST',
            resource: resource,
            body: formData,
        });
        const response = await apiGateway.execute();
        return AppVersionResponse.parseFromResponse(response);
    };

}
