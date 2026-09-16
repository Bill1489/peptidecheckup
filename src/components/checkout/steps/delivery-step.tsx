"use client";

import * as React from "react";
import type { CheckoutAddress } from "@/lib/commerce/checkout-store";
import type { ShippingOption } from "@/lib/commerce/config";
import { COMMERCE } from "@/lib/commerce/config";
import { formatMoney } from "@/lib/commerce/money";
import { RadioRows, SelectField, TextField } from "../fields";
import { NO_POSTCODE_COUNTRIES, SHIP_TO_COUNTRIES, isDomestic } from "../shipping-options";
import type { AddressField, Errors } from "../validation";

export interface PricedShippingOption {
  option: ShippingOption;
  /** Delivery charge for this option given the current cart, discount and destination. */
  price: number;
}

const COUNTRY_OPTIONS = SHIP_TO_COUNTRIES.map((c) => ({ value: c.code, label: c.name }));

export function DeliveryStep({
  address,
  onAddressChange,
  errors,
  showErrors,
  options,
  shippingOptionId,
  onShippingChange,
}: {
  address: CheckoutAddress;
  onAddressChange: (patch: Partial<CheckoutAddress>) => void;
  errors: Errors<AddressField>;
  showErrors: boolean;
  options: PricedShippingOption[];
  shippingOptionId: string;
  onShippingChange: (id: string) => void;
}) {
  const err = (k: AddressField) => (showErrors ? errors[k] : undefined);
  const domestic = isDomestic(address.countryCode);
  const postcodeOptional = NO_POSTCODE_COUNTRIES.includes(address.countryCode);

  return (
    <div className="grid gap-8">
      <div className="grid gap-5">
        <SelectField
          id="delivery-countryCode"
          label="Country"
          autoComplete="country"
          value={address.countryCode}
          onChange={(v) => onAddressChange({ countryCode: v })}
          options={COUNTRY_OPTIONS}
          error={err("countryCode")}
          hint={`We ship to ${SHIP_TO_COUNTRIES.length} countries. Research products are supplied to laboratories and qualified researchers only.`}
        />
        <TextField
          id="delivery-line1"
          label="Address line 1"
          autoComplete="address-line1"
          placeholder="Street address, building"
          value={address.line1}
          onChange={(v) => onAddressChange({ line1: v })}
          error={err("line1")}
        />
        <TextField
          id="delivery-line2"
          label="Address line 2"
          autoComplete="address-line2"
          placeholder="Unit, department, c/o"
          optional
          value={address.line2}
          onChange={(v) => onAddressChange({ line2: v })}
        />
        <div className="grid gap-5 sm:grid-cols-[1fr_11rem]">
          <TextField
            id="delivery-city"
            label="Town or city"
            autoComplete="address-level2"
            value={address.city}
            onChange={(v) => onAddressChange({ city: v })}
            error={err("city")}
          />
          <TextField
            id="delivery-postcode"
            label={domestic ? "Postcode" : "Postal code"}
            autoComplete="postal-code"
            autoCapitalize="characters"
            optional={postcodeOptional}
            placeholder={domestic ? "EC1A 1BB" : undefined}
            value={address.postcode}
            onChange={(v) => onAddressChange({ postcode: v.toUpperCase() })}
            error={err("postcode")}
            className="font-mono uppercase"
          />
        </div>
      </div>

      <div className="grid gap-3">
        <div className="flex items-baseline justify-between gap-4">
          <p className="label-mono text-ink">Delivery method</p>
          <p className="label-mono">{domestic ? "United Kingdom" : "International"}</p>
        </div>
        <RadioRows
          name="delivery-method"
          legend="Delivery method"
          value={shippingOptionId}
          onChange={onShippingChange}
          options={options.map(({ option, price }) => ({
            value: option.id,
            label: option.label,
            description: option.eta,
            meta: price === 0 ? <span className="text-brand-600">Free</span> : formatMoney(price),
          }))}
        />
        <p className="text-[12.5px] leading-relaxed text-muted">
          {domestic
            ? `Orders placed before 2 pm on a working day are dispatched the same day. Standard tracked delivery is free on orders of ${formatMoney(COMMERCE.freeShippingThreshold, { trimZeros: true })} or more.`
            : "Dispatched within one working day. Duties and local taxes may be charged on arrival and are the recipient’s responsibility."}
        </p>
      </div>
    </div>
  );
}
