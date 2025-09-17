const HelpCenter = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Help Center / FAQ</h1>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1) What is Everything Market Ghana?</h2>
              <p className="text-gray-700">
                We’re a marketplace platform that connects buyers and sellers across Ghana.
                Sellers list items; buyers browse and purchase. We facilitate communication and
                help mediate disputes when needed.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2) How do I create a seller account?</h2>
              <p className="text-gray-700">
                Go to the Sell page and complete the onboarding form. You’ll provide your business
                name, WhatsApp number, location, and your first product details.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3) How do deliveries work?</h2>
              <p className="text-gray-700">
                Delivery options are set by each seller. Some offer in-person pickup; others use riders.
                Check the product listing for delivery availability, areas, and cost.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4) Payments & safety</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Only pay through safe, agreed methods with the seller.</li>
                <li>Keep proof of payment and delivery.</li>
                <li>Report suspicious activity to support immediately.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5) Returns & refunds</h2>
              <p className="text-gray-700">
                Each seller sets their own return policy. If a policy isn’t listed, the default guideline is
                no returns unless the item is faulty, damaged on delivery, or not as described.
                See our <a href="/return-policy" className="text-emerald-600 underline">Return &amp; Refund Policy</a>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6) Reporting an issue or dispute</h2>
              <p className="text-gray-700">
                First, contact the seller to resolve directly. If unresolved, reach out to our support with
                screenshots, receipts, and order details. We may mediate and our decision can be final for
                marketplace transactions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact Support</h2>
              <p className="text-gray-700">
                WhatsApp: +233-XXXXXXXXX<br />
                Email: support@everythingmarketghana.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
