import { HomePage } from "@/pages/HomePage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/error/")({
  component: HomePage,
});
