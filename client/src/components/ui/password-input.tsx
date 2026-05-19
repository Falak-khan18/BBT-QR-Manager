"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import type { ControllerRenderProps, FieldValues, Path } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

/**
 * Password field with visibility toggle. `FormControl` wraps only `<Input />` so Radix
 * Slot merges id/ref/aria onto the input (wrapping a custom root hides the toggle or breaks a11y).
 */
export function PasswordFormControl<T extends FieldValues>({
  field,
  autoComplete,
}: {
  field: ControllerRenderProps<T, Path<T>>;
  autoComplete?: string;
}) {
  const [show, setShow] = React.useState(false);

  return (
    <div className="relative w-full">
      <FormControl>
        <Input
          {...field}
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          className="pr-11"
        />
      </FormControl>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="absolute right-1 top-1/2 z-10 h-7 w-7 -translate-y-1/2 shrink-0 border-input bg-background text-foreground shadow-sm hover:bg-muted"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? (
          <EyeOff className="h-4 w-4 opacity-90" strokeWidth={2} aria-hidden />
        ) : (
          <Eye className="h-4 w-4 opacity-90" strokeWidth={2} aria-hidden />
        )}
      </Button>
    </div>
  );
}
