sfdx force:org:create -f config/project-scratch-def.json  -d 7 -a IssueBoxScratchOrg -s

sfdx force:source:push -u IssueBoxScratchOrg

sfdx force:user:permset:assign -n  IssueBox_Admin

sfdx force:org:open -u IssueBoxScratchOrg