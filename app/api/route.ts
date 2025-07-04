import { NextResponse } from "next/server";

export async function GET () {
	return NextResponse.json({
		encryption_status: "active",
		cflare_encrypt_tag: Math.floor(new Date().getTime()*1.5/100000),
		signature: "Encrypted using Lamcrypt"
	})
}