export const eventBus = {
    emit(event: string, data?: unknown) {
        window.dispatchEvent(new CustomEvent(event, { detail: data }));
    },
    on(event: string, callback: (e: CustomEvent) => void) {
        window.addEventListener(event, callback as EventListener);
    },
    off(event: string, callback: (e: CustomEvent) => void) {
        window.removeEventListener(event, callback as EventListener);
    }
};