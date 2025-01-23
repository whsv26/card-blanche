import { ObsidianProtocolData, Plugin } from "obsidian";
import ObsidianFacade from "./obsidian/ObsidianFacade";
import { makeDictionaryApi } from "./dictionary/DictionaryApi";
import { makeCardAnswerResolver, makeManualCardAnswerResolver } from "./cards/CardAnswerResolver";
import { makeDictionaryCardAnswerResolver } from "./dictionary/CardAnswerResolver";
import {
    AddCardCommandFactory, getDefaultFileName,
    getDefaultFolderPath,
    getDefaultLanguage,
    getDefaultMultiline,
} from "./cards/AddCardCommandFactory";
import AddCardCommandHandler from "./cards/AddCardCommandHandler";
import { CardAnswer, CardAnswerSource, CardQuestion } from "./cards/Card";
import { makeDisambiguationWikipediaApi, makeWikipediaApi } from "./wikipedia/WikipediaApi";
import { makeWikipediaCardAnswerResolver } from "./wikipedia/CardAnswerResolver";
import { Language } from "./dictionary/Language";

export default class CardBlanche extends Plugin {

    async onload() {
        const obsidian = new ObsidianFacade(this.app.vault, this.app.workspace);
        const dictionaryApi = makeDictionaryApi();
        const wikipediaApi = makeDisambiguationWikipediaApi(makeWikipediaApi());
        const cardAnswerResolver = makeCardAnswerResolver(
            makeManualCardAnswerResolver(),
            makeDictionaryCardAnswerResolver(dictionaryApi),
            makeWikipediaCardAnswerResolver(wikipediaApi),
        );
        const addCardCommandFactory = new AddCardCommandFactory(
            cardAnswerResolver,
            getDefaultLanguage,
            getDefaultFolderPath,
            getDefaultMultiline,
            getDefaultFileName,
        );
        const addCardCommandHandler = new AddCardCommandHandler(obsidian);

        this.registerObsidianProtocolHandler(
            "card-blanche-add-card",
            async (params: Parameters) => {
                const parseBoolean = (value: string | null): boolean | null => {
                    if (value === "true") return true;
                    if (value === "false") return false;
                    return null;
                };

                if (!params.cardQuestion) {
                    return Promise.reject(new Error("Missing required parameter: cardQuestion"));
                }

                const addCardCommand = await addCardCommandFactory.make({
                    question: params.cardQuestion,
                    answer: params.cardAnswer,
                    answerSource: params.cardAnswerSource,
                    folderPath: params.folderPath,
                    fileName: params.fileName,
                    language: params.language,
                    multiline: parseBoolean(params.multiline),
                });

                await addCardCommandHandler.handle(addCardCommand);
            },
        );
    }
}

interface Parameters extends ObsidianProtocolData {
    folderPath?: string;
    fileName?: string;
    cardQuestion?: CardQuestion;
    cardAnswer?: CardAnswer;
    cardAnswerSource?: CardAnswerSource;
    multiline?: "true" | "false";
    language?: Language;
}
