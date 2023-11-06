import { IUserRepository } from '@domain/user';
import { getProfileActionTypes } from '@redux/actions/user';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

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
            await userRepository.activateUserSession();
            const user = await userRepository.getProfile();
            dispatch(getProfileActionTypes.successAction(user));
            setStatus(InitAppStatus.authenicated);
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
