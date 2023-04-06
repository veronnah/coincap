export class Questionnaire {
  constructor(
    public totalVotesCount: number,
    public goodVotesCount: number,
    public badVotesCount: number,
    public goodVotesPercentage: number,
  ) {
  }
}
