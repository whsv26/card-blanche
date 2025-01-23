import { CardAnswerResolver } from "./CardAnswerResolver";
import { AddCardCommand } from "./AddCardCommand";
import { Language } from "../dictionary/Language";
import { CardAnswer, CardAnswerSource, CardQuestion } from "./Card";
import { formatDate } from "./CardFormat";

export class AddCardCommandFactory {

    constructor(
        private readonly cardAnswerResolver: CardAnswerResolver,
        private readonly defaultLanguage = getDefaultLanguage,
        private readonly defaultFolderPath = getDefaultFolderPath,
        private readonly defaultMultiline = getDefaultMultiline,
        private readonly defaultFileName = getDefaultFileName,
    ) {
    }

    public async make(props: Props): Promise<AddCardCommand> {
        return {
            folderPath: props.folderPath ?? this.defaultFolderPath(),
            fileName: props.fileName ?? this.defaultFileName(),
            isMultiline: props.multiline ?? this.defaultMultiline(),
            language: props.language ?? this.defaultLanguage(),
            card: {
                question: props.question,
                answer: await this.cardAnswerResolver.resolve({
                    answerSource: props.answerSource ?? CardAnswerSource.Manual,
                    language: props.language ?? this.defaultLanguage(),
                    question: props.question,
                    answer: props.answer,
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

interface Props {
    question: CardQuestion;
    answer?: CardAnswer;
    answerSource?: CardAnswerSource;
    folderPath?: string;
    fileName?: string;
    language?: Language;
    multiline?: boolean;
}
