import { Box, Text } from "@mantine/core"
import { ReactNode } from "react"
import Footer from "./footer"
import Header from "./header"

export default function Layout({ children }: { children: ReactNode }): JSX.Element {

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
        </>
    )
}