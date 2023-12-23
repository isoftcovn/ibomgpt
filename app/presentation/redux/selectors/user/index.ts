import UserModel from '@models/user/response/UserModel';
import { IReducer } from '@redux/index';
import { createSelector } from 'reselect';
export const selectUserState = createSelector(
    (state: any) => state.user,
    user => user
);

export const selectProfile = createSelector(
    (state: any) => selectUserState(state),
    user => user.profile
);

export const selectUserId = createSelector(
    (state: any) => selectProfile(state),
    (profile: IReducer<UserModel | undefined>) => profile?.data?.id
);

export const selectDisplayName = createSelector(
    (state: any) => selectProfile(state),
    (profile: IReducer<UserModel | undefined>) => {
        const email = profile.data?.email ?? '';
        return email.split('@')[0] ?? '';
    }
);

export const selectUpdateProfile = createSelector(
    (state: any) => selectUserState(state),
    user => user.updateProfile
);

export const selectUpdateAvatar = createSelector(
    (state: any) => selectUserState(state),
    user => user.updateAvatar
);

export const selectChangePassword = createSelector(
    (state: any) => selectUserState(state),
    user => user.changePassword
);

export default {
    selectProfile,
    selectChangePassword,
    selectUpdateProfile,
    selectUpdateAvatar,
};
