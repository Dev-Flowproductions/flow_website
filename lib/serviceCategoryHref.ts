/** Main landing page per `services.key` (no locale prefix). */
export const SERVICE_CATEGORY_HREF: Record<string, string> = {
  design: '/design',
  marketing: '/marketing',
  audiovisual: '/audiovisual',
  animacao: '/animacao',
  martech: '/martech',
};

export function getServiceCategoryHref(serviceKey: string): string | null {
  return SERVICE_CATEGORY_HREF[serviceKey] ?? null;
}
