import {Box} from '@components/globals/view/Box';
import {TextPrimary} from '@components/index';
import {FileHelper, FileType} from '@shared/helper/FileHelper';
import {
    DownloadManager,
    DownloadNotificationStatus,
} from '@shared/managers/DownloadManager';
import {Dimensions} from '@theme/Dimensions';
import {theme} from '@theme/index';
import {IAppChatMessage} from 'app/presentation/models/chat';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {BubbleProps} from 'react-native-gifted-chat';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export const FileMessage = React.memo((props: BubbleProps<IAppChatMessage>) => {
    const {currentMessage} = props;
    const [downloadStatus, setDownloadStatus] =
        useState<DownloadNotificationStatus>('notStarted');
    const [isSupportedOpenFile, setIsSupportedOpenFile] = useState(true);
    const fileUrl = useMemo(
        () => currentMessage?.fileUrl ?? '',
        [currentMessage],
    );

    const checkFileExists = useCallback((fileName: string) => {
        const filePath = FileHelper.shared.getFilePath(fileName);
        ReactNativeBlobUtil.fs
            .exists(filePath)
            .then(existed => {
                if (existed) {
                    setDownloadStatus('done');
                }
            })
            .catch(error => {
                console.warn('Check file exists error: ', error);
            });
    }, []);

    useEffect(() => {
        const fileType = currentMessage?.fileType;
        const fileName = fileUrl.split('/').pop() ?? '';
        const _isSupportedOpenFile = fileType !== FileType.others;
        checkFileExists(fileName);
        setIsSupportedOpenFile(_isSupportedOpenFile);
    }, [currentMessage, fileUrl, checkFileExists]);

    useEffect(() => {
        const subscription =
            DownloadManager.shared.downloadNotificationSubject.subscribe(
                value => {
                    if (fileUrl === value.url) {
                        setDownloadStatus(value.status);
                    }
                },
            );

        return () => {
            subscription.unsubscribe();
        };
    }, [fileUrl]);

    const downloadIcon = useMemo(() => {
        switch (downloadStatus) {
            case 'notStarted':
            case 'failed':
                return (
                    <Ionicons
                        name={'cloud-download-outline'}
                        size={Dimensions.moderateScale(18)}
                        color={theme.color.textColor}
                    />
                );
            case 'processing':
                return (
                    <ActivityIndicator
                        size={'small'}
                        color={theme.color.textColor}
                    />
                );
            case 'done':
                return (
                    <Ionicons
                        name={'cloud-done-outline'}
                        size={Dimensions.moderateScale(18)}
                        color={theme.color.success}
                    />
                );
        }
        return null;
    }, [downloadStatus]);

    const renderIcon = useCallback(() => {
        const fileType = currentMessage?.fileType;
        const iconSize = Dimensions.moderateScale(24);

        if (fileType === FileType.xlsx) {
            return (
                <MaterialCommunityIcons
                    name={'file-excel'}
                    size={iconSize}
                    color={theme.color.textColor}
                />
            );
        }

        if (fileType === FileType.docx) {
            return (
                <Foundation
                    name={'page-doc'}
                    size={iconSize}
                    color={theme.color.textColor}
                />
            );
        }

        if (fileType === FileType.pdf) {
            return (
                <FontAwesome5
                    name={'file-pdf'}
                    size={iconSize}
                    color={theme.color.textColor}
                />
            );
        }

        return (
            <Ionicons
                name={'document-outline'}
                size={iconSize}
                color={theme.color.textColor}
            />
        );
    }, [currentMessage?.fileType]);

    if (currentMessage) {
        const fileName = fileUrl.split('/').pop() ?? '';
        return (
            <View style={styles.left.fileContainer}>
                {renderIcon()}
                <Box marginLeft={theme.spacing.small} />
                <TextPrimary
                    style={styles.left.fileNameMessage}
                    numberOfLines={2}>
                    {fileName}
                </TextPrimary>
                {!isSupportedOpenFile && (
                    <>
                        <Box marginLeft={theme.spacing.small} />
                        {downloadIcon}
                    </>
                )}
            </View>
        );
    }

    return null;
});

const styles = {
    left: StyleSheet.create({
        fileNameMessage: {
            maxWidth: (Dimensions.screenWidth() / 3) * 2,
            ...theme.textVariants.body1,
            color: theme.color.textColor,
            fontWeight: '400',
        },
        fileContainer: {
            padding: theme.spacing.small,
            flexDirection: 'row',
            alignItems: 'center',
        },
    }),
    right: StyleSheet.create({}),
};
