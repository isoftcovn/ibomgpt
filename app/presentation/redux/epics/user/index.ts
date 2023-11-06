import { UpdateProfileUseCase } from 'app/domain/user/UpdateProfileUseCase';
import {
    getProfileActionTypes,
    updateAvatarActionTypes,
    updateProfileActionTypes,
} from 'app/presentation/redux/actions/user';
import { combineEpics, ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, concatMap, exhaustMap, map } from 'rxjs/operators';
import { IAction } from '../..';
import { UserRepository } from '../../../../data/repository/user';
import UploadFileRequestModel from '../../../../models/general/request/UploadFileRequestModel';
import UpdateProfileRequestModel from '../../../../models/user/request/UpdateProfileRequestModel';


// export const changePasswordEpic = (action$: any, state$: any) =>
//     action$.pipe(
//         ofType(changePasswordActionTypes.start),
//         exhaustMap((action: IAction<string>) =>
//             from(new CustomerRepository().changePassword(action.payload!)).pipe(
//                 map(response => changePasswordSuccess()),
//                 catchError(error => of(changePasswordFailed({ error })))
//             )
//         )
//     );

export const getProfileEpic = (action$: any, state$: any) =>
    action$.pipe(
        ofType(getProfileActionTypes.start),
        exhaustMap((action: IAction<any>) =>
            from(new UserRepository().getProfile()).pipe(
                map((value) => getProfileActionTypes.successAction(value)),
                catchError(error => of(getProfileActionTypes.failedAction({ error, shouldShowMessage: false })))
            ))
    );

export const updateProfileEpic = (action$: any, state$: any) =>
    action$.pipe(
        ofType(updateProfileActionTypes.start),
        exhaustMap((action: IAction<UpdateProfileRequestModel>) =>
            from(new UpdateProfileUseCase(new UserRepository(), action.payload!).execute())
        ),
        concatMap(() => from(new UserRepository().getProfile()).pipe(
            map((value) => getProfileActionTypes.successAction(value)),
            catchError(error => of(getProfileActionTypes.failedAction({ error })))
        )),
        catchError(error => of(getProfileActionTypes.failedAction({ error })))
    );

export const updateAvatarEpic = (action$: any, state$: any) =>
    action$.pipe(
        ofType(updateAvatarActionTypes.start),
        exhaustMap((action: IAction<UploadFileRequestModel>) =>
            from(new UserRepository().uploadAvatar(action.payload!))
        ),
        concatMap(() => from(new UserRepository().getProfile()).pipe(
            map((value) => getProfileActionTypes.successAction(value)),
            catchError(error => of(getProfileActionTypes.failedAction({ error })))
        )),
        catchError(error => of(getProfileActionTypes.failedAction({ error })))
    );

export const userEpic = combineEpics(
    getProfileEpic,
    updateProfileEpic,
    updateAvatarEpic
);
