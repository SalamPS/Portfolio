'use client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import BlogCreate from "./BlogCreate";

const QueryWrapper = () => {
	// Create QueryClient on the client side
	const [queryClient] = useState(() => new QueryClient());

	return (
		<QueryClientProvider client={queryClient}>
			<BlogCreate />
		</QueryClientProvider>
	);
};

export default QueryWrapper;
