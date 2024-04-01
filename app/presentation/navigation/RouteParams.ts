export type AppStackParamList = {
    SplashScreen: undefined,
    SignIn: undefined,
    SignUpEmail: undefined,
    Languages: undefined,
    AppTab: undefined,
    HomeTab: undefined,
    HomeScreen: undefined,
    Conversation: {
        objectId: number,
        objectInstanceId: number,
        name?: string,
    },
    ParticipantList: {
        objectId: number,
        objectInstanceId: number,
    },
    ConversationInfo: {
        objectId: number,
        objectInstanceId: number,
    },
    CommonFilter: {
        title?: string,
    },
    PdfViewer: {
        url: string
    },
    DeveloperConsole: undefined,
    NetworkDebugger: undefined,
}

export type AllRouteParamList = AppStackParamList;
