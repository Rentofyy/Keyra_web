import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-keyra-gold disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        // Primary brand gold button
        gold: "bg-gradient-to-r from-[#C5A059] to-[#E5A93C] text-[#0F1E36] font-semibold shadow-gold hover:opacity-95 hover:shadow-lg",
        // Deep Navy button
        navy: "bg-[#0F1E36] text-white hover:bg-[#1A2F50] shadow-md",
        // Verification Teal button
        teal: "bg-[#006A61] text-white hover:bg-[#00524B] shadow-sm",
        // Outline button with subtle border
        outline:
          "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-400",
        // Subtle secondary
        secondary:
          "bg-slate-100 text-slate-900 hover:bg-slate-200",
        // Ghost button
        ghost: "hover:bg-slate-100 text-slate-700 hover:text-slate-900",
        // Destructive
        destructive:
          "bg-red-600 text-white hover:bg-red-700",
        // Link
        link: "text-[#C5A059] underline-offset-4 hover:underline p-0 h-auto font-medium",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "gold",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
