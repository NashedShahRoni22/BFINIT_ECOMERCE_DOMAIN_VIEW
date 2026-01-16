"use client";

import { ArrowLeft, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogDetailsPage({ params }) {
  const router = useRouter();
  const { id } = use(params);
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://ecomback.bfinit.com/blog/?blogId=${id}`,
        );
        const data = await response.json();
        setBlog(data.data);
      } catch (err) {
        console.error("Error fetching blog:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.blogName,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy link");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="bg-background min-h-screen">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="aspect-video w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-foreground text-xl font-semibold">
            Blog not found
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            The blog post you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Header Navigation */}
      <div className="border-border bg-card sticky top-0 z-10 border-b backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-muted-foreground hover:text-foreground -ml-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <article className="mx-auto max-w-7xl px-4 py-12">
        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-foreground text-4xl leading-tight font-bold lg:text-5xl">
            {blog.blogName}
          </h1>
        </header>

        {/* Featured Image */}
        {blog.blogImage && blog.blogImage[0] && (
          <div className="mb-8">
            <img
              src={`https://ecomback.bfinit.com${blog.blogImage[0]}`}
              alt={blog.blogName}
              className="aspect-video w-full rounded-lg object-cover"
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=675&fit=crop";
              }}
            />
          </div>
        )}

        {/* Blog Content */}
        <div
          id="content-display"
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.blogDescription }}
        />

        {/* Article Footer */}
        <footer className="border-border mt-12 border-t pt-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>

            <Button variant="secondary" size="sm" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </footer>
      </article>
    </div>
  );
}
