import { AuthRepository } from 'app/data/repository/auth';
import { UserRepository } from 'app/data/repository/user';
import { LoginEmailUseCase } from 'app/domain/auth/LoginEmailUseCase';
import { SignupEmailUseCase } from 'app/domain/auth/SignupEmailUseCase';
import LogoutUseCase from 'app/domain/user/LogoutUseCase';
import LoginRequestModel from 'app/models/auth/request/LoginRequestModel';
import RegisterRequestModel from 'app/models/auth/request/RegisterRequestModel';
import {
    loginActionTypes,
    logoutActionTypes,
    registerActionTypes,
} from 'app/presentation/redux/actions/auth';
import { combineEpics, ofType } from 'redux-observable';
import { Observable } from 'rxjs';
import { exhaustMap } from 'rxjs/operators';
import { IAction } from '../..';

export const loginCustomerEpic = (action$: any, state$: any) =>
    action$.pipe(
        ofType(loginActionTypes.start),
        exhaustMap((action: IAction<LoginRequestModel>) =>
            new Observable(obs => {
                const userRepository = new UserRepository();
                const usecase = new LoginEmailUseCase({
                    authRepository: new AuthRepository(),
                    userRepository,
                    email: action.payload!.username,
                    password: action.payload!.password,
                });
                usecase.execute().then(response => {
                    userRepository.getProfile().then(profile => {
                        obs.next(loginActionTypes.successAction(profile));
                        obs.complete();
                    }).catch(error => {
                        obs.next(loginActionTypes.failedAction({ error }));
                        obs.complete();
                    });
                }).catch(error => {
                    obs.next(loginActionTypes.failedAction({ error }));
                    obs.complete();
                });
            })
        )
    );

export const registerCustomerEpic = (action$: any, state$: any) =>
    action$.pipe(
        ofType(registerActionTypes.start),
        exhaustMap((action: IAction<RegisterRequestModel>) =>
            new Observable(obs => {
                const userRepository = new UserRepository();
                const usecase = new SignupEmailUseCase({
                    authRepository: new AuthRepository(),
                    userRepository,
                    email: action.payload!.user_email,
                    password: action.payload!.user_pass,
                });
                usecase.execute().then(response => {
                    obs.next(registerActionTypes.successAction(true));
                    obs.complete();
                }).catch(error => {
                    obs.next(registerActionTypes.failedAction({ error }));
                    obs.complete();
                });
            })
        )
    );

export const logoutCustomerEpic = (action$: any, state$: any) =>
    action$.pipe(
        ofType(logoutActionTypes.start),
        exhaustMap((action: IAction<any>) =>
            new Observable(obs => {
                const usecase = new LogoutUseCase(new UserRepository());
                usecase.execute().then(() => {
                    obs.next(logoutActionTypes.successAction());
                    obs.complete();
                }).catch(error => {
                    obs.next(logoutActionTypes.failedAction({ error }));
                    obs.complete();
                });
            })
        )
    );


export const authEpic = combineEpics(
    loginCustomerEpic,
    registerCustomerEpic,
    logoutCustomerEpic,
);
