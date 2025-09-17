import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About Everything Market Ghana
          </h1>
          <p className="text-xl text-gray-600">
            Ghana&apos;s Premier Online Marketplace
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-600">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                To connect buyers and sellers across Ghana through a trusted, 
                easy-to-use online marketplace that supports local businesses 
                and communities.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-600">Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                To become Ghana&apos;s leading e-commerce platform, empowering 
                entrepreneurs and providing customers with access to quality 
                products and services.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900">Customer Support</h3>
              <p className="text-gray-700">WhatsApp: +233-XXXXXXXXX</p>
              <p className="text-gray-700">Email: support@everythingmarketghana.com</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Business Hours</h3>
              <p className="text-gray-700">Monday - Friday: 8:00 AM - 6:00 PM</p>
              <p className="text-gray-700">Saturday: 9:00 AM - 4:00 PM</p>
              <p className="text-gray-700">Sunday: Closed</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
