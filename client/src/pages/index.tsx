import MainLayout from "@/components/layouts/MainLayout";
import { useEffect, useState } from "react";
import { useUser } from "@/components/UserContext";
import PostComponent from "@/components/PostComponent";
import { fetchPosts } from "@/components/api";

export default function Home() {

  const { user } = useUser();
  const [posts, setPosts] = useState<any[]>([])
  const [filteredPosts, setFilteredPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const result = await fetchPosts({
          limit: 10,
          offset: 0
        });
        if(result.success) {
          setPosts(result.posts);
          setLoading(false);
        }
      } catch(err) {}
    }
    getPosts();
  }, [user])

  const filter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.currentTarget.value;
    if(value == "likes") {
      console.log(posts)
      setFilteredPosts(posts.sort((a, b) => b.likes - a.likes));
    } else if(value == "name") {
      setFilteredPosts(posts.sort((a, b) => a.title.localeCompare(b.title)));
      console.log(posts)
    } else if(value == "created") {
      setFilteredPosts(posts.sort((a, b) => b.created.localeCompare(a.created)));
      console.log(posts)
    }

  }

  return(
    <MainLayout>
      <p className="text-2xl font-semibold uppercase">Posts</p>
      <p className="text-gray-400 text-sm">Filter</p>
      <select className="bg-zinc-800 border border-zinc-700 shadow-md rounded px-4 py-2 mb-4 text-gray-200" onChange={filter}>
        <option value="likes">Likes</option>
        <option value="name">Name</option>
        <option value="created">Created</option>
      </select>
      {
        posts.length === 0 && (
          <div className="flex justify-center">
            <div className="w-full md:w-1/2 bg-zinc-800 rounded-lg shadow-lg p-4">
              <h1 className="text-2xl font-semibold uppercase">No Posts</h1>
              <p className="text-gray-400 text-sm mb-4">There are no posts to display</p>
            </div>
          </div>
        )
      }
      {
        filteredPosts.length > 0 && filteredPosts.map((post, index) => {
          return(
            <PostComponent post={post} key={index} />
          )
        })
      }
      {
        filteredPosts.length === 0 && posts.map((post, index) => {
          return(
            <PostComponent post={post} key={index} />
          )
        })
      }
    </MainLayout>
  )
}
