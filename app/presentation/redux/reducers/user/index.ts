import { combineReducers } from 'redux';
import profileReducer from 'app/presentation/redux/reducers/user/profile';
import updateProfileReducer from 'app/presentation/redux/reducers/user/updateProfile';
import changePasswordReducer from 'app/presentation/redux/reducers/user/changePassword';
import updateAvatarReducer from './updateAvatar';

export const user = combineReducers({
    profile: profileReducer.reducer,
    changePassword: changePasswordReducer.reducer,
    updateProfile: updateProfileReducer.reducer,
    updateAvatar: updateAvatarReducer.reducer,
});
