import { globalStyle } from '@/styles/globalStyle'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'

globalStyle()

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
