import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { CartDrawer } from "@/components/commerce/cart-drawer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </>
  );
}
