import { deleteInvoiceQuery } from "@/lib/db-queries/invoice/deleteInvoice";
import { authorizedProcedure } from "@/trpc/procedures/authorizedProcedure";
import { parseCatchError } from "@/lib/neverthrow/parseCatchError";
import { InternalServerError } from "@/lib/effect/error/trpc";
import { SUCCESS_MESSAGES } from "@/constants/issues";
import { TRPCError } from "@trpc/server";
import { Effect } from "effect";
import { z } from "zod";

const deleteInvoiceSchema = z.object({
  id: z.string(),
});

interface MutationResponse {
  success: boolean;
  message: string;
}

export const deleteInvoice = authorizedProcedure
  .input(deleteInvoiceSchema)
  .mutation<MutationResponse>(async ({ ctx, input }) => {
    // Delete Invoice Effect
    const deleteInvoiceEffect = Effect.gen(function* () {
      // Delete the invoice
      yield* Effect.tryPromise({
        try: () => deleteInvoiceQuery(input.id, ctx.auth.user.id),
        catch: (error) => new InternalServerError({ message: parseCatchError(error) }),
      });

      // Return the success message
      return {
        success: true,
        message: SUCCESS_MESSAGES.INVOICE_DELETED,
      };
    });

    // Run the effect
    return Effect.runPromise(
      deleteInvoiceEffect.pipe(
        Effect.catchTags({
          // If the invoice deletion fails, return an internal server error
          InternalServerError: (error) =>
            Effect.fail(new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message })),
        }),
      ),
    );
  });
