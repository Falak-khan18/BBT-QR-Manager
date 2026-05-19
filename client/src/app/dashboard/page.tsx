"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { QrCodePreview } from "@/components/qr-code-preview";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { createQR } from "@/features/qr-management/api/create-qr";
import { deleteQR } from "@/features/qr-management/api/delete-qr";
import { listQR } from "@/features/qr-management/api/list-qr";
import type { QrRecord } from "@/features/qr-management/api/types";
import { updateQR } from "@/features/qr-management/api/update-qr";
import { getErrorMessage } from "@/lib/api-errors";

const qrFormSchema = z.object({
  title: z.string().max(255).optional().or(z.literal("")),
  destination_url: z.string().url("Enter a valid URL including https://"),
});

type QrFormValues = z.infer<typeof qrFormSchema>;

const redirectBase =
  process.env.NEXT_PUBLIC_REDIRECT_BASE_URL?.replace(/\/$/, "") ||
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:8000";

export default function DashboardPage() {
  const [items, setItems] = useState<QrRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<QrRecord | null>(null);
  const [focused, setFocused] = useState<QrRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<QrRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listQR();
      setItems(data);
      setFocused((current) => {
        if (!current) return data[0] ?? null;
        return data.find((row) => row.id === current.id) ?? data[0] ?? null;
      });
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not load QR codes"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const createForm = useForm<QrFormValues>({
    resolver: zodResolver(qrFormSchema),
    defaultValues: { title: "", destination_url: "" },
  });

  const editForm = useForm<QrFormValues>({
    resolver: zodResolver(qrFormSchema),
    defaultValues: { title: "", destination_url: "" },
  });

  useEffect(() => {
    if (editRecord) {
      editForm.reset({
        title: editRecord.title ?? "",
        destination_url: editRecord.destination_url,
      });
    }
  }, [editRecord, editForm]);

  const headline = useMemo(() => {
    if (loading) return "Synchronizing…";
    if (!items.length) return "No QR codes yet";
    return `${items.length} active ${items.length === 1 ? "code" : "codes"}`;
  }, [items.length, loading]);

  async function handleCreate(values: QrFormValues) {
    try {
      const created = await createQR({
        title: values.title?.trim() ? values.title.trim() : undefined,
        destination_url: values.destination_url.trim(),
      });
      toast.success("QR code created");
      setCreateOpen(false);
      createForm.reset();
      setFocused(created);
      await load();
    } catch (err) {
      toast.error(getErrorMessage(err, "Create failed"));
    }
  }

  async function handleEdit(values: QrFormValues) {
    if (!editRecord) return;
    try {
      const updated = await updateQR(editRecord.id, {
        title: values.title?.trim() ? values.title.trim() : null,
        destination_url: values.destination_url.trim(),
      });
      toast.success("Destination updated — QR artwork unchanged");
      setEditRecord(null);
      setFocused(updated);
      await load();
    } catch (err) {
      toast.error(getErrorMessage(err, "Update failed"));
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteQR(deleteTarget.id);
      toast.success("QR code removed");
      if (focused?.id === deleteTarget.id) {
        setFocused(null);
      }
      setDeleteTarget(null);
      await load();
    } catch (err) {
      toast.error(getErrorMessage(err, "Delete failed"));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Workspace
          </p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {headline}
          </h1>
          <p className="text-sm text-muted-foreground">
            QR images encode{" "}
            <span className="font-mono text-xs">
              {redirectBase}/r/&#123;code&#125;
            </span>{" "}
            — swap destinations without reprinting.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>New QR code</Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Your codes</CardTitle>
            <CardDescription>
              Select a row to preview the static redirect QR.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : items.length === 0 ? (
              <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                Create your first dynamic QR. Destination updates propagate instantly.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Short code</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={focused?.id === row.id ? "selected" : undefined}
                        className="cursor-pointer"
                        onClick={() => setFocused(row)}
                      >
                        <TableCell className="font-medium">
                          {row.title || "Untitled"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{row.short_code}</Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-xs text-muted-foreground">
                          {row.destination_url}
                        </TableCell>
                        <TableCell className="space-x-2 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(event) => {
                              event.stopPropagation();
                              setEditRecord(row);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={(event) => {
                              event.stopPropagation();
                              setDeleteTarget(row);
                            }}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Live preview</CardTitle>
            <CardDescription>
              This encodes the redirect endpoint, not the final landing page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {focused ? (
              <>
                <div className="mb-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-950 dark:text-amber-100">
                  <p className="font-semibold">Assessment / demo</p>
                  <p className="mt-1 text-amber-900/90 dark:text-amber-50/90">
                    This QR encodes <strong>redirect</strong> link only (short code{" "}
                    <code className="rounded bg-white/60 px-1 dark:bg-black/30">
                      {focused.short_code}
                    </code>
                    ). After you edit <em>destination</em> and save, the pattern here must stay{" "}
                    <strong>identical</strong>.
                  </p>
                </div>
                <div className="flex justify-center">
                  <QrCodePreview
                    key={focused.short_code}
                    value={focused.redirect_url}
                    size={200}
                  />
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">
                      Encoded URL
                    </p>
                    <p className="font-mono text-xs break-all">{focused.redirect_url}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">
                      Current destination
                    </p>
                    <Textarea
                      readOnly
                      value={focused.destination_url}
                      className="min-h-[80px] text-xs"
                    />
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Select a QR or create one to preview the SVG.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create dynamic QR</DialogTitle>
            <DialogDescription>
              Provide the first destination. You can edit it later without changing the QR.
            </DialogDescription>
          </DialogHeader>
          <Form {...createForm}>
            <form
              onSubmit={createForm.handleSubmit(handleCreate)}
              className="space-y-4"
            >
              <FormField
                control={createForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Spring campaign" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="destination_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/offer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(editRecord)}
        onOpenChange={(open) => {
          if (!open) setEditRecord(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit destination</DialogTitle>
            <DialogDescription>
              Updating the URL changes where scans go. The QR graphic stays identical.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(handleEdit)}
              className="space-y-4"
            >
              <FormField
                control={editForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="destination_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination URL</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditRecord(null)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this QR code?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget
                ? `Short code ${deleteTarget.short_code} will stop working. This cannot be undone.`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={deleting}
              onClick={() => void confirmDelete()}
            >
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
