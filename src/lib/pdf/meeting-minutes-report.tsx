import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import type { StructuredMinutes } from "@/lib/meeting-minutes";

const styles = StyleSheet.create({
  page: { padding: 28, fontSize: 10, color: "#0f172a", lineHeight: 1.4 },
  h1: { fontSize: 16, fontWeight: 700, marginBottom: 4 },
  meta: { fontSize: 9, color: "#475569", marginBottom: 12 },
  section: { marginBottom: 14 },
  sectionTitle: { fontSize: 11, fontWeight: 700, marginBottom: 4 },
  label: { fontSize: 8, color: "#64748b", marginTop: 4 },
  body: { fontSize: 10 },
});

export type MeetingMinutesPdfInput = {
  committeeName: string;
  meetingTitle: string;
  scheduledAt: string;
  location: string;
  publishedAt: string;
  secretaryName: string;
  attendees: string[];
  summary: string;
  structured: StructuredMinutes;
};

function MinutesDoc(input: MeetingMinutesPdfInput) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>Meeting Minutes</Text>
        <Text style={styles.meta}>
          {input.committeeName} / {input.meetingTitle}
        </Text>
        <Text style={styles.meta}>
          {input.scheduledAt} / {input.location}
        </Text>
        <Text style={styles.meta}>
          Published {input.publishedAt} / Secretary: {input.secretaryName}
        </Text>

        {input.attendees.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Attendees present</Text>
            <Text style={styles.body}>{input.attendees.join(", ")}</Text>
          </View>
        ) : null}

        {input.structured.agenda_items.map((item) => (
          <View key={item.order} style={styles.section}>
            <Text style={styles.sectionTitle}>
              {item.order}. {item.topic}
            </Text>
            {item.speaker ? (
              <>
                <Text style={styles.label}>Speaker</Text>
                <Text style={styles.body}>{item.speaker}</Text>
              </>
            ) : null}
            {item.time_noted ? (
              <>
                <Text style={styles.label}>Time noted</Text>
                <Text style={styles.body}>{item.time_noted}</Text>
              </>
            ) : null}
            {item.discussion ? (
              <>
                <Text style={styles.label}>Discussion</Text>
                <Text style={styles.body}>{item.discussion}</Text>
              </>
            ) : null}
            {item.decisions ? (
              <>
                <Text style={styles.label}>Decisions</Text>
                <Text style={styles.body}>{item.decisions}</Text>
              </>
            ) : null}
            {item.action_items ? (
              <>
                <Text style={styles.label}>Action items</Text>
                <Text style={styles.body}>{item.action_items}</Text>
              </>
            ) : null}
          </View>
        ))}

        {input.structured.closing_notes ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Closing notes</Text>
            <Text style={styles.body}>{input.structured.closing_notes}</Text>
          </View>
        ) : null}

        {input.summary ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.body}>{input.summary}</Text>
          </View>
        ) : null}
      </Page>
    </Document>
  );
}

export async function buildMeetingMinutesPdf(input: MeetingMinutesPdfInput) {
  return renderToBuffer(<MinutesDoc {...input} />);
}
