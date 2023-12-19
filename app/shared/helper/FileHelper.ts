import mime from 'mime-types';
import { Platform } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';

const dirs = ReactNativeBlobUtil.fs.dirs;

export enum FileType {
    image,
    video,
    audio,
    pdf,
    others
}

export class FileHelper {
    static shared = new FileHelper();

    getContentTypeFromExtension = (extension: string): string => {
        const refinedExtension = extension.trim().replaceAll('.', '');
        return mime.types[refinedExtension] ?? '';
    };

    getFileTypeFromExtensions = (extension: string): FileType => {
        const contentType = this.getContentTypeFromExtension(extension);
        if (contentType.startsWith('image')) {
            return FileType.image;
        }
        if (contentType.startsWith('video')) {
            return FileType.video;
        }
        if (contentType.startsWith('audio')) {
            return FileType.audio;
        }
        if (contentType === 'application/pdf') {
            return FileType.pdf;
        }
        return FileType.others;
    };

    getAppFolderPath = (): string => {
        return Platform.OS === 'ios' ? `${dirs.DocumentDir}/Downloads` : dirs.DownloadDir;
    };

    getFilePath = (fileName: string): string => {
        return `${this.getAppFolderPath()}/${fileName}`;
    };

    createAppFolderIfNeeded = async (): Promise<string> => {
        const appFolderPath = this.getAppFolderPath();
        const folderExisted = await ReactNativeBlobUtil.fs.exists(appFolderPath);
        console.info('App Folder path: ', appFolderPath);
        if (!folderExisted) {
            await ReactNativeBlobUtil.fs.mkdir(appFolderPath);
            console.info('App Folder created');
        }

        return appFolderPath;
    };
}
