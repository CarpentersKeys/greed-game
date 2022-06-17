import { HydratedDocument, Query } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import { Game } from "../../../models/game/mongoose";
import { IGame } from "../../../models/game/types";
import { Player } from "../../../models/player/mongoose";
import { IPlayer } from "../../../models/player/types";

export default async function (req: NextApiRequest, resp: NextApiResponse) {
    await dbConnect();
    const { endPoint, postString } = JSON.parse(req.query.id[0])

    switch (endPoint) {
        case 'getState':
            // get player
            const player =
                await Player.findById<Query<IPlayer, IPlayer>>(postString);
            if (!player) { resp.status(500).send('can\'t find this player'); };

            // check for open game
            const openGame = await findOpenGame(); // defined below

            if (openGame) {
                const newPlayers = [...openGame.players, player];
                const update = {
                    players: newPlayers,
                    isOpen: false,
                };
                const closedGame = Object.assign(openGame, update);
                closedGame.save();
                return resp.status(200).json(closedGame);
            } else {
                // make new hame
                const newGame: HydratedDocument<IGame> = new Game({ players: [player], isOpen: true }); // TODO
                const savedGame = await newGame.save();
                if (savedGame) {
                    return resp.status(200).json(newGame);
                } else {
                    return resp.status(500).send(`failed while trying to save the new game. savedGame: ${savedGame}`);
                };
            }
            break;
        //         case 'state':
        //             const gameState =
        //                 await Game.findById<Query<IGame, IGame>>(postString);

        //             if (isGame(gameState)) {
        //                 return resp.status(200).json(gameState);
        //             } else {
        //                 return resp.status(500).json('pls respond');
        //             };
        //             break;
        //         default:
        //             resp.setHeader('Allow', ['GET', 'PUT']);
        //             resp.status(405).end(`endPoint ${endPoint} Not Allowed`);
    };
};

async function findOpenGame(attempt = 0): Promise<IGame | null> {
    if (attempt > 3) { throw new Error('there\s a problem finding an open game, check database') }
    const openGame: IGame | null =
        await Game
            .findOne<Query<IGame, IGame>>({ isOpen: true })

    // no game avail, make one
    if (!openGame) { return null }

    const isValid = openGame.players
        // TODO: standardized isPlayer()
        .filter((player: IPlayer) => player.type === 'Player')
        .length === 1;

    if (!isValid) {
        // questionable deletion?
        const invalidGame = await openGame.delete();
        console.error('found an invalid game:', invalidGame, 'deleted');
        return findOpenGame(attempt + 1);
    }

    // join in
    return openGame;
}