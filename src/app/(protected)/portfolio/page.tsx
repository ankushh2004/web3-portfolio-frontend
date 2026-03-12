"use client";
import { PortfolioSummary } from "@/components/portfolio/PortfolioSummary";
import RiskIndicatorSection from "@/components/portfolio/RiskIndicatorSection";
import TokensSection from "@/components/portfolio/TokensSection";

function Portfolio() {
  return (
    <div className="space-y-7 p-5 lg:p-7">
      <div>
        <h1 className="text-text-primary text-xl sm:text-2xl font-bold tracking-tight md:text-3xl">
          Portfolio
        </h1>
        <p className="text-text-subtle text-xs">
          Overview of your on-chain assets
        </p>
      </div>

      <RiskIndicatorSection />

      <PortfolioSummary />

      <TokensSection />
    </div>
  );
}

export default Portfolio;
