"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogContentContainer,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogHeaderContainer,
  DialogIcon,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { invoiceErrorAtom } from "@/global/atoms/invoice-atom";
import { animate, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { FileAlertIcon } from "@/assets/icons";
import React, { useEffect } from "react";
import { useAtomValue } from "jotai";

const shakeAnimation = [300, -300, 300, -300, 300, -300, 0];

const InvoiceErrorsModal = () => {
  const invoiceErrors = useAtomValue(invoiceErrorAtom);

  useEffect(() => {
    // Animating a button shake when there are errors
    if (invoiceErrors.length > 0) {
      // Initial shake animation
      animate("#invoice-err-btn", { rotate: shakeAnimation }, { duration: 0.5, ease: "easeInOut" });

      // Set up interval for repeated shaking every 10 seconds
      const interval = setInterval(() => {
        animate("#invoice-err-btn", { rotate: shakeAnimation }, { duration: 0.5, ease: "easeInOut" });
      }, 10000);

      // Cleanup interval on unmount or when errors are cleared
      return () => clearInterval(interval);
    }
  }, [invoiceErrors]);

  return (
    <AnimatePresence>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            id="invoice-err-btn"
            disabled={invoiceErrors.length === 0}
            variant={invoiceErrors.length > 0 ? "destructive" : "secondary"}
          >
            <FileAlertIcon />
            <span className="hidden md:flex">Errors</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeaderContainer>
            <DialogIcon>
              <FileAlertIcon />
            </DialogIcon>
            <DialogHeader>
              <DialogTitle>Your Invoice has errors</DialogTitle>
              <DialogDescription>Please fix the errors to continue to view the invoice</DialogDescription>
            </DialogHeader>
          </DialogHeaderContainer>
          <DialogContentContainer className="scroll-bar-hidden max-h-80 divide-y overflow-y-scroll p-0">
            {invoiceErrors.map((error, index) => (
              <div key={index} className="flex flex-col gap-1 p-2">
                <div className="flex flex-row items-center justify-between gap-1">
                  <span className="text-muted-foreground jetbrains-mono text-[10px]">CODE: {error.code}</span>
                  <span className="jetbrains-mono text-destructive text-[10px]">
                    {"type" in error ? error.type : "unknown"}
                  </span>
                </div>
                <p className="text-destructive text-xs">{error.message}</p>
                <div className="text-muted-foreground jetbrains-mono text-[10px]">{error.path.join("/")}</div>
              </div>
            ))}
          </DialogContentContainer>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AnimatePresence>
  );
};

export default InvoiceErrorsModal;
