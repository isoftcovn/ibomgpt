import { ITheme } from 'app/presentation/theme/ThemeInterface';
import { colorPalettes } from './ColorPalettes';
import { Dimensions } from './Dimensions';

const moderateScale = (size: number) => size;

const FontSize = {
    fontSizeVeryVeryTiny: Dimensions.sizeFor({
        smallPhone: moderateScale(6),
        phone: moderateScale(8),
        tablet: moderateScale(10),
    }),
    fontSizeVeryTiny: Dimensions.sizeFor({
        smallPhone: moderateScale(8),
        phone: moderateScale(10),
        tablet: moderateScale(12),
    }),
    fontSizeTiny: Dimensions.sizeFor({
        smallPhone: moderateScale(10),
        phone: moderateScale(12),
        tablet: moderateScale(14),
    }),
    fontSizeSmall: Dimensions.sizeFor({
        smallPhone: moderateScale(12),
        phone: moderateScale(14),
        tablet: moderateScale(16),
    }),
    fontSizeMedium: Dimensions.sizeFor({
        smallPhone: moderateScale(14),
        phone: moderateScale(16),
        tablet: moderateScale(18),
    }),
    fontSizeLarge: Dimensions.sizeFor({
        smallPhone: moderateScale(16),
        phone: moderateScale(18),
        tablet: moderateScale(20),
    }),
    fontSizeExtraLarge: Dimensions.sizeFor({
        smallPhone: moderateScale(18),
        phone: moderateScale(20),
        tablet: moderateScale(22),
    }),
    fontSizeExtraExtraLarge: Dimensions.sizeFor({
        smallPhone: moderateScale(20),
        phone: moderateScale(22),
        tablet: moderateScale(24),
    }),
    fontSizeHuge: Dimensions.sizeFor({
        smallPhone: moderateScale(22),
        phone: moderateScale(24),
        tablet: moderateScale(26),
    }),
    fontSizeGiant: Dimensions.sizeFor({
        smallPhone: moderateScale(30),
        phone: moderateScale(32),
        tablet: moderateScale(34),
    }),
};

const color = {
    colorPrimary: colorPalettes.primary['500'],
    colorPrimaryVariant: colorPalettes.primary['300'],

    colorAccent: colorPalettes.primary['900'],

    colorSecondary: colorPalettes.blueGray['500'],
    colorSecondaryVariant: colorPalettes.blueGray['300'],

    backgroundColorPrimary: colorPalettes.greyScale['100'],
    backgroundColorVariant: colorPalettes.greyScale['200'],

    textColor: colorPalettes.black,
    textColorSecondary: colorPalettes.white,
    labelColor: colorPalettes.greyScale['500'],

    inputBackgroundColor: colorPalettes.white,

    colorSeparator: colorPalettes.greyScale['500'],

    buttonBackgroundColor: colorPalettes.primary['500'],
    buttonBorderColor: colorPalettes.greyScale['300'],

    navigationBackgroundColor: colorPalettes.greyScale['300'],
    navigationTintColor: colorPalettes.primary['500'],

    danger: colorPalettes.danger['700'],
    failure: colorPalettes.danger['700'],
    success: colorPalettes.success['700'],
};

const spacing = {
    extraTiny: Dimensions.sizeFor({
        smallPhone: moderateScale(2),
        phone: moderateScale(2),
        tablet: moderateScale(4),
    }),
    tiny: Dimensions.sizeFor({
        smallPhone: moderateScale(2),
        phone: moderateScale(4),
        tablet: moderateScale(8),
    }),
    small: Dimensions.sizeFor({
        smallPhone: moderateScale(4),
        phone: moderateScale(8),
        tablet: moderateScale(12),
    }),
    medium: Dimensions.sizeFor({
        smallPhone: moderateScale(8),
        phone: moderateScale(12),
        tablet: moderateScale(16),
    }),
    large: Dimensions.sizeFor({
        smallPhone: moderateScale(12),
        phone: moderateScale(16),
        tablet: moderateScale(20),
    }),
    extraLarge: Dimensions.sizeFor({
        smallPhone: moderateScale(16),
        phone: moderateScale(20),
        tablet: moderateScale(24),
    }),
    huge: Dimensions.sizeFor({
        smallPhone: moderateScale(20),
        phone: moderateScale(24),
        tablet: moderateScale(28),
    }),
    extraHuge: Dimensions.sizeFor({
        smallPhone: moderateScale(24),
        phone: moderateScale(28),
        tablet: moderateScale(32),
    }),
    extraExtraHuge: Dimensions.sizeFor({
        smallPhone: moderateScale(28),
        phone: moderateScale(32),
        tablet: moderateScale(40),
    }),
    giant: Dimensions.sizeFor({
        smallPhone: moderateScale(32),
        phone: moderateScale(40),
        tablet: moderateScale(48),
    }),
};

export const FontNames = {
    Bold: 'OpenSans-Bold',
    SemiBold: 'OpenSans-SemiBold',
    Normal: 'OpenSans-Regular',
};

export const themeDefault: ITheme = {
    color,
    spacing,
    fontSize: FontSize,
    textVariants: {
        header: {
            fontFamily: FontNames.SemiBold,
            fontSize: FontSize.fontSizeMedium,
            fontWeight: '500',
        },
        subHeader: {
            fontFamily: FontNames.Normal,
            fontSize: FontSize.fontSizeTiny,
            fontWeight: '500',
        },
        title1: {
            fontFamily: FontNames.Bold,
            fontSize: FontSize.fontSizeLarge,
            fontWeight: '500',
        },
        title2: {
            fontFamily: FontNames.Bold,
            fontSize: FontSize.fontSizeLarge,
            fontWeight: '500',
        },
        title3: {
            fontFamily: FontNames.Bold,
            fontSize: FontSize.fontSizeLarge,
            fontWeight: '500',
        },
        subtitle1: {
            fontFamily: FontNames.SemiBold,
            fontSize: FontSize.fontSizeSmall,
            fontWeight: '500',
        },
        subtitle2: {
            fontFamily: FontNames.SemiBold,
            fontSize: FontSize.fontSizeSmall,
            fontWeight: '500',
        },
        body1: {
            fontFamily: FontNames.Normal,
            fontSize: FontSize.fontSizeMedium,
            fontWeight: '300',
        },
        body2: {
            fontFamily: FontNames.Normal,
            fontSize: FontSize.fontSizeSmall,
            fontWeight: '300',
        },
        body3: {
            fontFamily: FontNames.Normal,
            fontSize: FontSize.fontSizeTiny,
            fontWeight: '300',
        },
        button1: {
            fontFamily: FontNames.Normal,
            fontSize: FontSize.fontSizeMedium,
            fontWeight: '300',
        },
        button2: {
            fontFamily: FontNames.Normal,
            fontSize: FontSize.fontSizeSmall,
            fontWeight: '300',
        },
        label1: {
            fontFamily: FontNames.Normal,
            fontSize: FontSize.fontSizeTiny,
            fontWeight: '300',
        },
        label2: {
            fontFamily: FontNames.Normal,
            fontSize: FontSize.fontSizeVeryTiny,
            fontWeight: '300',
        },
    },
    buttonVariants: {
        filled: {
            button: {
                borderRadius: 3,
                backgroundColor: color.buttonBackgroundColor,
                paddingHorizontal: spacing.huge,
                paddingVertical: spacing.small,
            },
            text: {
                fontFamily: FontNames.Normal,
                fontSize: FontSize.fontSizeMedium,
                fontWeight: '300',
                color: color.textColorSecondary,
            },
        },
        outline: {
            button: {
                borderRadius: 3,
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: color.colorPrimary,
                paddingHorizontal: spacing.huge,
                paddingVertical: spacing.small,
            },
            text: {
                fontFamily: FontNames.Normal,
                fontSize: FontSize.fontSizeMedium,
                fontWeight: '300',
                color: color.colorPrimary,
            },
        },
        transparent: {
            button: {
                backgroundColor: 'transparent',
                paddingHorizontal: spacing.huge,
                paddingVertical: spacing.small,
            },
            text: {
                fontFamily: FontNames.Normal,
                fontSize: FontSize.fontSizeMedium,
                fontWeight: '300',
                color: color.colorPrimary,
            },
        },
    },
};
