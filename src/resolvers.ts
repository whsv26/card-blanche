import { CardAnswer, Parameters } from "./types";
import { DictionaryApi } from "./api";
import { formatWords } from "./format";

export interface CardAnswerResolver {
    supports(params: Parameters): boolean;
    resolve(params: Parameters): Promise<CardAnswer>;
}

export function makeManualCardAnswerResolver(): CardAnswerResolver {
    return {
        supports(params: Parameters): boolean {
            return (params.cardAnswer ?? "") !== "";
        },
        resolve(params: Parameters): Promise<CardAnswer> {
            return Promise.resolve(params.cardAnswer);
        },
    };
}

export function makeDictionaryCardAnswerResolver(api: DictionaryApi): CardAnswerResolver {
    return {
        supports(params: Parameters): boolean {
            return (params.cardAnswer ?? "") !== "";
        },
        async resolve(params: Parameters): Promise<CardAnswer> {
            const lang = params.language ?? "en";
            const words = await api.defineWord(params.cardQuestion, lang);
            return formatWords(words);
        },
    };
}

export function makeCardAnswerResolver(...resolvers: CardAnswerResolver[]): CardAnswerResolver {
    return {
        supports(params: Parameters): boolean {
            return resolvers.some(resolver => resolver.supports(params));
        },
        resolve(params: Parameters): Promise<CardAnswer> {
            for (const resolver of resolvers) {
                if (resolver.supports(params)) {
                    return resolver.resolve(params);
                }
            }
            return Promise.reject("Answer can't be resolved");
        },
    };
}
