import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 10, color: "#12141a", fontFamily: "Helvetica" },
  letterhead: {
    borderBottom: "2 solid #1f6fd4",
    paddingBottom: 12,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  org: { fontSize: 14, fontWeight: 700, color: "#0c2447" },
  sub: { fontSize: 9, color: "#555d6e", marginTop: 2 },
  h1: { fontSize: 13, fontWeight: 700, marginBottom: 4 },
  block: { marginBottom: 14 },
  label: { fontSize: 8, color: "#555d6e", textTransform: "uppercase", marginBottom: 2 },
  note: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "#f3f9ff",
    border: "1 solid #c2e0ff",
    fontSize: 9,
    color: "#184a8c",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottom: "1 solid #1f6fd4",
    paddingBottom: 4,
    marginTop: 8,
  },
  row: { flexDirection: "row", borderBottom: "1 solid #ebe8e1", paddingVertical: 5 },
  colDate: { width: "14%" },
  colTitle: { width: "28%" },
  colCat: { width: "14%" },
  colLoc: { width: "18%" },
  colType: { width: "14%" },
  colHours: { width: "12%", textAlign: "right" },
  totalRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#12141a",
    color: "#ffffff",
    padding: 8,
  },
  sigRow: { marginTop: 28, flexDirection: "row", justifyContent: "space-between" },
  sigBlock: { width: "45%" },
  sigLine: { marginTop: 28, borderTop: "1 solid #b4bac6", paddingTop: 4 },
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
  const runningTotal = input.activities.reduce((sum, a) => sum + a.hours, 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.letterhead}>
          <View>
            <Text style={styles.org}>International Open University</Text>
            <Text style={styles.sub}>Community Service Report · Student Committee logbook</Text>
            <Text style={styles.sub}>Period: {input.reportPeriod}</Text>
          </View>
          <View>
            <Text style={{ fontSize: 11, fontWeight: 700 }}>{input.committeeName}</Text>
            <Text style={styles.sub}>{input.committeeLocation}</Text>
          </View>
        </View>

        <View style={styles.block}>
          <Text style={styles.h1}>Member</Text>
          <Text>{input.memberName}</Text>
          <Text style={styles.sub}>
            Role: {input.memberRole} · Joined: {input.joinedDate}
          </Text>
          <Text style={styles.sub}>
            Attendance: {input.attendanceRate.toFixed(1)}% · Status: {input.memberStatus}
          </Text>
          <Text style={styles.sub}>
            Semester claimed hours (system): {input.totalHours.toFixed(2)}
          </Text>
          <View style={styles.note}>
            <Text>
              Review note: Final community service approval is completed by IOU outside SCOS. This
              PDF is the local Student Committee submission record.
            </Text>
          </View>
        </View>

        <Text style={styles.h1}>Claimed activities</Text>
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
            <Text>No claimed activities were recorded for this reporting period.</Text>
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

        <View style={styles.totalRow}>
          <Text>Running total (this report)</Text>
          <Text>{runningTotal.toFixed(2)} hours</Text>
        </View>

        <View style={styles.sigRow}>
          <View style={styles.sigBlock}>
            <View style={styles.sigLine}>
              <Text>{input.chairName}</Text>
              <Text style={styles.sub}>SC Chair signature / date</Text>
            </View>
          </View>
          <View style={styles.sigBlock}>
            <View style={styles.sigLine}>
              <Text>{input.secretaryName}</Text>
              <Text style={styles.sub}>SC Secretary signature / date</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export async function buildCommunityServiceReport(input: ReportInput) {
  return renderToBuffer(ReportDoc(input));
}
