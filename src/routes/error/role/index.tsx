import { RoleNeededError } from "@/components/RoleNeededError";
import { createFileRoute } from "@tanstack/react-router";


export const Route = createFileRoute("/error/role/")({
  component: RoleNeededError,
});

