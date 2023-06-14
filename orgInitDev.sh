#For development and creating package
sfdx force:org:create -f config/project-scratch-def.json  -d 30 -a IssueBoxScratchOrg -s 
#-v LabsDevHub

sfdx force:source:push

sfdx force:user:permset:assign -n  IssueBox_Admin

sfdx  data tree import --plan data/issuebox-nonamespace-Issue__c-plan.json

sfdx apex run -f config/create-demo-data.apex 


sfdx force:org:open

#sfdx force:lightning:lwc:start 

#sfdx force:data:tree:export --query  "SELECT Details__c,Actual_Result__c,Email_Notification__c,Expected_Result__c,Priority__c,Reported_Object__c,Reported_Record__c, Repro_Steps__c,Status__c,Type__c from Issue__c " --prefix issuebox --outputdir data --plan

#Create package - ONE TIME - in Dev Hub
#sfdx force:package:create -n "Issue Box" -r force-app  -t Managed -v LabsDevHub
#sfdx force:package:create -n "Issue Box" -r force-app  -t Managed

#Create package - Version - in Dev Hub
#sfdx force:package:version:create -p "Issue Box" -k test1234 --wait 10 -v LabsDevHub -c -f config/project-scratch-def.json
#sfdx force:package:version:create -p "Issue Box" -k test1234 --wait 10 -c -f config/project-scratch-def.json
#sfdx force:package:version:create:list --createdlastdays 0 -v LabsDevHub


#INSTALL - in pkg test scratch org
#sfdx force:package:install -p "Issue Box@0.1.0-1" -u IssueBoxScratchOrgPkg -k test1234 -w 10 -b 10

#Deploy to Dev Org: Use -c to check only first
#If in MDAPI format
#sfdx force:source:deploy -p force-app/main/default -u IssueBoxDevOrg -w 100 
#If in SFDX format, comma separated list
#sfdx force:source:deploy -u IssueBoxDevOrg -p "force-app/main/default/"