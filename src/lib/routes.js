/**
 * Central route definitions for auth guards and navigation.
 * Keep public-route logic in one place to avoid drift across LayoutShell / NavBar.
 */

export function isLandingRoute(pathname) {
  return pathname === "/" || pathname?.startsWith("/landing");
}

export function isAuthEntryRoute(pathname) {
  return pathname?.startsWith("/auth") || pathname?.startsWith("/signup");
}

export function isSetupRoute(pathname) {
  return (
    pathname?.startsWith("/onboarding") ||
    pathname?.startsWith("/profile-setup")
  );
}

export function isPublicRoute(pathname) {
  return (
    isLandingRoute(pathname) ||
    isAuthEntryRoute(pathname) ||
    isSetupRoute(pathname)
  );
}

export function getPostAuthRoute(profile) {
  if (!profile?.profileCompleted) {
    return "/profile-setup";
  }
  return "/home";
}
