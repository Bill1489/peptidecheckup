"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { StickyCta } from "@/components/marketing/sticky-cta";
import { Button, type ButtonProps } from "@/components/ui/button";

/**
 * Query parameters an ad platform appends to the landing URL that must
 * survive the hop into the assessment, where the intro records them on the
 * entry context (utm_* → `EntryContext.utm`). Click IDs ride along so a
 * conversion fired from the result page can still be attributed.
 */
const FORWARDED = /^(utm_[a-z_]+|gclid|gbraid|wbraid|fbclid|ttclid|msclkid|twclid|li_fat_id)$/i;

/** `href` with the forwardable parameters of the current URL merged in; existing parameters on `href` win. */
export function forwardParams(href: string, params: URLSearchParams | null | undefined): string {
  if (!params) return href;
  const [withoutHash, hash] = href.split("#");
  const [path, query = ""] = withoutHash.split("?");
  const out = new URLSearchParams(query);
  params.forEach((value, key) => {
    if (value && FORWARDED.test(key) && !out.has(key)) out.set(key, value);
  });
  const qs = out.toString();
  return `${path}${qs ? `?${qs}` : ""}${hash ? `#${hash}` : ""}`;
}

function useForwardedHref(href: string): string {
  const params = useSearchParams();
  return React.useMemo(() => forwardParams(href, params), [href, params]);
}

type CtaProps = Omit<ButtonProps, "href"> & { href: string };

function CtaWithParams({ href, ...rest }: CtaProps) {
  const forwarded = useForwardedHref(href);
  return <Button href={forwarded} {...rest} />;
}

/**
 * A `Button` link that carries the ad platform's tracking parameters into the
 * assessment. `useSearchParams` sits behind Suspense so the page still
 * prerenders statically; the fallback is the plain link.
 */
export function LandingCta(props: CtaProps) {
  return (
    <React.Suspense fallback={<Button {...props} />}>
      <CtaWithParams {...props} />
    </React.Suspense>
  );
}

type StickyProps = React.ComponentProps<typeof StickyCta>;

function StickyWithParams(props: StickyProps) {
  const forwarded = useForwardedHref(props.href);
  return <StickyCta {...props} href={forwarded} />;
}

/** The mobile sticky bar with the same parameter forwarding. */
export function LandingStickyCta(props: StickyProps) {
  return (
    <React.Suspense fallback={<StickyCta {...props} />}>
      <StickyWithParams {...props} />
    </React.Suspense>
  );
}
