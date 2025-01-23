export function formatExtract(extract: WikipediaExtract, searchTerm: string): string {
    const formattedText = formatExtractText(extract, searchTerm);
    return template
        .replace("{{text}}", formattedText)
        .replace("{{searchTerm}}", searchTerm)
        .replace("{{url}}", extract.url);
}

function formatExtractText(extract: WikipediaExtract, searchTerm: string): string {
    const text = extract.text;
    let formattedText: string;
    if (shouldUseParagraphTemplate) {
        const split = text.split("==")[0].trim().split("\n");
        formattedText = split
            .map((paragraph) =>
                paragraphTemplate.replace(
                    "{{paragraphText}}",
                    paragraph,
                ),
            )
            .join("")
            .trim();
    } else {
        formattedText = text.split("==")[0].trim();
    }
    if (shouldBoldSearchTerm) {
        const pattern = new RegExp(searchTerm, "i");
        formattedText = formattedText.replace(pattern, `**${searchTerm}**`);
    }
    return formattedText;
}

const template = `> [!cite-yellow] [Wikipedia]({{url}})\n{{text}}`;
const paragraphTemplate = `> {{paragraphText}}\n`;
const shouldUseParagraphTemplate = true;
const shouldBoldSearchTerm = true;
