import ImageResizer from '@bam.tech/react-native-image-resizer';
import { openPicker as openLibPicker } from '@baronha/react-native-multiple-image-picker';
import { pick, DocumentPickerResponse } from 'react-native-document-picker';
import { useCallback, useState } from 'react';

export interface IPickerAsset {
    uri: string;
    path: string;
    name: string;
    size?: number;
    mime?: string;
}

interface IPickMediaResult {
    assets: IPickerAsset[]
    openPicker: () => void;
}

interface IPickDocumentsResult {
    files: DocumentPickerResponse[];
    openDocumentsPicker: () => void;
}

export const usePickMediaAssets = (): IPickMediaResult => {
    const [assets, setAssets] = useState<IPickerAsset[]>([]);

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
            const results: IPickerAsset[] = resizedImages.map(item => ({
                name: item.name,
                uri: item.uri,
                path: item.path,
                size: item.size,
            }));

            setAssets(results.concat(videos));
        } catch (error) {
            console.warn('Picker assets error: ', error);
        }
    }, []);

    return {
        assets,
        openPicker
    };
};

export const usePickDocuments = (): IPickDocumentsResult => {
    const [files, setFiles] = useState<DocumentPickerResponse[]>([]);

    const openDocumentsPicker = useCallback(() => {
        pick({
            allowMultiSelection: true
        }).then(setFiles)
            .catch(error => {
                console.warn('Pick document error: ', error);
            });
    }, []);

    return {
        files,
        openDocumentsPicker,
    };
};
