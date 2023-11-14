import { Subject } from 'rxjs';

export type DownloadNotificationStatus = 'processing' | 'done' | 'failed';

export interface IDownloadNotification {
    status: DownloadNotificationStatus;
    url: string;
    filePath?: string;
}

export class DownloadManager {
    static shared = new DownloadManager();

    downloadNotificationSubject = new Subject<IDownloadNotification>();
}
