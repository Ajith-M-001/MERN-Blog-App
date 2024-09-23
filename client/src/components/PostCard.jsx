import { Link } from "react-router-dom";

const PostCard = (post) => {
  console.log(post);
  return (
    <div className="group relative w-full border h-[400px] overflow-hidden rounded-lg sm:w-[430px] border-teal-500 hover:border-2 transition-all duration-300 ">
      <Link to={`/post/${post.post.slug}`}>
        <img
          className="h-[260px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-20 "
          src={post.post.image}
          alt={post.post.title}
        />
        <div className="p-3 flex flex-col gap-2">
          <p className="text-lg font-semibold line-clamp-2">
            {post.post.title}
          </p>
          <span className="italic text-sm">{post.post.category}</span>
          <Link
            className="z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-500 text-center py-3 rounded-md !rounded-tl-none m-2"
            to={`/post/${post.post.slug}`}
          >
            Read article
          </Link>
        </div>
      </Link>
    </div>
  );
};

export default PostCard;
