/**
 * Chrome-less layout for focused flows (assessment wizard, report).
 * Each flow renders its own minimal header.
 */
export default function FlowLayout({ children }: { children: React.ReactNode }) {
  return <main className="flex min-h-screen flex-1 flex-col">{children}</main>;
}
