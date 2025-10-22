export class ReportListRESP {
  id: number;
  type: string;
  description: string;
  status: string;
  resolution: string;
  reporter: {
    id: number;
    name: string;
  };
  createdAt: string;
}
