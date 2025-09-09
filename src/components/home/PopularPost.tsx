import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import Link from "next/link";

export interface PopularPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImage: string | null;
  viewCount: number;
  readingTime: number | null;
  publishedAt: Date | null;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  tags: Array<{
    tag: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
  _count: {
    comments: number;
    likes: number;
  };
}

export default async function PopularPosts({
  popularPosts,
}: {
  popularPosts: PopularPost[];
}) {
  const formatViewCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return "";

    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 168) {
      // 7 days
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  if (popularPosts.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
          <Icon
            icon="tabler:trending-up"
            className="text-accent"
            width="24"
            height="24"
          />
          Popular This Month
        </h3>
        <div className="text-center py-8">
          <Icon
            icon="tabler:article-off"
            className="text-muted-foreground mx-auto mb-3"
            width="48"
            height="48"
          />
          <p className="text-muted-foreground">
            No popular posts yet this month
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
        <Icon
          icon="tabler:trending-up"
          className="text-accent"
          width="20"
          height="20"
        />
        Popular This Month
      </h3>
      <div className="space-y-4">
        {popularPosts.map((post, index) => (
          <article className="group cursor-pointer relative" key={post.id}>
            <div className="absolute -left-2 top-2 w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-xs font-bold shadow-sm z-10">
              {index + 1}
            </div>
            <Link href={`/blog/${post.slug}`} className="block">
              <div className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-all duration-200">
                <div className="relative overflow-hidden rounded-lg flex-shrink-0">
                  <Image
                    src={post.featuredImage || "/placeholder.jpg"}
                    alt={post.title}
                    width={200}
                    height={200}
                    className="w-[100px] h-[100px] object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                    <Icon icon="tabler:eye" width="12" height="12" />
                    <span>{formatViewCount(post.viewCount)}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {post.category && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
                        {post.category.name}
                      </span>
                    )}
                    {post.tags.slice(0, 1).map((tagItem) => (
                      <span
                        key={tagItem.tag.id}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary/50 text-secondary-foreground"
                      >
                        {tagItem.tag.name}
                      </span>
                    ))}
                  </div>
                  <h4 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-accent transition-colors">
                    {post.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <Image
                      src={post.author.image || "/default-pf.jpg"}
                      alt={`${post.author.name} avatar`}
                      width={16}
                      height={16}
                      className="w-4 h-4 object-cover rounded-full"
                    />
                    <span className="truncate">
                      {post.author.name || "Anonymous"}
                    </span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Icon icon="tabler:clock" width="12" height="12" />
                      <span>
                        {post.readingTime
                          ? `${post.readingTime} min read`
                          : "3 min read"}
                      </span>
                    </div>
                    <span>•</span>
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Icon icon="tabler:heart" width="12" height="12" />
                      <span>{post._count.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon
                        icon="tabler:message-circle"
                        width="12"
                        height="12"
                      />
                      <span>{post._count.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
