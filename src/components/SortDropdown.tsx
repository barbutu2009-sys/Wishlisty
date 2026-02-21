import { SortOption } from "@/types/wish";
import { ArrowDownUp } from "lucide-react";

interface SortDropdownProps {
    value: SortOption;
    onChange: (sort: SortOption) => void;
}

const sortLabels: Record<SortOption, string> = {
    newest: "Newest First",
    "price-asc": "Price: Low → High",
    "price-desc": "Price: High → Low",
    "priority-desc": "Priority: Highest",
};

const SortDropdown = ({ value, onChange }: SortDropdownProps) => {
    return (
        <div className="flex items-center gap-2">
            <ArrowDownUp className="h-4 w-4 text-muted-foreground" />
            <select
                value={value}
                onChange={(e) => onChange(e.target.value as SortOption)}
                className="rounded-full bg-card border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer appearance-none pr-8"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: "right 0.5rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.25em 1.25em",
                }}
            >
                {(Object.keys(sortLabels) as SortOption[]).map((key) => (
                    <option key={key} value={key}>
                        {sortLabels[key]}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SortDropdown;
