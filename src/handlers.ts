import ObsidianFacade from "./obsidian";
import { Card, Parameters } from "./types";
import { formatCard, formatDate } from "./format";
import { CardAnswerResolver } from "./resolvers";
import { TFile } from "obsidian";

export class AddCardHandler {
    constructor(
        private readonly obsidian: ObsidianFacade,
        private readonly cardAnswerResolver: CardAnswerResolver,
    ) {
    }

    public async handle(params: Parameters): Promise<void> {
        const isMultiline = params.multiline !== "false";
        const card = await this.createCard(params);
        const formattedCard = formatCard(card, isMultiline);
        const note = await this.findOrCreateNote(params);
        await this.obsidian.openNoteAndAppend(note, formattedCard);
    }

    private async findOrCreateNote(params: Parameters): Promise<TFile> {
        const folderPath = params.folderPath ?? "flashcards";
        await this.obsidian.createFolderIfNotExists(folderPath);
        const fileName = params.fileName ?? formatDate(new Date());
        const filePath = `${folderPath}/${fileName}.md`;
        return await this.obsidian.findOrCreateFile(filePath);
    }

    private async createCard(params: Parameters): Promise<Card> {
        const question = params.cardQuestion;
        if (!question) {
            return Promise.reject("Question is required to create a card");
        }
        const answer = await this.cardAnswerResolver.resolve(params);
        return { question, answer };
    }
}
