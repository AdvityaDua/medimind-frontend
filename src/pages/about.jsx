import PageTemplate from "../components/PageTemplate";
import { ThemedSection } from "../components/themed";

export default function AboutPage() {
  return (
    <PageTemplate>
      <ThemedSection title="Our Mission">
        MediMind uses AI to improve pharmacy inventory management
        and reduce global pharmaceutical waste.
      </ThemedSection>

      <ThemedSection title="Why We Exist">
        <ul className="list-disc pl-6 space-y-2">
          <li>Reduce pharmaceutical waste</li>
          <li>Support data-driven decision making</li>
          <li>Improve supplier-pharmacy collaboration</li>
          <li>Enhance medicine accessibility</li>
        </ul>
      </ThemedSection>
    </PageTemplate>
  );
}
