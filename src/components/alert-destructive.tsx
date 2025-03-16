import { useEffect } from "react";
import { AlertCircle, X } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

export function AlertDestructive({ message, show, onClose }: { message: string, show: boolean, onClose: () => void }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 5000); // Auto-close after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed top-40 right-6 z-50">
      <Alert variant="destructive" className="relative flex items-center">
        <AlertCircle className="h-4 w-4 mr-2" />
        <div className="flex-grow">
          <AlertTitle>Alert</AlertTitle>
          <AlertDescription >{message}</AlertDescription>
        </div>
        <button onClick={onClose} className="ml-4 text-red-700 hover:text-red-900">
          <X className="h-5 w-5" />
        </button>
      </Alert>
    </div>
  );
}
