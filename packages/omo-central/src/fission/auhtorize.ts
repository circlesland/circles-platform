import {AuthSucceeded, Continuation, initialise, redirectToLobby, Scenario} from "../../../omo-webnative/dist";

export async function authorize(lobbyTheme?: string): Promise<AuthSucceeded|Continuation | undefined> {
    const state = await initialise({
        permissions: {
            app: {
                name: "OmoSapien",
                creator: "MamaOmo",
            },
            fs: {
                publicPaths: ["omo.sapien"],
                privatePaths: []
            },
        },
        loadFileSystem: false
    });

    switch (state.scenario) {
        case Scenario.AuthSucceeded:
        case Scenario.Continuation:
            return state;
        case Scenario.NotAuthorised:
            await redirectToLobby(state.permissions, undefined, lobbyTheme);
            break;
    }

    return undefined;
}