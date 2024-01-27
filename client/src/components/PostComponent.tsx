import { useState } from "react";
import { FaComment, FaHeart } from "react-icons/fa";
import { useUser } from "./UserContext";

export default function PostComponent({ post, index }: any) {

    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const [showComments, setShowComments] = useState(false);

    const handleComment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(loading) return;
        if(!user) return;
        setLoading(true);
        const comment = e.currentTarget.comment.value;
        if(!comment) return;
        try {
            const result = await user.api.createComment({
                content: comment,
                post_id: post.id
            });
            if(result.success) {
                console.log(result);
                window.location.reload();
            } else {
                console.log("error")
                setLoading(false);
            }
        } catch(err) {
            setLoading(false);
        }
    }

    const handleDelete = async () => {
        if(loading) return;
        if(!user) return;
        setLoading(true);
        try {
            const result = await user.api.deletePost({
                post_id: post.id
            });
            if(result.success) {
                console.log(result);
                window.location.reload();
            } else {
                console.log("error")
                setLoading(false);
            }
        } catch(err) {
            setLoading(false);
        }
    }

    const handleLike = async () => {
        if(loading) return;
        if(!user) return;
        setLoading(true);
        try {
            const result = await user.api.likePost({
                post_id: post.id
            });
            if(result.success) {
                console.log(result);
                window.location.reload();
            } else {
                console.log("error")
                setLoading(false);
            }
        } catch(err) {
            setLoading(false);
        }
    }

    return(
        <div className="w-full md:w-1/2 mx-auto" key={index}>
        <div className="bg-zinc-800 rounded-lg shadow-lg p-4 mb-4">
            {
                (user && (user.id === post.author.id || user.is_admin)) && (
                    <div className="flex items-center">
                        <button className="p-1 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-lg focus:border-blue-300 uppercase disabled:opacity-50 text-xs" disabled={loading} onClick={handleDelete}>
                            X Smazat
                        </button>
                    </div>
                )
            }
          <h1 className="text-2xl font-semibold uppercase">{post.title} <span className="text-gray-300 text-xs font-normal">({new Date(post.created).toLocaleString()})</span></h1>
          <p className="text-gray-400 text-sm mb-4">{post.description}</p>
          <hr className="border-gray-700 mb-4" />
          <p className="text-gray-400 text-sm mb-4">{post.content}</p>
          <div className="flex items-center">
            <p className="text-gray-400 text-sm">Post by: <span className="text-gray-300">{post.author.display_name}</span></p>
          </div>
          <div className="flex items-center mt-4">
            <div className="flex items-center hover:text-gray-200 cursor-pointer hover:scale-110 transition duration-200 ease-in-out" onClick={handleLike}>
              {
                post.likes.find((like: any) => like.user.id === user?.id) ? (
                  <FaHeart className="text-red-500" />
                ) : (
                  <FaHeart className="text-gray-400" />
                )
              }
              <p className="text-gray-400 text-sm ml-2">{post.likes.length}</p>
            </div>
            <div className="flex items-center ml-4 hover:text-gray-200 cursor-pointer hover:scale-110 transition duration-200 ease-in-out" onClick={() => setShowComments(!showComments)}>
              <FaComment className="text-blue-500" />
              <p className="text-gray-400 text-sm ml-2">{post.comments.length}</p>
            </div>
          </div>
        </div>
        {
            showComments && (
                <div className="bg-zinc-800 rounded-lg shadow-lg p-4 mb-4">
                <h1 className="text-2xl font-semibold uppercase">Comments</h1>
                <hr className="border-gray-700 mb-4" />
                {
                    post.comments.length === 0 && (
                        <p className="text-gray-400 text-sm mb-4">No comments yet</p>
                    )
                }
                {
                    user && (
                        <form className="flex flex-row gap-4" onSubmit={handleComment}>
                            <input className="w-3/4 h-8 shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-lg focus:border-blue-300 bg-zinc-800 border-zinc-700 mb-4" id="comment" type="text" placeholder="Comment" />
                            <button className="h-8 w-1/4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-lg focus:border-blue-300 uppercase disabled:opacity-50" type="submit" disabled={loading}>
                                SUBMIT
                            </button>
                        </form>
                    )
                }
                {
                    post.comments.map((comment: any, index: number) => {
                        return(
                            <div className="bg-zinc-700 rounded-lg shadow-lg p-4 mb-4" key={index}>
                            <p className="text-gray-400 text-sm mb-4">{comment.content}</p>
                            <div className="flex items-center">
                                <p className="text-gray-400 text-sm">Comment by: <span className="text-gray-300">{comment.author.display_name}</span></p>
                            </div>
                            </div>
                        )
                    })
                }
                </div>
            )
        }
      </div>
    )
}