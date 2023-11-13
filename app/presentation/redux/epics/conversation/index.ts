import { ChatRepository } from '@data/repository/chat';
import { GetChatMessagesUseCase } from '@domain/chat/GetChatMessagesUseCase';
import { ChatMessagesRequestModel } from '@models/chat/request/ChatMessagesRequestModel';
import { getMessagesActionTypes, sendMessagesActionTypes } from '@redux/actions/conversation';
import { combineEpics, ofType } from 'redux-observable';
import { Observable } from 'rxjs';
import { mergeMap, switchMap } from 'rxjs/operators';
import { IAction } from '../..';
import { SubmitMessageRequestModel } from '@models/chat/request/SubmitMessageRequestModel';

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

export const sendMessagesEpic = (action$: any, state$: any) =>
    action$.pipe(
        ofType(sendMessagesActionTypes.start),
        mergeMap((action: IAction<SubmitMessageRequestModel>) =>
            new Observable(obs => {
                const chatRepo = new ChatRepository();
                chatRepo.sendChatMessages(action.payload!).then(response => {
                    obs.next(sendMessagesActionTypes.successAction());
                    obs.complete();
                }).catch(error => {
                    obs.next(sendMessagesActionTypes.failedAction({ error }));
                    obs.complete();
                });
            })
        )
    );

export const conversationEpic = combineEpics(
    getMessagesEpic,
);

