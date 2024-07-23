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

  if (data.approval_for === "cctv") {
    return json({
      cctv_ref: data.cctv_ref,
      approval_for: data.approval_for,
    });
  }

  return {};
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { supabaseClient } = createSupabaseServerClient(request);
  const session = await errSession.getSession(request.headers.get("Cookie"));

  const formData = await request.formData();
  const intent = formData.get("intent") as string;
  const _action = formData.get("_action") as string;
  const ref_id = formData.get("ref_id") as string;

  switch (intent) {
    case "cctv":
      const { data, error } = await supabaseClient
        .from("cctv_requests")
        .update({
          status: _action.toUpperCase(),
        })
        .eq("request_id", ref_id);
      if (!error) {
        session.flash("success", `Request ${_action} successfully`);
        return redirect("/requests", {
          headers: { "Set-Cookie": await errSession.commitSession(session) },
        });
      }
      session.flash("error", error.message);
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
  const navigate = useNavigate();

  if (data?.approval_for === "cctv") {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
      <div>
        <Modal backdrop={"blur"} isOpen={true} onClose={onClose}>
          <ModalContent>
            {(onClose) => (
              <Form method="post">
                <ModalHeader className="flex flex-col gap-1">
                  Modal Title
                </ModalHeader>
                <ModalBody>
                  <input type="hidden" name="ref_id" value={data.cctv_ref} />
                  <input type="hidden" name="intent" value={"cctv"} />
                  <p className="text-gray-600 text-sm">
                    Magna exercitation reprehenderit magna aute tempor cupidatat
                    Culpa deserunt nostrud ad veniam.
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
