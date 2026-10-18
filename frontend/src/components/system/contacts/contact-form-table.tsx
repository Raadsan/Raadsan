"use client"

import { useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { IconEye, IconTrash } from "@tabler/icons-react"
import { toast } from "sonner"

import { contactFormApi } from "@/api/contacts/form"
import {
  createDataTableColumnHelper,
  DataTable,
} from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type Props = { title: string; description: string }

type Submission = {
  id: number
  name: string
  email: string
  subject?: string | null
  phone: string
  message: string
  createdAt: string
}

const columnHelper = createDataTableColumnHelper<Submission>()

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

export function ContactFormTable({ title, description }: Props) {
  const queryClient = useQueryClient()
  const [viewing, setViewing] = useState<Submission | null>(null)

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ["contact-submissions"],
    queryFn: () => contactFormApi.getSubmissions() as Promise<Submission[]>,
  })

  const deleteMutation = useMutation({
    mutationFn: contactFormApi.removeSubmission,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["contact-submissions"] })
      toast.success("Message deleted")
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.display({
          id: "no",
          header: "No",
          cell: ({ row }) => (
            <span className="font-bold text-primary">
              #{String(row.original.id).padStart(2, "0")}
            </span>
          ),
        }),
        columnHelper.accessor("name", {
          header: "Name",
          cell: ({ row }) => (
            <span className="font-medium">{row.original.name}</span>
          ),
        }),
        columnHelper.accessor("email", { header: "Email" }),
        columnHelper.accessor("phone", { header: "Phone" }),
        columnHelper.accessor("subject", {
          header: "Subject",
          cell: ({ row }) => row.original.subject || "—",
        }),
        columnHelper.accessor("message", {
          header: "Message",
          cell: ({ row }) => (
            <span className="block max-w-[240px] truncate">
              {row.original.message}
            </span>
          ),
        }),
        columnHelper.display({
          id: "actions",
          header: "Action",
          cell: ({ row }) => (
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 text-emerald-600 hover:bg-emerald-600/10 hover:text-emerald-600"
                onClick={() => setViewing(row.original)}
              >
                <IconEye className="size-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                disabled={deleteMutation.isPending}
                onClick={() => {
                  if (window.confirm("Delete this message?")) {
                    deleteMutation.mutate(row.original.id)
                  }
                }}
              >
                <IconTrash className="size-4" />
              </Button>
            </div>
          ),
        }),
      ]),
    [deleteMutation.isPending],
  )

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          {title}
        </h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <DataTable
        columns={columns}
        data={submissions}
        searchKey="name"
        searchPlaceholder="Search messages..."
        loading={isLoading}
        emptyMessage="No messages yet."
      />

      <Dialog
        open={Boolean(viewing)}
        onOpenChange={(open) => {
          if (!open) setViewing(null)
        }}
      >
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle>Client Message</DialogTitle>
          </DialogHeader>
          {viewing ? (
            <div className="space-y-3 text-sm">
              <p>
                <span className="text-muted-foreground">Name:</span>{" "}
                <span className="font-medium">{viewing.name}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Email:</span>{" "}
                <span className="font-medium">{viewing.email}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Phone:</span>{" "}
                <span className="font-medium">{viewing.phone}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Subject:</span>{" "}
                <span className="font-medium">
                  {viewing.subject || "—"}
                </span>
              </p>
              <p>
                <span className="text-muted-foreground">Sent:</span>{" "}
                <span className="font-medium">
                  {formatDate(viewing.createdAt)}
                </span>
              </p>
              <div>
                <p className="mb-1 text-muted-foreground">Message</p>
                <p className="whitespace-pre-wrap rounded-xl border bg-muted/30 p-3 leading-relaxed">
                  {viewing.message}
                </p>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
