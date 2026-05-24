import type { Metadata } from "next";
import { AdminPageHeader, AdminPanel } from "@/components/admin/admin-ui";
import { createInvitationAction } from "@/features/invitations/actions";
import { InvitationForm } from "@/features/invitations/components/invitation-form";

export const metadata: Metadata = {
  title: "Buat Undangan | Admin Undangan Digital",
};

export default function NewInvitationPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        description="Isi data utama undangan. Setelah tersimpan, lanjutkan dengan acara, gallery, gift, RSVP, dan tamu personal."
        eyebrow="Undangan baru"
        title="Buat undangan"
      />

      <AdminPanel>
        <InvitationForm
          action={createInvitationAction}
          defaultValues={{
            status: "DRAFT",
          }}
          submitLabel="Simpan undangan"
        />
      </AdminPanel>
    </div>
  );
}
