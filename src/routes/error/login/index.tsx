import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/error/login/")({
  component: RouteComponent,
});

// TODO: Create component for error handling
function RouteComponent() {
    return <div>Musisz być zalogowany!</div>
}