import { SortDescriptor } from "@nextui-org/react";

export interface Column {
  name: string;
  uid: string;
  sortable?: boolean;
}

export type TableContentProps = {
  headerColumns: Column[];
  page: number;
  pages: number;
  setPage: (page: number) => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
  isLoading: boolean;
  sortDescriptor?: SortDescriptor;
  setSortDescriptor?: (sortDescriptor: SortDescriptor) => void;
  isError?: boolean;
  error?: Error | null;
};
