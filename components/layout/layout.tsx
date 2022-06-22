import { Box, Group } from "@mantine/core"
import { ReactNode } from "react"
import Footer from "./footer"
import Header from "./header"
import getFetch from "../../fetchers/getFetch"
import { useQuery } from "react-query"
import { GET_ALL_QUERY } from "../../lib/famousStrings"

export default function Layout({ children }: { children: ReactNode }): JSX.Element {
    const queryResults = ['player', 'game'].map(q => useQuery([q, { endPoint: GET_ALL_QUERY }], getFetch, { refetchInterval: 1000 }))
    const playersData = queryResults[0]?.data?.[GET_ALL_QUERY];
    const gamesData = queryResults[1]?.data?.[GET_ALL_QUERY];

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
                        <ul>
                            <li><h5>games</h5></li>
                            {
                                gamesData && Array.isArray(gamesData) && gamesData
                                    .map((g, i) => <li key={i}>
                                        ID{JSON.stringify(g._id)}
                                        <ul>
                                            {'players' in g && g?.players?.map((p, i) => <li key={i}>{String(p)}</li>)}
                                        </ul>
                                    </li>)
                            }
                        </ul>
                        <ul>
                            <li>
                                <h5>players</h5>
                            </li>
                            {
                                playersData && Array.isArray(playersData) && playersData
                                    .map((p, i) => p.name && <li key={i}>{JSON.stringify(p?.name + p._id)}</li>)
                            }
                        </ul>
                    </Group>
                </Box>
            </Box>
            <Footer />
        </>
    )
}