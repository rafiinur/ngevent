"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";

// Definisi languages (bisa dipindah ke constant file terpisah)
const languages = [
	{ code: "en", name: "English" },
	{ code: "id", name: "Indonesia" },
];

const LangSelector = () => {
	// const locale = useLocale(); // Ambil locale aktif (misal: 'id' atau 'en')
	// const router = useRouter();
	// const pathname = usePathname();
	const [isPending, startTransition] = useTransition();
	const [lang, setLang] = useState("id");

	const handleLanguageChange = (newLocale: string) => {
		startTransition(() => {
			// Mengganti locale di URL sambil mempertahankan path yang sama
			// Contoh: /id/about -> /en/about
			// router.replace(pathname, { locale: newLocale });
			setLang(newLocale);
		});
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant={"outline"}
					disabled={isPending}
					className="
                        flex items-center justify-center gap-1 
                        px-2
                        rounded-3xl 
                        disabled:opacity-50
						w-fit
                    "
					aria-label="Select language"
					size="icon-sm"
					suppressHydrationWarning
				>
					<Image
						// Menggunakan locale dari URL untuk menentukan gambar
						src={`/icon/${lang}.svg`}
						alt={languages.find((l) => l.code === lang)?.name || "Language"}
						width={16}
						height={16}
						className="rounded-full shrink-0"
						aria-hidden="true"
					/>
					<ChevronDown className="w-4 h-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-40">
				{languages.map((language) => (
					<DropdownMenuItem
						key={language.code}
						// Panggil fungsi ganti bahasa
						onClick={() => handleLanguageChange(language.code)}
						className={`flex cursor-pointer items-center gap-2 ${
							language.code === lang ? "bg-accent" : ""
						}`}
					>
						<Image
							src={`/icon/${language.code}.svg`}
							alt={language.name}
							width={16}
							height={16}
							className="rounded-full"
							aria-hidden="true"
						/>
						<span>{language.name}</span>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default LangSelector;
