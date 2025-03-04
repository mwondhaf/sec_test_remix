import Dexie from "dexie";
import { useLiveQuery } from "dexie-react-hooks";
import {
  CCTVRequest,
  Department,
  Entity,
  Incident,
  IncidentCategory,
  IncidentType,
  PersonInvolved,
} from "types";
import {
  createIncidentSchema,
  departmentSchema,
  entitySchema,
  incidentCategorySchema,
  personInvolvedSchema,
} from "~/form-schemas";
import { incidentTypeSchema } from "~/form-schemas/incident-type";
import { cctvSchema } from "~/form-schemas/requestor";

// Define your Dexie database schema
class CacheDatabase extends Dexie {
  incidents: Dexie.Table<Incident, number>; // Table for incidents
  incident_categories: Dexie.Table<IncidentCategory, number>;
  departments: Dexie.Table<Department, number>;
  incident_types: Dexie.Table<IncidentType, number>;
  people_involved: Dexie.Table<PersonInvolved, number>;
  entities: Dexie.Table<Entity, number>;
  cctv_requests: Dexie.Table<CCTVRequest, number>;

  constructor() {
    super("CacheDatabase");
    this.version(1).stores({
      incidents: "id", // Only need to specify the primary key here
      incident_categories: "id",
      departments: "id",
      incident_types: "id",
      people_involved: "incident_id",
      entities: "id",
      cctv_requests: "id",
    });
    this.incidents = this.table("incidents");
    this.incident_categories = this.table("incident_categories");
    this.departments = this.table("departments");
    this.incident_types = this.table("incident_types");
    this.people_involved = this.table("people_involved");
    this.entities = this.table("entities");
    this.cctv_requests = this.table("cctv_requests");
  }
}

const db = new CacheDatabase();

// Function to get a specific incident by ID
export const getIncidentById = async (id: number) => {
  try {
    const incident = await db.incidents.get(id);
    if (incident) {
      // Validate the retrieved incident against the schema
      createIncidentSchema.parse(incident);
    }
    return incident;
  } catch (error) {
    console.error("Error getting incident from cache:", error);
    return null;
  }
};

// Function to set or update an incident
export const setIncident = async (incident: Incident) => {
  try {
    // Validate the incident before setting it
    createIncidentSchema.parse(incident);
    await db.incidents.put(incident);
  } catch (error) {
    console.error("Error setting incident in cache:", error);
  }
};

// Function to clear an incident by ID
export const clearIncident = async (id: number) => {
  try {
    await db.incidents.delete(id);
  } catch (error) {
    console.error("Error clearing incident from cache:", error);
  }
};

// Function to clear all incidents
export const clearAllIncidents = async () => {
  try {
    await db.incidents.clear();
    console.log("All incidents cleared from cache.");
  } catch (error) {
    console.error("Error clearing all incidents from cache:", error);
  }
};

// Function to set an array of incidents
export const setIncidentsArray = async (incidents: Incident[]) => {
  try {
    // Validate each incident in the array before setting
    incidents.forEach((incident) => createIncidentSchema.parse(incident));
    console.log("settings incidents");

    await db.incidents.bulkPut(incidents);
  } catch (error) {
    console.error("Error setting incidents array in cache:", error);
  }
};

export const getAllIncidents = async (): Promise<Incident[]> => {
  try {
    const allIncidents = useLiveQuery(async () => {
      return await db.incidents.toArray();
    });

    // Validate each incident retrieved from the database
    allIncidents?.forEach((incident) => createIncidentSchema.parse(incident));

    return allIncidents ? allIncidents : [];
  } catch (error) {
    console.error("Error getting all incidents from cache:", error);
    return [];
  }
};

// CATEGORIES
// set categories array
export const setCategoriesArray = async (categories: IncidentCategory[]) => {
  try {
    // Validate each category in the array before setting
    categories.forEach((category) => incidentCategorySchema.parse(category));

    await db.incident_categories.bulkPut(categories);
    console.log("Categories array set in cache.");
  } catch (error) {
    console.error("Error setting categories array in cache:", error);
  }
};

// get all categories
export const getAllCategories = async (): Promise<IncidentCategory[]> => {
  try {
    const allCategories = await db.incident_categories.toArray();

    allCategories?.forEach((category) =>
      incidentCategorySchema.parse(category)
    );
    return allCategories ? allCategories : [];
  } catch (error) {
    console.log(error);

    console.error("Error getting all categories from cache:", error);
    return [];
  }
};
// clear categories
export const clearCategories = async () => {
  try {
    await db.incident_categories.clear();
    console.log("All Categories cleared from cache.");
  } catch (error) {
    console.error("Error clearing all categories from cache:", error);
  }
};

// DEPARTMENTS
// set departments array
export const setDepartmentsArray = async (departments: Department[]) => {
  try {
    // Validate each category in the array before setting
    departments.forEach((department) => departmentSchema.parse(department));

    await db.departments.bulkPut(departments);
    console.log("Departments array set in cache.");
  } catch (error) {
    console.error("Error setting categories array in cache:", error);
  }
};

// get all departments
export const getAllDepartments = async (): Promise<Department[]> => {
  try {
    // const departments = useLiveQuery(async () => {
    const departments = await db.departments.toArray();
    // });

    return departments ? departments : [];
  } catch (error) {
    console.error("Error getting all departments from cache:", error);
    return [];
  }
};

// INCIDENT TYPES
// Function to set an array of incidents
export const setIncidentTypesArray = async (incident_types: IncidentType[]) => {
  try {
    // Validate each incident_type in the array before setting
    incident_types.forEach((incident_type) =>
      incidentTypeSchema.parse(incident_type)
    );

    await db.incident_types.bulkPut(incident_types);
    console.log("Incident Types array set in cache.");
  } catch (error) {
    console.error("Error setting incidents array in cache:", error);
  }
};

export const getIncidentTypes = async (): Promise<IncidentType[]> => {
  try {
    const incident_types = useLiveQuery(async () => {
      return await db.incident_types.toArray();
    });

    // const incident_types = await db.incidents.toArray();
    // Validate each incident retrieved from the database
    incident_types?.forEach((incident) => incidentTypeSchema.parse(incident));
    return incident_types ? incident_types : [];
  } catch (error) {
    console.error("Error getting all incidents from cache:", error);
    return [];
  }
};

// Function to filter incidents by severity
export const getIncidentsBySeverity = async (
  severity: "Low" | "Medium" | "High"
): Promise<Incident[]> => {
  try {
    const incidents = await db.incidents
      .where("severity")
      .equals(severity)
      .toArray();
    incidents.forEach((incident) => createIncidentSchema.parse(incident));
    return incidents;
  } catch (error) {
    console.error("Error getting incidents by severity from cache:", error);
    return [];
  }
};

// Function to filter incidents by query
export const filterIncidentsByQuery = async (
  query: string | number,
  severity?: "Low" | "Medium" | "High"
): Promise<Incident[]> => {
  try {
    const incidents = await db.incidents.toArray();

    const filteredIncidents = incidents.filter((incident) => {
      if (!isNaN(Number(query))) {
        return incident.id === Number(query);
      } else if (typeof query === "string") {
        return (
          incident.description?.toLowerCase().includes(query.toLowerCase()) ||
          incident.action?.toLowerCase().includes(query.toLowerCase())
        );
      }
      return false;
    });

    filteredIncidents.forEach((incident) =>
      createIncidentSchema.parse(incident)
    );

    return filteredIncidents;
  } catch (error) {
    console.error("Error filtering incidents by query:", error);
    return [];
  }
};

// PEOPLE INVOLVED
// Function to set an array of incidents
export const setPeopleInvolvedArray = async (people: PersonInvolved[]) => {
  try {
    // Validate each incident in the array before setting
    people.forEach((person) => personInvolvedSchema.parse(person));

    await db.people_involved.bulkPut(people);
  } catch (error) {
    console.error("Error setting incidents array in cache:", error);
  }
};

export const getPeopleInvolvedByIncidentId = async (
  incidentId: number
): Promise<PersonInvolved[]> => {
  try {
    const peopleInvolved = await db.people_involved
      .where("incident_id")
      .equals(incidentId)
      .toArray();
    peopleInvolved.forEach((person) => personInvolvedSchema.parse(person));

    return peopleInvolved;
  } catch (error) {
    console.error(
      "Error getting people involved by incident ID from cache:",
      error
    );
    return [];
  }
};

// ENTITIES
// Function to set an array of incidents
export const setEntitiesArray = async (entities: Entity[]) => {
  try {
    // Validate each incident in the array before setting
    entities.forEach((entity) => entitySchema.parse(entity));

    await db.entities.bulkPut(entities);
  } catch (error) {
    console.error("Error setting entities array in cache:", error);
  }
};

// get all categories
export const getAllEntities = async (): Promise<Entity[]> => {
  try {
    const entities = await db.entities.toArray();

    entities?.forEach((entity) => entitySchema.parse(entity));

    return entities ? entities : [];
  } catch (error) {
    console.error("Error getting all entities from cache:", error);
    return [];
  }
};

// CCTV REQUESTS
export const setCCTVRequestsArray = async (requests: CCTVRequest[]) => {
  try {
    // departments.forEach((department) => departmentSchema.parse(department));
    requests.forEach((request) => cctvSchema.parse(request));
    await db.cctv_requests.bulkPut(requests);
  } catch (error) {
    console.error("Error setting CCTV requests array in cache:", error);
  }
};

// get cctv requests
export const getCCTVRequests = async (): Promise<CCTVRequest[]> => {
  try {
    const requests = await db.cctv_requests.toArray();
    requests.forEach((request) => cctvSchema.parse(request));
    return requests;
  } catch (error) {
    console.error("Error getting all CCTV requests from cache:", error);
    return [];
  }
};
