interface ReturnStatus {
    statusCode: number;
    status: 1 | 0;
}

export async function loginToDatabase(email: string, userId: string): Promise<ReturnStatus> {
    if (!email || !userId) return { status: 0, statusCode: 404 }
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, userId: userId }),
        });


        if (response.ok) {
            return {
                status: 1,
                statusCode: response.status
            }
        }
        else {
            return {
                status: 0,
                statusCode: response.status
            }
        }
    }
    catch (error) {
        console.error(error);
        return {
            status: 0,
            statusCode: 500
        }
    }
}


