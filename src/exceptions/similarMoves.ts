import { EmbedBuilder } from "discord.js";
import { TekkenFramedataResponse } from "../types/framedata";

export class MoveNotFoundError extends Error {
  private readonly gameCode: string;
  private readonly characterCode: string;
  private readonly embed: EmbedBuilder;
  private readonly similarMoves: TekkenFramedataResponse[];

  constructor(
    gameCode: string,
    characterCode: string,
    embed: EmbedBuilder,
    similarMoves: TekkenFramedataResponse[]
  ) {
    super();
    this.gameCode = gameCode;
    this.characterCode = characterCode;
    this.embed = embed;
    this.similarMoves = similarMoves;
  }

  getEmbed() {
    return this.embed;
  }

  getSimilarMoves() {
    return this.similarMoves;
  }

  getGameCode() {
    return this.gameCode;
  }

  getCharacterCode() {
    return this.characterCode;
  }
}
