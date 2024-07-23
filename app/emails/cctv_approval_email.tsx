import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { CCTVRequest } from "types";

interface CCTVApprovalEmailProps {
  token: string;
  active_request: CCTVRequest;
  to: string;
}

const baseUrl = process.env.BASE_URL;
export const CCTVApprovalEmail = ({
  token,
  active_request,
  to,
}: CCTVApprovalEmailProps) => (
  <Html>
    <Head />
    <Preview>
      {active_request.requestor.full_name} is requesting for your approval{" "}
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={title}>
          Hi, <strong>{active_request.requestor.full_name}</strong>, is
          requesting you to approval a request made to security.
        </Text>

        <Section style={section}>
          <Text style={text}>
            <strong>Below is the request</strong>!
          </Text>
          <Text style={text}>{active_request.details}</Text>

          <Button
            style={button}
            href={`${baseUrl}/requests/request_approval?token=${token}`}
          >
            Approve or Reject Request
          </Button>
        </Section>
        {/* <Text style={links}>
          <Link style={link}>Your security audit log</Link> ・{" "}
          <Link style={link}>Contact support</Link>
        </Text>

        <Text style={footer}>
          GitHub, Inc. ・88 Colin P Kelly Jr Street ・San Francisco, CA 94107
        </Text> */}
      </Container>
    </Body>
  </Html>
);

export default CCTVApprovalEmail;

const main = {
  backgroundColor: "#ffffff",
  color: "#24292e",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
};

const container = {
  maxWidth: "480px",
  margin: "0 auto",
  padding: "20px 0 48px",
};

const title = {
  fontSize: "24px",
  lineHeight: 1.25,
};

const section = {
  padding: "24px",
  border: "solid 1px #dedede",
  borderRadius: "5px",
  textAlign: "center" as const,
};

const text = {
  margin: "0 0 10px 0",
  textAlign: "left" as const,
};

const button = {
  fontSize: "14px",
  backgroundColor: "#28a745",
  color: "#fff",
  lineHeight: 1.5,
  borderRadius: "0.5em",
  padding: "12px 24px",
};

const links = {
  textAlign: "center" as const,
};

const link = {
  color: "#0366d6",
  fontSize: "12px",
};

const footer = {
  color: "#6a737d",
  fontSize: "12px",
  textAlign: "center" as const,
  marginTop: "60px",
};
