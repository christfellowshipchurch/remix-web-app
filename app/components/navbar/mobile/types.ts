export interface MenuItem {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof import("~/lib/icons").icons;
  to: string;
}

export interface SubMenuItem {
  id: string;
  title: string;
  description?: string;
  icon?: keyof typeof import("~/lib/icons").icons;
  to: string;
}
