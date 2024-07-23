import { Button } from "@nextui-org/react";
import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import clsx from "clsx";
import dayjs from "dayjs";
import { CCTVReply, CCTVRequest } from "types";
import {
  CCTVRepliesAccordion,
  CCTVRequestApprovalModal,
  CCTVRequestReplyModal,
} from "~/components";
import { createSupabaseServerClient } from "~/supabase.server";
import { setCache } from "~/utils/cache";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  // params
  const { cctvRequestId } = params;
  const { supabaseClient } = createSupabaseServerClient(request);

  const { data, error } = await supabaseClient
    .from("cctv_requests")
    .select(
      "*, requestor:requestors_profiles!cctv_requests_requested_by_fkey(*, department:requestors_profiles_department_id_fkey(*))"
    )
    .eq("id", cctvRequestId)
    .single();

  if (error) {
    return json({ error: error.details, data: null });
  }

  const { data: events_log, error: events_error } = await supabaseClient
    .from("cctv_events_log")
    .select("*")
    .eq("cctv_ref", data.id);

  const { data: replies, error: replies_error } = await supabaseClient
    .from("cctv_replies")
    .select("*")
    .eq("cctv_request", data.id);

  const request_data: CCTVRequest = {
    ...data,
    events_log: events_error ? [] : events_log,
    replies: replies_error ? [] : replies,
  };

  setCache("active-request", request_data);

  return json({
    data: request_data,
  });
};

const CCTVDetails = () => {
  const { data: request } = useLoaderData<typeof loader>();

  return (
    <div className="">
      <div className="h-[15dvh] px-8 flex flex-col justify-center">
        <h3 className="text-2xl font-bold text-primary-400">
          CCTV Request {request?.request_id}
        </h3>
        <p className="text-primary-700 text-sm">
          Requested on: {dayjs(request?.created_at).format("lll")}
        </p>
        <p className="text-gray-600 text-sm capitalize">
          Requested by: {request?.requestor.full_name} -{" "}
          {request?.requestor?.department?.name}
        </p>
      </div>
      <div className="grid grid-cols-3 h-[80dvh] pr-4">
        <div className="col-span-2 px-8 h-[]">
          <div className="flex items-start justify-between">
            <div className="">
              <h1 className="font-medium text-sm text-gray-700">Reason</h1>
              <p className="text-gray-500 text-sm">{request?.reason}</p>
            </div>

            <div className="gap-2 flex">
              <CCTVRequestReplyModal />
              <CCTVRequestApprovalModal />
            </div>
          </div>
          <div className="py-4 space-y-4">
            <div className="">
              <h1 className="font-medium text-sm text-gray-700">
                Location to check
              </h1>
              <p className="text-gray-500 text-sm">{request?.location}</p>
            </div>
            <div className="">
              <h1 className="font-medium text-sm text-gray-700">
                Time to Check
              </h1>
              <div className="grid grid-cols-2 max-w-[400px]">
                <span className="font-bold text-sm">From </span>
                <span className="font-bold text-sm"> To</span>
                <p className="text-gray-500 text-sm">
                  {dayjs(request?.from_time).format("lll")}
                </p>
                <p className="text-gray-500 text-sm">
                  {dayjs(request?.to_time).format("lll")}
                </p>
              </div>
            </div>
          </div>
          <div className="py-4 overflow-y-auto h-[60dvh] space-y-4">
            <div className="">
              <h1 className="font-bold text-sm text-gray-700">
                Request Details
              </h1>
              <p className="text-gray-500 text-sm text-justify">
                {request?.details}
              </p>
            </div>
            <div className="">
              <CCTVRepliesAccordion
                {...{ replies: request?.replies ?? ([] as CCTVReply[]) }}
              />
            </div>
          </div>
        </div>
        <div className="col-span-1 border h-[80dvh] rounded-2xl p-4">
          <div className="mb-4 space-y-1">
            <h1 className="font-semibold text-sm text-gray-700 uppercase">
              Status
            </h1>
            <p
              className={clsx(
                "text-gray-500 text-xs",
                (request?.status as unknown as string) === "COMPLETED" &&
                  "bg-green-200 rounded-sm p-1"
              )}
            >
              {request?.status}
            </p>
          </div>
          <div className="max-w-lg mx-auto">
            <div className="timeline relative">
              {request?.events_log && (
                <>
                  {request.events_log.map((log) => (
                    <div className="timeline-item mb-4">
                      <div className="pl-8">
                        <h3 className="text-gray-700 uppercase text-xs font-semibold">
                          {log.event}
                        </h3>
                        <time className="block text-xs text-gray-500">
                          {dayjs(log.created_at).format("lll")}
                        </time>
                        <p className="text-gray-600 text-xs capitalize">
                          {log.event_by}
                          <br />
                          Remarks: {log.remarks ?? "None"}
                        </p>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CCTVDetails;
