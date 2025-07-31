import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skull } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-shadow">
      <Card className="w-full max-w-md shadow-mystical border-primary/30 bg-card/80 backdrop-blur-lg">
        <CardContent className="p-8 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
            <Skull className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">404</h1>
          <p className="text-xl text-muted-foreground mb-4">
            This realm has been consumed by shadows
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            The path you seek does not exist in this dimension
          </p>
          <Button variant="mystical" asChild>
            <a href="/">Return to the Shadow Realm</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
