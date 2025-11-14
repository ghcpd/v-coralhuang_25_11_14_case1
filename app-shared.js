export const deleteActionLabel = "Delete current item";

const ACCEPTED_REASONS = new Set(["input", "reset", "clear", "blur"]);

export function shouldSyncInputValue(reason) {
  return reason == null || ACCEPTED_REASONS.has(reason);
}

function getScheduler() {
  if (typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") {
    return (callback) => window.requestAnimationFrame(callback);
  }
  return (callback) => setTimeout(callback, 16);
}

export function restoreCaretOnFocus(inputElement) {
  if (!inputElement || typeof inputElement.setSelectionRange !== "function") {
    return;
  }

  const activeDoc = typeof document !== "undefined" ? document : null;
  const schedule = getScheduler();

  schedule(() => {
    const isActiveElement = activeDoc
      ? activeDoc.activeElement === inputElement
      : true;
    if (!isActiveElement) {
      return;
    }
    const valueLength = inputElement.value?.length ?? 0;
    inputElement.setSelectionRange(valueLength, valueLength);
  });
}

const shared = {
  deleteActionLabel,
  shouldSyncInputValue,
  restoreCaretOnFocus,
};

if (typeof window !== "undefined") {
  window.AppShared = shared;
}

export default shared;
