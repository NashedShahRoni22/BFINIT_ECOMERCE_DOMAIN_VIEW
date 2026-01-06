"use client";
import { useState } from "react";
import { Send, CheckCircle2, RefreshCw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    captcha: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(generateCaptcha());

  function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    return { num1, num2, answer: num1 + num2 };
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const refreshCaptcha = () => {
    setCaptchaValue(generateCaptcha());
    setFormData({ ...formData, captcha: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (parseInt(formData.captcha) !== captchaValue.answer) {
      alert("Incorrect captcha. Please try again.");
      refreshCaptcha();
      return;
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        captcha: "",
      });
      setCaptchaValue(generateCaptcha());
    }, 3000);
  };

  return (
    <div className="lg:col-span-3">
      <div className="border-border bg-card rounded-lg border p-6 shadow-sm sm:p-8">
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-success/10 mb-4 flex h-14 w-14 items-center justify-center rounded-full">
              <CheckCircle2 className="text-success h-7 w-7" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Message Sent!</h3>
            <p className="text-muted-foreground text-sm">
              Thank you for contacting us. We&apos;ll get back to you soon.
            </p>
          </div>
        ) : (
          <div onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Full Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Email Address <span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="subject"
                className="mb-1.5 block text-sm font-medium"
              >
                Subject <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none"
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-1.5 block text-sm font-medium"
              >
                Message <span className="text-destructive">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring w-full resize-none rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none"
                placeholder="Tell us more about your inquiry..."
              />
            </div>

            {/* Captcha */}
            <div>
              <label
                htmlFor="captcha"
                className="mb-1.5 block text-sm font-medium"
              >
                Enter Captcha <span className="text-destructive">*</span>
              </label>
              <div className="flex items-center gap-2">
                <div className="bg-primary flex h-10 min-w-[80px] items-center justify-center rounded-md px-4 select-none">
                  <span className="text-primary-foreground text-base font-bold">
                    {captchaValue.num1} + {captchaValue.num2}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={refreshCaptcha}
                  className="border-input bg-background hover:bg-accent flex h-10 w-10 items-center justify-center rounded-md border transition-colors"
                  title="Refresh Captcha"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
                <input
                  type="text"
                  id="captcha"
                  name="captcha"
                  value={formData.captcha}
                  onChange={handleChange}
                  required
                  className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring h-10 w-20 rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none"
                  placeholder="Answer"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="submit"
                onClick={handleSubmit}
                className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex h-10 items-center justify-center rounded-md px-6 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none"
              >
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </button>

              {/* BITSS Branding - Inline on desktop */}
              <Link
                href="https://bitss.one"
                target="_blank"
                className="hidden items-center gap-2 sm:flex"
              >
                <div className="flex size-8 items-center justify-center rounded">
                  <Image
                    src="/images/logo/bitss.png"
                    alt="store"
                    width={32}
                    height={32}
                  />
                </div>
                <div>
                  <p className="text-xs leading-none font-semibold">BITSS</p>
                  <p className="text-muted-foreground mt-0.5 text-xs leading-none">
                    Cyber security
                  </p>
                </div>
              </Link>
            </div>

            {/* BITSS Branding - Below button on mobile */}
            <div className="border-border flex items-center justify-center gap-2 border-t pt-4 sm:hidden">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-gradient-to-br from-blue-600 to-red-600">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 text-white"
                  fill="currentColor"
                >
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                </svg>
              </div>
              <div>
                <p className="text-xs leading-none font-semibold">BITSS</p>
                <p className="text-muted-foreground mt-0.5 text-xs leading-none">
                  Powered by BITSS cyber security
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Google Map - Mobile only */}
      <div className="border-border mt-8 overflow-hidden rounded-lg border lg:hidden">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369368400567!3d40.71277537933029!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a23e28c1191%3A0x49f75d3281df052a!2s150%20Park%20Row%2C%20New%20York%2C%20NY%2010007!5e0!3m2!1sen!2sus!4v1234567890123"
          width="100%"
          height="280"
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
