import user_routes from './api/user-routes.js';

const api_prefix = "/api"

const routes = (app) => {
  app.use(api_prefix, user_routes);
}

export {
  routes
}