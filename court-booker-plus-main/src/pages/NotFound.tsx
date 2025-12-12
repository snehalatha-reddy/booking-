import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="text-center animate-fade-in">
        <div className="mb-6 text-8xl">🏸</div>
        <h1 className="font-display text-6xl font-bold text-foreground">404</h1>
        <p className="mt-4 text-xl text-muted-foreground">Oops! This court doesn't exist</p>
        <p className="mt-2 text-muted-foreground">The page you're looking for has gone out of bounds.</p>
        <Link to="/">
          <Button variant="hero" size="lg" className="mt-8">
            <Home className="mr-2 h-4 w-4" />
            Back to Booking
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
