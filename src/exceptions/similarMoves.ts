import { EmbedBuilder } from "discord.js";
import { TekkenFramedata } from "../types/framedata";

export class MoveNotFoundError extends Error {
  private readonly embed: EmbedBuilder;
  private readonly similarMoves: TekkenFramedata[];

  constructor(embed: EmbedBuilder, similarMoves: TekkenFramedata[]) {
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
