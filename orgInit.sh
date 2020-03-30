#For Package Testing
sfdx force:org:create -f config/project-scratch-def.json  -d 30 -a IssueBoxScratchOrgPkg
#sfdx force:org:create -f config/project-scratch-def.json  -d 30 -a IssueBoxScratchOrgPkg -s -v LabsDevHub

sfdx force:package:install -p "Issue Box@0.1.0-3" -u IssueBoxScratchOrgPkg -k test1234 -w 10 -b 10

sfdx force:user:permset:assign -n  issuebox__IssueBox_Admin -u IssueBoxScratchOrgPkg

sfdx force:apex:execute -f config/create-demo-data.apex -u IssueBoxScratchOrgPkg

sfdx force:data:tree:import --plan data/issuebox-Issue__c-plan.json -u IssueBoxScratchOrgPkg

sfdx force:org:open -u IssueBoxScratchOrgPkg
