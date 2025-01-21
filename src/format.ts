import Card from "./cards/Card";
import { Word } from "./dictionary/Word";

export const formatCard =
    (card: Card, isMultiline: boolean): string => {
        const escape = (s: string) => {
            return s.replaceAll("\n", " ").replaceAll("::", " ");
        };

        if (isMultiline) {
            return `\n\n**${card.question}**\n?\n${card.answer}`;
        } else {
            return `\n- **${escape(card.question)}** :: ${escape(card.answer)}`;
        }
    };

export const formatDate =
    (now: Date): string => {
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        return `${year}-${month}`;
    };

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
