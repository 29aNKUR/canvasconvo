import { DEFAULT_EASE } from '@/common/constants/easings'
import { ModalManager } from '@/modal'
import '@/styles/globals.css'
import { MotionConfig } from 'framer-motion'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ToastContainer } from 'react-toastify'
import { RecoilRoot } from 'recoil'



export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
    <Head>
    <title>CanvasConvo | Onlie Whiteboard with Chat</title>
    <link rel="icon" href="/favicon.ico"/>
    </Head>
    <RecoilRoot>
      <ToastContainer />
      <MotionConfig transition={{ ease: DEFAULT_EASE }}>
        <ModalManager />
        <Component {...pageProps} />
        </MotionConfig>
    </RecoilRoot>
    </>
  )
}
