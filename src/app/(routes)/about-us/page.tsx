import { Facebook } from "lucide-react";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `About Us`,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/about-us`,
    },
    openGraph: {
      type: "website",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/about-us`,
      title: `About Us`,
    },
  };
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">About Us</h1>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Illustration */}
          <div className="flex justify-center">
            <img
              src="/about-us.jpg"
              alt="MijuBlog"
              className="w-full max-w-md h-auto rounded-md"
            />
          </div>

          {/* Right Side - Content */}
          <div className="space-y-6">
            <div>
              <p className="text-lg leading-relaxed">
                Welcome to{" "}
                <span className="text-red-500 font-semibold">MijuBlog</span>!
                This platform is all about celebrating and sharing the
                captivating world of Chinese dramas. Our goal is to make
                discovering amazing C-dramas easy and accessible for everyone.
              </p>
            </div>

            <div>
              <p className="text-lg leading-relaxed">
                We focus on topics like{" "}
                <span className="text-red-500 font-semibold">
                  historical dramas
                </span>
                ,{" "}
                <span className="text-red-500 font-semibold">
                  modern romance
                </span>
                , and hidden gems in Chinese entertainment. Whether you&apos;re
                looking for your next binge-watch, want to explore different
                genres, or dive into behind-the-scenes content, we&apos;re here
                to help.
              </p>
            </div>

            <div>
              <p className="text-lg leading-relaxed">
                At <span className="text-red-500 font-semibold">MijuBlog</span>,
                we believe in growing together as a community of drama
                enthusiasts. If you have recommendations, want to share your
                thoughts on a series, or have suggestions for reviews, feel free
                to leave a comment or contact us. Your input helps us improve
                and provide better content.
              </p>
            </div>

            <div className="pt-4">
              <p className="text-lg mb-6">Stay connected with us on:</p>

              <div className="flex flex-col gap-3">
                <a
                  href="https://web.facebook.com/share/g/15rCwuDhF4/"
                  className="flex items-center gap-3 text-red-500 hover:text-red-400 transition-colors text-lg"
                >
                  <Facebook className="w-5 h-5" />
                  Facebook Group (Ju Jingyi Fan Group)
                </a>
                <a
                  href="https://mijudramainfo.netlify.app/"
                  className="flex items-center gap-3 text-red-500 hover:text-red-400 transition-colors text-lg"
                >
                  <img
                    src="/mijudramainfo.png"
                    alt="MijuDramaInfo"
                    className="w-auto h-auto"
                  />
                  MijuDramaInfo (Drama Info Site)
                </a>
              </div>
            </div>

            <div className="pt-6">
              <p className="text-lg">
                Thanks for being a part of{" "}
                <span className="text-red-500 font-semibold">MijuBlog</span>.
                Let&apos;s explore the wonderful world of Chinese dramas
                together!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
