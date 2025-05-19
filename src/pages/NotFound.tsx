
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <BookOpen className="h-16 w-16 text-library-primary mb-6" />
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl text-library-muted mb-8 text-center">
        Oops! This page has been checked out and not returned.
      </p>
      <Button asChild>
        <Link to="/">Return to Library</Link>
      </Button>
    </div>
  );
};

export default NotFound;
