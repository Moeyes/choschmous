import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/src/components/ui/table";
import { Badge } from "@/src/components/ui/badge";
import surveys from "@/src/data/mock/surveys.json";
import organizations from "@/src/data/mock/organizations.json";
import events from "@/src/data/mock/events.json";
import { RegistrationTopBar } from "@/src/features/registration/components/layout/RegistrationTopBar";

// TypeScript types
import type { Survey } from "@/src/types/survey";

// previously defined inline, now imported from types

type Organization = {
  id: string;
  name: string;
};
type Event = {
  id: string;
  sports: { id: string; name: string }[];
};

const typedSurveys = surveys as Survey[];
const typedOrganizations = organizations as Organization[];
const typedEvents = events as Event[];

// Get all sports from the first event (mock assumption)
const sports = typedEvents[0]?.sports || [];

// Helper: Map org id to name
const orgMap = Object.fromEntries(
  typedOrganizations.map((o) => [o.id, o.name]),
);

// Compute vote counts and participants per sport
const sportStats = sports.map((sport) => {
  const votes = typedSurveys.filter((s) => s.sport_id === sport.id);
  const voteCount = new Set(votes.map((v) => v.organization_id)).size;
  const totalParticipants = votes.reduce(
    (sum, v) => sum + v.estimated_participants,
    0,
  );
  return {
    id: sport.id,
    name: sport.name,
    voteCount,
    totalParticipants,
    status: voteCount >= 5 ? "active" : "inactive",
  };
});

// Summary cards
const totalSurveyResponses = typedSurveys.length;
const totalActiveSports = sportStats.filter(
  (s) => s.status === "active",
).length;
const totalBelowThreshold = sportStats.filter(
  (s) => s.status === "inactive",
).length;
const totalEstimatedParticipants = typedSurveys.reduce(
  (sum, s) => sum + s.estimated_participants,
  0,
);

export default function SurveyDashboardPage() {
  return (
    <>
      <RegistrationTopBar />
      <div className="space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Survey Responses</CardTitle>
              <CardDescription>All submitted survey entries</CardDescription>
            </CardHeader>
            <CardContent className="text-3xl font-bold">
              {totalSurveyResponses}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Active Sports</CardTitle>
              <CardDescription>Sports with ≥5 votes</CardDescription>
            </CardHeader>
            <CardContent className="text-3xl font-bold">
              {totalActiveSports}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Sports Below Threshold</CardTitle>
              <CardDescription>Sports with &lt;5 votes</CardDescription>
            </CardHeader>
            <CardContent className="text-3xl font-bold">
              {totalBelowThreshold}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Estimated Participants</CardTitle>
              <CardDescription>Sum of all survey estimates</CardDescription>
            </CardHeader>
            <CardContent className="text-3xl font-bold">
              {totalEstimatedParticipants}
            </CardContent>
          </Card>
        </div>

        {/* Sport Vote Table */}
        <Card>
          <CardHeader>
            <CardTitle>Sport Vote Table</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sport</TableHead>
                  <TableHead>Vote Count</TableHead>
                  <TableHead>Total Participants</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sportStats.map((sport) => (
                  <TableRow key={sport.id}>
                    <TableCell>{sport.name}</TableCell>
                    <TableCell>{sport.voteCount}</TableCell>
                    <TableCell>{sport.totalParticipants}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          sport.status === "active" ? "default" : "destructive"
                        }
                      >
                        {sport.status === "active"
                          ? "🟢 Active"
                          : "🔴 Inactive"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
