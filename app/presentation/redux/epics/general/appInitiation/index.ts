import { UserRepository } from 'app/data/repository/user';
import { initAppActionTypes } from 'app/presentation/redux/actions/general/appInitiation';
import { getProfileActionTypes } from 'app/presentation/redux/actions/user';
import { ofType } from 'redux-observable';
import { Observable } from 'rxjs';
import { exhaustMap } from 'rxjs/operators';

export const initAppEpic = (action$: any, state$: any) =>
    action$.pipe(
        ofType(initAppActionTypes.start),
        exhaustMap((action) => {
            return new Observable((obs) => {
                const initApp = async () => {
                    try {
                        const customerRepo = new UserRepository();
                        await customerRepo.activateUserSession();
                        obs.next(getProfileActionTypes.startAction());
                        obs.next(initAppActionTypes.successAction());
                    } catch (error) {
                        obs.next(initAppActionTypes.failedAction({ error }));
                    } finally {
                        obs.complete();
                    }
                };
                initApp();
            });
        })
    );
