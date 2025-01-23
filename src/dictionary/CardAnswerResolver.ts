import { DictionaryApi } from "./DictionaryApi";
import { CardAnswerResolver, CardAnswerResolverContext } from "../cards/CardAnswerResolver";
import { CardAnswer, CardAnswerSource } from "../cards/Card";
import { formatWords } from "./CardAnswerFormat";

export function makeDictionaryCardAnswerResolver(api: DictionaryApi): CardAnswerResolver {
    return {
        supports(context: CardAnswerResolverContext): boolean {
            return context.answerSource === CardAnswerSource.Dictionary;
        },
        async resolve(context: CardAnswerResolverContext): Promise<CardAnswer> {
            const lang = context.language;
            const words = await api.defineWord(context.question, lang);
            return formatWords(words);
        },
    };
}
