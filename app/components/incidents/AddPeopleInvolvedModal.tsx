import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Form, useMatches, useParams } from "@remix-run/react";
import { countries } from "~/utils/countries-json";
import { Department } from "types";
import { useTranslation } from "react-i18next";

export default function AddPeopleInvolvedModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const matches = useMatches();
  const { incidentId } = useParams();
  let { t } = useTranslation();

  const foundData = matches.find(
    (match) => match.pathname === `/incidents/${incidentId}`
  );

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button onPress={onOpen}>{t("add_person_involved")}</Button>
      </div>
      <Modal
        isDismissable={false}
        size={"md"}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalContent>
          {(onClose) => (
            <Form
              action={`/incidents/${incidentId}/add_person_involved`}
              method="post"
            >
              <ModalHeader className="flex flex-col gap-1">
                {t("person_involved")}
              </ModalHeader>
              <ModalBody>
                <input type="hidden" name="intent" value={"add_person"} />
                <input type="hidden" name="incident_id" value={incidentId} />
                <Input name="name" label={t("name")} size="sm" isRequired />

                <Input name="id_number" label={t("id_number")} size="sm" />

                <Select
                  // @ts-expect-error
                  items={foundData?.data?.departments as Department[]}
                  label={t("person_dept")}
                  placeholder={t("select_dept")}
                  name="person_dept"
                  isRequired
                >
                  {(department) => (
                    <SelectItem key={department.id}>
                      {department.name}
                    </SelectItem>
                  )}
                </Select>

                <Select
                  name="nationality"
                  items={countries}
                  label={t("nationality")}
                  placeholder={t("select_country")}
                >
                  {(country) => (
                    <SelectItem key={country.code}>{country.name}</SelectItem>
                  )}
                </Select>
                <Input name="remarks" label={t("remarks")} size="sm" />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  {t("cancel")}
                </Button>
                <Button type="submit" color="primary" onPress={onClose}>
                  {t("add")}
                </Button>
              </ModalFooter>
            </Form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
