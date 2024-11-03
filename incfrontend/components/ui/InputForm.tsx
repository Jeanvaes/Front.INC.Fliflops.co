// components/ui/InputForm.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export function InputForm({ onSubmit }: { onSubmit: (data: z.infer<typeof FormSchema>) => void }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={form.formState.errors.username ? "text-red-500" : ""}>
                Parámetros a buscar
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="id_paciente, prestacion, nodulos, morfologia_nodulos, margenes_nodulos, densidad_nodulo, microcalcificaciones, calcificaciones_benignas, calcificaciones_sospechosas, distribucion_calcificaciones, presencia_asimetrias, tipo_asimetria, hallazgos_asociados, lateralidad_hallazgo, birads, edad"
                  {...field}
                />
              </FormControl>
              <FormDescription className={form.formState.errors.username ? "text-red-500" : ""}>
                Digite los parámetros que se buscarán en la historias.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}