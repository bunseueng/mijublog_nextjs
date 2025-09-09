import type { BlogPost } from "@/types/BlogPost";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import Link from "next/link";

interface FeatureBlogProps {
  blog_post: BlogPost[];
}

const FeatureBlog = ({ blog_post }: FeatureBlogProps) => {
  return (
    <>
      {blog_post.length > 0 ? (
        <>
          {blog_post.map((blog, idx) => (
            <article
              className="group bg-card rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-border/50 dark:border-transparent overflow-hidden"
              key={idx}
            >
              <div className="flex flex-col gap-4">
                <div className="w-full h-48 flex-shrink-0">
                  <Link
                    href={`/blog/${blog.slug}`}
                    className="block w-full h-full group-hover:scale-[1.02] transition-transform duration-300"
                  >
                    <Image
                      src={(blog.featuredImage as string) || "/placeholder.svg"}
                      alt={blog.title}
                      width={320}
                      height={192}
                      quality={90}
                      className="w-full h-full rounded-t-lg object-cover"
                    />
                  </Link>
                </div>

                <div className="p-6">
                  <div className="flex flex-col space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.slice(0, 4).map((tag) => (
                        <Link
                          href={`/tags/${tag.tag.slug}`}
                          key={tag.id}
                          className="cursor-pointer"
                        >
                          <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors">
                            {tag.tag.name.length > 15
                              ? tag.tag.name.slice(0, 15) + "..."
                              : tag.tag.name}
                          </span>
                        </Link>
                      ))}
                    </div>

                    <Link href={`/blog/${blog.slug}`} className="group/title">
                      <h2 className="text-lg font-heading font-semibold text-foreground group-hover/title:text-primary transition-colors duration-200 line-clamp-2">
                        {blog.title}
                      </h2>
                    </Link>

                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                      {blog.excerpt}
                    </p>

                    <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Image
                          src={
                            (blog.author.image as string) || "/placeholder.svg"
                          }
                          alt="Author Avatar"
                          width={20}
                          height={20}
                          quality={100}
                          className="w-5 h-5 object-cover rounded-full ring-2 ring-background"
                        />
                        <span className="font-medium text-foreground">
                          {blog.author.name}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Icon
                            icon="tabler:calendar-week"
                            width="14"
                            height="14"
                            className="text-muted-foreground"
                          />
                          <span>{blog.createdAt.toLocaleDateString()}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <Icon
                            icon="tabler:clock-hour-10"
                            width="14"
                            height="14"
                            className="text-muted-foreground"
                          />
                          <span>{blog.readingTime} min</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </>
      ) : (
        <div className="col-span-full flex items-center justify-center mt-24">
          <div className="flex flex-col items-center">
            <Icon icon="tabler:tag-filled" width="50" height="50" />
            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-3">
              No Blog Posts Available!
            </h3>
            <p className="text-gray-500 dark:text-gray-100 mb-6 max-w-md mx-auto">
              We&apos;re working on bringing you great content in this category.
              Check back soon or explore other categories in the meantime.
            </p>
            <Link
              href={"/page/1"}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Icon icon="tabler:arrow-right" width="24" height="24" />
              Browse other blog
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default FeatureBlog;
