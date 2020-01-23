# CI
Repoet har benyttet seg av kontinuerlig intergrering
 igjennom utviklingprosessen. Dette har normalt vært et minstekrav for at en branch skal 
 kunne merge med master. Vi har benyttet oss av GitLabs innebygde 
 CI for disse testkjøringene.
 
 Hver gang en pipline skal kjøres oppretter CIen en virituell database 
 på sin respektive docker og kjører dokumentet _modelTest.js_.
 
 #Tester
 I _modelTest.js_ finnes følgende tester