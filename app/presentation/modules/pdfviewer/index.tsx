import { AppStackParamList } from '@navigation/RouteParams';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StyleSheet, View } from 'react-native';
import React from 'react';
import PdfView from 'react-native-pdf';
import LinkingHelper from '@shared/helper/LinkingHelper';

interface IProps {
    navigation: StackNavigationProp<AppStackParamList, 'PdfViewer'>;
    route: RouteProp<AppStackParamList, 'PdfViewer'>;
}

export const PdfViewer = (props: IProps) => {
    const { route } = props;
    const { url } = route.params;
    return <PdfView
        style={styles.container}
        source={{
            uri: url,
            cache: true,
        }}
        trustAllCerts={false}
        onPressLink={pressLink => LinkingHelper.openUrl(pressLink)}
        onLoadComplete={(numberOfPages) => {
            console.info('pdf loaded', numberOfPages);
        }}
        onLoadProgress={(percent) => {
            console.info('pdf load progress: ', percent);
        }}
        onError={error => {
            console.info('Load pdf error: ', error);
        }}
    />;
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
