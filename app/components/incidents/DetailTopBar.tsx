import { Button } from "@nextui-org/react";
import { ChevronLeftIcon, Pencil1Icon } from "@radix-ui/react-icons";
import {
  Form,
  Link,
  useLocation,
  useMatches,
  useNavigate,
  useParams,
} from "@remix-run/react";
import { File, MailPlus, Printer, Trash2Icon } from "lucide-react";
import { useTranslation } from "react-i18next";

const DetailTopBar = () => {
  const { incidentId } = useParams();
  const matches = useMatches();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const editPage = matches.some(
    (match) => match.pathname === `/incidents/${incidentId}/edit-incident`
  );

  return (
    <>
      {incidentId && (
        <div className="flex items-center justify-between px-4">
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
                {t("edit")}
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
            {/* <Button type="submit" isIconOnly radius="full" variant="light">
              <MailPlus size={18} />
            </Button>
            <Button type="submit" isIconOnly radius="full" variant="light">
              <File size={18} />
            </Button> */}
            <Button
              as={Link}
              to={`/templates/pdf?url=single_ir&id=${incidentId}`}
              target="_blank"
              isIconOnly
              radius="full"
              variant="light"
            >
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
