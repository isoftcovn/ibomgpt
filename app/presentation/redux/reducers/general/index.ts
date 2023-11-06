import countryReducer from 'app/presentation/redux/reducers/general/countries';
import { combineReducers } from 'redux';
import languageReducer from './languages';

export const general = combineReducers({
    countries: countryReducer.reducer,
    language: languageReducer.reducer,
});
