// pages/_app.js
import '../styles/globals.css'
import Navbar from '../components/Navbar'
import { UserProvider } from '../contexts/UserContext'

export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <Navbar />
      <Component {...pageProps} />
    </UserProvider>
  )
}
