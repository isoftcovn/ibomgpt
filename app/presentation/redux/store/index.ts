import { legacy_createStore, applyMiddleware, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { createLogger } from 'redux-logger';
import { rootEpic } from 'app/presentation/redux/epics';
import { rootReducer } from 'app/presentation/redux/reducers';

const epicMiddleware = createEpicMiddleware();

const middlewares: any[] = [epicMiddleware];
if (__DEV__) {
    middlewares.push(createLogger());
}

export const store = legacy_createStore(rootReducer, compose(applyMiddleware(...middlewares)));

epicMiddleware.run(rootEpic);

