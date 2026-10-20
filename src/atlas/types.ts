export type RecordItem = {
  id: string;
  title?: string;
  name?: string;
  year?: number | string;
  num?: number;
  [key: string]: string | number | boolean | (string | number)[] | undefined;
};
export type AtlasData = {
  schemaVersion: number;
  prepared: boolean;
  refs: RecordItem[];
  blocks: RecordItem[];
  papers: RecordItem[];
  researchWatch: RecordItem[];
  scientificWatch?: {
    updatedAt?: string;
    sourceFile?: string;
    metrics?: Partial<
      Record<
        | 'totalBibEntries'
        | 'verifiedPrimaryNotices'
        | 'priorityDossiers'
        | 'openQuestions',
        number
      >
    >;
    openQuestionsMatrix?: {
      id: string;
      question: string;
      papers: string[];
      readings: string[];
      extract?: string;
      deliverable?: string;
    }[];
  };
};
