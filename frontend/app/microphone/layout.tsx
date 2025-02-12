import '../globals.css'

export const metadata = {
	title: 'Atlas - Voice Input',
	description: 'Voice input for Atlas',
}

export default function MicrophoneLayout({
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
