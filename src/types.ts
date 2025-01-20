import { ObsidianProtocolData } from "obsidian";

export type Language = "en" | "ru"

export type CardQuestion = string

export type CardAnswer = string

export interface Parameters extends ObsidianProtocolData {
    folderPath?: string;
    fileName?: string;
    cardQuestion?: CardQuestion;
    cardAnswer?: CardAnswer;
    multiline?: "true" | "false";
    language?: Language;
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

export interface Card {
    question: CardQuestion;
    answer: CardAnswer;
}
