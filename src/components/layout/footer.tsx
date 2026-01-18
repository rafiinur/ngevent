import Link from "next/link";

const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="border-t border-border bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/30">
			<div className="container max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
					{/* About */}
					<div className="space-y-4">
						<h3 className="font-semibold text-foreground">Ngevent</h3>
						<p className="text-sm text-muted-foreground">
							Discover and manage events in your area with ease.
						</p>
					</div>

					{/* Product */}
					<div className="space-y-4">
						<h4 className="font-semibold text-foreground">Product</h4>
						<ul className="space-y-2 text-sm">
							<li>
								<Link
									href="/events"
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									Events
								</Link>
							</li>
							<li>
								<Link
									href="/categories"
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									Categories
								</Link>
							</li>
						</ul>
					</div>

					{/* Company */}
					<div className="space-y-4">
						<h4 className="font-semibold text-foreground">Company</h4>
						<ul className="space-y-2 text-sm">
							<li>
								<Link
									href="/about"
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									About
								</Link>
							</li>
							<li>
								<Link
									href="/contact"
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									Contact
								</Link>
							</li>
						</ul>
					</div>

					{/* Legal */}
					<div className="space-y-4">
						<h4 className="font-semibold text-foreground">Legal</h4>
						<ul className="space-y-2 text-sm">
							<li>
								<Link
									href="/privacy"
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									Privacy
								</Link>
							</li>
							<li>
								<Link
									href="/terms"
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									Terms
								</Link>
							</li>
						</ul>
					</div>
				</div>

				{/* Divider */}
				<div className="border-t border-border my-8"></div>

				{/* Bottom */}
				<div className="flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
					<p>&copy; {currentYear} Ngevent. All rights reserved.</p>
					<div className="flex items-center space-x-6 mt-4 md:mt-0">
						<Link href="#" className="hover:text-foreground transition-colors">
							Twitter
						</Link>
						<Link href="#" className="hover:text-foreground transition-colors">
							Facebook
						</Link>
						<Link href="#" className="hover:text-foreground transition-colors">
							Instagram
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
