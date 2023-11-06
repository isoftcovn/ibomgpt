import { createActionTypes } from '../../helper';

export const initAppType = 'INIT_APP';
export const initAppActionTypes = createActionTypes<any, any>(initAppType);
