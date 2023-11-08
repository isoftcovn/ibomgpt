import { LoginEmailUseCase } from '@domain/auth/LoginEmailUseCase';
import { IUserRepository } from '@domain/user';
import { getProfileActionTypes } from '@redux/actions/user';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import { AuthRepository } from '@data/repository/auth';
import { UserRepository } from '@data/repository/user';
import LoginRequestModel from '@models/auth/request/LoginRequestModel';

export enum InitAppStatus {
    initial,
    loading,
    versionInvalid,
    unauthenicated,
    authenicated,
    error,
}

export const useInitApp = (userRepository: IUserRepository, tryAgainTimestamp?: number): InitAppStatus => {
    const [status, setStatus] = useState<InitAppStatus>(InitAppStatus.initial);
    const dispatch = useDispatch();

    const checkAppVersion = useCallback(async () => {
        // TODO: Fill the logic
    }, []);

    const retrieveUserSession = useCallback(async () => {
        try {
            const userCreds = await userRepository.getUserCreds();
            if (userCreds && userCreds.length >= 2) {
                const [username, password] = userCreds;
                const userAgent = Platform.OS === 'ios' ? 'IOS' : 'ANDROID';
                const deviceId = await DeviceInfo.getUniqueId();
                const usecase = new LoginEmailUseCase({
                    authRepository: new AuthRepository(),
                    userRepository: new UserRepository(),
                    body: new LoginRequestModel(username, password, userAgent, deviceId),
                });
                const user = await usecase.execute();
                dispatch(getProfileActionTypes.successAction(user));
                setStatus(InitAppStatus.authenicated);
            } else {
                setStatus(InitAppStatus.unauthenicated);
            }
        } catch (error) {
            console.info('Retrive user session failed: ', error);
            setStatus(InitAppStatus.unauthenicated);
        }
    }, [userRepository, dispatch]);

    const initApp = useCallback(async () => {
        setStatus(InitAppStatus.loading);
        await checkAppVersion();
        await retrieveUserSession();
    }, [retrieveUserSession, checkAppVersion]);

    useEffect(() => {
        initApp();
    }, [initApp, tryAgainTimestamp]);

    return status;
};
