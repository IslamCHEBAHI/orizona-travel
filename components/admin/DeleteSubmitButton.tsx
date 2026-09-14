"use client";

import { Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";

type DeleteSubmitButtonProps = {
  label?: string;
  confirmMessage: string;
  className?: string;
};

export default function DeleteSubmitButton({
  label = "Supprimer",
  confirmMessage,
  className = "",
}: DeleteSubmitButtonProps) {
  const { pending } = useFormStatus();

  function handleClick(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    if (pending) {
      return;
    }

    const confirmed =
      window.confirm(confirmMessage);

    if (!confirmed) {
      event.preventDefault();
    }
  }

  return (
    <button
      type="submit"
      className={className}
      disabled={pending}
      onClick={handleClick}
    >
      <Trash2 size={14} />

      {pending
        ? "Suppression..."
        : label}
    </button>
  );
}