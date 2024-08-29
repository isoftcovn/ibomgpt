import {AuthRepository} from '@data/repository/auth';
import {UserRepository} from '@data/repository/user';
import {LoginEmailUseCase} from '@domain/auth/LoginEmailUseCase';
import {IUserRepository} from '@domain/user';
import LoginRequestModel from '@models/auth/request/LoginRequestModel';
import {getProfileActionTypes} from '@redux/actions/user';
import NotificationHelper from '@shared/helper/NotificationHelper';
import {useCallback, useEffect, useRef, useState} from 'react';
import {Alert, Linking, Platform} from 'react-native';
import {OneSignal} from 'react-native-onesignal';
import {useDispatch} from 'react-redux';
import CodePush, {DownloadProgress} from 'react-native-code-push';
import {useTranslation} from 'react-i18next';
import DeviceInfo from 'react-native-device-info';
import {GeneralRepository} from '@data/repository/general';

export enum InitAppStatus {
    initial,
    loading,
    versionInvalid,
    unauthenicated,
    authenicated,
    error,
}

export interface IInitAppResponse {
    status: InitAppStatus;
    updateProgress?: number;
    updateProgressText?: string;
    syncStatus?: CodePush.SyncStatus;
}

const mapSyncStatusToDisplayText = (status: CodePush.SyncStatus): string => {
    switch (status) {
        case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
            return '';
        case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
            return 'Đang cập nhật..';
        case CodePush.SyncStatus.INSTALLING_UPDATE:
            return 'Đang cài đặt..';
        default:
            return '';
    }
};

export const useInitApp = (
    userRepository: IUserRepository,
    tryAgainTimestamp?: number,
): IInitAppResponse => {
    const [status, setStatus] = useState<InitAppStatus>(InitAppStatus.initial);
    const [updatingText, setUpdatingText] = useState<string>('');
    const [upgradeProgress, setUpgradeProgress] = useState(0);
    const [syncStatus, setSyncStatus] = useState<CodePush.SyncStatus>();
    const _delayUpdateProgress = useRef(false);
    const _timeoudId = useRef<NodeJS.Timeout>();
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const _hideCheckForUpdates = useCallback(() => {
        setUpdatingText('');
    }, []);

    const _updateProgress = useCallback((progress: DownloadProgress) => {
        if (!_delayUpdateProgress.current) {
            if (progress.totalBytes > 0) {
                setUpgradeProgress(
                    Math.floor(
                        (progress.receivedBytes / progress.totalBytes) * 100,
                    ),
                );
                _delayUpdateProgress.current = true;
                _timeoudId.current = setTimeout(() => {
                    _delayUpdateProgress.current = false;
                    _timeoudId.current = undefined;
                }, 300);
            }
        }
    }, []);

    const _checkCodePushUpdates = useCallback(async () => {
        try {
            setUpdatingText('');
            const updatePackage = await CodePush.checkForUpdate();
            if (updatePackage) {
                console.info('updatePackage: ', updatePackage);
                if (updatePackage.isMandatory) {
                    await CodePush.sync(
                        {
                            mandatoryInstallMode:
                                CodePush.InstallMode.IMMEDIATE,
                        },
                        _syncStatus => {
                            const statusText =
                                mapSyncStatusToDisplayText(_syncStatus);
                            console.info('sync status: ', statusText);
                            setSyncStatus(_syncStatus);
                            setUpdatingText(statusText);
                        },
                        progress => {
                            // console.info('upgrade progress: ', progress);
                            _updateProgress(progress);
                        },
                    );

                    return;
                } else {
                    CodePush.sync({
                        installMode: CodePush.InstallMode.ON_NEXT_RESTART,
                    });
                    _hideCheckForUpdates();
                    return;
                }
            } else {
                console.info('App is up-to-date');
            }
        } catch (error) {
            console.warn('update codepush error: ', error);
        }

        _hideCheckForUpdates();
    }, [_hideCheckForUpdates, _updateProgress]);

    const checkAppVersion = useCallback(async () => {
        try {
            const repo = new GeneralRepository();
            const response = await repo.checkAppVersion(
                DeviceInfo.getVersion(),
                Platform.OS,
            );
            if (!response.isValid) {
                setStatus(InitAppStatus.versionInvalid);
            }
            return response.isValid;
        } catch (error) {
            console.warn('Check version error: ', error);
            setStatus(InitAppStatus.error);
        }
        return false;
    }, []);

    const requestNotificationPermission = useCallback(() => {
        return new Promise(resolve => {
            NotificationHelper.askPermissionAndRegisterDeviceToken(
                {
                    onPermission: async granted => {
                        console.info('notification granted: ', granted);
                        resolve(granted);
                    },
                },
                {
                    onDeviceTokenReceived: deviceToken => {
                        console.info('deviceToken: ', deviceToken);
                    },
                },
            );
        });
    }, []);

    const retrieveUserSession = useCallback(async () => {
        try {
            const userCreds = await userRepository.getUserCreds();
            if (userCreds && userCreds.length >= 2) {
                const [username, password] = userCreds;
                const userAgent = Platform.OS === 'ios' ? 'IOS' : 'ANDROID';
                let deviceId = '';
                const notificationPermissionGranted =
                    await requestNotificationPermission();
                if (notificationPermissionGranted) {
                    deviceId =
                        (await OneSignal.User.pushSubscription.getIdAsync()) ??
                        '';
                    console.info('onesignal subscriptionID: ', deviceId);
                }
                const usecase = new LoginEmailUseCase({
                    authRepository: new AuthRepository(),
                    userRepository: new UserRepository(),
                    body: new LoginRequestModel(
                        username,
                        password,
                        userAgent,
                        deviceId,
                    ),
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
    }, [userRepository, dispatch, requestNotificationPermission]);

    const initApp = useCallback(async () => {
        setStatus(InitAppStatus.loading);
        const isValid = await checkAppVersion();
        if (isValid) {
            await _checkCodePushUpdates();
            await retrieveUserSession();
        }
    }, [retrieveUserSession, checkAppVersion, _checkCodePushUpdates]);

    useEffect(() => {
        initApp();
    }, [initApp, tryAgainTimestamp]);

    return {
        status,
        updateProgressText: updatingText,
        updateProgress: upgradeProgress,
        syncStatus,
    };
};
