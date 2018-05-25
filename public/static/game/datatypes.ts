import {GameBot} from "./bots/bot";
import {GameFieldData} from "./core";

export interface IPlayer {
    username: string;
    gameField: GameFieldData;
    score: number;
    shipsAliveCount: number;
    isUser?: boolean;
    bot?: GameBot;
}

export type PlayersArray = IPlayer[];

export const MAX_SECONDS_TO_MOVE = 20;
