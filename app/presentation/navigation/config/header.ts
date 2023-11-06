import { StackNavigationOptions } from '@react-navigation/stack';
import { theme } from 'app/presentation/theme';

export const createDefaultStackNavigationOptions = (): StackNavigationOptions => {
    return {
        headerTitleStyle: {
            ...theme.textVariants.header,
            color: theme.color.navigationTintColor,
        },
        headerBackTitleStyle: {
            ...theme.textVariants.header,
        },
        headerTintColor: theme.color.navigationTintColor,
        headerStyle: {
            backgroundColor: theme.color.navigationBackgroundColor,
        },
        presentation: 'card',
        headerMode: 'screen',
        animationTypeForReplace: 'pop',
    };
};
