
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Page Not Found</h2>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/">
        <Button>
          Return to Home
        </Button>
      </Link>
    </div>
  );
}
