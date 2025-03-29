import { NurseAttendanceRecord, NurseAttendanceSummary, Provider, QualityIndicator, ServiceCompliance } from '../types';
import { calculateDaysRemaining, calculateNurseCompliance, calculateQualityCompliance, generateQualityTrends, generateStaffingImpact } from '../lib/utils';

// Mock providers
export const mockProviders: Provider[] = [
  {
    providerId: 'provider-001',
    name: 'Sunset Aged Care',
    services: [
      {
        serviceId: 'service-001',
        name: 'Sunset Residential Facility',
        type: 'Residential Aged Care',
        address: {
          line1: '123 Sunset Blvd',
          suburb: 'Sunsetville',
          state: 'NSW',
          postcode: '2000'
        },
        contact: {
          phone: '02 1234 5678',
          email: 'care@sunsetaged.com.au'
        }
      },
      {
        serviceId: 'service-002',
        name: 'Sunset Home Care',
        type: 'Home Care',
        address: {
          line1: '123 Sunset Blvd',
          suburb: 'Sunsetville',
          state: 'NSW',
          postcode: '2000'
        },
        contact: {
          phone: '02 1234 5679',
          email: 'homecare@sunsetaged.com.au'
        }
      }
    ]
  },
  {
    providerId: 'provider-002',
    name: 'Golden Years Care',
    services: [
      {
        serviceId: 'service-003',
        name: 'Golden Years Facility',
        type: 'Residential Aged Care',
        address: {
          line1: '456 Golden Street',
          suburb: 'Goldentown',
          state: 'VIC',
          postcode: '3000'
        },
        contact: {
          phone: '03 9876 5432',
          email: 'care@goldenyears.com.au'
        }
      }
    ]
  }
];

// Mock quality indicators
export const mockQualityIndicators: Record<string, QualityIndicator[]> = {
  'service-001': [
    {
      serviceId: 'service-001',
      reportingPeriod: { quarter: 1, year: 2023 },
      submissionDate: '2023-04-21',
      indicators: {
        pressureInjuries: { value: 5.2, nationalAverage: 6.5, target: 5.0 },
        physicalRestraint: { value: 2.1, nationalAverage: 3.2, target: 2.0 },
        unplannedWeightLoss: { value: 8.7, nationalAverage: 7.5, target: 7.0 },
        fallsMajorInjury: { value: 3.1, nationalAverage: 3.5, target: 3.0 },
        medicationManagement: { value: 5.5, nationalAverage: 6.0, target: 5.0 }
      }
    },
    {
      serviceId: 'service-001',
      reportingPeriod: { quarter: 2, year: 2023 },
      submissionDate: '2023-07-20',
      indicators: {
        pressureInjuries: { value: 4.8, nationalAverage: 6.2, target: 5.0 },
        physicalRestraint: { value: 1.9, nationalAverage: 3.0, target: 2.0 },
        unplannedWeightLoss: { value: 8.1, nationalAverage: 7.3, target: 7.0 },
        fallsMajorInjury: { value: 2.8, nationalAverage: 3.4, target: 3.0 },
        medicationManagement: { value: 5.2, nationalAverage: 5.8, target: 5.0 }
      }
    },
    {
      serviceId: 'service-001',
      reportingPeriod: { quarter: 3, year: 2023 },
      submissionDate: '2023-10-18',
      indicators: {
        pressureInjuries: { value: 4.5, nationalAverage: 6.0, target: 5.0 },
        physicalRestraint: { value: 1.7, nationalAverage: 2.9, target: 2.0 },
        unplannedWeightLoss: { value: 7.8, nationalAverage: 7.2, target: 7.0 },
        fallsMajorInjury: { value: 2.6, nationalAverage: 3.3, target: 3.0 },
        medicationManagement: { value: 4.9, nationalAverage: 5.7, target: 5.0 }
      }
    },
    {
      serviceId: 'service-001',
      reportingPeriod: { quarter: 4, year: 2023 },
      submissionDate: '2024-01-15',
      indicators: {
        pressureInjuries: { value: 4.2, nationalAverage: 5.8, target: 5.0 },
        physicalRestraint: { value: 1.5, nationalAverage: 2.8, target: 2.0 },
        unplannedWeightLoss: { value: 7.5, nationalAverage: 7.0, target: 7.0 },
        fallsMajorInjury: { value: 2.4, nationalAverage: 3.2, target: 3.0 },
        medicationManagement: { value: 4.7, nationalAverage: 5.6, target: 5.0 }
      }
    }
  ],
  'service-002': [
    {
      serviceId: 'service-002',
      reportingPeriod: { quarter: 4, year: 2023 },
      submissionDate: '2024-01-10',
      indicators: {
        pressureInjuries: { value: 6.1, nationalAverage: 5.8, target: 5.0 },
        physicalRestraint: { value: 2.7, nationalAverage: 2.8, target: 2.0 },
        unplannedWeightLoss: { value: 8.2, nationalAverage: 7.0, target: 7.0 },
        fallsMajorInjury: { value: 3.8, nationalAverage: 3.2, target: 3.0 },
        medicationManagement: { value: 6.3, nationalAverage: 5.6, target: 5.0 }
      }
    }
  ],
  'service-003': [
    {
      serviceId: 'service-003',
      reportingPeriod: { quarter: 4, year: 2023 },
      submissionDate: '2024-01-20',
      indicators: {
        pressureInjuries: { value: 3.8, nationalAverage: 5.8, target: 5.0 },
        physicalRestraint: { value: 1.2, nationalAverage: 2.8, target: 2.0 },
        unplannedWeightLoss: { value: 6.5, nationalAverage: 7.0, target: 7.0 },
        fallsMajorInjury: { value: 2.1, nationalAverage: 3.2, target: 3.0 },
        medicationManagement: { value: 4.2, nationalAverage: 5.6, target: 5.0 }
      }
    }
  ]
};

// Mock nurse attendance records
export const mockNurseAttendance: Record<string, NurseAttendanceRecord[]> = {
  'service-001': [
    {
      serviceId: 'service-001',
      date: '2024-03-01',
      shifts: [
        {
          shiftId: 'shift-001',
          startTime: '07:00',
          endTime: '15:00',
          registeredNurses: 4,
          residents: 60,
          minutesPerResident: 45
        },
        {
          shiftId: 'shift-002',
          startTime: '15:00',
          endTime: '23:00',
          registeredNurses: 3,
          residents: 60,
          minutesPerResident: 35
        },
        {
          shiftId: 'shift-003',
          startTime: '23:00',
          endTime: '07:00',
          registeredNurses: 2,
          residents: 60,
          minutesPerResident: 25
        }
      ]
    },
    {
      serviceId: 'service-001',
      date: '2024-03-02',
      shifts: [
        {
          shiftId: 'shift-004',
          startTime: '07:00',
          endTime: '15:00',
          registeredNurses: 4,
          residents: 60,
          minutesPerResident: 45
        },
        {
          shiftId: 'shift-005',
          startTime: '15:00',
          endTime: '23:00',
          registeredNurses: 3,
          residents: 60,
          minutesPerResident: 35
        },
        {
          shiftId: 'shift-006',
          startTime: '23:00',
          endTime: '07:00',
          registeredNurses: 2,
          residents: 60,
          minutesPerResident: 25
        }
      ]
    }
  ],
  'service-002': [
    {
      serviceId: 'service-002',
      date: '2024-03-01',
      shifts: [
        {
          shiftId: 'shift-007',
          startTime: '07:00',
          endTime: '15:00',
          registeredNurses: 3,
          residents: 50,
          minutesPerResident: 40
        },
        {
          shiftId: 'shift-008',
          startTime: '15:00',
          endTime: '23:00',
          registeredNurses: 2,
          residents: 50,
          minutesPerResident: 30
        }
      ]
    }
  ],
  'service-003': [
    {
      serviceId: 'service-003',
      date: '2024-03-01',
      shifts: [
        {
          shiftId: 'shift-009',
          startTime: '07:00',
          endTime: '15:00',
          registeredNurses: 5,
          residents: 70,
          minutesPerResident: 50
        },
        {
          shiftId: 'shift-010',
          startTime: '15:00',
          endTime: '23:00',
          registeredNurses: 4,
          residents: 70,
          minutesPerResident: 40
        },
        {
          shiftId: 'shift-011',
          startTime: '23:00',
          endTime: '07:00',
          registeredNurses: 3,
          residents: 70,
          minutesPerResident: 30
        }
      ]
    }
  ]
};

// Mock nurse attendance summaries
export const mockNurseSummaries: Record<string, NurseAttendanceSummary> = {
  'service-001': {
    serviceId: 'service-001',
    period: {
      startDate: '2024-03-01',
      endDate: '2024-03-31'
    },
    totalMinutesPerResident: 35,
    totalShifts: 90,
    complianceStatus: false
  },
  'service-002': {
    serviceId: 'service-002',
    period: {
      startDate: '2024-03-01',
      endDate: '2024-03-31'
    },
    totalMinutesPerResident: 38,
    totalShifts: 60,
    complianceStatus: false
  },
  'service-003': {
    serviceId: 'service-003',
    period: {
      startDate: '2024-03-01',
      endDate: '2024-03-31'
    },
    totalMinutesPerResident: 42,
    totalShifts: 90,
    complianceStatus: true
  }
};

// Generate service compliance data for dashboards
export function generateServiceCompliance(): ServiceCompliance[] {
  return mockProviders.flatMap(provider => 
    provider.services.map(service => {
      const serviceId = service.serviceId;
      const qualityData = mockQualityIndicators[serviceId] ?? [];
      const latestQuality = qualityData.length > 0 ? qualityData[qualityData.length - 1] : null;
      
      const nurseRecords = mockNurseAttendance[serviceId] ?? [];
      
      // Calculate next reporting due date (3 months after last report)
      const lastReportDate = latestQuality?.submissionDate ?? '2023-10-01';
      const lastReportDateObj = new Date(lastReportDate);
      const nextDueDate = new Date(lastReportDateObj);
      nextDueDate.setMonth(nextDueDate.getMonth() + 3);
      
      return {
        service,
        qualityStatus: latestQuality 
          ? calculateQualityCompliance(latestQuality)
          : { status: 'non-compliant', percentage: 0 },
        nurseStatus: calculateNurseCompliance(nurseRecords),
        reportingStatus: {
          lastReported: lastReportDate,
          nextDue: nextDueDate.toISOString().split('T')[0],
          daysRemaining: calculateDaysRemaining(nextDueDate.toISOString())
        }
      };
    })
  );
}

// Generate quality trends for charts
export const qualityTrends = generateQualityTrends();

// Generate staffing impact data for charts
export const staffingImpact = generateStaffingImpact();

// Generate statistics for dashboard summary cards
export function generateStatistics() {
  const services = generateServiceCompliance();
  
  const totalServices = services.length;
  const compliantServices = services.filter(s => s.qualityStatus.status === 'compliant').length;
  const atRiskServices = services.filter(s => s.qualityStatus.status === 'at-risk').length;
  const nonCompliantServices = services.filter(s => s.qualityStatus.status === 'non-compliant').length;
  
  const compliantNurseServices = services.filter(s => s.nurseStatus.status === 'compliant').length;
  
  const upcomingReports = services.filter(s => s.reportingStatus.daysRemaining <= 30).length;
  const overdueReports = services.filter(s => s.reportingStatus.daysRemaining <= 0).length;
  
  // Calculate quality improvement percentage from first to last indicator set
  const serviceWithMostData = Object.entries(mockQualityIndicators)
    .reduce((acc, [_, indicators]) => 
      indicators.length > acc.length ? indicators : acc, [] as QualityIndicator[]);
  
  let qualityImprovement = 0;
  if (serviceWithMostData.length >= 2) {
    const first = serviceWithMostData[0];
    const last = serviceWithMostData[serviceWithMostData.length - 1];
    
    // Calculate average non-compliance across all indicators
    const firstAvgNonCompliance = Object.values(first.indicators)
      .reduce((sum, ind) => sum + Math.max(0, ind.value - ind.target), 0) / 5;
    
    const lastAvgNonCompliance = Object.values(last.indicators)
      .reduce((sum, ind) => sum + Math.max(0, ind.value - ind.target), 0) / 5;
    
    // Improvement is reduction in non-compliance
    if (firstAvgNonCompliance > 0) {
      qualityImprovement = ((firstAvgNonCompliance - lastAvgNonCompliance) / firstAvgNonCompliance) * 100;
    }
  }
  
  // Calculate time savings
  const automatedReportingTimeSaving = totalServices * 3 * 4; // 3 hours per service per quarter
  const automatedComplianceMonitoringTime = totalServices * 2 * 12; // 2 hours per service per month
  
  return {
    serviceStats: {
      total: totalServices,
      compliantQuality: compliantServices,
      compliantNurse: compliantNurseServices,
      compliantQualityPercentage: (compliantServices / totalServices) * 100,
      compliantNursePercentage: (compliantNurseServices / totalServices) * 100,
      atRisk: atRiskServices,
      nonCompliant: nonCompliantServices
    },
    reportingStats: {
      upcoming: upcomingReports,
      overdue: overdueReports
    },
    improvementStats: {
      qualityImprovement,
      timeSaving: {
        reporting: automatedReportingTimeSaving,
        monitoring: automatedComplianceMonitoringTime,
        total: automatedReportingTimeSaving + automatedComplianceMonitoringTime
      }
    }
  };
}
