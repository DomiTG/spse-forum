import Link from "next/link"
import { useUser } from "../UserContext"

export default function MainLayout({ children }: any) {
    const { user } = useUser();
    const navbarButtons = [
        {
            name: "Home",
            href: "/",
            loggedIn: false
        },
        {
            name: "Create a Post",
            href: "/posts/create",
            loggedIn: true
        },
    ]

    return(
        <div className="min-h-screen bg-zinc-900">
            <nav className="w-full bg-zinc-800 border-b border-zinc-700">
                <h1 className="text-2xl font-semibold text-center uppercase py-4">SPSE Forum</h1>
                <div className="flex justify-center">
                    {
                        navbarButtons.map((button, index) => {
                            if(button.loggedIn && !user) return null;
                            return(
                                <Link href={button.href} key={index}>
                                    <p className="text-gray-200 uppercase text-sm font-bold mb-2 mx-2 cursor-pointer hover:text-gray-400">{button.name}</p>
                                </Link>
                            )
                        })
                    }
                    {!user && (
                        <>
                            <Link href="/auth/login">
                                <p className="text-gray-200 uppercase text-sm font-bold mb-2 mx-2 cursor-pointer hover:text-gray-400">Login</p>
                            </Link>
                            <Link href="/auth/register">
                                <p className="text-gray-200 uppercase text-sm font-bold mb-2 mx-2 cursor-pointer hover:text-gray-400">Register</p>
                            </Link>
                        </>
                    )}
                    {
                        user && (
                            <>
                                <button onClick={() => {
                                    if(user) {
                                        user.api.logOut().then((res) => {
                                            if(res.success) {
                                                window.location.href = "/";
                                            }
                                        })
                                    }
                                }}>
                                    <p className="text-gray-200 uppercase text-sm font-bold mb-2 mx-2 cursor-pointer hover:text-gray-400">Logout</p>
                                </button>
                            </>
                        )
                    
                    }
                </div>
            </nav>
            <div className="p-4">
                {children}
            </div>
        </div>
    )
}