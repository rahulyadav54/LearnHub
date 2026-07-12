import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Privacy Policy | HamroLearning Nepal",
  description: "Read the HamroLearning Nepal Privacy Policy. Learn how we collect, use, and protect your personal data when you use our education platform.",
  keywords: ["privacy policy Nepal", "HamroLearning privacy", "data protection Nepal", "user privacy Nepal", "education platform privacy"],
  alternates: {
    canonical: "/privacy-policy",
  },
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.hamrolearning.com" },
    { "@type": "ListItem", position: 2, name: "Privacy Policy", item: "https://www.hamrolearning.com/privacy-policy" },
  ],
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="section-padding">
        <div className="section-container max-w-4xl">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground mb-8">Last updated: July 12, 2026</p>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">
            <p className="text-foreground">
              HamroLearning Nepal (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our education platform.
            </p>

            <h2 className="text-2xl font-bold text-foreground">1. Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Personal Information:</strong> Name, email address, phone number, school/institution, grade level, and other information you provide when creating an account.</li>
              <li><strong>Usage Data:</strong> Information about how you interact with our platform, including pages visited, time spent, features used, and search queries.</li>
              <li><strong>Educational Data:</strong> Quiz scores, mock test results, reading history, bookmarked content, and learning progress.</li>
              <li><strong>Device Information:</strong> Browser type, operating system, IP address, and device identifiers.</li>
              <li><strong>Cookies & Local Storage:</strong> We use cookies and similar technologies to improve user experience and analyze platform usage.</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground">2. How We Use Your Information</h2>
            <p>We use the collected information for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and maintain our educational platform services.</li>
              <li>To personalize your learning experience and recommend relevant study materials.</li>
              <li>To track your academic progress and generate performance analytics.</li>
              <li>To communicate with you about platform updates, new features, and educational content.</li>
              <li>To improve our platform through analytics and user feedback.</li>
              <li>To ensure platform security and prevent misuse.</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground">3. Data Sharing & Disclosure</h2>
            <p>We do not sell your personal data. We may share information in the following circumstances:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>With your explicit consent.</li>
              <li>With service providers who help us operate the platform (e.g., hosting, analytics, AI services).</li>
              <li>When required by law or to respond to legal requests.</li>
              <li>To protect the rights, safety, or property of HamroLearning, our users, or the public.</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground">4. Data Security</h2>
            <p>
              We implement industry-standard security measures including encryption, secure authentication via Supabase, and regular security audits to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>

            <h2 className="text-2xl font-bold text-foreground">5. Children&apos;s Privacy</h2>
            <p>
              Our platform is designed for students of all ages in Nepal. If we become aware that we have inadvertently collected personal information from a child under 13 without parental consent, we will take steps to delete that information promptly.
            </p>

            <h2 className="text-2xl font-bold text-foreground">6. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law.
            </p>

            <h2 className="text-2xl font-bold text-foreground">7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access and review your personal data stored on our platform.</li>
              <li>Request correction of inaccurate or incomplete data.</li>
              <li>Request deletion of your account and associated data.</li>
              <li>Opt out of non-essential communications.</li>
            </ul>
            <p>To exercise these rights, contact us at <strong>support@hamrolearning.com</strong>.</p>

            <h2 className="text-2xl font-bold text-foreground">8. Third-Party Services</h2>
            <p>
              Our platform may contain links to or integrate with third-party services, including Google (for AI services), Supabase (for database and authentication), and social media platforms. These services have their own privacy policies, and we encourage you to review them.
            </p>

            <h2 className="text-2xl font-bold text-foreground">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify users of significant changes via email or a prominent notice on our platform. Continued use of the platform after changes indicates acceptance of the updated policy.
            </p>

            <h2 className="text-2xl font-bold text-foreground">10. Contact Us</h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us at:
            </p>
            <div className="p-6 rounded-xl border border-border bg-muted/20">
              <p className="text-sm"><strong>Email:</strong> support@hamrolearning.com</p>
              <p className="text-sm"><strong>Address:</strong> Lazimpat, Kathmandu, Nepal</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
