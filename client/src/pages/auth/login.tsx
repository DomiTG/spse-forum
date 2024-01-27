import { API } from "@/components/api";
import { useRef, useState } from "react";

export default function LoginPage() {

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(loading) return;
        setLoading(true);
        if(!(usernameRef.current && passwordRef.current)) return;
        const username = usernameRef.current.value;
        const password = passwordRef.current.value;
        if(username === "" || password === "") return;
        try {
            const result = new API();
            const response = await result.login({
                username,
                password
            });
            if(response.success) {
                setLoading(false);
                window.location.href = "/"
            } else {
                setError(response.error);
                setLoading(false);
            }
        } catch(err) {
            setError("You entered an invalid username or password");
            setLoading(false);
        }
    }

    return(
        <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
            <form className="bg-zinc-800 border border-zinc-700 shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col w-96">
                {
                    error !== "" && (
                        <div className="mb-4">
                            <p className="text-red-500 text-sm">{error}</p>
                        </div>
                    )
                }
                <h2 className="text-2xl font-semibold uppercase">Sign In</h2>
                <p className="text-gray-400 text-sm mb-4">Sign in to your account</p>
                <div className="mb-4">
                    <label className="block text-gray-200 uppercase text-sm font-bold mb-2" htmlFor="username">
                        Username
                    </label>
                    <input ref={usernameRef} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-lg focus:border-blue-300 bg-zinc-800 border-zinc-700" id="username" type="text" placeholder="Username" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-200 uppercase text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input ref={passwordRef} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-lg focus:border-blue-300 bg-zinc-800 border-zinc-700" id="password" type="password" placeholder="Password" />
                </div>
                <button className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-lg uppercase disabled:opacity-50" type="submit" disabled={loading} onClick={(e) => handleSubmit(e as any)}>
                    Sign In
                </button>
            </form>
        </div>
    )
}