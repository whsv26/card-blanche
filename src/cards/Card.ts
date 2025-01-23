export default interface Card {
    question: CardQuestion;
    answer: CardAnswer;
}

export type CardQuestion = string

export type CardAnswer = string

export enum CardAnswerSource {
    Wikipedia = "wikipedia",
    Dictionary = "dictionary",
    Manual = "manual",
}
