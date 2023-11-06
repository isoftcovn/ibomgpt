import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    changeLanguageTypes,
} from 'app/presentation/redux/actions/general';
import { ofType } from 'redux-observable';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { LOCALE } from 'app/shared/constants';
import { changeLanguage } from 'app/presentation/localization';

export const changeLanguageEpic = (action$: any, state$: any) =>
    action$.pipe(
        ofType(changeLanguageTypes.start),
        switchMap((action: any) => {
            return new Observable((obs) => {
                changeLanguage(action.payload).then(async () => {
                    await AsyncStorage.setItem(LOCALE, action.payload);
                    obs.next(changeLanguageTypes.successAction());
                    obs.complete();
                }).catch(error => {
                    obs.next(changeLanguageTypes.failedAction({ error }));
                    obs.complete();
                });
            });
        })
    );
