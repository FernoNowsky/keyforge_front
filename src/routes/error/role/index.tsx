import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/error/role/")({
  component: RouteComponent,
});

// TODO: Create component for error handling
function RouteComponent() {
    return <div>Nie masz uprawnień!</div>
}