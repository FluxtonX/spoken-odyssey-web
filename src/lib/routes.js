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
  return pathname?.startsWith("/onboarding");
}

export function isInviteRoute(pathname) {
  return (
    pathname?.startsWith("/invite") ||
    pathname?.startsWith("/family/join")
  );
}

export function isPublicRoute(pathname) {
  return (
    isLandingRoute(pathname) ||
    isAuthEntryRoute(pathname) ||
    isSetupRoute(pathname) ||
    isInviteRoute(pathname) ||
    pathname?.startsWith("/how") ||
    pathname?.startsWith("/explore") ||
    pathname?.startsWith("/for-families") ||
    pathname?.startsWith("/pricing")
  );
}

export function getPostAuthRoute(profile) {
  if (!profile?.onboardingCompleted) {
    return "/onboarding";
  }
  return "/home";
}
