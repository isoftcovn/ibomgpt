import GeneratedImages from '@assets/GeneratedImages';
import {theme} from '@theme/index';
import React, {useCallback, useMemo} from 'react';
import {
    Image,
    StyleProp,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface IProps {
    title: string;
    unselectedText?: string;
    selectedText?: string;
    selectedList?: string[];
    required?: boolean;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
    onPress: () => void;
    onDeletePress?: (index: number) => void;
}

export const PickerButton = React.memo((props: IProps) => {
    const {
        onPress,
        onDeletePress,
        title,
        required,
        unselectedText,
        selectedText,
        selectedList,
        style,
        disabled,
    } = props;
    const displayText = useMemo(() => {
        return selectedText ? selectedText : unselectedText || 'Lựa chọn';
    }, [selectedText, unselectedText]);

    const renderSingleContent = useCallback(() => {
        return (
            <Text style={[theme.textVariants.body2, styles.content]}>
                {displayText}
            </Text>
        );
    }, [displayText]);

    const renderMultipleContent = useCallback(() => {
        if (selectedList?.length) {
            return (
                <View
                    style={{
                        paddingHorizontal: 15,
                    }}>
                    {selectedList.map((item, index) => {
                        return (
                            <View
                                style={styles.multipleSelectButton}
                                key={item}>
                                <Text style={styles.multipleContent}>
                                    {item}
                                </Text>
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    hitSlop={{
                                        bottom: 5,
                                        left: 5,
                                        right: 5,
                                        top: 5,
                                    }}
                                    onPress={() => {
                                        onDeletePress?.(index);
                                    }}>
                                    <Image
                                        style={styles.deleteIcon}
                                        source={GeneratedImages.ic_x}
                                        resizeMode={'contain'}
                                    />
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                </View>
            );
        }

        return null;
    }, [selectedList, onDeletePress]);

    return (
        <View style={style}>
            <Text style={[theme.textVariants.body2, styles.title]}>
                {title}{' '}
                {required ? (
                    <Text style={styles.requiredMark}> (*)</Text>
                ) : null}
            </Text>
            <TouchableOpacity
                style={styles.selectButton}
                activeOpacity={0.8}
                disabled={disabled}
                onPress={onPress}>
                {selectedList?.length
                    ? renderMultipleContent()
                    : renderSingleContent()}
                <AntDesign
                    name="right"
                    size={14}
                    color={theme.color.labelColor}
                />
            </TouchableOpacity>
        </View>
    );
});

const styles = StyleSheet.create({
    title: {
        alignItems: 'center',
        textAlignVertical: 'center',
        color: theme.color.colorPrimary,
    },
    requiredMark: {
        color: 'red',
    },
    content: {
        color: '#000',
        textAlign: 'right',
        marginRight: 4,
        marginLeft: 8,
        flex: 1,
    },
    multipleContent: {
        color: '#000',
        flex: 1,
    },
    selectButton: {
        borderBottomWidth: 0.5,
        borderColor: theme.color.colorSeparator,
        paddingBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: 8,
        marginTop: 8,
    },
    multipleSelectButton: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 60,
        backgroundColor: '#fff',
        marginBottom: 8,
        elevation: 2,
        shadowOffset: {
            height: 2,
            width: 0,
        },
        shadowRadius: 3,
        shadowColor: '#000',
        shadowOpacity: 0.2,
    },
    deleteButton: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: -3,
        top: -5,
    },
    deleteIcon: {
        width: 8,
        height: 8,
        tintColor: '#fff',
    },
});
