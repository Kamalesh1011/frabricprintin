import ConditionGrid from "@/components/ui/conditiongrid";

export default function ConditionGridDemo() {
  return (
    <div className="w-full max-w-6xl mx-auto py-12">
      <div className="mb-8 px-5">
        <span className="text-xs font-bold uppercase tracking-wider text-[#AC7900] dark:text-[#D4AF37]">
          Featured Showcase
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold font-editorial mt-1">
          Recent Print & Apparel Drops
        </h2>
      </div>
      <ConditionGrid />
    </div>
  );
}
