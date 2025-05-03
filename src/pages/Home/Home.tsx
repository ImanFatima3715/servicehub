
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Wrench, Home as HomeIcon, Users, Clock } from 'lucide-react';

export default function Home() {
  const serviceCategories = [
    {
      name: 'Plumbing',
      icon: <Wrench className="h-12 w-12 mb-4 text-primary" />,
      description: 'Fix leaks, install fixtures, repair pipes and more.'
    },
    {
      name: 'Electrical',
      icon: <Wrench className="h-12 w-12 mb-4 text-primary" />,
      description: 'Fix lights, outlets, wiring and electrical appliances.'
    },
    {
      name: 'Home Cleaning',
      icon: <HomeIcon className="h-12 w-12 mb-4 text-primary" />,
      description: 'Household cleaning, laundry, dishwashing and more.'
    },
    {
      name: 'Carpentry',
      icon: <Wrench className="h-12 w-12 mb-4 text-primary" />,
      description: 'Furniture repair, woodwork, installations and more.'
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="hero-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="lg:flex lg:items-center lg:space-x-8">
            <div className="lg:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Find Trusted Service Providers Near You</h1>
              <p className="text-lg mb-8">
                From emergency repairs to scheduled maintenance, SERVICE HUB connects you with verified professionals for all your needs.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/services">
                  <Button size="lg" variant="default" className="bg-white text-primary hover:bg-gray-100">
                    Browse Services
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Join as Provider
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block lg:w-1/2 mt-10 lg:mt-0">
              <img 
                src="/images/hero-image.svg" 
                alt="Service professionals" 
                className="w-full h-auto"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/600x400?text=SERVICE+HUB';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600">Simple steps to get the services you need</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">1</div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose a Service</h3>
              <p className="text-gray-600">Browse through our categories and select the service you need.</p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">2</div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Book an Appointment</h3>
              <p className="text-gray-600">Select your preferred date and time for the service.</p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">3</div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Service Delivered</h3>
              <p className="text-gray-600">Our verified professional will arrive and complete the job.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Our Service Categories</h2>
            <p className="mt-4 text-lg text-gray-600">Explore our wide range of professional services</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {serviceCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <Link to={`/services?category=${category.name.toLowerCase()}`}>
                    <Button variant="outline" className="w-full">View Services</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose SERVICE HUB?</h2>
            <p className="mt-4 text-lg text-gray-600">We're committed to providing the best service experience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-4 text-primary">
                <Users className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Professionals</h3>
              <p className="text-gray-600">All our service providers go through a rigorous verification process.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-4 text-primary">
                <Clock className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Emergency Services</h3>
              <p className="text-gray-600">Get help immediately with our emergency service option.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-4 text-primary">
                <Wrench className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Service Packages</h3>
              <p className="text-gray-600">Save with our subscription packages for regular service needs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 hero-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have found reliable service providers through SERVICE HUB.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                Sign Up Now
              </Button>
            </Link>
            <Link to="/services">
              <Button size="lg" variant="outline" className="border-white hover:bg-white/10">
                Browse Services
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
