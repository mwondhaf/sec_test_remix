import { render } from "@react-email/components";
import nodemailer from "nodemailer";
import { CCTVRequest } from "types";
import { CCTVApprovalEmail, CCTVReplyEmail } from "~/emails";

export const emailTransporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: true,
  auth: {
    user: process.env.EMAIL_AUTH_USER,
    pass: process.env.EMAIL_AUTH_PASS,
  },
});

const sendCCTVReplyEmail = async ({
  to,
  active_request,
  cc,
}: {
  to: string;
  active_request: CCTVRequest;
  cc?: string;
}) => {
  const emailHtml = render(CCTVReplyEmail({ active_request }));
  const options = {
    from: process.env.EMAIL_AUTH_USER,
    to,
    cc,
    subject: `CCTV Request - ${active_request.request_id} / ${active_request.status}`,
    html: emailHtml,
  };

  await emailTransporter.sendMail(options);
};

const sendCCTVApprovalEmail = async ({
  to,
  active_request,
  cc,
  token,
}: {
  to: string;
  active_request: CCTVRequest;
  cc?: string;
  token: string;
}) => {
  const emailHtml = render(CCTVApprovalEmail({ active_request, token, to }));
  const options = {
    from: process.env.EMAIL_AUTH_USER,
    to,
    cc,
    subject: `Approval for CCTV Request - ${active_request.request_id}`,
    html: emailHtml,
  };

  await emailTransporter.sendMail(options);
};

export { sendCCTVReplyEmail, sendCCTVApprovalEmail };
