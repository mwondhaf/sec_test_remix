import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import React from "react";
import { errSession } from "~/flash.session";
import { supabaseClient } from "~/services/supabase-auth.server";
import { createSupabaseServerClient } from "~/supabase.server";
import { decryptToken } from "~/utils/jose.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await errSession.getSession(request.headers.get("Cookie"));

  const url = new URL(request.url);
  const token = url.searchParams.get("token") as string;

  console.log(token);

  if (!token) {
    return redirect("/requests");
  }

  // decrypt token
  const data = await decryptToken(token);
  if (!data) {
    session.flash("error", "Invalid token");
    return redirect("/requests", {
      headers: { "Set-Cookie": await errSession.commitSession(session) },
    });
  }

  console.log({ data });

  if (data.approval_for === "cctv") {
    return json({
      cctv_ref: data.cctv_ref,
      approval_for: data.approval_for,
      cctv_id: data.cctv_id,
      approver_email: data.approver_email,
    });
  }

  return {};
};

export const action = async ({ request }: ActionFunctionArgs) => {
  // const { supabaseClient } = createSupabaseServerClient(request);
  const session = await errSession.getSession(request.headers.get("Cookie"));

  const formData = await request.formData();
  const intent = formData.get("intent") as string;
  const _action = formData.get("_action") as string;
  const ref_id = formData.get("ref_id") as string;
  const id = formData.get("id") as string;
  const approver_email = formData.get("approver_email") as string;

  console.log({ approver_email });

  switch (intent) {
    case "cctv":
      const [updateResult, insertResult] = await Promise.all([
        supabaseClient
          .from("cctv_requests")
          .update({ status: _action.toUpperCase() })
          .eq("request_id", ref_id),

        supabaseClient.from("cctv_events_log").insert({
          cctv_ref: id,
          event: _action,
          event_by: approver_email,
        }),
      ]);

      const { error: updateError } = updateResult;
      const { error: insertError } = insertResult;
      if (!updateError || insertError) {
        session.flash("success", `Request ${_action} successfully`);
        return redirect("/requests", {
          headers: { "Set-Cookie": await errSession.commitSession(session) },
        });
      }
      session.flash("error", "Something wrong has happened");
      return redirect("/requests", {
        headers: { "Set-Cookie": await errSession.commitSession(session) },
      });

    default:
      break;
  }

  return {};
};

const CCTVRequestApproval = () => {
  const data = useLoaderData<any>();

  if (data?.approval_for === "cctv") {
    return (
      <div>
        <Modal backdrop={"blur"} isOpen={true} closeButton={false}>
          <ModalContent>
            {(onClose) => (
              <Form method="post">
                <ModalHeader className="flex flex-col gap-1">
                  Request {data?.cctv_ref}
                </ModalHeader>
                <ModalBody>
                  <input
                    type="hidden"
                    name="approver_email"
                    value={data.approver_email}
                  />
                  <input type="hidden" name="id" value={data.cctv_id} />
                  <input type="hidden" name="ref_id" value={data.cctv_ref} />
                  <input type="hidden" name="intent" value={"cctv"} />
                  <p className="text-gray-600 text-sm">
                    Hi, approve or reject this {data?.approval_for} request?
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="flat"
                    value={"rejected"}
                    name="_action"
                    type="submit"
                  >
                    Reject
                  </Button>
                  <Button
                    color="primary"
                    value={"approved"}
                    name="_action"
                    type="submit"
                  >
                    Approve
                  </Button>
                </ModalFooter>
              </Form>
            )}
          </ModalContent>
        </Modal>
      </div>
    );
  } else {
    return <div>Invalid request</div>;
  }
};

export default CCTVRequestApproval;
