public with sharing class IssueBox {
    @AuraEnabled
    public static List<Issue__c> getIssueList(Integer pagenumber, Integer pageSize) {
        List<Issue__c> issueList = new List<Issue__c>();

        try{
            Integer offset = (pageSize * (pagenumber - 1));
            issueList = [SELECT 
                    ID, Name, Details__c, Email_Notification__c, Expected_Result__c, Priority__c, Reported_Object__c,
                    Reported_Record__c, Repro_Steps__c, Status__c, Type__c, URL__c, Assigned_To__c, Assigned_To__r.Name
                    FROM Issue__c WITH SECURITY_ENFORCED
                    limit :pageSize OFFSET :offset
                ];
			System.debug(issueList);
        }catch(SFDCAccessControlException e){Util.log('IssueBox:getIssueList():SFDCAccessControlException' + e.getMessage());
        }catch(Exception e){ Util.log('IssueBox:getIssueList():Exception' + e.getMessage());}
        return issueList;
    }

    @AuraEnabled
    public static Integer getIssueCount() {  
        Integer count = 0;
        try{
            count = [SELECT count()  FROM Issue__c WITH SECURITY_ENFORCED];
        }catch(SFDCAccessControlException e){Util.log('IssueBox:getIssueList():SFDCAccessControlException' + e.getMessage());
        }catch(Exception e){ Util.log('IssueBox:getIssueList():Exception' + e.getMessage());}
        return count; 
    } 
}