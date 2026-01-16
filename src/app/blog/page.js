"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight } from "lucide-react";
import { staticStoreId } from "@/utils/storeId";
import { Skeleton } from "@/components/ui/skeleton";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://ecomback.bfinit.com/blog/all/?storeId=${staticStoreId}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }

        const data = await response.json();
        console.log(data);
        setBlogs(data?.data || []);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching blogs:", err);
      } finally {
        setIsLoading(false);
      }
    }

    if (staticStoreId) {
      fetchBlogs();
    }
  }, []);

  if (isLoading) {
    return (
      <div className="bg-background min-h-screen px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <Skeleton className="mx-auto mb-4 h-10 w-48" />
            <Skeleton className="mx-auto h-6 w-96" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <Skeleton className="h-48 w-full rounded-t-lg" />
                <CardContent className="p-6">
                  <Skeleton className="mb-4 h-6 w-full" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background min-h-screen px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Card className="p-12">
            <div className="text-center">
              <p className="text-destructive text-lg">
                Error loading blogs: {error}
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-foreground mb-4 text-4xl font-bold">Our Blog</h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Discover stories, insights, and updates from our store
          </p>
        </div>

        {/* Blog Grid */}
        {blogs.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <FileText className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <h3 className="text-foreground mb-2 text-lg font-medium">
                No blogs yet
              </h3>
              <p className="text-muted-foreground">
                Check back later for new content.
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard key={blog.blogId} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BlogCard({ blog }) {
  const [imageError, setImageError] = useState(false);

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
      {/* Blog Image */}
      <div className="bg-muted relative h-48 overflow-hidden">
        {!imageError ? (
          <img
            src={`https://ecomback.bfinit.com${blog.blogImage}`}
            alt={blog.blogName}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="bg-muted flex h-full w-full items-center justify-center">
            <FileText className="text-muted-foreground h-16 w-16" />
          </div>
        )}
      </div>

      {/* Blog Content */}
      <CardContent className="p-6">
        <h3 className="text-foreground mb-4 line-clamp-2 text-xl font-semibold">
          {blog.blogName}
        </h3>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button className="group w-full" asChild>
          <Link href={`/blog/${blog.blogId}`}>
            View Details
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
