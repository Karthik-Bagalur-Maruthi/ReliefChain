import NetInfo from "@react-native-community/netinfo";
import { createIncident } from "./incidentService";
import { deleteOfflineReport, getOfflineReports } from "./offlineDB";

type OfflineReport = {
  id: number;
  disasterType: string;
  severity: string;
  resources: string;
};

let isSyncing = false;

export const syncOfflineReports = async () => {
  if (isSyncing) return;

  const networkState = await NetInfo.fetch();

  if (!networkState.isConnected || !networkState.isInternetReachable) {
    console.log("No internet. Auto-sync skipped.");
    return;
  }

  const reports = getOfflineReports() as OfflineReport[];

  if (reports.length === 0) {
    console.log("No offline reports to sync.");
    return;
  }

  try {
    isSyncing = true;

    for (const report of reports) {
      await createIncident({
        disasterType: report.disasterType,
        severity: report.severity,
        resources: report.resources,
      });

      deleteOfflineReport(report.id);
    }

    console.log("Auto-sync complete:", reports.length, "reports synced");
  } catch (error) {
    console.log("Auto-sync failed:", error);
  } finally {
    isSyncing = false;
  }
};
