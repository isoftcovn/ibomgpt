import { TextStyle, ViewStyle } from 'react-native';
export interface ITextVariant extends TextStyle {
    fontFamily: string;
    fontSize: number;
    fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
}

export interface ITheme {
    color: {
        colorPrimary: string,
        colorPrimaryVariant: string,
        onPrimary: string,

        colorAccent: string,

        colorSecondary: string,
        colorSecondaryVariant: string,

        backgroundColorPrimary: string,
        backgroundColorVariant: string,
        onBackground: string,

        textColor: string,
        labelColor: string,
        textColorSecondary: string,

        inputBackgroundColor: string,

        buttonBackgroundColor: string,
        buttonBorderColor: string,

        colorSeparator: string,

        navigationBackgroundColor: string,
        navigationTintColor: string,

        success: string,
        danger: string,
        failure: string,
    };
    spacing: {
        extraTiny: number,
        tiny: number,
        small: number,
        medium: number,
        large: number,
        extraLarge: number,
        huge: number,
        extraHuge: number,
        extraExtraHuge: number,
        giant: number
    };
    fontSize: {
        fontSizeVeryVeryTiny: number,
        fontSizeVeryTiny: number,
        fontSizeTiny: number,
        fontSizeSmall: number,
        fontSizeMedium: number,
        fontSizeLarge: number,
        fontSizeExtraLarge: number,
        fontSizeExtraExtraLarge: number,
        fontSizeHuge: number,
        fontSizeGiant: number,
    };
    textVariants: {
        header: ITextVariant,
        subHeader: ITextVariant,
        title1: ITextVariant,
        title2: ITextVariant,
        title3: ITextVariant,
        subtitle1: ITextVariant,
        subtitle2: ITextVariant,
        body1: ITextVariant,
        body2: ITextVariant,
        body3: ITextVariant,
        label1: ITextVariant,
        label2: ITextVariant,
        button1: ITextVariant,
        button2: ITextVariant,
    };
    buttonVariants: {
        filled: {
            button: ViewStyle,
            text: TextStyle
        },
        outline: {
            button: ViewStyle,
            text: TextStyle
        },
        transparent: {
            button: ViewStyle,
            text: TextStyle
        },
    }
}
