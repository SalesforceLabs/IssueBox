#For Package Testing
sfdx force:org:create -f config/project-scratch-def.json  -d 3 -a IssueBoxScratchOrgPkg -s
#sfdx force:org:create -f config/project-scratch-def.json  -d 30 -a IssueBoxScratchOrgPkg -s -v LabsDevHub

#Test 2GP Package
#sfdx force:package:install -p  -u IssueBoxScratchOrgPkg -k test1234 -w 10 -b 10

#Test 1GP Package
sfdx force:package:install -p 04t3h0000010kW5  -w 10

sfdx force:user:permset:assign -n  issuebox__IssueBox_Admin

sfdx force:apex:execute -f config/create-demo-data.apex

sfdx force:data:tree:import --plan data/issuebox-Issue__c-plan.json

sfdx force:org:open 
