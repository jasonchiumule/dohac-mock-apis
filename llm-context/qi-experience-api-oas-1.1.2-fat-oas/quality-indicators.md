The Quality Indicator API currently has a known issue that results in warning messages being incorrectly supplied for questions UPWL-04 and UPWL-11 directing the user to supply a comment even if a comment has already been supplied in the comments questions (UPWL-06 and UPWL-13 respectively). It is recommended that these warning messages are not displayed to the user when comments have been supplied to avoid confusion.

A new update of this API is available as a Beta version in the API Catalogue.

# Quality Indicators Questionnaire - FHIR API
Use this API to submit quarterly quality indicator data to both the Department of Health and Aged Care in accordance with the Aged Care Act 1997 to satisfy the participation requirements of the National Aged Care Mandatory Quality Indicator Program. This API will allow users to retrieve the most up-to-date quality indicator questions and submit their data based on current reporting requirements.

The approved provider remains responsible for ensuring that quality indicator data is both collected accurately and submitted by the 21st day of the month after the end of each quarter.

As part of the Omnichannel strategy, quality indicators data submitted via this API channel will provide a consistent experience to the other submission channels via GPMS. The API channel aims to provide organisations with automation options and allow them to spend more time focusing on their everyday care services.

# Quality Indicators
The Quality Indicators (QI) Program requires quarterly reporting against fourteen quality indicators across crucial care areas:

1. pressure injuries
2. physical restraint
3. unplanned weight loss
4. falls and major injury
5. medication management
6. activities of daily living
7. incontinence care
8. hospitalisation
9. workforce
10. consumer experience
11. quality of life
12. allied health (collected from April 2025 and half data extracted from QFR reporting)
13. enrolled nursing (collected from 1 April 2025 and data extracted from QFR reporting)
14. lifestyle officers (data extracted from QFR reporting)
Please note, quality indicator data related to enrolled nursing, lifestyle officers and allied health care minutes is extracted from QFR reporting and does not need to be included in the API. Only ‘percentage of recommended allied health services received’ is included in the API.

From 1 April 2025 (quarter 4, 2024–25) providers will start collecting data for:

- allied health
  - allied health care minutes (Data extracted from QFR reporting)
  - percentage of recommended allied health services received reported via the API.
- enrolled nursing
  - proportion of enrolled nursing minutes (Data extracted from QFR reporting)
  - proportion of nursing minutes (Data extracted from QFR reporting)
- lifestyle officers
  - lifestyle officer care minutes (Data extracted from QFR reporting)
If a provider does not submit their QFR data or does not submit it on time, this will result in an automatic non-submission of these quality indicators.

The question phrasing, definitions, assessment, and data collection instructions are explained in the National Aged Care QI Program manual found here. All approved providers of residential care services must collect data across all quality indicators and categories. All software products must record and collate data in accordance with this guidance material. For more information about the Quality Indicator Program, click here.
