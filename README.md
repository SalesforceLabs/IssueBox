# Issue Box

## Installation
Install IssueBox from AppExchange. 

You can also use this repository to pull source code. However, you will not be able to take advantage of package upgrade process.

## Configuration

### Permissions
- Assign "Issue Box - Admin" permission set to Admin users. It has all the permissions including creating, editing and deleting issues.
- Assign "Issue Box - User" permission set to Standard users. These users can create issues from "Log an Issue" component. For viewing the issues those users created, they can either use "Issue List" component or use List Views on "Issue" object

### Configure Components
- This app has 2 LWC components which can be added to Home page, Utility Bar, Record page or any other Lightning App
- Admin can configure required Apps using App Builder and add "Log an Issue" and "Issue List" components

## Using components

### Component: Log an Issue
- Details and Type are the only required fields on this form
- We recommend other information too so support can check the issue without having to ask too many questions again
- Users can also choose to upload a screenshot of the page or error while creating the issue; these will be stored as Files on the Issue record once created
  - Issue is always created even if a user cancels screenshot uploaded
  - This is because we need to associate file to an existing record so we create the issue before displaying file upload form
  
### Component: Issue List
- This component can be used to embed in utility bar so users have a quick and easy way to check status of the issues they have logged
- However, users can select to use standard List Views on Issue Object; users will have Read/Create access on the object to be able to create issues
  - By default, "Issue Box - User" permission set does NOT provide Edit access to Issue object
  - Once an issue is logged, users can use chatter to provide any changed information or update but issue itself cannot be changed
- Users can only view their own issues
  - This only works if default sharing settings for Issue object is Private
  - If default sharing setting is set to Public Read Only or Public Read-Write then users can view ALL issues
- Becasue CRUD/FLS checks are enforce, if a user doesn't have access to any field on Issue List component then Apex will error out and no data is displayed    
- Issue List component is paginated and only 10 records per page are listed; this is controlled in Apex for performance
- Issues are sorted by Issue Name (Auto Number) in descending order so latest issues will show up on top


## Support

In case of errors/bugs, please create a GitHub issue at https://github.com/SalesforceLabs/IssueBox/issues 