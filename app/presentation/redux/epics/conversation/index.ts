import { ChatRepository } from '@data/repository/chat';
import { GetChatMessagesUseCase } from '@domain/chat/GetChatMessagesUseCase';
import { ChatMessagesRequestModel } from '@models/chat/request/ChatMessagesRequestModel';
import { SubmitMessageRequestModel } from '@models/chat/request/SubmitMessageRequestModel';
import { IDeleteMessagePayload, deleteMessageActionTypes, getMessagesActionTypes, receiveNewMessagesActionTypes } from '@redux/actions/conversation';
import { selectMessagesByKey } from '@redux/selectors/conversation';
import { MessageHelper } from '@shared/helper/MessageHelper';
import { IAppChatMessage } from 'app/presentation/models/chat';
import { StateObservable, combineEpics, ofType } from 'redux-observable';
import { Observable } from 'rxjs';
import { mergeMap, switchMap } from 'rxjs/operators';
import { IAction } from '../..';

export const getMessagesEpic = (action$: any, state$: any) =>
    action$.pipe(
        ofType(getMessagesActionTypes.start),
        switchMap((action: IAction<ChatMessagesRequestModel>) =>
            new Observable(obs => {
                const usecase = new GetChatMessagesUseCase(new ChatRepository(), action.payload!);
                usecase.execute().then(response => {
                    const sectionId = `${action.payload!.object_id}-${action.payload!.object_instance_id}`;
                    obs.next(getMessagesActionTypes.successAction(response, {
                        sectionId: sectionId,
                        isAppend: (action.payload!.last_id ?? 0) > 0,
                        canLoadMore: response.length > 0,
                    }));
                    obs.complete();
                }).catch(error => {
                    obs.next(getMessagesActionTypes.failedAction({ error }));
                    obs.complete();
                });
            })
        )
    );

export const deleteMessageEpic = (action$: any, state$: any) =>
    action$.pipe(
        ofType(deleteMessageActionTypes.start),
        mergeMap((action: IAction<IDeleteMessagePayload>) =>
            new Observable(obs => {
                const { messageId, objectId, objectInstanceId } = action.payload!;
                const request = new SubmitMessageRequestModel(objectId, objectInstanceId, 'delete', '');
                request.comment_id = MessageHelper.shared.extractRealMessageId(messageId);
                const chatRepo = new ChatRepository();
                chatRepo.submitChatMessages(request)
                    .then(() => {
                        obs.next(deleteMessageActionTypes.successAction());
                        obs.complete();
                    })
                    .catch(error => {
                        obs.next(deleteMessageActionTypes.failedAction({ error }));
                        obs.complete();
                    });
            })
        )
    );

export const receiveMessageEpic = (action$: any, state$: StateObservable<any>) =>
    action$.pipe(
        ofType(receiveNewMessagesActionTypes.start),
        mergeMap((action: IAction<IAppChatMessage[]>) =>
            new Observable(obs => {
                const messages = action.payload!;
                const objectId = messages[0]?.objectId;
                const objectInstanceId = messages[0]?.objectInstanceId;
                const state = state$.value;
                if (objectId && objectInstanceId && messages.length > 0) {
                    const key = `${objectId}-${objectInstanceId}`;
                    const currentMessages = selectMessagesByKey(state, key);
                    const latestMessagesToCheck = currentMessages.slice(0, 20);
                    const message = messages[0];
                    let isMessagesValidToInsert = true;
                    if (latestMessagesToCheck.find(item => item._id === message._id)) {
                        isMessagesValidToInsert = false;
                    }

                    if (isMessagesValidToInsert) {
                        obs.next(getMessagesActionTypes.successAction(messages, {
                            isPrepend: true,
                            sectionId: key
                        }));
                    }

                    obs.complete();
                }
            })
        )
    );

export const conversationEpic = combineEpics(
    getMessagesEpic,
    deleteMessageEpic,
    receiveMessageEpic,
);

