import CountryModel from 'app/models/general/response/CountryModel';
import { createListViewActionTypes } from '../../helper';

export const getCountryType = 'GET_COUNTRIES';
export const getCountryActionTypes = createListViewActionTypes<any, CountryModel[]>(getCountryType);
