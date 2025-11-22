import React from 'react';

export const Privacy = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">Privacy Policy</h1>
      
      <div className="prose prose-blue text-gray-700">
        <p className="text-sm text-gray-500 mb-6">Last Updated: March 15, 2024</p>

        <p>
          At NexusNews, we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you visit our website.
        </p>

        <h3>1. Information We Collect</h3>
        <p>We may collect the following types of information:</p>
        <ul>
          <li><strong>Personal Information:</strong> Name, email address, and other details you provide when registering, subscribing to newsletters, or contacting us.</li>
          <li><strong>Usage Data:</strong> Information on how you interact with our site, such as IP addresses, browser type, and pages visited.</li>
          <li><strong>Cookies:</strong> We use cookies to enhance user experience and analyze site traffic.</li>
        </ul>

        <h3>2. How We Use Your Information</h3>
        <p>We use your data to:</p>
        <ul>
          <li>Provide and improve our services.</li>
          <li>Personalize your reading experience.</li>
          <li>Send newsletters and updates (only if you opt-in).</li>
          <li>Respond to inquiries and support requests.</li>
          <li>Ensure the security of our platform.</li>
        </ul>

        <h3>3. Data Sharing & Disclosure</h3>
        <p>
          We do not sell or rent your personal data. We may share information with trusted third-party service providers (e.g., analytics, email services) solely for operational purposes. We may also disclose data if required by law.
        </p>

        <h3>4. Third-Party Links</h3>
        <p>
          Our website may contain links to external sites. We are not responsible for the privacy practices or content of these third-party websites.
        </p>

        <h3>5. Your Rights</h3>
        <p>
          You have the right to access, update, or delete your personal information. If you wish to exercise these rights, please contact us at <a href="mailto:privacy@nexusnews.com">privacy@nexusnews.com</a>.
        </p>

        <h3>6. Updates to This Policy</h3>
        <p>
          We may update this Privacy Policy from time to time. Changes will be posted on this page with a revised "Last Updated" date.
        </p>

        <p>
          By using NexusNews, you agree to the terms outlined in this policy.
        </p>
      </div>
    </div>
  );
};