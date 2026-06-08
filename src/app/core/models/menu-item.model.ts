export interface MenuItem {
  id: string;
  label: string;
  labelKey: string;
  url: string;
  imageUrl?: string;
  order: number;
  isActive?: boolean;
}

export interface MenuConfig {
  items: MenuItem[];
  footer: {
    logoUrl: string;
    copyright: string;
    location: string;
    socialLinks: SocialLink[];
  };
}

export interface SocialLink {
  platform: string;
  url: string;
  label: string;
  labelKey: string;
}