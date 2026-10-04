import { useEffect } from "react";
import { formatDocumentTitle } from "../lib/pageTitles";

/** Sets `document.title` for the current page. Pass a custom title to override the route default. */
export default function useDocumentTitle(title?: string | null) {
  useEffect(() => {
    if (title == null) return;
    document.title = formatDocumentTitle(title);
  }, [title]);
}
