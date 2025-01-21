import ObsidianFacade from "../obsidian";
import { formatCard } from "../format";
import { TFile } from "obsidian";
import { AddCardCommand } from "./AddCardCommand";

export default class AddCardCommandHandler {
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
