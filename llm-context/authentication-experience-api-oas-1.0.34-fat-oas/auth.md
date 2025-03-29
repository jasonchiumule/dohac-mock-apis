The Authentication API enables B2G registered users to request access to the secured API resources in the Department's catalogue, by authenticating with the server using the resource owner's credentials. All response data retrieved via subsequent API operations will be restricted to authorised entities and scopes.

There are three use cases for the Authentication API to enable B2G registered users to request access to the protected API resources, these are:

Developer authentication in SVT
Provider authentication in Production (i.e. end users of the software)
Provider registration
Please note that the use case related to provider registration will be replicated by Developers in SVT (while developing their solution).

Developers intending to use this API should understand the intent of its endpoints and the role their prospective software (shown in red) would play in each use case.

1)  Developer Authentication in SVT - Client Credentials Grant Type using Client_ID and Client_Secret

resources/DT0003984-DESIGN-Process-Flows-B2G-Developer-Portal-Updated-Graphic-2-v02-2d1ab458-24c9-40c2-80ab-a1ff054a834d.png

A standard sequence for this data interchange might look like this:

Step (1): An application (System "A") sends client credentials to the Department's authorisation server "AccessToken" endpoint.

Step (2): If the client credentials are valid, the authorisation server will return an access token to the client application.

Step (3): The client application then requests access to protected resources (i.e. APIs) from the Department's resource server via an API operation and authenticates by presenting the access token as part of the header payload.

Step (4): The resource server validates the access token, and if valid, serves the request.

2) Provider Authentication in Production - Client Credentials Grant Type using Client_ID and Client_Assertion (JWT)

resources/DT0003984-DESIGN-Process-Flows-B2G-Developer-Portal-Updated-Graphic-3-v02-da51f91a-1547-4e8b-8881-de6799031313.png

A standard sequence for this data interchange might look like this:

Step (1): An application (System "A") sends client credentials and request to the trusted JWT issuer for JWT.

Step (2): If the client credentials are valid, the trusted JWT issuer will return JWT to the application (System "A").

Step (3): An application (System "A") sends the client_id and client_assertion to the Department’s authorisation server "AccessToken" endpoint.

Step (4): If the client_id and client_assertion are valid, the authorisation server will return an access token to the client application.

Step (5): The client application then requests access to protected resources (i.e. APIs) from the Department’s resource server via an API operation and authenticates by presenting the access token as part of the header payload.

Step (6): The resource server validates the access token, and if valid, serves the request.

3) Provider Registration

resources/authentication%20-%20provider%20registration%20create-update-7183a88a-14af-4855-9a43-e2f34e7dcc79.png

A standard sequence for an initial Provider Registration creation might look like this:

Step (1): An application (System "A") sends JWT request using M2M public certificate to the trusted JWT issuer.

Step (2): If the M2M certificate is valid, the trusted JWT issuer will return JWT to the System "A".

Step (3): System "A" sends the signed JWT and Client's x509 details to the Department's Authorisation server POST "registration" endpoint.

Step (4): If the submitted details are valid, the Authorisation server will return the "Client Application" to the System "A".

Step (5): System "A" requests for JWT for accessing Resource to the trusted JWT issuer.

Step (6): If the client credentials are valid, the trusted JWT issuer will return JWT to the System "A".

Step (7): System "A" requests for access token by sending the client_id, client_assertion (i.e. JWT) and client_assertion_type to the Department's authorisation server "AccessToken" endpoint.

Step (8): If the client details are valid, the authorisation server will return an access token to the System "A".

Step (9): The System "A" requests access to protected resources (i.e. APIs) from the Department's resource server via an API operation and authenticates by presenting the access token as part of the header payload.

Step (10): The resource server validates the access token, and if valid, serves the request.

After initial registration, a Provider has the ability to update the following fields of their registration details:

Client Name
Software Version ID
Redirect uris
JWT
X_509
The sequence might look like this:

Step (1): An application (System "A") sends JWT request using M2M public certificate to the trusted JWT issuer.

Step (2): If the M2M certificate is valid, the trusted JWT issuer will return JWT to the System "A".

Step (3):  Using the “Client Application” returned during initial Provider Registration in Step (4) in the above diagram, System "A" sends the signed JWT and Client's x509 details to the Department's Authorisation server PATCH "registration" endpoint.

Step (4): If the submitted details are valid, the Authorisation server will return the updated "Client Application" details to the System "A".

resources/authentication%20-%20provider%20registration%20delete-16835094-e430-4d13-ac6b-a5f56187b0c9.png

If required, a Provider has the ability to remove their registration from the Authorisation server. This flow might look like this:

Step (1): Using the “Client Application” returned during initial Provider Registration in Step (4) in the "Provider Registration – Create/Update” diagram, System "A" sends the request to the Department's Authorisation server DELETE "registration" endpoint.

Step (2): On successful deletion of the “Client Application”, the Authorisation server will return a success message to the “System A”.
