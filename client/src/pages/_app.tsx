import { UserProvider, useUser } from "@/components/UserContext";
import { API } from "@/components/api";
import IUser from "@/components/interfaces/IUser";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }: AppProps) {

  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const refreshToken = async () => {
      try {
        const result = new API();
        const response = await result.refreshToken();
        if(response.success) {
          result["accessToken"] = response.accessToken;
          response.user["api"] = result;
          setUser(response.user);
          setLoading(false);
          setTimeout(refreshToken, 1000 * 60 * 15);
        } 
      } catch(err) {}
    }
    refreshToken();
  }, [])

  return <UserProvider value={{ user, setUser }}><Component {...pageProps} /></UserProvider>
}
