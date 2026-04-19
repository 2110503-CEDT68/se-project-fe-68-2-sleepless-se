export default async function userLogIn(userEmail: string, userPassword: string) {
    const response = await fetch(`https://se-be-9w6y.onrender.com/api/v1/auth/login`, {
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
