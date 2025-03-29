import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ServiceCompliance } from '@/types';
import { complianceStatusToString, formatDate, getComplianceBadgeVariant } from '@/lib/utils';

interface ServiceTableProps {
  services: ServiceCompliance[];
  onServiceSelect: (serviceId: string) => void;
}

export function ServiceTable({ services, onServiceSelect }: ServiceTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service Name</TableHead>
            <TableHead>Quality Status</TableHead>
            <TableHead>Nurse Status</TableHead>
            <TableHead>Last Reported</TableHead>
            <TableHead>Next Due</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow 
              key={service.service.serviceId} 
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => onServiceSelect(service.service.serviceId)}
            >
              <TableCell className="font-medium">{service.service.name}</TableCell>
              <TableCell>
                <div className="space-y-1">
                  <Badge variant={getComplianceBadgeVariant(service.qualityStatus.status)}>
                    {complianceStatusToString(service.qualityStatus.status)}
                  </Badge>
                  <div className="w-full max-w-32">
                    <Progress value={service.qualityStatus.percentage} className="h-2" />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <Badge variant={getComplianceBadgeVariant(service.nurseStatus.status)}>
                    {complianceStatusToString(service.nurseStatus.status)}
                  </Badge>
                  <div className="w-full max-w-32">
                    <Progress value={service.nurseStatus.percentage} className="h-2" />
                  </div>
                </div>
              </TableCell>
              <TableCell>{formatDate(service.reportingStatus.lastReported)}</TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div>{formatDate(service.reportingStatus.nextDue)}</div>
                  <div className="text-sm text-gray-500">
                    {service.reportingStatus.daysRemaining <= 0
                      ? 'Overdue'
                      : service.reportingStatus.daysRemaining === 1
                      ? '1 day left'
                      : `${service.reportingStatus.daysRemaining} days left`}
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
