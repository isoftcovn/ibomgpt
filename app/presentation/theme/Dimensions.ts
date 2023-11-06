import { Platform, Dimensions as RNDimensions } from 'react-native';
import { ms, s, vs } from 'react-native-size-matters';

const width = RNDimensions.get('window').width;

export interface IBreakpoints {
    smallPhone: number;
    phone: number;
    tablet: number;
}

export const Breakpoints: IBreakpoints = {
    smallPhone: 0,
    phone: 321,
    tablet: 768,
};

export type PhoneType = keyof typeof Breakpoints;
let phoneType: PhoneType;
if (width < Breakpoints.phone) {
    phoneType = 'smallPhone';
} else if (width < Breakpoints.tablet) {
    phoneType = 'phone';
} else {
    phoneType = 'tablet';
}

export const Dimensions = {
    // ...IphoneXHelper,
    breakpoints: Breakpoints,
    phoneType,
    navigationvBar: {
        height: Platform.OS === 'ios' ? 64 : 56,
    },
    moderateScale: ms,
    scale: s,
    verticalScale: vs,
    sizeFor: (sizes: IBreakpoints) => {
        switch (phoneType) {
            case 'smallPhone': return sizes.smallPhone;
            case 'phone': return sizes.phone;
            case 'tablet': return sizes.tablet;
        }
    },
    // getStatusBarHeight: (safe: boolean) => {
    //     return Platform.select({
    //         ios: IphoneXHelper.ifIphoneX(safe ? 44 : 30, 20),
    //         android: StatusBar.currentHeight,
    //         default: 0,
    //     });
    // },
    screenWidth: () => RNDimensions.get('window').width,
    screenHeight: () => RNDimensions.get('window').height,
};


