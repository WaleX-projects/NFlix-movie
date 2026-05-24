import { Bell, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavbarProps {
  search: string;
  onSearchChange: (v: string) => void;
}

const NAV = ["Home", "TV Shows", "Movies", "New & Popular", "My List"];

const Navbar = ({ search, onSearchChange }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-smooth",
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-card"
          : "bg-gradient-to-b from-background/90 to-transparent"
      )}
    >
      <nav className="flex items-center gap-8 px-4 md:px-12 h-16">
        <Link to="/" className="flex items-center gap-1 select-none">
          <span className="text-primary font-black tracking-tighter text-2xl md:text-3xl">
            NFLIX
          </span>
        </Link>
        <ul className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          {NAV.map((item, i) => (
            <li key={item}>
              <a
                href="#"
                className={cn(
                  "hover:text-foreground transition-colors",
                  i === 0 && "text-foreground font-medium"
                )}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center">
            {searchOpen ? (
              <div className="flex items-center bg-background/80 border border-border rounded-md px-2 animate-fade-in">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Titles, people, genres"
                  className="bg-transparent px-2 py-1.5 text-sm outline-none w-44 md:w-64 placeholder:text-muted-foreground"
                />
                <button
                  onClick={() => {
                    onSearchChange("");
                    setSearchOpen(false);
                  }}
                  aria-label="Close search"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="text-foreground/90 hover:text-primary transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
            )}
          </div>
          <Bell className="h-5 w-5 text-foreground/90 hidden md:block" />
          {user ? (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded bg-primary/20 grid place-items-center text-sm font-semibold text-primary">
                {(user.name ?? user.email)[0].toUpperCase()}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-muted-foreground hover:text-foreground"
              >
                Sign out
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="default" size="sm">
                Sign in
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
