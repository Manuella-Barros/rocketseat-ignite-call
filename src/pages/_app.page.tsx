import '../lib/dayjs'
import { globalStyle } from '@/styles/globalStyle'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'sonner'
import { queryClient } from '@/lib/react-query'
import { QueryClientProvider } from '@tanstack/react-query'

globalStyle()

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <Toaster richColors />
        <Component {...pageProps} />
      </SessionProvider>
    </QueryClientProvider>
  )
}
