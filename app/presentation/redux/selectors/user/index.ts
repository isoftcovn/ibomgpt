import { createSelector } from 'reselect';
export const selectUserState = createSelector(
    (state: any) => state.user,
    user => user
);

export const selectProfile = createSelector(
    (state: any) => selectUserState(state),
    user => user.profile
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
