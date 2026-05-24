import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight } from "lucide-react";
import Hero from "../../public/Hero.png";

const Landing = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  useEffect(() => {
    document.title = "NFLIX – Unlimited movies, TV shows, and more";
    const desc =
      "Watch anywhere. Cancel anytime. Sign up to start streaming thousands of movies and shows on NFLIX.";
    let m = document.querySelector('meta[name="description"]');
    if (!m) {
      m = document.createElement("meta");
      m.setAttribute("name", "description");
      document.head.appendChild(m);
    }
    m.setAttribute("content", desc);
  }, []);

  const onGetStarted = (e: FormEvent) => {
    e.preventDefault();
    navigate(`/login${email ? `?email=${encodeURIComponent(email)}` : ""}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative min-h-[100svh] overflow-hidden">
        <img
          src={Hero}
          alt="Collage of popular movies and shows on NFLIX"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
        <div className="absolute inset-0 bg-background/40" />

        <header className="relative z-10 flex items-center justify-between px-4 md:px-12 py-5">
          <Link
            to="/"
            className="text-primary font-black text-3xl md:text-4xl tracking-tighter"
            aria-label="NFLIX home"
          >
            NFLIX
          </Link>
          <Button
            onClick={() => navigate("/login")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5"
          >
            Sign In
          </Button>
        </header>

        <div className="relative z-10 flex flex-col items-center text-center px-4 pt-16 pb-24 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">
            Unlimited movies, TV shows, and more
          </h1>
          <p className="mt-6 text-xl md:text-2xl font-medium">
            Watch anywhere. Cancel anytime.
          </p>
          <p className="mt-6 text-base md:text-lg text-foreground/90">
            Ready to watch? Enter your email to create or restart your membership.
          </p>

          <form
            onSubmit={onGetStarted}
            className="mt-6 w-full flex flex-col sm:flex-row gap-3 max-w-2xl"
          >
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="h-14 text-base bg-background/70 backdrop-blur border-border"
              aria-label="Email address"
            />
            <Button
              type="submit"
              className="h-14 px-8 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Get Started
              <ChevronRight className="ml-1 h-5 w-5" />
            </Button>
          </form>
        </div>
      </section>

      {/* Feature sections */}
      <FeatureBlock
        title="Enjoy on your TV"
        body="Watch on Smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players, and more."
        image="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/tv.png"
      />
      <FeatureBlock
        reverse
        title="Download your shows to watch offline"
        body="Save your favourites easily and always have something to watch."
        image="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/mobile-0819.jpg"
      />
      <FeatureBlock
        title="Watch everywhere"
        body="Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV."
        image="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/device-pile.png"
      />

      <footer className="border-t border-border py-10 px-4 md:px-12 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} NFLIX. Inspired demo project.</p>
      </footer>
    </div>
  );
};

const FeatureBlock = ({
  title,
  body,
  image,
  reverse,
}: {
  title: string;
  body: string;
  image: string;
  reverse?: boolean;
}) => (
  <section className="border-t-8 border-border bg-background py-16 px-4 md:px-12">
    <div
      className={`max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center ${
        reverse ? "md:[&>*:first-child]:order-last" : ""
      }`}
    >
      <div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight">{title}</h2>
        <p className="mt-4 text-lg md:text-2xl text-foreground/90">{body}</p>
      </div>
      <img
        src={image}
        alt={title}
        loading="lazy"
        className="w-full h-auto object-contain"
      />
    </div>
  </section>
);

export default Landing;
