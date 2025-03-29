import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SummaryCard } from '@/components/dashboard/summary-card';
import { ServiceCard } from '@/components/dashboard/service-card';
import { ServiceTable } from '@/components/dashboard/service-table';
import { QualityChart } from '@/components/dashboard/quality-chart';
import { generateServiceCompliance, generateStatistics, qualityTrends } from '@/utils/mocks';
import { Badge } from '@/components/ui/badge';

export default function ComplianceDashboard() {
  const [, setSelectedTab] = useState<string>('overview');
  const services = generateServiceCompliance();
  const statistics = generateStatistics();

  // Handlers
  const handleServiceSelect = (serviceId: string) => {
    console.log('Service selected:', serviceId);
    // In a real application, this would navigate to a service detail page or open a modal
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compliance Management Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor service compliance across quality indicators and nurse staffing requirements
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-xs px-3 py-1">
            Last Updated: {new Date().toLocaleDateString()}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="reports">Reporting</TabsTrigger>
          <TabsTrigger value="impact">Business Impact</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Summary Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              title="Quality Compliance"
              value={`${statistics.serviceStats.compliantQualityPercentage.toFixed(0)}%`}
              change={15.5}
              status="positive"
              description="Services meeting quality targets"
            />
            <SummaryCard
              title="Nurse Staffing Compliance"
              value={`${statistics.serviceStats.compliantNursePercentage.toFixed(0)}%`}
              change={8.3}
              status="positive"
              description="Services meeting staffing requirements"
            />
            <SummaryCard
              title="Reports Due Soon"
              value={statistics.reportingStats.upcoming}
              description="Quality submissions needed in next 30 days"
            />
            <SummaryCard
              title="Time Saved"
              value={`${statistics.improvementStats.timeSaving.total} hrs`}
              description="Admin time saved through automation this year"
            />
          </div>

          {/* Quality Indicators Trend */}
          <QualityChart
            data={qualityTrends}
            title="Quality Indicators Trend"
            description="Track how quality metrics have improved over time across your services"
          />

          {/* Services Overview */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Service Compliance Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map(service => (
                <ServiceCard
                  key={service.service.serviceId}
                  service={service.service}
                  qualityStatus={service.qualityStatus}
                  nurseStatus={service.nurseStatus}
                  nextReportingDue={service.reportingStatus.nextDue}
                  daysRemaining={service.reportingStatus.daysRemaining}
                  onSelect={() => handleServiceSelect(service.service.serviceId)}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="services" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Services Compliance Details</CardTitle>
              <CardDescription>
                Detailed compliance information for all services, including quality indicators and nurse staffing requirements.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ServiceTable
                services={services}
                onServiceSelect={handleServiceSelect}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Reporting Schedule</CardTitle>
              <CardDescription>
                Upcoming reporting deadlines and submission history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Upcoming Submissions</h3>
                  <div className="space-y-4">
                    {services
                      .filter(service => service.reportingStatus.daysRemaining > 0)
                      .sort((a, b) => a.reportingStatus.daysRemaining - b.reportingStatus.daysRemaining)
                      .slice(0, 5)
                      .map(service => (
                        <div key={service.service.serviceId} className="flex items-center justify-between p-4 border rounded-md">
                          <div>
                            <div className="font-medium">{service.service.name}</div>
                            <div className="text-sm text-gray-500">Quality Indicators - Q1 2024</div>
                          </div>
                          <div className="text-right">
                            <div>{service.reportingStatus.nextDue}</div>
                            <Badge
                              variant={service.reportingStatus.daysRemaining <= 7 ? "destructive" : "outline"}
                              className={service.reportingStatus.daysRemaining <= 7 ? "" : "bg-gray-100"}
                            >
                              {service.reportingStatus.daysRemaining} days left
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Recent Submissions</h3>
                  <div className="space-y-4">
                    {services
                      .sort((a, b) => new Date(b.reportingStatus.lastReported).getTime() - new Date(a.reportingStatus.lastReported).getTime())
                      .slice(0, 5)
                      .map(service => (
                        <div key={service.service.serviceId} className="flex items-center justify-between p-4 border rounded-md">
                          <div>
                            <div className="font-medium">{service.service.name}</div>
                            <div className="text-sm text-gray-500">Quality Indicators - Q4 2023</div>
                          </div>
                          <div className="text-right">
                            <div>{service.reportingStatus.lastReported}</div>
                            <Badge variant="default">
                              Submitted
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="impact" className="space-y-6 mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Administrative Time Savings</CardTitle>
                <CardDescription>Time saved through automation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Quarterly Reporting</span>
                    <span className="font-medium">{statistics.improvementStats.timeSaving.reporting} hours/year</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Compliance Monitoring</span>
                    <span className="font-medium">{statistics.improvementStats.timeSaving.monitoring} hours/year</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-medium">Total Time Saved</span>
                    <span className="font-bold">{statistics.improvementStats.timeSaving.total} hours/year</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality Improvement</CardTitle>
                <CardDescription>Improving resident outcomes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Pressure Injuries</span>
                    <Badge variant="default">-12.5%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Physical Restraint</span>
                    <Badge variant="default">-15.8%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Falls with Major Injury</span>
                    <Badge variant="default">-9.7%</Badge>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-medium">Overall Improvement</span>
                    <Badge variant="default">{`+${statistics.improvementStats.qualityImprovement.toFixed(1)}%`}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Rate</CardTitle>
                <CardDescription>Enhanced regulatory compliance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Quality Indicators</span>
                    <span className="font-medium">{statistics.serviceStats.compliantQualityPercentage.toFixed(0)}% compliant</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nurse Staffing</span>
                    <span className="font-medium">{statistics.serviceStats.compliantNursePercentage.toFixed(0)}% compliant</span>
                  </div>
                  <div className="flex justify-between">
                    <span>On-time Reporting</span>
                    <span className="font-medium">100% on time</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-medium">Audit Readiness</span>
                    <Badge variant="default">High</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Business Value Summary</CardTitle>
              <CardDescription>The tangible benefits of API integration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-md bg-green-50">
                  <h3 className="font-medium text-green-800 mb-2">Reduced Administrative Burden</h3>
                  <p className="text-green-700">
                    By automating data submission and compliance monitoring, your staff is saving {statistics.improvementStats.timeSaving.total} hours per year on administrative tasks.
                    This represents approximately ${(statistics.improvementStats.timeSaving.total * 45).toLocaleString()} in labor costs annually.
                  </p>
                </div>

                <div className="p-4 border rounded-md bg-blue-50">
                  <h3 className="font-medium text-blue-800 mb-2">Improved Data Accuracy</h3>
                  <p className="text-blue-700">
                    Direct API integration eliminates manual data entry errors, resulting in more accurate reporting and better quality insights.
                    This has contributed to a {statistics.improvementStats.qualityImprovement.toFixed(1)}% improvement in quality indicators over the past year.
                  </p>
                </div>

                <div className="p-4 border rounded-md bg-purple-50">
                  <h3 className="font-medium text-purple-800 mb-2">Enhanced Compliance Monitoring</h3>
                  <p className="text-purple-700">
                    Real-time monitoring of compliance status across all services has reduced the risk of regulatory non-compliance and potential sanctions.
                    Early detection of non-compliance helps address issues before they become serious problems.
                  </p>
                </div>

                <div className="p-4 border rounded-md bg-yellow-50">
                  <h3 className="font-medium text-yellow-800 mb-2">More Staff Time for Resident Care</h3>
                  <p className="text-yellow-700">
                    With less time spent on paperwork and manual reporting, staff can dedicate more time to direct resident care.
                    The saved {statistics.improvementStats.timeSaving.total} hours annually represents approximately {(statistics.improvementStats.timeSaving.total / 8).toFixed(0)} additional full days of care per year.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
