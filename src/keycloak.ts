import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    url: 'http://localhost:5000',
    realm: 'keyforge',
    clientId: 'keyforge-frontend',
});

export default keycloak