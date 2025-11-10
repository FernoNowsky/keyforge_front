import { LoginNeededError } from "@/components/LoginNeededError";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/error/login/")({
  component: LoginNeededError,
});