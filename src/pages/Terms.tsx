const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Use</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-sm text-gray-600 mb-6">
              <strong>Effective Date:</strong> [Insert Date]<br />
              <strong>Last Updated:</strong> [Insert Date]
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using Makola Online ("the Platform"), you agree to be bound by these Terms of Use. 
                If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Platform Description</h2>
              <p className="text-gray-700 mb-4">
                Makola Online is an e-commerce marketplace that connects buyers and sellers in Ghana. 
                We provide a platform for users to list, browse, and purchase products and services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. User Responsibilities</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Provide accurate and truthful information</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Respect other users and maintain professional conduct</li>
                <li>Not engage in fraudulent or deceptive practices</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Contact Information</h2>
              <p className="text-gray-700">
                For questions about these Terms of Use, please contact us:<br />
                WhatsApp: [Your WhatsApp Number]<br />
                Email: [Your Support Email]
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;