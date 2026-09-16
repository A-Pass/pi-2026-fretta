export const ROUTE_ROOT = '/';
export const ROUTE_HOME = '/home';
export const ROUTE_AUTH_SIGN_IN = '/auth/sign-in';
export const ROUTE_AUTH_SIGN_UP = '/auth/sign-up';
export const ROUTE_DASHBOARD = '/dashboard';
export const ROUTE_CADASRTO_GERAL = '/cadastrogeral';

const BASE_ROUTE_API = '/api';

export const ROUTE_API_AUTH = `${BASE_ROUTE_API}/auth`;
export const ROUTE_API_PESSOA = `${BASE_ROUTE_API}/pessoas`;
export const ROUTE_API_ENDERECO = `${BASE_ROUTE_API}/enderecos`;

const ROUTE_API_SERVICO = `${BASE_ROUTE_API}/servicos`;
export const ROUTE_API_SERVICOS_CLIENTE = `${ROUTE_API_SERVICO}/cliente`;
export const ROUTE_API_SERVICOS_CLIENTE_FOTO = `${ROUTE_API_SERVICOS_CLIENTE}/foto`;

export const ROUTE_API_COMPLETA_CADASTRO = `${BASE_ROUTE_API}/completacadastro`;

export const DEFAULT_ROUTE_SIGN_OUT = ROUTE_ROOT;
export const DEFAULT_ROUTE_AFTER_AUTHENTICATED = ROUTE_DASHBOARD;
