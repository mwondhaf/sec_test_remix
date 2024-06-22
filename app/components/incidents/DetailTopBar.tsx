import { Button } from "@nextui-org/react";
import {
  CheckIcon,
  ChevronLeftIcon,
  Pencil1Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import {
  Form,
  Link,
  useMatches,
  useNavigate,
  useParams,
} from "@remix-run/react";
import { MailPlus, Printer, Trash2Icon } from "lucide-react";

const DetailTopBar = () => {
  const { incidentId } = useParams();
  const matches = useMatches();
  const navigate = useNavigate();

  const editPage = matches.some(
    (match) => match.pathname === `/incidents/${incidentId}/edit-incident`
  );

  return (
    <>
      {incidentId && (
        <div className="flex items-center justify-between">
          <div className="">
            {incidentId && !editPage ? (
              <Button
                size="sm"
                variant="ghost"
                startContent={<Pencil1Icon />}
                color="primary"
                type="submit"
                as={Link}
                to={`${incidentId}/edit-incident`}
              >
                Edit
              </Button>
            ) : (
              <Button
                onClick={() => navigate(`/incidents/${incidentId}`)}
                size="sm"
                variant="ghost"
                startContent={<ChevronLeftIcon />}
                color="primary"
                type="submit"
              >
                Back
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button type="submit" isIconOnly radius="full" variant="light">
              <MailPlus size={18} />
            </Button>
            <Button type="submit" isIconOnly radius="full" variant="light">
              <Printer size={18} />
            </Button>
            <Form method="delete" action="/incidents/delete_incident">
              <input type="hidden" name="id" value={incidentId} />
              <Button
                type="submit"
                isIconOnly
                radius="full"
                color="danger"
                variant="light"
              >
                <Trash2Icon size={18} />
              </Button>
            </Form>
          </div>
        </div>
      )}
    </>
  );
};

export default DetailTopBar;
