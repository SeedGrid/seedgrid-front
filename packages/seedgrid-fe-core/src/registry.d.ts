import type { SeedGridNavItem, SeedGridProvider, SeedGridRoute } from "./module";
export declare class SeedGridRegistry {
    private providers;
    private navItems;
    private routes;
    addProvider(provider: SeedGridProvider): void;
    addNavItem(item: SeedGridNavItem): void;
    addRoute(route: SeedGridRoute): void;
    getProviders(): SeedGridProvider[];
    getNavItems(): SeedGridNavItem[];
    getRoutes(): SeedGridRoute[];
}
//# sourceMappingURL=registry.d.ts.map