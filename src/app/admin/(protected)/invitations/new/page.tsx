import type { Metadata } from "next";
import { createInvitationAction } from "@/features/invitations/actions";
import { InvitationForm } from "@/features/invitations/components/invitation-form";

export const metadata: Metadata = {
  title: "Buat Undangan | Admin Undangan Digital",
};

export default function NewInvitationPage() {
  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-medium uppercase text-rose-700">
          Undangan baru
        </p>
        <h1 className="mt-3 text-3xl font-semibold">Buat undangan</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          Isi data utama undangan. Detail acara, gallery, gift, RSVP, dan
          ucapan akan ditambahkan pada sprint berikutnya.
        </p>
      </section>

      <section className="border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
        <InvitationForm
          action={createInvitationAction}
          defaultValues={{
            status: "DRAFT",
          }}
          submitLabel="Simpan undangan"
        />
      </section>
    </div>
  );
}
