import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Terms of Service | HamroLearning Nepal",
  description: "Read the Terms of Service for HamroLearning Nepal. Understand the terms and conditions for using our AI-powered education platform.",
  keywords: ["terms of service Nepal", "HamroLearning terms", "Nepal education terms", "platform terms Nepal", "education app terms"],
  alternates: {
    canonical: "/terms-of-service",
  },
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.hamrolearning.com" },
    { "@type": "ListItem", position: 2, name: "Terms of Service", item: "https://www.hamrolearning.com/terms-of-service" },
  ],
}

export default function TermsOfServicePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="section-padding">
        <div className="section-container max-w-4xl">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-muted-foreground mb-8">Last updated: July 12, 2026</p>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">
            <p className="text-foreground">
              These Terms of Service (&quot;Terms&quot;) govern your use of HamroLearning Nepal&apos;s platform, website, and mobile applications. By accessing or using our services, you agree to be bound by these Terms.
            </p>

            <h2 className="text-2xl font-bold text-foreground">1. Acceptance of Terms</h2>
            <p>
              By creating an account, accessing, or using HamroLearning Nepal (&quot;the Platform&quot;), you agree to comply with and be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do not use the Platform.
            </p>

            <h2 className="text-2xl font-bold text-foreground">2. Eligibility</h2>
            <p>
              You must be at least 13 years of age to use the Platform. If you are under 18, you may only use the Platform with the involvement and consent of a parent or legal guardian. By using the Platform, you represent and warrant that you meet these eligibility requirements.
            </p>

            <h2 className="text-2xl font-bold text-foreground">3. Account Registration</h2>
            <p>
              To access certain features of the Platform, you must register for an account. You agree to provide accurate, complete, and current information during registration and to update such information as necessary. You are responsible for safeguarding your account credentials and for all activities that occur under your account.
            </p>

            <h2 className="text-2xl font-bold text-foreground">4. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the Platform for any unlawful purpose or in violation of any applicable Nepali or international laws.</li>
              <li>Upload, distribute, or share content that is harmful, abusive, defamatory, or infringes on intellectual property rights.</li>
              <li>Attempt to gain unauthorized access to any part of the Platform or its systems.</li>
              <li>Use automated systems (bots, scrapers) to extract data from the Platform without written permission.</li>
              <li>Impersonate any person or entity or misrepresent your affiliation with any person or entity.</li>
              <li>Engage in any activity that interferes with or disrupts the Platform or its servers.</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground">5. Intellectual Property</h2>
            <p>
              All content on the Platform, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, and data compilations, is the property of HamroLearning Nepal or its content suppliers and is protected by Nepali and international copyright laws. Unauthorized reproduction, distribution, or modification of any content is strictly prohibited.
            </p>
            <p>
              User-generated content (comments, contributions) remains the property of the user, but by submitting it, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and display such content in connection with the Platform.
            </p>

            <h2 className="text-2xl font-bold text-foreground">6. AI Tutor Usage</h2>
            <p>
              Our AI Tutor feature is provided as an educational aid and may contain inaccuracies. Users should verify critical information independently. The AI Tutor is powered by advanced AI technology and is intended to supplement, not replace, professional academic guidance. We do not guarantee the accuracy, completeness, or suitability of AI-generated responses.
            </p>

            <h2 className="text-2xl font-bold text-foreground">7. Subscription & Payments</h2>
            <p>
              Basic features of HamroLearning Nepal are free. Premium features, if introduced, will be clearly labeled with pricing. All subscription fees are non-refundable except as required by law. We reserve the right to modify pricing with reasonable notice.
            </p>

            <h2 className="text-2xl font-bold text-foreground">8. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties. Upon termination, your right to use the Platform will immediately cease.
            </p>

            <h2 className="text-2xl font-bold text-foreground">9. Disclaimer of Warranties</h2>
            <p>
              The Platform is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We make no representations or warranties of any kind, express or implied, as to the operation of the Platform or the accuracy, completeness, or reliability of any content. We do not warrant that the Platform will be uninterrupted, secure, or error-free.
            </p>

            <h2 className="text-2xl font-bold text-foreground">10. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, HamroLearning Nepal shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the Platform. Our total liability to you for any claim shall not exceed the amount you paid us (if any) in the past 12 months.
            </p>

            <h2 className="text-2xl font-bold text-foreground">11. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Changes will be posted on this page with an updated effective date. Your continued use of the Platform after changes are posted constitutes your acceptance of the revised Terms.
            </p>

            <h2 className="text-2xl font-bold text-foreground">12. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of Nepal. Any disputes arising from these Terms or your use of the Platform shall be subject to the exclusive jurisdiction of the courts in Kathmandu, Nepal.
            </p>

            <h2 className="text-2xl font-bold text-foreground">13. Contact Information</h2>
            <p>For questions about these Terms of Service, contact us:</p>
            <div className="p-6 rounded-xl border border-border bg-muted/20">
              <p className="text-sm"><strong>Email:</strong> support@hamrolearning.com</p>
              <p className="text-sm"><strong>Address:</strong> Lazimpat, Kathmandu, Nepal</p>
              <p className="text-sm"><strong>Privacy Policy:</strong> <Link href="/privacy-policy" className="text-primary hover:underline">/privacy-policy</Link></p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
