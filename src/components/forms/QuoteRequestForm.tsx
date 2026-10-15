"use client";

import React, { useState } from "react";
import { SendHorizontal, UploadCloud, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface QuoteRequestFormProps {
  initialProductName?: string;
}

export function QuoteRequestForm({ initialProductName = "" }: QuoteRequestFormProps) {
  const [formData, setFormData] = useState({
    contactName: "",
    email: "",
    phone: "",
    productName: initialProductName,
    quantity: 100,
    length: "",
    width: "",
    depth: "",
    dimensionsUnit: "inch",
    colors: "4/0 Full Color Outside",
    materialStock: "16 PT C1S Paperboard",
    message: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "mock-success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Max 25 MB limit
      if (file.size > 25 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          file: "File size exceeds the 25 MB maximum allowed limit.",
        }));
        setSelectedFile(null);
      } else {
        setErrors((prev) => {
          const updated = { ...prev };
          delete updated.file;
          return updated;
        });
        setSelectedFile(file);
      }
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.contactName.trim()) newErrors.contactName = "Full name is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required for quote dispatch.";
    if (!formData.quantity || Number(formData.quantity) < 100) {
      newErrors.quantity = "Minimum order quantity is 100 units.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          quantity: Number(formData.quantity),
          length: formData.length ? Number(formData.length) : undefined,
          width: formData.width ? Number(formData.width) : undefined,
          depth: formData.depth ? Number(formData.depth) : undefined,
          fileName: selectedFile ? selectedFile.name : undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitStatus(data.isMock ? "mock-success" : "success");
        setStatusMessage(data.message || "Quote request received successfully!");
      } else {
        setSubmitStatus("error");
        setStatusMessage(data.error || "Failed to process quote request. Please try again.");
      }
    } catch {
      setSubmitStatus("error");
      setStatusMessage("An unexpected network error occurred. Please contact us directly by phone.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-6 sm:p-10">
      {submitStatus === "success" || submitStatus === "mock-success" ? (
        <div className="py-12 text-center space-y-4">
          <div className="w-16 h-16 bg-[#eaf7f6] text-[#21AAA5] rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-[#172455]">
            Quote Request Received!
          </h3>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            {statusMessage}
          </p>
          {submitStatus === "mock-success" && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800 max-w-md mx-auto">
              <strong>Notice:</strong> Database/email services are not currently configured in this development environment. The submission was validated locally without persisting live records.
            </div>
          )}
          <div className="pt-4">
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                setSubmitStatus("idle");
                setSelectedFile(null);
              }}
            >
              Submit Another Inquiry
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {submitStatus === "error" && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-800 text-xs sm:text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Product and Quantity Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="productName" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Packaging Product
              </label>
              <input
                type="text"
                id="productName"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                placeholder="e.g. Custom Mailer Boxes"
                className="w-full px-4 py-2.5 rounded border border-gray-300 text-sm text-[#172455] focus:outline-none focus:ring-2 focus:ring-[#21AAA5]"
              />
            </div>

            <div>
              <label htmlFor="quantity" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Quantity <span className="text-[#FF5548]">*</span> (Min 100)
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="100"
                step="50"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded border border-gray-300 text-sm text-[#172455] focus:outline-none focus:ring-2 focus:ring-[#21AAA5]"
              />
              {errors.quantity && <p className="mt-1 text-xs text-red-600">{errors.quantity}</p>}
            </div>
          </div>

          {/* Dimensions Row */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Box Dimensions (L × W × D)
              </label>
              <select
                name="dimensionsUnit"
                value={formData.dimensionsUnit}
                onChange={handleChange}
                className="text-xs border-b border-gray-300 bg-transparent text-[#172455] font-semibold py-0.5 focus:outline-none"
              >
                <option value="inch">Inches (in)</option>
                <option value="cm">Centimeters (cm)</option>
                <option value="mm">Millimeters (mm)</option>
              </select>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <input
                type="number"
                step="0.1"
                name="length"
                value={formData.length}
                onChange={handleChange}
                placeholder="Length"
                className="w-full px-3 py-2 rounded border border-gray-300 text-sm text-[#172455] focus:outline-none focus:ring-2 focus:ring-[#21AAA5]"
              />
              <input
                type="number"
                step="0.1"
                name="width"
                value={formData.width}
                onChange={handleChange}
                placeholder="Width"
                className="w-full px-3 py-2 rounded border border-gray-300 text-sm text-[#172455] focus:outline-none focus:ring-2 focus:ring-[#21AAA5]"
              />
              <input
                type="number"
                step="0.1"
                name="depth"
                value={formData.depth}
                onChange={handleChange}
                placeholder="Depth"
                className="w-full px-3 py-2 rounded border border-gray-300 text-sm text-[#172455] focus:outline-none focus:ring-2 focus:ring-[#21AAA5]"
              />
            </div>
          </div>

          {/* Color & Material Selects */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="colors" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Printing Color Options
              </label>
              <select
                id="colors"
                name="colors"
                value={formData.colors}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded border border-gray-300 text-sm text-[#172455] bg-white focus:outline-none focus:ring-2 focus:ring-[#21AAA5]"
              >
                <option value="1-Color Outside">1-Color Simple Print</option>
                <option value="2-Color Outside">2-Color Print</option>
                <option value="4/0 Full Color Outside">4/0 Full Color Outside Only</option>
                <option value="4/1 Color Both Sides">4/1 Color (Full Outside, 1 Inside)</option>
                <option value="4/4 Full Color Inside & Outside">4/4 Full Color Inside & Outside</option>
                <option value="Plain / No Printing">Plain (No Printing / Unprinted Stock)</option>
              </select>
            </div>

            <div>
              <label htmlFor="materialStock" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Material Stock
              </label>
              <select
                id="materialStock"
                name="materialStock"
                value={formData.materialStock}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded border border-gray-300 text-sm text-[#172455] bg-white focus:outline-none focus:ring-2 focus:ring-[#21AAA5]"
              >
                <option value="12 PT Cardstock">12 PT Folding Cardstock</option>
                <option value="14 PT Cardstock">14 PT Folding Cardstock</option>
                <option value="16 PT C1S Paperboard">16 PT C1S White Paperboard (Standard)</option>
                <option value="18 PT Heavy Cardstock">18 PT Heavy Cardstock</option>
                <option value="Recycled Natural Kraft">Recycled Natural Kraft Stock</option>
                <option value="Fluted Corrugated Cardboard">Fluted Corrugated Cardboard (E/B Flute)</option>
                <option value="Luxury Rigid Board">Luxury Rigid Greyboard (1000–1200 GSM)</option>
              </select>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div>
              <label htmlFor="contactName" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Full Name <span className="text-[#FF5548]">*</span>
              </label>
              <input
                type="text"
                id="contactName"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-3.5 py-2.5 rounded border border-gray-300 text-sm text-[#172455] focus:outline-none focus:ring-2 focus:ring-[#21AAA5]"
              />
              {errors.contactName && <p className="mt-1 text-xs text-red-600">{errors.contactName}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Business Email <span className="text-[#FF5548]">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full px-3.5 py-2.5 rounded border border-gray-300 text-sm text-[#172455] focus:outline-none focus:ring-2 focus:ring-[#21AAA5]"
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Phone Number <span className="text-[#FF5548]">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3.5 py-2.5 rounded border border-gray-300 text-sm text-[#172455] focus:outline-none focus:ring-2 focus:ring-[#21AAA5]"
              />
              {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
            </div>
          </div>

          {/* File Upload Area */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Artwork / Dieline File (Optional, max 25 MB)
            </label>
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-5 text-center hover:border-[#21AAA5] transition-colors bg-[#F6F8FA]">
              <input
                type="file"
                id="artworkFile"
                accept=".ai,.pdf,.psd,.eps,.png,.jpg,.jpeg,.zip"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Upload artwork or dieline file"
              />
              <div className="flex flex-col items-center justify-center pointer-events-none">
                <UploadCloud className="w-8 h-8 text-[#21AAA5] mb-2" />
                <p className="text-xs font-semibold text-[#172455]">
                  {selectedFile ? (
                    <span className="text-[#21AAA5] font-bold">{selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                  ) : (
                    "Click or drag vector artwork, PDF, AI, or packaging dielines here"
                  )}
                </p>
                <p className="text-[11px] text-gray-400 mt-1">
                  Supported formats: .AI, .PDF, .PSD, .EPS, .PNG, .ZIP (up to 25 MB)
                </p>
              </div>
            </div>
            {errors.file && <p className="mt-1 text-xs text-red-600">{errors.file}</p>}
          </div>

          {/* Notes / Message */}
          <div>
            <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Custom Requirements or Finishing Notes
            </label>
            <textarea
              id="message"
              name="message"
              rows={3}
              value={formData.message}
              onChange={handleChange}
              placeholder="Include details about special finishes (Spot UV, Embossing, Foil Stamping), window cutouts, or target delivery dates."
              className="w-full px-4 py-2.5 rounded border border-gray-300 text-sm text-[#172455] focus:outline-none focus:ring-2 focus:ring-[#21AAA5]"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  <span>Processing Quote Request...</span>
                </>
              ) : (
                <>
                  <SendHorizontal className="w-4 h-4 mr-2" />
                  <span>Submit Custom Quote Request</span>
                </>
              )}
            </Button>
            <p className="text-[11px] text-gray-400 text-center mt-2.5">
              Free 3D digital proofing included. Our sales engineers reply within 1 business day.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
