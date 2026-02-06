export type SeedGridThemeConfig = {
  brand: {
    name: string;
    logoUrl?: string;
  };
  colors: {
    primary: string;
    accent: string;
    background: string;
    foreground: string;
  };
  layout: {
    sidebarWidth: number;
    radius: number;
  };
};

export const defaultTheme: SeedGridThemeConfig = {
  brand: { name: "SeedGrid" },
  colors: {
    primary: "142 76% 36%",
    accent: "152 57% 40%",
    background: "0 0% 100%",
    foreground: "222.2 84% 4.9%"
  },
  layout: {
    sidebarWidth: 260,
    radius: 12
  }
};
