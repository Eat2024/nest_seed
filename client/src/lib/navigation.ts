/**
 * @name 路由完全匹配
 * @description 僅當 pathname 與 href 完全相同時回傳 true
 * @example
 * href: "/about"
 * pathname: "/about"     => true
 * pathname: "/about/me"  => false
 */
export const isExactRouteActive = (pathname: string, href?: string) => {
  if (!href) return false;

  return pathname === href;
};

/**
 * @name 路由前綴匹配
 * @description pathname 為 href 或其子路由時回傳 true
 * @example
 * href: "/about"
 * pathname: "/about"     => true
 * pathname: "/about/me"  => true
 * pathname: "/about-us"  => false
 */
export const isRouteActive = (pathname: string, href?: string) => {
  if (!href) return false;

  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
};
