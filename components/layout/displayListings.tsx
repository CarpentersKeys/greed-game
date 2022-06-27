import useListings from "../../hooks/useListings";
import { Group } from "@mantine/core";
import { IPlayer } from "../../models/player/types";
import { isPlayer } from "../../models/typeCheckers";

export default function DisplayListings() {
    const { playersData, gamesData } = useListings();

    return (
        <Group>
            <ol>
                <li><h5>games</h5></li>
                {
                    gamesData && Array.isArray(gamesData) && gamesData
                        .map((g, i) => <li key={i}>
                            ID{JSON.stringify(g._id)}
                            isOpen:{String(g.isOpen)}
                            <ul>
                                {g?.players?.map((p: IPlayer, i: number) => <li key={i}>{String(p)}</li>)}
                            </ul>
                        </li>)
                }
            </ol>
            <ol>
                <li>
                    <h5>players</h5>
                </li>
                {
                    playersData && Array.isArray(playersData) && playersData
                        .map((p, i) => isPlayer(p) && <li key={i}>{JSON.stringify(
                            p?.name
                            + ' ' + p?.gameRole
                            + ' ' + p?.inGame
                            + ' ' + p?._id
                        )}</li>)
                }
            </ol>
        </Group>
    )

}