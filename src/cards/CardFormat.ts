import Card from "./Card";

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
