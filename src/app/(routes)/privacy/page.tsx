import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Privacy Policy`,
    alternates: {
      canonical: `${process.env.BASE_URL}/privacy`,
    },
    openGraph: {
      type: "website",
      url: `${process.env.BASE_URL}/privacy`,
      title: `Privacy Policy`,
    },
  };
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-cyan-500 dark:text-cyan-400 text-lg">
            Last Updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="space-y-12">
          {/* Introduction */}
          <div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg mb-8">
              Welcome to MijuBlog (&apos;we,&apos; &apos;our,&apos; or
              &apos;us&apos;). By accessing or using our website, you agree to
              comply with and be bound by this Privacy Policy. We are committed
              to protecting your privacy and ensuring you have a positive
              experience on our Chinese drama blog.
            </p>
          </div>

          {/* 1. Information We Collect */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              1. Information We Collect
            </h2>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Personal Information
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                We may collect personal information that you voluntarily provide
                when you:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
                <li>Leave comments on our blog posts</li>
                <li>
                  Contact us through our{" "}
                  <a
                    href="/contact-us"
                    className="text-cyan-600 dark:text-cyan-400 hover:underline"
                  >
                    contact page
                  </a>
                </li>
                <li>Create an account on our website</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Automatically Collected Information
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                When you visit our website, we automatically collect certain
                information about your device and usage patterns:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
                <li>IP address and location data</li>
                <li>Browser type and version</li>
                <li>Pages visited and time spent on our site</li>
                <li>Referring website information</li>
                <li>Device information and screen resolution</li>
              </ul>
            </div>
          </div>

          {/* 2. Google AdSense */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              2. Google AdSense and Advertising
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              We use Google AdSense to display advertisements on our website.
              Google AdSense uses cookies and other tracking technologies to
              serve ads based on your interests and previous visits to our site
              and other websites.
            </p>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                How Google AdSense Works
              </h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
                <li>
                  Google uses cookies to serve ads based on your prior visits to
                  our website or other websites
                </li>
                <li>
                  Google&apos;s use of advertising cookies enables it and its
                  partners to serve ads based on your visit to our site and/or
                  other sites on the Internet
                </li>
                <li>
                  You may opt out of personalized advertising by visiting
                  Google&apos;s Ads Settings
                </li>
                <li>
                  Third-party vendors, including Google, use cookies to serve
                  ads based on your previous visits to our website
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Your Advertising Choices
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                You can control how Google uses your data for advertising
                purposes by visiting the Google Ad Settings page. You can also
                opt out of interest-based advertising through the Digital
                Advertising Alliance&apos;s opt-out page or the Network
                Advertising Initiative&apos;s opt-out page.
              </p>
            </div>
          </div>

          {/* 3. Cookies */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              3. Cookies and Tracking Technologies
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              We use cookies and similar tracking technologies to enhance your
              browsing experience and analyze website traffic.
            </p>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Types of Cookies We Use
              </h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
                <li>
                  <strong className="text-gray-900 dark:text-white">
                    Essential Cookies:
                  </strong>{" "}
                  Required for basic website functionality
                </li>
                <li>
                  <strong className="text-gray-900 dark:text-white">
                    Analytics Cookies:
                  </strong>{" "}
                  Help us understand how visitors interact with our website
                </li>
                <li>
                  <strong className="text-gray-900 dark:text-white">
                    Advertising Cookies:
                  </strong>{" "}
                  Used by Google AdSense to display relevant advertisements
                </li>
                <li>
                  <strong className="text-gray-900 dark:text-white">
                    Preference Cookies:
                  </strong>{" "}
                  Remember your settings and preferences
                </li>
              </ul>
            </div>
          </div>

          {/* 4. How We Use Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              4. How We Use Your Information
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              We use the information we collect for the following purposes:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
              <li>To provide and maintain our website and services</li>
              <li>To send you newsletters and updates about Chinese dramas</li>
              <li>To respond to your comments and inquiries</li>
              <li>To analyze website usage and improve our content</li>
              <li>
                To display personalized advertisements through Google AdSense
              </li>
              <li>To comply with legal obligations</li>
            </ul>
          </div>

          {/* 5. Information Sharing */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              5. Information Sharing and Disclosure
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              We do not sell, trade, or otherwise transfer your personal
              information to third parties, except in the following
              circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
              <li>With Google AdSense for advertising purposes</li>
              <li>With analytics providers to understand website usage</li>
              <li>When required by law or to protect our rights</li>
              <li>With service providers who assist in website operations</li>
            </ul>
          </div>

          {/* 6. Data Security */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              6. Data Security
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We implement appropriate security measures to protect your
              personal information against unauthorized access, alteration,
              disclosure, or destruction. However, no method of transmission
              over the Internet or electronic storage is 100% secure, and we
              cannot guarantee absolute security.
            </p>
          </div>

          {/* 7. Your Rights */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              7. Your Rights and Choices
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              Depending on your location, you may have the following rights
              regarding your personal information:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
              <li>Access to your personal information</li>
              <li>Correction of inaccurate information</li>
              <li>Deletion of your personal information</li>
              <li>Opt-out of marketing communications</li>
              <li>Opt-out of personalized advertising</li>
            </ul>
          </div>

          {/* 8. Children&apos;s Privacy */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              8. Children&apos;s Privacy
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Our website is not intended for children under the age of 13. We
              do not knowingly collect personal information from children under
              13. If you are a parent or guardian and believe your child has
              provided us with personal information, please contact us so we can
              delete such information.
            </p>
          </div>

          {/* 9. Changes to Policy */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              9. Changes to This Privacy Policy
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on
              this page and updating the &apos;Last updated&apos; date. We
              encourage you to review this Privacy Policy periodically for any
              changes.
            </p>
          </div>

          {/* 10. Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              10. Contact Us
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or our data
              practices, please contact us:
            </p>
            <div className="text-gray-600 dark:text-gray-300 space-y-2 ml-4">
              <p>• Email: mijudramainfo@gmail.com</p>
              <p>
                • Website:{" "}
                <a
                  href="/contact-us"
                  className="text-cyan-600 dark:text-cyan-400 hover:underline"
                >
                  Contact Us
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
