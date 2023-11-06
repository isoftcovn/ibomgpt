import { StyleSheet } from 'react-native';
import { theme } from 'app/presentation/theme';
import IphoneXHelper from 'app/shared/helper/IPhoneXHelper';

const PADDING = 8;
const BORDER_RADIUS = 5;
const FONT_SIZE = theme.textVariants.body1.fontSize;
const HIGHLIGHT_COLOR = 'rgba(0,118,255,0.9)';
const FONT_FAMILY = theme.textVariants.body1.fontFamily;

export default StyleSheet.create({
    overlayStyle: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.7)',
        // backgroundColor: 'white'
    },

    optionContainer: {
        maxHeight: '33%',
        width: '100%',
        padding: PADDING,
        backgroundColor: 'white',
        paddingBottom: IphoneXHelper.isIphoneX() ? IphoneXHelper.getBottomSpace() : PADDING,
    },

    cancelContainer: {
        alignSelf: 'stretch',
    },

    selectStyle: {
        borderColor: '#ccc',
        borderWidth: 1,
        padding: PADDING,
        borderRadius: BORDER_RADIUS,
    },

    selectTextStyle: {
        textAlign: 'center',
        color: '#333',
        fontSize: FONT_SIZE,
        fontFamily: FONT_FAMILY,
    },

    cancelStyle: {
        // borderRadius: BORDER_RADIUS,
        // backgroundColor: 'rgba(255,255,255,0.8)',
        backgroundColor: 'white',
        padding: PADDING,
    },

    cancelTextStyle: {
        textAlign: 'center',
        color: '#333',
        fontSize: FONT_SIZE,
        fontFamily: FONT_FAMILY,
    },

    optionStyle: {
        padding: PADDING,
        alignItems: 'center',
        // borderBottomWidth: 1,
        // borderBottomColor: '#ccc'
    },

    optionTextStyle: {
        // textAlign: 'center',
        fontSize: FONT_SIZE,
        color: HIGHLIGHT_COLOR,
        fontFamily: FONT_FAMILY,
    },

    sectionStyle: {
        padding: PADDING * 2,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },

    sectionTextStyle: {
        textAlign: 'center',
        fontSize: FONT_SIZE,
        fontFamily: FONT_FAMILY,
    },
});
