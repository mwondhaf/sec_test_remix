import React, { useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Spinner,
  Chip,
  Button,
  Link as NextLink,
  Pagination,
} from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { createSupabaseServerClient } from "~/supabase.server";
import {
  ClientLoaderFunctionArgs,
  Link,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import { CCTVRequest } from "types";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { PaperPlaneIcon, Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import { Check, Forward, MessageSquareShare } from "lucide-react";
import {
  getCCTVRequests,
  setCCTVRequestsArray,
} from "~/utils/cache/dexie-cache";

dayjs.extend(localizedFormat);

const rowsPerPage = 10;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") || "1");
  const offset = (page - 1) * rowsPerPage;

  const { supabaseClient } = createSupabaseServerClient(request);

  const { data, error, count } = await supabaseClient
    .from("cctv_requests")
    .select(
      "*, requestor:requestors_profiles!cctv_requests_requested_by_fkey(*)",
      {
        count: "exact",
      }
    )
    .range(offset, offset + rowsPerPage - 1)
    .order("created_at", { ascending: false });

  if (error) {
    return json({ error: error.details });
  }
  return json({ data: data as CCTVRequest[], count, page });
};

// export const clientLoader = async ({
//   request,
//   serverLoader,
// }: ClientLoaderFunctionArgs) => {
//   // existing requests
//   const cachedRequests = await getCCTVRequests();
//   if (cachedRequests.length > 0) return { data: cachedRequests };

//   // @ts-ignore
//   let { data } = await serverLoader();
//   await setCCTVRequestsArray(data);

//   return { data };
// };

export default function App() {
  const { data, count, page } = useLoaderData<{
    data: CCTVRequest[];
    count: number;
    page: number;
  }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(page);

  // const [page, setPage] = React.useState(1);

  let list = useAsyncList({
    async load(): Promise<{ items: CCTVRequest[] }> {
      setIsLoading(false);

      return {
        items: data,
      };
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a, b) => {
          let first = a[sortDescriptor.column as keyof CCTVRequest];
          let second = b[sortDescriptor.column as keyof CCTVRequest];
          let cmp =
            (parseInt(first as string) || first) <
            (parseInt(second as string) || second)
              ? -1
              : 1;

          if (sortDescriptor.direction === "descending") {
            cmp *= -1;
          }

          return cmp;
        }),
      };
    },
  });

  // React.useEffect(() => {
  //   setCurrentPage(page);
  // }, [page]);

  React.useEffect(() => {
    list.reload();
  }, [data]);

  const pages = useMemo(() => {
    return count ? Math.ceil(count / rowsPerPage) : 0;
  }, [count, rowsPerPage]);

  const loadingState = isLoading || data?.length === 0 ? "loading" : "idle";

  const handlePageChange = (newPage: number) => {
    setIsLoading(true);
    setCurrentPage(newPage);
    setSearchParams({ page: newPage.toString() });
    // navigate(`?page=${newPage}`);
    setIsLoading(false);
  };

  return (
    <div className="p-4">
      <div className="p-4">
        <h3 className="text-2xl font-bold text-primary-400">CCTV Requests</h3>
        <p className="text-primary-700 text-sm">
          View and manage all CCTV requests
        </p>
      </div>
      <Table
        isStriped
        radius="none"
        shadow="none"
        aria-label="Example table with client side sorting"
        sortDescriptor={list.sortDescriptor}
        onSortChange={list.sort}
        classNames={{
          table: "min-h-[400px]",
        }}
        bottomContent={
          pages > 0 ? (
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={pages}
                onChange={(page) => handlePageChange(page)}
              />
            </div>
          ) : null
        }
      >
        <TableHeader>
          <TableColumn key="request_id">Request ID</TableColumn>
          <TableColumn key="created_at" allowsSorting>
            Requested On
          </TableColumn>
          <TableColumn key="reason">Reason</TableColumn>
          <TableColumn key="requestor" allowsSorting>
            Requested By
          </TableColumn>
          <TableColumn key="status">Status</TableColumn>
          <TableColumn key="actions">Actions</TableColumn>
        </TableHeader>
        <TableBody
          items={list.items}
          isLoading={isLoading}
          loadingContent={<Spinner label="Loading..." />}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>
                  {columnKey === "from_time" || columnKey === "created_at" ? (
                    dayjs(getKeyValue(item, columnKey)).format("lll")
                  ) : columnKey === "status" ? (
                    <Chip
                      size="sm"
                      variant="flat"
                      color={
                        String(item.status) === "REJECTED"
                          ? "danger"
                          : "success"
                      }
                    >
                      {getKeyValue(item, columnKey)}
                    </Chip>
                  ) : columnKey === "requestor" ? (
                    item.requestor?.full_name
                  ) : columnKey === "request_id" ? (
                    <NextLink
                      underline="active"
                      size="sm"
                      as={Link}
                      to={`/cctv/${item.id}`}
                    >
                      {getKeyValue(item, columnKey)}
                    </NextLink>
                  ) : columnKey === "actions" ? (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        color="primary"
                        isIconOnly
                        variant="light"
                        radius="full"
                        // onClick={() => handleEdit(item.id)}
                      >
                        <Forward size={16} />
                      </Button>
                      <Button
                        size="sm"
                        color="primary"
                        isIconOnly
                        variant="light"
                        radius="full"
                        // onClick={() => handleDelete(item.id)}
                      >
                        <MessageSquareShare size={16} />
                      </Button>
                      <Button
                        size="sm"
                        color="default"
                        isIconOnly
                        variant="light"
                        radius="full"
                        // onClick={() => handleDelete(item.id)}
                      >
                        <Check size={16} />
                      </Button>
                    </div>
                  ) : (
                    getKeyValue(item, columnKey)
                  )}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
