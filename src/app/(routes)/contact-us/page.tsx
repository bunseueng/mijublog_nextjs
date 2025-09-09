
import { Metadata } from "next";
import Contact from "./Contact";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Contact Us`,
    alternates: {
      canonical: `${process.env.BASE_URL}/contact-us`,
    },
    openGraph: {
      type: "website",
      url: `${process.env.BASE_URL}/contact-us`,
      title: `Contact Us`,
    },
  };
}

export default function ContactPage() {
return (
    <Contact />
)
}
