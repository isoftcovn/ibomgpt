import { StyleSheet } from 'react-native';

export const globalViewStyles = StyleSheet.create({
    shadow: {
        shadowColor: '#000',
        shadowOffset: {
            height: 3,
            width: 0,
        },
        shadowOpacity: 0.15,
        shadowRadius: 2,
        elevation: 5,
    },
    shadowAround: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 3.84,
        elevation: 5,
    },
    dummyShadowForAndroid: {
        elevation: 0,
    },
});
