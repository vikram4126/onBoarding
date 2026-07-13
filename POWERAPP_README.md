# OnBoarding Portal — Complete Power Apps Build Guide
### Prototype → Production Implementation

> This document maps every feature of the OnBoarding Portal to its exact Power Apps/SharePoint equivalent, with column names, Power Fx formulas, and Power Automate flow steps.

---

## TABLE OF CONTENTS
1. [Project Overview](#1-project-overview)
2. [SharePoint Lists Setup](#2-sharepoint-lists-setup)
3. [Power Apps — App Setup & RBAC](#3-power-apps--app-setup--rbac)
4. [Screen-by-Screen Build Guide](#4-screen-by-screen-build-guide)
   - [Manager Dashboard](#screen-manager-dashboard)
   - [New Joiner View](#screen-new-joiner-view)
   - [Buddy Dashboard](#screen-buddy-dashboard)
   - [Leadership View](#screen-leadership-view)
5. [Power Automate Flows](#5-power-automate-flows)
   - [Flow 1: Auto-Assign Tasks to New Joiner](#flow-1-auto-assign-tasks-to-new-joiner)
   - [Flow 2: Comment Email Alert](#flow-2-comment-email-alert)
   - [Flow 3: Missed Deadline Alert (Scheduled)](#flow-3-missed-deadline-alert-scheduled)
6. [Complete Formula Reference](#6-complete-formula-reference)

---

## 1. PROJECT OVERVIEW

### What we are building
An enterprise portal for New Joiner Onboarding where:
- No manual login is required (auto-detects role via SharePoint/Active Directory).
- Managers add new joiners and assign Buddies.
- New Joiners see tasks divided by Day 1, Week 1, Month 1, etc.
- Buddies, Managers, and Leaders track real-time progress.
- Automated emails trigger for new comments and missed task deadlines.

---

## 2. SHAREPOINT LISTS SETUP

> Create these lists in your SharePoint Site **before** opening Power Apps.

### LIST 1: `Onboarding_Users`
**Purpose:** Stores all New Joiners, Buddies, and Managers to drive Role-Based Access.

| Column Name | SharePoint Type | Required | Notes |
|---|---|---|---|
| **Title** | Single line text | ✅ | Employee Name |
| **Email** | Single line text | ✅ | Employee Email (used for auto-login) |
| **Role** | Choice | ✅ | New Joiner, Buddy, Manager, Leader |
| **Department**| Choice | ✅ | e.g., IT, HR, Sales, Finance |
| **ManagerEmail** | Single line text | ✅ | Manager's Email |
| **BuddyEmail** | Single line text | ❌ | Buddy's Email |
| **JoiningDate** | Date and Time | ✅ | Used to calculate deadlines |

### LIST 2: `Onboarding_MasterTasks`
**Purpose:** Template of all tasks that a new joiner needs to complete. Managers can update these to keep links and guides fresh.

| Column Name | SharePoint Type | Required | Notes |
|---|---|---|---|
| **Title** | Single line text | ✅ | Task Name (e.g., "Setup IT Assets") |
| **Department**| Choice | ✅ | **Multi-select:** Tag multiple (e.g., IT, HR) or "All" |
| **Timeline** | Choice | ✅ | Day 1, Week 1, Month 1 |
| **Description** | Multiple lines text| ❌ | Instructions for the task |
| **PortalLink** | Hyperlink | ❌ | Link to company portal/system |
| **GuideImageURL** | Single line text | ❌ | Link to guide popup image/screenshot |
| **ProjectCode** | Single line text | ❌ | Relevant project code (if any) |
| **ContactHR** | Person or Group | ❌ | Contact person (e.g., HR) |

### LIST 3: `Onboarding_UserTasks`
**Purpose:** Actual tasks assigned to the specific New Joiner. Created automatically by a Flow.

| Column Name | SharePoint Type | Required | Notes |
|---|---|---|---|
| **Title** | Single line text | ✅ | Task Name |
| **JoinerEmail** | Single line text | ✅ | Email of the New Joiner |
| **Timeline** | Choice | ✅ | Day 1, Week 1, Month 1 |
| **Status** | Choice | ✅ | Pending, In Progress, Completed |
| **Deadline** | Date and Time | ✅ | Calculated target date |
| **PortalLink** | Hyperlink | ❌ | Copied from Master Task |
| **GuideImageURL** | Single line text | ❌ | Copied from Master Task |
| **ProjectCode** | Single line text | ❌ | Copied from Master Task |
| **ContactHR** | Person or Group | ❌ | Copied from Master Task |
| **LatestComment**| Multiple lines text| ❌ | Comments added by user |
| **CommentUpdates**| Multiple lines text| ❌ | Append-only log of all comments |

### LIST 4: `Onboarding_PortalLinks`
**Purpose:** Stores global company portal links shown in the left sidebar. Managed by Managers.

| Column Name | SharePoint Type | Required | Notes |
|---|---|---|---|
| **Title** | Single line text | ✅ | Link Name (e.g., "HR Portal") |
| **URL** | Hyperlink | ✅ | The actual web URL |
| **IconName** | Single line text | ❌ | Name of the icon or image |
| **IsActive** | Yes/No | ✅ | Default: Yes (To show/hide links easily) |

---

## 3. POWER APPS — APP SETUP & RBAC

### Step 1: Create App & Connect Data
1. Create a Canvas App (Tablet Layout) named `OnBoarding Portal`.
2. Connect to SharePoint and add the 3 lists above.

### Step 2: Auto-Login & Role Detection (App.OnStart)
```powerapps-dot
// 1. Get Current User's Email
Set(varUserEmail, User().Email);

// 2. Lookup the user's role in the Onboarding_Users list
Set(varUserDetails, LookUp(Onboarding_Users, Email = varUserEmail));

// 3. Define the Role Variable
Set(varUserRole, If(IsBlank(varUserDetails), "Guest", varUserDetails.Role.Value));

// 4. Auto-Navigate based on Role
If(
    varUserRole = "New Joiner", Navigate(ScreenNewJoiner),
    varUserRole = "Buddy", Navigate(ScreenBuddy),
    varUserRole = "Manager", Navigate(ScreenManager),
    varUserRole = "Leader", Navigate(ScreenLeader),
    Navigate(ScreenAccessDenied)
);
```

---

## 4. SCREEN-BY-SCREEN BUILD GUIDE

### SCREEN: Left Navigation Bar (Sidebar Component)
**Purpose:** Shown on the left side for all users, containing Company Portal links.
- **Gallery (`galSidebarLinks`):**
  ```powerapps-dot
  // Connects to the Onboarding_PortalLinks list so managers can manage links directly from SharePoint
  Items = Filter(Onboarding_PortalLinks, IsActive = true)
  ```
  - **Inside Gallery:**
    - **Label (`lblLinkName`):** `ThisItem.Title`
    - **OnSelect for Link Item:** `Launch(ThisItem.URL)`

### SCREEN: Manager Dashboard
**Purpose:** Manager adds new joiners, assigns their buddies, and updates task templates (guides, links).

#### 1. Add New Joiner Form (`frmAddJoiner`)
- **DataSource:** `Onboarding_Users`
- **Fields to show:** Title (Name), Email, Role (Set Default to "New Joiner"), Department, ManagerEmail (Set Default to `varUserEmail`), BuddyEmail, JoiningDate.
- **Submit Button OnSelect:**
  ```powerapps-dot
  SubmitForm(frmAddJoiner);
  Notify("New Joiner Added! Background Flow will auto-assign tasks shortly.", NotificationType.Success);
  ```

#### 2. Manage Master Tasks (`galMasterTasks`)
- **Gallery Items:** `Onboarding_MasterTasks`
- **Action:** Manager can click an edit icon to open a form (`frmEditMasterTask`) to update the Portal Links, Guide Images, Project Codes, and HR Contacts for future joiners.
- **Gallery (`galMyTeam`):** Shows joiners under this manager.
  ```powerapps-dot
  Items = Filter(Onboarding_Users, ManagerEmail = varUserEmail)
  ```

### SCREEN: New Joiner View (Accordion Layout)
**Purpose:** Joiner sees tasks grouped by timeline (Day 1, Week 1) using an expandable Accordion.

#### 1. Outer Gallery (`galTimelines`) - The Accordion Headers
- **Items:** `["Day 1", "Week 1", "Month 1"]`
- **Inside Outer Gallery:**
  - **Label (`lblTimelineName`):** `ThisItem.Value` (e.g., "Day 1")
  - **Expand/Collapse Icon:** `If(locExpandedTimeline = ThisItem.Value, Icon.ChevronUp, Icon.ChevronDown)`
  - **OnSelect (Header/Icon):** 
    ```powerapps-dot
    UpdateContext({locExpandedTimeline: If(locExpandedTimeline = ThisItem.Value, Blank(), ThisItem.Value)})
    ```

#### 2. Inner Gallery (`galTasks`) - The Actual Tasks (Placed INSIDE `galTimelines`)
- **Visible Property:** `locExpandedTimeline = ThisItem.Value` (Shows tasks only when section is expanded)
- **Items:**
  ```powerapps-dot
  Filter(Onboarding_UserTasks, JoinerEmail = varUserEmail, Timeline.Value = ThisItem.Value)
  ```

#### 3. Task Completion (Green Check Sign) inside `galTasks`
Instead of a simple checkbox, use a modern Icon (`Icon.CheckBadge`).
- **Icon Property:** `If(ThisItem.Status.Value = "Completed", Icon.CheckBadge, Icon.Circle)`
- **Color Property:** `If(ThisItem.Status.Value = "Completed", RGBA(0,184,148,1) /*Green*/, RGBA(150,150,150,1) /*Gray*/)`
- **OnSelect (Toggle status & update SharePoint):**
  ```powerapps-dot
  If(
      ThisItem.Status.Value = "Completed",
      Patch(Onboarding_UserTasks, ThisItem, {Status: {Value: "Pending"}}),
      Patch(Onboarding_UserTasks, ThisItem, {Status: {Value: "Completed"}})
  )
  ```

- **Comment Button -> Opens Pop-up:**
  ```powerapps-dot
  // Save Comment Formula
  Patch(Onboarding_UserTasks, varSelectedTask, {
      LatestComment: txtComment.Text
  });
  // Note: Saving this will trigger the Email Flow to the Buddy!
  ```

### SCREEN: Buddy Dashboard (Master-Detail Layout)
**Purpose:** Buddy sees a list of their assigned joiners on the left, and clicks on one to see their specific task progress on the right.

#### 1. Left Panel (Joiner List)
- **Gallery (`galMyAssignedJoiners`):**
  ```powerapps-dot
  Items = Filter(Onboarding_Users, BuddyEmail = varUserEmail)
  ```
- **OnSelect (of Joiner card):**
  ```powerapps-dot
  UpdateContext({locSelectedJoiner: ThisItem})
  ```
- **Progress Bar (Inside Gallery):**
  ```powerapps-dot
  // Calculate overall completion % for this joiner
  Width = (CountRows(Filter(Onboarding_UserTasks, JoinerEmail = ThisItem.Email, Status.Value = "Completed")) / 
          CountRows(Filter(Onboarding_UserTasks, JoinerEmail = ThisItem.Email))) * Parent.Width
  ```

#### 2. Right Panel (Selected Joiner's Progress)
- **Visible Property (for the right container):** `!IsBlank(locSelectedJoiner)`
- **Header Label:** `"Tasks for " & locSelectedJoiner.Title`
- **Gallery (`galJoinerTasks`):**
  ```powerapps-dot
  // Shows all tasks for the joiner selected in the left panel
  Items = Filter(Onboarding_UserTasks, JoinerEmail = locSelectedJoiner.Email)
  ```
- **Task Status Indicator (Inside `galJoinerTasks`):**
  ```powerapps-dot
  Icon = If(ThisItem.Status.Value = "Completed", Icon.CheckBadge, Icon.Clock)
  Color = If(ThisItem.Status.Value = "Completed", RGBA(0,184,148,1) /*Green*/, RGBA(255,165,0,1) /*Orange*/)
  ```

### SCREEN: Leadership View (Executive Dashboard)
**Purpose:** High-level overview of the entire onboarding program across all departments.

#### 1. KPI Cards (Metrics)
- **Total Active New Joiners:**
  ```powerapps-dot
  Text(CountRows(Filter(Onboarding_Users, Role.Value = "New Joiner")))
  ```
- **Tasks Overdue (Company-wide):**
  ```powerapps-dot
  Text(CountRows(Filter(Onboarding_UserTasks, Status.Value <> "Completed", Deadline < Today())))
  ```
- **Completed Tasks:**
  ```powerapps-dot
  Text(CountRows(Filter(Onboarding_UserTasks, Status.Value = "Completed")))
  ```

#### 2. Master Progress Gallery (`galLeaderBoard`)
- **Items:** `Filter(Onboarding_Users, Role.Value = "New Joiner")`
- **Inside Gallery:**
  - **Joiner Name & Dept:** `ThisItem.Title & " (" & ThisItem.Department.Value & ")"`
  - **Manager & Buddy:** `"Mgr: " & ThisItem.ManagerEmail & " | Buddy: " & ThisItem.BuddyEmail`
  - **Overall Progress Bar:** 
    ```powerapps-dot
    Width = (CountRows(Filter(Onboarding_UserTasks, JoinerEmail = ThisItem.Email, Status.Value = "Completed")) / 
            CountRows(Filter(Onboarding_UserTasks, JoinerEmail = ThisItem.Email))) * Parent.Width
    ```
  - **Overdue Warning Icon (Visible Property):** Shows a red warning if this joiner has missed deadlines.
    ```powerapps-dot
    CountRows(Filter(Onboarding_UserTasks, JoinerEmail = ThisItem.Email, Status.Value <> "Completed", Deadline < Today())) > 0
    ```

---

## 5. POWER AUTOMATE FLOWS

### FLOW 1: Auto-Assign Tasks to New Joiner
**Trigger:** When an item is created in `Onboarding_Users`.

1. **Condition:** Check if `Role` equals "New Joiner".
2. **If Yes:** Get ALL items from `Onboarding_MasterTasks`.
3. **Filter Array:** Filter the Master Tasks list.
   - **Condition:** `string(item()?['Department'])` *contains* `@{triggerBody()?['Department/Value']}` 
   - **OR:** `string(item()?['Department'])` *contains* `'All'`
4. **Apply to each (Filtered Task):**
   - Create item in `Onboarding_UserTasks`.
   - Title: `CurrentItem.Title`
   - JoinerEmail: `TriggerBody.Email`
   - Timeline: `CurrentItem.Timeline`
   - PortalLink: `CurrentItem.PortalLink`
   - GuideImageURL: `CurrentItem.GuideImageURL`
   - ProjectCode: `CurrentItem.ProjectCode`
   - ContactHR (Claims): `CurrentItem.ContactHR/Claims`
   - Status: "Pending"
   - **Deadline Calculation:**
     - If Timeline = Day 1: `addDays(JoiningDate, 1)`
     - If Timeline = Week 1: `addDays(JoiningDate, 7)`
     - If Timeline = Month 1: `addDays(JoiningDate, 30)`

### FLOW 2: Comment Email Alert (As you suggested)
**Trigger:** When an item is modified in `Onboarding_UserTasks`.

1. **Condition:** Check if `LatestComment` has changed.
2. **Get Item:** Lookup the Joiner in `Onboarding_Users` to find the `BuddyEmail`.
3. **Send Email (V2):**
   - **To:** `BuddyEmail`
   - **Subject:** New Comment from `JoinerEmail` on task `Title`
   - **Body:** "The new joiner has added a comment to their task: '`LatestComment`'. Please log in to the portal to assist them."

### FLOW 3: Missed Deadline Alert (Scheduled)
**Trigger:** Scheduled - Runs every day at 8:00 AM.

1. **Get Items:** `Onboarding_UserTasks` where `Status` is NOT 'Completed' and `Deadline` is less than `utcNow()`.
2. **Apply to each (Overdue Task):**
   - Get Joiner details from `Onboarding_Users` to get `BuddyEmail`.
   - **Send Email (V2):**
     - **To:** `JoinerEmail`; `BuddyEmail`
     - **Subject:** OVERDUE: Onboarding Task - `Title`
     - **Body:** "This task was due on `Deadline`. Please complete it ASAP."

---

## 6. COMPLETE FORMULA REFERENCE

| Action | Formula |
|---|---|
| Auto-Login Check | `LookUp(Onboarding_Users, Email = User().Email)` |
| Filter Tasks | `Filter(Onboarding_UserTasks, JoinerEmail = User().Email)` |
| Mark Complete | `Patch(Onboarding_UserTasks, ThisItem, {Status: {Value: "Completed"}})` |
| Progress Math | `CountRows(Completed) / CountRows(AllTasks) * 100` |
| Add Comment | `Patch(Onboarding_UserTasks, ThisItem, {LatestComment: txtComment.Text})` |
