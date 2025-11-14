import { describe, it, expect, vi } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  deleteActionLabel,
  shouldSyncInputValue,
  restoreCaretOnFocus,
} from "../app-shared.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const htmlPath = path.join(projectRoot, "input.html");

describe("Tooltip semantics", () => {
  it("uses the shared deleteActionLabel for both tooltip text and aria-label", () => {
    const html = readFileSync(htmlPath, "utf8");
    expect(deleteActionLabel).toBe("Delete current item");
    expect(html).toContain("title={deleteActionLabel}");
    expect(html).toContain("aria-label={deleteActionLabel}");
  });
});

describe("Autocomplete focus helpers", () => {
  it("allows blur-driven syncs so controlled inputs keep their caret", () => {
    expect(shouldSyncInputValue("blur")).toBe(true);
  });

  it("ignores unrelated programmatic reasons to avoid unnecessary updates", () => {
    expect(shouldSyncInputValue("programmatic")).toBe(false);
  });

  it("restores the caret to the end of the current value when focused", () => {
    vi.useFakeTimers();
    const mockInput = {
      value: "Option B",
      selectionStart: 0,
      selectionEnd: 0,
      setSelectionRange(start, end) {
        this.selectionStart = start;
        this.selectionEnd = end;
      },
    };

    global.document = { activeElement: mockInput };

    restoreCaretOnFocus(mockInput);
    vi.runAllTimers();

    expect(mockInput.selectionStart).toBe(mockInput.value.length);
    expect(mockInput.selectionEnd).toBe(mockInput.value.length);

    vi.useRealTimers();
    delete global.document;
  });

  it("does not move the caret when the element is no longer active", () => {
    vi.useFakeTimers();
    const mockInput = {
      value: "Option B",
      selectionStart: 0,
      selectionEnd: 0,
      setSelectionRange(start, end) {
        this.selectionStart = start;
        this.selectionEnd = end;
      },
    };

    global.document = { activeElement: null };

    restoreCaretOnFocus(mockInput);
    vi.runAllTimers();

    expect(mockInput.selectionStart).toBe(0);
    expect(mockInput.selectionEnd).toBe(0);

    vi.useRealTimers();
    delete global.document;
  });
});
