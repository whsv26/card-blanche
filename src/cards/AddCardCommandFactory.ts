import { formatDate } from "../format";
import { CardAnswerResolver } from "./CardAnswerResolver";
import { AddCardCommand } from "./AddCardCommand";
import { Language } from "../dictionary/Language";
import { CardAnswer, CardQuestion } from "./Card";

export class AddCardCommandFactory {

    constructor(
        private readonly cardAnswerResolver: CardAnswerResolver,
        private readonly defaultLanguage = getDefaultLanguage,
        private readonly defaultFolderPath = getDefaultFolderPath,
        private readonly defaultMultiline = getDefaultMultiline,
        private readonly defaultFileName = getDefaultFileName,
    ) {
    }

    public async make(input: AddCardCommandFactoryInput): Promise<AddCardCommand> {
        return {
            folderPath: input.folderPath ?? this.defaultFolderPath(),
            fileName: input.fileName ?? this.defaultFileName(),
            isMultiline: input.multiline ?? this.defaultMultiline(),
            language: input.language ?? this.defaultLanguage(),
            card: {
                question: input.question,
                answer: await this.cardAnswerResolver.resolve({
                    language: input.language ?? this.defaultLanguage(),
                    question: input.question,
                    answer: input.answer,
                }),
            },
        };
    }
}

export function getDefaultLanguage(): Language {
    return "en";
}

export function getDefaultFolderPath(): string {
    return "flashcards";
}

export function getDefaultMultiline(): boolean {
    return true;
}

export function getDefaultFileName(): string {
    return formatDate(new Date());
}

interface AddCardCommandFactoryInput {
    question: CardQuestion;
    answer?: CardAnswer;
    folderPath?: string;
    fileName?: string;
    language?: Language;
    multiline?: boolean;
}
