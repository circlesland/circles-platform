const TwentySeconds = 20 * 1000;

export const setNextPossibleUbiRetrieval = () => {
    localStorage.setItem("omo.ubiService.nextPossibleUbiRetrieval", (Date.now() + TwentySeconds).toString());
}
