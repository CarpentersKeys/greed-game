import { Box, Navbar } from "@mantine/core"
import { ReactNode, useContext, useEffect, useMemo, useState } from "react"
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
                    width: '100dvw'
                }}
            >
                <Navbar sx={{
                    backgroundColor: 'green',
                    height: '100px',
                }}>
                    <Box sx={{
                    }}>
                        {
                            playerId
                            && <EndSessionButton />
                        }
                    </Box>
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