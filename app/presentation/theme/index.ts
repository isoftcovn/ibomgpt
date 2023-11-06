import { themeDefault } from 'app/presentation/theme/ThemeDefault';
import React from 'react';

export const theme = {
    ...themeDefault,
};

export const ThemeContext = React.createContext(theme);
