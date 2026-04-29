"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {BudgetPlannerSheet} from "@/components/BudgetPlannerSheet";
import aiBudget from "../../public/robot.png";

const PRIMARY = "oklch(0.52 0.105 223.128)";

export default function Hero() {
  return (
    <section
      className="relative w-full flex items-stretch overflow-hidden"
      style={{ background: "#EEF2F7", minHeight: "420px" }}
    >
      {/* ── LEFT: text content ── */}
      <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-20 lg:py-20 flex-1 z-10">

        {/* Headline */}
        <h1
          className="font-black leading-[1.05] tracking-tight text-accent mb-3 "
          style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
        >
          ELEVATE YOUR STYLE WITH
         
          <span style={{ color: PRIMARY }}> AI-POWERED </span> CURATION
        </h1>

        {/* Description */}
        <p
          className="text-gray-500 leading-relaxed mb-8"
          style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", maxWidth: "360px" }}
        >
          Drop your budget &amp; choose your occasion —<br />
          we&apos;ll build the perfect outfit for you.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Button
            
            className="h-11 px-6 rounded-md text-white font-semibold text-sm
                       hover:opacity-90 transition-opacity"
           
          >
            <Link href="/shop" className="flex items-center gap-2">
              Explore Collection
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>

          <div
            className="h-11 flex items-center rounded-md 
                       px-5 text-sm font-medium text-gray-700
                        transition-colors cursor-pointer"
           
          >
            <BudgetPlannerSheet />
          </div>
        </div>
      </div>

      {/* ── RIGHT: image flush to edge, full section height ── */}
      <div className="relative hidden md:block shrink-0"
        style={{ width: "clamp(300px, 42%, 580px)" }}>
        <Image
          src={aiBudget}
          alt="AI Fashion Model"
          fill
          className="object-cover object-top"
          priority
        />
      </div>
    </section>
  );
}
