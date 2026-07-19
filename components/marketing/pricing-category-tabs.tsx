"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PricingCategory } from "@/components/marketing/pricing-category";
import {
  PACKAGE_TIERS,
  FLAT_PACKAGE_CATEGORIES,
  FLAT_PACKAGE_TIERS,
} from "@/lib/pricing";

const HIGH_SCHOOL = "high-school";

export function PricingCategoryTabs() {
  const [category, setCategory] = useState<string>(HIGH_SCHOOL);

  const flatCategory = FLAT_PACKAGE_CATEGORIES.find((c) => c.tierId === category);

  return (
    <div className="flex flex-col items-center gap-10">
      <Tabs value={category} onValueChange={(v) => setCategory(String(v))}>
        <TabsList>
          <TabsTrigger value={HIGH_SCHOOL}>High School</TabsTrigger>
          {FLAT_PACKAGE_CATEGORIES.map((cat) => (
            <TabsTrigger key={cat.tierId} value={cat.tierId}>
              {cat.sectionName}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="w-full">
        {category === HIGH_SCHOOL && (
          <PricingCategory tiers={PACKAGE_TIERS} showGradYear bestValueId="freshman" />
        )}
        {flatCategory && (
          <PricingCategory
            tiers={FLAT_PACKAGE_TIERS.filter((t) => t.id === flatCategory.tierId)}
            showGradYear={false}
          />
        )}
      </div>
    </div>
  );
}
