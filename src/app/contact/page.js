"use client";

import { useQuery } from "@tanstack/react-query";
import Hero from "@/components/sections/contact/Hero";
import ContactInfo from "@/components/sections/contact/ContactInfo";
import ContactForm from "@/components/sections/contact/ContactForm";
import { staticStoreId } from "@/utils/storeId";

const fetchStorePreference = async () => {
  const response = await fetch(
    `https://ecomback.bfinit.com/store/preference/?storeId=${staticStoreId}`,
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export default function Contact() {
  const { data } = useQuery({
    queryFn: fetchStorePreference,
    queryKey: ["storePreference", staticStoreId],
    enabled: !!staticStoreId,
  });

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <Hero />

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-12">
          {/* Contact Information Sidebar */}
          <ContactInfo data={data} />

          {/* Contact Form */}
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
