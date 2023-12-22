import '../src/app/globals.css';
import { AuthProvider } from '../src/app/components/contexts/AuthContext';


function MyApp({ Component, pageProps }) {
  return(
  <AuthProvider>
  <Component {...pageProps} />
</AuthProvider>
  );
}

export default MyApp;
