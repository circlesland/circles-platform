export const setLastSuccessfulUbiRetrieval = () => {
    localStorage.setItem("omo.ubiService.lastSuccessfulUbiRetrieval", Date.now().toString());
}
