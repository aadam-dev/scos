"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import type { ButtonProps } from "@/components/ui/button";

type FormSubmitButtonProps = ButtonProps & {
  pendingLabel?: string;
};

export function FormSubmitButton({
  children,
  pendingLabel = "Saving...",
  ...props
}: FormSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} {...props}>
      {pending ? pendingLabel : children}
    </Button>
  );
}
