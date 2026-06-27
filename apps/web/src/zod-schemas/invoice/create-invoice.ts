import { z } from "zod";

export const valueType = z.enum(["percentage", "fixed"], {
  error: "Value type must be either 'percentage' or 'fixed'",
});

export const createInvoiceItemSchema = z.object(
  {
    name: z
      .string({ error: "Item name must be a string" })
      .min(1, { message: "Item name cannot be empty" }),
    description: z.string({
      error: "Item description must be a string",
    }),
    quantity: z.coerce
      .number({ error: "Quantity must be a number" })
      .positive({ message: "Quantity must be positive" }),
    unitPrice: z.coerce
      .number({ error: "Unit price must be a number" })
      .positive({ message: "Unit price must be positive" }),
  },
  { error: "Item must be an object" },
);

export const createInvoiceFieldKeyStringValuesSchema = z.object(
  {
    label: z.string({ error: "Label must be a string" }).min(1, {
      message: "Label cannot be empty",
    }),
    value: z.string({ error: "Value must be a string" }).min(1, {
      message: "Value cannot be empty",
    }),
  },
  { error: "Field key string values must be an object" },
);

export const createInvoiceFieldKeyNumberValuesSchema = z.object(
  {
    label: z.string({ error: "Label must be a string" }).min(1, {
      message: "Label cannot be empty",
    }),
    value: z.number({ error: "Value must be a number" }),
    type: valueType,
  },
  { error: "Field key number values must be an object" },
);

export const createInvoiceSchema = z.object({
  companyDetails: z.object(
    {
      logoBase64: z.string({ error: "Logo base64 must be a string" }).optional(),
      logo: z
        .string({ error: "Logo must be a string" })
        .refine(
          (val) =>
            !val ||
            val.startsWith("data:image") ||
            val.startsWith("blob:") ||
            val.startsWith("https://") ||
            val.startsWith("http://"),
          {
            message: "Logo must be a valid image URL, blob URL or data URL",
          },
        )
        .nullable()
        .optional(),
      signatureBase64: z.string({ error: "Signature base64 must be a string" }).optional(),
      signature: z
        .string({ error: "Signature must be a string" })
        .refine(
          (val) =>
            !val ||
            val.startsWith("data:image") ||
            val.startsWith("blob:") ||
            val.startsWith("https://") ||
            val.startsWith("http://"),
          {
            message: "Signature must be a valid image URL, blob URL or data URL",
          },
        )
        .nullable()
        .optional(),
      name: z.string({ error: "Company name must be a string" }).min(1, {
        message: "Company name cannot be empty",
      }),
      address: z.string({ error: "Address must be a string" }),
      metadata: z.array(createInvoiceFieldKeyStringValuesSchema),
    },
    { error: "Company details must be an object" },
  ),
  clientDetails: z.object(
    {
      name: z
        .string({ error: "Client name must be a string" })
        .min(1, { message: "Client name cannot be empty" }),
      address: z.string({ error: "Address must be a string" }),
      metadata: z.array(createInvoiceFieldKeyStringValuesSchema),
    },
    { error: "Client details must be an object" },
  ),
  invoiceDetails: z.object(
    {
      theme: z.object({
        baseColor: z.string({ error: "Base color must be a string" }).min(1, {
          message: "Base color cannot be empty",
        }),
        mode: z.enum(["dark", "light"], { error: "Mode must be either 'dark' or 'light'" }),
        template: z
          .enum(["default", "vercel"], {
            error: "Template must be either 'default' or 'vercel'",
          })
          .default("default")
          .optional(),
        font: z
          .enum(["quicksand", "geist", "inter", "jetbrainsmono"], {
            error: "Invalid font",
          })
          .optional(),
      }),
      currency: z
        .string({ error: "Currency must be a string" })
        .min(1, { message: "Currency cannot be empty" }),
      prefix: z.string({ error: "Prefix must be a string" }),
      serialNumber: z
        .string({ error: "Serial number must be a string" })
        .min(1, { message: "Serial number cannot be empty" }),
      date: z.date({ error: "Date must be a valid date" }),
      dueDate: z.date({ error: "Due date must be a valid date" }).optional().nullable(),
      paymentTerms: z.string({
        error: "Payment terms must be a string",
      }),
      billingDetails: z.array(createInvoiceFieldKeyNumberValuesSchema),
    },
    { error: "Invoice details must be an object" },
  ),
  items: z.array(createInvoiceItemSchema),
  metadata: z.object(
    {
      notes: z.string({ error: "Notes must be a string" }),
      terms: z.string({ error: "Terms must be a string" }),
      paymentInformation: z.array(createInvoiceFieldKeyStringValuesSchema),
    },
    { error: "Metadata must be an object" },
  ),
});

export type ZodCreateInvoiceSchema = z.infer<typeof createInvoiceSchema>;

export const createInvoiceSchemaDefaultValues: ZodCreateInvoiceSchema = {
  companyDetails: {
    name: "Invoicely Ltd",
    address: "123 Main St, Anytown, USA",
    metadata: [],
  },
  clientDetails: {
    name: "John Doe",
    address: "456 Second St, Anytown, USA",
    metadata: [],
  },
  invoiceDetails: {
    theme: {
      template: "default",
      baseColor: "#635CFF",
      mode: "light",
    },
    currency: "USD",
    prefix: "Invoice INV-",
    serialNumber: "0001",
    date: new Date(), // now
    paymentTerms: "",
    billingDetails: [],
  },
  items: [],
  metadata: {
    notes: "",
    terms: "",
    paymentInformation: [],
  },
};
