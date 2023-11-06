import LoadingIndicator from 'app/presentation/components/globals/loading';

export default class LoadingManager {
    private static loadingRef?: LoadingIndicator;

    static setLoadingRef = (ref: LoadingIndicator) => {
        LoadingManager.loadingRef = ref;
    };

    static setLoading = (loading: boolean) => {
        if (LoadingManager.loadingRef) {
            LoadingManager.loadingRef.setLoading(loading);
        }
    };
}
