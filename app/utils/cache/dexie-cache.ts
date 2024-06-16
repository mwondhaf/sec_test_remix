import Dexie from "dexie";
import { Incident } from "types";
import { createIncidentSchema } from "~/form-schemas";

// Define your Dexie database schema
class CacheDatabase extends Dexie {
  incidents: Dexie.Table<Incident, number>; // Table for incidents

  constructor() {
    super("CacheDatabase");
    this.version(1).stores({
      incidents: "id", // Only need to specify the primary key here
    });
    this.incidents = this.table("incidents");
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

    await db.incidents.bulkPut(incidents);
    console.log("Incidents array set in cache.");
  } catch (error) {
    console.error("Error setting incidents array in cache:", error);
  }
};

export const getAllIncidents = async (): Promise<Incident[]> => {
  try {
    const allIncidents = await db.incidents.toArray();
    // Validate each incident retrieved from the database
    allIncidents.forEach((incident) => createIncidentSchema.parse(incident));
    return allIncidents;
  } catch (error) {
    console.error("Error getting all incidents from cache:", error);
    return [];
  }
};
