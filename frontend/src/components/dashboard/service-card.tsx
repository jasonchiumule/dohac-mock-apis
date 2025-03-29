import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HealthcareService, ComplianceStatus } from '@/types';
import { complianceStatusToString, getComplianceBadgeVariant } from '@/lib/utils';

interface ServiceCardProps {
  service: HealthcareService;
  qualityStatus: ComplianceStatus;
  nurseStatus: ComplianceStatus;
  nextReportingDue: string;
  daysRemaining: number;
  onSelect?: () => void;
}

export function ServiceCard({
  service,
  qualityStatus,
  nurseStatus,
  nextReportingDue,
  daysRemaining,
  onSelect,
}: ServiceCardProps) {
  const isUrgent = daysRemaining <= 7;

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onSelect}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{service.name}</CardTitle>
          <Badge variant={getComplianceBadgeVariant(qualityStatus.status)}>
            {complianceStatusToString(qualityStatus.status)}
          </Badge>
        </div>
        <div className="text-sm text-gray-500">{service.type}</div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <div className="font-medium">Quality Indicators</div>
              <div className="text-gray-500">{qualityStatus.percentage.toFixed(0)}% compliant</div>
            </div>
            <div>
              <div className="font-medium">Nurse Staffing</div>
              <div className="text-gray-500">{nurseStatus.percentage.toFixed(0)}% compliant</div>
            </div>
          </div>
          
          <div className="pt-2">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium">Next Report Due</div>
              <Badge 
                variant={isUrgent ? "destructive" : "outline"}
                className={isUrgent ? "" : "bg-gray-100"}
              >
                {isUrgent ? `${daysRemaining} days left` : nextReportingDue}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
