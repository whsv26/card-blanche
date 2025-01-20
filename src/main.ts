import { Plugin } from "obsidian";
import { Parameters } from "./types";
import ObsidianFacade from "./obsidian";
import { makeDictionaryApi } from "./api";
import { AddCardHandler } from "./handlers";
import { makeCardAnswerResolver, makeDictionaryCardAnswerResolver, makeManualCardAnswerResolver } from "./resolvers";

export default class CardBlanche extends Plugin {

    async onload() {
        const obsidian = new ObsidianFacade(this.app.vault, this.app.workspace);
        const dictionaryApi = makeDictionaryApi();
        const cardAnswerResolver = makeCardAnswerResolver(
            makeManualCardAnswerResolver(),
            makeDictionaryCardAnswerResolver(dictionaryApi),
        );

        this.registerObsidianProtocolHandler(
            "card-blanche-add-card",
            async (params: Parameters) => {
                await new AddCardHandler(obsidian, cardAnswerResolver).handle(params);
            },
        );
    }
}
