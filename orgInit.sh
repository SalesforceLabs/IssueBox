sfdx force:org:create -f config/project-scratch-def.json  -d 30 -a IssueBoxScratchOrg -s

sfdx force:source:push

sfdx force:user:permset:assign -n  IssueBox_Admin

sfdx force:apex:execute -f config/create-demo-data.apex

sfdx force:data:tree:import --plan data/issuebox-Issue__c-plan.json

sfdx force:org:open

#sfdx force:lightning:lwc:start 

#sfdx force:data:tree:export --query \
#    "SELECT Details__c,Actual_Result__c,Email_Notification__c,Expected_Result__c,Priority__c,Reported_Object__c,Reported_Record__c, Repro_Steps__c,Status__c,Type__c from Issue__c " \
#     --prefix issuebox --outputdir data --plan

