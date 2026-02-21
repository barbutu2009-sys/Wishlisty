import { useState } from "react";
import { Heart, Plus, Lock, Unlock } from "lucide-react";

const SECRET_PIN = "9731"; // Change this to your own secret PIN

interface WishlistHeaderProps {
  name: string;
  itemCount: number;
  onAddClick: () => void;
  isBoyfriendMode: boolean;
  onToggleMode: () => void;
}

const WishlistHeader = ({ name, itemCount, onAddClick, isBoyfriendMode, onToggleMode }: WishlistHeaderProps) => {
  const [showPinInput, setShowPinInput] = useState(false);
  const [pin, setPin] = useState("");
  const [shake, setShake] = useState(false);

  const handleLockClick = () => {
    if (isBoyfriendMode) {
      // Already unlocked — just lock it back, no PIN needed
      onToggleMode();
      return;
    }
    // Show PIN input
    setShowPinInput(true);
    setPin("");
  };

  const handlePinSubmit = () => {
    if (pin === SECRET_PIN) {
      setShowPinInput(false);
      setPin("");
      onToggleMode();
    } else {
      setShake(true);
      setPin("");
      setTimeout(() => setShake(false), 500);
    }
  };

  const handlePinKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handlePinSubmit();
    if (e.key === "Escape") {
      setShowPinInput(false);
      setPin("");
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <Heart className="h-5 w-5 text-primary animate-float" fill="hsl(var(--primary))" />
          <div>
            <h1 className="text-xl sm:text-2xl tracking-tight text-foreground">{name}'s Wishlist</h1>
            <p className="text-xs text-muted-foreground font-body">
              {itemCount} {itemCount === 1 ? "wish" : "wishes"} ✨
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Secret boyfriend mode toggle */}
          <div className="relative">
            <button
              onClick={handleLockClick}
              className="rounded-full p-2.5 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
              title={isBoyfriendMode ? "Lock" : "Unlock"}
            >
              {isBoyfriendMode ? (
                <Unlock className="h-4 w-4" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
            </button>

            {/* PIN popup */}
            {showPinInput && (
              <div className="absolute right-0 top-full mt-2 z-50">
                <div
                  className="fixed inset-0"
                  onClick={() => { setShowPinInput(false); setPin(""); }}
                />
                <div
                  className={`relative flex items-center gap-2 rounded-xl bg-card border shadow-modal p-3 ${shake ? "animate-shake" : ""}`}
                >
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                    onKeyDown={handlePinKeyDown}
                    autoFocus
                    className="w-16 rounded-lg border bg-background px-2 py-1.5 text-center text-sm font-mono tracking-widest outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <button
                    onClick={handlePinSubmit}
                    className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Go
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onAddClick}
            className="flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-card transition-all duration-200 hover:shadow-card-hover hover:scale-105 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add New Wish</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default WishlistHeader;
