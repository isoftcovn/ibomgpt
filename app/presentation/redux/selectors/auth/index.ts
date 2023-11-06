import { createSelector } from 'reselect';

export const selectAuth = createSelector(
    (state: any) => state.auth,
    auth => auth
);

export const selectLogin = createSelector(
    (state: any) => selectAuth(state),
    auth => auth.login
);

export const selectRegisterUser = createSelector(
    (state: any) => selectAuth(state),
    auth => auth.register
);
