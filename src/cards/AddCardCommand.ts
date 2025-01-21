import Card from "./Card";
import { Language } from "../dictionary/Language";

export interface AddCardCommand {
    folderPath: string;
    fileName: string;
    card: Card;
    isMultiline: boolean;
    language: Language;
}
