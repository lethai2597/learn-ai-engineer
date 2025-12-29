export const STORAGE_KEY = "project-ideas-selected-idea";

export const getSelectedProjectIdea = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY);
};

export const projectIdeasData = {
  "personal-knowledge-base": {
    id: "personal-knowledge-base",
    title: "Personal Knowledge Base",
  },
  "product-assistant": {
    id: "product-assistant",
    title: "Trợ lý sản phẩm (Product Assistant)",
  },
  "meeting-notes": {
    id: "meeting-notes",
    title: "Meeting Notes & Action Items",
  },
  "study-coach": {
    id: "study-coach",
    title: "Study Coach (Quiz/Flashcards)",
  },
};

