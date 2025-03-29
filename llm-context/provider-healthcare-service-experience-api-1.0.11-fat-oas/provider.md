The Provider Management API will allow B2G registered users to discover, navigate and retrieve Provider and Service-level data from the Department, following authentication with the server using the resource owner's credentials. The API will retrieve identifier(s) that uniquely distinguish the target entities to support alternate API services. All response data retrieved via subsequent API operations will be restricted to authorised entities and Scopes.

Developers intending to use this API should understand the intent of its endpoints and the role their prospective software (shown in red below) would play in this context.

resources/Provider%20Management-48c82f6b-1bc6-42a3-8cc5-debe72598853.png

A standard sequence for this data interchange includes:

Step (1): An aged care staff member, authenticated and authorised by system "A", wishes to find a specific Provider. The staff member navigates via a capability in their System that facilitates this view.

Step (2): System "A" will retrieve a current list of Providers for the relevant Aged Care Organisation via a "GET" operation against the B2G Provider endpoint. The response is filtered as per the access token, scope and parameters provided by the request.

Step (3): A resultant list of Providers will display, the user may select one and navigate to the Services tab (or equivalent) in their software, where a list of all Provider owned Services are displayed.

Step (4): System "A" uses the chosen Provider's ID to make a parameterised "GET" operation against the B2G HealthcareService API endpoint. The API responds with an array of Services that are owned by the associated Provider and filtered by the scope of the system's access token.

Having successfully traversed the Provider-Service hierarchy and discovered the needed Service, the user and system "A" are now in possession of the requisite unique identifiers of the Service in order to reference/filter by it in subsequent API operations. An example sequence can be seen below.

resources/DT0003984-DESIGN-Process-Flows-B2G-Developer-Portal-Updated-Graphic-6-v02-7329a40a-1575-4bad-b8b1-084c40ae9fb6.png

The software must meet all mandatory requirements stipulated in the Aged Care B2G API Gateway Conformance requirements (yet to be published) before it will be authorised to operate against the Production API. As APIs are enhanced and improved over time, the software vendor may need to reaffirm the software conformance status, by undertaking gap-testing where requirements have changed.
