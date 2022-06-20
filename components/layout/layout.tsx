import { Box, Group, Text } from "@mantine/core"
import { ReactNode, useEffect } from "react"
import Footer from "./footer"
import Header from "./header"
import getFetch from "../../fetchers/getFetch"
import { useQuery } from "react-query"
import { GET_ALL_QUERY } from "../../lib/famousStrings"

export default function Layout({ children }: { children: ReactNode }): JSX.Element {
    const { data: gamesData } = useQuery([
        'game',
        { endPoint: GET_ALL_QUERY }
    ], getFetch)

    const { data: playersData } = useQuery([
        'player',
        { endPoint: GET_ALL_QUERY }
    ], getFetch)

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
                        paddingBottom: '2rem',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Header />
                    <main>{children}</main>
                </Box>
            </Box>
            <Footer />
            <Group>

                <ul>
                    <li><h5>games</h5></li>
                    {
                        gamesData?.games && Array.isArray(gamesData?.games) && gamesData?.games.map((g, i) => <li key={i}>
                            ID{JSON.stringify(g._id)}
                            <ul>
                                {g.players.map((p, i) => <li key={i}>{p}</li>)}
                            </ul>
                        </li>)
                    }
                </ul>
                <ul>
                    <li>
                        <h5>players</h5>
                    </li>
                    {
                        playersData?.players && Array.isArray(playersData.players) && playersData.players.map((p, i) => <li key={i}>{JSON.stringify(p.name + p._id)}</li>)
                    }
                </ul>
            </Group>
        </>
    )
}