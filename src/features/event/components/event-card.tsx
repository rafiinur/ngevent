import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const EventCard = () => {
	return (
		<Card className="w-1/4 pt-0 gap-2">
			<CardHeader className="p-0">
				<div className="aspect-video bg-gray-200 rounded-t-md"></div>
				<CardTitle className="px-4 py-2">PESPHORIA 2025</CardTitle>
			</CardHeader>
			<CardContent className="px-4">
				<p className="text-sm text-muted-foreground">
					Join us for an unforgettable experience at PESPHORIA 2025, where
					innovation meets excitement!
				</p>
			</CardContent>
			<CardFooter>
				<p className="text-sm font-medium text-foreground">Jan 15, 2025</p>
			</CardFooter>
		</Card>
	);
};

export default EventCard;
