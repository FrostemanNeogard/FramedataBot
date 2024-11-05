import { EmbedBuilder } from "discord.js";
import { TekkenFramedataResponse } from "../types/framedata";

export class MoveNotFoundError extends Error {
  private readonly embed: EmbedBuilder;
  private readonly similarMoves: TekkenFramedataResponse[];

  constructor(embed: EmbedBuilder, similarMoves: TekkenFramedataResponse[]) {
    super();
    this.embed = embed;
    this.similarMoves = similarMoves;
  }

  getEmbed() {
    return this.embed;
  }

  getSimilarMoves() {
    return this.similarMoves;
  }
}
