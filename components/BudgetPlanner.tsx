"use client";

import { useActionState } from "react";
import {
  OutfitState,
  createOutfitPlan,
} from "../components/lib/actions/ai-budget"; // تأكد من تغيير اسم الأكشن والـ State
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2, Sparkles, Shirt, Calendar, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import AddToCartSection from "./AddToCartSection";

const initialState: OutfitState = {
  message: "",
  success: false,
  error: {},
};

function BudgetPlanner() {
  const [state, action, isPending] = useActionState(
    createOutfitPlan,
    initialState,
  );
  return (
    <div className="space-y-8 w-full max-w-4xl mx-auto">
      <div className="w-full p-4 bg-white rounded-[2rem] shadow-xl shadow-[#104F55]/5 border border-[#104F55]/5">
        <form action={action} className="space-y-6">
          {/* Section: Budget Input */}
          <div className="space-y-3">
            <Label
              htmlFor="budget"
              className="text-[#104F55] font-bold flex items-center gap-2"
            >
              <DollarSign size={18} className="text-[#32746D]" /> Total Budget
              ($)
            </Label>
            <Input
              id="budget"
              name="budget"
              type="number"
              placeholder="e.g. 500"
              required
              min="1"
              className="border-[#9EC5AB]/30 focus-visible:ring-[#104F55] rounded-xl h-12"
            />
            {state.error?.budget && (
              <p className="text-xs text-red-500 font-medium">
                {state.error.budget[0]}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Section: Occasion */}
            <div className="space-y-3">
              <Label
                htmlFor="occasion"
                className="text-[#104F55] font-bold flex items-center gap-2"
              >
                <Calendar size={18} className="text-[#32746D]" /> Occasion
              </Label>
              <Select name="occasion" required>
                <SelectTrigger className="border-[#9EC5AB]/30 focus:ring-[#104F55] rounded-xl h-12">
                  <SelectValue placeholder="Select Occasion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casual">Casual Daily Wear</SelectItem>
                  <SelectItem value="formal">Formal Event / Wedding</SelectItem>
                  <SelectItem value="business">Business / Office</SelectItem>
                  <SelectItem value="sport">Sport / Gym</SelectItem>
                  <SelectItem value="party">Night Party</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Section: Style Preference */}
            <div className="space-y-3">
              <Label
                htmlFor="style"
                className="text-[#104F55] font-bold flex items-center gap-2"
              >
                <Shirt size={18} className="text-[#32746D]" /> Style Preference
              </Label>
              <Select name="style" defaultValue="minimalist">
                <SelectTrigger className="border-[#9EC5AB]/30 focus:ring-[#104F55] rounded-xl h-12">
                  <SelectValue placeholder="Select Style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minimalist">Minimalist</SelectItem>
                  <SelectItem value="vintage">Vintage / Retro</SelectItem>
                  <SelectItem value="streetwear">Streetwear</SelectItem>
                  <SelectItem value="classic">Classic Elegant</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#104F55] hover:bg-[#32746D] text-white font-bold py-6 rounded-2xl transition-all shadow-lg shadow-[#104F55]/20 group"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing Wardrobe...
              </>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles size={20} className="group-hover:animate-pulse" />
                Generate Outfit Plan
              </span>
            )}
          </Button>

          {state.message && !state.success && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-center text-sm text-red-600 font-medium">
              {state.message}
            </div>
          )}

          {/* Result Section */}
          {state.success && state.plan && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <Card className="border-[#9EC5AB]/20 shadow-none bg-[#F8FAFA]">
                <CardHeader className="border-b border-[#9EC5AB]/10">
                  <CardTitle className="text-[#104F55] flex items-center gap-2 text-xl">
                    <Shirt className="text-[#32746D]" />
                    AI Recommended Outfits
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 grid gap-4 md:grid-cols-2 ">
                  {state.plan.outfits.map(
                    (
                      outfit: NonNullable<
                        OutfitState["plan"]
                      >["outfits"][number],
                      idx: number,
                    ) => (
                      <div
                        key={idx}
                        className="mx-auto p-4 bg-white rounded-2xl border border-[#9EC5AB]/20 hover:border-[#32746D] transition-all shadow-sm group"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className="font-black text-[#104F55] group-hover:text-[#32746D] transition-colors">
                            {outfit.name}
                          </span>
                          <span className="text-[10px] font-black uppercase bg-[#9EC5AB]/20 text-[#104F55] px-2 py-1 rounded-md">
                            {outfit.category}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs text-gray-500 leading-relaxed font-medium">
                            <span className="text-[#32746D] font-bold">
                              Pieces:
                            </span>{" "}
                            {outfit.items.join(" + ")}
                          </p>
                          <div className="flex items-center justify-between mt-4">
                            <span className="text-lg font-black text-[#104F55]">
                              ${outfit.estimatedPrice}
                            </span>
                            <span className="text-[11px] text-[#32746D] font-bold italic">
                              Perfect for {outfit.matchScore}%{" "}
                            </span>
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </CardContent>
              </Card>

              <AddToCartSection plan={state.plan} />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default BudgetPlanner;
