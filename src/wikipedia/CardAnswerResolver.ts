import { WikipediaApi } from "./WikipediaApi";
import { CardAnswerResolver, CardAnswerResolverContext } from "../cards/CardAnswerResolver";
import { CardAnswer, CardAnswerSource } from "../cards/Card";
import { formatExtract } from "./CardAnswerFormat";

export function makeWikipediaCardAnswerResolver(api: WikipediaApi): CardAnswerResolver {
    return {
        supports(context: CardAnswerResolverContext): boolean {
            return context.answerSource === CardAnswerSource.Wikipedia;
        },
        async resolve(context: CardAnswerResolverContext): Promise<CardAnswer> {
            const lang = context.language;
            const extract = await api.lookup(context.question, lang);
            return formatExtract(extract, context.question);
        },
    };
}
