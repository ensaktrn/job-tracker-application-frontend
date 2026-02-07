"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createCompany } from "@/lib/api/companies";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  name: z.string().min(2, "Company name is required"),
  website: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || v.startsWith("http://") || v.startsWith("https://"), {
      message: "Website must start with http:// or https://",
    }),
});

type Form = z.infer<typeof schema>;

export function AddCompanyDialog() {
  const qc = useQueryClient();

  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", website: "" },
  });

  const mutation = useMutation({
    mutationFn: createCompany,
    onSuccess: () => {
      toast.success("Company added");
      qc.invalidateQueries({ queryKey: ["companies"] });
      form.reset();
    },
    onError: () => toast.error("Failed to add company"),
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>+ Add Company</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Company</DialogTitle>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((v) => mutation.mutate({ name: v.name, website: v.website || undefined }))}
        >
          <div className="space-y-2">
            <Label>Name</Label>
            <Input placeholder="Google" {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Website (optional)</Label>
            <Input placeholder="https://company.com" {...form.register("website")} />
            {form.formState.errors.website && (
              <p className="text-sm text-red-600">{form.formState.errors.website.message}</p>
            )}
          </div>

          <Button className="w-full" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : "Save"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
