import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getDemoState } from "@/utils/demo";

export function NursesValueWidget() {
  const [demoState] = useState(getDemoState);
  const isConnected = demoState.connected;
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Registered Nurse Staffing</CardTitle>
            <CardDescription>
              {isConnected 
                ? "Real-time compliance monitoring for nurse staffing" 
                : "Manual tracking of registered nurse coverage"}
            </CardDescription>
          </div>
          <Badge variant={isConnected ? "default" : "outline"}>
            {isConnected ? "Connected" : "Not Connected"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {!isConnected ? (
          // Before state
          <div className="space-y-4">
            <div className="border rounded-md p-3 bg-gray-50">
              <h3 className="text-sm font-medium mb-2">Staffing Compliance Unknown</h3>
              <p className="text-sm text-gray-500 mb-3">
                No automated way to track if registered nurse requirements are being met
              </p>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm mb-1">Enter RN attendance data:</label>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div>
                      <select className="w-full p-1 border rounded text-sm">
                        <option>Morning</option>
                        <option>Afternoon</option>
                        <option>Night</option>
                      </select>
                    </div>
                    <div>
                      <input 
                        type="text" 
                        placeholder="# of RNs" 
                        className="w-full p-1 border rounded text-sm" 
                      />
                    </div>
                    <div>
                      <input 
                        type="text" 
                        placeholder="# of residents" 
                        className="w-full p-1 border rounded text-sm" 
                      />
                    </div>
                  </div>
                  <Button size="sm">Log Attendance</Button>
                </div>
                
                <div className="text-sm text-amber-600 mt-2">
                  Warning: No way to verify if minimum RN requirements are being met
                </div>
              </div>
            </div>
            
            <div className="text-sm text-gray-500">
              <p>Current process challenges:</p>
              <ul className="list-disc list-inside space-y-1 mt-1">
                <li>Manual tracking across multiple facilities</li>
                <li>Difficult to calculate compliance</li>
                <li>No early warning system for coverage gaps</li>
                <li>Potential regulatory penalties for non-compliance</li>
              </ul>
            </div>
          </div>
        ) : (
          // After state
          <div className="space-y-4">
            <div className="border rounded-md p-3 bg-blue-50 border-blue-200">
              <h3 className="text-sm font-medium mb-2 text-blue-800">Real-time Compliance Monitoring</h3>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-blue-700">Current Compliance Status</span>
                    <Badge variant="outline" className="bg-white">
                      85% Compliant
                    </Badge>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-blue-800">
                    <tr>
                      <th className="py-1">Shift</th>
                      <th className="py-1">Status</th>
                      <th className="py-1">Minutes/Resident</th>
                    </tr>
                  </thead>
                  <tbody className="text-blue-700">
                    <tr>
                      <td className="py-1">Morning</td>
                      <td><Badge variant="default" className="text-xs">Compliant</Badge></td>
                      <td>45 min</td>
                    </tr>
                    <tr>
                      <td className="py-1">Afternoon</td>
                      <td><Badge variant="secondary" className="text-xs">At Risk</Badge></td>
                      <td>35 min</td>
                    </tr>
                    <tr>
                      <td className="py-1">Night</td>
                      <td><Badge variant="destructive" className="text-xs">Non-Compliant</Badge></td>
                      <td>25 min</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="p-2 bg-green-50 rounded-md border border-green-200">
              <div className="text-sm font-medium text-green-800">Value Created</div>
              <div className="text-sm text-green-700 mt-1">
                <ul className="list-disc list-inside space-y-1">
                  <li>Automated compliance tracking</li>
                  <li>Early warnings for staffing gaps</li>
                  <li>3 hours saved per facility per week</li>
                  <li>Reduced risk of regulatory penalties</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}