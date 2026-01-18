import Link from "next/link";
import { Button } from "../ui/button";
import { SearchField } from "@/features/event/components";
import { LanguageSelector } from "../common";
import { CalendarPlus, Compass } from "lucide-react";

const Header = () => {
	return (
		<header className="border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full shadow-sm">
			<div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-4 flex items-center justify-between gap-4">
				<div className="flex items-center gap-4">
					{/* Logo */}
					<Link href="/" className="flex items-center shrink-0">
						<span className="font-bold text-xl hidden sm:inline-block">
							Ngevent
						</span>
					</Link>

					{/* Search Field */}
					<div className="flex-1 max-w-xs hidden md:block">
						<SearchField />
					</div>
				</div>

				{/* Auth Buttons */}
				<div className="flex items-center gap-6 shrink-0">
					{/* Navigation */}
					<nav className="hidden lg:flex items-center gap-6">
						<Link
							href="/events"
							className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
						>
							<Compass className="w-4 h-4" />
							<span>Explore Events</span>
						</Link>
						<Link
							href="/create"
							className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
						>
							<CalendarPlus className="w-4 h-4" />
							<span>Create Event</span>
						</Link>
					</nav>
					<LanguageSelector />
					<div className="space-x-2">
						<Link href="/signin">
							<Button variant="outline" size="sm">
								Sign In
							</Button>
						</Link>
						<Link href="/signup">
							<Button size="sm">Sign Up</Button>
						</Link>
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
