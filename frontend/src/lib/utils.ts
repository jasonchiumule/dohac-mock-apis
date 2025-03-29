import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { ComplianceStatus, NurseAttendanceRecord, QualityIndicator } from "../types";
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to calculate the compliance status based on quality indicators
export function calculateQualityCompliance(indicator: QualityIndicator): ComplianceStatus {
  const { indicators } = indicator;
  const categories = [
    indicators.pressureInjuries,
    indicators.physicalRestraint,
    indicators.unplannedWeightLoss,
    indicators.fallsMajorInjury,
    indicators.medicationManagement
  ];
  
  // Calculate compliance percentage based on how many indicators meet their targets
  const compliantCount = categories.filter(cat => cat.value <= cat.target).length;
  const percentage = (compliantCount / categories.length) * 100;
  
  let status: 'compliant' | 'at-risk' | 'non-compliant';
  if (percentage >= 80) {
    status = 'compliant';
  } else if (percentage >= 60) {
    status = 'at-risk';
  } else {
    status = 'non-compliant';
  }
  
  return { status, percentage };
}

// Function to calculate nurse staffing compliance
export function calculateNurseCompliance(records: NurseAttendanceRecord[]): ComplianceStatus {
  if (!records.length) {
    return { status: 'non-compliant', percentage: 0 };
  }
  
  // Count shifts with enough registered nurses per resident
  const totalShifts = records.reduce((count, record) => count + record.shifts.length, 0);
  const compliantShifts = records.reduce((count, record) => {
    return count + record.shifts.filter(shift => shift.minutesPerResident >= 40).length;
  }, 0);
  
  const percentage = (compliantShifts / totalShifts) * 100;
  
  let status: 'compliant' | 'at-risk' | 'non-compliant';
  if (percentage >= 80) {
    status = 'compliant';
  } else if (percentage >= 60) {
    status = 'at-risk';
  } else {
    status = 'non-compliant';
  }
  
  return { status, percentage };
}

// Function to format dates in a readable format
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

// Function to calculate days remaining until a deadline
export function calculateDaysRemaining(deadlineDate: string): number {
  const deadline = new Date(deadlineDate);
  const today = new Date();
  
  // Clear time portion for accurate day calculation
  deadline.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

// Function to generate a status badge color
export function getStatusColor(status: 'compliant' | 'at-risk' | 'non-compliant'): string {
  switch (status) {
    case 'compliant':
      return 'bg-green-100 text-green-800';
    case 'at-risk':
      return 'bg-yellow-100 text-yellow-800';
    case 'non-compliant':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// Function to calculate overall average for a specific quality indicator
export function calculateIndicatorAverage(indicators: QualityIndicator[], key: keyof QualityIndicator['indicators']): number {
  if (!indicators.length) return 0;
  
  const sum = indicators.reduce((acc, indicator) => {
    return acc + indicator.indicators[key].value;
  }, 0);
  
  return sum / indicators.length;
}

// Function to generate mock data for quality trends
export function generateQualityTrends() {
  const currentDate = new Date();
  const trends = [];
  
  // Generate data for the last 6 quarters
  for (let i = 0; i < 6; i++) {
    const quarter = ((currentDate.getMonth() / 3 | 0) + 1 - i) % 4 || 4;
    const year = currentDate.getFullYear() - Math.floor(i / 4);
    
    trends.push({
      period: `Q${quarter} ${year}`,
      pressureInjuries: Math.random() * 10 + 2,
      physicalRestraint: Math.random() * 5 + 1,
      unplannedWeightLoss: Math.random() * 15 + 5,
      fallsMajorInjury: Math.random() * 8 + 1,
      medicationManagement: Math.random() * 12 + 3
    });
  }
  
  return trends.reverse();
}

// Function to generate staffing impact data
export function generateStaffingImpact() {
  const currentDate = new Date();
  const impact = [];
  
  // Generate data for the last 6 months
  for (let i = 0; i < 6; i++) {
    const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthName = month.toLocaleDateString('en-AU', { month: 'short', year: 'numeric' });
    
    // Generate correlated data - as nurse minutes go up, quality issues should go down
    const nurseMinutes = 30 + Math.random() * 20;
    // Inverse relationship between nursing time and quality issues
    const qualityScore = 100 - (50 / nurseMinutes * 30);
    
    impact.push({
      period: monthName,
      nurseMinutes,
      qualityScore
    });
  }
  
  return impact.reverse();
}

// Function to calculate improvement percentage
export function calculateImprovement(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

// Convert compliance status to a readable string
export function complianceStatusToString(status: 'compliant' | 'at-risk' | 'non-compliant'): string {
  switch (status) {
    case 'compliant':
      return 'Compliant';
    case 'at-risk':
      return 'At Risk';
    case 'non-compliant':
      return 'Non-Compliant';
    default:
      return 'Unknown';
  }
}

// Function to get badge variant based on compliance status
export function getComplianceBadgeVariant(status: 'compliant' | 'at-risk' | 'non-compliant'): "default" | "destructive" | "outline" | "secondary" | undefined {
  switch (status) {
    case 'compliant':
      return 'default'; // green
    case 'at-risk':
      return 'secondary'; // yellow
    case 'non-compliant':
      return 'destructive'; // red
    default:
      return 'outline';
  }
}
