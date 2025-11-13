import PageTemplate from "../components/PageTemplate";
import { ThemedSection } from "../components/themed";

export default function ContactPage() {
  return (
    <PageTemplate>
      <ThemedSection title="Contact Information">
        <p>Email: <span className="text-primary font-semibold">support@medimind.com</span></p>
        <p>Phone: +1 (555) 123-4567</p>
        <p>Address: 123 Healthcare Ave</p>
      </ThemedSection>

      <ThemedSection title="Send Us a Message">
        <form className="grid gap-4">
          <input className="border border-border bg-input p-3 rounded-md" placeholder="Your name" />
          <input className="border border-border bg-input p-3 rounded-md" placeholder="Your email" />
          <textarea className="border border-border bg-input p-3 rounded-md" placeholder="Your message..." />

          <button className="bg-primary text-primary-foreground px-6 py-3 rounded-md">
            Send Message
          </button>
        </form>
      </ThemedSection>
    </PageTemplate>
  );
}
