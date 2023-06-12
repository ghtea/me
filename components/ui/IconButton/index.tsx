import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export type IconButtonProps = {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
};

export const IconButton = ({
  children,
  onClick,
  className,
}: IconButtonProps) => {
  return (
    <button
      className={twMerge(
        "hover:bg-slate-50 text-slate-500 rounded-sm w-[36px] h-[36px] flex justify-center items-center",
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
