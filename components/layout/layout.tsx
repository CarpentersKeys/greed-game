import { Box, Group } from "@mantine/core"
import { ReactNode } from "react"
import Footer from "./footer"
import Header from "./header"
import getFetch from "../../fetchers/getFetch"
import { useQuery } from "react-query"
import { GET_ALL_QUERY } from "../../lib/famousStrings"
import { isGame, isPlayer } from "../../models/typeCheckers"
import { IPlayer } from "../../models/player/types"
export default function Layout({ children }: { children: ReactNode }): JSX.Element {
    const queryResults = ['player', 'game'].map(q => useQuery([q, { endPoint: GET_ALL_QUERY }], getFetch, { refetchInterval: 1000 }))

    let playersData: unknown[] | undefined = queryResults[0]?.data?.[GET_ALL_QUERY]
    playersData && playersData.filter((p) => isPlayer(p));
    let gamesData: unknown[] | undefined = queryResults[1]?.data?.[GET_ALL_QUERY]
    gamesData && gamesData.filter((p) => isGame(p));

    // const playersData = isPlayer(queryResults[0]?.data?.[GET_ALL_QUERY]) && queryResults[0]?.data?.[GET_ALL_QUERY];
    // const gamesData = isGame(queryResults[1]?.data?.[GET_ALL_QUERY]) && queryResults[0]?.data?.[GET_ALL_QUERY];
    ;

    return (
        <>
            <Box
                component="main"
                sx={{
                    paddingLeft: '2rem',
                    paddingRight: '2rem',
                }}
            >
                <Box
                    component="main"
                    sx={{
                        minHeight: '100vh',
                        display: 'flex',
                        paddingTop: '2rem',
                        // paddingBottom: '2rem',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Header />
                    <main>{children}</main>

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
                </Box>
            </Box>
            <Footer />
        </>
    )
}