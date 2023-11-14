import { AppStackParamList } from '@navigation/RouteParams';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StyleSheet, View } from 'react-native';
import React from 'react';
import PdfView from 'react-native-pdf';

interface IProps {
    navigation: StackNavigationProp<AppStackParamList, 'PdfViewer'>;
    route: RouteProp<AppStackParamList, 'PdfViewer'>;
}

export const PdfViewer = (props: IProps) => {
    const { navigation, route } = props;
    const { url } = route.params;
    return <View style={styles.container}>
        <PdfView
            source={{
                uri: url
            }}
            trustAllCerts
        />
    </View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
