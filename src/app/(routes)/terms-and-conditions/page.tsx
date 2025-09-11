import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Terms and Conditions`,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/terms-and-conditions`,
    },
    openGraph: {
      type: "website",
      url: `${process.env.BASE_URL}/terms-and-conditions`,
      title: `Terms and Conditions`,
    },
  };
}

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Terms and Conditions
          </h1>
          <p className="text-cyan-600 dark:text-cyan-400 text-sm">
            Last Updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="space-y-12 text-gray-600 dark:text-gray-300">
          <div className="leading-relaxed">
            <p>
              Welcome to MijuBlog ({process.env.BASE_URL}). By accessing or
              using our website, you agree to comply with and be bound by the
              following terms and conditions.
            </p>
          </div>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              1. Website Information
            </h2>
            <ul className="space-y-3 list-disc list-inside">
              <li>Website Name: MijuBlog</li>
              <li>Website URL: {process.env.BASE_URL}</li>
              <li>
                Contact Information: You can reach us through our{" "}
                <a
                  href="/contact-us"
                  className="text-cyan-600 dark:text-cyan-400 hover:underline"
                >
                  contact page
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              2. Acceptance of Terms
            </h2>
            <ul className="space-y-3 list-disc list-inside">
              <li>
                By accessing and using this website, you accept and agree to be
                bound by these Terms and Conditions.
              </li>
              <li>
                If you disagree with any part of these terms, you may not access
                the website.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              3. Intellectual Property Rights
            </h2>
            <ul className="space-y-3 list-disc list-inside">
              <li>
                All content on this website, including but not limited to text,
                graphics, logos, images, and blog posts, is the property of
                MijuBlog.
              </li>
              <li>You may:</li>
              <ul className="ml-6 mt-2 space-y-2 list-disc list-inside">
                <li>View and read our content for personal use</li>
                <li>Share our content with proper attribution to MijuBlog</li>
              </ul>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              4. User Conduct
            </h2>
            <ul className="space-y-3 list-disc list-inside">
              <li>
                You agree not to use the website for any unlawful purpose or in
                any way that could damage, disable, or impair the website.
              </li>
              <li>
                You may not attempt to gain unauthorized access to any part of
                the website or its systems.
              </li>
              <li>
                Respectful discussion about Chinese dramas and related content
                is encouraged in comments and interactions.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              5. Content and Reviews
            </h2>
            <ul className="space-y-3 list-disc list-inside">
              <li>
                Our drama reviews and recommendations are based on personal
                opinions and experiences.
              </li>
              <li>
                We strive for accuracy in our content but cannot guarantee that
                all information is completely up-to-date or error-free.
              </li>
              <li>
                External links to streaming platforms or other websites are
                provided for convenience and we are not responsible for their
                content or policies.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              6. Advertising and Monetization
            </h2>
            <ul className="space-y-3 list-disc list-inside">
              <li>
                This website may display advertisements through Google AdSense
                and other advertising networks.
              </li>
              <li>
                We may earn commissions from affiliate links to streaming
                services or drama-related products.
              </li>
              <li>
                Advertisements are clearly marked and do not influence our
                editorial content or reviews.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              7. Privacy and Data Collection
            </h2>
            <ul className="space-y-3 list-disc list-inside">
              <li>
                Our collection and use of personal information is governed by
                our{" "}
                <a
                  href="/privacy"
                  className="text-cyan-600 dark:text-cyan-400 hover:underline"
                >
                  Privacy Policy
                </a>
                .
              </li>
              <li>
                By using this website, you consent to the collection and use of
                information as described in our Privacy Policy.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              8. Disclaimer of Warranties
            </h2>
            <ul className="space-y-3 list-disc list-inside">
              <li>
                This website is provided &quot;as is&quot; without any
                representations or warranties of any kind.
              </li>
              <li>
                We do not warrant that the website will be uninterrupted,
                error-free, or free of viruses or other harmful components.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              9. Limitation of Liability
            </h2>
            <ul className="space-y-3 list-disc list-inside">
              <li>
                MijuBlog shall not be liable for any direct, indirect,
                incidental, or consequential damages arising from your use of
                the website.
              </li>
              <li>
                This includes but is not limited to damages for loss of profits,
                data, or other intangible losses.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              10. Changes to Terms
            </h2>
            <ul className="space-y-3 list-disc list-inside">
              <li>
                We reserve the right to modify these terms and conditions at any
                time without prior notice.
              </li>
              <li>
                Changes will be effective immediately upon posting on this page
                with an updated &quot;Last Updated&quot; date.
              </li>
              <li>
                Your continued use of the website after changes constitutes
                acceptance of the new terms.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              11. Governing Law
            </h2>
            <ul className="space-y-3 list-disc list-inside">
              <li>
                These terms and conditions are governed by and construed in
                accordance with applicable laws.
              </li>
              <li>
                Any disputes arising from these terms shall be subject to the
                exclusive jurisdiction of the appropriate courts.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              12. Contact Information
            </h2>
            <ul className="space-y-3 list-disc list-inside">
              <li>
                If you have any questions about these Terms and Conditions,
                please contact us through our{" "}
                <a
                  href="/contact-us"
                  className="text-cyan-600 dark:text-cyan-400 hover:underline"
                >
                  contact page
                </a>
                .
              </li>
              <li>
                We will respond to your inquiries as promptly as possible.
              </li>
            </ul>
          </section>

          <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Thank you for reading our Terms and Conditions. We appreciate your
              interest in Chinese dramas and hope you enjoy exploring our
              content!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
