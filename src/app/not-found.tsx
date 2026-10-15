import { PackageX, Home, Search, SendHorizontal } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="py-24 sm:py-32 bg-[#F6F8FA] min-h-[70vh] flex items-center">
      <Container className="text-center max-w-xl mx-auto">
        <div className="w-20 h-20 bg-white border border-[#E2E4E8] rounded-2xl flex items-center justify-center text-[#FF5548] mx-auto shadow-sm mb-6">
          <PackageX className="w-10 h-10" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-[#21AAA5]">
          Error 404
        </span>

        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#172455] tracking-tight">
          Packaging Page Not Found
        </h1>

        <p className="mt-4 text-sm sm:text-base text-gray-600 leading-relaxed">
          The packaging style or resource you are searching for might have been moved or updated. Explore our full catalog or contact our prepress team for assistance.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button href="/" variant="primary" size="md">
            <Home className="w-4 h-4 mr-1.5" />
            <span>Return to Homepage</span>
          </Button>

          <Button href="/products" variant="outline" size="md">
            <Search className="w-4 h-4 mr-1.5" />
            <span>Browse Products</span>
          </Button>

          <Button href="/quote" variant="teal" size="md">
            <SendHorizontal className="w-4 h-4 mr-1.5" />
            <span>Custom Quote</span>
          </Button>
        </div>
      </Container>
    </div>
  );
}
