/**
 * Reusable Component: Section
 *
 * Wrapper for page sections with consistent spacing and structure.
 * Reduces DOM nesting and provides consistent layout.
 *
 * @example
 * ```tsx
 * <Section id="about" className="bg-gray-50">
 *   <SectionHeader title="About Us" subtitle="Learn More" />
 *   <p>Content here...</p>
 * </Section>
 * ```
 */

import React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
	children: React.ReactNode;
	as?: "section" | "div" | "article";
	containerClassName?: string;
	fullWidth?: boolean;
}

export const Section: React.FC<SectionProps> = ({
	children,
	as: Component = "section",
	className,
	containerClassName,
	fullWidth = false,
	...props
}) => {
	return (
		<Component className={cn("relative w-full", className)} {...props}>
			{fullWidth ? (
				children
			) : (
				<div
					className={cn(
						"container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 w-full",
						containerClassName
					)}
				>
					{children}
				</div>
			)}
		</Component>
	);
};

/**
 * Section Header Component
 * Consistent heading structure for sections
 */
interface SectionHeaderProps {
	title: string;
	centered?: boolean;
	className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
	title,
	centered = false,
	className,
}) => {
	return (
		<div className={cn("mb-10", centered && "text-center", className)}>
			{
				<h2 className="font-bold text-lg lg:text-xl text-foreground mb-2">
					{title}
				</h2>
			}
		</div>
	);
};
