export interface Word {
    word: string;
    meanings: Meaning[];
}

interface Meaning {
    partOfSpeech: string;
    definitions: Definition[];
    synonyms: string[];
}

interface Definition {
    definition: string;
    synonyms: string[];
}
