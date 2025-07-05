/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useState } from "react"
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import client from "@/lib/auth";

export default function Login () {
	const router = useRouter()
	const [errorText, setErrorText] = useState('')
	const [formData, setFormData] = useState({
		username: '',
		password: '',
	})
	
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setErrorText('')
		const { name, value } = e.target;
		setFormData(prevState => ({
			...prevState,
			[name]: value
		}));
	};

	const login = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setErrorText('')
		client.post('/auth', {
			username: formData.username,
			password: formData.password
		})
		.then(() => {
			router.push('/')
		})
		.catch(error => {
			const errorMessage = error instanceof AxiosError ? error?.response?.data.message : 'Gagal mendaftarkan client. Silahkan coba lagi nanti!';
			setErrorText(errorMessage)
		})
	}

	return <>
		<div className="flex justify-center items-center w-screen h-screen p-4">
			<div className="md:w-[50vw] lg:w-[40vw]">
				<h1 className="text-3xl text-center mb-8">
					<b>LamP | Portal</b>
				</h1>
				<form className="flex flex-col" onSubmit={login}>
					<div className="flex flex-col text-white mb-4">
						<label className="ml-3 text-white">Username</label>
						<input
						type="text"
						name="username"
						value={formData.username}
						onChange={handleInputChange}
						placeholder="Login Username"
						className="text-white placeholder:text-[#ffffff33] w-full mt-1 px-4 py-2 border-none rounded-lg shadow-sm outline-none ring-1 ring-[#ffffff33] duration-100 focus:ring-[#ffffff55] bg-transparent"
						/>
					</div>

					<div className="flex flex-col text-white mb-4">
						<label className="ml-3 text-white">Password</label>
						<input
						type="password"
						name="password"
						value={formData.password}
						onChange={handleInputChange}
						placeholder="Login password"
						className="text-white placeholder:text-[#ffffff33] w-full mt-1 px-4 py-2 border-none rounded-lg shadow-sm outline-none ring-1 ring-[#ffffff33] duration-100 focus:ring-[#ffffff55] bg-transparent"
						/>
					</div>
					<div className="text-red-300 text-sm ml-3">
						{errorText}
					</div>
					<button type="submit" className="bg-[#445284] hover:bg-white text-black duration-200 mt-2 rounded-full px-12 py-3">
						Login
					</button>
				</form>
			</div>
		</div>
	</>
}