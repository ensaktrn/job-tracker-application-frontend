"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createJobPosting } from "@/lib/api/jobPostings";
import { getCompanies } from "@/lib/api/companies";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const schema = z.object({
  companyId: z.string().min(1, "Company is required"),
  title: z.string().min(2, "Title is required"),
  url: z
    .string()
    .trim()
    .min(5, "URL is required")
    .refine((v) => v.startsWith("http://") || v.startsWith("https://"), {
      message: "URL must start with http:// or https://",
    }),
  notes: z.string().optional(),
});

type Form = z.infer<typeof schema>;

export function AddJobPostingDialog() {
  const qc = useQueryClient();

  const companiesQuery = useQuery({
    queryKey: ["companies"],
    queryFn: getCompanies,
  });

  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { companyId: "", title: "", url: "", notes: "" },
  });

  const mutation = useMutation<
    Awaited<ReturnType<typeof createJobPosting>>,
    Error,
    Parameters<typeof createJobPosting>[0]
  >({
    mutationFn: createJobPosting,
    onSuccess: () => {
      toast.success("Job posting added");
      qc.invalidateQueries({ queryKey: ["job-postings"] });
      form.reset();
    },
    onError: () => toast.error("Failed to add job posting"),
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>+ Add Job Posting</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Job Posting</DialogTitle>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((v) =>
            mutation.mutate({
              companyId: v.companyId,
              title: v.title,
              url: v.url,
              notes: v.notes || undefined,
            })
          )}
          >

          <div className="space-y-2">
            <Label>Company</Label>
            <Select
              value={form.watch("companyId")}
              onValueChange={(val) => form.setValue("companyId", val, { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder={companiesQuery.isLoading ? "Loading..." : "Select company"} />
              </SelectTrigger>
              <SelectContent>
                {(companiesQuery.data ?? []).map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.companyId && (
              <p className="text-sm text-red-600">{form.formState.errors.companyId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Title</Label>
            <Input placeholder="Backend Developer" {...form.register("title")} />
            {form.formState.errors.title && (
              <p className="text-sm text-red-600">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>URL</Label>
            <Input placeholder="https://..." {...form.register("url")} />
            {form.formState.errors.url && (
              <p className="text-sm text-red-600">{form.formState.errors.url.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Notes (optional)</Label>
            <Input placeholder="Remote, referral, etc." {...form.register("notes")} />
          </div>

          <Button className="w-full" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : "Save"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
