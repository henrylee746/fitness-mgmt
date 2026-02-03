import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Section,
    Text,
} from "@react-email/components";

interface EmailTemplateProps {
    firstName: string;
    verificationUrl: string;
}

export function EmailTemplate({ firstName, verificationUrl }: EmailTemplateProps) {
    return (
        <Html>
            <Head />
            <Preview>Verify your email address for FitnessApp</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={heading}>Welcome, {firstName}! 🏋️</Heading>
                    <Text style={text}>
                        Thank you for signing up for our fitness app. We&apos;re excited to have you on board!
                    </Text>
                    <Text style={text}>
                        Please click the button below to verify your email address:
                    </Text>
                    <Section style={buttonContainer}>
                        <Button style={button} href={verificationUrl}>
                            Verify Email
                        </Button>
                    </Section>
                    <Text style={footer}>
                        If the button doesn&apos;t work, copy and paste this link into your browser:
                    </Text>
                    <Link href={verificationUrl} style={link}>
                        {verificationUrl}
                    </Link>
                </Container>
            </Body>
        </Html>
    );
}

// Styles
const main = {
    backgroundColor: "#f6f9fc",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
    padding: "40px 0",
};

const container = {
    backgroundColor: "#ffffff",
    border: "1px solid #f0f0f0",
    borderRadius: "8px",
    margin: "0 auto",
    padding: "40px",
    maxWidth: "480px",
};

const heading = {
    color: "#1a1a1a",
    fontSize: "24px",
    fontWeight: "600",
    lineHeight: "1.3",
    margin: "0 0 20px",
};

const text = {
    color: "#4a4a4a",
    fontSize: "16px",
    lineHeight: "1.6",
    margin: "0 0 16px",
};

const buttonContainer = {
    textAlign: "center" as const,
    margin: "32px 0",
};

const button = {
    backgroundColor: "#18181b",
    borderRadius: "6px",
    color: "#ffffff",
    display: "inline-block",
    fontSize: "16px",
    fontWeight: "600",
    padding: "12px 24px",
    textDecoration: "none",
};

const footer = {
    color: "#8898aa",
    fontSize: "12px",
    lineHeight: "1.5",
    margin: "24px 0 8px",
};

const link = {
    color: "#5469d4",
    fontSize: "12px",
    wordBreak: "break-all" as const,
};