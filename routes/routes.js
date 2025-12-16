import auth_routes from './api/auth-routes.js';
import user_routes from './api/user-routes.js';

const api_prefix = "/api"

const routes = (app) => {
  app.use(api_prefix, auth_routes);
  app.use(api_prefix, user_routes);
}

export {
  routes
}