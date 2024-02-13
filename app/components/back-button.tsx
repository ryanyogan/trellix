import { Link } from "@remix-run/react";
import { Button } from "./ui/button";

interface BackButtonProps {
  href: string;
  label: string;
}

export function BackButton({ label, href }: BackButtonProps) {
  return (
    <div>
      <Button variant="link" className="font-normal w-full" size="sm" asChild>
        <Link to={href}>{label}</Link>
      </Button>
    </div>
  );
}
