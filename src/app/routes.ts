import { createRouter, defineRoute, param } from "type-route";

export const { routes, useRoute, RouteProvider } = createRouter({
  home: defineRoute("/"),
  list: defineRoute({ id: param.path.string }, (p) => `/list/${p.id}`),
});

export type Routes = typeof routes;
