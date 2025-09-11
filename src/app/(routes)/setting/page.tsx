import React from "react";
import Setting from "./Setting";
import { getUsers } from "@/app/data/user/get-users";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Setting`,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/setting`,
    },
    openGraph: {
      type: "website",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/setting`,
      title: `Setting`,
    },
  };
}

const SettingPage = async () => {
  const user = await getUsers();
  return (
    <div className="container mx-auto my-10 px-8">
      <Setting user={user} />
    </div>
  );
};

export default SettingPage;
