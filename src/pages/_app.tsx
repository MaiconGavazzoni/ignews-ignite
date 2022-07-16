import { AppProps } from 'next/app';
import { Header } from '../components/Header';
import '../styles/global.scss';
import { SessionProvider } from 'next-auth/react';


function MyApp({ Component, pageProps }: AppProps) {


  return (
    <SessionProvider session={pageProps.session}>
      <Header />
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp

// import { SessionProvider } from "next-auth/react"

// export default function App({
//   Component,
//   pageProps: { session, ...pageProps },
// }) {
//   return (
//     <SessionProvider session={session}>
//       <Component {...pageProps} />
//     </SessionProvider>
//   )
// }
