import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { CCTVRequest } from "types";

interface CCTVReplyEmailProps {
  active_request: CCTVRequest;
}

export default function CCTVReplyEmail({
  active_request,
}: CCTVReplyEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>CCTV Request {active_request.request_id}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={coverSection}>
            <Section style={upperSection}>
              <Heading style={h1}>Request Details</Heading>
              <Text style={mainText}>{active_request.details}</Text>
            </Section>
            <Hr />
            <Section style={lowerSection}>
              <Heading style={h1}>Results</Heading>
              {active_request.replies?.map((reply, index) => (
                <Text style={cautionText} key={index}>
                  {reply.content}
                </Text>
              ))}
            </Section>
          </Section>
          {/* <Text style={footerText}>
            This message was produced and distributed by Amazon Web Services,
            Inc., 410 Terry Ave. North, Seattle, WA 98109. © 2022, Amazon Web
            Services, Inc.. All rights reserved. AWS is a registered trademark
            of{" "}
            <Link href="https://amazon.com" target="_blank" style={link}>
              Amazon.com
            </Link>
            , Inc. View our{" "}
            <Link href="https://amazon.com" target="_blank" style={link}>
              privacy policy
            </Link>
            .
          </Text> */}
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#fff",
  color: "#212121",
};

const container = {
  padding: "5px",
  margin: "0 auto",
  backgroundColor: "#eee",
};

const h1 = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "20px",
  fontWeight: "bold",
  marginBottom: "15px",
};

const link = {
  color: "#2754C5",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  textDecoration: "underline",
};

const text = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  margin: "24px 0",
};

const imageSection = {
  backgroundColor: "#252f3d",
  display: "flex",
  padding: "5px 0",
  alignItems: "center",
  justifyContent: "center",
};

const coverSection = { backgroundColor: "#fff" };

const upperSection = { padding: "25px 35px" };

const lowerSection = { padding: "25px 35px" };

const footerText = {
  ...text,
  fontSize: "12px",
  padding: "0 5px",
};

const mainText = { ...text, marginBottom: "14px" };

const cautionText = { ...text, margin: "0px" };
