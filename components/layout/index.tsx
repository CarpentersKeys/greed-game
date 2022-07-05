import { ReactNode, } from "react"
import Footer from "./footer"
import Header from "./header"
import EndSessionButton from "../session/endSession"
import DisplayListings from "./displayListings"
import { useAppContext } from "../../context/appContext"
import PlayerDetails from "./playerDetails"
import GameDetails from "./gameDetails"
import { Box, Group, Navbar } from "@mantine/core"

export default function Layout({ children }: { children: ReactNode }): JSX.Element {
    const { playerId, gameId } = useAppContext();

    return (
        <>
            <Box
                component="main"
                sx={{
                    width: '100dvw'
                }}
            >
                <Navbar sx={{
                    backgroundColor: 'green',
                    minHeight: '30px',
                    height: 'auto'
                }}>
                    <Group sx={{
                    }}>
                        {playerId && <EndSessionButton />}
                        {playerId && <PlayerDetails />}
                        {gameId && <GameDetails />}
                    </Group>
                </Navbar>
                <Box
                    component="main"
                    sx={{
                        minHeight: '100vh',
                        display: 'flex',
                        paddingTop: '2rem',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Header />

                    <main>{children}</main>
                    <DisplayListings />
                </Box>
            </Box>
            <Footer />
        </>
    )
}