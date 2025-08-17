import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/cn"

function Textarea({
	className,
	asChild = false,
	...props
}: React.ComponentProps<"textarea"> & {
		asChild?: boolean
	}) {
	const Comp = asChild ? Slot : "textarea"

	return (
		<Comp
			data-slot="textarea"
			className={cn("border-[1px] border-slate-400/30 focus:border-slate-400/60 duration-200 px-4 py-3 rounded-xl outline-none bg-transparent", className)}
			{...props}
		/>
	)
}

export { Textarea }
