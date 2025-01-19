import { Plugin, TFile, WorkspaceLeaf } from "obsidian";
import { Parameters, Word } from "./types";

export default class CardBlanche extends Plugin {

    async onload() {
        this.registerObsidianProtocolHandler("card-blanche-add-card", async (params: Parameters) => {
            const folderPath = params.folderPath ?? "flashcards";
            const fileName = params.fileName ?? this.formatDate(new Date());
            const filePath: string = `${folderPath}/${fileName}.md`;

            const cardQuestion = params.cardQuestion ?? "";
            const cardAnswer = params.cardAnswer ?? await this.defineWord(cardQuestion);
            const isMultiline = params.multiline !== "false";
            const card = this.formatCard(cardQuestion, cardAnswer, isMultiline);

            const noteFile = await this.findOrCreateFile(filePath);
            await this.openNote(noteFile);
            await app.vault.append(noteFile, card);
        });
    }

    private async defineWord(word: string): Promise<string> {
        const response = await fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + word);
        const words: Word[] = await response.json();
        return words.flatMap(word => this.formatWord(word)).join("\n");
    }

    private async findOrCreateFile(path: string): Promise<TFile> {
        const file = this.app.vault.getAbstractFileByPath(path);
        if (file != null && file instanceof TFile) {
            return file;
        } else {
            return await app.vault.create(path, "");
        }
    }

    private async openNote(file: TFile): Promise<void> {
        const leaf = this.findOrCreateLeaf(file.path);
        await leaf.openFile(file);
        this.app.workspace.setActiveLeaf(leaf, { focus: true });
    }

    private findOrCreateLeaf(filePath: string): WorkspaceLeaf | null {
        let leaf: WorkspaceLeaf = null;
        this.app.workspace.iterateAllLeaves(existingLeaf => {
            if (leaf == null && existingLeaf.view.file?.path === filePath) {
                leaf = existingLeaf;
            }
        });
        return leaf ?? this.app.workspace.getLeaf("tab");
    }

    private formatCard(question: string, answer: string, isMultiline: boolean): string {
        const escape = (s: string) => {
            return s.replaceAll("\n", " ").replaceAll("::", " ");
        };

        if (isMultiline) {
            return `\n\n**${question}**\n?\n${answer}`;
        } else {
            return `\n- **${escape(question)}** :: ${escape(answer)}`;
        }
    }

    private formatDate(now: Date): string {
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        return `${year}-${month}`;
    };

    private formatWord(word: Word): string {
        return word.meanings.flatMap(meaning => {
            return meaning.definitions.map(definition => {
                return `- ${definition.definition} (${meaning.partOfSpeech})`;
            });
        }).join("\n");
    };
}
