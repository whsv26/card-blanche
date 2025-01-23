import { FileView, MarkdownView, TFile, Vault, Workspace, WorkspaceLeaf } from "obsidian";

export default class ObsidianFacade {

    constructor(
        private readonly vault: Vault,
        private readonly workspace: Workspace,
    ) {
    }

    public async createFolderIfNotExists(folderPath: string): Promise<void> {
        if (await this.vault.adapter.exists(folderPath)) {
            return;
        }

        const parts = folderPath.split("/");

        for (let i = 1; i <= parts.length; i++) {
            const partialPath = parts.slice(0, i).join("/");
            if (!(await this.vault.adapter.exists(partialPath))) {
                await this.vault.createFolder(partialPath);
            }
        }
    }

    public async findOrCreateFile(path: string): Promise<TFile> {
        const file = this.vault.getAbstractFileByPath(path);
        if (file != null && file instanceof TFile) {
            return file;
        } else {
            return await this.vault.create(path, "");
        }
    }

    public async openNoteAndAppend(noteFile: TFile, data: string): Promise<WorkspaceLeaf> {
        const leaf = await this.openNote(noteFile);
        await this.vault.append(noteFile, data);
        return Promise.resolve(leaf);
    }

    public async openNote(file: TFile): Promise<WorkspaceLeaf> {
        const leaf = this.findOrCreateTabLeaf(file.path);
        await leaf.openFile(file);
        this.workspace.setActiveLeaf(leaf, { focus: true });
        return Promise.resolve(leaf)
    }

    public findOrCreateTabLeaf(filePath: string): WorkspaceLeaf | null {
        let leaf: WorkspaceLeaf = null;
        this.workspace.iterateAllLeaves(existingLeaf => {
            if (leaf != null || !(existingLeaf.view instanceof FileView)) {
                return;
            }
            if (existingLeaf.view.file?.path === filePath) {
                leaf = existingLeaf;
            }
        });
        return leaf ?? this.workspace.getLeaf("tab");
    }

    public scrollToBottom(leaf: WorkspaceLeaf): void {
        if (leaf.view instanceof MarkdownView) {
            const editor = leaf.view.editor;
            const lastLine = editor.lastLine();
            leaf.view.currentMode.applyScroll(lastLine)
        }
    }
}
