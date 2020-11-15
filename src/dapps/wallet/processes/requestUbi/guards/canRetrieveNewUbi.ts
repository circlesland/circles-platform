const TwelveHours = 12 * 60 * 60 * 60 * 1000;

export const canRetrieveNewUbi = (context, event) => {
    const now = Date.now();

    // A User can retrieve new UBI when:
    // 1. At least 12 hours after the last successful retrieval passed by
    const lastSuccessfulUbiRetrieval = localStorage.getItem("omo.ubiService.lastSuccessfulUbiRetrieval");
    const recentlyGotUbi = !lastSuccessfulUbiRetrieval
        ? false
        : Date.now() - parseInt(lastSuccessfulUbiRetrieval) < TwelveHours;

    if (recentlyGotUbi)
        return false;

    // 2. The omo.ubiService.nextPossibleUbiRetrieval time is in the past or not set
    const nextPossibleUbiRetrieval = localStorage.getItem("omo.ubiService.nextPossibleUbiRetrieval");
    return !nextPossibleUbiRetrieval
        ? true
        : now > parseInt(nextPossibleUbiRetrieval);
}
