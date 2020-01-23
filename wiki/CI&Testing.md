# CI
Repoet har benyttet seg av kontinuerlig intergrering
 igjennom utviklingprosessen. Dette har normalt vært et minstekrav for at en branch skal 
 kunne merge med master. Vi har benyttet oss av GitLabs innebygde 
 CI for disse testkjøringene.
 
 Hver gang en pipline skal kjøres oppretter CIen en virituell database 
 på sin respektive docker og kjører dokumentet _modelTest.js_.
 
 #Tester
 I _modelTest.js_ finnes følgende tester:
 
**Login**
 
* _Login Fail on wrong password_

* _Login Success on correct password_

**Users**

* _create user_

* _update user success_

* _update user fail - id doesnt exist_

* _delete user_

* _correct data in users_

* _find user by email_

* _finds salt by email_

* _find user by ID_

* _finds user by email or username_

**Events**

* _create event_

* _finds events by organizerId_

* _finds event by eventId_

* _update event success_

* _update event fail_

* _cancels event_

* _delete Event_

* _correct data in events_

**Events - search**

* _search several results_

* _search one results_

* _search with no results_

**Personnel**

* _add personnel[] to event_

* _update personnel_

* _remove personnel_

* _correct data in personnel_

**Tickets**

* _create Ticket_

* _update Ticket_

* _remove Ticket_

* _correct data in tickets_

**Gigs**

* _create Gig_

* _correct data in gig_

* _add riderItem_

* _update riderItems_

* _correct riderItems_