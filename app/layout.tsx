import type {Metadata} from "next"
import {Geist_Mono} from "next/font/google"
import localFont from "next/font/local"

import "./globals.css"
import {ConvexAuthNextjsServerProvider} from "@convex-dev/auth/nextjs/server"
import ConvexClientProvider from "@/components/ConvexClientProvider"
import {Toaster} from "@/components/ui/sonner"
import {randomTitle} from "@/lib/random-title"

const martianGrotesk = localFont({
	src: "./fonts/MartianGrotesk.woff2",
	variable: "--font-martian-grotesk",
})

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
})

export const metadata: Metadata = {
	title: randomTitle(),
	description: "tegerek",
	icons: {
		icon: "/convex.svg",
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<ConvexAuthNextjsServerProvider>
			<html lang="en" className="h-full">
				<body
					className={`${martianGrotesk.variable} ${geistMono.variable} antialiased h-full`}
				>
					<ConvexClientProvider>
						{children}
						<Toaster />
					</ConvexClientProvider>
				</body>
			</html>
		</ConvexAuthNextjsServerProvider>
	)
}
