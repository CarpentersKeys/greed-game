import { Box } from "@mantine/core"
import { ReactNode, useContext } from "react"
import Footer from "./footer"
import Header from "./header"
import EndSessionButton from "../session/endSession"
import DisplayListings from "./displayListings"
import { useAppContext } from "../../context/appContext"

export default function Layout({ children }: { children: ReactNode }): JSX.Element {
    const { playerId } = useAppContext();

    return (
        <>
            <Box
                component="main"
                sx={{
                    paddingLeft: '2rem',
                    paddingRight: '2rem',
                }}
            >
                {
                    playerId &&
                    <EndSessionButton />
                }
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
                    <DisplayListings />
                </Box>
            </Box>
            <Footer />
        </>
    )
}