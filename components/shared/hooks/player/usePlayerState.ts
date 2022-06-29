import { QueryKey, useQuery } from "react-query";
import { useAppContext } from "../../../../context/appContext";
import stateFetch from "../../../../fetchers/stateFetch";
import { STATE_QUERY } from "../../../../lib/famousStrings";
import { IPlayer } from "../../../../models/player/types";
import { isPlayer } from "../../../../models/typeCheckers";

const USE_PLAYER_STATE = 'usePlayerState' // TODO how am I supposed to get the fn name into onSuccess dynamically?

interface IOptions { onPlayerId: (data: IPlayer) => void };
export default function usePlayerState(options?: IOptions) {
    const { playerId } = useAppContext();
    const { data: playerState, isLoading, isError } = useQuery<IPlayer, unknown, IPlayer, QueryKey>([
        'player',
        { endPoint: STATE_QUERY, id: playerId, }
    ], stateFetch,
        {
            enabled: !!playerId,
            keepPreviousData: !!playerId,
            onSuccess: (data) => {
                checkIsPlayer(data);
                if (options?.onPlayerId && data?._id) { options?.onPlayerId(data); };
            },
        },
    );

    function checkIsPlayer(data: unknown,) {
        if (!isPlayer(data)) {
            throw new Error(
                `error in ${USE_PLAYER_STATE}
                    \nendpoint: ${STATE_QUERY}
                    \nplayerId:${playerId}name\n${data}`
            );
        }
    }
    return {
        ...playerState,
        playerId: playerState?._id,
        playerLoading: isLoading,
        playerError: isError
    }
};


    // this is here in case we need to give player a chance to recover after disco or sth
    // const [removalTimer, removalTimerSet] = useState<null | ReturnType<typeof setTimeout>>(null);
    // useEffect(() => {
    //     if (!playerId) {
    //         removalTimerSet(setTimeout(() => {
    //             remove();
    //         }, 3000))
    //     } else if (removalTimer) {
    //         clearTimeout(removalTimer);
    //         removalTimerSet(null)
    //     }
    //     return () => {
    //         if (removalTimer) {
    //             clearTimeout(removalTimer);
    //             removalTimerSet(null)
    //         }
    //     };

    // }, [playerId])
