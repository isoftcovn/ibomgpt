import {useField} from 'formik';
import React, {useCallback, useMemo, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {FormFieldBaseProps, IFieldValues, IFileValue} from '../../model';
import {useTranslation} from 'react-i18next';
import {theme} from '@theme/index';
import TextPrimary from '@components/globals/text/TextPrimary';

interface IProps extends FormFieldBaseProps {}

export const FormFieldFileBox = React.memo((props: IProps) => {
    const {field} = props;
    const {label, is_required} = field;
    const [showModalImage, setShowModalImage] = useState(false);
    const {t} = useTranslation();

    const validate = useCallback(
        (value: IFieldValues | undefined) => {
            const files = Array.isArray(value?.value ?? [])
                ? (value?.value as IFileValue[])
                : [];
            if (is_required && files.length === 0) {
                return t('warn_empty');
            }

            return undefined;
        },
        [is_required, t],
    );

    const [formikField, meta, helpers] = useField<IFieldValues | undefined>({
        name: field.id,
        validate,
    });

    const listFile = useMemo(
        () => (formikField.value?.value || []) as IFileValue[],
        [formikField.value],
    );

    const _pickImage = useCallback(
        (camera = false) => {
            if (camera) {
                ImagePicker.openCamera({
                    includeBase64: false,
                }).then(response => {
                    let filename = response.filename;
                    if (!filename) {
                        filename = new Date().getTime().toString();
                    }
                    const result = [
                        {
                            name: `Image${filename}.jpg`,
                            type: response.mime,
                            uri: response.path,
                        },
                        ...listFile,
                    ];
                    setShowModalImage(false);
                    helpers.setValue({
                        text: '',
                        value: result,
                    });
                });
                return;
            }
            ImagePicker.openPicker({
                multiple: true,
                maxFiles: 5,
                includeBase64: false,
            }).then(response => {
                let arr: any[] = [];
                response.forEach(item => {
                    let filename = item.filename;
                    if (!filename) {
                        filename = item.modificationDate ?? item.creationDate;
                    }
                    arr.push({
                        name: item?.filename || `Image${filename}.jpg`,
                        type: item.mime,
                        uri: item?.sourceURL || item.path,
                    });
                });
                setShowModalImage(false);
                const files = listFile;
                helpers.setValue({
                    text: '',
                    value: [...files, ...arr],
                });
            });
        },
        [listFile, helpers],
    );

    const _pickFile = useCallback(async () => {
        let arrFile: any[] = [];
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            res.forEach(element => {
                arrFile.push({
                    name: element.name,
                    type: element.type,
                    uri: element.uri,
                });
            });
            const files = listFile;
            helpers.setValue({
                text: '',
                value: [...files, ...arrFile],
            });
        } catch (err: any) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            }
        }
    }, [listFile, helpers]);

    const _deleteFile = useCallback(
        (index: number) => {
            const restFile = [...listFile];
            restFile.splice(index, 1);

            helpers.setValue({
                text: '',
                value: restFile,
            });
        },
        [listFile, helpers],
    );

    const _renderFiles = useCallback(
        (item: any, index: number) => {
            return (
                <View key={index} style={styles.fileStyle}>
                    <Entypo
                        name="attachment"
                        size={16}
                        color={theme.color.labelColor}
                    />
                    <TextPrimary
                        numberOfLines={1}
                        style={[
                            theme.textVariants.body1,
                            {color: 'black', marginHorizontal: 5},
                        ]}>
                        {item.name}
                    </TextPrimary>
                    <TouchableOpacity onPress={() => _deleteFile(index)}>
                        <AntDesign
                            name="closecircle"
                            size={16}
                            color={theme.color.labelColor}
                        />
                    </TouchableOpacity>
                </View>
            );
        },
        [_deleteFile],
    );

    const renderBt = useCallback((title: string, onPress: () => void) => {
        return (
            <TouchableOpacity
                onPress={onPress}
                style={{
                    borderTopWidth: 0.5,
                    paddingVertical: 10,
                    borderColor: 'gray',
                }}>
                <TextPrimary
                    style={{textAlign: 'center', ...theme.textVariants.body1}}>
                    {title}
                </TextPrimary>
            </TouchableOpacity>
        );
    }, []);

    const renderModalPickImage = useCallback(() => {
        return (
            <Modal
                style={{justifyContent: 'flex-end'}}
                isVisible={showModalImage}
                onBackdropPress={() => setShowModalImage(false)}>
                <View
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: 8,
                    }}>
                    {renderBt('Chụp ảnh', () => {
                        _pickImage(true);
                    })}
                    {renderBt('Thư viện ảnh', () => {
                        _pickImage(false);
                    })}
                </View>
                <TouchableOpacity
                    onPress={() => {
                        setShowModalImage(false);
                    }}
                    style={{
                        borderRadius: 8,
                        paddingVertical: 10,
                        backgroundColor: 'white',
                        marginTop: 10,
                    }}>
                    <TextPrimary
                        style={{
                            textAlign: 'center',
                            ...theme.textVariants.subtitle1,
                            color: 'red',
                        }}>
                        {'Huỷ'}
                    </TextPrimary>
                </TouchableOpacity>
            </Modal>
        );
    }, [renderBt, _pickImage, showModalImage]);

    return (
        <View style={[styles.container, field.fieldContainerStyle]}>
            <View style={[styles.row, field.fieldContentStyle]}>
                <TextPrimary style={[styles.label, {flex: 1}]}>
                    {label}
                    {is_required ? (
                        <TextPrimary
                            style={[styles.label, {color: theme.color.danger}]}>
                            {' '}
                            {'*'}
                        </TextPrimary>
                    ) : null}
                </TextPrimary>
                {field.fieldContentSpacerStyle && (
                    <View style={field.fieldContentSpacerStyle} />
                )}
                <TouchableOpacity
                    onPress={() => {
                        setShowModalImage(true);
                    }}>
                    <Feather
                        name="camera"
                        size={25}
                        color={theme.color.colorPrimary}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={_pickFile}
                    style={{paddingHorizontal: 10}}>
                    <MaterialIcons
                        name="add"
                        size={25}
                        color={theme.color.colorPrimary}
                    />
                </TouchableOpacity>
            </View>
            <View
                style={[
                    {
                        alignItems: 'center',
                        alignSelf: 'center',
                        marginBottom: 10,
                    },
                    field.fieldSelectedFilesContainerStyle,
                ]}>
                {listFile.map((item, index) => {
                    return _renderFiles(item, index);
                })}
            </View>
            {meta.error && meta.touched ? (
                <TextPrimary style={[styles.error]}>{meta.error}</TextPrimary>
            ) : null}
            {renderModalPickImage()}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        alignItems: 'stretch',
        marginVertical: 8,
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    label: {
        ...theme.textVariants.body2,
        color: theme.color.colorPrimary,
    },
    error: {
        ...theme.textVariants.body3,
        fontSize: theme.fontSize.fontSizeTiny,
        color: theme.color.danger,
        marginTop: 4,
    },
    datebox: {
        borderRadius: 20,
        height: 40,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: theme.color.colorSeparator,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dateText: {
        ...theme.textVariants.body1,
        color: '#000',
    },
    fileStyle: {
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'white',
        marginTop: 8,
        padding: 5,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
});
