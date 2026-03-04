import { SgClockShowcaseClient } from "./sg-clock-showcase-client";
import I18NReady from "../../I18NReady";

export default function SgClockPage() {
  const initialServerTime = new Date().toISOString();
  return (
    <I18NReady>
      <SgClockShowcaseClient initialServerTime={initialServerTime} />
    </I18NReady>
  );
}
