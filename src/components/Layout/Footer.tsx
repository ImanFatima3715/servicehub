
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-xl font-bold mb-4">SERVICE HUB</h2>
            <p className="text-gray-300 mb-4 max-w-md">
              Your one-stop solution for reliable, verified service providers. 
              Whether you need emergency assistance or regular services, 
              we've got you covered.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-gray-300 hover:text-white">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a href="https://instagram.com" className="text-gray-300 hover:text-white">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              <a href="https://twitter.com" className="text-gray-300 hover:text-white">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-white">Services</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white">About</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Service Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services?category=plumbing" className="text-gray-300 hover:text-white">Plumbing</Link>
              </li>
              <li>
                <Link to="/services?category=electrical" className="text-gray-300 hover:text-white">Electrical</Link>
              </li>
              <li>
                <Link to="/services?category=cleaning" className="text-gray-300 hover:text-white">Home Cleaning</Link>
              </li>
              <li>
                <Link to="/services?category=carpentry" className="text-gray-300 hover:text-white">Carpentry</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-700">
          <p className="text-gray-300 text-center">
            &copy; {new Date().getFullYear()} SERVICE HUB. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
