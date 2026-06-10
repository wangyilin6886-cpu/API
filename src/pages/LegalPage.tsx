import { useEffect } from 'react'
import { ArticleProgress, ArticleNav, ArticleFooter } from './ArticleShell'
import './Article.css'

const SUPPORT_EMAIL = 'wangyilin6886@gmail.com'
const BRAND = 'SuperAPI by SuperXIndo'

function Terms() {
  return (
    <div className="art-body">
      <p className="art-lead">
        Welcome to <strong>{BRAND}</strong> ("we," "our," or "us"). By accessing or using our global
        LLM API gateway and purchasing prepaid credits, you agree to be bound by these Terms of Service.
      </p>

      <h2>1. Services Provided</h2>
      <div className="art-divider" />
      <p>
        We provide an API gateway that allows users to access Large Language Models (LLMs) via prepaid
        credits. These credits are strictly digital utility balances used to consume our software services
        and hold no monetary, fiat, or cryptocurrency value.
      </p>

      <h2>2. Eligibility &amp; Acceptable Use</h2>
      <div className="art-divider" />
      <p>
        You agree to use our services strictly for lawful software development and application integration.
        You explicitly agree that our credits and services will <strong>not</strong> be used for financial
        trading, cryptocurrency transactions, speculative purposes, or illegal payment processing.
      </p>

      <h2>3. Prepaid Credits &amp; Refund Policy</h2>
      <div className="art-divider" />
      <p>
        All purchases of prepaid credits are final. Since digital credits are provisioned instantly upon
        payment, we generally do not offer refunds once the credits have been added to your account
        balance, unless required by applicable local law or due to a verified system error on our part.
      </p>

      <h2>4. Limitation of Liability</h2>
      <div className="art-divider" />
      <p>
        Our services are provided "as is" without any express or implied warranties. We are not liable
        for any service interruptions, API downtime, or data loss caused by upstream LLM providers.
      </p>

      <h2>5. Contact Us</h2>
      <div className="art-divider" />
      <p>
        If you have any questions regarding these terms, please contact us at:{' '}
        <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: '#185fa5' }}>{SUPPORT_EMAIL}</a>
      </p>
    </div>
  )
}

function Privacy() {
  return (
    <div className="art-body">
      <p className="art-lead">
        At <strong>{BRAND}</strong>, we are committed to protecting your privacy. This Privacy Policy
        explains how we collect, use, and safeguard your information when you use our API gateway.
      </p>

      <h2>1. Information We Collect</h2>
      <div className="art-divider" />
      <p>
        <strong>Account Information:</strong> When you register, we may collect your email address and
        account credentials.
      </p>
      <p>
        <strong>Usage Data:</strong> We log API request metadata (such as timestamps, token counts, and
        error codes) to calculate credit deductions and monitor service health. We do not store the
        content of your API prompts unless explicitly required for troubleshooting.
      </p>
      <p>
        <strong>Payment Information:</strong> All payments are processed securely through our payment
        provider, Polar.sh. We do not store your raw credit card details on our servers.
      </p>

      <h2>2. How We Use Your Information</h2>
      <div className="art-divider" />
      <p>We use the collected data solely to:</p>
      <ul style={{ paddingLeft: '1.4em', marginBottom: '24px', color: '#3a4a5c', fontSize: '17px', lineHeight: '1.85' }}>
        <li>Provide, maintain, and optimize our API gateway.</li>
        <li>Track and deduct prepaid credit balances accurately.</li>
        <li>Prevent fraudulent activities, unauthorized access, or misuse.</li>
      </ul>

      <h2>3. Data Sharing</h2>
      <div className="art-divider" />
      <p>
        We do not sell or lease your personal data to third parties. We only share data with trusted
        third-party services (like Polar.sh for payment processing or upstream LLM infrastructure)
        strictly necessary to deliver our services.
      </p>

      <h2>4. Security</h2>
      <div className="art-divider" />
      <p>
        We implement industry-standard technical measures to secure your data. However, no method of
        transmission over the internet is 100% secure, and we cannot guarantee absolute security.
      </p>

      <h2>5. Contact Us</h2>
      <div className="art-divider" />
      <p>
        For any inquiries regarding your privacy or data rights, please reach out to us at:{' '}
        <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: '#185fa5' }}>{SUPPORT_EMAIL}</a>
      </p>
    </div>
  )
}

interface Props { type: 'terms' | 'privacy' }

export default function LegalPage({ type }: Props) {
  const isTerms = type === 'terms'
  const title = isTerms ? 'Terms of Service' : 'Privacy Policy'
  const subtitle = isTerms
    ? 'Last updated: June 2026'
    : 'Last updated: June 2026'

  useEffect(() => {
    document.title = `${title} · SuperAPI by SuperXIndo`
  }, [title])

  return (
    <div className="art-root" style={{ background: '#f7f9fc' }}>
      <ArticleProgress />
      <ArticleNav />

      <div style={{
        paddingTop: 100,
        paddingBottom: 12,
        paddingLeft: '6vw',
        paddingRight: '6vw',
        maxWidth: 740,
        margin: '0 auto',
      }}>
        <span className="art-badge" style={{ background: '#185fa5', border: 'none', color: '#fff', display: 'inline-block', marginBottom: 18 }}>
          Legal
        </span>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 900, color: '#0f1d2e', letterSpacing: '-1px', lineHeight: 1.1, marginBottom: 10 }}>
          {title}
        </h1>
        <p style={{ fontSize: 14, color: '#8694a6', marginBottom: 0 }}>{subtitle}</p>
      </div>

      {isTerms ? <Terms /> : <Privacy />}

      <ArticleFooter />
    </div>
  )
}
