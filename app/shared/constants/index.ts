import {AllRouteParamList} from '@navigation/RouteParams';

/**
 * ===================================================SHARED SECTION======================================================
 */
export enum CurrencyCode {
    Vietnam = 'vnd',
    Dollar = 'usd',
}

export enum SortDirections {
    Ascending = 'ASC',
    Descending = 'DESC',
}

export const PageSize = {
    Default: 20,
    ChatList: 50,
};

export const Gender = {
    Male: 'male',
    Female: 'female',
};

export const DateTimeFormat = {
    FullDateTime: 'DD/MM/YYYY hh:mm:ss',
    DateTimeAmPm: 'DD/MM/YYYY hh A',
    DateTime24h: 'DD/MM/YYYY HH:mm',
    Time: 'hh:mm:ss',
    FullDate: 'DD MMM YYYY',
    TimeHourMinPM: 'HH:mm A',
    FullDateDash: 'DD-MM-YYYY',
    APIFormat: 'YYYY-MM-DD HH:mm:ss',
    FullDateShortMonth: 'MMM DD, YYYY',
};

export const PriceFormat = {
    Default: '0,0',
};

export const CreditCardTypes = {
    Visa: 'visa',
    MasterCard: 'mastercard',
    AmericanExpress: 'american-express',
};

export const NOTIFICATION_CHANNEL = 'app_notification';
/**
 * ===================================================SHARED SECTION======================================================
 */

/**
 * ===================================================PRESENTATION SECTION======================================================
 */
export const NavigationRoutes = {
    Loading: 'AuthLoading',
    SignIn: 'SignIn',
    AuthScreen: 'AuthScreen',
    NetworkDebugger: 'NetworkDebugger',
    MockLocation: 'MockLocation',
    DeveloperConsole: 'DeveloperConsole',
    Languages: 'Languages',
};

export type PossibleDeepLinkRoutes = 'conversation_detail' | 'home';

export const DeepLinkRoutes: Record<
    PossibleDeepLinkRoutes,
    keyof AllRouteParamList
> = {
    conversation_detail: 'Conversation',
    home: 'HomeTab',
};

export const DeepLinkKeys: Record<string, string> = {
    offers: 'slug',
    articles: 'slug',
    transactionsbot: 'transactionsbot',
    cardbot: 'cardbot',
    'mini-courses': 'slug',
};

export const RouteAuthenticationRequires: Record<
    keyof AllRouteParamList,
    boolean
> = {
    SignIn: false,
    SignUpEmail: false,
    NetworkDebugger: false,
    DeveloperConsole: false,
    Languages: false,
    SplashScreen: false,
    AppTab: true,
    HomeTab: true,
    HomeScreen: true,
    Conversation: true,
    PdfViewer: true,
};

export const Links = {
    toIBomProApp: 'https://ibom.onelink.me/Ydm1/3lety9nj',
};

export const LOCALE = '@language';
export const DEFAULT_SECTION_ID = 'default';

export const ACTION_PREFIX = 'start';
export const REFRESH_ACTION_PREFIX = 'refresh';
export const LOADMORE_ACTION_PREFIX = 'loadmore';
export const SUCCESS_ACTION_SUFFIX = 'success';
export const FAILED_ACTION_SUFFIX = 'failed';

export const YOUTUBE_ID_REGEX =
    '^(?:https?:)?//[^/]*(?:youtube(?:-nocookie)?.com|youtu.be).*[=/]([-\\w]{11})(?:\\?|=|&|$)';
/**
 * ===================================================PRESENTATION SECTION======================================================
 */

/**
 * ===================================================DATA SECTION======================================================
 */
export const User = {
    Key: 'KeyUser',
    Auth: 'AuthToken',
    RememberLogin: 'RememberLoginKey',
    UserCreds: 'UserCreds',
};

export const TokenType = {
    User: 'Token.User',
    UserRefreshToken: 'Token.UserRefreshToken',
    DeviceToken: 'Token.DeviceToken',
};

export const General = {
    StoreConfigs: '@StoreConfigs',
    Countries: '@Countries',
};

/**
 * ===================================================DATA SECTION======================================================
 */

/**
 * ===================================================EVENT SECTION======================================================
 */
export const EventEmit = {
    RefreshNotification: 'RefreshNotification',
};
/**
 * ===================================================EVENT SECTION======================================================
 */
