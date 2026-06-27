import { createInvoiceFieldKeyStringValuesSchema } from "@/zod-schemas/invoice/create-invoice";
import { z } from "zod";

// Default sender/client details a user can save once and reuse to pre-fill new
// invoices. Names/addresses are not required here (unlike the invoice schema) so
// a user can save partial defaults (e.g. only company details).
export const defaultDetailsSchema = z.object({
  companyDetails: z.object(
    {
      name: z.string({ error: "Company name must be a string" }),
      address: z.string({ error: "Address must be a string" }),
      metadata: z.array(createInvoiceFieldKeyStringValuesSchema),
    },
    { error: "Company details must be an object" },
  ),
  clientDetails: z.object(
    {
      name: z.string({ error: "Client name must be a string" }),
      address: z.string({ error: "Address must be a string" }),
      metadata: z.array(createInvoiceFieldKeyStringValuesSchema),
    },
    { error: "Client details must be an object" },
  ),
});

export type ZodDefaultDetailsSchema = z.infer<typeof defaultDetailsSchema>;

export const defaultDetailsSchemaDefaultValues: ZodDefaultDetailsSchema = {
  companyDetails: {
    name: "",
    address: "",
    metadata: [],
  },
  clientDetails: {
    name: "",
    address: "",
    metadata: [],
  },
};
