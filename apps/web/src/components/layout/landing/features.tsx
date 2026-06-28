import { BoltIcon, ShieldIcon, SparkleIcon } from "lucide-react";
import React from "react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <SparkleIcon className="size-5" />,
    title: "Beautiful by default",
    description:
      "Professionally designed templates that make every invoice look polished — and help you get paid faster.",
  },
  {
    icon: <BoltIcon className="size-5" />,
    title: "Free & unlimited",
    description: "Create and send as many invoices as you need. No limits, no hidden costs, no subscriptions.",
  },
  {
    icon: <ShieldIcon className="size-5" />,
    title: "Private & secure",
    description:
      "Your data stays yours. Store invoices locally on your device, or securely sync them — the choice is yours.",
  },
];

const Features = () => {
  return (
    <section className="border-b border-dashed px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Everything you need to bill with ease</h2>
        <p className="text-muted-foreground mt-4 text-base">
          A focused set of features that get out of your way, so you can create and send invoices in minutes.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="flex flex-col items-center gap-3 text-center">
            <div className="bg-muted/40 text-foreground flex size-11 items-center justify-center rounded-xl border">
              {feature.icon}
            </div>
            <h3 className="text-lg font-medium tracking-tight">{feature.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed text-balance">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
