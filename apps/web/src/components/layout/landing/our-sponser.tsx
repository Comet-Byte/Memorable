import React from "react";

// A lightweight "built with" strip — replaces the old open-source sponsor grid.
const tech = ["Next.js", "Supabase", "Drizzle", "tRPC", "React"];

const OurSponser = () => {
  return (
    <section className="border-b border-dashed px-6 py-16 text-center">
      <p className="text-muted-foreground text-xs font-medium tracking-widest uppercase">Built with modern technology</p>
      <div className="text-muted-foreground/70 mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-lg font-medium">
        {tech.map((name) => (
          <span key={name} className="transition-colors hover:text-foreground">
            {name}
          </span>
        ))}
      </div>
    </section>
  );
};

export default OurSponser;
