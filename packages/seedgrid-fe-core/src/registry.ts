import type { SeedGridNavItem, SeedGridProvider, SeedGridRoute } from "./module";

export class SeedGridRegistry {
  private providers: SeedGridProvider[] = [];
  private navItems: SeedGridNavItem[] = [];
  private routes: SeedGridRoute[] = [];

  addProvider(provider: SeedGridProvider) {
    this.providers.push(provider);
  }

  addNavItem(item: SeedGridNavItem) {
    this.navItems.push(item);
  }

  addRoute(route: SeedGridRoute) {
    this.routes.push(route);
  }

  getProviders() {
    return [...this.providers];
  }

  getNavItems() {
    return [...this.navItems].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  }

  getRoutes() {
    return [...this.routes];
  }
}
