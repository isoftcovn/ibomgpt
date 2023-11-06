import { createSelector } from 'reselect';

export const selectGeneral = createSelector(
    (state: any) => state.general,
    general => general
);

export const selectCountries = createSelector(
    (state: any) => selectGeneral(state),
    general => general.countries
);

export const selectCountryData = createSelector(
    (state: any) => selectCountries(state),
    countries => countries.data
);

export const selectStaticPage = createSelector(
    (state: any) => selectGeneral(state),
    general => general.staticPage
);

export const selectLanguage = createSelector(
    (state: any) => selectGeneral(state),
    general => general.language
);

export default {
    selectGeneral,
    selectCountries,
    selectStaticPage,
    selectCountryData,
    selectLanguage,
};
