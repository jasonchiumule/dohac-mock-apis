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
curl -X POST http://localhost:8080/oauth2/registration \
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
curl -X POST http://localhost:8080/oauth2/access-tokens \
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
curl -X GET http://localhost:8080/Provider \
  -H "Authorization: Bearer mock_c88484a9-6cb3-4ad0-b9bd-5563567175ee_20230720151152" \
  -H "transaction_id: trans-123"
```

This will return the providers that SunsetCare has access to. Next, they can retrieve the services for a specific provider:

```bash
curl -X GET "http://localhost:8080/HealthcareService?organization=PRV-12345" \
  -H "Authorization: Bearer mock_c88484a9-6cb3-4ad0-b9bd-5563567175ee_20230720151152" \
  -H "transaction_id: trans-456"
```

**Value:** SunsetCare's software can now automatically map their internal systems to the Department's identifiers, enabling seamless integration for reporting.

#### 3. Quality Indicators Reporting

At the end of each quarter, SunsetCare needs to submit quality indicators data. First, they retrieve the current questionnaire:

```bash
curl -X GET http://localhost:8080/Questionnaire \
  -H "Authorization: Bearer mock_c88484a9-6cb3-4ad0-b9bd-5563567175ee_20230720151152" \
  -H "transaction_id: trans-789"
```

Then, after collecting the data throughout the quarter, they submit their response:

```bash
curl -X POST http://localhost:8080/QuestionnaireResponse \
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
curl -X GET "http://localhost:8080/RegisteredNurseAttendance?service=SVC-54321&summary=true" \
  -H "Authorization: Bearer mock_c88484a9-6cb3-4ad0-b9bd-5563567175ee_20230720151152" \
  -H "transaction_id: trans-131415"
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