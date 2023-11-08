class ListingHelper {
    static shared = new ListingHelper();

    private constructor() { }

    getNextPageBasedOnDataLength = (dataLength: number, pageSize: number): number | undefined => {
        if (dataLength && pageSize) {
            if (dataLength < pageSize) {
                return undefined;
            } else {
                const currentPage = Math.floor(dataLength / pageSize);
                let nextPage = currentPage;
                if (dataLength % pageSize === 0) {
                    nextPage = currentPage + 1;
                } else {
                    return undefined;
                }

                return nextPage;
            }
        }

        return undefined;
    };
}

export default ListingHelper;
