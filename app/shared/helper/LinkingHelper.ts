import {StorageGatewayFactory} from '@data/gateway/storage';
import {IUserRepository} from '@domain/user';
import {Linking} from 'react-native';
import Appsflyer from 'react-native-appsflyer';

export const MESSENGER_URI = 'fb-messenger://';
export const USER_MESSENGER_URI = `${MESSENGER_URI}user-thread/`;
export const GOOGLE_MAPS_SEARCH_URI = 'https://www.google.com/maps/search/';
export default class LinkingHelper {
    static openUrl = (url: string) => {
        return new Promise((resolve, reject) => {
            Linking.canOpenURL(url)
                .then(canOpen => {
                    if (canOpen) {
                        Linking.openURL(url).then(resolve).catch(reject);
                    } else {
                        reject("Can't open url.");
                    }
                })
                .catch(reject);
        });
    };

    static openMessenger = (facebookId: string) => {
        const url = `${USER_MESSENGER_URI}${facebookId}`;
        return LinkingHelper.openUrl(url);
    };

    static buildGoogleMapSearchWithCoordinates = (
        lat: number,
        lng: number,
        placeId?: string,
    ) => {
        return (
            GOOGLE_MAPS_SEARCH_URI +
            `?api=1&query=${lat},${lng}${
                placeId ? `&query_place_id=${placeId}` : ''
            }`
        );
    };

    static buildGoogleMapSearchWithAddress = (
        address: string,
        placeId?: string,
    ) => {
        return (
            GOOGLE_MAPS_SEARCH_URI +
            `?api=1&query=${encodeURI(address)}${
                placeId ? `&query_place_id=${placeId}` : ''
            }`
        );
    };

    static openGoogleMapWithCoordinates = (
        lat: number,
        lng: number,
        placeId?: string,
    ) => {
        const uri = LinkingHelper.buildGoogleMapSearchWithCoordinates(
            lat,
            lng,
            placeId,
        );
        return LinkingHelper.openUrl(uri);
    };

    static openGoogleMapWithAddress = (address: string, placeId?: string) => {
        const uri = LinkingHelper.buildGoogleMapSearchWithAddress(
            address,
            placeId,
        );
        return LinkingHelper.openUrl(uri);
    };

    static openIBomProApp = async (userRepository: IUserRepository) => {
        const userCreds = await userRepository.getUserCreds();
        let _u = '';
        let _p = '';
        if (userCreds && userCreds.length >= 2) {
            const [username, password] = userCreds;
            _u = username;
            _p = password;
        }
        Appsflyer.generateInviteLink(
            {
                channel: 'app2app',
                userParams: {
                    deep_link_value: 'home',
                    deep_link_sub2: JSON.stringify({
                        _u,
                        _p,
                    }),
                },
            },
            result => {
                console.info('Deeplink: ', result);
                const link = result as string;
                Linking.openURL(link);
            },
            error => {
                console.warn('Generate deeplink error: ', error);
            },
        );
    };

    static openIBomProAppDetailObject = async (
        userRepository: IUserRepository,
        objectId: number,
        objectInstanceId: number,
    ) => {
        const userCreds = await userRepository.getUserCreds();
        let _u = '';
        let _p = '';
        if (userCreds && userCreds.length >= 2) {
            const [username, password] = userCreds;
            _u = username;
            _p = password;
        }
        Appsflyer.generateInviteLink(
            {
                channel: 'app2app',
                userParams: {
                    deep_link_value: 'object_detail',
                    deep_link_sub1: JSON.stringify({
                        objectId,
                        objectInstanceId,
                    }),
                    deep_link_sub2: JSON.stringify({
                        _u,
                        _p,
                    }),
                },
            },
            result => {
                console.info('Deeplink: ', result);
                const link = result as string;
                Linking.openURL(link);
            },
            error => {
                console.warn('Generate deeplink error: ', error);
            },
        );
    };
}
