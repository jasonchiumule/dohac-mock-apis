Developers intending to use this API should understand the intent of its endpoints and the role their prospective software (Client Application, shown in red below) would play in this context. This is best surmised via the below visual.

resources/image-1f458c70-d7ae-4b66-8e9f-65e09566f225.png

The most common use-case for the B2G API will be to facilitate the system-to-system interchange of Registered Nurse (RN) attendance data. In the above example, System “A” represents a System that has been developed on the Business-side and System “B” represents the Government repository where RN attendance data is stored for processing. This is to support the mandatory care time reporting responsibilities for approved providers of residential care services introduced by the Australian Government.

The 24/7 Nursing API will allow B2G registered users to submit data to the Department following authentication using the resource owner’s credentials.

A standard sequence for this data interchange could typically look like this:

Step (1): System “A” will retrieve operational and non-operational days data on behalf of a Residential Aged Care Service by making a GET operation against the RegisteredNurseAttendance. This will likely be via a “Resource Search” operation resulting in a “Bundle” of RegisteredNurseAttendance resources (see Data Model section for more information on Bundles). The system will help navigate through and find the appropriate RegisteredNurseAttedance record within the collection.

Step (2): Authorised personnel from the Residential Aged Care Service will log Registered Nursing attendance and non-attendance records within the System “A”.

Step (3): System “A” will aggregate, and map attendance and non-attendance records and prepare for submission.

Step (4): System “A” then submits a PATCH RegisteredNurseAttendance operation to update attendance records. The submission status has to be “In Progress” for this operation. This can be done throughout a month, on an ad-hoc basis, or in bulk at the end of the month. It is worth noting that a PATCH can be used to incrementally add new days, however if an existing day is included in the PATCH payload, any previously entered non-attendance records for that day will be replaced by the contents of the newer submission.

Step (5): After the full month’s data has been provided, authorised personnel from the Residential Aged Care Service can request to view the attendance summary data for the entire month.

Step (6): The attendance summary data can be retrieved by making a GET operation against the RegisteredNurseAttendance by the System “A” with a query parameter of “summary=true”.

Step (7): System “A” then presents the attendance summary data to the authorised personnel.

Step (8): The authorised personnel from the Residential Aged Care Service review and approve the summary data for the entire month. They will also request to “Submit” the monthly data by agreeing to the “Declaration Message”.

Step (9): Once the “Declaration Message” is agreed and signed by the authorised personnel, System “A” then submits a PATCH RegisteredNurseAttendance operation to “Submit” attendance record. The submission status has to be “Submitted” for this operation. This operation and step complete the 24/7 Nursing data transmission cycle.
