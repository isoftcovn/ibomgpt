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
        headerBackTitleVisible: false,
        headerTintColor: theme.color.navigationTintColor,
        headerStyle: {
            backgroundColor: theme.color.navigationBackgroundColor,
        },
        headerLeftContainerStyle: {
            paddingLeft: theme.spacing.small
        },
        headerRightContainerStyle: {
            paddingRight: theme.spacing.small
        },
        headerBackAllowFontScaling: false,
        presentation: 'card',
        headerMode: 'screen',
        animationTypeForReplace: 'pop',
    };
};
