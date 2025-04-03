# DOHAC Healthcare Provider API Accelerator

This accelerator provides a mock implementation of the Department of Health and Aged Care's B2G APIs for healthcare providers. Use it to build and test your integration with these APIs without the need to connect to production systems.

## Quick Start

1. Start the server:
   ```bash
   go run cmd/server/main.go
   ```

2. The server will start on port 8080 by default. You can configure a different port using the `PORT` environment variable.

## API Usage Examples

Below are examples for using each of the APIs, following a storyline that demonstrates their value to healthcare providers.

### Storyline: Streamlining Compliance Reporting for SunsetCare

SunsetCare is a mid-sized aged care provider operating multiple residential and home care services across Australia. They need to comply with government reporting requirements but want to minimize the administrative burden on their staff so they can focus on providing care.

#### 1. Authentication

First, SunsetCare needs to register their software with the Department's API gateway:

```bash
curl -X POST http://localhost:8080/api/oauth2/registration \
  -H "Content-Type: application/json" \
  -d '{
    "client_name": "SunsetCare Management System",
    "software_id": "sunsetcare-123",
    "software_version": "1.0.0",
    "redirect_uris": ["https://sunsetcare.com.au/auth/callback"]
  }'
```

Response:
```json
{
  "client_id": "c88484a9-6cb3-4ad0-b9bd-5563567175ee",
  "client_id_issued_at": 1689925512,
  "client_name": "SunsetCare Management System",
  "software_id": "sunsetcare-123",
  "software_version": "1.0.0",
  "redirect_uris": ["https://sunsetcare.com.au/auth/callback"]
}
```

Next, they need to obtain an access token:

```bash
curl -X POST http://localhost:8080/api/oauth2/access-tokens \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=c88484a9-6cb3-4ad0-b9bd-5563567175ee&client_secret=your-secret&scope=dhac:b2g:all:all ACO:ABN:123"
```

Response:
```json
{
  "access_token": "mock_c88484a9-6cb3-4ad0-b9bd-5563567175ee_20230720151152",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "dhac:b2g:all:all ACO:ABN:123"
}
```

#### 2. Provider and Healthcare Service Discovery

Now, SunsetCare's software can retrieve information about their organization and services:

```bash
curl -X GET http://localhost:8080/api/Provider \
  -H "Authorization: Bearer mock_c88484a9-6cb3-4ad0-b9bd-5563567175ee_20230720151152" \
  -H "transaction_id: trans-123"
```

This will return the providers that SunsetCare has access to. Next, they can retrieve the services for a specific provider:

```bash
curl -X GET "http://localhost:8080/api/HealthcareService?organization=PRV-12345" \
  -H "Authorization: Bearer mock_c88484a9-6cb3-4ad0-b9bd-5563567175ee_20230720151152" \
  -H "transaction_id: trans-456"
```

Response:
```json
[
  {
    "id": "PRV-12345",
    "resourceType": "Organization",
    "identifier": [
      {
        "system": "http://ns.health.gov.au/id/hi/hpio",
        "value": "8003627500000328"
      },
      {
        "system": "http://ns.health.gov.au/id/provider/naps",
        "value": "PRV-12345"
      }
    ],
    "active": true,
    "type": [
      {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/organization-type",
            "code": "prov",
            "display": "Healthcare Provider"
          }
        ],
        "text": "Healthcare Provider"
      }
    ],
    "name": "Sunset Aged Care",
    "telecom": [
      {
        "system": "phone",
        "value": "0398765432",
        "use": "work"
      },
      {
        "system": "email",
        "value": "info@sunsetagedcare.com.au",
        "use": "work"
      }
    ],
    "address": [
      {
        "use": "work",
        "type": "physical",
        "line": [
          "123 Sunset Boulevard"
        ],
        "city": "Melbourne",
        "state": "VIC",
        "postalCode": "3000",
        "country": "Australia"
      }
    ]
  },
  {
    "id": "PRV-67890",
    "resourceType": "Organization",
    "identifier": [
      {
        "system": "http://ns.health.gov.au/id/hi/hpio",
        "value": "8003627500000329"
      },
      {
        "system": "http://ns.health.gov.au/id/provider/naps",
        "value": "PRV-67890"
      }
    ],
    "active": true,
    "type": [
      {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/organization-type",
            "code": "prov",
            "display": "Healthcare Provider"
          }
        ],
        "text": "Healthcare Provider"
      }
    ],
    "name": "Golden Years Care",
    "telecom": [
      {
        "system": "phone",
        "value": "0399876543",
        "use": "work"
      },
      {
        "system": "email",
        "value": "info@goldenyearscare.com.au",
        "use": "work"
      }
    ],
    "address": [
      {
        "use": "work",
        "type": "physical",
        "line": [
          "456 Golden Road"
        ],
        "city": "Sydney",
        "state": "NSW",
        "postalCode": "2000",
        "country": "Australia"
      }
    ]
  }
]
```

Response:
```json
[
  {
    "id": "SVC-54321",
    "resourceType": "HealthcareService",
    "identifier": [
      {
        "system": "http://ns.health.gov.au/id/service/aged-care",
        "value": "SVC-54321"
      }
    ],
    "active": true,
    "providedBy": {
      "reference": "Organization/PRV-12345",
      "display": "Sunset Aged Care"
    },
    "category": [
      {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/service-category",
            "code": "8",
            "display": "Aged Care Service"
          }
        ],
        "text": "Aged Care Service"
      }
    ],
    "type": [
      {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/service-type",
            "code": "124",
            "display": "Residential Aged Care"
          }
        ],
        "text": "Residential Aged Care"
      }
    ],
    "name": "Sunset Residential Care",
    "comment": "Providing high quality residential aged care",
    "serviceProvisionCode": [
      {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/service-provision-conditions",
            "code": "free",
            "display": "Free"
          }
        ],
        "text": "Government Funded"
      }
    ]
  },
  {
    "id": "SVC-98765",
    "resourceType": "HealthcareService",
    "identifier": [
      {
        "system": "http://ns.health.gov.au/id/service/aged-care",
        "value": "SVC-98765"
      }
    ],
    "active": true,
    "providedBy": {
      "reference": "Organization/PRV-12345",
      "display": "Sunset Aged Care"
    },
    "category": [
      {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/service-category",
            "code": "8",
            "display": "Aged Care Service"
          }
        ],
        "text": "Aged Care Service"
      }
    ],
    "type": [
      {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/service-type",
            "code": "125",
            "display": "Home Care"
          }
        ],
        "text": "Home Care"
      }
    ],
    "name": "Sunset Home Care",
    "comment": "Providing support services in the home",
    "serviceProvisionCode": [
      {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/service-provision-conditions",
            "code": "free",
            "display": "Free"
          }
        ],
        "text": "Government Funded"
      }
    ]
  },
  {
    "id": "SVC-24680",
    "resourceType": "HealthcareService",
    "identifier": [
      {
        "system": "http://ns.health.gov.au/id/service/aged-care",
        "value": "SVC-24680"
      }
    ],
    "active": true,
    "providedBy": {
      "reference": "Organization/PRV-67890",
      "display": "Golden Years Care"
    },
    "category": [
      {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/service-category",
            "code": "8",
            "display": "Aged Care Service"
          }
        ],
        "text": "Aged Care Service"
      }
    ],
    "type": [
      {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/service-type",
            "code": "124",
            "display": "Residential Aged Care"
          }
        ],
        "text": "Residential Aged Care"
      }
    ],
    "name": "Golden Years Residential Care",
    "comment": "Quality care in a comfortable environment",
    "serviceProvisionCode": [
      {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/service-provision-conditions",
            "code": "free",
            "display": "Free"
          }
        ],
        "text": "Government Funded"
      }
    ]
  }
]
```

**Value:** SunsetCare's software can now automatically map their internal systems to the Department's identifiers, enabling seamless integration for reporting.

#### 3. Quality Indicators Reporting

At the end of each quarter, SunsetCare needs to submit quality indicators data. First, they retrieve the current questionnaire:

```bash
curl -X GET http://localhost:8080/api/Questionnaire \
  -H "Authorization: Bearer mock_c88484a9-6cb3-4ad0-b9bd-5563567175ee_20230720151152" \
  -H "transaction_id: trans-789"
```

Response
```json
[
  {
    "resourceType": "Questionnaire",
    "id": "QC-20230630",
    "name": "quality-indicators-q4-2022-23",
    "title": "Quality Indicators Q4 2022-23",
    "status": "active",
    "subject": {
      "reference": ""
    },
    "date": "2023-06-30",
    "publisher": "Department of Health and Aged Care",
    "description": "Quality indicators questionnaire for Q4 2022-23",
    "item": [
      {
        "linkId": "pressure-injuries",
        "text": "Pressure Injuries",
        "type": "group",
        "required": true,
        "item": [
          {
            "linkId": "PI-01",
            "text": "Number of residents who have developed a Stage 1 pressure injury during the quarter",
            "type": "integer",
            "required": true
          },
          {
            "linkId": "PI-02",
            "text": "Number of residents who have developed a Stage 2 pressure injury during the quarter",
            "type": "integer",
            "required": true
          },
          {
            "linkId": "PI-03",
            "text": "Number of residents who have developed a Stage 3 pressure injury during the quarter",
            "type": "integer",
            "required": true
          },
          {
            "linkId": "PI-04",
            "text": "Number of residents who have developed a Stage 4 pressure injury during the quarter",
            "type": "integer",
            "required": true
          },
          {
            "linkId": "PI-05",
            "text": "Any comments on pressure injuries data collection?",
            "type": "string",
            "required": false
          }
        ]
      },
      {
        "linkId": "physical-restraint",
        "text": "Physical Restraint",
        "type": "group",
        "required": true,
        "item": [
          {
            "linkId": "PR-01",
            "text": "Number of residents who were physically restrained during the quarter",
            "type": "integer",
            "required": true
          },
          {
            "linkId": "PR-02",
            "text": "Any comments on physical restraint data collection?",
            "type": "string",
            "required": false
          }
        ]
      },
      {
        "linkId": "unplanned-weight-loss",
        "text": "Unplanned Weight Loss",
        "type": "group",
        "required": true,
        "item": [
          {
            "linkId": "UPWL-01",
            "text": "Number of residents who experienced unplanned weight loss during the quarter",
            "type": "integer",
            "required": true
          },
          {
            "linkId": "UPWL-02",
            "text": "Number of residents who experienced consecutive unplanned weight loss",
            "type": "integer",
            "required": true
          },
          {
            "linkId": "UPWL-03",
            "text": "Any comments on unplanned weight loss data collection?",
            "type": "string",
            "required": false
          }
        ]
      },
      {
        "linkId": "falls-and-major-injury",
        "text": "Falls and Major Injury",
        "type": "group",
        "required": true,
        "item": [
          {
            "linkId": "FMI-01",
            "text": "Number of residents who experienced a fall during the quarter",
            "type": "integer",
            "required": true
          },
          {
            "linkId": "FMI-02",
            "text": "Number of residents who experienced a fall resulting in major injury",
            "type": "integer",
            "required": true
          },
          {
            "linkId": "FMI-03",
            "text": "Any comments on falls and major injury data collection?",
            "type": "string",
            "required": false
          }
        ]
      },
      {
        "linkId": "medication-management",
        "text": "Medication Management",
        "type": "group",
        "required": true,
        "item": [
          {
            "linkId": "MM-01",
            "text": "Number of residents who were prescribed antipsychotic medications",
            "type": "integer",
            "required": true
          },
          {
            "linkId": "MM-02",
            "text": "Number of residents who experienced a significant medication error",
            "type": "integer",
            "required": true
          },
          {
            "linkId": "MM-03",
            "text": "Any comments on medication management data collection?",
            "type": "string",
            "required": false
          }
        ]
      }
    ]
  }
]
```

Then, after collecting the data throughout the quarter, they submit their response:

```bash
curl -X POST http://localhost:8080/api/QuestionnaireResponse \
  -H "Authorization: Bearer mock_c88484a9-6cb3-4ad0-b9bd-5563567175ee_20230720151152" \
  -H "Content-Type: application/json" \
  -H "transaction_id: trans-101112" \
  -d '{
    "questionnaire": "QC-20230630",
    "status": "completed",
    "subject": {
      "reference": "HealthcareService/SVC-54321",
      "display": "Sunset Residential Care"
    },
    "author": {
      "reference": "Organization/PRV-12345",
      "display": "Sunset Aged Care"
    },
    "item": [
      {
        "linkId": "pressure-injuries",
        "text": "Pressure Injuries",
        "item": [
          {
            "linkId": "PI-01",
            "text": "Number of residents who have developed a Stage 1 pressure injury during the quarter",
            "answer": [{"valueInteger": 2}]
          }
        ]
      }
    ]
  }'
```

**Value:** SunsetCare's quality team can now focus on analyzing the data to improve care quality rather than spending time manually entering data into government portals.

#### 4. Registered Nurse Attendance Tracking

SunsetCare must comply with the requirement to have registered nurses on duty 24/7. They can use the API to record and retrieve nurse attendance:

```bash
curl -X GET "http://localhost:8080/api/RegisteredNurseAttendance?service=SVC-54321&summary=true" \
  -H "Authorization: Bearer mock_c88484a9-6cb3-4ad0-b9bd-5563567175ee_20230720151152" \
  -H "transaction_id: trans-131415"
```

Response
```
{
  "resourceType": "Bundle",
  "id": "bundle-rn-attendances",
  "type": "searchset",
  "total": 3,
  "link": [
    {
      "relation": "self",
      "url": "https://api.health.gov.au/RegisteredNurseAttendance"
    }
  ],
  "entry": [
    {
      "fullUrl": "https://api.health.gov.au/RegisteredNurseAttendance/RN-12345",
      "resource": {
        "resourceType": "Encounter",
        "id": "RN-12345",
        "identifier": [
          {
            "system": "http://ns.health.gov.au/id/attendance/rn",
            "value": "RN-12345"
          }
        ],
        "status": "finished",
        "subject": {
          "reference": "HealthcareService/SVC-54321",
          "display": "Sunset Residential Care"
        },
        "period": {
          "start": "2023-07-01T07:00:00Z",
          "end": "2023-07-01T15:00:00Z"
        },
        "performer": [
          {
            "reference": "Practitioner/RN-P12345",
            "display": "Jane Smith"
          }
        ],
        "reasonCode": [
          {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/encounter-reason",
                "code": "routine",
                "display": "Routine"
              }
            ],
            "text": "Regular shift"
          }
        ]
      }
    },
    {
      "fullUrl": "https://api.health.gov.au/RegisteredNurseAttendance/RN-23456",
      "resource": {
        "resourceType": "Encounter",
        "id": "RN-23456",
        "identifier": [
          {
            "system": "http://ns.health.gov.au/id/attendance/rn",
            "value": "RN-23456"
          }
        ],
        "status": "finished",
        "subject": {
          "reference": "HealthcareService/SVC-54321",
          "display": "Sunset Residential Care"
        },
        "period": {
          "start": "2023-07-01T15:00:00Z",
          "end": "2023-07-01T23:00:00Z"
        },
        "performer": [
          {
            "reference": "Practitioner/RN-P67890",
            "display": "John Doe"
          }
        ],
        "reasonCode": [
          {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/encounter-reason",
                "code": "routine",
                "display": "Routine"
              }
            ],
            "text": "Evening shift"
          }
        ]
      }
    },
    {
      "fullUrl": "https://api.health.gov.au/RegisteredNurseAttendance/RN-34567",
      "resource": {
        "resourceType": "Encounter",
        "id": "RN-34567",
        "identifier": [
          {
            "system": "http://ns.health.gov.au/id/attendance/rn",
            "value": "RN-34567"
          }
        ],
        "status": "finished",
        "subject": {
          "reference": "HealthcareService/SVC-24680",
          "display": "Golden Years Residential Care"
        },
        "period": {
          "start": "2023-07-01T07:00:00Z",
          "end": "2023-07-01T15:00:00Z"
        },
        "performer": [
          {
            "reference": "Practitioner/RN-P13579",
            "display": "Emily Johnson"
          }
        ],
        "reasonCode": [
          {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/encounter-reason",
                "code": "routine",
                "display": "Routine"
              }
            ],
            "text": "Morning shift"
          }
        ]
      }
    }
  ]
}
```

This will return a summary of nurse attendance for the specified service, allowing SunsetCare to quickly identify any compliance issues.

**Value:** SunsetCare's staffing coordinator can monitor compliance in real-time and address any gaps proactively, avoiding potential regulatory issues and ensuring quality care for residents.

## Conclusion

By using these APIs, SunsetCare has:

1. Reduced administrative burden by automating reporting processes
2. Improved data accuracy by eliminating manual data entry
3. Enhanced compliance monitoring through real-time access to key metrics
4. Freed up staff time to focus on resident care rather than paperwork

This accelerator provides a simplified but functional implementation of these APIs, allowing you to develop and test your integration before connecting to production systems.
