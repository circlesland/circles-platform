const TwelveHours = 12 * 60 * 60 * 60 * 1000;

export const recentlyGotUbi = () => {
    const lastSuccessfulUbiRetrieval = localStorage.getItem("omo.ubiService.lastSuccessfulUbiRetrieval");
    return lastSuccessfulUbiRetrieval
        ? Date.now() - parseInt(lastSuccessfulUbiRetrieval) < TwelveHours
        : false;
};
