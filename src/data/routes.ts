import { Route, Location } from "@/types";

function generateLocations(): { routes: Route[]; allLocations: Location[] } {
  const routes: Route[] = [];
  const allLocations: Location[] = [];
  const locationsPerRoute = 9; // 15 routes × 9 = 135

  for (let r = 1; r <= 15; r++) {
    const routeLocations: Location[] = [];

    for (let l = 1; l <= locationsPerRoute; l++) {
      const globalIndex = (r - 1) * locationsPerRoute + l;
      const location: Location = {
        id: `loc-${globalIndex}`,
        name: `Ubicación ${globalIndex}`,
        address: `Calle Ejemplo ${globalIndex}, Madrid, España`,
        routeId: `route-${r}`,
        coordinates: {
          lat: 40.4168 + (Math.random() - 0.5) * 0.1,
          lng: -3.7038 + (Math.random() - 0.5) * 0.1,
        },
      };
      routeLocations.push(location);
      allLocations.push(location);
    }

    routes.push({
      id: `route-${r}`,
      name: `Ruta ${r}`,
      locations: routeLocations,
    });
  }

  return { routes, allLocations };
}

const { routes, allLocations } = generateLocations();

export const ROUTES = routes;
export const ALL_LOCATIONS = allLocations;
