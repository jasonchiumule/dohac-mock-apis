import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { QualityChart } from '@/components/dashboard/quality-chart';
import { StaffingChart } from '@/components/dashboard/staffing-chart';
import { SummaryCard } from '@/components/dashboard/summary-card';
import { generateServiceCompliance, qualityTrends, staffingImpact } from '@/utils/mocks';

export default function QualityOptimization() {
  const [selectedServiceId, setSelectedServiceId] = useState<string>('service-001');
  const services = generateServiceCompliance();
  // const statistics = generateStatistics();
  const selectedService = services.find(s => s.service.serviceId === selectedServiceId);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Care Quality Optimization</h1>
          <p className="text-muted-foreground">
            Use data insights to optimize staffing and improve resident quality of care
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-xs px-3 py-1">
            Last Updated: {new Date().toLocaleDateString()}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Select a Service</CardTitle>
              <CardDescription>Choose a service to view detailed quality metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {services.map(service => (
                  <div
                    key={service.service.serviceId}
                    className={`p-3 rounded-md border cursor-pointer transition-colors ${selectedServiceId === service.service.serviceId ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'}`}
                    onClick={() => setSelectedServiceId(service.service.serviceId)}
                  >
                    <div className="font-medium">{service.service.name}</div>
                    <div className="text-sm text-gray-500">{service.service.type}</div>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-sm">Quality Status</span>
                      <Badge variant={service.qualityStatus.status === 'compliant' ? 'default' : service.qualityStatus.status === 'at-risk' ? 'secondary' : 'destructive'}>
                        {service.qualityStatus.percentage.toFixed(0)}% Compliant
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <SummaryCard
          title="Quality & Staffing Correlation"
          value="85%"
          description="Correlation between nurse staffing levels and quality indicator improvements"
        />
      </div>

      {selectedService && (
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="quality">Quality Indicators</TabsTrigger>
            <TabsTrigger value="staffing">Nurse Staffing</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{selectedService.service.name}</CardTitle>
                  <CardDescription>{selectedService.service.type}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium mb-1">Service Address</div>
                      <div className="text-sm text-gray-500">
                        {selectedService.service.address.line1}<br />
                        {selectedService.service.address.line2 && <>{selectedService.service.address.line2}<br /></>}
                        {selectedService.service.address.suburb}, {selectedService.service.address.state} {selectedService.service.address.postcode}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-1">Contact Information</div>
                      <div className="text-sm text-gray-500">
                        Phone: {selectedService.service.contact.phone}<br />
                        Email: {selectedService.service.contact.email}
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="text-sm font-medium mb-2">Quality Status</div>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Quality Indicators</span>
                            <span className="text-sm font-medium">{selectedService.qualityStatus.percentage.toFixed(0)}%</span>
                          </div>
                          <Progress value={selectedService.qualityStatus.percentage} className="h-2" />
                        </div>

                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Nurse Staffing</span>
                            <span className="text-sm font-medium">{selectedService.nurseStatus.percentage.toFixed(0)}%</span>
                          </div>
                          <Progress value={selectedService.nurseStatus.percentage} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <StaffingChart
                data={staffingImpact}
                title="Staffing Impact on Quality Scores"
                description="See how nurse staffing minutes per resident correlates with quality outcomes"
              />
            </div>

            <QualityChart
              data={qualityTrends}
              title="Quality Indicators Trend"
              description="Track quality indicators over time to identify improvement opportunities"
            />
          </TabsContent>

          <TabsContent value="quality" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Quality Indicators Detail</CardTitle>
                <CardDescription>Current quality metrics compared to targets and national averages</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedService.qualityStatus.status === 'non-compliant' && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
                    This service is currently non-compliant with quality standards. Review the indicators below to identify improvement opportunities.
                  </div>
                )}

                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Pressure Injuries</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Current Rate</span>
                            <span className="font-medium">4.2%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Target</span>
                            <span className="font-medium">5.0%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">National Average</span>
                            <span className="font-medium">5.8%</span>
                          </div>
                          <div className="pt-2">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Performance</span>
                              <Badge variant="default">Better than target</Badge>
                            </div>
                            <Progress value={115} className="h-2" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Physical Restraint</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Current Rate</span>
                            <span className="font-medium">1.5%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Target</span>
                            <span className="font-medium">2.0%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">National Average</span>
                            <span className="font-medium">2.8%</span>
                          </div>
                          <div className="pt-2">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Performance</span>
                              <Badge variant="default">Better than target</Badge>
                            </div>
                            <Progress value={125} className="h-2" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Unplanned Weight Loss</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Current Rate</span>
                            <span className="font-medium">7.5%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Target</span>
                            <span className="font-medium">7.0%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">National Average</span>
                            <span className="font-medium">7.0%</span>
                          </div>
                          <div className="pt-2">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Performance</span>
                              <Badge variant="secondary">Slightly over target</Badge>
                            </div>
                            <Progress value={93} className="h-2" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Falls with Major Injury</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Current Rate</span>
                            <span className="font-medium">2.4%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Target</span>
                            <span className="font-medium">3.0%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">National Average</span>
                            <span className="font-medium">3.2%</span>
                          </div>
                          <div className="pt-2">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Performance</span>
                              <Badge variant="default">Better than target</Badge>
                            </div>
                            <Progress value={120} className="h-2" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Medication Management</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Current Rate</span>
                            <span className="font-medium">4.7%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Target</span>
                            <span className="font-medium">5.0%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">National Average</span>
                            <span className="font-medium">5.6%</span>
                          </div>
                          <div className="pt-2">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Performance</span>
                              <Badge variant="default">Better than target</Badge>
                            </div>
                            <Progress value={106} className="h-2" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staffing" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Registered Nurse Staffing</CardTitle>
                <CardDescription>Current staffing levels and compliance with requirements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <SummaryCard
                      title="Average Minutes per Resident"
                      value="35"
                      description="Daily minutes of registered nurse time per resident"
                    />
                    <SummaryCard
                      title="Target Minutes"
                      value="40"
                      description="Minutes per resident required for full compliance"
                    />
                    <SummaryCard
                      title="Compliance Status"
                      value={selectedService.nurseStatus.percentage.toFixed(0) + '%'}
                      status={selectedService.nurseStatus.percentage >= 80 ? 'positive' : 'negative'}
                      description="Percentage of shifts meeting nurse-to-resident requirements"
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Shift Analysis</h3>
                    <div className="border rounded-md overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered Nurses</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Residents</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Minutes per Resident</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">Morning (7:00-15:00)</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">4</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">60</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">45</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <Badge variant="default">Compliant</Badge>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">Afternoon (15:00-23:00)</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">3</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">60</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">35</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <Badge variant="secondary">At Risk</Badge>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">Night (23:00-7:00)</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">2</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">60</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">25</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <Badge variant="destructive">Non-Compliant</Badge>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="optimization" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Staffing Optimization Recommendations</CardTitle>
                <CardDescription>Data-driven suggestions to improve quality outcomes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <h3 className="font-medium text-blue-800 mb-2">Staffing Recommendation</h3>
                    <p className="text-blue-700 mb-4">
                      Based on analysis of your quality indicators and nurse staffing data, we recommend increasing night shift staffing by 1 registered nurse to reach compliance and improve resident outcomes.
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-blue-800">Current Status:</span>
                        <ul className="list-disc list-inside mt-1 text-blue-700">
                          <li>2 RNs for 60 residents (25 min/resident)</li>
                          <li>Non-compliant with requirements</li>
                          <li>Higher fall rates during night shifts</li>
                        </ul>
                      </div>
                      <div>
                        <span className="font-medium text-blue-800">Recommended Change:</span>
                        <ul className="list-disc list-inside mt-1 text-blue-700">
                          <li>Add 1 RN to night shift (3 total)</li>
                          <li>Increases to 38 min/resident</li>
                          <li>Estimated fall reduction: 14%</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Quality Impact Predictions</h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">Pressure Injuries</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-baseline space-x-2">
                            <div className="text-2xl font-bold">-8%</div>
                            <Badge variant="default">Improvement</Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">Physical Restraint</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-baseline space-x-2">
                            <div className="text-2xl font-bold">-5%</div>
                            <Badge variant="default">Improvement</Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">Weight Loss</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-baseline space-x-2">
                            <div className="text-2xl font-bold">-10%</div>
                            <Badge variant="default">Improvement</Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">Falls & Injuries</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-baseline space-x-2">
                            <div className="text-2xl font-bold">-14%</div>
                            <Badge variant="default">Improvement</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Return on Investment</h3>
                    <div className="border rounded-md p-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <h4 className="font-medium mb-2">Costs</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">Additional RN Salary</span>
                              <span className="text-sm font-medium">$82,000/year</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Benefits & Overhead</span>
                              <span className="text-sm font-medium">$24,600/year</span>
                            </div>
                            <div className="flex justify-between pt-1 border-t">
                              <span className="text-sm font-medium">Total Cost</span>
                              <span className="text-sm font-medium">$106,600/year</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Benefits</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">Reduced Complication Costs</span>
                              <span className="text-sm font-medium">$64,000/year</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Improved Compliance Status</span>
                              <span className="text-sm font-medium">$30,000/year</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Resident Satisfaction</span>
                              <span className="text-sm font-medium">$45,000/year</span>
                            </div>
                            <div className="flex justify-between pt-1 border-t">
                              <span className="text-sm font-medium">Total Benefit</span>
                              <span className="text-sm font-medium">$139,000/year</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <div className="flex justify-between">
                          <span className="font-medium">Net Annual Benefit</span>
                          <span className="font-bold text-green-600">$32,400/year</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="font-medium">ROI</span>
                          <span className="font-bold text-green-600">30.4%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
