import ObsidianFacade from "../obsidian/ObsidianFacade";
import { TFile } from "obsidian";
import { AddCardCommand } from "./AddCardCommand";
import { formatCard } from "./CardFormat";

export default class AddCardCommandHandler {
    constructor(private readonly obsidian: ObsidianFacade) {
    }

    public async handle(command: AddCardCommand): Promise<void> {
        const formattedCard = formatCard(command.card, command.isMultiline);
        const note = await this.findOrCreateNote(command);
        const leaf = await this.obsidian.openNoteAndAppend(note, formattedCard);
        this.obsidian.scrollToBottom(leaf)
    }

    private async findOrCreateNote(command: AddCardCommand): Promise<TFile> {
        await this.obsidian.createFolderIfNotExists(command.folderPath);
        const filePath = `${command.folderPath}/${command.fileName}.md`;
        return await this.obsidian.findOrCreateFile(filePath);
    }
}
