import { useUser } from "@/components/UserContext";
import MainLayout from "@/components/layouts/MainLayout";
import { useRef, useState } from "react";

export default function CreatePostPage() {

    const { user } = useUser();
    if(!user) return null;

    const [loading, setLoading] = useState(false);
    const titleRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLInputElement>(null);
    const contentRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!titleRef.current || !contentRef.current || !descriptionRef.current) return;
        const title = titleRef.current.value;
        const content = contentRef.current.value;
        const description = descriptionRef.current.value;
        if(!title || !content || !description) return;
        setLoading(true);
        try {
            const result = await user.api.createPost({
                title,
                content,
                description
            })
            if(result.success) {
                console.log(result);
                window.location.href = `/`;
            } else {
                console.log("error")
            }
        } catch(err) {
            console.log(err);
        }
        setLoading(false);
    }

    return(
        <MainLayout>
            <div className="w-full md:w-1/2 mx-auto">
                <div className="bg-zinc-800 rounded-lg shadow-lg p-4">
                    <form className="flex flex-col" onSubmit={handleSubmit}>
                        <h1 className="text-2xl font-semibold uppercase">Create a Post</h1>
                        <p className="text-gray-400 text-sm mb-4">Create a post to share with the community</p>
                        <div className="mb-4">
                            <label className="block text-gray-200 uppercase text-sm font-bold mb-2" htmlFor="title">
                                Title
                            </label>
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-lg focus:border-blue-300 bg-zinc-800 border-zinc-700" id="title" type="text" placeholder="Title" ref={titleRef} />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-200 uppercase text-sm font-bold mb-2" htmlFor="description">
                                Description
                            </label>
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-lg focus:border-blue-300 bg-zinc-800 border-zinc-700" id="description" type="text" placeholder="Description" ref={descriptionRef} />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-200 uppercase text-sm font-bold mb-2" htmlFor="content">
                                Content
                            </label>
                            <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-lg focus:border-blue-300 bg-zinc-800 border-zinc-700
                            " id="content" placeholder="Content" ref={contentRef} />
                        </div>
                        <div className="flex justify-end">
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-lg focus:border-blue-300" type="submit">
                                SUBMIT
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    )
}