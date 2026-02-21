import { Sparkles } from "lucide-react";

interface SurpriseMeButtonProps {
    onClick: () => void;
    disabled: boolean;
}

const SurpriseMeButton = ({ onClick, disabled }: SurpriseMeButtonProps) => {
    if (disabled) return null;

    return (
        <button
            onClick={onClick}
            className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-modal transition-all duration-300 hover:scale-110 hover:shadow-lg active:scale-95 animate-fade-in"
            aria-label="Surprise Me"
        >
            <Sparkles className="h-5 w-5" />
            <span className="hidden sm:inline">Surprise Me!</span>
        </button>
    );
};

export default SurpriseMeButton;
