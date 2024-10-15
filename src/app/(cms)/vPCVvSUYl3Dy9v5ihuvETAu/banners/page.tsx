"use client";
import TableActions from "@/app/components/banners/table-actions";
import TableContent from "@/app/components/banners/table-content";
import RowsPerPageControl from "@/app/components/rows-per-page-control";
import SearchBar from "@/app/components/search-bar";
import { columns } from "@/app/data/banners/data";
import { useGet } from "@/app/lib/fetcher";
import { SortDescriptor } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";

export default function BannersPage() {
  const [filterValue, setFilterValue] = useState("");
  const visibleColumns = "all";
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "createdAt",
    direction: "descending",
  });
  const [page, setPage] = useState(1);

  const fetchBanners = async ({
    queryKey,
  }: {
    queryKey: [string, number, number, string, SortDescriptor];
  }) => {
    const [, page, rowsPerPage, filterValue, sortDescriptor] = queryKey;
    const queryString = `page=${page}&limit=${rowsPerPage}&title=${filterValue}&sortBy=${sortDescriptor.column}&sortOrder=${sortDescriptor.direction === "ascending" ? "asc" : "desc"}`;
    return useGet(`/api/banners?${queryString}`);
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["banners", page, rowsPerPage, filterValue, sortDescriptor],
    queryFn: fetchBanners,
    staleTime: 5000,
  });

  const banners = data?.data ?? [];

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [],
  );

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  return (
    <div className="p-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-end justify-between gap-3">
            <SearchBar
              filterValue={filterValue}
              onSearchChange={setFilterValue}
              onClear={() => setFilterValue("")}
              placeholder="Search by title..."
            />
            <TableActions />
          </div>
          <RowsPerPageControl
            totalItems={data?.pagination?.totalRecords}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={onRowsPerPageChange}
            placeholder="banners"
          />
        </div>
        <TableContent
          sortedItems={banners ?? []}
          headerColumns={headerColumns ?? []}
          page={page}
          pages={data?.pagination?.totalPages}
          setPage={setPage}
          onNextPage={() =>
            setPage((prev) => Math.min(prev + 1, data?.pagination?.totalPages))
          }
          onPreviousPage={() => setPage((prev) => Math.max(prev - 1, 1))}
          isLoading={isLoading}
          sortDescriptor={sortDescriptor}
          setSortDescriptor={setSortDescriptor}
          isError={isError}
          error={error}
        />
      </div>
    </div>
  );
}
