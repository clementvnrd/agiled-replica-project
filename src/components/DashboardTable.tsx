
import React from 'react';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DashboardTableProps {
  title: string;
  columns: { key: string; label: string }[];
  data: Array<any>;
  emptyMessage?: string;
}

const DashboardTable: React.FC<DashboardTableProps> = ({ 
  title, 
  columns, 
  data,
  emptyMessage = "No data available in table"
}) => {
  return (
    <div className="agiled-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        
        <div className="flex items-center text-sm">
          <span className="mr-2">Show</span>
          <select className="border border-agiled-lightBorder rounded-md px-2 py-1 mr-2">
            <option>10</option>
            <option>25</option>
            <option>50</option>
            <option>100</option>
          </select>
          <span>entries</span>
        </div>
      </div>
      
      <div className="border border-agiled-lightBorder rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className="bg-gray-50 hover:bg-gray-100">
                  {column.label}
                  <span className="inline-block ml-1 text-agiled-lightText">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 2.5L7.5 5H2.5L5 2.5Z" fill="currentColor"/>
                      <path d="M5 7.5L2.5 5L7.5 5L5 7.5Z" fill="currentColor"/>
                    </svg>
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((row, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>{row[column.key]}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8 text-agiled-lightText">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between mt-4 text-sm">
        <div>
          {data.length > 0 
            ? `Showing 1 to ${data.length} of ${data.length} entries`
            : `Showing 0 to 0 of 0 entries`
          }
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 border border-agiled-lightBorder rounded-md disabled:opacity-50" disabled={true}>
            <ChevronLeft size={16} />
            <span className="sr-only">Previous</span>
          </button>
          <button className="px-3 py-1 border border-agiled-lightBorder rounded-md disabled:opacity-50" disabled={true}>
            <ChevronRight size={16} />
            <span className="sr-only">Next</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardTable;
