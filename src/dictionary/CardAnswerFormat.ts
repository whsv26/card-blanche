import { Word } from "./Word";

export const formatWords =
    (words: Word[]): string => {
        return words
            .flatMap(word => formatWord(word))
            .join("\n");
    };

export const formatWord =
    (word: Word): string => {
        return word.meanings.flatMap(meaning => {
            return meaning.definitions.map(definition => {
                return `- ${definition.definition} (${meaning.partOfSpeech})`;
            });
        }).join("\n");
    };
