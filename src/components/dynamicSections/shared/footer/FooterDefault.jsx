"use client";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Globe,
  Lock,
} from "lucide-react";
import { footerLinks } from "@/utils/contstants";
import useStoreId from "@/hooks/useStoreId";
import { useQuery } from "@tanstack/react-query";
import { getDefaultCountry } from "@/utils/currencyHelpers";
import { useMemo } from "react";
import useCountry from "@/hooks/useCountry";
import FooterCountrySwitcher from "./FooterCountrySwitcher";
import useGetQuery from "@/hooks/api/useGetQuery";
import Image from "next/image";

const logos = [
  { src: "/images/logo/visa.png", alt: "Visa", width: 50, height: 16 },
  { src: "/images/logo/ma.svg", alt: "Mastercard", width: 32, height: 20 },
  {
    src: "/images/logo/axp.svg",
    alt: "American Express",
    width: 32,
    height: 20,
  },
  { src: "/images/logo/discover.svg", alt: "Discover", width: 40, height: 16 },
  { src: "/images/logo/ap.png", alt: "Apple Pay", width: 40, height: 16 },
  { src: "/images/logo/gp.png", alt: "Google Pay", width: 44, height: 16 },
];

const fetchStorePreference = async (storeId) => {
  const response = await fetch(
    `https://ecomback.bfinit.com/store/preference/?storeId=${storeId}`,
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export default function FooterDefault({ content }) {
  const { storeId } = useStoreId();
  const { selectedCountry, saveCountry } = useCountry();

  const { data } = useQuery({
    queryFn: () => fetchStorePreference(storeId),
    queryKey: ["storePreference", storeId],
    enabled: !!storeId,
  });

  const { data: stripeConfig, isLoading: isStripeConfigLoading } = useGetQuery({
    endpoint: `/payments/stripe/public/client/${storeId}`,
    queryKey: ["stripe-client-config", storeId],
  });

  const isStripeConnected =
    !isStripeConfigLoading &&
    stripeConfig?.data?.charges_enabled &&
    stripeConfig?.data?.payouts_enabled;

  const countries = useMemo(() => data?.countries || [], [data?.countries]);
  const defaultCountry = getDefaultCountry(data);

  const fullAddress = `${data?.storeAddress}, ${data?.country ? data?.country : defaultCountry?.country_name}`;

  const {
    description,
    showContactInfo,
    contact,
    copyright,
    showSocialLinks,
    socialLinks,
  } = content;

  const { company, shop, support } = footerLinks;

  const activeSocialLinks = Object.entries(socialLinks)?.filter(
    ([_, url]) => url && url.trim() !== "",
  );

  const handleCountryChange = (country) => {
    saveCountry(country);
  };

  return (
    <footer className="bg-card border-border border-t">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <h3 className="mb-3 text-lg font-semibold">{data?.storeName}</h3>
            <p className="text-muted-foreground mb-6 max-w-md text-sm leading-relaxed">
              {description}
            </p>

            {/* Contact Info */}
            {showContactInfo && (
              <div className="space-y-3 text-sm">
                <Link
                  href={`mailto:${data?.storeEmail}`}
                  className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  <span>{data?.storeEmail}</span>
                </Link>

                <Link
                  href={`tel:${data?.storePhone}`}
                  className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>{data?.storePhone}</span>
                </Link>

                <div className="text-muted-foreground flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <span className="leading-relaxed">{fullAddress}</span>
                </div>
              </div>
            )}
          </div>

          {/* Company Links */}
          {company && company?.length > 0 && (
            <div>
              <h4 className="mb-4 text-sm font-semibold tracking-wider uppercase">
                Company
              </h4>
              <ul className="space-y-3">
                {company.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.url}
                      className="text-muted-foreground hover:text-foreground inline-block text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Support Links */}
          {support && support.length > 0 && (
            <div>
              <h4 className="mb-4 text-sm font-semibold tracking-wider uppercase">
                Support
              </h4>
              <ul className="space-y-3">
                {support.slice(0, 3).map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.url}
                      className="text-muted-foreground hover:text-foreground inline-block text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {support && support.length > 0 && (
            <div>
              <h4 className="mb-4 text-sm font-semibold tracking-wider text-transparent uppercase">
                Support
              </h4>
              <ul className="space-y-3">
                {support.slice(3, 6).map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.url}
                      className="text-muted-foreground hover:text-foreground inline-block text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-border border-t"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col items-center justify-between gap-4 pt-8 md:flex-row">
          {/* Left: Copyright + Country Switcher */}
          <div className="flex flex-col items-center gap-3 md:flex-row md:items-center md:gap-6">
            <p className="text-muted-foreground text-center text-sm md:text-left">
              © 2026 {data?.storeName}. All rights reserved.
            </p>

            {countries?.length > 0 && (
              <FooterCountrySwitcher
                handleCountryChange={handleCountryChange}
                data={data}
              />
            )}
          </div>

          {/* Right: Payment Icons + Social Links */}
          <div className="flex flex-col items-center gap-4 md:flex-row md:items-center md:gap-6">
            {/* Payment Icons — only shown when Stripe is connected */}
            {isStripeConnected && (
              <div className="flex flex-col items-end gap-1.5">
                <div className="flex items-center gap-1.5">
                  {logos.map(({ src, alt, width, height }) => (
                    <div
                      key={alt}
                      className="border-border/60 flex h-6 items-center overflow-hidden rounded border bg-white px-1.5"
                    >
                      <Image
                        src={src}
                        alt={alt}
                        width={width}
                        height={height}
                        className="h-4 w-auto object-contain"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-muted-foreground flex items-center gap-1 text-[10px]">
                  <Lock className="h-2.5 w-2.5" /> Secured by Stripe
                </p>
              </div>
            )}

            {/* Social Links */}
            {showSocialLinks && activeSocialLinks?.length > 0 && (
              <div className="flex items-center gap-4">
                {socialLinks?.facebook && (
                  <Link
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-5 w-5" />
                  </Link>
                )}
                {socialLinks?.twitter && (
                  <Link
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-5 w-5" />
                  </Link>
                )}
                {socialLinks?.instagram && (
                  <Link
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </Link>
                )}
                {socialLinks?.youtube && (
                  <Link
                    href={socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="YouTube"
                  >
                    <Youtube className="h-5 w-5" />
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
