import Link from "next/link";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export type IconLinkProps = {
  className?: string;
  children: ReactNode;
  href: string
};

export const IconLink = ({
  children,
  href,
  className,
}: IconLinkProps) => {
  return (
    <Link
      href={href}
      className={twMerge(
        "hover:bg-slate-50 text-slate-500 rounded-sm w-[36px] h-[36px] flex justify-center items-center",
        className
      )}
    >
      {children}
    </Link>
  );
};
