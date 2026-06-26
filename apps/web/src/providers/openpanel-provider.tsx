"use client";

import { OpenPanelComponent } from "@openpanel/nextjs";

export const OpenPanelProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <OpenPanelComponent
        clientId="97f47a54-d163-482d-b163-06291921523f"
        trackScreenViews={true}
        trackAttributes={true}
        trackOutgoingLinks={true}
        trackHashChanges={true}
      />
      {children}
    </>
  );
};
