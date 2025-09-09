import React, { Suspense } from "react";
import ProfileComponent from "./ProfileComponent";
import { getUsers } from "@/app/data/user/get-users";
import { getBlog, getSavedPost } from "@/app/data/blog/get-blog";
import { User, UserType } from "@/types/BlogPost";
import { getFollowers, getFollowing } from "@/app/data/user/follow/getFollower";
import { Metadata } from "next";

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const users = await getUsers();
  const username = params.id
    ? decodeURIComponent(params.id.replace(/^@/, ""))
    : "";

  const user_data = users.find((u) => u.name === username.slice(1));

  return {
    title: `${user_data?.name} Profile`,
    description: user_data?.description ? user_data?.description : null,
    alternates: {
      canonical: `${process.env.BASE_URL}/@${user_data?.name}`,
    },
    openGraph: {
      type: "website",
      url: `${process.env.BASE_URL}/@${user_data?.name}`,
      description: user_data?.description ? user_data?.description : undefined,
      title: `${user_data?.name} Profile`,
      images: [
        {
          url: `${user_data?.image}`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

const ProfilePage = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  const users = await getUsers();
  const blogs = await getBlog();
  const username = params.id
    ? decodeURIComponent(params.id.replace(/^@/, ""))
    : "";

  const user_data = users.find((u) => u.name === username.slice(1));
  if (!user_data) {
    return <div>User not found</div>;
  }

  const savedPosts = await getSavedPost(user_data.id);
  const followers = await getFollowers(user_data.id);
  const following = await getFollowing(user_data.id);

  return (
    <div className="container mx-auto my-10">
      <Suspense fallback={<div>Loading...</div>}>
        <ProfileComponent
          blogs={blogs}
          user_data={user_data as User}
          currentUser_followers={followers as UserType[]}
          following={following as UserType[]}
          savedPosts={savedPosts}
        />
      </Suspense>
    </div>
  );
};

export default ProfilePage;
