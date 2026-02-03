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
} from "lucide-react";
import { footerLinks } from "@/utils/contstants";
import useStoreId from "@/hooks/useStoreId";
import { useQuery } from "@tanstack/react-query";

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

  const { data } = useQuery({
    queryFn: () => fetchStorePreference(storeId),
    queryKey: ["storePreference", storeId],
    enabled: !!storeId,
  });

  const fullAddress = `${data?.storeAddress} ${data?.country}`;

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
                <a
                  href={`mailto:${data?.storeEmail}`}
                  className="text-muted-foreground hover: flex items-center gap-2 transition-colors"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  <span>{data?.storeEmail}</span>
                </a>

                <a
                  href={`tel:${data?.storePhone}`}
                  className="text-muted-foreground hover: flex items-center gap-2 transition-colors"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>{data?.storePhone}</span>
                </a>

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
                      className="text-muted-foreground hover: inline-block text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Shop Links */}
          {/* {shop && shop.length > 0 && (
            <div>
              <h4 className="mb-4 text-sm font-semibold tracking-wider uppercase">
                Shop
              </h4>
              <ul className="space-y-3">
                {shop.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.url}
                      className="text-muted-foreground hover: inline-block text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )} */}

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
                      className="text-muted-foreground hover: inline-block text-sm transition-colors"
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
                      className="text-muted-foreground hover: inline-block text-sm transition-colors"
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
        <div className="pt-8">
          <div className="mb-6 flex flex-col items-center justify-between gap-4 md:flex-row">
            {/* Copyright */}
            <p className="text-muted-foreground text-center text-sm md:text-left">
              © 2026 {data?.storeName}. All rights reserved.
            </p>

            {/* Social Links */}
            {showSocialLinks && activeSocialLinks?.length > 0 && (
              <div className="flex items-center gap-4">
                {socialLinks?.facebook && (
                  <a
                    href={socialLinks?.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover: transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                )}
                {socialLinks?.twitter && (
                  <a
                    href={socialLinks?.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover: transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
                {socialLinks?.instagram && (
                  <a
                    href={socialLinks?.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover: transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                )}
                {socialLinks?.youtube && (
                  <a
                    href={socialLinks?.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover: transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Youtube className="h-5 w-5" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
