
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Bot } from "lucide-react"
import BudgetPlanner from "./BudgetPlanner"


export function BudgetPlannerSheet() {
    return (
        <Sheet>
            <SheetTrigger className="inline-flex items-center gap-2 rounded-md border border-primary  px-4 py-2.5 text-sm font-medium text-primary hover:bg-emerald-50 transition-colors cursor-pointer">
                    <Bot className="h-4 w-4" />
                    Ask AI Budget Planner
               
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
                <SheetHeader>
                    <SheetTitle className="text-emerald-800">AI Budget Planner</SheetTitle>
                    <SheetDescription>
                        Tell us your budget, and we&apos;ll create a meal plan and shopping list for you.
                    </SheetDescription>
                </SheetHeader>
               
                <BudgetPlanner />

            </SheetContent>
        </Sheet>
    )
}