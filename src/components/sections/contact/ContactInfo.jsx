import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactInfo({ data = {} }) {
  const { storePhone, storeTelephone, storeEmail, storeAddress, country } =
    data;

  const fullAddress = storeAddress + country;
  const encodedAddress = encodeURIComponent(fullAddress);
  const mapUrl = `https://www.google.com/maps?q=${encodedAddress}`;

  return (
    <div className="lg:col-span-2">
      <h2 className="mb-2 text-xl font-semibold">Contact Information</h2>
      <p className="text-muted-foreground mb-8 text-sm">
        Have a question? Fill out the form and we'll get back to you.
      </p>

      <address className="space-y-5 not-italic">
        {/* phone */}
        <div className="flex items-start gap-3">
          <div className="bg-muted flex h-9 w-9 shrink-0 items-center justify-center rounded-md">
            <Phone className="h-4 w-4" />
          </div>
          <div className="flex flex-col gap-y-1">
            <h3 className="text-sm font-medium">Phone</h3>
            <a
              href={`tel:${storePhone}`}
              className="text-muted-foreground hover:text-foreground text-sm leading-6"
            >
              {storePhone}
            </a>
            {storeTelephone && (
              <a
                href={`tel:${storeTelephone}`}
                className="text-muted-foreground hover:text-foreground text-sm leading-6"
              >
                {storeTelephone}
              </a>
            )}
          </div>
        </div>

        {/* email */}
        <div className="flex items-start gap-3">
          <div className="bg-muted flex h-9 w-9 shrink-0 items-center justify-center rounded-md">
            <Mail className="h-4 w-4" />
          </div>
          <div>
            <h3 className="mb-0.5 text-sm font-medium">Email</h3>
            <a
              href={`mailto:${storeEmail}`}
              className="text-muted-foreground hover:text-foreground text-sm leading-6"
            >
              {storeEmail}
            </a>
          </div>
        </div>

        {/* address */}
        <div className="flex items-start gap-3">
          <div className="bg-muted flex h-9 w-9 shrink-0 items-center justify-center rounded-md">
            <MapPin className="h-4 w-4" />
          </div>
          <div>
            <h3 className="mb-0.5 text-sm font-medium">Office</h3>
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground block max-w-xs text-sm leading-6"
            >
              {fullAddress}
            </a>
          </div>
        </div>
      </address>

      {/* map */}
      <div className="border-border mt-8 hidden overflow-hidden rounded-lg border lg:block">
        <iframe
          src={`${mapUrl}&output=embed`}
          width="100%"
          height="240"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Office Location"
        />
      </div>
    </div>
  );
}
