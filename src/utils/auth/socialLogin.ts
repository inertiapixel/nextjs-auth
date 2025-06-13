/*
import { OAUTH_PROVIDERS } from './providers';
export const loginWithSocial = ({ provider }, API_BASE_URL) => {
    const config = OAUTH_PROVIDERS[provider];
    const params = {
        client_id: config.clientId,
        redirect_uri: `${API_BASE_URL}/auth/callback?provider=${provider}`,
        response_type: 'code',
        scope: config.scope,
        ...(config.extras || {})
    };
    const queryString = new URLSearchParams(params).toString();
    const authUrl = `${config.authEndpoint}?${queryString}`;
    // window.location.href = authUrl;
    window.open(authUrl, '_blank', 'width=500,height=600');
};
*/
export const loginWithSocial = () => {
    window.open();
}