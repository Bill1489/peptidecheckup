/**
 * Chrome-less layout for paid-traffic landing pages (`/checkup/…`). No site
 * nav, no footer link maze, no cart: the page renders its own slim header and
 * legal footer so the only way forward is the Checkup.
 */
export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return <main className="flex min-h-screen flex-1 flex-col">{children}</main>;
}
