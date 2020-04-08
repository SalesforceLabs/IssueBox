@isTest
public with sharing class IssueBoxTest {
    private static void createTestData(Integer numberRecords){
        List<Issue__c> issueList = new List<Issue__c>();
        for(Integer i=0; i< numberRecords; i++){
            Issue__c issue = new Issue__c();
            issue.Details__c = 'Issue #' + i;
            issue.URL__c = 'http://www.test.com';
            issueList.add(issue);
        }
        insert issueList;
    }
    private static User setupUser(String profileName){
        // Create a unique UserName
        String uniqueUserName = 'standarduser' + DateTime.now().getTime() + '@testorg.com';
        // This code runs as the system user
        Profile p = [SELECT Id FROM Profile WHERE Name=:profileName];
        User u = new User(Alias = 'standt', Email='standarduser@issuebox.app',
                          EmailEncodingKey='UTF-8', LastName='Testing', LanguageLocaleKey='en_US',
                          LocaleSidKey='en_US', ProfileId = p.Id,
                          TimeZoneSidKey='America/Los_Angeles', UserName=uniqueUserName);
        System.debug(u);
        insert u;
        return u;
    }
    private static void assignPermissionSet(String permSetName, Id userId){
        PermissionSet ps = [select id, name from PermissionSet where name=:permSetName];
        // Given mocked Permission Set assigned to user for test
        PermissionSetAssignment psa = new PermissionSetAssignment(
            AssigneeId = userId,
            PermissionSetId = ps.Id
        );
        insert psa;
    }
    
    @isTest 
    static void issueBox_getIssueCount_Test_runAs_negative(){
        User u = setupUser('Standard User');
        //No permission set assignment as we want to raise exception
        //assignPermissionSet('IssueBox_User', u.Id);

        System.runAs(u) {
            try{
            	createTestData(10);
            }Catch(Exception e){
                //Because user doens't have permission set assigned, user cannot even create records
                System.assertEquals(0, [select count() from Issue__c]);
            } 

            //This should fail becasue we didn't assign permission set
            //Need to run this outside of try so we can trigger exception in IssueBox and also for code coverage
            System.assertEquals(0, IssueBox.getIssueCount());
        }
    }
    
    @isTest
    //Test to make sure issue Count is returned properly
    private static void issueBox_getIssueList_Test_runAs_negative() {
        User u = setupUser('Standard User');
        //No permission set assignment as we want to raise exception
        //assignPermissionSet('IssueBox_User', u.Id);

        System.runAs(u) {
            try{
                createTestData(10);
            }Catch(Exception e){
                //Because user doens't have permission set assigned, user cannot even create records
                System.assertEquals(0, [select count() from Issue__c]);
            }
            
            List<Issue__c> issueList = IssueBox.getIssueList(1, 10, 10);
            //Need to run this outside of try so we can trigger exception in IssueBox and also for code coverage
            //Because no permission set is assigned, this should fail
            System.assertEquals(0, issueList.size());
        }
    }
    
    @isTest
    //Test to make sure issue Count is returned properly
    private static void issueBox_getIssueList_Test_runAs() {
        User u = setupUser('Standard User');
        assignPermissionSet('IssueBox_User', u.Id);

        System.runAs(u) {
            createTestData(10);
            List<Issue__c> issueList = IssueBox.getIssueList(1, 10, 10);
            
            System.assertEquals(10, issueList.size());
            //Issues are sorted in descending order based on Issue Number (auto number) so last issue inserted will show up first
            System.assertEquals('Issue #9', issueList[0].Details__c);
            //Checking trigger coverage, Protocol from URL is removed in trigger and replaced with "/"
            System.assertEquals('/www.test.com', issueList[0].URL__c);
            
            
            createTestData(5);
            //Even though we requested 10 issues, it's second page. Becasue there are total 15 records, it will only return 5
            issueList = IssueBox.getIssueList(2, 10, 20);
            System.assertEquals(5, issueList.size());
            System.assertEquals('Issue #4', issueList[0].Details__c);
        }
    }
    @isTest
    //Test to make sure issue Count is returned properly
    private static void issueBox_getIssueList_Test() {
        User u = setupUser('System Administrator');
        assignPermissionSet('IssueBox_Admin', u.Id);
        System.runAs(u){
            createTestData(10);
            List<Issue__c> issueList = IssueBox.getIssueList(1, 10, 10);
            
            System.assertEquals(10, issueList.size());
            //Issues are sorted in descending order based on Issue Number (auto number) so last issue inserted will show up first
            System.assertEquals('Issue #9', issueList[0].Details__c);
            //Checking trigger coverage, Protocol from URL is removed in trigger and replaced with "/"
            System.assertEquals('/www.test.com', issueList[0].URL__c);
            
            
            createTestData(5);
            //Even though we requested 10 issues, it's second page. Becasue there are total 15 records, it will only return 5
            issueList = IssueBox.getIssueList(2, 10, 20);
            System.assertEquals(5, issueList.size());
            System.assertEquals('Issue #4', issueList[0].Details__c);
        }
    }
    
    
    @isTest static void issueBox_getIssueCount_Test_runAs(){
        User u = setupUser('Standard User');
        assignPermissionSet('IssueBox_User', u.Id);

        System.runAs(u) {
            createTestData(10);
            System.assertEquals(10, IssueBox.getIssueCount());
            
            createTestData(10);
            System.assertEquals(20, IssueBox.getIssueCount());
        }
    }
    
    @isTest
    //Test to make sure issue Count is returned properly
    private static void issueBox_getIssueCount_Test_positive() {
        User u = setupUser('System Administrator');
        assignPermissionSet('IssueBox_Admin', u.Id);
        System.runAs(u){
            createTestData(10);
            System.assertEquals(10, IssueBox.getIssueCount());
            
            createTestData(10);
            System.assertEquals(20, IssueBox.getIssueCount());
        }
    }
/**/
}