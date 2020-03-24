//Create unique name for user
String orgId = UserInfo.getOrganizationId();
String dateString = String.valueof(Datetime.now()).replace(' ','').replace(':','').replace('-','');
Integer randomInt = Integer.valueOf(math.rint(math.random()*1000000));
String uniqueName = randomInt + dateString + orgId;

Profile p = [Select Id from Profile where Name='Standard User'];

User u = new user();
u.LastName = 'User';
u.FirstName = 'Standard';
u.Email = UserInfo.getUserEmail();
u.Alias = uniqueName.substring(0,8);
u.Username = uniqueName + '@test.user';
u.CommunityNickname = uniqueName.substring(0,8);
u.LocaleSidKey = 'en_US';
u.TimeZoneSidKey = 'GMT';
u.ProfileID = p.Id;
u.LanguageLocaleKey = 'en_US';
u.EmailEncodingKey = 'UTF-8';
insert u;

//Assign IssueBox_Usre perm set to newly created user (it's not admin)
PermissionSet ps = [select id, name from PermissionSet where name='IssueBox_User'];
// Given mocked Permission Set assigned to user for test
PermissionSetAssignment psa = new PermissionSetAssignment(
    AssigneeId = u.Id,
    PermissionSetId = ps.Id
);
insert psa;