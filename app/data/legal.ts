/**
 * Legal document content for the reusable <LegalModal />.
 * Add new docs (e.g. an updated Privacy Policy) by extending this registry —
 * the modal renders any entry by key. Content is trusted, authored HTML.
 */
export type LegalDocKey = "terms" | "privacy";

export interface LegalDoc {
  title: string;
  html: string;
}

const TERMS_HTML = `
<p><em>Please read these Terms carefully and make sure that you fully understand all the contents.</em></p>
<hr>
<h3>1. Overview</h3>
<p>These Terms of Service (“Terms”) constitute a binding agreement between you (“User”, “you”, “your”) and 3-102-948875 SRL., the operator of the watch.fun platform (“Platform”, “Site”).</p>
<p>watch.fun is a crypto-first luxury-raffle platform operating under an Anjouan gaming licence and serviced by its Costa Rican operating entity. Users purchase blockchain-based raffle tickets with USDC or USDT to participate in transparent on-chain draws for authentic luxury watches.</p>
<p>By accessing or using the Platform, you agree to these Terms, our Privacy Notice, and any Raffle Rules incorporated herein (collectively, the “Agreement”).</p>
<hr>
<h3>2. Acceptance of Terms</h3>
<p>By creating an account or purchasing raffle tickets, you acknowledge that you have read, understood, and agreed to these Terms. If you do not agree, do not use the Platform.</p>
<hr>
<h3>3. Modifications</h3>
<p>Watch.Fun may update these Terms at any time by posting the revised version on the Platform. Material changes will be communicated by email or in-app notice. Continued use after such notice constitutes acceptance.</p>
<hr>
<h3>4. Eligibility</h3>
<p>You must be at least 18 years old (or older where required by law) and reside in a jurisdiction where raffle participation is not prohibited. By using Watch.Fun, you represent that your participation is legal under your local laws.</p>
<hr>
<h3>5. Account Creation &amp; Verification</h3>
<p>Users register through wallet connection (Privy) or email sign-up. Each user may maintain only one account.</p>
<p>Watch.Fun conducts KYC and AML verification through <strong>Sumsub</strong>, its approved third-party provider. Verification may be required for high-value transactions or prize claims.</p>
<p>You must keep credentials secure and notify <a href="mailto:support@watch.fun">support@watch.fun</a> of any unauthorized access.</p>
<hr>
<h3>6. Account Closure &amp; Suspension</h3>
<p>We may suspend or terminate accounts for fraud, abuse, or regulatory concerns without liability. Users may close accounts by emailing <a href="mailto:support@watch.fun">support@watch.fun</a>.</p>
<hr>
<h3>7. Intellectual Property</h3>
<p>All content, software, trademarks and materials on Watch.Fun remain the exclusive property of 3-102-948875 SRL. Users receive a revocable, non-transferable licence to access the Platform for personal use only.</p>
<hr>
<h3>8. Using the Services</h3>
<ul><li>Each ticket purchase represents an entry into a specific raffle.</li><li>Draw results are determined by a <strong>verifiable random function (VRF)</strong> provided by <strong>Switchboard on the Solana blockchain</strong>; results are publicly verifiable via Solana Explorer.</li><li>Winners receive the raffled watch or a crypto alternative as described in Section 9.</li><li>Taxes or import duties related to prizes are the sole responsibility of the winner.</li></ul>
<hr>
<h3>9. Transactions, Prizes &amp; Withdrawals</h3>
<p><strong>Non-Custodial Model</strong></p>
<p>All transactions occur directly on the blockchain. Watch.Fun does not hold custody of user funds. You are solely responsible for wallet security and correct address entry. Transactions are irreversible.</p>
<p><strong>Prize Delivery</strong></p>
<p>Winners may choose:</p>
<ul><li>Physical delivery (with insured shipping paid by Watch.Fun; import duties paid by recipient) or collection in Hong Kong, or</li><li>Crypto alternative in USDC or USDT at a discounted market value.</li></ul>
<p><strong>Refunds</strong></p>
<p>If a raffle is cancelled due to insufficient entries or technical error, tickets are refunded in equivalent value.</p>
<hr>
<h3>10. Prohibited Jurisdictions</h3>
<p>Participation is restricted for residents of the following jurisdictions: Australia, France, Netherlands, United Kingdom, United States, Comoros, Cyprus, Ontario (Canadian Province), Afghanistan, Belarus, Burma (Myanmar), Burundi, Central African Republic, Côte d'Ivoire (Ivory Coast), Cuba, Democratic Republic of the Congo, Guinea, Guinea-Bissau, Iran, Iraq, Korea D.P.R. (North Korea), Libya, Mali, Russia, Somalia, South Sudan, Sudan, Syria, Tunisia, Venezuela, Yemen, and Zimbabwe.</p>
<hr>
<h3>11. Responsible Play</h3>
<p>Watch.Fun supports responsible participation. Users may request account limits or temporary self-exclusion by emailing <a href="mailto:support@watch.fun">support@watch.fun</a>.</p>
<hr>
<h3>12. Fraud &amp; AML Monitoring</h3>
<p>Transactions are monitored to detect fraud or money-laundering activity. Suspected wallets may be blacklisted and reported to relevant authorities per Anjouan and Costa Rican regulations.</p>
<hr>
<h3>13. User Conduct</h3>
<p>Users must not:</p>
<ul><li>Use the Platform for illegal activity or to circumvent sanctions.</li><li>Interfere with site functionality or access data not intended for them.</li><li>Create multiple accounts or attempt to manipulate raffle outcomes.</li></ul>
<hr>
<h3>14. User Content &amp; Feedback</h3>
<p>Comments and submissions posted on Watch.Fun are non-confidential. Watch.Fun may use or remove such content at its discretion.</p>
<hr>
<h3>15. Governing Law &amp; Jurisdiction</h3>
<p>These Terms are governed by the laws of the Autonomous Island of Anjouan, Union of the Comoros. Any dispute shall be submitted to the exclusive jurisdiction of the courts of Anjouan. The Costa Rican entity acts as marketing and operational service provider only.</p>
<hr>
<h3>16. Indemnification</h3>
<p>You agree to indemnify and hold harmless Watch.Fun, its officers, directors, and agents from any losses arising out of your use of the Platform or violation of these Terms.</p>
<hr>
<h3>17. Limitation of Liability</h3>
<p>In no event shall Watch.Fun's aggregate liability exceed the lower of USD 1,000 or the total value of tickets purchased by you in the preceding six months.</p>
<hr>
<h3>18. Confidentiality &amp; Non-Disparagement</h3>
<p>You will not disclose Watch.Fun confidential information or make public statements that defame or disparage the company or its affiliates.</p>
<hr>
<h3>19. Compliance with Local Laws</h3>
<p>Users accessing the Platform from outside authorized jurisdictions do so at their own risk and must comply with local laws.</p>
<hr>
<h3>20. Severability</h3>
<p>If any provision is found invalid, the remaining provisions remain in full force and effect.</p>
<hr>
<h3>21. Language &amp; Notices</h3>
<p>English is the controlling language of this Agreement.</p>
<p>Notices to Watch.Fun: <a href="mailto:legal@watch.fun">legal@watch.fun</a></p>
<p>Notices to users: the email or wallet address associated with their account.</p>
<hr>
<h3>Appendix 1 – Raffle Rules &amp; Draw Mechanics</h3>
<ol><li>Each raffle specifies its ticket price, total tickets, and draw date/time.</li><li>Draws use Switchboard VRF for verifiable randomness on Solana.</li><li>Winning transactions are published on Solana Explorer and linked from the Winners page.</li><li>If a raffle fails to meet minimum tickets, it may be extended or refunded.</li><li>Physical prizes are fulfilled only after identity and KYC verification when required.</li></ol>
<hr>
<p><strong>© 3-102-948875 SRL. (Watch.Fun) – All Rights Reserved</strong></p>
`;

const PRIVACY_HTML = `
<p><em>Please read these Terms carefully and make sure that you fully understand all the contents.</em></p>
<hr>
<h3>Introduction</h3>
<p>No matter where you are in the world, where you reside, where your citizenship lies, or where your data comes from, Watch.Fun strives to offer the same high standards of privacy protection to all individuals that use, visit and/or access any part of our website, which includes any website that links back to this Privacy Notice in its footer (“Site”), and/or utilize any services accessed through the Site (“Services”).</p>
<p>For this reason, we collect and use personal data/information only as needed to deliver our Site and Services to you, to communicate with you about them, or as you have requested (collectively, “Services”), and always in accordance with the terms of this Privacy Notice.</p>
<p>With respect to your relationship with Watch.Fun, your personal information includes information such as:</p>
<ul><li>Name</li><li>Address</li><li>IP address</li><li>Date of birth</li><li>Email address</li><li>Wallet address</li><li>Government-issued identification</li><li>Other data collected that could directly or indirectly identify you</li><li>Documentation relating to or proving any of the above as necessary for verification and identification under regulatory requirements related to the use of the Services</li></ul>
<p>Our Privacy Notice not only explains how and why we use your personal information that we collect, but also how you can access, update or otherwise take control of your personal information.</p>
<p>For the purpose of this Privacy Notice, “Watch.Fun” means 3-102-948875 SRL, a Costa Rican entity operating under an Anjouan gaming license, including its affiliates and service providers identified in our Terms of Service (hereafter, “Terms” or “Agreement”).</p>
<p>If you have any questions, concerns, or complaints about our Privacy Notice, or how we handle your personal data, you may contact our Office of the Data Protection Officer by email at <a href="mailto:privacy@watch.fun">privacy@watch.fun</a>.</p>
<p>In the alternative, you may contact us in the manner set forth in the “Contact Us” section below in this Privacy Notice. If there are any capitalized terms in this Privacy Notice that are not defined, then those terms will have the meaning defined in your Agreement with us.</p>
<hr>
<h3>What Information We Collect, How We Collect It, and Why</h3>
<p>Much of what you likely consider personal information is collected directly from you when you:</p>
<ul><li>Create an Account and utilize our Services (for example: name, address, government identification, wallet address)</li><li>Undergo KYC verification through <strong>Sumsub</strong></li><li>Allow us to access your general geolocation to verify jurisdictional eligibility</li><li>Contact or request assistance from our customer support team (e.g. email address, phone number, message content)</li><li>Complete contact forms, subscribe to updates, or request newsletters or product information</li><li>Participate in contests, surveys, or other promotions that might require personal information</li></ul>
<p>However, we also collect additional information as necessary to lawfully and properly deliver the Services and to ensure security and regulatory compliance. These methods of collection may include:</p>
<p><strong>Cookies and Similar Technologies.</strong></p>
<p>Our websites and applications use cookies and similar technologies to track user behavior, such as pages viewed, tickets purchased, and Services used. Data collected includes:</p>
<ul><li>IP address, browser type, device type, and settings</li><li>Location, operating system, date/time of access</li><li>Error data and performance analytics</li></ul>
<p>We use this information to optimize our Site, track technical performance, and improve your navigation experience. We do <strong>not</strong> sell this information to third parties.</p>
<p><strong>Third Party and Publicly Available Sources.</strong></p>
<p>We may also collect limited personal information from trusted third parties such as verification partners (e.g. Sumsub), affiliates, and publicly available data (e.g. blockchain explorers or social media) to comply with our legal and regulatory obligations.</p>
<hr>
<h3>How We Utilize Information</h3>
<p>We strongly believe in both minimizing the data we collect and limiting its use and purpose to only that which is necessary to:</p>
<ol><li>Deliver, improve, and operate our Services</li><li>Verify identity and ensure compliance with KYC/AML laws</li><li>Detect and prevent fraud or abuse</li><li>Communicate about account, raffles, or winnings</li><li>Fulfil regulatory, tax, and audit requirements</li><li>Improve product design, performance, and customer experience</li></ol>
<p>Data collected for these purposes is aggregated wherever possible and not linked to personally identifiable information unless necessary.</p>
<hr>
<h3>Sharing with Trusted Third Parties</h3>
<p>First things first: <strong>we do not sell your personal information</strong>.</p>
<p>We may share your personal information only with:</p>
<ul><li><strong>Verification providers:</strong> such as <strong>Sumsub</strong>, to meet KYC/AML requirements.</li><li><strong>Service partners:</strong> infrastructure, hosting, analytics, and support providers assisting us in operating Watch.Fun.</li><li><strong>Blockchain networks:</strong> for on-chain verification of raffle transactions and results.</li><li><strong>Regulators and legal authorities:</strong> as required by law under Anjouan or Costa Rican compliance frameworks.</li></ul>
<p>These third parties (and any subcontractors they may be permitted to use) are required not to share, use, or retain your personal information for any purpose other than as necessary to provide the contracted service.</p>
<p>We may also disclose your information:</p>
<ul><li>In connection with a sale, merger, or restructuring of our business; or</li><li>To protect our property, rights, or the safety of others, or to comply with valid legal requests.</li></ul>
<hr>
<h3>Communicating with You</h3>
<p>We may contact you directly or through third-party service providers regarding Services you utilize, such as:</p>
<ul><li>Raffle confirmations or prize notifications</li><li>Service-related updates</li><li>Security or verification requests</li></ul>
<p>We may also contact you (with your consent or under legitimate interest) regarding promotional offers, new raffles, or product updates. You can adjust your preferences or unsubscribe at any time.</p>
<p>Communication channels include:</p>
<ul><li>Email</li><li>Telegram or Messenger apps</li><li>On-site notifications</li></ul>
<hr>
<h3>Transfer of Personal Information Abroad</h3>
<p>Your personal information may be processed or stored in Costa Rica, Anjouan, or other jurisdictions where our infrastructure or partners are located.</p>
<p>Transfers are only performed when necessary to operate the Platform, with contractual safeguards ensuring adequate data protection.</p>
<hr>
<h3>Compliance with Legal, Regulatory, and Law Enforcement Requests</h3>
<p>We cooperate with government and law enforcement officials and gaming regulators to enforce and comply with applicable laws.</p>
<p>We may disclose your personal information when required by legal process or when necessary to:</p>
<ul><li>Protect Watch.Fun's rights or property</li><li>Prevent or investigate illegal activity</li><li>Respond to regulatory audits or licence conditions</li><li>Enforce the integrity of the raffle system and prevent fraud or abuse</li></ul>
<p>Where legally permissible, we will take reasonable steps to notify you if your data is disclosed in response to legal process.</p>
<hr>
<h3>How We Secure, Store, and Retain Your Data</h3>
<p>We use industry-standard security controls, including encryption, restricted access, and secure servers.</p>
<p>We retain personal information only for as long as required to:</p>
<ul><li>Provide Services and comply with legal obligations</li><li>Resolve disputes or enforce agreements</li><li>Meet recordkeeping and audit requirements</li></ul>
<p>Once data is no longer required, it is securely deleted or anonymized.</p>
<p>If you have questions about the security or retention of your information, contact us at <a href="mailto:privacy@watch.fun">privacy@watch.fun</a>.</p>
<hr>
<h3>Age Restrictions</h3>
<p>Our Services are intended for users aged <strong>18 years and older</strong>. We do not knowingly collect data from individuals under 18.</p>
<p>If you believe a minor has provided us personal information, please contact <a href="mailto:privacy@watch.fun">privacy@watch.fun</a> for immediate deletion.</p>
<hr>
<h3>Changes to This Policy</h3>
<p>We reserve the right to modify this Privacy Policy at any time. If changes are made, we will post them here and, where appropriate, notify users by email or notice on our homepage at least <strong>30 days prior</strong> to implementation.</p>
<p>Your continued use of Watch.Fun after changes are posted signifies your acceptance of the revised policy.</p>
<hr>
<h3>Contact Us</h3>
<p>If you have any questions, concerns, or complaints about our Privacy Policy, or how we handle your personal data, you may contact our Office of the Data Protection Officer by email at <a href="mailto:privacy@watch.fun">privacy@watch.fun</a>.</p>
<p>We will respond to all requests, inquiries, or concerns within <strong>30 days</strong>.</p>
<p>If you are not satisfied with how we manage your personal data, you may contact your local Data Protection Authority.</p>
<hr>
<p><strong>© 3-102-948875 SRL. (Watch.Fun) – All Rights Reserved</strong></p>
`;

export const LEGAL_DOCS: Record<LegalDocKey, LegalDoc> = {
  terms: { title: "Terms of Service", html: TERMS_HTML },
  privacy: { title: "Privacy Policy", html: PRIVACY_HTML },
};
