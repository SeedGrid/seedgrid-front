import { SgClockShowcaseClient } from "./sg-clock-showcase-client";

export default function SgClockPage() {
  const initialServerTime = new Date().toISOString();
  return <SgClockShowcaseClient initialServerTime={initialServerTime} />;
}
