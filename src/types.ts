import { ObsidianProtocolData } from "obsidian";

export interface Parameters extends ObsidianProtocolData {
    folderPath?: string;
    fileName?: string;
    cardQuestion?: string;
    cardAnswer?: string;
    multiline?: "true" | "false";
}

export interface Definition {
    definition: string;
    synonyms: string[];
}

export interface Meaning {
    partOfSpeech: string;
    definitions: Definition[];
    synonyms: string[];
}

export interface Word {
    word: string;
    meanings: Meaning[];
}
