import { Button, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
import { Spinner } from "flowbite-react"; // Importing Flowbite's Spinner for loading effect

const Search = () => {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // To navigate programmatically

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const categoryFromUrl = urlParams.get("category");

    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        searchTerm: searchTermFromUrl || "",
        sort: sortFromUrl || "desc",
        category: categoryFromUrl || "uncategorized",
      });
    }

    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      try {
        const res = await fetch(`/api/v1/post/posts?${searchQuery}`);
        if (!res.ok) {
          setLoading(false);
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts);
          setLoading(false);
          if (data.posts.length === 9) {
            setShowMore(true);
          } else {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchPosts();
  }, [location.search]); // Add location.search as a dependency to re-render on URL change

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (e.target.id === "sort") {
      const order = e.target.value || "desc";
      setSidebarData({ ...sidebarData, sort: order });
    }
    if (e.target.id === "category") {
      const category = e.target.value || "uncategorized";
      setSidebarData({ ...sidebarData, category });
    }
  };

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    const { searchTerm, sort, category } = sidebarData;

    // Prepare query parameters
    const queryParams = new URLSearchParams();
    if (searchTerm) queryParams.set("searchTerm", searchTerm);
    if (sort) queryParams.set("sort", sort);
    if (category && category !== "uncategorized") {
      queryParams.set("category", category);
    }

    // Update the URL with query parameters and trigger re-fetch
    navigate({
      search: queryParams.toString(),
    });
  };
  console.log(showMore);
  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    console.log(numberOfPosts);
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/v1/post/posts?${searchQuery}`);
    if (!res.ok) {
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setPosts([...posts, ...data.posts]);
      if (data.posts.length > 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label
              className="whitespace-nowrap font-semibold"
              htmlFor="searchTerm"
            >
              Search Term
            </label>
            <TextInput
              placeholder="search..."
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange} // Update the search term in state
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="whitespace-nowrap font-semibold">Sort:</label>
            <Select
              id="sort"
              value={sidebarData.sort} // Controlled value
              onChange={handleChange}
            >
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <label className="whitespace-nowrap font-semibold">Category:</label>
            <Select
              id="category"
              value={sidebarData.category} // Controlled value
              onChange={handleChange}
            >
              <option value="uncategorized">Uncategorized</option>
              <option value="reactjs">React.js</option>
              <option value="nextjs">Next.js</option>
            </Select>
          </div>
          <Button type="submit">Search</Button>
        </form>
      </div>
      <div className="flex flex-col p-7 w-full">
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Spinner size="lg" />
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-500 font-semibold">
            No posts found.
          </p>
        ) : (
          <div className="flex justify-center flex-wrap gap-3">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
            {showMore && (
              <button
                onClick={handleShowMore}
                className="mt-4 w-full text-blue-600"
              >
                Show More
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
