**Goal**

Develop a Salary Explorer application that enables HR users to easily analyze employee compensation data. The application will provide employee data exploration capabilities, salary-based filtering, interactive dashboards for data visualization, and compensation analytics to help HR gain insights into salary trends

**Requirements**

* The system shall allow HR users to view and explore employee data.
* The system shall allow HR users to search, filter, sort, and navigate employee records.
* The system shall provide workforce and salary analytics through dashboards and visualizations.
* The system shall display predefined questions to help HR users discover available insights and reports.
* The system shall generate analytical reports and compensation insights based on employee data.
* The system shall allow HR users to compare employee and department compensation metrics.
* The system shall support analysis of a dataset containing at least 10,000 employee records.

**Scope & Features**

Feature 1: Data explorer (Data will be hardcoded for now)

* View all employees
* Search employees
* Filter data
    * Minimum salary
    * Maximum salary
    * Average salary
* Pagination

Feature 2: Dashboard

* Show cards:
    * Average Salary
    * Highest Salary
    * Lowest Salary
    * Total Payroll
* Charts:
    * Employees by Department
    * Salary Distribution

Feature 3: Reports & Analytics
Provide pre-built HR reports.

* Reports
  * Top 10 highest-paid employees
  * Average salary by department
  * Total payroll by department

—————————————————————————————————————

**Leaving out**


Feature 4: Suggested Questions
Try asking:

* Who are the highest-paid employees?
* Which department has the largest payroll?
* How many employees joined this year?
* Show salary distribution by department.


Feature 5: Compensation analysis

Help HR analyze compensation.

Insights
* Highest-paying department
* Lowest-paying department
* Department salary comparison


* Feature 6 : Export Results
  * **Reason** : Export functionality is dependent on the availability of meaningful data views, filters, reports, and dashboards. The initial focus will be on building and validating these core analytical capabilities. Export options can be added once the reporting experience is finalized.
   * **Reason** : This is an advanced capability and is deferred to keep focus on core analytics and reporting.
* Feature 7: Import Data
  * **Reason** : A seeded dataset will be used to populate the system with employee records for initial development and testing. Therefore, data import functionality is not required
* Feature 8: Employee management (Add/Edit/Delete)
  * **Reason** : The application uses seeded employee data, so employee creation and maintenance are not required.

