import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import {
  GlowWalletAdapter,
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Script from 'next/script'
import { ReactElement, ReactNode, useMemo } from 'react'
import { Provider } from 'react-redux'
import '../css/main.css'
import { store } from '../stores/store'
import { solanaWalletEndpoint } from '../env'

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => page)

  const title = `Two x Two`
  const description = 'The fun way to play Padel'
  const url = '<TODO>'
  const image = `TODO`
  const imageWidth = '1920'
  const imageHeight = '960'

  // initialise all the wallets you want to use
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new GlowWalletAdapter(),
      new SlopeWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
      new SolletExtensionWalletAdapter(),
      new SolletWalletAdapter(),
    ],
    []
  )

  return (
    <ConnectionProvider endpoint={solanaWalletEndpoint}>
      <WalletProvider wallets={wallets} autoConnect={true}>
        <WalletModalProvider>
          <Provider store={store}>
            {getLayout(
              <>
                <Head>
                  <meta name="description" content={description} />

                  <meta property="og:url" content={url} />
                  <meta property="og:site_name" content="JustBoil.me" />
                  <meta property="og:title" content={title} />
                  <meta property="og:description" content={description} />
                  <meta property="og:image" content={image} />
                  <meta property="og:image:type" content="image/png" />
                  <meta property="og:image:width" content={imageWidth} />
                  <meta property="og:image:height" content={imageHeight} />

                  <meta property="twitter:card" content="summary_large_image" />
                  <meta property="twitter:title" content={title} />
                  <meta property="twitter:description" content={description} />
                  <meta property="twitter:image:src" content={image} />
                  <meta property="twitter:image:width" content={imageWidth} />
                  <meta property="twitter:image:height" content={imageHeight} />

                  <link rel="icon" href="/favicon.png" />
                </Head>

                <Script
                  src="https://www.googletagmanager.com/gtag/js?id=UA-130795909-1"
                  strategy="afterInteractive"
                />

                <Script id="google-analytics" strategy="afterInteractive">
                  {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'UA-130795909-1');
            `}
                </Script>

                <Component {...pageProps} />
              </>
            )}
          </Provider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default MyApp
