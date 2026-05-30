import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 28, fontSize: 11, color: "#0f172a" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  h1: { fontSize: 16, fontWeight: 700 },
  block: { marginBottom: 12 },
  label: { fontSize: 10, color: "#334155" },
  tableHeader: { flexDirection: "row", borderBottom: "1 solid #cbd5e1", paddingBottom: 4 },
  row: { flexDirection: "row", borderBottom: "1 solid #e2e8f0", paddingVertical: 4 },
  colDate: { width: "16%" },
  colTitle: { width: "24%" },
  colCat: { width: "16%" },
  colLoc: { width: "20%" },
  colType: { width: "12%" },
  colHours: { width: "12%", textAlign: "right" },
  sigRow: { marginTop: 24, flexDirection: "row", justifyContent: "space-between" },
});

type ReportInput = {
  memberName: string;
  memberRole: string;
  joinedDate: string;
  committeeName: string;
  committeeLocation: string;
  reportPeriod: string;
  attendanceRate: number;
  totalHours: number;
  memberStatus: string;
  chairName: string;
  secretaryName: string;
  activities: Array<{
    date: string;
    title: string;
    category: string;
    location: string;
    participationType: string;
    hours: number;
  }>;
};

function ReportDoc(input: ReportInput) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.h1}>International Open University</Text>
            <Text>Community Service Report</Text>
            <Text>Period: {input.reportPeriod}</Text>
          </View>
          <View>
            <Text>{input.committeeName}</Text>
            <Text>{input.committeeLocation}</Text>
          </View>
        </View>

        <View style={styles.block}>
          <Text style={styles.label}>Member</Text>
          <Text>{input.memberName}</Text>
          <Text>Role: {input.memberRole}</Text>
          <Text>Joined: {input.joinedDate}</Text>
          <Text>Attendance Rate: {input.attendanceRate.toFixed(2)}%</Text>
          <Text>Total Claimed Hours: {input.totalHours.toFixed(2)}</Text>
          <Text>Status: {input.memberStatus}</Text>
          <Text>Review Note: Final approval is completed by IOU outside SCOS.</Text>
        </View>

        <View style={styles.tableHeader}>
          <Text style={styles.colDate}>Date</Text>
          <Text style={styles.colTitle}>Activity</Text>
          <Text style={styles.colCat}>Category</Text>
          <Text style={styles.colLoc}>Location</Text>
          <Text style={styles.colType}>Type</Text>
          <Text style={styles.colHours}>Hours</Text>
        </View>
        {input.activities.length === 0 ? (
          <View style={styles.row}>
            <Text>No approved activities were recorded for this reporting period.</Text>
          </View>
        ) : (
          input.activities.map((a, index) => (
            <View key={`${a.title}-${index}`} style={styles.row}>
              <Text style={styles.colDate}>{a.date}</Text>
              <Text style={styles.colTitle}>{a.title}</Text>
              <Text style={styles.colCat}>{a.category}</Text>
              <Text style={styles.colLoc}>{a.location}</Text>
              <Text style={styles.colType}>{a.participationType}</Text>
              <Text style={styles.colHours}>{a.hours.toFixed(2)}</Text>
            </View>
          ))
        )}

        <View style={styles.sigRow}>
          <View>
            <Text>________________________</Text>
            <Text>{input.chairName}</Text>
            <Text>SC Chair</Text>
          </View>
          <View>
            <Text>________________________</Text>
            <Text>{input.secretaryName}</Text>
            <Text>SC Secretary</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export async function buildCommunityServiceReport(input: ReportInput) {
  return renderToBuffer(ReportDoc(input));
}
