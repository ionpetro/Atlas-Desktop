import './globals.css'

export const metadata = {
	title: 'Atlas Desktop',
	description: 'A desktop application for Atlas',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	)
}
