# MAKNE -

* MAKNE is an all-in-one platform for managing collaborations among creators, brands and agencies.
* It's an AI‑powered intermediary execution platform that turns agreements into enforced outcomes through structured collaboration, acceptance, and payments.
* It is responsible for providing a platform to the brands to approach worthy creators for their content, for agencies to recruit creators so that they can act on their behalf, for creators to find and approach brands and agencies they can work with.
* This platform is designed such that it keeps things transparent, formalize commitments, coordinate execution, and release payments only when work is accepted — with a complete, auditable digital record.
* In short - Makne is:
  - A trust \& agreement platform
  - A collaboration execution engine
  - A conditional payment mediator
  - A system of record for commitments
* #### Features of MAKNE -  

1. ###### it has three types of roles - creator, brand and agencies.

|Creator|<br />\- the creator can create their complete account, include their work samples (portfolio), like awwwards profile.<br />- the creator can reach out to brands to sponsor them, and agencies to onboard them. <br />\- they are charged commission fee depending on the deals, by the platform.<br />|
|-|-|
|Agency|<br />\- an agency can reach out to brands on behalf of creators and manage creators as a whole.<br />- they can reach out to creators to onboard them in their agency.<br />- they negotiate on the behalf of creators and get brand deals for their creators.<br />- they are charged monthly or quarterly fee depending on the plan, by the platform.<br />|
|Brand|<br />\- a brand can sponsor a creator and pay them on milestone basis.<br />- they can contact an agency to provide their creators on contract basis.<br />- they are charged yearly fee by the platform.<br />|

###### 

2. Collaboration Modes -

|Individual Collaboration|<br />Brand ↔ Creator<br />Brand ↔ Agency ↔ Creator<br />|
|-|-|
|Group Collaboration|<br />Multiple creators either individually or from same or different agencies, under one agreement<br />Individual and joint deliverables<br />Group‑aware acceptance and blocking logic<br />|

###### 

3. Payments \& Milestones -

* Milestone‑based payments
* Deliverable‑linked release rules
* Group payout splits
* Logical escrow behavior (acceptance‑driven release)



###### 4\. Agentic AI Layer -

* Agreement Interpreter Agent
* Execution Monitor Agent
* Conflict Summary Agent
* Agents operate with bounded authority and act only within defined guardrails.



###### 5\. Audit \& Digital Record -

* Immutable event timeline
* Every action is logged
* Dispute‑ready execution history
* Human‑readable and machine‑verifiable



6\. Application workflow - 
- *Brand's perspective -* the brand first creates an agreement with all the information like meta, milestones, deliverables, due date, payment, payment mode, and terms and conditions (creators are optional at this moment). At this point the agreement is in draft state. As soon as the brand adds a creator (either individual, multiple or from an agency), the agreement is shared with the creator and is moved to the shared/negotiated state. The brand can see the details and timeline of an agreement. 
- *Agency's perspective* - the agency is only responsible for negotiation and management, they can see an agreement received by their creator but cannot interfere with it, they can only supervise events and timelines.
- *Creator's perspective* - the creator receives an agreement by a brand, goes through all the details and policy, payment and deadlines, then acts accordingly. The creator can accept (accepted state -> active state) or reject (rejected state) an agreement providing a valid reason for rejection. The creator delivers content based on deliverables assigned. On completion of a milestone, payments are released. When all the milestones are completed and payments are released, the agreement moves to the completed state.


###### 7\. Application Pages - 

* Landing - 
  - contains all the information about the application MAKNE, a premium looking UI along with the CTAs.
* Authentication -
  - the auth page is same for all the three roles - email, password, JWT, refresh tokens, password reset.  
* Onboarding -
  - after signup, User selects role. 
  - onboarding data for - 
  	1. brand - brand name, location, industry type, contact information.
  	2. agency - agency name, location, contact information, manager no., team size.
  	3. creator - niche, platforms, portfolio. 
* Authorization (Role-Based Access Control – RBAC)
* Dashboard - 
  1. Brand - a brand should be able to see all the agreements at one place, accepted agreements, and a create agreement button which opens a form asking details. When the brand clicks any agreement, all its details are visible along with the timeline and actions. If the brand didn't add any creator at the moment of agreement creation, they can add through the agreement details page itself, transforming the state of agreement from draft to shared or negotiated.
  2. Agency - an agency should be able to see all creators under it, any agreement received by its creators and any agreement accepted by its creators. The agency cannot manipulate state of agreement, they cannot accept or reject any agreement on behalf of creator, they can only view (read-only agreement details), they act as a middle-man between creator and brand.
  3. Creator - a creator is able to view all the agreements assigned to it, its details on clicking, remaining work and deadlines.
* Agreement List
* Agreement Creation - the agreement creation form has sub-pages - meta, creators (optional), deliverables, milestones, payments, policy and review, followed by a create agreement submission button.
* Agreement Workspace - the brand can accept or send the deliverable for review before acceptance. 
* Collaboration Board
* Deliverables View - the brand as well as creator can see what they have uploaded as deliverable.
* Payments \& Milestones - the payments are auto-released to the creator on completion of milestones. In case of agency based collab, the agency receives their share and the creator receives theirs.
* Activity \& Audit Timeline 
* Settings / Profile	 



------------------------------------------------------------------------------------------------------------------------------------------------------------



* Tech stack to be used - 
  Nextjs based tech stack with mongodb,
  nodemailer to be used for jwt, 
  vercel for deployment,
  tailwindcss for styling,
  framer motion for ui animations
  fully responsive application
