export type Work = {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  cover: string;
  category: string;
  tags: string[];
  year?: number;
  href?: string;
  createdAt?: string;
  updatedAt?: string;
};