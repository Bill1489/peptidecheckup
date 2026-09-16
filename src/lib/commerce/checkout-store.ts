"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { BRAND } from "@/lib/brand";

/**
 * Persisted checkout form state (localStorage) so a refresh does not lose
 * progress. Card details are deliberately NOT part of this store — they live
 * in component state and are discarded when the page is left.
 */

export type CheckoutStep = "contact" | "delivery" | "payment" | "review";

export const CHECKOUT_STEPS: CheckoutStep[] = ["contact", "delivery", "payment", "review"];

export interface CheckoutContact {
  email: string;
  name: string;
  phone: string;
  marketingOptIn: boolean;
}

export interface CheckoutAddress {
  line1: string;
  line2: string;
  city: string;
  postcode: string;
  countryCode: string;
}

export interface CheckoutAcknowledgements {
  age18: boolean;
  researchUse: boolean;
  terms: boolean;
}

export const EMPTY_CONTACT: CheckoutContact = { email: "", name: "", phone: "", marketingOptIn: false };
export const EMPTY_ADDRESS: CheckoutAddress = { line1: "", line2: "", city: "", postcode: "", countryCode: BRAND.homeCountry };
export const EMPTY_ACKNOWLEDGEMENTS: CheckoutAcknowledgements = { age18: false, researchUse: false, terms: false };

export interface CheckoutState {
  contact: CheckoutContact;
  address: CheckoutAddress;
  shippingOptionId: string;
  acknowledgements: CheckoutAcknowledgements;
  step: CheckoutStep;
  hydrated: boolean;

  setContact: (patch: Partial<CheckoutContact>) => void;
  setAddress: (patch: Partial<CheckoutAddress>) => void;
  setShippingOption: (id: string) => void;
  setAcknowledgements: (patch: Partial<CheckoutAcknowledgements>) => void;
  setStep: (step: CheckoutStep) => void;
  /** After an order is placed: clear acknowledgements and position, keep contact/address for the next order. */
  completeOrder: () => void;
  /** Forget everything entered at checkout. */
  reset: () => void;
  setHydrated: (v: boolean) => void;
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set, get) => ({
      contact: { ...EMPTY_CONTACT },
      address: { ...EMPTY_ADDRESS },
      shippingOptionId: "standard",
      acknowledgements: { ...EMPTY_ACKNOWLEDGEMENTS },
      step: "contact",
      hydrated: false,

      setContact: (patch) => set({ contact: { ...get().contact, ...patch } }),
      setAddress: (patch) => set({ address: { ...get().address, ...patch } }),
      setShippingOption: (id) => set({ shippingOptionId: id }),
      setAcknowledgements: (patch) => set({ acknowledgements: { ...get().acknowledgements, ...patch } }),
      setStep: (step) => set({ step }),
      completeOrder: () => set({ acknowledgements: { ...EMPTY_ACKNOWLEDGEMENTS }, step: "contact" }),
      reset: () =>
        set({
          contact: { ...EMPTY_CONTACT },
          address: { ...EMPTY_ADDRESS },
          shippingOptionId: "standard",
          acknowledgements: { ...EMPTY_ACKNOWLEDGEMENTS },
          step: "contact",
        }),
      setHydrated: (v) => set({ hydrated: v }),
    }),
    {
      name: "peptidecheckup.checkout.v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        contact: s.contact,
        address: s.address,
        shippingOptionId: s.shippingOptionId,
        acknowledgements: s.acknowledgements,
        step: s.step,
      }),
      onRehydrateStorage: () => (state) => state?.setHydrated(true),
    },
  ),
);
