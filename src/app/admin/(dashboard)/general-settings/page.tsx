import { GeneralSettingsForm } from "@/components/admin/GeneralSettingsForm";

export default function AdminGeneralSettingsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#172455]">General Settings</h2>
        <p className="mt-1 text-sm font-medium text-[#4B5563]">
          Configure your website logo, favicon, image alt text, and site identity.
        </p>
      </div>

      <GeneralSettingsForm />
    </div>
  );
}
