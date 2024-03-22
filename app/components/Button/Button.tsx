import { ButtonHTMLAttributes } from "react";

export const Button = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button className="text-raisin-black bg-primary/90 p-4 hover:bg-primary disabled:bg-primary/30" {...props}>
      {props.children}
    </button>
  );
}
