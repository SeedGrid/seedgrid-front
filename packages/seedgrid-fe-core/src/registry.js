export class SeedGridRegistry {
    providers = [];
    navItems = [];
    routes = [];
    addProvider(provider) {
        this.providers.push(provider);
    }
    addNavItem(item) {
        this.navItems.push(item);
    }
    addRoute(route) {
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
