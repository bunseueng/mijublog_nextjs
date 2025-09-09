import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icon } from "@iconify/react/dist/iconify.js";
import { BlogPost } from "@/types/BlogPost";
import Image from "next/image";

const PostCard = ({ post }: { post: BlogPost }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <Image
              src={post.featuredImage ?? ""}
              alt="Blog Cover"
              width={500}
              height={500}
              quality={100}
              className="w-full h-[250px] object-cover"
            />
            <CardTitle className="text-xl mb-2 leading-tight">
              <a href="#" className="hover:text-accent transition-colors">
                {post.title}
              </a>
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              {post.excerpt}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span>•</span>
            <div className="flex items-center space-x-1.5">
              <Icon icon="tabler:clock-hour-10" width="24" height="24" />
              <p className="text-xs md:text-sm">
                {post?.readingTime} min, To Read
              </p>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1.5">
              <Icon icon="tabler:eye" width="24" height="24" />
              <p className="text-xs md:text-sm">{post?.viewCount} views</p>
            </div>
          </div>
          <a
            href={`/blog/${post.slug}`}
            className="text-accent hover:text-accent/80"
          >
            Read More →
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
