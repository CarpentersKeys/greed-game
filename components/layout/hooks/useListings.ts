import { QueryKey, useQuery } from "react-query";
import getFetch from "../../../fetchers/getFetch";
import { GET_ALL_QUERY } from "../../../lib/famousStrings";
import { IGame } from "../../../models/game/types";
import { IPlayer } from "../../../models/player/types";
import { isGame, isPlayer } from "../../../models/typeCheckers";

export default function useListings() {
    const { data: playersData } = useGetAllQuery('player')
    const { data: gamesData } = useGetAllQuery('game')


    return ({ gamesData, playersData, })
}


function useGetAllQuery<T>(api: string) {
    return useQuery<T, unknown, T[], QueryKey>(
        [api, { endPoint: GET_ALL_QUERY }], getFetch, { refetchInterval: 2000 })
}