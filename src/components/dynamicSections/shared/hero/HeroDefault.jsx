import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function HeroDefault({ content }) {
  const { backgroundImage, cta, subTitle, title } = content || {};

  return (
    <div className="relative h-[500px] w-full overflow-hidden md:h-[600px]">
      {/* background image*/}
      <div className="bg-muted absolute inset-0">
        <Image
          src={`https://ecomback.bfinit.com${backgroundImage}`}
          alt="Hero background"
          fill
          className="object-cover"
        />
        {/* overlay */}
        <div className="bg-foreground/40 absolute inset-0"></div>
      </div>

      {/* content */}
      <div className="relative z-10 mx-auto h-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-full max-w-2xl flex-col justify-center">
          <h1 className="text-primary-foreground mb-4 text-4xl leading-tight font-semibold md:mb-6 md:text-5xl lg:text-6xl">
            {title}
          </h1>

          <p className="text-primary-foreground mb-8 text-lg leading-relaxed font-light md:mb-10 md:text-xl">
            {subTitle}
          </p>

          <Button
            asChild
            className="border-primary-foreground group hover:text-primary hover:bg-primary-foreground w-fit rounded-md border bg-transparent px-8 py-4 font-medium"
          >
            <Link href="/shop">
              {cta}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
