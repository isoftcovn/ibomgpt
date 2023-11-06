import { createActionTypes } from '../helper';

export const changeLanguageType = 'CHANGE_LANGUAGE';
export const changeLanguageTypes = createActionTypes<string, any>(changeLanguageType);
