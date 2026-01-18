import { EventCard } from "@/features/event/components";
import { Section, SectionHeader } from "@/components/ui/section";

export default function Home() {
	return (
		<Section>
			<SectionHeader title="Welcome to Ngevent" />

			<div className="w-full flex flex-nowrap items-center gap-2 overflow-x-auto">
				<EventCard />
			</div>
		</Section>
	);
}
