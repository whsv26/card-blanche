import { DictionaryApi } from "./DictionaryApi";
import { formatWords } from "../format";
import { CardAnswerResolver, CardAnswerResolverContext } from "../cards/CardAnswerResolver";
import { CardAnswer } from "../cards/Card";

export function makeDictionaryCardAnswerResolver(api: DictionaryApi): CardAnswerResolver {
    return {
        supports(context: CardAnswerResolverContext): boolean {
            const hasAnswer = (context.answer ?? "") !== "";
            return !hasAnswer;
        },
        async resolve(context: CardAnswerResolverContext): Promise<CardAnswer> {
            const lang = context.language;
            const words = await api.defineWord(context.question, lang);
            return formatWords(words);
        },
    };
}
