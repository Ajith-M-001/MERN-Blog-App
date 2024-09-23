import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Spinner, Button } from "flowbite-react";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";

const Postpage = () => {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPost, setRecentPost] = useState(null);

  useEffect(() => {
    const fetchPostBySlug = async (slug) => {
      try {
        setLoading(true);
        const res = await fetch(`/api/v1/post/posts?slug=${slug}`);

        const data = await res.json();
        if (!res.ok) {
          setError(data.message);
          setLoading(false);
        }
        if (res.ok) {
          setPost(data.posts[0]);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchPostBySlug(postSlug);
  }, [postSlug]);

  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const res = await fetch(`/api/v1/post/posts?limit=3`);
        const data = await res.json();
        setRecentPost(data.posts);
        console.log(data);
      };

      fetchRecentPosts();
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Spinner size={"xl"} />
        </div>
      ) : (
        <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
          {post && (
            <>
              <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
                {post.title}
              </h1>
              <Link
                to={`/search?category=${post.category}`}
                className="self-center mt-5"
              >
                <Button color={"gray"} size={"xs"} pill>
                  {post.category}
                </Button>
              </Link>
              <img
                src={post.image}
                alt={post.tile}
                className="mt-10 p-3 max-h-[600px] w-full object-cover"
              />
              <div className="flex justify-between  p-3 border-b border-slate-500 mx-auto w-full max-w-4xl text-xs">
                <span>{new Date(post.updatedAt).toLocaleDateString()}</span>
                <span>{(post.content.length / 1000).toFixed(0)} min Read</span>
              </div>

              <div
                className="p-3 max-w-2xl mx-auto w-full post-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              ></div>
              <div className="max-w-4xl mx-auto w-full">
                <CallToAction />
              </div>
              <CommentSection postId={post._id} />
              <div className="flex flex-col justify-center items-center mb-5">
                <h1 className="text-xl mt-5">Recent Articles</h1>
                <div className="flex  gap-4 flex-wrap  justify-center  mt-4">
                  {recentPost &&
                    recentPost.map((post) => (
                      <PostCard key={post._id} post={post} />
                    ))}
                </div>
              </div>
            </>
          )}
        </main>
      )}
    </>
  );
};

export default Postpage;
