import { useQuery } from "react-query";
import getFetch from "../fetchers/getFetch";
import { GET_ALL_QUERY } from "../lib/famousStrings";
import { isGame, isPlayer } from "../models/typeCheckers";

export default function useListings() {

    const queryResults = ['player', 'game'].map(q => useQuery([q, { endPoint: GET_ALL_QUERY }], getFetch, { refetchInterval: 1000 }))

    let playersData: unknown[] | undefined = queryResults[0]?.data?.[GET_ALL_QUERY]
    playersData && playersData.filter((p) => isPlayer(p));
    let gamesData: unknown[] | undefined = queryResults[1]?.data?.[GET_ALL_QUERY]
    gamesData && gamesData.filter((p) => isGame(p));

    return ({ gamesData, playersData, })
}