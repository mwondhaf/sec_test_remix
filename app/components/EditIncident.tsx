import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  DatePicker,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Incident } from "types";
import { useRemixForm } from "remix-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createIncidentSchema } from "~/form-schemas";
import { Form, Link } from "@remix-run/react";
import {
  ZonedDateTime,
  getLocalTimeZone,
  now,
  parseAbsoluteToLocal,
  toCalendarDateTime,
} from "@internationalized/date";
import { Controller } from "react-hook-form";
import dayjs from "dayjs";

enum Severity {
  Low = "Low",
  Medium = "Medium",
  High = "High",
}

type FormData = zod.infer<typeof createIncidentSchema>;
const resolver = zodResolver(createIncidentSchema);

const calculateDateTime = (date: ZonedDateTime) => {
  const cal = toCalendarDateTime(date);
  // @ts-ignore
  return dayjs(cal).format();
};

export default function EditIncident({ incident }: { incident: Incident }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [date, setDate] = React.useState(
    parseAbsoluteToLocal(incident.incident_time)
  );
  let [incidentTime, setIncidentTime] = React.useState<string | undefined>(
    calculateDateTime(date)
  );

  console.log(incident.incident_time);

  const {
    handleSubmit,
    formState: { errors },
    control,
    register,
  } = useRemixForm<FormData>({
    mode: "onSubmit",
    resolver,
    defaultValues: {
      incident_time: incident.incident_time,
      //   incident_close_time: incidentCloseTime,
      severity: Severity.Low,
    },
  });

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button
          variant="flat"
          color="warning"
          onPress={() => onOpen()}
          className="capitalize"
          as={Link}
          to={`edit-incident`}
        >
          Edit Incident
        </Button>
      </div>
      <Modal
        size="4xl"
        backdrop={"blur"}
        isOpen={isOpen}
        onClose={onClose}
        isDismissable={false}
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <Form method="post" onSubmit={handleSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                Incident - {incident.id}
              </ModalHeader>
              <ModalBody>
                <div>
                  <div className="">
                    <div className="grid grid-cols-4 gap-4">
                      <input
                        name="incident_time"
                        // type="hidden"
                        value={incidentTime}
                      />
                      {/* <input
                        name="incident_close_time"
                        type="hidden"
                        value={incidentCloseTime}
                      /> */}
                      <DatePicker
                        label="Incident Date & Time"
                        variant="bordered"
                        hideTimeZone
                        showMonthAndYearPickers
                        hourCycle={24}
                        // defaultValue={now(getLocalTimeZone())}
                        value={date}
                        onChange={setDate}
                        minValue={now(getLocalTimeZone()).subtract({
                          hours: 12,
                        })}
                        maxValue={now(getLocalTimeZone())}
                        isInvalid={!!errors.incident_time?.message}
                        errorMessage={errors?.incident_time?.message?.toString()}
                        isRequired
                      />
                      <Controller
                        name="incident_location"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Input
                            label="Incident Location"
                            {...field}
                            isRequired
                            isInvalid={!!errors.incident_location?.message}
                            errorMessage={errors?.incident_location?.message?.toString()}
                          />
                        )}
                      />
                      {/* <Controller
                        name="category_id"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Select
                            items={data.categories}
                            label="Category"
                            placeholder="Select a category"
                            {...field}
                            isInvalid={!!errors.category_id?.message}
                            errorMessage={errors?.category_id?.message?.toString()}
                          >
                            {(category) => (
                              <SelectItem key={category.id}>
                                {category.name}
                              </SelectItem>
                            )}
                          </Select>
                        )}
                      /> */}

                      <Controller
                        name="reporter_name"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Input
                            label="Reporter Name"
                            {...field}
                            isRequired
                            isInvalid={!!errors.reporter_name?.message}
                            errorMessage={errors?.reporter_name?.message?.toString()}
                          />
                        )}
                      />
                      {/* <Controller
                        name="reporter_dept"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Select
                            items={data.departments}
                            label="Reporter Department"
                            placeholder="Select a department"
                            {...field}
                            isInvalid={!!errors.reporter_dept?.message}
                            errorMessage={errors?.reporter_dept?.message?.toString()}
                          >
                            {(department) => (
                              <SelectItem key={department.id}>
                                {department.name}
                              </SelectItem>
                            )}
                          </Select>
                        )}
                      /> */}
                      <div className="col-span-4">
                        <Controller
                          name="description"
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <Input
                              label="Description"
                              {...field}
                              isRequired
                              isInvalid={!!errors.description?.message}
                              errorMessage={errors?.description?.message?.toString()}
                            />
                          )}
                        />
                      </div>
                      <div className="col-span-4">
                        <Controller
                          name="action"
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <Input
                              label="Action"
                              {...field}
                              isRequired
                              isInvalid={!!errors.action?.message}
                              errorMessage={errors?.action?.message?.toString()}
                            />
                          )}
                        />
                      </div>
                      {/* <DatePicker
                        label="Time Completed"
                        variant="bordered"
                        hideTimeZone
                        showMonthAndYearPickers
                        hourCycle={24}
                        defaultValue={now(getLocalTimeZone())}
                        value={closeTime}
                        onChange={setCloseTime}
                        // minValue={now(getLocalTimeZone()).subtract({ hours: 12 })}
                        minValue={
                          incidentTime
                            ? parseAbsoluteToLocal(incidentTime)
                            : undefined
                        }
                        maxValue={now(getLocalTimeZone())}
                        isInvalid={!!errors.incident_close_time?.message}
                        errorMessage={errors?.incident_close_time?.message?.toString()}
                        isRequired
                      /> */}
                      <Controller
                        name="severity"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Select
                            label="Severity"
                            placeholder="Select severity"
                            {...field}
                            isInvalid={!!errors.severity?.message}
                            errorMessage={errors?.severity?.message?.toString()}
                          >
                            {/* Map over the Severity enum values */}
                            {Object.values(Severity).map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </Select>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button type="submit" color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </Form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
