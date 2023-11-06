import { Dimensions, Platform } from 'react-native';

const isIphoneX = () => {
    const dimen = Dimensions.get('window');
    return (
        Platform.OS === 'ios' &&
        !Platform.isPad &&
        !Platform.isTV &&
        ((dimen.height === 780 || dimen.width === 780)
            || (dimen.height === 812 || dimen.width === 812)
            || (dimen.height === 844 || dimen.width === 844)
            || (dimen.height === 896 || dimen.width === 896)
            || (dimen.height === 926 || dimen.width === 926))
    );
};

const ifIphoneX = (iphoneXStyle: any, regularStyle: any) => {
    if (isIphoneX()) {
        return iphoneXStyle;
    }
    return regularStyle;
};

const getBottomSpace = () => {
    return isIphoneX() ? 34 : 0;
};

const iPhoneXHelper = {
    isIphoneX,
    ifIphoneX,
    getBottomSpace,
};

export default iPhoneXHelper;
