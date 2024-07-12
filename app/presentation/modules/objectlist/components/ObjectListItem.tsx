import {ObjectItemResponse} from '@models/chat/response/ObjectItemResponse';
import {theme} from '@theme/index';
import HTML, {
    HTMLContentModel,
    HTMLElementModel,
} from 'react-native-render-html';
import Entopy from 'react-native-vector-icons/Entypo';
import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from 'react-native';

interface IProps {
    item: ObjectItemResponse;
    onPress: () => void;
}

const renderers = {
    icondocin: ({
        tnode,
        onPress,
        propsFromParent,
        sharedProps,
        style,
        textProps,
        type,
        viewProps,
        InternalRenderer,
        TDefaultRenderer,
    }) => {
        return (
            <View
                style={{
                    width: 20,
                    height: 20,
                    paddingTop: 4,
                    marginRight: 2,
                }}>
                <Entopy
                    name={'arrow-bold-left'}
                    size={20}
                    color={theme.color.success}
                />
            </View>
        );
    },
    icondocout: ({
        tnode,
        onPress,
        propsFromParent,
        sharedProps,
        style,
        textProps,
        type,
        viewProps,
        InternalRenderer,
        TDefaultRenderer,
    }) => {
        return (
            <View
                style={{
                    width: 20,
                    height: 20,
                    paddingTop: 4,
                    marginRight: 2,
                }}>
                <Entopy
                    name={'arrow-bold-right'}
                    size={20}
                    color={theme.color.danger}
                />
            </View>
        );
    },
};

export const ObjectListItem = React.memo((props: IProps) => {
    const {item, onPress} = props;
    const {width} = useWindowDimensions();

    return (
        <View style={styles.flatList}>
            <TouchableOpacity style={styles.flatListItem} onPress={onPress}>
                <HTML
                    contentWidth={width - 32}
                    baseFontStyle={{
                        ...theme.textVariants.body3,
                        color: '#000',
                    }}
                    tagsStyles={{
                        p: {
                            marginTop: 4,
                            marginBottom: 0,
                        },
                        div: {
                            marginTop: 4,
                            marginBottom: 0,
                        },
                        ul: {
                            marginTop: 4,
                            marginBottom: 0,
                            paddingBottom: 0,
                        },
                        li: {
                            marginBottom: 0,
                            paddingBottom: 0,
                        },
                    }}
                    renderers={renderers}
                    source={{
                        html: item.rowInfo ?? '',
                    }}
                />
            </TouchableOpacity>
        </View>
    );
});

const styles = StyleSheet.create({
    flatList: {
        backgroundColor: '#fff',
    },
    flatListItem: {
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        paddingTop: 12,
        paddingBottom: 16,
    },
    Title: {
        color: theme.color.colorPrimary,
    },
    txtBottom: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    bottomLine: {
        height: 1,
        backgroundColor: theme.color.colorSeparator,
        marginHorizontal: 18,
    },
    titleRow: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    row: {
        flexDirection: 'row',
    },
    status: {
        fontStyle: 'italic',
        color: theme.color.danger,
    },
});
