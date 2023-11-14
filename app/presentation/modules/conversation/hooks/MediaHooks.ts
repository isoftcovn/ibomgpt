import ImageResizer from '@bam.tech/react-native-image-resizer';
import { openPicker as openLibPicker } from '@baronha/react-native-multiple-image-picker';
import { AppStackParamList } from '@navigation/RouteParams';
import { FileHelper, FileType } from '@shared/helper/FileHelper';
import { IAppChatMessage } from 'app/presentation/models/chat';
import { useCallback } from 'react';
import { DocumentPickerResponse, pick } from 'react-native-document-picker';
import { StackNavigationProp } from '@react-navigation/stack';
import ReactNativeBlobUtil from 'react-native-blob-util';

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
    const openPicker = useCallback(async () => {
        try {
            const responses = await openLibPicker({
                selectedAssets: [],
                singleSelectedMode: false,
                isExportThumbnail: false,
                maxSelectedAssets: 10,
                usedCameraButton: true,
            });
            const images = responses.filter(item => item.type === 'image');
            const videos: IPickerAsset[] = responses.filter(item => item.type === 'video').map(item => ({
                name: item.fileName,
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
        } catch (error) {
            console.warn('Picker assets error: ', error);
        }

        return [];
    }, []);

    return {
        openPicker
    };
};

export const usePickDocuments = (): IPickDocumentsResult => {
    const openDocumentsPicker = useCallback(() => {
        return pick({
            allowMultiSelection: true
        });
    }, []);

    return {
        openDocumentsPicker,
    };
};

export const useOnMessagePressed = (navigation: StackNavigationProp<AppStackParamList, 'Conversation'>) => {
    const downloadFile = useCallback(async (message: IAppChatMessage) => {
        try {
            const appFolderPath = await FileHelper.shared.createAppFolderIfNeeded();
            const fileUrl = message.fileUrl ?? '';
            const fileName = fileUrl.split('/').pop();
            if (fileUrl && fileName) {
                await ReactNativeBlobUtil
                    .config({
                        path: `${appFolderPath}/${fileName}`,
                    })
                    .fetch('GET', fileUrl);
            }
        } catch (error) {
            console.warn('download file error: ', error);
        }
    }, []);

    const onFileMessagePressed = useCallback((message: IAppChatMessage) => {
        const fileType = message.fileType;
        if (!fileType) { return; }
        switch (fileType) {
            case FileType.pdf:
                navigation.navigate('PdfViewer', {
                    url: message.fileUrl ?? ''
                });
                break;
            default:
                downloadFile(message);
                break;
        }
    }, [navigation, downloadFile]);

    const onMessagePressed = useCallback((message: IAppChatMessage) => {
        const isFileMessage = (message.fileUrl?.length ?? 0) > 0;
        if (isFileMessage) {
            onFileMessagePressed(message);
            return;
        }
    }, [onFileMessagePressed]);

    return {
        onMessagePressed
    };
};
