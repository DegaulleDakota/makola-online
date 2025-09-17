const ReturnPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Return & Refund Policy
          </h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-sm text-gray-600 mb-6">
              <strong>Effective Date:</strong> January 1, 2025<br />
              <strong>Last Updated:</strong> January 1, 2025
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Marketplace Role</h2>
              <p className="text-gray-700 mb-4">
                Everything Market Ghana is a marketplace platform. We connect buyers and sellers but do not
                directly sell products. Each seller sets their own return and refund policy. Our role is to
                facilitate communication and, when necessary, mediate disputes fairly.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Seller’s Responsibility</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Clearly state return/refund rules on product listings.</li>
                <li>Honor the policy stated on the listing.</li>
                <li>
                  If no policy is stated, the default guideline is <em>no returns</em> unless the item is
                  faulty, damaged on delivery, or not as described.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Buyer’s Responsibility</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Review the seller’s return policy before purchase.</li>
                <li>Keep proof of payment and delivery when requesting a return.</li>
                <li>Return items in original condition and packaging unless faulty.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Mediation & Disputes</h2>
              <p className="text-gray-700 mb-4">
                If a buyer and seller cannot resolve a return or refund request, Everything Market Ghana may
                step in to review evidence (e.g., chat history, photos, receipts). Our decision will be final
                and binding for transactions conducted on the platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Non-Returnable Items</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Perishable goods (e.g., food, beverages, flowers)</li>
                <li>Personal care items (e.g., cosmetics, underwear, health products)</li>
                <li>Digital/downloadable products or services already delivered</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Shipping Costs</h2>
              <p className="text-gray-700 mb-4">
                Unless the seller states otherwise, buyers are responsible for return shipping costs.
                If the item is faulty, damaged, or not as described, the seller should cover return shipping.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Contact Support</h2>
              <p className="text-gray-700">
                For unresolved disputes or questions, contact our support team:<br />
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

export default ReturnPolicy;
