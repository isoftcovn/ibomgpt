import {IAppChatMessage} from 'app/presentation/models/chat';
import {Subject} from 'rxjs';
import {MeasureOnSuccessCallback} from '../components/CustomBubble.model';

export interface IModalUpdaterPayload {
    visible?: boolean;
    message?: IAppChatMessage;
    viewMeasured?: MeasureOnSuccessCallback;
}

class ContextMenuModalHelper {
    private static instance: ContextMenuModalHelper;
    showModalUpdater: Subject<IModalUpdaterPayload>;

    private constructor() {
        this.showModalUpdater = new Subject<IModalUpdaterPayload>();
    }

    public static getInstance(): ContextMenuModalHelper {
        if (!ContextMenuModalHelper.instance) {
            ContextMenuModalHelper.instance = new ContextMenuModalHelper();
        }
        return ContextMenuModalHelper.instance;
    }

    public showContextMenu(payload: IModalUpdaterPayload) {
        this.showModalUpdater.next({
            ...payload,
            visible: true,
        });
    }

    public hideContextMenu(payload: IModalUpdaterPayload) {
        this.showModalUpdater.next({
            ...payload,
            visible: false,
        });
    }
}

export default ContextMenuModalHelper.getInstance();
