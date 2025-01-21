import { CardAnswer, CardQuestion, Language } from "./types";
import { DictionaryApi } from "./api";
import { formatWords } from "./format";

interface CardAnswerResolverContext {
    language: Language;
    question: CardQuestion;
    answer?: CardAnswer;
}

export interface CardAnswerResolver {
    supports(context: CardAnswerResolverContext): boolean;
    resolve(context: CardAnswerResolverContext): Promise<CardAnswer>;
}

const hasAnswer =
    (context: CardAnswerResolverContext) => {
        return (context.answer ?? "") !== "";
    };

export function makeManualCardAnswerResolver(): CardAnswerResolver {
    return {
        supports(context: CardAnswerResolverContext): boolean {
            return hasAnswer(context);
        },
        resolve(context: CardAnswerResolverContext): Promise<CardAnswer> {
            return Promise.resolve(context.answer);
        },
    };
}

export function makeDictionaryCardAnswerResolver(api: DictionaryApi): CardAnswerResolver {
    return {
        supports(context: CardAnswerResolverContext): boolean {
            return !hasAnswer(context);
        },
        async resolve(context: CardAnswerResolverContext): Promise<CardAnswer> {
            const lang = context.language;
            const words = await api.defineWord(context.question, lang);
            return formatWords(words);
        },
    };
}

export function makeCardAnswerResolver(...resolvers: CardAnswerResolver[]): CardAnswerResolver {
    return {
        supports(context: CardAnswerResolverContext): boolean {
            return resolvers.some(resolver => resolver.supports(context));
        },
        resolve(context: CardAnswerResolverContext): Promise<CardAnswer> {
            for (const resolver of resolvers) {
                if (resolver.supports(context)) {
                    return resolver.resolve(context);
                }
            }
            return Promise.reject(
                new Error(`No resolver supports the given context: ${JSON.stringify(context)}`)
            );
        },
    };
}
