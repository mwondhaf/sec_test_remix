import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { createSupabaseServerClient } from "~/supabase.server";
import zod from "zod";
import { fromError, fromZodError } from "zod-validation-error";
import { errSession } from "~/flash.session";
import { profileSessionData } from "~/sessions/session.server";
import {
  sendCCTVApprovalEmail,
  sendCCTVReplyEmail,
} from "~/modules/email.server";
import { getCache } from "~/utils/cache";
import { CCTVRequest } from "types";
import { encryptedDataJWT } from "~/utils/jose.server";
import { supabaseClient } from "~/services/supabase-auth.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  // const { supabaseClient } = createSupabaseServerClient(request);
  const { active_profile } = await profileSessionData(request);
  const session = await errSession.getSession(request.headers.get("Cookie"));

  const formData = await request.formData();
  const reply = formData.get("reply") as string;
  const status = formData.get("status") as string;
  const cctvRequestId = formData.get("id") as string;
  const intent = formData.get("intent") as string;
  const approver_email = formData.get("approver_email") as string;

  if (intent === "approval") {
    const emailSchema = zod.object({
      approver_email: zod.string().email(),
    });

    try {
      emailSchema.parse({ approver_email });
    } catch (err) {
      session.flash("error", "Email is invalid");
      return redirect(`/cctv/${cctvRequestId}`, {
        headers: { "Set-Cookie": await errSession.commitSession(session) },
      });
    }

    try {
      const active_request: CCTVRequest = getCache("active-request");

      const jwt = await encryptedDataJWT({
        cctv_ref: active_request.request_id,
        approval_for: "cctv",
        cctv_id: active_request.id,
        approver_email: approver_email,
      });

      await sendCCTVApprovalEmail({
        to: approver_email,
        active_request,
        token: jwt,
      });

      session.flash("success", "Approval email sent");
      return redirect(`/cctv/${cctvRequestId}`, {
        headers: { "Set-Cookie": await errSession.commitSession(session) },
      });
    } catch (error) {
      session.flash("error", "Approval email failed to send");
      return redirect(`/cctv/${cctvRequestId}`, {
        headers: { "Set-Cookie": await errSession.commitSession(session) },
      });
    }
  }

  const replySchema = zod.object({
    reply: zod.string().min(1, { message: "Reply is required" }),
    status: zod.string().min(1, { message: "Status is required" }),
  });

  try {
    const schemaData = replySchema.parse({ reply, status });

    const [replyResult, logResult, updateResult] = await Promise.all([
      supabaseClient
        .from("cctv_replies")
        .insert({
          content: schemaData.reply,
          cctv_request: cctvRequestId,
          reply_by: active_profile?.id,
        })
        .select("*"),
      supabaseClient.from("cctv_events_log").insert({
        cctv_ref: cctvRequestId,
        event: "replied",
        remarks: schemaData.status,
        event_by: active_profile?.name,
      }),
      supabaseClient
        .from("cctv_requests")
        .update({ status: schemaData.status, updated_by: active_profile?.id })
        .eq("id", cctvRequestId),
    ]);

    const errors = [
      replyResult.error,
      logResult.error,
      updateResult.error,
    ].filter((err) => err !== null);

    if (errors.length > 0) {
      session.flash("error", "Something went wrong");
      return redirect(`/cctv/${cctvRequestId}`, {
        headers: { "Set-Cookie": await errSession.commitSession(session) },
      });
    }

    try {
      const active_request: CCTVRequest = getCache("active-request");
      await sendCCTVReplyEmail({
        to: active_request.requestor.email,
        cc: active_profile?.entities.email,
        active_request: {
          ...active_request,
          // @ts-expect-error
          status: schemaData.status,
          replies: replyResult.data ?? [],
        },
      });
    } catch (error) {
      session.flash("error", "Reply email failed to send");
      return redirect(`/cctv/${cctvRequestId}`, {
        headers: { "Set-Cookie": await errSession.commitSession(session) },
      });
    }

    session.flash("success", "Reply recorded");
    return redirect(`/cctv/${cctvRequestId}`, {
      headers: { "Set-Cookie": await errSession.commitSession(session) },
    });
  } catch (err) {
    const validationError = fromError(err);
    session.flash("error", validationError.message);
    return redirect(`/cctv/${cctvRequestId}`, {
      headers: { "Set-Cookie": await errSession.commitSession(session) },
    });
  }
};
