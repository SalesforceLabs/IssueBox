public with sharing class IssueBox {
     @AuraEnabled (cacheable = true)
    /**
     * Return list of issues; result will be paginated so records will be sent based on calculation of pageNumber and pageSize
     * totalrecords is NOT used but we pass it so we can refresh Wire method on lwc size when this changes
     * 
     * This method is cached because it's used in wire
     */
    public static List<Issue__c> getIssueList(Integer pageNumber, Integer pageSize, Integer totalrecords) {
        List<Issue__c> issueList = new List<Issue__c>(); 

        try{
            Integer offset = (pageSize * (pageNumber - 1));
            issueList = [SELECT 
                    ID, Name, Details__c, Email_Notification__c, Expected_Result__c, Priority__c, Reported_Object__c,
                    Reported_Record__c, Repro_Steps__c, Status__c, Type__c, URL__c, Assigned_To__c, Assigned_To__r.Name
                    FROM Issue__c WITH SECURITY_ENFORCED
                    ORDER BY Name DESC
                    limit :pageSize OFFSET :offset
                ];
        }catch(Exception e){ Util.log('IssueBox:getIssueList():Exception' + e.getMessage());}
        return issueList;
    }
	/**
	 * Return total issue records
	 * This count will be used for pagination
     * 
     * This method is cached because it's used in wire
	 */
    @AuraEnabled (cacheable = true)
    public static Integer getIssueCount() {  
        Integer count = 0;
        try{
            count = [SELECT count()  FROM Issue__c WITH SECURITY_ENFORCED];
        }catch(Exception e){ Util.log('IssueBox:getIssueList():Exception' + e.getMessage());}
        return count; 
    } 
}