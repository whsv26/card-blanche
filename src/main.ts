import { ObsidianProtocolData, Plugin } from "obsidian";
import ObsidianFacade from "./obsidian";
import { makeDictionaryApi } from "./dictionary/DictionaryApi";
import { makeCardAnswerResolver, makeManualCardAnswerResolver } from "./cards/CardAnswerResolver";
import { makeDictionaryCardAnswerResolver } from "./dictionary/DictionaryCardAnswerResolver";
import {
    AddCardCommandFactory, getDefaultFileName,
    getDefaultFolderPath,
    getDefaultLanguage,
    getDefaultMultiline,
} from "./cards/AddCardCommandFactory";
import AddCardCommandHandler from "./cards/AddCardCommandHandler";
import { CardAnswer, CardQuestion } from "./cards/Card";
import { Language } from "./types";

export default class CardBlanche extends Plugin {

    async onload() {
        const obsidian = new ObsidianFacade(this.app.vault, this.app.workspace);
        const dictionaryApi = makeDictionaryApi();
        const cardAnswerResolver = makeCardAnswerResolver(
            makeManualCardAnswerResolver(),
            makeDictionaryCardAnswerResolver(dictionaryApi),
        );
        const addCardCommandFactory = new AddCardCommandFactory(
            cardAnswerResolver,
            getDefaultLanguage,
            getDefaultFolderPath,
            getDefaultMultiline,
            getDefaultFileName
        );
        const addCardCommandHandler = new AddCardCommandHandler(obsidian)

        this.registerObsidianProtocolHandler(
            "card-blanche-add-card",
            async (params: Parameters) => {
                const parseBoolean = (value: string|null): boolean|null => {
                    if (value === "true") return true;
                    if (value === "false") return false;
                    return null;
                }

                if (!params.cardQuestion) {
                    return Promise.reject(new Error("Missing required parameter: cardQuestion"))
                }

                const addCardCommand = await addCardCommandFactory.make({
                    question: params.cardQuestion,
                    answer: params.cardAnswer,
                    folderPath: params.folderPath,
                    fileName: params.fileName,
                    language: params.language,
                    multiline: parseBoolean(params.multiline),
                })

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
    multiline?: "true" | "false";
    language?: Language;
}
