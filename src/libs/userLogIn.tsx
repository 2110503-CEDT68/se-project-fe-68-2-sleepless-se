export default async function userLogIn(userEmail: string, userPassword: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: userEmail,
            password: userPassword,
        }),
    });

    if (!response.ok) {
        return null;
    }

    return await response.json();
}
