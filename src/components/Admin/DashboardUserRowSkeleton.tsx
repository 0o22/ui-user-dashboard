import { TableCell, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardUserRowSkeleton() {
  return (
    <TableRow>
      <TableCell className="table-cell">
        <div className="flex h-10 w-full items-center justify-center">
          <Skeleton className="h-6 w-6" />
        </div>
      </TableCell>

      <TableCell className="table-cell">
        <div className="flex h-10 w-full items-center justify-center">
          <Skeleton className="h-6 w-14" />
        </div>
      </TableCell>

      <TableCell className="hidden md:table-cell">
        <div className="flex h-10 w-full items-center justify-center">
          <Skeleton className="h-6 w-6" />
        </div>
      </TableCell>

      <TableCell className="hidden md:table-cell">
        <div className="flex h-10 w-full items-center justify-center">
          <Skeleton className="h-6 w-6" />
        </div>
      </TableCell>

      <TableCell className="hidden md:table-cell">
        <div className="flex h-10 w-full items-center justify-center">
          <Skeleton className="h-6 w-24" />
        </div>
      </TableCell>

      <TableCell className="hidden md:table-cell">
        <div className="flex h-10 w-full items-center justify-center">
          <Skeleton className="h-6 w-44" />
        </div>
      </TableCell>

      <TableCell className="table-cell">
        <div className="flex h-10 w-full items-center justify-center">
          <Skeleton className="h-6 w-6" />
        </div>
      </TableCell>
    </TableRow>
  );
}
