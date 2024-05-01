import { TableCell, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardUserRowSkeleton() {
  return (
    <TableRow>
      <TableCell className="table-cell">
        <div className="w-full h-10 flex items-center justify-center">
          <Skeleton className="h-6 w-6" />
        </div>
      </TableCell>

      <TableCell className="table-cell">
        <div className="w-full h-10 flex items-center justify-center">
          <Skeleton className="w-14 h-6" />
        </div>
      </TableCell>

      <TableCell className="hidden md:table-cell">
        <div className="w-full h-10 flex items-center justify-center">
          <Skeleton className="w-6 h-6" />
        </div>
      </TableCell>

      <TableCell className="hidden md:table-cell">
        <div className="w-full h-10 flex items-center justify-center">
          <Skeleton className="w-6 h-6" />
        </div>
      </TableCell>

      <TableCell className="hidden md:table-cell">
        <div className="w-full h-10 flex items-center justify-center">
          <Skeleton className="w-24 h-6" />
        </div>
      </TableCell>

      <TableCell className="hidden md:table-cell">
        <div className="w-full h-10 flex items-center justify-center">
          <Skeleton className="w-44 h-6" />
        </div>
      </TableCell>

      <TableCell className="table-cell">
        <div className="w-full h-10 flex items-center justify-center">
          <Skeleton className="w-6 h-6" />
        </div>
      </TableCell>
    </TableRow>
  );
}
