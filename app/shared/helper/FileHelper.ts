import mime from 'mime-types';

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
}
