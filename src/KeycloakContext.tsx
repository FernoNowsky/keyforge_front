import { createContext, useContext } from 'react'

export const KeycloakContext = createContext<Keycloak.KeycloakInstance | null>(null)

// Store instance globally for non-React code
let keycloakInstanceGlobal: Keycloak.KeycloakInstance | null = null

export function setKeycloakInstance(instance: Keycloak.KeycloakInstance | null) {
    keycloakInstanceGlobal = instance
}

export function getKeycloakInstance() {
    return keycloakInstanceGlobal
}

// Hook version for use in React components
export function useKeycloakInstance() {
    return useContext(KeycloakContext)
}