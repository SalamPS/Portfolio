"use client"

import { useState } from "react"
import client from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function LoginAdmin () {
	const [input, setInput] = useState<string>('')
	const [errorText, setErrorText] = useState<string>('')
	const router = useRouter();

	const login = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		client.post('/auth/admin', {auth: input})
		.then(() => {
			router.push('/')
		})
		.catch((error) => {
			setErrorText(error.response.data.message)
		})
	}

	return <form onSubmit={login} className="bg-darke h-screen w-full flex flex-col items-center justify-center">
		<label className="text-sm font-medium text-gray-400">Keyword</label>
		<input
			type="text"
			name="username"
			value={input}
			onChange={e => {
				setErrorText('')
				setInput(e.target.value)
			}}
			placeholder="Lampcrypt generated key"
			className="w-64 md:w-80 text-white text-sm md:text-base placeholder:text-sm placeholder:md:text-base placeholder:text-[#ffffff33] my-3 px-3 md:px-4 py-2 border-none rounded-lg shadow-sm outline-none ring-1 ring-[#ffffff33] duration-100 focus:ring-[#ffffff55] bg-transparent"
		/>

		<button type="submit" className="bg-[#445284] hover:bg-white hover:text-black duration-200 rounded-full text-sm md:text-base w-64 md:w-80 mt-2 py-2 px-6">
			Login
		</button>
		<div className="text-red-300 text-sm mt-2">
			{errorText}
		</div>
	</form>
}