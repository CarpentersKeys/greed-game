import { useQuery } from "react-query";
import { ObjectId } from "mongoose";
import postFetch from '../../fetchers/postFetch';
import { ReactNode } from "react";

interface IFindGameProps {
    playerId: ObjectId | undefined | null;

}

export default function GetGame({ playerId }: IFindGameProps) {
    useQuery(['game', { endPoint: 'getState', postString: playerId, }], postFetch);

    return <></>
}
