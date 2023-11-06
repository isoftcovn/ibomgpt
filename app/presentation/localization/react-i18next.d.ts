import en from './en/translation.json';
declare module 'react-i18next' {
    // and extend them!
    interface CustomTypeOptions {
        // custom namespace type if you changed it
        defaultNS: 'translation';
        // custom resources type
        resources: {
            translation: typeof en;
        };
    }
}
