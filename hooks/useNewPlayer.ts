import { useQuery, UseQueryResult } from "react-query";
import postFetch from "../fetchers/postFetch";
import { IPlayer, narrowToPlayer } from "../models/player/types";

/**
 * fetches to the player/[...key] endpoint and registers a new player
 * doesn't refech until enabled again(?)
 * @param name 
 * @returns UseQueryResult<IPlayer>
 */
export default function useNewPlayer(name: string | undefined | null): UseQueryResult<IPlayer> {
    return useQuery([
        'player',
        { endPoint: 'new', postString: name, }
    ], postFetch,
        {
            enabled: !!name,
            refetchOnMount: false,
            onSuccess: (data) => {
                try {
                    narrowToPlayer(data);
                } catch (err) {
                    console.error(`error in useNewPlayer \nendpoint: 'new'\nname:${name}\n${err}`);
                }
            },
        }
    );
};