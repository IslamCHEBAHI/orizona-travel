"use client";

import { Trash2 } from "lucide-react";
import { deleteDestination } from "../../app/admin/destinations/actions";

type Props = {
  id: number;
  name: string;
};

export default function DeleteDestinationButton({
  id,
  name,
}: Props) {

  return (
    <form
      action={deleteDestination}
      onSubmit={(event) => {

        const confirmation = window.confirm(
          `Voulez-vous vraiment supprimer "${name}" ?\n\nToutes ses photos seront également supprimées.`
        );

        if (!confirmation) {
          event.preventDefault();
        }

      }}
    >

      <input
        type="hidden"
        name="id"
        value={id}
      />

      <button
        type="submit"
        className="admin-destination-delete"
      >
        <Trash2 size={16} />
        Supprimer
      </button>

    </form>
  );
}