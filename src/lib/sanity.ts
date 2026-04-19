import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

type SanityImageSource = Parameters<ReturnType<typeof imageUrlBuilder>["image"]>[0];

export const sanityClient = createClient({
  projectId: "k5gqqmtd",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  category?: string;
  tags?: string[];
  coverImage?: SanityImageSource;
  publishedAt: string;
  readingTimeMinutes?: number;
  body?: any[];
}

export interface ResearchPaper {
  _id: string;
  title: string;
  authors: string[];
  abstract: string;
  venue?: string;
  year: number;
  doi?: string;
  arxivId?: string;
  pdfUrl?: string;
  externalUrl?: string;
  bibtex?: string;
  tags?: string[];
  featured?: boolean;
}

export const CATEGORY_LABELS: Record<string, string> = {
  ml: "Machine Learning",
  quantum: "Quantum Computing",
  iiser: "IISER Journey",
  programming: "Programming",
  other: "Other",
};
