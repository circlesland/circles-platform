var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import App from "src/App.svelte";
import { ApiConnection } from "./apiConnection";
import { buildUcan } from "omo-webnative/dist";
import { o } from "./libs/o-os/o";
import { shellEvents } from "./libs/o-os/shellEvents";
dayjs.extend(relativeTime);
const _o = Object.assign(Object.assign({}, o), { events: shellEvents.observable, publishEvent: event => shellEvents.publish(event), graphQLClient: null });
function connectToApi() {
    return __awaiter(this, void 0, void 0, function* () {
        const apiConnection = new ApiConnection("http://139.59.153.176:8989/graphql", () => __awaiter(this, void 0, void 0, function* () { return yield buildUcan(); }));
        _o.graphQLClient = yield apiConnection.client.subscribeToResult();
        console.log("GraphQL client ready:", _o.graphQLClient);
    });
}
connectToApi();
window.o = _o;
window.o.logger.log("Starting ..", {
    userAgent: navigator.userAgent
});
export default new App({
    target: document.body,
});
