import { HydratedDocument, Query, Schema } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import { Game } from "../../../models/game/mongoose";
import { IGame } from "../../../models/game/types";
import { Player } from "../../../models/player/mongoose";
import { IPlayer } from "../../../models/player/types";
import { isObjectId } from "../../../models/typeCheckers";
import { narrowToGame } from "../../../models/typeCheckers";

//TODO method to prevent simultaneous joins resulting in more than 2 players in the game
//TODO when ending session kill all open games
export default async function (req: NextApiRequest, resp: NextApiResponse) {
    await dbConnect();
    const { endPoint, postData } = JSON.parse(req.query.id[0])

    // console.log('ep', endPoint)
    // console.log('pd', postData)
    switch (endPoint) {
        case 'joinOrCreate':
            // get player
            if (!isObjectId(postData)) {
                return resp.status(500)
                    .json({ errorMessage: `from /api/game case: 'joinOrCreate'\npostData not an ObjectId ${postData}` })
            };

            const playerId = postData;
            const player =
                await Player.findById<Query<IPlayer, IPlayer>>(playerId);
            if (!player) {
                return resp.status(500)
                    .json({ errorMesseg: `from /api/game case: 'get'\nfailed to find player: ${player}` });
            };

            // check for open game
            const openGame = await findOpenGame(); // defined below

            if (openGame) {
                const newPlayers = [...openGame.players, player._id];
                const update = {
                    players: newPlayers,
                    isOpen: false,
                };
                const closedGame = Object.assign(openGame, update);
                const savedGame = await closedGame.save();
                if (savedGame) {
                    console.log('joined an existing game')
                    return resp.status(200).json(savedGame._id);
                } else {
                    console.error(`from /api/game case: 'get'\nfailed to update existing open game, \nraw value of savedGame: ${savedGame}`)
                }
            } else {
                // make new game
                const newGame: HydratedDocument<IGame> = new Game({ players: [player._id], isOpen: true }); // TODO
                const savedGame = await newGame.save();
                if (savedGame) {
                    console.log('made a new game')
                    return resp.status(200).json(newGame._id);
                } else {
                    return resp.status(500)
                        .json({ errorMessage: `from api/game/[...id] case: joinOrCreate:\nfailed to save a new game\n${savedGame} ` });
                }
                };
            break;
        case 'stateQuery':
            if (!isObjectId(postData)) {
                return resp.status(500)
                    .json({ errorMessage: `from /api/game case: 'stateQuery'\npostData not an ObjectId ${postData}` })
            };
            const gameId = postData;
            const gameState =
                await Game.findById<Query<IGame, IGame>>(gameId);

            let isGame;
            try { isGame = narrowToGame(gameState) } catch (err) {
                console.error(`from /api/game case: 'state'\nfailed to narrow to game\nhere's the error ${err}`);
            }

            if (isGame) {
                return resp.status(200).json(gameState);
            } else {
                return resp.status(500)
                    .json({ errorMessage: `from /api/game case: 'state'\nfailed to narrow to game\nraw value of gameState ${gameState}` });
            };
            break;
        case GET_ALL_QUERY:
            {
                const endPointErrorResp = pathBadResp({ endPoint: GET_ALL_QUERY});
                const games =
                    await Game.find().sort({ updatedAt: -1 });

                if (endPointErrorResp({
                    evaluator(games: unknown) {
                        if (!Array.isArray(games)) { return; };
                        return (games.every(g => isGame(g)))
                    },
                    value: games
                })) { return; };
                return resp.status(200).json({ games });
            }
        default:
            resp.setHeader('Allow', ['GET', 'PUT']);
            resp.status(405).end(`endPoint ${endPoint} Not Allowed`);
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
        .filter(playerId => isObjectId(playerId))
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