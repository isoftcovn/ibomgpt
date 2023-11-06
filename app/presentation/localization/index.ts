import i18n from 'i18next';
import { getI18n, initReactI18next } from 'react-i18next';

import en from 'app/presentation/localization/en/translation.json';
import vi from 'app/presentation/localization/vi/translation.json';

export const configureLocalization = (locale: string, fallback = 'vi_VN') => {
    return i18n
        .use(initReactI18next)
        .init({
            compatibilityJSON: 'v3',
            lng: locale,
            fallbackLng: fallback,

            resources: {
                en: {
                    translation: en,
                },
                vi_VN: {
                    translation: vi,
                },
            },

            debug: false,

            cache: {
                enabled: true,
            },

            interpolation: {
                escapeValue: false, // not needed for react as it does escape per default to prevent xss!
            },
        });
};

export const getString = (key: keyof typeof en, params?: any) => {
    if (getI18n()) {
        return getI18n().t(key, params);
    }
    return '';
};

export enum Languages {
    english = 'en',
    vietnamese = 'vi_VN'
}

export const LANGUAGES = {
    ENGLISH: 'en',
    VIETNAMESE: 'vi_VN',
};

export const changeLanguage = (language: Languages): Promise<string> => {
    return new Promise((resolve, reject) => {
        i18n.changeLanguage(language).then(() => {
            resolve('success');
        }).catch(reject);
    });

};
