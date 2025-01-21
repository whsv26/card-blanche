import ObsidianFacade from "./obsidian";
import { Card, CardAnswer, CardQuestion, Language } from "./types";
import { formatCard, formatDate } from "./format";
import { TFile } from "obsidian";
import { CardAnswerResolver } from "./resolvers";

export interface AddCardCommand {
    folderPath: string;
    fileName: string;
    card: Card;
    isMultiline: boolean;
    language: Language;
}

interface AddCardCommandFactoryInput {
    question: CardQuestion;
    answer?: CardAnswer;
    folderPath?: string;
    fileName?: string;
    language?: Language;
    multiline?: boolean;
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

export class AddCardCommandHandler {
    constructor(private readonly obsidian: ObsidianFacade) {
    }

    public async handle(command: AddCardCommand): Promise<void> {
        const formattedCard = formatCard(command.card, command.isMultiline);
        const note = await this.findOrCreateNote(command);
        await this.obsidian.openNoteAndAppend(note, formattedCard);
    }

    private async findOrCreateNote(command: AddCardCommand): Promise<TFile> {
        await this.obsidian.createFolderIfNotExists(command.folderPath);
        const filePath = `${command.folderPath}/${command.fileName}.md`;
        return await this.obsidian.findOrCreateFile(filePath);
    }
}
