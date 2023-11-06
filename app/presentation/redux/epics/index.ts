import { combineEpics } from 'redux-observable';
import { initAppEpic } from 'app/presentation/redux/epics/general/appInitiation';
import { authEpic } from './auth';
import { userEpic } from './user';
import { changeLanguageEpic } from 'app/presentation/redux/epics/general';

export const rootEpic = combineEpics(
    initAppEpic,
    authEpic,
    userEpic,
    changeLanguageEpic
);
