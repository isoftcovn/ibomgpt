import ImageResizer from '@bam.tech/react-native-image-resizer';
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker';
import {AppStackParamList} from '@navigation/RouteParams';
import {FileHelper, FileType} from '@shared/helper/FileHelper';
import {IAppChatMessage} from 'app/presentation/models/chat';
import {useCallback, useState} from 'react';
import {DocumentPickerResponse, pick} from 'react-native-document-picker';
import {StackNavigationProp} from '@react-navigation/stack';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {DownloadManager} from '@shared/managers/DownloadManager';
import DropDownHolder from '@shared/helper/DropdownHolder';
import {useActionSheet} from '@expo/react-native-action-sheet';
import {useTranslation} from 'react-i18next';
import {theme} from '@theme/index';
import FileViewer from 'react-native-file-viewer';

export interface IPickerAsset {
    uri: string;
    path: string;
    name: string;
    size?: number;
    mime?: string;
}

interface IPickMediaResult {
    openPicker: () => Promise<IPickerAsset[]>;
}

interface IPickDocumentsResult {
    openDocumentsPicker: () => Promise<DocumentPickerResponse[]>;
}

export const usePickMediaAssets = (): IPickMediaResult => {
    const {showActionSheetWithOptions} = useActionSheet();
    const {t} = useTranslation();

    const processMedia = useCallback(async (responses: ImageOrVideo[]) => {
        const images = responses.filter(item => item.mime.startsWith('image'));
        const videos: IPickerAsset[] = responses
            .filter(item => item.mime.startsWith('video'))
            .map(item => ({
                name: item.filename ?? 'video',
                uri: item.path,
                path: item.path,
                size: item.size,
                mime: item.mime,
            }));
        const resizePromises = images.map(item => {
            return ImageResizer.createResizedImage(
                item.path,
                1024,
                1024,
                'JPEG',
                80,
            );
        });
        const resizedImages = await Promise.all(resizePromises);
        const results: IPickerAsset[] = resizedImages.map((item, index) => ({
            name: item.name,
            uri: item.uri,
            path: item.path,
            size: item.size,
            mime: images[index]?.mime,
        }));

        return results.concat(videos);
    }, []);

    const openLibrary = useCallback(async () => {
        try {
            const responses = await ImagePicker.openPicker({
                multiple: true,
                mediaType: 'any',
                compressVideoPreset: '960x540',
                compressImageQuality: 0.8,
                compressImageMaxWidth: 1024,
            });

            return processMedia(responses);
        } catch (error) {
            console.warn('Picker assets error: ', error);
        }

        return [];
    }, [processMedia]);

    const openCamera = useCallback(async () => {
        try {
            const responses = await ImagePicker.openCamera({
                mediaType: 'any',
                compressVideoPreset: '1280x720',
                compressImageQuality: 0.8,
                compressImageMaxWidth: 1024,
            });

            return processMedia([responses]);
        } catch (error) {
            console.warn('Picker assets error: ', error);
        }

        return [];
    }, [processMedia]);

    const openPicker = useCallback(() => {
        return new Promise<IPickerAsset[]>(async (resolve, reject) => {
            try {
                const options = [
                    t('useCamera'),
                    t('getFromlibrary'),
                    t('close'),
                ];
                const cancelButtonIndex = options.length - 1;

                showActionSheetWithOptions(
                    {
                        options,
                        cancelButtonIndex,
                        cancelButtonTintColor: theme.color.colorAccent,
                    },
                    async selectedIndex => {
                        switch (selectedIndex) {
                            case 0:
                                // Open camera
                                resolve(await openCamera());
                                break;
                            case 1:
                                // Open library
                                resolve(await openLibrary());
                                break;
                            default:
                                break;
                        }
                    },
                );
            } catch (error) {
                console.warn('Picker assets error: ', error);
            }
        });
    }, [showActionSheetWithOptions, t, openLibrary, openCamera]);

    return {
        openPicker,
    };
};

export const usePickDocuments = (): IPickDocumentsResult => {
    const openDocumentsPicker = useCallback(() => {
        return pick({
            allowMultiSelection: true,
        });
    }, []);

    return {
        openDocumentsPicker,
    };
};

export const useOnMessagePressed = (
    navigation: StackNavigationProp<AppStackParamList, 'Conversation'>,
) => {
    const [isVideoModalVisible, setVideoModalVisible] = useState(false);
    const [isAudioModalVisible, setAudioModalVisible] = useState(false);
    const [videoUri, setVideoUri] = useState<string>();
    const [audioUri, setAudioUri] = useState<string>();

    const openFile = useCallback((filePath: string) => {
        FileViewer.open(filePath, {
            showAppsSuggestions: true,
            showOpenWithDialog: true,
        });
    }, []);

    const downloadFile = useCallback(
        async (message: IAppChatMessage) => {
            try {
                const appFolderPath =
                    await FileHelper.shared.createAppFolderIfNeeded();
                const fileUrl = message.fileUrl ?? '';
                const fileName = fileUrl.split('/').pop();
                if (fileUrl && fileName) {
                    const filePath = `${appFolderPath}/${fileName}`;
                    const existed = await ReactNativeBlobUtil.fs.exists(
                        filePath,
                    );
                    if (existed) {
                        openFile(filePath);
                        return;
                    }
                    DownloadManager.shared.downloadNotificationSubject.next({
                        status: 'processing',
                        url: fileUrl,
                    });
                    await ReactNativeBlobUtil.config({
                        fileCache: true,
                        path: filePath,
                    }).fetch('GET', fileUrl);
                    DownloadManager.shared.downloadNotificationSubject.next({
                        status: 'done',
                        url: fileUrl,
                    });
                    openFile(filePath);
                }
            } catch (error) {
                console.warn('download file error: ', error);
            }
        },
        [openFile],
    );

    const onFileMessagePressed = useCallback(
        (message: IAppChatMessage) => {
            const fileType = message.fileType;
            if (!fileType) {
                return;
            }
            switch (fileType) {
                case FileType.pdf:
                    navigation.navigate('PdfViewer', {
                        url: message.fileUrl ?? '',
                    });
                    break;
                default:
                    downloadFile(message);
                    break;
            }
        },
        [navigation, downloadFile],
    );

    const onVideoMessagePressed = useCallback((message: IAppChatMessage) => {
        setVideoUri(message.video ?? '');
        setVideoModalVisible(true);
    }, []);

    const onAudioMessagePressed = useCallback((message: IAppChatMessage) => {
        setAudioUri(message.audio ?? '');
        setAudioModalVisible(true);
    }, []);

    const onMessagePressed = useCallback(
        (message: IAppChatMessage) => {
            const isFileMessage = (message.fileUrl?.length ?? 0) > 0;
            if (isFileMessage) {
                onFileMessagePressed(message);
                return;
            }
            if (message.video) {
                onVideoMessagePressed(message);
                return;
            }
            if (message.audio) {
                onAudioMessagePressed(message);
                return;
            }
        },
        [onFileMessagePressed, onVideoMessagePressed, onAudioMessagePressed],
    );

    return {
        onMessagePressed,
        isVideoModalVisible,
        videoUri,
        audioUri,
        isAudioModalVisible,
        setVideoModalVisible,
        setAudioModalVisible,
    };
};
