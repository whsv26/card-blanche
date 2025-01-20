import { Language, Word } from "./types";

export interface DictionaryApi {
    defineWord(word: string, lang: Language): Promise<Word[]>;
}

export function makeDictionaryApi(): DictionaryApi {
    return {
        async defineWord(word, lang) {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/${lang}/${word}`);
            const words: Word[] = await response.json();
            return words;
        },
    };
};
