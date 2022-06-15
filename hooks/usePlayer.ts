import { useEffect, useState } from "react";
import { useQuery, UseQueryResult } from "react-query";
import postFetch from "../fetchers/postFetch";
import { ObjectId } from "mongoose";
import { IPlayer, narrowToPlayer } from "../models/player/types";

export default function usePlayer(endPoint: string, postString: string | ObjectId | undefined): UseQueryResult<IPlayer> {
    const [enabled, enabledSet] = useState<boolean>(false);

    useEffect(() => {
        if (typeof postString === 'string') {
            enabledSet(true);
        }
    }, [postString])

    return useQuery([
        'player',
        { endPoint, postString, }
    ], postFetch,
        {
            enabled,
            onSuccess: (data) => narrowToPlayer(data),
        }
    );
};