import { CardAnswer, CardQuestion } from "./Card";
import { Language } from "../dictionary/Language";

export interface CardAnswerResolver {
    supports(context: CardAnswerResolverContext): boolean;
    resolve(context: CardAnswerResolverContext): Promise<CardAnswer>;
}

export interface CardAnswerResolverContext {
    language: Language;
    question: CardQuestion;
    answer?: CardAnswer;
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

export function makeManualCardAnswerResolver(): CardAnswerResolver {
    return {
        supports(context: CardAnswerResolverContext): boolean {
            return (context.answer ?? "") !== "";
        },
        resolve(context: CardAnswerResolverContext): Promise<CardAnswer> {
            return Promise.resolve(context.answer);
        },
    };
}
