import { AppVersionResponse } from '@models/general/response/AppVersionModel';
import CountryModel from 'app/models/general/response/CountryModel';

export interface IGeneralRepository {
    getCountries: () => Array<CountryModel>;
    checkAppVersion: (versionName: string, platform: 'ios' | 'android') => Promise<AppVersionResponse>;
}
