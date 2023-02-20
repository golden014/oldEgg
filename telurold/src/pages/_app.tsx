import AuthContextProvider from "modules/authProvider";
import { AppProps } from "next/app";
import "../styles/global.css"
import { useEffect, useState } from "react"

export default function App({ Component, pageProps }: AppProps) {


  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);


  useEffect(() => {
    const root = document.documentElement;
        root.style.setProperty('--navbar-background-color', isDarkMode ? '#050c2e' : '#fff');
        root?.style.setProperty("--button_bg_color", isDarkMode ? "#8EAFF0" : "#1946B8");
        root?.style.setProperty("--button_txt_color", isDarkMode ? "#050c2e" : "#fff");
        root?.style.setProperty("--desc_txt_color", isDarkMode ? "#969696" : "#969696");
        root.style.setProperty('--background-color', isDarkMode ? '#1e1e1e' : '#fff');
        root.style.setProperty('--footer-background-color', isDarkMode ? '#000000' : '#fff');
        root.style.setProperty('--p_txt_color', isDarkMode ? '#fff' : '#0e0e0e');


  }, [isDarkMode]);


  return (
    <AuthContextProvider>
      <Component {...pageProps} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}/> 
    </AuthContextProvider>
  )
}
