interface EmailTemplateProps {
    firstName: string;
}

export function EmailTemplate({ firstName }: EmailTemplateProps) {
    return (
        <div>
            <h1>Welcome, {firstName}!</h1>
            <p>Thank you for signing up for our fitness app. We are excited to have you on board.</p>
            <p>Please click the link below to verify your email:</p>
        </div>
    );
}