import { Language } from "../dictionary/Language";
import { Notice } from "obsidian";

export interface WikipediaApi {
    lookup(title: string, lang: Language): Promise<WikipediaExtract>;
}

export function makeDisambiguationWikipediaApi(api: WikipediaApi): WikipediaApi {
    return {
        async lookup(title: string, lang: Language): Promise<WikipediaExtract> {
            const extract = await api.lookup(title, lang);

            if (!hasDisambiguation(extract)) {
                return Promise.resolve(extract);
            }

            console.warn(`Disambiguation found for "${title}". Choosing first result.`);

            const newTitle = extract.text
                .split(disambiguationIdentifier)[1]
                .trim()
                .split(",")[0]
                .split("==")
                .pop()
                .trim();

            try {
                return await api.lookup(newTitle, lang);
            } catch (e) {
                const message = `Could not automatically resolve disambiguation.`;
                new Notice(message);
                return extract;
            }
        },
    };
}

export function makeWikipediaApi(): WikipediaApi {
    return {
        async lookup(title: string, lang: Language): Promise<WikipediaExtract> {
            const response = await fetch(getUrl(title, lang));
            const responseBody = await response.json();
            const extract = parseResponse(responseBody, lang);
            return extract
                ? Promise.resolve(extract)
                : Promise.reject(new Error(`Could not find wikipedia extract for "${title}"`));
        },
    };
}

function getUrl(title: string, lang: Language) {
    const queryParams = new URLSearchParams({
        format: "json",
        action: "query",
        prop: "extracts",
        explaintext: "1",
        redirects: "",
        origin: "*",
        titles: title,
    });

    return `https://${lang}.wikipedia.org/w/api.php?${queryParams}`;
}

function parseResponse(json: any, lang: Language): WikipediaExtract | undefined {
    const pages = json.query.pages;
    const pageKeys = Object.keys(pages);
    if (pageKeys.includes("-1")) {
        return undefined;
    }
    const extracts: WikipediaExtract[] = pageKeys.map((key) => {
        const page = pages[key];
        const extract: WikipediaExtract = {
            title: page.title,
            text: page.extract,
            url: getUrl(page.title, lang),
        };
        return extract;
    });
    return extracts[0];
}

function hasDisambiguation(extract: WikipediaExtract) {
    return extract.text.includes(disambiguationIdentifier);
}

const disambiguationIdentifier = "may refer to:";
