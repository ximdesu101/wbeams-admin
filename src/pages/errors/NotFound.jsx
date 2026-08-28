import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CircleArrowLeft } from 'lucide-react';
import NotFoundImage from "@/assets/NotFoundImage.png";

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted/30 px-4">
            <div className="text-center max-w-xl">
                <div className="mb-4 flex justify-center">
                    <img 
                        src={NotFoundImage} 
                        alt="image"
                        className="flex items-center justify-center"
                    />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-2">
                    404 | <span className="text-[#d60036]">Not Found</span>
                </h1>
                <p className="text-muted-foreground mb-8 leading-relaxed text-sm md:text-base lg:text-lg">
                    Looks like you and Zoro took the same turn... and now you're both lost. But unlike Zoro, you can head back to the homepage.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                        variant="outline"
                        size="lg"
                        className="font-semibold"
                        onClick={() => window.history.back()}
                    >
                        <CircleArrowLeft/> Go Back
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default NotFound;